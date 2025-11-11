'use client'

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
import { Button } from '@/components/ui/button'
import { MoreHorizontal, FileDown, PlusCircle, History } from 'lucide-react'
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu'
import { Badge } from '@/components/ui/badge'
import React, { useState, useEffect } from 'react'
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
  DialogFooter,
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
import { useToast } from '@/hooks/use-toast'
import { initialUnitsData, Unit } from '../../units/data'
import { initialSectorsData, Sector } from '../../sectors/data'
import { Textarea } from '@/components/ui/textarea'
import { Separator } from '@/components/ui/separator'
import { ScrollArea } from '@/components/ui/scroll-area'
import {
  initialInventory,
  getHazardById,
} from '@/app/dashboard/(main)/clients/[contractId]/pgr/page'
import type { RiskEvaluation } from '@/app/dashboard/(main)/clients/[contractId]/pgr/page'
import { cn } from '@/lib/utils'

const initialPgrHistoryData = [
  {
    version: '2.0',
    issueDate: '2024-01-15',
    validity: '24 meses',
    responsible: 'Eng. Ana Beatriz',
    status: 'Vigente',
    unit: 'Matriz São Paulo',
  },
  {
    version: '1.0',
    issueDate: '2022-01-15',
    validity: '24 meses',
    responsible: 'Eng. Carlos Silva',
    status: 'Expirado',
    unit: 'Filial Rio de Janeiro',
  },
]

type PgrEntry = (typeof initialPgrHistoryData)[0]
interface PgrUpdate {
  date: string
  description: string
}

function ClientSideDateFormatter({ dateString }: { dateString: string }) {
  const [formattedDate, setFormattedDate] = useState('')

  useEffect(() => {
    if (dateString) {
      const date = new Date(dateString)
      // Ajuste para garantir que a data seja interpretada em UTC e não mude de dia
      const timezoneOffset = date.getTimezoneOffset() * 60000
      const adjustedDate = new Date(date.getTime() + timezoneOffset)
      setFormattedDate(adjustedDate.toLocaleDateString('pt-BR'))
    }
  }, [dateString])

  if (!formattedDate) {
    return null // Retorna nulo durante a renderização do servidor e a primeira renderização do cliente
  }

  return <>{formattedDate}</>
}

