'use client'

import { useState, useMemo } from 'react'
import { MoreHorizontal, PlusCircle, Search } from 'lucide-react'
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
import { Textarea } from '@/components/ui/textarea'
import { initialGheData, type GHE } from './data'
import { initialUnitsData } from '../units/data'
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select'
import { useToast } from '@/hooks/use-toast'
import { Badge } from '@/components/ui/badge'

export default function GhePage() {
  const [ghes, setGhes] = useState(initialGheData)
  const [isAddDialogOpen, setIsAddDialogOpen] = useState(false)
  const [searchTerm, setSearchTerm] = useState('')
  const { toast } = useToast()

  const filteredGhes = useMemo(() => {
    return ghes.filter(
      (ghe) =>
        ghe.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
        ghe.description.toLowerCase().includes(searchTerm.toLowerCase())
    )
  }, [ghes, searchTerm])

  const handleAddGhe = (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault()
    const formData = new FormData(event.currentTarget)
    const newGhe: GHE = {
      id: `GHE-${Date.now().toString().slice(-3)}`,
      name: formData.get('name') as string,
      description: formData.get('description') as string,
      unitId: formData.get('unitId') as string,
    }
    setGhes((prev) => [...prev, newGhe])
    setIsAddDialogOpen(false)
    toast({
      title: 'GHE Adicionado!',
      description: `O grupo "${newGhe.name}" foi adicionado.`,
    })
  }
  
  const getUnitName = (unitId: string) => {
    return initialUnitsData.find((unit) => unit.id === unitId)?.name || 'N/A'
  }

  return (
    <Card>
      <CardHeader>
        <CardTitle>Grupos Homogêneos de Exposição (GHE)</CardTitle>
        <CardDescription>
          Gerencie os grupos de colaboradores que estão expostos aos mesmos
          riscos.
        </CardDescription>
        <div className='flex items-center justify-between pt-4'>
          <div className='relative w-full max-w-sm'>
            <Search className='absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground' />
            <Input
              type='search'
              placeholder='Buscar por nome do GHE...'
              className='pl-8'
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
            />
          </div>
          <Dialog open={isAddDialogOpen} onOpenChange={setIsAddDialogOpen}>
            <DialogTrigger asChild>
              <Button size='sm' className='h-8 gap-1'>
                <PlusCircle className='h-3.5 w-3.5' />
                <span className='sr-only sm:not-sr-only sm:whitespace-nowrap'>
                  Adicionar GHE
                </span>
              </Button>
            </DialogTrigger>
            <DialogContent>
              <DialogHeader>
                <DialogTitle>Adicionar Novo GHE</DialogTitle>
                <DialogDescription>
                  Preencha os detalhes para criar um novo grupo.
                </DialogDescription>
              </DialogHeader>
              <form id='add-ghe-form' onSubmit={handleAddGhe}>
                <div className='grid gap-4 py-4'>
                  <div className='space-y-2'>
                    <Label htmlFor='name'>Nome do GHE</Label>
                    <Input
                      id='name'
                      name='name'
                      placeholder='Ex: GHE Produção - Ruído'
                      required
                    />
                  </div>
                   <div className='space-y-2'>
                    <Label htmlFor='unitId'>Unidade</Label>
                    <Select name='unitId' required>
                      <SelectTrigger>
                        <SelectValue placeholder='Selecione a unidade' />
                      </SelectTrigger>
                      <SelectContent>
                        {initialUnitsData.map((unit) => (
                          <SelectItem key={unit.id} value={unit.id}>
                            {unit.name}
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                  </div>
                  <div className='space-y-2'>
                    <Label htmlFor='description'>Descrição</Label>
                    <Textarea
                      id='description'
                      name='description'
                      placeholder='Descreva as características deste grupo'
                      required
                    />
                  </div>
                </div>
              </form>
              <DialogFooter>
                <Button
                  variant='outline'
                  onClick={() => setIsAddDialogOpen(false)}
                >
                  Cancelar
                </Button>
                <Button type='submit' form='add-ghe-form'>
                  Salvar
                </Button>
              </DialogFooter>
            </DialogContent>
          </Dialog>
        </div>
      </CardHeader>
      <CardContent>
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>Nome do GHE</TableHead>
              <TableHead className='hidden md:table-cell'>Descrição</TableHead>
              <TableHead className='hidden sm:table-cell'>Unidade</TableHead>
              <TableHead>
                <span className='sr-only'>Ações</span>
              </TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {filteredGhes.map((ghe) => (
              <TableRow key={ghe.id}>
                <TableCell className='font-medium'>{ghe.name}</TableCell>
                <TableCell className='hidden md:table-cell'>
                  {ghe.description}
                </TableCell>
                 <TableCell className='hidden sm:table-cell'>
                   <Badge variant='outline'>{getUnitName(ghe.unitId)}</Badge>
                </TableCell>
                <TableCell>
                  <Button aria-haspopup='true' size='icon' variant='ghost'>
                    <MoreHorizontal className='h-4 w-4' />
                    <span className='sr-only'>Alternar menu</span>
                  </Button>
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </CardContent>
    </Card>
  )
}
