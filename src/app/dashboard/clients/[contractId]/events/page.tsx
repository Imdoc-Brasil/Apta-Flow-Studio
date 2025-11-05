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

function EventTable({
  title,
  description,
  data,
  headers,
  renderRow,
  dialogContent,
  dialogTitle,
  dialogDescription,
  onAdd,
}: {
  title: string
  description: string
  data: any[]
  headers: string[]
  renderRow: (item: any) => React.ReactNode
  dialogContent: React.ReactNode
  dialogTitle: string
  dialogDescription: string
  onAdd: (e: React.FormEvent<HTMLFormElement>) => void
}) {
  const [isDialogOpen, setIsDialogOpen] = useState(false)

  return (
    <Card>
      <CardHeader>
        <div className='flex items-start justify-between'>
          <div>
            <CardTitle>{title}</CardTitle>
            <CardDescription>{description}</CardDescription>
          </div>
          <div className='flex gap-2'>
            <Button variant='outline' size='sm' className='h-8 gap-1'>
              <File className='h-3.5 w-3.5' />
              <span>Exportar</span>
            </Button>
            <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
              <DialogTrigger asChild>
                <Button size='sm' className='h-8 gap-1'>
                  <PlusCircle className='h-3.5 w-3.5' />
                  <span className='sr-only sm:not-sr-only sm:whitespace-nowrap'>
                    {`Registrar ${title.split(' ')[1]}`}
                  </span>
                </Button>
              </DialogTrigger>
              <DialogContent>
                <DialogHeader>
                  <DialogTitle>{dialogTitle}</DialogTitle>
                  <DialogDescription>{dialogDescription}</DialogDescription>
                </DialogHeader>
                <form
                  id={`add-${title.split(' ')[1]}-form`}
                  onSubmit={(e) => {
                    onAdd(e)
                    setIsDialogOpen(false)
                  }}
                >
                  {dialogContent}
                  <DialogFooter>
                    <Button
                      type='button'
                      variant='outline'
                      onClick={() => setIsDialogOpen(false)}
                    >
                      Cancelar
                    </Button>
                    <Button type='submit'>Salvar Registro</Button>
                  </DialogFooter>
                </form>
              </DialogContent>
            </Dialog>
          </div>
        </div>
      </CardHeader>
      <CardContent>
        <Table>
          <TableHeader>
            <TableRow>
              {headers.map((header) => (
                <TableHead key={header}>{header}</TableHead>
              ))}
              <TableHead>
                <span className='sr-only'>Ações</span>
              </TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>{data.map((item) => renderRow(item))}</TableBody>
        </Table>
      </CardContent>
    </Card>
  )
}

