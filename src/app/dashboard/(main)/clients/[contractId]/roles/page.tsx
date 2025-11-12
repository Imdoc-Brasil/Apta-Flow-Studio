
'use client'

import { useState, useMemo, useEffect } from 'react'
import {
  MoreHorizontal,
  PlusCircle,
  Search,
  Trash2,
  Filter,
  Loader2,
} from 'lucide-react'
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
  DialogTrigger,
  DialogFooter,
} from '@/components/ui/dialog'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Textarea } from '@/components/ui/textarea'
import { type Role } from './data'
import { type Sector } from '../sectors/data'
import { type Unit } from '../units/data'
import { type Environment } from '../environments/data'
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select'
import { useToast } from '@/hooks/use-toast'
import { Badge } from '@/components/ui/badge'
import { ScrollArea } from '@/components/ui/scroll-area'
import { Checkbox } from '@/components/ui/checkbox'
import { Separator } from '@/components/ui/separator'
import { useSearchParams, useParams } from 'next/navigation'
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuCheckboxItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu'
import {
  useFirestore,
  useCollection,
  useMemoFirebase,
  addDocumentNonBlocking,
  updateDocumentNonBlocking,
} from '@/firebase'
import { collection, doc, getDocs } from 'firebase/firestore'

export default function RolesPage() {
  const params = useParams()
  const contractId = params.contractId as string
  const firestore = useFirestore()
  const { toast } = useToast()
  const searchParams = useSearchParams()
  const urlSectorId = searchParams.get('sectorId')

  // Data fetching from Firestore
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
  const { data: roles, isLoading: areRolesLoading } = useCollection<Role>(
    rolesRef
  )
  const { data: units, isLoading: areUnitsLoading } = useCollection<Unit>(
    unitsRef
  )

  const [allSectors, setAllSectors] = useState<Sector[]>([])
  const [areSectorsLoading, setAreSectorsLoading] = useState(true)
  const [allEnvironments, setAllEnvironments] = useState<Environment[]>([])
  const [areEnvironmentsLoading, setAreEnvironmentsLoading] = useState(true)

  // Fetch all sectors and environments from all units
  useEffect(() => {
    if (units && firestore) {
      setAreSectorsLoading(true)
      const fetchAllData = async () => {
        try {
          const sectorsPromises = units.map((unit) =>
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

          setAreEnvironmentsLoading(true)
          if (sectorsData.length > 0) {
            const environmentsPromises = sectorsData.flatMap(sector => 
               getDocs(collection(firestore, `clients/${contractId}/units/${sector.unitId}/sectors/${sector.id}/environments`))
            );

            const environmentsSnapshots = await Promise.all(
              environmentsPromises
            )
            const environmentsData = environmentsSnapshots.flatMap((snapshot) =>
              snapshot.docs.map(
                (doc) => ({ id: doc.id, ...doc.data() } as Environment)
              )
            )
            setAllEnvironments(environmentsData)
          } else {
            setAllEnvironments([])
          }
        } catch (error) {
          console.error("Failed to fetch sub-collections", error);
          setAllSectors([]);
          setAllEnvironments([]);
        } finally {
          setAreEnvironmentsLoading(false)
        }
      }
      fetchAllData()
    } else if (!areUnitsLoading) {
      setAreSectorsLoading(false)
      setAreEnvironmentsLoading(false)
    }
  }, [units, firestore, contractId, areUnitsLoading])

  const [isAddDialogOpen, setIsAddDialogOpen] = useState(false)
  const [searchTerm, setSearchTerm] = useState('')
  const [formActivities, setFormActivities] = useState<string[]>([])
  const [activityInput, setActivityInput] = useState('')

  const [sectorFilter, setSectorFilter] = useState<string[]>(
    urlSectorId ? [urlSectorId] : []
  )

  const sectorsWithUnit = useMemo(() => {
    return allSectors.map((sector) => {
      const unit = units?.find((u) => u.id === sector.unitId)
      return { ...sector, unitName: unit?.name || 'N/A' }
    })
  }, [allSectors, units])

  const getSectorInfo = (sectorId: string) => {
    return sectorsWithUnit.find((s) => s.id === sectorId)
  }

  const filteredRoles = useMemo(() => {
    if (!roles) return []
    let filtered = roles
    if (sectorFilter.length > 0) {
      filtered = filtered.filter((role) =>
        sectorFilter.includes(role.sectorId)
      )
    }
    if (searchTerm) {
      filtered = filtered.filter(
        (role) =>
          role.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
          role.description.toLowerCase().includes(searchTerm.toLowerCase())
      )
    }
    return filtered
  }, [roles, searchTerm, sectorFilter])

  const handleAddActivity = () => {
    if (
      activityInput.trim() &&
      !formActivities.includes(activityInput.trim())
    ) {
      setFormActivities([...formActivities, activityInput.trim()])
      setActivityInput('')
    }
  }

  const handleRemoveActivity = (activityToRemove: string) => {
    setFormActivities(
      formActivities.filter((activity) => activity !== activityToRemove)
    )
  }

  const handleAddRole = (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault()
    if (!rolesRef) return

    const formData = new FormData(event.currentTarget)
    const additionalWorkstationIds = allEnvironments
      .map((env) => env.id)
      .filter((id) => formData.get(`additional-${id}`) === 'on')

    const newRoleData: Omit<Role, 'id'> = {
      name: formData.get('name') as string,
      cbo: formData.get('cbo') as string,
      sectorId: formData.get('sectorId') as string,
      description: formData.get('description') as string,
      activities: formActivities,
      requirements: formData.get('requirements') as string,
      mainWorkstationId: formData.get('mainWorkstationId') as string,
      additionalWorkstationIds,
      requiredExams: formData.get('requiredExams') as string,
    }

    addDocumentNonBlocking(rolesRef, newRoleData)

    toast({
      title: 'Cargo Adicionado!',
      description: `O cargo "${newRoleData.name}" foi adicionado.`,
    })
    setIsAddDialogOpen(false)
    setFormActivities([])
  }

  const isLoading =
    areRolesLoading ||
    areUnitsLoading ||
    areSectorsLoading ||
    areEnvironmentsLoading

  return (
    <Card>
      <CardHeader>
        <CardTitle>Cargos</CardTitle>
        <CardDescription>
          Gerencie os cargos e suas atribuições dentro de cada setor.
        </CardDescription>
        <div className='flex items-center justify-between pt-4'>
          <div className='flex items-center gap-2'>
            <div className='relative w-full max-w-sm'>
              <Search className='absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground' />
              <Input
                type='search'
                placeholder='Buscar por nome do cargo...'
                className='pl-8'
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
              />
            </div>
            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <Button variant='outline' size='sm' className='h-10 gap-1'>
                  <Filter className='h-3.5 w-3.5' />
                  <span className='sr-only sm:not-sr-only'>Filtrar</span>
                </Button>
              </DropdownMenuTrigger>
              <DropdownMenuContent align='end'>
                <DropdownMenuLabel>Filtrar por Setor</DropdownMenuLabel>
                <DropdownMenuSeparator />
                {sectorsWithUnit.map((sector) => (
                  <DropdownMenuCheckboxItem
                    key={sector.id}
                    checked={sectorFilter.includes(sector.id)}
                    onCheckedChange={(checked) => {
                      setSectorFilter((prev) =>
                        checked
                          ? [...prev, sector.id]
                          : prev.filter((id) => id !== sector.id)
                      )
                    }}
                  >
                    {sector.name} ({sector.unitName})
                  </DropdownMenuCheckboxItem>
                ))}
              </DropdownMenuContent>
            </DropdownMenu>
          </div>
          <Dialog open={isAddDialogOpen} onOpenChange={setIsAddDialogOpen}>
            <DialogTrigger asChild>
              <Button
                size='sm'
                className='h-8 gap-1'
                onClick={() => setFormActivities([])}
              >
                <PlusCircle className='h-3.5 w-3.5' />
                <span className='sr-only sm:not-sr-only sm:whitespace-nowrap'>
                  Adicionar Cargo
                </span>
              </Button>
            </DialogTrigger>
            <DialogContent className='sm:max-w-2xl'>
              <DialogHeader>
                <DialogTitle>Adicionar Novo Cargo</DialogTitle>
                <DialogDescription>
                  Preencha os detalhes para criar um novo cargo.
                </DialogDescription>
              </DialogHeader>
              <form id='add-role-form' onSubmit={handleAddRole}>
                <ScrollArea className='h-[70vh]'>
                  <div className='grid gap-6 p-4'>
                    <div className='grid grid-cols-2 gap-4'>
                      <div className='space-y-2'>
                        <Label htmlFor='name'>Nome do Cargo</Label>
                        <Input id='name' name='name' required />
                      </div>
                      <div className='space-y-2'>
                        <Label htmlFor='cbo'>CBO</Label>
                        <Input id='cbo' name='cbo' placeholder='Ex: 2525-05' />
                      </div>
                    </div>
                    <div className='space-y-2'>
                      <Label htmlFor='sectorId'>Setor</Label>
                      <Select name='sectorId' required>
                        <SelectTrigger>
                          <SelectValue placeholder='Selecione o setor' />
                        </SelectTrigger>
                        <SelectContent>
                          {sectorsWithUnit.map((sector) => (
                            <SelectItem key={sector.id} value={sector.id}>
                              {sector.name} ({sector.unitName})
                            </SelectItem>
                          ))}
                        </SelectContent>
                      </Select>
                    </div>
                    <div className='space-y-2'>
                      <Label htmlFor='mainWorkstationId'>
                        Posto de Trabalho Principal
                      </Label>
                      <Select name='mainWorkstationId'>
                        <SelectTrigger>
                          <SelectValue placeholder='Selecione o posto de trabalho principal (opcional)' />
                        </SelectTrigger>
                        <SelectContent>
                          {allEnvironments.map((env) => (
                            <SelectItem key={env.id} value={env.id}>
                              {env.name}
                            </SelectItem>
                          ))}
                        </SelectContent>
                      </Select>
                    </div>

                    <div className='space-y-4'>
                      <Separator />
                      <Label className='font-semibold'>
                        Outros Postos de Trabalho Associados
                      </Label>
                      <ScrollArea className='h-40 rounded-md border p-4'>
                        <div className='space-y-2'>
                          {allEnvironments.map((env) => (
                            <div
                              key={`additional-${env.id}`}
                              className='flex items-center gap-2'
                            >
                              <Checkbox
                                id={`additional-${env.id}`}
                                name={`additional-${env.id}`}
                              />
                              <Label htmlFor={`additional-${env.id}`}>
                                {env.name}
                              </Label>
                            </div>
                          ))}
                        </div>
                      </ScrollArea>
                    </div>

                    <div className='space-y-2'>
                      <Label htmlFor='description'>Descrição Sumária</Label>
                      <Textarea
                        id='description'
                        name='description'
                        placeholder='Descreva as principais atribuições do cargo'
                      />
                    </div>
                    <div className='space-y-2'>
                      <Label htmlFor='activities'>Atividades Principais</Label>
                      <div className='flex gap-2'>
                        <Input
                          id='activities'
                          name='activities'
                          value={activityInput}
                          onChange={(e) => setActivityInput(e.target.value)}
                          onKeyDown={(e) => {
                            if (e.key === 'Enter') {
                              e.preventDefault()
                              handleAddActivity()
                            }
                          }}
                          placeholder='Digite uma atividade e tecle Enter'
                        />
                        <Button type='button' onClick={handleAddActivity}>
                          Adicionar
                        </Button>
                      </div>
                      <div className='flex flex-wrap gap-2 mt-2'>
                        {formActivities.map((activity) => (
                          <Badge
                            key={activity}
                            variant='secondary'
                            className='flex items-center gap-1'
                          >
                            {activity}
                            <button
                              type='button'
                              onClick={() => handleRemoveActivity(activity)}
                              className='rounded-full hover:bg-background/50'
                            >
                              <Trash2 className='h-3 w-3' />
                            </button>
                          </Badge>
                        ))}
                      </div>
                    </div>
                    <div className='space-y-2'>
                      <Label htmlFor='requirements'>
                        Requisitos/Qualificações
                      </Label>
                      <Textarea
                        id='requirements'
                        name='requirements'
                        placeholder='Liste competências, treinamentos obrigatórios (NRs), certificações, etc.'
                      />
                    </div>
                    <div className='space-y-2'>
                      <Label htmlFor='requiredExams'>
                        Exames Médicos (PCMSO)
                      </Label>
                      <Input
                        id='requiredExams'
                        name='requiredExams'
                        placeholder='Ex: ASO, Audiometria, Acuidade Visual...'
                      />
                    </div>
                  </div>
                </ScrollArea>
              </form>
              <DialogFooter>
                <Button
                  variant='outline'
                  onClick={() => setIsAddDialogOpen(false)}
                >
                  Cancelar
                </Button>
                <Button type='submit' form='add-role-form'>
                  Salvar
                </Button>
              </DialogFooter>
            </DialogContent>
          </Dialog>
        </div>
      </CardHeader>
      <CardContent>
        {isLoading ? (
          <div className='flex items-center justify-center h-64'>
            <Loader2 className='h-8 w-8 animate-spin' />
          </div>
        ) : (
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Cargo</TableHead>
                <TableHead>Setor</TableHead>
                <TableHead className='hidden md:table-cell'>Unidade</TableHead>
                <TableHead className='hidden sm:table-cell'>CBO</TableHead>
                <TableHead>
                  <span className='sr-only'>Ações</span>
                </TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {filteredRoles.map((role) => {
                const sectorInfo = getSectorInfo(role.sectorId)
                return (
                  <TableRow key={role.id}>
                    <TableCell className='font-medium'>{role.name}</TableCell>
                    <TableCell>{sectorInfo?.name || 'N/A'}</TableCell>
                    <TableCell className='hidden md:table-cell'>
                      <Badge variant='outline'>
                        {sectorInfo?.unitName || 'N/A'}
                      </Badge>
                    </TableCell>
                    <TableCell className='hidden sm:table-cell'>
                      {role.cbo}
                    </TableCell>
                    <TableCell>
                      <Button aria-haspopup='true' size='icon' variant='ghost'>
                        <MoreHorizontal className='h-4 w-4' />
                        <span className='sr-only'>Alternar menu</span>
                      </Button>
                    </TableCell>
                  </TableRow>
                )
              })}
            </TableBody>
          </Table>
        )}
      </CardContent>
    </Card>
  )
}

    