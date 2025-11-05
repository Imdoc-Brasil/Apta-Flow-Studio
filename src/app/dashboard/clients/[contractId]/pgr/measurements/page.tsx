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
import { useState, useMemo } from 'react'
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
import { initialInventory } from '@/app/dashboard/clients/[contractId]/pgr/inventory/page'
import { initialHazardData } from '@/app/dashboard/(main)/risks/page'

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
  const [selectedRiskId, setSelectedRiskId] = useState<string>('')

  const selectedInventoryItem = useMemo(
    () => initialInventory.find((item) => item.id === selectedRiskId),
    [selectedRiskId]
  )

  const selectedRiskCatalogItem = useMemo(
    () =>
      initialHazardData.find(
        (item) => item.esocialCode === selectedInventoryItem?.riskEsocialCode
      ),
    [selectedInventoryItem]
  )

  const handleAddMeasurement = (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault()
    const formData = new FormData(event.currentTarget)
    const riskId = formData.get('riskId') as string
    const riskName =
      initialInventory.find((item) => item.id === riskId)?.risk || 'N/A'

    const newItem: Measurement = {
      id: `MED-${Math.random().toString(36).substr(2, 4).toUpperCase()}`,
      riskId: riskId,
      riskName: riskName,
      technique: formData.get('technique') as string,
      equipment: formData.get('equipment') as string,
      result: formData.get('result') as string,
      toleranceLimit: formData.get('toleranceLimit') as string,
      date: formData.get('date') as string,
      status: 'Conforme', // Simplified status
    }
    setMeasurements((prev) => [newItem, ...prev])
    setIsDialogOpen(false)
    setSelectedRiskId('')
    ;(event.target as HTMLFormElement).reset()
  }

  const getStatusVariant = (status: string) => {
    if (status.includes('Acima') || status.includes('Abaixo'))
      return 'destructive'
    return 'secondary'
  }

  const renderDynamicFormFields = () => {
    if (!selectedRiskCatalogItem) {
      return (
        <p className='text-sm text-muted-foreground text-center col-span-2'>
          Selecione um risco para ver os campos específicos da avaliação.
        </p>
      )
    }

    switch (selectedRiskCatalogItem.category) {
      case 'Físico': // Assuming Noise is 'Físico'
        return (
          <>
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
          </>
        )
      case 'Químico':
        return (
          <>
            <div className='grid grid-cols-2 gap-4'>
              <div className='space-y-2'>
                <Label htmlFor='collectionTechnique'>Técnica de Coleta</Label>
                <Input
                  id='collectionTechnique'
                  name='collectionTechnique'
                  placeholder='Ex: Bomba de amostragem'
                  required
                />
              </div>
              <div className='space-y-2'>
                <Label htmlFor='lab'>Laboratório Responsável</Label>
                <Input id='lab' name='lab' placeholder='Nome do Laboratório' required />
              </div>
            </div>
            <div className='grid grid-cols-3 gap-4'>
              <div className='space-y-2'>
                <Label htmlFor='flowRate'>Vazão (L/min)</Label>
                <Input id='flowRate' name='flowRate' type='number' step='0.01' required />
              </div>
              <div className='space-y-2'>
                <Label htmlFor='collectionTime'>Tempo (min)</Label>
                <Input id='collectionTime' name='collectionTime' type='number' required />
              </div>
              <div className='space-y-2'>
                <Label htmlFor='volume'>Volume (L)</Label>
                <Input id='volume' name='volume' type='number' step='0.01' readOnly />
              </div>
            </div>
            <div className='grid grid-cols-2 gap-4'>
               <div className='space-y-2'>
                <Label htmlFor='result'>Resultado</Label>
                <Input id='result' name='result' placeholder='Ex: 0.025 mg/m³' required />
              </div>
               <div className='space-y-2'>
                <Label htmlFor='toleranceLimit'>Limite de Tolerância</Label>
                <Input id='toleranceLimit' name='toleranceLimit' placeholder='Ex: 0.05 mg/m³' required />
              </div>
            </div>
          </>
        )
      default:
        return (
           <div className='space-y-2 col-span-2'>
              <Label htmlFor='result'>Resultado</Label>
              <Textarea
                id='result'
                name='result'
                placeholder='Descreva o resultado da avaliação...'
                required
              />
            </div>
        )
    }
  }

  return (
    <Card>
      <CardHeader>
        <CardTitle className='flex items-center justify-between'>
          Avaliações Quantitativas
          <Dialog
            open={isDialogOpen}
            onOpenChange={(isOpen) => {
              setIsDialogOpen(isOpen)
              if (!isOpen) setSelectedRiskId('')
            }}
          >
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
                <DialogTitle>Registrar Avaliação Quantitativa</DialogTitle>
                <DialogDescription>
                  Insira os dados da medição realizada em campo.
                </DialogDescription>
              </DialogHeader>
              <form id='add-measurement-form' onSubmit={handleAddMeasurement}>
                <div className='grid gap-4 py-4'>
                  <div className='grid grid-cols-2 gap-4'>
                    <div className='space-y-2'>
                      <Label htmlFor='riskId'>
                        Risco Associado (do Inventário)
                      </Label>
                      <Select
                        name='riskId'
                        required
                        value={selectedRiskId}
                        onValueChange={setSelectedRiskId}
                      >
                        <SelectTrigger>
                          <SelectValue placeholder='Selecione o risco...' />
                        </SelectTrigger>
                        <SelectContent>
                          {initialInventory.map((item) => (
                            <SelectItem key={item.id} value={item.id}>
                              {item.id} - {item.risk} ({item.exposureTarget})
                            </SelectItem>
                          ))}
                        </SelectContent>
                      </Select>
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
                  <div className='border-t my-4' />
                  {renderDynamicFormFields()}
                </div>
                <DialogFooter>
                  <Button
                    type='button'
                    variant='outline'
                    onClick={() => {
                      setIsDialogOpen(false)
                      setSelectedRiskId('')
                    }}
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
