'use client'

import React, { useState } from 'react'
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
import { MoreHorizontal, PlusCircle, Lock } from 'lucide-react'
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
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuTrigger,
  DropdownMenuSeparator,
} from '@/components/ui/dropdown-menu'
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs'
import { Label } from '@/components/ui/label'
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select'
import { Textarea } from '@/components/ui/textarea'
import {
  initialHazardData,
  type Hazard,
} from '@/app/dashboard/(main)/risks/page'
import { useToast } from '@/hooks/use-toast'
import { Input } from '@/components/ui/input'
import { Checkbox } from '@/components/ui/checkbox'
import { cn } from '@/lib/utils'
import { ScrollArea } from '@/components/ui/scroll-area'
import Link from 'next/link'
import { useParams } from 'next/navigation'
import { initialSectorsData } from '../sectors/data'

type RiskLevelLabel =
  | 'Irrelevante'
  | 'Leve'
  | 'Médio'
  | 'Alto'
  | 'Crítico'
export type RiskColor =
  | 'bg-gray-300'
  | 'bg-lime-200'
  | 'bg-yellow-200'
  | 'bg-orange-300'
  | 'bg-red-400'
  | 'bg-red-500'

export interface RiskEvaluation {
  frequency: number
  severity: number
  riskLevel: number
  riskLabel: RiskLevelLabel
  riskColor: RiskColor
  riskDescription: string
}

export const initialInventory = [
  {
    inventoryId: 'INV-001',
    hazardId: 'RF-001', // Ruído Contínuo ou Intermitente
    unitId: 'UNIT-001', // Matriz São Paulo
    sector: 'Produção',
    source: 'Máquina de corte XYZ',
    evaluation: {
      frequency: 4,
      severity: 3,
      riskLevel: 4,
      riskLabel: 'Alto' as RiskLevelLabel,
      riskColor: 'bg-red-400' as RiskColor,
      riskDescription:
        'Fatores do ambiente ou elementos materiais que constituem um risco alto para a saúde e integridade física do trabalhador, cujos valores ou importâncias estão notavelmente próximos do nível de ação',
    },
  },
  {
    inventoryId: 'INV-002',
    hazardId: 'RE-001', // Levantamento de peso
    unitId: 'UNIT-002', // Filial Rio
    sector: 'Logística',
    source: 'Carregamento manual de caixas',
    evaluation: null as RiskEvaluation | null,
  },
]

const methodologies = [
  {
    id: 'preliminar',
    label:
      'Avaliação preliminar de risco: com entrevistas e coleta de dados e informações',
  },
  {
    id: 'aep',
    label: 'Analise Ergonômica Preliminar - Aplicação de checklist Hudson Couto',
  },
  {
    id: 'stcw',
    label:
      'Aplicação do Formulário STCW - NR30 - Aquaviário (Se esta opção for selecionada, abrir um campo para inserir o nome abaixo: Nome do agente (STCW):',
  },
  {
    id: 'coleta',
    label:
      'Coleta de dados: Medição ou amostragem dos agentes de risco no ambiente. Análise laboratorial: Determinação da concentração ou intensidade. Comparação: Confronto dos resultados com os limites de referência. Cálculo do risco: Uso de modelos para estimar a probabilidade e o impacto numérico. Aplicação de ferramenta de avaliação preliminar de fatores de risco psicossociais',
  },
]

const frequencyOptions = [
  { value: 0, label: 'Não Exposto' },
  { value: 1, label: 'Altamente Improvável' },
  { value: 2, label: 'Improvável' },
  { value: 3, label: 'Habitual' },
  { value: 4, label: 'Provável' },
  { value: 5, label: 'Altamente Provável' },
]

const severityOptions = [
  { value: 0, label: 'Não se aplica' },
  { value: 1, label: 'Reversível leve' },
  { value: 2, label: 'Reversível severo' },
  { value: 3, label: 'Irreversível severo' },
  { value: 4, label: 'Fatal ou Incapacitante' },
  { value: 5, label: 'Altamente Catastrófico' },
]

