'use client';

import { useState } from 'react';
import {
  File,
  ListFilter,
  MoreHorizontal,
  PlusCircle,
} from 'lucide-react';
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

const initialClientsData = [
  {
    name: 'Innovate Inc.',
    contractId: 'CTR-2024-001',
    status: 'Ativo',
    contact: 'liam.johnson@innovate.com',
    plan: 'Enterprise',
  },
  {
    name: 'Solutions Co.',
    contractId: 'CTR-2024-002',
    status: 'Ativo',
    contact: 'olivia.smith@solutions.com',
    plan: 'Pro',
  },
  {
    name: 'Quantum Dynamics',
    contractId: 'CTR-2023-015',
    status: 'Integração',
    contact: 'noah.williams@quantum.com',
    plan: 'Enterprise',
  },
  {
    name: 'Stellar Tech',
    contractId: 'CTR-2024-004',
    status: 'Ativo',
    contact: 'emma.brown@stellar.com',
    plan: 'Pro',
  },
  {
    name: 'Apex Innovations',
    contractId: 'CTR-2022-008',
    status: 'Inativo',
    contact: 'ava.jones@apex.com',
    plan: 'Básico',
  },
];

type Client = typeof initialClientsData[0];

export default function ClientsPage() {
  const [clientsData, setClientsData] = useState(initialClientsData);
  const [isDialogOpen, setIsDialogOpen] = useState(false);

  const handleAddClient = (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    const formData = new FormData(event.currentTarget);
    const newClient: Client = {
      name: formData.get('name') as string,
      contact: formData.get('contact') as string,
      plan: formData.get('plan') as string,
      status: formData.get('status') as string,
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
            <DialogContent className="sm:max-w-[425px]">
              <DialogHeader>
                <DialogTitle>Adicionar Novo Cliente</DialogTitle>
                <DialogDescription>
                  Preencha os detalhes abaixo para adicionar um novo cliente.
                </DialogDescription>
              </DialogHeader>
              <form id="add-client-form" onSubmit={handleAddClient}>
                <div className="grid gap-4 py-4">
                  <div className="grid grid-cols-4 items-center gap-4">
                    <Label htmlFor="name" className="text-right">
                      Empresa
                    </Label>
                    <Input id="name" name="name" className="col-span-3" required />
                  </div>
                  <div className="grid grid-cols-4 items-center gap-4">
                    <Label htmlFor="contact" className="text-right">
                      Email
                    </Label>
                    <Input id="contact" name="contact" type="email" className="col-span-3" required/>
                  </div>
                  <div className="grid grid-cols-4 items-center gap-4">
                    <Label htmlFor="plan" className="text-right">
                      Plano
                    </Label>
                     <Select name="plan" defaultValue="Pro">
                        <SelectTrigger className="col-span-3">
                          <SelectValue placeholder="Selecione um plano" />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="Enterprise">Enterprise</SelectItem>
                          <SelectItem value="Pro">Pro</SelectItem>
                          <SelectItem value="Básico">Básico</SelectItem>
                        </SelectContent>
                      </Select>
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
                    Plano
                  </TableHead>
                  <TableHead className="hidden md:table-cell">
                    ID do Contrato
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
                      {client.name}
                      <div className="text-sm text-muted-foreground md:hidden">{client.contact}</div>
                    </TableCell>
                    <TableCell>
                      <Badge variant={client.status === 'Ativo' ? 'secondary' : client.status === 'Integração' ? 'default' : 'outline'}>
                        {client.status}
                      </Badge>
                    </TableCell>
                    <TableCell className="hidden md:table-cell">
                      {client.plan}
                    </TableCell>
                    <TableCell className="hidden md:table-cell">
                      {client.contractId}
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
