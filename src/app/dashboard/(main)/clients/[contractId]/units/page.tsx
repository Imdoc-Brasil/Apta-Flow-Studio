
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
import { initialClientsData } from '@/app/dashboard/(main)/clients/data'
import { Checkbox } from '@/components/ui/checkbox'
import { Textarea } from '@/components/ui/textarea'
import Link from 'next/link'
import { ScrollArea } from '@/components/ui/scroll-area'
import { initialUnitsData, type Unit, UnitType } from './data'
import { Separator } from '@/components/ui/separator'
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select'

const getClientById = (contractId: string) => {
  return initialClientsData.find((client) => client.contractId === contractId)
}

function UnitDetailDialog({
  unit,
  open,
  onOpenChange,
  onUnitUpdate,
}: {
  unit: Unit | null
  open: boolean
  onOpenChange: (open: boolean) => void
  onUnitUpdate: (updatedUnit: Unit) => void
}) {
  const [isEditing, setIsEditing] = useState(false)

  useEffect(() => {
    // Reset editing state when dialog is closed or unit changes
    if (!open) {
      setIsEditing(false)
    }
  }, [open])

  const handleSubmit = (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault()
    if (!unit) return

    const formData = new FormData(event.currentTarget)
    const updatedData = {
      name: formData.get('name') as string,
      type: formData.get('type') as UnitType,
      description: formData.get('description') as string,
      cnpj: formData.get('cnpj') as string,
      propertyInfo: {
        address: formData.get('address') as string,
        zipCode: formData.get('zipCode') as string,
        neighborhood: formData.get('neighborhood') as string,
        city: formData.get('city') as string,
        state: formData.get('state') as string,
        country: formData.get('country') as string,
        totalArea: formData.get('totalArea') as string,
        builtArea: formData.get('builtArea') as string,
      },
      cnae: formData.get('cnae') as string,
      riskLevel: formData.get('riskLevel') as string,
      legalResponsible: formData.get('legalResponsible') as string,
      pgrResponsible: formData.get('pgrResponsible') as string,
      ltcatResponsible: formData.get('ltcatResponsible') as string,
      pcmsoResponsible: formData.get('pcmsoResponsible') as string,
    }

    onUnitUpdate({ ...unit, ...updatedData })
    setIsEditing(false)
  }

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className='sm:max-w-3xl'>
        <DialogHeader>
          <DialogTitle>{unit?.name}</DialogTitle>
          <DialogDescription>
            Visualize os detalhes da unidade.
          </DialogDescription>
        </DialogHeader>

        {isEditing ? (
          <form id={`update-unit-form-${unit?.id}`} onSubmit={handleSubmit}>
            <ScrollArea className='h-[60vh] pr-6'>
              <div className='grid gap-6 py-4'>
                {/* General Info */}
                <fieldset className='grid gap-4 rounded-lg border p-4'>
                  <legend className='-ml-1 px-1 text-sm font-medium'>
                    Informações Gerais
                  </legend>
                  <div className='space-y-2'>
                    <Label htmlFor='type'>Tipo</Label>
                    <Select name='type' defaultValue={unit?.type} required>
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
                  <div className='space-y-2'>
                    <Label htmlFor='name'>Nome</Label>
                    <Input
                      id='name'
                      name='name'
                      defaultValue={unit?.name}
                      required
                    />
                  </div>
                  <div className='space-y-2'>
                    <Label htmlFor='description'>Descrição</Label>
                    <Textarea
                      id='description'
                      name='description'
                      defaultValue={unit?.description}
                    />
                  </div>
                  <div className='grid grid-cols-1 md:grid-cols-2 gap-4'>
                    <div className='space-y-2'>
                      <Label htmlFor='cnpj'>CNPJ</Label>
                      <Input
                        id='cnpj'
                        name='cnpj'
                        defaultValue={unit?.cnpj}
                      />
                    </div>
                    <div className='space-y-2'>
                      <Label htmlFor='cnae'>CNAE</Label>
                      <Input
                        id='cnae'
                        name='cnae'
                        defaultValue={unit?.cnae}
                      />
                    </div>
                    <div className='space-y-2'>
                      <Label htmlFor='riskLevel'>Grau de Risco</Label>
                      <Input
                        id='riskLevel'
                        name='riskLevel'
                        defaultValue={unit?.riskLevel}
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
                      <Label htmlFor='address'>Endereço Completo</Label>
                      <Input
                        id='address'
                        name='address'
                        defaultValue={unit?.propertyInfo.address}
                        required
                      />
                    </div>
                  <div className='grid grid-cols-1 md:grid-cols-2 gap-4'>
                    <div className='space-y-2'>
                      <Label htmlFor='zipCode'>CEP</Label>
                      <Input
                        id='zipCode'
                        name='zipCode'
                        defaultValue={unit?.propertyInfo.zipCode}
                      />
                    </div>
                    <div className='space-y-2'>
                      <Label htmlFor='neighborhood'>Bairro</Label>
                      <Input
                        id='neighborhood'
                        name='neighborhood'
                        defaultValue={unit?.propertyInfo.neighborhood}
                      />
                    </div>
                    <div className='space-y-2'>
                      <Label htmlFor='city'>Cidade</Label>
                      <Input id='city' name='city' defaultValue={unit?.propertyInfo.city} />
                    </div>
                     <div className='space-y-2'>
                      <Label htmlFor='state'>Estado</Label>
                      <Input id='state' name='state' defaultValue={unit?.propertyInfo.state} />
                    </div>
                     <div className='space-y-2'>
                      <Label htmlFor='country'>País</Label>
                      <Input id='country' name='country' defaultValue={unit?.propertyInfo.country} />
                    </div>
                     <div className='space-y-2'>
                      <Label htmlFor='totalArea'>Área Total</Label>
                      <Input id='totalArea' name='totalArea' defaultValue={unit?.propertyInfo.totalArea} />
                    </div>
                    <div className='space-y-2'>
                      <Label htmlFor='builtArea'>Área Construída</Label>
                      <Input id='builtArea' name='builtArea' defaultValue={unit?.propertyInfo.builtArea} />
                    </div>
                  </div>
                </fieldset>

                {/* Responsibles */}
                <fieldset className='grid gap-4 rounded-lg border p-4'>
                  <legend className='-ml-1 px-1 text-sm font-medium'>
                    Responsáveis
                  </legend>
                  <div className='grid grid-cols-1 md:grid-cols-2 gap-4'>
                    <div className='space-y-2'>
                      <Label htmlFor='legalResponsible'>
                        Responsável Legal
                      </Label>
                      <Input
                        id='legalResponsible'
                        name='legalResponsible'
                        defaultValue={unit?.legalResponsible}
                      />
                    </div>
                    <div className='space-y-2'>
                      <Label htmlFor='pgrResponsible'>
                        Responsável pelo PGR
                      </Label>
                      <Input
                        id='pgrResponsible'
                        name='pgrResponsible'
                        defaultValue={unit?.pgrResponsible}
                      />
                    </div>
                    <div className='space-y-2'>
                      <Label htmlFor='ltcatResponsible'>
                        Responsável pelo LTCAT
                      </Label>
                      <Input
                        id='ltcatResponsible'
                        name='ltcatResponsible'
                        defaultValue={unit?.ltcatResponsible}
                      />
                    </div>
                    <div className='space-y-2'>
                      <Label htmlFor='pcmsoResponsible'>
                        Responsável pelo PCMSO
                      </Label>
                      <Input
                        id='pcmsoResponsible'
                        name='pcmsoResponsible'
                        defaultValue={unit?.pcmsoResponsible}
                      />
                    </div>
                  </div>
                </fieldset>
              </div>
            </ScrollArea>
          </form>
        ) : (
          <ScrollArea className='h-[60vh] pr-6'>
            <div className='space-y-6 text-sm py-4'>
              <div className='space-y-4'>
                <p>
                  <span className='font-semibold text-base'>Tipo: </span>
                  <Badge variant='secondary'>{unit?.type}</Badge>
                </p>
                <p>
                  <span className='font-semibold text-base'>Descrição: </span>
                  <span className='text-muted-foreground'>
                    {unit?.description || '-'}
                  </span>
                </p>
              </div>
              <Separator />
              <div>
                <h3 className='font-semibold text-base mb-2'>
                  Informações Gerais
                </h3>
                <div className='grid grid-cols-2 gap-4'>
                  <div>
                    <Label className='font-semibold'>CNPJ</Label>
                    <p className='text-muted-foreground'>{unit?.cnpj || '-'}</p>
                  </div>
                  <div>
                    <Label className='font-semibold'>CNAE</Label>
                    <p className='text-muted-foreground'>{unit?.cnae || '-'}</p>
                  </div>
                  <div>
                    <Label className='font-semibold'>Grau de Risco</Label>
                    <p className='text-muted-foreground'>
                      {unit?.riskLevel || '-'}
                    </p>
                  </div>
                </div>
              </div>
              <Separator />
              <div>
                <h3 className='font-semibold text-base mb-2'>
                  Informações do Imóvel
                </h3>
                <div className='grid grid-cols-2 gap-4'>
                  <div className='col-span-2'>
                    <Label className='font-semibold'>Endereço Completo</Label>
                    <p className='text-muted-foreground'>
                      {unit?.propertyInfo.address || '-'}
                    </p>
                  </div>
                  <div>
                    <Label className='font-semibold'>CEP</Label>
                    <p className='text-muted-foreground'>
                      {unit?.propertyInfo.zipCode || '-'}
                    </p>
                  </div>
                   <div>
                    <Label className='font-semibold'>Bairro</Label>
                    <p className='text-muted-foreground'>
                      {unit?.propertyInfo.neighborhood || '-'}
                    </p>
                  </div>
                   <div>
                    <Label className='font-semibold'>Cidade</Label>
                    <p className='text-muted-foreground'>
                      {unit?.propertyInfo.city || '-'}
                    </p>
                  </div>
                   <div>
                    <Label className='font-semibold'>Estado</Label>
                    <p className='text-muted-foreground'>
                      {unit?.propertyInfo.state || '-'}
                    </p>
                  </div>
                  <div>
                    <Label className='font-semibold'>Área Total</Label>
                    <p className='text-muted-foreground'>
                      {unit?.propertyInfo.totalArea || '-'}
                    </p>
                  </div>
                  <div>
                    <Label className='font-semibold'>Área Construída</Label>
                    <p className='text-muted-foreground'>
                      {unit?.propertyInfo.builtArea || '-'}
                    </p>
                  </div>
                </div>
              </div>
              <Separator />
              <div>
                <h3 className='font-semibold text-base mb-2'>Responsáveis</h3>
                <div className='grid grid-cols-2 gap-4'>
                  <div>
                    <Label className='font-semibold'>Responsável Legal</Label>
                    <p className='text-muted-foreground'>
                      {unit?.legalResponsible || '-'}
                    </p>
                  </div>
                  <div>
                    <Label className='font-semibold'>Responsável pelo PGR</Label>
                    <p className='text-muted-foreground'>
                      {unit?.pgrResponsible || '-'}
                    </p>
                  </div>
                  <div>
                    <Label className='font-semibold'>
                      Responsável pelo LTCAT
                    </Label>
                    <p className='text-muted-foreground'>
                      {unit?.ltcatResponsible || '-'}
                    </p>
                  </div>
                  <div>
                    <Label className='font-semibold'>
                      Responsável pelo PCMSO
                    </Label>
                    <p className='text-muted-foreground'>
                      {unit?.pcmsoResponsible || '-'}
                    </p>
                  </div>
                </div>
              </div>
            </div>
          </ScrollArea>
        )}

        <DialogFooter>
          {isEditing ? (
            <>
              <Button variant='outline' onClick={() => setIsEditing(false)}>
                Cancelar
              </Button>
              <Button type='submit' form={`update-unit-form-${unit?.id}`}>
                Salvar Alterações
              </Button>
            </>
          ) : (
            <>
              <Button variant='outline' onClick={() => onOpenChange(false)}>
                Fechar
              </Button>
              <Button onClick={() => setIsEditing(true)}>
                <Pencil className='mr-2 h-4 w-4' /> Editar
              </Button>
            </>
          )}
        </DialogFooter>
      </DialogContent>
    </Dialog>
  )
}

