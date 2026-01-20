'use client'

import { useState, useMemo, useEffect } from 'react'
import { MoreHorizontal, PlusCircle, Search, Filter } from 'lucide-react'
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from '@/components/ui/card'
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table'
import { Button } from '@/components/ui/button'
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Textarea } from '@/components/ui/textarea'
import { type Environment } from './data'
import { type Sector } from '../sectors/data'
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select'
import { useToast } from '@/hooks/use-toast'
import { useSearchParams, useParams } from 'next/navigation'
import { ScrollArea } from '@/components/ui/scroll-area'
import {
  useFirestore,
  useCollection,
  useMemoFirebase,
  addDocumentNonBlocking,
  updateDocumentNonBlocking,
} from '@/firebase'
import { collection, doc, getDocs } from 'firebase/firestore'
import { Loader2 } from 'lucide-react'
import type { Unit } from '../units/data'
import { DialogFooter } from '@/components/ui/dialog'
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
  DropdownMenuCheckboxItem,
} from '@/components/ui/dropdown-menu'

export default function EnvironmentsPage() {
  const params = useParams()
  const contractId = params.contractId as string
  const searchParams = useSearchParams()
  const urlSectorId = searchParams.get('sectorId')
  const urlUnitId = searchParams.get('unitId')

  const [isFormDialogOpen, setIsFormDialogOpen] = useState(false)
  const [editingEnvironment, setEditingEnvironment] =
    useState<Environment | null>(null)
  const [searchTerm, setSearchTerm] = useState('')
  const [selectedUnit, setSelectedUnit] = useState<string>(urlUnitId || '')
  const [statusFilter, setStatusFilter] = useState<string[]>(['Ativo'])
  const [sectorFilter, setSectorFilter] = useState<string>(urlSectorId || '')
  const { toast } = useToast()

  const firestore = useFirestore()

  const unitsRef = useMemoFirebase(
    () =>
      firestore ? collection(firestore, `clients/${contractId}/units`) : null,
    [firestore, contractId]
  )
  const { data: unitsData, isLoading: areUnitsLoading } =
    useCollection<Unit>(unitsRef)

  const [allSectors, setAllSectors] = useState<Sector[]>([])
  const [areSectorsLoading, setAreSectorsLoading] = useState(true)

  useEffect(() => {
    if (unitsData && firestore) {
      setAreSectorsLoading(true)
      const fetchSectors = async () => {
        const sectorsPromises = unitsData.map((unit) =>
          getDocs(
            collection(firestore, `clients/${contractId}/units/${unit.id}/sectors`)
          )
        )
        const sectorsSnapshots = await Promise.all(sectorsPromises)
        const sectorsData = sectorsSnapshots.flatMap((snapshot) =>
          snapshot.docs.map((doc) => ({ id: doc.id, ...doc.data() } as Sector))
        )
        setAllSectors(sectorsData)
        setAreSectorsLoading(false)
      }
      fetchSectors()
    } else if (!areUnitsLoading) {
      setAreSectorsLoading(false)
    }
  }, [unitsData, firestore, contractId, areUnitsLoading])

  const unitSectors = useMemo(() => {
    if (!selectedUnit) return []
    return allSectors.filter((s) => s.unitId === selectedUnit)
  }, [allSectors, selectedUnit])

  useEffect(() => {
    // Reset sector filter if the selected unit doesn't contain it anymore
    if (sectorFilter && unitSectors.length > 0 && !unitSectors.find(s => s.id === sectorFilter)) {
      setSectorFilter('');
    }
  }, [unitSectors, sectorFilter]);

  const environmentsRef = useMemoFirebase(() => {
    if (!firestore || !selectedUnit || !sectorFilter) return null
    return collection(
      firestore,
      `clients/${contractId}/units/${selectedUnit}/sectors/${sectorFilter}/environments`
    )
  }, [firestore, contractId, selectedUnit, sectorFilter])

  const { data: environments, isLoading: areEnvironmentsLoading } =
    useCollection<Environment>(environmentsRef)

  const filteredEnvironments = useMemo(() => {
    if (!environments) return []
    let filtered = environments
    if (statusFilter.length > 0) {
      filtered = filtered.filter((env) => {
        const status = env.status || 'Ativo'
        return statusFilter.includes(status)
      })
    }
    if (searchTerm) {
      filtered = filtered.filter((env) =>
        env.name.toLowerCase().includes(searchTerm.toLowerCase())
      )
    }
    return filtered
  }, [environments, searchTerm, statusFilter])

  const getSectorName = (sectorId: string) => {
    return allSectors.find((s) => s.id === sectorId)?.name || 'N/A'
  }

  const handleFormSubmit = (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault()
    if (!selectedUnit || !sectorFilter || !firestore) {
      toast({
        variant: 'destructive',
        title: 'Erro',
        description:
          'Selecione uma unidade e um setor antes de adicionar um posto de trabalho.',
      })
      return
    }

    const colRef = collection(
      firestore,
      `clients/${contractId}/units/${selectedUnit}/sectors/${sectorFilter}/environments`
    )
    const formData = new FormData(event.currentTarget)
    const environmentData: Omit<Environment, 'id'> = {
      name: formData.get('name') as string,
      description: formData.get('description') as string,
      activities: formData.get('activities') as string,
      equipment: formData.get('equipment') as string,
      sectorId: sectorFilter,
      physicalCharacteristics: {
        flooring: formData.get('flooring') as string,
        lighting: formData.get('lighting') as string,
        climateControl: formData.get('climateControl') as string,
        wallCoverings: formData.get('wallCoverings') as string,
        exhaustSystem: formData.get('exhaustSystem') as string,
      },
      status: editingEnvironment?.status || 'Ativo',
    }

    if (editingEnvironment) {
      // Update
      const docRef = doc(
        firestore,
        colRef.path,
        editingEnvironment.id as string
      )
      updateDocumentNonBlocking(docRef, environmentData)
      toast({
        title: 'Posto de Trabalho Atualizado!',
        description: `O posto de trabalho "${environmentData.name}" foi atualizado.`,
      })
    } else {
      // Create
      addDocumentNonBlocking(colRef, environmentData)
      toast({
        title: 'Posto de Trabalho Adicionado!',
        description: `O posto de trabalho "${environmentData.name}" foi criado.`,
      })
    }

    setIsFormDialogOpen(false)
    setEditingEnvironment(null)
  }

  const handleArchiveEnvironment = (env: Environment) => {
    if (!firestore || !env.id || !selectedUnit || !sectorFilter) return
    const envDocRef = doc(
      firestore,
      `clients/${contractId}/units/${selectedUnit}/sectors/${sectorFilter}/environments`,
      env.id
    )
    updateDocumentNonBlocking(envDocRef, { status: 'Arquivado' })
    toast({
      title: 'Posto de Trabalho Arquivado',
      description: 'O posto de trabalho foi marcado como Arquivado.',
      variant: 'destructive'
    })
  }

  const openFormDialog = (environment: Environment | null) => {
    if (!selectedUnit || !sectorFilter) {
      toast({
        title: 'Seleção Necessária',
        description:
          'Por favor, filtre por uma unidade e setor antes de adicionar ou editar um posto de trabalho.',
        variant: 'destructive',
      })
      return
    }
    setEditingEnvironment(environment)
    setIsFormDialogOpen(true)
  }

  const isLoading =
    areUnitsLoading || areSectorsLoading || areEnvironmentsLoading

  const renderEnvironmentForm = (environment?: Environment | null) => (
    <ScrollArea className='h-[70vh]'>
      <div className='grid gap-6 p-1 pr-6'>
        <div className='grid grid-cols-1 md:grid-cols-2 gap-4'>
          <div className='space-y-2'>
            <Label htmlFor='name'>Nome do Posto de Trabalho</Label>
            <Input
              id='name'
              name='name'
              defaultValue={environment?.name}
              required
            />
          </div>
          <div className='space-y-2'>
            <Label>Setor</Label>
            <Input value={getSectorName(sectorFilter)} disabled />
          </div>
        </div>

        <div className='space-y-2'>
          <Label htmlFor='description'>Descrição do Posto de Trabalho</Label>
          <Textarea
            id='description'
            name='description'
            defaultValue={environment?.description}
            placeholder='Descreva o propósito geral deste posto de trabalho.'
          />
        </div>
        <div className='space-y-2'>
          <Label htmlFor='activities'>Atividades Desenvolvidas</Label>
          <Textarea
            id='activities'
            name='activities'
            defaultValue={environment?.activities}
            placeholder='Liste as principais tarefas realizadas neste local.'
          />
        </div>
        <div className='space-y-2'>
          <Label htmlFor='equipment'>Máquinas e Equipamentos</Label>
          <Textarea
            id='equipment'
            name='equipment'
            defaultValue={environment?.equipment}
            placeholder='Liste as máquinas e equipamentos presentes.'
          />
        </div>

        <fieldset className='rounded-lg border p-4'>
          <legend className='-ml-1 px-1 text-sm font-medium'>
            Características Físicas
          </legend>
          <div className='grid grid-cols-1 md:grid-cols-2 gap-4 pt-2'>
            <div className='space-y-2'>
              <Label htmlFor='flooring'>Tipo de Piso</Label>
              <Input
                id='flooring'
                name='flooring'
                defaultValue={environment?.physicalCharacteristics.flooring}
              />
            </div>
            <div className='space-y-2'>
              <Label htmlFor='lighting'>Iluminação</Label>
              <Input
                id='lighting'
                name='lighting'
                defaultValue={environment?.physicalCharacteristics.lighting}
              />
            </div>
            <div className='space-y-2'>
              <Label htmlFor='climateControl'>Climatização</Label>
              <Input
                id='climateControl'
                name='climateControl'
                defaultValue={
                  environment?.physicalCharacteristics.climateControl
                }
              />
            </div>
            <div className='space-y-2'>
              <Label htmlFor='wallCoverings'>Revestimento de Paredes</Label>
              <Input
                id='wallCoverings'
                name='wallCoverings'
                defaultValue={
                  environment?.physicalCharacteristics.wallCoverings
                }
              />
            </div>
            <div className='space-y-2'>
              <Label htmlFor='exhaustSystem'>Sistema de Exaustão</Label>
              <Input
                id='exhaustSystem'
                name='exhaustSystem'
                defaultValue={
                  environment?.physicalCharacteristics.exhaustSystem
                }
              />
            </div>
          </div>
        </fieldset>
      </div>
    </ScrollArea>
  )

  return (
    <>
      <Card>
        <CardHeader>
          <CardTitle>Postos de Trabalho</CardTitle>
          <CardDescription>
            Gerencie os locais de trabalho e etapas de processo dentro de cada
            setor.
          </CardDescription>
          <div className='flex items-center justify-between pt-4'>
            <div className='flex items-center gap-2 flex-wrap'>
              <div className='relative w-full max-w-xs'>
                <Search className='absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground' />
                <Input
                  type='search'
                  placeholder='Buscar por nome...'
                  className='pl-8'
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                />
              </div>
              <Select
                value={selectedUnit}
                onValueChange={(value) => {
                  setSelectedUnit(value)
                  setSectorFilter('') // Reset sector filter when unit changes
                }}
                disabled={areUnitsLoading}
              >
                <SelectTrigger className='w-[220px]'>
                  <SelectValue placeholder='Filtrar por Unidade...' />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value=''>Todas as Unidades</SelectItem>
                  {unitsData?.map((unit) => (
                    <SelectItem key={unit.id} value={unit.id!}>
                      {unit.name}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
              <Select
                value={sectorFilter}
                onValueChange={setSectorFilter}
                disabled={!selectedUnit || areSectorsLoading}
              >
                <SelectTrigger className='w-[220px]'>
                  <SelectValue placeholder='Filtrar por Setor...' />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value=''>Todos os Setores</SelectItem>
                  {unitSectors.map((sector) => (
                    <SelectItem key={sector.id} value={sector.id}>
                      {sector.name}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
              <DropdownMenu>
                <DropdownMenuTrigger asChild>
                  <Button variant='outline' size='sm' className='h-10 gap-1'>
                    <Filter className='h-3.5 w-3.5' />
                    <span className='sr-only sm:not-sr-only'>Status</span>
                  </Button>
                </DropdownMenuTrigger>
                <DropdownMenuContent align='end'>
                  <DropdownMenuLabel>Filtrar por Status</DropdownMenuLabel>
                  <DropdownMenuSeparator />
                  {['Ativo', 'Arquivado'].map((status) => (
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
            <Button
              size='sm'
              className='h-10 gap-1'
              onClick={() => openFormDialog(null)}
              disabled={!selectedUnit || !sectorFilter}
            >
              <PlusCircle className='h-3.5 w-3.5' />
              <span className='sr-only sm:not-sr-only sm:whitespace-nowrap'>
                Adicionar Posto de Trabalho
              </span>
            </Button>
          </div>
        </CardHeader>
        <CardContent>
          {isLoading ? (
            <div className='flex justify-center items-center h-48'>
              <Loader2 className='h-8 w-8 animate-spin' />
            </div>
          ) : !selectedUnit || !sectorFilter ? (
            <div className='text-center py-10 text-muted-foreground'>
              <p>
                Por favor, selecione uma unidade e um setor para ver os postos
                de trabalho.
              </p>
            </div>
          ) : (
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Posto de Trabalho</TableHead>
                  <TableHead>Atividades</TableHead>
                  <TableHead>
                    <span className='sr-only'>Ações</span>
                  </TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {filteredEnvironments.map((env) => (
                  <TableRow
                    key={env.id}
                    onClick={() => openFormDialog(env)}
                    className='cursor-pointer'
                  >
                    <TableCell className='font-medium'>{env.name}</TableCell>
                    <TableCell>
                      <p className='line-clamp-1 text-sm text-muted-foreground'>
                        {env.activities}
                      </p>
                    </TableCell>
                    <TableCell>
                      <DropdownMenu>
                        <DropdownMenuTrigger asChild>
                          <Button
                            aria-haspopup='true'
                            size='icon'
                            variant='ghost'
                            onClick={(e) => e.stopPropagation()}
                          >
                            <MoreHorizontal className='h-4 w-4' />
                            <span className='sr-only'>Alternar menu</span>
                          </Button>
                        </DropdownMenuTrigger>
                        <DropdownMenuContent align='end' onClick={(e) => e.stopPropagation()}>
                          <DropdownMenuLabel>Ações</DropdownMenuLabel>
                          <DropdownMenuItem onClick={() => openFormDialog(env)}>
                            Editar
                          </DropdownMenuItem>
                          <DropdownMenuItem onClick={() => handleArchiveEnvironment(env)}>
                            Arquivar
                          </DropdownMenuItem>
                        </DropdownMenuContent>
                      </DropdownMenu>
                    </TableCell>
                  </TableRow>
                ))}
                {filteredEnvironments.length === 0 && (
                  <TableRow>
                    <TableCell colSpan={3} className='h-24 text-center'>
                      Nenhum posto de trabalho encontrado para este setor.
                    </TableCell>
                  </TableRow>
                )}
              </TableBody>
            </Table>
          )}
        </CardContent>
      </Card>

      <Dialog open={isFormDialogOpen} onOpenChange={setIsFormDialogOpen}>
        <DialogContent className='sm:max-w-3xl'>
          <DialogHeader>
            <DialogTitle>
              {editingEnvironment ? 'Editar' : 'Adicionar'} Posto de Trabalho
            </DialogTitle>
            <DialogDescription>
              {editingEnvironment
                ? 'Atualize os detalhes'
                : 'Preencha os detalhes'}{' '}
              para este posto de trabalho no setor{' '}
              <strong>{getSectorName(sectorFilter)}</strong>.
            </DialogDescription>
          </DialogHeader>
          <form id='environment-form' onSubmit={handleFormSubmit}>
            {renderEnvironmentForm(editingEnvironment)}
          </form>
          <DialogFooter>
            <Button
              variant='outline'
              onClick={() => {
                setIsFormDialogOpen(false)
                setEditingEnvironment(null)
              }}
            >
              Cancelar
            </Button>
            <Button type='submit' form='environment-form'>
              {editingEnvironment
                ? 'Salvar Alterações'
                : 'Salvar Posto de Trabalho'}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </>
  )
}
