
'use client'

import { useState, useMemo } from 'react'
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from '@/components/ui/card'
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table'
import { Badge } from '@/components/ui/badge'
import { Button } from '@/components/ui/button'
import { MoreHorizontal, PlusCircle, Search, X } from 'lucide-react'
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
import {
  initialTrainingsData as catalogTrainings,
  Training,
} from '@/app/dashboard/(main)/trainings/page'
import { initialEmployeesData } from '../employees/data'
import { initialStaffsData } from '@/app/dashboard/(main)/employees/page'
import { ScrollArea } from '@/components/ui/scroll-area'
import { Separator } from '@/components/ui/separator'

type TrainingModality = 'Online' | 'Presencial' | 'Híbrido'
type ScheduledStatus = 'Agendado' | 'Em Andamento' | 'Concluído' | 'Cancelado'

interface ScheduledTraining {
  id: string
  trainingId: string
  title: string
  modality: TrainingModality
  scheduledDate: string
  status: ScheduledStatus
  instructorId: string
  enrolledEmployees: string[]
}

const initialScheduledTrainings: ScheduledTraining[] = [
  {
    id: 'SCH-001',
    trainingId: 'TRN-NR-35',
    title: 'NR-35 - Trabalho em Altura',
    modality: 'Híbrido',
    scheduledDate: '2024-08-15',
    status: 'Agendado',
    instructorId: 'sarah.chen@aptaflow.com',
    enrolledEmployees: ['EMP-001', 'EMP-002'],
  },
  {
    id: 'SCH-002',
    trainingId: 'TRN-NR-06',
    title: 'Uso Correto de Protetores Auriculares',
    modality: 'Online',
    scheduledDate: '2024-07-20',
    status: 'Concluído',
    instructorId: 'emily.w@aptaflow.com',
    enrolledEmployees: ['EMP-003'],
  },
]

