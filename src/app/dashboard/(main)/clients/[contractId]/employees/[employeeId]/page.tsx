'use client'

import { useState, useMemo, useEffect } from 'react'
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import {
  ArrowLeft,
  ChevronRight,
  ShieldAlert,
  ClipboardCheck,
  GraduationCap,
  Syringe,
  HardHat,
  AlertTriangle,
  CalendarClock,
  FileText,
  Stethoscope,
  Loader2,
} from 'lucide-react'
import { Badge } from '@/components/ui/badge'
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar'
import { Separator } from '@/components/ui/separator'
import { useParams, useRouter } from 'next/navigation'
import Link from 'next/link'
import { cn } from '@/lib/utils'

import {
  useDoc,
  useCollection,
  useFirestore,
  useMemoFirebase,
} from '@/firebase'
import { doc, collection, getDocs, query, where } from 'firebase/firestore'

import type { Employee } from '../employees/data'
import type { Role } from '../roles/data'
import type { Sector } from '../sectors/data'
import type { Unit } from '../units/data'
import type { Environment } from '../../environments/data'
import type { Process } from '../../processes/data'
import type { EpiDelivery } from '../../epis/data'

function ClientSideDateFormatter({ dateString }: { dateString: string }) {
  const [formattedDate, setFormattedDate] = useState('')

  useEffect(() => {
    if (dateString) {
      const date = new Date(dateString)
      const timezoneOffset = date.getTimezoneOffset() * 60000
      const adjustedDate = new Date(date.getTime() + timezoneOffset)
      setFormattedDate(adjustedDate.toLocaleDateString('pt-BR'))
    }
  }, [dateString])

  return <>{formattedDate || '...'}</>
}

const getStatusBadgeVariant = (status: Employee['status']) => {
  switch (status) {
    case 'Ativo':
      return 'secondary'
    case 'Desligado':
      return 'destructive'
    case 'Férias':
      return 'outline'
    default:
      return 'default'
  }
}

