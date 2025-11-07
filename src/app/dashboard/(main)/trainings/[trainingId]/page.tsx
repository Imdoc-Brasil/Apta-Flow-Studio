
'use client'

import { useState } from 'react'
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import {
  PlusCircle,
  Youtube,
  FileText,
  HelpCircle,
  Pencil,
  Trash2,
} from 'lucide-react'
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
import { Textarea } from '@/components/ui/textarea'

// Mock Data - In a real app, this would come from an API
export type TrainingModality = 'Online' | 'Presencial' | 'Híbrido'
export type TrainingType = 'NR' | 'Uso de EPI' | 'Procedimento Interno' | 'Outro'
export type ModuleType = 'Video' | 'Texto' | 'Quiz'

export interface TrainingModule {
  id: string
  title: string
  type: ModuleType
  content: string // URL for video, markdown for text, JSON for quiz
}

export interface Training {
  id: string
  title: string
  description: string
  type: TrainingType
  modality: TrainingModality
  workload: number // in hours
  modules: TrainingModule[]
}

const initialTraining: Training = {
  id: 'TRN-001',
  title: 'NR-35 - Trabalho em Altura',
  description:
    'Capacitação para planejamento, organização e execução de trabalho em altura.',
  type: 'NR',
  modality: 'Híbrido',
  workload: 8,
  modules: [
    {
      id: 'MOD-01',
      title: 'Introdução à NR-35',
      type: 'Texto',
      content:
        'A NR-35 estabelece os requisitos mínimos e as medidas de proteção para o trabalho em altura, envolvendo o planejamento, a organização e a execução, de forma a garantir a segurança e a saúde dos trabalhadores envolvidos direta ou indiretamente com esta atividade.',
    },
    {
      id: 'MOD-02',
      title: 'Equipamentos de Proteção Individual (EPIs)',
      type: 'Video',
      content: 'https://www.youtube.com/watch?v=dQw4w9WgXcQ', // Example video
    },
  ],
}

const getModuleIcon = (type: ModuleType) => {
  switch (type) {
    case 'Video':
      return <Youtube className='h-5 w-5 text-red-600' />
    case 'Texto':
      return <FileText className='h-5 w-5 text-blue-600' />
    case 'Quiz':
      return <HelpCircle className='h-5 w-5 text-green-600' />
    default:
      return <FileText className='h-5 w-5' />
  }
}

