'use client'

import { useState } from 'react'
import { MoreHorizontal, PlusCircle } from 'lucide-react'
import { Badge } from '@/components/ui/badge'
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from '@/components/ui/card'
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu'
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

interface Profile {
  id: string
  name: string
  assinatura: string
}

export const initialProfiles: Profile[] = [
  {
    id: '1',
    name: 'Gerente de Projeto Principal',
    assinatura: 'Gerente de Projeto Principal',
  },
  {
    id: '2',
    name: 'Engenheiro de Software Sênior',
    assinatura: 'Engenheiro de Software Sênior',
  },
  {
    id: '3',
    name: 'Especialista de Suporte',
    assinatura: 'Especialista de Suporte',
  },
  {
    id: '4',
    name: 'Engenheiro de DevOps',
    assinatura: 'Engenheiro de DevOps',
  },
]

export default function ProfilesPage() {
  const [profiles, setProfiles] = useState<Profile[]>(initialProfiles)
  const [isAddDialogOpen, setIsAddDialogOpen] = useState(false)
  const [isEditDialogOpen, setIsEditDialogOpen] = useState(false)
  const [currentProfile, setCurrentProfile] = useState<Profile | null>(null)
  const [profileName, setProfileName] = useState('')
  const [profileAssinatura, setProfileAssinatura] = useState('')

  const handleAddProfile = (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault()
    if (!profileName || !profileAssinatura) return
    const newProfile: Profile = {
      id: `profile-${Date.now()}`,
      name: profileName,
      assinatura: profileAssinatura,
    }
    setProfiles((prev) => [...prev, newProfile])
    setIsAddDialogOpen(false)
    setProfileName('')
    setProfileAssinatura('')
  }

  const handleEditProfile = (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault()
    if (!currentProfile || !profileName || !profileAssinatura) return
    setProfiles((prev) =>
      prev.map((p) =>
        p.id === currentProfile.id
          ? { ...p, name: profileName, assinatura: profileAssinatura }
          : p
      )
    )
    setIsEditDialogOpen(false)
    setCurrentProfile(null)
    setProfileName('')
    setProfileAssinatura('')
  }

  const openEditDialog = (profile: Profile) => {
    setCurrentProfile(profile)
    setProfileName(profile.name)
    setProfileAssinatura(profile.assinatura)
    setIsEditDialogOpen(true)
  }

  const openAddDialog = () => {
    setCurrentProfile(null)
    setProfileName('')
    setProfileAssinatura('')
    setIsAddDialogOpen(true)
  }

  return (
    <Card>
      <CardHeader>
        <div className='flex items-center justify-between'>
          <div>
            <CardTitle>Perfis de Acesso</CardTitle>
            <CardDescription>
              Gerencie os perfis de acesso e permissões dos staffs.
            </CardDescription>
          </div>
          <Dialog open={isAddDialogOpen} onOpenChange={setIsAddDialogOpen}>
            <DialogTrigger asChild>
              <Button size='sm' className='h-8 gap-1' onClick={openAddDialog}>
                <PlusCircle className='h-3.5 w-3.5' />
                <span className='sr-only sm:not-sr-only sm:whitespace-nowrap'>
                  Adicionar Perfil
                </span>
              </Button>
            </DialogTrigger>
            <DialogContent>
              <DialogHeader>
                <DialogTitle>Adicionar Novo Perfil</DialogTitle>
                <DialogDescription>
                  Crie um novo perfil para atribuir aos staffs.
                </DialogDescription>
              </DialogHeader>
              <form id='add-profile-form' onSubmit={handleAddProfile}>
                <div className='grid gap-4 py-4'>
                  <div className='grid grid-cols-4 items-center gap-4'>
                    <Label htmlFor='name' className='text-right'>
                      Nome do Perfil
                    </Label>
                    <Input
                      id='name'
                      name='name'
                      value={profileName}
                      onChange={(e) => setProfileName(e.target.value)}
                      className='col-span-3'
                      required
                    />
                  </div>
                  <div className='grid grid-cols-4 items-center gap-4'>
                    <Label htmlFor='assinatura' className='text-right'>
                      Assinatura
                    </Label>
                    <Input
                      id='assinatura'
                      name='assinatura'
                      value={profileAssinatura}
                      onChange={(e) => setProfileAssinatura(e.target.value)}
                      className='col-span-3'
                      required
                    />
                  </div>
                </div>
              </form>
              <DialogFooter>
                <Button
                  variant='outline'
                  onClick={() => setIsAddDialogOpen(false)}
                >
                  Cancelar
                </Button>
                <Button type='submit' form='add-profile-form'>
                  Salvar Perfil
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
              <TableHead>Nome do Perfil</TableHead>
              <TableHead>Assinatura</TableHead>
              <TableHead>
                <span className='sr-only'>Ações</span>
              </TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {profiles.map((profile) => (
              <TableRow key={profile.id}>
                <TableCell className='font-medium'>{profile.name}</TableCell>
                <TableCell>
                  <Badge variant='outline'>{profile.assinatura}</Badge>
                </TableCell>
                <TableCell>
                  <DropdownMenu>
                    <DropdownMenuTrigger asChild>
                      <Button aria-haspopup='true' size='icon' variant='ghost'>
                        <MoreHorizontal className='h-4 w-4' />
                        <span className='sr-only'>Alternar menu</span>
                      </Button>
                    </DropdownMenuTrigger>
                    <DropdownMenuContent align='end'>
                      <DropdownMenuLabel>Ações</DropdownMenuLabel>
                      <DropdownMenuItem onClick={() => openEditDialog(profile)}>
                        Editar
                      </DropdownMenuItem>
                    </DropdownMenuContent>
                  </DropdownMenu>
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </CardContent>

      {/* Edit Dialog */}
      <Dialog open={isEditDialogOpen} onOpenChange={setIsEditDialogOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Editar Perfil</DialogTitle>
            <DialogDescription>
              Modifique o nome do perfil de acesso.
            </DialogDescription>
          </DialogHeader>
          <form id='edit-profile-form' onSubmit={handleEditProfile}>
            <div className='grid gap-4 py-4'>
              <div className='grid grid-cols-4 items-center gap-4'>
                <Label htmlFor='edit-name' className='text-right'>
                  Nome do Perfil
                </Label>
                <Input
                  id='edit-name'
                  name='edit-name'
                  value={profileName}
                  onChange={(e) => setProfileName(e.target.value)}
                  className='col-span-3'
                  required
                />
              </div>
              <div className='grid grid-cols-4 items-center gap-4'>
                <Label htmlFor='edit-assinatura' className='text-right'>
                  Assinatura
                </Label>
                <Input
                  id='edit-assinatura'
                  name='edit-assinatura'
                  value={profileAssinatura}
                  onChange={(e) => setProfileAssinatura(e.target.value)}
                  className='col-span-3'
                  required
                />
              </div>
            </div>
          </form>
          <DialogFooter>
            <Button
              variant='outline'
              onClick={() => setIsEditDialogOpen(false)}
            >
              Cancelar
            </Button>
            <Button type='submit' form='edit-profile-form'>
              Salvar Alterações
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </Card>
  )
}
