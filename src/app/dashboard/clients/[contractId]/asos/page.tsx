
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { PlusCircle } from 'lucide-react';

export default function AsosPage() {
  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center justify-between">
          Gestão de ASOs (Atestado de Saúde Ocupacional)
          <Button size="sm" className="h-8 gap-1">
            <PlusCircle className="h-3.5 w-3.5" />
            <span className="sr-only sm:not-sr-only sm:whitespace-nowrap">
              Emitir ASO
            </span>
          </Button>
        </CardTitle>
        <CardDescription>
          Emita e gerencie os Atestados de Saúde Ocupacional dos colaboradores.
        </CardDescription>
      </CardHeader>
      <CardContent>
        <div className="flex flex-1 items-center justify-center rounded-lg border border-dashed shadow-sm h-96">
          <div className="flex flex-col items-center gap-1 text-center">
            <h3 className="text-2xl font-bold tracking-tight">
              Nenhum ASO emitido
            </h3>
            <p className="text-sm text-muted-foreground">
              Comece emitindo o primeiro ASO para um colaborador.
            </p>
            <Button className="mt-4">Emitir ASO</Button>
          </div>
        </div>
      </CardContent>
    </Card>
  );
}
