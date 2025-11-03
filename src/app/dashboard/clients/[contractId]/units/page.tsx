
'use client';

import { useState, useEffect, useMemo } from 'react';
import { useParams } from 'next/navigation';
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { MoreHorizontal, PlusCircle, Search } from 'lucide-react';
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle, DialogTrigger, DialogFooter } from '@/components/ui/dialog';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { Badge } from '@/components/ui/badge';
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuLabel, DropdownMenuTrigger, DropdownMenuCheckboxItem } from '@/components/ui/dropdown-menu';
import { initialClientsData } from '@/app/dashboard/clients/page';
import { Checkbox } from '@/components/ui/checkbox';
import { Textarea } from '@/components/ui/textarea';

const initialUnitsData = [
  {
    id: 'UNIT-001',
    name: 'Matriz São Paulo',
    description: 'Sede administrativa e operações centrais.',
    cnpj: '12.345.678/0001-99',
    address: '123 Tech Avenue, Silicon Valley, CA',
    status: 'Ativa',
    cnae: '62.01-5-01',
    riskLevel: '3'
  },
  {
    id: 'UNIT-002',
    name: 'Filial Rio de Janeiro',
    description: 'Foco em vendas e suporte ao cliente regional.',
    cnpj: '12.345.678/0002-88',
    address: '456 Ocean Drive, Rio de Janeiro, RJ',
    status: 'Ativa',
    cnae: '62.01-5-01',
    riskLevel: '3'
  },
];

type Unit = typeof initialUnitsData[0];

const getClientById = (contractId: string) => {
    return initialClientsData.find((client) => client.contractId === contractId);
};