const EventCard = ({ event }: { event: AnyEvent }) => {
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
    <Card
      ref={setNodeRef}
      style={style}
      {...attributes}
      {...listeners}
      className='touch-none cursor-grab active:cursor-grabbing'
    >
      <CardHeader className='flex flex-row items-start justify-between p-3'>
        <div className='flex items-start gap-2'>
          <Icon className={cn('h-5 w-5 mt-0.5', color)} />
          <div className='space-y-1'>
            <CardTitle className='text-sm font-medium leading-tight'>
              {event.description}
            </CardTitle>
            <CardDescription className='text-xs'>
              {event.date}
            </CardDescription>
          </div>
        </div>
        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <Button variant='ghost' size='icon' className='h-6 w-6 shrink-0'>
              <MoreHorizontal className='h-4 w-4' />
            </Button>
          </DropdownMenuTrigger>
          <DropdownMenuContent>
            <DropdownMenuItem>Ver Detalhes</DropdownMenuItem>
          </DropdownMenuContent>
        </DropdownMenu>
      </CardHeader>
    </Card>
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
}: {
  status: EventStatus
  events: AnyEvent[]
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
            <EventCard key={event.id} event={event} />
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

export default function EventsPage() {
  const [incidentData, setIncidentData] = useState<Incident[]>(initialIncidentData)
  const [nonConformityData, setNonConformityData] =
    useState<NonConformity[]>(initialNonConformityData)
  const [accidentData, setAccidentData] = useState<Accident[]>(initialAccidentData)

  // Combined state for Kanban
  const [events, setEvents] = useState<AnyEvent[]>([
    ...initialIncidentData,
    ...initialNonConformityData,
    ...initialAccidentData,
  ])
  const [activeEvent, setActiveEvent] = useState<AnyEvent | null>(null)
  
  // Filters for Kanban
  const [unitFilter, setUnitFilter] = useState<string>('all');
  const [sectorFilter, setSectorFilter] = useState<string>('all');
  const [roleFilter, setRoleFilter] = useState<string>('all');
  const [employeeFilter, setEmployeeFilter] = useState<string>('all');
  const [eventTypeFilter, setEventTypeFilter] = useState<string>('all');

  const { roles } = useRolesStore()

  const sensors = useSensors(
    useSensor(PointerSensor, {
      activationConstraint: {
        distance: 8,
      },
    })
  )
  
  const filteredEvents = useMemo(() => {
    return events.filter(event => {
        // This is a placeholder for actual filtering logic as we don't have these properties on the event objects yet.
        const typeMatch = eventTypeFilter === 'all' || event.type === eventTypeFilter;
        // const unitMatch = unitFilter === 'all' // || event.unitId === unitFilter
        // ... and so on for other filters
        return typeMatch
    })
  }, [events, eventTypeFilter, unitFilter, sectorFilter, roleFilter, employeeFilter])


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
    setEvents(prev => [newIncident, ...prev])
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
    setEvents(prev => [newNC, ...prev])
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
    setEvents(prev => [newAccident, ...prev])
    e.currentTarget.reset()
  }

  const handleDragStart = (event: DragStartEvent) => {
    if (event.active.data.current?.type === 'Event') {
      setActiveEvent(event.active.data.current.event)
    }
  }

  const handleDragOver = (event: DragOverEvent) => {
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
        events[activeIndex].status = overId as EventStatus
        return [...events]
      })
    }
  }

  const handleDragEnd = (event: DragEndEvent) => {
    setActiveEvent(null)
  }

  return (
    <div className='grid flex-1 auto-rows-max gap-4'>
      <h1 className='font-headline text-3xl font-bold'>Gestão de Eventos</h1>
      <Tabs defaultValue='kanban'>
        <TabsList>
          <TabsTrigger value='kanban'>Kanban</TabsTrigger>
          <TabsTrigger value='incidents'>Incidentes</TabsTrigger>
          <TabsTrigger value='nonconformities'>Não Conformidades</TabsTrigger>
          <TabsTrigger value='accidents'>Acidentes de Trabalho</TabsTrigger>
        </TabsList>
        <TabsContent value='kanban' className='flex h-full flex-col gap-4'>
          <div className='flex items-center gap-2 flex-wrap'>
            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <Button variant='outline' size='sm' className='h-8 gap-1'>
                  <Filter className='h-3.5 w-3.5' />
                  <span>Filtros</span>
                </Button>
              </DropdownMenuTrigger>
              <DropdownMenuContent align='start' className='w-56'>
                <DropdownMenuLabel>Filtrar Por</DropdownMenuLabel>
                <DropdownMenuSeparator />
                <Select value={eventTypeFilter} onValueChange={setEventTypeFilter}>
                    <SelectTrigger className="mx-1 my-1 h-8">
                        <SelectValue placeholder="Tipo de Evento" />
                    </SelectTrigger>
                    <SelectContent>
                        <SelectItem value="all">Todos os Tipos</SelectItem>
                        <SelectItem value="Incidente">Incidente</SelectItem>
                        <SelectItem value="Não Conformidade">Não Conformidade</SelectItem>
                        <SelectItem value="Acidente de Trabalho">Acidente de Trabalho</SelectItem>
                    </SelectContent>
                </Select>
                 <Select value={unitFilter} onValueChange={setUnitFilter}>
                    <SelectTrigger className="mx-1 my-1 h-8">
                        <SelectValue placeholder="Unidade" />
                    </SelectTrigger>
                    <SelectContent>
                        <SelectItem value="all">Todas as Unidades</SelectItem>
                        {initialUnitsData.map(u => <SelectItem key={u.id} value={u.id}>{u.name}</SelectItem>)}
                    </SelectContent>
                </Select>
                 <Select value={sectorFilter} onValueChange={setSectorFilter}>
                    <SelectTrigger className="mx-1 my-1 h-8">
                        <SelectValue placeholder="Setor" />
                    </SelectTrigger>
                    <SelectContent>
                        <SelectItem value="all">Todos os Setores</SelectItem>
                        {initialSectorsData.map(s => <SelectItem key={s.id} value={s.id}>{s.name}</SelectItem>)}
                    </SelectContent>
                </Select>
                 <Select value={roleFilter} onValueChange={setRoleFilter}>
                    <SelectTrigger className="mx-1 my-1 h-8">
                        <SelectValue placeholder="Cargo" />
                    </SelectTrigger>
                    <SelectContent>
                        <SelectItem value="all">Todos os Cargos</SelectItem>
                        {roles.map(r => <SelectItem key={r.id} value={r.id}>{r.name}</SelectItem>)}
                    </SelectContent>
                </Select>
                 <Select value={employeeFilter} onValueChange={setEmployeeFilter}>
                    <SelectTrigger className="mx-1 my-1 h-8">
                        <SelectValue placeholder="Colaborador" />
                    </SelectTrigger>
                    <SelectContent>
                        <SelectItem value="all">Todos os Colaboradores</SelectItem>
                        {initialEmployeesData.map(e => <SelectItem key={e.id} value={e.id}>{e.name}</SelectItem>)}
                    </SelectContent>
                </Select>
              </DropdownMenuContent>
            </DropdownMenu>
          </div>
          <DndContext
            sensors={sensors}
            collisionDetection={closestCenter}
            onDragStart={handleDragStart}
            onDragEnd={handleDragEnd}
            onDragOver={handleDragOver}
          >
            <div className='grid flex-1 grid-cols-1 items-start gap-6 md:grid-cols-3'>
              <SortableContext items={kanbanColumns}>
                {kanbanColumns.map((status) => {
                  const columnEvents = filteredEvents.filter(
                    (event) => event.status === status
                  )
                  return (
                    <KanbanColumn
                      key={status}
                      status={status}
                      events={columnEvents}
                    />
                  )
                })}
              </SortableContext>
            </div>
            <DragOverlay>
              {activeEvent ? (
                <div className='transform-gpu rotate-3'>
                  <EventCard event={activeEvent} />
                </div>
              ) : null}
            </DragOverlay>
          </DndContext>
        </TabsContent>
        <TabsContent value='incidents'>
          <EventTable
            title='Registros de Incidentes'
            description='Gerencie todos os incidentes e quase acidentes reportados.'
            data={incidentData}
            headers={['ID', 'Cliente', 'Data', 'Descrição', 'Status']}
            onAdd={handleAddIncident}
            dialogTitle='Registrar Novo Incidente'
            dialogDescription='Descreva o incidente ou quase acidente ocorrido.'
            dialogContent={
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
              </div>
            }
            renderRow={(item: Incident) => (
              <TableRow key={item.id}>
                <TableCell className='font-medium'>{item.id}</TableCell>
                <TableCell>{item.client}</TableCell>
                <TableCell>{item.date}</TableCell>
                <TableCell className='max-w-[300px] truncate'>
                  {item.description}
                </TableCell>
                <TableCell>
                  <Badge variant={getStatusVariant(item.status)}>
                    {item.status}
                  </Badge>
                </TableCell>
                <TableCell>
                  <DropdownMenu>
                    <DropdownMenuTrigger asChild>
                      <Button aria-haspopup='true' size='icon' variant='ghost'>
                        <MoreHorizontal className='h-4 w-4' />
                      </Button>
                    </DropdownMenuTrigger>
                    <DropdownMenuContent align='end'>
                      <DropdownMenuLabel>Ações</DropdownMenuLabel>
                      <DropdownMenuItem>Ver Detalhes</DropdownMenuItem>
                      <DropdownMenuItem>Iniciar Investigação</DropdownMenuItem>
                    </DropdownMenuContent>
                  </DropdownMenu>
                </TableCell>
              </TableRow>
            )}
          />
        </TabsContent>
        <TabsContent value='nonconformities'>
          <EventTable
            title='Registros de Não Conformidades'
            description='Gerencie não conformidades identificadas em auditorias e inspeções.'
            data={nonConformityData}
            headers={['ID', 'Cliente', 'Data', 'Origem', 'Descrição', 'Status']}
            onAdd={handleAddNC}
            dialogTitle='Registrar Nova Não Conformidade'
            dialogDescription='Detalhe a não conformidade identificada.'
            dialogContent={
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
                  <Label htmlFor='origin' className='text-right'>
                    Origem
                  </Label>
                  <Input
                    id='origin'
                    name='origin'
                    placeholder='Ex: Auditoria Interna'
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
              </div>
            }
            renderRow={(item: NonConformity) => (
              <TableRow key={item.id}>
                <TableCell className='font-medium'>{item.id}</TableCell>
                <TableCell>{item.client}</TableCell>
                <TableCell>{item.date}</TableCell>
                <TableCell>{item.origin}</TableCell>
                <TableCell className='max-w-[300px] truncate'>
                  {item.description}
                </TableCell>
                <TableCell>
                  <Badge variant={getStatusVariant(item.status)}>
                    {item.status}
                  </Badge>
                </TableCell>
                <TableCell>
                  <DropdownMenu>
                    <DropdownMenuTrigger asChild>
                      <Button aria-haspopup='true' size='icon' variant='ghost'>
                        <MoreHorizontal className='h-4 w-4' />
                      </Button>
                    </DropdownMenuTrigger>
                    <DropdownMenuContent align='end'>
                      <DropdownMenuLabel>Ações</DropdownMenuLabel>
                      <DropdownMenuItem>Ver Detalhes</DropdownMenuItem>
                      <DropdownMenuItem>Criar Plano de Ação</DropdownMenuItem>
                    </DropdownMenuContent>
                  </DropdownMenu>
                </TableCell>
              </TableRow>
            )}
          />
        </TabsContent>
        <TabsContent value='accidents'>
          <EventTable
            title='Comunicação de Acidente de Trabalho'
            description='Gerencie os registros e a emissão de CATs.'
            data={accidentData}
            headers={[
              'ID',
              'Cliente',
              'Colaborador',
              'Data',
              'Descrição',
              'CAT Emitida',
              'Status',
            ]}
            onAdd={handleAddAccident}
            dialogTitle='Registrar Acidente de Trabalho'
            dialogDescription='Preencha as informações sobre o acidente e a emissão da CAT.'
            dialogContent={
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
            }
            renderRow={(item: Accident) => (
              <TableRow key={item.id}>
                <TableCell className='font-medium'>{item.id}</TableCell>
                <TableCell>{item.client}</TableCell>
                <TableCell>{item.collaborator}</TableCell>
                <TableCell>{item.date}</TableCell>
                <TableCell className='max-w-[250px] truncate'>
                  {item.description}
                </TableCell>
                <TableCell>
                  <Badge
                    variant={item.catEmitted === 'Sim' ? 'secondary' : 'outline'}
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
                      <Button aria-haspopup='true' size='icon' variant='ghost'>
                        <MoreHorizontal className='h-4 w-4' />
                      </Button>
                    </DropdownMenuTrigger>
                    <DropdownMenuContent align='end'>
                      <DropdownMenuLabel>Ações</DropdownMenuLabel>
                      <DropdownMenuItem>Ver Detalhes</DropdownMenuItem>
                      <DropdownMenuItem>Emitir/Anexar CAT</DropdownMenuItem>
                    </DropdownMenuContent>
                  </DropdownMenu>
                </TableCell>
              </TableRow>
            )}
          />
        </TabsContent>
      </Tabs>
    </div>
  )
}
