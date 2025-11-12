
'use client'

import { useState, useMemo } from 'react'
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table'
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from '@/components/ui/dialog'
import {
  PlusCircle,
  MoreHorizontal,
  Link as LinkIcon,
  Check,
  ChevronsUpDown,
  Loader2,
} from 'lucide-react'
import { Badge } from '@/components/ui/badge'
import { useToast } from '@/hooks/use-toast'
import { Label } from '@/components/ui/label'
import { Textarea } from '@/components/ui/textarea'
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select'
import { useParams } from 'next/navigation'
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu'
import Link from 'next/link'
import { type PsychosocialSurvey, type SurveyStatus } from './data'
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from '@/components/ui/popover'
import {
  Command,
  CommandEmpty,
  CommandGroup,
  CommandInput,
  CommandItem,
  CommandList,
} from '@/components/ui/command'
import { cn } from '@/lib/utils'
import { ScrollArea } from '@/components/ui/scroll-area'
import { Input } from '@/components/ui/input'
import {
  useFirestore,
  useCollection,
  useMemoFirebase,
  addDocumentNonBlocking,
  useDoc,
} from '@/firebase'
import { collection, doc } from 'firebase/firestore'
import type { Client } from '../../../clients/data'
import type { Unit } from '../units/data'


const standardCircumstances = [
  {
    id: 'c1',
    text: 'Primeiro levantamento preliminar de riscos psicossociais de acordo com a NR-01, Portaria MTE nº 1.419, publicada em 27 de agosto de 2024.',
  },
  {
    id: 'c2',
    text: 'Avaliação seguimento do levantamento de riscos psicossociais de acordo com a NR-01, Portaria MTE nº 1.419, publicada em 27 de agosto de 2024.',
  },
]

