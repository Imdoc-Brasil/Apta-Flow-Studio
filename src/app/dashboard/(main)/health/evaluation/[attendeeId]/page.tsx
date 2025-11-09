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
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select'
import { initialHazardData } from '@/app/dashboard/(main)/risks/page'
import { useToast } from '@/hooks/use-toast'
import {
  Save,
  FileSignature,
  Printer,
  Pencil,
  AlertCircle,
  File,
  Shield,
  Syringe,
  Briefcase,
  FilePlus,
  ChevronRight,
  ArrowLeft,
  Loader2,
} from 'lucide-react'
import { useState, useEffect, useCallback } from 'react'
import { RadioGroup, RadioGroupItem } from '@/components/ui/radio-group'
import { Separator } from '@/components/ui/separator'
import { Checkbox } from '@/components/ui/checkbox'
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table'
import { ScrollArea } from '@/components/ui/scroll-area'
import { Badge } from '@/components/ui/badge'
import { useAttendeeStore } from '../../queue/attendee-store'
import { initialEmployeesData } from '../../../clients/[contractId]/employees/data'
import { initialRolesData } from '../../../clients/[contractId]/roles/data'
import { initialSectorsData } from '../../../clients/[contractId]/sectors/data'
import { initialClientsData } from '../../../clients/data'
import { useParams, useRouter } from 'next/navigation'
import Link from 'next/link'

