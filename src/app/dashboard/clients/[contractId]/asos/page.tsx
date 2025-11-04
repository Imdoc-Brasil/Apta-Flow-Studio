
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
import { PlusCircle } from 'lucide-react';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from '@/components/ui/dialog';
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table';
import { Badge } from '@/components/ui/badge';
import { Label } from '@/components/ui/label';
import { Input } from '@/components/ui/input';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';

const initialAsos = [
    { id: 'ASO-001', collaborator: 'João da Silva', type: 'Admissional', date: '2024-07-01', result: 'Apto', validity: '12 meses'},
    { id: 'ASO-002', collaborator: 'Maria Oliveira', type: 'Periódico', date: '2024-06-15', result: 'Apto', validity: '12 meses'},
];

type Aso = typeof initialAsos[0];

const mockCollaborators = ['João da Silva', 'Maria Oliveira'];

export default function AsosPage() {
  const [asos, setAsos] = useState(initialAsos);
  const [isDialogOpen, setIsDialogOpen] = useState(false);

  const handleAddAso = (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    const formData = new FormData(event.currentTarget);
    const newAso: Aso = {
        id: `ASO-${(Math.random() * 1000).toFixed(0).padStart(3,'0')}`,
        collaborator: formData.get('collaborator') as string,
        type: formData.get('type') as string,
        date: formData.get('date') as string,
        result: formData.get('result') as string,
        validity: '12 meses',
    };
    setAsos(prev => [newAso, ...prev]);
    setIsDialogOpen(false);
  }

  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center justify-between">
          Gestão de ASOs (Atestado de Saúde Ocupacional)
          <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
            <DialogTrigger asChild>
              <Button size="sm" className="h-8 gap-1">
                <PlusCircle className="h-3.5 w-3.5" />
                <span className="sr-only sm:not-sr-only sm:whitespace-nowrap">
                  Emitir ASO
                </span>
              </Button>
            </DialogTrigger>
            <DialogContent>
                <DialogHeader>
                    <DialogTitle>Emitir Novo ASO</DialogTitle>
                    <DialogDescription>Preencha os dados para emitir um novo ASO.</DialogDescription>
                </DialogHeader>
                 <form id="add-aso-form" onSubmit={handleAddAso}>
                    <div className="grid gap-4 py-4">
                         <div className="grid grid-cols-4 items-center gap-4">
                            <Label htmlFor="collaborator" className="text-right">Colaborador</Label>
                            <Select name="collaborator" required>
                                <SelectTrigger className="col-span-3">
                                    <SelectValue placeholder="Selecione o colaborador" />
                                </SelectTrigger>
                                <SelectContent>
                                    {mockCollaborators.map(c => <SelectItem key={c} value={c}>{c}</SelectItem>)}
                                </SelectContent>
                            </Select>
                        </div>
                         <div className="grid grid-cols-4 items-center gap-4">
                            <Label htmlFor="type" className="text-right">Tipo de Exame</Label>
                            <Select name="type" required>
                                <SelectTrigger className="col-span-3">
                                    <SelectValue placeholder="Selecione o tipo" />
                                </SelectTrigger>
                                <SelectContent>
                                    <SelectItem value="Admissional">Admissional</SelectItem>
                                    <SelectItem value="Periódico">Periódico</SelectItem>
                                    <SelectItem value="Demissional">Demissional</SelectItem>
                                    <SelectItem value="Mudança de Risco">Mudança de Risco</SelectItem>
                                    <SelectItem value="Retorno ao Trabalho">Retorno ao Trabalho</SelectItem>
                                </SelectContent>
                            </Select>
                        </div>
                        <div className="grid grid-cols-4 items-center gap-4">
                            <Label htmlFor="date" className="text-right">Data de Emissão</Label>
                            <Input id="date" name="date" type="date" className="col-span-3" required/>
                        </div>
                        <div className="grid grid-cols-4 items-center gap-4">
                            <Label htmlFor="result" className="text-right">Resultado</Label>
                            <Select name="result" required>
                                <SelectTrigger className="col-span-3">
                                    <SelectValue placeholder="Selecione o resultado" />
                                </SelectTrigger>
                                <SelectContent>
                                    <SelectItem value="Apto">Apto</SelectItem>
                                    <SelectItem value="Inapto">Inapto</SelectItem>
                                    <SelectItem value="Apto com Restrições">Apto com Restrições</SelectItem>
                                </SelectContent>
                            </Select>
                        </div>
                    </div>
                 
                <DialogFooter>
                    <Button variant="outline" onClick={() => setIsDialogOpen(false)}>Cancelar</Button>
                    <Button type="submit" form="add-aso-form">Salvar e Emitir</Button>
                </DialogFooter>
                </form>
            </DialogContent>
          </Dialog>
        </CardTitle>
        <CardDescription>
          Emita e gerencie os Atestados de Saúde Ocupacional dos colaboradores.
        </CardDescription>
      </CardHeader>
      <CardContent>
        {asos.length > 0 ? (
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Colaborador</TableHead>
                <TableHead>Tipo</TableHead>
                <TableHead>Data</TableHead>
                <TableHead>Resultado</TableHead>
                <TableHead>Validade</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {asos.map((aso) => (
                <TableRow key={aso.id}>
                  <TableCell className="font-medium">{aso.collaborator}</TableCell>
                  <TableCell>{aso.type}</TableCell>
                  <TableCell>{aso.date}</TableCell>
                  <TableCell>
                    <Badge
                      variant={
                        aso.result === 'Apto'
                          ? 'secondary'
                          : aso.result === 'Inapto'
                          ? 'destructive'
                          : 'default'
                      }
                    >
                      {aso.result}
                    </Badge>
                  </TableCell>
                  <TableCell>{aso.validity}</TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        ) : (
          <div className="flex flex-1 items-center justify-center rounded-lg border border-dashed shadow-sm h-96">
            <div className="flex flex-col items-center gap-1 text-center">
              <h3 className="text-2xl font-bold tracking-tight">
                Nenhum ASO emitido
              </h3>
              <p className="text-sm text-muted-foreground">
                Comece emitindo o primeiro ASO para um colaborador.
              </p>
              <Button className="mt-4" onClick={() => setIsDialogOpen(true)}>Emitir ASO</Button>
            </div>
          </div>
        )}
      </CardContent>
    </Card>
  );
}
