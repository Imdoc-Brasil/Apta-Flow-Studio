'use client'
import { useState, useEffect, useMemo } from 'react'
import { useParams, useSearchParams } from 'next/navigation'
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import {
  PlusCircle,
  MoreHorizontal,
  Search,
  Users,
  Building,
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

export default function SectorsPage() {
  const params = useParams()
  const searchParams = useSearchParams()
  const selectedUnitId = searchParams.get('unitId')

  const [sectors, setSectors] = useState(initialSectorsData)
  const [isAddSectorDialogOpen, setIsAddSectorDialogOpen] = useState(false)
  const [searchTerm, setSearchTerm] = useState('')

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
  }

  const getUnitName = (unitId: string) => {
    return initialUnitsData.find((unit) => unit.id === unitId)?.name || 'N/A'
  }

  const selectedUnitName = selectedUnitId
    ? getUnitName(selectedUnitId)
    : 'Todos os Setores'

  return (
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
                <div className='grid gap-4 py-4'>
                  <div className='space-y-2'>
                    <Label htmlFor='unitId'>Unidade</Label>
                    <Input
                      id='unitId'
                      name='unitId'
                      readOnly
                      defaultValue={getUnitName(selectedUnitId || '')}
                    />
                     <input
                      type='hidden'
                      name='unitId'
                      value={selectedUnitId || ''}
                    />
                  </div>
                  <div className='space-y-2'>
                    <Label htmlFor='name'>Nome do Setor</Label>
                    <Input id='name' name='name' required />
                  </div>
                  <div className='space-y-2'>
                    <Label htmlFor='description'>Descrição</Label>
                    <Textarea id='description' name='description' />
                  </div>
                </div>
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
              <TableRow key={sector.id}>
                <TableCell>
                  <div className='font-medium'>{sector.name}</div>
                  <div className='hidden text-sm text-muted-foreground md:inline'>
                    {sector.description}
                  </div>
                </TableCell>
                <TableCell className='hidden md:table-cell'>
                  <Badge variant='outline'>{getUnitName(sector.unitId)}</Badge>
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
      </CardContent>
    </Card>
  )
}
