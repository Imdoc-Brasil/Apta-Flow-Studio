
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
import { doc, collection, getDocs, query, where, getDoc } from 'firebase/firestore'
import { addYears, differenceInDays, isValid, parseISO } from 'date-fns'

import type { Employee } from '@/lib/types/employee'
import type { Role } from '@/lib/types/role'
import type { Sector } from '@/lib/types/sector'
import type { Unit } from '@/lib/types/unit'
import type { Environment } from '@/lib/types/environment'
import type { Process } from '@/lib/types/process'
import type { EpiDelivery } from '@/lib/types/risk'
import type { Aso } from '@/lib/types/health'
import { ClientSideDateFormatter } from '@/components/client-side-date-formatter'

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

interface ScheduledEvent {
  type: string
  date: string
  description: string
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
  const { data: employee, isLoading: isEmployeeLoading } =
    useDoc<Employee>(employeeRef)

  const roleRef = useMemoFirebase(() => (firestore && employee?.roleId) ? doc(firestore, `clients/${contractId}/roles`, employee.roleId) : null, [firestore, contractId, employee]);
  const { data: role, isLoading: isRoleLoading } = useDoc<Role>(roleRef);

  const [unit, setUnit] = useState<Unit | null>(null);
  const [sector, setSector] = useState<Sector | null>(null);
  const [mainWorkstation, setMainWorkstation] = useState<Environment | null>(null);
  const [isHierarchyLoading, setIsHierarchyLoading] = useState(true);

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
  const { data: epiDeliveries, isLoading: areEpiDeliveriesLoading } =
    useCollection<EpiDelivery>(epiDeliveriesQuery)


  const scheduledTrainingsQuery = useMemoFirebase(
    () =>
      firestore
        ? query(
          collection(firestore, `clients/${contractId}/scheduled_trainings`),
          where('enrolledEmployees', 'array-contains', employeeId)
        )
        : null,
    [firestore, contractId, employeeId]
  )
  const { data: scheduledTrainings, isLoading: areTrainingsLoading } =
    useCollection(scheduledTrainingsQuery)

  const asosQuery = useMemoFirebase(
    () =>
      firestore && employee?.name
        ? query(
          collection(firestore, `clients/${contractId}/asos`),
          where('employee', '==', employee.name)
        )
        : null,
    [firestore, contractId, employee]
  )
  const { data: asos, isLoading: areAsosLoading } = useCollection<Aso>(asosQuery)

  const upcomingEvents = useMemo(() => {
    const events: ScheduledEvent[] = []

    if (scheduledTrainings) {
      scheduledTrainings.forEach((training: any) => {
        if (new Date(training.scheduledDate) >= new Date()) {
          events.push({
            type: 'Treinamento',
            date: training.scheduledDate,
            description: training.title,
          })
        }
      })
    }

    if (asos) {
      asos.forEach((aso: any) => {
        // Assuming validity is a string like "12 meses" or an ISO date.
        // This logic needs to be more robust in a real scenario.
        const issueDate = new Date(aso.issueDate);
        const nextExamDate = new Date(issueDate.setFullYear(issueDate.getFullYear() + 1));
        if (nextExamDate >= new Date()) {
          events.push({
            type: 'Exame Periódico',
            date: nextExamDate.toISOString(),
            description: `Vencimento do ASO: ${aso.type}`,
          })
        }
      })
    }

    // Sort events by date
    return events.sort((a, b) => new Date(a.date).getTime() - new Date(b.date).getTime());

  }, [scheduledTrainings, asos]);


