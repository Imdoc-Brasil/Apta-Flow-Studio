
'use client'

import { useState, useEffect } from 'react'
import {
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
} from '@/components/ui/dialog'
import {
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
  Archive,
} from 'lucide-react'
import { Badge } from '@/components/ui/badge'
import { Button } from '@/components/ui/button'
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar'
import { Separator } from '@/components/ui/separator'
import { Checkbox } from '@/components/ui/checkbox'
import { Progress } from '@/components/ui/progress'
import { useToast } from '@/hooks/use-toast'
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from '@/components/ui/popover'
import {
  Dialog,
  DialogTrigger,
  DialogFooter,
} from '@/components/ui/dialog'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Textarea } from '@/components/ui/textarea'
import { format, formatDistanceToNow, parseISO } from 'date-fns'
import { ptBR } from 'date-fns/locale'

import type {
  Ticket,
  Label as LabelType,
  Checklist,
  ChecklistItem,
  TextElement,
  Attachment,
} from '@/app/dashboard/(main)/tickets/data'
import { availableLabels } from '@/app/dashboard/(main)/tickets/tickets-store'
import type { Staff } from '@/app/dashboard/(main)/employees/page'
import {
  updateDocumentNonBlocking,
  useCollection,
  useFirestore,
  useMemoFirebase,
  useUser,
} from '@/firebase'
import { collection, doc } from 'firebase/firestore'

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
  onAttachmentAdd,
}: {
  ticketId: string
  children: React.ReactNode
  onAttachmentAdd: (newAttachment: Attachment) => void
}) {
  const [open, setOpen] = useState(false)
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

    // This is a placeholder. Real implementation would upload the file and get a URL.
    const newAttachment: Attachment = {
      id: `att-${Date.now()}`,
      name,
      url: URL.createObjectURL(file), // Placeholder URL
    }

    onAttachmentAdd(newAttachment)

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

function AddChecklistDialog({
  ticket,
  children,
}: {
  ticket: Ticket
  children: React.ReactNode
}) {
  const [open, setOpen] = useState(false)
  const { toast } = useToast()
  const firestore = useFirestore()
  const { user } = useUser()
  const { data: staffs } = useCollection<Staff>(
    useMemoFirebase(
      () => (firestore ? collection(firestore, 'staffs') : null),
      [firestore]
    )
  )

  const handleSubmit = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault()
    if (!firestore || !ticket.id || !user) return

    const formData = new FormData(e.currentTarget)
    const title = formData.get('title') as string

    if (!title) {
      toast({
        variant: 'destructive',
        title: 'O título é obrigatório.',
      })
      return
    }

    const staffProfile = staffs?.find((s) => s.email === user.email)

    const newChecklist: Checklist = {
      id: `cl-${Date.now()}`,
      title,
      items: [],
      creator: staffProfile?.name || user.displayName || 'Usuário',
      creatorAvatar: staffProfile?.avatar,
      creatorFallback: staffProfile?.fallback,
      createdAt: new Date().toISOString(),
    }

    const ticketDocRef = doc(firestore, 'tickets', ticket.id)
    updateDocumentNonBlocking(ticketDocRef, {
      checklists: [...(ticket.checklists || []), newChecklist],
    })

    toast({ title: 'Checklist Adicionado!' })
    setOpen(false)
  }

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>{children}</DialogTrigger>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>Adicionar Novo Checklist</DialogTitle>
          <DialogDescription>
            Crie uma nova lista de tarefas para este ticket.
          </DialogDescription>
        </DialogHeader>
        <form id='add-checklist-form' onSubmit={handleSubmit}>
          <div className='grid gap-4 py-4'>
            <div className='space-y-2'>
              <Label htmlFor='title'>Título do Checklist</Label>
              <Input
                id='title'
                name='title'
                placeholder='Ex: Etapas de Verificação'
                required
                autoFocus
              />
            </div>
          </div>
          <DialogFooter>
            <Button variant='outline' onClick={() => setOpen(false)}>
              Cancelar
            </Button>
            <Button type='submit' form='add-checklist-form'>
              Adicionar
            </Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  )
}

