
'use client'
import { useState, useEffect, useMemo } from 'react'
import { useParams, useRouter, useSearchParams } from 'next/navigation'
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
  PlusCircle,
  MoreHorizontal,
  Search,
  Users,
  Building,
  ArrowRight,
  LayoutGrid,
  List,
  Filter,
  MapPin,
  Loader2,
} from 'lucide-react'
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table'
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
import type { Unit } from '@/app/dashboard/(main)/clients/[contractId]/units/data'
import { Badge } from '@/components/ui/badge'
import { type Sector } from '@/app/dashboard/(main)/clients/[contractId]/sectors/data'
import { cn } from '@/lib/utils'
import Link from 'next/link'
import { useToast } from '@/hooks/use-toast'
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select'
import {
  useFirestore,
  useCollection,
  useMemoFirebase,
  addDocumentNonBlocking,
} from '@/firebase'
import { collection, query, where, getDocs } from 'firebase/firestore'

export default function SectorsPage() {
  const params = useParams()
  const router = useRouter()
  const { toast } = useToast()
  const contractId = params.contractId as string
  const searchParams = useSearchParams()
  const urlUnitId = searchParams.get('unitId')

  const firestore = useFirestore()

  const [isAddSectorDialogOpen, setIsAddSectorDialogOpen] = useState(false)
  const [searchTerm, setSearchTerm] = useState('')
  const [viewMode, setViewMode] = useState<'card' | 'list'>('card')
  const [unitFilter, setUnitFilter] = useState<string[]>(
    urlUnitId ? [urlUnitId] : []
  )

  const unitsRef = useMemoFirebase(
    () =>
      firestore
        ? collection(firestore, 'clients', contractId, 'units')
        : null,
    [firestore, contractId]
  )
  const { data: units, isLoading: isLoadingUnits } =
    useCollection<Unit>(unitsRef)

  const [allSectors, setAllSectors] = useState<Sector[]>([])
  const [isLoadingSectors, setIsLoadingSectors] = useState(true)

  useEffect(() => {
    if (units && firestore) {
      setIsLoadingSectors(true)
      const fetchAllSectors = async () => {
        try {
          const sectorsData: Sector[] = []
          for (const unit of units) {
            const sectorsColRef = collection(
              firestore,
              `clients/${contractId}/units/${unit.id}/sectors`
            )
            const sectorsSnap = await getDocs(sectorsColRef)
            sectorsSnap.forEach((doc) => {
              sectorsData.push({
                id: doc.id,
                ...doc.data(),
                unitId: unit.id,
              } as Sector)
            })
          }
          setAllSectors(sectorsData)
        } catch (error) {
          console.error('Error fetching sectors:', error)
          setAllSectors([])
        } finally {
          setIsLoadingSectors(false)
        }
      }
      fetchAllSectors()
    } else if (!isLoadingUnits) {
      setIsLoadingSectors(false)
    }
  }, [units, firestore, contractId, isLoadingUnits])

  const filteredSectors = useMemo(() => {
    let filtered = allSectors
    if (unitFilter.length > 0) {
      filtered = filtered.filter((sector) => unitFilter.includes(sector.unitId))
    }
    if (searchTerm) {
      filtered = filtered.filter(
        (sector) =>
          sector.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
          (sector.description &&
            sector.description.toLowerCase().includes(searchTerm.toLowerCase()))
      )
    }
    return filtered
  }, [allSectors, unitFilter, searchTerm])

  const handleAddSector = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault()
    if (!firestore) return

    const formData = new FormData(e.currentTarget)
    const unitId = formData.get('unitId') as string
    if (!unitId) {
      toast({
        title: 'Erro',
        description: 'Por favor, selecione uma unidade.',
        variant: 'destructive',
      })
      return
    }

    const sectorsColRef = collection(
      firestore,
      `clients/${contractId}/units/${unitId}/sectors`
    )

    const newSectorData = {
      code: formData.get('code') as string,
      name: formData.get('name') as string,
      description: formData.get('description') as string,
      unitId: unitId,
    }

    // Non-blocking update
    addDocumentNonBlocking(sectorsColRef, newSectorData)

    // Optimistic UI update
    setAllSectors((prev) => [
      ...prev,
      { id: `optimistic-${Date.now()}`, ...newSectorData },
    ])

    toast({
      title: 'Setor Adicionado!',
      description: `O setor "${newSectorData.name}" foi criado.`,
    })
    setIsAddSectorDialogOpen(false)
  }

  const getUnitName = (unitId: string) => {
    return units?.find((unit) => unit.id === unitId)?.name || 'N/A'
  }

  const selectedUnitName =
    unitFilter.length === 1 && units
      ? getUnitName(unitFilter[0])
      : 'Todos os Setores'

  const renderSectorForm = () => (
    <div className='grid gap-4 py-4'>
      <div className='space-y-2'>
        <Label htmlFor='unitId'>Unidade</Label>
        <Select name='unitId' defaultValue={urlUnitId || ''} required>
          <SelectTrigger>
            <SelectValue placeholder='Selecione a unidade' />
          </SelectTrigger>
          <SelectContent>
            {units?.map((unit) => (
              <SelectItem key={unit.id} value={unit.id!}>
                {unit.name}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>
      </div>
      <div className='grid grid-cols-3 gap-4'>
        <div className='space-y-2 col-span-2'>
          <Label htmlFor='name'>Nome do Setor</Label>
          <Input id='name' name='name' required />
        </div>
        <div className='space-y-2'>
          <Label htmlFor='code'>Código</Label>
          <Input id='code' name='code' placeholder='Opcional' />
        </div>
      </div>
      <div className='space-y-2'>
        <Label htmlFor='description'>Descrição</Label>
        <Textarea id='description' name='description' />
      </div>
    </div>
  )

  const isLoading = isLoadingUnits || isLoadingSectors

  return (
    <>
      <Card>
        <CardHeader>
          <div className='flex items-start justify-between'>
            <div>
              <CardTitle>{selectedUnitName}</CardTitle>
              <CardDescription>
                Gerencie os setores, departamentos e postos de trabalho desta
                unidade.
              </CardDescription>
            </div>
            <div className='flex items-center gap-2'>
              <div className='flex items-center gap-1 rounded-lg bg-muted p-1'>
                <Button
                  variant={viewMode === 'card' ? 'secondary' : 'ghost'}
                  size='icon'
                  className='h-8 w-8'
                  onClick={() => setViewMode('card')}
                >
                  <LayoutGrid className='h-4 w-4' />
                </Button>
                <Button
                  variant={viewMode === 'list' ? 'secondary' : 'ghost'}
                  size='icon'
                  className='h-8 w-8'
                  onClick={() => setViewMode('list')}
                >
                  <List className='h-4 w-4' />
                </Button>
              </div>
              <Dialog
                open={isAddSectorDialogOpen}
                onOpenChange={setIsAddSectorDialogOpen}
              >
                <DialogTrigger asChild>
                  <Button size='sm' className='h-10 gap-1'>
                    <PlusCircle className='h-3.5 w-3.5' />
                    <span className='sr-only sm:not-sr-only sm:whitespace-nowrap'>
                      Adicionar Setor
                    </span>
                  </Button>
                </DialogTrigger>
                <DialogContent>
                  <DialogHeader>
                    <DialogTitle>Adicionar Novo Setor</DialogTitle>
                  </DialogHeader>
                  <form id='add-sector-form' onSubmit={handleAddSector}>
                    {renderSectorForm()}
                  </form>
                  <DialogFooter>
                    <Button
                      variant='outline'
                      onClick={() => setIsAddSectorDialogOpen(false)}
                    >
                      Cancelar
                    </Button>
                    <Button type='submit' form='add-sector-form'>
                      Salvar
                    </Button>
                  </DialogFooter>
                </DialogContent>
              </Dialog>
            </div>
          </div>
          <div className='pt-4 flex items-center gap-2'>
            <div className='relative flex-1'>
              <Search className='absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground' />
              <Input
                placeholder='Buscar setor...'
                className='pl-8 w-full'
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
              />
            </div>
            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <Button variant='outline' size='sm' className='h-10 gap-1'>
                  <Filter className='h-3.5 w-3.5' />
                  <span className='sr-only sm:not-sr-only'>Unidade</span>
                </Button>
              </DropdownMenuTrigger>
              <DropdownMenuContent align='end'>
                <DropdownMenuLabel>Filtrar por Unidade</DropdownMenuLabel>
                <DropdownMenuSeparator />
                {units?.map((unit) => (
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
        </CardHeader>
        <CardContent>
          {isLoading ? (
            <div className='flex items-center justify-center h-64'>
              <Loader2 className='h-8 w-8 animate-spin' />
            </div>
          ) : filteredSectors.length > 0 ? (
            <>
              {viewMode === 'card' ? (
                <div className='grid gap-6 md:grid-cols-2 lg:grid-cols-3'>
                  {filteredSectors.map((sector) => (
                    <Card
                      key={sector.id}
                      onClick={() =>
                        router.push(
                          `/dashboard/clients/${contractId}/sectors/${sector.id}?unitId=${sector.unitId}`
                        )
                      }
                      className='flex flex-col h-full hover:shadow-md transition-shadow cursor-pointer'
                    >
                      <CardHeader>
                        <CardTitle>{sector.name}</CardTitle>
                        <CardDescription>
                          <Badge variant='outline'>
                            {getUnitName(sector.unitId)}
                          </Badge>
                        </CardDescription>
                      </CardHeader>
                      <CardContent className='flex-grow'>
                        <p className='text-sm text-muted-foreground line-clamp-2'>
                          {sector.description}
                        </p>
                      </CardContent>
                      <CardFooter className='flex flex-wrap items-center gap-2'>
                        <Button
                          asChild
                          className='flex-1'
                          variant='outline'
                          size='sm'
                        >
                          <Link
                            href={`/dashboard/clients/${contractId}/roles?sectorId=${sector.id}`}
                            onClick={(e) => e.stopPropagation()}
                          >
                            Cargos <ArrowRight className='ml-2 h-4 w-4' />
                          </Link>
                        </Button>
                        <Button
                          asChild
                          className='flex-1'
                          variant='outline'
                          size='sm'
                        >
                          <Link
                            href={`/dashboard/clients/${contractId}/environments?unitId=${sector.unitId}&sectorId=${sector.id}`}
                            onClick={(e) => e.stopPropagation()}
                          >
                            Postos de Trabalho{' '}
                            <ArrowRight className='ml-2 h-4 w-4' />
                          </Link>
                        </Button>
                      </CardFooter>
                    </Card>
                  ))}
                </div>
              ) : (
                <Table>
                  <TableHeader>
                    <TableRow>
                      <TableHead>Setor</TableHead>
                      <TableHead className='hidden md:table-cell'>
                        Unidade
                      </TableHead>
                      <TableHead>
                        <span className='sr-only'>Ações</span>
                      </TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {filteredSectors.map((sector) => (
                      <TableRow
                        key={sector.id}
                        onClick={() =>
                          router.push(
                            `/dashboard/clients/${contractId}/sectors/${sector.id}?unitId=${sector.unitId}`
                          )
                        }
                        className='cursor-pointer'
                      >
                        <TableCell>
                          <div className='font-medium'>{sector.name}</div>
                          <div className='hidden text-sm text-muted-foreground md:inline'>
                            {sector.description}
                          </div>
                        </TableCell>
                        <TableCell className='hidden md:table-cell'>
                          <Badge variant='outline'>
                            {getUnitName(sector.unitId)}
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
              )}
            </>
          ) : (
            <div className='flex flex-1 items-center justify-center rounded-lg border border-dashed shadow-sm h-96'>
              <div className='flex flex-col items-center gap-1 text-center'>
                <h3 className='text-2xl font-bold tracking-tight'>
                  Nenhum setor encontrado
                </h3>
                <p className='text-sm text-muted-foreground'>
                  Ajuste os filtros ou adicione um novo setor.
                </p>
                <Button
                  className='mt-4'
                  onClick={() => setIsAddSectorDialogOpen(true)}
                >
                  Adicionar Setor
                </Button>
              </div>
            </div>
          )}
        </CardContent>
      </Card>
    </>
  )
}

    