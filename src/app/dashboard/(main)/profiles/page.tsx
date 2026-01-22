
'use client'

import React, { useState, useMemo, useEffect } from 'react'
import {
  MoreHorizontal,
  PlusCircle,
  ShieldCheck,
  ChevronDown,
  X,
  Loader2,
} from 'lucide-react'
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
  addDocumentNonBlocking,
  updateDocumentNonBlocking,
  setDocumentNonBlocking,
} from '@/firebase'
import { collection, doc } from 'firebase/firestore'
import type { Staff } from '@/app/dashboard/(main)/employees/page'
import { useToast } from '@/hooks/use-toast'
import { Search, Filter } from 'lucide-react'
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select'
import type {
  Profile,
  Permission,
} from '@/lib/types/profile'
import { EditPermissionsDialog } from '@/components/edit-permissions-dialog' // Import the new component

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
  const [isAddDialogOpen, setIsAddDialogOpen] = useState(false)
  const [isEditDialogOpen, setIsEditDialogOpen] = useState(false)
  const [isPermissionsDialogOpen, setIsPermissionsDialogOpen] = useState(false)

  const [currentProfile, setCurrentProfile] = useState<Profile | null>(null)
  const [profileName, setProfileName] = useState('')
  const [profileCode, setProfileCode] = useState('')

  // Search and filter states
  const [searchTerm, setSearchTerm] = useState('')
  const [filterByType, setFilterByType] = useState<'all' | 'system' | 'custom'>('all')

  const { user } = useUser()
  const { toast } = useToast()
  const firestore = useFirestore()

  const profilesRef = useMemoFirebase(
    () => (firestore ? collection(firestore, 'profiles') : null),
    [firestore]
  )
  const { data: profiles, isLoading: areProfilesLoading } =
    useCollection<Profile>(profilesRef)

  // Effect to add initial data if collection is empty
  useEffect(() => {
    if (firestore && !areProfilesLoading && profiles) {
      const superAdminProfileExists = profiles.some(p => p.id === 'super_admin');
      if (!superAdminProfileExists) {
        const superAdminProfile = {
          id: 'super_admin',
          name: 'Super Administrador',
          code: 'SADM',
          createdBy: 'sistema',
          createdAt: new Date().toISOString(),
          permissions: [] as Permission[], // Let's keep it empty, can be configured via UI
        };
        const profileDocRef = doc(firestore, 'profiles', superAdminProfile.id);
        setDocumentNonBlocking(profileDocRef, superAdminProfile, { merge: true });
      }

      const clientProfileExists = profiles.some(p => p.id === 'cliente');
      if (!clientProfileExists) {
        const clientProfile = {
          id: 'cliente',
          name: 'Cliente',
          code: 'CLT',
          createdBy: 'sistema',
          createdAt: new Date().toISOString(),
          permissions: [
            'view:clients',
            'view:clients.info',
            'view:clients.tickets',
            'create:clients.tickets',
            'view:clients.structure',
            'view:clients.sst',
          ] as Permission[],
        };
        const profileDocRef = doc(firestore, 'profiles', clientProfile.id);
        setDocumentNonBlocking(profileDocRef, clientProfile, { merge: true });
      }
    }
  }, [firestore, areProfilesLoading, profiles]);


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

  // Filtered profiles
  const filteredProfiles = useMemo(() => {
    if (!profiles) return []

    return profiles.filter((profile) => {
      const matchesSearch =
        searchTerm === '' ||
        profile.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
        profile.code?.toLowerCase().includes(searchTerm.toLowerCase())

      const matchesType =
        filterByType === 'all' ||
        (filterByType === 'system' && profile.createdBy === 'sistema') ||
        (filterByType === 'custom' && profile.createdBy !== 'sistema')

      return matchesSearch && matchesType
    })
  }, [profiles, searchTerm, filterByType])

  // Get permission summary
  const getPermissionSummary = (permissions: Permission[] = []) => {
    const summary = {
      total: permissions.length,
      view: permissions.filter(p => p.startsWith('view:')).length,
      create: permissions.filter(p => p.startsWith('create:')).length,
      edit: permissions.filter(p => p.startsWith('edit:')).length,
      delete: permissions.filter(p => p.startsWith('delete:')).length,
    }
    return summary
  }

  useEffect(() => {
    if (isAddDialogOpen || isEditDialogOpen) {
      if (profileName) {
        const generatedCode =
          profileName
            .split(' ')
            .map((word) => word[0])
            .join('')
            .toUpperCase() +
          '-' +
          Math.floor(100 + Math.random() * 900)
        setProfileCode(generatedCode)
      } else {
        setProfileCode('')
      }
    }
  }, [profileName, isAddDialogOpen, isEditDialogOpen])

  const handleAddProfile = (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault()
    if (!profileName || !profilesRef) return

    const newProfileData = {
      name: profileName,
      code: profileCode,
      createdBy: user?.email || 'Desconhecido',
      createdAt: new Date().toISOString(),
      permissions: [],
    }
    addDocumentNonBlocking(profilesRef, newProfileData)
    setIsAddDialogOpen(false)
    setProfileName('')
    setProfileCode('')
    toast({ title: 'Perfil Adicionado!' })
  }

  const handleEditProfile = (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault()
    if (!currentProfile || !profileName || !firestore) return

    const profileDocRef = doc(firestore, 'profiles', currentProfile.id)
    updateDocumentNonBlocking(profileDocRef, {
      name: profileName,
      code: profileCode,
    })

    setIsEditDialogOpen(false)
    setCurrentProfile(null)
    setProfileName('')
    setProfileCode('')
    toast({ title: 'Perfil Atualizado!' })
  }

  const openEditDialog = (profile: Profile) => {
    if (profile.createdBy === 'sistema') return
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

  const openPermissionsDialog = (profile: Profile) => {
    if (profile.id === 'cliente' && profile.createdBy === 'sistema') {
      toast({
        variant: 'destructive',
        title: 'Não permitido',
        description: 'Não é possível editar as permissões do perfil de Cliente.',
      })
      return
    }
    setCurrentProfile(profile)
    setIsPermissionsDialogOpen(true)
  }

  const renderProfileForm = () => (
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
          className='col-span-3'
          readOnly
          placeholder='(Gerado automaticamente)'
        />
      </div>
    </div>
  )

  const isLoading = areProfilesLoading

  return (
    <>
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
                <Button
                  size='sm'
                  className='h-8 gap-1'
                  onClick={openAddDialog}
                >
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

          {/* Search and Filter */}
          <div className='flex items-center gap-2 pt-4'>
            <div className='relative flex-1 max-w-sm'>
              <Search className='absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground' />
              <Input
                type='search'
                placeholder='Buscar por nome ou código...'
                className='pl-8'
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
              />
            </div>
            <Select value={filterByType} onValueChange={(value: 'all' | 'system' | 'custom') => setFilterByType(value)}>
              <SelectTrigger className='w-[180px]'>
                <SelectValue placeholder='Tipo de perfil' />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value='all'>Todos os Perfis</SelectItem>
                <SelectItem value='system'>Perfis do Sistema</SelectItem>
                <SelectItem value='custom'>Perfis Personalizados</SelectItem>
              </SelectContent>
            </Select>
          </div>
        </CardHeader>
        <CardContent>
          {isLoading ? (
            <div className='flex items-center justify-center h-48'>
              <Loader2 className='h-8 w-8 animate-spin' />
            </div>
          ) : (
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Nome do Perfil</TableHead>
                  <TableHead>Código</TableHead>
                  <TableHead>Permissões</TableHead>
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
                {filteredProfiles?.map((profile) => {
                  const permSummary = getPermissionSummary(profile.permissions)
                  return (
                    <TableRow key={profile.id}>
                      <TableCell className='font-medium'>{profile.name}</TableCell>
                      <TableCell>{profile.code}</TableCell>
                      <TableCell>
                        <div className='flex gap-1'>
                          <Badge variant='outline' className='text-xs'>
                            {permSummary.total} total
                          </Badge>
                          {permSummary.view > 0 && (
                            <Badge variant='secondary' className='text-xs'>
                              {permSummary.view} ver
                            </Badge>
                          )}
                        </div>
                      </TableCell>
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
                            <Button
                              aria-haspopup='true'
                              size='icon'
                              variant='ghost'
                              disabled={profile.id === 'cliente' && profile.createdBy === 'sistema'}
                            >
                              <MoreHorizontal className='h-4 w-4' />
                              <span className='sr-only'>Alternar menu</span>
                            </Button>
                          </DropdownMenuTrigger>
                          <DropdownMenuContent align='end'>
                            <DropdownMenuLabel>Ações</DropdownMenuLabel>
                            <DropdownMenuItem
                              onClick={() => openEditDialog(profile)}
                              disabled={profile.createdBy === 'sistema'}
                            >
                              Editar Nome
                            </DropdownMenuItem>
                            <DropdownMenuItem
                              onClick={() => openPermissionsDialog(profile)}
                            >
                              Editar Permissões
                            </DropdownMenuItem>
                          </DropdownMenuContent>
                        </DropdownMenu>
                      </TableCell>
                    </TableRow>
                  )
                })}
              </TableBody>
            </Table>
          )}
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
              {renderProfileForm()}
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

      {/* Permissions Dialog */}
      <EditPermissionsDialog
        open={isPermissionsDialogOpen}
        onOpenChange={setIsPermissionsDialogOpen}
        profile={currentProfile}
      />
    </>
  )
}
