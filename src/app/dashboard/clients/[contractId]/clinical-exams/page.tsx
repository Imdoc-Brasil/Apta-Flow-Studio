
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
import { PlusCircle } from 'lucide-react';
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { Label } from '@/components/ui/label';
import { Input } from '@/components/ui/input';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Textarea } from '@/components/ui/textarea';

const initialExams = [
    { id: 'EXM-001', collaborator: 'João da Silva', date: '2024-07-01', doctor: 'Dr. Carlos Andrade', type: 'Exame Admissional' },
];

type ClinicalExam = typeof initialExams[0];

const mockCollaborators = ['João da Silva', 'Maria Oliveira'];
const mockDoctors = ['Dr. Carlos Andrade', 'Dra. Ana Souza'];

export default function ClinicalExamsPage() {
    const [exams, setExams] = useState(initialExams);
    const [isDialogOpen, setIsDialogOpen] = useState(false);

    const handleAddExam = (event: React.FormEvent<HTMLFormElement>) => {
        event.preventDefault();
        const formData = new FormData(event.currentTarget);
        const newExam: ClinicalExam = {
            id: `EXM-${(Math.random() * 1000).toFixed(0).padStart(3,'0')}`,
            collaborator: formData.get('collaborator') as string,
            date: formData.get('date') as string,
            doctor: formData.get('doctor') as string,
            type: 'Consulta Clínica',
        };
        setExams(prev => [newExam, ...prev]);
        setIsDialogOpen(false);
    }

  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center justify-between">
          Exames Clínicos
          <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
            <DialogTrigger asChild>
                <Button size="sm" className="h-8 gap-1">
                    <PlusCircle className="h-3.5 w-3.5" />
                    <span className="sr-only sm:not-sr-only sm:whitespace-nowrap">
                    Registrar Consulta
                    </span>
                </Button>
            </DialogTrigger>
            <DialogContent>
                <DialogHeader>
                    <DialogTitle>Registrar Consulta Clínica</DialogTitle>
                    <DialogDescription>Preencha os detalhes da consulta realizada.</DialogDescription>
                </DialogHeader>
                <form id="add-exam-form" onSubmit={handleAddExam}>
                    <div className="grid gap-4 py-4">
                         <div className="grid grid-cols-4 items-center gap-4">
                            <Label htmlFor="collaborator" className="text-right">Colaborador</Label>
                            <Select name="collaborator" required>
                                <SelectTrigger className="col-span-3">
                                    <SelectValue placeholder="Selecione o colaborador" />
                                </SelectTrigger>
                                <SelectContent>
                                    {mockCollaborators.map(c => <SelectItem key={c} value={c}>{c}</SelectItem>)}
                                </SelectContent>
                            </Select>
                        </div>
                        <div className="grid grid-cols-4 items-center gap-4">
                            <Label htmlFor="date" className="text-right">Data</Label>
                            <Input id="date" name="date" type="date" className="col-span-3" required/>
                        </div>
                         <div className="grid grid-cols-4 items-center gap-4">
                            <Label htmlFor="doctor" className="text-right">Médico</Label>
                            <Select name="doctor" required>
                                <SelectTrigger className="col-span-3">
                                    <SelectValue placeholder="Selecione o médico" />
                                </SelectTrigger>
                                <SelectContent>
                                    {mockDoctors.map(d => <SelectItem key={d} value={d}>{d}</SelectItem>)}
                                </SelectContent>
                            </Select>
                        </div>
                        <div className="grid grid-cols-4 items-center gap-4">
                            <Label htmlFor="notes" className="text-right">Observações</Label>
                            <Textarea id="notes" name="notes" className="col-span-3" />
                        </div>
                    </div>
                </form>
                <DialogFooter>
                    <Button variant="outline" onClick={() => setIsDialogOpen(false)}>Cancelar</Button>
                    <Button type="submit" form="add-exam-form">Salvar Consulta</Button>
                </DialogFooter>
            </DialogContent>
          </Dialog>
        </CardTitle>
        <CardDescription>
          Gerencie as consultas e exames clínicos realizados pelos profissionais de saúde.
        </CardDescription>
      </CardHeader>
      <CardContent>
        {exams.length > 0 ? (
            <Table>
                <TableHeader>
                    <TableRow>
                        <TableHead>Colaborador</TableHead>
                        <TableHead>Data</TableHead>
                        <TableHead>Médico Responsável</TableHead>
                        <TableHead>Tipo</TableHead>
                    </TableRow>
                </TableHeader>
                <TableBody>
                    {exams.map(exam => (
                        <TableRow key={exam.id}>
                            <TableCell className="font-medium">{exam.collaborator}</TableCell>
                            <TableCell>{exam.date}</TableCell>
                            <TableCell>{exam.doctor}</TableCell>
                            <TableCell>{exam.type}</TableCell>
                        </TableRow>
                    ))}
                </TableBody>
            </Table>
        ) : (
            <div className="flex flex-1 items-center justify-center rounded-lg border border-dashed shadow-sm h-96">
                <div className="flex flex-col items-center gap-1 text-center">
                    <h3 className="text-2xl font-bold tracking-tight">
                    Nenhum exame clínico registrado
                    </h3>
                    <p className="text-sm text-muted-foreground">
                    Comece registrando a primeira consulta ou exame clínico.
                    </p>
                    <Button className="mt-4" onClick={() => setIsDialogOpen(true)}>Registrar Consulta</Button>
                </div>
            </div>
        )}
      </CardContent>
    </Card>
  );
}
