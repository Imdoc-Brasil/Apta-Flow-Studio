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
  DropdownMenuSub,
  DropdownMenuSubContent,
  DropdownMenuSubTrigger,
  DropdownMenuPortal,
  DropdownMenuSeparator,
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
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from '@/components/ui/alert-dialog'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar'
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select'
import { initialProfiles } from '@/app/dashboard/(main)/profiles/page'

type StaffStatus = 'Ativo' | 'Licença' | 'Suspenso'
type StaffSituation = 'Online' | 'Offline'

export const initialStaffsData = [
  {
    name: 'Sarah Chen',
    perfilId: '1',
    assinatura: 'Gerente de Projeto Principal',
    avatar: 'https://i.pravatar.cc/150?u=a042581f4e29026701d',
    fallback: 'SC',
    email: 'sarah.chen@aptaflow.com',
    phone: '555-0101',
    status: 'Ativo' as StaffStatus,
    situacao: 'Online' as StaffSituation,
  },
  {
    name: 'David Rodriguez',
    perfilId: '2',
    assinatura: 'Engenheiro de Software Sênior',
    avatar: 'https://i.pravatar.cc/150?u=a042581f4e29026702d',
    fallback: 'DR',
    email: 'david.r@aptaflow.com',
    phone: '555-0102',
    status: 'Ativo' as StaffStatus,
    situacao: 'Offline' as StaffSituation,
  },
  {
    name: 'Emily White',
    perfilId: '3',
    assinatura: 'Especialista de Suporte',
    avatar: 'https://i.pravatar.cc/150?u=a042581f4e29026703d',
    fallback: 'EW',
    email: 'emily.w@aptaflow.com',
    phone: '555-0103',
    status: 'Ativo' as StaffStatus,
    situacao: 'Online' as StaffSituation,
  },
  {
    name: 'Michael Brown',
    perfilId: '4',
    assinatura: 'Engenheiro de DevOps',
    avatar: 'https://i.pravatar.cc/150?u=a042581f4e29026704d',
    fallback: 'MB',
    email: 'michael.b@aptaflow.com',
    phone: '555-0104',
    status: 'Licença' as StaffStatus,
    situacao: 'Offline' as StaffSituation,
  },
]

export type Staff = (typeof initialStaffsData)[0]

