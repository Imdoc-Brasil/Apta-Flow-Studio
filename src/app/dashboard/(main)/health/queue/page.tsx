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
import { useAttendeeStore, type Attendee, type Status } from './attendee-store'
import { useRouter } from 'next/navigation'

const statusLabels: Record<Status, string> = {
  Agendado: 'Agendado',
  'Em Atendimento': 'Em Atendimento',
  Concluído: 'Concluído',
}

type QueueType = 'medico' | 'audiometria' | 'laboratorio' | 'rx' | 'graficos'

const columns: Status[] = ['Agendado', 'Em Atendimento', 'Concluído']

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

const AttendeeCard = ({
  attendee,
  queueType,
}: {
  attendee: Attendee
  queueType: QueueType
}) => {
  const router = useRouter()
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

  const handleCardClick = () => {
    if (queueType === 'medico') {
      const clinicalExam = attendee.exams.find(
        (e) => e.name === 'Avaliação Clínica'
      )
      if (clinicalExam) {
        router.push(
          `/dashboard/health/evaluation/${attendee.id}/exam/${clinicalExam.id}`
        )
        return
      }
    }

    if (queueType === 'audiometria' && attendee.exams.length === 1) {
      router.push(
        `/dashboard/health/evaluation/${attendee.id}/exam/${attendee.exams[0].id}`
      )
      return
    }

    // Default behavior for other queues or complex cases
    router.push(`/dashboard/health/evaluation/${attendee.id}`)
  }

  return (
    <Card
      ref={setNodeRef}
      style={style}
      {...attributes}
      {...listeners}
      className='touch-none cursor-grab active:cursor-grabbing'
      onClick={handleCardClick}
    >
      <CardHeader className='flex flex-row items-start justify-between p-4 pb-2'>
        <CardTitle className='text-base'>{attendee.patientName}</CardTitle>
        <MoreHorizontal className='h-4 w-4 text-muted-foreground' />
      </CardHeader>
      <CardContent className='p-4 pt-0 text-sm text-muted-foreground'>
        <p>{attendee.solicitationType}</p>
        <p className='font-semibold text-xs'>{attendee.clientName}</p>
      </CardContent>
    </Card>
  )
}

const KanbanColumn = ({
  status,
  attendees,
  queueType,
}: {
  status: Status
  attendees: Attendee[]
  queueType: QueueType
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
            <AttendeeCard
              key={attendee.id}
              attendee={attendee}
              queueType={queueType}
            />
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
  const { attendees, addAttendee, setAttendees } = useAttendeeStore()
  const [activeAttendee, setActiveAttendee] = useState<Attendee | null>(null)
  const [isAddDialogOpen, setIsAddDialogOpen] = useState(false)
  const { toast } = useToast()
  const [selectedUnit, setSelectedUnit] = useState(aptaServiceUnits[0].id)
  const [activeTab, setActiveTab] = useState<QueueType>('medico')

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
      setAttendees(
        attendees.map((t) => {
          if (t.id === activeId) {
            return { ...t, status: overId as Status }
          }
          return t
        })
      )
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
    const solicitationType = formData.get('solicitationType') as string

    const patient = initialEmployeesData.find((emp) => emp.id === employeeId)

    if (!clientName || !patient || !solicitationType) {
      toast({
        variant: 'destructive',
        title: 'Campos incompletos',
        description: 'Por favor, preencha todos os campos.',
      })
      return
    }

    addAttendee({
      clientName,
      patientName: patient.name,
      solicitationType,
      status: 'Agendado',
      // This is a simplified logic. In a real scenario, this would query the PCMSO
      // based on the solicitationType and employee's role/risks.
      exams: [
        { id: `EXM-${Date.now()}-1`, name: 'Avaliação Clínica', status: 'Pendente' },
        { id: `EXM-${Date.now()}-2`, name: 'Audiometria', status: 'Pendente' },
      ],
    })

    setIsAddDialogOpen(false)
    toast({
      title: 'Atendimento Agendado!',
      description: `${solicitationType} para ${patient.name} foi adicionado à fila.`,
    })
  }

  return (
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
                  <Label htmlFor='solicitationType'>Tipo de Solicitação</Label>
                  <Input
                    id='solicitationType'
                    name='solicitationType'
                    placeholder='Ex: ASO Admissional, ASO Periódico...'
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

      <Tabs
        defaultValue='medico'
        onValueChange={(value) => setActiveTab(value as QueueType)}
      >
        <TabsList>
          <TabsTrigger value='medico'>Atendimento Médico</TabsTrigger>
          <TabsTrigger value='audiometria'>Audiometria</TabsTrigger>
          <TabsTrigger value='laboratorio'>Exames Laboratoriais</TabsTrigger>
          <TabsTrigger value='rx'>Raio-X</TabsTrigger>
          <TabsTrigger value='graficos'>Exames Gráficos</TabsTrigger>
        </TabsList>
        <TabsContent value='medico' className='mt-4'>
          <ClientOnly>
            <DndContext
              sensors={sensors}
              collisionDetection={closestCenter}
              onDragStart={handleDragStart}
              onDragEnd={handleDragEnd}
              onDragOver={handleDragOver}
            >
              <div className='grid flex-1 grid-cols-1 items-start gap-6 md:grid-cols-3'>
                <SortableContext items={columns}>
                  {columns.map((status) => (
                    <KanbanColumn
                      key={status}
                      status={status}
                      attendees={attendees.filter(
                        (attendee) => attendee.status === status
                      )}
                      queueType={activeTab}
                    />
                  ))}
                </SortableContext>
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
                      <p>{activeAttendee.solicitationType}</p>
                      <p className='font-semibold text-xs'>
                        {activeAttendee.clientName}
                      </p>
                    </CardContent>
                  </Card>
                ) : null}
              </DragOverlay>
            </DndContext>
          </ClientOnly>
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
  )
}
