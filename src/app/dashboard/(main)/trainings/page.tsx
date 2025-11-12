
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
import { MoreHorizontal, PlusCircle, Loader2 } from 'lucide-react'
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
import {
  useFirestore,
  useCollection,
  useMemoFirebase,
  addDocumentNonBlocking,
} from '@/firebase'
import { collection } from 'firebase/firestore'
import type { TrainingModule } from './[trainingId]/page'

export type TrainingModality = 'Online' | 'Presencial' | 'Híbrido'
export type TrainingType = 'NR' | 'Uso de EPI' | 'Procedimento Interno' | 'Outro'

export interface Training {
  id: string
  title: string
  description: string
  type: TrainingType
  modality: TrainingModality
  workload: number // in hours
  validity: number // in months
  modules?: TrainingModule[]
}

export default function TrainingsPage() {
  const firestore = useFirestore()
  const trainingsRef = useMemoFirebase(
    () => (firestore ? collection(firestore, 'trainings') : null),
    [firestore]
  )
  const { data: trainings, isLoading } = useCollection<Training>(trainingsRef)

  const [isDialogOpen, setIsDialogOpen] = useState(false)
  const { toast } = useToast()

  const handleAddTraining = (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault()
    if (!trainingsRef) return

    const formData = new FormData(event.currentTarget)

    const newTraining: Omit<Training, 'id'> = {
      title: formData.get('title') as string,
      description: formData.get('description') as string,
      type: formData.get('type') as TrainingType,
      modality: formData.get('modality') as TrainingModality,
      workload: Number(formData.get('workload')),
      validity: Number(formData.get('validity')),
      modules: [],
    }
    
    addDocumentNonBlocking(trainingsRef, newTraining);

    toast({
      title: 'Treinamento Adicionado!',
      description: `O treinamento "${newTraining.title}" foi adicionado ao catálogo.`,
    })
    setIsDialogOpen(false)
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
                    <div className='grid grid-cols-2 gap-4'>
                      <div className='space-y-2'>
                        <Label htmlFor='workload'>
                          Carga Horária (horas)
                        </Label>
                        <Input
                          id='workload'
                          name='workload'
                          type='number'
                          placeholder='Ex: 8'
                          required
                        />
                      </div>
                      <div className='space-y-2'>
                        <Label htmlFor='validity'>Validade (meses)</Label>
                        <Input
                          id='validity'
                          name='validity'
                          type='number'
                          placeholder='0 para indeterminada'
                          required
                        />
                      </div>
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
          {isLoading ? (
            <div className='flex justify-center items-center h-64'>
              <Loader2 className='h-8 w-8 animate-spin text-muted-foreground' />
            </div>
          ) : (
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Título</TableHead>
                  <TableHead className='hidden sm:table-cell'>Tipo</TableHead>
                  <TableHead className='hidden md:table-cell'>
                    Modalidade
                  </TableHead>
                  <TableHead>Carga Horária</TableHead>
                  <TableHead>Validade</TableHead>
                  <TableHead>
                    <span className='sr-only'>Ações</span>
                  </TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {trainings?.map((training) => (
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
                      {training.validity > 0
                        ? `${training.validity} meses`
                        : 'Indeterminada'}
                    </TableCell>
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
          )}
        </CardContent>
      </Card>
    </>
  )
}
