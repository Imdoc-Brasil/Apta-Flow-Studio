
'use client'

import { useState, useEffect, useMemo } from 'react'
import { useParams, useRouter } from 'next/navigation'
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
  MoreHorizontal,
  PlusCircle,
  Search,
  Filter,
  ArrowRight,
  Pencil,
} from 'lucide-react'
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
import { Badge } from '@/components/ui/badge'
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuTrigger,
  DropdownMenuCheckboxItem,
  DropdownMenuSeparator,
} from '@/components/ui/dropdown-menu'
import { Checkbox } from '@/components/ui/checkbox'
import { Textarea } from '@/components/ui/textarea'
import Link from 'next/link'
import { ScrollArea } from '@/components/ui/scroll-area'
import { type Unit, UnitType, ContractingCompany } from './data'
import { Separator } from '@/components/ui/separator'
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select'
import { useToast } from '@/hooks/use-toast'
import {
  useFirestore,
  useCollection,
  useMemoFirebase,
  addDocumentNonBlocking,
  useDoc,
  updateDocumentNonBlocking,
} from '@/firebase'
import { collection, doc } from 'firebase/firestore'
import { Loader2 } from 'lucide-react'
import type { Client } from '../../data'
import { AlertDialog, AlertDialogAction, AlertDialogCancel, AlertDialogContent, AlertDialogDescription, AlertDialogFooter, AlertDialogHeader, AlertDialogTitle } from '@/components/ui/alert-dialog'

