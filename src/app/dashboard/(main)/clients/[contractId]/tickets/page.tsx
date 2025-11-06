'use client'

import { useState, useEffect } from 'react'
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
import {
  MoreHorizontal,
  PlusCircle,
  Upload,
  AlignLeft,
  UserPlus,
  Tag,
  Calendar,
  Paperclip,
  Clock,
  Flag,
  CheckSquare,
  Plus,
  X,
  File as FileIcon,
  FileText,
  MessageSquare,
  HelpCircle,
} from 'lucide-react'
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu'
import { useParams, useSearchParams } from 'next/navigation'
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
import { initialClientsData } from '@/app/dashboard/(main)/clients/data'
import {
  useTicketStore,
  type Ticket,
  availableLabels,
  type Label as LabelType,
  type Checklist,
  type ChecklistItem,
  type Attachment,
  type TextElement,
} from '@/app/dashboard/(main)/tickets/tickets-store'
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select'
import { format, formatDistanceToNow, parseISO } from 'date-fns'
import { ptBR } from 'date-fns/locale'
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar'
import { initialStaffsData } from '@/app/dashboard/(main)/employees/page'
import { initialEmployeesData } from '../employees/data'
import type { Employee } from '../employees/data'
import { Separator } from '@/components/ui/separator'
import { Progress } from '@/components/ui/progress'
import { Checkbox } from '@/components/ui/checkbox'

const statusVariant = {
  Aberto: 'default',
  'Em Progresso': 'secondary',
  Resolvido: 'outline',
  Fechado: 'outline',
} as const

const priorityVariant = {
  Alta: 'destructive',
  Média: 'default',
  Baixa: 'secondary',
} as const

const getClientById = (contractId: string) => {
  return initialClientsData.find((client) => client.contractId === contractId)
}

function TimeAgo({ dateString }: { dateString: string }) {
  const [timeAgo, setTimeAgo] = useState('')

  useEffect(() => {
    const date = new Date(dateString)
    setTimeAgo(formatDistanceToNow(date, { addSuffix: true, locale: ptBR }))
  }, [dateString])

  if (!timeAgo) return null

  return <>{timeAgo}</>
}

function AddAttachmentDialog({
  ticketId,
  children,
}: {
  ticketId: string
  children: React.ReactNode
}) {
  const [open, setOpen] = useState(false)
  const { addAttachment } = useTicketStore()
  const { toast } = useToast()
  const [file, setFile] = useState<File | null>(null)

  const handleSubmit = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault()
    const formData = new FormData(e.currentTarget)
    const name = formData.get('name') as string

    if (!name || !file) {
      toast({
        variant: 'destructive',
        title: 'Campos obrigatórios',
        description: 'Por favor, forneça um nome e selecione um arquivo.',
      })
      return
    }

    addAttachment(ticketId, name, file)
    toast({
      title: 'Anexo Adicionado!',
      description: `O arquivo "${name}" foi adicionado ao ticket.`,
    })
    setOpen(false)
    setFile(null)
    ;(e.currentTarget as HTMLFormElement).reset()
  }

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>{children}</DialogTrigger>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>Adicionar Novo Anexo</DialogTitle>
          <DialogDescription>
            Forneça um nome para o anexo e selecione o arquivo para upload.
          </DialogDescription>
        </DialogHeader>
        <form id='add-attachment-form' onSubmit={handleSubmit}>
          <div className='grid gap-4 py-4'>
            <div className='space-y-2'>
              <Label htmlFor='name'>Nome/Título do Anexo</Label>
              <Input
                id='name'
                name='name'
                placeholder='Ex: Relatório de Erro.pdf'
                required
              />
            </div>
            <div className='space-y-2'>
              <Label htmlFor='file'>Arquivo</Label>
              <Input
                id='file'
                name='file'
                type='file'
                onChange={(e) => setFile(e.target.files?.[0] || null)}
                required
              />
            </div>
          </div>
          <DialogFooter>
            <Button variant='outline' onClick={() => setOpen(false)}>
              Cancelar
            </Button>
            <Button type='submit' form='add-attachment-form'>
              Adicionar
            </Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  )
}

