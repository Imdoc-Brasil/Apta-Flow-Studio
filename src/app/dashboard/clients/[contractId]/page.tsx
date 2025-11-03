

'use client';

import { useState } from 'react';
import type { FC } from 'react';
import { useParams } from 'next/navigation';

import {
  ArrowLeft,
  ChevronLeft,
  FileText,
  Mail,
  MapPin,
  Phone,
  User,
  Building2,
  Network,
  UserRound,
  Users,
  PlusCircle,
  TrendingUp,
  FileWarning,
  Ticket,
  ShieldAlert,
  ClipboardCheck,
  HardHat,
  Bell,
  CheckCircle2,
  XCircle,
  Clock,
  MoreHorizontal,
  FileClock,
  Building,
  Briefcase,
  HeartPulse,
  BookUser,
  FolderOpen,
  CalendarDays,
  FilePen,
  ListTodo,
  Loader,
  CircleOff,
} from 'lucide-react';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { initialClientsData } from '../page';
import Link from 'next/link';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle, DialogTrigger, DialogFooter } from '@/components/ui/dialog';
import { Label } from '@/components/ui/label';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { RadioGroup, RadioGroupItem } from '@/components/ui/radio-group';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuLabel, DropdownMenuTrigger, DropdownMenuSeparator } from '@/components/ui/dropdown-menu';
import { Select, SelectTrigger, SelectValue, SelectContent, SelectItem } from '@/components/ui/select';
import { ScrollArea } from '@/components/ui/scroll-area';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { differenceInMonths, format, formatDistanceToNow } from 'date-fns';
import { ptBR } from 'date-fns/locale';

const getClientById = (contractId: string) => {
    return initialClientsData.find((client) => client.contractId === contractId);
};


function SSTDocumentsDashboard() {
    const kpiData = [
        { title: 'Ações Pendentes', value: '5', icon: <CircleOff className="h-4 w-4 text-muted-foreground" />, variant: 'pending' },
        { title: 'Ações em Andamento', value: '3', icon: <Loader className="h-4 w-4 text-muted-foreground" />, variant: 'progress' },
        { title: 'Ações Concluídas', value: '12', icon: <CheckCircle2 className="h-4 w-4 text-muted-foreground" />, variant: 'completed' },
    ];

    const documents = [
        { id: 'PGR-2024-V1', name: 'PGR - Programa de Gerenciamento de Riscos', version: '1.0', emissionDate: '2024-01-15', expiryDate: '2026-01-15' },
        { id: 'LTCAT-2024-V1', name: 'LTCAT - Laudo Técnico das Condições do Ambiente de Trabalho', version: '1.0', emissionDate: '2024-01-15', expiryDate: 'N/A' },
    ];

    return (
        <div className="space-y-6">
            <div className="flex items-center justify-between">
                <h3 className="text-xl font-semibold">Gestão de Documentos SST</h3>
                <Button size="sm" className="h-8 gap-1">
                    <PlusCircle className="h-3.5 w-3.5" />
                    <span className="sr-only sm:not-sr-only sm:whitespace-nowrap">
                        Gerar PGR/LTCAT
                    </span>
                </Button>
            </div>
            
            <Card>
                <CardHeader>
                    <CardTitle>Plano de Ação - KPIs</CardTitle>
                    <CardDescription>Status das ações do plano de ação do PGR.</CardDescription>
                </CardHeader>
                <CardContent className="grid gap-4 md:grid-cols-3">
                     {kpiData.map(kpi => (
                        <Card key={kpi.title}>
                            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                                <CardTitle className="text-sm font-medium">{kpi.title}</CardTitle>
                                {kpi.icon}
                            </CardHeader>
                            <CardContent>
                                <div className="text-2xl font-bold">{kpi.value}</div>
                            </CardContent>
                        </Card>
                    ))}
                </CardContent>
            </Card>

            <Card>
                <CardHeader>
                    <CardTitle>Documentos Gerados</CardTitle>
                    <CardDescription>Histórico de todos os programas e laudos gerados para a empresa.</CardDescription>
                </CardHeader>
                <CardContent>
                    <Table>
                        <TableHeader>
                            <TableRow>
                                <TableHead>Documento</TableHead>
                                <TableHead>Versão</TableHead>
                                <TableHead>Data Emissão</TableHead>
                                <TableHead>Vigência</TableHead>
                                <TableHead><span className="sr-only">Ações</span></TableHead>
                            </TableRow>
                        </TableHeader>
                        <TableBody>
                            {documents.map(doc => (
                            <TableRow key={doc.id}>
                                <TableCell className="font-medium">{doc.name}</TableCell>
                                <TableCell><Badge variant="outline">{doc.version}</Badge></TableCell>
                                <TableCell>{doc.emissionDate}</TableCell>
                                <TableCell>{doc.expiryDate}</TableCell>
                                <TableCell>
                                    <DropdownMenu>
                                        <DropdownMenuTrigger asChild><Button variant="ghost" size="icon" className="h-6 w-6"><MoreHorizontal className="h-4 w-4" /></Button></DropdownMenuTrigger>
                                        <DropdownMenuContent>
                                            <DropdownMenuItem>Ver Detalhes</DropdownMenuItem>
                                            <DropdownMenuItem>Baixar PDF</DropdownMenuItem>
                                            <DropdownMenuItem>Criar Nova Versão</DropdownMenuItem>
                                        </DropdownMenuContent>
                                    </DropdownMenu>
                                </TableCell>
                            </TableRow>
                            ))}
                        </TableBody>
                    </Table>
                </CardContent>
            </Card>
        </div>
    )
}

