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
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar'

export const initialStaffsData = [
  {
    name: 'Sarah Chen',
    profile: 'Gerente de Projeto Principal',
    avatar: 'https://i.pravatar.cc/150?u=a042581f4e29026701d',
    fallback: 'SC',
    email: 'sarah.chen@aptaflow.com',
    phone: '555-0101',
    status: 'Ativo',
  },
  {
    name: 'David Rodriguez',
    profile: 'Engenheiro de Software Sênior',
    avatar: 'https://i.pravatar.cc/150?u=a042581f4e29026702d',
    fallback: 'DR',
    email: 'david.r@aptaflow.com',
    phone: '555-0102',
    status: 'Ativo',
  },
  {
    name: 'Emily White',
    profile: 'Especialista de Suporte',
    avatar: 'https://i.pravatar.cc/150?u=a042581f4e29026703d',
    fallback: 'EW',
    email: 'emily.w@aptaflow.com',
    phone: '555-0103',
    status: 'Ativo',
  },
  {
    name: 'Michael Brown',
    profile: 'Engenheiro de DevOps',
    avatar: 'https://i.pravatar.cc/150?u=a042581f4e29026704d',
    fallback: 'MB',
    email: 'michael.b@aptaflow.com',
    phone: '555-0104',
    status: 'Licença',
  },
]

export type Staff = (typeof initialStaffsData)[0]

export default function StaffsPage() {
  const [staffs, setStaffs] = useState(initialStaffsData)
  const [isDialogOpen, setIsDialogOpen] = useState(false)

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
      profile: formData.get('profile') as string,
      email: formData.get('email') as string,
      phone: formData.get('phone') as string,
      status: 'Ativo',
      avatar: `https://i.pravatar.cc/150?u=${Math.random()}`,
      fallback,
    }
    setStaffs((prev) => [newStaff, ...prev])
    setIsDialogOpen(false)
  }

  return (
    <Card>
      <CardHeader>
        <div className='flex items-center justify-between'>
          <div>
            <CardTitle>Hub de Staffs</CardTitle>
            <CardDescription>
              Gerencie os staffs da sua empresa.
            </CardDescription>
          </div>
          <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
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
                    <Label htmlFor='profile' className='text-right'>
                      Perfil
                    </Label>
                    <Input
                      id='profile'
                      name='profile'
                      className='col-span-3'
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
                      required
                    />
                  </div>
                  <div className='grid grid-cols-4 items-center gap-4'>
                    <Label htmlFor='phone' className='text-right'>
                      Telefone
                    </Label>
                    <Input id='phone' name='phone' className='col-span-3' />
                  </div>
                </div>
              </form>
              <DialogFooter>
                <Button
                  variant='outline'
                  onClick={() => setIsDialogOpen(false)}
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
                    </div>
                  </div>
                </TableCell>
                <TableCell className='hidden md:table-cell'>
                  {staff.profile}
                </TableCell>
                <TableCell>
                  <Badge
                    variant={
                      staff.status === 'Ativo' ? 'secondary' : 'outline'
                    }
                  >
                    {staff.status}
                  </Badge>
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
                      <DropdownMenuItem>Ver Detalhes</DropdownMenuItem>
                      <DropdownMenuItem>Editar</DropdownMenuItem>
                    </DropdownMenuContent>
                  </DropdownMenu>
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </CardContent>
    </Card>
  )
}
