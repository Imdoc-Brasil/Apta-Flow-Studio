
'use client'

import { useState, useEffect, useMemo } from 'react'
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
} from '@dnd-kit/sortable'
import {
  MoreHorizontal,
  PlusCircle,
  Filter,
  UserPlus,
  Tag,
  Loader2,
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
  DropdownMenuCheckboxItem,
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
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs'
import { useTicketStore } from './tickets-store'
import { kanbanColumns, type Ticket, type TicketStatus } from './data'
import {
  addDocumentNonBlocking,
  updateDocumentNonBlocking,
  useCollection,
  useFirestore,
  useMemoFirebase,
  useUser,
  createAuditLog,
} from '@/firebase'
import { collection, doc } from 'firebase/firestore'
import { TicketDetailsDialog } from '@/components/ticket-details-dialog'
import { ClientSideDateFormatter } from '@/components/client-side-date-formatter'
import { TicketCard } from '@/components/ticket-card'
import { AddTicketDialog } from '@/components/add-ticket-dialog'
import type { Client } from '@/lib/types/client'
import { Dialog } from '@/components/ui/dialog'

const statusVariant = {
  Aberto: 'default',
  'Em Progresso': 'secondary',
  Resolvido: 'outline',
  Fechado: 'outline',
  Arquivado: 'secondary',
} as const

const priorityVariant = {
  Alta: 'destructive',
  Média: 'default',
  Baixa: 'secondary',
} as const

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

export default function TicketsPage() {
  const firestore = useFirestore()
  const ticketsRef = useMemoFirebase(
    () => (firestore ? collection(firestore, 'tickets') : null),
    [firestore]
  )
  const clientsRef = useMemoFirebase(
    () => (firestore ? collection(firestore, 'clients') : null),
    [firestore]
  )

  const { data: ticketsData, isLoading: areTicketsLoading } =
    useCollection<Ticket>(ticketsRef)
  const { data: clientsData, isLoading: areClientsLoading } =
    useCollection<Client>(clientsRef)

  const { tickets, setTickets } = useTicketStore()
  const { user } = useUser()
  const { toast } = useToast()

  useEffect(() => {
    if (ticketsData) {
      setTickets(ticketsData)
    }
  }, [ticketsData, setTickets])

  const [isDialogOpen, setIsDialogOpen] = useState(false)
  const [activeTicket, setActiveTicket] = useState<Ticket | null>(null)
  const [priorityFilter, setPriorityFilter] = useState<string[]>([])
  const [labelFilter, setLabelFilter] = useState<string[]>([])
  const [staffFilter, setStaffFilter] = useState<string[]>([])
  const [clientFilter, setClientFilter] = useState<string[]>([])
  const currentUserEmail = user?.email || ''

  const filteredTickets = useMemo(() => {
    return tickets.filter((ticket) => {
      const priorityMatch =
        priorityFilter.length === 0 || priorityFilter.includes(ticket.priority)
      const labelMatch =
        labelFilter.length === 0 ||
        ticket.labels?.some((label) => labelFilter.includes(label.id))
      const staffMatch =
        staffFilter.length === 0 ||
        ticket.assignedTo?.some((staff) => staffFilter.includes(staff))
      const clientMatch =
        clientFilter.length === 0 || clientFilter.includes(ticket.client)
      return priorityMatch && labelMatch && staffMatch && clientMatch
    })
  }, [tickets, priorityFilter, labelFilter, staffFilter, clientFilter])

  const sensors = useSensors(
    useSensor(PointerSensor, {
      activationConstraint: {
        distance: 8,
      },
    })
  )

  const handleDragStart = (event: DragStartEvent) => {
    if (event.active.data.current?.type === 'Ticket') {
      setActiveTicket(event.active.data.current.ticket)
    }
  }

  const handleDragOver = (event: DragOverEvent) => {
    const { active, over } = event
    if (!over || !firestore) return

    const activeId = active.id.toString()
    const overId = over.id.toString()

    if (activeId === overId) return

    const isActiveATicket = active.data.current?.type === 'Ticket'
    const isOverAColumn = over.data.current?.type === 'Column'

    if (isActiveATicket && isOverAColumn) {
      const ticketDocRef = doc(firestore, 'tickets', activeId)
      updateDocumentNonBlocking(ticketDocRef, {
        status: overId,
        updated: new Date().toISOString(),
      })
    }
  }

  const handleDragEnd = (event: DragEndEvent) => {
    setActiveTicket(null)
  }

  const handleRowClick = (ticket: Ticket) => {
    if (ticket.status === 'Aberto' && ticket.id && firestore) {
      const ticketDocRef = doc(firestore, 'tickets', ticket.id)
      updateDocumentNonBlocking(ticketDocRef, {
        status: 'Em Progresso',
        assignedTo: [...(ticket.assignedTo || []), currentUserEmail],
        updated: new Date().toISOString(),
      })
    }
  }

  const handleArchiveTicket = (ticket: Ticket) => {
    if (!firestore || !ticket.id) return
    const ticketDocRef = doc(firestore, 'tickets', ticket.id)
    updateDocumentNonBlocking(ticketDocRef, {
      status: 'Arquivado',
      updated: new Date().toISOString(),
    })
    createAuditLog(firestore, {
      userId: user?.uid || '',
      userEmail: user?.email || '',
      userName: user?.displayName || '',
      action: 'archive',
      module: 'tickets',
      entityId: ticket.id,
      entityName: ticket.subject,
      details: { previousStatus: ticket.status },
    })
    toast({
      title: 'Ticket Arquivado!',
      description: 'O ticket foi movido para o arquivo.',
    })
  }

  const isLoading = areTicketsLoading || areClientsLoading

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
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button variant='outline' size='sm' className='h-8 gap-1'>
                <Filter className='h-3.5 w-3.5' />
                <span>Filtrar</span>
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent align='end' className='w-56'>
              <div className='p-1'>
                <DropdownMenuLabel>Filtrar por Prioridade</DropdownMenuLabel>
                <DropdownMenuSeparator />
                {(['Alta', 'Média', 'Baixa'] as const).map((priority) => (
                  <DropdownMenuCheckboxItem
                    key={priority}
                    checked={priorityFilter.includes(priority)}
                    onCheckedChange={(checked) => {
                      setPriorityFilter((prev) =>
                        checked
                          ? [...prev, priority]
                          : prev.filter((p) => p !== priority)
                      )
                    }}
                  >
                    {priority}
                  </DropdownMenuCheckboxItem>
                ))}

                <DropdownMenuSeparator />

                <DropdownMenuLabel>Filtrar por Cliente</DropdownMenuLabel>
                <DropdownMenuSeparator />
                {clientsData?.map((client) => (
                  <DropdownMenuCheckboxItem
                    key={client.id}
                    checked={clientFilter.includes(client.name)}
                    onCheckedChange={(checked) => {
                      setClientFilter((prev) =>
                        checked
                          ? [...prev, client.name]
                          : prev.filter((c) => c !== client.name)
                      )
                    }}
                  >
                    {client.name}
                  </DropdownMenuCheckboxItem>
                ))}
              </div>
            </DropdownMenuContent>
          </DropdownMenu>

          <Button
            size='sm'
            className='h-8 gap-1'
            onClick={() => setIsDialogOpen(true)}
          >
            <PlusCircle className='h-3.5 w-3.5' />
            <span className='sr-only sm:not-sr-only sm:whitespace-nowrap'>
              Novo Ticket
            </span>
          </Button>
        </div>
      </div>

      <Tabs defaultValue='kanban'>
        <TabsList>
          <TabsTrigger value='list'>Lista</TabsTrigger>
          <TabsTrigger value='kanban'>Quadro Kanban</TabsTrigger>
        </TabsList>
        {isLoading ? (
          <div className='flex items-center justify-center h-96'>
            <Loader2 className='h-8 w-8 animate-spin' />
          </div>
        ) : (
          <>
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
                      {filteredTickets.map((ticket) => (
                        <Dialog key={ticket.id}>
                          <DialogTrigger asChild>
                            <TableRow
                              className='cursor-pointer'
                              onClick={() => handleRowClick(ticket)}
                            >
                              <TableCell className='font-medium'>
                                {ticket.id}
                              </TableCell>
                              <TableCell>
                                <div className='flex flex-col'>
                                  <span>{ticket.subject}</span>
                                  {ticket.labels &&
                                    ticket.labels.length > 0 && (
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
                                <ClientSideDateFormatter
                                  dateString={ticket.updated}
                                />
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
                                      <span className='sr-only'>
                                        Alternar menu
                                      </span>
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
                                    <DropdownMenuItem>
                                      Atribuir
                                    </DropdownMenuItem>
                                    <DropdownMenuSeparator />
                                    <DropdownMenuItem
                                      onClick={() => handleArchiveTicket(ticket)}
                                    >
                                      Arquivar Ticket
                                    </DropdownMenuItem>
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
                  <div className='grid flex-1 grid-cols-1 items-start gap-6 md:grid-cols-4'>
                    <SortableContext items={kanbanColumns}>
                      {kanbanColumns.map((status) => {
                        const columnTickets = filteredTickets.filter(
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
          </>
        )}
      </Tabs>
      <AddTicketDialog
        open={isDialogOpen}
        onOpenChange={setIsDialogOpen}
        clientsData={clientsData}
        ticketsRef={ticketsRef}
      />
    </div>
  )
}
