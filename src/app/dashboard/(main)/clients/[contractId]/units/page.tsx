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

export const initialUnitsData = [
  {
    id: 'UNIT-001',
    name: 'Matriz São Paulo',
    description: 'Sede administrativa e operações centrais.',
    cnpj: '12.345.678/0001-99',
    address: '123 Tech Avenue, Silicon Valley, CA',
    status: 'Ativa',
    cnae: '62.01-5-01',
    riskLevel: '3',
    legalResponsible: 'Dr. Ricardo Mendes',
    pgrResponsible: 'Eng. Ana Beatriz',
    ltcatResponsible: 'Eng. Ana Beatriz',
    pcmsoResponsible: 'Dr. Carlos Alberto',
  },
  {
    id: 'UNIT-002',
    name: 'Filial Rio de Janeiro',
    description: 'Foco em vendas e suporte ao cliente regional.',
    cnpj: '12.345.678/0002-88',
    address: '456 Ocean Drive, Rio de Janeiro, RJ',
    status: 'Ativa',
    cnae: '62.01-5-01',
    riskLevel: '3',
    legalResponsible: 'Dr. Ricardo Mendes',
    pgrResponsible: 'Eng. Carlos Silva',
    ltcatResponsible: 'Eng. Carlos Silva',
    pcmsoResponsible: 'Dra. Fernanda Costa',
  },
]

type Unit = (typeof initialUnitsData)[0]

const getClientById = (contractId: string) => {
  return initialClientsData.find((client) => client.contractId === contractId)
}

export default function UnitsPage() {
  const params = useParams()
  const contractId = params.contractId as string
  const client = getClientById(contractId)

  const [units, setUnits] = useState(initialUnitsData)
  const [isDialogOpen, setIsDialogOpen] = useState(false)
  const [inheritData, setInheritData] = useState(false)
  const [searchTerm, setSearchTerm] = useState('')
  const [statusFilter, setStatusFilter] = useState<string[]>(['Ativa'])

  // Form state
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

  useEffect(() => {
    if (client) {
      if (inheritData) {
        setFormState((prev) => ({
          ...prev,
          name: client.name,
          cnpj: client.cnpj,
          address: client.address,
          cnae: client.cnae,
          riskLevel: client.riskLevel,
        }))
      } else {
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
      }
    }
  }, [inheritData, client])

  const handleInputChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>
  ) => {
    const { name, value } = e.target
    setFormState((prev) => ({ ...prev, [name]: value }))
  }

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
    setIsDialogOpen(false)
    setInheritData(false) // Reset checkbox
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
    <Card>
      <CardHeader>
        <CardTitle className='flex items-center justify-between'>
          Mapa de Unidades
          <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
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
                        onCheckedChange={(checked) =>
                          setInheritData(checked as boolean)
                        }
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
                        onChange={handleInputChange}
                        required
                      />
                    </div>
                    <div className='space-y-2'>
                      <Label htmlFor='description'>Descrição</Label>
                      <Textarea
                        id='description'
                        name='description'
                        value={formState.description}
                        onChange={handleInputChange}
                      />
                    </div>

                    <div className='grid grid-cols-1 md:grid-cols-2 gap-4'>
                      <div className='space-y-2'>
                        <Label htmlFor='cnpj'>CNPJ</Label>
                        <Input
                          id='cnpj'
                          name='cnpj'
                          value={formState.cnpj}
                          onChange={handleInputChange}
                        />
                      </div>
                      <div className='space-y-2'>
                        <Label htmlFor='address'>Endereço</Label>
                        <Input
                          id='address'
                          name='address'
                          value={formState.address}
                          onChange={handleInputChange}
                          required
                        />
                      </div>
                      <div className='space-y-2'>
                        <Label htmlFor='cnae'>CNAE</Label>
                        <Input
                          id='cnae'
                          name='cnae'
                          value={formState.cnae}
                          onChange={handleInputChange}
                        />
                      </div>
                      <div className='space-y-2'>
                        <Label htmlFor='riskLevel'>Grau de Risco</Label>
                        <Input
                          id='riskLevel'
                          name='riskLevel'
                          value={formState.riskLevel}
                          onChange={handleInputChange}
                        />
                      </div>
                    </div>

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
                            onChange={handleInputChange}
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
                            onChange={handleInputChange}
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
                            onChange={handleInputChange}
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
                            onChange={handleInputChange}
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
                  onClick={() => setIsDialogOpen(false)}
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
              <Card key={unit.id} className='flex flex-col'>
                <CardHeader>
                  <CardTitle>{unit.name}</CardTitle>
                  <CardDescription>{unit.address}</CardDescription>
                </CardHeader>
                <CardContent className='flex-grow'>
                  <p className='text-sm text-muted-foreground'>
                    {unit.description}
                  </p>
                </CardContent>
                <CardFooter>
                  <Button asChild className='w-full'>
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
                Ajuste seus filtros ou adicione uma nova unidade.
              </p>
              <Button className='mt-4' onClick={() => setIsDialogOpen(true)}>
                Adicionar Unidade
              </Button>
            </div>
          </div>
        )}
      </CardContent>
    </Card>
  )
}
