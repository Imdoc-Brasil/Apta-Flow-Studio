'use client'

import { useState } from 'react'
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
  Card,
  CardContent,
  CardHeader,
  CardTitle,
  CardFooter,
} from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { PlusCircle, MoreHorizontal } from 'lucide-react'
import { Badge } from '@/components/ui/badge'
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
import { initialClientsData } from '@/app/dashboard/(main)/clients/data'
import { initialEmployeesData } from '@/app/dashboard/(main)/clients/[contractId]/employees/data'
import { useToast } from '@/hooks/use-toast'
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs'
import { aptaServiceUnits } from './data'

type Status = 'Agendado' | 'Em Atendimento' | 'Concluído'

interface Attendee {
  id: string
  patientName: string
  clientName: string
  examType: string
  status: Status
}

const initialAttendees: Attendee[] = [
  {
    id: '1',
    patientName: 'Carlos Pereira',
    clientName: 'Innovate Inc.',
    examType: 'ASO Periódico',
    status: 'Agendado',
  },
  {
    id: '2',
    patientName: 'Ana Costa',
    clientName: 'Solutions Co.',
    examType: 'Eletrocardiograma',
    status: 'Em Atendimento',
  },
  {
    id: '3',
    patientName: 'João da Silva',
    clientName: 'Innovate Inc.',
    examType: 'Avaliação Clínica',
    status: 'Concluído',
  },
  {
    id: '4',
    patientName: 'Maria Oliveira',
    clientName: 'Quantum Dynamics',
    examType: 'Raio-X de Tórax',
    status: 'Agendado',
  },
]

const statusLabels: Record<Status, string> = {
  Agendado: 'Agendado',
  'Em Atendimento': 'Em Atendimento',
  Concluído: 'Concluído',
}

const columns: Status[] = ['Agendado', 'Em Atendimento', 'Concluído']

const AttendeeCard = ({ attendee }: { attendee: Attendee }) => {
  const {
    attributes,
    listeners,
    setNodeRef,
    transform,
    transition,
    isDragging,
  } = useSortable({ id: attendee.id, data: { type: 'Attendee', attendee } })

  const style = {
    transform: CSS.Transform.toString(transform),
    transition,
    opacity: isDragging ? 0.5 : 1,
  }

  return (
    <Card
      ref={setNodeRef}
      style={style}
      {...attributes}
      {...listeners}
      className='touch-none cursor-grab active:cursor-grabbing'
    >
      <CardHeader className='flex flex-row items-start justify-between p-4 pb-2'>
        <CardTitle className='text-base'>{attendee.patientName}</CardTitle>
        <MoreHorizontal className='h-4 w-4 text-muted-foreground' />
      </CardHeader>
      <CardContent className='p-4 pt-0 text-sm text-muted-foreground'>
        <p>{attendee.examType}</p>
        <p className='font-semibold text-xs'>{attendee.clientName}</p>
      </CardContent>
    </Card>
  )
}

const KanbanColumn = ({
  status,
  attendees,
}: {
  status: Status
  attendees: Attendee[]
}) => {
  const { setNodeRef } = useSortable({ id: status, data: { type: 'Column' } })

  return (
    <div
      ref={setNodeRef}
      className='flex h-full flex-col gap-4 rounded-lg bg-muted/50 p-4'
    >
      <h2 className='text-lg font-bold'>{statusLabels[status]}</h2>
      <SortableContext
        items={attendees.map((a) => a.id)}
        strategy={verticalListSortingStrategy}
      >
        <div className='flex flex-col gap-4 overflow-y-auto'>
          {attendees.map((attendee) => (
            <AttendeeCard key={attendee.id} attendee={attendee} />
          ))}
          {attendees.length === 0 && (
            <div className='py-8 text-center text-sm text-muted-foreground'>
              Nenhum atendimento nesta coluna.
            </div>
          )}
        </div>
      </SortableContext>
    </div>
  )
}

const PlaceholderContent = ({ title }: { title: string }) => (
  <Card>
    <CardContent className='flex items-center justify-center h-96'>
      <p className='text-muted-foreground'>A fila de {title} aparecerá aqui.</p>
    </CardContent>
  </Card>
)

