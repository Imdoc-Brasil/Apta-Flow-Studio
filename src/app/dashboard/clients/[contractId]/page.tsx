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
} from 'lucide-react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { initialClientsData } from '../page';
import Link from 'next/link';

// Simula a busca de dados do cliente.
const getClientById = (id: string) => {
  return initialClientsData.find((client) => client.contractId === id);
};

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
      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
        <Card className="lg:col-span-2">
          <CardHeader>
            <CardTitle>Informações Gerais</CardTitle>
          </CardHeader>
          <CardContent className="grid grid-cols-2 gap-4">
            <div className="space-y-1">
              <p className="text-sm font-medium text-muted-foreground">CNPJ</p>
              <p className="text-sm font-semibold">{client.cnpj}</p>
            </div>
            <div className="space-y-1">
              <p className="text-sm font-medium text-muted-foreground">CNAE</p>
              <p className="text-sm font-semibold">{client.cnae}</p>
            </div>
             <div className="space-y-1">
              <p className="text-sm font-medium text-muted-foreground">Email</p>
              <div className="flex items-center gap-2 text-sm font-semibold">
                <Mail className="h-4 w-4 text-muted-foreground" /> {client.contact}
              </div>
            </div>
            <div className="space-y-1">
                <p className="text-sm font-medium text-muted-foreground">Grau de Risco</p>
                <div className="flex items-center gap-2">
                    <span className={`h-3 w-3 rounded-full ${riskInfo.color}`} />
                    <p className="text-sm font-semibold">{riskInfo.label} (Grau {client.riskLevel})</p>
                </div>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Responsável</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
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
          </CardContent>
        </Card>
        
        <Card className="lg:col-span-3">
            <CardHeader>
                <CardTitle>Detalhes do Contrato e Endereço</CardTitle>
            </CardHeader>
            <CardContent className="grid md:grid-cols-2 gap-4">
                 <div className="space-y-2">
                    <div className="flex items-center gap-2">
                        <FileText className="h-5 w-5 text-muted-foreground" />
                        <h4 className="font-semibold">Contrato</h4>
                    </div>
                    <div className="pl-7 space-y-1">
                        <p className="text-sm"><span className="font-medium text-muted-foreground">ID do Contrato:</span> {client.contractId}</p>
                        <p className="text-sm"><span className="font-medium text-muted-foreground">Plano:</span> <Badge variant="default">{client.plan}</Badge></p>
                    </div>
                 </div>
                 <div className="space-y-2">
                    <div className="flex items-center gap-2">
                         <MapPin className="h-5 w-5 text-muted-foreground" />
                         <h4 className="font-semibold">Endereço</h4>
                    </div>
                     <div className="pl-7">
                        <p className="text-sm font-semibold">{client.address}</p>
                     </div>
                 </div>
            </CardContent>
        </Card>
      </div>
    </div>
  );
}
