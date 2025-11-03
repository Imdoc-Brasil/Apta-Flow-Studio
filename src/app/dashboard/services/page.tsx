
'use client';

import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from '@/components/ui/card';
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Button } from '@/components/ui/button';
import { File, PlusCircle, Percent } from 'lucide-react';
import { Badge } from '@/components/ui/badge';
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';

// --- Mock Data ---

const medicalExams = [
  { code: '0201', name: 'Avaliação Clínica Ocupacional', type: 'Profissional Agenda', price: 'R$ 50,00', periodicity: '12 meses' },
  { code: '0211', name: 'Avaliação da acuidade visual', type: 'Laboratório', price: 'R$ 35,00', periodicity: '24 meses' },
  { code: 'N/A', name: 'Avaliação Psicossocial', type: 'Terceirizado', price: 'R$ 150,00', periodicity: 'Conforme PCMSO' },
  { code: '0212', name: 'Exame oftalmológico', type: 'Terceirizado', price: 'R$ 200,00', periodicity: 'Conforme PCMSO' },
  { code: '0215', name: 'Glicemia', type: 'Laboratório', price: 'R$ 25,00', periodicity: 'Anual' },
];

const sstPrograms = [
  { code: 'SST-01', service: 'PCMSO', quantity: 1, unitPrice: 'R$ 800,00', total: 'R$ 800,00', validity: '12 meses', destination: 'Unidade/Setores/Cargos' },
  { code: 'SST-02', service: 'PGR', quantity: 1, unitPrice: 'R$ 1.200,00', total: 'R$ 1.200,00', validity: '24 meses', destination: 'Unidade/Setores/Cargos' },
  { code: 'SST-03', service: 'LTCAT', quantity: 1, unitPrice: 'R$ 1.500,00', total: 'R$ 1.500,00', validity: 'Indefinido', destination: 'Unidade/Setores/Cargos' },
  { code: 'SST-04', service: 'AET', quantity: 1, unitPrice: 'R$ 2.000,00', total: 'R$ 2.000,00', validity: 'Indefinido', destination: 'Unidade/Setores/Cargos' },
  { code: 'SST-05', service: 'Assistência Técnica a Perícia', quantity: 1, unitPrice: 'Sob Consulta', total: 'Sob Consulta', validity: '60 dias', destination: 'Processo Judicial' },
];

const technicalAdvisory = [
  { contractNumber: 'CT-MED-01', name: 'Assessoria em Medicina do Trabalho', hours: 10, hourValue: 'R$ 250,00', total: 'R$ 2.500,00', validity: '12 meses' },
  { contractNumber: 'CT-SEG-01', name: 'Assessoria em Segurança do Trabalho', hours: 20, hourValue: 'R$ 200,00', total: 'R$ 4.000,00', validity: '12 meses' },
];

const rentals = [
  { code: 'RENT-01', description: 'Unidade Móvel', dailyRate: 'R$ 1.500,00', insurance: 'R$ 300,00' },
  { code: 'RENT-02', description: 'Eletrocardiograma', dailyRate: 'R$ 250,00', insurance: 'R$ 50,00' },
];

const outsourcing = [
  { code: 'SESMT-01', professional: 'Médico do Trabalho', hourValue: 'R$ 300,00', hours: 40, professionals: 1, total: 'R$ 12.000,00' },
  { code: 'SESMT-02', professional: 'Técnico de Segurança do Trabalho', hourValue: 'R$ 150,00', hours: 80, professionals: 2, total: 'R$ 24.000,00' },
];


function ServiceTableActions() {
    return (
        <div className="ml-auto flex items-center gap-2">
            <Button size="sm" variant="outline" className="h-8 gap-1">
                <File className="h-3.5 w-3.5" />
                <span className="sr-only sm:not-sr-only sm:whitespace-nowrap">Exportar</span>
            </Button>
            <Button size="sm" className="h-8 gap-1">
                <PlusCircle className="h-3.5 w-3.5" />
                <span className="sr-only sm:not-sr-only sm:whitespace-nowrap">Adicionar Serviço</span>
            </Button>
        </div>
    )
}

