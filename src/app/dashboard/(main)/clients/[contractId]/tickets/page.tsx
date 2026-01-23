
'use client'

import { useState, useEffect, useMemo } from 'react'
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
  MessageSquare,
  HelpCircle,
  Loader2,
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
import type { Client } from '@/lib/types/client'
import {
  type Ticket,
  type Label as LabelType,
  type Checklist,
  type ChecklistItem,
  type Attachment,
  type TextElement,
} from '@/lib/types/ticket'
import { availableLabels } from '@/app/dashboard/(main)/tickets/data'
import { useAttendeeStore } from '@/app/dashboard/(main)/health/queue/attendee-store'
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
import type { Staff } from '@/lib/types/staff'
import { Separator } from '@/components/ui/separator'
import { Progress } from '@/components/ui/progress'
import { Checkbox } from '@/components/ui/checkbox'
import {
  useFirestore,
  useCollection,
  useMemoFirebase,
  addDocumentNonBlocking,
  updateDocumentNonBlocking,
  useDoc,
} from '@/firebase'
import { collection, query, where, doc } from 'firebase/firestore'

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

function TimeAgo({ dateString }: { dateString: string }) {
  const [timeAgo, setTimeAgo] = useState('')

  useEffect(() => {
    if (!dateString) return
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
  const { toast } = useToast()
  const [file, setFile] = useState<File | null>(null)
  const firestore = useFirestore()

  const handleSubmit = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault()
    if (!firestore || !ticketId) return
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

    // This is a placeholder. Real implementation would upload the file and get a URL.
    const newAttachment: Attachment = {
      id: `att-${Date.now()}`,
      name,
      url: URL.createObjectURL(file), // Placeholder URL
    }

    const ticketDocRef = doc(firestore, 'tickets', ticketId)
    // In a real app, you'd fetch the current ticket data and update the array
    // This is a simplified approach for demonstration
    // const newAttachments = [...(currentTicket.attachments || []), newAttachment]
    // updateDocumentNonBlocking(ticketDocRef, { attachments: newAttachments })

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

function TicketDetailsDialog({
  ticket,
  staffs,
}: {
  ticket: Ticket
  staffs: Staff[]
}) {
  const { toast } = useToast()
  const firestore = useFirestore()

  const assignedMembers =
    staffs.filter((emp) => ticket.assignedTo?.includes(emp.email)) ?? []

  const handleAddTextElement = (
    e: React.FormEvent<HTMLFormElement>,
    type: 'question' | 'comment'
  ) => {
    e.preventDefault()
    if (!firestore || !ticket.id) return

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

    const newElement: TextElement = {
      id: `txt-${Date.now()}`,
      type,
      title: type === 'question' ? 'Pergunta' : 'Comentário',
      content,
      creator: clientUser.name,
      creatorAvatar: clientUser.avatar,
      creatorFallback: clientUser.fallback,
      createdAt: new Date().toISOString(),
    }

    const ticketDocRef = doc(firestore, 'tickets', ticket.id)
    updateDocumentNonBlocking(ticketDocRef, {
      textElements: [...(ticket.textElements || []), newElement],
    })

    toast({ title: 'Mensagem enviada!' })
    ;(e.target as HTMLFormElement).reset()
    // Closing the dialog should be handled by the Dialog component itself
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
            onSubmit={(e) => {
              handleAddTextElement(e, elementType)
              setOpen(false)
            }}
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
              <Button
                type='button'
                variant='outline'
                onClick={() => setOpen(false)}
              >
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
                          staffs?.filter((staff) =>
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
