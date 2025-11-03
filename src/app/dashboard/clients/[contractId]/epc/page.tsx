
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { PlusCircle } from 'lucide-react';

export default function EpcPage() {
  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center justify-between">
          Gestão de EPCs (Equipamentos de Proteção Coletiva)
          <Button size="sm" className="h-8 gap-1">
            <PlusCircle className="h-3.5 w-3.5" />
            <span className="sr-only sm:not-sr-only sm:whitespace-nowrap">
              Adicionar EPC
            </span>
          </Button>
        </CardTitle>
        <CardDescription>
          Gerencie os Equipamentos de Proteção Coletiva (EPCs) instalados nas unidades do cliente.
        </CardDescription>
      </CardHeader>
      <CardContent>
        <div className="flex flex-1 items-center justify-center rounded-lg border border-dashed shadow-sm h-96">
          <div className="flex flex-col items-center gap-1 text-center">
            <h3 className="text-2xl font-bold tracking-tight">
              Nenhum EPC cadastrado
            </h3>
            <p className="text-sm text-muted-foreground">
              Comece adicionando o primeiro equipamento de proteção coletiva.
            </p>
            <Button className="mt-4">Adicionar EPC</Button>
          </div>
        </div>
      </CardContent>
    </Card>
  );
}
