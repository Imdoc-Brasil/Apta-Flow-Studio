'use client'

import { useState, useMemo } from 'react'
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { PlusCircle, User, Filter } from 'lucide-react'
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from '@/components/ui/dialog'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Textarea } from '@/components/ui/textarea'
import { create } from 'zustand'
import { initialSectorsData } from '../sectors/page'
import { initialUnitsData } from '../units/page'
import { initialEmployeesData, type Employee } from '../employees/page'
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select'
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar'
import { Badge } from '@/components/ui/badge'

export interface Role {
  id: string
  name: string
  description: string
  unitId: string
  sectorId: string
}

export const initialRolesData: Role[] = [
  {
    id: 'ROLE-001',
    name: 'Analista Administrativo',
    description: 'Executa tarefas administrativas e de suporte.',
    unitId: 'UNIT-001',
    sectorId: 'SEC-001',
  },
  {
    id: 'ROLE-002',
    name: 'Operador de Máquinas',
    description: 'Opera equipamentos na linha de produção.',
    unitId: 'UNIT-001',
    sectorId: 'SEC-002',
  },
  {
    id: 'ROLE-003',
    name: 'Auxiliar de Logística',
    description: 'Auxilia no recebimento e expedição de materiais.',
    unitId: 'UNIT-002',
    sectorId: 'SEC-003',
  },
]

type RolesStore = {
  roles: Role[]
  setRoles: (roles: Role[]) => void
  addRole: (role: Role) => void
  updateRole: (role: Role) => void
}

export const useRolesStore = create<RolesStore>((set) => ({
  roles: initialRolesData,
  setRoles: (roles) => set({ roles }),
  addRole: (role) => set((state) => ({ roles: [role, ...state.roles] })),
  updateRole: (updatedRole) =>
    set((state) => ({
      roles: state.roles.map((role) =>
        role.id === updatedRole.id ? updatedRole : role
      ),
    })),
}))

