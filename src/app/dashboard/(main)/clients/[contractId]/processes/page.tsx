
'use client'

import { useState, useMemo } from 'react'
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
  List,
  LayoutGrid,
  Search,
  Filter,
  MoreHorizontal,
  X,
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
import {
  initialProcessesData,
  type Process,
  type ProcessStep,
  type ProcessType,
} from './data'
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
import { initialActivitiesData } from '../activities/data'
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuCheckboxItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu'
import { initialUnitsData } from '../units/data'

export default function ProcessesPage() {
  const [processes, setProcesses] = useState(initialProcessesData)
  const [isProcessDialogOpen, setIsProcessDialogOpen] = useState(false)
  const [editingProcess, setEditingProcess] = useState<Process | null>(null)
  const [formSteps, setFormSteps] = useState<ProcessStep[]>([])
  const [formObligations, setFormObligations] = useState<string[]>([])
  const [obligationInput, setObligationInput] = useState('')
  const { toast } = useToast()

  const [viewMode, setViewMode] = useState<'card' | 'list'>('card')
  const [searchTerm, setSearchTerm] = useState('')
  const [sectorFilter, setSectorFilter] = useState<string[]>([])

  const uniqueSectors = [
    ...new Set(initialProcessesData.map((p) => p.primarySector)),
  ]

  const filteredProcesses = useMemo(() => {
    return processes.filter((process) => {
      const matchesSearch =
        process.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
        process.objective.toLowerCase().includes(searchTerm.toLowerCase())

      const matchesSector =
        sectorFilter.length === 0 ||
        sectorFilter.includes(process.primarySector)

      return matchesSearch && matchesSector
    })
  }, [processes, searchTerm, sectorFilter])

  const handleProcessSubmit = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault()
    const formData = new FormData(e.currentTarget)
    const processId = editingProcess ? editingProcess.id : `PROC-${Date.now()}`

    const updatedProcess: Process = {
      id: processId,
      name: formData.get('name') as string,
      objective: formData.get('objective') as string,
      primarySector: formData.get('primarySector') as string,
      type: formData.get('type') as ProcessType,
      isCritical: formData.get('isCritical') === 'on',
      obligations: formObligations,
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
    setFormObligations(process ? [...process.obligations] : [])
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

  const handleAddObligation = () => {
    if (
      obligationInput.trim() &&
      !formObligations.includes(obligationInput.trim())
    ) {
      setFormObligations([...formObligations, obligationInput.trim()])
      setObligationInput('')
    }
  }

  const handleRemoveObligation = (obligationToRemove: string) => {
    setFormObligations(
      formObligations.filter((ob) => ob !== obligationToRemove)
    )
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
          <div className='flex items-center justify-between pt-4'>
            <div className='flex items-center gap-2'>
              <div className='relative w-full max-w-sm'>
                <Search className='absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground' />
                <Input
                  type='search'
                  placeholder='Buscar por nome do processo...'
                  className='pl-8'
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                />
              </div>
              <DropdownMenu>
                <DropdownMenuTrigger asChild>
                  <Button
                    variant='outline'
                    size='sm'
                    className='h-10 gap-1 text-sm'
                  >
                    <Filter className='h-3.5 w-3.5' />
                    <span className='sr-only sm:not-sr-only'>Filtrar</span>
                  </Button>
                </DropdownMenuTrigger>
                <DropdownMenuContent align='end'>
                  <DropdownMenuLabel>Filtrar por Setor</DropdownMenuLabel>
                  <DropdownMenuSeparator />
                  {uniqueSectors.map((sector) => (
                    <DropdownMenuCheckboxItem
                      key={sector}
                      checked={sectorFilter.includes(sector)}
                      onCheckedChange={(checked) => {
                        setSectorFilter((prev) =>
                          checked
                            ? [...prev, sector]
                            : prev.filter((s) => s !== sector)
                        )
                      }}
                    >
                      {sector}
                    </DropdownMenuCheckboxItem>
                  ))}
                </DropdownMenuContent>
              </DropdownMenu>
            </div>
            <div className='flex items-center gap-2'>
              <div className='flex items-center gap-1 rounded-lg bg-muted p-1'>
                <Button
                  variant={viewMode === 'list' ? 'secondary' : 'ghost'}
                  size='icon'
                  className='h-8 w-8'
                  onClick={() => setViewMode('list')}
                >
                  <List className='h-4 w-4' />
                </Button>
                <Button
                  variant={viewMode === 'card' ? 'secondary' : 'ghost'}
                  size='icon'
                  className='h-8 w-8'
                  onClick={() => setViewMode('card')}
                >
                  <LayoutGrid className='h-4 w-4' />
                </Button>
              </div>
              <Button onClick={() => openProcessDialog(null)}>
                <PlusCircle className='mr-2 h-4 w-4' /> Adicionar Processo
              </Button>
            </div>
          </div>
        </CardHeader>
        <CardContent>
          {viewMode === 'card' ? (
            <div className='grid gap-6 md:grid-cols-2 lg:grid-cols-3'>
              {filteredProcesses.map((process) => (
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
          ) : (
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Processo</TableHead>
                  <TableHead>Setor Principal</TableHead>
                  <TableHead>Etapas</TableHead>
                  <TableHead>
                    <span className='sr-only'>Ações</span>
                  </TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {filteredProcesses.map((process) => (
                  <TableRow
                    key={process.id}
                    onClick={() => openProcessDialog(process)}
                    className='cursor-pointer'
                  >
                    <TableCell className='font-medium'>
                      {process.name}
                    </TableCell>
                    <TableCell>
                      <Badge variant='outline'>{process.primarySector}</Badge>
                    </TableCell>
                    <TableCell>{process.steps.length}</TableCell>
                    <TableCell>
                      <Button variant='ghost' size='icon'>
                        <MoreHorizontal className='h-4 w-4' />
                      </Button>
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          )}

          {filteredProcesses.length === 0 && (
            <div className='flex flex-1 items-center justify-center rounded-lg border border-dashed shadow-sm h-96'>
              <div className='flex flex-col items-center gap-1 text-center'>
                <h3 className='text-2xl font-bold tracking-tight'>
                  Nenhum processo encontrado
                </h3>
                <p className='text-sm text-muted-foreground'>
                  Ajuste os filtros ou adicione um novo processo.
                </p>
                <Button
                  className='mt-4'
                  onClick={() => openProcessDialog(null)}
                >
                  Adicionar Processo
                </Button>
              </div>
            </div>
          )}
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
                    <Label htmlFor='abrangencia'>Abrangência</Label>
                     <Select
                      name='abrangencia'
                      defaultValue='setor'
                    >
                      <SelectTrigger>
                        <SelectValue placeholder='Selecione a abrangência' />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value='unidade'>Unidade</SelectItem>
                        <SelectItem value='setor'>Setor(es)</SelectItem>
                        <SelectItem value='cargo'>Cargo(s)</SelectItem>
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
                
                <fieldset className='grid grid-cols-1 md:grid-cols-2 gap-4 rounded-lg border p-4'>
                  <legend className='-ml-1 px-1 text-sm font-medium'>
                    Categorização
                  </legend>
                  <div className='space-y-2'>
                    <Label htmlFor='type'>Tipo de Processo</Label>
                    <Select name='type' defaultValue={editingProcess?.type}>
                      <SelectTrigger>
                        <SelectValue placeholder='Selecione o tipo' />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value='POP'>
                          POP - Procedimento Operacional Padrão
                        </SelectItem>
                        <SelectItem value='PP'>
                          PP - Procedimento de Produção
                        </SelectItem>
                        <SelectItem value='PRS'>
                          PRS - Procedimento para Realização de Serviço
                        </SelectItem>
                        <SelectItem value='PRT'>
                          PRT - Procedimento para Realização de Atividade
                        </SelectItem>
                         <SelectItem value='PI'>
                          PI - Processo Interno
                        </SelectItem>
                        <SelectItem value='Outro'>Outro</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                  <div className='space-y-2'>
                    <Label htmlFor='obligations'>Obrigações Vinculadas (opcional)</Label>
                    <div className='flex gap-2'>
                      <Input
                        id='obligations'
                        value={obligationInput}
                        onChange={(e) => setObligationInput(e.target.value)}
                        onKeyDown={(e) => {
                          if (e.key === 'Enter') {
                            e.preventDefault();
                            handleAddObligation();
                          }
                        }}
                        placeholder='Ex: NR-32, ISO 9001'
                      />
                      <Button type='button' onClick={handleAddObligation}>Adicionar</Button>
                    </div>
                     <div className="flex flex-wrap gap-2 mt-2">
                        {formObligations.map((ob) => (
                          <Badge key={ob} variant="secondary" className="flex items-center gap-1">
                            {ob}
                            <button type="button" onClick={() => handleRemoveObligation(ob)} className="rounded-full hover:bg-background/50">
                              <X className="h-3 w-3" />
                            </button>
                          </Badge>
                        ))}
                      </div>
                  </div>
                   <div className='flex items-center space-x-2 md:col-span-2'>
                    <Checkbox id='isCritical' name='isCritical' defaultChecked={editingProcess?.isCritical} />
                    <Label
                      htmlFor='isCritical'
                      className='text-sm font-medium leading-none'
                    >
                      Este é um processo crítico? (impacto em segurança, qualidade ou operação)
                    </Label>
                  </div>
                </fieldset>

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
                          <Select
                            name={`step-name-${index}`}
                            defaultValue={step.name}
                            required
                          >
                            <SelectTrigger>
                              <SelectValue placeholder='Selecione a atividade padrão' />
                            </SelectTrigger>
                            <SelectContent>
                              {initialActivitiesData.map((activity) => (
                                <SelectItem
                                  key={activity.id}
                                  value={activity.name}
                                >
                                  {activity.name}
                                </SelectItem>
                              ))}
                            </SelectContent>
                          </Select>
                          <Textarea
                            name={`step-description-${index}`}
                            defaultValue={step.description}
                            placeholder='Descrição da atividade (opcional, pode vir do catálogo)'
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