export default function UnitsPage() {
  const params = useParams()
  const router = useRouter()
  const { toast } = useToast()
  const contractId = params.contractId as string
  const firestore = useFirestore()

  const clientRef = useMemoFirebase(
    () => (firestore ? doc(firestore, 'clients', contractId) : null),
    [firestore, contractId]
  )
  const unitsRef = useMemoFirebase(
    () =>
      firestore
        ? collection(firestore, 'clients', contractId, 'units')
        : null,
    [firestore, contractId]
  )
  const { data: client, isLoading: isClientLoading } = useDoc<Client>(clientRef)
  const { data: units, isLoading: areUnitsLoading } =
    useCollection<Unit>(unitsRef)

  const [isFormOpen, setIsFormOpen] = useState(false)
  const [editingUnit, setEditingUnit] = useState<Unit | null>(null)
  const [unitToDeactivate, setUnitToDeactivate] = useState<Unit | null>(null)
  const [isDeactivateDialogOpen, setIsDeactivateDialogOpen] = useState(false)
  
  const [searchTerm, setSearchTerm] = useState('')
  const [statusFilter, setStatusFilter] = useState<string[]>(['Ativa'])
  const [formType, setFormType] = useState<UnitType>('Unidade')
  const [inheritData, setInheritData] = useState(false)

  const openFormDialog = (unit: Unit | null) => {
    setEditingUnit(unit)
    setFormType(unit?.type || 'Unidade')
    setInheritData(false) // Reset inheritance
    setIsFormOpen(true)
  }

  const openDeactivateDialog = (unit: Unit) => {
    setUnitToDeactivate(unit)
    setIsDeactivateDialogOpen(true)
  }

  const handleFormSubmit = (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault()
    if (!unitsRef || !firestore) return

    const formData = new FormData(event.currentTarget)
    const unitType = formData.get('type') as UnitType

    const unitData: Omit<Unit, 'id' | 'status'> = {
      name: formData.get('name') as string,
      type: unitType,
      description: formData.get('description') as string,
      cnpj: formData.get('cnpj') as string,
      cno: unitType === 'Obra' ? (formData.get('cno') as string) : undefined,
      contractingCompany:
        unitType === 'Contrato'
          ? {
              name: formData.get('contractingName') as string,
              cnpj: formData.get('contractingCnpj') as string,
              cnae: formData.get('contractingCnae') as string,
              riskLevel: formData.get('contractingRiskLevel') as string,
            }
          : undefined,
      propertyInfo: {
        address: formData.get('add-address') as string,
        zipCode: formData.get('add-zipCode') as string,
        neighborhood: formData.get('add-neighborhood') as string,
        city: formData.get('add-city') as string,
        state: formData.get('add-state') as string,
        country: formData.get('add-country') as string,
        totalArea: formData.get('add-totalArea') as string,
        builtArea: formData.get('add-builtArea') as string,
      },
      cnae: formData.get('cnae') as string,
      riskLevel: formData.get('riskLevel') as string,
      legalResponsible: formData.get('legalResponsible') as string,
      pgrResponsible: formData.get('pgrResponsible') as string,
      ltcatResponsible: formData.get('ltcatResponsible') as string,
      pcmsoResponsible: formData.get('pcmsoResponsible') as string,
    }

    if (editingUnit) {
      const docRef = doc(firestore, unitsRef.path, editingUnit.id as string)
      updateDocumentNonBlocking(docRef, unitData)
      toast({ title: 'Sucesso!', description: 'Unidade atualizada.' })
    } else {
      addDocumentNonBlocking(unitsRef, { ...unitData, status: 'Ativa' })
      toast({ title: 'Sucesso!', description: 'Unidade adicionada.' })
    }

    setIsFormOpen(false)
    setEditingUnit(null)
  }
  
  const handleDeactivateUnit = () => {
    if (!unitToDeactivate || !firestore) return;
    const docRef = doc(firestore, `clients/${contractId}/units`, unitToDeactivate.id as string);
    updateDocumentNonBlocking(docRef, { status: 'Inativa' });
    toast({
      title: 'Unidade Desativada',
      description: `A unidade "${unitToDeactivate.name}" foi marcada como inativa.`,
    })
    setIsDeactivateDialogOpen(false);
    setUnitToDeactivate(null);
  }

  const filteredUnits = useMemo(() => {
    if (!units) return []
    return units.filter((unit) => {
      const matchesSearch = unit.name
        .toLowerCase()
        .includes(searchTerm.toLowerCase())
      const matchesStatus =
        statusFilter.length === 0 || statusFilter.includes(unit.status)
      return matchesSearch && matchesStatus
    })
  }, [units, searchTerm, statusFilter])

  const isLoading = isClientLoading || areUnitsLoading

  const renderUnitForm = (unitToEdit?: Unit | null) => (
     <ScrollArea className='h-[60vh] pr-6'>
      <div className='grid gap-4 py-4'>
        {!unitToEdit && (
            <div className='flex items-center space-x-2 mb-4'>
              <Checkbox
                id='inherit'
                checked={inheritData}
                onCheckedChange={(checked) =>
                  setInheritData(checked as boolean)
                }
              />
              <Label htmlFor='inherit' className='cursor-pointer'>
                Herdar dados da empresa principal
              </Label>
            </div>
        )}

        <div className='space-y-2'>
          <Label htmlFor='type'>Tipo</Label>
          <Select
            name='type'
            value={formType}
            onValueChange={(value) => setFormType(value as UnitType)}
            required
          >
            <SelectTrigger>
              <SelectValue placeholder='Selecione o tipo' />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value='Unidade'>Unidade</SelectItem>
              <SelectItem value='Obra'>Obra</SelectItem>
              <SelectItem value='Contrato'>Contrato</SelectItem>
            </SelectContent>
          </Select>
        </div>

        {formType === 'Obra' && (
          <div className='space-y-2'>
            <Label htmlFor='cno'>Número do CNO</Label>
            <Input id='cno' name='cno' defaultValue={unitToEdit?.cno} />
          </div>
        )}

        {formType === 'Contrato' && (
          <fieldset className='grid gap-4 rounded-lg border p-4'>
            <legend className='-ml-1 px-1 text-sm font-medium'>
              Informações da Contratante
            </legend>
            <div className='space-y-2'>
              <Label htmlFor='contractingName'>Razão Social</Label>
              <Input id='contractingName' name='contractingName' defaultValue={unitToEdit?.contractingCompany?.name}/>
            </div>
            <div className='grid grid-cols-2 gap-4'>
              <div className='space-y-2'>
                <Label htmlFor='contractingCnpj'>CNPJ</Label>
                <Input id='contractingCnpj' name='contractingCnpj' defaultValue={unitToEdit?.contractingCompany?.cnpj}/>
              </div>
              <div className='space-y-2'>
                <Label htmlFor='contractingCnae'>CNAE</Label>
                <Input id='contractingCnae' name='contractingCnae' defaultValue={unitToEdit?.contractingCompany?.cnae}/>
              </div>
              <div className='space-y-2'>
                <Label htmlFor='contractingRiskLevel'>Grau de Risco</Label>
                <Input
                  id='contractingRiskLevel'
                  name='contractingRiskLevel'
                  defaultValue={unitToEdit?.contractingCompany?.riskLevel}
                />
              </div>
            </div>
          </fieldset>
        )}

        <div className='space-y-2'>
          <Label htmlFor='name'>Nome</Label>
          <Input id='name' name='name' defaultValue={unitToEdit?.name} required />
        </div>
        <div className='space-y-2'>
          <Label htmlFor='description'>Descrição</Label>
          <Textarea id='description' name='description' defaultValue={unitToEdit?.description} />
        </div>

        <fieldset className='grid gap-4 rounded-lg border p-4'>
          <legend className='-ml-1 px-1 text-sm font-medium'>
            Informações Gerais
          </legend>
          <div className='grid grid-cols-1 md:grid-cols-2 gap-4'>
            <div className='space-y-2'>
              <Label htmlFor='cnpj'>CNPJ</Label>
              <Input id='cnpj' name='cnpj' defaultValue={inheritData ? client?.cnpj : unitToEdit?.cnpj} />
            </div>
            <div className='space-y-2'>
              <Label htmlFor='cnae'>CNAE</Label>
              <Input id='cnae' name='cnae' defaultValue={inheritData ? client?.cnae : unitToEdit?.cnae}/>
            </div>
            <div className='space-y-2'>
              <Label htmlFor='riskLevel'>Grau de Risco</Label>
              <Input id='riskLevel' name='riskLevel' defaultValue={inheritData ? client?.riskLevel : unitToEdit?.riskLevel}/>
            </div>
          </div>
        </fieldset>

        <fieldset className='grid gap-4 rounded-lg border p-4'>
          <legend className='-ml-1 px-1 text-sm font-medium'>
            Informações do Imóvel
          </legend>
          <div className='space-y-2'>
            <Label htmlFor='add-address'>Endereço Completo</Label>
            <Input id='add-address' name='add-address' defaultValue={inheritData ? client?.address : unitToEdit?.propertyInfo.address} required />
          </div>
          <div className='grid grid-cols-1 md:grid-cols-2 gap-4'>
            <div className='space-y-2'>
              <Label htmlFor='add-zipCode'>CEP</Label>
              <Input id='add-zipCode' name='add-zipCode' defaultValue={unitToEdit?.propertyInfo.zipCode}/>
            </div>
            <div className='space-y-2'>
              <Label htmlFor='add-neighborhood'>Bairro</Label>
              <Input id='add-neighborhood' name='add-neighborhood' defaultValue={unitToEdit?.propertyInfo.neighborhood}/>
            </div>
            <div className='space-y-2'>
              <Label htmlFor='add-city'>Cidade</Label>
              <Input id='add-city' name='add-city' defaultValue={unitToEdit?.propertyInfo.city}/>
            </div>
            <div className='space-y-2'>
              <Label htmlFor='add-state'>Estado</Label>
              <Input id='add-state' name='add-state' defaultValue={unitToEdit?.propertyInfo.state}/>
            </div>
            <div className='space-y-2'>
              <Label htmlFor='add-country'>País</Label>
              <Input id='add-country' name='add-country' defaultValue={unitToEdit?.propertyInfo.country || 'Brasil'}/>
            </div>
            <div className='space-y-2'>
              <Label htmlFor='add-totalArea'>Área Total</Label>
              <Input id='add-totalArea' name='add-totalArea' defaultValue={unitToEdit?.propertyInfo.totalArea}/>
            </div>
            <div className='space-y-2'>
              <Label htmlFor='add-builtArea'>Área Construída</Label>
              <Input id='add-builtArea' name='add-builtArea' defaultValue={unitToEdit?.propertyInfo.builtArea}/>
            </div>
          </div>
        </fieldset>

        <div className='space-y-4 pt-4 border-t'>
          <h3 className='font-medium text-lg'>Responsáveis</h3>
          <div className='grid grid-cols-1 md:grid-cols-2 gap-4'>
            <div className='space-y-2'>
              <Label htmlFor='legalResponsible'>Responsável Legal</Label>
              <Input id='legalResponsible' name='legalResponsible' defaultValue={unitToEdit?.legalResponsible}/>
            </div>
            <div className='space-y-2'>
              <Label htmlFor='pgrResponsible'>Responsável pelo PGR</Label>
              <Input id='pgrResponsible' name='pgrResponsible' defaultValue={unitToEdit?.pgrResponsible}/>
            </div>
            <div className='space-y-2'>
              <Label htmlFor='ltcatResponsible'>Responsável pelo LTCAT</Label>
              <Input id='ltcatResponsible' name='ltcatResponsible' defaultValue={unitToEdit?.ltcatResponsible}/>
            </div>
            <div className='space-y-2'>
              <Label htmlFor='pcmsoResponsible'>Responsável pelo PCMSO</Label>
              <Input id='pcmsoResponsible' name='pcmsoResponsible' defaultValue={unitToEdit?.pcmsoResponsible}/>
            </div>
          </div>
        </div>
      </div>
    </ScrollArea>
  )
  
  return (
    <>
      <Card>
        <CardHeader>
          <CardTitle className='flex items-center justify-between'>
            Mapa de Unidades
             <Button size='sm' className='h-8 gap-1' onClick={() => openFormDialog(null)}>
              <PlusCircle className='h-3.5 w-3.5' />
              <span className='sr-only sm:not-sr-only sm:whitespace-nowrap'>
                Adicionar
              </span>
            </Button>
          </CardTitle>
          <CardDescription>
            Visualize e gerencie as unidades, obras e contratos ativos do cliente.
          </CardDescription>
        </CardHeader>
        <CardContent>
          {isLoading ? (
             <div className='flex items-center justify-center h-64'>
                <Loader2 className='h-8 w-8 animate-spin' />
              </div>
          ) : filteredUnits.length > 0 ? (
            <div className='grid gap-6 md:grid-cols-2 lg:grid-cols-3'>
              {filteredUnits.map((unit) => (
                <Card
                  key={unit.id}
                  className='flex flex-col h-full hover:shadow-md transition-shadow'
                >
                  <CardHeader>
                     <div className='flex justify-between items-start'>
                       <Link href={`/dashboard/clients/${contractId}/units/${unit.id}`}>
                        <CardTitle className='text-lg cursor-pointer hover:underline'>{unit.name}</CardTitle>
                      </Link>
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
                            <DropdownMenuItem onSelect={() => openFormDialog(unit)}>Editar</DropdownMenuItem>
                            <DropdownMenuItem onSelect={() => openDeactivateDialog(unit)}>Desativar</DropdownMenuItem>
                          </DropdownMenuContent>
                        </DropdownMenu>
                    </div>
                    <CardDescription>
                      <Badge variant={unit.status === 'Ativa' ? 'secondary' : 'outline'}>{unit.status}</Badge> <Badge variant="outline">{unit.type}</Badge>
                    </CardDescription>
                  </CardHeader>
                  <CardContent className='flex-grow'>
                    <p className='text-sm text-muted-foreground'>
                      {unit.description}
                    </p>
                  </CardContent>
                  <CardFooter>
                    <Button
                      asChild
                      variant='outline'
                      className='w-full'
                    >
                      <Link
                        href={`/dashboard/clients/${contractId}/sectors?unitId=${unit.id}`}
                      >
                        Ver Setores <ArrowRight className='ml-2 h-4 w-4' />
                      </Link>
                    </Button>
                  </CardFooter>
                </Card>
              ))}
            </div>
          ) : (
            <div className='flex flex-1 items-center justify-center rounded-lg border border-dashed shadow-sm h-96'>
              <div className='flex flex-col items-center gap-1 text-center'>
                <h3 className='text-2xl font-bold tracking-tight'>
                  Nenhuma unidade encontrada
                </h3>
                <p className='text-sm text-muted-foreground'>
                  Cadastre a primeira unidade para este cliente.
                </p>
                <Button
                  className='mt-4'
                  onClick={() => openFormDialog(null)}
                >
                  Adicionar Unidade
                </Button>
              </div>
            </div>
          )}
        </CardContent>
      </Card>
       <Dialog open={isFormOpen} onOpenChange={setIsFormOpen}>
        <DialogContent className='sm:max-w-2xl'>
          <DialogHeader>
            <DialogTitle>{editingUnit ? 'Editar' : 'Adicionar'} Unidade</DialogTitle>
            <DialogDescription>
             {editingUnit ? 'Atualize os detalhes' : 'Preencha os detalhes'} da estrutura.
            </DialogDescription>
          </DialogHeader>
          <form id='unit-form' onSubmit={handleFormSubmit}>
            {renderUnitForm(editingUnit)}
          </form>
          <DialogFooter>
            <Button variant='outline' onClick={() => setIsFormOpen(false)}>
              Cancelar
            </Button>
            <Button type='submit' form='unit-form'>
              {editingUnit ? 'Salvar Alterações' : 'Salvar Unidade'}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
      <AlertDialog open={isDeactivateDialogOpen} onOpenChange={setIsDeactivateDialogOpen}>
          <AlertDialogContent>
              <AlertDialogHeader>
                  <AlertDialogTitle>Você tem certeza?</AlertDialogTitle>
                  <AlertDialogDescription>
                      Esta ação marcará a unidade &quot;{unitToDeactivate?.name}&quot; como Inativa.
                  </AlertDialogDescription>
              </AlertDialogHeader>
              <AlertDialogFooter>
                  <AlertDialogCancel onClick={() => setUnitToDeactivate(null)}>Cancelar</AlertDialogCancel>
                  <AlertDialogAction onClick={handleDeactivateUnit}>Confirmar Desativação</AlertDialogAction>
              </AlertDialogFooter>
          </AlertDialogContent>
      </AlertDialog>
    </>
  )
}
