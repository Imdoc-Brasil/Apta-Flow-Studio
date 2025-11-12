'use client'

import { useState, useMemo, useEffect } from 'react'
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from '@/components/ui/card'
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table'
import { Badge } from '@/components/ui/badge'
import { Input } from '@/components/ui/input'
import { Search, Loader2 } from 'lucide-react'
import { useParams } from 'next/navigation'
import {
  useFirestore,
  useCollection,
  useMemoFirebase,
} from '@/firebase'
import { collection, query, orderBy, getDocs } from 'firebase/firestore'
import { differenceInDays, addYears, parseISO, isValid } from 'date-fns'

import type { Employee } from '../employees/data'
import type { Role } from '../roles/data'
import type { Sector } from '../sectors/data'
import type { Aso } from '../asos/page'
import { ClientSideDateFormatter } from '@/components/client-side-date-formatter'

interface PeriodicControlItem {
  employeeId: string
  employeeName: string
  roleName: string
  sectorName: string
  lastExamDate: string | null
  nextExamDate: string | null
  status: 'Em Dia' | 'Próximo ao Vencimento' | 'Vencido' | 'Nunca Realizado'
}

const getStatusInfo = (
  status: PeriodicControlItem['status']
): { variant: 'secondary' | 'default' | 'destructive' | 'outline'; label: string } => {
  switch (status) {
    case 'Em Dia':
      return { variant: 'secondary', label: 'Em Dia' }
    case 'Próximo ao Vencimento':
      return { variant: 'default', label: 'Próximo' }
    case 'Vencido':
      return { variant: 'destructive', label: 'Vencido' }
    case 'Nunca Realizado':
      return { variant: 'outline', label: 'Nunca Realizado' }
  }
}

