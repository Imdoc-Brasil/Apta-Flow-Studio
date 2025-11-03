
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { PlusCircle } from 'lucide-react';

export default function PeriodicosPage() {
  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center justify-between">
          Gestão de Exames Periódicos
          <Button size="sm" className="h-8 gap-1">
            <PlusCircle className="h-3.5 w-3.5" />
            <span className="sr-only sm:not-sr-only sm:whitespace-nowrap">
              Agendar Exame
            </span>
          </Button>
        </CardTitle>
        <CardDescription>
          Acompanhe e gerencie a programação de exames periódicos dos colaboradores.
        </CardDescription>
      </CardHeader>
      <CardContent>
        <div className="flex flex-1 items-center justify-center rounded-lg border border-dashed shadow-sm h-96">
          <div className="flex flex-col items-center gap-1 text-center">
            <h3 className="text-2xl font-bold tracking-tight">
              Nenhum exame agendado
            </h3>
            <p className="text-sm text-muted-foreground">
              Comece agendando os exames periódicos para este cliente.
            </p>
            <Button className="mt-4">Agendar Exame</Button>
          </div>
        </div>
      </CardContent>
    </Card>
  );
}
