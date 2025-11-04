'use client'

import { useState, useEffect } from 'react'
import {
  DndContext,
  closestCenter,
  DragEndEvent,
  DragStartEvent,
  DragOverlay,
  PointerSensor,
  useSensor,
  useSensors,
  DragOverEvent,
} from '@dnd-kit/core'
import {
  SortableContext,
  verticalListSortingStrategy,
  useSortable,
} from '@dnd-kit/sortable'
import { CSS } from '@dnd-kit/utilities'
import {
  MoreHorizontal,
  PlusCircle,
  Filter,
  AlignLeft,
  UserPlus,
  Tag,
  Calendar,
  Paperclip,
  Clock,
  Flag,
  CheckSquare,
} from 'lucide-react'
import { Badge } from '@/components/ui/badge'
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
  CardFooter,
} from '@/components/ui/card'
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu'
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table'
import { Button } from '@/components/ui/button'
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from '@/components/ui/dialog'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select'
import { Textarea } from '@/components/ui/textarea'
import { initialClientsData } from '@/app/dashboard/(main)/clients/page'
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs'
import {
  useTicketStore,
  type Ticket,
  type TicketStatus,
  availableLabels,
  type Label as LabelType,
  type Checklist,
  type ChecklistItem,
} from './tickets-store'
import { format, formatDistanceToNow, parseISO } from 'date-fns'
import { ptBR } from 'date-fns/locale'
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from '@/components/ui/popover'
import { Calendar as CalendarComponent } from '@/components/ui/calendar'
import {
  initialStaffsData,
  type Staff,
} from '@/app/dashboard/(main)/employees/page'
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar'
import { Separator } from '@/components/ui/separator'
import { Checkbox } from '@/components/ui/checkbox'
import { Progress } from '@/components/ui/progress'
import { useToast } from '@/hooks/use-toast'

const priorityVariant = {
  Alta: 'destructive',
  Média: 'default',
  Baixa: 'secondary',
} as const

const statusVariant = {
  Aberto: 'default',
  'Em Progresso': 'secondary',
  Resolvido: 'outline',
  Fechado: 'outline',
} as const

export const kanbanColumns: TicketStatus[] = [
  'Aberto',
  'Em Progresso',
  'Resolvido',
  'Fechado',
]

function ClientSideDate({ dateString }: { dateString: string }) {
  const [formattedDate, setFormattedDate] = useState('')

  useEffect(() => {
    setFormattedDate(new Date(dateString).toLocaleDateString('pt-BR'))
  }, [dateString])

  return <>{formattedDate}</>
}

function TimeAgo({ dateString }: { dateString: string }) {
  const [timeAgo, setTimeAgo] = useState('')

  useEffect(() => {
    const date = new Date(dateString)
    setTimeAgo(formatDistanceToNow(date, { addSuffix: true, locale: ptBR }))
  }, [dateString])

  if (!timeAgo) return null

  return <>{timeAgo}</>
}

