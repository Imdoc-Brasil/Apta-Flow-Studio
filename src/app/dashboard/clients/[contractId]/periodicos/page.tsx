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
import { PlusCircle } from 'lucide-react'
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table'
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

const initialSchedules = [
  {
    id: 'SCH-001',
    collaborator: 'João da Silva',
    exam: 'Audiometria',
    scheduledDate: '2024-08-10',
    status: 'Agendado',
  },
  {
    id: 'SCH-002',
    collaborator: 'Maria Oliveira',
    exam: 'Acuidade Visual',
    scheduledDate: '2024-08-15',
    status: 'Agendado',
  },
]

type Schedule = (typeof initialSchedules)[0]

const mockCollaborators = ['João da Silva', 'Maria Oliveira', 'Carlos Pereira']
const mockExams = [
  'Audiometria',
  'Acuidade Visual',
  'Hemograma Completo',
  'Espirometria',
]

export default function PeriodicosPage() {
  const [schedules, setSchedules] = useState(initialSchedules)
  const [isDialogOpen, setIsDialogOpen] = useState(false)

  const handleAddSchedule = (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault()
    const formData = new FormData(event.currentTarget)
    const newSchedule: Schedule = {
      id: `SCH-${(Math.random() * 1000).toFixed(0).padStart(3, '0')}`,
      collaborator: formData.get('collaborator') as string,
      exam: formData.get('exam') as string,
      scheduledDate: formData.get('scheduledDate') as string,
      status: 'Agendado',
    }
    setSchedules((prev) => [newSchedule, ...prev])
    setIsDialogOpen(false)
  }

  return (
    <Card>
      <CardHeader>
        <CardTitle className='flex items-center justify-between'>
          Gestão de Exames Periódicos
          <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
            <DialogTrigger asChild>
              <Button size='sm' className='h-8 gap-1'>
                <PlusCircle className='h-3.5 w-3.5' />
                <span className='sr-only sm:not-sr-only sm:whitespace-nowrap'>
                  Agendar Exame
                </span>
              </Button>
            </DialogTrigger>
            <DialogContent>
              <DialogHeader>
                <DialogTitle>Agendar Exame Periódico</DialogTitle>
                <DialogDescription>
                  Preencha os dados para agendar um novo exame para um
                  colaborador.
                </DialogDescription>
              </DialogHeader>
              <form id='add-schedule-form' onSubmit={handleAddSchedule}>
                <div className='grid gap-4 py-4'>
                  <div className='grid grid-cols-4 items-center gap-4'>
                    <Label htmlFor='collaborator' className='text-right'>
                      Colaborador
                    </Label>
                    <Select name='collaborator' required>
                      <SelectTrigger className='col-span-3'>
                        <SelectValue placeholder='Selecione o colaborador' />
                      </SelectTrigger>
                      <SelectContent>
                        {mockCollaborators.map((c) => (
                          <SelectItem key={c} value={c}>
                            {c}
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                  </div>
                  <div className='grid grid-cols-4 items-center gap-4'>
                    <Label htmlFor='exam' className='text-right'>
                      Exame
                    </Label>
                    <Select name='exam' required>
                      <SelectTrigger className='col-span-3'>
                        <SelectValue placeholder='Selecione o exame' />
                      </SelectTrigger>
                      <SelectContent>
                        {mockExams.map((e) => (
                          <SelectItem key={e} value={e}>
                            {e}
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                  </div>
                  <div className='grid grid-cols-4 items-center gap-4'>
                    <Label htmlFor='scheduledDate' className='text-right'>
                      Data Agendada
                    </Label>
                    <Input
                      id='scheduledDate'
                      name='scheduledDate'
                      type='date'
                      className='col-span-3'
                      required
                    />
                  </div>
                </div>

                <DialogFooter>
                  <Button
                    variant='outline'
                    onClick={() => setIsDialogOpen(false)}
                  >
                    Cancelar
                  </Button>
                  <Button type='submit' form='add-schedule-form'>
                    Salvar Agendamento
                  </Button>
                </DialogFooter>
              </form>
            </DialogContent>
          </Dialog>
        </CardTitle>
        <CardDescription>
          Acompanhe e gerencie a programação de exames periódicos dos
          colaboradores.
        </CardDescription>
      </CardHeader>
      <CardContent>
        {schedules.length > 0 ? (
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Colaborador</TableHead>
                <TableHead>Exame</TableHead>
                <TableHead>Data Agendada</TableHead>
                <TableHead>Status</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {schedules.map((schedule) => (
                <TableRow key={schedule.id}>
                  <TableCell className='font-medium'>
                    {schedule.collaborator}
                  </TableCell>
                  <TableCell>{schedule.exam}</TableCell>
                  <TableCell>{schedule.scheduledDate}</TableCell>
                  <TableCell>
                    <Badge
                      variant={
                        schedule.status === 'Realizado' ? 'secondary' : 'default'
                      }
                    >
                      {schedule.status}
                    </Badge>
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        ) : (
          <div className='flex flex-1 items-center justify-center rounded-lg border border-dashed shadow-sm h-96'>
            <div className='flex flex-col items-center gap-1 text-center'>
              <h3 className='text-2xl font-bold tracking-tight'>
                Nenhum exame agendado
              </h3>
              <p className='text-sm text-muted-foreground'>
                Comece agendando os exames periódicos para este cliente.
              </p>
              <Button className='mt-4' onClick={() => setIsDialogOpen(true)}>
                Agendar Exame
              </Button>
            </div>
          </div>
        )}
      </CardContent>
    </Card>
  )
}
