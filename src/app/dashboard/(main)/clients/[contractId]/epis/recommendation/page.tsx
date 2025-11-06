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
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select'
import { Button } from '@/components/ui/button'
import { Label } from '@/components/ui/label'
import { RadioGroup, RadioGroupItem } from '@/components/ui/radio-group'
import { useToast } from '@/hooks/use-toast'
import { initialEpiData } from '../data'
import {
  initialHazardData,
  getHazardById,
} from '@/app/dashboard/(main)/clients/[contractId]/pgr/page'
import { initialInventory } from '../../pgr/page'
import { initialEmployeesData } from '../../employees/data'
import { initialSectorsData } from '../../sectors/data'
import { initialUnitsData } from '../../units/data'
import { Input } from '@/components/ui/input'

type AssociationType =
  | 'risk'
  | 'employee'
  | 'role'
  | 'sector'
  | 'unit'
  | 'ghe'

export default function RecommendationMatrixPage() {
  const { toast } = useToast()
  const [selectedEpi, setSelectedEpi] = useState('')
  const [associationType, setAssociationType] = useState<AssociationType>('risk')
  const [selectedAssociationValue, setSelectedAssociationValue] = useState('')

  const uniqueRoles = [
    ...new Set(initialEmployeesData.map((employee) => employee.role)),
  ]
  const inventoryRisks = initialInventory
    .map((inv) => getHazardById(inv.hazardId))
    .filter((h) => h !== undefined)

  const handleSubmit = (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault()
    if (!selectedEpi || !selectedAssociationValue) {
      toast({
        variant: 'destructive',
        title: 'Seleção Incompleta',
        description:
          'Por favor, selecione um EPI e um critério de associação.',
      })
      return
    }
    toast({
      title: 'Vínculo Criado!',
      description: `O EPI foi associado com sucesso.`,
    })
    console.log({
      epi: selectedEpi,
      type: associationType,
      value: selectedAssociationValue,
    })
  }

  const renderAssociationSelect = () => {
    switch (associationType) {
      case 'risk':
        return (
          <Select
            onValueChange={setSelectedAssociationValue}
            value={selectedAssociationValue}
            required
          >
            <SelectTrigger>
              <SelectValue placeholder='Selecione um risco do inventário' />
            </SelectTrigger>
            <SelectContent>
              {inventoryRisks.map(
                (risk) =>
                  risk && (
                    <SelectItem key={risk.id} value={risk.id}>
                      {risk.name} ({risk.category})
                    </SelectItem>
                  )
              )}
            </SelectContent>
          </Select>
        )
      case 'employee':
        return (
          <Select
            onValueChange={setSelectedAssociationValue}
            value={selectedAssociationValue}
            required
          >
            <SelectTrigger>
              <SelectValue placeholder='Selecione um colaborador' />
            </SelectTrigger>
            <SelectContent>
              {initialEmployeesData.map((employee) => (
                <SelectItem key={employee.id} value={employee.id}>
                  {employee.name}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        )
      case 'role':
        return (
          <Select
            onValueChange={setSelectedAssociationValue}
            value={selectedAssociationValue}
            required
          >
            <SelectTrigger>
              <SelectValue placeholder='Selecione um cargo' />
            </SelectTrigger>
            <SelectContent>
              {uniqueRoles.map((role) => (
                <SelectItem key={role} value={role}>
                  {role}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        )
      case 'sector':
        return (
          <Select
            onValueChange={setSelectedAssociationValue}
            value={selectedAssociationValue}
            required
          >
            <SelectTrigger>
              <SelectValue placeholder='Selecione um setor' />
            </SelectTrigger>
            <SelectContent>
              {initialSectorsData.map((sector) => (
                <SelectItem key={sector.id} value={sector.id}>
                  {sector.name}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        )
      case 'unit':
        return (
          <Select
            onValueChange={setSelectedAssociationValue}
            value={selectedAssociationValue}
            required
          >
            <SelectTrigger>
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
        )
      case 'ghe':
        return (
          <Input
            placeholder='Nome do GHE (Grupo Homogêneo de Exposição)'
            value={selectedAssociationValue}
            onChange={(e) => setSelectedAssociationValue(e.target.value)}
            required
          />
        )
      default:
        return null
    }
  }

  return (
    <div className='grid flex-1 auto-rows-max gap-4'>
      <Card>
        <CardHeader>
          <CardTitle>Matriz de Recomendação de EPIs</CardTitle>
          <CardDescription>
            Crie vínculos para determinar a obrigatoriedade e recomendação de
            uso dos Equipamentos de Proteção Individual.
          </CardDescription>
        </CardHeader>
        <CardContent>
          <form
            onSubmit={handleSubmit}
            className='grid grid-cols-1 md:grid-cols-2 gap-8'
          >
            {/* Coluna 1: Seleção de EPI */}
            <div className='space-y-4'>
              <h3 className='font-semibold'>Seção 01: Selecionar o EPI</h3>
              <div className='space-y-2'>
                <Label htmlFor='epi-select'>Equipamento de Proteção</Label>
                <Select onValueChange={setSelectedEpi} value={selectedEpi} required>
                  <SelectTrigger id='epi-select'>
                    <SelectValue placeholder='Selecione um EPI do catálogo' />
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

            {/* Coluna 2: Critérios de Associação */}
            <div className='space-y-4'>
              <h3 className='font-semibold'>
                Seção 02: Critérios de Associação
              </h3>
              <RadioGroup
                value={associationType}
                onValueChange={(value: any) => {
                  setAssociationType(value)
                  setSelectedAssociationValue('') // Reset on change
                }}
                className='grid grid-cols-2 lg:grid-cols-3 gap-4'
              >
                {[
                  { value: 'risk', label: 'Risco Específico' },
                  { value: 'employee', label: 'Colaborador' },
                  { value: 'role', label: 'Cargo' },
                  { value: 'sector', label: 'Setor' },
                  { value: 'unit', label: 'Unidade' },
                  { value: 'ghe', label: 'GHE' },
                ].map(({ value, label }) => (
                  <Label
                    key={value}
                    htmlFor={value}
                    className='flex flex-col items-center justify-between rounded-md border-2 border-muted bg-popover p-4 hover:bg-accent hover:text-accent-foreground [&:has([data-state=checked])]:border-primary'
                  >
                    <RadioGroupItem
                      value={value}
                      id={value}
                      className='sr-only'
                    />
                    <span>{label}</span>
                  </Label>
                ))}
              </RadioGroup>

              <div className='pt-4'>{renderAssociationSelect()}</div>
            </div>

            <div className='md:col-span-2 flex justify-end'>
              <Button type='submit'>Criar Vínculo</Button>
            </div>
          </form>
        </CardContent>
      </Card>
    </div>
  )
}
