
'use client';

import { useState } from 'react';
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
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { useToast } from '@/hooks/use-toast';


const initialPriceData = [
  { code: '0201', name: 'Avaliação Clínica Ocupacional', price: 55.00, category: 'Exame' },
  { code: '0211', name: 'Avaliação da acuidade visual', price: 38.50, category: 'Exame' },
  { code: 'SST-01', name: 'PCMSO', price: 800.00, category: 'Programa' },
  { code: 'SST-02', name: 'PGR', price: 1200.00, category: 'Programa' },
];

export default function PricesPage() {
  const [priceData, setPriceData] = useState(initialPriceData);
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const { toast } = useToast();

  const handleAdjustment = (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    const formData = new FormData(event.currentTarget);
    const percentage = parseFloat(formData.get('adjustment') as string);
    if (isNaN(percentage)) return;

    const multiplier = 1 + percentage / 100;
    setPriceData(prevData =>
      prevData.map(item => ({
        ...item,
        price: parseFloat((item.price * multiplier).toFixed(2)),
      }))
    );

    toast({
      title: 'Reajuste Aplicado!',
      description: `Os preços foram reajustados em ${percentage}%.`,
    });
    setIsDialogOpen(false);
  };

  const formatCurrency = (value: number) => {
    return new Intl.NumberFormat('pt-BR', {
      style: 'currency',
      currency: 'BRL',
    }).format(value);
  }

  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center justify-between">
          Tabela de Preços do Cliente
           <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
              <DialogTrigger asChild>
                <Button size="sm" variant="outline" className="h-8 gap-1">
                    <Percent className="h-3.5 w-3.5" />
                    <span className="sr-only sm:not-sr-only sm:whitespace-nowrap">
                    Aplicar Reajuste
                    </span>
                </Button>
              </DialogTrigger>
              <DialogContent className="sm:max-w-md">
                <form onSubmit={handleAdjustment}>
                    <DialogHeader>
                        <DialogTitle>Reajuste de Preços</DialogTitle>
                        <DialogDescription>
                            Aplique um reajuste percentual a todos os itens da tabela de preços deste cliente.
                        </DialogDescription>
                    </DialogHeader>
                    <div className="grid gap-4 py-4">
                        <div className="grid grid-cols-4 items-center gap-4">
                            <Label htmlFor="adjustment" className="text-right">
                                Percentual (%)
                            </Label>
                            <Input id="adjustment" name="adjustment" type="number" step="0.1" placeholder="Ex: 5.5" className="col-span-3" required/>
                        </div>
                    </div>
                    <DialogFooter>
                        <Button variant="outline" onClick={() => setIsDialogOpen(false)}>Cancelar</Button>
                        <Button type="submit">Aplicar Reajuste</Button>
                    </DialogFooter>
                </form>
              </DialogContent>
           </Dialog>
        </CardTitle>
        <CardDescription>
          Tabela de preços específica para este cliente, refletindo negociações.
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
                    <TableCell className="text-right">{formatCurrency(item.price)}</TableCell>
                </TableRow>
                ))}
            </TableBody>
        </Table>
      </CardContent>
    </Card>
  );
}
