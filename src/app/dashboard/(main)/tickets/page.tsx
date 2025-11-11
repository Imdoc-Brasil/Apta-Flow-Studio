
'use client'

import { useState, useEffect, useMemo } from 'react'
import {
  DndContext,
  closestCenter,
  DragEndEvent,
  DragStartEvent,
  DragOverlay,
  PointerSensor,
  useSensor,
  useSensors,
  DragOverEvent,
} from '@dnd-kit/core'
import {
  SortableContext,
  verticalListSortingStrategy,
  useSortable,
} from '@dnd-kit/sortable'
import { CSS } from '@dnd-kit/utilities'
import {
  MoreHorizontal,
  PlusCircle,
  Filter,
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
  Upload,
  FileText,
  MessageSquare,
  HelpCircle,
  Loader2,
} from 'lucide-react'
import { Badge } from '@/components/ui/badge'
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
  CardFooter,
} from '@/components/ui/card'
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
  DropdownMenuCheckboxItem,
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
import { initialClientsData } from '@/app/dashboard/(main)/clients/data'
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs'
import {
  useTicketStore,
  type Ticket,
  type TicketStatus,
  availableLabels,
  type Label as LabelType,
  type Checklist,
  type ChecklistItem,
  type Attachment,
  type TextElement,
} from './tickets-store'
import { useAttendeeStore } from '../health/queue/attendee-store'
import { format, formatDistanceToNow, parseISO } from 'date-fns'
import { ptBR } from 'date-fns/locale'
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from '@/components/ui/popover'
import {
  initialStaffsData,
  type Staff,
} from '@/app/dashboard/(main)/employees/page'
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar'
import { Separator } from '@/components/ui/separator'
import { Checkbox } from '@/components/ui/checkbox'
import { Progress } from '@/components/ui/progress'
import { useToast } from '@/hooks/use-toast'
import { ScrollArea } from '@/components/ui/scroll-area'
import { initialEmployeesData } from '../clients/[contractId]/employees/data'
import {
  addDocumentNonBlocking,
  updateDocumentNonBlocking,
  useCollection,
  useFirestore,
  useMemoFirebase,
} from '@/firebase'
import { collection, doc } from 'firebase/firestore'

const priorityVariant = {
  Alta: 'destructive',
  Média: 'default',
  Baixa: 'secondary',
} as const

const statusVariant = {
  Aberto: 'default',
  'Em Progresso': 'secondary',
  Resolvido: 'outline',
  Fechado: 'outline',
} as const

export const kanbanColumns: TicketStatus[] = [
  'Aberto',
  'Em Progresso',
  'Resolvido',
  'Fechado',
]

