
'use client'

import React, { useState, useEffect, useMemo } from 'react'
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog'
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select'
import {
  Command,
  CommandEmpty,
  CommandGroup,
  CommandInput,
  CommandItem,
  CommandList,
} from '@/components/ui/command'
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from '@/components/ui/popover'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Textarea } from '@/components/ui/textarea'
import { Separator } from '@/components/ui/separator'
import { Checkbox } from '@/components/ui/checkbox'
import { ScrollArea } from '@/components/ui/scroll-area'
import { useToast } from '@/hooks/use-toast'
import { cn } from '@/lib/utils'
import {
  getRiskLevel,
  riskMatrixConfig,
  type RiskEvaluation,
} from '@/lib/risk-utils'
import {
  useFirestore,
  addDocumentNonBlocking,
  useCollection,
  useMemoFirebase,
} from '@/firebase'
import { collection, getDocs } from 'firebase/firestore'
import type { Hazard, PgrInventoryItem } from '@/lib/types/risk'
import type { Unit } from '@/lib/types/unit'
import type { Sector } from '@/lib/types/sector'
import type { Role } from '@/lib/types/role'
import type { GHE } from '@/lib/types/ghe'
import type { Employee } from '@/lib/types/employee'
import { Loader2 } from 'lucide-react'

interface AddPgrRiskDialogProps {
  open: boolean
  onOpenChange: (open: boolean) => void
  contractId: string
  hazardData: Hazard[] | null
  unitsData: Unit[] | null
  rolesData: Role[] | null
  ghesData: GHE[] | null
  employeesData: Employee[] | null
}

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

