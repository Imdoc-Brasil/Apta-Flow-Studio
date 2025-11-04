
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
import { MoreHorizontal, PlusCircle } from 'lucide-react';
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuLabel, DropdownMenuTrigger } from '@/components/ui/dropdown-menu';


const initialRolesData = [
    { id: 'ROLE-001', name: 'Analista Administrativo', description: 'Executa tarefas administrativas e de suporte.' },
    { id: 'ROLE-002', name: 'Operador de Máquinas', description: 'Opera equipamentos na linha de produção.' },
    { id: 'ROLE-003', name: 'Auxiliar de Logística', description: 'Auxilia no recebimento e expedição de materiais.' },
];

type Role = typeof initialRolesData[0];

export default function RolesPage() {
    const [roles, setRoles] = useState(initialRolesData);
    const [isDialogOpen, setIsDialogOpen] = useState(false);

    const handleAddRole = (event: React.FormEvent<HTMLFormElement>) => {
        event.preventDefault();
        const formData = new FormData(event.currentTarget);
        const newRole: Role = {
            id: `ROLE-${Math.random().toString(36).substring(2, 5).toUpperCase()}`,
            name: formData.get('name') as string,
            description: formData.get('description') as string,
        };
        setRoles(prev => [newRole, ...prev]);
        setIsDialogOpen(false);
        (event.target as HTMLFormElement).reset();
    }

  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center justify-between">
          Cargos
            <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
                <DialogTrigger asChild>
                    <Button size="sm" className="h-8 gap-1">
                        <PlusCircle className="h-3.5 w-3.5" />
                        <span className="sr-only sm:not-sr-only sm:whitespace-nowrap">
                        Adicionar Cargo
                        </span>
                    </Button>
                </DialogTrigger>
                <DialogContent>
                    <DialogHeader>
                        <DialogTitle>Adicionar Novo Cargo</DialogTitle>
                        <DialogDescription>Preencha os detalhes do novo cargo ou função.</DialogDescription>
                    </DialogHeader>
                     <form id="add-role-form" onSubmit={handleAddRole}>
                        <div className="grid gap-4 py-4">
                            <div className="grid grid-cols-4 items-center gap-4">
                                <Label htmlFor="name" className="text-right">Nome</Label>
                                <Input id="name" name="name" className="col-span-3" required/>
                            </div>
                            <div className="grid grid-cols-4 items-center gap-4">
                                <Label htmlFor="description" className="text-right">Descrição</Label>
                                <Textarea id="description" name="description" className="col-span-3" required/>
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
          Gerencie os cargos e funções existentes nos setores do cliente.
        </CardDescription>
      </CardHeader>
      <CardContent>
        {roles.length > 0 ? (
            <Table>
                <TableHeader>
                    <TableRow>
                        <TableHead>Nome do Cargo</TableHead>
                        <TableHead>Descrição</TableHead>
                        <TableHead><span className="sr-only">Ações</span></TableHead>
                    </TableRow>
                </TableHeader>
                <TableBody>
                    {roles.map(role => (
                        <TableRow key={role.id}>
                            <TableCell className="font-medium">{role.name}</TableCell>
                            <TableCell>{role.description}</TableCell>
                            <TableCell className="text-right">
                                <DropdownMenu>
                                    <DropdownMenuTrigger asChild>
                                        <Button size="icon" variant="ghost"><MoreHorizontal className="h-4 w-4" /></Button>
                                    </DropdownMenuTrigger>
                                    <DropdownMenuContent>
                                        <DropdownMenuLabel>Ações</DropdownMenuLabel>
                                        <DropdownMenuItem>Editar</DropdownMenuItem>
                                        <DropdownMenuItem className="text-destructive">Excluir</DropdownMenuItem>
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
                    Nenhum cargo cadastrado
                    </h3>
                    <p className="text-sm text-muted-foreground">
                    Comece adicionando o primeiro cargo para este cliente.
                    </p>
                    <Button className="mt-4" onClick={() => setIsDialogOpen(true)}>Adicionar Cargo</Button>
                </div>
            </div>
        )}
      </CardContent>
    </Card>
  );
}
