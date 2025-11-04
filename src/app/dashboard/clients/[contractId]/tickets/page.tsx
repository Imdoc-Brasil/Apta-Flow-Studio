'use client';

import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from '@/components/ui/card';
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { MoreHorizontal } from 'lucide-react';
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuLabel, DropdownMenuTrigger } from '@/components/ui/dropdown-menu';
import { useParams } from 'next/navigation';

// Mock data, em um app real viria de uma API/banco de dados
const allTicketsData = [
  { id: 'TKT-001', subject: 'Não consigo fazer login no portal', client: 'Innovate Inc.', priority: 'Alta', status: 'Aberto', updated: '2024-07-21 10:30' },
  { id: 'TKT-002', subject: 'Pedido de recurso: Modo Escuro', client: 'Solutions Co.', priority: 'Média', status: 'Em Progresso', updated: '2024-07-21 09:15' },
  { id: 'TKT-003', subject: 'Consulta de faturamento', client: 'Stellar Tech', priority: 'Baixa', status: 'Aberto', updated: '2024-07-20 16:00' },
  { id: 'TKT-004', subject: 'Endpoint da API retornando erro 500', client: 'Quantum Dynamics', priority: 'Alta', status: 'Resolvido', updated: '2024-07-19 11:00' },
  { id: 'TKT-005', subject: 'Dúvida sobre integração', client: 'Apex Innovations', priority: 'Fechado', updated: '2024-07-18 14:45' },
  { id: 'TKT-006', subject: 'Atualização de Contrato', client: 'Innovate Inc.', priority: 'Baixa', status: 'Resolvido', updated: '2024-07-22 11:00' },
];

const statusVariant = {
    'Aberto': 'default',
    'Em Progresso': 'secondary',
    'Resolvido': 'outline',
    'Fechado': 'outline'
} as const;


export default function ClientTicketsPage() {
    const params = useParams();
    // Em um app real, usaríamos o contractId para buscar os dados.
    // Aqui, vamos simular o nome do cliente.
    const clientName = 'Innovate Inc.'; 
    const clientTickets = allTicketsData.filter(ticket => ticket.client === clientName);

  return (
    <Card>
      <CardHeader>
        <CardTitle>Meus Chamados</CardTitle>
        <CardDescription>
          Acompanhe o status e o histórico de suas solicitações de serviço.
        </CardDescription>
      </CardHeader>
      <CardContent>
        {clientTickets.length > 0 ? (
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>ID do Chamado</TableHead>
                <TableHead>Assunto</TableHead>
                <TableHead>Status</TableHead>
                <TableHead>Última Atualização</TableHead>
                <TableHead><span className="sr-only">Ações</span></TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {clientTickets.map((ticket) => (
                <TableRow key={ticket.id}>
                  <TableCell className="font-medium">{ticket.id}</TableCell>
                  <TableCell>{ticket.subject}</TableCell>
                  <TableCell>
                    <Badge variant={statusVariant[ticket.status as keyof typeof statusVariant]}>
                      {ticket.status}
                    </Badge>
                  </TableCell>
                  <TableCell>{ticket.updated}</TableCell>
                  <TableCell className="text-right">
                    <DropdownMenu>
                      <DropdownMenuTrigger asChild>
                        <Button size="icon" variant="ghost">
                          <MoreHorizontal className="h-4 w-4" />
                        </Button>
                      </DropdownMenuTrigger>
                      <DropdownMenuContent>
                        <DropdownMenuLabel>Ações</DropdownMenuLabel>
                        <DropdownMenuItem>Ver Detalhes</DropdownMenuItem>
                        <DropdownMenuItem>Adicionar Comentário</DropdownMenuItem>
                      </DropdownMenuContent>
                    </DropdownMenu>
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        ) : (
          <div className="flex flex-1 items-center justify-center rounded-lg border border-dashed shadow-sm h-96">
            <div className="flex flex-col items-center gap-1 text-center">
              <h3 className="text-2xl font-bold tracking-tight">
                Nenhum chamado aberto
              </h3>
              <p className="text-sm text-muted-foreground">
                Você ainda não abriu nenhum chamado de serviço.
              </p>
            </div>
          </div>
        )}
      </CardContent>
    </Card>
  );
}