  useEffect(() => {
    if (!role || !firestore || isRoleLoading) {
      if (!isRoleLoading) setIsHierarchyLoading(false);
      return;
    };

    setIsHierarchyLoading(true);
    const findHierarchy = async () => {
      // Because sectors are nested, we have to find which unit it belongs to.
      // This is inefficient. A better model would have unitId on the role.
      const unitsSnapshot = await getDocs(collection(firestore, `clients/${contractId}/units`));
      for (const unitDoc of unitsSnapshot.docs) {
        const sectorDocRef = doc(firestore, `clients/${contractId}/units/${unitDoc.id}/sectors`, role.sectorId);
        const sectorDoc = await getDoc(sectorDocRef);
        if (sectorDoc.exists()) {
          setUnit({ id: unitDoc.id, ...unitDoc.data() } as Unit);
          setSector({ id: sectorDoc.id, ...sectorDoc.data() } as Sector);

          if (role.mainWorkstationId) {
            const envDocRef = doc(firestore, `clients/${contractId}/units/${unitDoc.id}/sectors/${sectorDoc.id}/environments`, role.mainWorkstationId);
            const envDoc = await getDoc(envDocRef);
            if (envDoc.exists()) {
              setMainWorkstation({ id: envDoc.id, ...envDoc.data() } as Environment);
            }
          }
          break; // Found it, exit loop
        }
      }
      setIsHierarchyLoading(false);
    };

    findHierarchy();
  }, [role, firestore, contractId, isRoleLoading]);


  const episDeliveredCount = epiDeliveries?.length || 0

  const asoStatus = useMemo(() => {
    if (!asos || asos.length === 0) {
      return {
        title: 'ASO',
        status: 'Pendente',
        variant: 'destructive',
        days: 'Nenhum ASO encontrado',
      };
    }

    const mostRecentAso = asos.sort((a, b) => new Date(b.issueDate).getTime() - new Date(a.issueDate).getTime())[0];

    if (!mostRecentAso || !isValid(parseISO(mostRecentAso.issueDate))) {
        return {
            title: 'ASO',
            status: 'Inválido',
            variant: 'destructive',
            days: 'Data do último ASO inválida',
        };
    }

    const lastExamDate = parseISO(mostRecentAso.issueDate);
    // Assuming 1 year validity for now. A better implementation would use role-specific rules.
    const nextExamDate = addYears(lastExamDate, 1);
    const daysRemaining = differenceInDays(nextExamDate, new Date());

    if (daysRemaining < 0) {
      return {
        title: 'ASO',
        status: 'Vencido',
        variant: 'destructive',
        days: `Vencido há ${Math.abs(daysRemaining)} dias`,
      };
    }
    if (daysRemaining <= 30) {
      return {
        title: 'ASO',
        status: 'Atenção',
        variant: 'default', // Using default for yellow/orange-like attention color
        days: `Vence em ${daysRemaining} dias`,
      };
    }
    return {
      title: 'ASO',
      status: 'Em dia',
      variant: 'secondary',
      days: `Vence em ${daysRemaining} dias`,
    };
  }, [asos]);

  const summaryIndicators = [
    asoStatus,
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

  const isLoading =
    isEmployeeLoading ||
    isRoleLoading ||
    areEpiDeliveriesLoading ||
    isHierarchyLoading ||
    areTrainingsLoading ||
    areAsosLoading

  if (isLoading) {
    return (
      <div className='flex items-center justify-center h-full'>
        <Loader2 className='h-8 w-8 animate-spin text-primary' />
      </div>
    )
  }

  if (!employee) {
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
              href={`/dashboard/clients/${contractId}/asos`}
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
                <p className='text-xs text-muted-foreground'>
                  Nenhum processo principal associado a este setor.
                </p>
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
                {upcomingEvents.length > 0 ? (
                  upcomingEvents.slice(0, 2).map((event, index) => (
                    <div key={index} className='flex items-start gap-3 text-sm'>
                      <CalendarClock className='h-5 w-5 text-muted-foreground mt-0.5' />
                      <div>
                        <p className='font-medium'>{event.type}</p>
                        <p className='text-muted-foreground'>
                          Agendado para:{' '}
                          <ClientSideDateFormatter dateString={event.date} />
                        </p>
                        <p className='text-xs text-muted-foreground'>{event.description}</p>
                      </div>
                    </div>
                  ))
                ) : (
                  <p className='text-sm text-muted-foreground text-center py-4'>
                    Nenhum agendamento futuro encontrado.
                  </p>
                )}
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  )
}