export default function UnitsPage() {
    const params = useParams();
    const contractId = params.contractId as string;
    const client = getClientById(contractId);

    const [units, setUnits] = useState(initialUnitsData);
    const [isDialogOpen, setIsDialogOpen] = useState(false);
    const [inheritData, setInheritData] = useState(false);
    const [searchTerm, setSearchTerm] = useState('');
    const [statusFilter, setStatusFilter] = useState<string[]>(['Ativa']);

    // Form state
    const [name, setName] = useState('');
    const [description, setDescription] = useState('');
    const [cnpj, setCnpj] = useState('');
    const [address, setAddress] = useState('');
    const [cnae, setCnae] = useState('');
    const [riskLevel, setRiskLevel] = useState('');

    useEffect(() => {
        if (client) {
            if (inheritData) {
                setName(client.name);
                setDescription(''); // Description is specific to the unit
                setCnpj(client.cnpj);
                setAddress(client.address);
                setCnae(client.cnae);
                setRiskLevel(client.riskLevel);
            } else {
                setName('');
                setDescription('');
                setCnpj('');
                setAddress('');
                setCnae('');
                setRiskLevel('');
            }
        }
    }, [inheritData, client]);


    const handleAddUnit = (event: React.FormEvent<HTMLFormElement>) => {
        event.preventDefault();
        const newUnit: Unit = {
            id: `UNIT-${Math.floor(Math.random() * 1000).toString().padStart(3, '0')}`,
            name,
            description,
            cnpj,
            address,
            cnae,
            riskLevel,
            status: 'Ativa',
        };
        setUnits(prev => [...prev, newUnit]);
        setIsDialogOpen(false);
        setInheritData(false); // Reset checkbox
    }

    const filteredUnits = useMemo(() => {
        return units.filter(unit => {
            const matchesSearch = unit.name.toLowerCase().includes(searchTerm.toLowerCase());
            const matchesStatus = statusFilter.length === 0 || statusFilter.includes(unit.status);
            return matchesSearch && matchesStatus;
        });
    }, [units, searchTerm, statusFilter]);

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
                            <div className="flex items-center space-x-2 mb-4">
                                <Checkbox id="inherit" checked={inheritData} onCheckedChange={(checked) => setInheritData(checked as boolean)} />
                                <Label htmlFor="inherit" className="cursor-pointer">Herdar dados da empresa principal</Label>
                            </div>
                            <div className="grid grid-cols-4 items-center gap-4">
                                <Label htmlFor="name" className="text-right">Nome</Label>
                                <Input id="name" value={name} onChange={(e) => setName(e.target.value)} className="col-span-3" required disabled={inheritData} />
                            </div>
                             <div className="grid grid-cols-4 items-center gap-4">
                                <Label htmlFor="description" className="text-right">Descrição</Label>
                                <Textarea id="description" value={description} onChange={(e) => setDescription(e.target.value)} className="col-span-3" />
                            </div>
                             <div className="grid grid-cols-4 items-center gap-4">
                                <Label htmlFor="cnpj" className="text-right">CNPJ</Label>
                                <Input id="cnpj" value={cnpj} onChange={(e) => setCnpj(e.target.value)} className="col-span-3" disabled={inheritData} />
                            </div>
                            <div className="grid grid-cols-4 items-center gap-4">
                                <Label htmlFor="address" className="text-right">Endereço</Label>
                                <Input id="address" value={address} onChange={(e) => setAddress(e.target.value)} className="col-span-3" required disabled={inheritData} />
                            </div>
                             <div className="grid grid-cols-4 items-center gap-4">
                                <Label htmlFor="cnae" className="text-right">CNAE</Label>
                                <Input id="cnae" value={cnae} onChange={(e) => setCnae(e.target.value)} className="col-span-3" disabled={inheritData} />
                            </div>
                             <div className="grid grid-cols-4 items-center gap-4">
                                <Label htmlFor="riskLevel" className="text-right">Grau de Risco</Label>
                                <Input id="riskLevel" value={riskLevel} onChange={(e) => setRiskLevel(e.target.value)} className="col-span-3" disabled={inheritData} />
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
        <div className="flex items-center gap-2 pt-4">
          <div className="relative w-full">
            <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground" />
            <Input
              type="search"
              placeholder="Buscar por nome..."
              className="pl-8 sm:w-1/2 md:w-1/3"
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
            />
          </div>
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button variant="outline" size="sm" className="h-10 gap-1 text-sm">
                <Filter className="h-3.5 w-3.5" />
                <span>Status ({statusFilter.length})</span>
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="end">
              <DropdownMenuLabel>Filtrar por Status</DropdownMenuLabel>
              <DropdownMenuSeparator />
              <DropdownMenuCheckboxItem
                checked={statusFilter.includes('Ativa')}
                onCheckedChange={(checked) => {
                  setStatusFilter(prev => checked ? [...prev, 'Ativa'] : prev.filter(s => s !== 'Ativa'));
                }}
              >
                Ativa
              </DropdownMenuCheckboxItem>
               <DropdownMenuCheckboxItem
                checked={statusFilter.includes('Inativa')}
                onCheckedChange={(checked) => {
                  setStatusFilter(prev => checked ? [...prev, 'Inativa'] : prev.filter(s => s !== 'Inativa'));
                }}
              >
                Inativa
              </DropdownMenuCheckboxItem>
            </DropdownMenuContent>
          </DropdownMenu>
        </div>
      </CardHeader>
      <CardContent>
        {filteredUnits.length > 0 ? (
           <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Nome</TableHead>
                <TableHead className="hidden sm:table-cell">Descrição</TableHead>
                <TableHead className="hidden md:table-cell">Endereço</TableHead>
                <TableHead>Status</TableHead>
                <TableHead><span className="sr-only">Ações</span></TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {filteredUnits.map((unit) => (
                <TableRow key={unit.id}>
                  <TableCell className="font-medium">{unit.name}</TableCell>
                  <TableCell className="hidden sm:table-cell">{unit.description}</TableCell>
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
                    Nenhuma unidade encontrada
                    </h3>
                    <p className="text-sm text-muted-foreground">
                     Ajuste seus filtros ou adicione uma nova unidade.
                    </p>
                    <Button className="mt-4" onClick={() => setIsDialogOpen(true)}>Adicionar Unidade</Button>
                </div>
            </div>
        )}
      </CardContent>
    </Card>
  );
}

    