
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
import { PlusCircle, MoreHorizontal, UserCheck, Upload, Search, Loader2 } from 'lucide-react'
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
import { useToast } from '@/hooks/use-toast'
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs'
import { aptaServiceUnits } from './data'
import { useAttendeeStore, type Attendee, type Status } from './attendee-store'
import { useRouter } from 'next/navigation'
import { cn } from '@/lib/utils'
import { useCollection, useFirestore, useMemoFirebase } from '@/firebase'
import { collection } from 'firebase/firestore'
import type { Client } from '@/lib/types/client'
import type { Employee } from '../../clients/[contractId]/employees/data'


const statusLabels: Record<Status, string> = {
  Agendado: 'Agendado',
  Aguardando: 'Aguardando',
  'Em Atendimento': 'Em Atendimento',
  Concluído: 'Concluído',
  Cancelado: 'Cancelado',
}

type QueueType = 'medico' | 'audiometria' | 'laboratorio' | 'rx' | 'graficos'

const columns: Status[] = [
  'Agendado',
  'Aguardando',
  'Em Atendimento',
  'Concluído',
]

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

const AttendeeCard = ({ attendee }: { attendee: Attendee }) => {
  const router = useRouter()
  const { updateAttendeeStatus } = useAttendeeStore()
  const {
    attributes,
    listeners,
    setNodeRef,
    transform,
    transition,
    isDragging,
  } = useSortable({
    id: attendee.id,
    data: { type: 'Attendee', attendee },
    disabled: attendee.status === 'Em Atendimento',
  })

  const style = {
    transform: CSS.Transform.toString(transform),
    transition,
    opacity: isDragging ? 0.5 : 1,
  }

  const handleCardClick = () => {
    if (attendee.status === 'Aguardando' || attendee.status === 'Em Atendimento') {
      if(attendee.status === 'Aguardando') {
        updateAttendeeStatus(attendee.id, 'Em Atendimento')
      }
      router.push(`/dashboard/health/evaluation/${attendee.id}`)
    }
  }

  const handleCheckIn = (e: React.MouseEvent) => {
    e.stopPropagation()
    updateAttendeeStatus(attendee.id, 'Aguardando')
  }

  const isBusy = attendee.status === 'Em Atendimento'
  const isClickable = attendee.status === 'Aguardando' || isBusy;

  return (
    <Card
      ref={setNodeRef}
      style={style}
      className={cn(
        'touch-none',
        isClickable ? 'cursor-pointer' : 'cursor-grab active:cursor-grabbing',
        isBusy && 'bg-blue-100 dark:bg-blue-900/50 border-blue-400'
      )}
      {...attributes}
      {...listeners}
      onClick={handleCardClick}
    >
      <div className='p-4'>
        <CardHeader className='flex flex-row items-start justify-between p-0 pb-2'>
          <CardTitle className='text-base'>{attendee.patientName}</CardTitle>
          <MoreHorizontal className='h-4 w-4 text-muted-foreground' />
        </CardHeader>
        <CardContent className='p-0 text-sm text-muted-foreground'>
          <p>{attendee.solicitationType}</p>
          <p className='font-semibold text-xs'>{attendee.clientName}</p>
        </CardContent>
      </div>
      {attendee.status === 'Agendado' && (
        <CardFooter className='p-2 border-t'>
          <Button
            size='sm'
            variant='secondary'
            className='w-full'
            onClick={handleCheckIn}
          >
            <UserCheck className='mr-2 h-4 w-4' />
            Confirmar Chegada
          </Button>
        </CardFooter>
      )}
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

  const sortedAttendees = useMemo(() => {
    switch (status) {
      case 'Agendado':
        return [...attendees].sort((a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime());
      case 'Aguardando':
        return [...attendees].sort((a, b) => {
          const timeA = a.checkInTime ? new Date(a.checkInTime).getTime() : 0;
          const timeB = b.checkInTime ? new Date(b.checkInTime).getTime() : 0;
          return timeA - timeB;
        });
      default:
        return attendees;
    }
  }, [attendees, status]);


  return (
    <div
      ref={setNodeRef}
      className='flex h-full flex-col gap-4 rounded-lg bg-muted/50 p-4'
    >
      <h2 className='text-lg font-bold'>{statusLabels[status]}</h2>
      <SortableContext
        items={sortedAttendees.map((a) => a.id)}
        strategy={verticalListSortingStrategy}
      >
        <div className='flex flex-col gap-4 overflow-y-auto'>
          {sortedAttendees.map((attendee) => (
            <AttendeeCard
              key={attendee.id}
              attendee={attendee}
            />
          ))}
          {sortedAttendees.length === 0 && (
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
  const { attendees, addAttendee, updateAttendeeStatus } = useAttendeeStore()
  const firestore = useFirestore()
  
  const clientsRef = useMemoFirebase(() => (firestore ? collection(firestore, 'clients') : null), [firestore]);
  const { data: clientsData, isLoading: areClientsLoading } = useCollection<Client>(clientsRef);

  const [selectedClientId, setSelectedClientId] = useState<string | null>(null);
  
  const employeesRef = useMemoFirebase(() => (firestore && selectedClientId) ? collection(firestore, `clients/${selectedClientId}/staffs`) : null, [firestore, selectedClientId]);
  const { data: employeesData, isLoading: areEmployeesLoading } = useCollection<Employee>(employeesRef);


  const [activeAttendee, setActiveAttendee] = useState<Attendee | null>(null)
  const [isAddDialogOpen, setIsAddDialogOpen] = useState(false)
  const [isImportDialogOpen, setIsImportDialogOpen] = useState(false)
  const { toast } = useToast()
  const [selectedUnit, setSelectedUnit] = useState(aptaServiceUnits[0].id)
  const [activeTab, setActiveTab] = useState<QueueType>('medico')
  const [searchTerm, setSearchTerm] = useState('')

  const filteredAttendees = useMemo(() => {
    if (!searchTerm) return attendees
    return attendees.filter(attendee => 
      attendee.patientName.toLowerCase().includes(searchTerm.toLowerCase())
    )
  }, [attendees, searchTerm])

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
      updateAttendeeStatus(activeId as string, overId as Status)
    }
  }

  const handleDragEnd = (event: DragEndEvent) => {
    setActiveAttendee(null)
  }

  const handleAddAttendee = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault()
    const formData = new FormData(e.currentTarget)
    const clientId = formData.get('clientName') as string
    const employeeId = formData.get('employeeId') as string
    const solicitationType = formData.get('solicitationType') as string

    const client = clientsData?.find(c => c.id === clientId);
    const patient = employeesData?.find((emp) => emp.id === employeeId)

    if (!client || !patient || !solicitationType) {
      toast({
        variant: 'destructive',
        title: 'Campos incompletos',
        description: 'Por favor, preencha todos os campos.',
      })
      return
    }

    addAttendee({
      clientName: client.name,
      patientName: patient.name,
      solicitationType,
      exams: [
        {
          id: `EXM-${Date.now()}-1`,
          name: 'Avaliação Clínica',
          status: 'Pendente',
        },
        {
          id: `EXM-${Date.now()}-2`,
          name: 'Audiometria',
          status: 'Pendente',
        },
      ],
    })

    setIsAddDialogOpen(false)
    toast({
      title: 'Atendimento Agendado!',
      description: `${solicitationType} para ${patient.name} foi adicionado à fila.`,
    })
  }

  const handleImportXml = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault()
    toast({
      title: 'Importação Iniciada!',
      description:
        'O arquivo está sendo processado. Os status dos exames serão atualizados em breve.',
    })
    setIsImportDialogOpen(false)
  }
  
  const isLoading = areClientsLoading || areEmployeesLoading;

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
        <div className='flex items-center gap-2'>
          <Dialog
            open={isImportDialogOpen}
            onOpenChange={setIsImportDialogOpen}
          >
            <DialogTrigger asChild>
              <Button variant='outline'>
                <Upload className='mr-2 h-4 w-4' />
                Importar Resultados
              </Button>
            </DialogTrigger>
            <DialogContent>
              <DialogHeader>
                <DialogTitle>Importar Resultados de Exames</DialogTitle>
                <DialogDescription>
                  Carregue o arquivo XML ou CSV fornecido pelo laboratório para
                  atualizar os resultados em lote.
                </DialogDescription>
              </DialogHeader>
              <form id='import-file-form' onSubmit={handleImportXml}>
                <div className='grid gap-4 py-4'>
                  <div className='space-y-2'>
                    <Label htmlFor='results-file'>Arquivo (XML ou CSV)</Label>
                    <Input
                      id='results-file'
                      name='results-file'
                      type='file'
                      accept='.xml,.csv'
                      required
                    />
                  </div>
                </div>
              </form>
              <DialogFooter>
                <Button
                  variant='outline'
                  onClick={() => setIsImportDialogOpen(false)}
                >
                  Cancelar
                </Button>
                <Button type='submit' form='import-file-form'>
                  Importar
                </Button>
              </DialogFooter>
            </DialogContent>
          </Dialog>

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
                    <Select name='clientName' required onValueChange={setSelectedClientId}>
                      <SelectTrigger>
                        <SelectValue placeholder='Selecione a empresa' />
                      </SelectTrigger>
                      <SelectContent>
                        {areClientsLoading ? <Loader2 className="mx-auto animate-spin" /> : clientsData?.map((client) => (
                          <SelectItem
                            key={client.id}
                            value={client.id}
                          >
                            {client.name}
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                  </div>
                  <div className='space-y-2'>
                    <Label htmlFor='employeeId'>Paciente</Label>
                    <Select name='employeeId' required disabled={!selectedClientId || areEmployeesLoading}>
                      <SelectTrigger>
                        <SelectValue placeholder='Selecione o colaborador' />
                      </SelectTrigger>
                      <SelectContent>
                        {areEmployeesLoading ? <Loader2 className="mx-auto animate-spin" /> : employeesData?.map((employee) => (
                          <SelectItem key={employee.id} value={employee.id}>
                            {employee.name}
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                  </div>
                  <div className='space-y-2'>
                    <Label htmlFor='solicitationType'>
                      Tipo de Solicitação
                    </Label>
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
      </div>

      <div className='relative w-full max-w-sm'>
        <Search className='absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground' />
        <Input
          placeholder='Buscar paciente...'
          className='pl-8'
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
        />
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
              <div className='grid flex-1 grid-cols-1 items-start gap-6 md:grid-cols-4'>
                <SortableContext items={columns}>
                  {columns.map((status) => (
                    <KanbanColumn
                      key={status}
                      status={status}
                      attendees={filteredAttendees.filter(
                        (attendee) => attendee.status === status
                      )}
                    />
                  ))}
                </SortableContext>
              </div>
              <DragOverlay>
                {activeAttendee ? (
                  <Card className='cursor-grabbing transform-gpu rotate-3 shadow-lg'>
                    <div className='p-4'>
                      <CardHeader className='flex flex-row items-start justify-between p-0 pb-2'>
                        <CardTitle className='text-base'>
                          {activeAttendee.patientName}
                        </CardTitle>
                      </CardHeader>
                      <CardContent className='p-0 text-sm text-muted-foreground'>
                        <p>{activeAttendee.solicitationType}</p>
                        <p className='font-semibold text-xs'>
                          {activeAttendee.clientName}
                        </p>
                      </CardContent>
                    </div>
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
