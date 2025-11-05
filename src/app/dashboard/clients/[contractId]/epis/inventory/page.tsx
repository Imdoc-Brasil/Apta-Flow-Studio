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
import { ScrollArea } from '@/components/ui/scroll-area'
import { Separator } from '@/components/ui/separator'
import { Checkbox } from '@/components/ui/checkbox'
import { Textarea } from '@/components/ui/textarea'

export const initialEpiData = [
  {
    id: 'EPI-01',
    name: 'Protetor auricular tipo concha',
    ca: '12345',
    active: true,
    stock: 100,
  },
  {
    id: 'EPI-02',
    name: 'Luva de segurança para proteção contra agentes mecânicos',
    ca: '67890',
    active: true,
    stock: 250,
  },
  {
    id: 'EPI-03',
    name: 'Respirador purificador de ar',
    ca: '11223',
    active: true,
    stock: 75,
  },
  {
    ca: '98765',
    name: 'Óculos de proteção',
    id: 'EPI-04',
    active: true,
    stock: 120,
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
      stock: parseInt(formData.get('quantidade') as string, 10) || 0,
    }
    setEpiData((prev) => [newEpi, ...prev])
    setIsEpiDialogOpen(false)
    ;(event.target as HTMLFormElement).reset()
  }

  return (
    <Card>
      <CardHeader>
        <CardTitle className='flex items-center justify-between'>
          Catálogo e Estoque de EPIs
          <Dialog open={isEpiDialogOpen} onOpenChange={setIsEpiDialogOpen}>
            <DialogTrigger asChild>
              <Button size='sm' className='h-8 gap-1'>
                <PlusCircle className='h-3.5 w-3.5' />
                <span className='sr-only sm:not-sr-only sm:whitespace-nowrap'>
                  Adicionar EPI
                </span>
              </Button>
            </DialogTrigger>
            <DialogContent className='sm:max-w-3xl'>
              <DialogHeader>
                <DialogTitle>Adicionar Novo EPI ao Catálogo</DialogTitle>
                <DialogDescription>
                  Preencha todos os detalhes do Equipamento de Proteção
                  Individual.
                </DialogDescription>
              </DialogHeader>
              <form id='add-epi-form' onSubmit={handleAddEpi}>
                <ScrollArea className='h-[70vh]'>
                  <div className='space-y-6 px-4 py-6'>
                    {/* Seção 01: Informações */}
                    <div className='space-y-4'>
                      <h4 className='font-semibold text-lg'>
                        Seção 01: Informações
                      </h4>
                      <div className='grid grid-cols-1 md:grid-cols-2 gap-4'>
                        <div className='space-y-1.5'>
                          <Label htmlFor='codigo'>Código</Label>
                          <Input id='codigo' name='codigo' />
                        </div>
                        <div className='space-y-1.5'>
                          <Label htmlFor='ca'>CCA (eSocial)</Label>
                          <Input id='ca' name='ca' required />
                        </div>
                      </div>
                      <div className='space-y-1.5'>
                        <Label htmlFor='name'>Nome (eSocial)</Label>
                        <Input id='name' name='name' required />
                      </div>
                    </div>

                    <Separator />

                    {/* Seção 02: Atenuação */}
                    <div className='space-y-4'>
                      <h4 className='font-semibold text-lg'>
                        Seção 02: Atenuação
                      </h4>
                      <div className='grid grid-cols-2 gap-4'>
                        <div className='space-y-1.5'>
                          <Label htmlFor='atenuacao_valor'>Valor</Label>
                          <Input
                            id='atenuacao_valor'
                            name='atenuacao_valor'
                            type='number'
                          />
                        </div>
                        <div className='space-y-1.5'>
                          <Label htmlFor='atenuacao_unidade'>
                            Unidade de Medida
                          </Label>
                          <Input
                            id='atenuacao_unidade'
                            name='atenuacao_unidade'
                            placeholder='Ex: dB, %'
                          />
                        </div>
                      </div>
                    </div>

                    <Separator />

                    {/* Seção 03: Treinamento e Uso */}
                    <div className='space-y-4'>
                      <h4 className='font-semibold text-lg'>
                        Seção 03: Treinamento e Uso
                      </h4>
                      <div className='grid grid-cols-1 md:grid-cols-2 gap-4 items-start'>
                        <div className='space-y-1.5'>
                          <Label htmlFor='especificacoes'>Especificações</Label>
                          <Textarea
                            id='especificacoes'
                            name='especificacoes'
                            rows={3}
                          />
                        </div>
                        <div className='space-y-1.5'>
                          <Label htmlFor='higienizacao'>Higienização</Label>
                          <Textarea
                            id='higienizacao'
                            name='higienizacao'
                            rows={3}
                          />
                        </div>
                        <div className='space-y-1.5'>
                          <Label htmlFor='uso'>Uso</Label>
                          <Textarea id='uso' name='uso' rows={3} />
                        </div>
                        <div className='space-y-1.5'>
                          <Label htmlFor='conservacao'>Conservação</Label>
                          <Textarea
                            id='conservacao'
                            name='conservacao'
                            rows={3}
                          />
                        </div>
                      </div>
                      <div className='flex flex-col gap-4 mt-4'>
                        <div className='flex items-center space-x-2'>
                          <Checkbox
                            id='possui_devolucao'
                            name='possui_devolucao'
                          />
                          <Label htmlFor='possui_devolucao'>
                            Possui Devolução?
                          </Label>
                        </div>
                        <div className='flex items-center space-x-2'>
                          <Checkbox
                            id='possui_validade'
                            name='possui_validade'
                          />
                          <Label htmlFor='possui_validade'>
                            Possui prazo de validade?
                          </Label>
                        </div>
                      </div>
                    </div>
                    <Separator />
                    {/* Seção 05: Estoque */}
                    <div className='space-y-4'>
                      <h4 className='font-semibold text-lg'>
                        Seção 05: Estoque
                      </h4>
                      <div className='grid grid-cols-1 md:grid-cols-2 gap-4'>
                        <div className='space-y-1.5'>
                          <Label htmlFor='fabricante'>Fabricante</Label>
                          <Input id='fabricante' name='fabricante' />
                        </div>
                        <div className='space-y-1.5'>
                          <Label htmlFor='custo'>Custo (R$)</Label>
                          <Input id='custo' name='custo' type='number' />
                        </div>
                        <div className='space-y-1.5'>
                          <Label htmlFor='quantidade'>Quantidade</Label>
                          <Input
                            id='quantidade'
                            name='quantidade'
                            type='number'
                            required
                          />
                        </div>
                        <div className='space-y-1.5'>
                          <Label htmlFor='data_fabricacao'>
                            Data de Fabricação
                          </Label>
                          <Input
                            id='data_fabricacao'
                            name='data_fabricacao'
                            type='date'
                          />
                        </div>
                        <div className='space-y-1.5'>
                          <Label htmlFor='data_validade'>
                            Data de Validade
                          </Label>
                          <Input
                            id='data_validade'
                            name='data_validade'
                            type='date'
                          />
                        </div>
                        <div className='space-y-1.5'>
                          <Label htmlFor='lote'>Lote</Label>
                          <Input id='lote' name='lote' />
                        </div>
                        <div className='space-y-1.5'>
                          <Label htmlFor='inmetro'>Selo Inmetro</Label>
                          <Input id='inmetro' name='inmetro' />
                        </div>
                      </div>
                    </div>
                  </div>
                </ScrollArea>
              </form>
              <DialogFooter className='pt-4 border-t'>
                <Button
                  variant='outline'
                  onClick={() => setIsEpiDialogOpen(false)}
                >
                  Cancelar
                </Button>
                <Button type='submit' form='add-epi-form'>
                  Salvar EPI
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
              <TableHead>Estoque</TableHead>
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
                <TableCell>{epi.stock}</TableCell>
                <TableCell>
                  <Badge variant={epi.active ? 'secondary' : 'outline'}>
                    {epi.active ? 'Ativo' : 'Inativo'}
                  </Badge>
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
                      </Button>
                    </DropdownMenuTrigger>
                    <DropdownMenuContent align='end'>
                      <DropdownMenuItem>Editar</DropdownMenuItem>
                      <DropdownMenuItem>Ver Estoque</DropdownMenuItem>
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
