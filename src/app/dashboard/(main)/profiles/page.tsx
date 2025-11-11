'use client'

import { useState, useMemo } from 'react'
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
import {
  useCollection,
  useFirestore,
  useMemoFirebase,
  useUser,
} from '@/firebase'
import { collection } from 'firebase/firestore'
import type { Staff } from '../employees/page'

interface Profile {
  id: string
  name: string
  code?: string
  createdBy?: string
  createdAt?: string
}

export const initialProfiles: Profile[] = []

function ClientSideDate({ dateString }: { dateString?: string }) {
  const [formattedDate, setFormattedDate] = useState('')

  React.useEffect(() => {
    if (dateString) {
      setFormattedDate(
        new Date(dateString).toLocaleDateString('pt-BR', {
          day: '2-digit',
          month: '2-digit',
          year: 'numeric',
        })
      )
    }
  }, [dateString])

  return <>{formattedDate}</>
}

export default function ProfilesPage() {
  const [profiles, setProfiles] = useState<Profile[]>(initialProfiles)
  const [isAddDialogOpen, setIsAddDialogOpen] = useState(false)
  const [isEditDialogOpen, setIsEditDialogOpen] = useState(false)
  const [currentProfile, setCurrentProfile] = useState<Profile | null>(null)
  const [profileName, setProfileName] = useState('')
  const [profileCode, setProfileCode] = useState('')
  const { user } = useUser()

  const firestore = useFirestore()
  const staffsRef = useMemoFirebase(
    () => (firestore ? collection(firestore, 'staffs') : null),
    [firestore]
  )
  const { data: staffs } = useCollection<Staff>(staffsRef)

  const staffCountByProfile = useMemo(() => {
    const counts: { [key: string]: number } = {}
    if (staffs) {
      for (const staff of staffs) {
        if (staff.perfilId) {
          counts[staff.perfilId] = (counts[staff.perfilId] || 0) + 1
        }
      }
    }
    return counts
  }, [staffs])

  const handleAddProfile = (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault()
    if (!profileName) return
    const newProfile: Profile = {
      id: `profile-${Date.now()}`,
      name: profileName,
      code: profileCode,
      createdBy: user?.email || 'Desconhecido',
      createdAt: new Date().toISOString(),
    }
    setProfiles((prev) => [...prev, newProfile])
    setIsAddDialogOpen(false)
    setProfileName('')
    setProfileCode('')
  }

  const handleEditProfile = (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault()
    if (!currentProfile || !profileName) return
    setProfiles((prev) =>
      prev.map((p) =>
        p.id === currentProfile.id
          ? { ...p, name: profileName, code: profileCode }
          : p
      )
    )
    setIsEditDialogOpen(false)
    setCurrentProfile(null)
    setProfileName('')
    setProfileCode('')
  }

  const openEditDialog = (profile: Profile) => {
    setCurrentProfile(profile)
    setProfileName(profile.name)
    setProfileCode(profile.code || '')
    setIsEditDialogOpen(true)
  }

  const openAddDialog = () => {
    setCurrentProfile(null)
    setProfileName('')
    setProfileCode('')
    setIsAddDialogOpen(true)
  }

  const renderProfileForm = (profile?: Profile | null) => (
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
        <Label htmlFor='code' className='text-right'>
          Código
        </Label>
        <Input
          id='code'
          name='code'
          value={profileCode}
          onChange={(e) => setProfileCode(e.target.value)}
          className='col-span-3'
          placeholder='(Opcional)'
        />
      </div>
    </div>
  )

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
                {renderProfileForm()}
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
              <TableHead>Código</TableHead>
              <TableHead>Criado por</TableHead>
              <TableHead>Data de Criação</TableHead>
              <TableHead className='text-right'>
                Staffs com este Perfil
              </TableHead>
              <TableHead>
                <span className='sr-only'>Ações</span>
              </TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {profiles.map((profile) => (
              <TableRow key={profile.id}>
                <TableCell className='font-medium'>{profile.name}</TableCell>
                <TableCell>{profile.code}</TableCell>
                <TableCell className='text-muted-foreground'>
                  {profile.createdBy}
                </TableCell>
                <TableCell className='text-muted-foreground'>
                  <ClientSideDate dateString={profile.createdAt} />
                </TableCell>
                <TableCell className='text-right'>
                  <Badge variant='secondary'>
                    {staffCountByProfile[profile.id] || 0}
                  </Badge>
                </TableCell>
                <TableCell className='text-right'>
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
              Modifique os detalhes do perfil de acesso.
            </DialogDescription>
          </DialogHeader>
          <form id='edit-profile-form' onSubmit={handleEditProfile}>
            {renderProfileForm(currentProfile)}
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
