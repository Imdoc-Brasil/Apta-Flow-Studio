'use client'

import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { MoreHorizontal, PlusCircle } from 'lucide-react'
import { useState } from 'react'
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table'
import { Badge } from '@/components/ui/badge'
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu'
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from '@/components/ui/dialog'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select'
import { Textarea } from '@/components/ui/textarea'

const initialMeasurements = [
  {
    id: 'MED-001',
    riskId: 'INV-001',
    riskName: 'Ruído Contínuo',
    technique: 'Dosimetria de Ruído - NHO-01',
    equipment: 'Dosímetro de ruído Marca-X, Mod-Y',
    result: '87.5 dB(A)',
    toleranceLimit: '85 dB(A)',
    date: '2024-07-10',
    status: 'Acima do Limite',
  },
  {
    id: 'MED-002',
    riskId: 'INV-003',
    riskName: 'Iluminamento Inadequado',
    technique: 'Luxímetro - NHO-11',
    equipment: 'Luxímetro Marca-A, Mod-B',
    result: '450 lux',
    toleranceLimit: '500 lux (Mínimo)',
    date: '2024-07-12',
    status: 'Abaixo do Limite',
  },
]

type Measurement = (typeof initialMeasurements)[0]

export default function PgrMeasurementsPage() {
  const [measurements, setMeasurements] = useState(initialMeasurements)
  const [isDialogOpen, setIsDialogOpen] = useState(false)

  const handleAddMeasurement = (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault()
    const formData = new FormData(event.currentTarget)
    const newItem: Measurement = {
      id: `MED-${Math.random().toString(36).substr(2, 4).toUpperCase()}`,
      riskId: formData.get('riskId') as string,
      riskName: 'Poeira Respirável', // Mock
      technique: formData.get('technique') as string,
      equipment: formData.get('equipment') as string,
      result: formData.get('result') as string,
      toleranceLimit: formData.get('toleranceLimit') as string,
      date: formData.get('date') as string,
      status: 'Conforme', // Simplified status
    }
    setMeasurements((prev) => [newItem, ...prev])
    setIsDialogOpen(false)
    ;(event.target as HTMLFormElement).reset()
  }

  const getStatusVariant = (status: string) => {
    if (status.includes('Acima') || status.includes('Abaixo'))
      return 'destructive'
    return 'secondary'
  }

  return (
    <Card>
      <CardHeader>
        <CardTitle className='flex items-center justify-between'>
          Avaliações Quantitativas
          <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
            <DialogTrigger asChild>
              <Button size='sm' className='h-8 gap-1'>
                <PlusCircle className='h-3.5 w-3.5' />
                <span className='sr-only sm:not-sr-only sm:whitespace-nowrap'>
                  Registrar Medição
                </span>
              </Button>
            </DialogTrigger>
            <DialogContent className='sm:max-w-2xl'>
              <DialogHeader>
                <DialogTitle>Registrar Avaliação de Ruído</DialogTitle>
                <DialogDescription>
                  Insira os dados da dosimetria de ruído realizada em campo.
                </DialogDescription>
              </DialogHeader>
              <form id='add-measurement-form' onSubmit={handleAddMeasurement}>
                <div className='grid gap-4 py-4'>
                  <div className='space-y-2'>
                    <Label htmlFor='riskId'>Risco Associado (do Inventário)</Label>
                    <Select name='riskId' required defaultValue='INV-001'>
                      <SelectTrigger>
                        <SelectValue placeholder='Selecione o risco...' />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value='INV-001'>
                          INV-001 - Ruído Contínuo
                        </SelectItem>
                        <SelectItem value='INV-002'>
                          INV-002 - Levantamento de Peso (Qualitativo)
                        </SelectItem>
                        <SelectItem value='INV-003'>
                          INV-003 - Iluminamento Inadequado
                        </SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                  <div className='grid grid-cols-2 gap-4'>
                    <div className='space-y-2'>
                      <Label htmlFor='technique'>Técnica/Norma</Label>
                      <Input
                        id='technique'
                        name='technique'
                        defaultValue='NHO-01 - Dosimetria de Ruído'
                        required
                      />
                    </div>
                     <div className='space-y-2'>
                      <Label htmlFor='date'>Data da Coleta</Label>
                      <Input
                        id='date'
                        name='date'
                        type='date'
                        required
                      />
                    </div>
                  </div>
                   <div className='space-y-2'>
                      <Label htmlFor='equipment'>Equipamento Utilizado</Label>
                      <Input
                        id='equipment'
                        name='equipment'
                        placeholder='Ex: Dosímetro de ruído Marca, Modelo, Série'
                        required
                      />
                    </div>
                  <div className='grid grid-cols-2 gap-4'>
                    <div className='space-y-2'>
                      <Label htmlFor='result'>Resultado (NE)</Label>
                      <Input
                        id='result'
                        name='result'
                        placeholder='Ex: 87.5 dB(A)'
                        required
                      />
                    </div>
                    <div className='space-y-2'>
                      <Label htmlFor='toleranceLimit'>Limite de Tolerância</Label>
                      <Input
                        id='toleranceLimit'
                        name='toleranceLimit'
                        defaultValue='85 dB(A)'
                        required
                      />
                    </div>
                  </div>
                </div>
                <DialogFooter>
                  <Button
                    variant='outline'
                    onClick={() => setIsDialogOpen(false)}
                  >
                    Cancelar
                  </Button>
                  <Button type='submit' form='add-measurement-form'>
                    Salvar Medição
                  </Button>
                </DialogFooter>
              </form>
            </DialogContent>
          </Dialog>
        </CardTitle>
        <CardDescription>
          Registre e acompanhe as medições e avaliações quantitativas dos
          agentes de risco.
        </CardDescription>
      </CardHeader>
      <CardContent>
        {measurements.length > 0 ? (
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Risco Avaliado</TableHead>
                <TableHead>Resultado</TableHead>
                <TableHead>Status</TableHead>
                <TableHead>Data</TableHead>
                <TableHead>
                  <span className='sr-only'>Ações</span>
                </TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {measurements.map((item) => (
                <TableRow key={item.id}>
                  <TableCell className='font-medium'>
                    <p>{item.riskName}</p>
                    <p className='text-xs text-muted-foreground'>
                      Risco: {item.riskId}
                    </p>
                  </TableCell>
                  <TableCell>
                    <p>{item.result}</p>
                     <p className='text-xs text-muted-foreground'>
                      Limite: {item.toleranceLimit}
                    </p>
                  </TableCell>
                  <TableCell>
                    <Badge variant={getStatusVariant(item.status)}>
                      {item.status}
                    </Badge>
                  </TableCell>
                  <TableCell>{item.date}</TableCell>
                  <TableCell className='text-right'>
                    <DropdownMenu>
                      <DropdownMenuTrigger asChild>
                        <Button size='icon' variant='ghost'>
                          <MoreHorizontal className='h-4 w-4' />
                        </Button>
                      </DropdownMenuTrigger>
                      <DropdownMenuContent>
                        <DropdownMenuItem>Ver Detalhes</DropdownMenuItem>
                        <DropdownMenuItem>Anexar Laudo</DropdownMenuItem>
                      </DropdownMenuContent>
                    </DropdownMenu>
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        ) : (
          <div className='flex flex-1 items-center justify-center rounded-lg border border-dashed shadow-sm h-96'>
            <div className='flex flex-col items-center gap-1 text-center'>
              <h3 className='text-2xl font-bold tracking-tight'>
                Nenhuma medição registrada
              </h3>
              <p className='text-sm text-muted-foreground'>
                Comece registrando a primeira avaliação quantitativa.
              </p>
              <Button className='mt-4' onClick={() => setIsDialogOpen(true)}>
                Registrar Medição
              </Button>
            </div>
          </div>
        )}
      </CardContent>
    </Card>
  )
}
