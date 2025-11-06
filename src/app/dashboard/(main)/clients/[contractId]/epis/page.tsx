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
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs'
import { Button } from '@/components/ui/button'
import { MoreHorizontal, PlusCircle } from 'lucide-react'
import { Badge } from '@/components/ui/badge'
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
import { useToast } from '@/hooks/use-toast'
import {
  initialEpiData,
  initialEpiStock,
  initialEpiDeliveries,
  initialCaRiskMapping,
  type Epi,
  type EpiStock,
  type EpiDelivery,
  type CaRiskMapping,
} from './data'
import { initialEmployeesData } from '../employees/data'
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select'
import { Switch } from '@/components/ui/switch'

export default function EpisPage() {
  const [epiData, setEpiData] = useState(initialEpiData)
  const [epiStock, setEpiStock] = useState(initialEpiStock)
  const [epiDeliveries, setEpiDeliveries] = useState(initialEpiDeliveries)
  const [caRiskMapping, setCaRiskMapping] = useState(initialCaRiskMapping)

  const [isEpiDialogOpen, setIsEpiDialogOpen] = useState(false)
  const [isDeliveryDialogOpen, setIsDeliveryDialogOpen] = useState(false)
  const { toast } = useToast()

  const handleAddEpi = (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault()
    const formData = new FormData(event.currentTarget)
    const newEpi: Epi = {
      id: `EPI-${(Math.random() * 100).toFixed(0).padStart(2, '0')}`,
      name: formData.get('name') as string,
      ca: formData.get('ca') as string,
      shelfLife: Number(formData.get('shelfLife')),
      active: formData.get('active') === 'on',
      fabricante: formData.get('fabricante') as string,
      vencimentoCA: formData.get('vencimentoCA') as string,
    }
    setEpiData((prev) => [newEpi, ...prev])
    setIsEpiDialogOpen(false)
    toast({
      title: 'EPI Adicionado!',
      description: `O EPI "${newEpi.name}" foi adicionado ao catálogo.`,
    })
    ;(event.target as HTMLFormElement).reset()
  }

  const handleAddDelivery = (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault()
    const formData = new FormData(event.currentTarget)
    const epiId = formData.get('epiId') as string
    const employeeId = formData.get('employeeId') as string
    const quantity = Number(formData.get('quantity'))

    const stockItem = epiStock.find((item) => item.epiId === epiId)
    if (!stockItem || stockItem.quantity < quantity) {
      toast({
        variant: 'destructive',
        title: 'Estoque Insuficiente',
        description: 'Não há quantidade suficiente em estoque para esta entrega.',
      })
      return
    }

    const epiName = epiData.find((e) => e.id === epiId)?.name || ''
    const employeeName =
      initialEmployeesData.find((e) => e.id === employeeId)?.name || ''

    const newDelivery: EpiDelivery = {
      id: `DEL-${Date.now()}`,
      epiId,
      epiName,
      employeeId,
      employeeName,
      deliveryDate: new Date().toISOString(),
      quantity,
    }

    setEpiDeliveries((prev) => [newDelivery, ...prev])
    setEpiStock((prev) =>
      prev.map((item) =>
        item.epiId === epiId
          ? { ...item, quantity: item.quantity - quantity }
          : item
      )
    )

    setIsDeliveryDialogOpen(false)
    toast({
      title: 'Entrega Registrada!',
      description: `${quantity} unidade(s) de "${epiName}" entregue(s) para ${employeeName}.`,
    })
  }

  const getEpiNameById = (epiId: string) =>
    epiData.find((e) => e.id === epiId)?.name || 'N/A'
  const getEpiCaById = (epiId: string) =>
    epiData.find((e) => e.id === epiId)?.ca || 'N/A'

  return (
    <Card>
      <CardHeader>
        <CardTitle>Gestão de EPIs</CardTitle>
        <CardDescription>
          Gerencie o catálogo, estoque, entregas e vínculos de Equipamentos de
          Proteção Individual.
        </CardDescription>
      </CardHeader>
      <CardContent>
        <Tabs defaultValue='catalog'>
          <TabsList className='grid w-full grid-cols-4'>
            <TabsTrigger value='catalog'>Catálogo de EPIs</TabsTrigger>
            <TabsTrigger value='delivery'>Gestão de Entrega</TabsTrigger>
            <TabsTrigger value='stock'>Controle de Estoque</TabsTrigger>
            <TabsTrigger value='mapping'>C.A x Riscos</TabsTrigger>
          </TabsList>

          {/* Tab: Catálogo de EPIs */}
          <TabsContent value='catalog'>
            <Card>
              <CardHeader>
                <CardTitle className='flex items-center justify-between'>
                  Catálogo
                  <Dialog
                    open={isEpiDialogOpen}
                    onOpenChange={setIsEpiDialogOpen}
                  >
                    <DialogTrigger asChild>
                      <Button size='sm' className='h-8 gap-1'>
                        <PlusCircle className='h-3.5 w-3.5' />
                        <span className='sr-only sm:not-sr-only sm:whitespace-nowrap'>
                          Adicionar EPI
                        </span>
                      </Button>
                    </DialogTrigger>
                    <DialogContent className='sm:max-w-lg'>
                      <DialogHeader>
                        <DialogTitle>Adicionar Novo EPI</DialogTitle>
                      </DialogHeader>
                      <form id='add-epi-form' onSubmit={handleAddEpi}>
                        <div className='grid gap-4 py-4'>
                          <div className='grid grid-cols-4 items-center gap-4'>
                            <Label htmlFor='name' className='text-right'>
                              Nome
                            </Label>
                            <Input
                              id='name'
                              name='name'
                              className='col-span-3'
                              required
                            />
                          </div>
                          <div className='grid grid-cols-4 items-center gap-4'>
                            <Label htmlFor='ca' className='text-right'>
                              Nº do CA
                            </Label>
                            <Input
                              id='ca'
                              name='ca'
                              className='col-span-3'
                              required
                            />
                          </div>
                          <div className='grid grid-cols-4 items-center gap-4'>
                            <Label
                              htmlFor='fabricante'
                              className='text-right'
                            >
                              Fabricante
                            </Label>
                            <Input
                              id='fabricante'
                              name='fabricante'
                              className='col-span-3'
                            />
                          </div>
                          <div className='grid grid-cols-4 items-center gap-4'>
                            <Label
                              htmlFor='vencimentoCA'
                              className='text-right'
                            >
                              Venc. do CA
                            </Label>
                            <Input
                              id='vencimentoCA'
                              name='vencimentoCA'
                              type='date'
                              className='col-span-3'
                            />
                          </div>
                          <div className='grid grid-cols-4 items-center gap-4'>
                            <Label htmlFor='shelfLife' className='text-right'>
                              Vida Útil (dias)
                            </Label>
                            <Input
                              id='shelfLife'
                              name='shelfLife'
                              type='number'
                              className='col-span-3'
                              required
                            />
                          </div>
                          <div className='grid grid-cols-4 items-center gap-4'>
                            <Label htmlFor='active' className='text-right'>
                              Status
                            </Label>
                            <div className='col-span-3 flex items-center gap-2'>
                              <Switch
                                id='active'
                                name='active'
                                defaultChecked={true}
                              />
                              <Label htmlFor='active'>Ativo</Label>
                            </div>
                          </div>
                        </div>
                      </form>
                      <DialogFooter>
                        <Button
                          variant='outline'
                          onClick={() => setIsEpiDialogOpen(false)}
                        >
                          Cancelar
                        </Button>
                        <Button type='submit' form='add-epi-form'>
                          Salvar
                        </Button>
                      </DialogFooter>
                    </DialogContent>
                  </Dialog>
                </CardTitle>
              </CardHeader>
              <CardContent>
                <Table>
                  <TableHeader>
                    <TableRow>
                      <TableHead>Nome</TableHead>
                      <TableHead>CA</TableHead>
                      <TableHead>Venc. CA</TableHead>
                      <TableHead>Vida Útil</TableHead>
                      <TableHead>Status</TableHead>
                      <TableHead>
                        <span className='sr-only'>Ações</span>
                      </TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {epiData.map((epi) => (
                      <TableRow key={epi.id}>
                        <TableCell className='font-medium'>{epi.name}</TableCell>
                        <TableCell>{epi.ca}</TableCell>
                        <TableCell>
                          {new Date(epi.vencimentoCA).toLocaleDateString(
                            'pt-BR',
                            { timeZone: 'UTC' }
                          )}
                        </TableCell>
                        <TableCell>{epi.shelfLife} dias</TableCell>
                        <TableCell>
                          <Badge variant={epi.active ? 'secondary' : 'outline'}>
                            {epi.active ? 'Ativo' : 'Inativo'}
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
                              <DropdownMenuItem>Editar</DropdownMenuItem>
                              <DropdownMenuItem>Desativar</DropdownMenuItem>
                            </DropdownMenuContent>
                          </DropdownMenu>
                        </TableCell>
                      </TableRow>
                    ))}
                  </TableBody>
                </Table>
              </CardContent>
            </Card>
          </TabsContent>

          {/* Tab: Gestão de Entrega */}
          <TabsContent value='delivery'>
            <Card>
              <CardHeader>
                <CardTitle className='flex items-center justify-between'>
                  Registro de Entregas
                  <Dialog
                    open={isDeliveryDialogOpen}
                    onOpenChange={setIsDeliveryDialogOpen}
                  >
                    <DialogTrigger asChild>
                      <Button size='sm' className='h-8 gap-1'>
                        <PlusCircle className='h-3.5 w-3.5' />
                        <span className='sr-only sm:not-sr-only sm:whitespace-nowrap'>
                          Registrar Entrega
                        </span>
                      </Button>
                    </DialogTrigger>
                    <DialogContent>
                      <DialogHeader>
                        <DialogTitle>Registrar Nova Entrega</DialogTitle>
                      </DialogHeader>
                      <form
                        id='add-delivery-form'
                        onSubmit={handleAddDelivery}
                      >
                        <div className='grid gap-4 py-4'>
                          <div className='grid grid-cols-4 items-center gap-4'>
                            <Label htmlFor='employeeId' className='text-right'>
                              Colaborador
                            </Label>
                            <Select name='employeeId' required>
                              <SelectTrigger className='col-span-3'>
                                <SelectValue placeholder='Selecione o colaborador' />
                              </SelectTrigger>
                              <SelectContent>
                                {initialEmployeesData.map((emp) => (
                                  <SelectItem key={emp.id} value={emp.id}>
                                    {emp.name}
                                  </SelectItem>
                                ))}
                              </SelectContent>
                            </Select>
                          </div>
                          <div className='grid grid-cols-4 items-center gap-4'>
                            <Label htmlFor='epiId' className='text-right'>
                              EPI
                            </Label>
                            <Select name='epiId' required>
                              <SelectTrigger className='col-span-3'>
                                <SelectValue placeholder='Selecione o EPI' />
                              </SelectTrigger>
                              <SelectContent>
                                {epiData
                                  .filter((epi) => epi.active)
                                  .map((epi) => (
                                    <SelectItem key={epi.id} value={epi.id}>
                                      {epi.name} (CA: {epi.ca})
                                    </SelectItem>
                                  ))}
                              </SelectContent>
                            </Select>
                          </div>
                          <div className='grid grid-cols-4 items-center gap-4'>
                            <Label htmlFor='quantity' className='text-right'>
                              Quantidade
                            </Label>
                            <Input
                              id='quantity'
                              name='quantity'
                              type='number'
                              className='col-span-3'
                              required
                              defaultValue={1}
                              min={1}
                            />
                          </div>
                        </div>
                      </form>
                      <DialogFooter>
                        <Button
                          variant='outline'
                          onClick={() => setIsDeliveryDialogOpen(false)}
                        >
                          Cancelar
                        </Button>
                        <Button type='submit' form='add-delivery-form'>
                          Registrar
                        </Button>
                      </DialogFooter>
                    </DialogContent>
                  </Dialog>
                </CardTitle>
              </CardHeader>
              <CardContent>
                <Table>
                  <TableHeader>
                    <TableRow>
                      <TableHead>Colaborador</TableHead>
                      <TableHead>EPI</TableHead>
                      <TableHead>Data</TableHead>
                      <TableHead>Quantidade</TableHead>
                      <TableHead>Próx. Troca</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {epiDeliveries.map((delivery) => {
                      const epi = epiData.find((e) => e.id === delivery.epiId)
                      const nextChangeDate = epi
                        ? new Date(delivery.deliveryDate)
                        : null
                      if (nextChangeDate && epi?.shelfLife) {
                        nextChangeDate.setDate(
                          nextChangeDate.getDate() + epi.shelfLife
                        )
                      }
                      return (
                        <TableRow key={delivery.id}>
                          <TableCell>{delivery.employeeName}</TableCell>
                          <TableCell>{delivery.epiName}</TableCell>
                          <TableCell>
                            {new Date(
                              delivery.deliveryDate
                            ).toLocaleDateString()}
                          </TableCell>
                          <TableCell>{delivery.quantity}</TableCell>
                          <TableCell>
                            {nextChangeDate
                              ? nextChangeDate.toLocaleDateString()
                              : 'N/A'}
                          </TableCell>
                        </TableRow>
                      )
                    })}
                  </TableBody>
                </Table>
              </CardContent>
            </Card>
          </TabsContent>

          {/* Tab: Controle de Estoque */}
          <TabsContent value='stock'>
            <Card>
              <CardHeader>
                <CardTitle>Estoque</CardTitle>
              </CardHeader>
              <CardContent>
                <Table>
                  <TableHeader>
                    <TableRow>
                      <TableHead>EPI</TableHead>
                      <TableHead>CA</TableHead>
                      <TableHead>Quantidade em Estoque</TableHead>
                      <TableHead>Estoque Mínimo</TableHead>
                      <TableHead>Status</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {epiStock.map((item) => (
                      <TableRow key={item.epiId}>
                        <TableCell>{getEpiNameById(item.epiId)}</TableCell>
                        <TableCell>{getEpiCaById(item.epiId)}</TableCell>
                        <TableCell>{item.quantity}</TableCell>
                        <TableCell>{item.minStock}</TableCell>
                        <TableCell>
                          <Badge
                            variant={
                              item.quantity > item.minStock
                                ? 'secondary'
                                : 'destructive'
                            }
                          >
                            {item.quantity > item.minStock
                              ? 'Em estoque'
                              : 'Estoque baixo'}
                          </Badge>
                        </TableCell>
                      </TableRow>
                    ))}
                  </TableBody>
                </Table>
              </CardContent>
            </Card>
          </TabsContent>

          {/* Tab: C.A x Riscos */}
          <TabsContent value='mapping'>
            <Card>
              <CardHeader>
                <CardTitle>Tabela de C.A x Riscos</CardTitle>
              </CardHeader>
              <CardContent>
                <Table>
                  <TableHeader>
                    <TableRow>
                      <TableHead>CA</TableHead>
                      <TableHead>EPI</TableHead>
                      <TableHead>Risco Associado</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {caRiskMapping.map((mapping) => (
                      <TableRow key={mapping.ca}>
                        <TableCell>{mapping.ca}</TableCell>
                        <TableCell>{mapping.epiName}</TableCell>
                        <TableCell>{mapping.risk}</TableCell>
                      </TableRow>
                    ))}
                  </TableBody>
                </Table>
              </CardContent>
            </Card>
          </TabsContent>
        </Tabs>
      </CardContent>
    </Card>
  )
}