function RoleEditDialog({
  role,
  trigger,
}: {
  role: Role
  trigger: React.ReactNode
}) {
  const { updateRole } = useRolesStore()
  const [isOpen, setIsOpen] = useState(false)
  const [name, setName] = useState(role.name)
  const [description, setDescription] = useState(role.description)
  const [unitId, setUnitId] = useState(role.unitId)
  const [sectorId, setSectorId] = useState(role.sectorId)

  const handleSave = () => {
    updateRole({ ...role, name, description, unitId, sectorId })
    setIsOpen(false)
  }

  const filteredSectors = useMemo(() => {
    return initialSectorsData.filter((s) => s.unitId === unitId)
  }, [unitId])

  return (
    <Dialog open={isOpen} onOpenChange={setIsOpen}>
      <DialogTrigger asChild>{trigger}</DialogTrigger>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>Editar Cargo</DialogTitle>
          <DialogDescription>
            Atualize as informações do cargo abaixo.
          </DialogDescription>
        </DialogHeader>
        <div className='grid gap-4 py-4'>
          <div className='grid grid-cols-4 items-center gap-4'>
            <Label htmlFor='unitId-edit' className='text-right'>
              Unidade
            </Label>
            <Select
              name='unitId-edit'
              required
              value={unitId}
              onValueChange={(value) => {
                setUnitId(value)
                setSectorId('') // Reset sector when unit changes
              }}
            >
              <SelectTrigger className='col-span-3'>
                <SelectValue placeholder='Selecione a unidade' />
              </SelectTrigger>
              <SelectContent>
                {initialUnitsData.map((u) => (
                  <SelectItem key={u.id} value={u.id}>
                    {u.name}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>
          <div className='grid grid-cols-4 items-center gap-4'>
            <Label htmlFor='sectorId-edit' className='text-right'>
              Setor
            </Label>
            <Select
              name='sectorId-edit'
              required
              value={sectorId}
              onValueChange={setSectorId}
              disabled={!unitId}
            >
              <SelectTrigger className='col-span-3'>
                <SelectValue placeholder='Selecione o setor' />
              </SelectTrigger>
              <SelectContent>
                {filteredSectors.map((s) => (
                  <SelectItem key={s.id} value={s.id}>
                    {s.name}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>
          <div className='grid grid-cols-4 items-center gap-4'>
            <Label htmlFor='edit-role-name' className='text-right'>
              Nome
            </Label>
            <Input
              id='edit-role-name'
              value={name}
              onChange={(e) => setName(e.target.value)}
              className='col-span-3'
            />
          </div>
          <div className='grid grid-cols-4 items-center gap-4'>
            <Label htmlFor='edit-role-desc' className='text-right'>
              Descrição
            </Label>
            <Textarea
              id='edit-role-desc'
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              className='col-span-3'
            />
          </div>
        </div>
        <DialogFooter>
          <Button variant='outline' onClick={() => setIsOpen(false)}>
            Cancelar
          </Button>
          <Button onClick={handleSave}>Salvar Alterações</Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  )
}

export default function RolesPage() {
  const { roles, addRole } = useRolesStore()
  const [isAddDialogOpen, setIsAddDialogOpen] = useState(false)
  const [selectedUnit, setSelectedUnit] = useState<string>('all')
  const [selectedSector, setSelectedSector] = useState<string>('all')

  const [formUnitId, setFormUnitId] = useState('')

  const filteredRoles = useMemo(() => {
    return roles.filter((role) => {
      const unitMatch = selectedUnit === 'all' || role.unitId === selectedUnit
      const sectorMatch =
        selectedSector === 'all' || role.sectorId === selectedSector
      return unitMatch && sectorMatch
    })
  }, [roles, selectedUnit, selectedSector])

  const filteredSectorsForFilter = useMemo(() => {
    if (selectedUnit === 'all') return initialSectorsData
    return initialSectorsData.filter((s) => s.unitId === selectedUnit)
  }, [selectedUnit])

  const filteredSectorsForForm = useMemo(() => {
    return initialSectorsData.filter((s) => s.unitId === formUnitId)
  }, [formUnitId])

  const handleAddRole = (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault()
    const formData = new FormData(event.currentTarget)
    const newRole: Role = {
      id: `ROLE-${Math.random().toString(36).substring(2, 5).toUpperCase()}`,
      name: formData.get('name') as string,
      description: formData.get('description') as string,
      unitId: formData.get('unitId') as string,
      sectorId: formData.get('sectorId') as string,
    }
    addRole(newRole)
    setIsAddDialogOpen(false)
    ;(event.target as HTMLFormElement).reset()
    setFormUnitId('')
  }

  const getEmployeesForRole = (roleName: string): Employee[] => {
    return initialEmployeesData.filter((emp) => emp.role === roleName)
  }

  return (
    <Card>
      <CardHeader>
        <div className='flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4'>
          <div>
            <CardTitle>Mapa de Cargos</CardTitle>
            <CardDescription>
              Visualize os cargos e os colaboradores alocados em cada um.
            </CardDescription>
          </div>
          <div className='flex items-center gap-2'>
            <Select
              value={selectedUnit}
              onValueChange={(value) => {
                setSelectedUnit(value)
                setSelectedSector('all') // Reset sector filter when unit changes
              }}
            >
              <SelectTrigger className='w-full sm:w-[180px]'>
                <SelectValue placeholder='Filtrar por Unidade' />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value='all'>Todas as Unidades</SelectItem>
                {initialUnitsData.map((unit) => (
                  <SelectItem key={unit.id} value={unit.id}>
                    {unit.name}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
            <Select
              value={selectedSector}
              onValueChange={setSelectedSector}
              disabled={selectedUnit === 'all'}
            >
              <SelectTrigger className='w-full sm:w-[180px]'>
                <SelectValue placeholder='Filtrar por Setor' />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value='all'>Todos os Setores</SelectItem>
                {filteredSectorsForFilter.map((sector) => (
                  <SelectItem key={sector.id} value={sector.id}>
                    {sector.name}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
            <Dialog open={isAddDialogOpen} onOpenChange={setIsAddDialogOpen}>
              <DialogTrigger asChild>
                <Button size='sm' className='h-10 gap-1'>
                  <PlusCircle className='h-3.5 w-3.5' />
                  <span className='sr-only sm:not-sr-only sm:whitespace-nowrap'>
                    Adicionar Cargo
                  </span>
                </Button>
              </DialogTrigger>
              <DialogContent>
                <DialogHeader>
                  <DialogTitle>Adicionar Novo Cargo</DialogTitle>
                  <DialogDescription>
                    Preencha os detalhes do novo cargo ou função.
                  </DialogDescription>
                </DialogHeader>
                <form id='add-role-form' onSubmit={handleAddRole}>
                  <div className='grid gap-4 py-4'>
                    <div className='grid grid-cols-4 items-center gap-4'>
                      <Label htmlFor='unitId' className='text-right'>
                        Unidade
                      </Label>
                      <Select
                        name='unitId'
                        required
                        onValueChange={(value) => {
                          setFormUnitId(value)
                        }}
                      >
                        <SelectTrigger className='col-span-3'>
                          <SelectValue placeholder='Selecione a unidade' />
                        </SelectTrigger>
                        <SelectContent>
                          {initialUnitsData.map((u) => (
                            <SelectItem key={u.id} value={u.id}>
                              {u.name}
                            </SelectItem>
                          ))}
                        </SelectContent>
                      </Select>
                    </div>
                    <div className='grid grid-cols-4 items-center gap-4'>
                      <Label htmlFor='sectorId' className='text-right'>
                        Setor
                      </Label>
                      <Select name='sectorId' required disabled={!formUnitId}>
                        <SelectTrigger className='col-span-3'>
                          <SelectValue placeholder='Selecione o setor' />
                        </SelectTrigger>
                        <SelectContent>
                          {filteredSectorsForForm.map((s) => (
                            <SelectItem key={s.id} value={s.id}>
                              {s.name}
                            </SelectItem>
                          ))}
                        </SelectContent>
                      </Select>
                    </div>
                    <div className='grid grid-cols-4 items-center gap-4'>
                      <Label htmlFor='name' className='text-right'>
                        Nome
                      </Label>
                      <Input
                        id='name'
                        name='name'
                        className='col-span-3'
                        required
                      />
                    </div>
                    <div className='grid grid-cols-4 items-center gap-4'>
                      <Label htmlFor='description' className='text-right'>
                        Descrição
                      </Label>
                      <Textarea
                        id='description'
                        name='description'
                        className='col-span-3'
                        required
                      />
                    </div>
                  </div>
                  <DialogFooter>
                    <Button
                      type='button'
                      variant='outline'
                      onClick={() => {
                        setIsAddDialogOpen(false)
                        setFormUnitId('')
                      }}
                    >
                      Cancelar
                    </Button>
                    <Button type='submit'>Salvar</Button>
                  </DialogFooter>
                </form>
              </DialogContent>
            </Dialog>
          </div>
        </div>
      </CardHeader>
      <CardContent>
        {filteredRoles.length > 0 ? (
          <div className='grid gap-6 md:grid-cols-2 lg:grid-cols-3'>
            {filteredRoles.map((role) => {
              const employeesInRole = getEmployeesForRole(role.name)
              return (
                <Card key={role.id} className='flex flex-col'>
                  <CardHeader>
                    <CardTitle className='flex items-center justify-between'>
                      <RoleEditDialog
                        role={role}
                        trigger={
                          <span className='flex items-center gap-2 cursor-pointer hover:underline'>
                            <User className='h-5 w-5 text-muted-foreground' />
                            {role.name}
                          </span>
                        }
                      />
                      <Badge variant='secondary'>{employeesInRole.length}</Badge>
                    </CardTitle>
                    <CardDescription>{role.description}</CardDescription>
                  </CardHeader>
                  <CardContent className='flex-grow'>
                    <h4 className='font-semibold text-sm mb-2'>
                      Colaboradores:
                    </h4>
                    {employeesInRole.length > 0 ? (
                      <div className='space-y-3'>
                        {employeesInRole.map((employee) => (
                          <div
                            key={employee.id}
                            className='flex items-center gap-3 text-sm'
                          >
                            <Avatar className='h-8 w-8'>
                              <AvatarImage />
                              <AvatarFallback>
                                {employee.name.charAt(0)}
                              </AvatarFallback>
                            </Avatar>
                            {employee.name}
                          </div>
                        ))}
                      </div>
                    ) : (
                      <p className='text-xs text-muted-foreground'>
                        Nenhum colaborador neste cargo.
                      </p>
                    )}
                  </CardContent>
                </Card>
              )
            })}
          </div>
        ) : (
          <div className='flex flex-1 items-center justify-center rounded-lg border border-dashed shadow-sm h-96'>
            <div className='flex flex-col items-center gap-1 text-center'>
              <h3 className='text-2xl font-bold tracking-tight'>
                Nenhum cargo encontrado
              </h3>
              <p className='text-sm text-muted-foreground'>
                Ajuste os filtros ou adicione um novo cargo para começar.
              </p>
              <Button
                className='mt-4'
                onClick={() => setIsAddDialogOpen(true)}
              >
                Adicionar Cargo
              </Button>
            </div>
          </div>
        )}
      </CardContent>
    </Card>
  )
}
