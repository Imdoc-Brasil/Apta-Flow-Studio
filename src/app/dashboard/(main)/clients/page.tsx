'use client';

import { useState } from 'react';
import {
  File,
  ListFilter,
  MoreHorizontal,
  PlusCircle,
} from 'lucide-react';
import Link from 'next/link';
import { Badge } from '@/components/ui/badge';
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from '@/components/ui/card';
import {
  DropdownMenu,
  DropdownMenuCheckboxItem,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table';
import { Button } from '@/components/ui/button';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
  DialogFooter,
} from '@/components/ui/dialog';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import { ScrollArea } from '@/components/ui/scroll-area';

export const initialClientsData = [
  {
    name: 'Innovate Inc.',
    contractId: 'CTR-2024-001',
    status: 'Ativo',
    contact: 'liam.johnson@innovate.com',
    cnpj: '12.345.678/0001-99',
    cnae: '62.01-5-01',
    riskLevel: '3',
    address: '123 Tech Avenue, Silicon Valley, CA',
    responsibleName: 'Liam Johnson',
    responsibleContact: '555-1234',
  },
  {
    name: 'Solutions Co.',
    contractId: 'CTR-2024-002',
    status: 'Ativo',
    contact: 'olivia.smith@solutions.com',
    cnpj: '98.765.432/0001-11',
    cnae: '70.20-4-00',
    riskLevel: '2',
    address: '456 Business Blvd, New York, NY',
    responsibleName: 'Olivia Smith',
    responsibleContact: '555-5678',
  },
  {
    name: 'Quantum Dynamics',
    contractId: 'CTR-2023-015',
    status: 'Integração',
    contact: 'noah.williams@quantum.com',
    cnpj: '11.222.333/0001-44',
    cnae: '62.03-1-00',
    riskLevel: '3',
    address: '789 Innovation Drive, Boston, MA',
    responsibleName: 'Noah Williams',
    responsibleContact: '555-9012',
  },
  {
    name: 'Stellar Tech',
    contractId: 'CTR-2024-004',
    status: 'Ativo',
    contact: 'emma.brown@stellar.com',
    cnpj: '44.555.666/0001-77',
    cnae: '62.09-1-00',
    riskLevel: '2',
    address: '321 Galaxy Way, Seattle, WA',
    responsibleName: 'Emma Brown',
    responsibleContact: '555-3456',
  },
  {
    name: 'Apex Innovations',
    contractId: 'CTR-2022-008',
    status: 'Inativo',
    contact: 'ava.jones@apex.com',
    cnpj: '77.888.999/0001-00',
    cnae: '71.12-0-00',
    riskLevel: '4',
    address: '654 Peak Circle, Denver, CO',
    responsibleName: 'Ava Jones',
    responsibleContact: '555-7890',
  },
];

type Client = Omit<typeof initialClientsData[0], 'plan'>;

