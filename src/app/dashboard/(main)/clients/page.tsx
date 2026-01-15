
'use client'

import { useState, useMemo } from 'react'
import {
  MoreHorizontal,
  Search,
  Filter,
  Loader2,
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
} from '@/firebase'
import {
  collection,
  doc,
} from 'firebase/firestore'
import type { Staff } from '@/app/dashboard/(main)/employees/page'
import { AddClientDialog } from '@/components/add-client-dialog'


export default function ClientsPage() {
  const firestore = useFirestore()
  const { user } = useUser()

  const staffDocRef = useMemoFirebase(
    () => (firestore && user ? doc(firestore, 'staffs', user.uid) : null),
    [firestore, user]
  )
  const { data: staffProfile, isLoading: isStaffLoading } =
    useDoc<Staff>(staffDocRef)

  const clientsRef = useMemoFirebase(
    () => (firestore ? collection(firestore, 'clients') : null),
    [firestore]
  )
  const { data: allClients, isLoading: areClientsLoading } =
    useCollection<Client>(clientsRef)


  const isLoading = isStaffLoading || areClientsLoading

  let clientsToDisplay: Client[] = []
  if (!isLoading && allClients && staffProfile) {
    if (staffProfile.perfilId === 'super_admin' || !staffProfile.clientIds) {
       clientsToDisplay = allClients;
    } else if (staffProfile.perfilId === 'cliente' && staffProfile.contractId) {
      clientsToDisplay = allClients.filter(
        (client) => client.id === staffProfile?.contractId
      )
    } else if (staffProfile.clientIds && staffProfile.clientIds.length > 0) {
      clientsToDisplay = allClients.filter((client) =>
        staffProfile.clientIds?.includes(client.id)
      )
    }
  }

  return (
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
              placeholder='Buscar por nome ou CNPJ...'
              className='pl-8'
            />
          </div>
          <Button variant='outline' size='sm' className='h-10 gap-1 text-sm'>
            <Filter className='h-3.5 w-3.5' />
            <span className='sr-only sm:not-sr-only'>Filtro</span>
          </Button>
          <div className='ml-auto'>
            <AddClientDialog />
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
                        <DropdownMenuItem>Editar</DropdownMenuItem>
                        <DropdownMenuItem>Desativar</DropdownMenuItem>
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
  )
}
