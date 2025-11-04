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

const initialEpcData = [
    { id: 'EPC-CLI-01', name: 'Sistema de Ventilação Local Exaustora', installationDate: '2023-01-20', status: 'Ativo' },
    { id: 'EPC-CLI-02', name: 'Guarda-corpo e Rodapé', installationDate: '2022-11-15', status: 'Ativo' },
    { id: 'EPC-CLI-03', name: 'Isolamento Acústico da Sala de Compressores', installationDate: '2023-05-10', status: 'Manutenção Pendente' },
];

type Epc = typeof initialEpcData[0];

export default function EpcPage() {
    const [epcs, setEpcs] = useState(initialEpcData);
    const [isDialogOpen, setIsDialogOpen] = useState(false);

    const handleAddEpc = (event: React.FormEvent<HTMLFormElement>) => {
        event.preventDefault();
        const formData = new FormData(event.currentTarget);
        const newEpc: Epc = {
            id: `EPC-CLI-${Math.random().toString(36).substr(2, 4).toUpperCase()}`,
            name: formData.get('name') as string,
            installationDate: formData.get('installationDate') as string,
            status: 'Ativo'
        };
        setEpcs(prev => [newEpc, ...prev]);
        setIsDialogOpen(false);
    }

  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center justify-between">
          Gestão de EPCs (Equipamentos de Proteção Coletiva)
           <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
                <DialogTrigger asChild>
                    <Button size="sm" className="h-8 gap-1">
                        <PlusCircle className="h-3.5 w-3.5" />
                        <span className="sr-only sm:not-sr-only sm:whitespace-nowrap">
                        Adicionar EPC
                        </span>
                    </Button>
                </DialogTrigger>
                <DialogContent>
                    <DialogHeader>
                        <DialogTitle>Adicionar Novo EPC</DialogTitle>
                        <DialogDescription>
                            Registre um novo Equipamento de Proteção Coletiva instalado na unidade.
                        </DialogDescription>
                    </DialogHeader>
                    <form id="add-epc-form" onSubmit={handleAddEpc}>
                        <div className="grid gap-4 py-4">
                             <div className="grid grid-cols-4 items-center gap-4">
                                <Label htmlFor="name" className="text-right">Nome do EPC</Label>
                                <Input id="name" name="name" className="col-span-3" required/>
                            </div>
                            <div className="grid grid-cols-4 items-center gap-4">
                                <Label htmlFor="installationDate" className="text-right">Data de Instalação</Label>
                                <Input id="installationDate" name="installationDate" type="date" className="col-span-3" required/>
                            </div>
                        </div>
                    </form>
                    <DialogFooter>
                        <Button variant="outline" onClick={() => setIsDialogOpen(false)}>Cancelar</Button>
                        <Button type="submit" form="add-epc-form">Salvar</Button>
                    </DialogFooter>
                </DialogContent>
            </Dialog>
        </CardTitle>
        <CardDescription>
          Gerencie os Equipamentos de Proteção Coletiva (EPCs) instalados nas unidades do cliente.
        </CardDescription>
      </CardHeader>
      <CardContent>
        {epcs.length > 0 ? (
            <Table>
                <TableHeader>
                    <TableRow>
                        <TableHead>Equipamento</TableHead>
                        <TableHead>Data de Instalação</TableHead>
                        <TableHead>Status</TableHead>
                        <TableHead><span className="sr-only">Ações</span></TableHead>
                    </TableRow>
                </TableHeader>
                <TableBody>
                    {epcs.map(epc => (
                        <TableRow key={epc.id}>
                            <TableCell className="font-medium">{epc.name}</TableCell>
                            <TableCell>{epc.installationDate}</TableCell>
                            <TableCell>
                                <Badge variant={epc.status === 'Ativo' ? 'secondary' : 'default'}>{epc.status}</Badge>
                            </TableCell>
                            <TableCell className="text-right">
                                <DropdownMenu>
                                    <DropdownMenuTrigger asChild>
                                        <Button size="icon" variant="ghost"><MoreHorizontal className="h-4 w-4" /></Button>
                                    </DropdownMenuTrigger>
                                    <DropdownMenuContent>
                                        <DropdownMenuLabel>Ações</DropdownMenuLabel>
                                        <DropdownMenuItem>Registrar Manutenção</DropdownMenuItem>
                                        <DropdownMenuItem>Editar</DropdownMenuItem>
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
                    Nenhum EPC cadastrado
                    </h3>
                    <p className="text-sm text-muted-foreground">
                    Comece adicionando o primeiro equipamento de proteção coletiva.
                    </p>
                    <Button className="mt-4" onClick={() => setIsDialogOpen(true)}>Adicionar EPC</Button>
                </div>
            </div>
        )}
      </CardContent>
    </Card>
  );
}
