'use client'

import { File, ListFilter, MoreHorizontal, PlusCircle } from 'lucide-react'
import { Badge } from '@/components/ui/badge'
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from '@/components/ui/card'
import {
  DropdownMenu,
  DropdownMenuCheckboxItem,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu'
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table'
import { Button } from '@/components/ui/button'
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from '@/components/ui/popover'
import { Calendar } from '@/components/ui/calendar'
import { Calendar as CalendarIcon } from 'lucide-react'
import { useState, useEffect } from 'react'
import { format } from 'date-fns'
import { ptBR } from 'date-fns/locale'
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

const initialEpiDeliveries = [
  {
    id: 'EPI-001',
    collaborator: 'João Silva',
    client: 'Innovate Inc.',
    epi: 'Protetor auricular tipo concha (CA: 12345)',
    deliveryDate: '2024-07-01',
    validity: '2025-07-01',
    status: 'Válido',
    deliveryFormId: 'FD-07-2024-001',
  },
  {
    id: 'EPI-002',
    collaborator: 'Maria Oliveira',
    client: 'Solutions Co.',
    epi: 'Luva de segurança (CA: 67890)',
    deliveryDate: '2024-01-15',
    validity: '2024-07-15',
    status: 'Vencido',
    deliveryFormId: 'FD-01-2024-002',
  },
  {
    id: 'EPI-003',
    collaborator: 'Carlos Pereira',
    client: 'Innovate Inc.',
    epi: 'Respirador purificador de ar (CA: 11223)',
    deliveryDate: '2024-06-20',
    validity: '2024-08-20',
    status: 'A vencer',
    deliveryFormId: 'FD-06-2024-003',
  },
  {
    id: 'EPI-004',
    collaborator: 'Ana Costa',
    client: 'Quantum Dynamics',
    epi: 'Óculos de proteção (CA: 98765)',
    deliveryDate: '2023-12-10',
    validity: '2024-12-10',
    status: 'Válido',
    deliveryFormId: 'FD-12-2023-004',
  },
]

const mockCollaborators = [
  'João Silva',
  'Maria Oliveira',
  'Carlos Pereira',
  'Ana Costa',
  'Pedro Martins',
]
const mockEpis = [
  { ca: '12345', name: 'Protetor auricular tipo concha' },
  {
    ca: '67890',
    name: 'Luva de segurança para proteção contra agentes mecânicos',
  },
  { ca: '11223', name: 'Respirador purificador de ar' },
  { ca: '98765', name: 'Óculos de proteção' },
]

const kpiData = [
  {
    title: 'EPIs Entregues (Mês)',
    value: '12',
    description: 'Total de entregas em Julho',
  },
  { title: 'EPIs a Vencer', value: '1', description: 'Nos próximos 30 dias' },
  { title: 'EPIs Vencidos', value: '1', description: 'Exige ação imediata' },
]

const getStatusVariant = (status: string) => {
  switch (status) {
    case 'Válido':
      return 'secondary'
    case 'A vencer':
      return 'default'
    case 'Vencido':
      return 'destructive'
    default:
      return 'outline'
  }
}

type EpiDelivery = (typeof initialEpiDeliveries)[0]

function FormattedDate({ dateString }: { dateString: string }) {
  const [formatted, setFormatted] = useState('')
  useEffect(() => {
    // The `new Date()` constructor can be inconsistent based on the string format and timezone.
    // Adding 'T00:00:00' makes it parse as local time, avoiding timezone shifts.
    setFormatted(format(new Date(`${dateString}T00:00:00`), 'dd/MM/yyyy'))
  }, [dateString])
  return <>{formatted}</>
}

export default function EpisPage() {
  const [date, setDate] = useState<Date | undefined>(new Date())
  const [deliveries, setDeliveries] = useState(initialEpiDeliveries)
  const [isDialogOpen, setIsDialogOpen] = useState(false)

  const handleAddDelivery = (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault()
    const formData = new FormData(event.currentTarget)
    const epiSelection = formData.get('epi') as string
    const selectedEpi = mockEpis.find((e) => e.ca === epiSelection)

    const newDelivery: EpiDelivery = {
      id: `EPI-${Math.random().toString(36).substr(2, 5).toUpperCase()}`,
      collaborator: formData.get('collaborator') as string,
      client: 'Innovate Inc.', // Mock client
      epi: `${selectedEpi?.name} (CA: ${selectedEpi?.ca})`,
      deliveryDate: formData.get('deliveryDate') as string,
      validity: formData.get('validity') as string,
      deliveryFormId: formData.get('deliveryFormId') as string,
      status: 'Válido', // Simplified status for new entries
    }
    setDeliveries((prev) => [newDelivery, ...prev])
    setIsDialogOpen(false)
  }

  return (
    <div className='grid flex-1 auto-rows-max gap-4'>
      <div className='grid gap-4 md:grid-cols-2 lg:grid-cols-3'>
        {kpiData.map((kpi, index) => (
          <Card key={index}>
            <CardHeader className='pb-2'>
              <CardTitle className='text-sm font-medium'>{kpi.title}</CardTitle>
            </CardHeader>
            <CardContent>
              <div className='text-2xl font-bold'>{kpi.value}</div>
              <p className='text-xs text-muted-foreground'>
                {kpi.description}
              </p>
            </CardContent>
          </Card>
        ))}
      </div>

      <Card>
        <CardHeader>
          <CardTitle>Histórico de Entrega de EPIs</CardTitle>
          <CardDescription>
            Registre e monitore todas as entregas de Equipamentos de Proteção
            Individual para este cliente.
          </CardDescription>
          <div className='flex items-center gap-2 pt-4'>
            <Popover>
              <PopoverTrigger asChild>
                <Button
                  variant='outline'
                  className='w-[240px] justify-start text-left font-normal'
                >
                  <CalendarIcon className='mr-2 h-4 w-4' />
                  {date ? (
                    format(date, "MMMM 'de' yyyy", { locale: ptBR })
                  ) : (
                    <span>Selecione o mês</span>
                  )}
                </Button>
              </PopoverTrigger>
              <PopoverContent className='w-auto p-0' align='start'>
                <Calendar
                  mode='single'
                  selected={date}
                  onSelect={setDate}
                  initialFocus
                />
              </PopoverContent>
            </Popover>
            <div className='ml-auto flex items-center gap-2'>
              <Button size='sm' variant='outline' className='h-8 gap-1'>
                <File className='h-3.5 w-3.5' />
                <span className='sr-only sm:not-sr-only sm:whitespace-nowrap'>
                  Exportar
                </span>
              </Button>
              <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
                <DialogTrigger asChild>
                  <Button size='sm' className='h-8 gap-1'>
                    <PlusCircle className='h-3.5 w-3.5' />
                    <span className='sr-only sm:not-sr-only sm:whitespace-nowrap'>
                      Registrar Entrega
                    </span>
                  </Button>
                </DialogTrigger>
                <DialogContent>
                  <DialogHeader>
                    <DialogTitle>Registrar Entrega de EPI</DialogTitle>
                    <DialogDescription>
                      Preencha as informações da entrega do equipamento.
                    </DialogDescription>
                  </DialogHeader>
                  <form id='add-delivery-form' onSubmit={handleAddDelivery}>
                    <div className='grid gap-4 py-4'>
                      <div className='grid grid-cols-4 items-center gap-4'>
                        <Label htmlFor='collaborator' className='text-right'>
                          Colaborador
                        </Label>
                        <Select name='collaborator' required>
                          <SelectTrigger className='col-span-3'>
                            <SelectValue placeholder='Selecione o colaborador' />
                          </SelectTrigger>
                          <SelectContent>
                            {mockCollaborators.map((c) => (
                              <SelectItem key={c} value={c}>
                                {c}
                              </SelectItem>
                            ))}
                          </SelectContent>
                        </Select>
                      </div>
                      <div className='grid grid-cols-4 items-center gap-4'>
                        <Label htmlFor='epi' className='text-right'>
                          EPI
                        </Label>
                        <Select name='epi' required>
                          <SelectTrigger className='col-span-3'>
                            <SelectValue placeholder='Selecione o EPI' />
                          </SelectTrigger>
                          <SelectContent>
                            {mockEpis.map((e) => (
                              <SelectItem key={e.ca} value={e.ca}>
                                {e.name} (CA: {e.ca})
                              </SelectItem>
                            ))}
                          </SelectContent>
                        </Select>
                      </div>
                      <div className='grid grid-cols-4 items-center gap-4'>
                        <Label htmlFor='deliveryDate' className='text-right'>
                          Data da Entrega
                        </Label>
                        <Input
                          id='deliveryDate'
                          name='deliveryDate'
                          type='date'
                          className='col-span-3'
                          required
                        />
                      </div>
                      <div className='grid grid-cols-4 items-center gap-4'>
                        <Label htmlFor='validity' className='text-right'>
                          Validade
                        </Label>
                        <Input
                          id='validity'
                          name='validity'
                          type='date'
                          className='col-span-3'
                          required
                        />
                      </div>
                      <div className='grid grid-cols-4 items-center gap-4'>
                        <Label htmlFor='deliveryFormId' className='text-right'>
                          Nº da Ficha
                        </Label>
                        <Input
                          id='deliveryFormId'
                          name='deliveryFormId'
                          className='col-span-3'
                          required
                        />
                      </div>
                    </div>
                  </form>
                  <DialogFooter>
                    <Button
                      variant='outline'
                      onClick={() => setIsDialogOpen(false)}
                    >
                      Cancelar
                    </Button>
                    <Button type='submit' form='add-delivery-form'>
                      Salvar Registro
                    </Button>
                  </DialogFooter>
                </DialogContent>
              </Dialog>
            </div>
          </div>
        </CardHeader>
        <CardContent>
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Colaborador</TableHead>
                <TableHead>EPI (CA)</TableHead>
                <TableHead>Data de Entrega</TableHead>
                <TableHead>Validade</TableHead>
                <TableHead>Status</TableHead>
                <TableHead>
                  <span className='sr-only'>Ações</span>
                </TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {deliveries.map((delivery) => (
                <TableRow key={delivery.id}>
                  <TableCell className='font-medium'>
                    {delivery.collaborator}
                  </TableCell>
                  <TableCell>{delivery.epi}</TableCell>
                  <TableCell>
                    <FormattedDate dateString={delivery.deliveryDate} />
                  </TableCell>
                  <TableCell>
                    <FormattedDate dateString={delivery.validity} />
                  </TableCell>
                  <TableCell>
                    <Badge variant={getStatusVariant(delivery.status)}>
                      {delivery.status}
                    </Badge>
                  </TableCell>
                  <TableCell>
                    <DropdownMenu>
                      <DropdownMenuTrigger asChild>
                        <Button aria-haspopup='true' size='icon' variant='ghost'>
                          <MoreHorizontal className='h-4 w-4' />
                          <span className='sr-only'>Toggle menu</span>
                        </Button>
                      </DropdownMenuTrigger>
                      <DropdownMenuContent align='end'>
                        <DropdownMenuLabel>Ações</DropdownMenuLabel>
                        <DropdownMenuItem>
                          Ver Ficha de Entrega
                        </DropdownMenuItem>
                        <DropdownMenuItem>Editar Registro</DropdownMenuItem>
                        <DropdownMenuSeparator />
                        <DropdownMenuItem className='text-destructive'>
                          Excluir
                        </DropdownMenuItem>
                      </DropdownMenuContent>
                    </DropdownMenu>
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </CardContent>
      </Card>
    </div>
  )
}
