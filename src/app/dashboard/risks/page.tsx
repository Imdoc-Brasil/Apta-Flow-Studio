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

const hazardData = [
    { id: 'RF-001', name: 'Ruído Contínuo ou Intermitente', esocialCode: '01.01.001', method: 'Quantitativo', category: 'Físico'},
    { id: 'RF-002', name: 'Vibrações de Mãos e Braços (VMB)', esocialCode: '01.02.001', method: 'Quantitativo', category: 'Físico'},
    { id: 'RQ-001', name: 'Poeiras Minerais (Sílica)', esocialCode: '02.01.018', method: 'Quantitativo', category: 'Químico'},
    { id: 'RE-001', name: 'Levantamento e transporte manual de peso', esocialCode: '04.01.001', method: 'Qualitativo', category: 'Ergonômico'},
    { id: 'RA-001', name: 'Arranjo físico inadequado', esocialCode: '05.01.001', method: 'Qualitativo', category: 'Acidente'},
];

const epcData = [
    { id: 'EPC-01', name: 'Enclausuramento acústico de fontes de ruído', active: true, attenuation: '15 dB(A)'},
    { id: 'EPC-02', name: 'Sistema de ventilação e exaustão', active: true, attenuation: 'N/A'},
    { id: 'EPC-03', name: 'Guarda-corpos e rodapés', active: true, attenuation: 'N/A'},
];

const epiData = [
    { id: 'EPI-01', name: 'Protetor auricular tipo concha', ca: '12345', active: true},
    { id: 'EPI-02', name: 'Luva de segurança para proteção contra agentes mecânicos', ca: '67890', active: true},
    { id: 'EPI-03', name: 'Respirador purificador de ar', ca: '11223', active: true},
];


export default function RisksPage() {
  return (
    <div className="grid flex-1 auto-rows-max gap-8">
      <div className="flex items-center gap-4">
        <h1 className="flex-1 shrink-0 whitespace-nowrap text-xl font-semibold tracking-tight sm:grow-0">
          Gestão de Riscos Ocupacionais
        </h1>
      </div>
      
      <Card>
          <CardHeader>
            <CardTitle className="flex items-center justify-between">
              Catálogo de Perigos/Fatores de Risco
               <Button size="sm" className="h-8 gap-1">
                <PlusCircle className="h-3.5 w-3.5" />
                <span className="sr-only sm:not-sr-only sm:whitespace-nowrap">
                  Adicionar Perigo
                </span>
              </Button>
            </CardTitle>
            <CardDescription>
              Base de dados central com todos os perigos e fatores de risco identificados, conforme a NR1 e Tabela 24 do eSocial.
            </CardDescription>
          </CardHeader>
          <CardContent>
             <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Agente/Risco</TableHead>
                  <TableHead>Cód. eSocial</TableHead>
                  <TableHead>Categoria</TableHead>
                  <TableHead>Método</TableHead>
                  <TableHead>
                    <span className="sr-only">Ações</span>
                  </TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {hazardData.map((risk) => (
                    <TableRow key={risk.id}>
                    <TableCell className="font-medium">{risk.name}</TableCell>
                    <TableCell>
                      <Badge variant="outline">{risk.esocialCode}</Badge>
                    </TableCell>
                    <TableCell>{risk.category}</TableCell>
                    <TableCell>{risk.method}</TableCell>
                    <TableCell>
                          <DropdownMenu>
                            <DropdownMenuTrigger asChild>
                              <Button aria-haspopup="true" size="icon" variant="ghost" >
                                <MoreHorizontal className="h-4 w-4" />
                                <span className="sr-only">Alternar menu</span>
                              </Button>
                            </DropdownMenuTrigger>
                            <DropdownMenuContent align="end">
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
          </CardContent>
        </Card>

      <div className="grid gap-8 md:grid-cols-2">
        <Card>
            <CardHeader>
                <CardTitle className="flex items-center justify-between">
                Catálogo de EPC
                <Button size="sm" className="h-8 gap-1">
                    <PlusCircle className="h-3.5 w-3.5" />
                    <span className="sr-only sm:not-sr-only sm:whitespace-nowrap">
                    Adicionar EPC
                    </span>
                </Button>
                </CardTitle>
                <CardDescription>
                Gerencie todos os Equipamentos de Proteção Coletiva disponíveis.
                </CardDescription>
            </CardHeader>
            <CardContent>
                <Table>
                    <TableHeader>
                        <TableRow>
                            <TableHead>Nome</TableHead>
                            <TableHead>Atenuação</TableHead>
                            <TableHead>Status</TableHead>
                            <TableHead><span className="sr-only">Ações</span></TableHead>
                        </TableRow>
                    </TableHeader>
                    <TableBody>
                        {epcData.map((epc) => (
                            <TableRow key={epc.id}>
                                <TableCell className="font-medium">{epc.name}</TableCell>
                                <TableCell>{epc.attenuation}</TableCell>
                                <TableCell><Badge variant={epc.active ? 'secondary' : 'outline'}>{epc.active ? 'Ativo' : 'Inativo'}</Badge></TableCell>
                                 <TableCell>
                                    <DropdownMenu>
                                        <DropdownMenuTrigger asChild><Button aria-haspopup="true" size="icon" variant="ghost" ><MoreHorizontal className="h-4 w-4" /></Button></DropdownMenuTrigger>
                                        <DropdownMenuContent align="end"><DropdownMenuItem>Editar</DropdownMenuItem></DropdownMenuContent>
                                    </DropdownMenu>
                                </TableCell>
                            </TableRow>
                        ))}
                    </TableBody>
                </Table>
            </CardContent>
        </Card>
        
        <Card>
            <CardHeader>
                <CardTitle className="flex items-center justify-between">
                Catálogo de EPI
                <Button size="sm" className="h-8 gap-1">
                    <PlusCircle className="h-3.5 w-3.5" />
                    <span className="sr-only sm:not-sr-only sm:whitespace-nowrap">
                    Adicionar EPI
                    </span>
                </Button>
                </CardTitle>
                <CardDescription>
                Gerencie todos os Equipamentos de Proteção Individual e seus CAs.
                </CardDescription>
            </CardHeader>
            <CardContent>
                <Table>
                    <TableHeader>
                        <TableRow>
                            <TableHead>Nome</TableHead>
                            <TableHead>CA</TableHead>
                            <TableHead>Status</TableHead>
                            <TableHead><span className="sr-only">Ações</span></TableHead>
                        </TableRow>
                    </TableHeader>
                    <TableBody>
                        {epiData.map((epi) => (
                            <TableRow key={epi.id}>
                                <TableCell className="font-medium">{epi.name}</TableCell>
                                <TableCell>{epi.ca}</TableCell>
                                <TableCell><Badge variant={epi.active ? 'secondary' : 'outline'}>{epi.active ? 'Ativo' : 'Inativo'}</Badge></TableCell>
                                 <TableCell>
                                    <DropdownMenu>
                                        <DropdownMenuTrigger asChild><Button aria-haspopup="true" size="icon" variant="ghost" ><MoreHorizontal className="h-4 w-4" /></Button></DropdownMenuTrigger>
                                        <DropdownMenuContent align="end"><DropdownMenuItem>Editar</DropdownMenuItem></DropdownMenuContent>
                                    </DropdownMenu>
                                </TableCell>
                            </TableRow>
                        ))}
                    </TableBody>
                </Table>
            </CardContent>
        </Card>
      </div>
    </div>
  );
}
