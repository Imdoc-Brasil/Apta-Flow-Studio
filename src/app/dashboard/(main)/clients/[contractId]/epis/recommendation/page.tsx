
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
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select'
import { Button } from '@/components/ui/button'
import { Label } from '@/components/ui/label'
import { useToast } from '@/hooks/use-toast'
import { initialEpiData } from '../data'
import {
  getHazardById,
  type PgrInventoryItem,
} from '@/app/dashboard/(main)/clients/[contractId]/pgr/page'
import { initialEmployeesData } from '../../employees/data'
import { initialRolesData } from '../../roles/data'
import { initialSectorsData } from '../../sectors/data'
import { initialUnitsData } from '../../units/data'
import { initialGheData } from '../../ghe/data'
import { initialEnvironmentsData } from '../../environments/data'
import { ChevronsRight, Loader2 } from 'lucide-react'
import {
  useFirestore,
  addDocumentNonBlocking,
  useCollection,
  useMemoFirebase,
} from '@/firebase'
import { collection } from 'firebase/firestore'
import { useParams } from 'next/navigation'
import type { Epi } from '../data'

type AssociationType =
  | 'risk'
  | 'employee'
  | 'role'
  | 'sector'
  | 'unit'
  | 'ghe'
  | 'environment'

export default function RecommendationMatrixPage() {
  const { toast } = useToast()
  const params = useParams()
  const contractId = params.contractId as string

  const firestore = useFirestore()

  const pgrInventoryRef = useMemoFirebase(
    () =>
      firestore
        ? collection(firestore, `clients/${contractId}/pgr_inventory`)
        : null,
    [firestore, contractId]
  )
  const epiCatalogRef = useMemoFirebase(
    () => (firestore ? collection(firestore, 'epis') : null),
    [firestore]
  )
  const recommendationsRef = useMemoFirebase(
    () =>
      firestore
        ? collection(firestore, `clients/${contractId}/epi_recommendations`)
        : null,
    [firestore, contractId]
  )

  const { data: inventory, isLoading: isLoadingInventory } =
    useCollection<PgrInventoryItem>(pgrInventoryRef)
  const { data: epiData, isLoading: isLoadingEpis } =
    useCollection<Epi>(epiCatalogRef)

  const [selectedUnit, setSelectedUnit] = useState('')
  const [selectedEpi, setSelectedEpi] = useState('')
  const [associationType, setAssociationType] =
    useState<AssociationType>('risk')
  const [selectedAssociationValue, setSelectedAssociationValue] = useState('')

  const uniqueRoles = [
    ...new Set(initialEmployeesData.map((employee) => employee.roleId)),
  ]
    .map((roleId) => initialRolesData.find((r) => r.id === roleId))
    .filter(Boolean)

  const inventoryRisks = useMemo(() => {
    if (!inventory) return []
    return inventory
      .filter((inv) => inv.unitId === selectedUnit)
      .map((inv) => getHazardById(inv.hazardId))
      .filter((h) => h !== undefined)
  }, [inventory, selectedUnit])

  const unitSectors = initialSectorsData.filter(
    (s) => s.unitId === selectedUnit
  )
  const unitSectorIds = unitSectors.map((s) => s.id)
  const unitEnvironments = initialEnvironmentsData.filter((env) =>
    unitSectorIds.includes(env.sectorId)
  )

  const handleSubmit = (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault()
    if (
      !selectedUnit ||
      !selectedEpi ||
      !selectedAssociationValue ||
      !recommendationsRef
    ) {
      toast({
        variant: 'destructive',
        title: 'Seleção Incompleta',
        description:
          'Por favor, preencha todos os campos para criar o vínculo.',
      })
      return
    }

    const newRecommendation = {
      unitId: selectedUnit,
      epiId: selectedEpi,
      associationType: associationType,
      associationValue: selectedAssociationValue,
      createdAt: new Date().toISOString(),
    }

    addDocumentNonBlocking(recommendationsRef, newRecommendation)

    toast({
      title: 'Vínculo Criado com Sucesso!',
      description: `Regra de recomendação para o EPI foi salva.`,
    })
    // Reset form after submission
    setSelectedEpi('')
    setSelectedAssociationValue('')
  }

  const renderAssociationSelect = () => {
    switch (associationType) {
      case 'risk':
        return (
          <Select
            onValueChange={setSelectedAssociationValue}
            value={selectedAssociationValue}
            required
            disabled={isLoadingInventory}
          >
            <SelectTrigger>
              <SelectValue placeholder='Selecione um risco do inventário da unidade' />
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
                <SelectItem key={role!.id} value={role!.id}>
                  {role!.name}
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
              <SelectValue placeholder='Selecione um setor da unidade' />
            </SelectTrigger>
            <SelectContent>
              {unitSectors.map((sector) => (
                <SelectItem key={sector.id} value={sector.id}>
                  {sector.name}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        )
      case 'environment':
        return (
          <Select
            onValueChange={setSelectedAssociationValue}
            value={selectedAssociationValue}
            required
          >
            <SelectTrigger>
              <SelectValue placeholder='Selecione um posto de trabalho da unidade' />
            </SelectTrigger>
            <SelectContent>
              {unitEnvironments.map((env) => (
                <SelectItem key={env.id} value={env.id}>
                  {env.name}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        )
      case 'ghe':
        return (
          <Select
            onValueChange={setSelectedAssociationValue}
            value={selectedAssociationValue}
            required
          >
            <SelectTrigger>
              <SelectValue placeholder='Selecione um GHE da unidade' />
            </SelectTrigger>
            <SelectContent>
              {initialGheData
                .filter((g) => g.unitId === selectedUnit)
                .map((ghe) => (
                  <SelectItem key={ghe.id} value={ghe.id}>
                    {ghe.name}
                  </SelectItem>
                ))}
            </SelectContent>
          </Select>
        )
      default:
        return null
    }
  }

  const associationOptions = [
    { value: 'risk', label: 'Risco Específico' },
    { value: 'role', label: 'Cargo' },
    { value: 'sector', label: 'Setor' },
    { value: 'environment', label: 'Posto de Trabalho' },
    { value: 'ghe', label: 'GHE' },
    { value: 'employee', label: 'Colaborador Específico' },
  ]

  return (
    <div className='grid flex-1 auto-rows-max gap-4'>
      <Card>
        <CardHeader>
          <CardTitle>Construtor de Regras de Recomendação de EPIs</CardTitle>
          <CardDescription>
            Crie regras para determinar a obrigatoriedade de uso dos EPIs com
            base em critérios específicos da unidade.
          </CardDescription>
        </CardHeader>
        <CardContent className='space-y-8'>
          {/* Etapa 1: Seleção da Unidade */}
          <div className='space-y-4 p-4 border rounded-lg bg-muted/20'>
            <Label htmlFor='unit-select' className='text-lg font-semibold'>
              Passo 1: Selecione a Unidade
            </Label>
            <Select onValueChange={setSelectedUnit} value={selectedUnit}>
              <SelectTrigger id='unit-select'>
                <SelectValue placeholder='Selecione a unidade para configurar as regras' />
              </SelectTrigger>
              <SelectContent>
                {initialUnitsData.map((unit) => (
                  <SelectItem key={unit.id} value={unit.id}>
                    {unit.name}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>

          {/* Etapa 2: Criação da Regra */}
          <form
            onSubmit={handleSubmit}
            className={`space-y-6 p-4 border rounded-lg transition-opacity ${
              !selectedUnit ? 'opacity-50 pointer-events-none' : 'opacity-100'
            }`}
          >
            <div className='flex items-center gap-4'>
              <div className='flex-1 space-y-2'>
                <Label className='font-semibold'>SE (Critério)</Label>
                <Select
                  onValueChange={(v) => {
                    setAssociationType(v as AssociationType)
                    setSelectedAssociationValue('') // Reset value on type change
                  }}
                  value={associationType}
                >
                  <SelectTrigger>
                    <SelectValue placeholder='Selecione o tipo de critério' />
                  </SelectTrigger>
                  <SelectContent>
                    {associationOptions.map((opt) => (
                      <SelectItem key={opt.value} value={opt.value}>
                        {opt.label}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
                <div className='pt-2'>{renderAssociationSelect()}</div>
              </div>

              <div className='flex items-center justify-center px-4'>
                {isLoadingInventory || isLoadingEpis ? (
                  <Loader2 className='h-8 w-8 animate-spin' />
                ) : (
                  <ChevronsRight className='h-8 w-8 text-muted-foreground' />
                )}
              </div>

              <div className='flex-1 space-y-2'>
                <Label className='font-semibold'>ENTÃO (Ação)</Label>
                <Select
                  onValueChange={setSelectedEpi}
                  value={selectedEpi}
                  required
                  disabled={isLoadingEpis}
                >
                  <SelectTrigger>
                    <SelectValue placeholder='Selecione o EPI a ser recomendado' />
                  </SelectTrigger>
                  <SelectContent>
                    {epiData?.map((epi) => (
                      <SelectItem key={epi.id} value={epi.id}>
                        {epi.name} (CA: {epi.ca})
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
            </div>

            <div className='flex justify-end pt-4'>
              <Button type='submit' disabled={!selectedUnit || isLoadingEpis || isLoadingInventory}>
                Criar Vínculo / Regra
              </Button>
            </div>
          </form>
        </CardContent>
      </Card>
    </div>
  )
}
