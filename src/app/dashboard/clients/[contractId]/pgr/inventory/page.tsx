'use client'

import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { MoreHorizontal, PlusCircle } from 'lucide-react'
import { useState, useMemo } from 'react'
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
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
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
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select'
import { Textarea } from '@/components/ui/textarea'
import { initialHazardData as riskCatalog } from '@/app/dashboard/(main)/risks/page'
import { initialSectorsData as sectors } from '@/app/dashboard/clients/[contractId]/sectors/page'
import { useRolesStore as useRolesStore } from '@/app/dashboard/clients/[contractId]/roles/page'
import { initialEmployeesData as employees } from '@/app/dashboard/clients/[contractId]/employees/page'
import { initialUnitsData as units } from '@/app/dashboard/clients/[contractId]/units/page'
import { initialGheData as ghes } from '@/app/dashboard/clients/[contractId]/ghe/page'
import { ScrollArea } from '@/components/ui/scroll-area'
import { Separator } from '@/components/ui/separator'
import { Checkbox } from '@/components/ui/checkbox'
import { cn } from '@/lib/utils'

type ExposureType =
  | 'unit'
  | 'sector'
  | 'role'
  | 'ghe'
  | 'employee'
  | ''

type RiskLevel =
  | 'Irrelevante'
  | 'Leve'
  | 'Médio'
  | 'Alto'
  | 'Crítico'
  | 'N/A'

interface RiskInventoryItem {
  id: string
  exposureType: ExposureType
  exposureTarget: string
  risk: string
  riskEsocialCode: string
  probability: string
  severity: string
  level: RiskLevel
}

const initialInventory: RiskInventoryItem[] = [
  {
    id: 'INV-001',
    exposureType: 'sector',
    exposureTarget: 'Produção',
    risk: 'Ruído Contínuo',
    riskEsocialCode: '01.01.001',
    probability: '3',
    severity: '2',
    level: 'Médio',
  },
  {
    id: 'INV-002',
    exposureType: 'role',
    exposureTarget: 'Estoquistas',
    risk: 'Levantamento de Peso',
    riskEsocialCode: '04.01.001',
    probability: '2',
    severity: '3',
    level: 'Médio',
  },
  {
    id: 'INV-003',
    exposureType: 'unit',
    exposureTarget: 'Matriz São Paulo',
    risk: 'Iluminamento Inadequado',
    riskEsocialCode: 'N/A',
    probability: '1',
    severity: '1',
    level: 'Leve',
  },
]

const exposureTypeLabels: Record<Exclude<ExposureType, ''>, string> = {
  unit: 'Unidade',
  sector: 'Setor',
  role: 'Cargo',
  ghe: 'GHE',
  employee: 'Colaborador',
}

const frequencyOptions = [
  { value: '0', label: 'Não Exposto' },
  { value: '1', label: 'Altamente Improvável' },
  { value: '2', label: 'Improvável' },
  { value: '3', label: 'Habitual' },
  { value: '4', label: 'Provável' },
  { value: '5', label: 'Altamente Provável' },
]

const effectOptions = [
  { value: '0', label: 'Não se aplica' },
  { value: '1', label: 'Reversível leve' },
  { value: '2', label: 'Reversível severo' },
  { value: '3', label: 'Irreversível severo' },
  { value: '4', label: 'Fatal ou Incapacitante' },
  { value: '5', label: 'Altamente Catastrófico' },
]

const riskMatrixLogic: RiskLevel[][] = [
  // Frequencia (Colunas) ->
  // Efeito (Linhas)
  //   0           1             2            3          4            5
  //   Não Exp | Alt Impr | Improvável | Habitual | Provável | Alt Prov
  ['N/A', 'Irrelevante', 'Leve', 'Leve', 'Médio', 'Médio'], // 0 N/A
  ['N/A', 'Irrelevante', 'Leve', 'Leve', 'Médio', 'Alto'], // 1 Rev Leve
  ['N/A', 'Leve', 'Médio', 'Médio', 'Alto', 'Alto'], // 2 Rev Sev
  ['N/A', 'Leve', 'Médio', 'Alto', 'Alto', 'Crítico'], // 3 Irrev Sev
  ['N/A', 'Médio', 'Alto', 'Alto', 'Crítico', 'Crítico'], // 4 Fatal
  ['N/A', 'Médio', 'Alto', 'Crítico', 'Crítico', 'Crítico'], // 5 Catastrófico
]