const getDetailedAttendeeInfo = (attendeeId: string) => {
  const attendee = useAttendeeStore
    .getState()
    .attendees.find((a) => a.id === attendeeId)
  if (!attendee) return null

  const employee = initialEmployeesData.find(
    (e) => e.name === attendee.patientName
  )
  if (!employee) return { attendee, employee: null, role: null, sector: null, client: null }

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
  const { toast } = useToast()

  const attendeeId = params.attendeeId as string
  const [attendeeInfo, setAttendeeInfo] = useState<any | null>(null)
  const [isClient, setIsClient] = useState(false)
  
  const [weight, setWeight] = useState('')
  const [height, setHeight] = useState('')
  const [imc, setImc] = useState(0)
  const [imcStatus, setImcStatus] = useState('')


  useEffect(() => {
    setIsClient(true)
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

  if (!isClient) {
     return <div className='flex items-center justify-center h-full'><Loader2 className='h-8 w-8 animate-spin' /></div>;
  }
  
  if (!attendeeInfo) {
    return (
      <div className='flex flex-col items-center justify-center h-full text-center'>
        <h2 className='text-2xl font-bold'>Atendimento não encontrado</h2>
        <p className='text-muted-foreground'>
          O atendimento que você está procurando não existe.
        </p>
        <Button asChild className='mt-4'>
          <Link href='/dashboard/health/queue'>
            <ArrowLeft className='mr-2 h-4 w-4' />
            Voltar para a Fila
          </Link>
        </Button>
      </div>
    )
  }

  const { attendee, employee, role, sector, client } = attendeeInfo
  
  const isMultiExam = attendee.exams.length > 1;
  const examType = isMultiExam ? attendee.solicitationType : attendee.exams[0]?.name || attendee.solicitationType;


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
  
  const InfoField = ({ label, value }: { label: string; value?: string | null }) => (
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
        <Button asChild variant='outline' size='icon' className='h-7 w-7'>
          <Link href={`/dashboard/health/queue`}>
            <ArrowLeft className='h-4 w-4' />
            <span className='sr-only'>Voltar</span>
          </Link>
        </Button>
        <h1 className='flex-1 shrink-0 whitespace-nowrap text-xl font-semibold tracking-tight sm:grow-0'>
          Atendimento Clínico: {attendee.patientName}
        </h1>
        <Badge variant='outline' className='ml-auto sm:ml-0'>
          {attendee.status}
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
                  <InfoField
                    label='Posto de Trabalho'
                    value={'N/A'}
                  />
                  <InfoField label='GHE' value={'N/A'} />
                  <div className='col-span-full'>
                    <InfoField
                      label='Atividades'
                      value={role?.activities.join(', ')}
                    />
                  </div>
                  <div className='col-span-full'>
                    <InfoField label='Endereço' value={employee?.phone} />
                  </div>
                </div>
              </FieldsetGroup>

              <FieldsetGroup title='Seção 02: Contexto do Exame'>
                <div className='grid grid-cols-1 sm:grid-cols-2 gap-4'>
                  <div className='space-y-2'>
                    <Label>Tipo de Exame</Label>
                    <Input disabled value={examType} />
                  </div>
                </div>
                <div className='space-y-2'>
                  <Label>Exposto aos Riscos</Label>
                  <Textarea
                    disabled
                    value='Ruído Contínuo ou Intermitente, Levantamento de peso'
                    rows={2}
                  />
                </div>
                <div className='space-y-2'>
                  <Label>Exames a Serem Realizados (Conforme PCMSO)</Label>
                   <Textarea
                    disabled
                    value={attendee.exams.map((e: any) => e.name).join(', ')}
                    rows={2}
                  />
                </div>
              </FieldsetGroup>

              <FieldsetGroup title='Seção 03: Anamnese'>
                {/* Subseção 01 */}
                <div className='space-y-4 rounded-md border p-4'>
                  <h4 className='font-medium'>Dados Vitais</h4>
                  <Table>
                    <TableHeader>
                      <TableRow>
                        <TableHead>Parâmetro</TableHead>
                        <TableHead>Última Avaliação</TableHead>
                        <TableHead>Avaliação Atual</TableHead>
                        <TableHead>Resultado</TableHead>
                      </TableRow>
                    </TableHeader>
                    <TableBody>
                      <TableRow>
                        <TableCell>PAS / PAD</TableCell>
                        <TableCell className='text-muted-foreground'>
                          [120/80]
                        </TableCell>
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
                        <TableCell className='text-muted-foreground'>
                          [80 / 1.75]
                        </TableCell>
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
                         <TableCell className='text-muted-foreground'>
                          [26.1]
                        </TableCell>
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
                      <TableRow>
                        <TableCell>Circ. Pescoço (cm)</TableCell>
                        <TableCell className='text-muted-foreground'>
                          [40]
                        </TableCell>
                        <TableCell>
                          <Input placeholder='0' className='w-24' />
                        </TableCell>
                        <TableCell />
                      </TableRow>
                      <TableRow>
                        <TableCell>Circ. Abdominal (cm)</TableCell>
                        <TableCell className='text-muted-foreground'>
                          [92]
                        </TableCell>
                        <TableCell>
                          <Input placeholder='0' className='w-24' />
                        </TableCell>
                        <TableCell />
                      </TableRow>
                    </TableBody>
                  </Table>
                </div>
                {/* Subseção 02 */}
                <div className='space-y-4 rounded-md border p-4'>
                  <h4 className='font-medium'>Hábitos de Vida e Doenças</h4>
                  <ExamField label='Fuma?'>
                    <RadioGroup defaultValue='nao' className='flex gap-4'>
                      <div className='flex items-center space-x-2'>
                        <RadioGroupItem value='sim' id='fuma-sim' />
                        <Label htmlFor='fuma-sim'>Sim</Label>
                      </div>
                      <div className='flex items-center space-x-2'>
                        <RadioGroupItem value='nao' id='fuma-nao' />
                        <Label htmlFor='fuma-nao'>Não</Label>
                      </div>
                    </RadioGroup>
                  </ExamField>
                  <ExamField label='Bebida Alcoólica'>
                    <Select>
                      <SelectTrigger className='w-[180px]'>
                        <SelectValue placeholder='Frequência' />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value='diaria'>Diária</SelectItem>
                        <SelectItem value='2-3'>2-3x Semana</SelectItem>
                        <SelectItem value='fds'>Fins de Semana</SelectItem>
                        <SelectItem value='eventual'>Eventual</SelectItem>
                      </SelectContent>
                    </Select>
                  </ExamField>
                  <ExamField label='Atividade Física'>
                    <Select>
                      <SelectTrigger className='w-[180px]'>
                        <SelectValue placeholder='Frequência' />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value='sedentario'>Sedentário</SelectItem>
                        <SelectItem value='2-3'>2-3x Semana</SelectItem>
                        <SelectItem value='4-5'>4-5x Semana</SelectItem>
                        <SelectItem value='+6'>+6x Semana</SelectItem>
                      </SelectContent>
                    </Select>
                  </ExamField>
                  <div className='grid grid-cols-2 gap-4'>
                    <ExamField label='Diabetes?'>
                      <Checkbox />
                    </ExamField>
                    <ExamField label='Hipertensão?'>
                      <Checkbox />
                    </ExamField>
                  </div>
                  <div className='space-y-2'>
                    <Label>Doenças Ortopédicas? Quais?</Label>
                    <Input />
                  </div>
                  <div className='space-y-2'>
                    <Label>
                      Realiza terapias para fatores de riscos psicossociais?
                      Descrever
                    </Label>
                    <Input />
                  </div>
                </div>
                {/* Subseção 03 */}
                <div className='space-y-4 rounded-md border p-4'>
                  <h4 className='font-medium'>Histórico Ocupacional</h4>
                  <div className='space-y-2'>
                    <Label>Cargo no emprego anterior:</Label>
                    <Input />
                  </div>
                  <div className='space-y-2'>
                    <Label>Quais atividades realizava:</Label>
                    <Textarea rows={2} />
                  </div>
                  <div className='space-y-2'>
                    <Label>
                      Já teve algum Acidente de Trabalho? Descreva. Foi afastado
                      pelo INSS?
                    </Label>
                    <Textarea rows={2} />
                  </div>
                  <div className='space-y-2'>
                    <Label>
                      Afastamento pelo INSS por doença comum? Descreva:
                    </Label>
                    <Textarea rows={2} />
                  </div>
                </div>
                {/* Subseção 04 */}
                <div className='space-y-4 rounded-md border p-4'>
                  <h4 className='font-medium'>Queixas Atuais e Anamnese</h4>
                  <Textarea
                    placeholder='Use a IA para transcrever a conversa ou digite livremente...'
                    rows={5}
                  />
                </div>
                {/* Subseção 05 */}
                <div className='space-y-4 rounded-md border p-4'>
                  <h4 className='font-medium'>Exame Físico Atual</h4>
                  <div className='space-y-2'>
                    <NormalAlteredField label='Cabeça e Pescoço' />
                    <NormalAlteredField label='Tórax' />
                    <NormalAlteredField label='Abdome' />
                    <h5 className='font-semibold pt-2'>Coluna</h5>
                    <div className='pl-4 space-y-2'>
                      <NormalAlteredField label='Cervical' />
                      <NormalAlteredField label='Dorsal' />
                      <NormalAlteredField label='Lombar' />
                    </div>
                    <h5 className='font-semibold pt-2'>Membros Superiores</h5>
                    <div className='pl-4 space-y-2'>
                      <NormalAlteredField label='Ombros' />
                      <NormalAlteredField label='Braços' />
                      <NormalAlteredField label='Antebraços' />
                      <NormalAlteredField label='Mãos' />
                    </div>
                    <h5 className='font-semibold pt-2'>Membros Inferiores</h5>
                    <div className='pl-4 space-y-2'>
                      <NormalAlteredField label='Quadril' />
                      <NormalAlteredField label='Coxas' />
                      <NormalAlteredField label='Joelhos' />
                      <NormalAlteredField label='Pernas' />
                      <NormalAlteredField label='Pés' />
                    </div>
                  </div>
                </div>
              </FieldsetGroup>

              <FieldsetGroup title='Seção 06: Achados e Observações'>
                <Textarea
                  placeholder='[Carregar automaticamente os achados alterados]'
                />
                <Label>Observações Adicionais</Label>
                <Textarea placeholder='Adicione observações ou notas adicionais aqui...' />
              </FieldsetGroup>
              <FieldsetGroup title='Seção 07: Conclusão'>
                <RadioGroup className='space-y-2'>
                  <div className='flex items-center space-x-2'>
                    <RadioGroupItem value='normal' id='conc-normal' />
                    <Label htmlFor='conc-normal'>Exame normal</Label>
                  </div>
                  <div className='flex items-center space-x-2'>
                    <RadioGroupItem
                      value='achado-sem-incapacidade'
                      id='conc-achado-sem'
                    />
                    <Label htmlFor='conc-achado-sem'>
                      Achados alterados, mas que não incapacita para o trabalho
                    </Label>
                  </div>
                  <div className='flex items-center space-x-2'>
                    <RadioGroupItem value='revisor' id='conc-revisor' />
                    <Label htmlFor='conc-revisor'>
                      Achados alterados, encaminho para avaliação complementar
                      do médico revisor
                    </Label>
                  </div>
                  <div className='flex items-center space-x-2'>
                    <RadioGroupItem value='parecer' id='conc-parecer' />
                    <Label htmlFor='conc-parecer'>
                      Achados alterados, solicito parecer complementar
                    </Label>
                  </div>
                </RadioGroup>
              </FieldsetGroup>
              <FieldsetGroup title='Seção 08: Ações'>
                <div className='flex flex-wrap gap-2'>
                  <Button variant='outline'>
                    <Printer className='mr-2 h-4 w-4' /> Imprimir Recomendações
                  </Button>
                  <Button>
                    <FileSignature className='mr-2 h-4 w-4' /> Finalizar
                    Atendimento
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
                   {attendee.exams.map((exam: any) => (
                    <div key={exam.id} className='flex justify-between items-center'>
                        <span>{exam.name}</span>{' '}
                        <Badge variant={exam.status === 'Realizado' ? 'secondary' : 'outline'}>{exam.status}</Badge>
                    </div>
                   ))}
                </CardContent>
              </Card>
              <Card>
                <CardHeader>
                  <CardTitle className='text-base'>
                    Histórico Relevante
                  </CardTitle>
                </CardHeader>
                <CardContent className='space-y-2'>
                  <Button
                    variant='ghost'
                    className='w-full justify-start p-2 h-auto text-left'
                  >
                    <Syringe className='mr-2 h-4 w-4 shrink-0' /> Cartão de
                    Vacinas <ChevronRight className='ml-auto h-4 w-4' />
                  </Button>
                  <Button
                    variant='ghost'
                    className='w-full justify-start p-2 h-auto text-left'
                  >
                    <AlertCircle className='mr-2 h-4 w-4 shrink-0' /> Acidentes
                    de Trabalho <ChevronRight className='ml-auto h-4 w-4' />
                  </Button>
                  <Button
                    variant='ghost'
                    className='w-full justify-start p-2 h-auto text-left'
                  >
                    <Briefcase className='mr-2 h-4 w-4 shrink-0' />{' '}
                    Afastamentos INSS <ChevronRight className='ml-auto h-4 w-4' />
                  </Button>
                </CardContent>
              </Card>
            </aside>
          </div>
    </div>
  )
}
