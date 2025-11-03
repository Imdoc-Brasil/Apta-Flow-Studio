
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Percent } from 'lucide-react';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { Badge } from '@/components/ui/badge';

const priceData = [
  { code: '0201', name: 'Avaliação Clínica Ocupacional', price: 'R$ 55,00', category: 'Exame' },
  { code: '0211', name: 'Avaliação da acuidade visual', price: 'R$ 38,50', category: 'Exame' },
  { code: 'SST-01', name: 'PCMSO', price: 'R$ 800,00', category: 'Programa' },
  { code: 'SST-02', name: 'PGR', price: 'R$ 1.200,00', category: 'Programa' },
];

export default function PricesPage() {
  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center justify-between">
          Tabela de Preços do Cliente
          <Button size="sm" variant="outline" className="h-8 gap-1">
            <Percent className="h-3.5 w-3.5" />
            <span className="sr-only sm:not-sr-only sm:whitespace-nowrap">
              Aplicar Reajuste
            </span>
          </Button>
        </CardTitle>
        <CardDescription>
          Tabela de preços específica para este cliente, refletindo negociações. O conteúdo para esta página será construído aqui.
        </CardDescription>
      </CardHeader>
      <CardContent>
         <Table>
            <TableHeader>
                <TableRow>
                <TableHead>Código</TableHead>
                <TableHead>Serviço</TableHead>
                <TableHead>Categoria</TableHead>
                <TableHead className="text-right">Preço</TableHead>
                </TableRow>
            </TableHeader>
            <TableBody>
                {priceData.map((item) => (
                <TableRow key={item.code}>
                    <TableCell>{item.code}</TableCell>
                    <TableCell className="font-medium">{item.name}</TableCell>
                    <TableCell><Badge variant="outline">{item.category}</Badge></TableCell>
                    <TableCell className="text-right">{item.price}</TableCell>
                </TableRow>
                ))}
            </TableBody>
        </Table>
      </CardContent>
    </Card>
  );
}
