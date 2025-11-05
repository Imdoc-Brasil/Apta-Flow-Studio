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
import { useState } from 'react'
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

type ExposureType =
  | 'unit'
  | 'sector'
  | 'role'
  | 'ghe'
  | 'employee'
  | ''

type RiskLevel = 'Baixo' | 'Médio' | 'Alto' | 'Crítico' | 'N/A'

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
    level: 'Baixo',
  },
]

const exposureTypeLabels: Record<Exclude<ExposureType, ''>, string> = {
  unit: 'Unidade',
  sector: 'Setor',
  role: 'Cargo',
  ghe: 'GHE',
  employee: 'Colaborador',
}

const getRiskLevel = (prob: number, sev: number): RiskLevel => {
  const product = prob * sev
  if (product >= 9) return 'Crítico'
  if (product >= 5) return 'Alto'
  if (product >= 3) return 'Médio'
  return 'Baixo'
}

export default function PgrInventoryPage() {
  const [inventory, setInventory] = useState(initialInventory)
  const [isDialogOpen, setIsDialogOpen] = useState(false)
  const [exposureType, setExposureType] = useState<ExposureType>('')
  const [selectedRiskCode, setSelectedRiskCode] = useState<string>('')

  const { roles } = useRolesStore()

  const getTargetData = () => {
    switch (exposureType) {
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

  const handleAddRisk = (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault()
    const formData = new FormData(event.currentTarget)
    const prob = parseInt(formData.get('probability') as string, 10)
    const sev = parseInt(formData.get('severity') as string, 10)
    const level = getRiskLevel(prob, sev)

    const selectedRisk = riskCatalog.find(
      (r) => r.esocialCode === (formData.get('risk') as string)
    )

    const newItem: RiskInventoryItem = {
      id: `INV-${Math.random().toString(36).substr(2, 4).toUpperCase()}`,
      exposureType: formData.get('exposureType') as ExposureType,
      exposureTarget: formData.get('exposureTarget') as string,
      risk: selectedRisk?.name || 'N/A',
      riskEsocialCode: selectedRisk?.esocialCode || 'N/A',
      probability: formData.get('probability') as string,
      severity: formData.get('severity') as string,
      level,
    }
    setInventory((prev) => [newItem, ...prev])
    setIsDialogOpen(false)
    setExposureType('')
    setSelectedRiskCode('')
    ;(event.target as HTMLFormElement).reset()
  }

  const getLevelBadgeVariant = (level: RiskLevel) => {
    switch (level) {
      case 'Crítico':
        return 'destructive'
      case 'Alto':
        return 'destructive'
      case 'Médio':
        return 'default'
      case 'Baixo':
        return 'secondary'
      default:
        return 'outline'
    }
  }

  return (
    <Card>
      <CardHeader>
        <CardTitle className='flex items-center justify-between'>
          Inventário de Riscos
          <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
            <DialogTrigger asChild>
              <Button size='sm' className='h-8 gap-1'>
                <PlusCircle className='h-3.5 w-3.5' />
                <span className='sr-only sm:not-sr-only sm:whitespace-nowrap'>
                  Adicionar Risco
                </span>
              </Button>
            </DialogTrigger>
            <DialogContent className='sm:max-w-4xl'>
              <DialogHeader>
                <DialogTitle>Adicionar Risco ao Inventário</DialogTitle>
                <DialogDescription>
                  Identifique um perigo, avalie o risco e adicione-o ao
                  inventário do PGR.
                </DialogDescription>
              </DialogHeader>
              <form id='add-risk-form' onSubmit={handleAddRisk}>
                <ScrollArea className='h-[60vh]'>
                  <div className='space-y-6 px-4 py-6'>
                    {/* Seção 01: Identificação */}
                    <div className='space-y-4 rounded-md border p-4'>
                      <h3 className='font-semibold'>
                        Seção 01: Identificação do Risco
                      </h3>
                      <div className='grid grid-cols-1 md:grid-cols-2 gap-4'>
                        <div className='space-y-2'>
                          <Label htmlFor='exposureType'>Grupo de Exposição</Label>
                          <Select
                            name='exposureType'
                            required
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
                          <Select name='exposureTarget' required disabled={!exposureType}>
                            <SelectTrigger>
                              <SelectValue placeholder='Selecione...' />
                            </SelectTrigger>
                            <SelectContent>
                              {getTargetData().map((item) => (
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
                        <Select name='risk' required onValueChange={setSelectedRiskCode}>
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
                            <p className='font-medium text-muted-foreground'>Grupo de Risco</p>
                            <p>{selectedRiskData.category}</p>
                          </div>
                           <div className='space-y-1'>
                            <p className='font-medium text-muted-foreground'>Fundamentação Legal</p>
                            <p>{selectedRiskData.legalBasis}</p>
                          </div>
                           <div className='space-y-1 md:col-span-2'>
                            <p className='font-medium text-muted-foreground'>Efeitos Potenciais à Saúde</p>
                            <p>{selectedRiskData.potentialEffects}</p>
                          </div>
                        </div>
                      )}
                    </div>

                    {/* Seção 02: Caracterização */}
                     <div className='space-y-4 rounded-md border p-4'>
                        <h3 className='font-semibold'>
                            Seção 02: Caracterização da Exposição
                        </h3>
                         <div className='space-y-2'>
                            <Label htmlFor='sources'>Fontes ou Circunstâncias</Label>
                            <Textarea id='sources' name='sources' placeholder='Ex: Motor da máquina XPTO, compressor...'/>
                        </div>
                        <div className='grid grid-cols-1 md:grid-cols-3 gap-4'>
                            <div className='space-y-2'>
                                <Label htmlFor='exposureTime'>Tempo de Exposição</Label>
                                <Input id='exposureTime' name='exposureTime' placeholder='Ex: 8h/dia'/>
                            </div>
                             <div className='space-y-2'>
                                <Label htmlFor='exposureTypeDetail'>Tipo de Exposição</Label>
                                <Select name='exposureTypeDetail' defaultValue='Não Informado'>
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
                                <Select name='evaluationCriteria' defaultValue='Qualitativo'>
                                    <SelectTrigger>
                                        <SelectValue />
                                    </SelectTrigger>
                                    <SelectContent>
                                        <SelectItem value='Qualitativo'>Qualitativo</SelectItem>
                                        <SelectItem value='Quantitativo'>Quantitativo</SelectItem>
                                        <SelectItem value='Semi-quantitativo'>Semi-quantitativo</SelectItem>
                                    </SelectContent>
                                </Select>
                            </div>
                        </div>
                         <div className='space-y-2'>
                            <Label>Metodologia da Avaliação</Label>
                            <div className='space-y-2 rounded-md bg-muted/50 p-4'>
                                <div className='flex items-center gap-2'>
                                    <Checkbox id='method-1' />
                                    <Label htmlFor='method-1' className='font-normal'>Aplicação questionário de avaliação preliminar de risco</Label>
                                </div>
                                <div className='flex items-center gap-2'>
                                    <Checkbox id='method-2' />
                                    <Label htmlFor='method-2' className='font-normal'>Entrevista presencial</Label>
                                </div>
                                <div className='flex items-center gap-2'>
                                    <Checkbox id='method-3' />
                                    <Label htmlFor='method-3' className='font-normal'>Informações fornecidas pelo representante da empresa</Label>
                                </div>
                                <div className='flex items-center gap-2'>
                                    <Checkbox id='method-4' />
                                    <Label htmlFor='method-4' className='font-normal'>Uso de equipamentos e protocolo de medições</Label>
                                </div>
                                <div className='flex items-center gap-2'>
                                    <Checkbox id='method-5' />
                                    <Label htmlFor='method-5' className='font-normal'>Aplicação de ferramenta de avaliação preliminar de fatores de rico</Label>
                                </div>
                            </div>
                        </div>
                         <div className='space-y-2'>
                            <Label htmlFor='exposureDescription'>Descrição da Exposição</Label>
                            <Textarea id='exposureDescription' name='exposureDescription' placeholder='Detalhe como ocorre a exposição ao risco...'/>
                        </div>
                    </div>
                    
                    <Separator />

                    <div className='grid grid-cols-1 md:grid-cols-2 gap-4'>
                        <div className='space-y-2'>
                        <Label htmlFor='probability'>Probabilidade</Label>
                        <Select name='probability' required defaultValue='1'>
                            <SelectTrigger>
                            <SelectValue placeholder='Selecione...' />
                            </SelectTrigger>
                            <SelectContent>
                            <SelectItem value='1'>1 - Baixa</SelectItem>
                            <SelectItem value='2'>2 - Média</SelectItem>
                            <SelectItem value='3'>3 - Alta</SelectItem>
                            <SelectItem value='4'>4 - Muito Alta</SelectItem>
                            <SelectItem value='5'>5 - Extrema</SelectItem>
                            </SelectContent>
                        </Select>
                        </div>
                        <div className='space-y-2'>
                        <Label htmlFor='severity'>Severidade</Label>
                        <Select name='severity' required defaultValue='1'>
                            <SelectTrigger>
                            <SelectValue placeholder='Selecione...' />
                            </SelectTrigger>
                            <SelectContent>
                            <SelectItem value='1'>1 - Leve</SelectItem>
                            <SelectItem value='2'>2 - Moderada</SelectItem>
                            <SelectItem value='3'>3 - Séria</SelectItem>
                            <SelectItem value='4'>4 - Muito Séria</SelectItem>
                            <SelectItem value='5'>5 - Catastrófica</SelectItem>
                            </SelectContent>
                        </Select>
                        </div>
                    </div>

                  </div>
                </ScrollArea>
                <DialogFooter className='pt-4 border-t'>
                  <Button
                    type='button'
                    variant='outline'
                    onClick={() => {
                      setIsDialogOpen(false)
                      setExposureType('')
                      setSelectedRiskCode('')
                    }}
                  >
                    Cancelar
                  </Button>
                  <Button type='submit'>Salvar</Button>
                </DialogFooter>
              </form>
            </DialogContent>
          </Dialog>
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
                <TableHead>Prob.</TableHead>
                <TableHead>Sev.</TableHead>
                <TableHead>Nível do Risco</TableHead>
                <TableHead>
                  <span className='sr-only'>Ações</span>
                </TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {inventory.map((item) => (
                <TableRow key={item.id}>
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
                        <Button size='icon' variant='ghost'>
                          <MoreHorizontal className='h-4 w-4' />
                        </Button>
                      </DropdownMenuTrigger>
                      <DropdownMenuContent>
                        <DropdownMenuItem>Editar</DropdownMenuItem>
                        <DropdownMenuItem>Criar Ação no Plano</DropdownMenuItem>
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
              <Button className='mt-4' onClick={() => setIsDialogOpen(true)}>
                Adicionar Risco
              </Button>
            </div>
          </div>
        )}
      </CardContent>
    </Card>
  )
}