export default function UnitsPage() {
  const params = useParams()
  const contractId = params.contractId as string
  const client = getClientById(contractId)

  const [units, setUnits] = useState(initialUnitsData)
  const [isAddDialogOpen, setIsAddDialogOpen] = useState(false)
  const [isDetailOpen, setIsDetailOpen] = useState(false)
  const [currentUnit, setCurrentUnit] = useState<Unit | null>(null)
  const [inheritData, setInheritData] = useState(false)
  const [searchTerm, setSearchTerm] = useState('')
  const [statusFilter, setStatusFilter] = useState<string[]>(['Ativa'])

  const [formState, setFormState] = useState<Omit<Unit, 'id' | 'status'>>({
    name: '',
    type: 'Unidade',
    description: '',
    cnpj: '',
    propertyInfo: {
      address: '',
      zipCode: '',
      neighborhood: '',
      city: '',
      state: '',
      country: 'Brasil',
      totalArea: '',
      builtArea: '',
    },
    cnae: '',
    riskLevel: '',
    legalResponsible: '',
    pgrResponsible: '',
    ltcatResponsible: '',
    pcmsoResponsible: '',
  })

  const resetFormState = () => {
    setFormState({
      name: '',
      type: 'Unidade',
      description: '',
      cnpj: '',
      propertyInfo: {
        address: '',
        zipCode: '',
        neighborhood: '',
        city: '',
        state: '',
        country: 'Brasil',
        totalArea: '',
        builtArea: '',
      },
      cnae: '',
      riskLevel: '',
      legalResponsible: '',
      pgrResponsible: '',
      ltcatResponsible: '',
      pcmsoResponsible: '',
    })
    setInheritData(false)
  }

  useEffect(() => {
    if (isAddDialogOpen) {
      if (client && inheritData) {
        setFormState((prev) => ({
          ...prev,
          name: '',
          type: prev.type,
          cnpj: client.cnpj,
          propertyInfo: {
            ...prev.propertyInfo,
            address: client.address, // Note: client has only one address field
          },
          cnae: client.cnae,
          riskLevel: client.riskLevel,
        }))
      } else {
        resetFormState()
      }
    }
  }, [isAddDialogOpen, inheritData, client])

  const handleAddUnit = (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault()
    const newUnit: Unit = {
      id: `UNIT-${Math.floor(Math.random() * 1000)
        .toString()
        .padStart(3, '0')}`,
      ...formState,
      status: 'Ativa',
    }
    setUnits((prev) => [...prev, newUnit])
    setIsAddDialogOpen(false)
  }

  const handleUpdateUnit = (updatedUnit: Unit) => {
    setUnits((prev) =>
      prev.map((u) => (u.id === updatedUnit.id ? updatedUnit : u))
    )
    setCurrentUnit(updatedUnit)
  }

  const openDetailDialog = (unit: Unit) => {
    setCurrentUnit(unit)
    setIsDetailOpen(true)
  }

  const closeDetailDialog = () => {
    setIsDetailOpen(false)
    setCurrentUnit(null)
  }

  const filteredUnits = useMemo(() => {
    return units.filter((unit) => {
      const matchesSearch = unit.name
        .toLowerCase()
        .includes(searchTerm.toLowerCase())
      const matchesStatus =
        statusFilter.length === 0 || statusFilter.includes(unit.status)
      return matchesSearch && matchesStatus
    })
  }, [units, searchTerm, statusFilter])

  return (
    <>
      <Card>
        <CardHeader>
          <CardTitle className='flex items-center justify-between'>
            Mapa de Unidades
            <Dialog
              open={isAddDialogOpen}
              onOpenChange={(isOpen) => {
                setIsAddDialogOpen(isOpen)
                if (!isOpen) resetFormState()
              }}
            >
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
                    Adicionar Nova Unidade/Obra/Contrato
                  </DialogTitle>
                  <DialogDescription>
                    Preencha os detalhes da nova estrutura.
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
                          value={formState.type}
                          onValueChange={(value) =>
                            setFormState((prev) => ({
                              ...prev,
                              type: value as UnitType,
                            }))
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

                      <div className='space-y-2'>
                        <Label htmlFor='name'>Nome</Label>
                        <Input
                          id='name'
                          name='name'
                          value={formState.name}
                          onChange={(e) =>
                            setFormState((prev) => ({
                              ...prev,
                              name: e.target.value,
                            }))
                          }
                          required
                        />
                      </div>
                      <div className='space-y-2'>
                        <Label htmlFor='description'>Descrição</Label>
                        <Textarea
                          id='description'
                          name='description'
                          value={formState.description}
                          onChange={(e) =>
                            setFormState((prev) => ({
                              ...prev,
                              description: e.target.value,
                            }))
                          }
                        />
                      </div>

                      {/* Property Info */}
                      <fieldset className='grid gap-4 rounded-lg border p-4'>
                        <legend className='-ml-1 px-1 text-sm font-medium'>
                          Informações do Imóvel
                        </legend>
                        <div className='space-y-2'>
                          <Label htmlFor='add-address'>
                            Endereço Completo
                          </Label>
                          <Input
                            id='add-address'
                            name='address'
                            value={formState.propertyInfo.address}
                             onChange={(e) => setFormState(prev => ({...prev, propertyInfo: {...prev.propertyInfo, address: e.target.value}}))}
                            required
                          />
                        </div>
                        <div className='grid grid-cols-1 md:grid-cols-2 gap-4'>
                          <div className='space-y-2'>
                            <Label htmlFor='add-zipCode'>CEP</Label>
                            <Input
                              id='add-zipCode'
                              name='zipCode'
                              value={formState.propertyInfo.zipCode}
                              onChange={(e) => setFormState(prev => ({...prev, propertyInfo: {...prev.propertyInfo, zipCode: e.target.value}}))}
                            />
                          </div>
                          <div className='space-y-2'>
                            <Label htmlFor='add-neighborhood'>Bairro</Label>
                            <Input
                              id='add-neighborhood'
                              name='neighborhood'
                              value={formState.propertyInfo.neighborhood}
                              onChange={(e) => setFormState(prev => ({...prev, propertyInfo: {...prev.propertyInfo, neighborhood: e.target.value}}))}
                            />
                          </div>
                          <div className='space-y-2'>
                            <Label htmlFor='add-city'>Cidade</Label>
                            <Input
                              id='add-city'
                              name='city'
                              value={formState.propertyInfo.city}
                              onChange={(e) => setFormState(prev => ({...prev, propertyInfo: {...prev.propertyInfo, city: e.target.value}}))}
                            />
                          </div>
                          <div className='space-y-2'>
                            <Label htmlFor='add-state'>Estado</Label>
                            <Input
                              id='add-state'
                              name='state'
                              value={formState.propertyInfo.state}
                              onChange={(e) => setFormState(prev => ({...prev, propertyInfo: {...prev.propertyInfo, state: e.target.value}}))}
                            />
                          </div>
                          <div className='space-y-2'>
                            <Label htmlFor='add-country'>País</Label>
                            <Input
                              id='add-country'
                              name='country'
                              value={formState.propertyInfo.country}
                              onChange={(e) => setFormState(prev => ({...prev, propertyInfo: {...prev.propertyInfo, country: e.target.value}}))}
                            />
                          </div>
                           <div className='space-y-2'>
                            <Label htmlFor='add-totalArea'>Área Total</Label>
                            <Input
                              id='add-totalArea'
                              name='totalArea'
                              value={formState.propertyInfo.totalArea}
                              onChange={(e) => setFormState(prev => ({...prev, propertyInfo: {...prev.propertyInfo, totalArea: e.target.value}}))}
                            />
                          </div>
                          <div className='space-y-2'>
                            <Label htmlFor='add-builtArea'>Área Construída</Label>
                            <Input
                              id='add-builtArea'
                              name='builtArea'
                              value={formState.propertyInfo.builtArea}
                              onChange={(e) => setFormState(prev => ({...prev, propertyInfo: {...prev.propertyInfo, builtArea: e.target.value}}))}
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
                              value={formState.legalResponsible}
                              onChange={(e) =>
                                setFormState((prev) => ({
                                  ...prev,
                                  legalResponsible: e.target.value,
                                }))
                              }
                            />
                          </div>
                          <div className='space-y-2'>
                            <Label htmlFor='pgrResponsible'>
                              Responsável pelo PGR
                            </Label>
                            <Input
                              id='pgrResponsible'
                              name='pgrResponsible'
                              value={formState.pgrResponsible}
                              onChange={(e) =>
                                setFormState((prev) => ({
                                  ...prev,
                                  pgrResponsible: e.target.value,
                                }))
                              }
                            />
                          </div>
                          <div className='space-y-2'>
                            <Label htmlFor='ltcatResponsible'>
                              Responsável pelo LTCAT
                            </Label>
                            <Input
                              id='ltcatResponsible'
                              name='ltcatResponsible'
                              value={formState.ltcatResponsible}
                              onChange={(e) =>
                                setFormState((prev) => ({
                                  ...prev,
                                  ltcatResponsible: e.target.value,
                                }))
                              }
                            />
                          </div>
                          <div className='space-y-2'>
                            <Label htmlFor='pcmsoResponsible'>
                              Responsável pelo PCMSO
                            </Label>
                            <Input
                              id='pcmsoResponsible'
                              name='pcmsoResponsible'
                              value={formState.pcmsoResponsible}
                              onChange={(e) =>
                                setFormState((prev) => ({
                                  ...prev,
                                  pcmsoResponsible: e.target.value,
                                }))
                              }
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
                    }}
                  >
                    Cancelar
                  </Button>
                  <Button type='submit' form='add-unit-form'>
                    Salvar
                  </Button>
                </DialogFooter>
              </DialogContent>
            </Dialog>
          </CardTitle>
          <CardDescription>
            Selecione uma unidade para visualizar seus setores.
          </CardDescription>
        </CardHeader>
        <CardContent>
          {filteredUnits.length > 0 ? (
            <div className='grid gap-6 md:grid-cols-2 lg:grid-cols-3'>
              {filteredUnits.map((unit) => (
                <Card
                  key={unit.id}
                  className='flex flex-col hover:shadow-md transition-shadow'
                >
                  <div
                    className='flex-grow cursor-pointer'
                    onClick={() => openDetailDialog(unit)}
                  >
                    <CardHeader>
                      <div className='flex justify-between items-start'>
                        <CardTitle>{unit.name}</CardTitle>
                        <Badge variant='outline'>{unit.type}</Badge>
                      </div>
                      <CardDescription>{unit.propertyInfo.address}</CardDescription>
                    </CardHeader>
                    <CardContent>
                      <p className='text-sm text-muted-foreground'>
                        {unit.description}
                      </p>
                    </CardContent>
                  </div>
                  <CardFooter>
                    <Button asChild className='w-full' variant='outline'>
                      <Link
                        href={`/dashboard/clients/${contractId}/sectors?unitId=${unit.id}`}
                        onClick={(e) => e.stopPropagation()}
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
                  Ajuste seus filtros ou adicione uma nova unidade.
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

      <UnitDetailDialog
        unit={currentUnit}
        open={isDetailOpen}
        onOpenChange={closeDetailDialog}
        onUnitUpdate={handleUpdateUnit}
      />
    </>
  )
}
