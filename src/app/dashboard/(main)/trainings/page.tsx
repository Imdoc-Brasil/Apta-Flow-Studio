
'use client'

import { useState } from 'react'
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
import { MoreHorizontal, PlusCircle } from 'lucide-react'
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu'
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
import { Textarea } from '@/components/ui/textarea'
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select'
import { useToast } from '@/hooks/use-toast'
import Link from 'next/link'

type TrainingModality = 'Online' | 'Presencial' | 'Híbrido'
type TrainingType = 'NR' | 'Uso de EPI' | 'Procedimento Interno' | 'Outro'

export interface Training {
  id: string
  title: string
  description: string
  type: TrainingType
  modality: TrainingModality
  workload: number // in hours
}

export const initialTrainingsData: Training[] = [
  {
    id: 'TRN-001',
    title: 'NR-35 - Trabalho em Altura',
    description:
      'Capacitação para planejamento, organização e execução de trabalho em altura.',
    type: 'NR',
    modality: 'Híbrido',
    workload: 8,
  },
  {
    id: 'TRN-002',
    title: 'Uso Correto de Protetores Auriculares',
    description:
      'Treinamento sobre a correta utilização, higienização e conservação dos protetores auriculares.',
    type: 'Uso de EPI',
    modality: 'Online',
    workload: 1,
  },
  {
    id: 'TRN-003',
    title: 'NR-10 - Segurança em Instalações e Serviços em Eletricidade',
    description: 'Curso básico de segurança para trabalhos com eletricidade.',
    type: 'NR',
    modality: 'Presencial',
    workload: 40,
  },
  {
    id: 'TRN-004',
    title: 'Procedimento de Bloqueio e Etiquetagem (LOTO)',
    description:
      'Instruções para o procedimento de Lockout/Tagout para manutenção de máquinas.',
    type: 'Procedimento Interno',
    modality: 'Presencial',
    workload: 4,
  },
]

