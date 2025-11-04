
'use client';

import { useState } from 'react';
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
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';

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

export default function ProcessesPage() {
  const [tasks, setTasks] = useState<Task[]>(initialTasks);
  const [isNewTaskDialogOpen, setIsNewTaskDialogOpen] = useState(false);
  
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
  
  const moveTask = (taskId: string, newStatus: TaskStatus) => {
    setTasks(tasks.map(task => task.id === taskId ? { ...task, status: newStatus } : task));
  };


  return (
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
          <div key={status} className="flex flex-col gap-4 bg-muted/50 p-4 rounded-lg h-full">
            <h2 className="font-bold text-lg">{statusLabels[status]}</h2>
            <div className="flex flex-col gap-4 overflow-y-auto">
              {tasks
                .filter(task => task.status === status)
                .map(task => (
                    <Dialog key={task.id}>
                        <DialogTrigger asChild>
                            <Card className="cursor-pointer">
                                <CardHeader className="p-4 flex flex-row items-start justify-between">
                                <CardTitle className="text-base">{task.title}</CardTitle>
                                <DropdownMenu>
                                    <DropdownMenuTrigger asChild>
                                    <Button variant="ghost" size="icon" className="h-6 w-6" onClick={(e) => e.stopPropagation()}>
                                        <MoreHorizontal className="h-4 w-4" />
                                    </Button>
                                    </DropdownMenuTrigger>
                                    <DropdownMenuContent onClick={(e) => e.stopPropagation()}>
                                    {columns.filter(col => col !== task.status).map(newStatus => (
                                        <DropdownMenuItem key={newStatus} onClick={() => moveTask(task.id, newStatus)}>
                                            Mover para {statusLabels[newStatus]}
                                        </DropdownMenuItem>
                                    ))}
                                    </DropdownMenuContent>
                                </DropdownMenu>
                                </CardHeader>
                                <CardContent className="p-4 pt-0">
                                <p className="text-sm text-muted-foreground line-clamp-2">
                                    {task.description}
                                </p>
                                </CardContent>
                            </Card>
                        </DialogTrigger>
                        <DialogContent className="sm:max-w-2xl">
                            <DialogHeader>
                                <DialogTitle className="text-2xl font-bold">{task.title}</DialogTitle>
                            </DialogHeader>
                            <div className="grid grid-cols-3 gap-8 py-4">
                                <div className="col-span-2 space-y-6">
                                    {/* Description Section */}
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
                ))}
                {tasks.filter(task => task.status === status).length === 0 && (
                    <div className="text-center text-sm text-muted-foreground py-8">
                        Nenhuma tarefa nesta coluna.
                    </div>
                )}
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