export default function StaffsPage() {
  const [staffs, setStaffs] = useState(initialStaffsData)
  const [isAddDialogOpen, setIsAddDialogOpen] = useState(false)
  const [isEditDialogOpen, setIsEditDialogOpen] = useState(false)
  const [isDetailOpen, setIsDetailOpen] = useState(false)
  const [isDeleteDialogOpen, setIsDeleteDialogOpen] = useState(false)
  const [currentStaff, setCurrentStaff] = useState<Staff | null>(null)

  const handleAddStaff = (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault()
    const formData = new FormData(event.currentTarget)
    const name = formData.get('name') as string
    const fallback = name
      .split(' ')
      .map((n) => n[0])
      .join('')
      .substring(0, 2)
      .toUpperCase()

    const newStaff: Staff = {
      name,
      assinatura: formData.get('assinatura') as string,
      perfilId: formData.get('perfil') as string,
      email: formData.get('email') as string,
      phone: formData.get('phone') as string,
      status: 'Ativo',
      situacao: 'Offline',
      avatar: `https://i.pravatar.cc/150?u=${Math.random()}`,
      fallback,
    }
    setStaffs((prev) => [newStaff, ...prev])
    setIsAddDialogOpen(false)
  }

  const handleEditStaff = (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault()
    if (!currentStaff) return
    const formData = new FormData(event.currentTarget)
    const name = formData.get('name') as string
    const fallback = name
      .split(' ')
      .map((n) => n[0])
      .join('')
      .substring(0, 2)
      .toUpperCase()

    setStaffs((prev) =>
      prev.map((staff) =>
        staff.email === currentStaff.email
          ? {
              ...staff,
              name,
              assinatura: formData.get('assinatura') as string,
              perfilId: formData.get('perfil') as string,
              email: formData.get('email') as string,
              phone: formData.get('phone') as string,
              fallback,
            }
          : staff
      )
    )
    setIsEditDialogOpen(false)
    setCurrentStaff(null)
  }

  const handleDeleteStaff = () => {
    if (!currentStaff) return
    setStaffs((prev) =>
      prev.filter((staff) => staff.email !== currentStaff.email)
    )
    setIsDeleteDialogOpen(false)
    setCurrentStaff(null)
  }

  const handleChangeStatus = (staffEmail: string, newStatus: StaffStatus) => {
    setStaffs((prev) =>
      prev.map((staff) =>
        staff.email === staffEmail ? { ...staff, status: newStatus } : staff
      )
    )
  }

  const openEditDialog = (staff: Staff) => {
    setCurrentStaff(staff)
    setIsEditDialogOpen(true)
  }

  const openDetailDialog = (staff: Staff) => {
    setCurrentStaff(staff)
    setIsDetailOpen(true)
  }

  const openDeleteDialog = (staff: Staff) => {
    setCurrentStaff(staff)
    setIsDeleteDialogOpen(true)
  }

  const getProfileName = (perfilId: string) => {
    return initialProfiles.find((p) => p.id === perfilId)?.name || 'N/A'
  }
  
  const getStatusBadgeVariant = (status: StaffStatus) => {
    switch (status) {
      case 'Ativo':
        return 'secondary'
      case 'Suspenso':
        return 'destructive'
      case 'Licença':
        return 'outline'
      default:
        return 'default'
    }
  }

  const renderStaffForm = (staff?: Staff | null) => (
    <div className='grid gap-4 py-4'>
      <div className='grid grid-cols-4 items-center gap-4'>
        <Label className='text-right'>Avatar</Label>
        <div className='col-span-3 flex items-center gap-4'>
          <Avatar className='h-16 w-16'>
            <AvatarImage src={staff?.avatar} />
            <AvatarFallback>{staff?.fallback}</AvatarFallback>
          </Avatar>
          <Input
            id='avatar-upload'
            name='avatar-upload'
            type='file'
            className='text-sm'
          />
        </div>
      </div>
      <div className='grid grid-cols-4 items-center gap-4'>
        <Label htmlFor='name' className='text-right'>
          Nome
        </Label>
        <Input
          id='name'
          name='name'
          className='col-span-3'
          defaultValue={staff?.name}
          required
        />
      </div>
      <div className='grid grid-cols-4 items-center gap-4'>
        <Label htmlFor='perfil' className='text-right'>
          Perfil
        </Label>
        <Select name='perfil' defaultValue={staff?.perfilId} required>
          <SelectTrigger className='col-span-3'>
            <SelectValue placeholder='Selecione um perfil' />
          </SelectTrigger>
          <SelectContent>
            {initialProfiles.map((profile) => (
              <SelectItem key={profile.id} value={profile.id}>
                {profile.name}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>
      </div>
      <div className='grid grid-cols-4 items-center gap-4'>
        <Label htmlFor='assinatura' className='text-right'>
          Assinatura
        </Label>
        <Input
          id='assinatura'
          name='assinatura'
          className='col-span-3'
          defaultValue={staff?.assinatura}
          required
        />
      </div>
      <div className='grid grid-cols-4 items-center gap-4'>
        <Label htmlFor='email' className='text-right'>
          Email
        </Label>
        <Input
          id='email'
          name='email'
          type='email'
          className='col-span-3'
          defaultValue={staff?.email}
          required
        />
      </div>
      <div className='grid grid-cols-4 items-center gap-4'>
        <Label htmlFor='phone' className='text-right'>
          Telefone
        </Label>
        <Input
          id='phone'
          name='phone'
          defaultValue={staff?.phone}
          className='col-span-3'
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
              <CardTitle>Hub de Staffs</CardTitle>
              <CardDescription>
                Gerencie os staffs da sua empresa.
              </CardDescription>
            </div>
            <Dialog open={isAddDialogOpen} onOpenChange={setIsAddDialogOpen}>
              <DialogTrigger asChild>
                <Button size='sm' className='h-8 gap-1'>
                  <PlusCircle className='h-3.5 w-3.5' />
                  <span className='sr-only sm:not-sr-only sm:whitespace-nowrap'>
                    Adicionar Staff
                  </span>
                </Button>
              </DialogTrigger>
              <DialogContent>
                <DialogHeader>
                  <DialogTitle>Adicionar Novo Staff</DialogTitle>
                  <DialogDescription>
                    Preencha os detalhes para adicionar um novo membro à equipe.
                  </DialogDescription>
                </DialogHeader>
                <form id='add-staff-form' onSubmit={handleAddStaff}>
                  {renderStaffForm()}
                </form>
                <DialogFooter>
                  <Button
                    variant='outline'
                    onClick={() => setIsAddDialogOpen(false)}
                  >
                    Cancelar
                  </Button>
                  <Button type='submit' form='add-staff-form'>
                    Salvar Staff
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
                <TableHead>Staff</TableHead>
                <TableHead className='hidden md:table-cell'>Perfil</TableHead>
                <TableHead className='hidden md:table-cell'>
                  Assinatura
                </TableHead>
                <TableHead className='hidden sm:table-cell'>Situação</TableHead>
                <TableHead>Status</TableHead>
                <TableHead>
                  <span className='sr-only'>Ações</span>
                </TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {staffs.map((staff) => (
                <TableRow key={staff.email}>
                  <TableCell>
                    <div className='flex items-center gap-3'>
                      <Avatar className='h-9 w-9'>
                        <AvatarImage src={staff.avatar} alt={staff.name} />
                        <AvatarFallback>{staff.fallback}</AvatarFallback>
                      </Avatar>
                      <div className='grid gap-1'>
                        <p className='font-medium leading-none'>{staff.name}</p>
                        <p className='text-sm text-muted-foreground'>
                          {staff.email}
                        </p>
                        <p className='text-sm text-muted-foreground'>
                          {staff.phone}
                        </p>
                      </div>
                    </div>
                  </TableCell>
                  <TableCell className='hidden md:table-cell'>
                    {getProfileName(staff.perfilId)}
                  </TableCell>
                  <TableCell className='hidden md:table-cell'>
                    {staff.assinatura}
                  </TableCell>
                  <TableCell className='hidden sm:table-cell'>
                    <div className='flex items-center gap-2'>
                      <span
                        className={`h-2 w-2 rounded-full ${
                          staff.situacao === 'Online'
                            ? 'bg-green-500'
                            : 'bg-gray-400'
                        }`}
                      ></span>
                      <span>{staff.situacao}</span>
                    </div>
                  </TableCell>
                  <TableCell>
                    <Badge variant={getStatusBadgeVariant(staff.status)}>
                      {staff.status}
                    </Badge>
                  </TableCell>
                  <TableCell>
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
                        <DropdownMenuItem onClick={() => openDetailDialog(staff)}>
                          Ver Detalhes
                        </DropdownMenuItem>
                        <DropdownMenuItem onClick={() => openEditDialog(staff)}>
                          Editar
                        </DropdownMenuItem>
                        <DropdownMenuSeparator />
                        <DropdownMenuSub>
                           <DropdownMenuSubTrigger>Alterar Status</DropdownMenuSubTrigger>
                           <DropdownMenuPortal>
                             <DropdownMenuSubContent>
                               <DropdownMenuItem onClick={() => handleChangeStatus(staff.email, 'Ativo')}>Ativo</DropdownMenuItem>
                               <DropdownMenuItem onClick={() => handleChangeStatus(staff.email, 'Licença')}>Licença</DropdownMenuItem>
                               <DropdownMenuItem onClick={() => handleChangeStatus(staff.email, 'Suspenso')}>Suspenso</DropdownMenuItem>
                             </DropdownMenuSubContent>
                           </DropdownMenuPortal>
                        </DropdownMenuSub>
                        <DropdownMenuSeparator />
                        <DropdownMenuItem
                          className='text-destructive'
                          onClick={() => openDeleteDialog(staff)}
                        >
                          Excluir
                        </DropdownMenuItem>
                      </DropdownMenuContent>
                    </DropdownMenu>
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </CardContent>
      </Card>

      {/* Edit Dialog */}
      <Dialog open={isEditDialogOpen} onOpenChange={setIsEditDialogOpen}>
        <DialogContent className='sm:max-w-xl'>
          <DialogHeader>
            <DialogTitle>Editar Staff</DialogTitle>
            <DialogDescription>
              Modifique os detalhes do membro da equipe.
            </DialogDescription>
          </DialogHeader>
          <form id='edit-staff-form' onSubmit={handleEditStaff}>
            {renderStaffForm(currentStaff)}
          </form>
          <DialogFooter>
            <Button
              variant='outline'
              onClick={() => setIsEditDialogOpen(false)}
            >
              Cancelar
            </Button>
            <Button type='submit' form='edit-staff-form'>
              Salvar Alterações
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
      
      {/* Detail Dialog */}
      <Dialog open={isDetailOpen} onOpenChange={setIsDetailOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Detalhes do Staff</DialogTitle>
          </DialogHeader>
          {currentStaff && (
            <div className='grid gap-4 py-4'>
                <div className='flex items-center gap-4'>
                     <Avatar className='h-16 w-16'>
                        <AvatarImage src={currentStaff.avatar} alt={currentStaff.name} />
                        <AvatarFallback>{currentStaff.fallback}</AvatarFallback>
                      </Avatar>
                      <div>
                        <p className='font-bold text-lg'>{currentStaff.name}</p>
                        <p className='text-sm text-muted-foreground'>{currentStaff.email}</p>
                         <p className='text-sm text-muted-foreground'>{currentStaff.phone}</p>
                      </div>
                </div>
                <div className='space-y-2'>
                    <p className='text-sm font-medium'>Perfil</p>
                    <p className='text-muted-foreground'>{getProfileName(currentStaff.perfilId)}</p>
                </div>
                 <div className='space-y-2'>
                    <p className='text-sm font-medium'>Assinatura</p>
                    <p className='text-muted-foreground'>{currentStaff.assinatura}</p>
                </div>
                 <div className='space-y-2'>
                    <p className='text-sm font-medium'>Status</p>
                     <Badge
                      variant={getStatusBadgeVariant(currentStaff.status)}
                    >
                      {currentStaff.status}
                    </Badge>
                </div>
                 <div className='space-y-2'>
                    <p className='text-sm font-medium'>Situação</p>
                      <div className='flex items-center gap-2'>
                        <span
                          className={`h-2 w-2 rounded-full ${
                            currentStaff.situacao === 'Online'
                              ? 'bg-green-500'
                              : 'bg-gray-400'
                          }`}
                        ></span>
                        <span>{currentStaff.situacao}</span>
                      </div>
                </div>
            </div>
          )}
          <DialogFooter>
            <Button onClick={() => setIsDetailOpen(false)}>Fechar</Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
      
      {/* Delete Confirmation Dialog */}
      <AlertDialog open={isDeleteDialogOpen} onOpenChange={setIsDeleteDialogOpen}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Você tem certeza?</AlertDialogTitle>
            <AlertDialogDescription>
              Esta ação não pode ser desfeita. Isso irá excluir permanentemente o staff{' '}
              <span className='font-semibold'>{currentStaff?.name}</span>.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel onClick={() => setCurrentStaff(null)}>Cancelar</AlertDialogCancel>
            <AlertDialogAction onClick={handleDeleteStaff}>Excluir</AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </>
  )
}
