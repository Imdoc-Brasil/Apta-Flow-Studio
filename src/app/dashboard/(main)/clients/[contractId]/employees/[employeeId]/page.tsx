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
import { ArrowLeft } from 'lucide-react'
import { Badge } from '@/components/ui/badge'
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar'
import { Separator } from '@/components/ui/separator'
import { useParams, useRouter } from 'next/navigation'
import Link from 'next/link'

import { initialEmployeesData, type Employee } from '../data'
import { initialRolesData } from '../../roles/data'
import { initialSectorsData } from '../../sectors/data'
import { initialUnitsData } from '../../units/data'
import { initialEnvironmentsData } from '../../environments/data'

function getEmployeeById(employeeId: string) {
  return initialEmployeesData.find((e) => e.id === employeeId)
}

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

  const employeeData = useMemo(() => getEmployeeById(employeeId), [employeeId])

  const employeeDetails = useMemo(() => {
    if (!employeeData) return null

    const role = initialRolesData.find((r) => r.id === employeeData.roleId)
    if (!role) return { employee: employeeData, role: null, sector: null, unit: null }

    const sector = initialSectorsData.find((s) => s.id === role.sectorId)
    if (!sector) return { employee: employeeData, role, sector: null, unit: null }

    const unit = initialUnitsData.find((u) => u.id === sector.unitId)
    const mainWorkstation = role.mainWorkstationId
      ? initialEnvironmentsData.find((e) => e.id === role.mainWorkstationId)
      : null

    return { employee: employeeData, role, sector, unit, mainWorkstation }
  }, [employeeData])

  if (!employeeDetails) {
    return (
      <div className='flex flex-col items-center justify-center h-full text-center'>
        <h2 className='text-2xl font-bold'>Colaborador não encontrado</h2>
        <p className='text-muted-foreground'>
          O colaborador que você está procurando não existe.
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

  const { employee, role, sector, unit, mainWorkstation } = employeeDetails

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
      </div>
      <Card>
        <CardHeader>
          <CardTitle>Detalhes do Colaborador</CardTitle>
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
                <p className='text-sm text-muted-foreground'>{employee.phone}</p>
              </div>
            </div>

            <Separator />

            <div className='grid grid-cols-2 gap-x-4 gap-y-6'>
              <div className='space-y-1'>
                <p className='text-sm font-medium text-muted-foreground'>
                  Cargo
                </p>
                <p>{role?.name || 'N/A'}</p>
              </div>
              <div className='space-y-1'>
                <p className='text-sm font-medium text-muted-foreground'>
                  Setor
                </p>
                <p>{sector?.name || 'N/A'}</p>
              </div>
              <div className='space-y-1'>
                <p className='text-sm font-medium text-muted-foreground'>
                  Unidade
                </p>
                <p>{unit?.name || 'N/A'}</p>
              </div>
              <div className='space-y-1'>
                <p className='text-sm font-medium text-muted-foreground'>
                  Posto de Trabalho Principal
                </p>
                <p>{mainWorkstation?.name || 'N/A'}</p>
              </div>
              <div className='space-y-1'>
                <p className='text-sm font-medium text-muted-foreground'>
                  Status
                </p>
                <Badge variant={getStatusBadgeVariant(employee.status)}>
                  {employee.status}
                </Badge>
              </div>
              <div className='space-y-1'>
                <p className='text-sm font-medium text-muted-foreground'>
                  Data de Admissão
                </p>
                <p>
                  <ClientSideDateFormatter dateString={employee.admissionDate} />
                </p>
              </div>
            </div>

            <Separator />

            {/* Future sections for EPIs, Exams, etc. can go here */}
            <div className='text-center text-sm text-muted-foreground pt-4'>
              Futuras informações de SST (EPIs, Exames) aparecerão aqui.
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  )
}
