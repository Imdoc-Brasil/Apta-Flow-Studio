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
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu'
import { Badge } from '@/components/ui/badge'
import { initialRolesData, useRolesStore } from '../../roles/page'
import { Checkbox } from '@/components/ui/checkbox'
import { ScrollArea } from '@/components/ui/scroll-area'

interface Ghe {
  id: string
  name: string
  description: string
  roles: string[] // Array of role IDs
}

export const initialGheData: Ghe[] = [
  {
    id: 'GHE-001',
    name: 'GHE 01 - Produção',
    description:
      'Colaboradores na linha de produção expostos a ruído contínuo e movimentos repetitivos.',
    roles: ['ROLE-002', 'ROLE-003'],
  },
  {
    id: 'GHE-002',
    name: 'GHE 02 - Administrativo',
    description: 'Colaboradores em ambiente de escritório.',
    roles: ['ROLE-001'],
  },
]

function AddRoleDialog({
  onRoleAdded,
}: {
  onRoleAdded: (newRole: any) => void
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

function ManageGheDialog({
  ghe,
  onUpdateRoles,
}: {
  ghe: Ghe
  onUpdateRoles: (gheId: string, roleId: string) => void
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
          <DialogTitle>Gerenciar GHE: {ghe.name}</DialogTitle>
          <DialogDescription>{ghe.description}</DialogDescription>
        </DialogHeader>
        <div className='grid grid-cols-2 gap-6 py-4'>
          <div>
            <h4 className='font-semibold mb-2'>Cargos no GHE</h4>
            <ScrollArea className='h-60 w-full rounded-md border p-4'>
              {ghe.roles.length > 0 ? (
                ghe.roles.map((roleId) => (
                  <div
                    key={roleId}
                    className='flex items-center justify-between'
                  >
                    <span>{getRoleName(roleId)}</span>
                    <Button
                      variant='ghost'
                      size='sm'
                      onClick={() => onUpdateRoles(ghe.id, roleId)}
                    >
                      Remover
                    </Button>
                  </div>
                ))
              ) : (
                <p className='text-sm text-muted-foreground'>
                  Nenhum cargo neste GHE.
                </p>
              )}
            </ScrollArea>
          </div>
          <div>
            <h4 className='font-semibold mb-2'>Adicionar Cargos</h4>
            <ScrollArea className='h-60 w-full rounded-md border p-4'>
              {roles
                .filter((role) => !ghe.roles.includes(role.id))
                .map((role) => (
                  <div key={role.id} className='flex items-center justify-between'>
                    <span>{role.name}</span>
                    <Button
                      variant='outline'
                      size='sm'
                      onClick={() => onUpdateRoles(ghe.id, role.id)}
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

export default function GhePage() {
  const { roles, addRole } = useRolesStore()
  const [ghes, setGhes] = useState(initialGheData)
  const [isAddDialogOpen, setIsAddDialogOpen] = useState(false)

  // State for new GHE form
  const [newGheName, setNewGheName] = useState('')
  const [newGheDesc, setNewGheDesc] = useState('')
  const [selectedRoles, setSelectedRoles] = useState<string[]>([])

  const handleAddGhe = (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault()
    const newGhe: Ghe = {
      id: `GHE-${Math.random().toString(36).substring(2, 5).toUpperCase()}`,
      name: newGheName,
      description: newGheDesc,
      roles: selectedRoles,
    }
    setGhes((prev) => [newGhe, ...prev])
    setIsAddDialogOpen(false)
    // Reset form
    setNewGheName('')
    setNewGheDesc('')
    setSelectedRoles([])
  }

  const handleRoleSelection = (roleId: string, checked: boolean) => {
    setSelectedRoles((prev) =>
      checked ? [...prev, roleId] : prev.filter((id) => id !== roleId)
    )
  }

  const handleUpdateGheRoles = (gheId: string, roleId: string) => {
    setGhes((prevGhes) =>
      prevGhes.map((ghe) => {
        if (ghe.id === gheId) {
          const isRoleInGhe = ghe.roles.includes(roleId)
          if (isRoleInGhe) {
            return { ...ghe, roles: ghe.roles.filter((r) => r !== roleId) }
          } else {
            return { ...ghe, roles: [...ghe.roles, roleId] }
          }
        }
        return ghe
      })
    )
  }

  return (
    <Card>
      <CardHeader>
        <CardTitle className='flex items-center justify-between'>
          GHE - Grupos Homogêneos de Exposição
          <Dialog open={isAddDialogOpen} onOpenChange={setIsAddDialogOpen}>
            <DialogTrigger asChild>
              <Button size='sm' className='h-8 gap-1'>
                <PlusCircle className='h-3.5 w-3.5' />
                <span className='sr-only sm:not-sr-only sm:whitespace-nowrap'>
                  Adicionar GHE
                </span>
              </Button>
            </DialogTrigger>
            <DialogContent className='sm:max-w-lg'>
              <DialogHeader>
                <DialogTitle>Adicionar Novo GHE</DialogTitle>
                <DialogDescription>
                  Defina o grupo, sua descrição e os cargos que o compõem.
                </DialogDescription>
              </DialogHeader>
              <form id='add-ghe-form' onSubmit={handleAddGhe}>
                <div className='grid gap-4 py-4'>
                  <div className='space-y-2'>
                    <Label htmlFor='name'>Nome do GHE</Label>
                    <Input
                      id='name'
                      value={newGheName}
                      onChange={(e) => setNewGheName(e.target.value)}
                      placeholder='Ex: GHE 01 - Produção'
                      required
                    />
                  </div>
                  <div className='space-y-2'>
                    <Label htmlFor='description'>Descrição do Ambiente</Label>
                    <Textarea
                      id='description'
                      value={newGheDesc}
                      onChange={(e) => setNewGheDesc(e.target.value)}
                      placeholder='Descreva as atividades e o ambiente de trabalho do GHE'
                      required
                    />
                  </div>
                  <div className='space-y-2'>
                    <Label>Cargos Inclusos</Label>
                    <ScrollArea className='h-40 w-full rounded-md border p-4'>
                      {roles.map((role) => (
                        <div key={role.id} className='flex items-center gap-2 mb-2'>
                          <Checkbox
                            id={`role-${role.id}`}
                            onCheckedChange={(checked) =>
                              handleRoleSelection(role.id, checked as boolean)
                            }
                          />
                          <Label htmlFor={`role-${role.id}`}>{role.name}</Label>
                        </div>
                      ))}
                    </ScrollArea>
                    <AddRoleDialog onRoleAdded={addRole} />
                  </div>
                </div>
                <DialogFooter>
                  <Button
                    variant='outline'
                    onClick={() => setIsAddDialogOpen(false)}
                  >
                    Cancelar
                  </Button>
                  <Button type='submit'>Salvar GHE</Button>
                </DialogFooter>
              </form>
            </DialogContent>
          </Dialog>
        </CardTitle>
        <CardDescription>
          Agrupe cargos com exposições a riscos similares para facilitar a
          gestão do PGR.
        </CardDescription>
      </CardHeader>
      <CardContent>
        {ghes.length > 0 ? (
          <div className='grid gap-6 md:grid-cols-2 lg:grid-cols-3'>
            {ghes.map((ghe) => (
              <Card key={ghe.id} className='flex flex-col'>
                <CardHeader>
                  <CardTitle className='flex items-center justify-between'>
                    <span className='flex items-center gap-2'>
                      <Users className='h-5 w-5 text-muted-foreground' />
                      {ghe.name}
                    </span>
                  </CardTitle>
                  <CardDescription>{ghe.description}</CardDescription>
                </CardHeader>
                <CardContent className='flex-grow'>
                  <h4 className='font-semibold text-sm mb-2'>Cargos:</h4>
                  <div className='flex flex-wrap gap-2'>
                    {ghe.roles.map((roleId) => (
                      <Badge key={roleId} variant='secondary'>
                        {roles.find((r) => r.id === roleId)?.name || '?'}
                      </Badge>
                    ))}
                    {ghe.roles.length === 0 && (
                      <p className='text-xs text-muted-foreground'>
                        Nenhum cargo adicionado.
                      </p>
                    )}
                  </div>
                </CardContent>
                <CardFooter>
                  <ManageGheDialog ghe={ghe} onUpdateRoles={handleUpdateGheRoles} />
                </CardFooter>
              </Card>
            ))}
          </div>
        ) : (
          <div className='flex flex-1 items-center justify-center rounded-lg border border-dashed shadow-sm h-96'>
            <div className='flex flex-col items-center gap-1 text-center'>
              <h3 className='text-2xl font-bold tracking-tight'>
                Nenhum GHE cadastrado
              </h3>
              <p className='text-sm text-muted-foreground'>
                Comece criando o primeiro Grupo Homogêneo de Exposição.
              </p>
              <Button className='mt-4' onClick={() => setIsAddDialogOpen(true)}>
                Adicionar GHE
              </Button>
            </div>
          </div>
        )}
      </CardContent>
    </Card>
  )
}