export default function QueuePage() {
  const [attendees, setAttendees] = useState<Attendee[]>(initialAttendees)
  const [activeAttendee, setActiveAttendee] = useState<Attendee | null>(null)
  const [isAddDialogOpen, setIsAddDialogOpen] = useState(false)
  const { toast } = useToast()
  const [selectedUnit, setSelectedUnit] = useState(aptaServiceUnits[0].id)

  const sensors = useSensors(
    useSensor(PointerSensor, {
      activationConstraint: {
        distance: 8,
      },
    })
  )

  const handleDragStart = (event: DragStartEvent) => {
    if (event.active.data.current?.type === 'Attendee') {
      setActiveAttendee(event.active.data.current.attendee)
    }
  }

  const handleDragOver = (event: DragOverEvent) => {
    const { active, over } = event
    if (!over) return

    const activeId = active.id
    const overId = over.id

    if (activeId === overId) return

    const isActiveAnAttendee = active.data.current?.type === 'Attendee'
    const isOverAColumn = over.data.current?.type === 'Column'

    if (isActiveAnAttendee && isOverAColumn) {
      setAttendees((attendees) => {
        const activeIndex = attendees.findIndex((t) => t.id === activeId)
        attendees[activeIndex].status = overId as Status
        return [...attendees]
      })
    }
  }

  const handleDragEnd = (event: DragEndEvent) => {
    setActiveAttendee(null)
  }

  const handleAddAttendee = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault()
    const formData = new FormData(e.currentTarget)
    const clientName = formData.get('clientName') as string
    const employeeId = formData.get('employeeId') as string
    const examType = formData.get('examType') as string

    const patient = initialEmployeesData.find((emp) => emp.id === employeeId)

    if (!clientName || !patient || !examType) {
      toast({
        variant: 'destructive',
        title: 'Campos incompletos',
        description: 'Por favor, preencha todos os campos.',
      })
      return
    }

    const newAttendee: Attendee = {
      id: `att-${Date.now()}`,
      clientName,
      patientName: patient.name,
      examType,
      status: 'Agendado',
    }

    setAttendees((prev) => [newAttendee, ...prev])
    setIsAddDialogOpen(false)
    toast({
      title: 'Atendimento Agendado!',
      description: `${examType} para ${patient.name} foi adicionado à fila.`,
    })
  }

  return (
    <DndContext
      sensors={sensors}
      collisionDetection={closestCenter}
      onDragStart={handleDragStart}
      onDragEnd={handleDragEnd}
      onDragOver={handleDragOver}
    >
      <div className='flex h-full flex-col gap-4'>
        <div className='flex items-center justify-between'>
          <div className='flex items-center gap-4'>
            <h1 className='font-headline text-3xl font-bold'>
              Fila de Atendimento
            </h1>
            <Select value={selectedUnit} onValueChange={setSelectedUnit}>
              <SelectTrigger className='w-[280px]'>
                <SelectValue placeholder='Selecione a Unidade de Atendimento' />
              </SelectTrigger>
              <SelectContent>
                {aptaServiceUnits.map((unit) => (
                  <SelectItem key={unit.id} value={unit.id}>
                    {unit.name}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>
          <Dialog open={isAddDialogOpen} onOpenChange={setIsAddDialogOpen}>
            <DialogTrigger asChild>
              <Button>
                <PlusCircle className='mr-2 h-4 w-4' />
                Agendar Atendimento
              </Button>
            </DialogTrigger>
            <DialogContent>
              <DialogHeader>
                <DialogTitle>Agendar Novo Atendimento</DialogTitle>
                <DialogDescription>
                  Preencha os detalhes para criar um novo atendimento na fila.
                </DialogDescription>
              </DialogHeader>
              <form id='add-attendee-form' onSubmit={handleAddAttendee}>
                <div className='grid gap-4 py-4'>
                  <div className='space-y-2'>
                    <Label htmlFor='clientName'>Empresa Cliente</Label>
                    <Select name='clientName' required>
                      <SelectTrigger>
                        <SelectValue placeholder='Selecione a empresa' />
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
                  <div className='space-y-2'>
                    <Label htmlFor='employeeId'>Paciente</Label>
                    <Select name='employeeId' required>
                      <SelectTrigger>
                        <SelectValue placeholder='Selecione o colaborador' />
                      </SelectTrigger>
                      <SelectContent>
                        {initialEmployeesData.map((employee) => (
                          <SelectItem key={employee.id} value={employee.id}>
                            {employee.name}
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                  </div>
                  <div className='space-y-2'>
                    <Label htmlFor='examType'>Tipo de Exame/Atendimento</Label>
                    <Input
                      id='examType'
                      name='examType'
                      placeholder='Ex: ASO Admissional, Avaliação Clínica...'
                      required
                    />
                  </div>
                </div>
              </form>
              <DialogFooter>
                <Button
                  variant='outline'
                  onClick={() => setIsAddDialogOpen(false)}
                >
                  Cancelar
                </Button>
                <Button type='submit' form='add-attendee-form'>
                  Agendar
                </Button>
              </DialogFooter>
            </DialogContent>
          </Dialog>
        </div>

        <Tabs defaultValue='medico'>
          <TabsList>
            <TabsTrigger value='medico'>Atendimento Médico</TabsTrigger>
            <TabsTrigger value='audiometria'>Audiometria</TabsTrigger>
            <TabsTrigger value='laboratorio'>Exames Laboratoriais</TabsTrigger>
            <TabsTrigger value='rx'>Raio-X</TabsTrigger>
            <TabsTrigger value='graficos'>Exames Gráficos</TabsTrigger>
          </TabsList>
          <TabsContent value='medico' className='mt-4'>
            <div className='grid flex-1 grid-cols-1 items-start gap-6 md:grid-cols-3'>
              <SortableContext items={columns}>
                {columns.map((status) => (
                  <KanbanColumn
                    key={status}
                    status={status}
                    attendees={attendees.filter(
                      (attendee) => attendee.status === status
                    )}
                  />
                ))}
              </SortableContext>
            </div>
          </TabsContent>
          <TabsContent value='audiometria' className='mt-4'>
            <PlaceholderContent title='Audiometria' />
          </TabsContent>
          <TabsContent value='laboratorio' className='mt-4'>
            <PlaceholderContent title='Exames Laboratoriais' />
          </TabsContent>
          <TabsContent value='rx' className='mt-4'>
            <PlaceholderContent title='Raio-X' />
          </TabsContent>
          <TabsContent value='graficos' className='mt-4'>
            <PlaceholderContent title='Exames Gráficos' />
          </TabsContent>
        </Tabs>
      </div>
      <DragOverlay>
        {activeAttendee ? (
          <Card className='cursor-grabbing transform-gpu rotate-3 shadow-lg'>
            <CardHeader className='flex flex-row items-start justify-between p-4 pb-2'>
              <CardTitle className='text-base'>
                {activeAttendee.patientName}
              </CardTitle>
            </CardHeader>
            <CardContent className='p-4 pt-0 text-sm text-muted-foreground'>
              <p>{activeAttendee.examType}</p>
              <p className='font-semibold text-xs'>
                {activeAttendee.clientName}
              </p>
            </CardContent>
          </Card>
        ) : null}
      </DragOverlay>
    </DndContext>
  )
}
