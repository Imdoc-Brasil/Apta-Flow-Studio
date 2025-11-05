'use client'

import { useState, useMemo } from 'react'
import {
  MoreHorizontal,
  PlusCircle,
  File,
  Filter,
  Siren,
  FileWarning,
  HeartPulse,
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
  DropdownMenuTrigger,
  DropdownMenuCheckboxItem,
  DropdownMenuSeparator,
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
import { Textarea } from '@/components/ui/textarea'
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select'
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
import { initialUnitsData } from '../units/page'
import { initialSectorsData } from '../sectors/page'
import { useRolesStore } from '../roles/page'
import { initialEmployeesData } from '../employees/page'
import { cn } from '@/lib/utils'

type EventStatus = 'Abertura' | 'Em Investigação' | 'Concluído'
type EventType = 'Incidente' | 'Não Conformidade' | 'Acidente de Trabalho'

interface BaseEvent {
  id: string
  client: string
  date: string
  description: string
  status: EventStatus
  type: EventType
}

interface Incident extends BaseEvent {
  type: 'Incidente'
}

interface NonConformity extends BaseEvent {
  type: 'Não Conformidade'
  origin: string
}

interface Accident extends BaseEvent {
  type: 'Acidente de Trabalho'
  collaborator: string
  catEmitted: string
}

type AnyEvent = Incident | NonConformity | Accident

const initialIncidentData: Incident[] = [
  {
    id: 'INC-001',
    client: 'Innovate Inc.',
    date: '2024-07-20',
    description: 'Quase acidente com empilhadeira no armazém.',
    status: 'Em Investigação',
    type: 'Incidente',
  },
  {
    id: 'INC-002',
    client: 'Solutions Co.',
    date: '2024-07-18',
    description: 'Vazamento de produto químico de baixo risco.',
    status: 'Concluído',
    type: 'Incidente',
  },
]

const initialNonConformityData: NonConformity[] = [
  {
    id: 'NC-001',
    client: 'Stellar Tech',
    date: '2024-07-15',
    description: 'Falta de sinalização em área de risco.',
    origin: 'Auditoria Interna',
    status: 'Abertura',
    type: 'Não Conformidade',
  },
  {
    id: 'NC-002',
    client: 'Quantum Dynamics',
    date: '2024-07-10',
    description: 'EPI com validade vencida encontrado em uso.',
    origin: 'Inspeção de Segurança',
    status: 'Concluído',
    type: 'Não Conformidade',
  },
]

const initialAccidentData: Accident[] = [
  {
    id: 'CAT-001',
    client: 'Apex Innovations',
    date: '2024-06-25',
    description: 'Corte superficial na mão durante manuseio de ferramenta.',
    collaborator: 'Carlos Souza',
    catEmitted: 'Sim',
    status: 'Em Investigação',
    type: 'Acidente de Trabalho',
  },
]

const getStatusVariant = (status: string) => {
  if (
    status.includes('Pendente') ||
    status.includes('Investigação') ||
    status.includes('Aguardando') ||
    status.includes('Abertura')
  )
    return 'default'
  if (status.includes('Concluído') || status.includes('Resolvida'))
    return 'secondary'
  return 'outline'
}

const EventCard = ({
  event,
  onClick,
}: {
  event: AnyEvent
  onClick: () => void
}) => {
  const { attributes, listeners, setNodeRef, transform, transition, isDragging } =
    useSortable({ id: event.id, data: { type: 'Event', event } })

  const style = {
    transform: CSS.Transform.toString(transform),
    transition,
    opacity: isDragging ? 0.5 : 1,
  }

  const eventTypeMap: Record<
    EventType,
    { icon: React.ElementType; color: string }
  > = {
    Incidente: { icon: Siren, color: 'text-yellow-500' },
    'Não Conformidade': { icon: FileWarning, color: 'text-orange-500' },
    'Acidente de Trabalho': { icon: HeartPulse, color: 'text-red-500' },
  }

  const Icon = eventTypeMap[event.type].icon
  const color = eventTypeMap[event.type].color

  return (
    <div
      ref={setNodeRef}
      style={style}
      {...attributes}
      {...listeners}
      onClick={onClick}
    >
      <Card className='touch-none cursor-grab active:cursor-grabbing hover:bg-muted/50'>
        <CardHeader className='flex flex-row items-start justify-between p-3'>
          <div className='flex items-start gap-2'>
            <Icon className={cn('h-5 w-5 mt-0.5', color)} />
            <div className='space-y-1'>
              <CardTitle className='text-sm font-medium leading-tight'>
                {event.description}
              </CardTitle>
              <CardDescription className='text-xs'>
                {event.date}
                {'collaborator' in event && ` - ${event.collaborator}`}
              </CardDescription>
            </div>
          </div>
          <DropdownMenu>
            <DropdownMenuTrigger
              asChild
              onClick={(e) => e.stopPropagation()}
            >
              <Button variant='ghost' size='icon' className='h-6 w-6 shrink-0'>
                <MoreHorizontal className='h-4 w-4' />
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent onClick={(e) => e.stopPropagation()}>
              <DropdownMenuItem onClick={onClick}>Ver Detalhes</DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>
        </CardHeader>
      </Card>
    </div>
  )
}

const kanbanColumns: EventStatus[] = [
  'Abertura',
  'Em Investigação',
  'Concluído',
]

const KanbanColumn = ({
  status,
  events,
  onCardClick,
}: {
  status: EventStatus
  events: AnyEvent[]
  onCardClick: (event: AnyEvent) => void
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
        items={events.map((e) => e.id)}
        strategy={verticalListSortingStrategy}
      >
        <div className='flex flex-col gap-4 overflow-y-auto'>
          {events.map((event) => (
            <EventCard
              key={event.id}
              event={event}
              onClick={() => onCardClick(event)}
            />
          ))}
          {events.length === 0 && (
            <div className='py-8 text-center text-sm text-muted-foreground'>
              Nenhum evento aqui.
            </div>
          )}
        </div>
      </SortableContext>
    </div>
  )
}

function AccidentDetailsDialog({
  event,
  isOpen,
  onOpenChange,
}: {
  event: Accident | null
  isOpen: boolean
  onOpenChange: (open: boolean) => void
}) {
  if (!event) return null

  return (
    <Dialog open={isOpen} onOpenChange={onOpenChange}>
      <DialogContent className='sm:max-w-2xl'>
        <DialogHeader>
          <DialogTitle>Detalhes do Acidente de Trabalho</DialogTitle>
          <DialogDescription>
            {event.id} - {event.date}
          </DialogDescription>
        </DialogHeader>
        <div className='py-4 grid gap-4'>
          <div>
            <span className='font-semibold'>Colaborador:</span>{' '}
            {event.collaborator}
          </div>
          <div>
            <span className='font-semibold'>Descrição:</span> {event.description}
          </div>
          <div>
            <span className='font-semibold'>CAT Emitida:</span>{' '}
            <Badge
              variant={event.catEmitted === 'Sim' ? 'secondary' : 'outline'}
            >
              {event.catEmitted}
            </Badge>
          </div>
          <div>
            <span className='font-semibold'>Status:</span>{' '}
            <Badge variant={getStatusVariant(event.status)}>
              {event.status}
            </Badge>
          </div>
        </div>
        <DialogFooter>
          <Button variant='outline' onClick={() => onOpenChange(false)}>
            Fechar
          </Button>
          <Button>Iniciar Investigação</Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  )
}

export default function EventsPage() {
  const [incidentData, setIncidentData] = useState<Incident[]>(initialIncidentData)
  const [nonConformityData, setNonConformityData] =
    useState<NonConformity[]>(initialNonConformityData)
  const [accidentData, setAccidentData] = useState<Accident[]>(initialAccidentData)

  const [activeDndEvent, setActiveDndEvent] = useState<AnyEvent | null>(null)
  const [selectedAccident, setSelectedAccident] = useState<Accident | null>(null)
  const [isDetailOpen, setIsDetailOpen] = useState(false)

  const { roles } = useRolesStore()

  const sensors = useSensors(
    useSensor(PointerSensor, {
      activationConstraint: {
        distance: 8,
      },
    })
  )

  const handleAddIncident = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault()
    const formData = new FormData(e.currentTarget)
    const newIncident: Incident = {
      id: `INC-${(Math.random() * 1000).toFixed(0).padStart(3, '0')}`,
      client: 'Innovate Inc.',
      date: formData.get('date') as string,
      description: formData.get('description') as string,
      status: 'Abertura',
      type: 'Incidente',
    }
    setIncidentData((prev) => [newIncident, ...prev])
    e.currentTarget.reset()
  }

  const handleAddNC = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault()
    const formData = new FormData(e.currentTarget)
    const newNC: NonConformity = {
      id: `NC-${(Math.random() * 1000).toFixed(0).padStart(3, '0')}`,
      client: 'Innovate Inc.',
      date: formData.get('date') as string,
      description: formData.get('description') as string,
      origin: formData.get('origin') as string,
      status: 'Abertura',
      type: 'Não Conformidade',
    }
    setNonConformityData((prev) => [newNC, ...prev])
    e.currentTarget.reset()
  }

  const handleAddAccident = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault()
    const formData = new FormData(e.currentTarget)
    const newAccident: Accident = {
      id: `CAT-${(Math.random() * 1000).toFixed(0).padStart(3, '0')}`,
      client: 'Innovate Inc.',
      date: formData.get('date') as string,
      description: formData.get('description') as string,
      collaborator: formData.get('collaborator') as string,
      catEmitted: formData.get('catEmitted') as string,
      status: 'Abertura',
      type: 'Acidente de Trabalho',
    }
    setAccidentData((prev) => [newAccident, ...prev])
    e.currentTarget.reset()
  }

  const handleDragStart = (event: DragStartEvent) => {
    if (event.active.data.current?.type === 'Event') {
      setActiveDndEvent(event.active.data.current.event)
    }
  }

  const handleDragOver = (
    event: DragOverEvent,
    setEvents: React.Dispatch<React.SetStateAction<any[]>>
  ) => {
    const { active, over } = event
    if (!over) return

    const activeId = active.id
    const overId = over.id

    if (activeId === overId) return

    const isActiveAnEvent = active.data.current?.type === 'Event'
    const isOverAColumn = over.data.current?.type === 'Column'

    if (isActiveAnEvent && isOverAColumn) {
      setEvents((events) => {
        const activeIndex = events.findIndex((e) => e.id === activeId)
        if (activeIndex !== -1) {
          events[activeIndex].status = overId as EventStatus
        }
        return [...events]
      })
    }
  }

  const handleDragEnd = () => {
    setActiveDndEvent(null)
  }

  const openAccidentDetails = (event: Accident) => {
    setSelectedAccident(event)
    setIsDetailOpen(true)
  }

  return (
    <div className='grid flex-1 auto-rows-max gap-4'>
      <h1 className='font-headline text-3xl font-bold'>Gestão de Eventos</h1>
      <Tabs defaultValue='accidents'>
        <TabsList>
          <TabsTrigger value='incidents'>Incidentes</TabsTrigger>
          <TabsTrigger value='nonconformities'>Não Conformidades</TabsTrigger>
          <TabsTrigger value='accidents'>Acidentes de Trabalho</TabsTrigger>
        </TabsList>
        <TabsContent value='incidents'>
          {/* Incident Table will be here */}
          <p>Conteúdo da aba de Incidentes.</p>
        </TabsContent>
        <TabsContent value='nonconformities'>
          {/* Non-Conformity Table will be here */}
          <p>Conteúdo da aba de Não Conformidades.</p>
        </TabsContent>
        <TabsContent value='accidents'>
          <Tabs defaultValue='list'>
            <div className='flex items-center justify-between mb-4'>
              <TabsList>
                <TabsTrigger value='list'>Lista</TabsTrigger>
                <TabsTrigger value='kanban'>Kanban</TabsTrigger>
              </TabsList>
              <Dialog>
                <DialogTrigger asChild>
                  <Button size='sm' className='h-8 gap-1'>
                    <PlusCircle className='h-3.5 w-3.5' />
                    <span>Registrar Acidente</span>
                  </Button>
                </DialogTrigger>
                <DialogContent>
                  <DialogHeader>
                    <DialogTitle>Registrar Acidente de Trabalho</DialogTitle>
                    <DialogDescription>
                      Preencha as informações sobre o acidente e a emissão da
                      CAT.
                    </DialogDescription>
                  </DialogHeader>
                  <form id='add-accident-form' onSubmit={handleAddAccident}>
                    <div className='grid gap-4 py-4'>
                      <div className='grid grid-cols-4 items-center gap-4'>
                        <Label htmlFor='date' className='text-right'>
                          Data
                        </Label>
                        <Input
                          id='date'
                          name='date'
                          type='date'
                          className='col-span-3'
                          required
                        />
                      </div>
                      <div className='grid grid-cols-4 items-center gap-4'>
                        <Label htmlFor='collaborator' className='text-right'>
                          Colaborador
                        </Label>
                        <Input
                          id='collaborator'
                          name='collaborator'
                          className='col-span-3'
                          required
                        />
                      </div>
                      <div className='grid grid-cols-4 items-center gap-4'>
                        <Label htmlFor='description' className='text-right'>
                          Descrição
                        </Label>
                        <Textarea
                          id='description'
                          name='description'
                          className='col-span-3'
                          required
                        />
                      </div>
                      <div className='grid grid-cols-4 items-center gap-4'>
                        <Label htmlFor='catEmitted' className='text-right'>
                          CAT Emitida?
                        </Label>
                        <Select name='catEmitted' required>
                          <SelectTrigger className='col-span-3'>
                            <SelectValue placeholder='Selecione' />
                          </SelectTrigger>
                          <SelectContent>
                            <SelectItem value='Sim'>Sim</SelectItem>
                            <SelectItem value='Não'>Não</SelectItem>
                            <SelectItem value='Pendente'>Pendente</SelectItem>
                          </SelectContent>
                        </Select>
                      </div>
                    </div>
                  </form>
                  <DialogFooter>
                    <Button type='button' variant='outline'>
                      Cancelar
                    </Button>
                    <Button type='submit' form='add-accident-form'>
                      Salvar Registro
                    </Button>
                  </DialogFooter>
                </DialogContent>
              </Dialog>
            </div>
            <TabsContent value='list'>
              <Card>
                <CardHeader>
                  <CardTitle>Comunicação de Acidente de Trabalho</CardTitle>
                  <CardDescription>
                    Gerencie os registros e a emissão de CATs.
                  </CardDescription>
                </CardHeader>
                <CardContent>
                  <Table>
                    <TableHeader>
                      <TableRow>
                        <TableHead>Colaborador</TableHead>
                        <TableHead>Data</TableHead>
                        <TableHead>Descrição</TableHead>
                        <TableHead>CAT Emitida</TableHead>
                        <TableHead>Status</TableHead>
                        <TableHead>
                          <span className='sr-only'>Ações</span>
                        </TableHead>
                      </TableRow>
                    </TableHeader>
                    <TableBody>
                      {accidentData.map((item: Accident) => (
                        <TableRow
                          key={item.id}
                          className='cursor-pointer'
                          onClick={() => openAccidentDetails(item)}
                        >
                          <TableCell>{item.collaborator}</TableCell>
                          <TableCell>{item.date}</TableCell>
                          <TableCell className='max-w-[250px] truncate'>
                            {item.description}
                          </TableCell>
                          <TableCell>
                            <Badge
                              variant={
                                item.catEmitted === 'Sim'
                                  ? 'secondary'
                                  : 'outline'
                              }
                            >
                              {item.catEmitted}
                            </Badge>
                          </TableCell>
                          <TableCell>
                            <Badge variant={getStatusVariant(item.status)}>
                              {item.status}
                            </Badge>
                          </TableCell>
                          <TableCell>
                            <DropdownMenu>
                              <DropdownMenuTrigger asChild>
                                <Button
                                  aria-haspopup='true'
                                  size='icon'
                                  variant='ghost'
                                  onClick={(e) => e.stopPropagation()}
                                >
                                  <MoreHorizontal className='h-4 w-4' />
                                </Button>
                              </DropdownMenuTrigger>
                              <DropdownMenuContent
                                align='end'
                                onClick={(e) => e.stopPropagation()}
                              >
                                <DropdownMenuLabel>Ações</DropdownMenuLabel>
                                <DropdownMenuItem
                                  onClick={() => openAccidentDetails(item)}
                                >
                                  Ver Detalhes
                                </DropdownMenuItem>
                                <DropdownMenuItem>
                                  Emitir/Anexar CAT
                                </DropdownMenuItem>
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
            <TabsContent value='kanban'>
              <DndContext
                sensors={sensors}
                collisionDetection={closestCenter}
                onDragStart={handleDragStart}
                onDragEnd={handleDragEnd}
                onDragOver={(e) => handleDragOver(e, setAccidentData)}
              >
                <div className='grid flex-1 grid-cols-1 items-start gap-6 md:grid-cols-3'>
                  <SortableContext items={kanbanColumns}>
                    {kanbanColumns.map((status) => {
                      const columnEvents = accidentData.filter(
                        (event) => event.status === status
                      )
                      return (
                        <KanbanColumn
                          key={status}
                          status={status}
                          events={columnEvents}
                          onCardClick={(event) =>
                            openAccidentDetails(event as Accident)
                          }
                        />
                      )
                    })}
                  </SortableContext>
                </div>
                <DragOverlay>
                  {activeDndEvent ? (
                    <div className='transform-gpu rotate-3'>
                      <EventCard
                        event={activeDndEvent}
                        onClick={() => {}}
                      />
                    </div>
                  ) : null}
                </DragOverlay>
              </DndContext>
            </TabsContent>
          </Tabs>
        </TabsContent>
      </Tabs>
      <AccidentDetailsDialog
        event={selectedAccident}
        isOpen={isDetailOpen}
        onOpenChange={setIsDetailOpen}
      />
    </div>
  )
}
