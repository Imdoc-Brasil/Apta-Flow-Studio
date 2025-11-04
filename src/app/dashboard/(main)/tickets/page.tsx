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
} from './tickets-store'
import { formatDistanceToNow } from 'date-fns'
import { ptBR } from 'date-fns/locale'
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from '@/components/ui/popover'
import { Calendar as CalendarComponent } from '@/components/ui/calendar'
import { initialEmployeesData } from '@/app/dashboard/(main)/employees/page'
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar'
import { Separator } from '@/components/ui/separator'

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
    setTimeAgo(
      formatDistanceToNow(date, { addSuffix: true, locale: ptBR })
    )
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

  const style = {
    transform: CSS.Transform.toString(transform),
    transition,
    opacity: isDragging ? 0.5 : 1,
  }

  return (
    <Dialog>
      <DialogTrigger asChild>
        <div ref={setNodeRef} style={style} {...attributes} {...listeners}>
          <Card className='touch-none cursor-grab active:cursor-grabbing'>
            <div className='flex h-full flex-col'>
              <div className='flex-grow cursor-pointer'>
                <CardHeader className='p-4 pb-2'>
                  <CardTitle className='leading-tight hover:underline'>
                    {ticket.subject}
                  </CardTitle>
                  <CardDescription className='pt-1 text-xs'>
                    {ticket.client} - {ticket.id}
                  </CardDescription>
                </CardHeader>
              </div>
              <CardContent className='flex items-end justify-between p-4 pt-2'>
                <Badge
                  variant={
                    priorityVariant[
                      ticket.priority as keyof typeof priorityVariant
                    ]
                  }
                >
                  {ticket.priority}
                </Badge>
                <div className='flex items-center gap-2'>
                  <p className='text-xs text-muted-foreground'>
                    <TimeAgo dateString={ticket.updated} />
                  </p>
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
              </CardContent>
            </div>
          </Card>
        </div>
      </DialogTrigger>
      <DialogContent className='sm:max-w-2xl'>
        <DialogHeader>
          <DialogTitle className='text-2xl font-bold'>
            {ticket.subject}
          </DialogTitle>
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
              <Textarea
                placeholder='Adicione uma descrição mais detalhada...'
                defaultValue={ticket.description}
                className='ml-7 h-24'
                readOnly
              />
            </div>

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
                      {initialEmployeesData.map((employee) => (
                        <div
                          key={employee.email}
                          className='flex items-center justify-between'
                        >
                          <div className='flex items-center gap-2'>
                            <Avatar className='h-8 w-8'>
                              <AvatarImage src={employee.avatar} />
                              <AvatarFallback>
                                {employee.fallback}
                              </AvatarFallback>
                            </Avatar>
                            <span className='text-sm font-medium'>
                              {employee.name}
                            </span>
                          </div>
                          <Button variant='outline' size='sm'>
                            Atribuir
                          </Button>
                        </div>
                      ))}
                    </div>
                  </div>
                </PopoverContent>
              </Popover>
              <Button variant='secondary' className='justify-start'>
                <Tag className='mr-2 h-4 w-4' /> Etiquetas
              </Button>
              <Button variant='secondary' className='justify-start'>
                <CheckSquare className='mr-2 h-4 w-4' /> Checklist
              </Button>
              <Button variant='secondary' className='justify-start'>
                <Calendar className='mr-2 h-4 w-4' /> Datas
              </Button>
              <Button variant='secondary' className='justify-start'>
                <Paperclip className='mr-2 h-4 w-4' /> Anexo
              </Button>
            </div>
          </div>
        </div>
      </DialogContent>
    </Dialog>
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
                          <TableCell>{ticket.subject}</TableCell>
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
                      <DialogContent className='sm:max-w-2xl'>
                        <DialogHeader>
                          <DialogTitle className='text-2xl font-bold'>
                            {ticket.subject}
                          </DialogTitle>
                          <DialogDescription>
                            Na coluna {ticket.status} | Cliente: {ticket.client}{' '}
                            ({ticket.id})
                          </DialogDescription>
                        </DialogHeader>
                        <div className='grid grid-cols-3 gap-8 py-4'>
                          <div className='col-span-2 space-y-6'>
                            <div className='space-y-2'>
                              <div className='flex items-center gap-2'>
                                <AlignLeft className='h-5 w-5 text-muted-foreground' />
                                <h3 className='font-semibold'>Descrição</h3>
                              </div>
                              <Textarea
                                placeholder='Adicione uma descrição mais detalhada...'
                                defaultValue={ticket.description}
                                className='ml-7 h-24'
                                readOnly
                              />
                            </div>

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
                                  <h3 className='font-semibold'>Aberto em</h3>
                                </div>
                                <p className='text-sm'>
                                  <ClientSideDate
                                    dateString={ticket.updated}
                                  />
                                </p>
                              </div>
                            </div>
                          </div>

                          <div className='col-span-1 space-y-4'>
                            <h3 className='text-sm font-semibold'>
                              Adicionar ao cartão
                            </h3>
                            <div className='flex flex-col space-y-2'>
                              <Button
                                variant='secondary'
                                className='justify-start'
                              >
                                <UserPlus className='mr-2 h-4 w-4' /> Membros
                              </Button>
                              <Button
                                variant='secondary'
                                className='justify-start'
                              >
                                <Tag className='mr-2 h-4 w-4' /> Etiquetas
                              </Button>
                              <Button
                                variant='secondary'
                                className='justify-start'
                              >
                                <CheckSquare className='mr-2 h-4 w-4' />{' '}
                                Checklist
                              </Button>
                              <Button
                                variant='secondary'
                                className='justify-start'
                              >
                                <Calendar className='mr-2 h-4 w-4' /> Datas
                              </Button>
                              <Button
                                variant='secondary'
                                className='justify-start'
                              >
                                <Paperclip className='mr-2 h-4 w-4' /> Anexo
                              </Button>
                            </div>
                          </div>
                        </div>
                      </DialogContent>
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
                      <CardTitle className='leading-tight'>
                        {activeTicket.subject}
                      </CardTitle>
                      <CardDescription className='pt-1 text-xs'>
                        {activeTicket.client} - {activeTicket.id}
                      </CardDescription>
                    </CardHeader>
                    <CardContent className='flex items-end justify-between p-4 pt-2'>
                      <Badge
                        variant={
                          priorityVariant[
                            activeTicket.priority as keyof typeof priorityVariant
                          ]
                        }
                      >
                        {activeTicket.priority}
                      </Badge>
                    </CardContent>
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
