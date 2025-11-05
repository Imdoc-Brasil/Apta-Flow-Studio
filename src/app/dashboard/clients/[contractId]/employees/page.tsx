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
import {
  MoreHorizontal,
  PlusCircle,
  CheckCircle2,
  AlertTriangle,
  XCircle,
  FileSpreadsheet,
  View,
} from 'lucide-react'
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table'
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
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu'
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select'
import { initialUnitsData } from '../units/page'
import { initialSectorsData } from '../sectors/page'
import { useRolesStore } from '../roles/page'
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs'
import { Badge } from '@/components/ui/badge'

export const initialEmployeesData = [
  {
    id: 'COL-001',
    name: 'João da Silva',
    cpf: '123.456.789-00',
    birthDate: '1990-05-15',
    role: 'Operador de Máquinas',
    sector: 'Produção',
    unit: 'Matriz São Paulo',
    asoStatus: 'Em dia',
    periodicStatus: 'Em dia',
    vaccineStatus: 'Em dia',
    epiStatus: 'Vencido',
    medicalLeaves: 2,
    leaveDays: 5,
    vacation: false,
    inssLeave: false,
    incidents: 1,
    nonConformities: 0,
    accidents: 0,
  },
  {
    id: 'COL-002',
    name: 'Maria Oliveira',
    cpf: '987.654.321-00',
    birthDate: '1988-11-22',
    role: 'Analista Administrativo',
    sector: 'Administrativo',
    unit: 'Matriz São Paulo',
    asoStatus: 'Vencido',
    periodicStatus: 'Vencido',
    vaccineStatus: 'Em dia',
    epiStatus: 'Em dia',
    medicalLeaves: 0,
    leaveDays: 0,
    vacation: true,
    inssLeave: false,
    incidents: 0,
    nonConformities: 0,
    accidents: 0,
  },
]

export type Employee = (typeof initialEmployeesData)[0]

const StatusIndicator = ({ status }: { status: string }) => {
  if (status === 'Em dia') {
    return <CheckCircle2 className='h-5 w-5 text-green-500' />
  }
  if (status === 'Vencido') {
    return <XCircle className='h-5 w-5 text-red-500' />
  }
  return <AlertTriangle className='h-5 w-5 text-yellow-500' />
}