const riskDescriptions: Record<RiskLevel, string> = {
  'N/A': 'Não aplicável.',
  Irrelevante:
    'Fatores do ambiente ou elementos materiais que não constituem nenhum incômodo, nenhum risco para a saúde ou integridade física.',
  Leve: 'Fatores do ambiente ou elementos materiais que constituem um incômodo sem ser uma fonte de risco para a saúde ou integridade física.',
  Médio:
    'Fatores do ambiente ou elementos materiais que constituem um incômodo, podendo ser de médio risco para saúde ou integridade física.',
  Alto: 'Fatores do ambiente ou elementos materiais que constituem um risco alto para a saúde e integridade física do trabalhador, cujos valores ou importâncias estão notavelmente próximos do nível de ação.',
  Crítico:
    'Fatores do ambiente ou elementos materiais que constituem um risco critico para a saúde e integridade física do trabalhador, cujos valores ou importâncias estão notavelmente acima dos limites de tolerância.',
}

const getRiskLevel = (freq: number, effect: number): RiskLevel => {
  if (
    freq >= 0 &&
    freq < riskMatrixLogic[0].length &&
    effect >= 0 &&
    effect < riskMatrixLogic.length
  ) {
    return riskMatrixLogic[effect][freq]
  }
  return 'N/A'
}

