
'use client'

import { useState, useMemo, useEffect } from 'react'
import {
  MoreHorizontal,
  PlusCircle,
  Search,
  Filter,
  List,
  LayoutGrid,
  KeyRound,
} from 'lucide-react'
import { Badge } from '@/components/ui/badge'
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
  CardFooter,
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
  DropdownMenuCheckboxItem,
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
import { initialEmployeesData } from './data'
import type { Employee, EmployeeStatus } from './data'
import { initialRolesData } from '../roles/data'
import { initialSectorsData } from '../sectors/data'
import { initialUnitsData } from '../units/data'
import { Separator } from '@/components/ui/separator'
import { useRouter } from 'next/navigation'
import { useParams } from 'next/navigation'
import { useToast } from '@/hooks/use-toast'
import {
  useFirestore,
  addDocumentNonBlocking,
  useCollection,
  useMemoFirebase,
} from '@/firebase'
import { collection, doc } from 'firebase/firestore'
import type { Staff } from '@/app/dashboard/(main)/employees/page'

// Componente para formatar datas com segurança no cliente
function ClientSideDateFormatter({ dateString }: { dateString: string }) {
  const [formattedDate, setFormattedDate] = useState('')

  useEffect(() => {
    if (dateString) {
      // Usar new Date() pode ser inconsistente. Para evitar erros de hidratação,
      // criamos a data com base em UTC para depois formatar.
      const date = new Date(dateString)
      const timezoneOffset = date.getTimezoneOffset() * 60000
      const adjustedDate = new Date(date.getTime() + timezoneOffset)
      setFormattedDate(adjustedDate.toLocaleDateString('pt-BR'))
    }
  }, [dateString])

  return <>{formattedDate || '...'}</> // Mostra '...' enquanto carrega
}