const TicketCard = ({ ticket }: { ticket: Ticket }) => {
  const {
    attributes,
    listeners,
    setNodeRef,
    transform,
    transition,
    isDragging,
  } = useSortable({ id: ticket.id, data: { type: 'Ticket', ticket } })
  const [date, setDate] = useState<Date | undefined>(undefined)
  const { setTickets, tickets } = useTicketStore()

  const handleAssignMember = (ticketId: string, memberEmail: string) => {
    setTickets(
      tickets.map((t) => {
        if (t.id === ticketId) {
          const isAssigned = t.assignedTo?.includes(memberEmail)
          const newAssignedTo = isAssigned
            ? t.assignedTo?.filter((email) => email !== memberEmail)
            : [...(t.assignedTo || []), memberEmail]
          return { ...t, assignedTo: newAssignedTo }
        }
        return t
      })
    )
  }

  const handleLabelChange = (labelId: string, checked: boolean) => {
    setTickets(
      tickets.map((t) => {
        if (t.id === ticket.id) {
          const newLabels = checked
            ? [...(t.labels || []), availableLabels.find((l) => l.id === labelId)!]
            : t.labels?.filter((l) => l.id !== labelId)
          return { ...t, labels: newLabels }
        }
        return t
      })
    )
  }

  const assignedMembers =
    initialStaffsData.filter((emp) =>
      ticket.assignedTo?.includes(emp.email)
    ) ?? []

  const style = {
    transform: CSS.Transform.toString(transform),
    transition,
    opacity: isDragging ? 0.5 : 1,
  }

  return (
    <Dialog>
      <DialogTrigger asChild>
        <div ref={setNodeRef} style={style} {...attributes} {...listeners}>
          <Card className='touch-none cursor-grab active:cursor-grabbing flex flex-col'>
            <div className='flex-grow cursor-pointer'>
              <CardHeader className='p-4 pb-2'>
                {ticket.labels && ticket.labels.length > 0 && (
                  <div className='flex flex-wrap gap-1 mb-2'>
                    {ticket.labels.map((label) => (
                      <span
                        key={label.id}
                        className={`px-2 py-0.5 text-xs rounded-full text-white ${label.color}`}
                      >
                        {label.name}
                      </span>
                    ))}
                  </div>
                )}
                <CardTitle className='leading-tight hover:underline'>
                  {ticket.subject}
                </CardTitle>
                <CardDescription className='pt-1 text-xs'>
                  {ticket.client} - {ticket.id}
                </CardDescription>
              </CardHeader>
            </div>
            <CardFooter className='p-4 pt-0'>
              <div className='flex items-center justify-between w-full'>
                <div className='flex items-center gap-2'>
                  <Badge
                    variant={
                      priorityVariant[
                        ticket.priority as keyof typeof priorityVariant
                      ]
                    }
                  >
                    {ticket.priority}
                  </Badge>
                  <p className='text-xs text-muted-foreground'>
                    <TimeAgo dateString={ticket.updated} />
                  </p>
                </div>
                <div className='flex items-center gap-2'>
                  {assignedMembers.length > 0 && (
                    <div className='flex -space-x-2'>
                      {assignedMembers.map((member) => (
                        <Avatar
                          key={member.email}
                          className='h-6 w-6 border-2'
                        >
                          <AvatarImage src={member.avatar} />
                          <AvatarFallback>{member.fallback}</AvatarFallback>
                        </Avatar>
                      ))}
                    </div>
                  )}
                  <DropdownMenu>
                    <DropdownMenuTrigger asChild>
                      <Button
                        variant='ghost'
                        size='icon'
                        className='h-6 w-6 shrink-0'
                        onClick={(e) => e.stopPropagation()}
                      >
                        <MoreHorizontal className='h-4 w-4' />
                      </Button>
                    </DropdownMenuTrigger>
                    <DropdownMenuContent onClick={(e) => e.stopPropagation()}>
                      <DropdownMenuLabel>Ações</DropdownMenuLabel>
                      <DropdownMenuItem>Ver Detalhes</DropdownMenuItem>
                    </DropdownMenuContent>
                  </DropdownMenu>
                </div>
              </div>
            </CardFooter>
          </Card>
        </div>
      </DialogTrigger>
      <TicketDetailsDialog ticket={ticket} />
    </Dialog>
  )
}