function TicketDetailsDialog({ ticket }: { ticket: Ticket }) {
  const { addTextElement } = useTicketStore()
  const { toast } = useToast()

  const assignedMembers =
    initialStaffsData.filter((emp) =>
      ticket.assignedTo?.includes(emp.email)
    ) ?? []

  const handleAddTextElement = (
    e: React.FormEvent<HTMLFormElement>,
    type: 'question' | 'comment'
  ) => {
    e.preventDefault()
    const formData = new FormData(e.currentTarget)
    const content = formData.get('content') as string
    if (!content) {
      toast({
        variant: 'destructive',
        title: 'Conteúdo obrigatório',
        description: 'Por favor, escreva sua mensagem.',
      })
      return
    }

    const clientUser = {
      name: 'Cliente', // This would be the logged in client user
      avatar: '',
      fallback: 'CL',
    }

    addTextElement(ticket.id, {
      type,
      title: type === 'question' ? 'Pergunta' : 'Comentário',
      content,
      creator: clientUser.name,
      creatorAvatar: clientUser.avatar,
      creatorFallback: clientUser.fallback,
    })

    toast({ title: 'Mensagem enviada!' })
    ;(e.currentTarget.closest('dialog') as HTMLDialogElement)?.close()
    ;(e.target as HTMLFormElement).reset()
  }

  function AddTextElementDialog({
    children,
    elementType,
    dialogTitle,
    dialogDescription,
  }: {
    children: React.ReactNode
    elementType: 'question' | 'comment'
    dialogTitle: string
    dialogDescription: string
  }) {
    const [open, setOpen] = useState(false)
    return (
      <Dialog open={open} onOpenChange={setOpen}>
        <DialogTrigger asChild>{children}</DialogTrigger>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>{dialogTitle}</DialogTitle>
            <DialogDescription>{dialogDescription}</DialogDescription>
          </DialogHeader>
          <form
            id={`add-text-${elementType}-form`}
            onSubmit={(e) => handleAddTextElement(e, elementType)}
          >
            <div className='grid gap-4 py-4'>
              <div className='space-y-2'>
                <Label htmlFor='content'>{dialogTitle}</Label>
                <Textarea
                  id='content'
                  name='content'
                  placeholder='Escreva aqui...'
                  required
                />
              </div>
            </div>
            <DialogFooter>
              <Button variant='outline' onClick={() => setOpen(false)}>
                Cancelar
              </Button>
              <Button type='submit'>Adicionar</Button>
            </DialogFooter>
          </form>
        </DialogContent>
      </Dialog>
    )
  }

  return (
    <DialogContent className='sm:max-w-4xl'>
      <DialogHeader>
        <DialogTitle className='text-2xl font-bold'>
          {ticket.subject}
        </DialogTitle>
        <div className='flex items-center justify-between'>
          <DialogDescription>
            Na coluna {ticket.status} | Ticket ID: {ticket.id}
          </DialogDescription>
          {ticket.labels && ticket.labels.length > 0 && (
            <div className='flex flex-wrap gap-1 pt-2'>
              {ticket.labels.map((label) => (
                <span
                  key={label.id}
                  className={`px-2 py-0.5 text-xs rounded-full text-white ${label.color}`}
                >
                  {label.name}
                </span>
              ))}
            </div>
          )}
        </div>
      </DialogHeader>
      <div className='grid grid-cols-3 gap-8 py-4'>
        <div className='col-span-2 space-y-6'>
          <div className='space-y-2'>
            <div className='flex items-center gap-2'>
              <AlignLeft className='h-5 w-5 text-muted-foreground' />
              <h3 className='font-semibold'>Descrição</h3>
            </div>
            <div className='ml-7 text-sm text-muted-foreground bg-gray-50 p-3 rounded-md border'>
              {ticket.description || 'Nenhuma descrição fornecida.'}
            </div>
          </div>

          {ticket.textElements &&
            ticket.textElements.map((element) => (
              <div key={element.id} className='flex items-start gap-3'>
                <Avatar className='h-8 w-8 mt-1'>
                  <AvatarImage src={element.creatorAvatar} />
                  <AvatarFallback>{element.creatorFallback}</AvatarFallback>
                </Avatar>
                <div className='flex-1'>
                  <div className='flex items-center justify-between'>
                    <div className='flex items-center gap-2'>
                      <p className='font-semibold'>{element.creator}</p>
                      <p className='text-xs text-muted-foreground font-medium'>
                        {element.type === 'question'
                          ? 'fez uma pergunta'
                          : 'adicionou um comentário'}
                      </p>
                    </div>
                    <p className='text-xs text-muted-foreground'>
                      <TimeAgo dateString={element.createdAt} />
                    </p>
                  </div>
                  <div className='mt-1 text-sm text-muted-foreground bg-gray-50 p-3 rounded-md border'>
                    {element.content}
                  </div>
                </div>
              </div>
            ))}

          {ticket.checklists && ticket.checklists.length > 0 && (
            <div className='space-y-4'>
              {ticket.checklists.map((checklist) => {
                const completedItems = checklist.items.filter(
                  (item) => item.completed
                ).length
                const totalItems = checklist.items.length
                const progress =
                  totalItems > 0 ? (completedItems / totalItems) * 100 : 0

                return (
                  <div key={checklist.id} className='space-y-2'>
                    <div className='flex items-center justify-between'>
                      <div className='flex items-center gap-2'>
                        <CheckSquare className='h-5 w-5 text-muted-foreground' />
                        <h3 className='font-semibold'>{checklist.title}</h3>
                      </div>
                    </div>
                    <div className='ml-7 space-y-2'>
                      <Progress value={progress} className='h-2' />
                      {checklist.items.map((item) => {
                        const itemAssignedMembers =
                          initialStaffsData.filter((staff) =>
                            item.assignedTo?.includes(staff.email)
                          ) ?? []
                        return (
                          <div
                            key={item.id}
                            className='flex items-start gap-2 group'
                          >
                            <Checkbox
                              id={`item-${item.id}`}
                              checked={item.completed}
                              disabled
                              className='mt-1'
                            />
                            <div className='grid gap-1 text-sm flex-1'>
                              <label
                                htmlFor={`item-${item.id}`}
                                className={`font-medium ${
                                  item.completed
                                    ? 'line-through text-muted-foreground'
                                    : ''
                                }`}
                              >
                                {item.text}
                              </label>
                              <div className='text-xs text-muted-foreground flex items-center gap-2 flex-wrap'>
                                {item.completed &&
                                item.completedBy &&
                                item.completedAt ? (
                                  <span>
                                    Concluído por {item.completedBy}{' '}
                                    <TimeAgo dateString={item.completedAt} />
                                  </span>
                                ) : item.dueDate ? (
                                  <div className='flex items-center gap-1'>
                                    <Calendar className='h-3 w-3' />
                                    <span>
                                      Vence em{' '}
                                      {format(
                                        parseISO(item.dueDate),
                                        'dd/MM/yyyy'
                                      )}
                                    </span>
                                  </div>
                                ) : null}
                              </div>
                            </div>
                            {itemAssignedMembers.length > 0 && (
                              <div className='flex -space-x-1 self-center'>
                                {itemAssignedMembers.map((member) => (
                                  <Avatar
                                    key={member.email}
                                    className='h-5 w-5 border'
                                  >
                                    <AvatarImage src={member.avatar} />
                                    <AvatarFallback>
                                      {member.fallback}
                                    </AvatarFallback>
                                  </Avatar>
                                ))}
                              </div>
                            )}
                          </div>
                        )
                      })}
                    </div>
                  </div>
                )
              })}
            </div>
          )}
        </div>

        <div className='col-span-1 flex flex-col'>
          <div className='space-y-4'>
            {assignedMembers.length > 0 && (
              <div className='space-y-2'>
                <h3 className='text-sm font-semibold'>Responsáveis</h3>
                <div className='flex flex-col gap-2'>
                  {assignedMembers.map((member) => (
                    <div
                      key={member.email}
                      className='flex items-center gap-2'
                    >
                      <Avatar className='h-8 w-8'>
                        <AvatarImage src={member.avatar} />
                        <AvatarFallback>{member.fallback}</AvatarFallback>
                      </Avatar>
                      <span className='text-sm font-medium'>
                        {member.name}
                      </span>
                    </div>
                  ))}
                </div>
              </div>
            )}
            <Separator />
            <AddTextElementDialog
              elementType='question'
              dialogTitle='Fazer uma Pergunta'
              dialogDescription='Sua pergunta será enviada à nossa equipe de suporte.'
            >
              <Button variant='secondary' className='justify-start w-full'>
                <HelpCircle className='mr-2 h-4 w-4' /> Fazer uma Pergunta
              </Button>
            </AddTextElementDialog>
            <AddTextElementDialog
              elementType='comment'
              dialogTitle='Adicionar um Comentário'
              dialogDescription='Adicione uma atualização ou mais informações ao chamado.'
            >
              <Button variant='secondary' className='justify-start w-full'>
                <MessageSquare className='mr-2 h-4 w-4' /> Adicionar Comentário
              </Button>
            </AddTextElementDialog>
             <AddAttachmentDialog ticketId={ticket.id}>
                <Button variant='secondary' className='justify-start w-full'>
                  <Paperclip className='mr-2 h-4 w-4' /> Anexar Arquivo
                </Button>
              </AddAttachmentDialog>
            <Separator />
            {ticket.attachments && ticket.attachments.length > 0 && (
              <div className='mt-6 space-y-4'>
                <div className='space-y-2'>
                  <h3 className='text-sm font-semibold'>Anexos</h3>
                  <div className='flex flex-col gap-2'>
                    {ticket.attachments.map((attachment) => (
                      <a
                        key={attachment.id}
                        href={attachment.url}
                        target='_blank'
                        rel='noopener noreferrer'
                        className='flex items-center gap-2 text-sm text-primary hover:underline'
                      >
                        <FileIcon className='h-4 w-4' />
                        <span>{attachment.name}</span>
                      </a>
                    ))}
                  </div>
                </div>
              </div>
            )}
          </div>
        </div>
      </div>
    </DialogContent>
  )
}

