
'use client'

import { useState, useMemo } from 'react'
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
  DialogTrigger,
  DialogFooter,
} from '@/components/ui/dialog'
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuCheckboxItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Textarea } from '@/components/ui/textarea'
import { initialEnvironmentsData, type Environment } from './data'
import { initialSectorsData } from '../sectors/data'
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select'
import { useToast } from '@/hooks/use-toast'
import { Badge } from '@/components/ui/badge'
import { useSearchParams } from 'next/navigation'
import { ScrollArea } from '@/components/ui/scroll-area'

export default function EnvironmentsPage() {
  const searchParams = useSearchParams()
  const urlSectorId = searchParams.get('sectorId')
  
  const [environments, setEnvironments] = useState(initialEnvironmentsData)
  const [isFormDialogOpen, setIsFormDialogOpen] = useState(false)
  const [editingEnvironment, setEditingEnvironment] = useState<Environment | null>(null)
  const [searchTerm, setSearchTerm] = useState('')
  const [sectorFilter, setSectorFilter] = useState<string[]>(urlSectorId ? [urlSectorId] : [])
  const { toast } = useToast()

  const filteredEnvironments = useMemo(() => {
    let filtered = environments
    if (sectorFilter.length > 0) {
      filtered = filtered.filter((env) => sectorFilter.includes(env.sectorId))
    }
    if (searchTerm) {
      filtered = filtered.filter((env) =>
        env.name.toLowerCase().includes(searchTerm.toLowerCase())
      )
    }
    return filtered
  }, [environments, sectorFilter, searchTerm])
  
  const getSectorName = (sectorId: string) => {
    return initialSectorsData.find((s) => s.id === sectorId)?.name || 'N/A'
  }

  const handleFormSubmit = (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault()
    const formData = new FormData(event.currentTarget)
    
    const environmentData: Omit<Environment, 'id'> = {
      name: formData.get('name') as string,
      sectorId: formData.get('sectorId') as string,
      description: formData.get('description') as string,
      activities: formData.get('activities') as string,
      equipment: formData.get('equipment') as string,
      physicalCharacteristics: {
        flooring: formData.get('flooring') as string,
        lighting: formData.get('lighting') as string,
        climateControl: formData.get('climateControl') as string,
        wallCoverings: formData.get('wallCoverings') as string,
        exhaustSystem: formData.get('exhaustSystem') as string,
      },
    };

    if (editingEnvironment) {
      // Update
      const updatedEnvironment = { ...editingEnvironment, ...environmentData }
      setEnvironments(prev => prev.map(env => env.id === editingEnvironment.id ? updatedEnvironment : env))
      toast({ title: 'Ambiente Atualizado!', description: `O ambiente "${updatedEnvironment.name}" foi atualizado.` })
    } else {
      // Create
      const newEnvironment: Environment = {
        id: `ENV-${Date.now().toString().slice(-4)}`,
        ...environmentData,
      }
      setEnvironments(prev => [...prev, newEnvironment])
      toast({ title: 'Ambiente Adicionado!', description: `O ambiente "${newEnvironment.name}" foi criado.` })
    }
    
    setIsFormDialogOpen(false)
    setEditingEnvironment(null)
  }

  const openFormDialog = (environment: Environment | null) => {
    setEditingEnvironment(environment)
    setIsFormDialogOpen(true)
  }

  const renderEnvironmentForm = (environment?: Environment | null) => (
     <ScrollArea className='h-[70vh]'>
      <div className='grid gap-6 p-1 pr-6'>
        <div className='grid grid-cols-1 md:grid-cols-2 gap-4'>
          <div className='space-y-2'>
            <Label htmlFor='name'>Nome do Ambiente</Label>
            <Input id='name' name='name' defaultValue={environment?.name} required />
          </div>
          <div className='space-y-2'>
            <Label htmlFor='sectorId'>Setor</Label>
            <Select name='sectorId' defaultValue={environment?.sectorId || urlSectorId || ''} required>
              <SelectTrigger>
                <SelectValue placeholder='Selecione o setor' />
              </SelectTrigger>
              <SelectContent>
                {initialSectorsData.map((sector) => (
                  <SelectItem key={sector.id} value={sector.id}>
                    {sector.name}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>
        </div>

        <div className='space-y-2'>
          <Label htmlFor='description'>Descrição do Ambiente</Label>
          <Textarea id='description' name='description' defaultValue={environment?.description} placeholder='Descreva o propósito geral deste ambiente/etapa.' />
        </div>
        <div className='space-y-2'>
          <Label htmlFor='activities'>Atividades Desenvolvidas</Label>
          <Textarea id='activities' name='activities' defaultValue={environment?.activities} placeholder='Liste as principais tarefas realizadas neste local.'/>
        </div>
        <div className='space-y-2'>
          <Label htmlFor='equipment'>Máquinas e Equipamentos</Label>
          <Textarea id='equipment' name='equipment' defaultValue={environment?.equipment} placeholder='Liste as máquinas e equipamentos presentes.' />
        </div>

        <fieldset className='rounded-lg border p-4'>
          <legend className='-ml-1 px-1 text-sm font-medium'>Características Físicas</legend>
          <div className='grid grid-cols-1 md:grid-cols-2 gap-4 pt-2'>
            <div className='space-y-2'>
              <Label htmlFor='flooring'>Tipo de Piso</Label>
              <Input id='flooring' name='flooring' defaultValue={environment?.physicalCharacteristics.flooring} />
            </div>
            <div className='space-y-2'>
              <Label htmlFor='lighting'>Iluminação</Label>
              <Input id='lighting' name='lighting' defaultValue={environment?.physicalCharacteristics.lighting} />
            </div>
            <div className='space-y-2'>
              <Label htmlFor='climateControl'>Climatização</Label>
              <Input id='climateControl' name='climateControl' defaultValue={environment?.physicalCharacteristics.climateControl} />
            </div>
            <div className='space-y-2'>
              <Label htmlFor='wallCoverings'>Revestimento de Paredes</Label>
              <Input id='wallCoverings' name='wallCoverings' defaultValue={environment?.physicalCharacteristics.wallCoverings} />
            </div>
            <div className='space-y-2'>
              <Label htmlFor='exhaustSystem'>Sistema de Exaustão</Label>
              <Input id='exhaustSystem' name='exhaustSystem' defaultValue={environment?.physicalCharacteristics.exhaustSystem} />
            </div>
          </div>
        </fieldset>
      </div>
    </ScrollArea>
  );

  return (
    <>
      <Card>
        <CardHeader>
          <CardTitle>Ambientes de Trabalho</CardTitle>
          <CardDescription>
            Gerencie os locais de trabalho, postos e etapas de processo dentro de cada setor.
          </CardDescription>
          <div className='flex items-center justify-between pt-4'>
            <div className='flex items-center gap-2'>
              <div className='relative w-full max-w-sm'>
                <Search className='absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground' />
                <Input
                  type='search'
                  placeholder='Buscar por nome do ambiente...'
                  className='pl-8'
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                />
              </div>
              <DropdownMenu>
                <DropdownMenuTrigger asChild>
                  <Button variant='outline' size='sm' className='h-10 gap-1 text-sm'>
                    <Filter className='h-3.5 w-3.5' />
                    <span className='sr-only sm:not-sr-only'>Filtrar por Setor</span>
                  </Button>
                </DropdownMenuTrigger>
                <DropdownMenuContent align='end'>
                  <DropdownMenuLabel>Filtrar por Setor</DropdownMenuLabel>
                  <DropdownMenuSeparator />
                  {initialSectorsData.map((sector) => (
                    <DropdownMenuCheckboxItem
                      key={sector.id}
                      checked={sectorFilter.includes(sector.id)}
                      onCheckedChange={(checked) => {
                        setSectorFilter(prev => 
                          checked ? [...prev, sector.id] : prev.filter(id => id !== sector.id)
                        )
                      }}
                    >
                      {sector.name}
                    </DropdownMenuCheckboxItem>
                  ))}
                </DropdownMenuContent>
              </DropdownMenu>
            </div>
            <Button size='sm' className='h-8 gap-1' onClick={() => openFormDialog(null)}>
              <PlusCircle className='h-3.5 w-3.5' />
              <span className='sr-only sm:not-sr-only sm:whitespace-nowrap'>
                Adicionar Ambiente
              </span>
            </Button>
          </div>
        </CardHeader>
        <CardContent>
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Ambiente</TableHead>
                <TableHead className='hidden sm:table-cell'>Setor</TableHead>
                <TableHead>Atividades</TableHead>
                <TableHead>
                  <span className='sr-only'>Ações</span>
                </TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {filteredEnvironments.map((env) => (
                <TableRow key={env.id} onClick={() => openFormDialog(env)} className='cursor-pointer'>
                  <TableCell className='font-medium'>{env.name}</TableCell>
                  <TableCell className='hidden sm:table-cell'>
                    <Badge variant='outline'>{getSectorName(env.sectorId)}</Badge>
                  </TableCell>
                  <TableCell>
                     <p className='line-clamp-1 text-sm text-muted-foreground'>{env.activities}</p>
                  </TableCell>
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
      
      <Dialog open={isFormDialogOpen} onOpenChange={setIsFormDialogOpen}>
        <DialogContent className='sm:max-w-3xl'>
          <DialogHeader>
            <DialogTitle>{editingEnvironment ? 'Editar' : 'Adicionar'} Ambiente de Trabalho</DialogTitle>
            <DialogDescription>
              {editingEnvironment ? 'Atualize os detalhes' : 'Preencha os detalhes'} para este ambiente ou etapa de processo.
            </DialogDescription>
          </DialogHeader>
          <form id='environment-form' onSubmit={handleFormSubmit}>
            {renderEnvironmentForm(editingEnvironment)}
          </form>
          <DialogFooter>
            <Button variant='outline' onClick={() => { setIsFormDialogOpen(false); setEditingEnvironment(null); }}>
              Cancelar
            </Button>
            <Button type='submit' form='environment-form'>
              {editingEnvironment ? 'Salvar Alterações' : 'Salvar Ambiente'}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </>
  )
}
