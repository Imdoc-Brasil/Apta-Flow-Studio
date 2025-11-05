'use client'

import { useState } from 'react'
import { useSearchParams, useParams } from 'next/navigation'
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
  CardFooter,
} from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { MoreHorizontal, PlusCircle, Users, ArrowRight } from 'lucide-react'
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
import { Badge } from '@/components/ui/badge'
import { useRolesStore, type Role } from '../roles/page'
import { Checkbox } from '@/components/ui/checkbox'
import { ScrollArea } from '@/components/ui/scroll-area'
import { initialUnitsData } from '../units/page'
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select'
import Link from 'next/link'
import { initialEmployeesData } from '../employees/page'

export interface Sector {
  id: string
  name: string
  description: string
  unitId: string
  roles: string[] // Array of role IDs
}

export const initialSectorsData: Sector[] = [
  {
    id: 'SEC-001',
    name: 'Administrativo',
    description: 'Atividades de escritório e gestão.',
    unitId: 'UNIT-001',
    roles: ['ROLE-001'],
  },
  {
    id: 'SEC-002',
    name: 'Produção',
    description: 'Linha de montagem e fabricação.',
    unitId: 'UNIT-001',
    roles: ['ROLE-002'],
  },
  {
    id: 'SEC-003',
    name: 'Logística',
    description: 'Armazenamento e expedição.',
    unitId: 'UNIT-002',
    roles: ['ROLE-003'],
  },
]

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

  const handleSave = () => {
    // updateRole({ ...role, name, description })
    setIsOpen(false)
  }

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

function AddRoleDialog({ onRoleAdded }: { onRoleAdded: (newRole: any) => void }) {
  const [open, setOpen] = useState(false)
  const [name, setName] = useState('')
  const [description, setDescription] = useState('')

  const handleAddRole = () => {
    const newRole = {
      id: `ROLE-${Date.now()}`,
      name,
      description,
    }
    onRoleAdded(newRole)
    setOpen(false)
    setName('')
    setDescription('')
  }

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>
        <Button variant='outline' size='sm'>
          <PlusCircle className='mr-2 h-4 w-4' />
          Criar Novo Cargo
        </Button>
      </DialogTrigger>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>Criar Novo Cargo</DialogTitle>
          <DialogDescription>
            Adicione um novo cargo que não está na lista.
          </DialogDescription>
        </DialogHeader>
        <div className='grid gap-4 py-4'>
          <div className='grid grid-cols-4 items-center gap-4'>
            <Label htmlFor='role-name' className='text-right'>
              Nome
            </Label>
            <Input
              id='role-name'
              value={name}
              onChange={(e) => setName(e.target.value)}
              className='col-span-3'
            />
          </div>
          <div className='grid grid-cols-4 items-center gap-4'>
            <Label htmlFor='role-desc' className='text-right'>
              Descrição
            </Label>
            <Textarea
              id='role-desc'
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              className='col-span-3'
            />
          </div>
        </div>
        <DialogFooter>
          <Button variant='outline' onClick={() => setOpen(false)}>
            Cancelar
          </Button>
          <Button onClick={handleAddRole}>Salvar Cargo</Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  )
}

function ManageSectorDialog({
  sector,
  onUpdateRoles,
}: {
  sector: Sector
  onUpdateRoles: (sectorId: string, roleId: string) => void
}) {
  const { roles, addRole } = useRolesStore()
  const [isOpen, setIsOpen] = useState(false)

  return (
    <Dialog open={isOpen} onOpenChange={setIsOpen}>
      <DialogTrigger asChild>
        <Button>Gerenciar Cargos</Button>
      </DialogTrigger>
      <DialogContent className='sm:max-w-2xl'>
        <DialogHeader>
          <DialogTitle>Gerenciar Setor: {sector.name}</DialogTitle>
          <DialogDescription>{sector.description}</DialogDescription>
        </DialogHeader>
        <div className='grid grid-cols-2 gap-6 py-4'>
          <div>
            <h4 className='font-semibold mb-2'>Cargos no Setor</h4>
            <ScrollArea className='h-60 w-full rounded-md border p-4'>
              {sector.roles.length > 0 ? (
                sector.roles.map((roleId) => {
                  const role = roles.find((r) => r.id === roleId)
                  if (!role) return null
                  return (
                    <div
                      key={roleId}
                      className='flex items-center justify-between'
                    >
                      <RoleEditDialog
                        role={role}
                        trigger={
                          <span className='cursor-pointer hover:underline'>
                            {role.name}
                          </span>
                        }
                      />
                      <Button
                        variant='ghost'
                        size='sm'
                        onClick={() => onUpdateRoles(sector.id, roleId)}
                      >
                        Remover
                      </Button>
                    </div>
                  )
                })
              ) : (
                <p className='text-sm text-muted-foreground'>
                  Nenhum cargo neste setor.
                </p>
              )}
            </ScrollArea>
          </div>
          <div>
            <h4 className='font-semibold mb-2'>Adicionar Cargos</h4>
            <ScrollArea className='h-60 w-full rounded-md border p-4'>
              {roles
                .filter((role) => !sector.roles.includes(role.id))
                .map((role) => (
                  <div
                    key={role.id}
                    className='flex items-center justify-between'
                  >
                    <span>{role.name}</span>
                    <Button
                      variant='outline'
                      size='sm'
                      onClick={() => onUpdateRoles(sector.id, role.id)}
                    >
                      Adicionar
                    </Button>
                  </div>
                ))}
            </ScrollArea>
            <div className='mt-4'>
              <AddRoleDialog onRoleAdded={addRole} />
            </div>
          </div>
        </div>
        <DialogFooter>
          <Button onClick={() => setIsOpen(false)}>Fechar</Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  )
}

