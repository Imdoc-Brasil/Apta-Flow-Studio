'use client'

import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Badge } from '@/components/ui/badge'
import { ArrowLeft, ChevronRight, FileUp } from 'lucide-react'
import { useParams, useRouter } from 'next/navigation'
import { useState, useEffect } from 'react'
import Link from 'next/link'
import { useAttendeeStore, Attendee, Exam } from '../../queue/attendee-store'
import { initialEmployeesData } from '../../../clients/[contractId]/employees/data'
import { initialRolesData } from '../../../clients/[contractId]/roles/data'
import { initialSectorsData } from '../../../clients/[contractId]/sectors/data'
import { initialClientsData } from '../../../clients/data'
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table'
import { Separator } from '@/components/ui/separator'

const getDetailedAttendeeInfo = (attendeeId: string) => {
  const attendee = useAttendeeStore
    .getState()
    .attendees.find((a) => a.id === attendeeId)
  if (!attendee) return null

  const employee = initialEmployeesData.find(
    (e) => e.name === attendee.patientName
  )
  if (!employee) return { attendee }

  const role = initialRolesData.find((r) => r.id === employee.roleId)
  const sector = role
    ? initialSectorsData.find((s) => s.id === role.sectorId)
    : undefined
  const client = initialClientsData.find((c) => c.name === attendee.clientName)

  return { attendee, employee, role, sector, client }
}

export default function AttendeeEvaluationPage() {
  const params = useParams()
  const router = useRouter()
  const attendeeId = params.attendeeId as string

  const [attendeeInfo, setAttendeeInfo] = useState<any | null>(null)
  const [isClient, setIsClient] = useState(false)

  useEffect(() => {
    setIsClient(true)
    if (attendeeId) {
      setAttendeeInfo(getDetailedAttendeeInfo(attendeeId))
    }
  }, [attendeeId])
  
  const attendee = useAttendeeStore(state => state.attendees.find(a => a.id === attendeeId))

  if (!isClient) {
     return <div className='flex items-center justify-center h-full'><p>Carregando...</p></div>;
  }
  
  if (!attendee || !attendeeInfo) {
    return (
      <div className='flex flex-col items-center justify-center h-full text-center'>
        <h2 className='text-2xl font-bold'>Atendimento não encontrado</h2>
        <p className='text-muted-foreground'>
          O atendimento que você está procurando não existe.
        </p>
        <Button asChild className='mt-4' onClick={() => router.back()}>
          <Link href='/dashboard/health/queue'>
            <ArrowLeft className='mr-2 h-4 w-4' />
            Voltar para a Fila
          </Link>
        </Button>
      </div>
    )
  }

  const { employee, role, sector, client } = attendeeInfo

  const InfoField = ({ label, value }: { label: string; value?: string }) => (
    <div className='space-y-1'>
      <p className='text-xs font-medium text-muted-foreground'>{label}</p>
      <p className='text-sm font-semibold'>{value || 'N/A'}</p>
    </div>
  )

  const getExamLink = (exam: Exam) => {
    if (exam.name === 'Avaliação Clínica') {
      // Navigate to the specific clinical evaluation page
      return `/dashboard/health/clinical-exams/evaluation`
    }
    // Navigate to the generic exam result upload page
    return `/dashboard/health/evaluation/${attendeeId}/exam/${exam.id}`
  }


  return (
    <div className='grid flex-1 auto-rows-max gap-4'>
      <div className='flex items-center gap-4'>
        <Button
          variant='outline'
          size='icon'
          className='h-7 w-7'
          onClick={() => router.back()}
        >
          <ArrowLeft className='h-4 w-4' />
          <span className='sr-only'>Voltar</span>
        </Button>
        <h1 className='flex-1 shrink-0 whitespace-nowrap text-xl font-semibold tracking-tight sm:grow-0'>
          Painel de Atendimento: {attendee.patientName}
        </h1>
        <Badge variant='outline' className='ml-auto sm:ml-0'>
          {attendee.status}
        </Badge>
      </div>
      <div className='grid md:grid-cols-3 gap-8'>
        <div className='md:col-span-2 space-y-6'>
          <Card>
            <CardHeader>
              <CardTitle>Dados do Paciente</CardTitle>
            </CardHeader>
            <CardContent>
              <div className='grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-4 text-sm'>
                <InfoField label='Nome' value={employee?.name} />
                <InfoField label='Matrícula' value={employee?.id} />
                <InfoField label='Empresa' value={client?.name} />
                <InfoField label='Setor' value={sector?.name} />
                <InfoField label='Cargo' value={role?.name} />
              </div>
              <Separator className='my-4' />
              <InfoField
                label='Atividades do Cargo'
                value={role?.activities.join(', ')}
              />
            </CardContent>
          </Card>
          <Card>
            <CardHeader>
              <CardTitle>Exames Agendados</CardTitle>
              <CardDescription>
                Selecione um exame para iniciar o procedimento e anexar os
                resultados.
              </CardDescription>
            </CardHeader>
            <CardContent>
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>Exame</TableHead>
                    <TableHead>Status</TableHead>
                    <TableHead>Ação</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {attendee.exams.map((exam) => (
                    <TableRow key={exam.id}>
                      <TableCell className='font-medium'>{exam.name}</TableCell>
                      <TableCell>
                        <Badge
                          variant={
                            exam.status === 'Realizado'
                              ? 'secondary'
                              : 'default'
                          }
                        >
                          {exam.status}
                        </Badge>
                      </TableCell>
                      <TableCell>
                        <Button
                          variant='outline'
                          size='sm'
                          asChild
                          disabled={exam.status === 'Realizado'}
                        >
                          <Link
                            href={getExamLink(exam)}
                          >
                            {exam.status === 'Realizado'
                              ? 'Visualizar'
                              : 'Realizar Exame'}
                          </Link>
                        </Button>
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </CardContent>
          </Card>
        </div>
        <aside className='md:col-span-1 space-y-6'>
          {/* Historical data component can be placed here */}
        </aside>
      </div>
    </div>
  )
}
