'use client'

import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { PlusCircle } from 'lucide-react'
import { useState } from 'react'
import { Label } from '@/components/ui/label'
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select'
import { initialEpiData } from '../inventory/page'
import { initialInventory as riskInventory } from '../../pgr/inventory/page'
import { initialGheData } from '../../ghe/page'
import { useRolesStore } from '../../roles/page'
import { initialSectorsData } from '../../sectors/page'
import { initialUnitsData } from '../../units/page'
import { initialEmployeesData } from '../../employees/page'
import { ScrollArea } from '@/components/ui/scroll-area'
import { Checkbox } from '@/components/ui/checkbox'

type AssociationType =
  | 'risk'
  | 'ghe'
  | 'unit'
  | 'sector'
  | 'role'
  | 'employee'
  | ''

const associationLabels: Record<Exclude<AssociationType, ''>, string> = {
  risk: 'Risco do Inventário',
  ghe: 'Grupo Homogêneo de Exposição (GHE)',
  unit: 'Unidade',
  sector: 'Setor',
  role: 'Cargo',
  employee: 'Colaborador Específico',
}

export default function RecommendationPage() {
  const [selectedEpi, setSelectedEpi] = useState('')
  const [associationType, setAssociationType] = useState<AssociationType>('')
  const [selectedAssociations, setSelectedAssociations] = useState<string[]>([])

  const { roles } = useRolesStore()

  const getDataSource = (type: AssociationType) => {
    switch (type) {
      case 'risk':
        return riskInventory.map((item) => ({ id: item.id, name: `${item.id} - ${item.risk}` }))
      case 'ghe':
        return initialGheData
      case 'unit':
        return initialUnitsData
      case 'sector':
        return initialSectorsData
      case 'role':
        return roles
      case 'employee':
        return initialEmployeesData
      default:
        return []
    }
  }

  const handleAssociationSelection = (id: string, checked: boolean) => {
    setSelectedAssociations((prev) =>
      checked ? [...prev, id] : prev.filter((item) => item !== id)
    )
  }

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    // Here you would typically save the created association
    console.log({
      epi: selectedEpi,
      type: associationType,
      associations: selectedAssociations,
    })
    // Reset form
    setSelectedEpi('')
    setAssociationType('')
    setSelectedAssociations([])
  }

  const associationData = getDataSource(associationType)

  return (
    <Card>
      <CardHeader>
        <CardTitle className='flex items-center justify-between'>
          Matriz de Recomendação de EPIs
        </CardTitle>
        <CardDescription>
          Vincule os EPIs do inventário aos riscos, GHEs, setores ou cargos
          específicos.
        </CardDescription>
      </CardHeader>
      <CardContent>
        <form onSubmit={handleSubmit} className='space-y-8'>
          <div className='grid gap-6 md:grid-cols-2'>
            <div className='space-y-4'>
              <h3 className='font-semibold text-lg'>1. Selecione o EPI</h3>
              <div className='space-y-2'>
                <Label htmlFor='epi-select'>Equipamento de Proteção Individual</Label>
                <Select value={selectedEpi} onValueChange={setSelectedEpi} required>
                  <SelectTrigger id='epi-select'>
                    <SelectValue placeholder='Selecione um EPI do inventário...' />
                  </SelectTrigger>
                  <SelectContent>
                    {initialEpiData.map((epi) => (
                      <SelectItem key={epi.id} value={epi.id}>
                        {epi.name} (CA: {epi.ca})
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
            </div>
            <div className='space-y-4'>
               <h3 className='font-semibold text-lg'>2. Selecione o Critério de Associação</h3>
                <div className='space-y-2'>
                    <Label htmlFor='association-type'>Associar EPI a um:</Label>
                    <Select value={associationType} onValueChange={(value) => {
                      setAssociationType(value as AssociationType)
                      setSelectedAssociations([]) // Reset selections when type changes
                    }} disabled={!selectedEpi}>
                      <SelectTrigger id='association-type'>
                        <SelectValue placeholder="Selecione o tipo de vínculo..." />
                      </SelectTrigger>
                      <SelectContent>
                        {Object.entries(associationLabels).map(([key, value]) => (
                            <SelectItem key={key} value={key}>{value}</SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                </div>
            </div>
          </div>
          
           {associationType && (
            <div className='space-y-4'>
                <h3 className='font-semibold text-lg'>3. Especifique a Associação</h3>
                <Label>Marque todos os itens aos quais o EPI se aplica:</Label>
                <ScrollArea className='h-60 w-full rounded-md border p-4'>
                    {associationData.map(item => (
                        <div key={item.id} className='flex items-center space-x-2 mb-2'>
                            <Checkbox 
                                id={`assoc-${item.id}`} 
                                onCheckedChange={(checked) => handleAssociationSelection(item.id, !!checked)}
                                checked={selectedAssociations.includes(item.id)}
                            />
                            <Label htmlFor={`assoc-${item.id}`} className='font-normal'>{item.name}</Label>
                        </div>
                    ))}
                </ScrollArea>
            </div>
          )}


          <div className='flex justify-end'>
            <Button type='submit' disabled={!selectedEpi || !associationType || selectedAssociations.length === 0}>
              <PlusCircle className='mr-2 h-4 w-4' />
              Salvar Vinculação
            </Button>
          </div>
        </form>
      </CardContent>
    </Card>
  )
}
