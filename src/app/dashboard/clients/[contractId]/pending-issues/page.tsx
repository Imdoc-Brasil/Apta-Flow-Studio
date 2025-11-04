
'use client';

import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Filter, AlertCircle, RefreshCw } from 'lucide-react';
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table';
import { Badge } from '@/components/ui/badge';
import { useState } from 'react';

const initialPendingIssues = [
  { id: 'PEND-001', collaborator: 'João da Silva', exam: 'Audiometria', alteration: 'Sugestivo de PAIR', status: 'Aguardando Avaliação', date: '2024-07-05' },
  { id: 'PEND-002', collaborator: 'Ana Costa', exam: 'Espirometria', alteration: 'Alteração leve', status: 'Encaminhado ao Especialista', date: '2024-07-02' },
];

type PendingIssue = typeof initialPendingIssues[0];

export default function PendingIssuesPage() {
  const [issues, setIssues] = useState<PendingIssue[]>([]);

  const handleCheckIssues = () => {
    // Simulate checking for issues
    setIssues(initialPendingIssues);
  };

  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center justify-between">
          Gestão de Pendências
           <Button size="sm" variant="outline" className="h-8 gap-1">
            <Filter className="h-3.5 w-3.5" />
            <span className="sr-only sm:not-sr-only sm:whitespace-nowrap">
              Filtrar
            </span>
          </Button>
        </CardTitle>
        <CardDescription>
          Acompanhe exames com resultados alterados e outras pendências que impactam a emissão do ASO.
        </CardDescription>
      </CardHeader>
      <CardContent>
        {issues.length > 0 ? (
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Colaborador</TableHead>
                <TableHead>Exame</TableHead>
                <TableHead>Alteração Identificada</TableHead>
                <TableHead>Status</TableHead>
                <TableHead>Data</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {issues.map((issue) => (
                <TableRow key={issue.id}>
                  <TableCell className="font-medium">{issue.collaborator}</TableCell>
                  <TableCell>{issue.exam}</TableCell>
                  <TableCell>{issue.alteration}</TableCell>
                  <TableCell>
                    <Badge variant={issue.status === 'Aguardando Avaliação' ? 'default' : 'secondary'}>
                      {issue.status}
                    </Badge>
                  </TableCell>
                  <TableCell>{issue.date}</TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        ) : (
          <div className="flex flex-1 items-center justify-center rounded-lg border border-dashed shadow-sm h-96">
            <div className="flex flex-col items-center gap-1 text-center">
              <AlertCircle className="h-12 w-12 text-muted-foreground mb-4" />
              <h3 className="text-2xl font-bold tracking-tight">
                Nenhuma pendência encontrada
              </h3>
              <p className="text-sm text-muted-foreground">
                Todos os exames e processos estão em conformidade no momento.
              </p>
              <Button className="mt-4" onClick={handleCheckIssues}>
                <RefreshCw className="mr-2 h-4 w-4" />
                Verificar Novamente
              </Button>
            </div>
          </div>
        )}
      </CardContent>
    </Card>
  );
}
