// Esta é uma página mockada. Em um cenário real, você buscaria os dados
// do cliente com base no `params.contractId` de um banco de dados.

'use client';

import {
  ArrowLeft,
  Briefcase,
  ChevronLeft,
  FileText,
  Mail,
  MapPin,
  Phone,
  User,
  Building2,
  Network,
  UserRound,
  Users
} from 'lucide-react';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { initialClientsData } from '../page';
import Link from 'next/link';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';

// Simula a busca de dados do cliente.
const getClientById = (id: string) => {
  return initialClientsData.find((client) => client.contractId === id);
};

function PlaceholderContent({ icon, title, description }: { icon: React.ReactNode, title: string, description: string }) {
    return (
        <div className="flex flex-1 items-center justify-center rounded-lg border border-dashed shadow-sm h-96 mt-4">
          <div className="flex flex-col items-center gap-2 text-center">
            {icon}
            <h3 className="text-2xl font-bold tracking-tight">
              {title}
            </h3>
            <p className="text-sm text-muted-foreground max-w-md">
              {description}
            </p>
            <Button className="mt-4">Adicionar</Button>
          </div>
        </div>
    )
}

export default function ClientDetailsPage({
  params,
}: {
  params: { contractId: string };
}) {
  const { contractId } = params;
  const client = getClientById(contractId);

  if (!client) {
    return (
      <div className="flex flex-col items-center justify-center h-full text-center">
        <h2 className="text-2xl font-bold">Cliente não encontrado</h2>
        <p className="text-muted-foreground">O cliente que você está procurando não existe.</p>
        <Button asChild className="mt-4">
          <Link href="/dashboard/clients">
            <ArrowLeft className="mr-2 h-4 w-4" />
            Voltar para Clientes
          </Link>
        </Button>
      </div>
    );
  }

  const riskLevelMap = {
      '1': { label: 'Muito Baixo', color: 'bg-green-500' },
      '2': { label: 'Baixo', color: 'bg-blue-500' },
      '3': { label: 'Médio', color: 'bg-yellow-500' },
      '4': { label: 'Alto', color: 'bg-red-500' },
  } as const;

  const riskInfo = riskLevelMap[client.riskLevel as keyof typeof riskLevelMap] || { label: 'N/A', color: 'bg-gray-400' };

  return (
    <div className="grid flex-1 auto-rows-max gap-4">
        <div className="flex items-center gap-4">
            <Button variant="outline" size="icon" className="h-7 w-7" asChild>
                <Link href="/dashboard/clients">
                    <ChevronLeft className="h-4 w-4" />
                    <span className="sr-only">Voltar</span>
                </Link>
            </Button>
            <h1 className="flex-1 shrink-0 whitespace-nowrap text-xl font-semibold tracking-tight sm:grow-0">
                {client.name}
            </h1>
            <Badge variant={client.status === 'Ativo' ? 'secondary' : 'outline'} className="ml-auto sm:ml-0">
                {client.status}
            </Badge>
        </div>
      
       <Tabs defaultValue="info">
            <TabsList className="grid w-full grid-cols-5">
                <TabsTrigger value="info">Informações Gerais</TabsTrigger>
                <TabsTrigger value="units">Unidades</TabsTrigger>
                <TabsTrigger value="sectors">Setores</TabsTrigger>
                <TabsTrigger value="roles">Cargos</TabsTrigger>
                <TabsTrigger value="employees">Colaboradores</TabsTrigger>
            </TabsList>
            <TabsContent value="info">
                 <Card>
                    <CardHeader>
                        <CardTitle>Detalhes da Empresa</CardTitle>
                        <CardDescription>Informações detalhadas sobre o cliente, contrato e responsável.</CardDescription>
                    </CardHeader>
                    <CardContent className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
                        <div className="space-y-1">
                            <p className="text-sm font-medium text-muted-foreground">CNPJ</p>
                            <p className="text-sm font-semibold">{client.cnpj}</p>
                        </div>
                        <div className="space-y-1">
                            <p className="text-sm font-medium text-muted-foreground">CNAE</p>
                            <p className="text-sm font-semibold">{client.cnae}</p>
                        </div>
                        <div className="space-y-1">
                            <p className="text-sm font-medium text-muted-foreground">Grau de Risco</p>
                            <div className="flex items-center gap-2">
                                <span className={`h-3 w-3 rounded-full ${riskInfo.color}`} />
                                <p className="text-sm font-semibold">{riskInfo.label} (Grau {client.riskLevel})</p>
                            </div>
                        </div>
                        <div className="space-y-1">
                            <p className="text-sm font-medium text-muted-foreground">Email</p>
                            <div className="flex items-center gap-2 text-sm font-semibold">
                                <Mail className="h-4 w-4 text-muted-foreground" /> {client.contact}
                            </div>
                        </div>
                        <div className="space-y-1 col-span-full">
                            <p className="text-sm font-medium text-muted-foreground">Endereço</p>
                             <div className="flex items-center gap-2 text-sm font-semibold">
                                <MapPin className="h-4 w-4 text-muted-foreground" /> {client.address}
                             </div>
                        </div>
                         <div className="space-y-4">
                            <p className="text-sm font-medium text-muted-foreground">Responsável</p>
                            <div className="flex items-center gap-4">
                                <User className="h-8 w-8 text-muted-foreground"/>
                                <div>
                                    <p className="font-semibold">{client.responsibleName}</p>
                                    <p className="text-sm text-muted-foreground">Contato Principal</p>
                                </div>
                            </div>
                            <div className="flex items-center gap-2 text-sm">
                                <Phone className="h-4 w-4 text-muted-foreground" />
                                <span>{client.responsibleContact}</span>
                            </div>
                        </div>
                         <div className="space-y-4">
                            <p className="text-sm font-medium text-muted-foreground">Contrato</p>
                            <div className="flex items-center gap-2">
                                <FileText className="h-5 w-5 text-muted-foreground" />
                                <h4 className="font-semibold">Detalhes</h4>
                            </div>
                            <div className="pl-7 space-y-1">
                                <p className="text-sm"><span className="font-medium text-muted-foreground">ID:</span> {client.contractId}</p>
                                <div className="text-sm"><span className="font-medium text-muted-foreground">Plano: </span><Badge variant="default">{client.plan}</Badge></div>
                            </div>
                         </div>
                    </CardContent>
                </Card>
            </TabsContent>
            <TabsContent value="units">
                <PlaceholderContent 
                    icon={<Building2 className="h-10 w-10 text-muted-foreground"/>}
                    title="Gestão de Unidades" 
                    description="Adicione e gerencie as diferentes unidades ou filiais desta empresa. Cada unidade pode ter seus próprios setores e colaboradores."
                />
            </TabsContent>
            <TabsContent value="sectors">
                <PlaceholderContent 
                    icon={<Network className="h-10 w-10 text-muted-foreground"/>}
                    title="Gestão de Setores" 
                    description="Defina os setores de trabalho para cada unidade. A configuração de setores é fundamental para a organização dos cargos."
                />
            </TabsContent>
            <TabsContent value="roles">
                 <PlaceholderContent 
                    icon={<UserRound className="h-10 w-10 text-muted-foreground"/>}
                    title="Gestão de Cargos" 
                    description="Cadastre os cargos existentes em cada setor, incluindo a descrição das atividades e a classificação CBO."
                />
            </TabsContent>
            <TabsContent value="employees">
                 <PlaceholderContent 
                    icon={<Users className="h-10 w-10 text-muted-foreground"/>}
                    title="Gestão de Colaboradores" 
                    description="Adicione e gerencie todos os colaboradores, vinculando-os a seus respectivos cargos, setores e unidades."
                />
            </TabsContent>
       </Tabs>
    </div>
  );
}
