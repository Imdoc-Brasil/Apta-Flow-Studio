'use client'

import { useState } from 'react'
import { useParams } from 'next/navigation'
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
import { MoreHorizontal, PlusCircle } from 'lucide-react'
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from '@/components/ui/dialog'
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu'
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs'
import { Label } from '@/components/ui/label'
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select'
import { Textarea } from '@/components/ui/textarea'
import { initialHazardData } from '@/app/dashboard/(main)/risks/page'
import { initialUnitsData } from '../units/page'

// Mock data - In a real app, this would come from a database
const initialInventory = [
  {
    inventoryId: 'INV-001',
    hazardId: 'RF-001', // Ruído Contínuo ou Intermitente
    unitId: 'UNIT-001', // Matriz São Paulo
    sector: 'Produção',
    source: 'Máquina de corte XYZ',
  },
]

export default function PgrPage() {
  const [isAddRiskDialogOpen, setIsAddRiskDialogOpen] = useState(false)
  const [inventory, setInventory] = useState(initialInventory)

  const handleAddRisk = (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault()
    const formData = new FormData(event.currentTarget)
    const newRisk = {
      inventoryId: `INV-${Date.now().toString().slice(-4)}`,
      hazardId: formData.get('hazard') as string,
      unitId: formData.get('unit') as string,
      sector: formData.get('sector') as string,
      source: formData.get('source') as string,
    }
    setInventory((prev) => [...prev, newRisk])
    setIsAddRiskDialogOpen(false)
  }

  const getHazardById = (id: string) =>
    initialHazardData.find((h) => h.id === id)
  const getUnitById = (id: string) => initialUnitsData.find((u) => u.id === id)

  return (
    <div className='grid flex-1 auto-rows-max gap-4'>
      <div className='flex items-center gap-4'>
        <h1 className='flex-1 shrink-0 whitespace-nowrap text-xl font-semibold tracking-tight sm:grow-0'>
          Programa de Gerenciamento de Riscos (PGR)
        </h1>
      </div>
      <Tabs defaultValue='inventory'>
        <div className='flex items-center'>
          <TabsList>
            <TabsTrigger value='inventory'>Inventário de Riscos</TabsTrigger>
            <TabsTrigger value='plan' disabled>
              Plano de Ação
            </TabsTrigger>
          </TabsList>
          <div className='ml-auto flex items-center gap-2'>
            <Dialog
              open={isAddRiskDialogOpen}
              onOpenChange={setIsAddRiskDialogOpen}
            >
              <DialogTrigger asChild>
                <Button>
                  <PlusCircle className='mr-2 h-4 w-4' />
                  Adicionar Risco ao Inventário
                </Button>
              </DialogTrigger>
              <DialogContent className='sm:max-w-lg'>
                <DialogHeader>
                  <DialogTitle>Adicionar Risco ao Inventário</DialogTitle>
                  <DialogDescription>
                    Associe um perigo a uma unidade, setor e fonte geradora
                    específica.
                  </DialogDescription>
                </DialogHeader>
                <form id='add-risk-form' onSubmit={handleAddRisk}>
                  <div className='grid gap-4 py-4'>
                    <div className='space-y-2'>
                      <Label htmlFor='unit'>Unidade</Label>
                      <Select name='unit' required>
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
                      <Label htmlFor='sector'>Setor</Label>
                      {/* TODO: This should be dynamic based on the selected unit */}
                      <Select name='sector' required>
                        <SelectTrigger>
                          <SelectValue placeholder='Selecione o setor' />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value='Administrativo'>
                            Administrativo
                          </SelectItem>
                          <SelectItem value='Produção'>Produção</SelectItem>
                          <SelectItem value='Logística'>Logística</SelectItem>
                        </SelectContent>
                      </Select>
                    </div>
                    <div className='space-y-2'>
                      <Label htmlFor='hazard'>Perigo/Fator de Risco</Label>
                      <Select name='hazard' required>
                        <SelectTrigger>
                          <SelectValue placeholder='Selecione o perigo no catálogo' />
                        </SelectTrigger>
                        <SelectContent>
                          {initialHazardData.map((hazard) => (
                            <SelectItem key={hazard.id} value={hazard.id}>
                              {hazard.name} ({hazard.category})
                            </SelectItem>
                          ))}
                        </SelectContent>
                      </Select>
                    </div>
                    <div className='space-y-2'>
                      <Label htmlFor='source'>Fonte Geradora/Atividade</Label>
                      <Textarea
                        id='source'
                        name='source'
                        placeholder='Descreva a fonte do risco. Ex: Prensa hidráulica modelo X, atividade de solda...'
                        required
                      />
                    </div>
                  </div>
                  <DialogFooter>
                    <Button
                      variant='outline'
                      onClick={() => setIsAddRiskDialogOpen(false)}
                    >
                      Cancelar
                    </Button>
                    <Button type='submit' form='add-risk-form'>
                      Adicionar
                    </Button>
                  </DialogFooter>
                </form>
              </DialogContent>
            </Dialog>
          </div>
        </div>
        <TabsContent value='inventory'>
          <Card>
            <CardHeader>
              <CardTitle>Inventário de Riscos</CardTitle>
              <CardDescription>
                Listagem de todos os perigos e riscos identificados na empresa,
                por unidade e setor.
              </CardDescription>
            </CardHeader>
            <CardContent>
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>Perigo / Fator de Risco</TableHead>
                    <TableHead>Categoria</TableHead>
                    <TableHead>Setor</TableHead>
                    <TableHead>Unidade</TableHead>
                    <TableHead>
                      <span className='sr-only'>Ações</span>
                    </TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {inventory.map((item) => {
                    const hazard = getHazardById(item.hazardId)
                    const unit = getUnitById(item.unitId)
                    if (!hazard || !unit) return null
                    return (
                      <TableRow key={item.inventoryId}>
                        <TableCell className='font-medium'>
                          {hazard.name}
                        </TableCell>
                        <TableCell>
                          <Badge variant='outline'>{hazard.category}</Badge>
                        </TableCell>
                        <TableCell>{item.sector}</TableCell>
                        <TableCell>{unit.name}</TableCell>
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
                              <DropdownMenuItem>Avaliar Risco</DropdownMenuItem>
                              <DropdownMenuItem>Editar</DropdownMenuItem>
                              <DropdownMenuItem className='text-destructive'>
                                Excluir
                              </DropdownMenuItem>
                            </DropdownMenuContent>
                          </DropdownMenu>
                        </TableCell>
                      </TableRow>
                    )
                  })}
                </TableBody>
              </Table>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  )
}
