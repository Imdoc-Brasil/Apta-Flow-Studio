
'use client'

import { useState, useEffect } from 'react'
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog'
import { Button } from '@/components/ui/button'
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
import { useToast } from '@/hooks/use-toast'
import type { Client } from '@/lib/types/client'
import {
  addDocumentNonBlocking,
  useCollection,
  useFirestore,
  useMemoFirebase,
} from '@/firebase'
import { CollectionReference, collection } from 'firebase/firestore'
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from '@/components/ui/popover'
import { Checkbox } from '@/components/ui/checkbox'
import { ScrollArea } from '@/components/ui/scroll-area'
import type {
  Ticket,
  Label as LabelType,
  TicketStatus,
} from '@/lib/types/ticket'
import { availableLabels } from '@/app/dashboard/(main)/tickets/data'
import { UserPlus, Tag } from 'lucide-react'
import type { Staff } from '@/lib/types/staff'

interface AddTicketDialogProps {
  open: boolean
  onOpenChange: (open: boolean) => void
  clientsData: Client[] | null
  ticketsRef: CollectionReference | null
}

export function AddTicketDialog({
  open,
  onOpenChange,
  clientsData,
  ticketsRef,
}: AddTicketDialogProps) {
  const { toast } = useToast()
  const [selectedLabels, setSelectedLabels] = useState<LabelType[]>([])
  const [assignedTo, setAssignedTo] = useState<string[]>([])
  const firestore = useFirestore()

  const { data: staffs } = useCollection<Staff>(
    useMemoFirebase(
      () => (firestore ? collection(firestore, 'staffs') : null),
      [firestore]
    )
  )

  useEffect(() => {
    // Reset local state when dialog is closed
    if (!open) {
      setSelectedLabels([])
      setAssignedTo([])
    }
  }, [open])

  const handleAddTicket = (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault()
    if (!ticketsRef) return

    const formData = new FormData(event.currentTarget)
    const subject = formData.get('subject') as string
    const clientName = formData.get('client') as string
    const relatedEmployeeId = formData.get('relatedEmployee') as string

    const newTicketData: Omit<Ticket, 'id' | 'status' | 'updated'> = {
      subject,
      client: clientName,
      priority: formData.get('priority') as Ticket['priority'],
      description: (formData.get('description') as string) || '',
      labels: selectedLabels,
      assignedTo: assignedTo,
      relatedEmployee: relatedEmployeeId,
      createdAt: new Date().toISOString(),
    }

    // Add status and updated timestamp for new tickets
    const finalTicketData = {
      ...newTicketData,
      status: 'Aberto' as TicketStatus,
      updated: new Date().toISOString(),
    }

    addDocumentNonBlocking(ticketsRef, finalTicketData)

    onOpenChange(false)
    toast({
      title: 'Ticket Criado!',
      description: 'A nova solicitação de serviço foi registrada.',
    })
  }

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className='sm:max-w-2xl'>
        <DialogHeader>
          <DialogTitle>Abrir Novo Ticket</DialogTitle>
          <DialogDescription>
            Preencha as informações abaixo para registrar uma nova solicitação
            de serviço.
          </DialogDescription>
        </DialogHeader>
        <form id='add-ticket-form' onSubmit={handleAddTicket}>
          <ScrollArea className='h-[60vh]'>
            <div className='grid gap-4 py-4 px-6'>
              <div className='space-y-2'>
                <Label htmlFor='client'>Cliente</Label>
                <Select name='client' required>
                  <SelectTrigger>
                    <SelectValue placeholder='Selecione o cliente' />
                  </SelectTrigger>
                  <SelectContent>
                    {clientsData?.map((client) => (
                      <SelectItem key={client.id} value={client.name}>
                        {client.name}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
              <div className='space-y-2'>
                <Label htmlFor='relatedEmployee'>
                  Colaborador Relacionado (Opcional)
                </Label>
                <Input
                  name='relatedEmployee'
                  placeholder='Nome do colaborador do cliente'
                />
              </div>
              <div className='space-y-2'>
                <Label htmlFor='subject'>Assunto</Label>
                <Input id='subject' name='subject' required />
              </div>
              <div className='space-y-2'>
                <Label htmlFor='priority'>Prioridade</Label>
                <Select name='priority' required>
                  <SelectTrigger>
                    <SelectValue placeholder='Selecione a prioridade' />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value='Baixa'>Baixa</SelectItem>
                    <SelectItem value='Média'>Média</SelectItem>
                    <SelectItem value='Alta'>Alta</SelectItem>
                  </SelectContent>
                </Select>
              </div>
              <div className='space-y-2'>
                <Label>Atribuir a</Label>
                <Popover>
                  <PopoverTrigger asChild>
                    <Button
                      variant='outline'
                      className='w-full justify-start font-normal'
                    >
                      <UserPlus className='mr-2' />
                      {assignedTo.length > 0
                        ? `${assignedTo.length} membro(s) selecionado(s)`
                        : 'Selecione membros'}
                    </Button>
                  </PopoverTrigger>
                  <PopoverContent className='w-80'>
                    <div className='grid gap-4'>
                      <h4 className='font-medium leading-none'>Membros</h4>
                      <ScrollArea className='h-48'>
                        <div className='flex flex-col gap-2 p-1'>
                          {staffs?.map((staff) => {
                            const isAssigned = assignedTo.includes(staff.email)
                            return (
                              <Label
                                key={staff.email}
                                className='flex items-center gap-2 font-normal'
                              >
                                <Checkbox
                                  checked={isAssigned}
                                  onCheckedChange={(checked) => {
                                    setAssignedTo((prev) =>
                                      checked
                                        ? [...prev, staff.email]
                                        : prev.filter(
                                            (email) => email !== staff.email
                                          )
                                    )
                                  }}
                                />
                                {staff.name}
                              </Label>
                            )
                          })}
                        </div>
                      </ScrollArea>
                    </div>
                  </PopoverContent>
                </Popover>
              </div>
              <div className='space-y-2'>
                <Label>Etiquetas</Label>
                <Popover>
                  <PopoverTrigger asChild>
                    <Button
                      variant='outline'
                      className='w-full justify-start font-normal'
                    >
                      <Tag className='mr-2' />
                      {selectedLabels.length > 0
                        ? `${selectedLabels.length} etiqueta(s) selecionada(s)`
                        : 'Selecione etiquetas'}
                    </Button>
                  </PopoverTrigger>
                  <PopoverContent className='w-64'>
                    <div className='grid gap-4'>
                      <h4 className='font-medium leading-none'>Etiquetas</h4>
                      <div className='flex flex-col gap-2'>
                        {availableLabels.map((label) => {
                          const isChecked = selectedLabels.some(
                            (l) => l.id === label.id
                          )
                          return (
                            <Label
                              key={label.id}
                              className='flex items-center gap-2 font-normal'
                            >
                              <Checkbox
                                checked={isChecked}
                                onCheckedChange={(checked) =>
                                  setSelectedLabels((prev) =>
                                    checked
                                      ? [...prev, label]
                                      : prev.filter((l) => l.id !== label.id)
                                  )
                                }
                              />
                              <span
                                className={`px-2 py-0.5 text-xs rounded-full text-white ${label.color}`}
                              >
                                {label.name}
                              </span>
                            </Label>
                          )
                        })}
                      </div>
                    </div>
                  </PopoverContent>
                </Popover>
              </div>
              <div className='space-y-2'>
                <Label htmlFor='description'>Descrição</Label>
                <Textarea
                  id='description'
                  name='description'
                  placeholder='Detalhe a solicitação...'
                />
              </div>
            </div>
          </ScrollArea>
        </form>
        <DialogFooter>
          <Button variant='outline' onClick={() => onOpenChange(false)}>
            Cancelar
          </Button>
          <Button type='submit' form='add-ticket-form'>
            Salvar Ticket
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  )
}