export default function EditTrainingPage({
  params,
}: {
  params: { trainingId: string }
}) {
  const [training, setTraining] = useState(initialTraining)
  const [isModuleDialogOpen, setIsModuleDialogOpen] = useState(false)
  const [editingModule, setEditingModule] = useState<TrainingModule | null>(
    null
  )
  const { toast } = useToast()
  const [moduleType, setModuleType] = useState<ModuleType>('Texto')

  const handleModuleSubmit = (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault()
    const formData = new FormData(event.currentTarget)
    const newModule: TrainingModule = {
      id: editingModule?.id || `MOD-${Date.now()}`,
      title: formData.get('title') as string,
      type: formData.get('type') as ModuleType,
      content: formData.get('content') as string,
    }

    if (editingModule) {
      setTraining((prev) => ({
        ...prev,
        modules: prev.modules.map((m) =>
          m.id === editingModule.id ? newModule : m
        ),
      }))
      toast({ title: 'Módulo Atualizado!' })
    } else {
      setTraining((prev) => ({
        ...prev,
        modules: [...prev.modules, newModule],
      }))
      toast({ title: 'Módulo Adicionado!' })
    }

    setIsModuleDialogOpen(false)
    setEditingModule(null)
  }

  const openModuleDialog = (module: TrainingModule | null) => {
    setEditingModule(module)
    setModuleType(module?.type || 'Texto')
    setIsModuleDialogOpen(true)
  }
  
  const deleteModule = (moduleId: string) => {
    setTraining(prev => ({
        ...prev,
        modules: prev.modules.filter(m => m.id !== moduleId)
    }))
    toast({ variant: "destructive", title: "Módulo Removido!"})
  }

  return (
    <div className='grid flex-1 auto-rows-max gap-4'>
      <Card>
        <CardHeader>
          <CardTitle className='text-3xl'>{training.title}</CardTitle>
          <CardDescription className='text-base'>
            {training.description}
          </CardDescription>
          <div className='flex gap-4 pt-2'>
            <Badge variant='secondary'>{training.type}</Badge>
            <Badge variant='outline'>{training.modality}</Badge>
            <Badge variant='outline'>{training.workload} horas</Badge>
          </div>
        </CardHeader>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle>Módulos do Curso</CardTitle>
          <CardDescription>
            Adicione e organize o conteúdo do treinamento.
          </CardDescription>
          <div className='flex justify-end pt-4'>
            <Button onClick={() => openModuleDialog(null)}>
              <PlusCircle className='mr-2 h-4 w-4' /> Adicionar Módulo
            </Button>
          </div>
        </CardHeader>
        <CardContent>
          {training.modules.length > 0 ? (
            <div className='space-y-4'>
              {training.modules.map((module) => (
                <Card key={module.id} className='flex items-center p-4'>
                  <div className='flex items-center gap-4 flex-grow'>
                    {getModuleIcon(module.type)}
                    <div className='flex-grow'>
                      <h3 className='font-semibold'>{module.title}</h3>
                      <p className='text-sm text-muted-foreground truncate'>
                        {module.type}: {module.content}
                      </p>
                    </div>
                  </div>
                  <div className='flex items-center gap-2'>
                    <Button
                      variant='ghost'
                      size='icon'
                      onClick={() => openModuleDialog(module)}
                    >
                      <Pencil className='h-4 w-4' />
                    </Button>
                    <Button
                      variant='ghost'
                      size='icon'
                      className='text-destructive hover:text-destructive'
                      onClick={() => deleteModule(module.id)}
                    >
                      <Trash2 className='h-4 w-4' />
                    </Button>
                  </div>
                </Card>
              ))}
            </div>
          ) : (
            <div className='text-center py-12'>
              <p className='text-muted-foreground'>
                Nenhum módulo adicionado ainda.
              </p>
              <Button
                variant='link'
                className='mt-2'
                onClick={() => openModuleDialog(null)}
              >
                Adicionar o primeiro módulo
              </Button>
            </div>
          )}
        </CardContent>
      </Card>

      <Dialog
        open={isModuleDialogOpen}
        onOpenChange={setIsModuleDialogOpen}
      >
        <DialogContent className='sm:max-w-lg'>
          <DialogHeader>
            <DialogTitle>
              {editingModule ? 'Editar' : 'Adicionar'} Módulo
            </DialogTitle>
          </DialogHeader>
          <form id='module-form' onSubmit={handleModuleSubmit}>
            <div className='grid gap-4 py-4'>
              <div className='space-y-2'>
                <Label htmlFor='title'>Título do Módulo</Label>
                <Input
                  id='title'
                  name='title'
                  defaultValue={editingModule?.title}
                  required
                />
              </div>
              <div className='space-y-2'>
                <Label htmlFor='type'>Tipo de Conteúdo</Label>
                <Select
                  name='type'
                  defaultValue={editingModule?.type || 'Texto'}
                  onValueChange={(value) => setModuleType(value as ModuleType)}
                  required
                >
                  <SelectTrigger>
                    <SelectValue placeholder='Selecione o tipo' />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value='Texto'>Texto</SelectItem>
                    <SelectItem value='Video'>Vídeo (YouTube)</SelectItem>
                    <SelectItem value='Quiz' disabled>
                      Quiz (em breve)
                    </SelectItem>
                  </SelectContent>
                </Select>
              </div>

              {moduleType === 'Video' && (
                <div className='space-y-2'>
                  <Label htmlFor='content'>URL do Vídeo no YouTube</Label>
                  <Input
                    id='content'
                    name='content'
                    placeholder='https://www.youtube.com/watch?v=...'
                    defaultValue={
                      editingModule?.type === 'Video'
                        ? editingModule.content
                        : ''
                    }
                    required
                  />
                </div>
              )}

              {moduleType === 'Texto' && (
                <div className='space-y-2'>
                  <Label htmlFor='content'>Conteúdo do Texto</Label>
                  <Textarea
                    id='content'
                    name='content'
                    placeholder='Escreva o conteúdo do módulo aqui... (suporta Markdown)'
                    defaultValue={
                      editingModule?.type === 'Texto'
                        ? editingModule.content
                        : ''
                    }
                    className='h-32'
                    required
                  />
                </div>
              )}
            </div>
            <DialogFooter>
              <Button
                type='button'
                variant='outline'
                onClick={() => setIsModuleDialogOpen(false)}
              >
                Cancelar
              </Button>
              <Button type='submit'>Salvar Módulo</Button>
            </DialogFooter>
          </form>
        </DialogContent>
      </Dialog>
    </div>
  )
}