function MedicalExamsActions() {
    return (
        <div className="ml-auto flex items-center gap-2">
            <Dialog>
                <DialogTrigger asChild>
                    <Button size="sm" variant="outline" className="h-8 gap-1">
                        <Percent className="h-3.5 w-3.5" />
                        <span className="sr-only sm:not-sr-only sm:whitespace-nowrap">Aplicar Reajuste Anual</span>
                    </Button>
                </DialogTrigger>
                <DialogContent className="sm:max-w-md">
                    <DialogHeader>
                        <DialogTitle>Reajuste Anual de Preços</DialogTitle>
                        <DialogDescription>
                            Aplique um reajuste percentual a todos os exames médicos. Os novos preços serão refletidos em todos os novos contratos.
                        </DialogDescription>
                    </DialogHeader>
                    <div className="grid gap-4 py-4">
                        <div className="grid grid-cols-4 items-center gap-4">
                            <Label htmlFor="adjustment" className="text-right">
                                Percentual (%)
                            </Label>
                            <Input id="adjustment" type="number" placeholder="Ex: 10" className="col-span-3" />
                        </div>
                    </div>
                    <DialogFooter>
                        <Button type="submit">Aplicar Reajuste</Button>
                    </DialogFooter>
                </DialogContent>
            </Dialog>
            <Button size="sm" variant="outline" className="h-8 gap-1">
                <File className="h-3.5 w-3.5" />
                <span className="sr-only sm:not-sr-only sm:whitespace-nowrap">Exportar</span>
            </Button>
            <Button size="sm" className="h-8 gap-1">
                <PlusCircle className="h-3.5 w-3.5" />
                <span className="sr-only sm:not-sr-only sm:whitespace-nowrap">Adicionar Exame</span>
            </Button>
        </div>
    )
}