export default function ClientsPage() {
  const [clientsData, setClientsData] = useState(initialClientsData);
  const [isDialogOpen, setIsDialogOpen] = useState(false);

  const handleAddClient = (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    const formData = new FormData(event.currentTarget);
    const newClient: Client = {
      name: formData.get('name') as string,
      contact: formData.get('contact') as string,
      status: formData.get('status') as string,
      cnpj: formData.get('cnpj') as string,
      cnae: formData.get('cnae') as string,
      riskLevel: formData.get('riskLevel') as string,
      address: formData.get('address') as string,
      responsibleName: formData.get('responsibleName') as string,
      responsibleContact: formData.get('responsibleContact') as string,
      contractId: `CTR-${new Date().getFullYear()}-${Math.floor(Math.random() * 1000).toString().padStart(3, '0')}`,
    };
    setClientsData((prev) => [newClient, ...prev]);
    setIsDialogOpen(false);
  };

  return (
    <Tabs defaultValue="all">
      <div className="flex items-center">
        <TabsList>
          <TabsTrigger value="all">Todos</TabsTrigger>
          <TabsTrigger value="active">Ativo</TabsTrigger>
          <TabsTrigger value="onboarding">Integração</TabsTrigger>
          <TabsTrigger value="inactive" className="hidden sm:flex">
            Inativo
          </TabsTrigger>
        </TabsList>
        <div className="ml-auto flex items-center gap-2">
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button variant="outline" size="sm" className="h-8 gap-1">
                <ListFilter className="h-3.5 w-3.5" />
                <span className="sr-only sm:not-sr-only sm:whitespace-nowrap">
                  Filtrar
                </span>
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="end">
              <DropdownMenuLabel>Filtrar por</DropdownMenuLabel>
              <DropdownMenuSeparator />
              <DropdownMenuCheckboxItem checked>
                Ativo
              </DropdownMenuCheckboxItem>
              <DropdownMenuCheckboxItem>Integração</DropdownMenuCheckboxItem>
              <DropdownMenuCheckboxItem>Inativo</DropdownMenuCheckboxItem>
            </DropdownMenuContent>
          </DropdownMenu>
          <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
            <DialogTrigger asChild>
              <Button size="sm" className="h-8 gap-1">
                <PlusCircle className="h-3.5 w-3.5" />
                <span className="sr-only sm:not-sr-only sm:whitespace-nowrap">
                  Adicionar Cliente
                </span>
              </Button>
            </DialogTrigger>
            <DialogContent className="sm:max-w-md">
              <DialogHeader>
                <DialogTitle>Adicionar Novo Cliente</DialogTitle>
                <DialogDescription>
                  Preencha os detalhes abaixo para adicionar um novo cliente.
                </DialogDescription>
              </DialogHeader>
               <form id="add-client-form" onSubmit={handleAddClient}>
                <ScrollArea className="h-96 w-full">
                    <div className="grid gap-4 py-4 px-6">
                      <div className="grid grid-cols-4 items-center gap-4">
                        <Label htmlFor="name" className="text-right">
                          Empresa
                        </Label>
                        <Input id="name" name="name" className="col-span-3" required />
                      </div>
                      <div className="grid grid-cols-4 items-center gap-4">
                        <Label htmlFor="cnpj" className="text-right">
                          CNPJ
                        </Label>
                        <Input id="cnpj" name="cnpj" className="col-span-3" required />
                      </div>
                      <div className="grid grid-cols-4 items-center gap-4">
                        <Label htmlFor="contact" className="text-right">
                          Email
                        </Label>
                        <Input id="contact" name="contact" type="email" className="col-span-3" required/>
                      </div>
                      <div className="grid grid-cols-4 items-center gap-4">
                        <Label htmlFor="address" className="text-right">
                          Endereço
                        </Label>
                        <Input id="address" name="address" className="col-span-3" />
                      </div>
                       <div className="grid grid-cols-4 items-center gap-4">
                        <Label htmlFor="responsibleName" className="text-right">
                          Responsável
                        </Label>
                        <Input id="responsibleName" name="responsibleName" className="col-span-3" required />
                      </div>
                      <div className="grid grid-cols-4 items-center gap-4">
                        <Label htmlFor="responsibleContact" className="text-right">
                          Contato
                        </Label>
                        <Input id="responsibleContact" name="responsibleContact" className="col-span-3" />
                      </div>
                       <div className="grid grid-cols-4 items-center gap-4">
                        <Label htmlFor="cnae" className="text-right">
                          CNAE
                        </Label>
                        <Input id="cnae" name="cnae" className="col-span-3" />
                      </div>
                      <div className="grid grid-cols-4 items-center gap-4">
                        <Label htmlFor="riskLevel" className="text-right">
                          Grau de Risco
                        </Label>
                        <Input id="riskLevel" name="riskLevel" className="col-span-3" />
                      </div>
                      <div className="grid grid-cols-4 items-center gap-4">
                        <Label htmlFor="status" className="text-right">
                          Status
                        </Label>
                        <Select name="status" defaultValue="Integração">
                            <SelectTrigger className="col-span-3">
                              <SelectValue placeholder="Selecione o status" />
                            </SelectTrigger>
                            <SelectContent>
                              <SelectItem value="Ativo">Ativo</SelectItem>
                              <SelectItem value="Integração">Integração</SelectItem>
                              <SelectItem value="Inativo">Inativo</SelectItem>
                            </SelectContent>
                          </Select>
                      </div>
                    </div>
                </ScrollArea>
              </form>
               <DialogFooter>
                <Button type="submit" form="add-client-form">
                  Salvar Cliente
                </Button>
              </DialogFooter>
            </DialogContent>
          </Dialog>
        </div>
      </div>
      <TabsContent value="all">
        <Card>
          <CardHeader>
            <CardTitle>Clientes</CardTitle>
            <CardDescription>
              Gerencie seus clientes e seus contratos de serviço.
            </CardDescription>
          </CardHeader>
          <CardContent>
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Empresa</TableHead>
                  <TableHead>Status</TableHead>
                  <TableHead className="hidden md:table-cell">
                    Responsável
                  </TableHead>
                  <TableHead className="hidden lg:table-cell">
                    CNPJ
                  </TableHead>
                  <TableHead>
                    <span className="sr-only">Ações</span>
                  </TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {clientsData.map((client) => (
                  <TableRow key={client.contractId}>
                    <TableCell className="font-medium">
                      <Link href={`/dashboard/clients/${client.contractId}`} className="hover:underline">
                        {client.name}
                      </Link>
                      <div className="text-sm text-muted-foreground md:hidden">{client.contact}</div>
                    </TableCell>
                    <TableCell>
                      <Badge variant={client.status === 'Ativo' ? 'secondary' : client.status === 'Integração' ? 'default' : 'outline'}>
                        {client.status}
                      </Badge>
                    </TableCell>
                     <TableCell className="hidden md:table-cell">
                      {client.responsibleName}
                    </TableCell>
                    <TableCell className="hidden lg:table-cell">
                      {client.cnpj}
                    </TableCell>
                    <TableCell>
                      <DropdownMenu>
                        <DropdownMenuTrigger asChild>
                          <Button
                            aria-haspopup="true"
                            size="icon"
                            variant="ghost"
                          >
                            <MoreHorizontal className="h-4 w-4" />
                            <span className="sr-only">Alternar menu</span>
                          </Button>
                        </DropdownMenuTrigger>
                        <DropdownMenuContent align="end">
                          <DropdownMenuLabel>Ações</DropdownMenuLabel>
                           <DropdownMenuItem asChild>
                             <Link href={`/dashboard/clients/${client.contractId}`}>Ver Detalhes</Link>
                           </DropdownMenuItem>
                          <DropdownMenuItem>Editar</DropdownMenuItem>
                          <DropdownMenuItem>Ver Contratos</DropdownMenuItem>
                          <DropdownMenuSeparator />
                          <DropdownMenuItem className="text-destructive">
                            Excluir
                          </DropdownMenuItem>
                        </DropdownMenuContent>
                      </DropdownMenu>
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </CardContent>
          <CardFooter>
            <div className="text-xs text-muted-foreground">
              Mostrando <strong>1-{clientsData.length}</strong> de <strong>{clientsData.length}</strong> clientes
            </div>
          </CardFooter>
        </Card>
      </TabsContent>
    </Tabs>
  );
}
