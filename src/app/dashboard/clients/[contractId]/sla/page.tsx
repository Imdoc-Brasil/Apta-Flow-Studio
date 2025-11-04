
'use client';

import { useState } from 'react';
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { MoreHorizontal, PlusCircle, ShieldCheck, Clock } from 'lucide-react';
import { Badge } from '@/components/ui/badge';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuLabel, DropdownMenuTrigger } from '@/components/ui/dropdown-menu';
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';

const slaKpis = [
    { title: "Conformidade de SLA (Mês)", value: "99.2%", icon: <ShieldCheck className="h-4 w-4 text-muted-foreground" /> },
    { title: "Tempo Médio de 1ª Resposta", value: "2.1 horas", icon: <Clock className="h-4 w-4 text-muted-foreground" /> },
];

const initialTicketData = [
    { id: 'SLA-001', service: 'Atualização de PGR', status: 'Em Andamento', sla: 'Dentro do Prazo' },
    { id: 'SLA-002', service: 'Validação de Atestado', status: 'Aguardando Cliente', sla: 'Pausado' },
    { id: 'SLA-003', service: 'Correção de ASO', status: 'Concluído', sla: 'Cumprido' },
    { id: 'SLA-004', service: 'Inclusão de Função', status: 'Em Andamento', sla: 'Risco de Violação' },
];

type Ticket = typeof initialTicketData[0];

const getSlaBadgeVariant = (sla: string) => {
    switch (sla) {
        case 'Cumprido':
        case 'Dentro do Prazo':
            return 'secondary';
        case 'Risco de Violação':
            return 'default';
        case 'Violado':
            return 'destructive';
        default:
            return 'outline';
    }
}


export default function SlaPage() {
  const [tickets, setTickets] = useState(initialTicketData);
  const [isDialogOpen, setIsDialogOpen] = useState(false);

  const handleAddTicket = (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    const formData = new FormData(event.currentTarget);
    const newTicket: Ticket = {
      id: `SLA-${(Math.random() * 1000).toFixed(0).padStart(3, '0')}`,
      service: formData.get('service') as string,
      status: 'Em Andamento',
      sla: 'Dentro do Prazo',
    };
    setTickets(prev => [newTicket, ...prev]);
    setIsDialogOpen(false);
  }

  return (
    <div className="grid flex-1 auto-rows-max gap-4">
        <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
            {slaKpis.map((kpi) => (
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
            <CardTitle className="flex items-center justify-between">
            Acompanhamento de Chamados
             <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
                <DialogTrigger asChild>
                    <Button size="sm" className="h-8 gap-1">
                        <PlusCircle className="h-3.5 w-3.5" />
                        <span className="sr-only sm:not-sr-only sm:whitespace-nowrap">
                        Abrir Novo Chamado
                        </span>
                    </Button>
                </DialogTrigger>
                <DialogContent>
                    <DialogHeader>
                        <DialogTitle>Abrir Novo Chamado de Serviço</DialogTitle>
                        <DialogDescription>
                            Descreva o serviço solicitado para rastreio do SLA.
                        </DialogDescription>
                    </DialogHeader>
                    <form id="add-ticket-form" onSubmit={handleAddTicket}>
                        <div className="grid gap-4 py-4">
                            <div className="grid grid-cols-4 items-center gap-4">
                                <Label htmlFor="service" className="text-right">Serviço</Label>
                                <Input id="service" name="service" className="col-span-3" placeholder="Ex: Correção de ASO" required />
                            </div>
                        </div>
                    </form>
                    <DialogFooter>
                        <Button variant="outline" onClick={() => setIsDialogOpen(false)}>Cancelar</Button>
                        <Button type="submit" form="add-ticket-form">Abrir Chamado</Button>
                    </DialogFooter>
                </DialogContent>
             </Dialog>
            </CardTitle>
            <CardDescription>
            Rastreie todos os chamados e o cumprimento do SLA correspondente.
            </CardDescription>
        </CardHeader>
        <CardContent>
            <Table>
                <TableHeader>
                    <TableRow>
                        <TableHead>Chamado</TableHead>
                        <TableHead>Serviço Relacionado</TableHead>
                        <TableHead>Status</TableHead>
                        <TableHead>Status SLA</TableHead>
                         <TableHead>
                            <span className="sr-only">Ações</span>
                        </TableHead>
                    </TableRow>
                </TableHeader>
                <TableBody>
                    {tickets.map((ticket) => (
                        <TableRow key={ticket.id}>
                            <TableCell className="font-medium">{ticket.id}</TableCell>
                            <TableCell>{ticket.service}</TableCell>
                            <TableCell><Badge variant="outline">{ticket.status}</Badge></TableCell>
                            <TableCell><Badge variant={getSlaBadgeVariant(ticket.sla)}>{ticket.sla}</Badge></TableCell>
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
                                    <DropdownMenuItem>Ver Detalhes</DropdownMenuItem>
                                    <DropdownMenuItem>Adicionar Interação</DropdownMenuItem>
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
  );
}