const riskMatrixConfig = {
  levels: {
    '1': {
      label: 'Irrelevante' as RiskLevelLabel,
      color: 'bg-lime-200' as RiskColor,
      description:
        'Fatores do ambiente ou elementos materiais que não constituem nenhum incômodo, nenhum risco para a saúde ou integridade física',
    },
    '2': {
      label: 'Leve' as RiskLevelLabel,
      color: 'bg-yellow-200' as RiskColor,
      description:
        'Fatores do ambiente ou elementos materiais que constituem um incômodo sem ser uma fonte de risco para a saúde ou integridade física',
    },
    '3': {
      label: 'Médio' as RiskLevelLabel,
      color: 'bg-orange-300' as RiskColor,
      description:
        'Fatores do ambiente ou elementos materiais que constituem um incômodo, podendo ser de médio risco para saúde ou integridade física',
    },
    '4': {
      label: 'Alto' as RiskLevelLabel,
      color: 'bg-red-400' as RiskColor,
      description:
        'Fatores do ambiente ou elementos materiais que constituem um risco alto para a saúde e integridade física do trabalhador, cujos valores ou importâncias estão notavelmente próximos do nível de ação',
    },
    '5': {
      label: 'Crítico' as RiskLevelLabel,
      color: 'bg-red-500' as RiskColor,
      description:
        'Fatores do ambiente ou elementos materiais que constituem um risco critico para a saúde e integridade física do trabalhador, cujos valores ou importâncias estão notavelmente acima dos limites de tolerância',
    },
  },
  matrix: [
    // Frequência (Colunas) vs Severidade (Linhas)
    // Frequência:  1, 2, 3, 4, 5
    [1, 1, 2, 3, 4], // Severidade 1
    [1, 2, 3, 4, 4], // Severidade 2
    [2, 3, 4, 4, 5], // Severidade 3
    [3, 4, 4, 5, 5], // Severidade 4
    [4, 4, 5, 5, 5], // Severidade 5
  ],
}

export const getRiskLevel = (
  frequency: number,
  severity: number
): RiskEvaluation => {
  const freqIndex = frequency - 1
  const sevIndex = severity - 1

  if (freqIndex < 0 || sevIndex < 0) {
    return {
      frequency,
      severity,
      riskLevel: 0,
      riskLabel: 'Irrelevante',
      riskColor: 'bg-gray-300',
      riskDescription: 'Selecione a frequência e a classificação de efeito.',
    }
  }

  const levelIndex = riskMatrixConfig.matrix[sevIndex][freqIndex]
  const levelInfo =
    riskMatrixConfig.levels[
      levelIndex.toString() as keyof typeof riskMatrixConfig.levels
    ]

  return {
    frequency,
    severity,
    riskLevel: levelIndex,
    riskLabel: levelInfo.label,
    riskColor: levelInfo.color,
    riskDescription: levelInfo.description,
  }
}

export const getHazardById = (id: string) =>
  initialHazardData.find((h) => h.id === id)

