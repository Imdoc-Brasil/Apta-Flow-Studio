
'use client'

import { useState, useEffect } from 'react'
import {
  MoreHorizontal,
  PlusCircle,
  Filter,
  UserPlus,
  Tag,
  Loader2,
} from 'lucide-react'
import { useSortable } from '@dnd-kit/sortable'
import { CSS } from '@dnd-kit/utilities'
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
} from '@/components/ui/dropdown-menu'
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
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar'
import { useToast } from '@/hooks/use-toast'
import type { Ticket, TicketStatus } from '@/lib/types/ticket'
import {
  updateDocumentNonBlocking,
  useCollection,
  useFirestore,
  useMemoFirebase,
  useUser,
  createAuditLog,
} from '@/firebase'
import { collection, doc } from 'firebase/firestore'
import { formatDistanceToNow } from 'date-fns'
import { ptBR } from 'date-fns/locale'
import { TicketDetailsDialog } from '@/components/ticket-details-dialog'
import type { Staff } from '@/lib/types/staff'

const priorityVariant = {
  Alta: 'destructive',
  Média: 'default',
  Baixa: 'secondary',
} as const

function TimeAgo({ dateString }: { dateString: string }) {
  const [timeAgo, setTimeAgo] = useState('')

  useEffect(() => {
    const date = new Date(dateString)
    setTimeAgo(formatDistanceToNow(date, { addSuffix: true, locale: ptBR }))
  }, [dateString])

  if (!timeAgo) return null

  return <>{timeAgo}</>
}

export const TicketCard = ({ ticket }: { ticket: Ticket }) => {
  const {
    attributes,
    listeners,
    setNodeRef,
    transform,
    transition,
    isDragging,
  } = useSortable({ id: ticket.id, data: { type: 'Ticket', ticket } })
  const firestore = useFirestore()
  const { user } = useUser()
  const { toast } = useToast()
  const currentUserEmail = user?.email || ''

  const style = {
    transform: CSS.Transform.toString(transform),
    transition,
    opacity: isDragging ? 0.5 : 1,
  }
  const { data: staffs } = useCollection<Staff>(
    useMemoFirebase(
      () => (firestore ? collection(firestore, 'staffs') : null),
      [firestore]
    )
  )
  const assignedMembers =
    staffs?.filter((emp: Staff) => ticket.assignedTo?.includes(emp.email)) ?? []

  const handleCardClick = () => {
    if (ticket.status === 'Aberto' && firestore) {
      const ticketDocRef = doc(firestore, 'tickets', ticket.id)
      updateDocumentNonBlocking(ticketDocRef, {
        status: 'Em Progresso',
        assignedTo: [...(ticket.assignedTo || []), currentUserEmail],
        updated: new Date().toISOString(),
      })
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
                      <DropdownMenuSeparator />
                      <DropdownMenuItem
                        onClick={(e) => {
                          e.stopPropagation()
                          if (firestore && ticket.id) {
                            const ticketDocRef = doc(firestore, 'tickets', ticket.id)
                            updateDocumentNonBlocking(ticketDocRef, {
                              status: 'Arquivado',
                              updated: new Date().toISOString(),
                            })
                            createAuditLog(firestore, {
                              userId: user?.uid || '',
                              userEmail: user?.email || '',
                              userName: user?.displayName || '',
                              action: 'archive',
                              module: 'tickets',
                              entityId: ticket.id,
                              entityName: ticket.subject,
                              details: { previousStatus: ticket.status }
                            })
                            toast({
                              title: 'Ticket Arquivado!',
                              description: 'O ticket foi movido para o arquivo.',
                            })
                          }
                        }}
                      >
                        Arquivar Ticket
                      </DropdownMenuItem>
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