export default function PeriodicControlPage() {
  const params = useParams()
  const contractId = params.contractId as string
  const firestore = useFirestore()

  const [searchTerm, setSearchTerm] = useState('')

  const employeesRef = useMemoFirebase(() => (firestore ? collection(firestore, `clients/${contractId}/staffs`) : null), [firestore, contractId])
  const rolesRef = useMemoFirebase(() => (firestore ? collection(firestore, `clients/${contractId}/roles`) : null), [firestore, contractId])
  const asosRef = useMemoFirebase(() => (firestore ? collection(firestore, `clients/${contractId}/asos`) : null), [firestore, contractId])
  
  const [allSectors, setAllSectors] = useState<Sector[]>([])
  const [areSectorsLoading, setAreSectorsLoading] = useState(true);

  const { data: employees, isLoading: areEmployeesLoading } = useCollection<Employee>(employeesRef)
  const { data: roles, isLoading: areRolesLoading } = useCollection<Role>(rolesRef)
  const { data: asos, isLoading: areAsosLoading } = useCollection<Aso>(asosRef)

  // This is a bit complex because sectors are nested under units. We have to fetch all of them.
  useEffect(() => {
    if (!firestore) return;
    const fetchAllSectors = async () => {
      setAreSectorsLoading(true);
      try {
        const unitsQuery = query(collection(firestore, `clients/${contractId}/units`));
        const unitsSnapshot = await getDocs(unitsQuery);
        const sectorsPromises = unitsSnapshot.docs.map(unitDoc => 
          getDocs(collection(firestore, `clients/${contractId}/units/${unitDoc.id}/sectors`))
        );
        const sectorsSnapshots = await Promise.all(sectorsPromises);
        const sectorsData = sectorsSnapshots.flatMap(snapshot =>
          snapshot.docs.map(doc => ({ id: doc.id, ...doc.data() } as Sector))
        );
        setAllSectors(sectorsData);
      } catch (error) {
        console.error("Error fetching sectors for periodic control:", error);
      } finally {
        setAreSectorsLoading(false);
      }
    };
    fetchAllSectors();
  }, [firestore, contractId]);


  const periodicData = useMemo<PeriodicControlItem[]>(() => {
    if (!employees || !roles || !asos || areSectorsLoading) return []

    return employees
      .filter(emp => emp.status === 'Ativo')
      .map((employee) => {
        const role = roles.find((r) => r.id === employee.roleId)
        const sector = role ? allSectors.find((s) => s.id === role.sectorId) : undefined
        
        const employeeAsos = asos
          .filter((aso) => aso.employee === employee.name && aso.type === 'Avaliação Periódica')
          .sort((a, b) => new Date(b.issueDate).getTime() - new Date(a.issueDate).getTime())

        const lastAso = employeeAsos[0]
        
        let status: PeriodicControlItem['status'] = 'Nunca Realizado'
        let nextExamDate: Date | null = null

        if (lastAso && isValid(parseISO(lastAso.issueDate))) {
          const lastDate = parseISO(lastAso.issueDate)
          nextExamDate = addYears(lastDate, 1)
          const daysUntilNext = differenceInDays(nextExamDate, new Date())

          if (daysUntilNext < 0) {
            status = 'Vencido'
          } else if (daysUntilNext <= 30) {
            status = 'Próximo ao Vencimento'
          } else {
            status = 'Em Dia'
          }
        }
        
        return {
          employeeId: employee.id,
          employeeName: employee.name,
          roleName: role?.name || 'N/A',
          sectorName: sector?.name || 'N/A',
          lastExamDate: lastAso ? lastAso.issueDate : null,
          nextExamDate: nextExamDate ? nextExamDate.toISOString() : null,
          status,
        }
      })
  }, [employees, roles, asos, allSectors, areSectorsLoading])

  const filteredData = useMemo(() => {
    if (!searchTerm) return periodicData
    return periodicData.filter(
      (item) =>
        item.employeeName.toLowerCase().includes(searchTerm.toLowerCase()) ||
        item.roleName.toLowerCase().includes(searchTerm.toLowerCase()) ||
        item.sectorName.toLowerCase().includes(searchTerm.toLowerCase())
    )
  }, [periodicData, searchTerm])
  
  const isLoading = areEmployeesLoading || areRolesLoading || areAsosLoading || areSectorsLoading;

  return (
    <Card>
      <CardHeader>
        <CardTitle>Controle de Exames Periódicos</CardTitle>
        <CardDescription>
          Acompanhe o vencimento dos exames periódicos de cada colaborador.
        </CardDescription>
        <div className='pt-4'>
          <div className='relative w-full max-w-md'>
            <Search className='absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground' />
            <Input
              placeholder='Buscar por colaborador, cargo ou setor...'
              className='pl-8'
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
            />
          </div>
        </div>
      </CardHeader>
      <CardContent>
        {isLoading ? (
          <div className='flex items-center justify-center h-64'>
            <Loader2 className='h-8 w-8 animate-spin' />
          </div>
        ) : (
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Colaborador</TableHead>
                <TableHead>Cargo / Setor</TableHead>
                <TableHead>Último Exame</TableHead>
                <TableHead>Próximo Vencimento</TableHead>
                <TableHead>Status</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {filteredData.map((item) => (
                <TableRow key={item.employeeId}>
                  <TableCell className='font-medium'>{item.employeeName}</TableCell>
                  <TableCell>
                    <div className='font-medium'>{item.roleName}</div>
                    <div className='text-xs text-muted-foreground'>{item.sectorName}</div>
                  </TableCell>
                  <TableCell>
                    {item.lastExamDate ? <ClientSideDateFormatter dateString={item.lastExamDate} /> : 'N/A'}
                  </TableCell>
                   <TableCell>
                    {item.nextExamDate ? <ClientSideDateFormatter dateString={item.nextExamDate} /> : 'N/A'}
                  </TableCell>
                  <TableCell>
                    <Badge variant={getStatusInfo(item.status).variant}>
                      {getStatusInfo(item.status).label}
                    </Badge>
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        )}
      </CardContent>
    </Card>
  )
}
