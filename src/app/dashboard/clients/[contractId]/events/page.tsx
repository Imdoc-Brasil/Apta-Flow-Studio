
'use client';

import { useState } from 'react';
import {
  MoreHorizontal,
  PlusCircle,
  File,
} from 'lucide-react';
import { Badge } from '@/components/ui/badge';
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from '@/components/ui/card';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table';
import { Button } from '@/components/ui/button';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';

const initialIncidentData = [
    { id: 'INC-001', client: 'Innovate Inc.', date: '2024-07-20', description: 'Quase acidente com empilhadeira no armazém.', status: 'Em Investigação'},
    { id: 'INC-002', client: 'Solutions Co.', date: '2024-07-18', description: 'Vazamento de produto químico de baixo risco.', status: 'Concluído'},
];

const initialNonConformityData = [
    { id: 'NC-001', client: 'Stellar Tech', date: '2024-07-15', description: 'Falta de sinalização em área de risco.', origin: 'Auditoria Interna', status: 'Plano de Ação Pendente'},
    { id: 'NC-002', client: 'Quantum Dynamics', date: '2024-07-10', description: 'EPI com validade vencida encontrado em uso.', origin: 'Inspeção de Segurança', status: 'Resolvida'},
];

const initialAccidentData = [
     { id: 'CAT-001', client: 'Apex Innovations', date: '2024-06-25', description: 'Corte superficial na mão durante manuseio de ferramenta.', collaborator: 'Carlos Souza', catEmitted: 'Sim', status: 'Aguardando INSS'},
];

type Incident = typeof initialIncidentData[0];
type NonConformity = typeof initialNonConformityData[0];
type Accident = typeof initialAccidentData[0];


const getStatusVariant = (status: string) => {
    if (status.includes('Pendente') || status.includes('Investigação') || status.includes('Aguardando')) return 'default';
    if (status.includes('Concluído') || status.includes('Resolvida')) return 'secondary';
    return 'outline';
}


function EventTable({ title, description, data, headers, renderRow, dialogContent, dialogTitle, dialogDescription, onAdd }: { title: string, description: string, data: any[], headers: string[], renderRow: (item: any) => React.ReactNode, dialogContent: React.ReactNode, dialogTitle: string, dialogDescription: string, onAdd: (e: React.FormEvent<HTMLFormElement>) => void }) {
    const [isDialogOpen, setIsDialogOpen] = useState(false);

    return (
        <Card>
            <CardHeader>
                <div className="flex items-start justify-between">
                    <div>
                        <CardTitle>{title}</CardTitle>
                        <CardDescription>{description}</CardDescription>
                    </div>
                    <div className="flex gap-2">
                        <Button variant="outline" size="sm" className="h-8 gap-1">
                            <File className="h-3.5 w-3.5" />
                            <span>Exportar</span>
                        </Button>
                        <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
                            <DialogTrigger asChild>
                                <Button size="sm" className="h-8 gap-1">
                                    <PlusCircle className="h-3.5 w-3.5" />
                                    <span className="sr-only sm:not-sr-only sm:whitespace-nowrap">
                                    {`Registrar ${title.split(' ')[1]}`}
                                    </span>
                                </Button>
                            </DialogTrigger>
                            <DialogContent>
                                <DialogHeader>
                                    <DialogTitle>{dialogTitle}</DialogTitle>
                                    <DialogDescription>{dialogDescription}</DialogDescription>
                                </DialogHeader>
                                <form id={`add-${title.split(' ')[1]}-form`} onSubmit={(e) => {
                                    onAdd(e);
                                    setIsDialogOpen(false);
                                }}>
                                    {dialogContent}
                                     <DialogFooter>
                                        <Button variant="outline" onClick={() => setIsDialogOpen(false)}>Cancelar</Button>
                                        <Button type="submit">Salvar Registro</Button>
                                    </DialogFooter>
                                </form>
                            </DialogContent>
                        </Dialog>
                    </div>
                </div>
            </CardHeader>
            <CardContent>
                <Table>
                    <TableHeader>
                        <TableRow>
                            {headers.map(header => <TableHead key={header}>{header}</TableHead>)}
                            <TableHead><span className="sr-only">Ações</span></TableHead>
                        </TableRow>
                    </TableHeader>
                    <TableBody>
                        {data.map((item, index) => renderRow(item))}
                    </TableBody>
                </Table>
            </CardContent>
        </Card>
    );
}