export default function EmployeesPage() {
  const [employees, setEmployees] = useState(initialEmployeesData)
  const [isDialogOpen, setIsDialogOpen] = useState(false)
  const { roles } = useRolesStore()
  const [selectedUnit, setSelectedUnit] = useState<string | null>(null)

  const handleAddEmployee = (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault()
    const formData = new FormData(event.currentTarget)

    const unitName =
      initialUnitsData.find((u) => u.id === formData.get('unitId'))?.name || ''
    const sectorName =
      initialSectorsData.find((s) => s.id === formData.get('sectorId'))?.name ||
      ''
    const roleName =
      roles.find((r) => r.id === formData.get('roleId'))?.name || ''

    const newEmployee: Employee = {
      id: `COL-${Math.random().toString(36).substring(2, 5).toUpperCase()}`,
      name: formData.get('name') as string,
      cpf: formData.get('cpf') as string,
      birthDate: formData.get('birthDate') as string,
      role: roleName,
      sector: sectorName,
      unit: unitName,
      asoStatus: 'Pendente',
      periodicStatus: 'Pendente',
      vaccineStatus: 'Pendente',
      epiStatus: 'Não Aplicável',
      medicalLeaves: 0,
      leaveDays: 0,
      vacation: false,
      inssLeave: false,
      incidents: 0,
      nonConformities: 0,
      accidents: 0,
    }
    setEmployees((prev) => [newEmployee, ...prev])
    setIsDialogOpen(false)
    ;(event.target as HTMLFormElement).reset()
    setSelectedUnit(null)
  }

  const filteredSectors = selectedUnit
    ? initialSectorsData.filter((s) => s.unitId === selectedUnit)
    : []

  return (
    <Tabs defaultValue='list'>
      <CardHeader>
        <div className='flex items-center justify-between'>
          <CardTitle>Colaboradores</CardTitle>
          <div className='flex items-center gap-2'>
            <TabsList>
              <TabsTrigger value='list'>Lista</TabsTrigger>
              <TabsTrigger value='cards'>Cartões</TabsTrigger>
            </TabsList>
            <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
              <DialogTrigger asChild>
                <Button size='sm' className='h-10 gap-1'>
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
                    Preencha os dados do novo colaborador da empresa cliente.
                  </DialogDescription>
                </DialogHeader>
                <form id='add-employee-form' onSubmit={handleAddEmployee}>
                  <div className='grid gap-4 py-4'>
                    <div className='grid grid-cols-4 items-center gap-4'>
                      <Label htmlFor='name' className='text-right'>
                        Nome Completo
                      </Label>
                      <Input
                        id='name'
                        name='name'
                        className='col-span-3'
                        required
                      />
                    </div>
                    <div className='grid grid-cols-4 items-center gap-4'>
                      <Label htmlFor='cpf' className='text-right'>
                        CPF
                      </Label>
                      <Input
                        id='cpf'
                        name='cpf'
                        className='col-span-3'
                        required
                      />
                    </div>
                    <div className='grid grid-cols-4 items-center gap-4'>
                      <Label htmlFor='birthDate' className='text-right'>
                        Data de Nasc.
                      </Label>
                      <Input
                        id='birthDate'
                        name='birthDate'
                        type='date'
                        className='col-span-3'
                        required
                      />
                    </div>
                    <div className='grid grid-cols-4 items-center gap-4'>
                      <Label htmlFor='unitId' className='text-right'>
                        Unidade
                      </Label>
                      <Select
                        name='unitId'
                        required
                        onValueChange={setSelectedUnit}
                      >
                        <SelectTrigger className='col-span-3'>
                          <SelectValue placeholder='Selecione a unidade' />
                        </SelectTrigger>
                        <SelectContent>
                          {initialUnitsData.map((u) => (
                            <SelectItem key={u.id} value={u.id}>
                              {u.name}
                            </SelectItem>
                          ))}
                        </SelectContent>
                      </Select>
                    </div>
                    <div className='grid grid-cols-4 items-center gap-4'>
                      <Label htmlFor='sectorId' className='text-right'>
                        Setor
                      </Label>
                      <Select name='sectorId' required disabled={!selectedUnit}>
                        <SelectTrigger className='col-span-3'>
                          <SelectValue placeholder='Selecione o setor' />
                        </SelectTrigger>
                        <SelectContent>
                          {filteredSectors.map((s) => (
                            <SelectItem key={s.id} value={s.id}>
                              {s.name}
                            </SelectItem>
                          ))}
                        </SelectContent>
                      </Select>
                    </div>
                    <div className='grid grid-cols-4 items-center gap-4'>
                      <Label htmlFor='roleId' className='text-right'>
                        Cargo
                      </Label>
                      <Select name='roleId' required>
                        <SelectTrigger className='col-span-3'>
                          <SelectValue placeholder='Selecione o cargo' />
                        </SelectTrigger>
                        <SelectContent>
                          {roles.map((r) => (
                            <SelectItem key={r.id} value={r.id}>
                              {r.name}
                            </SelectItem>
                          ))}
                        </SelectContent>
                      </Select>
                    </div>
                  </div>
                  <DialogFooter>
                    <Button
                      variant='outline'
                      onClick={() => {
                        setIsDialogOpen(false)
                        setSelectedUnit(null)
                      }}
                    >
                      Cancelar
                    </Button>
                    <Button type='submit'>Salvar Colaborador</Button>
                  </DialogFooter>
                </form>
              </DialogContent>
            </Dialog>
          </div>
        </div>
        <CardDescription>
          Gerencie os colaboradores deste cliente e suas funções.
        </CardDescription>
      </CardHeader>
      <TabsContent value='list'>
        <CardContent>
          {employees.length > 0 ? (
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Nome</TableHead>
                  <TableHead>CPF</TableHead>
                  <TableHead>Cargo</TableHead>
                  <TableHead>Setor</TableHead>
                  <TableHead>
                    <span className='sr-only'>Ações</span>
                  </TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {employees
                  .sort((a, b) => a.name.localeCompare(b.name))
                  .map((employee) => (
                    <TableRow key={employee.id}>
                      <TableCell className='font-medium'>
                        {employee.name}
                      </TableCell>
                      <TableCell>{employee.cpf}</TableCell>
                      <TableCell>{employee.role}</TableCell>
                      <TableCell>{employee.sector}</TableCell>
                      <TableCell className='text-right'>
                        <DropdownMenu>
                          <DropdownMenuTrigger asChild>
                            <Button size='icon' variant='ghost'>
                              <MoreHorizontal className='h-4 w-4' />
                            </Button>
                          </DropdownMenuTrigger>
                          <DropdownMenuContent>
                            <DropdownMenuLabel>Ações</DropdownMenuLabel>
                            <DropdownMenuItem>Ver Detalhes</DropdownMenuItem>
                            <DropdownMenuItem>Editar</DropdownMenuItem>
                            <DropdownMenuItem className='text-destructive'>
                              Excluir
                            </DropdownMenuItem>
                          </DropdownMenuContent>
                        </DropdownMenu>
                      </TableCell>
                    </TableRow>
                  ))}
              </TableBody>
            </Table>
          ) : (
            <div className='flex flex-1 items-center justify-center rounded-lg border border-dashed shadow-sm h-96'>
              <div className='flex flex-col items-center gap-1 text-center'>
                <h3 className='text-2xl font-bold tracking-tight'>
                  Nenhum colaborador cadastrado
                </h3>
                <p className='text-sm text-muted-foreground'>
                  Comece adicionando o primeiro colaborador para este cliente.
                </p>
                <Button className='mt-4' onClick={() => setIsDialogOpen(true)}>
                  Adicionar Colaborador
                </Button>
              </div>
            </div>
          )}
        </CardContent>
      </TabsContent>
      <TabsContent value='cards'>
        <CardContent>
          <div className='grid gap-6 md:grid-cols-2 lg:grid-cols-3'>
            {employees
              .sort((a, b) => a.name.localeCompare(b.name))
              .map((employee) => (
                <Card key={employee.id}>
                  <CardHeader>
                    <CardTitle className='flex justify-between items-start'>
                      <div>
                        {employee.name}
                        <p className='text-sm text-muted-foreground font-normal'>
                          {employee.role}
                        </p>
                      </div>
                      <Badge
                        variant={
                          employee.vacation || employee.inssLeave
                            ? 'destructive'
                            : 'secondary'
                        }
                      >
                        {employee.vacation
                          ? 'Férias'
                          : employee.inssLeave
                            ? 'Afastado'
                            : 'Ativo'}
                      </Badge>
                    </CardTitle>
                  </CardHeader>
                  <CardContent className='space-y-4'>
                    <div className='text-sm text-muted-foreground space-y-2'>
                      <div className='flex justify-between items-center'>
                        <span>ASO</span>
                        <StatusIndicator status={employee.asoStatus} />
                      </div>
                      <div className='flex justify-between items-center'>
                        <span>Periódico</span>
                        <StatusIndicator status={employee.periodicStatus} />
                      </div>
                      <div className='flex justify-between items-center'>
                        <span>Vacinas</span>
                        <StatusIndicator status={employee.vaccineStatus} />
                      </div>
                      <div className='flex justify-between items-center'>
                        <span>EPI</span>
                        <StatusIndicator status={employee.epiStatus} />
                      </div>
                    </div>
                    <div className='grid grid-cols-2 gap-4 text-center'>
                      <div className='p-2 rounded-lg bg-muted'>
                        <p className='text-xs text-muted-foreground'>
                          Atestados (Dias)
                        </p>
                        <p className='text-lg font-bold'>
                          {employee.medicalLeaves} ({employee.leaveDays})
                        </p>
                      </div>
                      <div className='p-2 rounded-lg bg-muted'>
                        <p className='text-xs text-muted-foreground'>
                          Eventos de SST
                        </p>
                        <p className='text-lg font-bold'>
                          {employee.incidents +
                            employee.nonConformities +
                            employee.accidents}
                        </p>
                      </div>
                    </div>
                  </CardContent>
                  <CardFooter>
                    <Button variant='outline' className='w-full'>
                      Ver Prontuário
                    </Button>
                  </CardFooter>
                </Card>
              ))}
          </div>
        </CardContent>
      </TabsContent>
    </Tabs>
  )
}

    