function EmployeeDashboard() {
    const employees = [
        { id: 'COL-001', name: 'João da Silva', role: 'Operador de Máquina', avatar: 'https://i.pravatar.cc/150?u=col001', admissionDate: '2022-03-15' },
        { id: 'COL-002', name: 'Maria Oliveira', role: 'Inspetora de Qualidade', avatar: 'https://i.pravatar.cc/150?u=col002', admissionDate: '2023-10-01' },
        { id: 'COL-003', name: 'Carlos Pereira', role: 'Operador de Máquina', avatar: 'https://i.pravatar.cc/150?u=col003', admissionDate: '2024-01-20' },
    ];

    const kpiData = [
        { title: 'ASOs Vencidos', value: '1', icon: <HeartPulse className="h-4 w-4 text-muted-foreground" /> },
        { title: 'Treinamentos Vencidos', value: '0', icon: <HardHat className="h-4 w-4 text-muted-foreground" /> },
        { title: 'Atestados (Últimos 30d)', value: '1', icon: <FileClock className="h-4 w-4 text-muted-foreground" /> },
        { title: 'Chamados Abertos', value: '0', icon: <Ticket className="h-4 w-4 text-muted-foreground" /> },
    ];
    
    const documents = [
        { name: 'ASO Admissional', status: 'Válido', expiry: '2025-01-10' },
        { name: 'Ordem de Serviço', status: 'Válido', expiry: 'N/A' },
        { name: 'Treinamento NR-12', status: 'Vencido', expiry: '2024-07-01' },
    ];

    const statusIcons: Record<string, React.ReactNode> = {
        'Válido': <CheckCircle2 className="text-green-500" />,
        'Vencido': <XCircle className="text-red-500" />,
        'Pendente': <Clock className="text-yellow-500" />,
    };

    const selectedEmployee = employees[0];
    const admissionDate = new Date(selectedEmployee.admissionDate);
    const timeInCompany = formatDistanceToNow(admissionDate, { addSuffix: true, locale: ptBR });


    return (
        <div className="space-y-6">
             <div className="flex items-center justify-between">
                <h3 className="text-xl font-semibold">Gestão de Colaboradores</h3>
                 <Dialog>
                    <DialogTrigger asChild>
                         <Button size="sm" className="h-8 gap-1">
                            <PlusCircle className="h-3.5 w-3.5" />
                            <span className="sr-only sm:not-sr-only sm:whitespace-nowrap">
                            Adicionar Colaborador
                            </span>
                        </Button>
                    </DialogTrigger>
                    <DialogContent className="sm:max-w-3xl">
                         <DialogHeader>
                            <DialogTitle>Adicionar Novo Colaborador</DialogTitle>
                            <DialogDescription>
                                Preencha os dados para cadastrar um novo colaborador na empresa.
                            </DialogDescription>
                        </DialogHeader>
                        <form className="max-h-[70vh]">
                            <ScrollArea className="h-full">
                            <div className="grid gap-6 p-6">
                                <div className="grid gap-3">
                                    <h4 className="font-semibold text-lg">Dados Cadastrais</h4>
                                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                        <div className="grid gap-2">
                                            <Label htmlFor="fullname">Nome Completo</Label>
                                            <Input id="fullname" placeholder="Nome do colaborador" />
                                        </div>
                                        <div className="grid gap-2">
                                            <Label htmlFor="cpf">CPF</Label>
                                            <Input id="cpf" placeholder="000.000.000-00" />
                                        </div>
                                         <div className="grid gap-2">
                                            <Label htmlFor="birthdate">Data de Nascimento</Label>
                                            <Input id="birthdate" type="date" />
                                        </div>
                                        <div className="grid gap-2">
                                            <Label htmlFor="admission-date">Data de Admissão</Label>
                                            <Input id="admission-date" type="date" />
                                        </div>
                                        <div className="grid gap-2">
                                            <Label htmlFor="status">Situação</Label>
                                            <Select>
                                                <SelectTrigger>
                                                    <SelectValue placeholder="Selecione a situação" />
                                                </SelectTrigger>
                                                <SelectContent>
                                                    <SelectItem value="ativo">Ativo</SelectItem>
                                                    <SelectItem value="inativo">Inativo</SelectItem>
                                                    <SelectItem value="ferias">Férias</SelectItem>
                                                    <SelectItem value="b31">Afastado (B31)</SelectItem>
                                                    <SelectItem value="b91">Afastado (B91)</SelectItem>
                                                </SelectContent>
                                            </Select>
                                        </div>
                                    </div>
                                </div>
                                <div className="grid gap-3">
                                    <h4 className="font-semibold text-lg">Alocação</h4>
                                    <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                                        <div className="grid gap-2">
                                            <Label htmlFor="unit">Unidade</Label>
                                            <Select><SelectTrigger><SelectValue placeholder="Selecione" /></SelectTrigger><SelectContent><SelectItem value="matriz">Unidade Principal - Matriz</SelectItem></SelectContent></Select>
                                        </div>
                                        <div className="grid gap-2">
                                            <Label htmlFor="sector">Setor</Label>
                                            <Select><SelectTrigger><SelectValue placeholder="Selecione" /></SelectTrigger><SelectContent><SelectItem value="prod">Produção</SelectItem></SelectContent></Select>
                                        </div>
                                        <div className="grid gap-2">
                                            <Label htmlFor="role">Cargo</Label>
                                            <Select><SelectTrigger><SelectValue placeholder="Selecione" /></SelectTrigger><SelectContent><SelectItem value="op">Operador de Máquina</SelectItem></SelectContent></Select>
                                        </div>
                                    </div>
                                </div>
                                 <div className="grid gap-3">
                                    <h4 className="font-semibold text-lg">Contato</h4>
                                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                         <div className="grid gap-2">
                                            <Label htmlFor="email">Email</Label>
                                            <Input id="email" type="email" placeholder="email@exemplo.com"/>
                                        </div>
                                         <div className="grid gap-2">
                                            <Label htmlFor="phone">Telefone</Label>
                                            <Input id="phone" placeholder="(00) 00000-0000" />
                                        </div>
                                         <div className="grid gap-2 col-span-2">
                                            <Label htmlFor="address">Endereço</Label>
                                            <Input id="address" placeholder="Rua, Número, Bairro, Cidade - Estado" />
                                        </div>
                                    </div>
                                </div>
                            </div>
                            </ScrollArea>
                        </form>
                         <DialogFooter>
                            <Button type="submit">Salvar Colaborador</Button>
                        </DialogFooter>
                    </DialogContent>
                </Dialog>
            </div>
            
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                <Card className="md:col-span-1">
                     <CardHeader>
                        <CardTitle>Lista de Colaboradores</CardTitle>
                    </CardHeader>
                    <CardContent>
                        <div className="flex flex-col gap-4">
                        {employees.map(emp => (
                            <div key={emp.id} className="flex items-center gap-4 p-2 rounded-lg hover:bg-muted cursor-pointer">
                                <Avatar className="h-9 w-9">
                                    <AvatarImage src={emp.avatar} alt={emp.name} />
                                    <AvatarFallback>{emp.name.substring(0,2)}</AvatarFallback>
                                </Avatar>
                                <div className="grid gap-1">
                                    <p className="text-sm font-medium leading-none">{emp.name}</p>
                                    <p className="text-sm text-muted-foreground">{emp.role}</p>
                                </div>
                            </div>
                        ))}
                        </div>
                    </CardContent>
                </Card>

                <div className="md:col-span-2 space-y-4">
                     <Card>
                        <CardHeader className="flex items-start justify-between">
                            <div className="flex items-center gap-4">
                                <Avatar className="h-12 w-12">
                                    <AvatarImage src={selectedEmployee.avatar} alt={selectedEmployee.name} />
                                    <AvatarFallback>{selectedEmployee.name.substring(0,2)}</AvatarFallback>
                                </Avatar>
                                <div>
                                    <CardTitle>{selectedEmployee.name}</CardTitle>
                                    <CardDescription className="flex flex-col gap-1 mt-1">
                                        <span>{selectedEmployee.role} no setor de Produção na Unidade Principal - Matriz</span>
                                        <span className="text-xs">Admitido em {format(admissionDate, 'dd/MM/yyyy')} ({timeInCompany})</span>
                                    </CardDescription>
                                </div>
                            </div>
                            <Dialog>
                                <DialogTrigger asChild>
                                    <Button variant="ghost" size="icon">
                                        <FilePen className="h-5 w-5" />
                                        <span className="sr-only">Editar Colaborador</span>
                                    </Button>
                                </DialogTrigger>
                                <DialogContent className="sm:max-w-3xl">
                                    <DialogHeader>
                                        <DialogTitle>Editar Colaborador</DialogTitle>
                                        <DialogDescription>
                                            Atualize os dados do colaborador.
                                        </DialogDescription>
                                    </DialogHeader>
                                     <form className="max-h-[70vh]">
                                        <ScrollArea className="h-full">
                                        <div className="grid gap-6 p-6">
                                            <div className="grid gap-3">
                                                <h4 className="font-semibold text-lg">Dados Cadastrais</h4>
                                                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                                    <div className="grid gap-2">
                                                        <Label htmlFor="edit-fullname">Nome Completo</Label>
                                                        <Input id="edit-fullname" defaultValue={selectedEmployee.name} />
                                                    </div>
                                                    <div className="grid gap-2">
                                                        <Label htmlFor="edit-cpf">CPF</Label>
                                                        <Input id="edit-cpf" placeholder="000.000.000-00" />
                                                    </div>
                                                    <div className="grid gap-2">
                                                        <Label htmlFor="edit-birthdate">Data de Nascimento</Label>
                                                        <Input id="edit-birthdate" type="date" />
                                                    </div>
                                                    <div className="grid gap-2">
                                                        <Label htmlFor="edit-admission-date">Data de Admissão</Label>
                                                        <Input id="edit-admission-date" type="date" defaultValue={selectedEmployee.admissionDate} />
                                                    </div>
                                                    <div className="grid gap-2">
                                                        <Label htmlFor="edit-status">Situação</Label>
                                                        <Select defaultValue="ativo">
                                                            <SelectTrigger>
                                                                <SelectValue placeholder="Selecione a situação" />
                                                            </SelectTrigger>
                                                            <SelectContent>
                                                                <SelectItem value="ativo">Ativo</SelectItem>
                                                                <SelectItem value="inativo">Inativo</SelectItem>
                                                                <SelectItem value="ferias">Férias</SelectItem>
                                                                <SelectItem value="b31">Afastado (B31)</SelectItem>
                                                                <SelectItem value="b91">Afastado (B91)</SelectItem>
                                                            </SelectContent>
                                                        </Select>
                                                    </div>
                                                </div>
                                            </div>
                                            <div className="grid gap-3">
                                                <h4 className="font-semibold text-lg">Alocação</h4>
                                                <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                                                    <div className="grid gap-2">
                                                        <Label htmlFor="edit-unit">Unidade</Label>
                                                        <Select defaultValue="matriz"><SelectTrigger><SelectValue placeholder="Selecione" /></SelectTrigger><SelectContent><SelectItem value="matriz">Unidade Principal - Matriz</SelectItem></SelectContent></Select>
                                                    </div>
                                                    <div className="grid gap-2">
                                                        <Label htmlFor="edit-sector">Setor</Label>
                                                        <Select defaultValue="prod"><SelectTrigger><SelectValue placeholder="Selecione" /></SelectTrigger><SelectContent><SelectItem value="prod">Produção</SelectItem></SelectContent></Select>
                                                    </div>
                                                    <div className="grid gap-2">
                                                        <Label htmlFor="edit-role">Cargo</Label>
                                                        <Select defaultValue="op"><SelectTrigger><SelectValue placeholder="Selecione" /></SelectTrigger><SelectContent><SelectItem value="op">Operador de Máquina</SelectItem></SelectContent></Select>
                                                    </div>
                                                </div>
                                            </div>
                                            <div className="grid gap-3">
                                                <h4 className="font-semibold text-lg">Contato</h4>
                                                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                                        <div className="grid gap-2">
                                                        <Label htmlFor="edit-email">Email</Label>
                                                        <Input id="edit-email" type="email" placeholder="email@exemplo.com"/>
                                                    </div>
                                                        <div className="grid gap-2">
                                                        <Label htmlFor="edit-phone">Telefone</Label>
                                                        <Input id="edit-phone" placeholder="(00) 00000-0000" />
                                                    </div>
                                                        <div className="grid gap-2 col-span-2">
                                                        <Label htmlFor="edit-address">Endereço</Label>
                                                        <Input id="edit-address" placeholder="Rua, Número, Bairro, Cidade - Estado" />
                                                    </div>
                                                </div>
                                            </div>
                                        </div>
                                        </ScrollArea>
                                    </form>
                                    <DialogFooter>
                                        <Button type="submit">Salvar Alterações</Button>
                                    </DialogFooter>
                                </DialogContent>
                            </Dialog>
                        </CardHeader>
                    </Card>

                    <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
                        {kpiData.map(kpi => (
                            <Card key={kpi.title}>
                                <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                                    <CardTitle className="text-sm font-medium">{kpi.title}</CardTitle>
                                    {kpi.icon}
                                </CardHeader>
                                <CardContent>
                                    <div className="text-2xl font-bold">{kpi.value}</div>
                                </CardContent>
                            </Card>
                        ))}
                    </div>

                    <Card>
                        <CardHeader>
                            <CardTitle>Documentação do Colaborador</CardTitle>
                            <CardDescription>Status dos principais documentos de SST.</CardDescription>
                        </CardHeader>
                        <CardContent>
                            <Table>
                                <TableHeader>
                                <TableRow>
                                    <TableHead>Documento</TableHead>
                                    <TableHead>Status</TableHead>
                                    <TableHead>Vencimento</TableHead>
                                    <TableHead><span className="sr-only">Ações</span></TableHead>
                                </TableRow>
                                </TableHeader>
                                <TableBody>
                                    {documents.map(doc => (
                                    <TableRow key={doc.name}>
                                        <TableCell className="font-medium">{doc.name}</TableCell>
                                        <TableCell><div className="flex items-center gap-2">{statusIcons[doc.status as keyof typeof statusIcons]} {doc.status}</div></TableCell>
                                        <TableCell>{doc.expiry}</TableCell>
                                        <TableCell>
                                            <DropdownMenu>
                                                <DropdownMenuTrigger asChild><Button variant="ghost" size="icon" className="h-6 w-6"><MoreHorizontal className="h-4 w-4" /></Button></DropdownMenuTrigger>
                                                <DropdownMenuContent>
                                                    <DropdownMenuItem>Ver/Anexar PDF</DropdownMenuItem>
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
                </div>
            </div>
        </div>
    );
}


function RolesDashboard() {
    const kpiData = [
        { title: 'Total de Colaboradores', value: '15', icon: <Users className="h-4 w-4 text-muted-foreground" /> },
        { title: 'ASOs Vencidos', value: '2', icon: <FileWarning className="h-4 w-4 text-muted-foreground" /> },
        { title: 'Acidentes no Cargo', value: '0', icon: <ShieldAlert className="h-4 w-4 text-muted-foreground" /> },
        { title: 'Treinamentos Vencidos', value: '1', icon: <HardHat className="h-4 w-4 text-muted-foreground" /> },
    ];

    const roles = [
        { id: 'CAR-001', name: 'Operador de Máquina', cbo: '7152-10', sector: 'Produção' },
        { id: 'CAR-002', name: 'Inspetor de Qualidade', cbo: '3912-10', sector: 'Produção' },
        { id: 'CAR-003', name: 'Auxiliar Administrativo', cbo: '4110-10', sector: 'Administração' },
    ];

    return (
        <div className="space-y-6">
             <div className="flex items-center justify-between">
                <h3 className="text-xl font-semibold">Gestão de Cargos</h3>
                <Dialog>
                    <DialogTrigger asChild>
                         <Button size="sm" className="h-8 gap-1">
                            <PlusCircle className="h-3.5 w-3.5" />
                            <span className="sr-only sm:not-sr-only sm:whitespace-nowrap">
                            Adicionar Cargo
                            </span>
                        </Button>
                    </DialogTrigger>
                    <DialogContent className="sm:max-w-xl">
                         <DialogHeader>
                            <DialogTitle>Adicionar Novo Cargo</DialogTitle>
                            <DialogDescription>
                                Preencha os detalhes para cadastrar um novo cargo.
                            </DialogDescription>
                        </DialogHeader>
                        <form className="grid gap-4 py-4">
                            <div className="grid grid-cols-4 items-center gap-4">
                                <Label htmlFor="role-code" className="text-right">Código</Label>
                                <Input id="role-code" className="col-span-3" placeholder="Ex: CAR-004" />
                            </div>
                            <div className="grid grid-cols-4 items-center gap-4">
                                <Label htmlFor="role-name" className="text-right">Nome do Cargo</Label>
                                <Input id="role-name" className="col-span-3" placeholder="Ex: Soldador, Eletricista" />
                            </div>
                             <div className="grid grid-cols-4 items-center gap-4">
                                <Label htmlFor="role-cbo" className="text-right">CBO</Label>
                                <Input id="role-cbo" className="col-span-3" placeholder="Ex: 7243-15" />
                            </div>
                            <div className="grid grid-cols-4 items-center gap-4">
                                <Label htmlFor="role-sector" className="text-right">Setor</Label>
                                {/* Em um app real, isso seria um Select populado com os setores */}
                                <Input id="role-sector" className="col-span-3" defaultValue="Produção" />
                            </div>
                            <div className="grid grid-cols-4 items-start gap-4">
                                <Label htmlFor="role-description" className="text-right pt-2">Descrição das Atividades</Label>
                                <Textarea id="role-description" className="col-span-3" placeholder="Descreva as principais atividades e responsabilidades do cargo." />
                            </div>
                             <div className="grid grid-cols-4 items-start gap-4">
                                <Label htmlFor="role-organization" className="text-right pt-2">Organização do Trabalho</Label>
                                <Textarea id="role-organization" className="col-span-3" placeholder="Detalhar o que deve ser feito, como, onde, quando." />
                            </div>
                        </form>
                         <DialogFooter>
                            <Button type="submit">Salvar Cargo</Button>
                        </DialogFooter>
                    </DialogContent>
                </Dialog>
            </div>
            
            <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
                {kpiData.map(kpi => (
                     <Card key={kpi.title}>
                        <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                            <CardTitle className="text-sm font-medium">{kpi.title}</CardTitle>
                            {kpi.icon}
                        </CardHeader>
                        <CardContent>
                            <div className="text-2xl font-bold">{kpi.value}</div>
                        </CardContent>
                    </Card>
                ))}
            </div>

            <Card>
                <CardHeader>
                    <CardTitle>Cargos Cadastrados</CardTitle>
                    <CardDescription>Lista de todos os cargos existentes na empresa.</CardDescription>
                </CardHeader>
                <CardContent>
                    <Table>
                        <TableHeader>
                            <TableRow>
                                <TableHead>Código</TableHead>
                                <TableHead>Nome do Cargo</TableHead>
                                <TableHead>CBO</TableHead>
                                <TableHead>Setor</TableHead>
                                <TableHead><span className="sr-only">Ações</span></TableHead>
                            </TableRow>
                        </TableHeader>
                        <TableBody>
                            {roles.map(role => (
                            <TableRow key={role.id}>
                                <TableCell className="font-medium">{role.id}</TableCell>
                                <TableCell>{role.name}</TableCell>
                                <TableCell>{role.cbo}</TableCell>
                                <TableCell><Badge variant="outline">{role.sector}</Badge></TableCell>
                                <TableCell>
                                    <DropdownMenu>
                                        <DropdownMenuTrigger asChild><Button variant="ghost" size="icon" className="h-6 w-6"><MoreHorizontal className="h-4 w-4" /></Button></DropdownMenuTrigger>
                                        <DropdownMenuContent>
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
        </div>
    )
}


function SectorDashboard() {
    const kpiData = [
        { title: 'Colaboradores no Setor', value: '25', icon: <Users className="h-4 w-4 text-muted-foreground" /> },
        { title: 'Acidentes de Trabalho', value: '0', icon: <ShieldAlert className="h-4 w-4 text-muted-foreground" /> },
        { title: 'Chamados Abertos', value: '2', icon: <Ticket className="h-4 w-4 text-muted-foreground" /> },
        { title: 'ASOs Vencidos', value: '4', icon: <FileWarning className="h-4 w-4 text-muted-foreground" /> },
        { title: 'Treinamentos Vencidos', value: '3', icon: <HardHat className="h-4 w-4 text-muted-foreground" /> },
    ];

    const employees = [
        { id: 'COL-001', name: 'João Silva', role: 'Operador de Máquina', status: 'Ativo' },
        { id: 'COL-002', name: 'Maria Oliveira', role: 'Inspetora de Qualidade', status: 'Ativo' },
        { id: 'COL-003', name: 'Carlos Pereira', role: 'Operador de Máquina', status: 'Férias' },
    ];

    const incidents = [
        { id: 'INC-005', type: 'Não Conformidade', description: 'Uso incorreto de EPI', date: '2024-07-15' },
        { id: 'INC-004', type: 'Incidente', description: 'Quase acidente com empilhadeira', date: '2024-06-28' },
    ];

    return (
        <div className="space-y-6">
             <div className="flex items-center justify-between">
                <h3 className="text-xl font-semibold">Setor: Produção</h3>
                <Dialog>
                    <DialogTrigger asChild>
                         <Button size="sm" className="h-8 gap-1">
                            <PlusCircle className="h-3.5 w-3.5" />
                            <span className="sr-only sm:not-sr-only sm:whitespace-nowrap">
                            Adicionar Setor
                            </span>
                        </Button>
                    </DialogTrigger>
                    <DialogContent className="sm:max-w-xl">
                         <DialogHeader>
                            <DialogTitle>Adicionar Novo Setor</DialogTitle>
                            <DialogDescription>
                                Preencha os detalhes para cadastrar um novo setor de trabalho.
                            </DialogDescription>
                        </DialogHeader>
                        <form className="grid gap-4 py-4">
                            <div className="grid grid-cols-4 items-center gap-4">
                                <Label htmlFor="unit-select" className="text-right">Unidade</Label>
                                {/* Em um app real, isso seria um Select populado com as unidades */}
                                <Input id="unit-select" className="col-span-3" defaultValue="Unidade Principal - Matriz" disabled/>
                            </div>
                            <div className="grid grid-cols-4 items-center gap-4">
                                <Label htmlFor="sector-name" className="text-right">Nome do Setor</Label>
                                <Input id="sector-name" className="col-span-3" placeholder="Ex: Administração, Produção, Logística" />
                            </div>
                            <div className="grid grid-cols-4 items-start gap-4">
                                <Label htmlFor="sector-description" className="text-right pt-2">Atividades</Label>
                                <Textarea id="sector-description" className="col-span-3" placeholder="Descreva as principais atividades desenvolvidas neste setor." />
                            </div>
                        </form>
                         <DialogFooter>
                            <Button type="submit">Salvar Setor</Button>
                        </DialogFooter>
                    </DialogContent>
                </Dialog>
            </div>
            
            <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-5">
                {kpiData.map(kpi => (
                     <Card key={kpi.title}>
                        <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                            <CardTitle className="text-sm font-medium">{kpi.title}</CardTitle>
                            {kpi.icon}
                        </CardHeader>
                        <CardContent>
                            <div className="text-2xl font-bold">{kpi.value}</div>
                        </CardContent>
                    </Card>
                ))}
            </div>

            <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
                 <Card className="lg:col-span-2">
                    <CardHeader>
                        <CardTitle>Colaboradores do Setor</CardTitle>
                        <CardDescription>Colaboradores atualmente alocados neste setor.</CardDescription>
                    </CardHeader>
                    <CardContent>
                        <Table>
                            <TableHeader>
                                <TableRow>
                                    <TableHead>ID</TableHead>
                                    <TableHead>Nome</TableHead>
                                    <TableHead>Cargo</TableHead>
                                    <TableHead>Situação</TableHead>
                                </TableRow>
                            </TableHeader>
                            <TableBody>
                                {employees.map(emp => (
                                <TableRow key={emp.id}>
                                    <TableCell className="font-medium">{emp.id}</TableCell>
                                    <TableCell>{emp.name}</TableCell>
                                    <TableCell>{emp.role}</TableCell>
                                    <TableCell><Badge variant="outline">{emp.status}</Badge></TableCell>
                                </TableRow>
                                ))}
                            </TableBody>
                        </Table>
                    </CardContent>
                </Card>
                 <Card>
                    <CardHeader>
                        <CardTitle>Últimos Registros</CardTitle>
                        <CardDescription>Histórico de incidentes, eventos e não conformidades.</CardDescription>
                    </CardHeader>
                    <CardContent>
                         <Table>
                            <TableHeader>
                                <TableRow>
                                    <TableHead>ID</TableHead>
                                    <TableHead>Tipo</TableHead>
                                    <TableHead>Data</TableHead>
                                </TableRow>
                            </TableHeader>
                            <TableBody>
                                {incidents.map(inc => (
                                <TableRow key={inc.id}>
                                    <TableCell className="font-medium">{inc.id}</TableCell>
                                    <TableCell>{inc.type}</TableCell>
                                    <TableCell>{inc.date}</TableCell>
                                </TableRow>
                                ))}
                            </TableBody>
                        </Table>
                    </CardContent>
                </Card>
            </div>
        </div>
    )
}

function UnitDashboard() {
    const kpiData = [
        { title: 'Total de Colaboradores', value: '152', icon: <Users className="h-4 w-4 text-muted-foreground" /> },
        { title: 'Documentos Vencidos', value: '3', icon: <FileWarning className="h-4 w-4 text-muted-foreground" /> },
        { title: 'Chamados Abertos', value: '5', icon: <Ticket className="h-4 w-4 text-muted-foreground" /> },
        { title: 'Acidentes de Trabalho (Últimos 12m)', value: '1', icon: <ShieldAlert className="h-4 w-4 text-muted-foreground" /> },
        { title: 'ASOs Vencidos', value: '12', icon: <FileClock className="h-4 w-4 text-muted-foreground" /> },
        { title: 'Treinamentos Vencidos', value: '8', icon: <HardHat className="h-4 w-4 text-muted-foreground" /> },
    ];

    const documents = [
        { name: 'PCMSO', status: 'Válido', expiry: '2025-06-30' },
        { name: 'PGR', status: 'Válido', expiry: '2026-01-15' },
        { name: 'LTCAT', status: 'Vencido', expiry: '2024-07-01' },
        { name: 'Alvará Sanitário', status: 'Pendente', expiry: 'N/A' },
    ];

    const tickets = [
        { id: 'CHD-012', subject: 'Solicitação de AET', status: 'Aberto', opened: '2024-07-20' },
        { id: 'CHD-011', subject: 'Dúvida sobre novo colaborador', status: 'Fechado', opened: '2024-07-18' },
    ];

    const statusIcons: Record<string, React.ReactNode> = {
        'Válido': <CheckCircle2 className="text-green-500" />,
        'Vencido': <XCircle className="text-red-500" />,
        'Pendente': <Clock className="text-yellow-500" />,
    };

    return (
        <div className="space-y-6">
            <div className="flex items-center justify-between">
                <h3 className="text-xl font-semibold">Unidade Principal - Matriz</h3>
                <Dialog>
                    <DialogTrigger asChild>
                         <Button size="sm" className="h-8 gap-1">
                            <PlusCircle className="h-3.5 w-3.5" />
                            <span className="sr-only sm:not-sr-only sm:whitespace-nowrap">
                            Adicionar Unidade
                            </span>
                        </Button>
                    </DialogTrigger>
                    <DialogContent className="sm:max-w-2xl">
                         <DialogHeader>
                            <DialogTitle>Adicionar Nova Unidade</DialogTitle>
                            <DialogDescription>
                                Preencha os detalhes para cadastrar uma nova obra ou filial.
                            </DialogDescription>
                        </DialogHeader>
                        <form className="grid gap-4 py-4">
                             <div className="grid grid-cols-4 items-center gap-4">
                                <Label className="text-right">Tipo</Label>
                                <RadioGroup defaultValue="filial" className="col-span-3 flex gap-4">
                                    <div className="flex items-center space-x-2">
                                        <RadioGroupItem value="filial" id="r-filial" />
                                        <Label htmlFor="r-filial">Filial</Label>
                                    </div>
                                    <div className="flex items-center space-x-2">
                                        <RadioGroupItem value="obra" id="r-obra" />
                                        <Label htmlFor="r-obra">Obra</Label>
                                    </div>
                                </RadioGroup>
                            </div>
                            <div className="grid grid-cols-4 items-center gap-4">
                                <Label htmlFor="cnpj-cno" className="text-right">CNPJ / CNO</Label>
                                <Input id="cnpj-cno" className="col-span-3" placeholder="Número do registro" />
                            </div>
                            <div className="grid grid-cols-4 items-center gap-4">
                                <Label htmlFor="unit-description" className="text-right">Descrição</Label>
                                <Input id="unit-description" className="col-span-3" placeholder="Ex: Sede Administrativa, Obra Bloco A" />
                            </div>
                            <div className="grid grid-cols-4 items-center gap-4">
                                <Label htmlFor="cnae" className="text-right">CNAE</Label>
                                <Input id="cnae" className="col-span-2" />
                                <Label htmlFor="risk" className="text-right">Grau de Risco</Label>
                                <Input id="risk" className="col-span-1" />
                            </div>
                            <div className="grid grid-cols-4 items-center gap-4">
                                <Label htmlFor="address" className="text-right">Endereço</Label>
                                <Input id="address" className="col-span-3" />
                            </div>
                            <div className="grid grid-cols-4 items-center gap-4">
                                <Label htmlFor="responsible" className="text-right">Responsável</Label>
                                <Input id="responsible" className="col-span-3" />
                            </div>
                             <div className="grid grid-cols-4 items-center gap-4">
                                <Label htmlFor="contact" className="text-right">Contato</Label>
                                <Input id="contact" className="col-span-3" placeholder="Telefone ou email do responsável da unidade"/>
                            </div>
                        </form>
                         <DialogFooter>
                            <Button type="submit">Salvar Unidade</Button>
                        </DialogFooter>
                    </DialogContent>
                </Dialog>
            </div>
            
            <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
                {kpiData.map(kpi => (
                     <Card key={kpi.title}>
                        <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                            <CardTitle className="text-sm font-medium">{kpi.title}</CardTitle>
                            {kpi.icon}
                        </CardHeader>
                        <CardContent>
                            <div className="text-2xl font-bold">{kpi.value}</div>
                        </CardContent>
                    </Card>
                ))}
            </div>

            <div className="grid gap-4 md:grid-cols-2">
                <Card>
                    <CardHeader>
                        <CardTitle>Situação da Documentação</CardTitle>
                        <CardDescription>Status dos principais documentos de SST da unidade.</CardDescription>
                    </CardHeader>
                    <CardContent>
                        <Table>
                            <TableHeader>
                                <TableRow>
                                    <TableHead>Documento</TableHead>
                                    <TableHead>Status</TableHead>
                                    <TableHead>Vencimento</TableHead>
                                    <TableHead><span className="sr-only">Ações</span></TableHead>
                                </TableRow>
                            </TableHeader>
                            <TableBody>
                                {documents.map(doc => (
                                <TableRow key={doc.name}>
                                    <TableCell className="font-medium">{doc.name}</TableCell>
                                    <TableCell><div className="flex items-center gap-2">{statusIcons[doc.status as keyof typeof statusIcons]} {doc.status}</div></TableCell>
                                    <TableCell>{doc.expiry}</TableCell>
                                    <TableCell>
                                        <DropdownMenu>
                                            <DropdownMenuTrigger asChild><Button variant="ghost" size="icon" className="h-6 w-6"><MoreHorizontal className="h-4 w-4" /></Button></DropdownMenuTrigger>
                                            <DropdownMenuContent>
                                                <DropdownMenuItem>Ver/Anexar PDF</DropdownMenuItem>
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
                 <Card>
                    <CardHeader>
                        <CardTitle>Últimos Chamados</CardTitle>
                        <CardDescription>Histórico de chamados e solicitações abertos para esta unidade.</CardDescription>
                    </CardHeader>
                    <CardContent>
                         <Table>
                            <TableHeader>
                                <TableRow>
                                    <TableHead>ID</TableHead>
                                    <TableHead>Assunto</TableHead>
                                    <TableHead>Status</TableHead>
                                    <TableHead>Aberto em</TableHead>
                                </TableRow>
                            </TableHeader>
                            <TableBody>
                                {tickets.map(ticket => (
                                <TableRow key={ticket.id}>
                                    <TableCell className="font-medium">{ticket.id}</TableCell>
                                    <TableCell>{ticket.subject}</TableCell>
                                    <TableCell><Badge variant={ticket.status === 'Aberto' ? 'default' : 'outline'}>{ticket.status}</Badge></TableCell>
                                    <TableCell>{ticket.opened}</TableCell>
                                </TableRow>
                                ))}
                            </TableBody>
                        </Table>
                    </CardContent>
                </Card>
            </div>
        </div>
    )
}

export default function ClientDetailsPage() {
  const params = useParams();
  const contractId = params.contractId as string;
  const client = getClientById(contractId);

  if (!client) {
    return (
      <div className="flex flex-col items-center justify-center h-full text-center">
        <h2 className="text-2xl font-bold">Cliente não encontrado</h2>
        <p className="text-muted-foreground">O cliente que você está procurando não existe.</p>
        <Button asChild className="mt-4">
          <Link href="/dashboard/clients">
            <ArrowLeft className="mr-2 h-4 w-4" />
            Voltar para Clientes
          </Link>
        </Button>
      </div>
    );
  }

  const riskLevelMap = {
      '1': { label: 'Muito Baixo', color: 'bg-green-500' },
      '2': { label: 'Baixo', color: 'bg-blue-500' },
      '3': { label: 'Médio', color: 'bg-yellow-500' },
      '4': { label: 'Alto', color: 'bg-red-500' },
  } as const;

  const riskInfo = riskLevelMap[client.riskLevel as keyof typeof riskLevelMap] || { label: 'N/A', color: 'bg-gray-400' };

  return (
    <div className="grid flex-1 auto-rows-max gap-4">
        <div className="flex items-center gap-4">
            <Button variant="outline" size="icon" className="h-7 w-7" asChild>
                <Link href="/dashboard/clients">
                    <ChevronLeft className="h-4 w-4" />
                    <span className="sr-only">Voltar</span>
                </Link>
            </Button>
            <h1 className="flex-1 shrink-0 whitespace-nowrap text-xl font-semibold tracking-tight sm:grow-0">
                {client.name}
            </h1>
            <Badge variant={client.status === 'Ativo' ? 'secondary' : 'outline'} className="ml-auto sm:ml-0">
                {client.status}
            </Badge>
        </div>
      
       <Tabs defaultValue="employees">
            <TabsList className="grid w-full grid-cols-6">
                <TabsTrigger value="info">Informações Gerais</TabsTrigger>
                <TabsTrigger value="units">Unidades</TabsTrigger>
                <TabsTrigger value="sectors">Setores</TabsTrigger>
                <TabsTrigger value="roles">Cargos</TabsTrigger>
                <TabsTrigger value="employees">Colaboradores</TabsTrigger>
                <TabsTrigger value="docs-sst">
                  <BookUser className="mr-2 h-4 w-4" />
                  Documentos SST
                </TabsTrigger>
            </TabsList>
            <TabsContent value="info">
                 <Card>
                    <CardHeader>
                        <CardTitle>Detalhes da Empresa</CardTitle>
                        <CardDescription>Informações detalhadas sobre o cliente, contrato e responsável.</CardDescription>
                    </CardHeader>
                    <CardContent className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
                        <div className="space-y-1">
                            <p className="text-sm font-medium text-muted-foreground">CNPJ</p>
                            <p className="text-sm font-semibold">{client.cnpj}</p>
                        </div>
                        <div className="space-y-1">
                            <p className="text-sm font-medium text-muted-foreground">CNAE</p>
                            <p className="text-sm font-semibold">{client.cnae}</p>
                        </div>
                        <div className="space-y-1">
                            <p className="text-sm font-medium text-muted-foreground">Grau de Risco</p>
                            <div className="flex items-center gap-2">
                                <span className={`h-3 w-3 rounded-full ${riskInfo.color}`} />
                                <p className="text-sm font-semibold">{riskInfo.label} (Grau {client.riskLevel})</p>
                            </div>
                        </div>
                        <div className="space-y-1">
                            <p className="text-sm font-medium text-muted-foreground">Email</p>
                            <div className="flex items-center gap-2 text-sm font-semibold">
                                <Mail className="h-4 w-4 text-muted-foreground" /> {client.contact}
                            </div>
                        </div>
                        <div className="space-y-1 col-span-full">
                            <p className="text-sm font-medium text-muted-foreground">Endereço</p>
                             <div className="flex items-center gap-2 text-sm font-semibold">
                                <MapPin className="h-4 w-4 text-muted-foreground" /> {client.address}
                             </div>
                        </div>
                         <div className="space-y-4">
                            <p className="text-sm font-medium text-muted-foreground">Responsável</p>
                            <div className="flex items-center gap-4">
                                <User className="h-8 w-8 text-muted-foreground"/>
                                <div>
                                    <p className="font-semibold">{client.responsibleName}</p>
                                    <p className="text-sm text-muted-foreground">Contato Principal</p>
                                </div>
                            </div>
                            <div className="flex items-center gap-2 text-sm">
                                <Phone className="h-4 w-4 text-muted-foreground" />
                                <span>{client.responsibleContact}</span>
                            </div>
                        </div>
                         <div className="space-y-4">
                            <p className="text-sm font-medium text-muted-foreground">Contrato</p>
                            <div className="flex items-center gap-2">
                                <FileText className="h-5 w-5 text-muted-foreground" />
                                <h4 className="font-semibold">Detalhes</h4>
                            </div>
                            <div className="pl-7 space-y-1">
                                <p className="text-sm"><span className="font-medium text-muted-foreground">ID:</span> {client.contractId}</p>
                                <div><span className="font-medium text-muted-foreground">Plano: </span><Badge variant="default">{client.plan}</Badge></div>
                            </div>
                         </div>
                    </CardContent>
                </Card>
            </TabsContent>
            <TabsContent value="units">
                <UnitDashboard />
            </TabsContent>
            <TabsContent value="sectors">
                <SectorDashboard />
            </TabsContent>
            <TabsContent value="roles">
                 <RolesDashboard />
            </TabsContent>
            <TabsContent value="employees">
                <EmployeeDashboard />
            </TabsContent>
            <TabsContent value="docs-sst">
                <SSTDocumentsDashboard />
            </TabsContent>
       </Tabs>
    </div>
  );
}
