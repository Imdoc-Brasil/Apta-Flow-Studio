
'use client'

import { useState, useMemo } from 'react'
import { MoreHorizontal, PlusCircle, Search, Filter } from 'lucide-react'
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
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
  DialogFooter,
} from '@/components/ui/dialog'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import Link from 'next/link'
import { type Client } from './data'
import {
  useFirestore,
  useCollection,
  useMemoFirebase,
  addDocumentNonBlocking,
} from '@/firebase'
import { collection } from 'firebase/firestore'
import { Loader2 } from 'lucide-react'

export default function ClientsPage() {
  const [isDialogOpen, setIsDialogOpen] = useState(false)
  const firestore = useFirestore()

  const clientsRef = useMemoFirebase(
    () => (firestore ? collection(firestore, 'clients') : null),
    [firestore]
  )

  const { data: clients, isLoading } = useCollection<Client>(clientsRef)

  const handleAddClient = (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault()
    if (!clientsRef) return

    const formData = new FormData(event.currentTarget)
    const newClientData = {
      // contractId is often the document ID, so we let Firestore generate it.
      name: formData.get('name') as string,
      cnpj: formData.get('cnpj') as string,
      status: 'Ativo',
      responsibleName: formData.get('responsibleName') as string,
      responsibleContact: formData.get('responsibleContact') as string,
      cnae: '',
      riskLevel: '1',
      contact: '',
      address: '',
    }

    addDocumentNonBlocking(clientsRef, newClientData).then((docRef) => {
      // If you need to do something with the new document's ID, you can.
      // For example, you could update the new document with its own ID.
      // updateDocumentNonBlocking(doc(clientsRef, docRef.id), { contractId: docRef.id });
    })

    setIsDialogOpen(false)
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
            <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
              <DialogTrigger asChild>
                <Button size='sm' className='h-8 gap-1'>
                  <PlusCircle className='h-3.5 w-3.5' />
                  <span className='sr-only sm:not-sr-only sm:whitespace-nowrap'>
                    Adicionar Cliente
                  </span>
                </Button>
              </DialogTrigger>
              <DialogContent>
                <DialogHeader>
                  <DialogTitle>Adicionar Novo Cliente</DialogTitle>
                  <DialogDescription>
                    Preencha os detalhes para cadastrar um novo cliente.
                  </DialogDescription>
                </DialogHeader>
                <form id='add-client-form' onSubmit={handleAddClient}>
                  <div className='grid gap-4 py-4'>
                    <div className='grid grid-cols-4 items-center gap-4'>
                      <Label htmlFor='name' className='text-right'>
                        Nome da Empresa
                      </Label>
                      <Input
                        id='name'
                        name='name'
                        className='col-span-3'
                        required
                      />
                    </div>
                    <div className='grid grid-cols-4 items-center gap-4'>
                      <Label htmlFor='cnpj' className='text-right'>
                        CNPJ
                      </Label>
                      <Input
                        id='cnpj'
                        name='cnpj'
                        className='col-span-3'
                        required
                      />
                    </div>
                    <div className='grid grid-cols-4 items-center gap-4'>
                      <Label htmlFor='responsibleName' className='text-right'>
                        Nome do Responsável
                      </Label>
                      <Input
                        id='responsibleName'
                        name='responsibleName'
                        className='col-span-3'
                        required
                      />
                    </div>
                    <div className='grid grid-cols-4 items-center gap-4'>
                      <Label
                        htmlFor='responsibleContact'
                        className='text-right'
                      >
                        Contato do Responsável
                      </Label>
                      <Input
                        id='responsibleContact'
                        name='responsibleContact'
                        type='email'
                        className='col-span-3'
                        required
                      />
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
                  <Button type='submit' form='add-client-form'>
                    Salvar Cliente
                  </Button>
                </DialogFooter>
              </DialogContent>
            </Dialog>
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
              {clients?.map((client) => (
                <TableRow key={client.id}>
                  <TableCell className='font-medium'>{client.id}</TableCell>
                  <TableCell>
                    <Link
                      href={`/dashboard/clients/${client.id}/info`}
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
                    {client.responsibleName}
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
                            Ver Detalhes
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