export default function TrainingsPage() {
  const [trainings, setTrainings] = useState(initialTrainingsData)
  const [isDialogOpen, setIsDialogOpen] = useState(false)
  const { toast } = useToast()

  const handleAddTraining = (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault()
    const formData = new FormData(event.currentTarget)

    const newTraining: Training = {
      id: `TRN-${Date.now().toString().slice(-4)}`,
      title: formData.get('title') as string,
      description: formData.get('description') as string,
      type: formData.get('type') as TrainingType,
      modality: formData.get('modality') as TrainingModality,
      workload: Number(formData.get('workload')),
    }

    setTrainings((prev) => [newTraining, ...prev])
    setIsDialogOpen(false)
    toast({
      title: 'Treinamento Adicionado!',
      description: `O treinamento "${newTraining.title}" foi adicionado ao catálogo.`,
    })
  }

  return (
    <>
      <Card>
        <CardHeader>
          <CardTitle>Catálogo de Treinamentos</CardTitle>
          <CardDescription>
            Gerencie todos os cursos e capacitações de SST disponíveis.
          </CardDescription>
          <div className='flex items-center justify-end pt-4'>
            <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
              <DialogTrigger asChild>
                <Button size='sm' className='h-8 gap-1'>
                  <PlusCircle className='h-3.5 w-3.5' />
                  <span className='sr-only sm:not-sr-only sm:whitespace-nowrap'>
                    Adicionar Treinamento
                  </span>
                </Button>
              </DialogTrigger>
              <DialogContent className='sm:max-w-xl'>
                <DialogHeader>
                  <DialogTitle>Adicionar Novo Treinamento</DialogTitle>
                  <DialogDescription>
                    Preencha os detalhes para criar um novo curso no catálogo.
                  </DialogDescription>
                </DialogHeader>
                <form id='add-training-form' onSubmit={handleAddTraining}>
                  <div className='grid gap-4 py-4'>
                    <div className='space-y-2'>
                      <Label htmlFor='title'>Título do Treinamento</Label>
                      <Input
                        id='title'
                        name='title'
                        placeholder='Ex: NR-35 - Trabalho em Altura'
                        required
                      />
                    </div>
                    <div className='grid grid-cols-2 gap-4'>
                      <div className='space-y-2'>
                        <Label htmlFor='type'>Tipo</Label>
                        <Select name='type' required>
                          <SelectTrigger>
                            <SelectValue placeholder='Selecione o tipo' />
                          </SelectTrigger>
                          <SelectContent>
                            <SelectItem value='NR'>NR</SelectItem>
                            <SelectItem value='Uso de EPI'>
                              Uso de EPI
                            </SelectItem>
                            <SelectItem value='Procedimento Interno'>
                              Procedimento Interno
                            </SelectItem>
                            <SelectItem value='Outro'>Outro</SelectItem>
                          </SelectContent>
                        </Select>
                      </div>
                      <div className='space-y-2'>
                        <Label htmlFor='modality'>Modalidade</Label>
                        <Select name='modality' required>
                          <SelectTrigger>
                            <SelectValue placeholder='Selecione a modalidade' />
                          </SelectTrigger>
                          <SelectContent>
                            <SelectItem value='Online'>Online</SelectItem>
                            <SelectItem value='Presencial'>
                              Presencial
                            </SelectItem>
                            <SelectItem value='Híbrido'>Híbrido</SelectItem>
                          </SelectContent>
                        </Select>
                      </div>
                    </div>
                    <div className='space-y-2'>
                      <Label htmlFor='workload'>Carga Horária (horas)</Label>
                      <Input
                        id='workload'
                        name='workload'
                        type='number'
                        placeholder='Ex: 8'
                        required
                      />
                    </div>
                    <div className='space-y-2'>
                      <Label htmlFor='description'>Descrição Geral</Label>
                      <Textarea
                        id='description'
                        name='description'
                        placeholder='Descreva os objetivos e o público-alvo do treinamento.'
                      />
                    </div>
                  </div>
                </form>
                <DialogFooter>
                  <Button
                    variant='outline'
                    onClick={() => setIsDialogOpen(false)}
                  >
                    Cancelar
                  </Button>
                  <Button type='submit' form='add-training-form'>
                    Salvar Treinamento
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
                <TableHead>Título</TableHead>
                <TableHead className='hidden sm:table-cell'>Tipo</TableHead>
                <TableHead className='hidden md:table-cell'>
                  Modalidade
                </TableHead>
                <TableHead>Carga Horária</TableHead>
                <TableHead>
                  <span className='sr-only'>Ações</span>
                </TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {trainings.map((training) => (
                <TableRow
                  key={training.id}
                  className='cursor-pointer hover:bg-muted/50'
                >
                  <TableCell className='font-medium'>
                    <Link
                      href={`/dashboard/trainings/${training.id}`}
                      className='hover:underline'
                    >
                      {training.title}
                    </Link>
                  </TableCell>
                  <TableCell className='hidden sm:table-cell'>
                    <Badge variant='secondary'>{training.type}</Badge>
                  </TableCell>
                  <TableCell className='hidden md:table-cell'>
                    <Badge variant='outline'>{training.modality}</Badge>
                  </TableCell>
                  <TableCell>{training.workload}h</TableCell>
                  <TableCell>
                    <DropdownMenu>
                      <DropdownMenuTrigger asChild>
                        <Button
                          aria-haspopup='true'
                          size='icon'
                          variant='ghost'
                        >
                          <MoreHorizontal className='h-4 w-4' />
                          <span className='sr-only'>Alternar menu</span>
                        </Button>
                      </DropdownMenuTrigger>
                      <DropdownMenuContent align='end'>
                        <DropdownMenuLabel>Ações</DropdownMenuLabel>
                        <DropdownMenuItem asChild>
                          <Link href={`/dashboard/trainings/${training.id}`}>
                            Editar Módulos
                          </Link>
                        </DropdownMenuItem>
                        <DropdownMenuItem>Ver Matrículas</DropdownMenuItem>
                        <DropdownMenuItem>Editar</DropdownMenuItem>
                      </DropdownMenuContent>
                    </DropdownMenu>
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
export type { Training, TrainingModality, TrainingType } from './[trainingId]/page'
