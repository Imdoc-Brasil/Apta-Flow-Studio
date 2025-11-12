
'use client'

import { useState, useMemo, useEffect } from 'react'
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
import { type PgrInventoryItem } from '@/app/dashboard/(main)/clients/[contractId]/pgr/page'
import { ChevronsRight, Loader2 } from 'lucide-react'
import {
  useFirestore,
  addDocumentNonBlocking,
  useCollection,
  useMemoFirebase,
} from '@/firebase'
import { collection, doc, getDocs } from 'firebase/firestore'
import { useParams } from 'next/navigation'
import type { Epi } from '@/app/dashboard/(main)/risks/page'
import type { Hazard } from '@/app/dashboard/(main)/risks/page'
import type { Employee } from '../../employees/data'
import type { Role } from '../../roles/data'
import type { Sector } from '../../sectors/data'
import type { Unit } from '../../units/data'
import type { GHE } from '../../ghe/data'
import type { Environment } from '../../environments/data'

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

  // Firestore Refs
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
  const hazardsRef = useMemoFirebase(
    () => (firestore ? collection(firestore, 'hazards') : null),
    [firestore]
  )
  const employeesRef = useMemoFirebase(
    () =>
      firestore
        ? collection(firestore, `clients/${contractId}/staffs`)
        : null,
    [firestore, contractId]
  )
  const rolesRef = useMemoFirebase(
    () =>
      firestore ? collection(firestore, `clients/${contractId}/roles`) : null,
    [firestore, contractId]
  )
  const unitsRef = useMemoFirebase(
    () =>
      firestore ? collection(firestore, `clients/${contractId}/units`) : null,
    [firestore, contractId]
  )
  const ghesRef = useMemoFirebase(
    () => (firestore ? collection(firestore, `clients/${contractId}/ghes`) : null),
    [firestore, contractId]
  )
  
  // Data from Firestore
  const { data: inventory, isLoading: isLoadingInventory } =
    useCollection<PgrInventoryItem>(pgrInventoryRef)
  const { data: epiData, isLoading: isLoadingEpis } =
    useCollection<Epi>(epiCatalogRef)
  const { data: hazardData, isLoading: isLoadingHazards } =
    useCollection<Hazard>(hazardsRef)
  const { data: employees, isLoading: isLoadingEmployees } =
    useCollection<Employee>(employeesRef)
  const { data: roles, isLoading: isLoadingRoles } = useCollection<Role>(rolesRef)
  const { data: units, isLoading: isLoadingUnits } = useCollection<Unit>(unitsRef)
  const { data: ghes, isLoading: isLoadingGhes } = useCollection<GHE>(ghesRef)
  
  const [sectors, setSectors] = useState<Sector[]>([])
  const [environments, setEnvironments] = useState<Environment[]>([])
  const [isLoadingSub, setIsLoadingSub] = useState(true);


  const getHazardById = (id: string) => hazardData?.find((h) => h.id === id)

  const [selectedUnit, setSelectedUnit] = useState('')
  const [selectedEpi, setSelectedEpi] = useState('')
  const [associationType, setAssociationType] =
    useState<AssociationType>('risk')
  const [selectedAssociationValue, setSelectedAssociationValue] = useState('')

  const uniqueRoles = useMemo(() => {
    if (!roles) return [];
    return [...new Map(roles.map(item => [item['name'], item])).values()];
  }, [roles])

  const inventoryRisks = useMemo(() => {
    if (!inventory) return []
    const riskIdsInUnit = inventory
      .filter((inv) => inv.unitId === selectedUnit)
      .map((inv) => inv.hazardId)
    const uniqueRiskIds = [...new Set(riskIdsInUnit)]
    return uniqueRiskIds
      .map((id) => getHazardById(id))
      .filter((h): h is Hazard => h !== undefined)
  }, [inventory, selectedUnit, hazardData])
  
   useEffect(() => {
    if (selectedUnit && firestore) {
      setIsLoadingSub(true);
      const fetchSubCollections = async () => {
        try {
          const sectorsQuery = collection(firestore, `clients/${contractId}/units/${selectedUnit}/sectors`);
          const sectorsSnapshot = await getDocs(sectorsQuery);
          const sectorsData = sectorsSnapshot.docs.map(doc => ({ id: doc.id, ...doc.data() } as Sector));
          setSectors(sectorsData);
          
          const envsData: Environment[] = [];
          for (const sector of sectorsData) {
            const envsQuery = collection(firestore, `clients/${contractId}/units/${selectedUnit}/sectors/${sector.id}/environments`);
            const envsSnapshot = await getDocs(envsQuery);
            envsSnapshot.forEach(doc => {
                envsData.push({ id: doc.id, ...doc.data()} as Environment);
            })
          }
          setEnvironments(envsData);
        } catch (error) {
          console.error("Error fetching sub-collections for recommendations: ", error);
        } finally {
          setIsLoadingSub(false);
        }
      }
      fetchSubCollections();
    } else {
        setSectors([]);
        setEnvironments([]);
        if(selectedUnit) setIsLoadingSub(false);
    }
  }, [selectedUnit, firestore, contractId])
  
  
  const unitSectors = useMemo(() => sectors.filter(s => s.unitId === selectedUnit), [sectors, selectedUnit])
  const unitEnvironments = useMemo(() => {
     const unitSectorIds = unitSectors.map(s => s.id);
     return environments.filter(e => unitSectorIds.includes(e.sectorId));
  }, [unitSectors, environments])


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
            disabled={isLoadingInventory || isLoadingHazards}
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
            disabled={isLoadingEmployees}
          >
            <SelectTrigger>
              <SelectValue placeholder='Selecione um colaborador' />
            </SelectTrigger>
            <SelectContent>
              {employees?.map((employee) => (
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
            disabled={isLoadingRoles}
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
            disabled={isLoadingSub}
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
            disabled={isLoadingSub}
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
            disabled={isLoadingGhes}
          >
            <SelectTrigger>
              <SelectValue placeholder='Selecione um GHE da unidade' />
            </SelectTrigger>
            <SelectContent>
              {ghes
                ?.filter((g) => g.unitId === selectedUnit)
                .map((ghe) => (
                  <SelectItem key={ghe.id!} value={ghe.id!}>
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

  const isLoading = isLoadingInventory || isLoadingEpis || isLoadingHazards || isLoadingUnits || isLoadingEmployees || isLoadingRoles || isLoadingGhes || (!!selectedUnit && isLoadingSub);

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
            <Select onValueChange={setSelectedUnit} value={selectedUnit} disabled={isLoadingUnits}>
              <SelectTrigger id='unit-select'>
                <SelectValue placeholder='Selecione a unidade para configurar as regras' />
              </SelectTrigger>
              <SelectContent>
                {units?.map((unit) => (
                  <SelectItem key={unit.id!} value={unit.id!}>
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
                {isLoading ? (
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
              <Button type='submit' disabled={!selectedUnit || isLoading}>
                Criar Vínculo / Regra
              </Button>
            </div>
          </form>
        </CardContent>
      </Card>
    </div>
  )
}