export default function ServicesPage() {
  return (
    <div className="grid flex-1 auto-rows-max gap-4">
        <div className="flex items-center gap-4">
            <h1 className="flex-1 shrink-0 whitespace-nowrap text-xl font-semibold tracking-tight sm:grow-0">
                Catálogo de Serviços
            </h1>
        </div>
      <Tabs defaultValue="exams">
        <TabsList className="grid w-full grid-cols-5">
          <TabsTrigger value="exams">Exames Médicos</TabsTrigger>
          <TabsTrigger value="programs">Programas e Laudos</TabsTrigger>
          <TabsTrigger value="advisory">Assessoria Técnica</TabsTrigger>
          <TabsTrigger value="rentals">Aluguéis</TabsTrigger>
          <TabsTrigger value="outsourcing">Terceirização SESMT</TabsTrigger>
        </TabsList>

        <TabsContent value="exams">
          <Card>
            <CardHeader>
              <CardTitle>Exames Médicos Ocupacionais</CardTitle>
              <CardDescription>Tabela de preços e configurações para exames médicos conforme NR7.</CardDescription>
              <div className="pt-4"><MedicalExamsActions /></div>
            </CardHeader>
            <CardContent>
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>Código (eSocial)</TableHead>
                    <TableHead>Nome</TableHead>
                    <TableHead>Tipo</TableHead>
                    <TableHead>Preço</TableHead>
                    <TableHead>Periodicidade</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {medicalExams.map((exam) => (
                    <TableRow key={exam.code}>
                      <TableCell className="font-medium">{exam.code}</TableCell>
                      <TableCell>{exam.name}</TableCell>
                      <TableCell><Badge variant="outline">{exam.type}</Badge></TableCell>
                      <TableCell>{exam.price}</TableCell>
                      <TableCell>{exam.periodicity}</TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="programs">
           <Card>
            <CardHeader>
              <CardTitle>Programas e Laudos de SST</CardTitle>
              <CardDescription>Serviços cobrados por demanda para emissão de programas e laudos de segurança do trabalho.</CardDescription>
               <div className="pt-4"><ServiceTableActions /></div>
            </CardHeader>
            <CardContent>
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>Código</TableHead>
                    <TableHead>Serviço</TableHead>
                    <TableHead>Valor Unitário</TableHead>
                    <TableHead>Vigência</TableHead>
                    <TableHead>Destinado a</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {sstPrograms.map((program) => (
                    <TableRow key={program.code}>
                      <TableCell className="font-medium">{program.code}</TableCell>
                      <TableCell>{program.service}</TableCell>
                      <TableCell>{program.unitPrice}</TableCell>
                      <TableCell>{program.validity}</TableCell>
                      <TableCell>{program.destination}</TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="advisory">
            <Card>
            <CardHeader>
              <CardTitle>Assessoria Técnica</CardTitle>
              <CardDescription>Contratos de recorrência mensal para assessoria técnica especializada.</CardDescription>
               <div className="pt-4"><ServiceTableActions /></div>
            </CardHeader>
            <CardContent>
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>Nº Contrato</TableHead>
                    <TableHead>Contrato</TableHead>
                    <TableHead>Horas Mensais</TableHead>
                    <TableHead>Valor por Hora</TableHead>
                    <TableHead>Valor Total Mensal</TableHead>
                    <TableHead>Vigência</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {technicalAdvisory.map((item) => (
                    <TableRow key={item.contractNumber}>
                      <TableCell className="font-medium">{item.contractNumber}</TableCell>
                      <TableCell>{item.name}</TableCell>
                      <TableCell>{item.hours}</TableCell>
                      <TableCell>{item.hourValue}</TableCell>
                      <TableCell>{item.total}</TableCell>
                      <TableCell>{item.validity}</TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </CardContent>
          </Card>
        </TabsContent>
        
        <TabsContent value="rentals">
             <Card>
            <CardHeader>
              <CardTitle>Aluguel de Unidade Móvel e Equipamentos</CardTitle>
              <CardDescription>Disponibilização de equipamentos e unidades móveis para atendimento in-company.</CardDescription>
               <div className="pt-4"><ServiceTableActions /></div>
            </CardHeader>
            <CardContent>
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>Código</TableHead>
                    <TableHead>Descrição</TableHead>
                    <TableHead>Valor por Diária</TableHead>
                    <TableHead>Seguro</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {rentals.map((item) => (
                    <TableRow key={item.code}>
                      <TableCell className="font-medium">{item.code}</TableCell>
                      <TableCell>{item.description}</TableCell>
                      <TableCell>{item.dailyRate}</TableCell>
                      <TableCell>{item.insurance}</TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="outsourcing">
            <Card>
            <CardHeader>
              <CardTitle>Terceirização de SESMT</CardTitle>
              <CardDescription>Alocação de profissionais de Saúde e Segurança do Trabalho para compor o SESMT do cliente.</CardDescription>
               <div className="pt-4"><ServiceTableActions /></div>
            </CardHeader>
            <CardContent>
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>Código</TableHead>
                    <TableHead>Profissional</TableHead>
                    <TableHead>Valor por Hora</TableHead>
                    <TableHead>Horas Contratadas</TableHead>
                    <TableHead>Nº Profissionais</TableHead>
                    <TableHead>Valor Total</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {outsourcing.map((item) => (
                    <TableRow key={item.code}>
                      <TableCell className="font-medium">{item.code}</TableCell>
                      <TableCell>{item.professional}</TableCell>
                      <TableCell>{item.hourValue}</TableCell>
                      <TableCell>{item.hours}</TableCell>
                      <TableCell>{item.professionals}</TableCell>
                      <TableCell>{item.total}</TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </CardContent>
          </Card>
        </TabsContent>

      </Tabs>
    </div>
  );
}
