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
} from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import {
  PlusCircle,
  AlignLeft,
  Tag,
  CheckSquare,
  UserPlus,
  Calendar,
  Paperclip,
  Sparkles,
} from 'lucide-react'
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
  DialogFooter,
  DialogDescription,
} from '@/components/ui/dialog'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Textarea } from '@/components/ui/textarea'
import { suggestProcessTool } from '@/app/actions'
import type { SuggestProcessToolOutput } from '@/app/actions'
import { useToast } from '@/hooks/use-toast'

type TaskStatus = 'Backlog' | 'In Progress' | 'Done'

interface Task {
  id: string
  title: string
  description: string
  status: TaskStatus
}

const initialTasks: Task[] = [
  {
    id: '1',
    title: 'Desenvolver Recurso de Login',
    description: 'Implementar autenticação com email e senha.',
    status: 'In Progress',
  },
  {
    id: '2',
    title: 'Configurar Ambiente de Staging',
    description: 'Preparar servidor para testes.',
    status: 'Backlog',
  },
  {
    id: '3',
    title: 'Criar Documentação da API',
    description: 'Detalhar todos os endpoints disponíveis.',
    status: 'Done',
  },
  {
    id: '4',
    title: 'Testar Responsividade Mobile',
    description: 'Verificar layout em diversos dispositivos.',
    status: 'Backlog',
  },
]

const statusLabels: Record<TaskStatus, string> = {
  Backlog: 'Backlog',
  'In Progress': 'Em Progresso',
  Done: 'Concluído',
}

const columns: TaskStatus[] = ['Backlog', 'In Progress', 'Done']

const TaskCard = ({ task }: { task: Task }) => {
  const {
    attributes,
    listeners,
    setNodeRef,
    transform,
    transition,
    isDragging,
  } = useSortable({ id: task.id, data: { type: 'Task', task } })

  const style = {
    transform: CSS.Transform.toString(transform),
    transition,
    opacity: isDragging ? 0.5 : 1,
  }

  return (
    <Dialog>
      <Card
        ref={setNodeRef}
        style={style}
        {...attributes}
        {...listeners}
        className='touch-none cursor-grab active:cursor-grabbing'
      >
        <DialogTrigger asChild>
          <div>
            <CardHeader className='flex flex-row items-start justify-between p-4'>
              <CardTitle className='text-base'>{task.title}</CardTitle>
            </CardHeader>
            <CardContent className='p-4 pt-0'>
              <p className='line-clamp-2 text-sm text-muted-foreground'>
                {task.description}
              </p>
            </CardContent>
          </div>
        </DialogTrigger>
      </Card>
      <DialogContent className='sm:max-w-2xl'>
        <DialogHeader>
          <DialogTitle className='text-2xl font-bold'>{task.title}</DialogTitle>
          <DialogDescription>
            Na coluna {statusLabels[task.status]}
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
                defaultValue={task.description}
                className='ml-7 h-24'
              />
            </div>
          </div>

          <div className='col-span-1 space-y-4'>
            <h3 className='text-sm font-semibold'>Adicionar ao cartão</h3>
            <div className='flex flex-col space-y-2'>
              <Button variant='secondary' className='justify-start'>
                <UserPlus className='mr-2 h-4 w-4' /> Membros
              </Button>
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
  tasks,
}: {
  status: TaskStatus
  tasks: Task[]
}) => {
  const { setNodeRef } = useSortable({ id: status, data: { type: 'Column' } })

  return (
    <div
      ref={setNodeRef}
      className='flex h-full flex-col gap-4 rounded-lg bg-muted/50 p-4'
    >
      <h2 className='text-lg font-bold'>{statusLabels[status]}</h2>
      <SortableContext
        items={tasks.map((t) => t.id)}
        strategy={verticalListSortingStrategy}
      >
        <div className='flex flex-col gap-4 overflow-y-auto'>
          {tasks.map((task) => (
            <TaskCard key={task.id} task={task} />
          ))}
          {tasks.length === 0 && (
            <div className='py-8 text-center text-sm text-muted-foreground'>
              Nenhuma tarefa nesta coluna.
            </div>
          )}
        </div>
      </SortableContext>
    </div>
  )
}

