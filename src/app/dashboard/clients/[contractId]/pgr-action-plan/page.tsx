
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { PlusCircle } from 'lucide-react';

export default function PgrActionPlanPage() {
  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center justify-between">
          Plano de Ação
          <Button size="sm" className="h-8 gap-1">
            <PlusCircle className="h-3.5 w-3.5" />
            <span className="sr-only sm:not-sr-only sm:whitespace-nowrap">
              Adicionar Ação
            </span>
          </Button>
        </CardTitle>
        <CardDescription>
          Crie e acompanhe o plano de ação para mitigar os riscos identificados.
        </CardDescription>
      </CardHeader>
      <CardContent>
        <div className="flex flex-1 items-center justify-center rounded-lg border border-dashed shadow-sm h-96">
          <div className="flex flex-col items-center gap-1 text-center">
            <h3 className="text-2xl font-bold tracking-tight">
              Nenhuma ação no plano
            </h3>
            <p className="text-sm text-muted-foreground">
              Comece adicionando a primeira ação ao plano.
            </p>
            <Button className="mt-4">Adicionar Ação</Button>
          </div>
        </div>
      </CardContent>
    </Card>
  );
}
