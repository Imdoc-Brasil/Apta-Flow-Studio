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
  GraduationCap,
  Ticket,
  Siren,
  FileWarning,
  Plus,
  CalendarPlus,
  HeartPulse,
  HardHat,
  FileText,
  Upload,
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
import Link from 'next/link'
import { useParams } from 'next/navigation'
import { Separator } from '@/components/ui/separator'
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from '@/components/ui/accordion'
import { Checkbox } from '@/components/ui/checkbox'

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
    trainingStatus: 'Em dia',
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
    trainingStatus: 'Pendente',
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
type DocumentTopic =
  | 'ASOs'
  | 'Atestados Médicos'
  | 'Certificados'
  | 'Comprovantes de EPI'
  | 'Advertências'
  | 'Ordem de Serviço'
export type EmployeeDocument = {
  id: string
  name: string
  topic: DocumentTopic
  uploadDate: string
  file?: File
  // Fields for Atestado
  institution?: string
  doctorName?: string
  doctorCrm?: string
  issueDate?: string
  daysOff?: number
  cid?: string
  isWorkAccident?: boolean
}

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
  const params = useParams()
  const contractId = params.contractId as string

  const [employees, setEmployees] = useState(initialEmployeesData)
  const [isAddDialogOpen, setIsAddDialogOpen] = useState(false)
  const [isDetailOpen, setIsDetailOpen] = useState(false)
  const [currentEmployee, setCurrentEmployee] = useState<Employee | null>(null)
  const [employeeDocs, setEmployeeDocs] = useState<
    Record<string, EmployeeDocument[]>
  >({})
  const { roles } = useRolesStore()
  const [selectedUnit, setSelectedUnit] = useState<string | null>(null)
  const [isAddDocOpen, setIsAddDocOpen] = useState(false)
  const [isAtestadoDocOpen, setIsAtestadoDocOpen] = useState(false)

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
      trainingStatus: 'Pendente',
      medicalLeaves: 0,
      leaveDays: 0,
      vacation: false,
      inssLeave: false,
      incidents: 0,
      nonConformities: 0,
      accidents: 0,
    }
    setEmployees((prev) => [newEmployee, ...prev])
    setIsAddDialogOpen(false)
    ;(event.target as HTMLFormElement).reset()
    setSelectedUnit(null)
  }

  const handleAddDocument = (
    employeeId: string,
    event: React.FormEvent<HTMLFormElement>
  ) => {
    event.preventDefault()
    const formData = new FormData(event.currentTarget)
    const fileInput = event.currentTarget.elements.namedItem(
      'file'
    ) as HTMLInputElement
    const file = fileInput?.files?.[0]

    if (!file) return

    const newDoc: EmployeeDocument = {
      id: `DOC-${Date.now()}`,
      name: formData.get('name') as string,
      topic: formData.get('topic') as DocumentTopic,
      uploadDate: new Date().toISOString().split('T')[0],
      file,
    }

    setEmployeeDocs((prev) => ({
      ...prev,
      [employeeId]: [...(prev[employeeId] || []), newDoc],
    }))
    setIsAddDocOpen(false)
  }

  const handleAddAtestado = (
    employeeId: string,
    event: React.FormEvent<HTMLFormElement>
  ) => {
    event.preventDefault();
    const formData = new FormData(event.currentTarget);
    const fileInput = event.currentTarget.elements.namedItem('atestado-file') as HTMLInputElement;
    const file = fileInput?.files?.[0];

    const daysOff = parseInt(formData.get('daysOff') as string, 10) || 0;

    const newAtestado: EmployeeDocument = {
      id: `DOC-A-${Date.now()}`,
      topic: 'Atestados Médicos',
      name: `Atestado - ${formData.get('issueDate')} (${daysOff} dias)`,
      uploadDate: new Date().toISOString().split('T')[0],
      file,
      institution: formData.get('institution') as string,
      doctorName: formData.get('doctorName') as string,
      doctorCrm: formData.get('doctorCrm') as string,
      issueDate: formData.get('issueDate') as string,
      daysOff: daysOff,
      cid: formData.get('cid') as string,
      isWorkAccident: !!formData.get('isWorkAccident'),
    };

    setEmployeeDocs((prev) => ({
      ...prev,
      [employeeId]: [...(prev[employeeId] || []), newAtestado],
    }));

    setEmployees(prev => prev.map(emp => {
      if (emp.id === employeeId) {
        return {
          ...emp,
          medicalLeaves: emp.medicalLeaves + 1,
          leaveDays: emp.leaveDays + daysOff,
        }
      }
      return emp;
    }));
    
    // Update currentEmployee state as well to reflect changes immediately in the dialog
    setCurrentEmployee(prev => {
        if (prev && prev.id === employeeId) {
            return {
                ...prev,
                medicalLeaves: prev.medicalLeaves + 1,
                leaveDays: prev.leaveDays + daysOff,
            }
        }
        return prev;
    });

    setIsAtestadoDocOpen(false);
  };

  const filteredSectors = selectedUnit
    ? initialSectorsData.filter((s) => s.unitId === selectedUnit)
    : []

  const openDetailDialog = (employee: Employee) => {
    setCurrentEmployee(employee)
    setIsDetailOpen(true)
  }

  const renderDetailDialog = () => {
    const documentTopics: DocumentTopic[] = [
      'ASOs',
      'Atestados Médicos',
      'Certificados',
      'Comprovantes de EPI',
      'Advertências',
      'Ordem de Serviço',
    ]

    const employeeId = currentEmployee?.id || ''
    const currentDocs = employeeDocs[employeeId] || []

    return (
      <Dialog open={isDetailOpen} onOpenChange={setIsDetailOpen}>
        <DialogContent className='sm:max-w-4xl'>
          <DialogHeader>
            <DialogTitle>{currentEmployee?.name}</DialogTitle>
            <DialogDescription>
              {currentEmployee?.role} - {currentEmployee?.sector}
            </DialogDescription>
          </DialogHeader>
          {currentEmployee && (
            <div className='grid gap-6 py-4'>
              <div className='grid grid-cols-2 md:grid-cols-4 gap-4 text-sm'>
                <div>
                  <p className='text-muted-foreground'>CPF</p>
                  <p>{currentEmployee.cpf}</p>
                </div>
                <div>
                  <p className='text-muted-foreground'>Data Nasc.</p>
                  <p>{currentEmployee.birthDate}</p>
                </div>
                <div>
                  <p className='text-muted-foreground'>Unidade</p>
                  <p>{currentEmployee.unit}</p>
                </div>
                <div>
                  <p className='text-muted-foreground'>Situação</p>
                  <Badge
                    variant={
                      currentEmployee.vacation || currentEmployee.inssLeave
                        ? 'destructive'
                        : 'secondary'
                    }
                  >
                    {currentEmployee.vacation
                      ? 'Férias'
                      : currentEmployee.inssLeave
                        ? 'Afastado'
                        : 'Ativo'}
                  </Badge>
                </div>
              </div>

              <Separator />

              <div>
                <h4 className='font-semibold text-base mb-4'>Ações Rápidas</h4>
                <div className='grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-2'>
                  <Button variant='outline' size='sm' className='justify-start'>
                    <Siren className='mr-2' />
                    Registrar Incidente
                  </Button>
                  <Button variant='outline' size='sm' className='justify-start'>
                    <FileWarning className='mr-2' />
                    Registrar NC
                  </Button>
                  <Button variant='outline' size='sm' className='justify-start'>
                    <Plus className='mr-2' />
                    Gerar Pedido Exame
                  </Button>
                  <Button variant='outline' size='sm' className='justify-start'>
                    <CalendarPlus className='mr-2' />
                    Agendar Atendimento
                  </Button>
                  <Button variant='outline' size='sm' className='justify-start'>
                    <GraduationCap className='mr-2' />
                    Agendar Treinamento
                  </Button>
                  <Button variant='outline' size='sm' className='justify-start'>
                    <FileSpreadsheet className='mr-2' />
                    Registrar Advertência
                  </Button>
                  <Button variant='outline' size='sm' className='justify-start'>
                    <HardHat className='mr-2' />
                    Entregar EPI
                  </Button>
                </div>
              </div>

              <div className='grid grid-cols-1 md:grid-cols-3 gap-6'>
                <Card>
                  <CardHeader>
                    <CardTitle className='text-lg'>Resumo de SST</CardTitle>
                  </CardHeader>
                  <CardContent className='grid grid-cols-2 gap-x-4 gap-y-2 text-sm'>
                    <div className='flex justify-between items-center'>
                      <span>ASO</span>
                      <StatusIndicator status={currentEmployee.asoStatus} />
                    </div>
                    <div className='flex justify-between items-center'>
                      <span>Periódico</span>
                      <StatusIndicator
                        status={currentEmployee.periodicStatus}
                      />
                    </div>
                    <div className='flex justify-between items-center'>
                      <span>Vacinas</span>
                      <StatusIndicator status={currentEmployee.vaccineStatus} />
                    </div>
                    <div className='flex justify-between items-center'>
                      <span>EPI</span>
                      <StatusIndicator status={currentEmployee.epiStatus} />
                    </div>
                    <div className='flex justify-between items-center'>
                      <span>Treinamentos</span>
                      <StatusIndicator
                        status={currentEmployee.trainingStatus}
                      />
                    </div>
                  </CardContent>
                </Card>
                <Card>
                  <CardHeader>
                    <CardTitle className='text-lg'>Indicadores</CardTitle>
                  </CardHeader>
                  <CardContent className='grid grid-cols-2 gap-4 text-center'>
                    <div className='p-2 rounded-lg bg-muted'>
                      <p className='text-xs text-muted-foreground'>
                        Atestados (Dias)
                      </p>
                      <p className='text-lg font-bold'>
                        {currentEmployee.medicalLeaves} ({currentEmployee.leaveDays})
                      </p>
                    </div>
                    <div className='p-2 rounded-lg bg-muted'>
                      <p className='text-xs text-muted-foreground'>Incidentes</p>
                      <p className='text-lg font-bold'>
                        {currentEmployee.incidents}
                      </p>
                    </div>
                    <div className='p-2 rounded-lg bg-muted'>
                      <p className='text-xs text-muted-foreground'>
                        Não Conformidades
                      </p>
                      <p className='text-lg font-bold'>
                        {currentEmployee.nonConformities}
                      </p>
                    </div>
                    <div className='p-2 rounded-lg bg-muted'>
                      <p className='text-xs text-muted-foreground'>Acidentes</p>
                      <p className='text-lg font-bold'>
                        {currentEmployee.accidents}
                      </p>
                    </div>
                  </CardContent>
                </Card>
                <Card>
                  <CardHeader>
                    <CardTitle className='text-lg'>Documentos</CardTitle>
                  </CardHeader>
                  <CardContent className='flex flex-col gap-2'>
                    <Accordion type='single' collapsible className='w-full'>
                      {documentTopics.map((topic) => {
                        const docsForTopic = currentDocs.filter(
                          (d) => d.topic === topic
                        )
                        return (
                          <AccordionItem value={topic} key={topic}>
                            <AccordionTrigger>{topic}</AccordionTrigger>
                            <AccordionContent>
                              {topic === 'Atestados Médicos' && (
                                <Dialog open={isAtestadoDocOpen} onOpenChange={setIsAtestadoDocOpen}>
                                  <DialogTrigger asChild>
                                    <Button variant='outline' size='sm' className='w-full mb-2'>
                                      <Upload className='mr-2 h-4 w-4' />
                                      Registrar Atestado
                                    </Button>
                                  </DialogTrigger>
                                  <DialogContent className='sm:max-w-2xl'>
                                    <DialogHeader>
                                      <DialogTitle>Registrar Atestado Médico</DialogTitle>
                                      <DialogDescription>
                                        Preencha os detalhes do atestado médico para{' '}
                                        <span className='font-semibold'>{currentEmployee.name}</span>.
                                      </DialogDescription>
                                    </DialogHeader>
                                    <form id="add-atestado-form" onSubmit={(e) => handleAddAtestado(employeeId, e)}>
                                      <div className='grid gap-3 py-4'>
                                          <div className='grid grid-cols-2 gap-4'>
                                            <div className='space-y-1.5'>
                                              <Label htmlFor='institution'>Instituição/Unidade de Saúde</Label>
                                              <Input id='institution' name='institution' required />
                                            </div>
                                            <div className='space-y-1.5'>
                                              <Label htmlFor='issueDate'>Data de Emissão</Label>
                                              <Input id='issueDate' name='issueDate' type='date' required />
                                            </div>
                                          </div>
                                           <div className='grid grid-cols-2 gap-4'>
                                             <div className='space-y-1.5'>
                                                <Label htmlFor='doctorName'>Nome do Médico Emissor</Label>
                                                <Input id='doctorName' name='doctorName' required />
                                             </div>
                                             <div className='space-y-1.5'>
                                                <Label htmlFor='doctorCrm'>CRM</Label>
                                                <Input id='doctorCrm' name='doctorCrm' required />
                                             </div>
                                           </div>
                                            <div className='grid grid-cols-2 gap-4'>
                                              <div className='space-y-1.5'>
                                                <Label htmlFor='daysOff'>Total de Dias</Label>
                                                <Input id='daysOff' name='daysOff' type='number' required min="0" />
                                              </div>
                                              <div className='space-y-1.5'>
                                                <Label htmlFor='cid'>CID</Label>
                                                <Input id='cid' name='cid' />
                                              </div>
                                            </div>
                                            <div className='space-y-1.5'>
                                               <Label htmlFor='atestado-file'>Arquivo do Atestado</Label>
                                               <Input id='atestado-file' name='atestado-file' type='file' required />
                                            </div>
                                            <div className='flex items-center space-x-2'>
                                               <Checkbox id='isWorkAccident' name='isWorkAccident' />
                                               <Label htmlFor='isWorkAccident'>Relacionado a Acidente de Trabalho</Label>
                                            </div>
                                      </div>
                                    </form>
                                    <DialogFooter>
                                      <Button variant='outline' onClick={() => setIsAtestadoDocOpen(false)}>Cancelar</Button>
                                      <Button type='submit' form='add-atestado-form'>Salvar Atestado</Button>
                                    </DialogFooter>
                                  </DialogContent>
                                </Dialog>
                              )}
                              {docsForTopic.length > 0 ? (
                                <ul className='space-y-2'>
                                  {docsForTopic.map((doc) => (
                                    <li
                                      key={doc.id}
                                      className='flex items-center justify-between text-sm'
                                    >
                                      <Link
                                        href={doc.file ? URL.createObjectURL(doc.file) : '#'}
                                        target='_blank'
                                        className='hover:underline flex items-center gap-2'
                                      >
                                        <FileText className='h-4 w-4' />
                                        {doc.name}
                                      </Link>
                                      <span className='text-xs text-muted-foreground'>
                                        {doc.uploadDate}
                                      </span>
                                    </li>
                                  ))}
                                </ul>
                              ) : (
                                <p className='text-sm text-muted-foreground text-center py-2'>
                                  Nenhum documento encontrado.
                                </p>
                              )}
                            </AccordionContent>
                          </AccordionItem>
                        )
                      })}
                    </Accordion>
                  </CardContent>
                </Card>
              </div>
            </div>
          )}
          <DialogFooter>
            <Button variant='outline' onClick={() => setIsDetailOpen(false)}>
              Fechar
            </Button>
            <Button asChild variant='secondary'>
              <Link
                href={`/dashboard/clients/${contractId}/tickets?employee=${currentEmployee?.id}`}
              >
                <Ticket className='mr-2 h-4 w-4' />
                Abrir Chamado
              </Link>
            </Button>
            <Button>Ver Prontuário Completo</Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    )
  }

  return (
    <>
      <Tabs defaultValue='list'>
        <CardHeader>
          <div className='flex items-center justify-between'>
            <CardTitle>Colaboradores</CardTitle>
            <div className='flex items-center gap-2'>
              <TabsList>
                <TabsTrigger value='list'>Lista</TabsTrigger>
                <TabsTrigger value='cards'>Cartões</TabsTrigger>
              </TabsList>
              <Dialog open={isAddDialogOpen} onOpenChange={setIsAddDialogOpen}>
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
                        <Select
                          name='sectorId'
                          required
                          disabled={!selectedUnit}
                        >
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
                          setIsAddDialogOpen(false)
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
                      <TableRow
                        key={employee.id}
                        className='cursor-pointer'
                        onClick={() => openDetailDialog(employee)}
                      >
                        <TableCell className='font-medium'>
                          {employee.name}
                        </TableCell>
                        <TableCell>{employee.cpf}</TableCell>
                        <TableCell>{employee.role}</TableCell>
                        <TableCell>{employee.sector}</TableCell>
                        <TableCell className='text-right'>
                          <DropdownMenu>
                            <DropdownMenuTrigger asChild>
                              <Button
                                size='icon'
                                variant='ghost'
                                onClick={(e) => e.stopPropagation()}
                              >
                                <MoreHorizontal className='h-4 w-4' />
                              </Button>
                            </DropdownMenuTrigger>
                            <DropdownMenuContent
                              onClick={(e) => e.stopPropagation()}
                            >
                              <DropdownMenuLabel>Ações</DropdownMenuLabel>
                              <DropdownMenuItem
                                onClick={() => openDetailDialog(employee)}
                              >
                                Ver Detalhes
                              </DropdownMenuItem>
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
                  <Button
                    className='mt-4'
                    onClick={() => setIsAddDialogOpen(true)}
                  >
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
                  <Card
                    key={employee.id}
                    className='cursor-pointer hover:bg-muted/50'
                    onClick={() => openDetailDialog(employee)}
                  >
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
                        <div className='flex justify-between items-center'>
                          <span>Treinamentos</span>
                          <StatusIndicator status={employee.trainingStatus} />
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
                  </Card>
                ))}
            </div>
          </CardContent>
        </TabsContent>
      </Tabs>
      {currentEmployee && renderDetailDialog()}
    </>
  )
}
