
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Filter } from 'lucide-react';

export default function PendingIssuesPage() {
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
        <div className="flex flex-1 items-center justify-center rounded-lg border border-dashed shadow-sm h-96">
          <div className="flex flex-col items-center gap-1 text-center">
            <h3 className="text-2xl font-bold tracking-tight">
              Nenhuma pendência encontrada
            </h3>
            <p className="text-sm text-muted-foreground">
              Todos os exames e processos estão em conformidade.
            </p>
          </div>
        </div>
      </CardContent>
    </Card>
  );
}