export default function SectorsPage() {
  const params = useParams()
  const contractId = params.contractId as string
  const searchParams = useSearchParams()
  const unitId = searchParams.get('unitId')
  const unit = initialUnitsData.find((u) => u.id === unitId)

  const [sectors, setSectors] = useState(initialSectorsData)
  const [isDialogOpen, setIsDialogOpen] = useState(false)
  const { roles, addRole } = useRolesStore()

  const unitSectors = sectors.filter((s) => s.unitId === unitId)

  const handleAddSector = (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault()
    const formData = new FormData(event.currentTarget)
    const newSector: Sector = {
      id: `SEC-${Math.random().toString(36).substring(2, 5).toUpperCase()}`,
      name: formData.get('name') as string,
      description: formData.get('description') as string,
      unitId: formData.get('unitId') as string,
      roles: [],
    }
    setSectors((prev) => [newSector, ...prev])
    setIsDialogOpen(false)
    ;(event.target as HTMLFormElement).reset()
  }

  const handleUpdateSectorRoles = (sectorId: string, roleId: string) => {
    setSectors((prevSectors) =>
      prevSectors.map((sector) => {
        if (sector.id === sectorId) {
          const isRoleInSector = sector.roles.includes(roleId)
          if (isRoleInSector) {
            return {
              ...sector,
              roles: sector.roles.filter((r) => r !== roleId),
            }
          } else {
            return { ...sector, roles: [...sector.roles, roleId] }
          }
        }
        return sector
      })
    )
  }

  const getEmployeeCountForRole = (roleName: string) => {
    return initialEmployeesData.filter((emp) => emp.role === roleName).length
  }

  if (!unit) {
    return (
      <div className='text-center p-8'>
        <h2 className='text-2xl font-bold'>Unidade não encontrada</h2>
        <p className='text-muted-foreground'>
          Selecione uma unidade para ver seus setores.
        </p>
        <Button asChild className='mt-4'>
          <Link href={`/dashboard/clients/${contractId}/units`}>
            Voltar para Unidades
          </Link>
        </Button>
      </div>
    )
  }

  return (
    <Card>
      <CardHeader>
        <CardTitle className='flex items-center justify-between'>
          <span>Mapa de Setores: {unit.name}</span>
          <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
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
                <DialogDescription>
                  Preencha os detalhes do novo setor ou departamento.
                </DialogDescription>
              </DialogHeader>
              <form id='add-sector-form' onSubmit={handleAddSector}>
                <div className='grid gap-4 py-4'>
                  <div className='grid grid-cols-4 items-center gap-4'>
                    <Label htmlFor='unitId' className='text-right'>
                      Unidade
                    </Label>
                    <Select
                      name='unitId'
                      required
                      defaultValue={unitId || undefined}
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
                    onClick={() => setIsDialogOpen(false)}
                  >
                    Cancelar
                  </Button>
                  <Button type='submit'>Salvar</Button>
                </DialogFooter>
              </form>
            </DialogContent>
          </Dialog>
        </CardTitle>
        <CardDescription>
          Selecione um setor para visualizar seus cargos.
        </CardDescription>
      </CardHeader>
      <CardContent>
        {unitSectors.length > 0 ? (
          <div className='grid gap-6 md:grid-cols-2 lg:grid-cols-3'>
            {unitSectors.map((sector) => (
              <Card key={sector.id} className='flex flex-col'>
                <CardHeader>
                  <CardTitle className='flex items-center justify-between'>
                    <span className='flex items-center gap-2'>
                      <Users className='h-5 w-5 text-muted-foreground' />
                      {sector.name}
                    </span>
                  </CardTitle>
                  <CardDescription>{sector.description}</CardDescription>
                </CardHeader>
                <CardContent className='flex-grow'>
                  <h4 className='font-semibold text-sm mb-2'>Cargos:</h4>
                  {sector.roles.length > 0 ? (
                    <div className='space-y-2'>
                      {sector.roles.map((roleId) => {
                        const role = roles.find((r) => r.id === roleId)
                        const employeeCount = role
                          ? getEmployeeCountForRole(role.name)
                          : 0
                        return (
                          <div key={roleId} className='text-sm'>
                            {role?.name || 'Cargo desconhecido'}{' '}
                            <span className='text-muted-foreground'>
                              ({employeeCount})
                            </span>
                          </div>
                        )
                      })}
                    </div>
                  ) : (
                    <p className='text-xs text-muted-foreground'>
                      Nenhum cargo adicionado.
                    </p>
                  )}
                </CardContent>
                <CardFooter className='flex-col items-stretch gap-2'>
                  <Button asChild className='w-full'>
                    <Link
                      href={`/dashboard/clients/${contractId}/roles?unitId=${unitId}&sectorId=${sector.id}`}
                    >
                      Ver Cargos <ArrowRight className='ml-2 h-4 w-4' />
                    </Link>
                  </Button>
                  <ManageSectorDialog
                    sector={sector}
                    onUpdateRoles={handleUpdateSectorRoles}
                  />
                </CardFooter>
              </Card>
            ))}
          </div>
        ) : (
          <div className='flex flex-1 items-center justify-center rounded-lg border border-dashed shadow-sm h-96'>
            <div className='flex flex-col items-center gap-1 text-center'>
              <h3 className='text-2xl font-bold tracking-tight'>
                Nenhum setor cadastrado para esta unidade
              </h3>
              <p className='text-sm text-muted-foreground'>
                Comece adicionando o primeiro setor para esta unidade.
              </p>
              <Button className='mt-4' onClick={() => setIsDialogOpen(true)}>
                Adicionar Setor
              </Button>
            </div>
          </div>
        )}
      </CardContent>
    </Card>
  )
}
