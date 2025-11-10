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
} from 'lucide-react'
import { Badge } from '@/components/ui/badge'
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar'
import { Separator } from '@/components/ui/separator'
import { useParams, useRouter } from 'next/navigation'
import Link from 'next/link'
import { cn } from '@/lib/utils'

import { initialEmployeesData, type Employee } from '../data'
import { initialRolesData } from '../../roles/data'
import { initialSectorsData } from '../../sectors/data'
import { initialUnitsData } from '../../units/data'
import { initialEnvironmentsData } from '../../environments/data'
import { initialProcessesData } from '../../processes/data'
import { initialEpiDeliveries } from '../../epis/data'

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
  
  const episDeliveredCount = useMemo(() => {
    return initialEpiDeliveries.filter(d => d.employeeId === employeeId).length
  }, [employeeId])

  const summaryIndicators = [
    { title: 'ASO', status: 'Em dia', variant: 'secondary', days: 'Vence em 280 dias' },
    { title: 'Treinamentos Obrigatórios', status: 'Em dia', variant: 'secondary', days: 'Todos concluídos' },
    { title: 'EPIs Essenciais', status: episDeliveredCount > 0 ? 'Em dia' : 'Atenção', variant: episDeliveredCount > 0 ? 'secondary' : 'destructive', days: episDeliveredCount > 0 ? `${episDeliveredCount} itens entregues` : 'Nenhum item entregue' },
    { title: 'Vacinação', status: 'Em dia', variant: 'secondary', days: 'Nenhuma pendência' },
]


  const employeeDetails = useMemo(() => {
    if (!employeeData) return null

    const role = initialRolesData.find((r) => r.id === employeeData.roleId)
    if (!role)
      return {
        employee: employeeData,
        role: null,
        sector: null,
        unit: null,
        mainWorkstation: null,
        processes: [],
      }

    const sector = initialSectorsData.find((s) => s.id === role.sectorId)
    if (!sector)
      return {
        employee: employeeData,
        role,
        sector: null,
        unit: null,
        mainWorkstation: null,
        processes: [],
      }

    const unit = initialUnitsData.find((u) => u.id === sector.unitId)
    const mainWorkstation = role.mainWorkstationId
      ? initialEnvironmentsData.find((e) => e.id === role.mainWorkstationId)
      : null
      
    // Simplified logic: find processes where the primary sector matches the employee's sector
    const processes = initialProcessesData.filter(p => {
        const firstStep = p.steps[0];
        if (firstStep && firstStep.sectorId) {
            return firstStep.sectorId === sector.id;
        }
        return false;
    });

    return { employee: employeeData, role, sector, unit, mainWorkstation, processes }
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

  const { employee, role, sector, unit, mainWorkstation, processes } = employeeDetails

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
             <Link href={`/dashboard/clients/${contractId}/tickets?employee=${employee.id}`}>
                <Stethoscope className="mr-2 h-4 w-4" /> Solicitar Exame / ASO
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
                        <p className='text-sm font-medium text-muted-foreground'>Unidade</p>
                        <p>{unit?.name || 'N/A'}</p>
                    </div>
                     <div className='space-y-1'>
                        <p className='text-sm font-medium text-muted-foreground'>Setor</p>
                        <p>{sector?.name || 'N/A'}</p>
                    </div>
                     <div className='space-y-1'>
                        <p className='text-sm font-medium text-muted-foreground'>Cargo</p>
                        <p>{role?.name || 'N/A'}</p>
                    </div>
                    <div className='space-y-1'>
                        <p className='text-sm font-medium text-muted-foreground'>Posto de Trabalho Principal</p>
                        <p>{mainWorkstation?.name || 'N/A'}</p>
                    </div>
                </div>
                <Separator />
                <div className='space-y-2'>
                    <p className='text-sm font-medium text-muted-foreground'>Atividades Desenvolvidas</p>
                    <div className='flex flex-wrap gap-1'>
                        {role?.activities.map(activity => (
                            <Badge key={activity} variant="outline">{activity}</Badge>
                        ))}
                    </div>
                </div>
                <Separator />
                <div className='space-y-2'>
                    <p className='text-sm font-medium text-muted-foreground'>Etapas/Processos Envolvidos</p>
                    <div className='flex flex-wrap gap-1'>
                         {processes.length > 0 ? processes.map(process => (
                            <Badge key={process.id} variant="secondary">{process.name}</Badge>
                        )) : <p className='text-xs text-muted-foreground'>Nenhum processo principal associado a este setor.</p>}
                    </div>
                </div>
            </CardContent>
          </Card>
          
          <Card>
              <CardHeader>
                  <CardTitle>Documentos Obrigatórios</CardTitle>
              </CardHeader>
              <CardContent className="grid gap-2">
                 <Link href={`/dashboard/clients/${contractId}/asos`} className="flex items-center justify-between rounded-md p-3 bg-background hover:bg-accent transition-colors border">
                    <div className="flex items-center gap-3">
                        <ClipboardCheck className="h-5 w-5 text-muted-foreground" />
                        <span className="font-medium">Gestão de ASOs</span>
                    </div>
                    <ChevronRight className="h-5 w-5 text-muted-foreground" />
                 </Link>
                 <Link href={`/dashboard/clients/${contractId}/trainings`} className="flex items-center justify-between rounded-md p-3 bg-background hover:bg-accent transition-colors border">
                    <div className="flex items-center gap-3">
                        <GraduationCap className="h-5 w-5 text-muted-foreground" />
                        <span className="font-medium">Registros de Treinamentos</span>
                    </div>
                    <ChevronRight className="h-5 w-5 text-muted-foreground" />
                 </Link>
                 <Link href={`/dashboard/clients/${contractId}/epis`} className="flex items-center justify-between rounded-md p-3 bg-background hover:bg-accent transition-colors border">
                    <div className="flex items-center gap-3">
                        <HardHat className="h-5 w-5 text-muted-foreground" />
                        <span className="font-medium">Ficha de EPIs</span>
                    </div>
                    <ChevronRight className="h-5 w-5 text-muted-foreground" />
                 </Link>
                 <Link href={`/dashboard/clients/${contractId}/vaccines`} className="flex items-center justify-between rounded-md p-3 bg-background hover:bg-accent transition-colors border">
                    <div className="flex items-center gap-3">
                        <Syringe className="h-5 w-5 text-muted-foreground" />
                        <span className="font-medium">Registros de Vacinas</span>
                    </div>
                    <ChevronRight className="h-5 w-5 text-muted-foreground" />
                 </Link>
              </CardContent>
          </Card>
          
          <Card>
            <CardHeader>
                <CardTitle>Segurança do Trabalho</CardTitle>
            </CardHeader>
            <CardContent>
                 <Button variant="outline" className="w-full">
                    <ShieldAlert className="mr-2 h-4 w-4" /> Ver Registros de Eventos e Acidentes
                </Button>
            </CardContent>
          </Card>
          
           <Card>
            <CardHeader>
                <CardTitle>Documentos de Saúde</CardTitle>
            </CardHeader>
            <CardContent>
                 <Button variant="secondary" className="w-full">
                    <FileText className="mr-2 h-4 w-4" /> Acessar Prontuário Médico Digital
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
                {summaryIndicators.map(indicator => (
                    <div key={indicator.title} className="p-3 border rounded-lg">
                        <div className="flex items-center justify-between">
                            <span className="text-sm font-medium">{indicator.title}</span>
                             <Badge variant={indicator.variant as any}>{indicator.status}</Badge>
                        </div>
                        <p className="text-xs text-muted-foreground pt-1">{indicator.days}</p>
                    </div>
                ))}
                
                <Separator />
                
                <div className='space-y-3'>
                    <h4 className='font-medium'>Próximos Agendamentos</h4>
                    <div className="flex items-start gap-3 text-sm">
                        <CalendarClock className="h-5 w-5 text-muted-foreground mt-0.5" />
                        <div>
                            <p className="font-medium">Exame Periódico</p>
                            <p className="text-muted-foreground">Agendado para: 15/08/2024</p>
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