export default function EmployeeDetailsPage() {
  const params = useParams()
  const router = useRouter()
  const contractId = params.contractId as string
  const employeeId = params.employeeId as string

  const firestore = useFirestore()

  const employeeRef = useMemoFirebase(
    () =>
      firestore
        ? doc(firestore, `clients/${contractId}/staffs`, employeeId)
        : null,
    [firestore, contractId, employeeId]
  )
  const allRolesRef = useMemoFirebase(
    () =>
      firestore ? collection(firestore, `clients/${contractId}/roles`) : null,
    [firestore, contractId]
  )
  const allUnitsRef = useMemoFirebase(
    () =>
      firestore ? collection(firestore, `clients/${contractId}/units`) : null,
    [firestore, contractId]
  )
  const allProcessesRef = useMemoFirebase(
    () =>
      firestore
        ? collection(firestore, `clients/${contractId}/processes`)
        : null,
    [firestore, contractId]
  )
  const epiDeliveriesQuery = useMemoFirebase(
    () =>
      firestore
        ? query(
            collection(firestore, `clients/${contractId}/epi_deliveries`),
            where('employeeId', '==', employeeId)
          )
        : null,
    [firestore, contractId, employeeId]
  )

  const { data: employee, isLoading: isEmployeeLoading } =
    useDoc<Employee>(employeeRef)
  const { data: allRoles, isLoading: areRolesLoading } =
    useCollection<Role>(allRolesRef)
  const { data: allUnits, isLoading: areUnitsLoading } =
    useCollection<Unit>(allUnitsRef)
  const { data: allProcesses, isLoading: areProcessesLoading } =
    useCollection<Process>(allProcessesRef)
  const { data: epiDeliveries, isLoading: areEpiDeliveriesLoading } =
    useCollection<EpiDelivery>(epiDeliveriesQuery)

  const [allSectors, setAllSectors] = useState<Sector[]>([])
  const [areSectorsLoading, setAreSectorsLoading] = useState(true)
  const [allEnvironments, setAllEnvironments] = useState<Environment[]>([])
  const [areEnvironmentsLoading, setAreEnvironmentsLoading] = useState(true)

  useEffect(() => {
    if (allUnits && firestore) {
      setAreSectorsLoading(true)
      setAreEnvironmentsLoading(true)
      const fetchSubCollections = async () => {
        try {
          // Fetch Sectors
          const sectorsPromises = allUnits.map((unit) =>
            getDocs(
              collection(
                firestore,
                `clients/${contractId}/units/${unit.id}/sectors`
              )
            )
          )
          const sectorsSnapshots = await Promise.all(sectorsPromises)
          const sectorsData = sectorsSnapshots.flatMap((snapshot) =>
            snapshot.docs.map(
              (doc) => ({ id: doc.id, ...doc.data() } as Sector)
            )
          )
          setAllSectors(sectorsData)

          // Fetch Environments
          if (sectorsData.length > 0) {
            const environmentsPromises = allUnits.flatMap((unit) =>
              sectorsData
                .filter((sector) => sector.unitId === unit.id)
                .map((sector) =>
                  getDocs(
                    collection(
                      firestore,
                      `clients/${contractId}/units/${unit.id}/sectors/${sector.id}/environments`
                    )
                  )
                )
            )
            const environmentsSnapshots = await Promise.all(
              environmentsPromises.flat()
            )
            const environmentsData = environmentsSnapshots.flatMap((snapshot) =>
              snapshot.docs.map(
                (doc) => ({ id: doc.id, ...doc.data() } as Environment)
              )
            )
            setAllEnvironments(environmentsData)
          } else {
            setAllEnvironments([])
          }
        } catch (error) {
          console.error('Error fetching sub-collections: ', error)
        } finally {
          setAreSectorsLoading(false)
          setAreEnvironmentsLoading(false)
        }
      }
      fetchSubCollections()
    } else {
      setAreSectorsLoading(false)
      setAreEnvironmentsLoading(false)
    }
  }, [allUnits, firestore, contractId])

  const episDeliveredCount = epiDeliveries?.length || 0

  const summaryIndicators = [
    {
      title: 'ASO',
      status: 'Em dia',
      variant: 'secondary',
      days: 'Vence em 280 dias',
    },
    {
      title: 'Treinamentos Obrigatórios',
      status: 'Em dia',
      variant: 'secondary',
      days: 'Todos concluídos',
    },
    {
      title: 'EPIs Essenciais',
      status: episDeliveredCount > 0 ? 'Em dia' : 'Atenção',
      variant: episDeliveredCount > 0 ? 'secondary' : 'destructive',
      days:
        episDeliveredCount > 0
          ? `${episDeliveredCount} itens entregues`
          : 'Nenhum item entregue',
    },
    {
      title: 'Vacinação',
      status: 'Em dia',
      variant: 'secondary',
      days: 'Nenhuma pendência',
    },
  ]

  const employeeDetails = useMemo(() => {
    if (
      !employee ||
      !allRoles ||
      !allSectors ||
      !allUnits ||
      !allEnvironments ||
      !allProcesses
    )
      return null

    const role = allRoles.find((r) => r.id === employee.roleId)
    if (!role)
      return {
        employee,
        role: null,
        sector: null,
        unit: null,
        mainWorkstation: null,
        processes: [],
      }

    const sector = allSectors.find((s) => s.id === role.sectorId)
    if (!sector)
      return {
        employee,
        role,
        sector: null,
        unit: null,
        mainWorkstation: null,
        processes: [],
      }

    const unit = allUnits.find((u) => u.id === sector.unitId)
    const mainWorkstation = role.mainWorkstationId
      ? allEnvironments.find((e) => e.id === role.mainWorkstationId)
      : null

    const processes = allProcesses.filter((p) =>
      p.steps.some((step) => step.sectorId === sector.id)
    )

    return { employee, role, sector, unit, mainWorkstation, processes }
  }, [employee, allRoles, allSectors, allUnits, allEnvironments, allProcesses])

  const isLoading =
    isEmployeeLoading ||
    areRolesLoading ||
    areSectorsLoading ||
    areUnitsLoading ||
    areEnvironmentsLoading ||
    areProcessesLoading ||
    areEpiDeliveriesLoading

  if (isLoading) {
    return (
      <div className='flex items-center justify-center h-full'>
        <Loader2 className='h-8 w-8 animate-spin text-primary' />
      </div>
    )
  }

  if (!employeeDetails || !employee) {
    return (
      <div className='flex flex-col items-center justify-center h-full text-center'>
        <h2 className='text-2xl font-bold'>Colaborador não encontrado</h2>
        <p className='text-muted-foreground'>
          O colaborador que você está procurando não existe ou os dados estão
          incompletos.
        </p>
        <Button asChild className='mt-4'>
          <Link href={`/dashboard/clients/${contractId}/employees`}>
            <ArrowLeft className='mr-2 h-4 w-4' />
            Voltar para Colaboradores
          </Link>
        </Button>
      </div>
    )
  }

  const { role, sector, unit, mainWorkstation, processes } = employeeDetails

  return (
    <div className='grid flex-1 auto-rows-max gap-4'>
      <div className='flex items-center gap-4'>
        <Button asChild variant='outline' size='icon' className='h-7 w-7'>
          <Link href={`/dashboard/clients/${contractId}/employees`}>
            <ArrowLeft className='h-4 w-4' />
            <span className='sr-only'>Voltar</span>
          </Link>
        </Button>
        <h1 className='flex-1 shrink-0 whitespace-nowrap text-xl font-semibold tracking-tight sm:grow-0'>
          {employee.name}
        </h1>
        <Badge
          variant={getStatusBadgeVariant(employee.status)}
          className='ml-auto sm:ml-0'
        >
          {employee.status}
        </Badge>
        <div className='hidden items-center gap-2 md:ml-auto md:flex'>
          <Button asChild variant='default'>
            <Link
              href={`/dashboard/clients/${contractId}/tickets?employee=${employee.id}`}
            >
              <Stethoscope className='mr-2 h-4 w-4' /> Solicitar Exame / ASO
            </Link>
          </Button>
        </div>
      </div>
      <div className='grid gap-4 md:grid-cols-[1fr_320px] lg:gap-8'>
        <div className='grid auto-rows-max items-start gap-4 lg:gap-8'>
          <Card>
            <CardHeader>
              <CardTitle>Dados Cadastrais</CardTitle>
            </CardHeader>
            <CardContent>
              <div className='grid gap-6'>
                <div className='flex items-center gap-4'>
                  <Avatar className='h-20 w-20'>
                    <AvatarImage src={employee.avatar} alt={employee.name} />
                    <AvatarFallback>
                      {employee.name
                        .split(' ')
                        .map((n) => n[0])
                        .join('')}
                    </AvatarFallback>
                  </Avatar>
                  <div>
                    <p className='font-bold text-xl'>{employee.name}</p>
                    <p className='text-sm text-muted-foreground'>
                      {employee.email}
                    </p>
                    <p className='text-sm text-muted-foreground'>
                      {employee.phone}
                    </p>
                  </div>
                </div>

                <Separator />

                <div className='grid grid-cols-2 gap-x-4 gap-y-6'>
                  <div className='space-y-1'>
                    <p className='text-sm font-medium text-muted-foreground'>
                      Data de Admissão
                    </p>
                    <p>
                      <ClientSideDateFormatter
                        dateString={employee.admissionDate}
                      />
                    </p>
                  </div>
                  <div className='space-y-1'>
                    <p className='text-sm font-medium text-muted-foreground'>
                      Status
                    </p>
                    <Badge variant={getStatusBadgeVariant(employee.status)}>
                      {employee.status}
                    </Badge>
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle>Informações sobre o Ambiente de Trabalho</CardTitle>
            </CardHeader>
            <CardContent className='grid gap-4'>
              <div className='grid grid-cols-2 gap-4'>
                <div className='space-y-1'>
                  <p className='text-sm font-medium text-muted-foreground'>
                    Unidade
                  </p>
                  <p>{unit?.name || 'N/A'}</p>
                </div>
                <div className='space-y-1'>
                  <p className='text-sm font-medium text-muted-foreground'>
                    Setor
                  </p>
                  <p>{sector?.name || 'N/A'}</p>
                </div>
                <div className='space-y-1'>
                  <p className='text-sm font-medium text-muted-foreground'>
                    Cargo
                  </p>
                  <p>{role?.name || 'N/A'}</p>
                </div>
                <div className='space-y-1'>
                  <p className='text-sm font-medium text-muted-foreground'>
                    Posto de Trabalho Principal
                  </p>
                  <p>{mainWorkstation?.name || 'N/A'}</p>
                </div>
              </div>
              <Separator />
              <div className='space-y-2'>
                <p className='text-sm font-medium text-muted-foreground'>
                  Atividades Desenvolvidas
                </p>
                <div className='flex flex-wrap gap-1'>
                  {role?.activities.map((activity: string) => (
                    <Badge key={activity} variant='outline'>
                      {activity}
                    </Badge>
                  ))}
                </div>
              </div>
              <Separator />
              <div className='space-y-2'>
                <p className='text-sm font-medium text-muted-foreground'>
                  Etapas/Processos Envolvidos
                </p>
                <div className='flex flex-wrap gap-1'>
                  {processes && processes.length > 0 ? (
                    processes.map((process: Process) => (
                      <Badge key={process.id} variant='secondary'>
                        {process.name}
                      </Badge>
                    ))
                  ) : (
                    <p className='text-xs text-muted-foreground'>
                      Nenhum processo principal associado a este setor.
                    </p>
                  )}
                </div>
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle>Documentos Obrigatórios</CardTitle>
            </CardHeader>
            <CardContent className='grid gap-2'>
              <Link
                href={`/dashboard/clients/${contractId}/asos`}
                className='flex items-center justify-between rounded-md p-3 bg-background hover:bg-accent transition-colors border'
              >
                <div className='flex items-center gap-3'>
                  <ClipboardCheck className='h-5 w-5 text-muted-foreground' />
                  <span className='font-medium'>Gestão de ASOs</span>
                </div>
                <ChevronRight className='h-5 w-5 text-muted-foreground' />
              </Link>
              <Link
                href={`/dashboard/clients/${contractId}/trainings`}
                className='flex items-center justify-between rounded-md p-3 bg-background hover:bg-accent transition-colors border'
              >
                <div className='flex items-center gap-3'>
                  <GraduationCap className='h-5 w-5 text-muted-foreground' />
                  <span className='font-medium'>
                    Registros de Treinamentos
                  </span>
                </div>
                <ChevronRight className='h-5 w-5 text-muted-foreground' />
              </Link>
              <Link
                href={`/dashboard/clients/${contractId}/epis`}
                className='flex items-center justify-between rounded-md p-3 bg-background hover:bg-accent transition-colors border'
              >
                <div className='flex items-center gap-3'>
                  <HardHat className='h-5 w-5 text-muted-foreground' />
                  <span className='font-medium'>Ficha de EPIs</span>
                </div>
                <ChevronRight className='h-5 w-5 text-muted-foreground' />
              </Link>
              <Link
                href={`/dashboard/clients/${contractId}/vaccines`}
                className='flex items-center justify-between rounded-md p-3 bg-background hover:bg-accent transition-colors border'
              >
                <div className='flex items-center gap-3'>
                  <Syringe className='h-5 w-5 text-muted-foreground' />
                  <span className='font-medium'>Registros de Vacinas</span>
                </div>
                <ChevronRight className='h-5 w-5 text-muted-foreground' />
              </Link>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle>Segurança do Trabalho</CardTitle>
            </CardHeader>
            <CardContent>
              <Button variant='outline' className='w-full'>
                <ShieldAlert className='mr-2 h-4 w-4' /> Ver Registros de
                Eventos e Acidentes
              </Button>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle>Documentos de Saúde</CardTitle>
            </CardHeader>
            <CardContent>
              <Button variant='secondary' className='w-full'>
                <FileText className='mr-2 h-4 w-4' /> Acessar Prontuário Médico
                Digital
              </Button>
            </CardContent>
          </Card>
        </div>

        <div className='grid auto-rows-max items-start gap-4 lg:gap-8'>
          <Card>
            <CardHeader>
              <CardTitle>Resumo e Alertas</CardTitle>
            </CardHeader>
            <CardContent className='grid gap-4'>
              {summaryIndicators.map((indicator) => (
                <div key={indicator.title} className='p-3 border rounded-lg'>
                  <div className='flex items-center justify-between'>
                    <span className='text-sm font-medium'>
                      {indicator.title}
                    </span>
                    <Badge variant={indicator.variant as any}>
                      {indicator.status}
                    </Badge>
                  </div>
                  <p className='text-xs text-muted-foreground pt-1'>
                    {indicator.days}
                  </p>
                </div>
              ))}

              <Separator />

              <div className='space-y-3'>
                <h4 className='font-medium'>Próximos Agendamentos</h4>
                <div className='flex items-start gap-3 text-sm'>
                  <CalendarClock className='h-5 w-5 text-muted-foreground mt-0.5' />
                  <div>
                    <p className='font-medium'>Exame Periódico</p>
                    <p className='text-muted-foreground'>
                      Agendado para: 15/08/2024
                    </p>
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  )
}
