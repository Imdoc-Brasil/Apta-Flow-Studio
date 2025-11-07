
'use client'

import { useState } from 'react'
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
  CardFooter,
} from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import {
  PlusCircle,
  Workflow,
  CheckCircle,
  ArrowRight,
  Trash2,
} from 'lucide-react'
import { Badge } from '@/components/ui/badge'
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
  DialogFooter,
  DialogTrigger,
} from '@/components/ui/dialog'
import { Input } from '@/components/ui/input'
import { Textarea } from '@/components/ui/textarea'
import { Label } from '@/components/ui/label'
import { Separator } from '@/components/ui/separator'
import { useToast } from '@/hooks/use-toast'
import { initialProcessesData, type Process, type ProcessStep } from './data'
import { initialSectorsData } from '../sectors/data'
import { initialRolesData } from '../roles/data'
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select'
import { Checkbox } from '@/components/ui/checkbox'
import { ScrollArea } from '@/components/ui/scroll-area'

export default function ProcessesPage() {
  const [processes, setProcesses] = useState(initialProcessesData)
  const [isProcessDialogOpen, setIsProcessDialogOpen] = useState(false)
  const [editingProcess, setEditingProcess] = useState<Process | null>(null)
  const [formSteps, setFormSteps] = useState<ProcessStep[]>([])
  const { toast } = useToast()

  const handleProcessSubmit = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault()
    const formData = new FormData(e.currentTarget)
    const processId = editingProcess
      ? editingProcess.id
      : `PROC-${Date.now()}`

    const updatedProcess: Process = {
      id: processId,
      name: formData.get('name') as string,
      objective: formData.get('objective') as string,
      primarySector: formData.get('primarySector') as string,
      steps: formSteps.map((step, index) => ({
        ...step,
        name: formData.get(`step-name-${index}`) as string,
        description: formData.get(`step-description-${index}`) as string,
        responsibleRole: formData.get(
          `step-responsible-${index}`
        ) as string,
        isControlPoint: formData.get(`control-point-${index}`) === 'on',
      })),
    }

    if (editingProcess) {
      setProcesses((prev) =>
        prev.map((p) => (p.id === processId ? updatedProcess : p))
      )
      toast({ title: 'Sucesso!', description: 'Processo atualizado.' })
    } else {
      setProcesses((prev) => [updatedProcess, ...prev])
      toast({ title: 'Sucesso!', description: 'Processo adicionado.' })
    }

    setIsProcessDialogOpen(false)
    setEditingProcess(null)
  }

  const openProcessDialog = (process: Process | null) => {
    setEditingProcess(process)
    setFormSteps(process ? [...process.steps] : [])
    setIsProcessDialogOpen(true)
  }

  const addStep = () => {
    const newStep: ProcessStep = {
      id: `STEP-${Date.now()}`,
      name: '',
      responsibleRole: '',
      description: '',
      isControlPoint: false,
    }
    setFormSteps((prev) => [...prev, newStep])
  }

  const removeStep = (stepId: string) => {
    setFormSteps((prev) => prev.filter((step) => step.id !== stepId))
  }

  return (
    <>
      <Card>
        <CardHeader>
          <CardTitle>Mapa de Processos</CardTitle>
          <CardDescription>
            Gerencie os processos de negócio, procedimentos e fluxos de
            trabalho da empresa.
          </CardDescription>
          <div className='flex justify-end pt-4'>
            <Button onClick={() => openProcessDialog(null)}>
              <PlusCircle className='mr-2 h-4 w-4' /> Adicionar Processo
            </Button>
          </div>
        </CardHeader>
        <CardContent>
          <div className='grid gap-6 md:grid-cols-2 lg:grid-cols-3'>
            {processes.map((process) => (
              <Card
                key={process.id}
                className='flex flex-col hover:shadow-lg transition-shadow cursor-pointer'
                onClick={() => openProcessDialog(process)}
              >
                <CardHeader>
                  <div className='flex items-start justify-between'>
                    <Workflow className='h-8 w-8 text-muted-foreground' />
                    <Badge variant='outline'>{process.primarySector}</Badge>
                  </div>
                  <CardTitle className='pt-4'>{process.name}</CardTitle>
                </CardHeader>
                <CardContent className='flex-grow'>
                  <p className='text-sm text-muted-foreground line-clamp-2'>
                    {process.objective}
                  </p>
                </CardContent>
                <CardFooter>
                  <p className='text-xs font-semibold text-primary'>
                    {process.steps.length} Etapas
                  </p>
                </CardFooter>
              </Card>
            ))}
          </div>
        </CardContent>
      </Card>

      <Dialog open={isProcessDialogOpen} onOpenChange={setIsProcessDialogOpen}>
        <DialogContent className='sm:max-w-4xl'>
          <DialogHeader>
            <DialogTitle>
              {editingProcess ? 'Editar' : 'Adicionar'} Processo
            </DialogTitle>
            <DialogDescription>
              {editingProcess
                ? 'Atualize os detalhes'
                : 'Preencha os detalhes'}{' '}
              para este processo de negócio.
            </DialogDescription>
          </DialogHeader>
          <form id='process-form' onSubmit={handleProcessSubmit}>
            <ScrollArea className='h-[70vh]'>
              <div className='space-y-6 p-1 pr-4'>
                <div className='grid grid-cols-1 md:grid-cols-2 gap-4'>
                  <div className='space-y-2'>
                    <Label htmlFor='name'>Nome do Processo</Label>
                    <Input
                      id='name'
                      name='name'
                      defaultValue={editingProcess?.name}
                      required
                    />
                  </div>
                  <div className='space-y-2'>
                    <Label htmlFor='primarySector'>Setor Principal</Label>
                    <Select
                      name='primarySector'
                      defaultValue={editingProcess?.primarySector}
                      required
                    >
                      <SelectTrigger>
                        <SelectValue placeholder='Selecione o setor' />
                      </SelectTrigger>
                      <SelectContent>
                        {initialSectorsData.map((sector) => (
                          <SelectItem key={sector.id} value={sector.name}>
                            {sector.name}
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                  </div>
                </div>
                <div className='space-y-2'>
                  <Label htmlFor='objective'>Objetivo / Justificativa</Label>
                  <Textarea
                    id='objective'
                    name='objective'
                    defaultValue={editingProcess?.objective}
                    placeholder='Descreva o porquê deste processo existir.'
                  />
                </div>

                <Separator />

                <div>
                  <h3 className='text-lg font-medium mb-4'>
                    Etapas do Processo
                  </h3>
                  <div className='space-y-4'>
                    {formSteps.map((step, index) => (
                      <div
                        key={step.id}
                        className='flex items-start gap-4 p-4 border rounded-lg relative'
                      >
                        <div className='flex-shrink-0 flex flex-col items-center justify-center bg-primary text-primary-foreground rounded-full h-8 w-8 text-sm font-bold mt-2'>
                          {index + 1}
                        </div>
                        <div className='flex-grow space-y-2'>
                          <Input
                            name={`step-name-${index}`}
                            defaultValue={step.name}
                            placeholder='Nome da Etapa'
                            required
                          />
                          <Textarea
                            name={`step-description-${index}`}
                            defaultValue={step.description}
                            placeholder='Descrição da atividade'
                            rows={2}
                          />
                          <Select
                            name={`step-responsible-${index}`}
                            defaultValue={step.responsibleRole}
                          >
                            <SelectTrigger>
                              <SelectValue placeholder='Selecione o cargo responsável' />
                            </SelectTrigger>
                            <SelectContent>
                              {initialRolesData.map((role) => (
                                <SelectItem key={role.id} value={role.name}>
                                  {role.name}
                                </SelectItem>
                              ))}
                            </SelectContent>
                          </Select>
                          <div className='flex items-center space-x-2 pt-2'>
                            <Checkbox
                              id={`control-point-${index}`}
                              name={`control-point-${index}`}
                              defaultChecked={step.isControlPoint}
                            />
                            <Label
                              htmlFor={`control-point-${index}`}
                              className='text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70'
                            >
                              Este é um Ponto de Controle Crítico
                            </Label>
                          </div>
                        </div>
                        <Button
                          type='button'
                          variant='ghost'
                          size='icon'
                          className='absolute top-2 right-2 h-6 w-6 text-destructive hover:text-destructive'
                          onClick={() => removeStep(step.id)}
                        >
                          <Trash2 className='h-4 w-4' />
                        </Button>
                      </div>
                    ))}
                    <Button
                      type='button'
                      variant='outline'
                      className='w-full'
                      onClick={addStep}
                    >
                      <PlusCircle className='mr-2 h-4 w-4' />
                      Adicionar Etapa
                    </Button>
                  </div>
                </div>
              </div>
            </ScrollArea>
          </form>
          <DialogFooter className='pt-6 border-t'>
            <Button
              variant='outline'
              onClick={() => setIsProcessDialogOpen(false)}
            >
              Cancelar
            </Button>
            <Button type='submit' form='process-form'>
              Salvar Processo
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </>
  )
}