export default function PgrInventoryPage() {
  const [inventory, setInventory] = useState(initialInventory)
  const [isDialogOpen, setIsDialogOpen] = useState(false)
  const [isDetailOpen, setIsDetailOpen] = useState(false)
  const [selectedItem, setSelectedItem] = useState<RiskInventoryItem | null>(
    null
  )

  const [exposureType, setExposureType] = useState<ExposureType>('')
  const [selectedRiskCode, setSelectedRiskCode] = useState<string>('')
  const [frequency, setFrequency] = useState('0')
  const [effect, setEffect] = useState('0')

  const { roles } = useRolesStore()

  const currentRiskLevel = useMemo(
    () => getRiskLevel(parseInt(frequency), parseInt(effect)),
    [frequency, effect]
  )
  const currentRiskDescription = riskDescriptions[currentRiskLevel]

  const getTargetData = (type: ExposureType) => {
    switch (type) {
      case 'unit':
        return units
      case 'sector':
        return sectors
      case 'role':
        return roles
      case 'employee':
        return employees
      case 'ghe':
        return ghes
      default:
        return []
    }
  }

  const selectedRiskData = riskCatalog.find(
    (r) => r.esocialCode === selectedRiskCode
  )

  const resetFormState = () => {
    setExposureType('')
    setSelectedRiskCode('')
    setFrequency('0')
    setEffect('0')
    setSelectedItem(null)
  }

  const handleOpenDialog = (item?: RiskInventoryItem | null) => {
    if (item) {
      setSelectedItem(item)
      setExposureType(item.exposureType)
      setSelectedRiskCode(item.riskEsocialCode)
      setFrequency(item.probability)
      setEffect(item.severity)
      setIsDetailOpen(true)
    } else {
      resetFormState()
      setIsDialogOpen(true)
    }
  }

  const handleCloseDialog = () => {
    setIsDialogOpen(false)
    setIsDetailOpen(false)
    // No need to call resetFormState() here to keep data on simple close
  }

  const handleFormSubmit = (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault()
    const formData = new FormData(event.currentTarget)
    const freq = parseInt(formData.get('frequency') as string, 10)
    const eff = parseInt(formData.get('effect') as string, 10)
    const level = getRiskLevel(freq, eff)

    const riskCode = formData.get('risk') as string
    const selectedRisk = riskCatalog.find((r) => r.esocialCode === riskCode)

    const newOrUpdatedItem: RiskInventoryItem = {
      id:
        selectedItem?.id ||
        `INV-${Math.random().toString(36).substr(2, 4).toUpperCase()}`,
      exposureType: formData.get('exposureType') as ExposureType,
      exposureTarget: formData.get('exposureTarget') as string,
      risk: selectedRisk?.name || 'N/A',
      riskEsocialCode: selectedRisk?.esocialCode || 'N/A',
      probability: formData.get('frequency') as string,
      severity: formData.get('effect') as string,
      level,
    }

    if (selectedItem) {
      // Update existing item
      setInventory((prev) =>
        prev.map((item) =>
          item.id === selectedItem.id ? newOrUpdatedItem : item
        )
      )
    } else {
      // Add new item
      setInventory((prev) => [newOrUpdatedItem, ...prev])
    }

    handleCloseDialog()
  }

  const getLevelBadgeVariant = (level: RiskLevel) => {
    switch (level) {
      case 'Crítico':
        return 'destructive'
      case 'Alto':
        return 'destructive'
      case 'Médio':
        return 'default'
      case 'Leve':
        return 'secondary'
      default:
        return 'outline'
    }
  }

  const getMatrixCellColor = (freqIndex: number, effectIndex: number) => {
    const level = getRiskLevel(freqIndex + 1, effectIndex + 1) // +1 to account for 'Nao exposto' and 'N/A'
    switch (level) {
      case 'Irrelevante':
        return 'bg-lime-200'
      case 'Leve':
        return 'bg-yellow-200'
      case 'Médio':
        return 'bg-yellow-300'
      case 'Alto':
        return 'bg-orange-400'
      case 'Crítico':
        return 'bg-red-500'
      default:
        return 'bg-gray-100'
    }
  }

  const renderForm = (isEditMode: boolean) => (
    <form id='risk-form' onSubmit={handleFormSubmit}>
      <ScrollArea className='h-[70vh]'>
        <div className='space-y-6 px-4 py-6'>
          {/* Seção 01: Identificação */}
          <div className='space-y-4 rounded-md border p-4'>
            <h3 className='font-semibold'>Seção 01: Identificação do Risco</h3>
            <div className='grid grid-cols-1 md:grid-cols-2 gap-4'>
              <div className='space-y-2'>
                <Label htmlFor='exposureType'>Grupo de Exposição</Label>
                <Select
                  name='exposureType'
                  required
                  value={exposureType}
                  onValueChange={(value) =>
                    setExposureType(value as ExposureType)
                  }
                >
                  <SelectTrigger>
                    <SelectValue placeholder='Selecione...' />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value='unit'>Unidade</SelectItem>
                    <SelectItem value='sector'>Setor</SelectItem>
                    <SelectItem value='role'>Cargo</SelectItem>
                    <SelectItem value='ghe'>GHE</SelectItem>
                    <SelectItem value='employee'>Colaborador</SelectItem>
                  </SelectContent>
                </Select>
              </div>
              <div className='space-y-2'>
                <Label htmlFor='exposureTarget'>Alvo da Exposição</Label>
                <Select
                  name='exposureTarget'
                  required
                  disabled={!exposureType}
                  defaultValue={selectedItem?.exposureTarget}
                >
                  <SelectTrigger>
                    <SelectValue placeholder='Selecione...' />
                  </SelectTrigger>
                  <SelectContent>
                    {getTargetData(exposureType).map((item) => (
                      <SelectItem key={item.id} value={item.name}>
                        {item.name}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
            </div>
            <div className='space-y-2'>
              <Label htmlFor='risk'>Perigo / Agente de Risco</Label>
              <Select
                name='risk'
                required
                value={selectedRiskCode}
                onValueChange={setSelectedRiskCode}
              >
                <SelectTrigger>
                  <SelectValue placeholder='Selecione a partir do catálogo...' />
                </SelectTrigger>
                <SelectContent>
                  {riskCatalog.map((risk) => (
                    <SelectItem key={risk.id} value={risk.esocialCode}>
                      {risk.name} ({risk.esocialCode})
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
            {selectedRiskData && (
              <div className='grid grid-cols-1 md:grid-cols-2 gap-4 text-sm'>
                <div className='space-y-1'>
                  <p className='font-medium text-muted-foreground'>
                    Grupo de Risco
                  </p>
                  <p>{selectedRiskData.category}</p>
                </div>
                <div className='space-y-1'>
                  <p className='font-medium text-muted-foreground'>
                    Fundamentação Legal
                  </p>
                  <p>{selectedRiskData.legalBasis}</p>
                </div>
                <div className='space-y-1 md:col-span-2'>
                  <p className='font-medium text-muted-foreground'>
                    Possíveis lesões ou agravos à saúde
                  </p>
                  <p>{selectedRiskData.potentialEffects}</p>
                </div>
              </div>
            )}
          </div>

          {/* Seção 02: Caracterização */}
          <div className='space-y-4 rounded-md border p-4'>
            <h3 className='font-semibold'>Seção 02: Caracterização da Exposição</h3>
            <div className='space-y-2'>
              <Label htmlFor='sources'>Fontes ou Circunstâncias</Label>
              <Textarea
                id='sources'
                name='sources'
                placeholder='Ex: Motor da máquina XPTO, compressor...'
                defaultValue={
                  isEditMode ? 'Motor da máquina XPTO' : ''
                }
              />
            </div>
            <div className='grid grid-cols-1 md:grid-cols-3 gap-4'>
              <div className='space-y-2'>
                <Label htmlFor='exposureTime'>Tempo de Exposição</Label>
                <Input
                  id='exposureTime'
                  name='exposureTime'
                  placeholder='Ex: 8h/dia'
                  defaultValue={isEditMode ? '8h/dia' : ''}
                />
              </div>
              <div className='space-y-2'>
                <Label htmlFor='exposureTypeDetail'>Tipo de Exposição</Label>
                <Select
                  name='exposureTypeDetail'
                  defaultValue={isEditMode ? 'Permanente' : 'Não Informado'}
                >
                  <SelectTrigger>
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value='Não Informado'>Não Informado</SelectItem>
                    <SelectItem value='Permanente'>Permanente</SelectItem>
                    <SelectItem value='Eventual'>Eventual</SelectItem>
                    <SelectItem value='Intermitente'>Intermitente</SelectItem>
                  </SelectContent>
                </Select>
              </div>
              <div className='space-y-2'>
                <Label htmlFor='evaluationCriteria'>Critério de Avaliação</Label>
                <Select
                  name='evaluationCriteria'
                  defaultValue={isEditMode ? 'Quantitativo' : 'Qualitativo'}
                >
                  <SelectTrigger>
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value='Qualitativo'>Qualitativo</SelectItem>
                    <SelectItem value='Quantitativo'>Quantitativo</SelectItem>
                    <SelectItem value='Semi-quantitativo'>
                      Semi-quantitativo
                    </SelectItem>
                  </SelectContent>
                </Select>
              </div>
            </div>
            <div className='space-y-2'>
              <Label>Metodologia da Avaliação</Label>
              <div className='space-y-2 rounded-md bg-muted/50 p-4'>
                <div className='flex items-center gap-2'>
                  <Checkbox id='method-1' defaultChecked={isEditMode} />
                  <Label htmlFor='method-1' className='font-normal'>
                    Aplicação questionário de avaliação preliminar de risco
                  </Label>
                </div>
                <div className='flex items-center gap-2'>
                  <Checkbox id='method-2' defaultChecked={isEditMode} />
                  <Label htmlFor='method-2' className='font-normal'>
                    Entrevista presencial
                  </Label>
                </div>
                <div className='flex items-center gap-2'>
                  <Checkbox id='method-3' />
                  <Label htmlFor='method-3' className='font-normal'>
                    Informações fornecidas pelo representante da empresa
                  </Label>
                </div>
                <div className='flex items-center gap-2'>
                  <Checkbox id='method-4' />
                  <Label htmlFor='method-4' className='font-normal'>
                    Uso de equipamentos e protocolo de medições
                  </Label>
                </div>
                <div className='flex items-center gap-2'>
                  <Checkbox id='method-5' />
                  <Label htmlFor='method-5' className='font-normal'>
                    Aplicação de ferramenta de avaliação preliminar de fatores de rico
                  </Label>
                </div>
              </div>
            </div>
            <div className='space-y-2'>
              <Label htmlFor='exposureDescription'>Descrição da Exposição</Label>
              <Textarea
                id='exposureDescription'
                name='exposureDescription'
                placeholder='Detalhe como ocorre a exposição ao risco...'
                defaultValue={
                  isEditMode
                    ? 'Exposição contínua durante todo o turno de trabalho.'
                    : ''
                }
              />
            </div>
          </div>

          {/* Seção 03: Matriz de Risco */}
          <div className='space-y-4 rounded-md border p-4'>
            <h3 className='font-semibold'>Seção 03: Matriz de Risco 5x5</h3>
            <div className='grid grid-cols-1 md:grid-cols-2 gap-4'>
              <div className='space-y-2'>
                <Label htmlFor='frequency'>Frequência</Label>
                <Select
                  name='frequency'
                  required
                  value={frequency}
                  onValueChange={setFrequency}
                >
                  <SelectTrigger>
                    <SelectValue placeholder='Selecione...' />
                  </SelectTrigger>
                  <SelectContent>
                    {frequencyOptions.map((opt) => (
                      <SelectItem key={opt.value} value={opt.value}>
                        {opt.label}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
              <div className='space-y-2'>
                <Label htmlFor='effect'>Classificação de Efeito</Label>
                <Select
                  name='effect'
                  required
                  value={effect}
                  onValueChange={setEffect}
                >
                  <SelectTrigger>
                    <SelectValue placeholder='Selecione...' />
                  </SelectTrigger>
                  <SelectContent>
                    {effectOptions.map((opt) => (
                      <SelectItem key={opt.value} value={opt.value}>
                        {opt.label}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
            </div>
            <div className='pt-4'>
              <div className='grid grid-cols-6 text-xs text-center font-medium'>
                <div className='flex items-end justify-center pb-1'>
                  <div className='-rotate-90 origin-bottom-left whitespace-nowrap text-muted-foreground'>
                    Classificação de Efeito
                  </div>
                </div>
                {frequencyOptions.slice(1).map((f) => (
                  <div key={f.value}>{f.label}</div>
                ))}
              </div>
              <div className='grid grid-cols-6'>
                <div className='grid grid-rows-5 text-xs text-right font-medium pr-2'>
                  {effectOptions.slice(1).map((e) => (
                    <div
                      key={e.value}
                      className='flex items-center justify-end'
                    >
                      {e.label}
                    </div>
                  ))}
                </div>
                <div className='col-span-5 grid grid-cols-5 grid-rows-5 gap-1 p-1 rounded-md bg-gray-200'>
                  {effectOptions.slice(1).map((e, effectIndex) =>
                    frequencyOptions.slice(1).map((f, freqIndex) => (
                      <div
                        key={`${f.value}-${e.value}`}
                        className={cn(
                          'h-10 rounded-sm transition-all',
                          getMatrixCellColor(freqIndex, effectIndex),
                          parseInt(frequency) === freqIndex + 1 &&
                            parseInt(effect) === effectIndex + 1 &&
                            'ring-2 ring-blue-500 ring-offset-2'
                        )}
                      />
                    ))
                  )}
                </div>
              </div>
              <div className='text-center text-xs font-medium mt-1 text-muted-foreground'>
                Frequência
              </div>
            </div>
            <div className='space-y-2 pt-4'>
              <Label>Nível de Risco</Label>
              <div className='p-4 rounded-md border bg-muted/50'>
                <Badge variant={getLevelBadgeVariant(currentRiskLevel)}>
                  {currentRiskLevel}
                </Badge>
                <p className='text-sm text-muted-foreground mt-2'>
                  {currentRiskDescription}
                </p>
              </div>
            </div>
          </div>
        </div>
      </ScrollArea>
      <DialogFooter className='pt-4 border-t'>
        <Button type='button' variant='outline' onClick={handleCloseDialog}>
          Cancelar
        </Button>
        <Button type='submit'>Salvar</Button>
      </DialogFooter>
    </form>
  )

  return (
    <Card>
      <CardHeader>
        <CardTitle className='flex items-center justify-between'>
          Inventário de Riscos
          <Button
            size='sm'
            className='h-8 gap-1'
            onClick={() => handleOpenDialog()}
          >
            <PlusCircle className='h-3.5 w-3.5' />
            <span className='sr-only sm:not-sr-only sm:whitespace-nowrap'>
              Adicionar Risco
            </span>
          </Button>
        </CardTitle>
        <CardDescription>
          Gerencie os riscos identificados para cada setor, cargo e atividade.
        </CardDescription>
      </CardHeader>
      <CardContent>
        {inventory.length > 0 ? (
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Alvo da Exposição</TableHead>
                <TableHead>Risco</TableHead>
                <TableHead>Freq.</TableHead>
                <TableHead>Efeito</TableHead>
                <TableHead>Nível do Risco</TableHead>
                <TableHead>
                  <span className='sr-only'>Ações</span>
                </TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {inventory.map((item) => (
                <TableRow
                  key={item.id}
                  className='cursor-pointer'
                  onClick={() => handleOpenDialog(item)}
                >
                  <TableCell>
                    <div className='font-medium'>{item.exposureTarget}</div>
                    <div className='text-sm text-muted-foreground'>
                      {exposureTypeLabels[item.exposureType as Exclude<ExposureType, ''>]}
                    </div>
                  </TableCell>
                  <TableCell>{item.risk}</TableCell>
                  <TableCell>{item.probability}</TableCell>
                  <TableCell>{item.severity}</TableCell>
                  <TableCell>
                    <Badge variant={getLevelBadgeVariant(item.level)}>
                      {item.level}
                    </Badge>
                  </TableCell>
                  <TableCell className='text-right'>
                    <DropdownMenu>
                      <DropdownMenuTrigger asChild>
                        <Button
                          size='icon'
                          variant='ghost'
                          onClick={(e) => e.stopPropagation()}
                        >
                          <MoreHorizontal className='h-4 w-4' />
                        </Button>
                      </DropdownMenuTrigger>
                      <DropdownMenuContent onClick={(e) => e.stopPropagation()}>
                        <DropdownMenuItem onClick={() => handleOpenDialog(item)}>
                          Editar
                        </DropdownMenuItem>
                        <DropdownMenuItem>
                          Criar Ação no Plano
                        </DropdownMenuItem>
                      </DropdownMenuContent>
                    </DropdownMenu>
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        ) : (
          <div className='flex flex-1 items-center justify-center rounded-lg border border-dashed shadow-sm h-96'>
            <div className='flex flex-col items-center gap-1 text-center'>
              <h3 className='text-2xl font-bold tracking-tight'>
                Nenhum risco cadastrado
              </h3>
              <p className='text-sm text-muted-foreground'>
                Comece adicionando o primeiro risco ao inventário.
              </p>
              <Button className='mt-4' onClick={() => handleOpenDialog()}>
                Adicionar Risco
              </Button>
            </div>
          </div>
        )}
      </CardContent>
      {/* Add/Edit Dialog */}
      <Dialog open={isDialogOpen || isDetailOpen} onOpenChange={handleCloseDialog}>
        <DialogContent className='sm:max-w-4xl'>
          <DialogHeader>
            <DialogTitle>
              {selectedItem ? 'Editar Risco no Inventário' : 'Adicionar Risco ao Inventário'}
            </DialogTitle>
            <DialogDescription>
              {selectedItem
                ? 'Visualize e edite os detalhes do risco abaixo.'
                : 'Identifique um perigo, avalie o risco e adicione-o ao inventário do PGR.'}
            </DialogDescription>
          </DialogHeader>
          {renderForm(!!selectedItem)}
        </DialogContent>
      </Dialog>
    </Card>
  )
}
