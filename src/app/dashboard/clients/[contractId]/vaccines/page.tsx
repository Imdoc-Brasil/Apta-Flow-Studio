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

const initialVaccines = [
    { id: 'VAC-001', collaborator: 'João da Silva', vaccine: 'Hepatite B', dose: '3ª Dose', date: '2024-02-20' },
    { id: 'VAC-002', collaborator: 'Maria Oliveira', vaccine: 'Tétano', dose: 'Reforço', date: '2023-12-10' },
];

type VaccineRecord = typeof initialVaccines[0];

const mockCollaborators = ['João da Silva', 'Maria Oliveira', 'Carlos Pereira'];

export default function VaccinesPage() {
    const [vaccines, setVaccines] = useState(initialVaccines);
    const [isDialogOpen, setIsDialogOpen] = useState(false);

    const handleAddVaccine = (event: React.FormEvent<HTMLFormElement>) => {
        event.preventDefault();
        const formData = new FormData(event.currentTarget);
        const newRecord: VaccineRecord = {
            id: `VAC-${Math.random().toString(36).substr(2, 4).toUpperCase()}`,
            collaborator: formData.get('collaborator') as string,
            vaccine: formData.get('vaccine') as string,
            dose: formData.get('dose') as string,
            date: formData.get('date') as string,
        };
        setVaccines(prev => [newRecord, ...prev]);
        setIsDialogOpen(false);
    }

  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center justify-between">
          Gestão de Vacinas
            <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
                <DialogTrigger asChild>
                    <Button size="sm" className="h-8 gap-1">
                        <PlusCircle className="h-3.5 w-3.5" />
                        <span className="sr-only sm:not-sr-only sm:whitespace-nowrap">
                        Registrar Vacina
                        </span>
                    </Button>
                </DialogTrigger>
                <DialogContent>
                    <DialogHeader>
                        <DialogTitle>Registrar Dose de Vacina</DialogTitle>
                        <DialogDescription>
                            Adicione um novo registro de vacina aplicada a um colaborador.
                        </DialogDescription>
                    </DialogHeader>
                    <form id="add-vaccine-form" onSubmit={handleAddVaccine}>
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
                                <Label htmlFor="vaccine" className="text-right">Vacina</Label>
                                <Input id="vaccine" name="vaccine" placeholder="Ex: Tétano" className="col-span-3" required/>
                            </div>
                             <div className="grid grid-cols-4 items-center gap-4">
                                <Label htmlFor="dose" className="text-right">Dose</Label>
                                <Input id="dose" name="dose" placeholder="Ex: 1ª Dose, Reforço" className="col-span-3" required/>
                            </div>
                            <div className="grid grid-cols-4 items-center gap-4">
                                <Label htmlFor="date" className="text-right">Data</Label>
                                <Input id="date" name="date" type="date" className="col-span-3" required/>
                            </div>
                        </div>
                    </form>
                    <DialogFooter>
                        <Button variant="outline" onClick={() => setIsDialogOpen(false)}>Cancelar</Button>
                        <Button type="submit" form="add-vaccine-form">Salvar</Button>
                    </DialogFooter>
                </DialogContent>
            </Dialog>
        </CardTitle>
        <CardDescription>
          Controle o calendário vacinal dos colaboradores conforme exigido pelo PCMSO.
        </CardDescription>
      </CardHeader>
      <CardContent>
         {vaccines.length > 0 ? (
            <Table>
                <TableHeader>
                    <TableRow>
                        <TableHead>Colaborador</TableHead>
                        <TableHead>Vacina</TableHead>
                        <TableHead>Dose</TableHead>
                        <TableHead>Data de Aplicação</TableHead>
                        <TableHead><span className="sr-only">Ações</span></TableHead>
                    </TableRow>
                </TableHeader>
                <TableBody>
                    {vaccines.map(record => (
                        <TableRow key={record.id}>
                            <TableCell className="font-medium">{record.collaborator}</TableCell>
                            <TableCell>{record.vaccine}</TableCell>
                            <TableCell><Badge variant="outline">{record.dose}</Badge></TableCell>
                            <TableCell>{record.date}</TableCell>
                            <TableCell className="text-right">
                                <DropdownMenu>
                                    <DropdownMenuTrigger asChild>
                                        <Button size="icon" variant="ghost"><MoreHorizontal className="h-4 w-4" /></Button>
                                    </DropdownMenuTrigger>
                                    <DropdownMenuContent>
                                        <DropdownMenuItem>Ver Comprovante</DropdownMenuItem>
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
                    Nenhum registro de vacina
                    </h3>
                    <p className="text-sm text-muted-foreground">
                    Comece registrando a primeira dose de vacina aplicada.
                    </p>
                    <Button className="mt-4" onClick={() => setIsDialogOpen(true)}>Registrar Vacina</Button>
                </div>
            </div>
        )}
      </CardContent>
    </Card>
  );
}
