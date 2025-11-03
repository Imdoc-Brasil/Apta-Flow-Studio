
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
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle, DialogTrigger, DialogFooter } from '@/components/ui/dialog';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { Badge } from '@/components/ui/badge';
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuLabel, DropdownMenuTrigger } from '@/components/ui/dropdown-menu';

const initialUnitsData = [
  {
    id: 'UNIT-001',
    name: 'Matriz São Paulo',
    cnpj: '12.345.678/0001-99',
    address: '123 Tech Avenue, Silicon Valley, CA',
    status: 'Ativa',
  },
  {
    id: 'UNIT-002',
    name: 'Filial Rio de Janeiro',
    cnpj: '12.345.678/0002-88',
    address: '456 Ocean Drive, Rio de Janeiro, RJ',
    status: 'Ativa',
  },
];

type Unit = typeof initialUnitsData[0];

export default function UnitsPage() {
    const [units, setUnits] = useState(initialUnitsData);
    const [isDialogOpen, setIsDialogOpen] = useState(false);

    const handleAddUnit = (event: React.FormEvent<HTMLFormElement>) => {
        event.preventDefault();
        const formData = new FormData(event.currentTarget);
        const newUnit: Unit = {
            id: `UNIT-${Math.floor(Math.random() * 1000).toString().padStart(3, '0')}`,
            name: formData.get('name') as string,
            cnpj: formData.get('cnpj') as string,
            address: formData.get('address') as string,
            status: 'Ativa',
        };
        setUnits(prev => [...prev, newUnit]);
        setIsDialogOpen(false);
    }

  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center justify-between">
          Unidades
           <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
                <DialogTrigger asChild>
                    <Button size="sm" className="h-8 gap-1">
                        <PlusCircle className="h-3.5 w-3.5" />
                        <span className="sr-only sm:not-sr-only sm:whitespace-nowrap">
                        Adicionar Unidade
                        </span>
                    </Button>
                </DialogTrigger>
                <DialogContent>
                    <DialogHeader>
                        <DialogTitle>Adicionar Nova Unidade</DialogTitle>
                        <DialogDescription>
                            Preencha os detalhes da nova unidade ou local de trabalho.
                        </DialogDescription>
                    </DialogHeader>
                    <form id="add-unit-form" onSubmit={handleAddUnit}>
                        <div className="grid gap-4 py-4">
                            <div className="grid grid-cols-4 items-center gap-4">
                                <Label htmlFor="name" className="text-right">Nome</Label>
                                <Input id="name" name="name" className="col-span-3" required />
                            </div>
                             <div className="grid grid-cols-4 items-center gap-4">
                                <Label htmlFor="cnpj" className="text-right">CNPJ</Label>
                                <Input id="cnpj" name="cnpj" className="col-span-3" />
                            </div>
                            <div className="grid grid-cols-4 items-center gap-4">
                                <Label htmlFor="address" className="text-right">Endereço</Label>
                                <Input id="address" name="address" className="col-span-3" required />
                            </div>
                        </div>
                    </form>
                    <DialogFooter>
                         <Button variant="outline" onClick={() => setIsDialogOpen(false)}>Cancelar</Button>
                        <Button type="submit" form="add-unit-form">Salvar</Button>
                    </DialogFooter>
                </DialogContent>
            </Dialog>
        </CardTitle>
        <CardDescription>
          Gerencie as unidades, plantas ou locais de trabalho do cliente.
        </CardDescription>
      </CardHeader>
      <CardContent>
        {units.length > 0 ? (
           <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Nome</TableHead>
                <TableHead>CNPJ</TableHead>
                <TableHead className="hidden md:table-cell">Endereço</TableHead>
                <TableHead>Status</TableHead>
                <TableHead><span className="sr-only">Ações</span></TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {units.map((unit) => (
                <TableRow key={unit.id}>
                  <TableCell className="font-medium">{unit.name}</TableCell>
                  <TableCell>{unit.cnpj}</TableCell>
                  <TableCell className="hidden md:table-cell">{unit.address}</TableCell>
                  <TableCell>
                    <Badge variant={unit.status === 'Ativa' ? 'secondary' : 'outline'}>{unit.status}</Badge>
                  </TableCell>
                  <TableCell>
                    <DropdownMenu>
                      <DropdownMenuTrigger asChild>
                        <Button aria-haspopup="true" size="icon" variant="ghost">
                          <MoreHorizontal className="h-4 w-4" />
                          <span className="sr-only">Alternar menu</span>
                        </Button>
                      </DropdownMenuTrigger>
                      <DropdownMenuContent align="end">
                        <DropdownMenuLabel>Ações</DropdownMenuLabel>
                        <DropdownMenuItem>Editar</DropdownMenuItem>
                        <DropdownMenuItem className="text-destructive">Inativar</DropdownMenuItem>
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
                    Nenhuma unidade cadastrada
                    </h3>
                    <p className="text-sm text-muted-foreground">
                    Comece adicionando a primeira unidade para este cliente.
                    </p>
                    <Button className="mt-4" onClick={() => setIsDialogOpen(true)}>Adicionar Unidade</Button>
                </div>
            </div>
        )}
      </CardContent>
    </Card>
  );
}

