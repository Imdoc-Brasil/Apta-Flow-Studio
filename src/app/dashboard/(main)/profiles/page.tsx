
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
import type { Staff } from '../employees/page'
import { Checkbox } from '@/components/ui/checkbox'
import { ScrollArea } from '@/components/ui/scroll-area'
import { useToast } from '@/hooks/use-toast'
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from '@/components/ui/accordion'
import {
  permissionModules,
  permissionActions,
  type Permission,
  type Action,
  type Module,
  type PermissionModule,
} from './data'

// --- Fim da Estrutura de Permissões ---

interface Profile {
  id: string
  name: string
  code?: string
  createdBy?: string
  createdAt?: string
  permissions?: Permission[]
}

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
  const [selectedPermissions, setSelectedPermissions] = useState<
    Set<Permission>
  >(new Set())

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
          permissions: permissionModules.flatMap(m =>
            permissionActions.map(a => `${a.id}:${m.id}`)
          ) as Permission[],
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

  const handlePermissionsSubmit = (
    event: React.FormEvent<HTMLFormElement>
  ) => {
    event.preventDefault()
    if (!currentProfile || !firestore) return

    const updatedPermissions = Array.from(selectedPermissions)
    const profileDocRef = doc(firestore, 'profiles', currentProfile.id)
    updateDocumentNonBlocking(profileDocRef, { permissions: updatedPermissions })

    toast({
      title: 'Permissões atualizadas!',
      description: `As permissões para o perfil "${currentProfile.name}" foram salvas.`,
    })
    setIsPermissionsDialogOpen(false)
  }

  const handlePermissionChange = (
    permission: Permission,
    checked: boolean
  ) => {
    setSelectedPermissions((prev) => {
      const newSet = new Set(prev)
      const [action, moduleId] = permission.split(':') as [Action, Module]
      const mainModule = permissionModules.find((m) => m.id === moduleId)

      // Ação em cascata para submódulos
      if (mainModule && mainModule.subModules) {
        mainModule.subModules.forEach((subModule) => {
          const subPermission = `${action}:${subModule.id}` as Permission
          if (checked) {
            newSet.add(subPermission)
          } else {
            newSet.delete(subPermission)
          }
        })
      }

      // Ação principal
      if (checked) {
        newSet.add(permission)
      } else {
        newSet.delete(permission)
      }

      return newSet
    })
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
    // Allow editing Super Admin permissions
    if (profile.id === 'cliente' && profile.createdBy === 'sistema') {
      toast({
        variant: 'destructive',
        title: 'Não permitido',
        description: 'Não é possível editar as permissões do perfil de Cliente.',
      })
      return
    }
    setCurrentProfile(profile)
    setSelectedPermissions(new Set(profile.permissions || []))
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
                {profiles?.map((profile) => (
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
                ))}
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
      <Dialog
        open={isPermissionsDialogOpen}
        onOpenChange={setIsPermissionsDialogOpen}
      >
        <DialogContent className='max-w-4xl'>
          <DialogHeader>
            <DialogTitle>
              Editar Permissões para "{currentProfile?.name}"
            </DialogTitle>
            <DialogDescription>
              Selecione as ações que os usuários com este perfil podem realizar
              em cada módulo.
            </DialogDescription>
          </DialogHeader>
          <form id='permissions-form' onSubmit={handlePermissionsSubmit}>
            <div className='sticky top-0 bg-background/95 p-2 flex items-center border-b z-10'>
              <div className='flex-1 font-semibold pl-4'>Módulo</div>
              <div className='grid grid-cols-4 gap-4 w-[300px] text-center text-xs font-semibold text-muted-foreground'>
                {permissionActions.map((action) => (
                  <div key={action.id} className='flex justify-center'>
                    {action.name}
                  </div>
                ))}
              </div>
            </div>

            <ScrollArea className='h-[60vh] mt-2'>
              <Accordion type='multiple' className='w-full'>
                {permissionModules.map((module) => (
                  <AccordionItem value={module.id} key={module.id}>
                    <div className='flex items-center pr-4 border-b hover:bg-muted/50'>
                      <AccordionTrigger className='flex-1 p-0 pl-4 font-medium text-sm hover:no-underline'>
                        <div className='py-3'>{module.name}</div>
                      </AccordionTrigger>
                      <div className='grid grid-cols-4 gap-4 w-[300px]'>
                        {permissionActions.map((action) => (
                          <div
                            key={`${module.id}-${action.id}`}
                            className='flex justify-center'
                          >
                            <Checkbox
                              checked={selectedPermissions.has(
                                `${action.id}:${module.id}`
                              )}
                              onCheckedChange={(checked) =>
                                handlePermissionChange(
                                  `${action.id}:${module.id}`,
                                  !!checked
                                )
                              }
                            />
                          </div>
                        ))}
                      </div>
                    </div>
                    <AccordionContent>
                      <div className='pl-12 py-2 space-y-2 border-l ml-6'>
                        {module.subModules ? (
                          module.subModules.map((subModule) => (
                            <div
                              key={subModule.id}
                              className='flex items-center pr-4'
                            >
                              <div className='flex-1 p-2'>
                                <Label className='font-normal'>
                                  {subModule.name}
                                </Label>
                              </div>
                              <div className='grid grid-cols-4 gap-4 w-[300px]'>
                                {permissionActions.map((action) => (
                                  <div
                                    key={`${subModule.id}-${action.id}`}
                                    className='flex justify-center'
                                  >
                                    <Checkbox
                                      checked={selectedPermissions.has(
                                        `${action.id}:${subModule.id}`
                                      )}
                                      onCheckedChange={(checked) =>
                                        handlePermissionChange(
                                          `${action.id}:${subModule.id}`,
                                          !!checked
                                        )
                                      }
                                    />
                                  </div>
                                ))}
                              </div>
                            </div>
                          ))
                        ) : (
                          <div className='text-sm text-muted-foreground p-4 text-center'>
                            Nenhum submódulo para configurar.
                          </div>
                        )}
                      </div>
                    </AccordionContent>
                  </AccordionItem>
                ))}
              </Accordion>
            </ScrollArea>
          </form>
          <DialogFooter className='mt-4 pt-4 border-t'>
            <Button
              variant='outline'
              onClick={() => setIsPermissionsDialogOpen(false)}
            >
              Cancelar
            </Button>
            <Button type='submit' form='permissions-form'>
              <ShieldCheck className='mr-2 h-4 w-4' />
              Salvar Permissões
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </>
  )
}
