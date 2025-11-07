
'use client'

import { useState, useMemo, useEffect } from 'react'
import { MoreHorizontal, PlusCircle, Search, Filter } from 'lucide-react'
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
import { initialEnvironmentsData } from '../environments/data'
import { Separator } from '@/components/ui/separator'

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
  const [isDetailOpen, setIsDetailOpen] = useState(false)
  const [isDeleteDialogOpen, setIsDeleteDialogOpen] = useState(false)
  const [currentEmployee, setCurrentEmployee] = useState<Employee | null>(null)
  const [searchTerm, setSearchTerm] = useState('')
  const [statusFilter, setStatusFilter] = useState<string[]>([
    'Ativo',
    'Férias',
    'Desligado',
  ])

  const getRoleById = (roleId: string) =>
    initialRolesData.find((r) => r.id === roleId)
  const getSectorById = (sectorId: string) =>
    initialSectorsData.find((s) => s.id === sectorId)
  const getUnitById = (unitId: string) =>
    initialUnitsData.find((u) => u.id === unitId)
  const getEnvironmentById = (envId: string) =>
    initialEnvironmentsData.find((e) => e.id === envId)

  const getEmployeeDetails = (employee: Employee | null) => {
    if (!employee) return null

    const role = getRoleById(employee.roleId)
    if (!role)
      return { employee, role: null, sector: null, unit: null, environment: null }

    const sector = getSectorById(role.sectorId)
    if (!sector)
      return { employee, role, sector: null, unit: null, environment: null }

    const unit = getUnitById(sector.unitId)
    const environment = role.environmentId
      ? getEnvironmentById(role.environmentId)
      : null
      
    return { employee, role, sector, unit, environment }
  }

  const currentEmployeeDetails = useMemo(
    () => getEmployeeDetails(currentEmployee),
    [currentEmployee]
  )

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
      status: 'Ativo',
      admissionDate: new Date().toISOString().split('T')[0],
      avatar: `https://i.pravatar.cc/150?u=${Math.random()}`,
    }
    setEmployees((prev) => [newEmployee, ...prev])
    setIsAddDialogOpen(false)
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

  const openEditDialog = (employee: Employee) => {
    setCurrentEmployee(employee)
    setIsEditDialogOpen(true)
  }

  const openDetailDialog = (employee: Employee) => {
    setCurrentEmployee(employee)
    setIsDetailOpen(true)
  }

  const openDeleteDialog = (employee: Employee) => {
    setCurrentEmployee(employee)
    setIsDeleteDialogOpen(true)
  }

  const getStatusBadgeVariant = (status: EmployeeStatus) => {
    switch (status) {
      case 'Ativo':
        return 'secondary'
      case 'Desligado':
        return 'destructive'
      case 'Férias':
        return 'outline'
      default:
        return 'default'
    }
  }

  const renderEmployeeForm = (employee?: Employee | null) => (
    <div className='grid gap-4 py-4'>
      <div className='grid grid-cols-4 items-center gap-4'>
        <Label htmlFor='name' className='text-right'>
          Nome
        </Label>
        <Input
          id='name'
          name='name'
          className='col-span-3'
          defaultValue={employee?.name}
          required
        />
      </div>
      <div className='grid grid-cols-4 items-center gap-4'>
        <Label htmlFor='roleId' className='text-right'>
          Cargo
        </Label>
        <Select name='roleId' defaultValue={employee?.roleId} required>
          <SelectTrigger className='col-span-3'>
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
      <div className='grid grid-cols-4 items-center gap-4'>
        <Label htmlFor='email' className='text-right'>
          Email
        </Label>
        <Input
          id='email'
          name='email'
          type='email'
          className='col-span-3'
          defaultValue={employee?.email}
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
          defaultValue={employee?.phone}
          className='col-span-3'
        />
      </div>
    </div>
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
                  {['Ativo', 'Férias', 'Desligado'].map((status) => (
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
                  ))}
                </DropdownMenuContent>
              </DropdownMenu>
            </div>
            <Dialog open={isAddDialogOpen} onOpenChange={setIsAddDialogOpen}>
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
                  {renderEmployeeForm()}
                </form>
                <DialogFooter>
                  <Button
                    variant='outline'
                    onClick={() => setIsAddDialogOpen(false)}
                  >
                    Cancelar
                  </Button>
                  <Button type='submit' form='add-employee-form'>
                    Salvar
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
                <TableHead>Colaborador</TableHead>
                <TableHead className='hidden md:table-cell'>Cargo</TableHead>
                <TableHead className='hidden sm:table-cell'>Admissão</TableHead>
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
                  onClick={() => openDetailDialog(employee)}
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
                    <ClientSideDateFormatter dateString={employee.admissionDate} />
                  </TableCell>
                  <TableCell>
                    <Badge variant={getStatusBadgeVariant(employee.status)}>
                      {employee.status}
                    </Badge>
                  </TableCell>
                  <TableCell>
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
                      <DropdownMenuContent
                        align='end'
                        onClick={(e) => e.stopPropagation()}
                      >
                        <DropdownMenuLabel>Ações</DropdownMenuLabel>
                        <DropdownMenuItem
                          onClick={() => openEditDialog(employee)}
                        >
                          Editar
                        </DropdownMenuItem>
                        <DropdownMenuSeparator />
                        <DropdownMenuSub>
                          <DropdownMenuSubTrigger>
                            Alterar Status
                          </DropdownMenuSubTrigger>
                          <DropdownMenuPortal>
                            <DropdownMenuSubContent>
                              <DropdownMenuItem
                                onClick={() =>
                                  handleChangeStatus(employee.id, 'Ativo')
                                }
                              >
                                Ativo
                              </DropdownMenuItem>
                              <DropdownMenuItem
                                onClick={() =>
                                  handleChangeStatus(employee.id, 'Férias')
                                }
                              >
                                Férias
                              </DropdownMenuItem>
                              <DropdownMenuItem
                                onClick={() =>
                                  handleChangeStatus(employee.id, 'Desligado')
                                }
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
            <DialogTitle>Editar Colaborador</DialogTitle>
            <DialogDescription>
              Modifique os detalhes do colaborador.
            </DialogDescription>
          </DialogHeader>
          <form id='edit-employee-form' onSubmit={handleEditEmployee}>
            {renderEmployeeForm(currentEmployee)}
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

      {/* Detail Dialog */}
      <Dialog open={isDetailOpen} onOpenChange={setIsDetailOpen}>
        <DialogContent className='sm:max-w-xl'>
          <DialogHeader>
            <DialogTitle>Detalhes do Colaborador</DialogTitle>
          </DialogHeader>
          {currentEmployeeDetails?.employee && (
            <div className='grid gap-4 py-4'>
              <div className='flex items-center gap-4'>
                <Avatar className='h-20 w-20'>
                  <AvatarImage
                    src={currentEmployeeDetails.employee.avatar}
                    alt={currentEmployeeDetails.employee.name}
                  />
                  <AvatarFallback>
                    {currentEmployeeDetails.employee.name
                      .split(' ')
                      .map((n) => n[0])
                      .join('')}
                  </AvatarFallback>
                </Avatar>
                <div>
                  <p className='font-bold text-xl'>
                    {currentEmployeeDetails.employee.name}
                  </p>
                  <p className='text-sm text-muted-foreground'>
                    {currentEmployeeDetails.employee.email}
                  </p>
                  <p className='text-sm text-muted-foreground'>
                    {currentEmployeeDetails.employee.phone}
                  </p>
                </div>
              </div>

              <Separator />

              <div className='grid grid-cols-2 gap-x-4 gap-y-6'>
                <div className='space-y-1'>
                  <p className='text-sm font-medium text-muted-foreground'>
                    Cargo
                  </p>
                  <p>{currentEmployeeDetails.role?.name || 'N/A'}</p>
                </div>
                <div className='space-y-1'>
                  <p className='text-sm font-medium text-muted-foreground'>
                    Setor
                  </p>
                  <p>{currentEmployeeDetails.sector?.name || 'N/A'}</p>
                </div>
                <div className='space-y-1'>
                  <p className='text-sm font-medium text-muted-foreground'>
                    Unidade
                  </p>
                  <p>{currentEmployeeDetails.unit?.name || 'N/A'}</p>
                </div>
                 <div className='space-y-1'>
                  <p className='text-sm font-medium text-muted-foreground'>
                    Posto de Trabalho
                  </p>
                  <p>{currentEmployeeDetails.environment?.name || 'N/A'}</p>
                </div>
                <div className='space-y-1'>
                  <p className='text-sm font-medium text-muted-foreground'>
                    Status
                  </p>
                  <Badge
                    variant={getStatusBadgeVariant(
                      currentEmployeeDetails.employee.status
                    )}
                  >
                    {currentEmployeeDetails.employee.status}
                  </Badge>
                </div>
                <div className='space-y-1'>
                  <p className='text-sm font-medium text-muted-foreground'>
                    Data de Admissão
                  </p>
                  <p>
                    <ClientSideDateFormatter dateString={currentEmployeeDetails.employee.admissionDate} />
                  </p>
                </div>
              </div>

              <Separator />

              {/* Future sections for EPIs, Exams, etc. can go here */}
              <div className='text-center text-sm text-muted-foreground pt-4'>
                Futuras informações de SST (EPIs, Exames) aparecerão aqui.
              </div>
            </div>
          )}
          <DialogFooter>
            <Button onClick={() => setIsDetailOpen(false)}>Fechar</Button>
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
