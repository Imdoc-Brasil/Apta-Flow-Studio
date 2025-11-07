'use client'

import { useState, useMemo } from 'react'
import { MoreHorizontal, PlusCircle, Search } from 'lucide-react'
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
import { initialRolesData, type Role } from './data'
import { initialSectorsData, type Sector } from '../sectors/data'
import { initialUnitsData, type Unit } from '../units/data'
import { initialEnvironmentsData } from '../environments/data'
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
import { initialActivitiesData } from '../activities/data'

export default function RolesPage() {
  const [roles, setRoles] = useState(initialRolesData)
  const [isAddDialogOpen, setIsAddDialogOpen] = useState(false)
  const [searchTerm, setSearchTerm] = useState('')
  const { toast } = useToast()

  const sectorsWithUnit = useMemo(() => {
    return initialSectorsData.map((sector) => {
      const unit = initialUnitsData.find((u) => u.id === sector.unitId)
      return { ...sector, unitName: unit?.name || 'N/A' }
    })
  }, [])

  const getSectorInfo = (sectorId: string) => {
    return sectorsWithUnit.find((s) => s.id === sectorId)
  }

  const filteredRoles = useMemo(() => {
    return roles.filter(
      (role) =>
        role.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
        role.description.toLowerCase().includes(searchTerm.toLowerCase())
    )
  }, [roles, searchTerm])

  const handleAddRole = (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault()
    const formData = new FormData(event.currentTarget)
    const additionalWorkstationIds = initialEnvironmentsData
      .map((env) => env.id)
      .filter((id) => formData.get(`additional-${id}`) === 'on')

    const newRole: Role = {
      id: `ROLE-${Date.now().toString().slice(-4)}`,
      name: formData.get('name') as string,
      cbo: formData.get('cbo') as string,
      sectorId: formData.get('sectorId') as string,
      description: formData.get('description') as string,
      activities: formData.getAll('activities') as string[],
      requirements: formData.get('requirements') as string,
      mainWorkstationId: formData.get('mainWorkstationId') as string,
      additionalWorkstationIds,
      requiredExams: formData.get('requiredExams') as string,
    }
    setRoles((prev) => [...prev, newRole])
    setIsAddDialogOpen(false)
    toast({
      title: 'Cargo Adicionado!',
      description: `O cargo "${newRole.name}" foi adicionado.`,
    })
  }

  return (
    <Card>
      <CardHeader>
        <CardTitle>Cargos</CardTitle>
        <CardDescription>
          Gerencie os cargos e suas atribuições dentro de cada setor.
        </CardDescription>
        <div className='flex items-center justify-between pt-4'>
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
          <Dialog open={isAddDialogOpen} onOpenChange={setIsAddDialogOpen}>
            <DialogTrigger asChild>
              <Button size='sm' className='h-8 gap-1'>
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
                          {initialEnvironmentsData.map((env) => (
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
                          {initialEnvironmentsData.map((env) => (
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
                       <Select name='activities' multiple>
                        <SelectTrigger>
                          <SelectValue placeholder='Selecione as atividades do catálogo' />
                        </SelectTrigger>
                        <SelectContent>
                          {initialActivitiesData.map((activity) => (
                             <SelectItem key={activity.id} value={activity.name}>
                              {activity.name}
                            </SelectItem>
                          ))}
                        </SelectContent>
                      </Select>
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
      </CardContent>
    </Card>
  )
}
