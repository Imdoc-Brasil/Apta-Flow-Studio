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
import { MoreHorizontal, PlusCircle, CheckCircle } from 'lucide-react'
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
import { initialHazardData, type Hazard } from '@/app/dashboard/(main)/risks/page'
import { initialUnitsData } from '../units/page'
import { useToast } from '@/hooks/use-toast'
import { Input } from '@/components/ui/input'
import { Checkbox } from '@/components/ui/checkbox'

type RiskLevel =
  | 'Trivial'
  | 'Tolerável'
  | 'Moderado'
  | 'Substancial'
  | 'Intolerável'
type RiskColor =
  | 'bg-green-500'
  | 'bg-blue-500'
  | 'bg-yellow-500'
  | 'bg-orange-500'
  | 'bg-red-500'

interface RiskEvaluation {
  probability: number
  severity: number
  riskLevel: number
  riskLabel: RiskLevel
  riskColor: RiskColor
}

const initialInventory = [
  {
    inventoryId: 'INV-001',
    hazardId: 'RF-001', // Ruído Contínuo ou Intermitente
    unitId: 'UNIT-001', // Matriz São Paulo
    sector: 'Produção',
    source: 'Máquina de corte XYZ',
    evaluation: {
      probability: 3,
      severity: 4,
      riskLevel: 12,
      riskLabel: 'Substancial' as RiskLevel,
      riskColor: 'bg-orange-500' as RiskColor,
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
    { id: "questionnaire", label: "Aplicação questionário de avaliação preliminar de risco" },
    { id: "interview", label: "Entrevista presencial" },
    { id: "info", label: "Informações fornecidas pelo representante da empresa" },
    { id: "measurements", label: "Uso de equipamentos e protocolo de medições" },
    { id: "tool", label: "Aplicação de ferramenta de avaliação preliminar de fatores de rico" },
]

export default function PgrPage() {
  const { toast } = useToast()
  const [inventory, setInventory] = useState(initialInventory)
  const [isAddRiskDialogOpen, setIsAddRiskDialogOpen] = useState(false)
  const [isEvaluateDialogOpen, setIsEvaluateDialogOpen] = useState(false)
  const [isPlanDialogOpen, setIsPlanDialogOpen] = useState(false)
  const [currentItem, setCurrentItem] =
    useState<(typeof initialInventory)[0] | null>(null)
  const [selectedHazard, setSelectedHazard] = useState<Hazard | null>(null)

  const handleAddRisk = (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault()
    const formData = new FormData(event.currentTarget)
    const newRisk = {
      inventoryId: `INV-${Date.now().toString().slice(-4)}`,
      hazardId: formData.get('hazard') as string,
      unitId: formData.get('unit') as string,
      sector: formData.get('sector') as string,
      source: formData.get('source') as string,
      evaluation: null,
    }
    setInventory((prev) => [...prev, newRisk])
    setIsAddRiskDialogOpen(false)
    setSelectedHazard(null)
  }

  const getRiskLevel = (
    probability: number,
    severity: number
  ): RiskEvaluation => {
    const riskLevel = probability * severity
    let riskLabel: RiskLevel = 'Trivial'
    let riskColor: RiskColor = 'bg-green-500'

    if (riskLevel >= 1 && riskLevel <= 4) {
      riskLabel = 'Trivial'
      riskColor = 'bg-green-500'
    } else if (riskLevel >= 5 && riskLevel <= 9) {
      riskLabel = 'Tolerável'
      riskColor = 'bg-blue-500'
    } else if (riskLevel >= 10 && riskLevel <= 14) {
      riskLabel = 'Moderado'
      riskColor = 'bg-yellow-500'
    } else if (riskLevel >= 15 && riskLevel <= 19) {
      riskLabel = 'Substancial'
      riskColor = 'bg-orange-500'
    } else {
      riskLabel = 'Intolerável'
      riskColor = 'bg-red-500'
    }
    return { probability, severity, riskLevel, riskLabel, riskColor }
  }

  const handleEvaluateRisk = (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault()
    if (!currentItem) return

    const formData = new FormData(event.currentTarget)
    const probability = parseInt(formData.get('probability') as string, 10)
    const severity = parseInt(formData.get('severity') as string, 10)

    const evaluation = getRiskLevel(probability, severity)

    setInventory((prev) =>
      prev.map((item) =>
        item.inventoryId === currentItem.inventoryId
          ? { ...item, evaluation }
          : item
      )
    )
    toast({
      title: 'Risco Avaliado!',
      description: `O Nível de Risco foi calculado como ${evaluation.riskLevel} (${evaluation.riskLabel}).`,
    })
    setIsEvaluateDialogOpen(false)
    setCurrentItem(null)
  }

  const openEvaluateDialog = (item: (typeof initialInventory)[0]) => {
    setCurrentItem(item)
    setIsEvaluateDialogOpen(true)
  }

  const getHazardById = (id: string) =>
    initialHazardData.find((h) => h.id === id)
  const getUnitById = (id: string) => initialUnitsData.find((u) => u.id === id)

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
            <TabsTrigger value='matrix' disabled>
              Matriz de Risco
            </TabsTrigger>
          </TabsList>
          <div className='ml-auto flex items-center gap-2'>
            <Dialog
              open={isAddRiskDialogOpen}
              onOpenChange={setIsAddRiskDialogOpen}
            >
              <DialogTrigger asChild>
                <Button>
                  <PlusCircle className='mr-2 h-4 w-4' />
                  Adicionar Risco ao Inventário
                </Button>
              </DialogTrigger>
              <DialogContent className='sm:max-w-3xl'>
                <DialogHeader>
                  <DialogTitle>Adicionar Risco ao Inventário</DialogTitle>
                  <DialogDescription>
                    Associe um perigo a uma unidade, setor e fonte geradora
                    específica.
                  </DialogDescription>
                </DialogHeader>
                <form id='add-risk-form' onSubmit={handleAddRisk}>
                  <div className='space-y-6 py-4'>
                    {/* Section 1 */}
                    <div className='space-y-4 rounded-md border p-4'>
                        <h3 className='font-semibold'>Seção 01: Identificação</h3>
                         <div className='grid md:grid-cols-2 gap-4'>
                           <div className='space-y-2'>
                                <Label htmlFor='exposureGroup'>Grupo de Exposição</Label>
                                <Select name='exposureGroup' required>
                                    <SelectTrigger><SelectValue placeholder='Selecione o grupo' /></SelectTrigger>
                                    <SelectContent>
                                        <SelectItem value='unit'>Unidade</SelectItem>
                                        <SelectItem value='sector'>Setor</SelectItem>
                                        <SelectItem value='role'>Cargo</SelectItem>
                                        <SelectItem value='ghe'>GHE</SelectItem>
                                        <SelectItem value='employee'>Colaborador Específico</SelectItem>
                                    </SelectContent>
                                </Select>
                            </div>
                            <div className='space-y-2'>
                                <Label htmlFor='exposureTarget'>Alvo da Exposição</Label>
                                <Input id='exposureTarget' name='exposureTarget' placeholder='Ex: Unidade X, Setor Y...'/>
                            </div>
                        </div>

                        <div className='space-y-2'>
                            <Label htmlFor='hazard'>Perigo / Agente de Risco</Label>
                            <Select name='hazard' required onValueChange={(value) => setSelectedHazard(getHazardById(value) || null)}>
                                <SelectTrigger><SelectValue placeholder='Selecione o perigo no catálogo' /></SelectTrigger>
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
                                    <p className='font-medium text-muted-foreground'>Grupo de risco</p>
                                    <p className='font-semibold'>{selectedHazard.category}</p>
                                </div>
                                <div className='space-y-1'>
                                    <p className='font-medium text-muted-foreground'>Fundamentação legal</p>
                                    <p className='font-semibold'>{selectedHazard.legalBasis}</p>
                                </div>
                                 <div className='space-y-1 col-span-2'>
                                    <p className='font-medium text-muted-foreground'>Efeitos potenciais / Possíveis lesões ou agravos à saúde</p>
                                    <p className='font-semibold'>{selectedHazard.potentialEffects}</p>
                                </div>
                            </div>
                        )}
                    </div>

                    {/* Section 2 */}
                    <div className='space-y-4 rounded-md border p-4'>
                       <h3 className='font-semibold'>Seção 02: Caracterização da Exposição</h3>
                        <div className='space-y-2'>
                            <Label htmlFor='source'>Fontes ou circunstâncias</Label>
                            <Textarea id='source' name='source' placeholder='Descreva a fonte do risco. Ex: Prensa hidráulica modelo X, atividade de solda...' required />
                        </div>
                        <div className='grid md:grid-cols-2 gap-4'>
                            <div className='space-y-2'>
                                <Label htmlFor='exposureTime'>Tempo de exposição</Label>
                                <Input id='exposureTime' name='exposureTime' placeholder='HH:MM' />
                            </div>
                             <div className='space-y-2'>
                                <Label htmlFor='exposureType'>Tipo de Exposição</Label>
                                <Select name='exposureType'>
                                    <SelectTrigger><SelectValue placeholder='Selecione o tipo' /></SelectTrigger>
                                    <SelectContent>
                                        <SelectItem value='not_informed'>Não Informado</SelectItem>
                                        <SelectItem value='permanent'>Permanente</SelectItem>
                                        <SelectItem value='eventual'>Eventual</SelectItem>
                                        <SelectItem value='intermittent'>Intermitente</SelectItem>
                                    </SelectContent>
                                </Select>
                            </div>
                        </div>
                         <div className='space-y-2'>
                            <Label htmlFor='evaluationCriteria'>Critério de avaliação</Label>
                            <Select name='evaluationCriteria'>
                                <SelectTrigger><SelectValue placeholder='Selecione o critério' /></SelectTrigger>
                                <SelectContent>
                                    <SelectItem value='qualitative'>Qualitativo</SelectItem>
                                    <SelectItem value='quantitative'>Quantitativo</SelectItem>
                                    <SelectItem value='semi_quantitative'>Semi Quantitativo</SelectItem>
                                </SelectContent>
                            </Select>
                        </div>
                        <div className='space-y-3'>
                            <Label>Metodologia da Avaliação</Label>
                            <div className='space-y-2'>
                                {methodologies.map((item) => (
                                    <div key={item.id} className="flex items-center space-x-2">
                                        <Checkbox id={`method-${item.id}`} name="methodology" value={item.id} />
                                        <label htmlFor={`method-${item.id}`} className="text-sm font-normal leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70">
                                            {item.label}
                                        </label>
                                    </div>
                                ))}
                            </div>
                        </div>
                         <div className='space-y-2'>
                            <Label htmlFor='exposureDescription'>Descrição da exposição</Label>
                            <Textarea id='exposureDescription' name='exposureDescription' placeholder='Descreva mais detalhes de como ocorre a exposição...' />
                        </div>
                    </div>
                  </div>
                  <DialogFooter>
                    <Button
                      variant='outline'
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
                                className={`h-3 w-3 rounded-full ${item.evaluation.riskColor}`}
                              />
                              <span>
                                {item.evaluation.riskLevel} -{' '}
                                {item.evaluation.riskLabel}
                              </span>
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
                              <DropdownMenuItem
                                onClick={() => openEvaluateDialog(item)}
                              >
                                Avaliar Risco
                              </DropdownMenuItem>
                              <DropdownMenuSeparator />
                              <DropdownMenuItem disabled={!item.evaluation}>
                                Criar Plano de Ação
                              </DropdownMenuItem>
                              <DropdownMenuItem>Editar</DropdownMenuItem>
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

      {/* Evaluate Risk Dialog */}
      <Dialog
        open={isEvaluateDialogOpen}
        onOpenChange={setIsEvaluateDialogOpen}
      >
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Avaliação de Risco</DialogTitle>
            <DialogDescription>
              Avalie a Probabilidade e a Severidade do risco para calcular o
              Nível de Risco.
            </DialogDescription>
          </DialogHeader>
          <form id='evaluate-risk-form' onSubmit={handleEvaluateRisk}>
            <div className='grid gap-6 py-4'>
              <div className='space-y-2'>
                <Label htmlFor='probability'>Probabilidade</Label>
                <Select
                  name='probability'
                  required
                  defaultValue={currentItem?.evaluation?.probability.toString()}
                >
                  <SelectTrigger>
                    <SelectValue placeholder='Selecione a probabilidade' />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value='1'>1 - Muito Baixa</SelectItem>
                    <SelectItem value='2'>2 - Baixa</SelectItem>
                    <SelectItem value='3'>3 - Média</SelectItem>
                    <SelectItem value='4'>4 - Alta</SelectItem>
                    <SelectItem value='5'>5 - Muito Alta</SelectItem>
                  </SelectContent>
                </Select>
                <p className='text-xs text-muted-foreground'>
                  Qual a chance do evento de risco ocorrer?
                </p>
              </div>
              <div className='space-y-2'>
                <Label htmlFor='severity'>Severidade</Label>
                <Select
                  name='severity'
                  required
                  defaultValue={currentItem?.evaluation?.severity.toString()}
                >
                  <SelectTrigger>
                    <SelectValue placeholder='Selecione a severidade' />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value='1'>1 - Insignificante</SelectItem>
                    <SelectItem value='2'>2 - Menor</SelectItem>
                    <SelectItem value='3'>3 - Moderada</SelectItem>
                    <SelectItem value='4'>4 - Maior</SelectItem>
                    <SelectItem value='5'>5 - Catastrófica</SelectItem>
                  </SelectContent>
                </Select>
                <p className='text-xs text-muted-foreground'>
                  Qual o impacto caso o evento de risco ocorra?
                </p>
              </div>
            </div>
            <DialogFooter>
              <Button
                variant='outline'
                onClick={() => setIsEvaluateDialogOpen(false)}
              >
                Cancelar
              </Button>
              <Button type='submit' form='evaluate-risk-form'>
                Salvar Avaliação
              </Button>
            </DialogFooter>
          </form>
        </DialogContent>
      </Dialog>
    </div>
  )
}
