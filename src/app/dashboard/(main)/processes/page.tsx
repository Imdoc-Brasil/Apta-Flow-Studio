
'use client';

import { useState } from 'react';
import {
  DndContext,
  closestCenter,
  DragEndEvent,
  DragStartEvent,
  DragOverlay,
  PointerSensor,
  useSensor,
  useSensors,
} from '@dnd-kit/core';
import {
  SortableContext,
  verticalListSortingStrategy,
  useSortable,
} from '@dnd-kit/sortable';
import { CSS } from '@dnd-kit/utilities';
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
} from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { MoreHorizontal, PlusCircle, AlignLeft, Tag, CheckSquare, UserPlus, Calendar, Paperclip } from 'lucide-react';
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
  DialogFooter,
  DialogDescription,
} from '@/components/ui/dialog';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';

type TaskStatus = 'Backlog' | 'In Progress' | 'Done';

interface Task {
  id: string;
  title: string;
  description: string;
  status: TaskStatus;
}

const initialTasks: Task[] = [
  { id: '1', title: 'Desenvolver Recurso de Login', description: 'Implementar autenticação com email e senha.', status: 'In Progress' },
  { id: '2', title: 'Configurar Ambiente de Staging', description: 'Preparar servidor para testes.', status: 'Backlog' },
  { id: '3', title: 'Criar Documentação da API', description: 'Detalhar todos os endpoints disponíveis.', status: 'Done' },
  { id: '4', title: 'Testar Responsividade Mobile', description: 'Verificar layout em diversos dispositivos.', status: 'Backlog' },
];

const statusLabels: Record<TaskStatus, string> = {
  'Backlog': 'Backlog',
  'In Progress': 'Em Progresso',
  'Done': 'Concluído',
};

const columns: TaskStatus[] = ['Backlog', 'In Progress', 'Done'];

const TaskCard = ({ task }: { task: Task }) => {
    const { attributes, listeners, setNodeRef, transform, transition, isDragging } = useSortable({ id: task.id });

    const style = {
        transform: CSS.Transform.toString(transform),
        transition,
        opacity: isDragging ? 0.5 : 1,
    };
    
    return (
        <Dialog>
            <Card ref={setNodeRef} style={style} {...attributes} {...listeners} className="cursor-grab active:cursor-grabbing touch-none">
                <DialogTrigger asChild>
                    <div>
                        <CardHeader className="p-4 flex flex-row items-start justify-between">
                            <CardTitle className="text-base">{task.title}</CardTitle>
                        </CardHeader>
                        <CardContent className="p-4 pt-0">
                            <p className="text-sm text-muted-foreground line-clamp-2">
                                {task.description}
                            </p>
                        </CardContent>
                    </div>
                </DialogTrigger>
            </Card>
            <DialogContent className="sm:max-w-2xl">
                <DialogHeader>
                    <DialogTitle className="text-2xl font-bold">{task.title}</DialogTitle>
                    <DialogDescription>
                        Na coluna {statusLabels[task.status]}
                    </DialogDescription>
                </DialogHeader>
                <div className="grid grid-cols-3 gap-8 py-4">
                    <div className="col-span-2 space-y-6">
                        <div className="space-y-2">
                            <div className="flex items-center gap-2">
                                <AlignLeft className="h-5 w-5 text-muted-foreground" />
                                <h3 className="font-semibold">Descrição</h3>
                            </div>
                            <Textarea 
                                placeholder="Adicione uma descrição mais detalhada..." 
                                defaultValue={task.description} 
                                className="ml-7 h-24"
                            />
                        </div>
                    </div>
                    
                    <div className="col-span-1 space-y-4">
                        <h3 className="font-semibold text-sm">Adicionar ao cartão</h3>
                        <div className="flex flex-col space-y-2">
                            <Button variant="secondary" className="justify-start">
                                <UserPlus className="mr-2 h-4 w-4"/> Membros
                            </Button>
                            <Button variant="secondary" className="justify-start">
                                <Tag className="mr-2 h-4 w-4"/> Etiquetas
                            </Button>
                            <Button variant="secondary" className="justify-start">
                                <CheckSquare className="mr-2 h-4 w-4"/> Checklist
                            </Button>
                            <Button variant="secondary" className="justify-start">
                                <Calendar className="mr-2 h-4 w-4"/> Datas
                            </Button>
                            <Button variant="secondary" className="justify-start">
                                <Paperclip className="mr-2 h-4 w-4"/> Anexo
                            </Button>
                        </div>
                    </div>
                </div>
            </DialogContent>
        </Dialog>
    );
};

