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
  CheckSquare,
  Calendar,
  Paperclip,
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

const initialTicketsData = [
  {
    id: 'TKT-001',
    subject: 'Não consigo fazer login no portal',
    client: 'Innovate Inc.',
    priority: 'Alta',
    status: 'Aberto',
    updated: '2024-07-21 10:30',
    description:
      'Ao tentar acessar o portal do cliente, recebo uma mensagem de "usuário ou senha inválida", mas minhas credenciais estão corretas. Já tentei limpar o cache e usar outro navegador.',
  },
  {
    id: 'TKT-002',
    subject: 'Pedido de recurso: Modo Escuro',
    client: 'Solutions Co.',
    priority: 'Média',
    status: 'Em Progresso',
    updated: '2024-07-21 09:15',
    description:
      'Gostaríamos de solicitar a implementação de um tema escuro na plataforma para melhorar o conforto visual durante o uso noturno.',
  },
  {
    id: 'TKT-003',
    subject: 'Consulta de faturamento',
    client: 'Stellar Tech',
    priority: 'Baixa',
    status: 'Aberto',
    updated: '2024-07-20 16:00',
    description:
      'Tenho uma dúvida sobre um item que apareceu na nossa última fatura. Podemos agendar uma chamada para esclarecer?',
  },
  {
    id: 'TKT-004',
    subject: 'Endpoint da API retornando erro 500',
    client: 'Quantum Dynamics',
    priority: 'Alta',
    status: 'Resolvido',
    updated: '2024-07-19 11:00',
    description:
      'O endpoint GET /api/v1/data está retornando um erro 500 Internal Server Error desde ontem. Isso está impactando nossa integração.',
  },
  {
    id: 'TKT-005',
    subject: 'Dúvida sobre integração',
    client: 'Apex Innovations',
    priority: 'Baixa',
    status: 'Fechado',
    updated: '2024-07-18 14:45',
    description:
      'Estamos tentando integrar nosso sistema com a API de vocês e precisamos de ajuda para entender o fluxo de autenticação OAuth2.',
  },
]

type TicketStatus = 'Aberto' | 'Em Progresso' | 'Resolvido' | 'Fechado'
export type Ticket = (typeof initialTicketsData)[0]

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