function ClientSideDate({ dateString }: { dateString: string }) {
  const [formattedDate, setFormattedDate] = useState('')

  useEffect(() => {
    setFormattedDate(new Date(dateString).toLocaleDateString('pt-BR'))
  }, [dateString])

  return <>{formattedDate}</>
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

const TicketCard = ({ ticket }: { ticket: Ticket }) => {
  const {
    attributes,
    listeners,
    setNodeRef,
    transform,
    transition,
    isDragging,
  } = useSortable({ id: ticket.id, data: { type: 'Ticket', ticket } })
  const { startWorkOnTicket } = useTicketStore()
  const currentUserEmail = 'sarah.chen@aptaflow.com'

  const style = {
    transform: CSS.Transform.toString(transform),
    transition,
    opacity: isDragging ? 0.5 : 1,
  }
  const assignedMembers =
    initialStaffsData.filter((emp: Staff) =>
      ticket.assignedTo?.includes(emp.email)
    ) ?? []

  const handleCardClick = () => {
    if (ticket.status === 'Aberto') {
      startWorkOnTicket(ticket.id, currentUserEmail)
    }
  }

  return (
    <Dialog>
      <DialogTrigger asChild>
        <div
          ref={setNodeRef}
          style={style}
          {...attributes}
          {...listeners}
          onClick={handleCardClick}
        >
          <Card className='touch-none cursor-grab active:cursor-grabbing flex flex-col'>
            <div className='flex-grow cursor-pointer'>
              <CardHeader className='p-4 pb-2'>
                {ticket.labels && ticket.labels.length > 0 && (
                  <div className='flex flex-wrap gap-1 mb-2'>
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
                <CardTitle className='leading-tight hover:underline'>
                  {ticket.subject}
                </CardTitle>
                <CardDescription className='pt-1 text-xs'>
                  {ticket.client} - {ticket.id}
                </CardDescription>
              </CardHeader>
            </div>
            <CardFooter className='p-4 pt-0'>
              <div className='flex items-center justify-between w-full'>
                <div className='flex items-center gap-2'>
                  <Badge
                    variant={
                      priorityVariant[
                        ticket.priority as keyof typeof priorityVariant
                      ]
                    }
                  >
                    {ticket.priority}
                  </Badge>
                  <p className='text-xs text-muted-foreground'>
                    <TimeAgo dateString={ticket.updated} />
                  </p>
                </div>
                <div className='flex items-center gap-2'>
                  {assignedMembers.length > 0 && (
                    <div className='flex -space-x-2'>
                      {assignedMembers.map((member) => (
                        <Avatar
                          key={member.email}
                          className='h-6 w-6 border-2'
                        >
                          <AvatarImage src={member.avatar} />
                          <AvatarFallback>{member.fallback}</AvatarFallback>
                        </Avatar>
                      ))}
                    </div>
                  )}
                  <DropdownMenu>
                    <DropdownMenuTrigger asChild>
                      <Button
                        variant='ghost'
                        size='icon'
                        className='h-6 w-6 shrink-0'
                        onClick={(e) => e.stopPropagation()}
                      >
                        <MoreHorizontal className='h-4 w-4' />
                      </Button>
                    </DropdownMenuTrigger>
                    <DropdownMenuContent onClick={(e) => e.stopPropagation()}>
                      <DropdownMenuLabel>Ações</DropdownMenuLabel>
                      <DropdownMenuItem>Ver Detalhes</DropdownMenuItem>
                    </DropdownMenuContent>
                  </DropdownMenu>
                </div>
              </div>
            </CardFooter>
          </Card>
        </div>
      </DialogTrigger>
      <TicketDetailsDialog ticket={ticket} />
    </Dialog>
  )
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

function AddChecklistDialog({
  ticketId,
  children,
}: {
  ticketId: string
  children: React.ReactNode
}) {
  const [open, setOpen] = useState(false)
  const { addChecklist } = useTicketStore()
  const { toast } = useToast()

  const handleSubmit = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault()
    const formData = new FormData(e.currentTarget)
    const title = formData.get('title') as string
    const itemText = formData.get('itemText') as string
    const dueDate = formData.get('dueDate') as string
    const assignedTo = formData.get('assignedTo') as string

    if (!title || !itemText) {
      toast({
        variant: 'destructive',
        title: 'Campos obrigatórios',
        description:
          'Por favor, preencha o título do checklist e a primeira tarefa.',
      })
      return
    }

    addChecklist(
      ticketId,
      title,
      itemText,
      dueDate || undefined,
      assignedTo && assignedTo !== 'unassigned' ? [assignedTo] : []
    )
    toast({
      title: 'Checklist Adicionado!',
      description: `O checklist "${title}" foi adicionado ao ticket.`,
    })
    setOpen(false)
  }

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>{children}</DialogTrigger>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>Adicionar Novo Checklist</DialogTitle>
          <DialogDescription>
            Crie um novo checklist para detalhar as tarefas deste ticket.
          </DialogDescription>
        </DialogHeader>
        <form id='add-checklist-form' onSubmit={handleSubmit}>
          <div className='grid gap-4 py-4'>
            <div className='space-y-2'>
              <Label htmlFor='title'>Título do Checklist</Label>
              <Input
                id='title'
                name='title'
                placeholder='Ex: Verificação de Bug'
                required
              />
            </div>
            <div className='space-y-2'>
              <Label htmlFor='itemText'>Primeira Tarefa</Label>
              <Input
                id='itemText'
                name='itemText'
                placeholder='Ex: Reproduzir o erro em ambiente de teste'
                required
              />
            </div>
            <div className='space-y-2'>
              <Label htmlFor='dueDate'>
                Prazo da Primeira Tarefa (Opcional)
              </Label>
              <Input id='dueDate' name='dueDate' type='date' />
            </div>
            <div className='space-y-2'>
              <Label htmlFor='assignedTo'>Atribuir a (Opcional)</Label>
              <Select name='assignedTo' defaultValue='unassigned'>
                <SelectTrigger>
                  <SelectValue placeholder='Selecione um membro' />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value='unassigned'>Ninguém</SelectItem>
                  {initialStaffsData.map((staff) => (
                    <SelectItem key={staff.email} value={staff.email}>
                      {staff.name}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
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
  ticketId,
}: {
  checklistId: string
  ticketId: string
}) {
  const { addChecklistItem } = useTicketStore()
  const { toast } = useToast()
  const [showForm, setShowForm] = useState(false)

  const handleSubmit = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault()
    const formData = new FormData(e.currentTarget)
    const text = formData.get('itemText') as string
    const dueDate = formData.get('dueDate') as string
    const assignedTo = formData.get('assignedTo') as string

    if (!text) {
      toast({
        variant: 'destructive',
        title: 'Campo obrigatório',
        description: 'Por favor, descreva a tarefa.',
      })
      return
    }

    addChecklistItem(
      ticketId,
      checklistId,
      text,
      dueDate || undefined,
      assignedTo && assignedTo !== 'unassigned' ? [assignedTo] : []
    )
    toast({ title: 'Tarefa adicionada!' })
    ;(e.currentTarget as HTMLFormElement).reset()
    setShowForm(false)
  }

  if (!showForm) {
    return (
      <Button
        variant='ghost'
        size='sm'
        onClick={() => setShowForm(true)}
        className='mt-2 justify-start p-1 h-auto'
      >
        <Plus className='h-4 w-4 mr-2' />
        Adicionar uma tarefa
      </Button>
    )
  }

  return (
    <form onSubmit={handleSubmit} className='mt-2 space-y-2'>
      <div className='p-2 border rounded-md'>
        <Input
          name='itemText'
          placeholder='Adicionar uma tarefa...'
          className='border-none focus-visible:ring-0 px-1'
          required
        />
        <div className='flex items-center justify-between mt-1 gap-2'>
          <Input
            name='dueDate'
            type='date'
            className='border-none focus-visible:ring-0 text-xs h-auto p-1 w-auto'
          />
          <Select name='assignedTo' defaultValue='unassigned'>
            <SelectTrigger className='text-xs h-auto p-1 border-none focus-visible:ring-0 w-auto'>
              <SelectValue placeholder='Atribuir...' />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value='unassigned'>Ninguém</SelectItem>
              {initialStaffsData.map((staff) => (
                <SelectItem key={staff.email} value={staff.email}>
                  {staff.fallback}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>
      </div>
      <div className='flex items-center gap-2'>
        <Button type='submit' size='sm'>
          Salvar
        </Button>
        <Button variant='ghost' size='icon' onClick={() => setShowForm(false)}>
          <X className='h-4 w-4' />
        </Button>
      </div>
    </form>
  )
}

function AddTextElementDialog({
  ticketId,
  children,
  elementType,
  dialogTitle,
  dialogDescription,
}: {
  ticketId: string
  children: React.ReactNode
  elementType: 'question' | 'comment'
  dialogTitle: string
  dialogDescription: string
}) {
  const [open, setOpen] = useState(false)
  const { addTextElement } = useTicketStore()
  const { toast } = useToast()

  const handleSubmit = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault()
    const formData = new FormData(e.currentTarget)
    const content = formData.get('content') as string

    if (!content) {
      toast({
        variant: 'destructive',
        title: 'Campo obrigatório',
        description: 'Por favor, preencha o conteúdo.',
      })
      return
    }

    // Mocking the creator for now
    const creator = initialStaffsData[0]

    addTextElement(ticketId, {
      type: elementType,
      title: elementType === 'question' ? 'Pergunta' : 'Comentário', // Simplified title
      content,
      creator: creator.name,
      creatorAvatar: creator.avatar,
      creatorFallback: creator.fallback,
    })

    toast({
      title: `${dialogTitle} adicionado!`,
      description: `Sua contribuição foi adicionada ao ticket.`,
    })
    setOpen(false)
  }

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>{children}</DialogTrigger>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>{dialogTitle}</DialogTitle>
          <DialogDescription>{dialogDescription}</DialogDescription>
        </DialogHeader>
        <form id='add-text-element-form' onSubmit={handleSubmit}>
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
            <Button type='submit' form='add-text-element-form'>
              Adicionar
            </Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  )
}

function TicketDetailsDialog({ ticket }: { ticket: Ticket }) {
  const { toggleChecklistItem } = useTicketStore()
  const firestore = useFirestore()

  const handleAssignMember = (ticketId: string, memberEmail: string) => {
    if (!firestore) return
    const ticketDocRef = doc(firestore, 'tickets', ticketId)
    const isAssigned = ticket.assignedTo?.includes(memberEmail)
    const newAssignedTo = isAssigned
      ? ticket.assignedTo?.filter((email) => email !== memberEmail)
      : [...(ticket.assignedTo || []), memberEmail]
    updateDocumentNonBlocking(ticketDocRef, { assignedTo: newAssignedTo })
  }

  const handleLabelChange = (labelId: string, checked: boolean) => {
    if (!firestore || !ticket.id) return
    const ticketDocRef = doc(firestore, 'tickets', ticket.id)

    const newLabels = checked
      ? [...(ticket.labels || []), availableLabels.find((l) => l.id === labelId)!]
      : ticket.labels?.filter((l) => l.id !== labelId)

    updateDocumentNonBlocking(ticketDocRef, { labels: newLabels || [] })
  }

  const handleChecklistItemToggle = (
    checklistId: string,
    itemId: string,
    checked: boolean
  ) => {
    toggleChecklistItem(ticket.id, checklistId, itemId, checked, 'John Doe')
  }

  const assignedMembers =
    initialStaffsData.filter((emp: Staff) =>
      ticket.assignedTo?.includes(emp.email)
    ) ?? []

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
                        <Avatar className='h-6 w-6'>
                          <AvatarImage src={checklist.creatorAvatar} />
                          <AvatarFallback>
                            {checklist.creatorFallback}
                          </AvatarFallback>
                        </Avatar>
                        <h3 className='font-semibold'>{checklist.title}</h3>
                      </div>
                      <p className='text-xs text-muted-foreground'>
                        <TimeAgo dateString={checklist.createdAt} />
                      </p>
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
                        ticketId={ticket.id}
                      />
                    </div>
                  </div>
                )
              })}
            </div>
          )}

          <div className='space-y-4 pl-7'>
            <div className='space-y-2'>
              <div className='flex items-center gap-2'>
                <Flag className='h-5 w-5 text-muted-foreground' />
                <h3 className='font-semibold'>Prioridade</h3>
              </div>
              <Badge
                variant={
                  priorityVariant[
                    ticket.priority as keyof typeof priorityVariant
                  ]
                }
              >
                {ticket.priority}
              </Badge>
            </div>
            <div className='space-y-2'>
              <div className='flex items-center gap-2'>
                <Clock className='h-5 w-5 text-muted-foreground' />
                <h3 className='font-semibold'>Aberto</h3>
              </div>
              <p className='text-sm'>
                <TimeAgo dateString={ticket.updated} />
              </p>
            </div>
          </div>
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
                      {initialStaffsData.map((staff: Staff) => {
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
                        const isChecked =
                          ticket.labels?.some((l) => l.id === label.id) ?? false
                        return (
                          <Label
                            key={label.id}
                            className='flex items-center gap-2 font-normal'
                          >
                            <Checkbox
                              checked={isChecked}
                              onCheckedChange={(checked) =>
                                handleLabelChange(label.id, Boolean(checked))
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
                ticketId={ticket.id}
                elementType='question'
                dialogTitle='Abrir o Chat'
                dialogDescription='Faça uma pergunta clara para a equipe ou cliente.'
              >
                <Button variant='secondary' className='justify-start'>
                  <HelpCircle className='mr-2 h-4 w-4' /> Abrir o Chat
                </Button>
              </AddTextElementDialog>
              <AddTextElementDialog
                ticketId={ticket.id}
                elementType='comment'
                dialogTitle='Adicionar Comentário'
                dialogDescription='Adicione uma atualização, nota ou qualquer outra informação.'
              >
                <Button variant='secondary' className='justify-start'>
                  <MessageSquare className='mr-2 h-4 w-4' /> Adicionar
                  Comentário
                </Button>
              </AddTextElementDialog>
              <AddChecklistDialog ticketId={ticket.id}>
                <Button variant='secondary' className='justify-start'>
                  <CheckSquare className='mr-2 h-4 w-4' /> Checklist
                </Button>
              </AddChecklistDialog>
              <AddAttachmentDialog ticketId={ticket.id}>
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
          </div>
        </div>
      </div>
    </DialogContent>
  )
}

const KanbanColumn = ({
  status,
  tickets,
}: {
  status: TicketStatus
  tickets: Ticket[]
}) => {
  const { setNodeRef } = useSortable({
    id: status,
    data: { type: 'Column' },
  })

  return (
    <div
      ref={setNodeRef}
      className='flex h-full flex-col gap-4 rounded-lg bg-muted/50 p-4'
    >
      <h2 className='text-lg font-bold'>{status}</h2>
      <SortableContext
        items={tickets.map((t) => t.id)}
        strategy={verticalListSortingStrategy}
      >
        <div className='flex flex-col gap-4 overflow-y-auto'>
          {tickets.map((ticket) => (
            <TicketCard key={ticket.id} ticket={ticket} />
          ))}
          {tickets.length === 0 && (
            <div className='py-8 text-center text-sm text-muted-foreground'>
              Nenhuma tarefa nesta coluna.
            </div>
          )}
        </div>
      </SortableContext>
    </div>
  )
}

function ClientOnly({ children }: { children: React.ReactNode }) {
  const [hasMounted, setHasMounted] = useState(false)
  useEffect(() => {
    setHasMounted(true)
  }, [])
  if (!hasMounted) {
    return null
  }
  return <>{children}</>
}

export default function TicketsPage() {
  const firestore = useFirestore()
  const ticketsRef = useMemoFirebase(
    () => (firestore ? collection(firestore, 'tickets') : null),
    [firestore]
  )
  const { data: tickets = [], isLoading } = useCollection<Ticket>(ticketsRef)
  const [isDialogOpen, setIsDialogOpen] = useState(false)
  const [activeTicket, setActiveTicket] = useState<Ticket | null>(null)
  const [priorityFilter, setPriorityFilter] = useState<string[]>([])
  const [labelFilter, setLabelFilter] = useState<string[]>([])
  const [staffFilter, setStaffFilter] = useState<string[]>([])
  const [clientFilter, setClientFilter] = useState<string[]>([])
  const [selectedLabels, setSelectedLabels] = useState<LabelType[]>([])
  const [assignedTo, setAssignedTo] = useState<string[]>([])
  const currentUserEmail = 'sarah.chen@aptaflow.com'

  const filteredTickets = useMemo(() => {
    return tickets.filter((ticket) => {
      const priorityMatch =
        priorityFilter.length === 0 || priorityFilter.includes(ticket.priority)
      const labelMatch =
        labelFilter.length === 0 ||
        ticket.labels?.some((label) => labelFilter.includes(label.id))
      const staffMatch =
        staffFilter.length === 0 ||
        ticket.assignedTo?.some((staff) => staffFilter.includes(staff))
      const clientMatch =
        clientFilter.length === 0 || clientFilter.includes(ticket.client)
      return priorityMatch && labelMatch && staffMatch && clientMatch
    })
  }, [tickets, priorityFilter, labelFilter, staffFilter, clientFilter])

  const sensors = useSensors(
    useSensor(PointerSensor, {
      activationConstraint: {
        distance: 8,
      },
    })
  )

  const handleAddTicket = (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault()
    if (!ticketsRef) return

    const formData = new FormData(event.currentTarget)
    const subject = formData.get('subject') as string
    const clientName = formData.get('client') as string
    const relatedEmployeeId = formData.get('relatedEmployee') as string

    const newTicketData = {
      subject,
      client: clientName,
      priority: formData.get('priority') as Ticket['priority'],
      description: (formData.get('description') as string) || '',
      labels: selectedLabels,
      assignedTo: assignedTo,
      relatedEmployee:
        initialEmployeesData.find((e) => e.id === relatedEmployeeId)?.name ||
        undefined,
      status: 'Aberto' as TicketStatus,
      updated: new Date().toISOString(),
    }
    addDocumentNonBlocking(ticketsRef, newTicketData)

    setIsDialogOpen(false)
    setSelectedLabels([])
    setAssignedTo([])
  }

  const handleDragStart = (event: DragStartEvent) => {
    if (event.active.data.current?.type === 'Ticket') {
      setActiveTicket(event.active.data.current.ticket)
    }
  }

  const handleDragOver = (event: DragOverEvent) => {
    const { active, over } = event
    if (!over || !firestore) return

    const activeId = active.id.toString()
    const overId = over.id.toString()

    if (activeId === overId) return

    const isActiveATicket = active.data.current?.type === 'Ticket'
    const isOverAColumn = over.data.current?.type === 'Column'

    if (isActiveATicket && isOverAColumn) {
      const ticketDocRef = doc(firestore, 'tickets', activeId)
      updateDocumentNonBlocking(ticketDocRef, {
        status: overId,
        updated: new Date().toISOString(),
      })
    }
  }

  const handleDragEnd = (event: DragEndEvent) => {
    setActiveTicket(null)
  }

  const handleRowClick = (ticket: Ticket) => {
    if (ticket.status === 'Aberto' && ticket.id && firestore) {
      const ticketDocRef = doc(firestore, 'tickets', ticket.id)
      updateDocumentNonBlocking(ticketDocRef, {
        status: 'Em Progresso',
        assignedTo: [...(ticket.assignedTo || []), currentUserEmail],
        updated: new Date().toISOString(),
      })
    }
  }

  return (
    <div className='flex h-full flex-col gap-4'>
      <div className='flex items-center justify-between'>
        <div>
          <h1 className='font-headline text-3xl font-bold'>
            Tickets de Serviço
          </h1>
          <p className='text-muted-foreground'>
            Rastreie e gerencie as solicitações de serviço do cliente.
          </p>
        </div>
        <div className='flex gap-2'>
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button variant='outline' size='sm' className='h-8 gap-1'>
                <Filter className='h-3.5 w-3.5' />
                <span>Filtrar</span>
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent align='end' className='w-56'>
              <ScrollArea className='h-72'>
                <div className='p-1'>
                  <DropdownMenuLabel>Filtrar por Prioridade</DropdownMenuLabel>
                  <DropdownMenuSeparator />
                  {(['Alta', 'Média', 'Baixa'] as const).map((priority) => (
                    <DropdownMenuCheckboxItem
                      key={priority}
                      checked={priorityFilter.includes(priority)}
                      onCheckedChange={(checked) => {
                        setPriorityFilter((prev) =>
                          checked
                            ? [...prev, priority]
                            : prev.filter((p) => p !== priority)
                        )
                      }}
                    >
                      {priority}
                    </DropdownMenuCheckboxItem>
                  ))}

                  <DropdownMenuSeparator />

                  <DropdownMenuLabel>Filtrar por Cliente</DropdownMenuLabel>
                  <DropdownMenuSeparator />
                  {initialClientsData.map((client) => (
                    <DropdownMenuCheckboxItem
                      key={client.id}
                      checked={clientFilter.includes(client.name)}
                      onCheckedChange={(checked) => {
                        setClientFilter((prev) =>
                          checked
                            ? [...prev, client.name]
                            : prev.filter((c) => c !== client.name)
                        )
                      }}
                    >
                      {client.name}
                    </DropdownMenuCheckboxItem>
                  ))}

                  <DropdownMenuSeparator />

                  <DropdownMenuLabel>Filtrar por Membro</DropdownMenuLabel>
                  <DropdownMenuSeparator />
                  {initialStaffsData.map((staff) => (
                    <DropdownMenuCheckboxItem
                      key={staff.email}
                      checked={staffFilter.includes(staff.email)}
                      onCheckedChange={(checked) => {
                        setStaffFilter((prev) =>
                          checked
                            ? [...prev, staff.email]
                            : prev.filter((s) => s !== staff.email)
                        )
                      }}
                    >
                      <div className='flex items-center gap-2'>
                        <Avatar className='h-5 w-5'>
                          <AvatarImage src={staff.avatar} />
                          <AvatarFallback>{staff.fallback}</AvatarFallback>
                        </Avatar>
                        <span>{staff.name}</span>
                      </div>
                    </DropdownMenuCheckboxItem>
                  ))}

                  <DropdownMenuSeparator />

                  <DropdownMenuLabel>Filtrar por Etiqueta</DropdownMenuLabel>
                  <DropdownMenuSeparator />
                  {availableLabels.map((label) => (
                    <DropdownMenuCheckboxItem
                      key={label.id}
                      checked={labelFilter.includes(label.id)}
                      onCheckedChange={(checked) => {
                        setLabelFilter((prev) =>
                          checked
                            ? [...prev, label.id]
                            : prev.filter((l) => l !== label.id)
                        )
                      }}
                    >
                      <span
                        className={`mr-2 px-1.5 py-0.5 text-xs rounded-full text-white ${label.color}`}
                      >
                        {label.name}
                      </span>
                    </DropdownMenuCheckboxItem>
                  ))}
                </div>
              </ScrollArea>
            </DropdownMenuContent>
          </DropdownMenu>

          <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
            <DialogTrigger asChild>
              <Button size='sm' className='h-8 gap-1'>
                <PlusCircle className='h-3.5 w-3.5' />
                <span className='sr-only sm:not-sr-only sm:whitespace-nowrap'>
                  Novo Ticket
                </span>
              </Button>
            </DialogTrigger>
            <DialogContent className='sm:max-w-2xl'>
              <DialogHeader>
                <DialogTitle>Abrir Novo Ticket</DialogTitle>
                <DialogDescription>
                  Preencha as informações abaixo para registrar uma nova
                  solicitação de serviço.
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
                          {initialClientsData.map((client) => (
                            <SelectItem
                              key={client.id}
                              value={client.name}
                            >
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
                      <Select name='relatedEmployee'>
                        <SelectTrigger>
                          <SelectValue placeholder='Selecione um colaborador' />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value=''>Nenhum</SelectItem>
                          {initialEmployeesData.map((employee) => (
                            <SelectItem
                              key={employee.id}
                              value={employee.id}
                            >
                              {employee.name}
                            </SelectItem>
                          ))}
                        </SelectContent>
                      </Select>
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
                            <h4 className='font-medium leading-none'>
                              Membros
                            </h4>
                            <ScrollArea className='h-48'>
                              <div className='flex flex-col gap-2 p-1'>
                                {initialStaffsData.map((staff: Staff) => (
                                  <Label
                                    key={staff.email}
                                    className='flex items-center gap-2 font-normal'
                                  >
                                    <Checkbox
                                      checked={assignedTo.includes(
                                        staff.email
                                      )}
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
                                    <Avatar className='h-6 w-6'>
                                      <AvatarImage src={staff.avatar} />
                                      <AvatarFallback>
                                        {staff.fallback}
                                      </AvatarFallback>
                                    </Avatar>
                                    {staff.name}
                                  </Label>
                                ))}
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
                            <h4 className='font-medium leading-none'>
                              Etiquetas
                            </h4>
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
                                            : prev.filter(
                                                (l) => l.id !== label.id
                                              )
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
                <Button
                  variant='outline'
                  onClick={() => setIsDialogOpen(false)}
                >
                  Cancelar
                </Button>
                <Button type='submit' form='add-ticket-form'>
                  Salvar Ticket
                </Button>
              </DialogFooter>
            </DialogContent>
          </Dialog>
        </div>
      </div>

      <Tabs defaultValue='kanban'>
        <TabsList>
          <TabsTrigger value='list'>Lista</TabsTrigger>
          <TabsTrigger value='kanban'>Quadro Kanban</TabsTrigger>
        </TabsList>
        {isLoading ? (
          <div className='flex items-center justify-center h-96'>
            <Loader2 className='h-8 w-8 animate-spin' />
          </div>
        ) : (
          <>
            <TabsContent value='list'>
              <Card>
                <CardContent className='pt-6'>
                  <Table>
                    <TableHeader>
                      <TableRow>
                        <TableHead className='w-[100px]'>ID do Ticket</TableHead>
                        <TableHead>Assunto</TableHead>
                        <TableHead className='hidden md:table-cell'>
                          Cliente
                        </TableHead>
                        <TableHead>Prioridade</TableHead>
                        <TableHead>Status</TableHead>
                        <TableHead className='hidden md:table-cell'>
                          Última Atualização
                        </TableHead>
                        <TableHead>
                          <span className='sr-only'>Ações</span>
                        </TableHead>
                      </TableRow>
                    </TableHeader>
                    <TableBody>
                      {filteredTickets.map((ticket) => (
                        <Dialog key={ticket.id}>
                          <DialogTrigger asChild>
                            <TableRow
                              className='cursor-pointer'
                              onClick={() => handleRowClick(ticket)}
                            >
                              <TableCell className='font-medium'>
                                {ticket.id}
                              </TableCell>
                              <TableCell>
                                <div className='flex flex-col'>
                                  <span>{ticket.subject}</span>
                                  {ticket.labels && ticket.labels.length > 0 && (
                                    <div className='flex flex-wrap gap-1 mt-1'>
                                      {ticket.labels.map((label) => (
                                        <span
                                          key={label.id}
                                          className={`px-1.5 py-0.5 text-[10px] rounded-full text-white ${label.color}`}
                                        >
                                          {label.name}
                                        </span>
                                      ))}
                                    </div>
                                  )}
                                </div>
                              </TableCell>
                              <TableCell className='hidden md:table-cell'>
                                {ticket.client}
                              </TableCell>
                              <TableCell>
                                <Badge
                                  variant={
                                    priorityVariant[
                                      ticket.priority as keyof typeof priorityVariant
                                    ]
                                  }
                                >
                                  {ticket.priority}
                                </Badge>
                              </TableCell>
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
                              <TableCell className='hidden md:table-cell'>
                                <ClientSideDate dateString={ticket.updated} />
                              </TableCell>
                              <TableCell>
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
                                    <DropdownMenuItem>
                                      Ver Detalhes
                                    </DropdownMenuItem>
                                    <DropdownMenuItem>Atribuir</DropdownMenuItem>
                                    <DropdownMenuSeparator />
                                    <DropdownMenuItem>
                                      Fechar Ticket
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
                </CardContent>
              </Card>
            </TabsContent>
            <TabsContent value='kanban' className='flex-1'>
              <ClientOnly>
                <DndContext
                  sensors={sensors}
                  collisionDetection={closestCenter}
                  onDragStart={handleDragStart}
                  onDragEnd={handleDragEnd}
                  onDragOver={handleDragOver}
                >
                  <div className='grid flex-1 grid-cols-1 items-start gap-6 md:grid-cols-2 lg:grid-cols-4'>
                    <SortableContext items={kanbanColumns}>
                      {kanbanColumns.map((status) => {
                        const columnTickets = filteredTickets.filter(
                          (ticket) => ticket.status === status
                        )
                        return (
                          <KanbanColumn
                            key={status}
                            status={status}
                            tickets={columnTickets}
                          />
                        )
                      })}
                    </SortableContext>
                  </div>
                  <DragOverlay>
                    {activeTicket ? (
                      <Card className='cursor-grabbing transform-gpu rotate-3 shadow-lg'>
                        <CardHeader className='p-4 pb-2'>
                          {activeTicket.labels &&
                            activeTicket.labels.length > 0 && (
                              <div className='flex flex-wrap gap-1 mb-2'>
                                {activeTicket.labels.map((label) => (
                                  <span
                                    key={label.id}
                                    className={`px-2 py-0.5 text-xs rounded-full text-white ${label.color}`}
                                  >
                                    {label.name}
                                  </span>
                                ))}
                              </div>
                            )}
                          <CardTitle className='leading-tight'>
                            {activeTicket.subject}
                          </CardTitle>
                          <CardDescription className='pt-1 text-xs'>
                            {activeTicket.client} - {activeTicket.id}
                          </CardDescription>
                        </CardHeader>
                        <CardFooter className='p-4 pt-0'>
                          <div className='flex items-center justify-between w-full'>
                            <Badge
                              variant={
                                priorityVariant[
                                  activeTicket.priority as keyof typeof priorityVariant
                                ]
                              }
                            >
                              {activeTicket.priority}
                            </Badge>
                          </div>
                        </CardFooter>
                      </Card>
                    ) : null}
                  </DragOverlay>
                </DndContext>
              </ClientOnly>
            </TabsContent>
          </>
        )}
      </Tabs>
    </div>
  )
}

    