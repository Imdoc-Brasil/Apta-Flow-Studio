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
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Textarea } from '@/components/ui/textarea'
import { initialUnitsData } from '../units/data'
import { Badge } from '@/components/ui/badge'
import { initialSectorsData, type Sector } from './data'
import { cn } from '@/lib/utils'
import Link from 'next/link'
import { useToast } from '@/hooks/use-toast'

export default function SectorsPage() {
  const params = useParams()
  const router = useRouter()
  const { toast } = useToast()
  const contractId = params.contractId as string
  const searchParams = useSearchParams()
  const selectedUnitId = searchParams.get('unitId')

  const [sectors, setSectors] = useState(initialSectorsData)
  const [isAddSectorDialogOpen, setIsAddSectorDialogOpen] = useState(false)
  const [isEditSectorDialogOpen, setIsEditSectorDialogOpen] = useState(false)
  const [editingSector, setEditingSector] = useState<Sector | null>(null)
  const [searchTerm, setSearchTerm] = useState('')
  const [viewMode, setViewMode] = useState<'card' | 'list'>('card')

  useEffect(() => {
    // This is an empty effect to force a re-render and fix chunk loading issues.
  }, [])

  const filteredSectors = useMemo(() => {
    let filtered = sectors
    if (selectedUnitId) {
      filtered = filtered.filter((sector) => sector.unitId === selectedUnitId)
    }
    if (searchTerm) {
      filtered = filtered.filter(
        (sector) =>
          sector.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
          sector.description.toLowerCase().includes(searchTerm.toLowerCase())
      )
    }
    return filtered
  }, [sectors, selectedUnitId, searchTerm])

  const handleAddSector = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault()
    const formData = new FormData(e.currentTarget)
    const newSector: Sector = {
      id: `SEC-${Date.now().toString().slice(-4)}`,
      name: formData.get('name') as string,
      description: formData.get('description') as string,
      unitId: formData.get('unitId') as string,
    }
    setSectors((prev) => [...prev, newSector])
    setIsAddSectorDialogOpen(false)
    toast({ title: 'Setor Adicionado!', description: `O setor "${newSector.name}" foi criado.` })
  }
  
  const handleEditSector = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault()
    if (!editingSector) return
    
    const formData = new FormData(e.currentTarget)
    const updatedSector: Sector = {
      ...editingSector,
      name: formData.get('name') as string,
      description: formData.get('description') as string,
    }

    setSectors(prev => prev.map(s => s.id === editingSector.id ? updatedSector : s))
    setIsEditSectorDialogOpen(false)
    setEditingSector(null)
    toast({ title: 'Setor Atualizado!', description: `O setor "${updatedSector.name}" foi atualizado.` })
  }

  const getUnitName = (unitId: string) => {
    return initialUnitsData.find((unit) => unit.id === unitId)?.name || 'N/A'
  }

  const selectedUnitName = selectedUnitId
    ? getUnitName(selectedUnitId)
    : 'Todos os Setores'
    
  const openEditDialog = (sector: Sector) => {
    setEditingSector(sector)
    setIsEditSectorDialogOpen(true)
  }

  const renderSectorForm = (sector?: Sector | null) => (
    <div className='grid gap-4 py-4'>
      <div className='space-y-2'>
        <Label htmlFor='unitId'>Unidade</Label>
        <Input
          id='unitId'
          name='unitId'
          readOnly
          defaultValue={getUnitName(sector?.unitId || selectedUnitId || '')}
        />
        <input
          type='hidden'
          name='unitId'
          value={sector?.unitId || selectedUnitId || ''}
        />
      </div>
      <div className='space-y-2'>
        <Label htmlFor='name'>Nome do Setor</Label>
        <Input id='name' name='name' defaultValue={sector?.name} required />
      </div>
      <div className='space-y-2'>
        <Label htmlFor='description'>Descrição</Label>
        <Textarea id='description' name='description' defaultValue={sector?.description} />
      </div>
    </div>
  )

  return (
    <>
      <Card>
        <CardHeader>
          <div className='flex items-start justify-between'>
            <div>
              <CardTitle>{selectedUnitName}</CardTitle>
              <CardDescription>
                Gerencie os setores, departamentos e ambientes de trabalho desta
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
                  <Button size='sm' className='h-8 gap-1'>
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
          <div className='pt-4'>
            <div className='relative'>
              <Search className='absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground' />
              <Input
                placeholder='Buscar setor...'
                className='pl-8'
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
              />
            </div>
          </div>
        </CardHeader>
        <CardContent>
          {viewMode === 'card' ? (
            <div className='grid gap-6 md:grid-cols-2 lg:grid-cols-3'>
              {filteredSectors.map((sector) => (
                <Card
                  key={sector.id}
                  className='flex flex-col hover:shadow-md transition-shadow'
                >
                  <div className='flex-grow cursor-pointer' onClick={() => openEditDialog(sector)}>
                    <CardHeader>
                      <CardTitle>{sector.name}</CardTitle>
                      <CardDescription>
                        <Badge variant='outline'>{getUnitName(sector.unitId)}</Badge>
                      </CardDescription>
                    </CardHeader>
                    <CardContent>
                      <p className='text-sm text-muted-foreground line-clamp-2'>
                        {sector.description}
                      </p>
                    </CardContent>
                  </div>
                  <CardFooter>
                    <Button asChild className='w-full' variant='outline'>
                      <Link
                        href={`/dashboard/clients/${contractId}/roles?sectorId=${sector.id}`}
                        onClick={(e) => e.stopPropagation()}
                      >
                        Ver Cargos <ArrowRight className='ml-2 h-4 w-4' />
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
                  <TableHead className='hidden md:table-cell'>Unidade</TableHead>
                  <TableHead className='hidden sm:table-cell'>
                    Colaboradores
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
                    onClick={() => openEditDialog(sector)}
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
                    <TableCell className='hidden sm:table-cell'>-</TableCell>
                    <TableCell>
                      <Button aria-haspopup='true' size='icon' variant='ghost'>
                        <MoreHorizontal className='h-4 w-4' />
                        <span className='sr-only'>Alternar menu</span>
                      </Button>
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          )}
          {filteredSectors.length === 0 && (
            <div className='flex flex-1 items-center justify-center rounded-lg border border-dashed shadow-sm h-96'>
              <div className='flex flex-col items-center gap-1 text-center'>
                <h3 className='text-2xl font-bold tracking-tight'>
                  Nenhum setor encontrado
                </h3>
                <p className='text-sm text-muted-foreground'>
                  Ajuste seus filtros ou adicione um novo setor.
                </p>
                <Button
                  className='mt-4'
                  onClick={() => setIsAddSectorDialogOpen(true)}
                  disabled={!selectedUnitId}
                >
                  Adicionar Setor
                </Button>
              </div>
            </div>
          )}
        </CardContent>
      </Card>
      
      {/* Edit Dialog */}
      <Dialog open={isEditSectorDialogOpen} onOpenChange={setIsEditSectorDialogOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Editar Setor</DialogTitle>
             <DialogDescription>
                Visualize e atualize os detalhes do setor.
              </DialogDescription>
          </DialogHeader>
          <form id='edit-sector-form' onSubmit={handleEditSector}>
            {renderSectorForm(editingSector)}
          </form>
          <DialogFooter>
            <Button
              variant='outline'
              onClick={() => setIsEditSectorDialogOpen(false)}
            >
              Cancelar
            </Button>
            <Button type='submit' form='edit-sector-form'>
              Salvar Alterações
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </>
  )
}
