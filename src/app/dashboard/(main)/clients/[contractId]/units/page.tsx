
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
import { initialUnitsData, type Unit } from './data'

const getClientById = (contractId: string) => {
  return initialClientsData.find((client) => client.contractId === contractId)
}

export default function UnitsPage() {
  const params = useParams()
  const contractId = params.contractId as string
  const client = getClientById(contractId)

  const [units, setUnits] = useState(initialUnitsData)
  const [isAddDialogOpen, setIsAddDialogOpen] = useState(false)
  const [isDetailOpen, setIsDetailOpen] = useState(false)
  const [isEditing, setIsEditing] = useState(false)
  const [currentUnit, setCurrentUnit] = useState<Unit | null>(null)
  const [inheritData, setInheritData] = useState(false)
  const [searchTerm, setSearchTerm] = useState('')
  const [statusFilter, setStatusFilter] = useState<string[]>(['Ativa'])

  const [formState, setFormState] = useState<Omit<Unit, 'id' | 'status'>>({
    name: '',
    description: '',
    cnpj: '',
    address: '',
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
      description: '',
      cnpj: '',
      address: '',
      cnae: '',
      riskLevel: '',
      legalResponsible: '',
      pgrResponsible: '',
      ltcatResponsible: '',
      pcmsoResponsible: '',
    })
    setInheritData(false)
  }

  // Load data into form when opening Add Dialog
  useEffect(() => {
    if (isAddDialogOpen) {
      if (client && inheritData) {
        setFormState((prev) => ({
          ...prev,
          name: '', // Don't inherit name
          cnpj: client.cnpj,
          address: client.address,
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

  const handleUpdateUnit = (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault()
    if (!currentUnit) return
    const formData = new FormData(event.currentTarget);
    const updatedData = {
      name: formData.get('name') as string,
      description: formData.get('description') as string,
      cnpj: formData.get('cnpj') as string,
      address: formData.get('address') as string,
      cnae: formData.get('cnae') as string,
      riskLevel: formData.get('riskLevel') as string,
      legalResponsible: formData.get('legalResponsible') as string,
      pgrResponsible: formData.get('pgrResponsible') as string,
      ltcatResponsible: formData.get('ltcatResponsible') as string,
      pcmsoResponsible: formData.get('pcmsoResponsible') as string,
    }

    setUnits((prev) =>
      prev.map((u) => (u.id === currentUnit.id ? { ...u, ...updatedData } : u))
    )
    setIsEditing(false)
    // We need to update currentUnit as well to see the changes immediately
    setCurrentUnit(prev => prev ? { ...prev, ...updatedData } : null)
  }

  const openDetailDialog = (unit: Unit) => {
    setCurrentUnit(unit)
    setIsDetailOpen(true)
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

  const renderUnitForm = (
    unit: Unit | null,
    isEditing: boolean,
  ) => (
    <ScrollArea className='h-[60vh] pr-6'>
      <div className='grid gap-4 py-4'>
        <div className='space-y-2'>
          <Label htmlFor='name'>Nome</Label>
          <Input
            id='name'
            name='name'
            defaultValue={unit?.name}
            readOnly={!isEditing}
            required
          />
        </div>
        <div className='space-y-2'>
          <Label htmlFor='description'>Descrição</Label>
          <Textarea
            id='description'
            name='description'
            defaultValue={unit?.description}
            readOnly={!isEditing}
          />
        </div>

        <div className='grid grid-cols-1 md:grid-cols-2 gap-4'>
          <div className='space-y-2'>
            <Label htmlFor='cnpj'>CNPJ</Label>
            <Input
              id='cnpj'
              name='cnpj'
              defaultValue={unit?.cnpj}
              readOnly={!isEditing}
            />
          </div>
          <div className='space-y-2'>
            <Label htmlFor='address'>Endereço</Label>
            <Input
              id='address'
              name='address'
              defaultValue={unit?.address}
              readOnly={!isEditing}
              required
            />
          </div>
          <div className='space-y-2'>
            <Label htmlFor='cnae'>CNAE</Label>
            <Input
              id='cnae'
              name='cnae'
              defaultValue={unit?.cnae}
              readOnly={!isEditing}
            />
          </div>
          <div className='space-y-2'>
            <Label htmlFor='riskLevel'>Grau de Risco</Label>
            <Input
              id='riskLevel'
              name='riskLevel'
              defaultValue={unit?.riskLevel}
              readOnly={!isEditing}
            />
          </div>
        </div>

        <div className='space-y-4 pt-4 border-t'>
          <h3 className='font-medium text-lg'>Responsáveis</h3>
          <div className='grid grid-cols-1 md:grid-cols-2 gap-4'>
            <div className='space-y-2'>
              <Label htmlFor='legalResponsible'>Responsável Legal</Label>
              <Input
                id='legalResponsible'
                name='legalResponsible'
                defaultValue={unit?.legalResponsible}
                readOnly={!isEditing}
              />
            </div>
            <div className='space-y-2'>
              <Label htmlFor='pgrResponsible'>Responsável pelo PGR</Label>
              <Input
                id='pgrResponsible'
                name='pgrResponsible'
                defaultValue={unit?.pgrResponsible}
                readOnly={!isEditing}
              />
            </div>
            <div className='space-y-2'>
              <Label htmlFor='ltcatResponsible'>Responsável pelo LTCAT</Label>
              <Input
                id='ltcatResponsible'
                name='ltcatResponsible'
                defaultValue={unit?.ltcatResponsible}
                readOnly={!isEditing}
              />
            </div>
            <div className='space-y-2'>
              <Label htmlFor='pcmsoResponsible'>Responsável pelo PCMSO</Label>
              <Input
                id='pcmsoResponsible'
                name='pcmsoResponsible'
                defaultValue={unit?.pcmsoResponsible}
                readOnly={!isEditing}
              />
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
                    Adicionar Unidade
                  </span>
                </Button>
              </DialogTrigger>
              <DialogContent className='sm:max-w-2xl'>
                <DialogHeader>
                  <DialogTitle>Adicionar Nova Unidade</DialogTitle>
                  <DialogDescription>
                    Preencha os detalhes da nova unidade ou local de trabalho.
                  </DialogDescription>
                </DialogHeader>
                <form id='add-unit-form' onSubmit={handleAddUnit}>
                   <ScrollArea className='h-[60vh] pr-6'>
                    <div className='grid gap-4 py-4'>
                        <div className='flex items-center space-x-2 mb-4'>
                            <Checkbox
                            id='inherit'
                            checked={inheritData}
                            onCheckedChange={(checked) => setInheritData(checked as boolean)}
                            />
                            <Label htmlFor='inherit' className='cursor-pointer'>
                            Herdar dados da empresa principal
                            </Label>
                        </div>

                        <div className='space-y-2'>
                            <Label htmlFor='name'>Nome</Label>
                            <Input
                                id='name'
                                name='name'
                                value={formState.name}
                                onChange={(e) => setFormState(prev => ({...prev, name: e.target.value}))}
                                required
                            />
                        </div>
                        <div className='space-y-2'>
                            <Label htmlFor='description'>Descrição</Label>
                            <Textarea
                                id='description'
                                name='description'
                                value={formState.description}
                                onChange={(e) => setFormState(prev => ({...prev, description: e.target.value}))}
                            />
                        </div>

                        <div className='grid grid-cols-1 md:grid-cols-2 gap-4'>
                          <div className='space-y-2'>
                              <Label htmlFor='cnpj'>CNPJ</Label>
                              <Input
                              id='cnpj'
                              name='cnpj'
                              value={formState.cnpj}
                              onChange={(e) => setFormState(prev => ({...prev, cnpj: e.target.value}))}
                              />
                          </div>
                          <div className='space-y-2'>
                              <Label htmlFor='address'>Endereço</Label>
                              <Input
                              id='address'
                              name='address'
                              value={formState.address}
                              onChange={(e) => setFormState(prev => ({...prev, address: e.target.value}))}
                              required
                              />
                          </div>
                          <div className='space-y-2'>
                              <Label htmlFor='cnae'>CNAE</Label>
                              <Input
                              id='cnae'
                              name='cnae'
                              value={formState.cnae}
                              onChange={(e) => setFormState(prev => ({...prev, cnae: e.target.value}))}
                              />
                          </div>
                          <div className='space-y-2'>
                              <Label htmlFor='riskLevel'>Grau de Risco</Label>
                              <Input
                              id='riskLevel'
                              name='riskLevel'
                              value={formState.riskLevel}
                              onChange={(e) => setFormState(prev => ({...prev, riskLevel: e.target.value}))}
                              />
                          </div>
                        </div>

                        <div className='space-y-4 pt-4 border-t'>
                          <h3 className='font-medium text-lg'>Responsáveis</h3>
                          <div className='grid grid-cols-1 md:grid-cols-2 gap-4'>
                              <div className='space-y-2'>
                                  <Label htmlFor='legalResponsible'>Responsável Legal</Label>
                                  <Input
                                  id='legalResponsible'
                                  name='legalResponsible'
                                  value={formState.legalResponsible}
                                  onChange={(e) => setFormState(prev => ({...prev, legalResponsible: e.target.value}))}
                                  />
                              </div>
                              <div className='space-y-2'>
                                  <Label htmlFor='pgrResponsible'>Responsável pelo PGR</Label>
                                  <Input
                                  id='pgrResponsible'
                                  name='pgrResponsible'
                                  value={formState.pgrResponsible}
                                  onChange={(e) => setFormState(prev => ({...prev, pgrResponsible: e.target.value}))}
                                  />
                              </div>
                              <div className='space-y-2'>
                                  <Label htmlFor='ltcatResponsible'>Responsável pelo LTCAT</Label>
                                  <Input
                                  id='ltcatResponsible'
                                  name='ltcatResponsible'
                                  value={formState.ltcatResponsible}
                                  onChange={(e) => setFormState(prev => ({...prev, ltcatResponsible: e.target.value}))}
                                  />
                              </div>
                              <div className='space-y-2'>
                                  <Label htmlFor='pcmsoResponsible'>Responsável pelo PCMSO</Label>
                                  <Input
                                  id='pcmsoResponsible'
                                  name='pcmsoResponsible'
                                  value={formState.pcmsoResponsible}
                                  onChange={(e) => setFormState(prev => ({...prev, pcmsoResponsible: e.target.value}))}
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
                      <CardTitle>{unit.name}</CardTitle>
                      <CardDescription>{unit.address}</CardDescription>
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

      {/* Detail/Edit Dialog */}
      <Dialog
        open={isDetailOpen}
        onOpenChange={(isOpen) => {
          if (!isOpen) {
            setIsDetailOpen(false)
            setIsEditing(false)
            setCurrentUnit(null)
          } else {
            setIsDetailOpen(true)
          }
        }}
      >
        <DialogContent className='sm:max-w-2xl'>
          <DialogHeader>
            <DialogTitle>
              {isEditing ? 'Editar' : 'Detalhes da'} Unidade
            </DialogTitle>
            <DialogDescription>
              {isEditing
                ? 'Atualize os detalhes da unidade.'
                : 'Visualize os detalhes da unidade.'}
            </DialogDescription>
          </DialogHeader>
          <form
            id={`update-unit-form-${currentUnit?.id}`}
            onSubmit={handleUpdateUnit}
          >
            {renderUnitForm(currentUnit, isEditing)}
          </form>
          <DialogFooter>
            {isEditing ? (
              <>
                <Button variant='outline' onClick={() => setIsEditing(false)}>
                  Cancelar
                </Button>
                <Button
                  type='submit'
                  form={`update-unit-form-${currentUnit?.id}`}
                >
                  Salvar Alterações
                </Button>
              </>
            ) : (
              <>
                <Button
                  variant='outline'
                  onClick={() => setIsDetailOpen(false)}
                >
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
    </>
  )
}
