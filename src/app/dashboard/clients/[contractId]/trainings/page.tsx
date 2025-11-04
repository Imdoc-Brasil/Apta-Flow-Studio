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

const initialTrainings = [
    { id: 'TRN-001', name: 'NR-35 - Trabalho em Altura', date: '2024-05-10', participants: 15, status: 'Realizado', nextDueDate: '2026-05-10' },
    { id: 'TRN-002', name: 'NR-10 - Básico', date: '2024-08-20', participants: 8, status: 'Agendado', nextDueDate: '2026-08-20' },
];

type Training = typeof initialTrainings[0];

export default function TrainingsPage() {
    const [trainings, setTrainings] = useState(initialTrainings);
    const [isDialogOpen, setIsDialogOpen] = useState(false);

    const handleAddTraining = (event: React.FormEvent<HTMLFormElement>) => {
        event.preventDefault();
        const formData = new FormData(event.currentTarget);
        const newTraining: Training = {
            id: `TRN-${Math.random().toString(36).substr(2, 4).toUpperCase()}`,
            name: formData.get('name') as string,
            date: formData.get('date') as string,
            participants: parseInt(formData.get('participants') as string, 10),
            status: 'Agendado',
            nextDueDate: formData.get('nextDueDate') as string
        };
        setTrainings(prev => [newTraining, ...prev]);
        setIsDialogOpen(false);
    }

  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center justify-between">
          Gestão de Treinamentos
            <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
                <DialogTrigger asChild>
                    <Button size="sm" className="h-8 gap-1">
                        <PlusCircle className="h-3.5 w-3.5" />
                        <span className="sr-only sm:not-sr-only sm:whitespace-nowrap">
                        Agendar Treinamento
                        </span>
                    </Button>
                </DialogTrigger>
                <DialogContent>
                    <DialogHeader>
                        <DialogTitle>Agendar Novo Treinamento</DialogTitle>
                        <DialogDescription>
                            Preencha as informações para agendar um novo treinamento de SST.
                        </DialogDescription>
                    </DialogHeader>
                    <form id="add-training-form" onSubmit={handleAddTraining}>
                        <div className="grid gap-4 py-4">
                             <div className="grid grid-cols-4 items-center gap-4">
                                <Label htmlFor="name" className="text-right">Treinamento</Label>
                                <Input id="name" name="name" placeholder="Ex: NR-35 Trabalho em Altura" className="col-span-3" required/>
                            </div>
                            <div className="grid grid-cols-4 items-center gap-4">
                                <Label htmlFor="date" className="text-right">Data</Label>
                                <Input id="date" name="date" type="date" className="col-span-3" required/>
                            </div>
                             <div className="grid grid-cols-4 items-center gap-4">
                                <Label htmlFor="participants" className="text-right">Participantes</Label>
                                <Input id="participants" name="participants" type="number" className="col-span-3" required/>
                            </div>
                             <div className="grid grid-cols-4 items-center gap-4">
                                <Label htmlFor="nextDueDate" className="text-right">Próximo Venc.</Label>
                                <Input id="nextDueDate" name="nextDueDate" type="date" className="col-span-3" required/>
                            </div>
                        </div>
                    </form>
                    <DialogFooter>
                        <Button variant="outline" onClick={() => setIsDialogOpen(false)}>Cancelar</Button>
                        <Button type="submit" form="add-training-form">Salvar</Button>
                    </DialogFooter>
                </DialogContent>
            </Dialog>
        </CardTitle>
        <CardDescription>
          Gerencie e acompanhe os treinamentos obrigatórios e realizados pelos colaboradores.
        </CardDescription>
      </CardHeader>
      <CardContent>
        {trainings.length > 0 ? (
            <Table>
                <TableHeader>
                    <TableRow>
                        <TableHead>Treinamento</TableHead>
                        <TableHead>Data</TableHead>
                        <TableHead>Participantes</TableHead>
                        <TableHead>Status</TableHead>
                        <TableHead>Próximo Vencimento</TableHead>
                        <TableHead><span className="sr-only">Ações</span></TableHead>
                    </TableRow>
                </TableHeader>
                <TableBody>
                    {trainings.map(training => (
                        <TableRow key={training.id}>
                            <TableCell className="font-medium">{training.name}</TableCell>
                            <TableCell>{training.date}</TableCell>
                            <TableCell>{training.participants}</TableCell>
                            <TableCell>
                                <Badge variant={training.status === 'Realizado' ? 'secondary' : 'default'}>{training.status}</Badge>
                            </TableCell>
                            <TableCell>{training.nextDueDate}</TableCell>
                            <TableCell className="text-right">
                                <DropdownMenu>
                                    <DropdownMenuTrigger asChild>
                                        <Button size="icon" variant="ghost"><MoreHorizontal className="h-4 w-4" /></Button>
                                    </DropdownMenuTrigger>
                                    <DropdownMenuContent>
                                        <DropdownMenuLabel>Ações</DropdownMenuLabel>
                                        <DropdownMenuItem>Ver Lista de Presença</DropdownMenuItem>
                                        <DropdownMenuItem>Anexar Certificados</DropdownMenuItem>
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
                    Nenhum treinamento agendado
                    </h3>
                    <p className="text-sm text-muted-foreground">
                    Comece agendando o primeiro treinamento para este cliente.
                    </p>
                    <Button className="mt-4" onClick={() => setIsDialogOpen(true)}>Agendar Treinamento</Button>
                </div>
            </div>
        )}
      </CardContent>
    </Card>
  );
}
