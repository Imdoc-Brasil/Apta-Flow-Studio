'use client';

import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { MoreHorizontal, PlusCircle } from 'lucide-react';
import { useState } from 'react';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { Badge } from '@/components/ui/badge';
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuLabel, DropdownMenuTrigger } from '@/components/ui/dropdown-menu';
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Textarea } from '@/components/ui/textarea';

const initialInventory = [
    { id: 'INV-001', sector: 'Produção', gho: 'Operadores de Máquina', risk: 'Ruído Contínuo', probability: '3', severity: '2', level: 'Médio' },
    { id: 'INV-002', sector: 'Logística', gho: 'Estoquistas', risk: 'Levantamento de Peso', probability: '2', severity: '3', level: 'Médio' },
    { id: 'INV-003', sector: 'Administrativo', gho: 'Toda a equipe', risk: 'Iluminamento Inadequado', probability: '1', severity: '1', level: 'Baixo' },
];

type RiskInventoryItem = typeof initialInventory[0];

export default function PgrInventoryPage() {
    const [inventory, setInventory] = useState(initialInventory);
    const [isDialogOpen, setIsDialogOpen] = useState(false);

    const handleAddRisk = (event: React.FormEvent<HTMLFormElement>) => {
        event.preventDefault();
        const formData = new FormData(event.currentTarget);
        const prob = parseInt(formData.get('probability') as string, 10);
        const sev = parseInt(formData.get('severity') as string, 10);
        const riskProduct = prob * sev;
        let level = 'Baixo';
        if (riskProduct > 4) level = 'Alto';
        else if (riskProduct > 2) level = 'Médio';

        const newItem: RiskInventoryItem = {
            id: `INV-${Math.random().toString(36).substr(2, 4).toUpperCase()}`,
            sector: formData.get('sector') as string,
            gho: formData.get('gho') as string,
            risk: formData.get('risk') as string,
            probability: formData.get('probability') as string,
            severity: formData.get('severity') as string,
            level,
        };
        setInventory(prev => [newItem, ...prev]);
        setIsDialogOpen(false);
        (event.target as HTMLFormElement).reset();
    }

  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center justify-between">
          Inventário de Riscos
            <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
                <DialogTrigger asChild>
                    <Button size="sm" className="h-8 gap-1">
                        <PlusCircle className="h-3.5 w-3.5" />
                        <span className="sr-only sm:not-sr-only sm:whitespace-nowrap">
                        Adicionar Risco
                        </span>
                    </Button>
                </DialogTrigger>
                <DialogContent className="sm:max-w-2xl">
                    <DialogHeader>
                        <DialogTitle>Adicionar Risco ao Inventário</DialogTitle>
                        <DialogDescription>
                            Identifique um perigo, avalie o risco e adicione-o ao inventário do PGR.
                        </DialogDescription>
                    </DialogHeader>
                    <form id="add-risk-form" onSubmit={handleAddRisk}>
                        <div className="grid gap-4 py-4">
                            <div className="grid grid-cols-2 gap-4">
                                <div className="space-y-2">
                                    <Label htmlFor="sector">Setor</Label>
                                    <Input id="sector" name="sector" required />
                                </div>
                                 <div className="space-y-2">
                                    <Label htmlFor="gho">GHO (Grupo Homogêneo)</Label>
                                    <Input id="gho" name="gho" required />
                                </div>
                            </div>
                            <div className="space-y-2">
                                <Label htmlFor="risk">Perigo / Agente de Risco</Label>
                                <Input id="risk" name="risk" required />
                            </div>
                             <div className="grid grid-cols-2 gap-4">
                               <div className="space-y-2">
                                    <Label htmlFor="probability">Probabilidade</Label>
                                    <Select name="probability" required defaultValue="1">
                                        <SelectTrigger><SelectValue placeholder="Selecione..." /></SelectTrigger>
                                        <SelectContent>
                                            <SelectItem value="1">1 - Baixa</SelectItem>
                                            <SelectItem value="2">2 - Média</SelectItem>
                                            <SelectItem value="3">3 - Alta</SelectItem>
                                        </SelectContent>
                                    </Select>
                                </div>
                                 <div className="space-y-2">
                                    <Label htmlFor="severity">Severidade</Label>
                                    <Select name="severity" required defaultValue="1">
                                        <SelectTrigger><SelectValue placeholder="Selecione..." /></SelectTrigger>
                                        <SelectContent>
                                            <SelectItem value="1">1 - Baixa</SelectItem>
                                            <SelectItem value="2">2 - Média</SelectItem>
                                            <SelectItem value="3">3 - Alta</SelectItem>
                                        </SelectContent>
                                    </Select>
                                </div>
                            </div>
                        </div>
                         <DialogFooter>
                            <Button variant="outline" onClick={() => setIsDialogOpen(false)}>Cancelar</Button>
                            <Button type="submit">Salvar</Button>
                        </DialogFooter>
                    </form>
                </DialogContent>
            </Dialog>
        </CardTitle>
        <CardDescription>
          Gerencie os riscos identificados para cada setor, cargo e atividade.
        </CardDescription>
      </CardHeader>
      <CardContent>
        {inventory.length > 0 ? (
            <Table>
                <TableHeader>
                    <TableRow>
                        <TableHead>Setor / GHO</TableHead>
                        <TableHead>Risco</TableHead>
                        <TableHead>Prob.</TableHead>
                        <TableHead>Sev.</TableHead>
                        <TableHead>Nível do Risco</TableHead>
                        <TableHead><span className="sr-only">Ações</span></TableHead>
                    </TableRow>
                </TableHeader>
                <TableBody>
                    {inventory.map(item => (
                        <TableRow key={item.id}>
                            <TableCell>
                                <div className="font-medium">{item.sector}</div>
                                <div className="text-sm text-muted-foreground">{item.gho}</div>
                            </TableCell>
                            <TableCell>{item.risk}</TableCell>
                            <TableCell>{item.probability}</TableCell>
                            <TableCell>{item.severity}</TableCell>
                             <TableCell>
                                <Badge variant={item.level === 'Baixo' ? 'secondary' : item.level === 'Médio' ? 'default' : 'destructive'}>{item.level}</Badge>
                            </TableCell>
                            <TableCell className="text-right">
                                <DropdownMenu>
                                    <DropdownMenuTrigger asChild><Button size="icon" variant="ghost"><MoreHorizontal className="h-4 w-4" /></Button></DropdownMenuTrigger>
                                    <DropdownMenuContent>
                                        <DropdownMenuItem>Editar</DropdownMenuItem>
                                        <DropdownMenuItem>Criar Ação no Plano</DropdownMenuItem>
                                    </DropdownMenuContent>
                                </DropdownMenu>
                            </TableCell>
                        </TableRow>
                    ))}
                </TableBody>
            </Table>
        ) : (
             <div className="flex flex-1 items-center justify-center rounded-lg border border-dashed shadow-sm h-96">
                <div className="flex flex-col items-center gap-1 text-center">
                    <h3 className="text-2xl font-bold tracking-tight">
                    Nenhum risco cadastrado
                    </h3>
                    <p className="text-sm text-muted-foreground">
                    Comece adicionando o primeiro risco ao inventário.
                    </p>
                    <Button className="mt-4" onClick={() => setIsDialogOpen(true)}>Adicionar Risco</Button>
                </div>
            </div>
        )}
      </CardContent>
    </Card>
  );
}
