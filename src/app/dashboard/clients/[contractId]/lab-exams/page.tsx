
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { PlusCircle, Upload } from 'lucide-react';

export default function LabExamsPage() {
  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center justify-between">
          Exames Laboratoriais
          <Button size="sm" className="h-8 gap-1">
            <Upload className="h-3.5 w-3.5" />
            <span className="sr-only sm:not-sr-only sm:whitespace-nowrap">
              Importar Resultados
            </span>
          </Button>
        </CardTitle>
        <CardDescription>
          Gerencie e importe os resultados de exames laboratoriais dos colaboradores.
        </CardDescription>
      </CardHeader>
      <CardContent>
        <div className="flex flex-1 items-center justify-center rounded-lg border border-dashed shadow-sm h-96">
          <div className="flex flex-col items-center gap-1 text-center">
            <h3 className="text-2xl font-bold tracking-tight">
              Nenhum resultado importado
            </h3>
            <p className="text-sm text-muted-foreground">
              Comece importando o primeiro lote de resultados de exames.
            </p>
            <Button className="mt-4">Importar Resultados</Button>
          </div>
        </div>
      </CardContent>
    </Card>
  );
}