export default function PsychosocialPage() {
  const { toast } = useToast()
  const params = useParams()
  const contractId = params.contractId as string
  const firestore = useFirestore()
  
  const clientRef = useMemoFirebase(() => (firestore ? doc(firestore, 'clients', contractId) : null), [firestore, contractId]);
  const unitsRef = useMemoFirebase(() => (firestore ? collection(firestore, `clients/${contractId}/units`) : null), [firestore, contractId]);
  
  const surveysRef = useMemoFirebase(
    () =>
      firestore
        ? collection(
            firestore,
            `clients/${contractId}/psychosocial_surveys`
          )
        : null,
    [firestore, contractId]
  )
  const { data: client, isLoading: isClientLoading } = useDoc<Client>(clientRef)
  const { data: clientUnits, isLoading: areUnitsLoading } = useCollection<Unit>(unitsRef);
  const { data: surveys, isLoading: areSurveysLoading } = useCollection<PsychosocialSurvey>(surveysRef)

  const [isDialogOpen, setIsDialogOpen] = useState(false)
  const [selectedUnits, setSelectedUnits] = useState<string[]>([])
  const [circumstanceText, setCircumstanceText] = useState('')
  
  const isLoading = isClientLoading || areUnitsLoading || areSurveysLoading;

  const handleCreateSurvey = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault()
    if (!surveysRef) return

    const formData = new FormData(e.currentTarget)
    const circumstances = formData.get('circumstances') as string

    if (selectedUnits.length === 0 || !circumstances || !client) {
      toast({
        variant: 'destructive',
        title: 'Campos Incompletos',
        description:
          'Por favor, selecione as unidades e descreva as circunstâncias.',
      })
      return
    }

    let unitDisplay = 'Múltiplas Unidades'
    if (selectedUnits.length === 1) {
      if (selectedUnits[0] === 'all') {
        unitDisplay = 'Todas as Unidades'
      } else {
        unitDisplay =
          clientUnits?.find((u) => u.id === selectedUnits[0])?.name || 'N/A'
      }
    }

    const newSurvey: Omit<PsychosocialSurvey, 'id'> = {
      creationDate: new Date().toISOString().split('T')[0],
      clientName: client.name,
      unit: unitDisplay,
      circumstances,
      status: 'Planejada',
    }

    addDocumentNonBlocking(surveysRef, newSurvey)

    setIsDialogOpen(false)
    toast({
      title: 'Pesquisa Criada com Sucesso!',
      description: `A pesquisa "${circumstances}" foi criada e está pronta para ser iniciada.`,
    })
  }

  const getStatusVariant = (status: SurveyStatus) => {
    switch (status) {
      case 'Planejada':
        return 'default'
      case 'Em Andamento':
        return 'secondary'
      case 'Concluída':
        return 'outline'
      default:
        return 'default'
    }
  }

  const handleUnitSelection = (unitId: string) => {
    if (unitId === 'all') {
      setSelectedUnits(['all'])
      return
    }
    setSelectedUnits((prev) => {
      const isSelected = prev.includes(unitId)
      let newSelection = prev.filter((u) => u !== 'all') // remove 'all' if any specific unit is selected
      if (isSelected) {
        return newSelection.filter((id) => id !== unitId)
      } else {
        return [...newSelection, unitId]
      }
    })
  }

  const getSelectedUnitsText = () => {
    if (selectedUnits.includes('all')) return 'Todas as Unidades'
    if (selectedUnits.length === 0) return 'Selecione a(s) unidade(s)'
    if (selectedUnits.length === 1)
      return clientUnits?.find((u) => u.id === selectedUnits[0])?.name
    return `${selectedUnits.length} unidades selecionadas`
  }

  const totalEmployees = 0 // This needs to be calculated based on selected units

  return (
    <Card>
      <CardHeader>
        <div className='flex items-center justify-between'>
          <div>
            <CardTitle>Gestão de Riscos Psicossociais</CardTitle>
            <CardDescription>
              Crie, gerencie e analise as pesquisas de riscos psicossociais para
              as empresas clientes.
            </CardDescription>
          </div>
          <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
            <DialogTrigger asChild>
              <Button
                onClick={() => {
                  setSelectedUnits([])
                  setCircumstanceText('')
                }}
              >
                <PlusCircle className='mr-2 h-4 w-4' />
                Criar Nova Pesquisa
              </Button>
            </DialogTrigger>
            <DialogContent className='sm:max-w-2xl'>
              <DialogHeader>
                <DialogTitle>Criar Nova Pesquisa Psicossocial</DialogTitle>
                <DialogDescription>
                  Defina as informações básicas para iniciar uma nova campanha
                  de pesquisa.
                </DialogDescription>
              </DialogHeader>
              <form id='create-survey-form' onSubmit={handleCreateSurvey}>
                <ScrollArea className='h-[60vh] pr-4'>
                  <div className='grid gap-4 py-4'>
                    <div className='space-y-2'>
                      <Label htmlFor='unitId'>Unidade(s)</Label>
                      <Popover>
                        <PopoverTrigger asChild>
                          <Button
                            variant='outline'
                            className='w-full justify-between'
                          >
                            {getSelectedUnitsText()}
                            <ChevronsUpDown className='ml-2 h-4 w-4 shrink-0 opacity-50' />
                          </Button>
                        </PopoverTrigger>
                        <PopoverContent className='w-[--radix-popover-trigger-width] p-0'>
                          <Command>
                            <CommandInput placeholder='Buscar unidade...' />
                            <CommandEmpty>
                              Nenhuma unidade encontrada.
                            </CommandEmpty>
                            <CommandList>
                              <CommandGroup>
                                <CommandItem
                                  onSelect={() => handleUnitSelection('all')}
                                >
                                  <Check
                                    className={cn(
                                      'mr-2 h-4 w-4',
                                      selectedUnits.includes('all')
                                        ? 'opacity-100'
                                        : 'opacity-0'
                                    )}
                                  />
                                  Todas as Unidades
                                </CommandItem>
                                {clientUnits?.map((unit) => (
                                  <CommandItem
                                    key={unit.id}
                                    onSelect={() => handleUnitSelection(unit.id!)}
                                  >
                                    <Check
                                      className={cn(
                                        'mr-2 h-4 w-4',
                                        selectedUnits.includes(unit.id!)
                                          ? 'opacity-100'
                                          : 'opacity-0'
                                      )}
                                    />
                                    {unit.name}
                                  </CommandItem>
                                ))}
                              </CommandGroup>
                            </CommandList>
                          </Command>
                        </PopoverContent>
                      </Popover>
                    </div>
                    <div className='space-y-2'>
                      <Label htmlFor='circumstances'>
                        Nome / Circunstâncias da Pesquisa
                      </Label>
                      <Select onValueChange={setCircumstanceText}>
                        <SelectTrigger>
                          <SelectValue placeholder='Selecione um modelo ou digite abaixo' />
                        </SelectTrigger>
                        <SelectContent>
                          {standardCircumstances.map((item) => (
                            <SelectItem key={item.id} value={item.text}>
                              {item.text}
                            </SelectItem>
                          ))}
                        </SelectContent>
                      </Select>
                      <Textarea
                        id='circumstances'
                        name='circumstances'
                        placeholder='Ex: Avaliação Anual 2024, Investigação Pós-Incidente...'
                        value={circumstanceText}
                        onChange={(e) => setCircumstanceText(e.target.value)}
                        required
                      />
                    </div>
                    <div className='grid grid-cols-2 gap-4'>
                      <div className='space-y-2'>
                        <Label htmlFor='month'>Mês de Aplicação</Label>
                        <Select name='month'>
                          <SelectTrigger>
                            <SelectValue placeholder='Selecione o mês' />
                          </SelectTrigger>
                          <SelectContent>
                            {Array.from({ length: 12 }, (_, i) =>
                              new Date(0, i)
                            ).map((date) => (
                              <SelectItem
                                key={date.getMonth()}
                                value={(date.getMonth() + 1).toString()}
                              >
                                {date.toLocaleString('pt-BR', {
                                  month: 'long',
                                })}
                              </SelectItem>
                            ))}
                          </SelectContent>
                        </Select>
                      </div>
                      <div className='space-y-2'>
                        <Label htmlFor='year'>Ano de Aplicação</Label>
                        <Select name='year'>
                          <SelectTrigger>
                            <SelectValue placeholder='Selecione o ano' />
                          </SelectTrigger>
                          <SelectContent>
                            {Array.from(
                              { length: 5 },
                              (_, i) => new Date().getFullYear() - i
                            ).map((year) => (
                              <SelectItem
                                key={year}
                                value={year.toString()}
                              >
                                {year}
                              </SelectItem>
                            ))}
                          </SelectContent>
                        </Select>
                      </div>
                    </div>
                    <div className='grid grid-cols-2 gap-4'>
                      <div className='space-y-2'>
                        <Label htmlFor='total-active'>
                          Total de Colaboradores Ativos
                        </Label>
                        <Input
                          id='total-active'
                          name='total-active'
                          type='number'
                          value={totalEmployees}
                          disabled
                        />
                      </div>
                      <div className='space-y-2'>
                        <Label htmlFor='total-invited'>
                          Total de Convidados
                        </Label>
                        <Input
                          id='total-invited'
                          name='total-invited'
                          type='number'
                          placeholder='Nº de colaboradores'
                        />
                      </div>
                    </div>
                    <p className='text-xs text-muted-foreground'>
                      Após a criação, você poderá gerar o link e definir os
                      parâmetros demográficos.
                    </p>
                  </div>
                </ScrollArea>
              </form>
              <DialogFooter>
                <Button
                  variant='outline'
                  onClick={() => setIsDialogOpen(false)}
                >
                  Cancelar
                </Button>
                <Button type='submit' form='create-survey-form'>
                  Criar Pesquisa
                </Button>
              </DialogFooter>
            </DialogContent>
          </Dialog>
        </div>
      </CardHeader>
      <CardContent>
        {isLoading ? (
          <div className='flex items-center justify-center h-64'>
            <Loader2 className='h-8 w-8 animate-spin' />
          </div>
        ) : (
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>ID da Pesquisa</TableHead>
                <TableHead>Unidade</TableHead>
                <TableHead>Circunstância</TableHead>
                <TableHead>Data de Criação</TableHead>
                <TableHead>Status</TableHead>
                <TableHead>
                  <span className='sr-only'>Ações</span>
                </TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {surveys?.map((survey) => (
                <TableRow key={survey.id}>
                  <TableCell className='font-mono text-sm'>
                    {survey.id}
                  </TableCell>
                  <TableCell>{survey.unit}</TableCell>
                  <TableCell className='font-medium'>
                    {survey.circumstances}
                  </TableCell>
                  <TableCell>
                    {new Date(survey.creationDate).toLocaleDateString(
                      'pt-BR',
                      {
                        timeZone: 'UTC',
                      }
                    )}
                  </TableCell>
                  <TableCell>
                    <Badge variant={getStatusVariant(survey.status)}>
                      {survey.status}
                    </Badge>
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
                          <Link
                            href={`/survey?id=${survey.id}`}
                            target='_blank'
                          >
                            <LinkIcon className='mr-2 h-4 w-4' />
                            Abrir Link da Pesquisa
                          </Link>
                        </DropdownMenuItem>
                        <DropdownMenuSeparator />
                        <DropdownMenuItem asChild>
                          <Link
                            href={`/dashboard/clients/${contractId}/psychosocial/results?surveyId=${survey.id}`}
                          >
                            Ver Resultados
                          </Link>
                        </DropdownMenuItem>
                        <DropdownMenuItem>Arquivar</DropdownMenuItem>
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
  )
}

