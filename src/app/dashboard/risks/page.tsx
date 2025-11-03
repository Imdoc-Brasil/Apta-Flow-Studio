'use client';

import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from '@/components/ui/card';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Button } from '@/components/ui/button';
import { MoreHorizontal, PlusCircle } from 'lucide-react';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
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
import { Badge } from '@/components/ui/badge';

const physicalRisksData = [
    { id: 'RF-001', name: 'Ruído Contínuo ou Intermitente', esocialCode: '01.01.001', method: 'Quantitativo', toleranceLimit: '85 dB(A)'},
    { id: 'RF-002', name: 'Vibrações de Mãos e Braços (VMB)', esocialCode: '01.02.001', method: 'Quantitativo', toleranceLimit: '5 m/s²'},
    { id: 'RF-003', name: 'Vibrações de Corpo Inteiro (VCI)', esocialCode: '01.02.002', method: 'Quantitativo', toleranceLimit: '1.15 m/s²'},
    { id: 'RF-004', name: 'Temperaturas Anormais (Calor)', esocialCode: '01.03.001', method: 'Quantitativo', toleranceLimit: 'IBUTG'},
    { id: 'RF-005', name: 'Radiações Não Ionizantes', esocialCode: '01.04.001', method: 'Qualitativo', toleranceLimit: 'N/A'},
    { id: 'RF-006', name: 'Pressões Atmosféricas Anormais', esocialCode: '01.06.001', method: 'Qualitativo', toleranceLimit: 'N/A'},
];


function PhysicalRisksDashboard() {
  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center justify-between">
          Riscos Físicos
          <Button size="sm" className="h-8 gap-1">
            <PlusCircle className="h-3.5 w-3.5" />
            <span className="sr-only sm:not-sr-only sm:whitespace-nowrap">
              Adicionar Risco
            </span>
          </Button>
        </CardTitle>
        <CardDescription>
          Gerencie os riscos físicos identificados no ambiente de trabalho, conforme a NR1 e NR9.
        </CardDescription>
      </CardHeader>
      <CardContent>
         <Table>
          <TableHeader>
            <TableRow>
              <TableHead>Agente/Risco</TableHead>
              <TableHead>Cód. eSocial</TableHead>
              <TableHead>Método</TableHead>
              <TableHead>Limite de Tolerância</TableHead>
              <TableHead>
                <span className="sr-only">Ações</span>
              </TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {physicalRisksData.map((risk) => (
                <TableRow key={risk.id}>
                <TableCell className="font-medium">{risk.name}</TableCell>
                <TableCell>
                  <Badge variant="outline">{risk.esocialCode}</Badge>
                </TableCell>
                <TableCell>{risk.method}</TableCell>
                <TableCell>{risk.toleranceLimit}</TableCell>
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
                          <DropdownMenuItem>Ver Medições</DropdownMenuItem>
                          <DropdownMenuItem className="text-destructive">Excluir</DropdownMenuItem>
                        </DropdownMenuContent>
                      </DropdownMenu>
                    </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </CardContent>
    </Card>
  );
}


function PlaceholderContent({ category }: { category: string }) {
  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center justify-between">
          Riscos de {category}
          <Button size="sm" className="h-8 gap-1">
            <PlusCircle className="h-3.5 w-3.5" />
            <span className="sr-only sm:not-sr-only sm:whitespace-nowrap">
              Adicionar Risco
            </span>
          </Button>
        </CardTitle>
        <CardDescription>
          Gerencie os riscos {category.toLowerCase()} identificados no ambiente de trabalho.
        </CardDescription>
      </CardHeader>
      <CardContent>
        <div className="flex flex-1 items-center justify-center rounded-lg border border-dashed shadow-sm h-96">
          <div className="flex flex-col items-center gap-1 text-center">
            <h3 className="text-2xl font-bold tracking-tight">
              Nenhum risco de {category.toLowerCase()} cadastrado
            </h3>
            <p className="text-sm text-muted-foreground">
              Comece adicionando um novo risco para esta categoria.
            </p>
          </div>
        </div>
      </CardContent>
    </Card>
  );
}

export default function RisksPage() {
  const riskCategories = [
    { value: 'fisicos', label: 'Físicos' },
    { value: 'quimicos', label: 'Químicos' },
    { value: 'biologicos', label: 'Biológicos' },
    { value: 'ergonomicos', label: 'Ergonômicos' },
    { value: 'acidentes', label: 'Acidentes' },
    { value: 'psicossociais', label: 'Psicossociais' },
  ];

  return (
    <div className="grid flex-1 auto-rows-max gap-4">
      <div className="flex items-center gap-4">
        <h1 className="flex-1 shrink-0 whitespace-nowrap text-xl font-semibold tracking-tight sm:grow-0">
          Gestão de Riscos Ocupacionais
        </h1>
      </div>
      <Tabs defaultValue={riskCategories[0].value}>
        <TabsList className="grid w-full grid-cols-2 sm:grid-cols-3 lg:grid-cols-6">
          {riskCategories.map((cat) => (
            <TabsTrigger key={cat.value} value={cat.value}>
              {cat.label}
            </TabsTrigger>
          ))}
        </TabsList>

        <TabsContent value="fisicos">
          <PhysicalRisksDashboard />
        </TabsContent>
        
        {riskCategories.slice(1).map((cat) => (
          <TabsContent key={cat.value} value={cat.value}>
            <PlaceholderContent category={cat.label} />
          </TabsContent>
        ))}
      </Tabs>
    </div>
  );
}
