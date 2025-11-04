
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
import { Upload } from 'lucide-react';
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { Label } from '@/components/ui/label';
import { Input } from '@/components/ui/input';
import { Badge } from '@/components/ui/badge';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';

const initialLaudos = [
    { id: 'LAU-001', file: 'audiometria_joao.pdf', examType: 'Audiometria', date: '2024-07-03', status: 'Laudado' },
];

type Laudo = typeof initialLaudos[0];

const mockExamTypes = ['Audiometria', 'Espirometria', 'ECG', 'EEG'];


export default function GraphicalExamsPage() {
    const [laudos, setLaudos] = useState(initialLaudos);
    const [isDialogOpen, setIsDialogOpen] = useState(false);
    const [selectedFile, setSelectedFile] = useState<File | null>(null);

    const handleFileChange = (event: React.ChangeEvent<HTMLInputElement>) => {
        if (event.target.files && event.target.files[0]) {
            setSelectedFile(event.target.files[0]);
        }
    };

    const handleImportLaudo = (event: React.FormEvent<HTMLFormElement>) => {
        event.preventDefault();
        const formData = new FormData(event.currentTarget);
        if (!selectedFile) return;

        const newLaudo: Laudo = {
            id: `LAU-${(Math.random() * 1000).toFixed(0).padStart(3,'0')}`,
            file: selectedFile.name,
            examType: formData.get('examType') as string,
            date: new Date().toISOString().split('T')[0],
            status: 'Laudado'
        };
        setLaudos(prev => [newLaudo, ...prev]);
        setIsDialogOpen(false);
        setSelectedFile(null);
    }


  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center justify-between">
          Exames Gráficos
          <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
            <DialogTrigger asChild>
              <Button size="sm" className="h-8 gap-1">
                <Upload className="h-3.5 w-3.5" />
                <span className="sr-only sm:not-sr-only sm:whitespace-nowrap">
                  Importar Laudo
                </span>
              </Button>
            </DialogTrigger>
             <DialogContent>
                <DialogHeader>
                    <DialogTitle>Importar Laudo de Exame Gráfico</DialogTitle>
                    <DialogDescription>Selecione o arquivo do laudo e o tipo de exame.</DialogDescription>
                </DialogHeader>
                <form id="import-laudo-form" onSubmit={handleImportLaudo}>
                    <div className="grid gap-4 py-4">
                        <div className="grid grid-cols-4 items-center gap-4">
                            <Label htmlFor="examType" className="text-right">Tipo de Exame</Label>
                            <Select name="examType" required>
                                <SelectTrigger className="col-span-3">
                                    <SelectValue placeholder="Selecione o tipo" />
                                </SelectTrigger>
                                <SelectContent>
                                    {mockExamTypes.map(type => <SelectItem key={type} value={type}>{type}</SelectItem>)}
                                </SelectContent>
                            </Select>
                        </div>
                        <div className="grid grid-cols-4 items-center gap-4">
                            <Label htmlFor="file-upload" className="text-right">Arquivo</Label>
                            <Input id="file-upload" name="file-upload" type="file" className="col-span-3" onChange={handleFileChange} required/>
                        </div>
                    </div>
                </form>
                <DialogFooter>
                    <Button variant="outline" onClick={() => setIsDialogOpen(false)}>Cancelar</Button>
                    <Button type="submit" form="import-laudo-form" disabled={!selectedFile}>Importar</Button>
                </DialogFooter>
            </DialogContent>
          </Dialog>
        </CardTitle>
        <CardDescription>
          Gerencie os resultados de exames como audiometrias, espirometrias e ECGs.
        </CardDescription>
      </CardHeader>
      <CardContent>
        {laudos.length > 0 ? (
             <Table>
                <TableHeader>
                    <TableRow>
                        <TableHead>Arquivo</TableHead>
                        <TableHead>Tipo de Exame</TableHead>
                        <TableHead>Data de Importação</TableHead>
                        <TableHead>Status</TableHead>
                    </TableRow>
                </TableHeader>
                <TableBody>
                    {laudos.map(laudo => (
                        <TableRow key={laudo.id}>
                            <TableCell className="font-medium">{laudo.file}</TableCell>
                             <TableCell><Badge variant="outline">{laudo.examType}</Badge></TableCell>
                            <TableCell>{laudo.date}</TableCell>
                            <TableCell><Badge variant="secondary">{laudo.status}</Badge></TableCell>
                        </TableRow>
                    ))}
                </TableBody>
            </Table>
        ) : (
            <div className="flex flex-1 items-center justify-center rounded-lg border border-dashed shadow-sm h-96">
                <div className="flex flex-col items-center gap-1 text-center">
                    <h3 className="text-2xl font-bold tracking-tight">
                    Nenhum laudo importado
                    </h3>
                    <p className="text-sm text-muted-foreground">
                    Comece importando o primeiro laudo de exame gráfico.
                    </p>
                    <Button className="mt-4" onClick={() => setIsDialogOpen(true)}>Importar Laudo</Button>
                </div>
            </div>
        )}
      </CardContent>
    </Card>
  );
}
