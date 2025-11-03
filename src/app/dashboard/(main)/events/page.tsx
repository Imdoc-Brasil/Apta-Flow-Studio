'use client';

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

const incidentData = [
    { id: 'INC-001', client: 'Innovate Inc.', date: '2024-07-20', description: 'Quase acidente com empilhadeira no armazém.', status: 'Em Investigação'},
    { id: 'INC-002', client: 'Solutions Co.', date: '2024-07-18', description: 'Vazamento de produto químico de baixo risco.', status: 'Concluído'},
];

const nonConformityData = [
    { id: 'NC-001', client: 'Stellar Tech', date: '2024-07-15', description: 'Falta de sinalização em área de risco.', origin: 'Auditoria Interna', status: 'Plano de Ação Pendente'},
    { id: 'NC-002', client: 'Quantum Dynamics', date: '2024-07-10', description: 'EPI com validade vencida encontrado em uso.', origin: 'Inspeção de Segurança', status: 'Resolvida'},
];

const accidentData = [
     { id: 'CAT-001', client: 'Apex Innovations', date: '2024-06-25', description: 'Corte superficial na mão durante manuseio de ferramenta.', collaborator: 'Carlos Souza', catEmitted: 'Sim', status: 'Aguardando INSS'},
];

const getStatusVariant = (status: string) => {
    if (status.includes('Pendente') || status.includes('Investigação')) return 'default';
    if (status.includes('Concluído') || status.includes('Resolvida')) return 'secondary';
    return 'outline';
}


function EventTable({ title, description, data, headers, renderRow, buttonLabel }: { title: string, description: string, data: any[], headers: string[], renderRow: (item: any) => React.ReactNode, buttonLabel: string }) {
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
                        <Button size="sm" className="h-8 gap-1">
                            <PlusCircle className="h-3.5 w-3.5" />
                            <span className="sr-only sm:not-sr-only sm:whitespace-nowrap">
                            {buttonLabel}
                            </span>
                        </Button>
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
                        {data.map(item => renderRow(item))}
                    </TableBody>
                </Table>
            </CardContent>
        </Card>
    );
}

export default function EventsPage() {
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
                    buttonLabel="Registrar Incidente"
                    renderRow={(item) => (
                         <TableRow key={item.id}>
                            <TableCell className="font-medium">{item.id}</TableCell>
                            <TableCell>{item.client}</TableCell>
                            <TableCell>{item.date}</TableCell>
                            <TableCell>{item.description}</TableCell>
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
                    buttonLabel="Registrar NC"
                    renderRow={(item) => (
                         <TableRow key={item.id}>
                            <TableCell className="font-medium">{item.id}</TableCell>
                            <TableCell>{item.client}</TableCell>
                            <TableCell>{item.date}</TableCell>
                            <TableCell>{item.origin}</TableCell>
                            <TableCell>{item.description}</TableCell>
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
                    title="Comunicação de Acidente de Trabalho (CAT)"
                    description="Gerencie os registros e a emissão de CATs."
                    data={accidentData}
                    headers={['ID', 'Cliente', 'Colaborador', 'Data', 'Descrição', 'CAT Emitida', 'Status']}
                    buttonLabel="Registrar Acidente"
                    renderRow={(item) => (
                         <TableRow key={item.id}>
                            <TableCell className="font-medium">{item.id}</TableCell>
                            <TableCell>{item.client}</TableCell>
                            <TableCell>{item.collaborator}</TableCell>
                            <TableCell>{item.date}</TableCell>
                            <TableCell>{item.description}</TableCell>
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