export default function ProcessesPage() {
  const [tasks, setTasks] = useState<Task[]>(initialTasks)
  const [isNewTaskDialogOpen, setIsNewTaskDialogOpen] = useState(false)
  const [activeTask, setActiveTask] = useState<Task | null>(null)
  const { toast } = useToast()

  const [isSuggestingTool, setIsSuggestingTool] = useState(false)
  const [suggestion, setSuggestion] =
    useState<SuggestProcessToolOutput | null>(null)
  const [projectDescriptionForAI, setProjectDescriptionForAI] = useState('')

  const sensors = useSensors(
    useSensor(PointerSensor, {
      activationConstraint: {
        distance: 8,
      },
    })
  )

  const handleSuggestTool = async () => {
    if (!projectDescriptionForAI) {
      toast({
        title: 'Descrição necessária',
        description:
          'Por favor, insira uma descrição para a IA sugerir uma ferramenta.',
        variant: 'destructive',
      })
      return
    }
    setIsSuggestingTool(true)
    setSuggestion(null)
    try {
      const result = await suggestProcessTool({
        projectDescription: projectDescriptionForAI,
      })
      setSuggestion(result)
    } catch (error) {
      console.error('Error suggesting tool:', error)
      toast({
        title: 'Erro na Sugestão',
        description: 'Não foi possível obter uma sugestão da IA.',
        variant: 'destructive',
      })
    } finally {
      setIsSuggestingTool(false)
    }
  }

  const handleAddTask = (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault()
    const formData = new FormData(event.currentTarget)
    const newTask: Task = {
      id: `task-${Date.now()}`,
      title: formData.get('title') as string,
      description: formData.get('description') as string,
      status: 'Backlog',
    }
    setTasks((prevTasks) => [...prevTasks, newTask])
    setIsNewTaskDialogOpen(false)
    setProjectDescriptionForAI('')
    setSuggestion(null)
  }

  const handleDragStart = (event: DragStartEvent) => {
    if (event.active.data.current?.type === 'Task') {
      setActiveTask(event.active.data.current.task)
    }
  }

  const handleDragOver = (event: DragOverEvent) => {
    const { active, over } = event
    if (!over) return

    const activeId = active.id
    const overId = over.id

    if (activeId === overId) return

    const isActiveATask = active.data.current?.type === 'Task'
    const isOverAColumn = over.data.current?.type === 'Column'

    if (isActiveATask && isOverAColumn) {
      setTasks((tasks) => {
        const activeIndex = tasks.findIndex((t) => t.id === activeId)
        tasks[activeIndex].status = overId as TaskStatus
        return [...tasks]
      })
    }
  }

  const handleDragEnd = (event: DragEndEvent) => {
    setActiveTask(null)
    const { active, over } = event
    if (!over) return

    const activeId = active.id
    const overId = over.id

    if (activeId === overId) return

    const isActiveATask = active.data.current?.type === 'Task'
    const isOverATask = over.data.current?.type === 'Task'

    if (isActiveATask && isOverATask) {
      setTasks((tasks) => {
        const activeIndex = tasks.findIndex((t) => t.id === activeId)
        const overIndex = tasks.findIndex((t) => t.id === overId)

        if (tasks[activeIndex].status !== tasks[overIndex].status) {
          tasks[activeIndex].status = tasks[overIndex].status
        }
        // Note: this is a simplified reordering logic.
        // A full implementation would use arrayMove.
        return [...tasks]
      })
    }
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
          <h1 className='font-headline text-3xl font-bold'>Quadro Kanban</h1>
          <Dialog
            open={isNewTaskDialogOpen}
            onOpenChange={setIsNewTaskDialogOpen}
          >
            <DialogTrigger asChild>
              <Button>
                <PlusCircle className='mr-2 h-4 w-4' />
                Adicionar Tarefa
              </Button>
            </DialogTrigger>
            <DialogContent>
              <DialogHeader>
                <DialogTitle>Nova Tarefa</DialogTitle>
                <DialogDescription>
                  Preencha os detalhes da nova tarefa para o quadro.
                </DialogDescription>
              </DialogHeader>
              <form id='add-task-form' onSubmit={handleAddTask}>
                <div className='grid gap-4 py-4'>
                  <div className='space-y-2'>
                    <Label htmlFor='title'>Título</Label>
                    <Input id='title' name='title' required />
                  </div>
                  <div className='space-y-2'>
                    <Label htmlFor='description'>Descrição</Label>
                    <Textarea
                      id='description'
                      name='description'
                      value={projectDescriptionForAI}
                      onChange={(e) =>
                        setProjectDescriptionForAI(e.target.value)
                      }
                    />
                  </div>
                  {isSuggestingTool && (
                    <div className='flex items-center justify-center p-4'>
                      <Sparkles className='mr-2 h-4 w-4 animate-spin' />
                      <span>Analisando...</span>
                    </div>
                  )}
                  {suggestion && (
                    <div className='mt-4 rounded-lg border bg-secondary/50 p-4'>
                      <h4 className='font-semibold'>Sugestão da IA ✨</h4>
                      <p className='text-sm'>
                        <span className='font-medium'>Ferramenta:</span>{' '}
                        {suggestion.toolName}
                      </p>
                      <p className='text-sm'>
                        <span className='font-medium'>Justificativa:</span>{' '}
                        {suggestion.justification}
                      </p>
                    </div>
                  )}
                </div>
                <DialogFooter>
                  <Button
                    type='button'
                    variant='outline'
                    onClick={handleSuggestTool}
                    disabled={isSuggestingTool}
                  >
                    <Sparkles className='mr-2 h-4 w-4' />
                    Sugerir Ferramenta com IA
                  </Button>
                  <Button
                    type='button'
                    variant='outline'
                    onClick={() => setIsNewTaskDialogOpen(false)}
                  >
                    Cancelar
                  </Button>
                  <Button type='submit' form='add-task-form'>
                    Salvar
                  </Button>
                </DialogFooter>
              </form>
            </DialogContent>
          </Dialog>
        </div>

        <div className='grid flex-1 grid-cols-1 items-start gap-6 md:grid-cols-3'>
          <SortableContext items={columns}>
            {columns.map((status) => (
              <KanbanColumn
                key={status}
                status={status}
                tasks={tasks.filter((task) => task.status === status)}
              />
            ))}
          </SortableContext>
        </div>
      </div>
      <DragOverlay>
        {activeTask ? (
          <Card className='cursor-grabbing transform-gpu rotate-3 shadow-lg'>
            <CardHeader className='flex flex-row items-start justify-between p-4'>
              <CardTitle className='text-base'>{activeTask.title}</CardTitle>
            </CardHeader>
            <CardContent className='p-4 pt-0'>
              <p className='line-clamp-2 text-sm text-muted-foreground'>
                {activeTask.description}
              </p>
            </CardContent>
          </Card>
        ) : null}
      </DragOverlay>
    </DndContext>
  )
}
