'use client'

import { useState } from 'react'
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
  CardFooter,
} from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { MoreHorizontal, PlusCircle, Users } from 'lucide-react'
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
import { initialEmployeesData } from '../employees/page'
import { ScrollArea } from '@/components/ui/scroll-area'

export interface Sector {
  id: string
  name: string
  description: string
  roles: string[] // Array of role IDs
}

export const initialSectorsData: Sector[] = [
  {
    id: 'SEC-001',
    name: 'Administrativo',
    description: 'Atividades de escritório e gestão.',
    roles: ['ROLE-001'],
  },
  {
    id: 'SEC-002',
    name: 'Produção',
    description: 'Linha de montagem e fabricação.',
    roles: ['ROLE-002'],
  },
  {
    id: 'SEC-003',
    name: 'Logística',
    description: 'Armazenamento e expedição.',
    roles: ['ROLE-003'],
  },
]

function AddRoleDialog({
  onRoleAdded,
}: {
  onRoleAdded: (newRole: Role) => void
}) {
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

  const getRoleName = (roleId: string) => {
    return roles.find((r) => r.id === roleId)?.name || 'Cargo desconhecido'
  }

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
                sector.roles.map((roleId) => (
                  <div
                    key={roleId}
                    className='flex items-center justify-between'
                  >
                    <span>{getRoleName(roleId)}</span>
                    <Button
                      variant='ghost'
                      size='sm'
                      onClick={() => onUpdateRoles(sector.id, roleId)}
                    >
                      Remover
                    </Button>
                  </div>
                ))
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
                  <div key={role.id} className='flex items-center justify-between'>
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
  const [sectors, setSectors] = useState(initialSectorsData)
  const [isDialogOpen, setIsDialogOpen] = useState(false)
  const { roles, addRole } = useRolesStore()

  const handleAddSector = (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault()
    const formData = new FormData(event.currentTarget)
    const newSector: Sector = {
      id: `SEC-${Math.random().toString(36).substring(2, 5).toUpperCase()}`,
      name: formData.get('name') as string,
      description: formData.get('description') as string,
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
            return { ...sector, roles: sector.roles.filter((r) => r !== roleId) }
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

  return (
    <Card>
      <CardHeader>
        <CardTitle className='flex items-center justify-between'>
          Setores
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
          Gerencie os setores ou departamentos de cada unidade do cliente e seus cargos.
        </CardDescription>
      </CardHeader>
      <CardContent>
        {sectors.length > 0 ? (
          <div className='grid gap-6 md:grid-cols-2 lg:grid-cols-3'>
            {sectors.map((sector) => (
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
                <CardFooter>
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
                Nenhum setor cadastrado
              </h3>
              <p className='text-sm text-muted-foreground'>
                Comece adicionando o primeiro setor para este cliente.
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
