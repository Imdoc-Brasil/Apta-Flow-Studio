
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
  validity: number // in months
}

export const initialTrainingsData: Training[] = [
  {
    id: 'TRN-NR-01-A',
    title: 'NR-01 - Integração de Segurança do Trabalho',
    description: 'Treinamento inicial para todos os trabalhadores sobre os riscos ocupacionais (conforme PGR) e medidas de prevenção.',
    type: 'NR',
    modality: 'Híbrido',
    workload: 6,
    validity: 0, // Reciclagem em caso de alteração de riscos ou acidentes
  },
  {
    id: 'TRN-NR-01-B',
    title: 'NR-01 - Capacitação sobre Assédio e Diversidade',
    description: 'Treinamento sobre prevenção e combate ao assédio sexual e a outras formas de violência no trabalho.',
    type: 'NR',
    modality: 'Híbrido',
    workload: 1, // Carga horária não especificada, 1h como placeholder
    validity: 12,
  },
  {
    id: 'TRN-NR-05',
    title: 'NR-05 - CIPA (Comissão Interna de Prevenção de Acidentes)',
    description: 'Treinamento para membros eleitos e designados da CIPA. Carga horária varia com o grau de risco da empresa.',
    type: 'NR',
    modality: 'Híbrido',
    workload: 20, // Usando a maior carga horária como padrão
    validity: 12,
  },
  {
    id: 'TRN-NR-06',
    title: 'NR-06 - Uso, Guarda e Conservação de EPI',
    description: 'Treinamento para todos os trabalhadores sobre o correto uso, guarda e conservação dos Equipamentos de Proteção Individual.',
    type: 'Uso de EPI',
    modality: 'Híbrido',
    workload: 2, // Carga horária não especificada, 2h como placeholder
    validity: 0, // Indeterminada, reciclagem quando necessário
  },
  {
    id: 'TRN-NR-10-BAS',
    title: 'NR-10 - Segurança em Eletricidade (Básico)',
    description: 'Treinamento básico para trabalhadores que interagem com instalações elétricas.',
    type: 'NR',
    modality: 'Híbrido',
    workload: 40,
    validity: 24,
  },
    {
    id: 'TRN-NR-10-SEP',
    title: 'NR-10 - Segurança no Sistema Elétrico de Potência (SEP)',
    description: 'Treinamento complementar para trabalhos em alta tensão (SEP).',
    type: 'NR',
    modality: 'Híbrido',
    workload: 40,
    validity: 24,
  },
  {
    id: 'TRN-NR-11',
    title: 'NR-11 - Operação de Empilhadeira',
    description: 'Treinamento para capacitação de operadores de empilhadeira e equipamentos de transporte de materiais.',
    type: 'NR',
    modality: 'Híbrido',
    workload: 16,
    validity: 0, // Indeterminada, reciclagem necessária em caso de acidentes ou mudanças.
  },
  {
    id: 'TRN-NR-12',
    title: 'NR-12 - Segurança em Máquinas e Equipamentos',
    description: 'Treinamento para operadores e profissionais de manutenção de máquinas e equipamentos.',
    type: 'NR',
    modality: 'Híbrido',
    workload: 8,
    validity: 0, // Indeterminada, reciclagem conforme necessidade
  },
    {
    id: 'TRN-NR-17',
    title: 'NR-17 - Ergonomia',
    description: 'Treinamento para trabalhadores sobre a adaptação das condições de trabalho às suas características psicofisiológicas.',
    type: 'NR',
    modality: 'Online',
    workload: 2,
    validity: 0, // Indeterminada, reciclagem recomendada a cada 2 anos
  },
  {
    id: 'TRN-NR-18',
    title: 'NR-18 - Indústria da Construção (Admissional)',
    description: 'Treinamento admissional para trabalhadores da indústria da construção.',
    type: 'NR',
    modality: 'Híbrido',
    workload: 4,
    validity: 24,
  },
  {
    id: 'TRN-NR-20',
    title: 'NR-20 - Segurança com Inflamáveis e Combustíveis',
    description: 'Treinamento para trabalhadores em instalações com manuseio de inflamáveis e combustíveis.',
    type: 'NR',
    modality: 'Híbrido',
    workload: 8, // Varia de 4 a 16h, usando 8h como um valor comum
    validity: 36, // Para o curso básico
  },
    {
    id: 'TRN-NR-23',
    title: 'NR-23 - Brigada de Incêndio',
    description: 'Treinamento para formação de brigadistas de incêndio, preparando-os para atuar na prevenção e combate a princípios de incêndio.',
    type: 'NR',
    modality: 'Híbrido',
    workload: 8, // Varia conforme o plano, 8h como padrão
    validity: 12,
  },
  {
    id: 'TRN-NR-32-BAS',
    title: 'NR-32 - Segurança em Serviços de Saúde (Básico)',
    description: 'Capacitação sobre riscos biológicos, químicos e físicos em serviços de saúde.',
    type: 'NR',
    modality: 'Híbrido',
    workload: 8,
    validity: 12,
  },
  {
    id: 'TRN-NR-32-RES',
    title: 'NR-32 - Gerenciamento de Resíduos de Saúde (PGRSS)',
    description: 'Treinamento sobre o correto manejo, segregação, acondicionamento e descarte de resíduos de serviços de saúde.',
    type: 'NR',
    modality: 'Híbrido',
    workload: 4,
    validity: 12,
  },
  {
    id: 'TRN-NR-32-QTP',
    title: 'NR-32 - Prevenção com Quimioterápicos',
    description: 'Capacitação para manuseio seguro de quimioterápicos antineoplásicos.',
    type: 'NR',
    modality: 'Híbrido',
    workload: 4,
    validity: 12,
  },
  {
    id: 'TRN-NR-32-RAD',
    title: 'NR-32 - Prevenção com Radiações Ionizantes',
    description: 'Treinamento específico para trabalhadores expostos a radiações ionizantes em serviços de saúde.',
    type: 'NR',
    modality: 'Híbrido',
    workload: 8,
    validity: 12,
  },
  {
    id: 'TRN-NR-33-AUT',
    title: 'NR-33 - Espaços Confinados (Trabalhadores e Vigias)',
    description: 'Capacitação para trabalhadores autorizados e vigias em espaços confinados.',
    type: 'NR',
    modality: 'Híbrido',
    workload: 16,
    validity: 12,
  },
  {
    id: 'TRN-NR-33-SUP',
    title: 'NR-33 - Espaços Confinados (Supervisores)',
    description: 'Capacitação para Supervisores de Entrada em espaços confinados.',
    type: 'NR',
    modality: 'Híbrido',
    workload: 40,
    validity: 12,
  },
  {
    id: 'TRN-NR-35',
    title: 'NR-35 - Trabalho em Altura',
    description: 'Capacitação para planejamento, organização e execução de trabalho em altura com segurança.',
    type: 'NR',
    modality: 'Híbrido',
    workload: 8,
    validity: 24,
  },
];


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
      validity: Number(formData.get('validity')),
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
                     <div className='grid grid-cols-2 gap-4'>
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
                  <TableCell>{training.validity > 0 ? `${training.validity} meses` : 'Indeterminada'}</TableCell>
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
