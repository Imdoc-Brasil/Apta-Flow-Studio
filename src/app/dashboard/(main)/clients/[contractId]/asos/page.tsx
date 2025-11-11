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
import { MoreHorizontal, PlusCircle, Users } from 'lucide-react'
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
import { initialEmployeesData } from '../employees/data'
import { useAttendeeStore } from '../../../health/queue/attendee-store'
import { useTicketStore } from '../../../tickets/tickets-store'
import { initialClientsData } from '../../../clients/data'
import { useState } from 'react'
import { useParams } from 'next/navigation'
import { Separator } from '@/components/ui/separator'
import { aptaServiceUnits } from '@/app/dashboard/(main)/health/queue/data'
import { ScrollArea } from '@/components/ui/scroll-area'

const initialAsoData = [
  {
    id: 'ASO-001',
    employee: 'Carlos Pereira',
    type: 'Periódico',
    issueDate: '2024-07-01',
    validity: '12 meses',
    status: 'Apto',
  },
  {
    id: 'ASO-002',
    employee: 'João da Silva',
    type: 'Admissional',
    issueDate: '2022-01-15',
    validity: '12 meses',
    status: 'Apto',
  },
]

type Aso = (typeof initialAsoData)[0]

export default function AsosPage() {
  const { toast } = useToast()
  const params = useParams()
  const contractId = params.contractId as string
  const client = initialClientsData.find((c) => c.contractId === contractId)

  const [asos, setAsos] = useState(initialAsoData)
  const [isDialogOpen, setIsDialogOpen] = useState(false)
  const { addAttendee } = useAttendeeStore()
  const { addTicket } = useTicketStore()

  const handleNewRequest = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault()
    const formData = new FormData(e.currentTarget)
    const employeeId = formData.get('employeeId') as string
    const solicitationType = formData.get('solicitationType') as string

    const employee = initialEmployeesData.find((emp) => emp.id === employeeId)

    if (!employee || !solicitationType || !client) {
      toast({
        variant: 'destructive',
        title: 'Erro',
        description: 'Por favor, preencha todos os campos obrigatórios.',
      })
      return
    }

    const ticketSubject = `Solicitação de ${solicitationType} para ${employee.name}`

    // 1. Add to attendee queue for the health module
    addAttendee({
      clientName: client.name,
      patientName: employee.name,
      solicitationType: solicitationType,
      // This is a simplified logic. In a real scenario, this would query the PCMSO
      // based on the solicitationType and employee's role/risks.
      exams: [
        {
          id: `EXM-${Date.now()}-A`,
          name: 'Avaliação Clínica',
          status: 'Pendente',
        },
        {
          id: `EXM-${Date.now()}-B`,
          name: 'Audiometria',
          status: 'Pendente',
        },
      ],
    })

    // 2. Add a corresponding ticket for tracking
    addTicket({
      subject: ticketSubject,
      client: client.name,
      priority: 'Média',
      description: `Pedido de atendimento para ${solicitationType} do colaborador ${employee.name}.`,
      relatedEmployee: employee.name,
    })

    toast({
      title: 'Pedido de Atendimento Criado!',
      description: `A solicitação para ${employee.name} foi enviada para a fila de atendimento da Apta.`,
    })

    setIsDialogOpen(false)
  }

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
            <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
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
                        <Select name='employeeId' required>
                          <SelectTrigger>
                            <SelectValue placeholder='Selecione o colaborador' />
                          </SelectTrigger>
                          <SelectContent>
                            {initialEmployeesData.map((emp) => (
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
                            <SelectItem value='Monitoramento Pontual' disabled>
                              Monitoramento Pontual
                            </SelectItem>
                            <SelectItem
                              value='Evolução de Afastamento'
                              disabled
                            >
                              Evolução de Afastamento
                            </SelectItem>
                            <SelectItem value='Avaliação de Segmento' disabled>
                              Avaliação de Segmento
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
                          Os riscos e exames vinculados ao cargo do colaborador
                          aparecerão aqui automaticamente.
                        </p>
                        <div className='space-y-2 pt-2'>
                          <Label className='text-xs'>Riscos (PCMSO)</Label>
                          <Textarea
                            placeholder='[Carregado automaticamente...]'
                            disabled
                            rows={2}
                          />
                        </div>
                        <div className='space-y-2'>
                          <Label className='text-xs'>Exames (PCMSO)</Label>
                          <Textarea
                            placeholder='[Carregado automaticamente...]'
                            disabled
                            rows={2}
                          />
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
                        <div className='space-y-2'>
                          <div className='flex items-center space-x-2'>
                            <Checkbox id='priority' name='priority' />
                            <Label htmlFor='priority' className='font-normal'>
                              Atendimento prioritário?
                            </Label>
                          </div>
                          {/* Futuramente, mostrar as opções se o checkbox estiver marcado */}
                        </div>
                      </div>
                    </div>
                  </ScrollArea>
                </form>
                <DialogFooter>
                  <Button
                    variant='outline'
                    onClick={() => setIsDialogOpen(false)}
                  >
                    Cancelar
                  </Button>
                  <Button variant='secondary' form='new-aso-request-form'>
                    Imprimir
                  </Button>
                  <Button
                    variant='secondary'
                    disabled
                    form='new-aso-request-form'
                  >
                    Encaminhar
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
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>Colaborador</TableHead>
              <TableHead>Tipo</TableHead>
              <TableHead>Data Emissão</TableHead>
              <TableHead>Validade</TableHead>
              <TableHead>Resultado</TableHead>
              <TableHead>
                <span className='sr-only'>Ações</span>
              </TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {asos.map((aso) => (
              <TableRow key={aso.id}>
                <TableCell className='font-medium'>{aso.employee}</TableCell>
                <TableCell>{aso.type}</TableCell>
                <TableCell>{aso.issueDate}</TableCell>
                <TableCell>{aso.validity}</TableCell>
                <TableCell>
                  <Badge
                    variant={
                      aso.status === 'Apto' ? 'secondary' : 'destructive'
                    }
                  >
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
          </TableBody>
        </Table>
      </CardContent>
    </Card>
  )
}
