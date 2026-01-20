
'use client'

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
import { Button } from '@/components/ui/button'
import { MoreHorizontal, PlusCircle, Users, Loader2 } from 'lucide-react'
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from '@/components/ui/dialog'
import { Checkbox } from '@/components/ui/checkbox'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Textarea } from '@/components/ui/textarea'
import { useToast } from '@/hooks/use-toast'
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select'
import {
  useAttendeeStore,
  type Exam as AttendeeExam,
} from '../../../health/queue/attendee-store'
import { useTicketStore } from '../../../tickets/tickets-store'
import { useState, useEffect } from 'react'
import { useParams } from 'next/navigation'
import { Separator } from '@/components/ui/separator'
import { aptaServiceUnits } from '@/app/dashboard/(main)/health/queue/data'
import { ScrollArea } from '@/components/ui/scroll-area'
import {
  useFirestore,
  addDocumentNonBlocking,
  useCollection,
  useMemoFirebase,
  useDoc,
} from '@/firebase'
import { collection, doc } from 'firebase/firestore'
import type { Ticket } from '@/app/dashboard/(main)/tickets/tickets-store'
import type { Employee } from '../employees/data'
import type { Client } from '../../data'
import { ClientSideDateFormatter } from '@/components/client-side-date-formatter'
import type { Role } from '../roles/data'
import type { PgrInventoryItem } from '../pgr/page'
import type { Hazard } from '../../../risks/page'
import type { Exam } from '../../../health/data/exams'

export interface Aso {
  id: string
  employee: string
  type: string
  issueDate: string
  validity: string
  status: string
}

interface PcmsoRule {
  id: string
  riskId: string
  examIds: string[]
}