export default function ClientTicketsPage() {
  const params = useParams()
  const searchParams = useSearchParams()
  const employeeId = searchParams.get('employee')

  const contractId = params.contractId as string
  const client = getClientById(contractId)

  const { tickets, addTicket } = useTicketStore()
  const clientTickets = tickets.filter(
    (ticket) => ticket.client === client?.name
  )

  const { toast } = useToast()
  const [isDialogOpen, setIsDialogOpen] = useState(false)
  const [defaultEmployee, setDefaultEmployee] = useState<string | undefined>(
    employeeId || undefined
  )

  useEffect(() => {
    if (employeeId) {
      setDefaultEmployee(employeeId)
      setIsDialogOpen(true)
    }
  }, [employeeId])

  const handleNewTicket = (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault()
    const formData = new FormData(event.currentTarget)
    const employeeId = formData.get('employee') as string
    const employeeName =
      initialEmployeesData.find((e) => e.id === employeeId)?.name || undefined

    addTicket({
      subject: formData.get('subject') as string,
      client: client?.name || 'Cliente Desconhecido',
      priority: formData.get('priority') as Ticket['priority'],
      description: formData.get('description') as string,
      relatedEmployee: employeeName,
    })

    toast({
      title: 'Chamado Enviado com Sucesso!',
      description:
        'Sua solicitação foi registrada e nossa equipe entrará em contato em breve.',
    })
    setIsDialogOpen(false)
    setDefaultEmployee(undefined)
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
                    <Label htmlFor='employee'>Colaborador (Opcional)</Label>
                    <Select name='employee' defaultValue={defaultEmployee}>
                      <SelectTrigger>
                        <SelectValue placeholder='Selecione um colaborador' />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value='none'>Nenhum</SelectItem>
                        {initialEmployeesData.map((emp) => (
                          <SelectItem key={emp.id} value={emp.id}>
                            {emp.name}
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
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
                <Dialog key={ticket.id}>
                  <DialogTrigger asChild>
                    <TableRow className='cursor-pointer'>
                      <TableCell className='font-medium'>{ticket.id}</TableCell>
                      <TableCell>{ticket.subject}</TableCell>
                      <TableCell>
                        <Badge
                          variant={
                            statusVariant[
                              ticket.status as keyof typeof statusVariant
                            ]
                          }
                        >
                          {ticket.status}
                        </Badge>
                      </TableCell>
                      <TableCell>
                        <TimeAgo dateString={ticket.updated} />
                      </TableCell>
                      <TableCell className='text-right'>
                        <DropdownMenu>
                          <DropdownMenuTrigger
                            asChild
                            onClick={(e) => e.stopPropagation()}
                          >
                            <Button
                              aria-haspopup='true'
                              size='icon'
                              variant='ghost'
                            >
                              <MoreHorizontal className='h-4 w-4' />
                              <span className='sr-only'>Alternar menu</span>
                            </Button>
                          </DropdownMenuTrigger>
                          <DropdownMenuContent
                            align='end'
                            onClick={(e) => e.stopPropagation()}
                          >
                            <DropdownMenuLabel>Ações</DropdownMenuLabel>
                            <DropdownMenuItem>Ver Detalhes</DropdownMenuItem>
                            <DropdownMenuItem>
                              Adicionar Comentário
                            </DropdownMenuItem>
                          </DropdownMenuContent>
                        </DropdownMenu>
                      </TableCell>
                    </TableRow>
                  </DialogTrigger>
                  <TicketDetailsDialog ticket={ticket} />
                </Dialog>
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