function AddChecklistItemForm({
  checklistId,
  ticket,
}: {
  checklistId: string
  ticket: Ticket
}) {
  const { toast } = useToast()
  const [showForm, setShowForm] = useState(false)
  const firestore = useFirestore()

  const handleSubmit = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault()
    if (!firestore || !ticket.id) return

    const formData = new FormData(e.currentTarget)
    const text = formData.get('item-text') as string
    if (!text) return

    const newItem: ChecklistItem = {
      id: `item-${Date.now()}`,
      text,
      completed: false,
    }

    const ticketDocRef = doc(firestore, 'tickets', ticket.id)
    const updatedChecklists = ticket.checklists?.map((cl) => {
      if (cl.id === checklistId) {
        return { ...cl, items: [...cl.items, newItem] }
      }
      return cl
    })

    updateDocumentNonBlocking(ticketDocRef, { checklists: updatedChecklists })

    toast({ title: 'Tarefa adicionada!' })
    e.currentTarget.reset()
  }

  if (!showForm) {
    return (
      <Button
        variant='ghost'
        size='sm'
        onClick={() => setShowForm(true)}
        className='mt-2 justify-start p-1 h-auto text-muted-foreground'
      >
        <Plus className='h-4 w-4 mr-2' />
        Adicionar uma tarefa
      </Button>
    )
  }

  return (
    <form onSubmit={handleSubmit} className='mt-2 space-y-2'>
      <Textarea
        name='item-text'
        placeholder='Adicionar uma tarefa...'
        rows={2}
        autoFocus
        required
      />
      <div className='flex items-center gap-2'>
        <Button type='submit' size='sm'>
          Adicionar
        </Button>
        <Button
          type='button'
          variant='ghost'
          size='sm'
          onClick={() => setShowForm(false)}
        >
          Cancelar
        </Button>
      </div>
    </form>
  )
}