export default function ClientTrainingsPage() {
  const [scheduledTrainings, setScheduledTrainings] = useState(
    initialScheduledTrainings
  )
  const [isSchedulingDialogOpen, setIsSchedulingDialogOpen] = useState(false)
  const { toast } = useToast()

  const [selectedEmployees, setSelectedEmployees] = useState<string[]>([])
  const [searchTerm, setSearchTerm] = useState('')

  const availableEmployees = useMemo(() => {
    return initialEmployeesData.filter(
      (emp) =>
        !selectedEmployees.includes(emp.id) &&
        emp.name.toLowerCase().includes(searchTerm.toLowerCase())
    )
  }, [selectedEmployees, searchTerm])

  const currentSelectedEmployees = useMemo(() => {
    return initialEmployeesData.filter((emp) =>
      selectedEmployees.includes(emp.id)
    )
  }, [selectedEmployees])

  const handleSelectEmployee = (employeeId: string) => {
    setSelectedEmployees((prev) => [...prev, employeeId])
  }

  const handleRemoveEmployee = (employeeId: string) => {
    setSelectedEmployees((prev) => prev.filter((id) => id !== employeeId))
  }

  const resetSelection = () => {
    setSelectedEmployees([])
    setSearchTerm('')
  }

  const handleScheduleTraining = (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault()
    const formData = new FormData(event.currentTarget)
    const trainingId = formData.get('trainingId') as string
    const training = catalogTrainings.find((t) => t.id === trainingId)

    if (!training || selectedEmployees.length === 0) {
      toast({
        variant: 'destructive',
        title: 'Dados incompletos',
        description: 'Selecione um treinamento e pelo menos um colaborador.',
      })
      return
    }

    const newScheduledTraining: ScheduledTraining = {
      id: `SCH-${Date.now().toString().slice(-4)}`,
      trainingId,
      title: training.title,
      modality: training.modality,
      scheduledDate: formData.get('scheduledDate') as string,
      status: 'Agendado',
      instructorId: formData.get('instructorId') as string,
      enrolledEmployees: selectedEmployees,
    }

    setScheduledTrainings((prev) => [newScheduledTraining, ...prev])
    setIsSchedulingDialogOpen(false)
    resetSelection()
    toast({
      title: 'Treinamento Agendado!',
      description: `O treinamento "${newScheduledTraining.title}" foi agendado.`,
    })
  }

  const getInstructorName = (staffId: string) => {
    return initialStaffsData.find((s) => s.email === staffId)?.name || 'N/A'
  }

  return (
    <>
      <Card>
        <CardHeader>
          <CardTitle>Gestão de Treinamentos do Cliente</CardTitle>
          <CardDescription>
            Agende novos treinamentos, gerencie turmas e acompanhe o progresso
            dos colaboradores.
          </CardDescription>
          <div className='flex items-center justify-end pt-4'>
            <Dialog
              open={isSchedulingDialogOpen}
              onOpenChange={(isOpen) => {
                setIsSchedulingDialogOpen(isOpen)
                if (!isOpen) resetSelection()
              }}
            >
              <DialogTrigger asChild>
                <Button>
                  <PlusCircle className='mr-2 h-4 w-4' /> Agendar Novo
                  Treinamento
                </Button>
              </DialogTrigger>
              <DialogContent className='sm:max-w-3xl'>
                <DialogHeader>
                  <DialogTitle>Agendar Novo Treinamento</DialogTitle>
                </DialogHeader>
                <form
                  id='schedule-training-form'
                  onSubmit={handleScheduleTraining}
                >
                  <ScrollArea className='h-[70vh]'>
                    <div className='grid gap-6 p-4'>
                      <div className='space-y-2'>
                        <Label htmlFor='trainingId'>Treinamento</Label>
                        <Select name='trainingId' required>
                          <SelectTrigger>
                            <SelectValue placeholder='Selecione um treinamento do catálogo' />
                          </SelectTrigger>
                          <SelectContent>
                            {catalogTrainings.map((t) => (
                              <SelectItem key={t.id} value={t.id}>
                                {t.title} ({t.modality})
                              </SelectItem>
                            ))}
                          </SelectContent>
                        </Select>
                      </div>

                      <div className='space-y-2'>
                        <Label>Colaboradores</Label>
                        <div className='grid grid-cols-2 gap-4'>
                          {/* Coluna da Esquerda: Disponíveis */}
                          <div className='rounded-md border p-4 space-y-2'>
                            <div className='relative'>
                              <Search className='absolute left-2 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground' />
                              <Input
                                placeholder='Buscar colaborador...'
                                className='pl-8'
                                value={searchTerm}
                                onChange={(e) => setSearchTerm(e.target.value)}
                              />
                            </div>
                            <ScrollArea className='h-48'>
                              <div className='space-y-2'>
                                {availableEmployees.map((employee) => (
                                  <div
                                    key={employee.id}
                                    className='flex items-center justify-between text-sm p-2 rounded-md hover:bg-muted'
                                  >
                                    <span>{employee.name}</span>
                                    <Button
                                      type='button'
                                      size='sm'
                                      variant='outline'
                                      onClick={() =>
                                        handleSelectEmployee(employee.id)
                                      }
                                    >
                                      Incluir
                                    </Button>
                                  </div>
                                ))}
                                {availableEmployees.length === 0 && (
                                  <p className='text-center text-xs text-muted-foreground pt-4'>
                                    Nenhum colaborador encontrado.
                                  </p>
                                )}
                              </div>
                            </ScrollArea>
                          </div>

                          {/* Coluna da Direita: Selecionados */}
                          <div className='rounded-md border p-4 space-y-2'>
                            <h4 className='font-medium text-sm'>
                              Selecionados ({currentSelectedEmployees.length})
                            </h4>
                            <Separator />
                            <ScrollArea className='h-48'>
                              <div className='space-y-2'>
                                {currentSelectedEmployees.map((employee) => (
                                  <div
                                    key={employee.id}
                                    className='flex items-center justify-between text-sm p-2 rounded-md bg-secondary'
                                  >
                                    <span>{employee.name}</span>
                                    <Button
                                      type='button'
                                      size='icon'
                                      variant='ghost'
                                      className='h-6 w-6'
                                      onClick={() =>
                                        handleRemoveEmployee(employee.id)
                                      }
                                    >
                                      <X className='h-4 w-4' />
                                    </Button>
                                  </div>
                                ))}
                                {currentSelectedEmployees.length === 0 && (
                                  <p className='text-center text-xs text-muted-foreground pt-4'>
                                    Nenhum colaborador selecionado.
                                  </p>
                                )}
                              </div>
                            </ScrollArea>
                          </div>
                        </div>
                      </div>

                      <div className='grid grid-cols-2 gap-4'>
                        <div className='space-y-2'>
                          <Label htmlFor='instructorId'>Instrutor</Label>
                          <Select name='instructorId' required>
                            <SelectTrigger>
                              <SelectValue placeholder='Selecione um instrutor' />
                            </SelectTrigger>
                            <SelectContent>
                              {initialStaffsData.map((staff) => (
                                <SelectItem
                                  key={staff.email}
                                  value={staff.email}
                                >
                                  {staff.name}
                                </SelectItem>
                              ))}
                            </SelectContent>
                          </Select>
                        </div>
                        <div className='space-y-2'>
                          <Label htmlFor='scheduledDate'>Data</Label>
                          <Input
                            id='scheduledDate'
                            name='scheduledDate'
                            type='date'
                            required
                          />
                        </div>
                      </div>
                    </div>
                  </ScrollArea>
                </form>
                <DialogFooter>
                  <Button
                    variant='outline'
                    onClick={() => {
                      setIsSchedulingDialogOpen(false)
                      resetSelection()
                    }}
                  >
                    Cancelar
                  </Button>
                  <Button type='submit' form='schedule-training-form'>
                    Agendar
                  </Button>
                </DialogFooter>
              </DialogContent>
            </Dialog>
          </div>
        </CardHeader>
        <CardContent>
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Treinamento</TableHead>
                <TableHead>Data Agendada</TableHead>
                <TableHead>Instrutor</TableHead>
                <TableHead>Matriculados</TableHead>
                <TableHead>Status</TableHead>
                <TableHead>
                  <span className='sr-only'>Ações</span>
                </TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {scheduledTrainings.map((st) => (
                <TableRow key={st.id}>
                  <TableCell className='font-medium'>{st.title}</TableCell>
                  <TableCell>
                    {new Date(st.scheduledDate).toLocaleDateString('pt-BR', {
                      timeZone: 'UTC',
                    })}
                  </TableCell>
                  <TableCell>{getInstructorName(st.instructorId)}</TableCell>
                  <TableCell>{st.enrolledEmployees.length}</TableCell>
                  <TableCell>
                    <Badge
                      variant={
                        st.status === 'Concluído' ? 'secondary' : 'default'
                      }
                    >
                      {st.status}
                    </Badge>
                  </TableCell>
                  <TableCell>
                    <Button aria-haspopup='true' size='icon' variant='ghost'>
                      <MoreHorizontal className='h-4 w-4' />
                      <span className='sr-only'>Alternar menu</span>
                    </Button>
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </CardContent>
      </Card>
    </>
  )
}
