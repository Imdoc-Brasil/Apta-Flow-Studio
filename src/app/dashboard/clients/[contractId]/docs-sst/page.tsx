
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
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from '@/components/ui/dialog';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import { Label } from '@/components/ui/label';

const initialDocs = [
  { id: 'DOC-001', name: 'PGR - Unidade Matriz', version: '1.0', issueDate: '2024-03-15', validity: '2 anos' },
  { id: 'DOC-002', name: 'PCMSO - Geral', version: '2.1', issueDate: '2024-04-01', validity: '1 ano' },
];

type Doc = typeof initialDocs[0];

export default function DocsSstPage() {
  const [docs, setDocs] = useState(initialDocs);
  const [isDialogOpen, setIsDialogOpen] = useState(false);

  const handleGenerateDoc = (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    const formData = new FormData(event.currentTarget);
    const docType = formData.get('docType') as string;
    
    const newDoc: Doc = {
      id: `DOC-${Math.random().toString(36).substr(2, 5).toUpperCase()}`,
      name: `${docType} - ${new Date().toLocaleDateString()}`,
      version: '1.0',
      issueDate: new Date().toISOString().split('T')[0],
      validity: docType === 'PGR' ? '2 anos' : '1 ano',
    };

    setDocs(prev => [newDoc, ...prev]);
    setIsDialogOpen(false);
  }

  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center justify-between">
          Documentos de SST
          <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
            <DialogTrigger asChild>
              <Button size="sm" className="h-8 gap-1">
                <PlusCircle className="h-3.5 w-3.5" />
                <span className="sr-only sm:not-sr-only sm:whitespace-nowrap">
                  Gerar Documento
                </span>
              </Button>
            </DialogTrigger>
            <DialogContent>
              <DialogHeader>
                <DialogTitle>Gerar Novo Documento de SST</DialogTitle>
                <DialogDescription>
                  Selecione o tipo de documento para gerar uma nova versão.
                </DialogDescription>
              </DialogHeader>
              <form id="generate-doc-form" onSubmit={handleGenerateDoc}>
                <div className="grid gap-4 py-4">
                  <div className="grid grid-cols-4 items-center gap-4">
                    <Label htmlFor="docType" className="text-right">
                      Tipo de Documento
                    </Label>
                    <Select name="docType" required>
                      <SelectTrigger className="col-span-3">
                        <SelectValue placeholder="Selecione..." />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="PGR">PGR - Prog. de Gerenciamento de Riscos</SelectItem>
                        <SelectItem value="PCMSO">PCMSO - Prog. de Controle Médico</SelectItem>
                        <SelectItem value="LTCAT">LTCAT - Laudo Técnico das Condições do Ambiente</SelectItem>
                        <SelectItem value="AET">AET - Análise Ergonômica do Trabalho</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                </div>
              </form>
              <DialogFooter>
                <Button variant="outline" onClick={() => setIsDialogOpen(false)}>Cancelar</Button>
                <Button type="submit" form="generate-doc-form">Gerar</Button>
              </DialogFooter>
            </DialogContent>
          </Dialog>
        </CardTitle>
        <CardDescription>
          Gere e gerencie os documentos de Saúde e Segurança do Trabalho para este cliente.
        </CardDescription>
      </CardHeader>
      <CardContent>
        {docs.length > 0 ? (
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Nome do Documento</TableHead>
                <TableHead>Versão</TableHead>
                <TableHead>Data de Emissão</TableHead>
                <TableHead>Validade</TableHead>
                <TableHead>
                  <span className="sr-only">Ações</span>
                </TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {docs.map((doc) => (
                <TableRow key={doc.id}>
                  <TableCell className="font-medium">{doc.name}</TableCell>
                  <TableCell>{doc.version}</TableCell>
                  <TableCell>{doc.issueDate}</TableCell>
                  <TableCell>{doc.validity}</TableCell>
                  <TableCell className="text-right">
                    <DropdownMenu>
                      <DropdownMenuTrigger asChild>
                        <Button size="icon" variant="ghost">
                          <MoreHorizontal className="h-4 w-4" />
                        </Button>
                      </DropdownMenuTrigger>
                      <DropdownMenuContent>
                        <DropdownMenuLabel>Ações</DropdownMenuLabel>
                        <DropdownMenuItem>Baixar PDF</DropdownMenuItem>
                        <DropdownMenuItem>Ver Histórico</DropdownMenuItem>
                        <DropdownMenuItem>Arquivar</DropdownMenuItem>
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
                Nenhum documento gerado
              </h3>
              <p className="text-sm text-muted-foreground">
                Comece gerando o primeiro documento para este cliente.
              </p>
              <Button className="mt-4" onClick={() => setIsDialogOpen(true)}>Gerar PGR</Button>
            </div>
          </div>
        )}
      </CardContent>
    </Card>
  );
}
