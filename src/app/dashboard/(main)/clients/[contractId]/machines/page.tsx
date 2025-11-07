'use client'

import { useState } from 'react'
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { MoreHorizontal, PlusCircle, Search, Factory } from 'lucide-react'
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table'
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
  DialogFooter,
} from '@/components/ui/dialog'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Textarea } from '@/components/ui/textarea'
import { useToast } from '@/hooks/use-toast'
import { initialMachinesData, type Machine } from './data'
import { Checkbox } from '@/components/ui/checkbox'

export default function MachinesPage() {
  const [machines, setMachines] = useState(initialMachinesData)
  const [isFormOpen, setIsFormOpen] = useState(false)
  const [editingMachine, setEditingMachine] = useState<Machine | null>(null)
  const { toast } = useToast()

  const handleFormSubmit = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault()
    const formData = new FormData(e.currentTarget)
    const machineId = editingMachine ? editingMachine.id : `MAC-${Date.now()}`

    const updatedMachine: Machine = {
      id: machineId,
      name: formData.get('name') as string,
      manufacturer: formData.get('manufacturer') as string,
      model: formData.get('model') as string,
      function: formData.get('function') as string,
      isRiskSource: formData.get('isRiskSource') === 'on',
      riskDescription: formData.get('riskDescription') as string,
      maintenanceInfo: formData.get('maintenanceInfo') as string,
    }

    if (editingMachine) {
      setMachines((prev) =>
        prev.map((m) => (m.id === machineId ? updatedMachine : m))
      )
      toast({ title: 'Sucesso!', description: 'Máquina atualizada.' })
    } else {
      setMachines((prev) => [updatedMachine, ...prev])
      toast({ title: 'Sucesso!', description: 'Máquina adicionada.' })
    }

    setIsFormOpen(false)
    setEditingMachine(null)
  }

  const openFormDialog = (machine: Machine | null) => {
    setEditingMachine(machine)
    setIsFormOpen(true)
  }

  return (
    <>
      <Card>
        <CardHeader>
          <CardTitle>Máquinas e Equipamentos (NR-12)</CardTitle>
          <CardDescription>
            Inventário de todas as máquinas e equipamentos da empresa.
          </CardDescription>
          <div className='flex items-center justify-between pt-4'>
            <div className='relative w-full max-w-sm'>
              <Search className='absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground' />
              <Input
                type='search'
                placeholder='Buscar por nome ou modelo...'
                className='pl-8'
              />
            </div>
            <Button
              size='sm'
              className='h-8 gap-1'
              onClick={() => openFormDialog(null)}
            >
              <PlusCircle className='h-3.5 w-3.5' />
              <span className='sr-only sm:not-sr-only sm:whitespace-nowrap'>
                Adicionar Equipamento
              </span>
            </Button>
          </div>
        </CardHeader>
        <CardContent>
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Equipamento</TableHead>
                <TableHead>Função</TableHead>
                <TableHead>Fonte de Risco</TableHead>
                <TableHead>
                  <span className='sr-only'>Ações</span>
                </TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {machines.map((machine) => (
                <TableRow
                  key={machine.id}
                  onClick={() => openFormDialog(machine)}
                  className='cursor-pointer'
                >
                  <TableCell className='font-medium'>{machine.name}</TableCell>
                  <TableCell>
                    <p className='line-clamp-1 text-sm text-muted-foreground'>
                      {machine.function}
                    </p>
                  </TableCell>
                  <TableCell>
                    {machine.isRiskSource ? (
                      <span className='text-destructive font-semibold'>Sim</span>
                    ) : (
                      'Não'
                    )}
                  </TableCell>
                  <TableCell>
                    <Button aria-haspopup='true' size='icon' variant='ghost'>
                      <MoreHorizontal className='h-4 w-4' />
                      <span className='sr-only'>Alternar menu</span>
                    </Button>
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </CardContent>
      </Card>
      <Dialog open={isFormOpen} onOpenChange={setIsFormOpen}>
        <DialogContent className='sm:max-w-xl'>
          <DialogHeader>
            <DialogTitle>
              {editingMachine ? 'Editar' : 'Adicionar'} Equipamento
            </DialogTitle>
          </DialogHeader>
          <form id='machine-form' onSubmit={handleFormSubmit}>
            <div className='grid gap-4 py-4'>
              <div className='space-y-2'>
                <Label htmlFor='name'>Nome do Equipamento</Label>
                <Input
                  id='name'
                  name='name'
                  defaultValue={editingMachine?.name}
                  placeholder='Ex: Parafusadeira de Impacto'
                  required
                />
              </div>
              <div className='grid grid-cols-2 gap-4'>
                <div className='space-y-2'>
                  <Label htmlFor='manufacturer'>Fabricante</Label>
                  <Input
                    id='manufacturer'
                    name='manufacturer'
                    defaultValue={editingMachine?.manufacturer}
                  />
                </div>
                <div className='space-y-2'>
                  <Label htmlFor='model'>Modelo</Label>
                  <Input id='model' name='model' defaultValue={editingMachine?.model} />
                </div>
              </div>
              <div className='space-y-2'>
                <Label htmlFor='function'>Função / Destinação</Label>
                <Textarea
                  id='function'
                  name='function'
                  defaultValue={editingMachine?.function}
                  placeholder='Descreva para que serve este equipamento.'
                />
              </div>
              <div className='space-y-2'>
                <Label htmlFor='maintenanceInfo'>
                  Informações de Manutenção/Conservação
                </Label>
                <Textarea
                  id='maintenanceInfo'
                  name='maintenanceInfo'
                  defaultValue={editingMachine?.maintenanceInfo}
                  placeholder='Descreva as recomendações do fabricante.'
                />
              </div>
              <div className='space-y-2 border-t pt-4'>
                 <div className='flex items-center space-x-2'>
                    <Checkbox id='isRiskSource' name='isRiskSource' defaultChecked={editingMachine?.isRiskSource}/>
                    <Label htmlFor='isRiskSource' className='font-semibold'>É uma fonte geradora de riscos?</Label>
                 </div>
                 <Textarea 
                    name='riskDescription' 
                    defaultValue={editingMachine?.riskDescription}
                    placeholder='Se sim, descreva os riscos (Ex: Ruído, Vibração, Risco de Esmagamento...)'
                 />
              </div>
            </div>
          </form>
          <DialogFooter>
            <Button
              variant='outline'
              onClick={() => {
                setIsFormOpen(false)
                setEditingMachine(null)
              }}
            >
              Cancelar
            </Button>
            <Button type='submit' form='machine-form'>
              Salvar
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </>
  )
}
