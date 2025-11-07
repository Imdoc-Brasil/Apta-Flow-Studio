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
import {
  initialUnitsData,
  type Unit,
  UnitType,
  ContractingCompany,
} from './data'
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

export default function UnitsPage() {
  const params = useParams()
  const contractId = params.contractId as string
  const client = getClientById(contractId)

  const [units, setUnits] = useState(initialUnitsData)
  const [isAddDialogOpen, setIsAddDialogOpen] = useState(false)
  const [searchTerm, setSearchTerm] = useState('')
  const [statusFilter, setStatusFilter] = useState<string[]>(['Ativa'])
  const [formType, setFormType] = useState<UnitType>('Unidade')
  const [inheritData, setInheritData] = useState(false)

  const resetFormState = () => {
    setFormType('Unidade')
    setInheritData(false)
  }

  useEffect(() => {
    if (!isAddDialogOpen) {
      resetFormState()
    }
  }, [isAddDialogOpen])

  const handleAddUnit = (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault()
    const formData = new FormData(event.currentTarget)
    const unitType = formData.get('type') as UnitType

    const newUnit: Unit = {
      id: `UNIT-${Math.floor(Math.random() * 1000)
        .toString()
        .padStart(3, '0')}`,
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
      status: 'Ativa',
    }

    setUnits((prev) => [...prev, newUnit])
    setIsAddDialogOpen(false)
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
                        <Label htmlFor='name'>Nome</Label>
                        <Input id='name' name='name' required />
                      </div>
                      <div className='space-y-2'>
                        <Label htmlFor='description'>Descrição</Label>
                        <Textarea id='description' name='description' />
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
                              defaultValue={inheritData ? client?.cnpj : ''}
                            />
                          </div>
                          <div className='space-y-2'>
                            <Label htmlFor='cnae'>CNAE</Label>
                            <Input
                              id='cnae'
                              name='cnae'
                              defaultValue={inheritData ? client?.cnae : ''}
                            />
                          </div>
                          <div className='space-y-2'>
                            <Label htmlFor='riskLevel'>Grau de Risco</Label>
                            <Input
                              id='riskLevel'
                              name='riskLevel'
                              defaultValue={
                                inheritData ? client?.riskLevel : ''
                              }
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
                            Endereço Completo
                          </Label>
                          <Input
                            id='add-address'
                            name='add-address'
                            defaultValue={
                              inheritData ? client?.address : ''
                            }
                            required
                          />
                        </div>
                        <div className='grid grid-cols-1 md:grid-cols-2 gap-4'>
                          <div className='space-y-2'>
                            <Label htmlFor='add-zipCode'>CEP</Label>
                            <Input id='add-zipCode' name='add-zipCode' />
                          </div>
                          <div className='space-y-2'>
                            <Label htmlFor='add-neighborhood'>Bairro</Label>
                            <Input
                              id='add-neighborhood'
                              name='add-neighborhood'
                            />
                          </div>
                          <div className='space-y-2'>
                            <Label htmlFor='add-city'>Cidade</Label>
                            <Input id='add-city' name='add-city' />
                          </div>
                          <div className='space-y-2'>
                            <Label htmlFor='add-state'>Estado</Label>
                            <Input id='add-state' name='add-state' />
                          </div>
                          <div className='space-y-2'>
                            <Label htmlFor='add-country'>País</Label>
                            <Input
                              id='add-country'
                              name='add-country'
                              defaultValue='Brasil'
                            />
                          </div>
                          <div className='space-y-2'>
                            <Label htmlFor='add-totalArea'>Área Total</Label>
                            <Input id='add-totalArea' name='add-totalArea' />
                          </div>
                          <div className='space-y-2'>
                            <Label htmlFor='add-builtArea'>
                              Área Construída
                            </Label>
                            <Input id='add-builtArea' name='add-builtArea' />
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
                            />
                          </div>
                          <div className='space-y-2'>
                            <Label htmlFor='pgrResponsible'>
                              Responsável pelo PGR
                            </Label>
                            <Input
                              id='pgrResponsible'
                              name='pgrResponsible'
                            />
                          </div>
                          <div className='space-y-2'>
                            <Label htmlFor='ltcatResponsible'>
                              Responsável pelo LTCAT
                            </Label>
                            <Input
                              id='ltcatResponsible'
                              name='ltcatResponsible'
                            />
                          </div>
                          <div className='space-y-2'>
                            <Label htmlFor='pcmsoResponsible'>
                              Responsável pelo PCMSO
                            </Label>
                            <Input
                              id='pcmsoResponsible'
                              name='pcmsoResponsible'
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
                  <CardHeader>
                    <div className='flex justify-between items-start'>
                      <CardTitle>{unit.name}</CardTitle>
                      <Badge variant='outline'>{unit.type}</Badge>
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
                    <Button asChild className='w-full' variant='outline'>
                      <Link
                        href={`/dashboard/clients/${contractId}/units/${unit.id}`}
                      >
                        Gerenciar Unidade <ArrowRight className='ml-2 h-4 w-4' />
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
    </>
  )
}