export default function PgrHistoryPage() {
  const [pgrHistory, setPgrHistory] = useState(initialPgrHistoryData)
  const [isDialogOpen, setIsDialogOpen] = useState(false)
  const { toast } = useToast()
  const [selectedUnitId, setSelectedUnitId] = useState<string | null>(null)
  const [selectedUnit, setSelectedUnit] = useState<Unit | null>(null)
  const [unitSectors, setUnitSectors] = useState<Sector[]>([])
  const [unitInventory, setUnitInventory] = useState<typeof initialInventory>(
    []
  )

  const [updates, setUpdates] = useState<PgrUpdate[]>([])
  const [newUpdate, setNewUpdate] = useState('')
  const [newUpdateDate, setNewUpdateDate] = useState(
    new Date().toISOString().split('T')[0]
  )

  useEffect(() => {
    if (selectedUnitId) {
      const unit = initialUnitsData.find((u) => u.id === selectedUnitId)
      setSelectedUnit(unit || null)
      const sectors = initialSectorsData.filter(
        (s) => s.unitId === selectedUnitId
      )
      setUnitSectors(sectors)
      const inventory = initialInventory.filter(
        (i) => i.unitId === selectedUnitId
      )
      setUnitInventory(inventory)
    } else {
      setSelectedUnit(null)
      setUnitSectors([])
      setUnitInventory([])
    }
  }, [selectedUnitId])

  const getNextVersion = () => {
    if (pgrHistory.length === 0) return '1.0'
    const latestVersion = Math.max(
      ...pgrHistory.map((p) => parseFloat(p.version))
    )
    return (latestVersion + 1).toFixed(1)
  }

  const handleEmitPgr = (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault()
    if (!selectedUnit) {
      toast({
        variant: 'destructive',
        title: 'Unidade não selecionada',
        description: 'Por favor, selecione uma unidade para emitir o PGR.',
      })
      return
    }

    const formData = new FormData(event.currentTarget)
    const newPgr: PgrEntry = {
      version: getNextVersion(),
      issueDate: formData.get('issueDate') as string,
      validity: '24 meses',
      responsible: selectedUnit.pgrResponsible || 'Não definido',
      status: 'Vigente',
      unit: selectedUnit.name,
    }
    setPgrHistory((prev) => [newPgr, ...prev])
    setIsDialogOpen(false)
    setSelectedUnitId(null)
    setUpdates([])
    toast({
      title: 'PGR Emitido com Sucesso!',
      description: `A versão ${newPgr.version} do PGR para a unidade ${newPgr.unit} foi adicionada.`,
    })
  }

  const handleAddUpdate = () => {
    if (!newUpdate.trim()) {
      toast({
        variant: 'destructive',
        title: 'Erro',
        description: 'A descrição da atualização não pode estar vazia.',
      })
      return
    }
    setUpdates([{ date: newUpdateDate, description: newUpdate }, ...updates])
    setNewUpdate('')
    toast({
      title: 'Atualização Adicionada!',
      description: 'O log de atualizações do PGR foi atualizado.',
    })
  }

  return (
    <div className='grid flex-1 auto-rows-max gap-4'>
      <div className='flex items-center gap-4'>
        <h1 className='flex-1 shrink-0 whitespace-nowrap text-xl font-semibold tracking-tight sm:grow-0'>
          Gestão de Documentos PGR
        </h1>
        <div className='ml-auto flex items-center gap-2'>
          <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
            <DialogTrigger asChild>
              <Button>
                <PlusCircle className='mr-2 h-4 w-4' />
                Emitir Novo PGR
              </Button>
            </DialogTrigger>
            <DialogContent className='sm:max-w-3xl'>
              <DialogHeader>
                <DialogTitle>Emitir Novo PGR</DialogTitle>
                <DialogDescription>
                  Preencha as informações para gerar uma nova versão do
                  documento PGR.
                </DialogDescription>
              </DialogHeader>
              <form id='emit-pgr-form' onSubmit={handleEmitPgr}>
                <ScrollArea className='h-[70vh]'>
                  <div className='space-y-6 p-1 pr-6'>
                    {/* Seção 1: Identificação */}
                    <fieldset className='space-y-4 rounded-lg border p-4'>
                      <legend className='-ml-1 px-1 text-sm font-medium'>
                        Seção: Identificação da Empresa
                      </legend>
                      <div className='grid grid-cols-4 items-center gap-4'>
                        <Label htmlFor='unit' className='text-right'>
                          Unidade
                        </Label>
                        <Select
                          name='unit'
                          onValueChange={setSelectedUnitId}
                          required
                        >
                          <SelectTrigger className='col-span-3'>
                            <SelectValue placeholder='Selecione uma unidade' />
                          </SelectTrigger>
                          <SelectContent>
                            {initialUnitsData.map((unit) => (
                              <SelectItem key={unit.id} value={unit.id}>
                                {unit.name}
                              </SelectItem>
                            ))}
                          </SelectContent>
                        </Select>
                      </div>
                      {selectedUnit && (
                        <div className='space-y-2 text-sm text-muted-foreground border-t pt-4 mt-4'>
                          <p>
                            <span className='font-semibold text-foreground'>
                              CNPJ:
                            </span>{' '}
                            {selectedUnit.cnpj}
                          </p>
                          <p>
                            <span className='font-semibold text-foreground'>
                              Endereço:
                            </span>{' '}
                            {selectedUnit.address}
                          </p>
                          <p>
                            <span className='font-semibold text-foreground'>
                              CNAE:
                            </span>{' '}
                            {selectedUnit.cnae}
                          </p>
                          <p>
                            <span className='font-semibold text-foreground'>
                              Grau de Risco:
                            </span>{' '}
                            {selectedUnit.riskLevel}
                          </p>
                        </div>
                      )}
                      <div className='grid grid-cols-4 items-center gap-4'>
                        <Label htmlFor='issueDate' className='text-right'>
                          Data de Emissão
                        </Label>
                        <Input
                          id='issueDate'
                          name='issueDate'
                          type='date'
                          className='col-span-3'
                          defaultValue={new Date().toISOString().split('T')[0]}
                          required
                        />
                      </div>
                      <div className='grid grid-cols-4 items-center gap-4'>
                        <Label className='text-right'>Vigência</Label>
                        <Input
                          className='col-span-3'
                          value='24 meses'
                          disabled
                        />
                      </div>
                      <div className='grid grid-cols-4 items-center gap-4'>
                        <Label className='text-right'>Responsável PGR</Label>
                        <Input
                          className='col-span-3'
                          value={
                            selectedUnit?.pgrResponsible ||
                            'Selecione uma unidade'
                          }
                          disabled
                        />
                      </div>
                    </fieldset>

                    {/* Seção Base Legal */}
                    <fieldset className='space-y-4 rounded-lg border p-4'>
                      <legend className='-ml-1 px-1 text-sm font-medium'>
                        Seção: Base Legal e o que diz a NR01
                      </legend>
                      <div className='space-y-2'>
                        <Label>
                          Objetivo do Programa de Gerenciamento de Risco
                        </Label>
                        <Textarea
                          placeholder='[Será preenchido automaticamente pela IA]'
                          disabled
                        />
                      </div>
                      <div className='space-y-2'>
                        <Label>Introdução</Label>
                        <Textarea
                          placeholder='[Será preenchido automaticamente pela IA]'
                          disabled
                        />
                      </div>
                      <div className='space-y-2'>
                        <Label>Resumo dos ítens da NR01</Label>
                        <Textarea
                          placeholder='[Será preenchido automaticamente pela IA]'
                          disabled
                        />
                      </div>
                    </fieldset>

                    {/* Seção Mapa Organizacional */}
                    {selectedUnit && (
                      <fieldset className='space-y-4 rounded-lg border p-4'>
                        <legend className='-ml-1 px-1 text-sm font-medium'>
                          Seção: Do Mapa Organizacional da Unidade
                        </legend>
                        <p className='text-sm text-muted-foreground'>
                          Abaixo estão listados os setores e cargos da unidade{' '}
                          <span className='font-semibold text-foreground'>
                            {selectedUnit.name}
                          </span>
                          .
                        </p>
                        {unitSectors.length > 0 ? (
                          <div className='space-y-4'>
                            {unitSectors.map((sector) => (
                              <div
                                key={sector.id}
                                className='rounded-md border p-3'
                              >
                                <h4 className='font-semibold'>
                                  {sector.name}
                                </h4>
                                <p className='text-sm text-muted-foreground'>
                                  {sector.description}
                                </p>
                                <div className='mt-2 pl-4'>
                                  <h5 className='text-xs font-semibold text-muted-foreground'>
                                    CARGOS:
                                  </h5>
                                  <p className='text-xs text-muted-foreground italic'>
                                    (A lista de cargos para este setor
                                    aparecerá aqui)
                                  </p>
                                </div>
                              </div>
                            ))}
                          </div>
                        ) : (
                          <div className='text-center text-sm text-muted-foreground py-4'>
                            Nenhum setor cadastrado para esta unidade.
                          </div>
                        )}
                      </fieldset>
                    )}

                    {/* Seção Inventário de Riscos */}
                    {selectedUnit && (
                      <fieldset className='space-y-4 rounded-lg border p-4'>
                        <legend className='-ml-1 px-1 text-sm font-medium'>
                          Seção: Inventário de Riscos da Unidade
                        </legend>
                        {unitInventory.length > 0 ? (
                          <Table>
                            <TableHeader>
                              <TableRow>
                                <TableHead>Perigo/Risco</TableHead>
                                <TableHead>Setor</TableHead>
                                <TableHead>Fonte</TableHead>
                                <TableHead>Nível de Risco</TableHead>
                              </TableRow>
                            </TableHeader>
                            <TableBody>
                              {unitInventory.map((item) => {
                                const hazard = getHazardById(item.hazardId)
                                return (
                                  <TableRow key={item.inventoryId}>
                                    <TableCell>
                                      {hazard?.name || 'Desconhecido'}
                                    </TableCell>
                                    <TableCell>{item.sector}</TableCell>
                                    <TableCell>{item.source}</TableCell>
                                    <TableCell>
                                      {item.evaluation ? (
                                        <div className='flex items-center gap-2'>
                                          <span
                                            className={cn(
                                              'h-3 w-3 rounded-full',
                                              item.evaluation.riskColor
                                            )}
                                          />
                                          <span>
                                            {item.evaluation.riskLabel}
                                          </span>
                                        </div>
                                      ) : (
                                        <span className='text-muted-foreground'>
                                          Não avaliado
                                        </span>
                                      )}
                                    </TableCell>
                                  </TableRow>
                                )
                              })}
                            </TableBody>
                          </Table>
                        ) : (
                          <div className='text-center text-sm text-muted-foreground py-4'>
                            Nenhum risco inventariado para esta unidade.
                          </div>
                        )}
                      </fieldset>
                    )}

                    {/* Seção 2: Atualizações */}
                    <fieldset className='space-y-4 rounded-lg border p-4'>
                      <legend className='-ml-1 px-1 text-sm font-medium'>
                        Seção: Atualizações
                      </legend>
                      <div className='flex items-end gap-2'>
                        <div className='grid w-full items-center gap-1.5'>
                          <Label htmlFor='update-description'>
                            Descrição da Atualização
                          </Label>
                          <Textarea
                            id='update-description'
                            placeholder='Ex: Inclusão da função de Almoxarife'
                            value={newUpdate}
                            onChange={(e) => setNewUpdate(e.target.value)}
                          />
                        </div>
                        <div className='grid max-w-[180px] w-full items-center gap-1.5'>
                          <Label htmlFor='update-date'>Data</Label>
                          <Input
                            type='date'
                            id='update-date'
                            value={newUpdateDate}
                            onChange={(e) => setNewUpdateDate(e.target.value)}
                          />
                        </div>
                        <Button type='button' onClick={handleAddUpdate}>
                          Adicionar
                        </Button>
                      </div>
                      {updates.length > 0 && <Separator />}
                      <div className='space-y-2'>
                        {updates.map((update, index) => (
                          <div key={index} className='flex gap-4 text-sm'>
                            <div className='text-muted-foreground whitespace-nowrap'>
                              {new Date(update.date).toLocaleDateString(
                                'pt-BR',
                                {
                                  timeZone: 'UTC',
                                }
                              )}
                            </div>
                            <div className='font-medium'>
                              {update.description}
                            </div>
                          </div>
                        ))}
                      </div>
                    </fieldset>

                    {/* Seção 3: Sumário */}
                    <fieldset className='space-y-4 rounded-lg border p-4 min-h-[10rem]'>
                      <legend className='-ml-1 px-1 text-sm font-medium'>
                        Seção: Sumário
                      </legend>
                      <div className='flex items-center justify-center h-full text-sm text-muted-foreground'>
                        O sumário do documento será gerado aqui.
                      </div>
                    </fieldset>
                  </div>
                </ScrollArea>
              </form>
              <DialogFooter className='pt-4 border-t'>
                <Button variant='outline' onClick={() => setIsDialogOpen(false)}>
                  Cancelar
                </Button>
                <Button type='submit' form='emit-pgr-form'>
                  Emitir
                </Button>
              </DialogFooter>
            </DialogContent>
          </Dialog>
        </div>
      </div>
      <Card>
        <CardHeader>
          <CardTitle>Histórico de Emissões</CardTitle>
          <CardDescription>
            Visualize e gerencie todas as versões do Programa de Gerenciamento
            de Riscos emitidas for para este cliente.
          </CardDescription>
        </CardHeader>
        <CardContent>
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Versão</TableHead>
                <TableHead>Unidade</TableHead>
                <TableHead>Data de Emissão</TableHead>
                <TableHead>Vigência</TableHead>
                <TableHead>Responsável Técnico</TableHead>
                <TableHead>Status</TableHead>
                <TableHead>
                  <span className='sr-only'>Ações</span>
                </TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {pgrHistory.map((item) => (
                <TableRow key={item.version}>
                  <TableCell className='font-medium'>{item.version}</TableCell>
                  <TableCell>{item.unit}</TableCell>
                  <TableCell>
                    <ClientSideDateFormatter dateString={item.issueDate} />
                  </TableCell>
                  <TableCell>{item.validity}</TableCell>
                  <TableCell>{item.responsible}</TableCell>
                  <TableCell>
                    <Badge
                      variant={
                        item.status === 'Vigente' ? 'secondary' : 'outline'
                      }
                    >
                      {item.status}
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
                        <DropdownMenuItem>
                          <FileDown className='mr-2 h-4 w-4' />
                          Baixar Documento
                        </DropdownMenuItem>
                      </DropdownMenuContent>
                    </DropdownMenu>
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </CardContent>
      </Card>
    </div>
  )
}

    