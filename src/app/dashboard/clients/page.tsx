'use client'

import { useState } from 'react'
import { MoreHorizontal, PlusCircle } from 'lucide-react'

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
import Link from 'next/link'
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

export const initialClientsData = [
  {
    contractId: 'CTR-2024-001',
    name: 'Innovate Inc.',
    status: 'Ativo',
    responsibleName: 'Maria Silva',
    responsibleContact: '+55 11 98765-4321',
    address: 'Rua das Inovações, 123, São Paulo, SP',
    cnpj: '12.345.678/0001-99',
    cnae: '62.01-5-01',
    riskLevel: '3',
    contact: 'contato@innovateinc.com',
  },
  {
    contractId: 'CTR-2024-002',
    name: 'Solutions Co.',
    status: 'Ativo',
    responsibleName: 'João Santos',
    responsibleContact: '+55 21 91234-5678',
    address: 'Avenida das Soluções, 456, Rio de Janeiro, RJ',
    cnpj: '98.765.432/0001-11',
    cnae: '70.20-4-00',
    riskLevel: '2',
    contact: 'joao.santos@solutionsco.com',
  },
  {
    contractId: 'CTR-2024-003',
    name: 'Quantum Dynamics',
    status: 'Inativo',
    responsibleName: 'Ana Oliveira',
    responsibleContact: '+55 31 98888-7777',
    address: 'Praça da Tecnologia, 789, Belo Horizonte, MG',
    cnpj: '11.222.333/0001-44',
    cnae: '62.03-1-00',
    riskLevel: '4',
    contact: 'ana.o@quantumdynamics.com',
  },
  {
    contractId: 'CTR-2024-004',
    name: 'Stellar Tech',
    status: 'Ativo',
    responsibleName: 'Carlos Pereira',
    responsibleContact: '+55 41 99999-8888',
    address: 'Alameda das Estrelas, 101, Curitiba, PR',
    cnpj: '44.555.666/0001-55',
    cnae: '62.02-3-00',
    riskLevel: '3',
    contact: 'carlos.p@stellartech.com',
  },
  {
    contractId: 'CTR-2024-005',
    name: 'Apex Innovations',
    status: 'Ativo',
    responsibleName: 'Sofia Costa',
    responsibleContact: '+55 51 97777-6666',
    address: 'Rodovia do Progresso, 202, Porto Alegre, RS',
    cnpj: '66.777.888/0001-22',
    cnae: '62.09-1-00',
    riskLevel: '2',
    contact: 'sofia.costa@apexinnovations.com',
  },
]

type Client = (typeof initialClientsData)[0]

export default function ClientsPage() {
  const [clientsData, setClientsData] = useState(initialClientsData)
  const [isAddClientDialogOpen, setIsAddClientDialogOpen] = useState(false)

  const handleAddClient = (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault()
    const formData = new FormData(event.currentTarget)
    const newClient: Client = {
      contractId: `CTR-2024-${(clientsData.length + 1)
        .toString()
        .padStart(3, '0')}`,
      name: formData.get('name') as string,
      status: 'Ativo',
      responsibleName: formData.get('responsibleName') as string,
      responsibleContact: formData.get('responsibleContact') as string,
      address: formData.get('address') as string,
      cnpj: formData.get('cnpj') as string,
      cnae: formData.get('cnae') as string,
      riskLevel: formData.get('riskLevel') as string,
      contact: formData.get('contact') as string,
    }
    setClientsData((prev) => [newClient, ...prev])
    setIsAddClientDialogOpen(false)
  }

  return (
    <>
      <Card>
        <CardHeader>
          <CardTitle className='flex items-center justify-between'>
            <span>Clientes</span>
            <Dialog
              open={isAddClientDialogOpen}
              onOpenChange={setIsAddClientDialogOpen}
            >
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
                    {/* Add other fields as needed */}
                  </div>
                </form>
                <DialogFooter>
                  <Button
                    type='button'
                    variant='outline'
                    onClick={() => setIsAddClientDialogOpen(false)}
                  >
                    Cancelar
                  </Button>
                  <Button type='submit' form='add-client-form'>
                    Salvar Cliente
                  </Button>
                </DialogFooter>
              </DialogContent>
            </Dialog>
          </CardTitle>
          <CardDescription>
            Gerencie os clientes e seus contratos de serviço.
          </CardDescription>
        </CardHeader>
        <CardContent>
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
              {clientsData.map((client) => (
                <TableRow key={client.contractId} className='cursor-pointer'>
                  <TableCell className='font-medium'>
                    <Link
                      href={`/dashboard/clients/${client.contractId}/info`}
                      className='hover:underline'
                    >
                      {client.contractId}
                    </Link>
                  </TableCell>
                  <TableCell>
                    <Link
                      href={`/dashboard/clients/${client.contractId}/info`}
                      className='hover:underline'
                    >
                      {client.name}
                    </Link>
                  </TableCell>
                  <TableCell className='hidden sm:table-cell'>
                    <Badge
                      variant={client.status === 'Ativo' ? 'secondary' : 'outline'}
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
                          <Link
                            href={`/dashboard/clients/${client.contractId}/info`}
                          >
                            Ver Detalhes
                          </Link>
                        </DropdownMenuItem>
                        <DropdownMenuItem>Editar</DropdownMenuItem>
                      </DropdownMenuContent>
                    </DropdownMenu>
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </CardContent>
      </Card>
    </>
  )
}