function AddChecklistDialog({
  ticketId,
  children,
}: {
  ticketId: string
  children: React.ReactNode
}) {
  const [open, setOpen] = useState(false)
  const { addChecklist } = useTicketStore()
  const { toast } = useToast()

  const handleSubmit = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault()
    const formData = new FormData(e.currentTarget)
    const title = formData.get('title') as string
    const itemText = formData.get('itemText') as string
    const dueDate = formData.get('dueDate') as string

    if (!title || !itemText || !dueDate) {
      toast({
        variant: 'destructive',
        title: 'Campos obrigatórios',
        description: 'Por favor, preencha todos os campos para criar o checklist.',
      })
      return
    }

    addChecklist(ticketId, title, itemText, dueDate)
    toast({
      title: 'Checklist Adicionado!',
      description: `O checklist "${title}" foi adicionado ao ticket.`,
    })
    setOpen(false)
  }

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>{children}</DialogTrigger>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>Adicionar Novo Checklist</DialogTitle>
          <DialogDescription>
            Crie um novo checklist para detalhar as tarefas deste ticket.
          </DialogDescription>
        </DialogHeader>
        <form id='add-checklist-form' onSubmit={handleSubmit}>
          <div className='grid gap-4 py-4'>
            <div className='space-y-2'>
              <Label htmlFor='title'>Título do Checklist</Label>
              <Input
                id='title'
                name='title'
                placeholder='Ex: Verificação de Bug'
                required
              />
            </div>
            <div className='space-y-2'>
              <Label htmlFor='itemText'>Primeira Tarefa</Label>
              <Input
                id='itemText'
                name='itemText'
                placeholder='Ex: Reproduzir o erro em ambiente de teste'
                required
              />
            </div>
            <div className='space-y-2'>
              <Label htmlFor='dueDate'>Prazo da Primeira Tarefa</Label>
              <Input id='dueDate' name='dueDate' type='date' required />
            </div>
          </div>
        </form>
        <DialogFooter>
          <Button variant='outline' onClick={() => setOpen(false)}>
            Cancelar
          </Button>
          <Button type='submit' form='add-checklist-form'>
            Adicionar
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  )
}