const KanbanColumn = ({ status, tasks }: { status: TaskStatus, tasks: Task[] }) => {
    const { setNodeRef } = useSortable({ id: status });
    
    return (
        <div ref={setNodeRef} className="flex flex-col gap-4 bg-muted/50 p-4 rounded-lg h-full">
            <h2 className="font-bold text-lg">{statusLabels[status]}</h2>
            <SortableContext items={tasks.map(t => t.id)} strategy={verticalListSortingStrategy}>
                <div className="flex flex-col gap-4 overflow-y-auto">
                    {tasks.map(task => <TaskCard key={task.id} task={task} />)}
                    {tasks.length === 0 && (
                        <div className="text-center text-sm text-muted-foreground py-8">
                            Nenhuma tarefa nesta coluna.
                        </div>
                    )}
                </div>
            </SortableContext>
        </div>
    );
};


export default function ProcessesPage() {
  const [tasks, setTasks] = useState<Task[]>(initialTasks);
  const [isNewTaskDialogOpen, setIsNewTaskDialogOpen] = useState(false);
  const [activeTask, setActiveTask] = useState<Task | null>(null);
  
  const sensors = useSensors(
    useSensor(PointerSensor, {
      activationConstraint: {
        distance: 8,
      },
    })
  );

  const handleAddTask = (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    const formData = new FormData(event.currentTarget);
    const newTask: Task = {
      id: `task-${Date.now()}`,
      title: formData.get('title') as string,
      description: formData.get('description') as string,
      status: 'Backlog',
    };
    setTasks(prevTasks => [...prevTasks, newTask]);
    setIsNewTaskDialogOpen(false);
  };
  
    const handleDragStart = (event: DragStartEvent) => {
        const { active } = event;
        const task = tasks.find(t => t.id === active.id);
        if (task) {
            setActiveTask(task);
        }
    };
    
    const handleDragEnd = (event: DragEndEvent) => {
        const { active, over } = event;
        setActiveTask(null);

        if (over && active.id !== over.id) {
            setTasks(items => {
                const activeIndex = items.findIndex(item => item.id === active.id);
                
                // If over.id is a column status
                const isOverColumn = columns.includes(over.id as TaskStatus);
                if (isOverColumn) {
                    const newItems = [...items];
                    newItems[activeIndex].status = over.id as TaskStatus;
                    return newItems;
                }
                
                // If over.id is another task
                const overIndex = items.findIndex(item => item.id === over.id);
                if (items[activeIndex].status !== items[overIndex].status) {
                     const newItems = [...items];
                     newItems[activeIndex].status = items[overIndex].status;
                     return newItems;
                }

                return items; // No change if dropped in the same place
            });
        }
    };


  return (
    <DndContext sensors={sensors} collisionDetection={closestCenter} onDragStart={handleDragStart} onDragEnd={handleDragEnd}>
        <div className="flex flex-col gap-4 h-full">
            <div className="flex items-center justify-between">
                    <h1 className="font-headline text-3xl font-bold">Quadro Kanban</h1>
                    <Dialog open={isNewTaskDialogOpen} onOpenChange={setIsNewTaskDialogOpen}>
                    <DialogTrigger asChild>
                        <Button>
                        <PlusCircle className="mr-2 h-4 w-4" />
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
                        <form id="add-task-form" onSubmit={handleAddTask}>
                        <div className="grid gap-4 py-4">
                            <div className="space-y-2">
                            <Label htmlFor="title">Título</Label>
                            <Input id="title" name="title" required />
                            </div>
                            <div className="space-y-2">
                            <Label htmlFor="description">Descrição</Label>
                            <Textarea id="description" name="description" />
                            </div>
                        </div>
                        <DialogFooter>
                            <Button variant="outline" onClick={() => setIsNewTaskDialogOpen(false)}>
                                Cancelar
                            </Button>
                            <Button type="submit" form="add-task-form">
                                Salvar
                            </Button>
                        </DialogFooter>
                        </form>
                    </DialogContent>
                    </Dialog>
                </div>

            <div className="flex-1 grid grid-cols-1 md:grid-cols-3 gap-6 items-start">
                {columns.map(status => (
                    <KanbanColumn
                        key={status}
                        status={status}
                        tasks={tasks.filter(task => task.status === status)}
                    />
                ))}
            </div>
        </div>
         <DragOverlay>
            {activeTask ? (
                 <Card className="cursor-grabbing transform-gpu rotate-3 shadow-lg">
                    <CardHeader className="p-4 flex flex-row items-start justify-between">
                        <CardTitle className="text-base">{activeTask.title}</CardTitle>
                    </CardHeader>
                    <CardContent className="p-4 pt-0">
                        <p className="text-sm text-muted-foreground line-clamp-2">
                            {activeTask.description}
                        </p>
                    </CardContent>
                </Card>
            ) : null}
        </DragOverlay>
    </DndContext>
  );
}
