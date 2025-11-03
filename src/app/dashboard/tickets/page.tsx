import {
  MoreHorizontal,
  PlusCircle,
  Filter,
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

const ticketsData = [
  { id: 'TKT-001', subject: 'Não consigo fazer login no portal', client: 'Innovate Inc.', priority: 'Alta', status: 'Aberto', updated: '2024-07-21 10:30' },
  { id: 'TKT-002', subject: 'Pedido de recurso: Modo Escuro', client: 'Solutions Co.', priority: 'Média', status: 'Em Progresso', updated: '2024-07-21 09:15' },
  { id: 'TKT-003', subject: 'Consulta de faturamento', client: 'Stellar Tech', priority: 'Baixa', status: 'Aberto', updated: '2024-07-20 16:00' },
  { id: 'TKT-004', subject: 'Endpoint da API retornando erro 500', client: 'Quantum Dynamics', priority: 'Alta', status: 'Resolvido', updated: '2024-07-19 11:00' },
  { id: 'TKT-005', subject: 'Dúvida sobre integração', client: 'Apex Innovations', priority: 'Baixa', status: 'Fechado', updated: '2024-07-18 14:45' },
];

const priorityVariant = {
    'Alta': 'destructive',
    'Média': 'default',
    'Baixa': 'secondary'
} as const;

const statusVariant = {
    'Aberto': 'default',
    'Em Progresso': 'secondary',
    'Resolvido': 'outline',
    'Fechado': 'outline'
} as const;


export default function TicketsPage() {
  return (
    <Card>
      <CardHeader>
        <div className="flex items-start justify-between">
            <div>
                <CardTitle>Tickets de Serviço</CardTitle>
                <CardDescription>
                Rastreie e gerencie as solicitações de serviço do cliente.
                </CardDescription>
            </div>
            <div className="flex gap-2">
                 <Button variant="outline" size="sm" className="h-8 gap-1">
                    <Filter className="h-3.5 w-3.5" />
                    <span>Filtrar</span>
                </Button>
                <Button size="sm" className="h-8 gap-1">
                    <PlusCircle className="h-3.5 w-3.5" />
                    <span className="sr-only sm:not-sr-only sm:whitespace-nowrap">
                    Novo Ticket
                    </span>
                </Button>
            </div>
        </div>
      </CardHeader>
      <CardContent>
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead className="w-[100px]">ID do Ticket</TableHead>
              <TableHead>Assunto</TableHead>
              <TableHead className="hidden md:table-cell">Cliente</TableHead>
              <TableHead>Prioridade</TableHead>
              <TableHead>Status</TableHead>
              <TableHead className="hidden md:table-cell">Última Atualização</TableHead>
              <TableHead>
                <span className="sr-only">Ações</span>
              </TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {ticketsData.map((ticket) => (
                <TableRow key={ticket.id}>
                <TableCell className="font-medium">{ticket.id}</TableCell>
                <TableCell>{ticket.subject}</TableCell>
                <TableCell className="hidden md:table-cell">{ticket.client}</TableCell>
                <TableCell>
                  <Badge variant={priorityVariant[ticket.priority as keyof typeof priorityVariant]}>{ticket.priority}</Badge>
                </TableCell>
                <TableCell>
                  <Badge variant={statusVariant[ticket.status as keyof typeof statusVariant]}>{ticket.status}</Badge>
                </TableCell>
                <TableCell className="hidden md:table-cell">{ticket.updated}</TableCell>
                <TableCell>
                      <DropdownMenu>
                        <DropdownMenuTrigger asChild>
                          <Button
                            aria-haspopup="true"
                            size="icon"
                            variant="ghost"
                          >
                            <MoreHorizontal className="h-4 w-4" />
                            <span className="sr-only">Alternar menu</span>
                          </Button>
                        </DropdownMenuTrigger>
                        <DropdownMenuContent align="end">
                          <DropdownMenuLabel>Ações</DropdownMenuLabel>
                          <DropdownMenuItem>Ver Detalhes</DropdownMenuItem>
                          <DropdownMenuItem>Atribuir</DropdownMenuItem>
                          <DropdownMenuSeparator />
                          <DropdownMenuItem>Fechar Ticket</DropdownMenuItem>
                        </DropdownMenuContent>
                      </DropdownMenu>
                    </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </CardContent>
    </Card>
  );
}
