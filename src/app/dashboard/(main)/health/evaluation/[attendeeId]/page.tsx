'use client'

import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
  CardFooter,
} from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Textarea } from '@/components/ui/textarea'
import { useToast } from '@/hooks/use-toast'
import {
  Save,
  Printer,
  FileSignature,
  Syringe,
  Briefcase,
  AlertCircle,
  ChevronRight,
  ArrowLeft,
} from 'lucide-react'
import { useState, useEffect, useCallback } from 'react'
import { RadioGroup, RadioGroupItem } from '@/components/ui/radio-group'
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table'
import { Badge } from '@/components/ui/badge'
import { useParams, useRouter } from 'next/navigation'
import { useAttendeeStore, Attendee } from '../../queue/attendee-store'
import { initialEmployeesData } from '../../../clients/[contractId]/employees/data'
import { initialRolesData } from '../../../clients/[contractId]/roles/data'
import { initialSectorsData } from '../../../clients/[contractId]/sectors/data'
import { initialClientsData } from '../../../clients/data'
import Link from 'next/link'

// This would typically come from a more robust data source
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
  const { toast } = useToast()

  const [attendeeInfo, setAttendeeInfo] = useState<any | null>(null)
  const [weight, setWeight] = useState('')
  const [height, setHeight] = useState('')
  const [imc, setImc] = useState(0)
  const [imcStatus, setImcStatus] = useState('')

  useEffect(() => {
    if (attendeeId) {
      setAttendeeInfo(getDetailedAttendeeInfo(attendeeId))
    }
  }, [attendeeId])

  const calculateImc = useCallback(() => {
    const w = parseFloat(weight)
    const h = parseFloat(height)
    if (w > 0 && h > 0) {
      const calculatedImc = w / (h * h)
      setImc(calculatedImc)
      if (calculatedImc < 18.5) setImcStatus('Abaixo do peso')
      else if (calculatedImc < 24.9) setImcStatus('Peso normal')
      else if (calculatedImc < 29.9) setImcStatus('Sobrepeso')
      else if (calculatedImc < 34.9) setImcStatus('Obesidade Grau I')
      else if (calculatedImc < 39.9) setImcStatus('Obesidade Grau II')
      else setImcStatus('Obesidade Grau III')
    } else {
      setImc(0)
      setImcStatus('')
    }
  }, [weight, height])

  useEffect(() => {
    calculateImc()
  }, [calculateImc])

  if (!attendeeInfo) {
    return (
      <div className='flex items-center justify-center h-full'>
        <p>Carregando informações do atendimento...</p>
      </div>
    )
  }

  const { attendee, employee, role, sector, client } = attendeeInfo

  const FieldsetGroup = ({
    children,
    title,
  }: {
    children: React.ReactNode
    title: string
  }) => (
    <fieldset className='space-y-4 rounded-lg border p-4'>
      <legend className='-ml-1 px-1 text-base font-medium'>{title}</legend>
      {children}
    </fieldset>
  )

  const InfoField = ({ label, value }: { label: string; value?: string }) => (
    <div className='space-y-1'>
      <p className='text-xs font-medium text-muted-foreground'>{label}</p>
      <p className='text-sm font-semibold'>{value || 'N/A'}</p>
    </div>
  )

  const ExamField = ({
    label,
    children,
  }: {
    label: string
    children: React.ReactNode
  }) => (
    <div className='flex items-center justify-between'>
      <Label className='text-sm'>{label}</Label>
      <div className='flex items-center gap-4'>{children}</div>
    </div>
  )

  const NormalAlteredField = ({ label }: { label: string }) => (
    <div className='grid grid-cols-[1fr_2fr] gap-4 items-start'>
      <div className='flex flex-col gap-2'>
        <Label className='text-sm font-medium pt-2'>{label}</Label>
        <RadioGroup defaultValue='normal' className='flex'>
          <div className='flex items-center space-x-2'>
            <RadioGroupItem value='normal' id={`${label}-normal`} />
            <Label htmlFor={`${label}-normal`}>Normal</Label>
          </div>
          <div className='flex items-center space-x-2'>
            <RadioGroupItem value='alterado' id={`${label}-alterado`} />
            <Label htmlFor={`${label}-alterado`}>Alterado</Label>
          </div>
        </RadioGroup>
      </div>
      <Input placeholder='Se alterado, descrever...' />
    </div>
  )

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
          Atendimento: {attendee.patientName}
        </h1>
        <Badge variant='outline' className='ml-auto sm:ml-0'>
          {attendee.examType}
        </Badge>
      </div>
      <div className='grid md:grid-cols-3 gap-8'>
        <div className='md:col-span-2 space-y-6'>
          <FieldsetGroup title='Seção 01: Dados do Colaborador'>
            <div className='grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-4 text-sm'>
              <InfoField label='Nome' value={employee?.name} />
              <InfoField label='Matrícula' value={employee?.id} />
              <InfoField label='Idade' value={'N/A'} />
              <InfoField label='Sexo' value={'N/A'} />
              <InfoField label='CPF' value={'N/A'} />
              <InfoField label='Empresa' value={client?.name} />
              <InfoField label='Setor' value={sector?.name} />
              <InfoField label='Cargo' value={role?.name} />
              <div className='col-span-full'>
                <InfoField
                  label='Atividades'
                  value={role?.activities.join(', ')}
                />
              </div>
            </div>
          </FieldsetGroup>

          <FieldsetGroup title='Seção 03: Anamnese'>
            <div className='space-y-4 rounded-md border p-4'>
              <h4 className='font-medium'>Dados Vitais</h4>
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>Parâmetro</TableHead>
                    <TableHead>Avaliação Atual</TableHead>
                    <TableHead>Resultado</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  <TableRow>
                    <TableCell>PAS / PAD</TableCell>
                    <TableCell>
                      <Input placeholder='0/0' className='w-24' />
                    </TableCell>
                    <TableCell>
                      <Input
                        readOnly
                        placeholder='Normal'
                        className='w-24 bg-muted'
                      />
                    </TableCell>
                  </TableRow>
                  <TableRow>
                    <TableCell>Peso (kg) / Altura (m)</TableCell>
                    <TableCell className='flex gap-2'>
                      <Input
                        placeholder='0'
                        className='w-20'
                        value={weight}
                        onChange={(e) => setWeight(e.target.value)}
                      />
                      /
                      <Input
                        placeholder='0.00'
                        className='w-20'
                        value={height}
                        onChange={(e) => setHeight(e.target.value)}
                      />
                    </TableCell>
                    <TableCell>
                      <Input
                        readOnly
                        value={imc > 0 ? imc.toFixed(2) : '0.0'}
                        className='w-24 bg-muted'
                      />
                    </TableCell>
                  </TableRow>
                  <TableRow>
                    <TableCell>IMC</TableCell>
                    <TableCell>
                      <Input
                        readOnly
                        value={imc > 0 ? imc.toFixed(2) : '0.0'}
                        className='w-24 bg-muted'
                      />
                    </TableCell>
                    <TableCell>
                      <Input
                        readOnly
                        value={imcStatus}
                        placeholder='Normal'
                        className='w-24 bg-muted'
                      />
                    </TableCell>
                  </TableRow>
                </TableBody>
              </Table>
            </div>
          </FieldsetGroup>

          <FieldsetGroup title='Seção 08: Ações'>
            <div className='flex flex-wrap gap-2'>
              <Button variant='outline'>
                <Printer className='mr-2 h-4 w-4' /> Imprimir Recomendações
              </Button>
              <Button>
                <FileSignature className='mr-2 h-4 w-4' /> Finalizar Atendimento
              </Button>
              <Button variant='secondary'>
                <Save className='mr-2 h-4 w-4' /> Salvar, sem finalizar
              </Button>
            </div>
          </FieldsetGroup>
        </div>

        <aside className='md:col-span-1 space-y-6'>
          <Card>
            <CardHeader>
              <CardTitle>Resumo do Atendimento</CardTitle>
            </CardHeader>
            <CardContent className='space-y-4 text-sm'>
              <div className='flex justify-between items-center'>
                <span>Avaliação Clínica</span>{' '}
                <Badge variant='secondary'>Em Andamento</Badge>
              </div>
              <div className='flex justify-between items-center'>
                <span>Audiometria</span>{' '}
                <Badge variant='outline'>Pendente</Badge>
              </div>
              <div className='flex justify-between items-center'>
                <span>Acuidade Visual</span>{' '}
                <Badge variant='outline'>Pendente</Badge>
              </div>
            </CardContent>
          </Card>
          <Card>
            <CardHeader>
              <CardTitle className='text-base'>Histórico Relevante</CardTitle>
            </CardHeader>
            <CardContent className='space-y-2'>
              <Button
                variant='ghost'
                className='w-full justify-start p-2 h-auto text-left'
                asChild
              >
                <Link
                  href={`/dashboard/clients/${client?.contractId}/vaccines?employee=${employee?.id}`}
                >
                  <Syringe className='mr-2 h-4 w-4 shrink-0' /> Cartão de
                  Vacinas <ChevronRight className='ml-auto h-4 w-4' />
                </Link>
              </Button>
              <Button
                variant='ghost'
                className='w-full justify-start p-2 h-auto text-left'
              >
                <AlertCircle className='mr-2 h-4 w-4 shrink-0' /> Acidentes de
                Trabalho <ChevronRight className='ml-auto h-4 w-4' />
              </Button>
              <Button
                variant='ghost'
                className='w-full justify-start p-2 h-auto text-left'
              >
                <Briefcase className='mr-2 h-4 w-4 shrink-0' /> Afastamentos
                INSS <ChevronRight className='ml-auto h-4 w-4' />
              </Button>
            </CardContent>
          </Card>
        </aside>
      </div>
    </div>
  )
}
