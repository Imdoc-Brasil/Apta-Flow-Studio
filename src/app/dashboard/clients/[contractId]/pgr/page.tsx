
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { PlusCircle } from 'lucide-react';

export default function PgrPage() {
  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center justify-between">
          Gestão de Riscos (PGR)
          <Button size="sm" className="h-8 gap-1">
            <PlusCircle className="h-3.5 w-3.5" />
            <span className="sr-only sm:not-sr-only sm:whitespace-nowrap">
              Gerar PGR
            </span>
          </Button>
        </CardTitle>
        <CardDescription>
          Gerencie o Programa de Gerenciamento de Riscos para este cliente, incluindo inventário de riscos e plano de ação.
        </CardDescription>
      </CardHeader>
      <CardContent>
        <div className="flex flex-1 items-center justify-center rounded-lg border border-dashed shadow-sm h-96">
          <div className="flex flex-col items-center gap-1 text-center">
            <h3 className="text-2xl font-bold tracking-tight">
              Visão Geral do PGR
            </h3>
            <p className="text-sm text-muted-foreground">
              O conteúdo da visão geral do PGR será construído aqui.
            </p>
            <Button className="mt-4">Gerar Documento PGR</Button>
          </div>
        </div>
      </CardContent>
    </Card>
  );
}