export default function PgrPage() {
  const params = useParams()
  const contractId = params.contractId as string
  const { toast } = useToast()
  const [inventory, setInventory] = useState(initialInventory)
  const [isAddRiskDialogOpen, setIsAddRiskDialogOpen] = useState(false)
  const [selectedHazard, setSelectedHazard] = useState<Hazard | null>(null)
  const [showStcwInput, setShowStcwInput] = useState(false)

  // State for evaluation form
  const [frequency, setFrequency] = useState(0)
  const [severity, setSeverity] = useState(0)
  const [derivedRisk, setDerivedRisk] = useState<RiskEvaluation | null>(null)

  const handleAddRisk = (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault()
    const formData = new FormData(event.currentTarget)

    if (!derivedRisk || derivedRisk.riskLevel === 0) {
      toast({
        variant: 'destructive',
        title: 'Avaliação Incompleta',
        description:
          'Por favor, avalie o risco na Seção 03 antes de adicionar.',
      })
      return
    }

    const newRisk = {
      inventoryId: `INV-${Date.now().toString().slice(-4)}`,
      hazardId: formData.get('hazard') as string,
      unitId: formData.get('exposureTarget') as string,
      sector: formData.get('exposureTarget') as string,
      source: formData.get('source') as string,
      evaluation: derivedRisk,
    }
    setInventory((prev) => [...prev, newRisk])
    setIsAddRiskDialogOpen(false)
    resetFormState()
    toast({
      title: 'Risco Adicionado!',
      description: `O risco foi adicionado ao inventário com Nível de Risco: ${derivedRisk.riskLabel}.`,
    })
  }

  const handleFrequencyChange = (value: string) => {
    const newFreq = parseInt(value, 10)
    setFrequency(newFreq)
    if (newFreq > 0 && severity > 0) {
      setDerivedRisk(getRiskLevel(newFreq, severity))
    } else {
      setDerivedRisk(null)
    }
  }

  const handleSeverityChange = (value: string) => {
    const newSev = parseInt(value, 10)
    setSeverity(newSev)
    if (frequency > 0 && newSev > 0) {
      setDerivedRisk(getRiskLevel(frequency, newSev))
    } else {
      setDerivedRisk(null)
    }
  }

  const resetFormState = () => {
    setSelectedHazard(null)
    setShowStcwInput(false)
    setFrequency(0)
    setSeverity(0)
    setDerivedRisk(null)
  }

  const handleMethodologyChange = (checked: boolean, id: string) => {
    if (id === 'stcw') {
      setShowStcwInput(checked)
    }
  }

  return (
    <div className='grid flex-1 auto-rows-max gap-4'>
      <div className='flex items-center gap-4'>
        <h1 className='flex-1 shrink-0 whitespace-nowrap text-xl font-semibold tracking-tight sm:grow-0'>
          Programa de Gerenciamento de Riscos (PGR)
        </h1>
      </div>
      <Tabs defaultValue='inventory'>
        <div className='flex items-center'>
          <TabsList>
            <TabsTrigger value='inventory'>Inventário de Riscos</TabsTrigger>
            <TabsTrigger value='plan'>Plano de Ação</TabsTrigger>
          </TabsList>
          <div className='ml-auto flex items-center gap-2'>
            <Button asChild variant='outline'>
              <Link href={`/dashboard/clients/${contractId}/pgr/history`}>
                <Lock className='mr-2 h-4 w-4' />
                Gestão de PGR
              </Link>
            </Button>
            <Dialog
              open={isAddRiskDialogOpen}
              onOpenChange={(isOpen) => {
                setIsAddRiskDialogOpen(isOpen)
                if (!isOpen) resetFormState()
              }}
            >
              <DialogTrigger asChild>
                <Button>
                  <PlusCircle className='mr-2 h-4 w-4' />
                  Adicionar Risco ao Inventário
                </Button>
              </DialogTrigger>
              <DialogContent className='sm:max-w-4xl'>
                <DialogHeader>
                  <DialogTitle>Adicionar Risco ao Inventário</DialogTitle>
                  <DialogDescription>
                    Identifique o perigo, caracterize a exposição e avalie o
                    risco.
                  </DialogDescription>
                </DialogHeader>
                <form id='add-risk-form' onSubmit={handleAddRisk}>
                  <ScrollArea className='h-[70vh]'>
                    <div className='space-y-6 py-4 pr-6'>
                      {/* Section 1 */}
                      <div className='space-y-4 rounded-md border p-4'>
                        <h3 className='font-semibold'>
                          Seção 01: Identificação
                        </h3>
                        <div className='grid md:grid-cols-2 gap-4'>
                          <div className='space-y-2'>
                            <Label htmlFor='exposureGroup'>
                              Grupo de Exposição
                            </Label>
                            <Select name='exposureGroup' required>
                              <SelectTrigger>
                                <SelectValue placeholder='Selecione o grupo' />
                              </SelectTrigger>
                              <SelectContent>
                                <SelectItem value='unit'>Unidade</SelectItem>
                                <SelectItem value='sector'>Setor</SelectItem>
                                <SelectItem value='role'>Cargo</SelectItem>
                                <SelectItem value='ghe'>GHE</SelectItem>
                                <SelectItem value='employee'>
                                  Colaborador Específico
                                </SelectItem>
                              </SelectContent>
                            </Select>
                          </div>
                          <div className='space-y-2'>
                            <Label htmlFor='exposureTarget'>
                              Alvo da Exposição
                            </Label>
                            <Select name='exposureTarget' required>
                              <SelectTrigger>
                                <SelectValue placeholder='Selecione o setor' />
                              </SelectTrigger>
                              <SelectContent>
                                {initialSectorsData.map((sector) => (
                                  <SelectItem
                                    key={sector.id}
                                    value={sector.name}
                                  >
                                    {sector.name}
                                  </SelectItem>
                                ))}
                              </SelectContent>
                            </Select>
                          </div>
                        </div>

                        <div className='space-y-2'>
                          <Label htmlFor='hazard'>
                            Perigo / Agente de Risco
                          </Label>
                          <Select
                            name='hazard'
                            required
                            onValueChange={(value) =>
                              setSelectedHazard(getHazardById(value) || null)
                            }
                          >
                            <SelectTrigger>
                              <SelectValue placeholder='Selecione o perigo no catálogo' />
                            </SelectTrigger>
                            <SelectContent>
                              {initialHazardData.map((hazard) => (
                                <SelectItem key={hazard.id} value={hazard.id}>
                                  {hazard.name} ({hazard.category})
                                </SelectItem>
                              ))}
                            </SelectContent>
                          </Select>
                        </div>

                        {selectedHazard && (
                          <div className='grid md:grid-cols-2 gap-4 text-sm'>
                            <div className='space-y-1'>
                              <p className='font-medium text-muted-foreground'>
                                Grupo de risco
                              </p>
                              <p className='font-semibold'>
                                {selectedHazard.category}
                              </p>
                            </div>
                            <div className='space-y-1'>
                              <p className='font-medium text-muted-foreground'>
                                Fundamentação legal
                              </p>
                              <p className='font-semibold'>
                                {selectedHazard.legalBasis}
                              </p>
                            </div>
                            <div className='space-y-1 col-span-2'>
                              <p className='font-medium text-muted-foreground'>
                                Efeitos potenciais / Possíveis lesões ou agravos
                                à saúde
                              </p>
                              <p className='font-semibold'>
                                {selectedHazard.potentialEffects}
                              </p>
                            </div>
                          </div>
                        )}
                      </div>

                      {/* Section 2 */}
                      <div className='space-y-4 rounded-md border p-4'>
                        <h3 className='font-semibold'>
                          Seção 02: Caracterização da Exposição
                        </h3>
                        <div className='space-y-2'>
                          <Label htmlFor='source'>
                            Fontes ou circunstâncias
                          </Label>
                          <Textarea
                            id='source'
                            name='source'
                            placeholder='Descreva a fonte do risco. Ex: Prensa hidráulica modelo X, atividade de solda...'
                            required
                          />
                        </div>
                        <div className='grid md:grid-cols-2 gap-4'>
                          <div className='space-y-2'>
                            <Label htmlFor='exposureTime'>
                              Tempo de exposição
                            </Label>
                            <Input
                              id='exposureTime'
                              name='exposureTime'
                              placeholder='HH:MM'
                            />
                          </div>
                          <div className='space-y-2'>
                            <Label htmlFor='exposureType'>
                              Tipo de Exposição
                            </Label>
                            <Select name='exposureType'>
                              <SelectTrigger>
                                <SelectValue placeholder='Selecione o tipo' />
                              </SelectTrigger>
                              <SelectContent>
                                <SelectItem value='not_informed'>
                                  Não Informado
                                </SelectItem>
                                <SelectItem value='permanent'>
                                  Permanente
                                </SelectItem>
                                <SelectItem value='eventual'>
                                  Eventual
                                </SelectItem>
                                <SelectItem value='intermittent'>
                                  Intermitente
                                </SelectItem>
                              </SelectContent>
                            </Select>
                          </div>
                        </div>
                        <div className='space-y-2'>
                          <Label htmlFor='evaluationCriteria'>
                            Critério de avaliação
                          </Label>
                          <Select name='evaluationCriteria'>
                            <SelectTrigger>
                              <SelectValue placeholder='Selecione o critério' />
                            </SelectTrigger>
                            <SelectContent>
                              <SelectItem value='qualitative'>
                                Avaliação Qualitativa
                              </SelectItem>
                              <SelectItem value='quantitative'>
                                Avaliação Quantitativa de Risco (AQR)
                              </SelectItem>
                            </SelectContent>
                          </Select>
                        </div>
                        <div className='space-y-3'>
                          <Label>Metodologia da Avaliação</Label>
                          <div className='space-y-2'>
                            {methodologies.map((item) => (
                              <div
                                key={item.id}
                                className='flex items-start space-x-2'
                              >
                                <Checkbox
                                  id={`method-${item.id}`}
                                  name='methodology'
                                  value={item.id}
                                  onCheckedChange={(checked) =>
                                    handleMethodologyChange(!!checked, item.id)
                                  }
                                />
                                <div className='grid gap-1.5 leading-none'>
                                  <label
                                    htmlFor={`method-${item.id}`}
                                    className='text-sm font-normal leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70'
                                  >
                                    {item.label}
                                  </label>
                                  {item.id === 'stcw' && showStcwInput && (
                                    <Input
                                      name='stcw_agent_name'
                                      placeholder='Nome do agente (STCW)'
                                      className='mt-2'
                                    />
                                  )}
                                </div>
                              </div>
                            ))}
                          </div>
                        </div>
                        <div className='space-y-2'>
                          <Label htmlFor='exposureDescription'>
                            Descrição da exposição
                          </Label>
                          <Textarea
                            id='exposureDescription'
                            name='exposureDescription'
                            placeholder='Descreva mais detalhes de como ocorre a exposição...'
                          />
                        </div>
                      </div>

                      {/* Section 3 */}
                      <div className='space-y-4 rounded-md border p-4'>
                        <h3 className='font-semibold'>
                          Seção 03: Matriz de Risco 5x5
                        </h3>
                        <div className='grid gap-8'>
                          <div className='space-y-6'>
                            <div className='space-y-2'>
                              <Label htmlFor='frequency'>Frequência</Label>
                              <Select
                                name='frequency'
                                required
                                value={frequency.toString()}
                                onValueChange={handleFrequencyChange}
                              >
                                <SelectTrigger>
                                  <SelectValue placeholder='Selecione a frequência' />
                                </SelectTrigger>
                                <SelectContent>
                                  {frequencyOptions.map((opt) => (
                                    <SelectItem
                                      key={opt.value}
                                      value={opt.value.toString()}
                                    >
                                      {opt.label}
                                    </SelectItem>
                                  ))}
                                </SelectContent>
                              </Select>
                            </div>
                            <div className='space-y-2'>
                              <Label htmlFor='severity'>
                                Classificação de Efeito
                              </Label>
                              <Select
                                name='severity'
                                required
                                value={severity.toString()}
                                onValueChange={handleSeverityChange}
                              >
                                <SelectTrigger>
                                  <SelectValue placeholder='Selecione a classificação' />
                                </SelectTrigger>
                                <SelectContent>
                                  {severityOptions.map((opt) => (
                                    <SelectItem
                                      key={opt.value}
                                      value={opt.value.toString()}
                                    >
                                      {opt.label}
                                    </SelectItem>
                                  ))}
                                </SelectContent>
                              </Select>
                            </div>
                            {derivedRisk && derivedRisk.riskLevel > 0 && (
                              <div className='rounded-md border p-4 space-y-2 bg-muted/50'>
                                <h3 className='font-semibold'>
                                  Resultado da Avaliação
                                </h3>
                                <div className='flex items-center gap-2'>
                                  <span
                                    className={cn(
                                      'h-4 w-4 rounded-full',
                                      derivedRisk.riskColor
                                    )}
                                  />
                                  <p className='font-bold text-lg'>
                                    {derivedRisk.riskLabel}
                                  </p>
                                </div>
                                <p className='text-sm text-muted-foreground'>
                                  {derivedRisk.riskDescription}
                                </p>
                              </div>
                            )}
                          </div>
                          <div className='space-y-2'>
                            <h3 className='font-semibold text-center'>
                              Matriz de Risco
                            </h3>
                            <div className='grid grid-cols-6 gap-1 text-xs text-center items-center'>
                              <div />
                              {frequencyOptions.slice(1).map((opt) => (
                                <div
                                  key={opt.value}
                                  className='font-medium text-muted-foreground p-1'
                                >
                                  {opt.label}
                                </div>
                              ))}
                              {severityOptions
                                .slice(1)
                                .map((sevOpt, rowIndex) => (
                                  <React.Fragment key={sevOpt.value}>
                                    <div className='font-medium text-muted-foreground text-right p-1'>
                                      {sevOpt.label}
                                    </div>
                                    {frequencyOptions
                                      .slice(1)
                                      .map((freqOpt, colIndex) => {
                                        const levelIndex =
                                          riskMatrixConfig.matrix[rowIndex][
                                            colIndex
                                          ]
                                        const currentLevel =
                                          riskMatrixConfig.levels[
                                            levelIndex.toString() as keyof typeof riskMatrixConfig.levels
                                          ]
                                        const isSelected =
                                          freqOpt.value === frequency &&
                                          sevOpt.value === severity
                                        return (
                                          <div
                                            key={`${rowIndex}-${colIndex}`}
                                            className={cn(
                                              'h-12 flex items-center justify-center rounded-sm text-white font-bold',
                                              currentLevel.color,
                                              isSelected &&
                                                'ring-2 ring-offset-2 ring-primary'
                                            )}
                                          ></div>
                                        )
                                      })}
                                  </React.Fragment>
                                ))}
                            </div>
                            <div className='flex justify-center gap-4 text-xs mt-4 flex-wrap'>
                              {Object.values(riskMatrixConfig.levels).map(
                                (level) => (
                                  <div
                                    key={level.label}
                                    className='flex items-center gap-1.5'
                                  >
                                    <div
                                      className={cn(
                                        'h-3 w-3 rounded-full',
                                        level.color
                                      )}
                                    ></div>
                                    <span>{level.label}</span>
                                  </div>
                                )
                              )}
                            </div>
                          </div>
                        </div>
                      </div>
                    </div>
                  </ScrollArea>
                  <DialogFooter>
                    <Button
                      variant='outline'
                      type='button'
                      onClick={() => setIsAddRiskDialogOpen(false)}
                    >
                      Cancelar
                    </Button>
                    <Button type='submit' form='add-risk-form'>
                      Adicionar
                    </Button>
                  </DialogFooter>
                </form>
              </DialogContent>
            </Dialog>
          </div>
        </div>
        <TabsContent value='inventory'>
          <Card>
            <CardHeader>
              <CardTitle>Inventário de Riscos Ocupacionais</CardTitle>
              <CardDescription>
                Listagem de todos os perigos e riscos identificados na empresa.
                Avalie cada risco para determinar sua prioridade.
              </CardDescription>
            </CardHeader>
            <CardContent>
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>Perigo / Fator de Risco</TableHead>
                    <TableHead>Setor</TableHead>
                    <TableHead>Nível de Risco</TableHead>
                    <TableHead>Status</TableHead>
                    <TableHead>
                      <span className='sr-only'>Ações</span>
                    </TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {inventory.map((item) => {
                    const hazard = getHazardById(item.hazardId)
                    if (!hazard) return null
                    return (
                      <TableRow key={item.inventoryId}>
                        <TableCell className='font-medium'>
                          <div className='font-medium'>{hazard.name}</div>
                          <div className='text-sm text-muted-foreground'>
                            {item.source}
                          </div>
                        </TableCell>
                        <TableCell>{item.sector}</TableCell>
                        <TableCell>
                          {item.evaluation ? (
                            <div className='flex items-center gap-2'>
                              <span
                                className={cn(
                                  'h-3 w-3 rounded-full',
                                  item.evaluation.riskColor
                                )}
                              />
                              <span>{item.evaluation.riskLabel}</span>
                            </div>
                          ) : (
                            <span className='text-muted-foreground'>
                              Não avaliado
                            </span>
                          )}
                        </TableCell>
                        <TableCell>
                          <Badge
                            variant={item.evaluation ? 'secondary' : 'outline'}
                          >
                            {item.evaluation ? 'Avaliado' : 'Pendente'}
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
                              </Button>
                            </DropdownMenuTrigger>
                            <DropdownMenuContent align='end'>
                              <DropdownMenuLabel>Ações</DropdownMenuLabel>
                              <DropdownMenuItem>Editar Risco</DropdownMenuItem>
                              <DropdownMenuSeparator />
                              <DropdownMenuItem disabled={!item.evaluation}>
                                Criar Plano de Ação
                              </DropdownMenuItem>
                              <DropdownMenuItem className='text-destructive'>
                                Excluir
                              </DropdownMenuItem>
                            </DropdownMenuContent>
                          </DropdownMenu>
                        </TableCell>
                      </TableRow>
                    )
                  })}
                </TableBody>
              </Table>
            </CardContent>
          </Card>
        </TabsContent>
        <TabsContent value='plan'>
          <Card>
            <CardHeader>
              <CardTitle>Plano de Ação</CardTitle>
              <CardDescription>
                Ações de melhoria para mitigar ou eliminar os riscos
                identificados.
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className='flex flex-1 items-center justify-center rounded-lg border border-dashed shadow-sm h-96'>
                <div className='flex flex-col items-center gap-1 text-center'>
                  <h3 className='text-2xl font-bold tracking-tight'>
                    Nenhuma ação planejada
                  </h3>
                  <p className='text-sm text-muted-foreground'>
                    Avalie um risco no inventário para criar uma ação.
                  </p>
                </div>
              </div>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  )
}