export default function EventsPage() {
    const [incidentData, setIncidentData] = useState(initialIncidentData);
    const [nonConformityData, setNonConformityData] = useState(initialNonConformityData);
    const [accidentData, setAccidentData] = useState(initialAccidentData);

    const handleAddIncident = (e: React.FormEvent<HTMLFormElement>) => {
        e.preventDefault();
        const formData = new FormData(e.currentTarget);
        const newIncident: Incident = {
            id: `INC-${(Math.random() * 1000).toFixed(0).padStart(3, '0')}`,
            client: 'Innovate Inc.',
            date: formData.get('date') as string,
            description: formData.get('description') as string,
            status: 'Em Investigação'
        };
        setIncidentData(prev => [newIncident, ...prev]);
        e.currentTarget.reset();
    }

    const handleAddNC = (e: React.FormEvent<HTMLFormElement>) => {
        e.preventDefault();
        const formData = new FormData(e.currentTarget);
        const newNC: NonConformity = {
            id: `NC-${(Math.random() * 1000).toFixed(0).padStart(3, '0')}`,
            client: 'Innovate Inc.',
            date: formData.get('date') as string,
            description: formData.get('description') as string,
            origin: formData.get('origin') as string,
            status: 'Plano de Ação Pendente'
        };
        setNonConformityData(prev => [newNC, ...prev]);
        e.currentTarget.reset();
    }

    const handleAddAccident = (e: React.FormEvent<HTMLFormElement>) => {
        e.preventDefault();
        const formData = new FormData(e.currentTarget);
        const newAccident: Accident = {
            id: `CAT-${(Math.random() * 1000).toFixed(0).padStart(3, '0')}`,
            client: 'Innovate Inc.',
            date: formData.get('date') as string,
            description: formData.get('description') as string,
            collaborator: formData.get('collaborator') as string,
            catEmitted: formData.get('catEmitted') as string,
            status: 'Aguardando INSS'
        };
        setAccidentData(prev => [newAccident, ...prev]);
        e.currentTarget.reset();
    }

  return (
    <div className="grid flex-1 auto-rows-max gap-4">
        <h1 className="font-headline text-3xl font-bold">Gestão de Eventos</h1>
        <Tabs defaultValue="incidents">
            <TabsList>
                <TabsTrigger value="incidents">Incidentes</TabsTrigger>
                <TabsTrigger value="nonconformities">Não Conformidades</TabsTrigger>
                <TabsTrigger value="accidents">Acidentes de Trabalho</TabsTrigger>
            </TabsList>
            <TabsContent value="incidents">
                <EventTable
                    title="Registros de Incidentes"
                    description="Gerencie todos os incidentes e quase acidentes reportados."
                    data={incidentData}
                    headers={['ID', 'Cliente', 'Data', 'Descrição', 'Status']}
                    onAdd={handleAddIncident}
                    dialogTitle="Registrar Novo Incidente"
                    dialogDescription="Descreva o incidente ou quase acidente ocorrido."
                    dialogContent={
                        <div className="grid gap-4 py-4">
                            <div className="grid grid-cols-4 items-center gap-4">
                                <Label htmlFor="date" className="text-right">Data</Label>
                                <Input id="date" name="date" type="date" className="col-span-3" required />
                            </div>
                            <div className="grid grid-cols-4 items-center gap-4">
                                <Label htmlFor="description" className="text-right">Descrição</Label>
                                <Textarea id="description" name="description" className="col-span-3" required />
                            </div>
                        </div>
                    }
                    renderRow={(item: Incident) => (
                         <TableRow key={item.id}>
                            <TableCell className="font-medium">{item.id}</TableCell>
                            <TableCell>{item.client}</TableCell>
                            <TableCell>{item.date}</TableCell>
                            <TableCell className="max-w-[300px] truncate">{item.description}</TableCell>
                            <TableCell><Badge variant={getStatusVariant(item.status)}>{item.status}</Badge></TableCell>
                            <TableCell>
                                <DropdownMenu>
                                    <DropdownMenuTrigger asChild><Button aria-haspopup="true" size="icon" variant="ghost"><MoreHorizontal className="h-4 w-4" /></Button></DropdownMenuTrigger>
                                    <DropdownMenuContent align="end">
                                        <DropdownMenuLabel>Ações</DropdownMenuLabel>
                                        <DropdownMenuItem>Ver Detalhes</DropdownMenuItem>
                                        <DropdownMenuItem>Iniciar Investigação</DropdownMenuItem>
                                    </DropdownMenuContent>
                                </DropdownMenu>
                            </TableCell>
                        </TableRow>
                    )}
                />
            </TabsContent>
            <TabsContent value="nonconformities">
                 <EventTable
                    title="Registros de Não Conformidades"
                    description="Gerencie não conformidades identificadas em auditorias e inspeções."
                    data={nonConformityData}
                    headers={['ID', 'Cliente', 'Data', 'Origem', 'Descrição', 'Status']}
                    onAdd={handleAddNC}
                    dialogTitle="Registrar Nova Não Conformidade"
                    dialogDescription="Detalhe a não conformidade identificada."
                     dialogContent={
                        <div className="grid gap-4 py-4">
                            <div className="grid grid-cols-4 items-center gap-4">
                                <Label htmlFor="date" className="text-right">Data</Label>
                                <Input id="date" name="date" type="date" className="col-span-3" required />
                            </div>
                            <div className="grid grid-cols-4 items-center gap-4">
                                <Label htmlFor="origin" className="text-right">Origem</Label>
                                <Input id="origin" name="origin" placeholder="Ex: Auditoria Interna" className="col-span-3" required />
                            </div>
                            <div className="grid grid-cols-4 items-center gap-4">
                                <Label htmlFor="description" className="text-right">Descrição</Label>
                                <Textarea id="description" name="description" className="col-span-3" required />
                            </div>
                        </div>
                    }
                    renderRow={(item: NonConformity) => (
                         <TableRow key={item.id}>
                            <TableCell className="font-medium">{item.id}</TableCell>
                            <TableCell>{item.client}</TableCell>
                            <TableCell>{item.date}</TableCell>
                            <TableCell>{item.origin}</TableCell>
                            <TableCell className="max-w-[300px] truncate">{item.description}</TableCell>
                            <TableCell><Badge variant={getStatusVariant(item.status)}>{item.status}</Badge></TableCell>
                            <TableCell>
                                <DropdownMenu>
                                    <DropdownMenuTrigger asChild><Button aria-haspopup="true" size="icon" variant="ghost"><MoreHorizontal className="h-4 w-4" /></Button></DropdownMenuTrigger>
                                    <DropdownMenuContent align="end">
                                        <DropdownMenuLabel>Ações</DropdownMenuLabel>
                                        <DropdownMenuItem>Ver Detalhes</DropdownMenuItem>
                                        <DropdownMenuItem>Criar Plano de Ação</DropdownMenuItem>
                                    </DropdownMenuContent>
                                </DropdownMenu>
                            </TableCell>
                        </TableRow>
                    )}
                />
            </TabsContent>
            <TabsContent value="accidents">
                 <EventTable
                    title="Comunicação de Acidente de Trabalho"
                    description="Gerencie os registros e a emissão de CATs."
                    data={accidentData}
                    headers={['ID', 'Cliente', 'Colaborador', 'Data', 'Descrição', 'CAT Emitida', 'Status']}
                    onAdd={handleAddAccident}
                    dialogTitle="Registrar Acidente de Trabalho"
                    dialogDescription="Preencha as informações sobre o acidente e a emissão da CAT."
                     dialogContent={
                        <div className="grid gap-4 py-4">
                            <div className="grid grid-cols-4 items-center gap-4">
                                <Label htmlFor="date" className="text-right">Data</Label>
                                <Input id="date" name="date" type="date" className="col-span-3" required />
                            </div>
                            <div className="grid grid-cols-4 items-center gap-4">
                                <Label htmlFor="collaborator" className="text-right">Colaborador</Label>
                                <Input id="collaborator" name="collaborator" className="col-span-3" required />
                            </div>
                            <div className="grid grid-cols-4 items-center gap-4">
                                <Label htmlFor="description" className="text-right">Descrição</Label>
                                <Textarea id="description" name="description" className="col-span-3" required />
                            </div>
                            <div className="grid grid-cols-4 items-center gap-4">
                                <Label htmlFor="catEmitted" className="text-right">CAT Emitida?</Label>
                                <Select name="catEmitted" required>
                                    <SelectTrigger className="col-span-3">
                                        <SelectValue placeholder="Selecione" />
                                    </SelectTrigger>
                                    <SelectContent>
                                        <SelectItem value="Sim">Sim</SelectItem>
                                        <SelectItem value="Não">Não</SelectItem>
                                        <SelectItem value="Pendente">Pendente</SelectItem>
                                    </SelectContent>
                                </Select>
                            </div>
                        </div>
                    }
                    renderRow={(item: Accident) => (
                         <TableRow key={item.id}>
                            <TableCell className="font-medium">{item.id}</TableCell>
                            <TableCell>{item.client}</TableCell>
                            <TableCell>{item.collaborator}</TableCell>
                            <TableCell>{item.date}</TableCell>
                            <TableCell className="max-w-[250px] truncate">{item.description}</TableCell>
                            <TableCell><Badge variant={item.catEmitted === 'Sim' ? 'secondary' : 'outline'}>{item.catEmitted}</Badge></TableCell>
                            <TableCell><Badge variant={getStatusVariant(item.status)}>{item.status}</Badge></TableCell>
                            <TableCell>
                                <DropdownMenu>
                                    <DropdownMenuTrigger asChild><Button aria-haspopup="true" size="icon" variant="ghost"><MoreHorizontal className="h-4 w-4" /></Button></DropdownMenuTrigger>
                                    <DropdownMenuContent align="end">
                                        <DropdownMenuLabel>Ações</DropdownMenuLabel>
                                        <DropdownMenuItem>Ver Detalhes</DropdownMenuItem>
                                        <DropdownMenuItem>Emitir/Anexar CAT</DropdownMenuItem>
                                    </DropdownMenuContent>
                                </DropdownMenu>
                            </TableCell>
                        </TableRow>
                    )}
                />
            </TabsContent>
        </Tabs>
    </div>
  );
}