function TicketDetailsDialog({ ticket }: { ticket: Ticket }) {
  const { setTickets, tickets, toggleChecklistItem } = useTicketStore()
  const [date, setDate] = useState<Date>()

  const handleAssignMember = (ticketId: string, memberEmail: string) => {
    setTickets(
      tickets.map((t) => {
        if (t.id === ticketId) {
          const isAssigned = t.assignedTo?.includes(memberEmail)
          const newAssignedTo = isAssigned
            ? t.assignedTo?.filter((email) => email !== memberEmail)
            : [...(t.assignedTo || []), memberEmail]
          return { ...t, assignedTo: newAssignedTo }
        }
        return t
      })
    )
  }

  const handleLabelChange = (labelId: string, checked: boolean) => {
    setTickets(
      tickets.map((t) => {
        if (t.id === ticket.id) {
          const newLabels = checked
            ? [...(t.labels || []), availableLabels.find((l) => l.id === labelId)!]
            : t.labels?.filter((l) => l.id !== labelId)
          return { ...t, labels: newLabels }
        }
        return t
      })
    )
  }
  
  const handleChecklistItemToggle = (checklistId: string, itemId: string, checked: boolean) => {
    // Assuming a logged-in user of "John Doe" for the log
    toggleChecklistItem(ticket.id, checklistId, itemId, checked, 'John Doe')
  }

  const assignedMembers =
    initialStaffsData.filter((emp) =>
      ticket.assignedTo?.includes(emp.email)
    ) ?? []

  return (
    <DialogContent className='sm:max-w-4xl'>
      <DialogHeader>
        <DialogTitle className='text-2xl font-bold'>{ticket.subject}</DialogTitle>
        {ticket.labels && ticket.labels.length > 0 && (
          <div className='flex flex-wrap gap-1 pt-2'>
            {ticket.labels.map((label) => (
              <span
                key={label.id}
                className={`px-2 py-0.5 text-xs rounded-full text-white ${label.color}`}
              >
                {label.name}
              </span>
            ))}
          </div>
        )}
        <DialogDescription>
          Na coluna {ticket.status} | Cliente: {ticket.client} ({ticket.id})
        </DialogDescription>
      </DialogHeader>
      <div className='grid grid-cols-3 gap-8 py-4'>
        <div className='col-span-2 space-y-6'>
          <div className='space-y-2'>
            <div className='flex items-center gap-2'>
              <AlignLeft className='h-5 w-5 text-muted-foreground' />
              <h3 className='font-semibold'>Descrição</h3>
            </div>
            <div className='ml-7 text-sm text-muted-foreground bg-gray-50 p-3 rounded-md border'>
              {ticket.description || 'Nenhuma descrição fornecida.'}
            </div>
          </div>
          
          {ticket.checklists && ticket.checklists.length > 0 && (
            <div className="space-y-4">
              {ticket.checklists.map((checklist) => {
                 const completedItems = checklist.items.filter(item => item.completed).length
                 const totalItems = checklist.items.length
                 const progress = totalItems > 0 ? (completedItems / totalItems) * 100 : 0

                return (
                  <div key={checklist.id} className='space-y-2'>
                    <div className='flex items-center gap-2'>
                      <CheckSquare className='h-5 w-5 text-muted-foreground' />
                      <h3 className='font-semibold'>{checklist.title}</h3>
                    </div>
                     <div className='ml-7 space-y-2'>
                        <Progress value={progress} className="h-2" />
                        {checklist.items.map(item => (
                          <div key={item.id} className="flex items-start gap-2 group">
                             <Checkbox 
                                id={`item-${item.id}`}
                                checked={item.completed}
                                onCheckedChange={(checked) => handleChecklistItemToggle(checklist.id, item.id, !!checked)}
                                className="mt-1"
                              />
                              <div className="grid gap-1 text-sm">
                                <label htmlFor={`item-${item.id}`} className={`font-medium ${item.completed ? 'line-through text-muted-foreground' : ''}`}>{item.text}</label>
                                 <div className="text-xs text-muted-foreground flex items-center gap-2">
                                  {item.completed && item.completedBy && item.completedAt ? (
                                    <span>Concluído por {item.completedBy} <TimeAgo dateString={item.completedAt} /></span>
                                  ) : (
                                    <>
                                      <Calendar className="h-3 w-3" />
                                      <span>Vence em {format(parseISO(item.dueDate), "dd/MM/yyyy")}</span>
                                    </>
                                  )}
                                 </div>
                              </div>
                          </div>
                        ))}
                     </div>
                  </div>
                )
              })}
            </div>
          )}

          <div className='space-y-4 pl-7'>
            <div className='space-y-2'>
              <div className='flex items-center gap-2'>
                <Flag className='h-5 w-5 text-muted-foreground' />
                <h3 className='font-semibold'>Prioridade</h3>
              </div>
              <Badge
                variant={
                  priorityVariant[
                    ticket.priority as keyof typeof priorityVariant
                  ]
                }
              >
                {ticket.priority}
              </Badge>
            </div>
            <div className='space-y-2'>
              <div className='flex items-center gap-2'>
                <Clock className='h-5 w-5 text-muted-foreground' />
                <h3 className='font-semibold'>Aberto</h3>
              </div>
              <p className='text-sm'>
                <TimeAgo dateString={ticket.updated} />
              </p>
            </div>
          </div>
        </div>

        <div className='col-span-1 space-y-4'>
          {assignedMembers.length > 0 && (
            <div className='space-y-2'>
              <h3 className='text-sm font-semibold'>Membros</h3>
              <div className='flex flex-col gap-2'>
                {assignedMembers.map((member) => (
                  <div
                    key={member.email}
                    className='flex items-center gap-2'
                  >
                    <Avatar className='h-8 w-8'>
                      <AvatarImage src={member.avatar} />
                      <AvatarFallback>{member.fallback}</AvatarFallback>
                    </Avatar>
                    <span className='text-sm font-medium'>
                      {member.name}
                    </span>
                  </div>
                ))}
              </div>
            </div>
          )}
          <h3 className='text-sm font-semibold'>Adicionar ao cartão</h3>
          <div className='flex flex-col space-y-2'>
            <Popover>
              <PopoverTrigger asChild>
                <Button variant='secondary' className='justify-start'>
                  <UserPlus className='mr-2 h-4 w-4' /> Membros
                </Button>
              </PopoverTrigger>
              <PopoverContent className='w-80'>
                <div className='grid gap-4'>
                  <div className='space-y-2'>
                    <h4 className='font-medium leading-none'>Membros</h4>
                    <p className='text-sm text-muted-foreground'>
                      Atribua membros a este cartão.
                    </p>
                  </div>
                  <Separator />
                  <div className='flex flex-col gap-2'>
                    {initialStaffsData.map((staff) => {
                      const isAssigned = ticket.assignedTo?.includes(
                        staff.email
                      )
                      return (
                        <div
                          key={staff.email}
                          className='flex items-center justify-between'
                        >
                          <div className='flex items-center gap-2'>
                            <Avatar className='h-8 w-8'>
                              <AvatarImage src={staff.avatar} />
                              <AvatarFallback>
                                {staff.fallback}
                              </AvatarFallback>
                            </Avatar>
                            <span className='text-sm font-medium'>
                              {staff.name}
                            </span>
                          </div>
                          <Button
                            variant={isAssigned ? 'default' : 'outline'}
                            size='sm'
                            onClick={() =>
                              handleAssignMember(ticket.id, staff.email)
                            }
                          >
                            {isAssigned ? 'Remover' : 'Atribuir'}
                          </Button>
                        </div>
                      )
                    })}
                  </div>
                </div>
              </PopoverContent>
            </Popover>
            <Popover>
              <PopoverTrigger asChild>
                <Button variant='secondary' className='justify-start'>
                  <Tag className='mr-2 h-4 w-4' /> Etiquetas
                </Button>
              </PopoverTrigger>
              <PopoverContent className='w-64'>
                <div className='grid gap-4'>
                  <div className='space-y-2'>
                    <h4 className='font-medium leading-none'>Etiquetas</h4>
                    <p className='text-sm text-muted-foreground'>
                      Adicione etiquetas a este ticket.
                    </p>
                  </div>
                  <Separator />
                  <div className='flex flex-col gap-2'>
                    {availableLabels.map((label) => {
                      const isChecked =
                        ticket.labels?.some((l) => l.id === label.id) ?? false
                      return (
                        <Label
                          key={label.id}
                          className='flex items-center gap-2 font-normal'
                        >
                          <Checkbox
                            checked={isChecked}
                            onCheckedChange={(checked) =>
                              handleLabelChange(label.id, Boolean(checked))
                            }
                          />
                          <span
                            className={`px-2 py-0.5 text-xs rounded-full text-white ${label.color}`}
                          >
                            {label.name}
                          </span>
                        </Label>
                      )
                    })}
                  </div>
                </div>
              </PopoverContent>
            </Popover>
             <AddChecklistDialog ticketId={ticket.id}>
              <Button variant='secondary' className='justify-start'>
                <CheckSquare className='mr-2 h-4 w-4' /> Checklist
              </Button>
            </AddChecklistDialog>
            <Popover>
              <PopoverTrigger asChild>
                <Button variant='secondary' className='justify-start'>
                  <Calendar className='mr-2 h-4 w-4' /> Datas
                </Button>
              </PopoverTrigger>
              <PopoverContent className='w-auto p-0'>
                <CalendarComponent
                  mode='single'
                  selected={date}
                  onSelect={setDate}
                  initialFocus
                />
              </PopoverContent>
            </Popover>
            <Button variant='secondary' className='justify-start'>
              <Paperclip className='mr-2 h-4 w-4' /> Anexo
            </Button>
          </div>
        </div>
      </div>
    </DialogContent>
  )
}

