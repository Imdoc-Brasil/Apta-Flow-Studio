'use client'

import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { MoreHorizontal, PlusCircle } from 'lucide-react'
import { useState } from 'react'
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table'
import { Badge } from '@/components/ui/badge'
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu'
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

const initialEpiData = [
  {
    id: 'EPI-01',
    name: 'Protetor auricular tipo concha',
    ca: '12345',
    active: true,
  },
  {
    id: 'EPI-02',
    name: 'Luva de segurança para proteção contra agentes mecânicos',
    ca: '67890',
    active: true,
  },
  {
    id: 'EPI-03',
    name: 'Respirador purificador de ar',
    ca: '11223',
    active: true,
  },
   { 
    ca: '98765', 
    name: 'Óculos de proteção',
    id: 'EPI-04',
    active: true,
  },
]

type Epi = (typeof initialEpiData)[0]


export default function EpiInventoryPage() {
  const [epiData, setEpiData] = useState(initialEpiData)
  const [isEpiDialogOpen, setIsEpiDialogOpen] = useState(false)

  const handleAddEpi = (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault()
    const formData = new FormData(event.currentTarget)
    const newEpi: Epi = {
      id: `EPI-${(Math.random() * 100).toFixed(0).padStart(2, '0')}`,
      name: formData.get('name') as string,
      ca: formData.get('ca') as string,
      active: true,
    }
    setEpiData((prev) => [newEpi, ...prev])
    setIsEpiDialogOpen(false)
    ;(event.target as HTMLFormElement).reset()
  }

  return (
     <Card>
          <CardHeader>
            <CardTitle className='flex items-center justify-between'>
              Inventário de EPIs
              <Dialog open={isEpiDialogOpen} onOpenChange={setIsEpiDialogOpen}>
                <DialogTrigger asChild>
                  <Button size='sm' className='h-8 gap-1'>
                    <PlusCircle className='h-3.5 w-3.5' />
                    <span className='sr-only sm:not-sr-only sm:whitespace-nowrap'>
                      Adicionar EPI
                    </span>
                  </Button>
                </DialogTrigger>
                <DialogContent>
                  <DialogHeader>
                    <DialogTitle>Adicionar Novo EPI</DialogTitle>
                    <DialogDescription>
                      Preencha os detalhes do Equipamento de Proteção
                      Individual.
                    </DialogDescription>
                  </DialogHeader>
                  <form id='add-epi-form' onSubmit={handleAddEpi}>
                    <div className='grid gap-4 py-4'>
                      <div className='grid grid-cols-4 items-center gap-4'>
                        <Label htmlFor='name' className='text-right'>
                          Nome
                        </Label>
                        <Input
                          id='name'
                          name='name'
                          className='col-span-3'
                          required
                        />
                      </div>
                      <div className='grid grid-cols-4 items-center gap-4'>
                        <Label htmlFor='ca' className='text-right'>
                          Nº do CA
                        </Label>
                        <Input
                          id='ca'
                          name='ca'
                          className='col-span-3'
                          required
                        />
                      </div>
                    </div>
                  </form>
                  <DialogFooter>
                    <Button
                      variant='outline'
                      onClick={() => setIsEpiDialogOpen(false)}
                    >
                      Cancelar
                    </Button>
                    <Button type='submit' form='add-epi-form'>
                      Salvar
                    </Button>
                  </DialogFooter>
                </DialogContent>
              </Dialog>
            </CardTitle>
            <CardDescription>
              Gerencie todos os Equipamentos de Proteção Individual e seus CAs.
            </CardDescription>
          </CardHeader>
          <CardContent>
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Nome</TableHead>
                  <TableHead>CA</TableHead>
                  <TableHead>Status</TableHead>
                  <TableHead>
                    <span className='sr-only'>Ações</span>
                  </TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {epiData.map((epi) => (
                  <TableRow key={epi.id}>
                    <TableCell className='font-medium'>{epi.name}</TableCell>
                    <TableCell>{epi.ca}</TableCell>
                    <TableCell>
                      <Badge variant={epi.active ? 'secondary' : 'outline'}>
                        {epi.active ? 'Ativo' : 'Inativo'}
                      </Badge>
                    </TableCell>
                    <TableCell>
                      <DropdownMenu>
                        <DropdownMenuTrigger asChild>
                          <Button aria-haspopup='true' size='icon' variant='ghost'>
                            <MoreHorizontal className='h-4 w-4' />
                          </Button>
                        </DropdownMenuTrigger>
                        <DropdownMenuContent align='end'>
                          <DropdownMenuItem>Editar</DropdownMenuItem>
                           <DropdownMenuItem>Associar a Risco/GHE</DropdownMenuItem>
                        </DropdownMenuContent>
                      </DropdownMenu>
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </CardContent>
        </Card>
  )
}
