
'use client'

import React, { useState, useMemo, useEffect } from 'react'
import {
  MoreHorizontal,
  PlusCircle,
  ShieldCheck,
  ChevronDown,
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
} from '@/firebase'
import { collection } from 'firebase/firestore'
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

// --- Estrutura de Permissões ---

type Action = 'view' | 'create' | 'edit' | 'delete'
type Module =
  | 'clients'
  | 'clients.info'
  | 'clients.tickets'
  | 'clients.structure'
  | 'clients.sst'
  | 'staffs'
  | 'tickets'
  | 'services'
  | 'risks'
  | 'health'
  | 'health.queue'
  | 'health.exams'
  | 'health.reports'
  | 'performance'

export type Permission = `${Action}:${Module}`

interface SubModule {
  id: Module
  name: string
}

interface PermissionModule {
  id: Module
  name: string
  subModules?: SubModule[]
}

export const permissionModules: PermissionModule[] = [
  {
    id: 'clients',
    name: 'Clientes',
    subModules: [
      { id: 'clients.info', name: 'Informações Gerais' },
      { id: 'clients.tickets', name: 'Chamados do Cliente' },
      { id: 'clients.structure', name: 'Estrutura da Empresa' },
      { id: 'clients.sst', name: 'Gestão de SST' },
    ],
  },
  { id: 'staffs', name: 'Staffs' },
  { id: 'tickets', name: 'Tickets (Geral)' },
  { id: 'services', name: 'Serviços' },
  { id: 'risks', name: 'Riscos' },
  {
    id: 'health',
    name: 'Saúde',
    subModules: [
      { id: 'health.queue', name: 'Fila de Atendimento' },
      { id: 'health.exams', name: 'Catálogo de Exames' },
      { id: 'health.reports', name: 'Portal de Laudos' },
    ],
  },
  { id: 'performance', name: 'Desempenho' },
]

export const permissionActions: { id: Action; name: string }[] = [
  { id: 'view', name: 'Ver' },
  { id: 'create', name: 'Criar' },
  { id: 'edit', name: 'Editar' },
  { id: 'delete', name: 'Excluir' },
]

// --- Fim da Estrutura de Permissões ---

interface Profile {
  id: string
  name: string
  code?: string
  createdBy?: string
  createdAt?: string
  permissions?: Permission[]
}

export const initialProfiles: Profile[] = [
  {
    id: 'cliente',
    name: 'Cliente',
    code: 'CLIENT',
    createdBy: 'sistema',
    createdAt: new Date().toISOString(),
    permissions: [
      'view:clients.info',
      'view:clients.tickets',
      'create:clients.tickets',
      'view:clients.structure',
      'view:clients.sst',
    ],
  },
]

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
    if (!profileName) return
    const newProfile: Profile = {
      id: `profile-${Date.now()}`,
      name: profileName,
      code: profileCode,
      createdBy: user?.email || 'Desconhecido',
      createdAt: new Date().toISOString(),
      permissions: [],
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

  const handlePermissionsSubmit = (
    event: React.FormEvent<HTMLFormElement>
  ) => {
    event.preventDefault()
    if (!currentProfile) return
    const updatedPermissions = Array.from(selectedPermissions)
    setProfiles((prev) =>
      prev.map((p) =>
        p.id === currentProfile.id
          ? { ...p, permissions: updatedPermissions }
          : p
      )
    )
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
      if (checked) {
        newSet.add(permission)
      } else {
        newSet.delete(permission)
      }
      return newSet
    })
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

  const openPermissionsDialog = (profile: Profile) => {
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
                        <Button
                          aria-haspopup='true'
                          size='icon'
                          variant='ghost'
                        >
                          <MoreHorizontal className='h-4 w-4' />
                          <span className='sr-only'>Alternar menu</span>
                        </Button>
                      </DropdownMenuTrigger>
                      <DropdownMenuContent align='end'>
                        <DropdownMenuLabel>Ações</DropdownMenuLabel>
                        <DropdownMenuItem
                          onClick={() => openEditDialog(profile)}
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
            <div className='sticky top-0 bg-background/95 p-2 mt-2 flex items-center border-b z-10'>
              <div className='flex-1 font-semibold pl-4'>Módulo</div>
              <div className='grid grid-cols-4 gap-4 w-[300px] text-center text-xs font-semibold text-muted-foreground'>
                {permissionActions.map((action) => (
                  <span key={action.id}>{action.name}</span>
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
