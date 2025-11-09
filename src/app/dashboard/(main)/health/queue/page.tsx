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

export default function QueuePage() {
  const [attendees, setAttendees] = useState<Attendee[]>(initialAttendees)
  const [activeAttendee, setActiveAttendee] = useState<Attendee | null>(null)

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
          <h1 className='font-headline text-3xl font-bold'>
            Fila de Atendimento
          </h1>
          <Button>
            <PlusCircle className='mr-2 h-4 w-4' />
            Agendar Atendimento
          </Button>
        </div>

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