const KanbanColumn = ({
  status,
  tickets,
}: {
  status: TicketStatus
  tickets: Ticket[]
}) => {
  const { setNodeRef } = useSortable({
    id: status,
    data: { type: 'Column' },
  })

  return (
    <div
      ref={setNodeRef}
      className='flex h-full flex-col gap-4 rounded-lg bg-muted/50 p-4'
    >
      <h2 className='text-lg font-bold'>{status}</h2>
      <SortableContext
        items={tickets.map((t) => t.id)}
        strategy={verticalListSortingStrategy}
      >
        <div className='flex flex-col gap-4 overflow-y-auto'>
          {tickets.map((ticket) => (
            <TicketCard key={ticket.id} ticket={ticket} />
          ))}
          {tickets.length === 0 && (
            <div className='py-8 text-center text-sm text-muted-foreground'>
              Nenhuma tarefa nesta coluna.
            </div>
          )}
        </div>
      </SortableContext>
    </div>
  )
}

function ClientOnly({ children }: { children: React.ReactNode }) {
  const [hasMounted, setHasMounted] = useState(false)
  useEffect(() => {
    setHasMounted(true)
  }, [])
  if (!hasMounted) {
    return null
  }
  return <>{children}</>
}

export default function TicketsPage() {
  const { tickets, addTicket, setTickets } = useTicketStore()
  const [isDialogOpen, setIsDialogOpen] = useState(false)
  const [activeTicket, setActiveTicket] = useState<Ticket | null>(null)
  
  const sensors = useSensors(
    useSensor(PointerSensor, {
      activationConstraint: {
        distance: 8,
      },
    })
  )

  const handleAddTicket = (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault()
    const formData = new FormData(event.currentTarget)
    addTicket({
      subject: formData.get('subject') as string,
      client: formData.get('client') as string,
      priority: formData.get('priority') as Ticket['priority'],
      description: (formData.get('description') as string) || '',
    })
    setIsDialogOpen(false)
  }

  const handleDragStart = (event: DragStartEvent) => {
    if (event.active.data.current?.type === 'Ticket') {
      setActiveTicket(event.active.data.current.ticket)
    }
  }

  const handleDragOver = (event: DragOverEvent) => {
    const { active, over } = event
    if (!over) return

    const activeId = active.id
    const overId = over.id

    if (activeId === overId) return

    const isActiveATicket = active.data.current?.type === 'Ticket'
    const isOverAColumn = over.data.current?.type === 'Column'

    if (isActiveATicket && isOverAColumn) {
      setTickets(
        tickets.map((t) =>
          t.id === activeId ? { ...t, status: overId as TicketStatus } : t
        )
      )
    }
  }

  const handleDragEnd = (event: DragEndEvent) => {
    setActiveTicket(null)
    const { active, over } = event
    if (!over) return

    const activeId = active.id
    const overId = over.id

    if (activeId !== overId) {
      const activeIndex = tickets.findIndex((t) => t.id === activeId)
      const overIndex = tickets.findIndex((t) => t.id === overId)

      const isActiveATask = active.data.current?.type === 'Ticket'
      const isOverATask = over.data.current?.type === 'Ticket'

      if (isActiveATask && isOverATask) {
        if (tickets[activeIndex].status !== tickets[overIndex].status) {
          const updatedTickets = [...tickets]
          updatedTickets[activeIndex] = {
            ...updatedTickets[activeIndex],
            status: tickets[overIndex].status,
          }
          setTickets(updatedTickets)
        }
      }
    }
  }

  return (
    <div className='flex h-full flex-col gap-4'>
      <div className='flex items-center justify-between'>
        <div>
          <h1 className='font-headline text-3xl font-bold'>
            Tickets de Serviço
          </h1>
          <p className='text-muted-foreground'>
            Rastreie e gerencie as solicitações de serviço do cliente.
          </p>
        </div>
        <div className='flex gap-2'>
          <Button variant='outline' size='sm' className='h-8 gap-1'>
            <Filter className='h-3.5 w-3.5' />
            <span>Filtrar</span>
          </Button>
          <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
            <DialogTrigger asChild>
              <Button size='sm' className='h-8 gap-1'>
                <PlusCircle className='h-3.5 w-3.5' />
                <span className='sr-only sm:not-sr-only sm:whitespace-nowrap'>
                  Novo Ticket
                </span>
              </Button>
            </DialogTrigger>
            <DialogContent>
              <DialogHeader>
                <DialogTitle>Abrir Novo Ticket</DialogTitle>
                <DialogDescription>
                  Preencha as informações abaixo para registrar uma nova
                  solicitação de serviço.
                </DialogDescription>
              </DialogHeader>
              <form id='add-ticket-form' onSubmit={handleAddTicket}>
                <div className='grid gap-4 py-4'>
                  <div className='grid grid-cols-4 items-center gap-4'>
                    <Label htmlFor='client' className='text-right'>
                      Cliente
                    </Label>
                    <Select name='client' required>
                      <SelectTrigger className='col-span-3'>
                        <SelectValue placeholder='Selecione o cliente' />
                      </SelectTrigger>
                      <SelectContent>
                        {initialClientsData.map((client) => (
                          <SelectItem
                            key={client.contractId}
                            value={client.name}
                          >
                            {client.name}
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                  </div>
                  <div className='grid grid-cols-4 items-center gap-4'>
                    <Label htmlFor='subject' className='text-right'>
                      Assunto
                    </Label>
                    <Input
                      id='subject'
                      name='subject'
                      className='col-span-3'
                      required
                    />
                  </div>
                  <div className='grid grid-cols-4 items-center gap-4'>
                    <Label htmlFor='priority' className='text-right'>
                      Prioridade
                    </Label>
                    <Select name='priority' required>
                      <SelectTrigger className='col-span-3'>
                        <SelectValue placeholder='Selecione a prioridade' />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value='Baixa'>Baixa</SelectItem>
                        <SelectItem value='Média'>Média</SelectItem>
                        <SelectItem value='Alta'>Alta</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                  <div className='grid grid-cols-4 items-center gap-4'>
                    <Label htmlFor='description' className='text-right'>
                      Descrição
                    </Label>
                    <Textarea
                      id='description'
                      name='description'
                      className='col-span-3'
                      placeholder='Detalhe a solicitação...'
                    />
                  </div>
                </div>
              </form>
              <DialogFooter>
                <Button
                  variant='outline'
                  onClick={() => setIsDialogOpen(false)}
                >
                  Cancelar
                </Button>
                <Button type='submit' form='add-ticket-form'>
                  Salvar Ticket
                </Button>
              </DialogFooter>
            </DialogContent>
          </Dialog>
        </div>
      </div>

      <Tabs defaultValue='kanban'>
        <TabsList>
          <TabsTrigger value='list'>Lista</TabsTrigger>
          <TabsTrigger value='kanban'>Quadro Kanban</TabsTrigger>
        </TabsList>
        <TabsContent value='list'>
          <Card>
            <CardContent className='pt-6'>
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead className='w-[100px]'>ID do Ticket</TableHead>
                    <TableHead>Assunto</TableHead>
                    <TableHead className='hidden md:table-cell'>
                      Cliente
                    </TableHead>
                    <TableHead>Prioridade</TableHead>
                    <TableHead>Status</TableHead>
                    <TableHead className='hidden md:table-cell'>
                      Última Atualização
                    </TableHead>
                    <TableHead>
                      <span className='sr-only'>Ações</span>
                    </TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {tickets.map((ticket) => (
                    <Dialog key={ticket.id}>
                      <DialogTrigger asChild>
                        <TableRow className='cursor-pointer'>
                          <TableCell className='font-medium'>
                            {ticket.id}
                          </TableCell>
                          <TableCell>
                            <div className='flex flex-col'>
                              <span>{ticket.subject}</span>
                              {ticket.labels && ticket.labels.length > 0 && (
                                <div className='flex flex-wrap gap-1 mt-1'>
                                  {ticket.labels.map((label) => (
                                    <span
                                      key={label.id}
                                      className={`px-1.5 py-0.5 text-[10px] rounded-full text-white ${label.color}`}
                                    >
                                      {label.name}
                                    </span>
                                  ))}
                                </div>
                              )}
                            </div>
                          </TableCell>
                          <TableCell className='hidden md:table-cell'>
                            {ticket.client}
                          </TableCell>
                          <TableCell>
                            <Badge
                              variant={
                                priorityVariant[
                                  ticket.priority as keyof typeof priorityVariant
                                ]
                              }
                            >
                              {ticket.priority}
                            </Badge>
                          </TableCell>
                          <TableCell>
                            <Badge
                              variant={
                                statusVariant[
                                  ticket.status as keyof typeof statusVariant
                                ]
                              }
                            >
                              {ticket.status}
                            </Badge>
                          </TableCell>
                          <TableCell className='hidden md:table-cell'>
                            <ClientSideDate dateString={ticket.updated} />
                          </TableCell>
                          <TableCell>
                            <DropdownMenu>
                              <DropdownMenuTrigger
                                asChild
                                onClick={(e) => e.stopPropagation()}
                              >
                                <Button
                                  aria-haspopup='true'
                                  size='icon'
                                  variant='ghost'
                                >
                                  <MoreHorizontal className='h-4 w-4' />
                                  <span className='sr-only'>Alternar menu</span>
                                </Button>
                              </DropdownMenuTrigger>
                              <DropdownMenuContent
                                align='end'
                                onClick={(e) => e.stopPropagation()}
                              >
                                <DropdownMenuLabel>Ações</DropdownMenuLabel>
                                <DropdownMenuItem>
                                  Ver Detalhes
                                </DropdownMenuItem>
                                <DropdownMenuItem>Atribuir</DropdownMenuItem>
                                <DropdownMenuSeparator />
                                <DropdownMenuItem>
                                  Fechar Ticket
                                </DropdownMenuItem>
                              </DropdownMenuContent>
                            </DropdownMenu>
                          </TableCell>
                        </TableRow>
                      </DialogTrigger>
                      <TicketDetailsDialog ticket={ticket} />
                    </Dialog>
                  ))}
                </TableBody>
              </Table>
            </CardContent>
          </Card>
        </TabsContent>
        <TabsContent value='kanban' className='flex-1'>
          <ClientOnly>
            <DndContext
              sensors={sensors}
              collisionDetection={closestCenter}
              onDragStart={handleDragStart}
              onDragEnd={handleDragEnd}
              onDragOver={handleDragOver}
            >
              <div className='grid flex-1 grid-cols-1 items-start gap-6 md:grid-cols-2 lg:grid-cols-4'>
                <SortableContext items={kanbanColumns}>
                  {kanbanColumns.map((status) => {
                    const columnTickets = tickets.filter(
                      (ticket) => ticket.status === status
                    )
                    return (
                      <KanbanColumn
                        key={status}
                        status={status}
                        tickets={columnTickets}
                      />
                    )
                  })}
                </SortableContext>
              </div>
              <DragOverlay>
                {activeTicket ? (
                  <Card className='cursor-grabbing transform-gpu rotate-3 shadow-lg'>
                    <CardHeader className='p-4 pb-2'>
                      {activeTicket.labels &&
                        activeTicket.labels.length > 0 && (
                          <div className='flex flex-wrap gap-1 mb-2'>
                            {activeTicket.labels.map((label) => (
                              <span
                                key={label.id}
                                className={`px-2 py-0.5 text-xs rounded-full text-white ${label.color}`}
                              >
                                {label.name}
                              </span>
                            ))}
                          </div>
                        )}
                      <CardTitle className='leading-tight'>
                        {activeTicket.subject}
                      </CardTitle>
                      <CardDescription className='pt-1 text-xs'>
                        {activeTicket.client} - {activeTicket.id}
                      </CardDescription>
                    </CardHeader>
                    <CardFooter className='p-4 pt-0'>
                      <div className='flex items-center justify-between w-full'>
                        <Badge
                          variant={
                            priorityVariant[
                              activeTicket.priority as keyof typeof priorityVariant
                            ]
                          }
                        >
                          {activeTicket.priority}
                        </Badge>
                      </div>
                    </CardFooter>
                  </Card>
                ) : null}
              </DragOverlay>
            </DndContext>
          </ClientOnly>
        </TabsContent>
      </Tabs>
    </div>
  )
}