// Component to render date on the client side to avoid hydration mismatch
function ClientSideDate({ dateString }: { dateString: string }) {
  const [formattedDate, setFormattedDate] = useState('')

  useEffect(() => {
    setFormattedDate(new Date(dateString).toLocaleDateString())
  }, [dateString])

  return <>{formattedDate}</>
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

  const style = {
    transform: CSS.Transform.toString(transform),
    transition,
    opacity: isDragging ? 0.5 : 1,
  }

  return (
    <div ref={setNodeRef} style={style} {...attributes} {...listeners}>
      <Dialog>
        <Card className='cursor-grab active:cursor-grabbing touch-none'>
          <DialogTrigger asChild>
            <div className='flex flex-col h-full'>
              <div className='flex-grow cursor-pointer'>
                <CardHeader className='p-4 pb-2'>
                  <CardTitle className='text-base font-semibold leading-tight hover:underline'>
                    {ticket.subject}
                  </CardTitle>
                  <CardDescription className='text-xs pt-1'>
                    {ticket.client} - {ticket.id}
                  </CardDescription>
                </CardHeader>
              </div>
              <CardContent className='p-4 pt-2 flex items-end justify-between'>
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
                    <ClientSideDate dateString={ticket.updated} />
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
          </DialogTrigger>
        </Card>
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
            </div>

            <div className='col-span-1 space-y-4'>
              <h3 className='font-semibold text-sm'>Adicionar ao cartão</h3>
              <div className='flex flex-col space-y-2'>
                <Button variant='secondary' className='justify-start'>
                  <UserPlus className='mr-2 h-4 w-4' /> Membros
                </Button>
                <Button variant='secondary' className='justify-start'>
                  <Tag className='mr-2 h-4 w-4' /> Etiquetas
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
    </div>
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
      className='flex flex-col gap-4 bg-muted/50 p-4 rounded-lg h-full'
    >
      <h2 className='font-bold text-lg'>{status}</h2>
      <SortableContext
        items={tickets.map((t) => t.id)}
        strategy={verticalListSortingStrategy}
      >
        <div className='flex flex-col gap-4 overflow-y-auto'>
          {tickets.map((ticket) => (
            <TicketCard key={ticket.id} ticket={ticket} />
          ))}
          {tickets.length === 0 && (
            <div className='text-center text-sm text-muted-foreground py-8'>
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
  const [tickets, setTickets] = useState<Ticket[]>(initialTicketsData as Ticket[])
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
    const newTicket: Ticket = {
      id: `TKT-${Math.random().toString(36).substring(2, 5).toUpperCase()}`,
      subject: formData.get('subject') as string,
      client: formData.get('client') as string,
      priority: formData.get('priority') as string,
      status: 'Aberto',
      updated: new Date().toISOString().replace('T', ' ').substring(0, 16),
      description: (formData.get('description') as string) || '',
    }
    setTickets((prev) => [newTicket, ...prev])
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
      setTickets((tickets) => {
        const activeIndex = tickets.findIndex((t) => t.id === activeId)
        if (tickets[activeIndex].status !== overId) {
          tickets[activeIndex].status = overId as TicketStatus
          return [...tickets]
        }
        return tickets
      })
    }
  }

  const handleDragEnd = (event: DragEndEvent) => {
    setActiveTicket(null)
    const { active, over } = event
    if (!over) return

    const activeId = active.id
    const overId = over.id

    if (activeId === overId) return

    const isActiveATicket = active.data.current?.type === 'Ticket'
    const isOverATicket = over.data.current?.type === 'Ticket'

    if (isActiveATicket && isOverATicket) {
      setTickets((tickets) => {
        const activeIndex = tickets.findIndex((t) => t.id === activeId)
        const overIndex = tickets.findIndex((t) => t.id === overId)

        if (tickets[activeIndex].status !== tickets[overIndex].status) {
          tickets[activeIndex].status = tickets[overIndex].status
        }
        // Note: this is a simplified reordering logic.
        // A full implementation would use arrayMove from @dnd-kit/sortable.
        return [...tickets]
      })
    }
  }

  return (
    <div className='flex flex-col gap-4 h-full'>
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
                    <TableRow key={ticket.id}>
                      <TableCell className='font-medium'>{ticket.id}</TableCell>
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
                        {ticket.updated}
                      </TableCell>
                      <TableCell>
                        <DropdownMenu>
                          <DropdownMenuTrigger asChild>
                            <Button
                              aria-haspopup='true'
                              size='icon'
                              variant='ghost'
                            >
                              <MoreHorizontal className='h-4 w-4' />
                              <span className='sr-only'>Alternar menu</span>
                            </Button>
                          </DropdownMenuTrigger>
                          <DropdownMenuContent align='end'>
                            <DropdownMenuLabel>Ações</DropdownMenuLabel>
                            <DropdownMenuItem>Ver Detalhes</DropdownMenuItem>
                            <DropdownMenuItem>Atribuir</DropdownMenuItem>
                            <DropdownMenuSeparator />
                            <DropdownMenuItem>Fechar Ticket</DropdownMenuItem>
                          </DropdownMenuContent>
                        </DropdownMenu>
                      </TableCell>
                    </TableRow>
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
              <div className='flex-1 grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 items-start'>
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
                      <CardTitle className='text-base font-semibold leading-tight'>
                        {activeTicket.subject}
                      </CardTitle>
                      <CardDescription className='text-xs pt-1'>
                        {activeTicket.client} - {activeTicket.id}
                      </CardDescription>
                    </CardHeader>
                    <CardContent className='p-4 pt-2 flex items-end justify-between'>
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