export function AddPgrRiskDialog({
  open,
  onOpenChange,
  contractId,
  hazardData,
  unitsData,
  rolesData,
  ghesData,
  employeesData,
}: AddPgrRiskDialogProps) {
  const firestore = useFirestore()
  const { toast } = useToast()

  const inventoryRef = useMemoFirebase(
    () =>
      firestore
        ? collection(firestore, `clients/${contractId}/pgr_inventory`)
        : null,
    [firestore, contractId]
  )

  const [selectedHazard, setSelectedHazard] = useState<Hazard | null>(null)
  const [showStcwInput, setShowStcwInput] = useState(false)
  const [frequency, setFrequency] = useState(0)
  const [severity, setSeverity] = useState(0)
  const [derivedRisk, setDerivedRisk] = useState<RiskEvaluation | null>(null)
  const [exposureGroupType, setExposureGroupType] = useState<string>('')
  const [selectedUnitId, setSelectedUnitId] = useState<string>('')
  const [selectedExposureTarget, setSelectedExposureTarget] = useState<string>('')
  const [allSectors, setAllSectors] = useState<Sector[]>([])
  const [areSectorsLoading, setAreSectorsLoading] = useState(true)

  useEffect(() => {
    if (unitsData && firestore) {
      setAreSectorsLoading(true)
      const fetchSectors = async () => {
        const sectorsPromises = unitsData.map((unit) =>
          getDocs(
            collection(
              firestore,
              `clients/${contractId}/units/${unit.id}/sectors`
            )
          )
        )
        const sectorsSnapshots = await Promise.all(sectorsPromises)
        const sectorsData = sectorsSnapshots.flatMap((snapshot) =>
          snapshot.docs.map(
            (doc) => ({ id: doc.id, ...doc.data() } as Sector)
          )
        )
        setAllSectors(sectorsData)
        setAreSectorsLoading(false)
      }
      fetchSectors()
    } else {
      setAreSectorsLoading(false)
    }
  }, [unitsData, firestore, contractId])

  const sectorsInUnit = useMemo(() => {
    if (!selectedUnitId || areSectorsLoading) return []
    return allSectors.filter((s) => s.unitId === selectedUnitId)
  }, [selectedUnitId, allSectors, areSectorsLoading])

  const resetFormState = () => {
    setSelectedHazard(null)
    setShowStcwInput(false)
    setFrequency(0)
    setSeverity(0)
    setDerivedRisk(null)
    setExposureGroupType('')
    setSelectedUnitId('')
    setSelectedExposureTarget('')
  }
  
  useEffect(() => {
    if (!open) {
      resetFormState()
    }
  }, [open])

  const handleAddRisk = (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault()
    if (!inventoryRef) return

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

    const sectorName = formData.get('exposureTarget') as string

    const newRisk: Omit<PgrInventoryItem, 'id'> = {
      hazardId: formData.get('hazard') as string,
      unitId: formData.get('unitId') as string,
      sector: sectorName,
      source: formData.get('source') as string,
      evaluation: derivedRisk,
    }

    addDocumentNonBlocking(inventoryRef, newRisk)

    onOpenChange(false)
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

  const handleMethodologyChange = (checked: boolean, id: string) => {
    if (id === 'stcw') {
      setShowStcwInput(checked)
    }
  }

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className='sm:max-w-4xl'>
        <DialogHeader>
          <DialogTitle>Adicionar Risco ao Inventário</DialogTitle>
          <DialogDescription>
            Identifique o perigo, caracterize a exposição e avalie o risco.
          </DialogDescription>
        </DialogHeader>
        <form id='add-risk-form' onSubmit={handleAddRisk}>
          <ScrollArea className='h-[70vh]'>
            <div className='space-y-6 py-4 pr-6'>
              {/* Section 1 */}
              <div className='space-y-4 rounded-md border p-4'>
                <h3 className='font-semibold'>Seção 01: Identificação</h3>
                <div className='grid md:grid-cols-2 gap-4'>
                  <div className='space-y-2'>
                    <Label htmlFor='unitId'>Unidade</Label>
                    <Select
                      name='unitId'
                      required
                      onValueChange={setSelectedUnitId}
                      value={selectedUnitId}
                    >
                      <SelectTrigger>
                        <SelectValue placeholder='Selecione a unidade' />
                      </SelectTrigger>
                      <SelectContent>
                        {unitsData?.map((unit) => (
                          <SelectItem key={unit.id} value={unit.id!}>
                            {unit.name}
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                  </div>
                  <div className='space-y-2'>
                    <Label htmlFor='exposureGroup'>Grupo de Exposição</Label>
                    <Select
                      name='exposureGroup'
                      required
                      onValueChange={setExposureGroupType}
                      value={exposureGroupType}
                    >
                      <SelectTrigger>
                        <SelectValue placeholder='Selecione o grupo' />
                      </SelectTrigger>
                      <SelectContent>
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
                    <Label htmlFor='exposureTarget'>Alvo da Exposição</Label>
                    <Select
                      name='exposureTarget'
                      required
                      disabled={!exposureGroupType || !selectedUnitId}
                      value={selectedExposureTarget}
                      onValueChange={setSelectedExposureTarget}
                    >
                      <SelectTrigger>
                        <SelectValue placeholder='Selecione o alvo da exposição' />
                      </SelectTrigger>
                      <SelectContent>
                        {exposureGroupType === 'sector' &&
                          sectorsInUnit.map((sector) => (
                            <SelectItem key={sector.id} value={sector.name}>
                              {sector.name}
                            </SelectItem>
                          ))}
                        {exposureGroupType === 'role' &&
                          rolesData
                            ?.filter((r) =>
                              sectorsInUnit.some(
                                (s) => s.id === r.sectorId
                              )
                            )
                            .map((role) => (
                              <SelectItem key={role.id} value={role.name}>
                                {role.name}
                              </SelectItem>
                            ))}
                        {exposureGroupType === 'ghe' &&
                          ghesData
                            ?.filter((g) => g.unitId === selectedUnitId)
                            .map((ghe) => (
                              <SelectItem key={ghe.id} value={ghe.name}>
                                {ghe.name}
                              </SelectItem>
                            ))}
                        {exposureGroupType === 'employee' &&
                          employeesData?.map((employee) => (
                            <SelectItem key={employee.id} value={employee.name}>
                              {employee.name}
                            </SelectItem>
                          ))}
                      </SelectContent>
                    </Select>
                  </div>
                </div>

                <div className='space-y-2'>
                  <Label htmlFor='hazard'>Perigo / Agente de Risco</Label>
                  <Select
                    name='hazard'
                    required
                    onValueChange={(value) =>
                      setSelectedHazard(
                        hazardData?.find((h) => h.id === value) || null
                      )
                    }
                  >
                    <SelectTrigger>
                      <SelectValue placeholder='Selecione o perigo no catálogo' />
                    </SelectTrigger>
                    <SelectContent>
                      {hazardData?.map((hazard) => (
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
                      <p className='font-semibold'>{selectedHazard.category}</p>
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
                        Efeitos potenciais / Possíveis lesões ou agravos à saúde
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
                  <Label htmlFor='source'>Fontes ou circunstâncias</Label>
                  <Textarea
                    id='source'
                    name='source'
                    placeholder='Descreva a fonte do risco. Ex: Prensa hidráulica modelo X, atividade de solda...'
                    required
                  />
                </div>
                <div className='grid md:grid-cols-2 gap-4'>
                  <div className='space-y-2'>
                    <Label htmlFor='exposureTime'>Tempo de exposição</Label>
                    <Input id='exposureTime' name='exposureTime' placeholder='HH:MM' />
                  </div>
                  <div className='space-y-2'>
                    <Label htmlFor='exposureType'>Tipo de Exposição</Label>
                    <Select name='exposureType'>
                      <SelectTrigger>
                        <SelectValue placeholder='Selecione o tipo' />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value='not_informed'>
                          Não Informado
                        </SelectItem>
                        <SelectItem value='permanent'>Permanente</SelectItem>
                        <SelectItem value='eventual'>Eventual</SelectItem>
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
                <h3 className='font-semibold'>Seção 03: Matriz de Risco 5x5</h3>
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
                      <Label htmlFor='severity'>Classificação de Efeito</Label>
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
                                  riskMatrixConfig.matrix[rowIndex][colIndex]
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
                      {Object.values(riskMatrixConfig.levels).map((level) => (
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
                      ))}
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </ScrollArea>
        </form>
        <DialogFooter>
          <Button variant='outline' type='button' onClick={() => onOpenChange(false)}>
            Cancelar
          </Button>
          <Button type='submit' form='add-risk-form'>
            Adicionar
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  )
}
