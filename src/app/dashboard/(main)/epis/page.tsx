'use client';

import {
  File,
  ListFilter,
  MoreHorizontal,
  PlusCircle,
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
  DropdownMenuCheckboxItem,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
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
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from '@/components/ui/popover';
import { Calendar } from '@/components/ui/calendar';
import { Calendar as CalendarIcon } from 'lucide-react';
import { useState } from 'react';
import { format } from 'date-fns';
import { ptBR } from 'date-fns/locale';

const epiDeliveries = [
  {
    id: 'EPI-001',
    collaborator: 'João Silva',
    client: 'Innovate Inc.',
    epi: 'Protetor auricular tipo concha (CA: 12345)',
    deliveryDate: '2024-07-01',
    validity: '2025-07-01',
    status: 'Válido',
  },
  {
    id: 'EPI-002',
    collaborator: 'Maria Oliveira',
    client: 'Solutions Co.',
    epi: 'Luva de segurança (CA: 67890)',
    deliveryDate: '2024-01-15',
    validity: '2024-07-15',
    status: 'Vencido',
  },
  {
    id: 'EPI-003',
    collaborator: 'Carlos Pereira',
    client: 'Innovate Inc.',
    epi: 'Respirador purificador de ar (CA: 11223)',
    deliveryDate: '2024-06-20',
    validity: '2024-08-20',
    status: 'A vencer',
  },
  {
    id: 'EPI-004',
    collaborator: 'Ana Costa',
    client: 'Quantum Dynamics',
    epi: 'Óculos de proteção (CA: 98765)',
    deliveryDate: '2023-12-10',
    validity: '2024-12-10',
    status: 'Válido',
  },
];

const kpiData = [
    { title: 'EPIs Entregues (Mês)', value: '12', description: 'Total de entregas em Julho' },
    { title: 'EPIs a Vencer', value: '1', description: 'Nos próximos 30 dias' },
    { title: 'EPIs Vencidos', value: '1', description: 'Exige ação imediata' },
];

const getStatusVariant = (status: string) => {
    switch (status) {
        case 'Válido': return 'secondary';
        case 'A vencer': return 'default';
        case 'Vencido': return 'destructive';
        default: return 'outline';
    }
}

export default function EpisPage() {
    const [date, setDate] = useState<Date | undefined>(new Date());

    return (
        <div className="grid flex-1 auto-rows-max gap-4">
            <h1 className="font-headline text-3xl font-bold">Gestão de EPIs</h1>

             <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
                {kpiData.map((kpi, index) => (
                    <Card key={index}>
                        <CardHeader className="pb-2">
                            <CardTitle className="text-sm font-medium">{kpi.title}</CardTitle>
                        </CardHeader>
                        <CardContent>
                            <div className="text-2xl font-bold">{kpi.value}</div>
                            <p className="text-xs text-muted-foreground">{kpi.description}</p>
                        </CardContent>
                    </Card>
                ))}
             </div>

            <Card>
                <CardHeader>
                    <CardTitle>Histórico de Entrega de EPIs</CardTitle>
                    <CardDescription>
                    Registre e monitore todas as entregas de Equipamentos de Proteção Individual.
                    </CardDescription>
                     <div className="flex items-center gap-2 pt-4">
                        <Popover>
                            <PopoverTrigger asChild>
                                <Button variant="outline" className="w-[240px] justify-start text-left font-normal">
                                    <CalendarIcon className="mr-2 h-4 w-4" />
                                    {date ? format(date, "MMMM 'de' yyyy", { locale: ptBR }) : <span>Selecione o mês</span>}
                                </Button>
                            </PopoverTrigger>
                            <PopoverContent className="w-auto p-0" align="start">
                                <Calendar
                                    mode="single"
                                    selected={date}
                                    onSelect={setDate}
                                    initialFocus
                                />
                            </PopoverContent>
                        </Popover>
                        <div className="ml-auto flex items-center gap-2">
                            <Button size="sm" variant="outline" className="h-8 gap-1">
                                <File className="h-3.5 w-3.5" />
                                <span className="sr-only sm:not-sr-only sm:whitespace-nowrap">Exportar</span>
                            </Button>
                            <Button size="sm" className="h-8 gap-1">
                                <PlusCircle className="h-3.5 w-3.5" />
                                <span className="sr-only sm:not-sr-only sm:whitespace-nowrap">Registrar Entrega</span>
                            </Button>
                        </div>
                    </div>
                </CardHeader>
                <CardContent>
                    <Table>
                        <TableHeader>
                            <TableRow>
                                <TableHead>Colaborador</TableHead>
                                <TableHead className="hidden md:table-cell">Cliente</TableHead>
                                <TableHead>EPI (CA)</TableHead>
                                <TableHead>Data de Entrega</TableHead>
                                <TableHead>Validade</TableHead>
                                <TableHead>Status</TableHead>
                                <TableHead>
                                    <span className="sr-only">Ações</span>
                                </TableHead>
                            </TableRow>
                        </TableHeader>
                        <TableBody>
                            {epiDeliveries.map((delivery) => (
                                <TableRow key={delivery.id}>
                                    <TableCell className="font-medium">{delivery.collaborator}</TableCell>
                                    <TableCell className="hidden md:table-cell">{delivery.client}</TableCell>
                                    <TableCell>{delivery.epi}</TableCell>
                                    <TableCell>{format(new Date(delivery.deliveryDate), 'dd/MM/yyyy')}</TableCell>
                                    <TableCell>{format(new Date(delivery.validity), 'dd/MM/yyyy')}</TableCell>
                                    <TableCell>
                                        <Badge variant={getStatusVariant(delivery.status)}>{delivery.status}</Badge>
                                    </TableCell>
                                    <TableCell>
                                        <DropdownMenu>
                                            <DropdownMenuTrigger asChild>
                                                <Button aria-haspopup="true" size="icon" variant="ghost">
                                                    <MoreHorizontal className="h-4 w-4" />
                                                    <span className="sr-only">Toggle menu</span>
                                                </Button>
                                            </DropdownMenuTrigger>
                                            <DropdownMenuContent align="end">
                                                <DropdownMenuLabel>Ações</DropdownMenuLabel>
                                                <DropdownMenuItem>Ver Ficha de Entrega</DropdownMenuItem>
                                                <DropdownMenuItem>Editar Registro</DropdownMenuItem>
                                                <DropdownMenuSeparator />
                                                <DropdownMenuItem className="text-destructive">Excluir</DropdownMenuItem>
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
