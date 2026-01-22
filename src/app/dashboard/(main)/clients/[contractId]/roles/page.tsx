
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
import type { Role } from '@/lib/types/role'
import type { Sector } from '@/lib/types/sector'
import type { Unit } from '@/lib/types/unit'
import type { Environment } from '@/lib/types/environment'
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
  DropdownMenuItem,
} from '@/components/ui/dropdown-menu'
import {
  useFirestore,
  useCollection,
  useMemoFirebase,
  addDocumentNonBlocking,
  updateDocumentNonBlocking,
} from '@/firebase'
import { collection, doc, getDocs } from 'firebase/firestore'
import { useAllSectors } from '@/hooks/use-all-sectors'
import { useAllEnvironments } from '@/hooks/use-all-environments'

export default function RolesPage() {
  const params = useParams()
  const contractId = params.contractId as string
  const { toast } = useToast()
  const firestore = useFirestore()
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

  const { allSectors, isLoadingSectors: areSectorsLoading } =
    useAllSectors(contractId)
  const { allEnvironments, isLoadingEnvironments: areEnvironmentsLoading } =
    useAllEnvironments(contractId)

  const [isAddDialogOpen, setIsAddDialogOpen] = useState(false)
  const [searchTerm, setSearchTerm] = useState('')
  const [sectorFilter, setSectorFilter] = useState<string[]>(
    urlSectorId ? [urlSectorId] : []
  )
  const [statusFilter, setStatusFilter] = useState<string[]>(['Ativo'])
  const [editingRole, setEditingRole] = useState<Role | null>(null)
  const [formActivities, setFormActivities] = useState<string[]>([])
  const [activityInput, setActivityInput] = useState('')
  const [selectedUnit, setSelectedUnit] = useState('')

  const sectorsInSelectedUnit = useMemo(() => {
    if (!selectedUnit) return []
    return allSectors.filter((s) => s.unitId === selectedUnit)
  }, [selectedUnit, allSectors])

  const environmentsInSelectedUnit = useMemo(() => {
    if (!selectedUnit) return []
    const sectorIds = sectorsInSelectedUnit.map(s => s.id)
    return allEnvironments.filter(e => sectorIds.includes(e.sectorId))
  }, [selectedUnit, sectorsInSelectedUnit, allEnvironments])


  const filteredRoles = useMemo(() => {
    if (!roles) return []
    let filtered = roles
    if (statusFilter.length > 0) {
      filtered = filtered.filter((role) => {
        const status = role.status || 'Ativo'
        return statusFilter.includes(status)
      })
    }
    if (sectorFilter.length > 0) {
      filtered = filtered.filter((role) => sectorFilter.includes(role.sectorId))
    }
    if (searchTerm) {
      filtered = filtered.filter(
        (role) =>
          role.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
          role.description.toLowerCase().includes(searchTerm.toLowerCase())
      )
    }
    return filtered
  }, [roles, searchTerm, sectorFilter, statusFilter])

  const getSectorInfo = (sectorId: string) => {
    const sector = allSectors.find((s) => s.id === sectorId)
    if (!sector) return { sectorName: 'N/A', unitName: 'N/A' }
    const unit = units?.find((u) => u.id === sector.unitId)
    return {
      sectorName: sector.name,
      unitName: unit?.name || 'N/A',
    }
  }

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

  const openAddDialog = () => {
    setEditingRole(null)
    setFormActivities([])
    setSelectedUnit('')
    setIsAddDialogOpen(true)
  }
  
  const openEditDialog = (role: Role) => {
    setEditingRole(role)
    setFormActivities(role.activities || [])
    const sector = allSectors.find(s => s.id === role.sectorId)
    setSelectedUnit(sector?.unitId || '')
    setIsAddDialogOpen(true)
  }

  const handleArchiveRole = (role: Role) => {
    if (!firestore || !role.id) return
    const roleDocRef = doc(firestore, `clients/${contractId}/roles`, role.id)
    updateDocumentNonBlocking(roleDocRef, { status: 'Arquivado' })
    toast({
      title: 'Cargo Arquivado',
      description: 'O cargo foi marcado como Arquivado.',
      variant: 'destructive',
    })
  }

  const handleAddRole = (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault()
    if (!rolesRef) return

    const formData = new FormData(event.currentTarget)
    const additionalWorkstationIds = allEnvironments
      .map(env => env.id)
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
      status: editingRole?.status || 'Ativo',
    }
    
    if (editingRole?.id) {
        const roleDocRef = doc(firestore, `clients/${contractId}/roles`, editingRole.id)
        updateDocumentNonBlocking(roleDocRef, newRoleData);
        toast({ title: 'Cargo Atualizado!' })
    } else {
        addDocumentNonBlocking(rolesRef, newRoleData)
        toast({
            title: 'Cargo Adicionado!',
            description: `O cargo "${newRoleData.name}" foi adicionado.`,
        })
    }

    setIsAddDialogOpen(false)
    setEditingRole(null)
  }
  
  const isLoading = areRolesLoading || areUnitsLoading || areSectorsLoading || areEnvironmentsLoading;

  return (
    <>
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
                  {allSectors.map((sector) => (
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
                      {sector.name} ({getSectorInfo(sector.id).unitName})
                    </DropdownMenuCheckboxItem>
                  ))}
                   <DropdownMenuSeparator />
                  <DropdownMenuLabel>Filtrar por Status</DropdownMenuLabel>
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
            <Button size='sm' className='h-8 gap-1' onClick={openAddDialog}>
              <PlusCircle className='h-3.5 w-3.5' />
              <span className='sr-only sm:not-sr-only sm:whitespace-nowrap'>
                Adicionar Cargo
              </span>
            </Button>
          </div>
        </CardHeader>
        <CardContent>
          {isLoading ? (
            <div className='flex items-center justify-center h-64'>
                <Loader2 className="h-8 w-8 animate-spin" />
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
                      <TableCell>{sectorInfo.sectorName}</TableCell>
                      <TableCell className='hidden md:table-cell'>
                        <Badge variant='outline'>{sectorInfo.unitName}</Badge>
                      </TableCell>
                      <TableCell className='hidden sm:table-cell'>
                        {role.cbo}
                      </TableCell>
                      <TableCell>
                        <DropdownMenu>
                          <DropdownMenuTrigger asChild>
                            <Button
                              aria-haspopup='true'
                              size='icon'
                              variant='ghost'
                            >
                              <MoreHorizontal className='h-4 w-4' />
                              <span className='sr-only'>Alternar menu</span>
                            </Button>
                          </DropdownMenuTrigger>
                          <DropdownMenuContent align='end'>
                            <DropdownMenuLabel>Ações</DropdownMenuLabel>
                            <DropdownMenuItem onClick={() => openEditDialog(role)}>Editar</DropdownMenuItem>
                            <DropdownMenuItem onClick={() => handleArchiveRole(role)}>Arquivar</DropdownMenuItem>
                          </DropdownMenuContent>
                        </DropdownMenu>
                      </TableCell>
                    </TableRow>
                  )
                })}
              </TableBody>
            </Table>
          )}
        </CardContent>
      </Card>
      
      <Dialog open={isAddDialogOpen} onOpenChange={setIsAddDialogOpen}>
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
                    <Input id='name' name='name' defaultValue={editingRole?.name} required />
                  </div>
                  <div className='space-y-2'>
                    <Label htmlFor='cbo'>CBO</Label>
                    <Input id='cbo' name='cbo' defaultValue={editingRole?.cbo} placeholder='Ex: 2525-05' />
                  </div>
                </div>
                <div className='space-y-2'>
                  <Label htmlFor='sectorId'>Setor</Label>
                  <Select name='sectorId' defaultValue={editingRole?.sectorId} onValueChange={setSelectedUnit} required>
                    <SelectTrigger>
                      <SelectValue placeholder='Selecione o setor' />
                    </SelectTrigger>
                    <SelectContent>
                      {allSectors.map((sector) => (
                        <SelectItem key={sector.id} value={sector.id}>
                          {sector.name} ({getSectorInfo(sector.id).unitName})
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>
                <div className='space-y-2'>
                  <Label htmlFor='mainWorkstationId'>Posto de Trabalho Principal</Label>
                  <Select name='mainWorkstationId' defaultValue={editingRole?.mainWorkstationId} disabled={!selectedUnit}>
                    <SelectTrigger>
                      <SelectValue placeholder='Selecione o posto principal (opcional)' />
                    </SelectTrigger>
                    <SelectContent>
                      {environmentsInSelectedUnit.map(env => (
                        <SelectItem key={env.id} value={env.id}>
                          {env.name}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>
                
                <div className="space-y-4">
                  <Separator />
                  <Label className="font-semibold">Outros Postos de Trabalho Associados</Label>
                   <ScrollArea className="h-40 rounded-md border p-4">
                    <div className='space-y-2'>
                       {environmentsInSelectedUnit.map((env) => (
                          <div key={`additional-${env.id}`} className="flex items-center gap-2">
                             <Checkbox id={`additional-${env.id}`} name={`additional-${env.id}`} defaultChecked={editingRole?.additionalWorkstationIds?.includes(env.id)} />
                             <Label htmlFor={`additional-${env.id}`}>{env.name}</Label>
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
                    defaultValue={editingRole?.description}
                    placeholder='Descreva as principais atribuições do cargo'
                  />
                </div>
                <div className='space-y-2'>
                  <Label htmlFor='activities'>Atividades Principais</Label>
                  <div className='flex gap-2'>
                    <Input
                      id='activities'
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
                    defaultValue={editingRole?.requirements}
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
                    defaultValue={editingRole?.requiredExams}
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
              {editingRole ? 'Salvar Alterações' : 'Salvar'}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </>
  )
}
