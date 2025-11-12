
'use client'

import { useState, useMemo, useEffect } from 'react'
import {
  MoreHorizontal,
  PlusCircle,
  Search,
  Filter,
  LayoutGrid,
  List,
  Users,
  X,
  Loader2,
} from 'lucide-react'
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
  CardFooter,
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
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuCheckboxItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Textarea } from '@/components/ui/textarea'
import { type GHE } from './data'
import type { Unit } from '../units/data'
import type { Role } from '../roles/data'
import type { Sector } from '../sectors/data'
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select'
import { useToast } from '@/hooks/use-toast'
import { Badge } from '@/components/ui/badge'
import { useRouter, useParams } from 'next/navigation'
import { Checkbox } from '@/components/ui/checkbox'
import { ScrollArea } from '@/components/ui/scroll-area'
import { Separator } from '@/components/ui/separator'
import {
  useFirestore,
  addDocumentNonBlocking,
  useCollection,
  useMemoFirebase,
} from '@/firebase'
import { collection, getDocs } from 'firebase/firestore'

export default function GhePage() {
  const params = useParams()
  const contractId = params.contractId as string

  const firestore = useFirestore()
  const ghesRef = useMemoFirebase(
    () =>
      firestore ? collection(firestore, `clients/${contractId}/ghes`) : null,
    [firestore, contractId]
  )
  const unitsRef = useMemoFirebase(
    () =>
      firestore ? collection(firestore, `clients/${contractId}/units`) : null,
    [firestore, contractId]
  )
  const rolesRef = useMemoFirebase(
    () =>
      firestore ? collection(firestore, `clients/${contractId}/roles`) : null,
    [firestore, contractId]
  )

  const { data: ghes, isLoading: areGhesLoading } = useCollection<GHE>(ghesRef)
  const { data: unitsData, isLoading: areUnitsLoading } =
    useCollection<Unit>(unitsRef)
  const { data: rolesData, isLoading: areRolesLoading } =
    useCollection<Role>(rolesRef)

  const [allSectors, setAllSectors] = useState<Sector[]>([])
  const [areSectorsLoading, setAreSectorsLoading] = useState(true)

  useEffect(() => {
    if (unitsData && firestore && !areUnitsLoading) {
      setAreSectorsLoading(true);
      const fetchSectors = async () => {
        try {
          const sectorsPromises = unitsData.map(unit =>
            getDocs(collection(firestore, `clients/${contractId}/units/${unit.id}/sectors`))
          );
          const sectorsSnapshots = await Promise.all(sectorsPromises);
          const sectorsData = sectorsSnapshots.flatMap(snapshot =>
            snapshot.docs.map(doc => ({ id: doc.id, ...doc.data() } as Sector))
          );
          setAllSectors(sectorsData);
        } catch (error) {
          console.error("Error fetching sectors: ", error);
          setAllSectors([]);
        } finally {
          setAreSectorsLoading(false);
        }
      };
      fetchSectors();
    } else if (!areUnitsLoading) {
      setAreSectorsLoading(false);
    }
  }, [unitsData, firestore, contractId, areUnitsLoading]);


  const [isAddDialogOpen, setIsAddDialogOpen] = useState(false)
  const [isDetailDialogOpen, setIsDetailDialogOpen] = useState(false)
  const [selectedGhe, setSelectedGhe] = useState<GHE | null>(null)
  const [searchTerm, setSearchTerm] = useState('')
  const [unitFilter, setUnitFilter] = useState<string[]>([])
  const [viewMode, setViewMode] = useState<'card' | 'list'>('card')
  const { toast } = useToast()
  const router = useRouter()

  // States for the list builder
  const [selectedRoles, setSelectedRoles] = useState<string[]>([])
  const [roleSearchTerm, setRoleSearchTerm] = useState('')

  const getRoleName = (roleId: string) => {
    return rolesData?.find((role) => role.id === roleId)?.name || 'N/A'
  }

  const getSectorName = (sectorId: string) => {
    return allSectors?.find((sector) => sector.id === sectorId)?.name || 'N/A'
  }

  const rolesWithSectors = useMemo(() => {
    if (!rolesData || areSectorsLoading) return []
    return rolesData.map((role) => ({
      ...role,
      sectorName: getSectorName(role.sectorId),
    }))
  }, [rolesData, allSectors, areSectorsLoading])

  const availableRoles = useMemo(() => {
    return rolesWithSectors.filter(
      (role) =>
        !selectedRoles.includes(role.id) &&
        (role.name.toLowerCase().includes(roleSearchTerm.toLowerCase()) ||
          role.sectorName.toLowerCase().includes(roleSearchTerm.toLowerCase()))
    )
  }, [selectedRoles, roleSearchTerm, rolesWithSectors])

  const currentSelectedRoles = useMemo(() => {
    return rolesWithSectors.filter((role) => selectedRoles.includes(role.id))
  }, [selectedRoles, rolesWithSectors])

  const handleSelectRole = (roleId: string) => {
    setSelectedRoles((prev) => [...prev, roleId])
  }

  const handleRemoveRole = (roleId: string) => {
    setSelectedRoles((prev) => prev.filter((id) => id !== roleId))
  }

  const resetRoleSelection = () => {
    setSelectedRoles([])
    setRoleSearchTerm('')
  }

  const filteredGhes = useMemo(() => {
    if (!ghes) return []
    let filtered = ghes
    if (unitFilter.length > 0) {
      filtered = filtered.filter((ghe) => unitFilter.includes(ghe.unitId))
    }
    if (searchTerm) {
      filtered = filtered.filter(
        (ghe) =>
          ghe.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
          ghe.description.toLowerCase().includes(searchTerm.toLowerCase())
      )
    }
    return filtered
  }, [ghes, unitFilter, searchTerm])

  const handleAddGhe = (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault()
    if (!ghesRef) return

    const formData = new FormData(event.currentTarget)

    if (selectedRoles.length === 0) {
      toast({
        variant: 'destructive',
        title: 'Nenhum cargo selecionado',
        description: 'Por favor, inclua pelo menos um cargo no GHE.',
      })
      return
    }

    const newGheData: Omit<GHE, 'id'> = {
      name: formData.get('name') as string,
      description: formData.get('description') as string,
      unitId: formData.get('unitId') as string,
      roleIds: selectedRoles,
    }

    addDocumentNonBlocking(ghesRef, newGheData)

    setIsAddDialogOpen(false)
    resetRoleSelection()
    toast({
      title: 'GHE Adicionado!',
      description: `O grupo "${newGheData.name}" foi adicionado.`,
    })
  }

  const getUnitName = (unitId: string) => {
    return unitsData?.find((unit) => unit.id === unitId)?.name || 'N/A'
  }

  const handleOpenDetails = (ghe: GHE) => {
    setSelectedGhe(ghe)
    setIsDetailDialogOpen(true)
  }

  const openAddDialog = () => {
    resetRoleSelection()
    setIsAddDialogOpen(true)
  }
  
  const isLoading = areGhesLoading || areUnitsLoading || areRolesLoading || areSectorsLoading;

  return (
    <>
      <Card>
        <CardHeader>
          <CardTitle>Grupos Homogêneos de Exposição (GHE)</CardTitle>
          <CardDescription>
            Gerencie os grupos de colaboradores que estão expostos aos mesmos
            riscos.
          </CardDescription>
          <div className='flex items-center justify-between pt-4'>
            <div className='flex items-center gap-2'>
              <div className='relative w-full max-w-sm'>
                <Search className='absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground' />
                <Input
                  type='search'
                  placeholder='Buscar por nome do GHE...'
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
                  <DropdownMenuLabel>Filtrar por Unidade</DropdownMenuLabel>
                  <DropdownMenuSeparator />
                  {unitsData?.map((unit) => (
                    <DropdownMenuCheckboxItem
                      key={unit.id}
                      checked={unitFilter.includes(unit.id!)}
                      onCheckedChange={(checked) => {
                        setUnitFilter((prev) =>
                          checked
                            ? [...prev, unit.id!]
                            : prev.filter((id) => id !== unit.id)
                        )
                      }}
                    >
                      {unit.name}
                    </DropdownMenuCheckboxItem>
                  ))}
                </DropdownMenuContent>
              </DropdownMenu>
            </div>
            <div className='flex items-center gap-2'>
              <div className='flex items-center gap-1 rounded-lg bg-muted p-1'>
                <Button
                  variant={viewMode === 'list' ? 'secondary' : 'ghost'}
                  size='icon'
                  className='h-8 w-8'
                  onClick={() => setViewMode('list')}
                >
                  <List className='h-4 w-4' />
                </Button>
                <Button
                  variant={viewMode === 'card' ? 'secondary' : 'ghost'}
                  size='icon'
                  className='h-8 w-8'
                  onClick={() => setViewMode('card')}
                >
                  <LayoutGrid className='h-4 w-4' />
                </Button>
              </div>
              <Dialog open={isAddDialogOpen} onOpenChange={setIsAddDialogOpen}>
                <DialogTrigger asChild>
                  <Button
                    size='sm'
                    className='h-8 gap-1'
                    onClick={openAddDialog}
                  >
                    <PlusCircle className='h-3.5 w-3.5' />
                    <span className='sr-only sm:not-sr-only sm:whitespace-nowrap'>
                      Adicionar GHE
                    </span>
                  </Button>
                </DialogTrigger>
                <DialogContent className='sm:max-w-3xl'>
                  <DialogHeader>
                    <DialogTitle>Adicionar Novo GHE</DialogTitle>
                    <DialogDescription>
                      Preencha os detalhes para criar um novo grupo.
                    </DialogDescription>
                  </DialogHeader>
                  <form id='add-ghe-form' onSubmit={handleAddGhe}>
                    <ScrollArea className='h-[70vh]'>
                      <div className='grid gap-6 p-4'>
                        <div className='space-y-2'>
                          <Label htmlFor='name'>Nome do GHE</Label>
                          <Input
                            id='name'
                            name='name'
                            placeholder='Ex: GHE Produção - Ruído'
                            required
                          />
                        </div>
                        <div className='space-y-2'>
                          <Label htmlFor='unitId'>Unidade</Label>
                          <Select name='unitId' required>
                            <SelectTrigger>
                              <SelectValue placeholder='Selecione a unidade' />
                            </SelectTrigger>
                            <SelectContent>
                              {unitsData?.map((unit) => (
                                <SelectItem key={unit.id} value={unit.id!}>
                                  {unit.name}
                                </SelectItem>
                              ))}
                            </SelectContent>
                          </Select>
                        </div>
                        <div className='space-y-2'>
                          <Label htmlFor='description'>Descrição</Label>
                          <Textarea
                            id='description'
                            name='description'
                            placeholder='Descreva as características deste grupo'
                            required
                          />
                        </div>
                        <div className='space-y-2'>
                          <Label>Cargos Incluídos</Label>
                          <div className='grid grid-cols-2 gap-4'>
                            {/* Coluna da Esquerda: Disponíveis */}
                            <div className='rounded-md border p-4 space-y-2'>
                              <div className='relative'>
                                <Search className='absolute left-2 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground' />
                                <Input
                                  placeholder='Buscar cargo...'
                                  className='pl-8'
                                  value={roleSearchTerm}
                                  onChange={(e) =>
                                    setRoleSearchTerm(e.target.value)
                                  }
                                />
                              </div>
                              <ScrollArea className='h-48'>
                                <div className='space-y-2'>
                                  {availableRoles.map((role) => (
                                    <div
                                      key={role.id}
                                      className='flex items-center justify-between text-sm p-2 rounded-md hover:bg-muted'
                                    >
                                      <span>
                                        {role.name} /{' '}
                                        <span className='text-muted-foreground'>
                                          {role.sectorName}
                                        </span>
                                      </span>
                                      <Button
                                        type='button'
                                        size='sm'
                                        variant='outline'
                                        onClick={() =>
                                          handleSelectRole(role.id)
                                        }
                                      >
                                        Incluir
                                      </Button>
                                    </div>
                                  ))}
                                  {availableRoles.length === 0 && (
                                    <p className='text-center text-xs text-muted-foreground pt-4'>
                                      Nenhum cargo encontrado.
                                    </p>
                                  )}
                                </div>
                              </ScrollArea>
                            </div>

                            {/* Coluna da Direita: Selecionados */}
                            <div className='rounded-md border p-4 space-y-2'>
                              <h4 className='font-medium text-sm'>
                                Selecionados ({currentSelectedRoles.length})
                              </h4>
                              <Separator />
                              <ScrollArea className='h-48'>
                                <div className='space-y-2'>
                                  {currentSelectedRoles.map((role) => (
                                    <div
                                      key={role.id}
                                      className='flex items-center justify-between text-sm p-2 rounded-md bg-secondary'
                                    >
                                      <span>
                                        {role.name} /{' '}
                                        <span className='text-muted-foreground'>
                                          {role.sectorName}
                                        </span>
                                      </span>
                                      <Button
                                        type='button'
                                        size='icon'
                                        variant='ghost'
                                        className='h-6 w-6'
                                        onClick={() =>
                                          handleRemoveRole(role.id)
                                        }
                                      >
                                        <X className='h-4 w-4' />
                                      </Button>
                                    </div>
                                  ))}
                                  {currentSelectedRoles.length === 0 && (
                                    <p className='text-center text-xs text-muted-foreground pt-4'>
                                      Nenhum cargo selecionado.
                                    </p>
                                  )}
                                </div>
                              </ScrollArea>
                            </div>
                          </div>
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
                    <Button type='submit' form='add-ghe-form'>
                      Salvar
                    </Button>
                  </DialogFooter>
                </DialogContent>
              </Dialog>
            </div>
          </div>
        </CardHeader>
        <CardContent>
          {isLoading ? (
            <div className='flex items-center justify-center h-64'>
              <Loader2 className='h-8 w-8 animate-spin' />
            </div>
          ) : filteredGhes && filteredGhes.length > 0 ? (
            <>
              {viewMode === 'list' ? (
                <Table>
                  <TableHeader>
                    <TableRow>
                      <TableHead>Nome do GHE</TableHead>
                      <TableHead className='hidden md:table-cell'>
                        Descrição
                      </TableHead>
                      <TableHead className='hidden sm:table-cell'>
                        Unidade
                      </TableHead>
                      <TableHead>
                        <span className='sr-only'>Ações</span>
                      </TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {filteredGhes.map((ghe) => (
                      <TableRow
                        key={ghe.id}
                        className='cursor-pointer'
                        onClick={() => handleOpenDetails(ghe)}
                      >
                        <TableCell className='font-medium'>
                          {ghe.name}
                        </TableCell>
                        <TableCell className='hidden md:table-cell'>
                          <p className='line-clamp-1 text-sm text-muted-foreground'>
                            {ghe.description}
                          </p>
                        </TableCell>
                        <TableCell className='hidden sm:table-cell'>
                          <Badge variant='outline'>
                            {getUnitName(ghe.unitId)}
                          </Badge>
                        </TableCell>
                        <TableCell>
                          <Button
                            aria-haspopup='true'
                            size='icon'
                            variant='ghost'
                          >
                            <MoreHorizontal className='h-4 w-4' />
                            <span className='sr-only'>Alternar menu</span>
                          </Button>
                        </TableCell>
                      </TableRow>
                    ))}
                  </TableBody>
                </Table>
              ) : (
                <div className='grid gap-4 md:grid-cols-2 lg:grid-cols-3'>
                  {filteredGhes.map((ghe) => (
                    <Card
                      key={ghe.id}
                      className='cursor-pointer hover:shadow-md transition-shadow flex flex-col'
                      onClick={() => handleOpenDetails(ghe)}
                    >
                      <CardHeader>
                        <CardTitle>{ghe.name}</CardTitle>
                        <CardDescription>
                          <Badge variant='outline'>
                            {getUnitName(ghe.unitId)}
                          </Badge>
                        </CardDescription>
                      </CardHeader>
                      <CardContent className='flex-grow'>
                        <p className='line-clamp-3 text-sm text-muted-foreground'>
                          {ghe.description}
                        </p>
                      </CardContent>
                      <CardFooter>
                        <div className='flex items-center text-sm text-muted-foreground'>
                          <Users className='h-4 w-4 mr-2' />
                          {ghe.roleIds.length} cargos incluídos
                        </div>
                      </CardFooter>
                    </Card>
                  ))}
                </div>
              )}
            </>
          ) : (
            <div className='flex flex-1 items-center justify-center rounded-lg border border-dashed shadow-sm h-96'>
              <div className='flex flex-col items-center gap-1 text-center'>
                <h3 className='text-2xl font-bold tracking-tight'>
                  Nenhum GHE encontrado
                </h3>
                <p className='text-sm text-muted-foreground'>
                  Ajuste seus filtros ou adicione um novo GHE.
                </p>
                <Button
                  className='mt-4'
                  onClick={() => setIsAddDialogOpen(true)}
                >
                  Adicionar GHE
                </Button>
              </div>
            </div>
          )}
        </CardContent>
      </Card>

      <Dialog open={isDetailDialogOpen} onOpenChange={setIsDetailDialogOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>{selectedGhe?.name}</DialogTitle>
            <div className='pt-2'>
              <Badge variant='outline'>
                {getUnitName(selectedGhe?.unitId || '')}
              </Badge>
            </div>
          </DialogHeader>
          <div className='py-4 space-y-4'>
            <div>
              <h4 className='font-semibold text-sm'>Descrição</h4>
              <p className='text-sm text-muted-foreground'>
                {selectedGhe?.description}
              </p>
            </div>
            {selectedGhe && selectedGhe.roleIds.length > 0 && (
              <div>
                <h4 className='font-semibold text-sm'>Cargos Incluídos</h4>
                <div className='flex flex-wrap gap-2 mt-2'>
                  {selectedGhe.roleIds.map((roleId) => {
                    const role = rolesWithSectors.find((r) => r.id === roleId)
                    if (!role) return null
                    return (
                      <Badge key={roleId} variant='secondary'>
                        {role.name} / {role.sectorName}
                      </Badge>
                    )
                  })}
                </div>
              </div>
            )}
          </div>
          <DialogFooter>
            <Button
              variant='outline'
              onClick={() => setIsDetailDialogOpen(false)}
            >
              Fechar
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </>
  )
}
