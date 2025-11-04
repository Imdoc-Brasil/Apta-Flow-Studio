
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
import { PlusCircle, Upload } from 'lucide-react';
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { Label } from '@/components/ui/label';
import { Input } from '@/components/ui/input';
import { Badge } from '@/components/ui/badge';


const initialResults = [
    { id: 'LAB-001', file: 'resultado_joao.pdf', date: '2024-07-02', status: 'Importado'},
];

type LabResult = typeof initialResults[0];


export default function LabExamsPage() {
    const [results, setResults] = useState(initialResults);
    const [isDialogOpen, setIsDialogOpen] = useState(false);
    const [selectedFile, setSelectedFile] = useState<File | null>(null);

     const handleFileChange = (event: React.ChangeEvent<HTMLInputElement>) => {
        if (event.target.files && event.target.files[0]) {
            setSelectedFile(event.target.files[0]);
        }
    };

    const handleImportResult = (event: React.FormEvent<HTMLFormElement>) => {
        event.preventDefault();
        if (!selectedFile) return;

        const newResult: LabResult = {
            id: `LAB-${(Math.random() * 1000).toFixed(0).padStart(3,'0')}`,
            file: selectedFile.name,
            date: new Date().toISOString().split('T')[0],
            status: 'Importado'
        };
        setResults(prev => [newResult, ...prev]);
        setIsDialogOpen(false);
        setSelectedFile(null);
    }

  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center justify-between">
          Exames Laboratoriais
          <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
            <DialogTrigger asChild>
                <Button size="sm" className="h-8 gap-1">
                    <Upload className="h-3.5 w-3.5" />
                    <span className="sr-only sm:not-sr-only sm:whitespace-nowrap">
                    Importar Resultados
                    </span>
                </Button>
            </DialogTrigger>
            <DialogContent>
                <DialogHeader>
                    <DialogTitle>Importar Resultados de Exames</DialogTitle>
                    <DialogDescription>Selecione o arquivo (PDF, XML) com os resultados dos exames para importar.</DialogDescription>
                </DialogHeader>
                <form id="import-form" onSubmit={handleImportResult}>
                    <div className="grid gap-4 py-4">
                        <div className="grid grid-cols-4 items-center gap-4">
                            <Label htmlFor="file-upload" className="text-right">Arquivo</Label>
                            <Input id="file-upload" name="file-upload" type="file" className="col-span-3" onChange={handleFileChange} required/>
                        </div>
                    </div>
                </form>
                <DialogFooter>
                    <Button variant="outline" onClick={() => setIsDialogOpen(false)}>Cancelar</Button>
                    <Button type="submit" form="import-form" disabled={!selectedFile}>Importar</Button>
                </DialogFooter>
            </DialogContent>
          </Dialog>
        </CardTitle>
        <CardDescription>
          Gerencie e importe os resultados de exames laboratoriais dos colaboradores.
        </CardDescription>
      </CardHeader>
      <CardContent>
         {results.length > 0 ? (
            <Table>
                <TableHeader>
                    <TableRow>
                        <TableHead>Arquivo</TableHead>
                        <TableHead>Data de Importação</TableHead>
                        <TableHead>Status</TableHead>
                    </TableRow>
                </TableHeader>
                <TableBody>
                    {results.map(result => (
                        <TableRow key={result.id}>
                            <TableCell className="font-medium">{result.file}</TableCell>
                            <TableCell>{result.date}</TableCell>
                            <TableCell><Badge variant="secondary">{result.status}</Badge></TableCell>
                        </TableRow>
                    ))}
                </TableBody>
            </Table>
        ) : (
             <div className="flex flex-1 items-center justify-center rounded-lg border border-dashed shadow-sm h-96">
                <div className="flex flex-col items-center gap-1 text-center">
                    <h3 className="text-2xl font-bold tracking-tight">
                    Nenhum resultado importado
                    </h3>
                    <p className="text-sm text-muted-foreground">
                    Comece importando o primeiro lote de resultados de exames.
                    </p>
                    <Button className="mt-4" onClick={() => setIsDialogOpen(true)}>Importar Resultados</Button>
                </div>
            </div>
        )}
      </CardContent>
    </Card>
  );
}
