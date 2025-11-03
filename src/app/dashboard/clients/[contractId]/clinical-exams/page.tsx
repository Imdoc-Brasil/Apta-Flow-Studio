
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { PlusCircle } from 'lucide-react';

export default function ClinicalExamsPage() {
  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center justify-between">
          Exames Clínicos
          <Button size="sm" className="h-8 gap-1">
            <PlusCircle className="h-3.5 w-3.5" />
            <span className="sr-only sm:not-sr-only sm:whitespace-nowrap">
              Registrar Consulta
            </span>
          </Button>
        </CardTitle>
        <CardDescription>
          Gerencie as consultas e exames clínicos realizados pelos profissionais de saúde.
        </CardDescription>
      </CardHeader>
      <CardContent>
        <div className="flex flex-1 items-center justify-center rounded-lg border border-dashed shadow-sm h-96">
          <div className="flex flex-col items-center gap-1 text-center">
            <h3 className="text-2xl font-bold tracking-tight">
              Nenhum exame clínico registrado
            </h3>
            <p className="text-sm text-muted-foreground">
              Comece registrando a primeira consulta ou exame clínico.
            </p>
            <Button className="mt-4">Registrar Consulta</Button>
          </div>
        </div>
      </CardContent>
    </Card>
  );
}
