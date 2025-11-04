'use client'

import { useState } from 'react'
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from '@/components/ui/card'
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table'
import { Badge } from '@/components/ui/badge'
import { Button } from '@/components/ui/button'
import { MoreHorizontal, PlusCircle, Upload } from 'lucide-react'
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu'
import { useParams } from 'next/navigation'
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
import { Textarea } from '@/components/ui/textarea'
import { useToast } from '@/hooks/use-toast'
import { initialClientsData } from '@/app/dashboard/(main)/clients/page'
import {
  useTicketStore,
  type Ticket,
} from '@/app/dashboard/(main)/tickets/tickets-store'
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select'

const statusVariant = {
  Aberto: 'default',
  'Em Progresso': 'secondary',
  Resolvido: 'outline',
  Fechado: 'outline',
} as const

const getClientById = (contractId: string) => {
  return initialClientsData.find((client) => client.contractId === contractId)
}

export default function ClientTicketsPage() {
  const params = useParams()
  const contractId = params.contractId as string
  const client = getClientById(contractId)

  const { tickets, addTicket } = useTicketStore()
  const clientTickets = tickets.filter((ticket) => ticket.client === client?.name)

  const { toast } = useToast()
  const [isDialogOpen, setIsDialogOpen] = useState(false)

  const handleNewTicket = (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault()
    const formData = new FormData(event.currentTarget)

    addTicket({
      subject: formData.get('subject') as string,
      client: client?.name || 'Cliente Desconhecido',
      priority: formData.get('priority') as Ticket['priority'],
      description: formData.get('description') as string,
    })

    toast({
      title: 'Chamado Enviado com Sucesso!',
      description:
        'Sua solicitação foi registrada e nossa equipe entrará em contato em breve.',
    })
    setIsDialogOpen(false)
  }

  return (
    <Card>
      <CardHeader>
        <div className='flex items-center justify-between'>
          <div>
            <CardTitle>Meus Chamados</CardTitle>
            <CardDescription>
              Acompanhe o status e o histórico de suas solicitações de serviço.
            </CardDescription>
          </div>
          <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
            <DialogTrigger asChild>
              <Button>
                <PlusCircle className='mr-2 h-4 w-4' />
                Abrir Novo Chamado
              </Button>
            </DialogTrigger>
            <DialogContent className='sm:max-w-lg'>
              <DialogHeader>
                <DialogTitle>Abrir Novo Chamado de Serviço</DialogTitle>
                <DialogDescription>
                  Descreva sua solicitação ou problema. Nossa equipe responderá
                  o mais breve possível.
                </DialogDescription>
              </DialogHeader>
              <form id='new-ticket-form' onSubmit={handleNewTicket}>
                <div className='grid gap-4 py-4'>
                  <div className='space-y-2'>
                    <Label htmlFor='subject'>Assunto</Label>
                    <Input
                      id='subject'
                      name='subject'
                      placeholder='Ex: Problema com login'
                      required
                    />
                  </div>
                  <div className='space-y-2'>
                    <Label htmlFor='priority'>Prioridade</Label>
                    <Select name='priority' required defaultValue='Baixa'>
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
                    <Label htmlFor='description'>Descrição</Label>
                    <Textarea
                      id='description'
                      name='description'
                      placeholder='Detalhe sua solicitação aqui...'
                      required
                    />
                  </div>
                  <div className='space-y-2'>
                    <Label htmlFor='attachment'>Anexo (Opcional)</Label>
                    <div className='flex items-center gap-2'>
                      <Input
                        id='attachment'
                        name='attachment'
                        type='file'
                        className='flex-1'
                      />
                      <Button type='button' variant='ghost' size='icon'>
                        <Upload className='h-4 w-4' />
                      </Button>
                    </div>
                    <p className='text-xs text-muted-foreground'>
                      Você pode anexar uma imagem ou PDF.
                    </p>
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
                <Button type='submit' form='new-ticket-form'>
                  Enviar Chamado
                </Button>
              </DialogFooter>
            </DialogContent>
          </Dialog>
        </div>
      </CardHeader>
      <CardContent>
        {clientTickets.length > 0 ? (
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>ID do Chamado</TableHead>
                <TableHead>Assunto</TableHead>
                <TableHead>Status</TableHead>
                <TableHead>Última Atualização</TableHead>
                <TableHead>
                  <span className='sr-only'>Ações</span>
                </TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {clientTickets.map((ticket) => (
                <TableRow key={ticket.id}>
                  <TableCell className='font-medium'>{ticket.id}</TableCell>
                  <TableCell>{ticket.subject}</TableCell>
                  <TableCell>
                    <Badge
                      variant={
                        statusVariant[ticket.status as keyof typeof statusVariant]
                      }
                    >
                      {ticket.status}
                    </Badge>
                  </TableCell>
                  <TableCell>{ticket.updated}</TableCell>
                  <TableCell className='text-right'>
                    <DropdownMenu>
                      <DropdownMenuTrigger asChild>
                        <Button size='icon' variant='ghost'>
                          <MoreHorizontal className='h-4 w-4' />
                        </Button>
                      </DropdownMenuTrigger>
                      <DropdownMenuContent>
                        <DropdownMenuLabel>Ações</DropdownMenuLabel>
                        <DropdownMenuItem>Ver Detalhes</DropdownMenuItem>
                        <DropdownMenuItem>
                          Adicionar Comentário
                        </DropdownMenuItem>
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
                Nenhum chamado aberto
              </h3>
              <p className='text-sm text-muted-foreground'>
                Você ainda não abriu nenhum chamado de serviço.
              </p>
              <Button className='mt-4' onClick={() => setIsDialogOpen(true)}>
                Abrir Primeiro Chamado
              </Button>
            </div>
          </div>
        )}
      </CardContent>
    </Card>
  )
}
