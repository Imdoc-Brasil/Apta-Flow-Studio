
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { PlusCircle } from 'lucide-react';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { Badge } from '@/components/ui/badge';

const servicesData = [
    { id: 'SERV-001', name: 'PCMSO', category: 'Programa de SST', status: 'Ativo', renewalDate: '2025-03-15' },
    { id: 'SERV-002', name: 'PGR', category: 'Programa de SST', status: 'Ativo', renewalDate: '2026-03-15' },
    { id: 'SERV-003', name: 'Assessoria Técnica', category: 'Recorrência', status: 'Ativo', renewalDate: '2025-01-01' },
];

export default function ServicesPage() {
  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center justify-between">
          Serviços Contratados
          <Button size="sm" className="h-8 gap-1">
            <PlusCircle className="h-3.5 w-3.5" />
            <span className="sr-only sm:not-sr-only sm:whitespace-nowrap">
              Adicionar Serviço
            </span>
          </Button>
        </CardTitle>
        <CardDescription>
          Gerencie os serviços contratados por este cliente. O conteúdo para esta página será construído aqui.
        </CardDescription>
      </CardHeader>
      <CardContent>
        <Table>
            <TableHeader>
                <TableRow>
                <TableHead>Serviço</TableHead>
                <TableHead>Categoria</TableHead>
                <TableHead>Status</TableHead>
                <TableHead>Data de Renovação</TableHead>
                </TableRow>
            </TableHeader>
            <TableBody>
                {servicesData.map((item) => (
                <TableRow key={item.id}>
                    <TableCell className="font-medium">{item.name}</TableCell>
                    <TableCell>{item.category}</TableCell>
                    <TableCell><Badge variant={item.status === 'Ativo' ? 'secondary' : 'outline'}>{item.status}</Badge></TableCell>
                    <TableCell>{item.renewalDate}</TableCell>
                </TableRow>
                ))}
            </TableBody>
        </Table>
      </CardContent>
    </Card>
  );
}
