
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
import { type Unit, type UnitType, type ContractingCompany } from '@/lib/types/unit'
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
  updateDocumentNonBlocking,
  useDoc,
} from '@/firebase'
import { collection, doc } from 'firebase/firestore'
import { Loader2 } from 'lucide-react'
import type { Client } from '../../data'

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
  const { data: units, isLoading: areUnitsLoading } = useCollection<Unit>(unitsRef)

  const [isAddDialogOpen, setIsAddDialogOpen] = useState(false)
  const [searchTerm, setSearchTerm] = useState('')
  const [statusFilter, setStatusFilter] = useState<string[]>(['Ativa'])
  const [formType, setFormType] = useState<UnitType>('Unidade')
  const [inheritData, setInheritData] = useState(false)
  const [editingUnit, setEditingUnit] = useState<Unit | null>(null)

  // Controlled states for fields that can inherit data
  const [unitName, setUnitName] = useState('')
  const [unitCnpj, setUnitCnpj] = useState('')
  const [unitCnae, setUnitCnae] = useState('')
  const [unitRiskLevel, setUnitRiskLevel] = useState('')
  const [unitAddress, setUnitAddress] = useState('')

  const resetFormState = () => {
    setFormType('Unidade')
    setInheritData(false)
    setUnitName('')
    setUnitCnpj('')
    setUnitCnae('')
    setUnitRiskLevel('')
    setUnitAddress('')
  }

  useEffect(() => {
    if (!isAddDialogOpen) {
      resetFormState()
    } else if (editingUnit) {
      // Populate form when editing
      setUnitName(editingUnit.name || '')
      setUnitCnpj(editingUnit.cnpj || '')
      setUnitCnae(editingUnit.cnae || '')
      setUnitRiskLevel(editingUnit.riskLevel || '')
      setUnitAddress(editingUnit.propertyInfo?.address || '')
    }
  }, [isAddDialogOpen, editingUnit])

  // Handle inherit data checkbox
  useEffect(() => {
    if (inheritData && client && !editingUnit) {
      setUnitName(client.name || '')
      setUnitCnpj(client.cnpj || '')
      setUnitCnae(client.cnae || '')
      setUnitRiskLevel(client.riskLevel || '')
      setUnitAddress(client.address || '')
    } else if (!inheritData && !editingUnit) {
      // Clear fields when unchecking (only if not editing)
      setUnitName('')
      setUnitCnpj('')
      setUnitCnae('')
      setUnitRiskLevel('')
      setUnitAddress('')
    }
  }, [inheritData, client, editingUnit])

  const handleAddUnit = (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault()
    if (!unitsRef) {
      console.error('unitsRef is null')
      toast({
        title: 'Erro',
        description: 'Referência do Firestore não encontrada',
        variant: 'destructive'
      })
      return
    }

    try {
      const formData = new FormData(event.currentTarget)
      const unitType = formData.get('type') as UnitType

      console.log('Form data:', {
        name: formData.get('name'),
        type: unitType,
        address: formData.get('add-address'),
      })

      // Helper function to remove undefined fields (Firestore doesn't accept undefined)
      const removeUndefined = (obj: any): any => {
        const cleaned: any = {}
        Object.keys(obj).forEach(key => {
          if (obj[key] !== undefined && obj[key] !== null) {
            if (typeof obj[key] === 'object' && !Array.isArray(obj[key])) {
              const nested = removeUndefined(obj[key])
              if (Object.keys(nested).length > 0) {
                cleaned[key] = nested
              }
            } else {
              cleaned[key] = obj[key]
            }
          }
        })
        return cleaned
      }

      const newUnitData: Omit<Unit, 'id'> = {
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
        status: editingUnit?.status || 'Ativa',
      }

      // Remove undefined fields before saving to Firestore
      const cleanedData = removeUndefined(newUnitData)

      console.log('New unit data (cleaned):', cleanedData)

      if (editingUnit?.id) {
        const unitDocRef = doc(firestore!, `clients/${contractId}/units`, editingUnit.id)
        updateDocumentNonBlocking(unitDocRef, cleanedData)
        toast({ title: 'Unidade Atualizada!' })
      } else {
        addDocumentNonBlocking(unitsRef, cleanedData)
        toast({
          title: 'Unidade Adicionada!',
          description: `A unidade "${cleanedData.name}" foi adicionada com sucesso.`,
        })
      }

      setIsAddDialogOpen(false)
      setEditingUnit(null)
    } catch (error) {
      console.error('Error adding unit:', error)
      toast({
        title: 'Erro ao salvar unidade',
        description: error instanceof Error ? error.message : 'Erro desconhecido',
        variant: 'destructive'
      })
    }
  }

  const handleArchiveUnit = (unit: Unit) => {
    if (!firestore || !unit.id) return
    const unitDocRef = doc(firestore, `clients/${contractId}/units`, unit.id)
    updateDocumentNonBlocking(unitDocRef, { status: 'Inativa' })
    toast({
      title: 'Unidade Inativada',
      description: 'A unidade foi marcada como Inativa.',
      variant: 'destructive'
    })
  }

  const openEditDialog = (unit: Unit) => {
    setEditingUnit(unit)
    setFormType(unit.type)
    setIsAddDialogOpen(true)
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

  return (
    <>
      <Card>
        <CardHeader>
          <CardTitle className='flex items-center justify-between'>
            Mapa de Unidades
            <Dialog open={isAddDialogOpen} onOpenChange={setIsAddDialogOpen}>
              <DialogTrigger asChild>
                <Button size='sm' className='h-8 gap-1'>
                  <PlusCircle className='h-3.5 w-3.5' />
                  <span className='sr-only sm:not-sr-only sm:whitespace-nowrap'>
                    Adicionar
                  </span>
                </Button>
              </DialogTrigger>
              <DialogContent className='sm:max-w-2xl'>
                <DialogHeader>
                  <DialogTitle>
                    {editingUnit ? 'Editar' : 'Adicionar Nova'} Unidade/Obra/Contrato
                  </DialogTitle>
                  <DialogDescription>
                    {editingUnit ? 'Atualize os detalhes da estrutura.' : 'Preencha os detalhes da nova estrutura.'}
                    <span className='block mt-2 text-xs text-muted-foreground'>
                      * Campos obrigatórios
                    </span>
                  </DialogDescription>
                </DialogHeader>
                <form id='add-unit-form' onSubmit={handleAddUnit}>
                  <ScrollArea className='h-[60vh] pr-6'>
                    <div className='grid gap-4 py-4'>
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

                      <div className='space-y-2'>
                        <Label htmlFor='type'>Tipo</Label>
                        <Select
                          name='type'
                          value={formType}
                          onValueChange={(value) =>
                            setFormType(value as UnitType)
                          }
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
                          <Input id='cno' name='cno' />
                        </div>
                      )}

                      {formType === 'Contrato' && (
                        <fieldset className='grid gap-4 rounded-lg border p-4'>
                          <legend className='-ml-1 px-1 text-sm font-medium'>
                            Informações da Contratante
                          </legend>
                          <div className='space-y-2'>
                            <Label htmlFor='contractingName'>
                              Razão Social
                            </Label>
                            <Input
                              id='contractingName'
                              name='contractingName'
                            />
                          </div>
                          <div className='grid grid-cols-2 gap-4'>
                            <div className='space-y-2'>
                              <Label htmlFor='contractingCnpj'>CNPJ</Label>
                              <Input
                                id='contractingCnpj'
                                name='contractingCnpj'
                              />
                            </div>
                            <div className='space-y-2'>
                              <Label htmlFor='contractingCnae'>CNAE</Label>
                              <Input
                                id='contractingCnae'
                                name='contractingCnae'
                              />
                            </div>
                            <div className='space-y-2'>
                              <Label htmlFor='contractingRiskLevel'>
                                Grau de Risco
                              </Label>
                              <Input
                                id='contractingRiskLevel'
                                name='contractingRiskLevel'
                              />
                            </div>
                          </div>
                        </fieldset>
                      )}

                      <div className='space-y-2'>
                        <Label htmlFor='name'>Nome *</Label>
                        <Input
                          id='name'
                          name='name'
                          value={unitName}
                          onChange={(e) => setUnitName(e.target.value)}
                          placeholder='Digite o nome da unidade'
                          required
                        />
                      </div>
                      <div className='space-y-2'>
                        <Label htmlFor='description'>Descrição</Label>
                        <Textarea
                          id='description'
                          name='description'
                          defaultValue={editingUnit?.description}
                          placeholder='Descrição opcional da unidade'
                        />
                      </div>

                      <fieldset className='grid gap-4 rounded-lg border p-4'>
                        <legend className='-ml-1 px-1 text-sm font-medium'>
                          Informações Gerais
                        </legend>
                        <div className='grid grid-cols-1 md:grid-cols-2 gap-4'>
                          <div className='space-y-2'>
                            <Label htmlFor='cnpj'>CNPJ</Label>
                            <Input
                              id='cnpj'
                              name='cnpj'
                              value={unitCnpj}
                              onChange={(e) => setUnitCnpj(e.target.value)}
                              placeholder='00.000.000/0000-00'
                            />
                          </div>
                          <div className='space-y-2'>
                            <Label htmlFor='cnae'>CNAE</Label>
                            <Input
                              id='cnae'
                              name='cnae'
                              value={unitCnae}
                              onChange={(e) => setUnitCnae(e.target.value)}
                              placeholder='0000-0/00'
                            />
                          </div>
                          <div className='space-y-2'>
                            <Label htmlFor='riskLevel'>Grau de Risco</Label>
                            <Input
                              id='riskLevel'
                              name='riskLevel'
                              value={unitRiskLevel}
                              onChange={(e) => setUnitRiskLevel(e.target.value)}
                              placeholder='1-4'
                            />
                          </div>
                        </div>
                      </fieldset>

                      {/* Property Info */}
                      <fieldset className='grid gap-4 rounded-lg border p-4'>
                        <legend className='-ml-1 px-1 text-sm font-medium'>
                          Informações do Imóvel
                        </legend>
                        <div className='space-y-2'>
                          <Label htmlFor='add-address'>
                            Endereço Completo *
                          </Label>
                          <Input
                            id='add-address'
                            name='add-address'
                            value={unitAddress}
                            onChange={(e) => setUnitAddress(e.target.value)}
                            placeholder='Rua, Número, Complemento'
                            required
                          />
                        </div>
                        <div className='grid grid-cols-1 md:grid-cols-2 gap-4'>
                          <div className='space-y-2'>
                            <Label htmlFor='add-zipCode'>CEP</Label>
                            <Input
                              id='add-zipCode'
                              name='add-zipCode'
                              defaultValue={editingUnit?.propertyInfo?.zipCode}
                              placeholder='00000-000'
                            />
                          </div>
                          <div className='space-y-2'>
                            <Label htmlFor='add-neighborhood'>Bairro</Label>
                            <Input
                              id='add-neighborhood'
                              name='add-neighborhood'
                              defaultValue={editingUnit?.propertyInfo?.neighborhood}
                              placeholder='Nome do bairro'
                            />
                          </div>
                          <div className='space-y-2'>
                            <Label htmlFor='add-city'>Cidade</Label>
                            <Input
                              id='add-city'
                              name='add-city'
                              defaultValue={editingUnit?.propertyInfo?.city}
                              placeholder='Nome da cidade'
                            />
                          </div>
                          <div className='space-y-2'>
                            <Label htmlFor='add-state'>Estado</Label>
                            <Input
                              id='add-state'
                              name='add-state'
                              defaultValue={editingUnit?.propertyInfo?.state}
                              placeholder='UF (ex: SP)'
                            />
                          </div>
                          <div className='space-y-2'>
                            <Label htmlFor='add-country'>País</Label>
                            <Input
                              id='add-country'
                              name='add-country'
                              defaultValue={editingUnit?.propertyInfo?.country || 'Brasil'}
                            />
                          </div>
                          <div className='space-y-2'>
                            <Label htmlFor='add-totalArea'>Área Total</Label>
                            <Input
                              id='add-totalArea'
                              name='add-totalArea'
                              defaultValue={editingUnit?.propertyInfo?.totalArea}
                              placeholder='Ex: 1000 m²'
                            />
                          </div>
                          <div className='space-y-2'>
                            <Label htmlFor='add-builtArea'>
                              Área Construída
                            </Label>
                            <Input
                              id='add-builtArea'
                              name='add-builtArea'
                              defaultValue={editingUnit?.propertyInfo?.builtArea}
                              placeholder='Ex: 800 m²'
                            />
                          </div>
                        </div>
                      </fieldset>

                      <div className='space-y-4 pt-4 border-t'>
                        <h3 className='font-medium text-lg'>Responsáveis</h3>
                        <div className='grid grid-cols-1 md:grid-cols-2 gap-4'>
                          <div className='space-y-2'>
                            <Label htmlFor='legalResponsible'>
                              Responsável Legal
                            </Label>
                            <Input
                              id='legalResponsible'
                              name='legalResponsible'
                              defaultValue={editingUnit?.legalResponsible}
                              placeholder='Nome do responsável legal'
                            />
                          </div>
                          <div className='space-y-2'>
                            <Label htmlFor='pgrResponsible'>
                              Responsável pelo PGR
                            </Label>
                            <Input
                              id='pgrResponsible'
                              name='pgrResponsible'
                              defaultValue={editingUnit?.pgrResponsible}
                              placeholder='Nome do responsável pelo PGR'
                            />
                          </div>
                          <div className='space-y-2'>
                            <Label htmlFor='ltcatResponsible'>
                              Responsável pelo LTCAT
                            </Label>
                            <Input
                              id='ltcatResponsible'
                              name='ltcatResponsible'
                              defaultValue={editingUnit?.ltcatResponsible}
                              placeholder='Nome do responsável pelo LTCAT'
                            />
                          </div>
                          <div className='space-y-2'>
                            <Label htmlFor='pcmsoResponsible'>
                              Responsável pelo PCMSO
                            </Label>
                            <Input
                              id='pcmsoResponsible'
                              name='pcmsoResponsible'
                              defaultValue={editingUnit?.pcmsoResponsible}
                              placeholder='Nome do responsável pelo PCMSO'
                            />
                          </div>
                        </div>
                      </div>
                    </div>
                  </ScrollArea>
                </form>
                <DialogFooter>
                  <Button
                    variant='outline'
                    onClick={() => {
                      setIsAddDialogOpen(false)
                      setEditingUnit(null)
                    }}
                  >
                    Cancelar
                  </Button>
                  <Button type='submit' form='add-unit-form'>
                    {editingUnit ? 'Salvar Alterações' : 'Salvar'}
                  </Button>
                </DialogFooter>
              </DialogContent>
            </Dialog>
          </CardTitle>
          <CardDescription>
            Visualize e gerencie as unidades, obras e contratos ativos do cliente.
          </CardDescription>
          <div className='flex items-center gap-2 pt-4'>
            <div className='relative w-full max-w-sm'>
              <Search className='absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground' />
              <Input
                type='search'
                placeholder='Buscar por nome ou CNPJ...'
                className='pl-8'
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
              />
            </div>
            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <Button variant='outline' size='sm' className='h-10 gap-1 text-sm'>
                  <Filter className='h-3.5 w-3.5' />
                  <span className='sr-only sm:not-sr-only'>Filtrar</span>
                </Button>
              </DropdownMenuTrigger>
              <DropdownMenuContent align='end'>
                <DropdownMenuLabel>Filtrar por Status</DropdownMenuLabel>
                <DropdownMenuSeparator />
                {['Ativa', 'Inativa'].map((status) => (
                  <DropdownMenuCheckboxItem
                    key={status}
                    checked={statusFilter.includes(status)}
                    onCheckedChange={(checked) => {
                      setStatusFilter((prev) =>
                        checked
                          ? [...prev, status]
                          : prev.filter((s) => s !== status)
                      )
                    }}
                  >
                    {status}
                  </DropdownMenuCheckboxItem>
                ))}
              </DropdownMenuContent>
            </DropdownMenu>
          </div>
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
                  className='flex flex-col h-full hover:shadow-md transition-shadow cursor-pointer'
                  onClick={() =>
                    router.push(
                      `/dashboard/clients/${contractId}/units/${unit.id}`
                    )
                  }
                >
                  <CardHeader>
                    <div className='flex justify-between items-start'>
                      <CardTitle className='text-lg'>{unit.name}</CardTitle>
                      <div className='flex items-center gap-2'>
                        <Badge variant='outline'>{unit.type}</Badge>
                        <DropdownMenu>
                          <DropdownMenuTrigger asChild>
                            <Button
                              variant='ghost'
                              size='icon'
                              className='h-8 w-8'
                              onClick={(e) => e.stopPropagation()}
                            >
                              <MoreHorizontal className='h-4 w-4' />
                            </Button>
                          </DropdownMenuTrigger>
                          <DropdownMenuContent align='end' onClick={(e) => e.stopPropagation()}>
                            <DropdownMenuLabel>Ações</DropdownMenuLabel>
                            <DropdownMenuItem onClick={() => openEditDialog(unit)}>
                              Editar
                            </DropdownMenuItem>
                            <DropdownMenuItem onClick={() => handleArchiveUnit(unit)}>
                              Inativar
                            </DropdownMenuItem>
                          </DropdownMenuContent>
                        </DropdownMenu>
                      </div>
                    </div>
                    <CardDescription>
                      {unit.propertyInfo.address}
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
                      onClick={(e) => e.stopPropagation()}
                    >
                      <Link
                        href={`/dashboard/clients/${contractId}/sectors?unitId=${unit.id}`}
                      >
                        Setores <ArrowRight className='ml-2 h-4 w-4' />
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
                  onClick={() => setIsAddDialogOpen(true)}
                >
                  Adicionar Unidade
                </Button>
              </div>
            </div>
          )}
        </CardContent>
      </Card>
    </>
  )
}