export default function AsosPage() {
  const { toast } = useToast()
  const params = useParams()
  const contractId = params.contractId as string

  const firestore = useFirestore()

  // State for the dialog
  const [isDialogOpen, setIsDialogOpen] = useState(false)
  const [selectedEmployeeId, setSelectedEmployeeId] = useState('')
  const [pcmsoRisks, setPcmsoRisks] = useState('')
  const [pcmsoExams, setPcmsoExams] = useState('')
  const [isPcmsoLoading, setIsPcmsoLoading] = useState(false)

  // Data fetching
  const clientRef = useMemoFirebase(
    () => (firestore ? doc(firestore, 'clients', contractId) : null),
    [firestore, contractId]
  )
  const employeesRef = useMemoFirebase(
    () =>
      firestore
        ? collection(firestore, `clients/${contractId}/staffs`)
        : null,
    [firestore, contractId]
  )
  const asosRef = useMemoFirebase(
    () =>
      firestore ? collection(firestore, `clients/${contractId}/asos`) : null,
    [firestore, contractId]
  )
  const ticketsRef = useMemoFirebase(
    () => (firestore ? collection(firestore, 'tickets') : null),
    [firestore]
  )
  const rolesRef = useMemoFirebase(
    () =>
      firestore ? collection(firestore, `clients/${contractId}/roles`) : null,
    [firestore, contractId]
  )
  const pgrInventoryRef = useMemoFirebase(
    () =>
      firestore
        ? collection(firestore, `clients/${contractId}/pgr_inventory`)
        : null,
    [firestore, contractId]
  )
  const pcmsoRulesRef = useMemoFirebase(
    () =>
      firestore
        ? collection(firestore, `clients/${contractId}/pcmso_rules`)
        : null,
    [firestore, contractId]
  )
  const hazardsRef = useMemoFirebase(
    () => (firestore ? collection(firestore, 'hazards') : null),
    [firestore]
  )
  const medicalExamsRef = useMemoFirebase(
    () => (firestore ? collection(firestore, 'medical_exams') : null),
    [firestore]
  )

  const { data: client, isLoading: isClientLoading } = useDoc<Client>(clientRef)
  const { data: employees, isLoading: areEmployeesLoading } =
    useCollection<Employee>(employeesRef)
  const { data: asos, isLoading: areAsosLoading } = useCollection<Aso>(asosRef)
  const { data: tickets, isLoading: areTicketsLoading } =
    useCollection<Ticket>(ticketsRef)
  const { data: roles, isLoading: areRolesLoading } = useCollection<Role>(
    rolesRef
  )
  const { data: pgrInventory, isLoading: isInventoryLoading } =
    useCollection<PgrInventoryItem>(pgrInventoryRef)
  const { data: pcmsoRules, isLoading: areRulesLoading } =
    useCollection<PcmsoRule>(pcmsoRulesRef)
  const { data: hazards, isLoading: areHazardsLoading } =
    useCollection<Hazard>(hazardsRef)
  const { data: medicalExams, isLoading: areExamsLoading } =
    useCollection<Exam>(medicalExamsRef)

  const { addAttendee } = useAttendeeStore()

  useEffect(() => {
    if (
      !selectedEmployeeId ||
      !employees ||
      !roles ||
      !pgrInventory ||
      !pcmsoRules ||
      !hazards ||
      !medicalExams
    ) {
      setPcmsoRisks('')
      setPcmsoExams('')
      return
    }

    setIsPcmsoLoading(true)

    const employee = employees.find((e) => e.id === selectedEmployeeId)
    if (!employee) {
      setIsPcmsoLoading(false)
      return
    }

    const role = roles.find((r) => r.id === employee.roleId)
    if (!role) {
      setIsPcmsoLoading(false)
      return
    }

    const risksInSector = pgrInventory
      .filter((item) => item.sector === role.sectorId)
      .map((item) => item.hazardId)
    const uniqueRiskIds = [...new Set(risksInSector)]

    const requiredExamIds = new Set<string>()
    pcmsoRules.forEach((rule) => {
      if (uniqueRiskIds.includes(rule.riskId)) {
        rule.examIds.forEach((examId) => requiredExamIds.add(examId))
      }
    })

    const riskNames = uniqueRiskIds
      .map((id) => hazards.find((h) => h.id === id)?.name)
      .filter(Boolean)
      .join(', ')
    const examNames = Array.from(requiredExamIds)
      .map((id) => medicalExams.find((e) => e.code === id)?.name)
      .filter(Boolean)
      .join(', ')

    setPcmsoRisks(riskNames || 'Nenhum risco específico encontrado para o cargo.')
    setPcmsoExams(examNames || 'Nenhum exame específico encontrado para os riscos.')
    setIsPcmsoLoading(false)
  }, [
    selectedEmployeeId,
    employees,
    roles,
    pgrInventory,
    pcmsoRules,
    hazards,
    medicalExams,
  ])

  const handleNewRequest = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault()
    if (!asosRef || !ticketsRef || !employees) return

    const formData = new FormData(e.currentTarget)
    const employeeId = formData.get('employeeId') as string
    const solicitationType = formData.get('solicitationType') as string

    const employee = employees.find((emp) => emp.id === employeeId)

    if (!employee || !solicitationType || !client) {
      toast({
        variant: 'destructive',
        title: 'Erro',
        description: 'Por favor, preencha todos os campos obrigatórios.',
      })
      return
    }

    const ticketSubject = `Solicitação de ${solicitationType} para ${employee.name}`

    const examsForAttendee: AttendeeExam[] = [
      {
        id: `EXM-${Date.now()}-A`,
        name: 'Avaliação Clínica',
        status: 'Pendente',
      },
      ...pcmsoExams
        .split(', ')
        .map((examName) => ({
          id: `EXM-${Date.now()}-${examName.slice(0, 3)}`,
          name: examName,
          status: 'Pendente' as 'Pendente' | 'Realizado',
        }))
        .filter((e) => e.name),
    ]

    // 1. Add to attendee queue for the health module
    addAttendee({
      clientName: client.name,
      patientName: employee.name,
      solicitationType: solicitationType,
      exams: examsForAttendee,
    })

    // 2. Add a corresponding ticket for tracking
    const newTicketData: Omit<Ticket, 'id' | 'status' | 'updated'> = {
      subject: ticketSubject,
      client: client.name,
      priority: 'Média',
      description: `Pedido de atendimento para ${solicitationType} do colaborador ${employee.name}.\n\nRiscos Associados: ${pcmsoRisks}\nExames Recomendados: ${pcmsoExams}`,
      relatedEmployee: employee.name,
      createdAt: new Date().toISOString(),
    }
    addDocumentNonBlocking(ticketsRef, newTicketData)

    // 3. Add to the ASO collection for persistence
    const newAsoData: Omit<Aso, 'id'> = {
      employee: employee.name,
      type: solicitationType,
      issueDate: new Date().toISOString(),
      validity: '-',
      status: 'Solicitado',
    }
    addDocumentNonBlocking(asosRef, newAsoData)

    toast({
      title: 'Pedido de Atendimento Criado!',
      description: `A solicitação para ${employee.name} foi enviada para a fila de atendimento da Apta e um ticket foi aberto.`,
    })

    setIsDialogOpen(false)
    setSelectedEmployeeId('')
  }

  const getStatusVariant = (
    status: string
  ): 'secondary' | 'destructive' | 'outline' | 'default' => {
    switch (status) {
      case 'Apto':
        return 'secondary'
      case 'Inapto':
        return 'destructive'
      case 'Solicitado':
        return 'default'
      default:
        return 'outline'
    }
  }

  const isLoading =
    isClientLoading ||
    areEmployeesLoading ||
    areAsosLoading ||
    areRolesLoading ||
    isInventoryLoading ||
    areRulesLoading ||
    areHazardsLoading ||
    areExamsLoading

  return (
    <Card>
      <CardHeader>
        <div className='flex items-center justify-between'>
          <div>
            <CardTitle>Gestão de Atestados (ASOs)</CardTitle>
            <CardDescription>
              Gerencie e solicite os Atestados de Saúde Ocupacional para os
              colaboradores.
            </CardDescription>
          </div>
          <div className='flex items-center gap-2'>
            <Button variant='outline'>
              <Users className='mr-2 h-4 w-4' />
              Pedido em Massa
            </Button>
            <Dialog
              open={isDialogOpen}
              onOpenChange={(isOpen) => {
                setIsDialogOpen(isOpen)
                if (!isOpen) setSelectedEmployeeId('')
              }}
            >
              <DialogTrigger asChild>
                <Button>
                  <PlusCircle className='mr-2 h-4 w-4' />
                  Novo Pedido de Atendimento
                </Button>
              </DialogTrigger>
              <DialogContent className='sm:max-w-lg'>
                <DialogHeader>
                  <DialogTitle>Novo Pedido de Atendimento</DialogTitle>
                  <DialogDescription>
                    Selecione o colaborador e o tipo de avaliação para gerar um
                    novo pedido.
                  </DialogDescription>
                </DialogHeader>
                <form id='new-aso-request-form' onSubmit={handleNewRequest}>
                  <ScrollArea className='h-[60vh]'>
                    <div className='grid gap-6 p-1 pr-4'>
                      <div className='space-y-2'>
                        <Label htmlFor='aptaUnitId'>
                          Unidade de Atendimento Apta
                        </Label>
                        <Select name='aptaUnitId' required>
                          <SelectTrigger>
                            <SelectValue placeholder='Selecione a unidade da Apta' />
                          </SelectTrigger>
                          <SelectContent>
                            {aptaServiceUnits.map((unit) => (
                              <SelectItem key={unit.id} value={unit.id}>
                                {unit.name} ({unit.type})
                              </SelectItem>
                            ))}
                          </SelectContent>
                        </Select>
                      </div>
                      <div className='space-y-2'>
                        <Label htmlFor='employeeId'>Colaborador</Label>
                        <Select
                          name='employeeId'
                          onValueChange={setSelectedEmployeeId}
                          required
                        >
                          <SelectTrigger>
                            <SelectValue placeholder='Selecione o colaborador' />
                          </SelectTrigger>
                          <SelectContent>
                            {employees?.map((emp) => (
                              <SelectItem key={emp.id} value={emp.id}>
                                {emp.name}
                              </SelectItem>
                            ))}
                          </SelectContent>
                        </Select>
                      </div>
                      <div className='space-y-2'>
                        <Label htmlFor='solicitationType'>
                          Tipo de Atendimento
                        </Label>
                        <Select name='solicitationType' required>
                          <SelectTrigger>
                            <SelectValue placeholder='Selecione o tipo de avaliação' />
                          </SelectTrigger>
                          <SelectContent>
                            <SelectItem value='Avaliação Admissional'>
                              Avaliação Admissional
                            </SelectItem>
                            <SelectItem value='Avaliação Periódica'>
                              Avaliação Periódica
                            </SelectItem>
                            <SelectItem value='Avaliação de Retorno ao Trabalho'>
                              Avaliação de Retorno ao Trabalho
                            </SelectItem>
                            <SelectItem value='Avaliação de Mudança de Risco'>
                              Avaliação de Mudança de Risco
                            </SelectItem>
                            <SelectItem value='Avaliação Demissional'>
                              Avaliação Demissional
                            </SelectItem>
                          </SelectContent>
                        </Select>
                      </div>

                      <Separator />

                      <div className='space-y-2 bg-muted/50 p-3 rounded-md border'>
                        <Label className='font-semibold'>
                          Informações do PCMSO
                        </Label>
                        <p className='text-xs text-muted-foreground'>
                          Riscos e exames vinculados ao cargo do colaborador.
                        </p>
                        <div className='space-y-2 pt-2'>
                          <Label className='text-xs'>Riscos (PGR)</Label>
                          {isPcmsoLoading ? (
                            <Loader2 className='h-4 w-4 animate-spin' />
                          ) : (
                            <Textarea
                              value={pcmsoRisks}
                              readOnly
                              rows={2}
                              className='bg-white'
                            />
                          )}
                        </div>
                        <div className='space-y-2'>
                          <Label className='text-xs'>Exames (PCMSO)</Label>
                           {isPcmsoLoading ? (
                            <Loader2 className='h-4 w-4 animate-spin' />
                          ) : (
                            <Textarea
                              value={pcmsoExams}
                              readOnly
                              rows={2}
                              className='bg-white'
                            />
                          )}
                        </div>
                      </div>

                      <Separator />

                      <div className='space-y-4'>
                        <Label className='font-semibold'>
                          Informações Adicionais
                        </Label>
                        <div className='space-y-2'>
                          <div className='flex items-center space-x-2'>
                            <Checkbox id='pcd' name='pcd' />
                            <Label htmlFor='pcd' className='font-normal'>
                              Avaliação para Enquadramento PCD?
                            </Label>
                          </div>
                          <Textarea
                            name='pcd-details'
                            placeholder='Se sim, descreva se há alguma necessidade especial para o atendimento.'
                          />
                        </div>
                      </div>
                    </div>
                  </ScrollArea>
                </form>
                <DialogFooter>
                  <Button
                    variant='outline'
                    onClick={() => {
                      setIsDialogOpen(false)
                      setSelectedEmployeeId('')
                    }}
                  >
                    Cancelar
                  </Button>
                  <Button type='submit' form='new-aso-request-form'>
                    Salvar
                  </Button>
                </DialogFooter>
              </DialogContent>
            </Dialog>
          </div>
        </div>
      </CardHeader>
      <CardContent>
        {isLoading ? (
          <div className='flex justify-center items-center h-48'>
            <Loader2 className='h-8 w-8 animate-spin text-muted-foreground' />
          </div>
        ) : (
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Colaborador</TableHead>
                <TableHead>Tipo</TableHead>
                <TableHead>Data Emissão/Solicitação</TableHead>
                <TableHead>Validade</TableHead>
                <TableHead>Resultado</TableHead>
                <TableHead>
                  <span className='sr-only'>Ações</span>
                </TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {asos?.map((aso) => (
                <TableRow key={aso.id}>
                  <TableCell className='font-medium'>{aso.employee}</TableCell>
                  <TableCell>{aso.type}</TableCell>
                  <TableCell>
                    <ClientSideDateFormatter dateString={aso.issueDate} />
                  </TableCell>
                  <TableCell>{aso.validity}</TableCell>
                  <TableCell>
                    <Badge variant={getStatusVariant(aso.status)}>
                      {aso.status}
                    </Badge>
                  </TableCell>
                  <TableCell>
                    <Button aria-haspopup='true' size='icon' variant='ghost'>
                      <MoreHorizontal className='h-4 w-4' />
                      <span className='sr-only'>Alternar menu</span>
                    </Button>
                  </TableCell>
                </TableRow>
              ))}
              {asos?.length === 0 && (
                <TableRow>
                  <TableCell colSpan={6} className='h-24 text-center'>
                    Nenhum ASO encontrado.
                  </TableCell>
                </TableRow>
              )}
            </TableBody>
          </Table>
        )}
      </CardContent>
    </Card>
  )
}