export default function EmployeesPage() {
  const [employees, setEmployees] = useState(initialEmployeesData)
  const [isAddDialogOpen, setIsAddDialogOpen] = useState(false)
  const [isEditDialogOpen, setIsEditDialogOpen] = useState(false)
  const [isDeleteDialogOpen, setIsDeleteDialogOpen] = useState(false)
  const [currentEmployee, setCurrentEmployee] = useState<Employee | null>(null)
  const [searchTerm, setSearchTerm] = useState('')
  const [statusFilter, setStatusFilter] = useState<string[]>([
    'Ativo',
    'Férias',
    'Desligado',
    'Candidato',
  ])
  const [viewMode, setViewMode] = useState<'list' | 'list'>('list')
  const router = useRouter()
  const params = useParams()
  const contractId = params.contractId as string
  const { toast } = useToast()

  const firestore = useFirestore()
  const staffsRef = useMemoFirebase(
    () => (firestore ? collection(firestore, 'staffs') : null),
    [firestore]
  )

  const [selectedAddRole, setSelectedAddRole] = useState('')
  const roleDetails = useMemo(() => {
    if (!selectedAddRole) return null
    const role = initialRolesData.find((r) => r.id === selectedAddRole)
    if (!role) return null
    const sector = initialSectorsData.find((s) => s.id === role.sectorId)
    if (!sector) return null
    const unit = initialUnitsData.find((u) => u.id === sector.unitId)
    return { role, sector, unit }
  }, [selectedAddRole])

  const getRoleById = (roleId: string) =>
    initialRolesData.find((r) => r.id === roleId)

  const filteredEmployees = useMemo(() => {
    return employees
      .filter((employee) => {
        const term = searchTerm.toLowerCase()
        const role = getRoleById(employee.roleId)
        if (!term) return true
        return (
          employee.name.toLowerCase().includes(term) ||
          employee.email.toLowerCase().includes(term) ||
          (role && role.name.toLowerCase().includes(term))
        )
      })
      .filter((employee) => {
        if (statusFilter.length === 0) return false // Hide all if nothing is selected
        return statusFilter.includes(employee.status)
      })
  }, [employees, searchTerm, statusFilter])

  const handleAddEmployee = (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault()
    const formData = new FormData(event.currentTarget)
    const name = formData.get('name') as string

    const newEmployee: Employee = {
      id: `EMP-${Math.random().toString(36).substring(2, 6).toUpperCase()}`,
      name,
      roleId: formData.get('roleId') as string,
      email: formData.get('email') as string,
      phone: formData.get('phone') as string,
      status: 'Candidato',
      admissionDate: new Date().toISOString().split('T')[0],
      avatar: `https://i.pravatar.cc/150?u=${Math.random()}`,
    }
    setEmployees((prev) => [newEmployee, ...prev])
    setIsAddDialogOpen(false)
    setSelectedAddRole('')
    toast({
      title: 'Candidato Adicionado!',
      description: `O candidato "${name}" foi adicionado e aguarda os próximos passos.`,
    })
  }

  const handleEditEmployee = (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault()
    if (!currentEmployee) return
    const formData = new FormData(event.currentTarget)
    const name = formData.get('name') as string

    setEmployees((prev) =>
      prev.map((employee) =>
        employee.id === currentEmployee.id
          ? {
              ...employee,
              name,
              roleId: formData.get('roleId') as string,
              email: formData.get('email') as string,
              phone: formData.get('phone') as string,
            }
          : employee
      )
    )
    setIsEditDialogOpen(false)
    setCurrentEmployee(null)
  }

  const handleDeleteEmployee = () => {
    if (!currentEmployee) return
    setEmployees((prev) => prev.filter((emp) => emp.id !== currentEmployee.id))
    setIsDeleteDialogOpen(false)
    setCurrentEmployee(null)
  }

  const handleChangeStatus = (
    employeeId: string,
    newStatus: EmployeeStatus
  ) => {
    setEmployees((prev) =>
      prev.map((emp) =>
        emp.id === employeeId ? { ...emp, status: newStatus } : emp
      )
    )
  }

  const handleCreatePortalAccess = (employee: Employee) => {
    if (!staffsRef) return

    const fallback = employee.name
      .split(' ')
      .map((n) => n[0])
      .join('')
      .substring(0, 2)
      .toUpperCase()

    const newStaffData: Omit<Staff, 'id'> = {
      name: employee.name,
      email: employee.email,
      phone: employee.phone,
      perfilId: 'cliente',
      contractId: contractId,
      assinatura: getRoleById(employee.roleId)?.name || 'Cliente',
      code: `CLI-${employee.id}`,
      status: 'Ativo',
      situacao: 'Offline',
      avatar: employee.avatar,
      fallback: fallback,
    }

    // This will create a user in the `staffs` collection which is used for logins.
    // In a real scenario, you'd also create an auth user here.
    addDocumentNonBlocking(staffsRef, newStaffData)

    toast({
      title: 'Acesso ao Portal Criado!',
      description: `Um login foi criado para ${employee.name}. Eles receberão um email para definir a senha.`,
    })
  }

  const openEditDialog = (employee: Employee) => {
    setCurrentEmployee(employee)
    setIsEditDialogOpen(true)
  }

  const handleRowClick = (employeeId: string) => {
    router.push(`/dashboard/clients/${contractId}/employees/${employeeId}`)
  }

  const openDeleteDialog = (employee: Employee) => {
    setCurrentEmployee(employee)
    setIsDeleteDialogOpen(true)
  }

  const getStatusBadgeVariant = (status: EmployeeStatus) => {
    switch (status) {
      case 'Ativo':
        return 'secondary'
      case 'Candidato':
        return 'default'
      case 'Desligado':
        return 'destructive'
      case 'Férias':
        return 'outline'
      default:
        return 'default'
    }
  }

  const renderAddEmployeeForm = () => (
    <div className='grid gap-4 py-4'>
      <div className='space-y-2'>
        <Label htmlFor='roleId'>Cargo</Label>
        <Select
          name='roleId'
          value={selectedAddRole}
          onValueChange={setSelectedAddRole}
          required
        >
          <SelectTrigger>
            <SelectValue placeholder='Selecione o cargo para o novo colaborador' />
          </SelectTrigger>
          <SelectContent>
            {initialRolesData.map((role) => (
              <SelectItem key={role.id} value={role.id}>
                {role.name}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>
      </div>

      {roleDetails && (
        <div className='grid grid-cols-2 gap-4 rounded-md border bg-muted/50 p-4'>
          <div className='space-y-1'>
            <p className='text-sm font-medium text-muted-foreground'>Unidade</p>
            <p className='font-semibold'>{roleDetails.unit?.name}</p>
          </div>
          <div className='space-y-1'>
            <p className='text-sm font-medium text-muted-foreground'>Setor</p>
            <p className='font-semibold'>{roleDetails.sector.name}</p>
          </div>
        </div>
      )}

      <fieldset disabled={!selectedAddRole}>
        <div className='grid gap-4 py-4'>
          <Separator />
          <div className='space-y-2'>
            <Label htmlFor='name'>Nome do Colaborador</Label>
            <Input id='name' name='name' required />
          </div>
          <div className='grid grid-cols-2 gap-4'>
            <div className='space-y-2'>
              <Label htmlFor='email'>Email</Label>
              <Input id='email' name='email' type='email' required />
            </div>
            <div className='space-y-2'>
              <Label htmlFor='phone'>Telefone</Label>
              <Input id='phone' name='phone' />
            </div>
          </div>
        </div>
      </fieldset>
    </div>
  )

  const renderEditForm = (employee?: Employee | null) => (
    <div className='grid gap-4 py-4'>
      <div className='space-y-2'>
        <Label htmlFor='name'>Nome</Label>
        <Input id='name' name='name' defaultValue={employee?.name} required />
      </div>
      <div className='space-y-2'>
        <Label htmlFor='roleId'>Cargo</Label>
        <Select name='roleId' defaultValue={employee?.roleId} required>
          <SelectTrigger>
            <SelectValue placeholder='Selecione o cargo' />
          </SelectTrigger>
          <SelectContent>
            {initialRolesData.map((role) => (
              <SelectItem key={role.id} value={role.id}>
                {role.name}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>
      </div>
      <div className='space-y-2'>
        <Label htmlFor='email'>Email</Label>
        <Input
          id='email'
          name='email'
          type='email'
          defaultValue={employee?.email}
          required
        />
      </div>
      <div className='space-y-2'>
        <Label htmlFor='phone'>Telefone</Label>
        <Input id='phone' name='phone' defaultValue={employee?.phone} />
      </div>
    </div>
  )

  const renderEmployeeActions = (employee: Employee) => (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <Button
          aria-haspopup='true'
          size='icon'
          variant='ghost'
          onClick={(e) => e.stopPropagation()}
        >
          <MoreHorizontal className='h-4 w-4' />
          <span className='sr-only'>Alternar menu</span>
        </Button>
      </DropdownMenuTrigger>
      <DropdownMenuContent align='end' onClick={(e) => e.stopPropagation()}>
        <DropdownMenuLabel>Ações</DropdownMenuLabel>
        <DropdownMenuItem onClick={() => openEditDialog(employee)}>
          Editar
        </DropdownMenuItem>
        <DropdownMenuItem onClick={() => handleCreatePortalAccess(employee)}>
          <KeyRound className='mr-2 h-4 w-4' />
          Criar Acesso ao Portal
        </DropdownMenuItem>
        <DropdownMenuSeparator />
        <DropdownMenuSub>
          <DropdownMenuSubTrigger>Alterar Status</DropdownMenuSubTrigger>
          <DropdownMenuPortal>
            <DropdownMenuSubContent>
              <DropdownMenuItem
                onClick={() => handleChangeStatus(employee.id, 'Candidato')}
              >
                Candidato
              </DropdownMenuItem>
              <DropdownMenuItem
                onClick={() => handleChangeStatus(employee.id, 'Ativo')}
              >
                Ativo
              </DropdownMenuItem>
              <DropdownMenuItem
                onClick={() => handleChangeStatus(employee.id, 'Férias')}
              >
                Férias
              </DropdownMenuItem>
              <DropdownMenuItem
                onClick={() => handleChangeStatus(employee.id, 'Desligado')}
              >
                Desligado
              </DropdownMenuItem>
            </DropdownMenuSubContent>
          </DropdownMenuPortal>
        </DropdownMenuSub>
        <DropdownMenuSeparator />
        <DropdownMenuItem
          className='text-destructive'
          onClick={() => openDeleteDialog(employee)}
        >
          Excluir
        </DropdownMenuItem>
      </DropdownMenuContent>
    </DropdownMenu>
  )

  return (
    <>
      <Card>
        <CardHeader>
          <CardTitle>Colaboradores</CardTitle>
          <CardDescription>
            Gerencie os colaboradores desta empresa cliente.
          </CardDescription>
          <div className='flex items-center justify-between pt-4'>
            <div className='flex items-center gap-2'>
              <div className='relative w-full max-w-sm'>
                <Search className='absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground' />
                <Input
                  type='search'
                  placeholder='Buscar por nome, cargo ou email...'
                  className='pl-8'
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                />
              </div>
              <DropdownMenu>
                <DropdownMenuTrigger asChild>
                  <Button
                    variant='outline'
                    size='sm'
                    className='h-10 gap-1 text-sm'
                  >
                    <Filter className='h-3.5 w-3.5' />
                    <span className='sr-only sm:not-sr-only'>Filtro</span>
                  </Button>
                </DropdownMenuTrigger>
                <DropdownMenuContent align='end'>
                  <DropdownMenuLabel>Filtrar por Status</DropdownMenuLabel>
                  <DropdownMenuSeparator />
                  {['Candidato', 'Ativo', 'Férias', 'Desligado'].map(
                    (status) => (
                      <DropdownMenuCheckboxItem
                        key={status}
                        checked={statusFilter.includes(status)}
                        onCheckedChange={(checked) => {
                          setStatusFilter((prev) =>
                            checked
                              ? [...prev, status]
                              : prev.filter((s) => s !== status)
                          )
                        }}
                      >
                        {status}
                      </DropdownMenuCheckboxItem>
                    )
                  )}
                </DropdownMenuContent>
              </DropdownMenu>
            </div>
            <div className='flex items-center gap-2'>
              <div className='flex items-center gap-1 rounded-lg bg-muted p-1'>
                <Button
                  variant={viewMode === 'list' ? 'secondary' : 'ghost'}
                  size='icon'
                  className='h-8 w-8'
                  onClick={() => setViewMode('list')}
                >
                  <List className='h-4 w-4' />
                </Button>
                <Button
                  variant={viewMode === 'card' ? 'secondary' : 'ghost'}
                  size='icon'
                  className='h-8 w-8'
                  onClick={() => setViewMode('card')}
                >
                  <LayoutGrid className='h-4 w-4' />
                </Button>
              </div>
              <Dialog
                open={isAddDialogOpen}
                onOpenChange={(isOpen) => {
                  setIsAddDialogOpen(isOpen)
                  if (!isOpen) setSelectedAddRole('')
                }}
              >
                <DialogTrigger asChild>
                  <Button size='sm' className='h-8 gap-1'>
                    <PlusCircle className='h-3.5 w-3.5' />
                    <span className='sr-only sm:not-sr-only sm:whitespace-nowrap'>
                      Adicionar Colaborador
                    </span>
                  </Button>
                </DialogTrigger>
                <DialogContent>
                  <DialogHeader>
                    <DialogTitle>Adicionar Novo Colaborador</DialogTitle>
                    <DialogDescription>
                      Preencha os detalhes para adicionar um novo colaborador.
                    </DialogDescription>
                  </DialogHeader>
                  <form id='add-employee-form' onSubmit={handleAddEmployee}>
                    {renderAddEmployeeForm()}
                  </form>
                  <DialogFooter>
                    <Button
                      variant='outline'
                      onClick={() => {
                        setIsAddDialogOpen(false)
                        setSelectedAddRole('')
                      }}
                    >
                      Cancelar
                    </Button>
                    <Button
                      type='submit'
                      form='add-employee-form'
                      disabled={!selectedAddRole}
                    >
                      Salvar
                    </Button>
                  </DialogFooter>
                </DialogContent>
              </Dialog>
            </div>
          </div>
        </CardHeader>
        <CardContent>
          {viewMode === 'list' ? (
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Colaborador</TableHead>
                  <TableHead className='hidden md:table-cell'>Cargo</TableHead>
                  <TableHead className='hidden sm:table-cell'>
                    Admissão
                  </TableHead>
                  <TableHead>Status</TableHead>
                  <TableHead>
                    <span className='sr-only'>Ações</span>
                  </TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {filteredEmployees.map((employee) => (
                  <TableRow
                    key={employee.id}
                    onClick={() => handleRowClick(employee.id)}
                    className='cursor-pointer'
                  >
                    <TableCell>
                      <div className='flex items-center gap-3'>
                        <Avatar className='h-9 w-9'>
                          <AvatarImage
                            src={employee.avatar}
                            alt={employee.name}
                          />
                          <AvatarFallback>
                            {employee.name
                              .split(' ')
                              .map((n) => n[0])
                              .join('')}
                          </AvatarFallback>
                        </Avatar>
                        <div className='grid gap-1'>
                          <p className='font-medium leading-none'>
                            {employee.name}
                          </p>
                          <p className='text-sm text-muted-foreground'>
                            {employee.email}
                          </p>
                        </div>
                      </div>
                    </TableCell>
                    <TableCell className='hidden md:table-cell'>
                      {getRoleById(employee.roleId)?.name || 'N/A'}
                    </TableCell>
                    <TableCell className='hidden sm:table-cell'>
                      <ClientSideDateFormatter
                        dateString={employee.admissionDate}
                      />
                    </TableCell>
                    <TableCell>
                      <Badge variant={getStatusBadgeVariant(employee.status)}>
                        {employee.status}
                      </Badge>
                    </TableCell>
                    <TableCell>{renderEmployeeActions(employee)}</TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          ) : (
            <div className='grid gap-4 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4'>
              {filteredEmployees.map((employee) => (
                <Card
                  key={employee.id}
                  className='cursor-pointer'
                  onClick={() => handleRowClick(employee.id)}
                >
                  <CardHeader>
                    <div className='flex items-center justify-between'>
                      <Avatar className='h-12 w-12'>
                        <AvatarImage
                          src={employee.avatar}
                          alt={employee.name}
                        />
                        <AvatarFallback>
                          {employee.name
                            .split(' ')
                            .map((n) => n[0])
                            .join('')}
                        </AvatarFallback>
                      </Avatar>
                      {renderEmployeeActions(employee)}
                    </div>
                    <CardTitle className='pt-2'>{employee.name}</CardTitle>
                    <CardDescription>
                      {getRoleById(employee.roleId)?.name || 'N/A'}
                    </CardDescription>
                  </CardHeader>
                  <CardFooter>
                    <Badge variant={getStatusBadgeVariant(employee.status)}>
                      {employee.status}
                    </Badge>
                  </CardFooter>
                </Card>
              ))}
            </div>
          )}
        </CardContent>
      </Card>

      {/* Edit Dialog */}
      <Dialog open={isEditDialogOpen} onOpenChange={setIsEditDialogOpen}>
        <DialogContent className='sm:max-w-xl'>
          <DialogHeader>
            <DialogTitle>Editar Colaborador</DialogTitle>
            <DialogDescription>
              Modifique os detalhes do colaborador.
            </DialogDescription>
          </DialogHeader>
          <form id='edit-employee-form' onSubmit={handleEditEmployee}>
            {renderEditForm(currentEmployee)}
          </form>
          <DialogFooter>
            <Button
              variant='outline'
              onClick={() => setIsEditDialogOpen(false)}
            >
              Cancelar
            </Button>
            <Button type='submit' form='edit-employee-form'>
              Salvar Alterações
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* Delete Confirmation Dialog */}
      <AlertDialog
        open={isDeleteDialogOpen}
        onOpenChange={setIsDeleteDialogOpen}
      >
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Você tem certeza?</AlertDialogTitle>
            <AlertDialogDescription>
              Esta ação não pode ser desfeita. Isso irá excluir
              permanentemente o colaborador{' '}
              <span className='font-semibold'>{currentEmployee?.name}</span>.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel onClick={() => setCurrentEmployee(null)}>
              Cancelar
            </AlertDialogCancel>
            <AlertDialogAction onClick={handleDeleteEmployee}>
              Excluir
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </>
  )
}
export type { Employee, EmployeeStatus } from './data'
