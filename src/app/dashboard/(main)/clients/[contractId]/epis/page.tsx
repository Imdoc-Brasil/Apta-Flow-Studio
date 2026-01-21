
'use client'

import { useState, useMemo } from 'react'
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
import { MoreHorizontal, PlusCircle, Loader2 } from 'lucide-react'
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
  type Epi,
  type EpiStock,
  type EpiDelivery,
} from '@/lib/types/risk'
import type { Employee } from '@/lib/types/employee'
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select'
import { useParams } from 'next/navigation'
import {
  useFirestore,
  useCollection,
  useMemoFirebase,
  addDocumentNonBlocking,
  updateDocumentNonBlocking,
} from '@/firebase'
import { collection, doc } from 'firebase/firestore'
import { ClientSideDateFormatter } from '@/components/client-side-date-formatter'

export default function EpisPage() {
  const params = useParams()
  const contractId = params.contractId as string
  const firestore = useFirestore()
  const { toast } = useToast()

  // Firestore Refs
  const episCatalogRef = useMemoFirebase(
    () => (firestore ? collection(firestore, 'epis') : null),
    [firestore]
  )
  const epiStockRef = useMemoFirebase(
    () =>
      firestore
        ? collection(firestore, `clients/${contractId}/epi_stock`)
        : null,
    [firestore, contractId]
  )
  const epiDeliveriesRef = useMemoFirebase(
    () =>
      firestore
        ? collection(firestore, `clients/${contractId}/epi_deliveries`)
        : null,
    [firestore, contractId]
  )
  const employeesRef = useMemoFirebase(
    () =>
      firestore
        ? collection(firestore, `clients/${contractId}/staffs`)
        : null,
    [firestore, contractId]
  )


  // Data from Firestore
  const { data: epiData, isLoading: isLoadingCatalog } =
    useCollection<Epi>(episCatalogRef)
  const { data: epiStock, isLoading: isLoadingStock } =
    useCollection<EpiStock>(epiStockRef)
  const { data: epiDeliveries, isLoading: isLoadingDeliveries } =
    useCollection<EpiDelivery>(epiDeliveriesRef)
   const { data: employees, isLoading: areEmployeesLoading } = useCollection<Employee>(employeesRef);


  // Dialog states
  const [isEpiDialogOpen, setIsEpiDialogOpen] = useState(false)
  const [isDeliveryDialogOpen, setIsDeliveryDialogOpen] = useState(false)
  const [isStockDialogOpen, setIsStockDialogOpen] = useState(false)
  const [editingStockItem, setEditingStockItem] = useState<EpiStock | null>(
    null
  )

  const handleAddEpi = (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault()
    if (!episCatalogRef) return

    const formData = new FormData(event.currentTarget)
    const newEpiData = {
      name: formData.get('name') as string,
      ca: formData.get('ca') as string,
      active: true,
      // The other fields from the old Epi type are now part of the catalog in the risks page.
      // Keeping it simple here.
    }

    addDocumentNonBlocking(episCatalogRef, newEpiData)

    setIsEpiDialogOpen(false)
    toast({
      title: 'EPI Adicionado!',
      description: `O EPI "${newEpiData.name}" foi adicionado ao catálogo.`,
    })
    ;(event.target as HTMLFormElement).reset()
  }

  const handleAddDelivery = (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault()
    if (!epiDeliveriesRef || !epiStock || !firestore || !employees) return

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

    const epiName = epiData?.find((e) => e.id === epiId)?.name || ''
    const employeeName =
      employees.find((e) => e.id === employeeId)?.name || ''

    const newDeliveryData: Omit<EpiDelivery, 'id'> = {
      epiId,
      epiName,
      employeeId,
      employeeName,
      deliveryDate: new Date().toISOString(),
      quantity,
    }
    
    addDocumentNonBlocking(epiDeliveriesRef, newDeliveryData);

    const stockDocRef = doc(firestore, `clients/${contractId}/epi_stock`, stockItem.id as string)
    updateDocumentNonBlocking(stockDocRef, { quantity: stockItem.quantity - quantity })


    setIsDeliveryDialogOpen(false)
    toast({
      title: 'Entrega Registrada!',
      description: `${quantity} unidade(s) de "${epiName}" entregue(s) para ${employeeName}.`,
    })
  }

  const handleStockSubmit = (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault()
    if (!epiStockRef || !firestore) return

    const formData = new FormData(event.currentTarget)
    const quantity = Number(formData.get('quantity'))
    const minStock = Number(formData.get('minStock'))

    if (editingStockItem) {
      const stockDocRef = doc(firestore, `clients/${contractId}/epi_stock`, editingStockItem.id as string);
      updateDocumentNonBlocking(stockDocRef, { quantity, minStock })
      toast({ title: 'Estoque Atualizado!' })
    } else {
      const epiId = formData.get('epiId') as string
      if (epiStock?.some((item) => item.epiId === epiId)) {
        toast({
          variant: 'destructive',
          title: 'Item já existe no estoque',
          description: 'Para atualizar, selecione o item na lista.',
        })
        return
      }
      const newStockItemData = {
        epiId,
        quantity,
        minStock,
      }
      addDocumentNonBlocking(epiStockRef, newStockItemData)
      toast({ title: 'Item adicionado ao estoque!' })
    }
    setIsStockDialogOpen(false)
    setEditingStockItem(null)
  }

  const openStockDialog = (item: EpiStock | null) => {
    setEditingStockItem(item)
    setIsStockDialogOpen(true)
  }

  const getEpiNameById = (epiId: string) =>
    epiData?.find((e) => e.id === epiId)?.name || 'N/A'
  const getEpiCaById = (epiId: string) =>
    epiData?.find((e) => e.id === epiId)?.ca || 'N/A'

  const renderStockForm = (stockItem: EpiStock | null) => {
    return (
      <form id='stock-form' onSubmit={handleStockSubmit}>
        <div className='grid gap-4 py-4'>
          <div className='space-y-2'>
            <Label htmlFor='epiId'>EPI</Label>
            {stockItem ? (
              <Input value={getEpiNameById(stockItem.epiId)} disabled />
            ) : (
              <Select name='epiId' required>
                <SelectTrigger>
                  <SelectValue placeholder='Selecione o EPI do catálogo' />
                </SelectTrigger>
                <SelectContent>
                  {epiData
                    ?.filter((epi) => epi.active)
                    .map((epi) => (
                      <SelectItem key={epi.id} value={epi.id}>
                        {epi.name} (CA: {epi.ca})
                      </SelectItem>
                    ))}
                </SelectContent>
              </Select>
            )}
          </div>
          <div className='space-y-2'>
            <Label htmlFor='quantity'>Quantidade em Estoque</Label>
            <Input
              id='quantity'
              name='quantity'
              type='number'
              defaultValue={stockItem?.quantity}
              required
              min={0}
            />
          </div>
          <div className='space-y-2'>
            <Label htmlFor='minStock'>Estoque Mínimo</Label>
            <Input
              id='minStock'
              name='minStock'
              type='number'
              defaultValue={stockItem?.minStock}
              required
              min={0}
            />
          </div>
        </div>
      </form>
    )
  }

  const renderLoading = () => (
    <div className='flex justify-center items-center h-64'>
      <Loader2 className='h-8 w-8 animate-spin' />
    </div>
  )

  const isLoading = isLoadingCatalog || isLoadingStock || isLoadingDeliveries || areEmployeesLoading;

  return (
    <>
      <Card>
        <CardHeader>
          <CardTitle>Gestão de EPIs</CardTitle>
          <CardDescription>
            Gerencie o catálogo, estoque, entregas e vínculos de Equipamentos de
            Proteção Individual.
          </CardDescription>
        </CardHeader>
        <CardContent>
          <Tabs defaultValue='delivery'>
            <TabsList className='grid w-full grid-cols-3'>
              <TabsTrigger value='delivery'>Gestão de Entrega</TabsTrigger>
              <TabsTrigger value='stock'>Controle de Estoque</TabsTrigger>
              <TabsTrigger value='catalog' disabled>Catálogo (Global)</TabsTrigger>
            </TabsList>

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
                              <Label
                                htmlFor='employeeId'
                                className='text-right'
                              >
                                Colaborador
                              </Label>
                              <Select name='employeeId' required>
                                <SelectTrigger className='col-span-3'>
                                  <SelectValue placeholder='Selecione o colaborador' />
                                </SelectTrigger>
                                <SelectContent>
                                  {employees?.map((emp) => (
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
                                  <SelectValue placeholder='Selecione o EPI do estoque' />
                                </SelectTrigger>
                                <SelectContent>
                                  {epiStock
                                    ?.map((item) => ({...item, epiDetails: epiData?.find(e => e.id === item.epiId)}))
                                    .filter(item => item.epiDetails?.active)
                                    .map((item) => (
                                      <SelectItem key={item.id} value={item.epiId}>
                                        {getEpiNameById(item.epiId)} (Estoque: {item.quantity})
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
                  {isLoading ? (
                    renderLoading()
                  ) : (
                    <Table>
                      <TableHeader>
                        <TableRow>
                          <TableHead>Colaborador</TableHead>
                          <TableHead>EPI</TableHead>
                          <TableHead>Data</TableHead>
                          <TableHead>Quantidade</TableHead>
                        </TableRow>
                      </TableHeader>
                      <TableBody>
                        {epiDeliveries?.map((delivery) => {
                          return (
                            <TableRow key={delivery.id}>
                              <TableCell>{delivery.employeeName}</TableCell>
                              <TableCell>{delivery.epiName}</TableCell>
                              <TableCell>
                                <ClientSideDateFormatter dateString={delivery.deliveryDate} />
                              </TableCell>
                              <TableCell>{delivery.quantity}</TableCell>
                            </TableRow>
                          )
                        })}
                      </TableBody>
                    </Table>
                  )}
                </CardContent>
              </Card>
            </TabsContent>

            {/* Tab: Controle de Estoque */}
            <TabsContent value='stock'>
              <Card>
                <CardHeader>
                  <CardTitle className='flex items-center justify-between'>
                    Estoque
                    <Button
                      size='sm'
                      className='h-8 gap-1'
                      onClick={() => openStockDialog(null)}
                    >
                      <PlusCircle className='h-3.5 w-3.5' />
                      <span className='sr-only sm:not-sr-only sm:whitespace-nowrap'>
                        Adicionar ao Estoque
                      </span>
                    </Button>
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  {isLoading ? (
                    renderLoading()
                  ) : (
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
                        {epiStock?.map((item) => (
                          <TableRow
                            key={item.id}
                            className='cursor-pointer'
                            onClick={() => openStockDialog(item)}
                          >
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
                  )}
                </CardContent>
              </Card>
            </TabsContent>
            
            <TabsContent value='catalog'>
             {/* This tab is now just a placeholder as the catalog is global */}
            </TabsContent>
          </Tabs>
        </CardContent>
      </Card>

      {/* Stock Dialog */}
      <Dialog open={isStockDialogOpen} onOpenChange={setIsStockDialogOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>
              {editingStockItem ? 'Atualizar' : 'Adicionar'} Item no Estoque
            </DialogTitle>
            <DialogDescription>
              {editingStockItem
                ? 'Atualize a quantidade e o estoque mínimo.'
                : 'Adicione um novo EPI ao controle de estoque.'}
            </DialogDescription>
          </DialogHeader>
          {renderStockForm(editingStockItem)}
          <DialogFooter>
            <Button
              variant='outline'
              onClick={() => {
                setIsStockDialogOpen(false)
                setEditingStockItem(null)
              }}
            >
              Cancelar
            </Button>
            <Button type='submit' form='stock-form'>
              Salvar
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </>
  )
}
