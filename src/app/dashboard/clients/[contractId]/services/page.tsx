
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
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { Badge } from '@/components/ui/badge';
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';

const initialServicesData = [
    { id: 'SERV-001', name: 'PCMSO', category: 'Programa de SST', status: 'Ativo', renewalDate: '2025-03-15' },
    { id: 'SERV-002', name: 'PGR', category: 'Programa de SST', status: 'Ativo', renewalDate: '2026-03-15' },
    { id: 'SERV-003', name: 'Assessoria Técnica', category: 'Recorrência', status: 'Ativo', renewalDate: '2025-01-01' },
];

type Service = typeof initialServicesData[0];

export default function ServicesPage() {
  const [services, setServices] = useState(initialServicesData);
  const [isDialogOpen, setIsDialogOpen] = useState(false);

  const handleAddService = (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    const formData = new FormData(event.currentTarget);
    const newService: Service = {
      id: `SERV-${(Math.random() * 1000).toFixed(0).padStart(3, '0')}`,
      name: formData.get('name') as string,
      category: formData.get('category') as string,
      renewalDate: formData.get('renewalDate') as string,
      status: 'Ativo',
    };
    setServices(prev => [newService, ...prev]);
    setIsDialogOpen(false);
  }

  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center justify-between">
          Serviços Contratados
          <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
            <DialogTrigger asChild>
                <Button size="sm" className="h-8 gap-1">
                    <PlusCircle className="h-3.5 w-3.5" />
                    <span className="sr-only sm:not-sr-only sm:whitespace-nowrap">
                    Adicionar Serviço
                    </span>
                </Button>
            </DialogTrigger>
            <DialogContent>
                <DialogHeader>
                    <DialogTitle>Adicionar Serviço ao Contrato</DialogTitle>
                    <DialogDescription>
                        Preencha as informações do novo serviço contratado pelo cliente.
                    </DialogDescription>
                </DialogHeader>
                <form id="add-service-form" onSubmit={handleAddService}>
                    <div className="grid gap-4 py-4">
                        <div className="grid grid-cols-4 items-center gap-4">
                            <Label htmlFor="name" className="text-right">Nome do Serviço</Label>
                            <Input id="name" name="name" className="col-span-3" required />
                        </div>
                         <div className="grid grid-cols-4 items-center gap-4">
                            <Label htmlFor="category" className="text-right">Categoria</Label>
                            <Select name="category" required>
                                <SelectTrigger className="col-span-3">
                                    <SelectValue placeholder="Selecione a categoria" />
                                </SelectTrigger>
                                <SelectContent>
                                    <SelectItem value="Programa de SST">Programa de SST</SelectItem>
                                    <SelectItem value="Recorrência">Recorrência</SelectItem>
                                    <SelectItem value="Exame">Exame Avulso</SelectItem>
                                    <SelectItem value="Outro">Outro</SelectItem>
                                </SelectContent>
                            </Select>
                        </div>
                        <div className="grid grid-cols-4 items-center gap-4">
                            <Label htmlFor="renewalDate" className="text-right">Data de Renovação</Label>
                            <Input id="renewalDate" name="renewalDate" type="date" className="col-span-3" required />
                        </div>
                    </div>
                </form>
                <DialogFooter>
                    <Button variant="outline" onClick={() => setIsDialogOpen(false)}>Cancelar</Button>
                    <Button type="submit" form="add-service-form">Salvar Serviço</Button>
                </DialogFooter>
            </DialogContent>
          </Dialog>
        </CardTitle>
        <CardDescription>
          Gerencie os serviços contratados por este cliente.
        </CardDescription>
      </CardHeader>
      <CardContent>
        <Table>
            <TableHeader>
                <TableRow>
                <TableHead>Serviço</TableHead>
                <TableHead>Categoria</TableHead>
                <TableHead>Status</TableHead>
                <TableHead>Data de Renovação</TableHead>
                </TableRow>
            </TableHeader>
            <TableBody>
                {services.map((item) => (
                <TableRow key={item.id}>
                    <TableCell className="font-medium">{item.name}</TableCell>
                    <TableCell>{item.category}</TableCell>
                    <TableCell><Badge variant={item.status === 'Ativo' ? 'secondary' : 'outline'}>{item.status}</Badge></TableCell>
                    <TableCell>{item.renewalDate}</TableCell>
                </TableRow>
                ))}
            </TableBody>
        </Table>
      </CardContent>
    </Card>
  );
}
