
'use client'

import { useState, useMemo } from 'react'
import {
  MoreHorizontal,
  Search,
  Filter,
  Loader2,
  PlusCircle,
} from 'lucide-react'
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
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuTrigger,
  DropdownMenuSeparator,
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
import { Input } from '@/components/ui/input'
import Link from 'next/link'
import { type Client } from '@/app/dashboard/(main)/clients/data'
import {
  useFirestore,
  useCollection,
  useMemoFirebase,
  useUser,
  useDoc,
  createAuditLog,
} from '@/firebase'
import {
  collection,
  doc,
} from 'firebase/firestore'
import { useToast } from '@/hooks/use-toast'
import { updateDocumentNonBlocking } from '@/firebase'
import type { Staff } from '@/app/dashboard/(main)/employees/page'
import { AddClientDialog } from '@/components/add-client-dialog'


export default function ClientsPage() {
  const firestore = useFirestore()
  const { user } = useUser()
  const { toast } = useToast()

  const staffDocRef = useMemoFirebase(
    () => (firestore && user ? doc(firestore, 'staffs', user.uid) : null),
    [firestore, user]
  )
  const { data: staffProfile, isLoading: isStaffLoading } =
    useDoc<Staff>(staffDocRef)

  const [searchTerm, setSearchTerm] = useState('')
  const [statusFilter, setStatusFilter] = useState<string[]>(['Ativo'])
  const [isAddDialogOpen, setIsAddDialogOpen] = useState(false)
  const [clientToEdit, setClientToEdit] = useState<Client | null>(null)

  const clientsRef = useMemoFirebase(
    () => (firestore ? collection(firestore, 'clients') : null),
    [firestore]
  )
  const { data: allClients, isLoading: areClientsLoading } =
    useCollection<Client>(clientsRef)


  const isLoading = isStaffLoading || areClientsLoading

  const clientsToDisplay = useMemo(() => {
    if (isLoading || !allClients || !staffProfile) return []

    let filtered = allClients

    // Global filters (Status and Search)
    if (statusFilter.length > 0) {
      filtered = filtered.filter(c => statusFilter.includes(c.status))
    }

    if (searchTerm) {
      const term = searchTerm.toLowerCase()
      filtered = filtered.filter(c =>
        c.name.toLowerCase().includes(term) ||
        c.id.toLowerCase().includes(term)
      )
    }

    // Permission filters
    if (staffProfile.perfilId === 'super_admin' || !staffProfile.clientIds) {
      return filtered
    } else if (staffProfile.perfilId === 'cliente' && staffProfile.contractId) {
      return filtered.filter(
        (client) => client.id === staffProfile?.contractId
      )
    } else if (staffProfile.clientIds && staffProfile.clientIds.length > 0) {
      return filtered.filter((client) =>
        staffProfile.clientIds?.includes(client.id)
      )
    }

    return []
  }, [allClients, staffProfile, isLoading, searchTerm, statusFilter])

  const handleDisableClient = (clientId: string) => {
    if (!firestore || !clientId) return
    const client = allClients?.find(c => c.id === clientId)
    const clientDocRef = doc(firestore, 'clients', clientId)

    updateDocumentNonBlocking(clientDocRef, {
      status: 'Inativo'
    })

    createAuditLog(firestore, {
      userId: user?.uid || '',
      userEmail: user?.email || '',
      userName: user?.displayName || '',
      action: 'deactivate',
      module: 'clients',
      entityId: clientId,
      entityName: client?.name || clientId,
      details: { previousStatus: client?.status }
    })

    toast({
      title: 'Cliente Desativado',
      description: 'O cliente foi marcado como Inativo e removido da visualização padrão.',
    })
  }

  const openAddDialog = () => {
    setClientToEdit(null)
    setIsAddDialogOpen(true)
  }

  const openEditDialog = (client: Client) => {
    setClientToEdit(client)
    setIsAddDialogOpen(true)
  }

  return (
    <>
      <Card>
        <CardHeader>
          <CardTitle>Hub de Clientes</CardTitle>
          <CardDescription>
            Gerencie seus clientes, contratos e acordos de serviço.
          </CardDescription>
          <div className='flex items-center gap-2 pt-4'>
            <div className='relative w-full max-w-sm'>
              <Search className='absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground' />
              <Input
                type='search'
                placeholder='Buscar por nome ou código...'
                className='pl-8'
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
              />
            </div>
            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <Button
                  variant='outline'
                  size='sm'
                  className='h-10 gap-1 text-sm'
                >
                  <Filter className='h-3.5 w-3.5' />
                  <span className='sr-only sm:not-sr-only'>Status</span>
                </Button>
              </DropdownMenuTrigger>
              <DropdownMenuContent align='end'>
                <DropdownMenuLabel>Filtrar por Status</DropdownMenuLabel>
                <DropdownMenuSeparator />
                {['Ativo', 'Inativo'].map((status) => (
                  <DropdownMenuCheckboxItem
                    key={status}
                    checked={statusFilter.includes(status)}
                    onCheckedChange={(checked) => {
                      setStatusFilter((prev) =>
                        checked
                          ? [...prev, status]
                          : prev.filter((s) => s !== status)
                      )
                    }}
                  >
                    {status}
                  </DropdownMenuCheckboxItem>
                ))}
              </DropdownMenuContent>
            </DropdownMenu>
            <div className='ml-auto'>
              <Button size='sm' className='h-8 gap-1' onClick={openAddDialog}>
                <PlusCircle className='h-3.5 w-3.5' />
                <span className='sr-only sm:not-sr-only sm:whitespace-nowrap'>
                  Adicionar Cliente
                </span>
              </Button>
            </div>
          </div>
        </CardHeader>
        <CardContent>
          {isLoading ? (
            <div className='flex justify-center items-center h-64'>
              <Loader2 className='h-8 w-8 animate-spin text-muted-foreground' />
            </div>
          ) : (
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Contrato</TableHead>
                  <TableHead>Cliente</TableHead>
                  <TableHead className='hidden sm:table-cell'>Status</TableHead>
                  <TableHead className='hidden md:table-cell'>
                    Responsável
                  </TableHead>
                  <TableHead>
                    <span className='sr-only'>Ações</span>
                  </TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {clientsToDisplay.map((client) => (
                  <TableRow key={client.id}>
                    <TableCell className='font-medium'>{client.id}</TableCell>
                    <TableCell>
                      <Link
                        href={`/dashboard/clients/${client.id}`}
                        className='hover:underline'
                      >
                        {client.name}
                      </Link>
                    </TableCell>
                    <TableCell className='hidden sm:table-cell'>
                      <Badge
                        variant={
                          client.status === 'Ativo' ? 'secondary' : 'outline'
                        }
                      >
                        {client.status}
                      </Badge>
                    </TableCell>
                    <TableCell className='hidden md:table-cell'>
                      {client.contractResponsibleName}
                    </TableCell>
                    <TableCell>
                      <DropdownMenu>
                        <DropdownMenuTrigger asChild>
                          <Button
                            aria-haspopup='true'
                            size='icon'
                            variant='ghost'
                          >
                            <MoreHorizontal className='h-4 w-4' />
                            <span className='sr-only'>Alternar menu</span>
                          </Button>
                        </DropdownMenuTrigger>
                        <DropdownMenuContent align='end'>
                          <DropdownMenuLabel>Ações</DropdownMenuLabel>
                          <DropdownMenuItem asChild>
                            <Link href={`/dashboard/clients/${client.id}/info`}>
                              Detalhes
                            </Link>
                          </DropdownMenuItem>
                          <DropdownMenuItem onClick={() => openEditDialog(client)}>
                            Editar
                          </DropdownMenuItem>
                          <DropdownMenuItem onClick={() => handleDisableClient(client.id)}>
                            Desativar
                          </DropdownMenuItem>
                        </DropdownMenuContent>
                      </DropdownMenu>
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          )}
        </CardContent>
      </Card>
      <AddClientDialog
        open={isAddDialogOpen}
        onOpenChange={setIsAddDialogOpen}
        clientToEdit={clientToEdit}
        allClients={allClients || []}
      />
    </>
  )
}
