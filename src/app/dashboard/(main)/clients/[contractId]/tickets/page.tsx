
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
  useUser,
} from '@/firebase'
import { collection, query, where, doc } from 'firebase/firestore'
import { TicketDetailsDialog } from '@/components/ticket-details-dialog'
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs'
import { ClientSideDateFormatter } from '@/components/client-side-date-formatter'

function ClientTicketsPage() {
  const params = useParams()
  const contractId = params.contractId as string
  const firestore = useFirestore()
  const { toast } = useToast()
  const { user } = useUser()
  const currentUserEmail = user?.email || ''

  const clientDocRef = useMemoFirebase(
    () => (firestore ? doc(firestore, 'clients', contractId) : null),
    [firestore, contractId]
  )
  const { data: client, isLoading: isClientLoading } = useDoc<Client>(clientDocRef);

  const ticketsRef = useMemoFirebase(
    () =>
      (firestore && client)
        ? query(
            collection(firestore, 'tickets'),
            where('client', '==', client.name)
          )
        : null,
    [firestore, client]
  )
  const { data: tickets, isLoading: areTicketsLoading } =
    useCollection<Ticket>(ticketsRef)

  const [selectedTicket, setSelectedTicket] = useState<Ticket | null>(null)

  const handleRowClick = (ticket: Ticket) => {
    if (ticket.status === 'Aberto' && ticket.id && firestore) {
      const ticketDocRef = doc(firestore, 'tickets', ticket.id)
      updateDocumentNonBlocking(ticketDocRef, {
        status: 'Em Progresso',
        assignedTo: [...(ticket.assignedTo || []), currentUserEmail],
        updated: new Date().toISOString(),
      })
    }
    setSelectedTicket(ticket)
  }

  const filteredTickets = tickets || []
  const isLoading = areTicketsLoading || isClientLoading;

  return (
    <>
      <Tabs defaultValue='list'>
        <TabsList>
          <TabsTrigger value='list'>Lista</TabsTrigger>
          <TabsTrigger value='kanban' disabled>Quadro Kanban</TabsTrigger>
        </TabsList>
        {isLoading ? (
          <div className='flex items-center justify-center h-96'>
            <Loader2 className='h-8 w-8 animate-spin' />
          </div>
        ) : (
          <TabsContent value='list'>
            <Card>
              <CardContent className='pt-6'>
                <Table>
                  <TableHeader>
                    <TableRow>
                      <TableHead>Assunto</TableHead>
                      <TableHead>Prioridade</TableHead>
                      <TableHead>Status</TableHead>
                      <TableHead>Atualizado</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {filteredTickets.map((ticket) => (
                      <TableRow
                        key={ticket.id}
                        className='cursor-pointer'
                        onClick={() => handleRowClick(ticket)}
                      >
                        <TableCell>{ticket.subject}</TableCell>
                        <TableCell>{ticket.priority}</TableCell>
                        <TableCell>{ticket.status}</TableCell>
                        <TableCell>
                          <ClientSideDateFormatter dateString={ticket.updated} />
                        </TableCell>
                      </TableRow>
                    ))}
                  </TableBody>
                </Table>
              </CardContent>
            </Card>
          </TabsContent>
        )}
      </Tabs>
      <Dialog
        open={!!selectedTicket}
        onOpenChange={(isOpen) => {
          if (!isOpen) {
            setSelectedTicket(null)
          }
        }}
      >
        {selectedTicket && <TicketDetailsDialog ticket={selectedTicket} />}
      </Dialog>
    </>
  )
}
export default ClientTicketsPage
// Dummy component to satisfy Next.js page type requirements
// when the actual component is not a default export.
// This file can be removed if ClientTicketsPage becomes a default export.
const DummyComponent = () => null;