export function TicketDetailsDialog({ ticket }: { ticket: Ticket }) {
  const { toast } = useToast()
  const firestore = useFirestore()
  const { user } = useUser()
  const { data: staffs } = useCollection<Staff>(
    useMemoFirebase(
      () => (firestore ? collection(firestore, 'staffs') : null),
      [firestore]
    )
  )

  const handleAssignMember = (ticketId: string, memberEmail: string) => {
    if (!firestore) return
    const ticketDocRef = doc(firestore, 'tickets', ticketId)
    const isAssigned = ticket.assignedTo?.includes(memberEmail)
    const newAssignedTo = isAssigned
      ? ticket.assignedTo?.filter((email) => email !== memberEmail)
      : [...(ticket.assignedTo || []), memberEmail]
    updateDocumentNonBlocking(ticketDocRef, { assignedTo: newAssignedTo })
  }

  const handleLabelChange = (
    labelId: (typeof availableLabels)[number]['id'],
    checked: boolean
  ) => {
    if (!firestore || !ticket.id) return
    const ticketDocRef = doc(firestore, 'tickets', ticket.id)

    const newLabels = checked
      ? [
          ...(ticket.labels || []),
          // @ts-ignore
          availableLabels.find((l) => l.id === labelId)!,
        ]
      : ticket.labels?.filter((l) => l.id !== labelId)

    updateDocumentNonBlocking(ticketDocRef, { labels: newLabels || [] })
  }

  const handleChecklistItemToggle = (
    checklistId: string,
    itemId: string,
    completed: boolean
  ) => {
    if (!firestore || !ticket.id || !user) return
    const ticketDocRef = doc(firestore, 'tickets', ticket.id)
    const staffProfile = staffs?.find((s) => s.email === user.email)

    const updatedChecklists = ticket.checklists?.map((cl) => {
      if (cl.id === checklistId) {
        return {
          ...cl,
          items: cl.items.map((item) =>
            item.id === itemId
              ? {
                  ...item,
                  completed,
                  completedBy: completed
                    ? staffProfile?.name || user?.displayName
                    : undefined,
                  completedAt: completed
                    ? new Date().toISOString()
                    : undefined,
                }
              : item
          ),
        }
      }
      return cl
    })
    updateDocumentNonBlocking(ticketDocRef, { checklists: updatedChecklists })
  }

  const handleArchive = () => {
    if (!firestore || !ticket.id) return
    const ticketDocRef = doc(firestore, 'tickets', ticket.id)
    updateDocumentNonBlocking(ticketDocRef, { status: 'Arquivado' })
    toast({
      title: 'Ticket Arquivado!',
      description: 'O ticket foi movido para o arquivo.',
    })
  }

  const handleAddTextElement = (
    e: React.FormEvent<HTMLFormElement>,
    type: 'question' | 'comment'
  ) => {
    e.preventDefault()
    if (!firestore || !ticket.id || !user || !staffs) return

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

    const staffProfile = staffs.find((s) => s.email === user.email)

    const newElement: TextElement = {
      id: `txt-${Date.now()}`,
      type,
      title: type === 'question' ? 'Pergunta' : 'Comentário',
      content,
      creator: staffProfile?.name || user?.displayName || 'Usuário',
      creatorAvatar: staffProfile?.avatar,
      creatorFallback: staffProfile?.fallback,
      createdAt: new Date().toISOString(),
    }

    const ticketDocRef = doc(firestore, 'tickets', ticket.id)
    updateDocumentNonBlocking(ticketDocRef, {
      textElements: [...(ticket.textElements || []), newElement],
    })
    ;(e.target as HTMLFormElement).reset()
  }

  const handleAddAttachment = (newAttachment: Attachment) => {
    if (!firestore || !ticket.id) return;
    const ticketDocRef = doc(firestore, 'tickets', ticket.id);
    updateDocumentNonBlocking(ticketDocRef, {
      attachments: [...(ticket.attachments || []), newAttachment]
    })
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

  const assignedMembers =
    staffs?.filter((emp: Staff) => ticket.assignedTo?.includes(emp.email)) ?? []

  return (
    <DialogContent className='sm:max-w-4xl'>
      <DialogHeader>
        <DialogTitle className='text-2xl font-bold'>
          {ticket.subject}
        </DialogTitle>
        <div className='flex items-center justify-between'>
          <DialogDescription>
            Na coluna {ticket.status} | Cliente: {ticket.client} ({ticket.id})
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
                      <div className='flex items-center gap-2'>
                        <p className='text-xs font-semibold text-muted-foreground'>
                          {Math.round(progress)}%
                        </p>
                        <Avatar className='h-6 w-6'>
                          <AvatarImage src={checklist.creatorAvatar} />
                          <AvatarFallback>
                            {checklist.creatorFallback}
                          </AvatarFallback>
                        </Avatar>
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
                              onCheckedChange={(checked) =>
                                handleChecklistItemToggle(
                                  checklist.id,
                                  item.id,
                                  !!checked
                                )
                              }
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
                      <AddChecklistItemForm
                        checklistId={checklist.id}
                        ticket={ticket}
                      />
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
                <h3 className='text-sm font-semibold'>Membros</h3>
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
            <h3 className='text-sm font-semibold'>Adicionar ao cartão</h3>
            <div className='flex flex-col space-y-2'>
              <Popover>
                <PopoverTrigger asChild>
                  <Button variant='secondary' className='justify-start'>
                    <UserPlus className='mr-2 h-4 w-4' /> Membros
                  </Button>
                </PopoverTrigger>
                <PopoverContent className='w-80'>
                  <div className='grid gap-4'>
                    <div className='space-y-2'>
                      <h4 className='font-medium leading-none'>Membros</h4>
                      <p className='text-sm text-muted-foreground'>
                        Atribua membros a este cartão.
                      </p>
                    </div>
                    <Separator />
                    <div className='flex flex-col gap-2'>
                      {staffs?.map((staff: Staff) => {
                        const isAssigned = ticket.assignedTo?.includes(
                          staff.email
                        )
                        return (
                          <div
                            key={staff.email}
                            className='flex items-center justify-between'
                          >
                            <div className='flex items-center gap-2'>
                              <Avatar className='h-8 w-8'>
                                <AvatarImage src={staff.avatar} />
                                <AvatarFallback>
                                  {staff.fallback}
                                </AvatarFallback>
                              </Avatar>
                              <span className='text-sm font-medium'>
                                {staff.name}
                              </span>
                            </div>
                            <Button
                              variant={isAssigned ? 'default' : 'outline'}
                              size='sm'
                              onClick={() =>
                                handleAssignMember(ticket.id, staff.email)
                              }
                            >
                              {isAssigned ? 'Remover' : 'Atribuir'}
                            </Button>
                          </div>
                        )
                      })}
                    </div>
                  </div>
                </PopoverContent>
              </Popover>
              <Popover>
                <PopoverTrigger asChild>
                  <Button variant='secondary' className='justify-start'>
                    <Tag className='mr-2 h-4 w-4' /> Etiquetas
                  </Button>
                </PopoverTrigger>
                <PopoverContent className='w-64'>
                  <div className='grid gap-4'>
                    <div className='space-y-2'>
                      <h4 className='font-medium leading-none'>Etiquetas</h4>
                      <p className='text-sm text-muted-foreground'>
                        Adicione etiquetas a este ticket.
                      </p>
                    </div>
                    <Separator />
                    <div className='flex flex-col gap-2'>
                      {availableLabels.map((label) => {
                        const isChecked = ticket.labels?.some(
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
                                handleLabelChange(label.id, !!checked)
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
              <AddTextElementDialog
                elementType='question'
                dialogTitle='Fazer Pergunta'
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
                  <MessageSquare className='mr-2 h-4 w-4' /> Adicionar
                  Comentário
                </Button>
              </AddTextElementDialog>
              <AddChecklistDialog ticket={ticket}>
                <Button variant='secondary' className='justify-start'>
                  <CheckSquare className='mr-2 h-4 w-4' /> Checklist
                </Button>
              </AddChecklistDialog>
              <AddAttachmentDialog
                ticketId={ticket.id}
                onAttachmentAdd={handleAddAttachment}
              >
                <Button variant='secondary' className='justify-start'>
                  <Paperclip className='mr-2 h-4 w-4' /> Anexo
                </Button>
              </AddAttachmentDialog>
            </div>
            {ticket.attachments && ticket.attachments.length > 0 && (
              <div className='mt-6 space-y-4'>
                <Separator />
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
            <Separator />
            <Button
              variant='outline'
              className='w-full mt-4 justify-start text-destructive hover:text-destructive hover:bg-destructive/10'
              onClick={handleArchive}
            >
              <Archive className='mr-2 h-4 w-4' /> Arquivar Ticket
            </Button>
          </div>
        </div>
      </div>
    </DialogContent>
  )
}
