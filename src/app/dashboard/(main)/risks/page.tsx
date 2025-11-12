
'use client'

import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { MoreHorizontal, PlusCircle, Loader2 } from 'lucide-react'
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
import { Badge } from '@/components/ui/badge'
import { useState } from 'react'
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
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select'
import {
  useFirestore,
  useCollection,
  useMemoFirebase,
  addDocumentNonBlocking,
} from '@/firebase'
import { collection } from 'firebase/firestore'
import { useToast } from '@/hooks/use-toast'

export interface Hazard {
  id: string
  name: string
  esocialCode: string
  method: string
  category: string
  legalBasis: string
  potentialEffects: string
}

export interface Epc {
  id: string
  name: string
  active: boolean
  attenuation: string
}

export interface Epi {
  id: string
  name: string
  ca: string
  active: boolean
}

export interface EpiStock {
  id: string
  epiId: string
  quantity: number
  minStock: number
}

export interface EpiDelivery {
  id: string
  epiId: string
  epiName: string
  employeeId: string
  employeeName: string
  deliveryDate: string
  quantity: number
}

export default function RisksPage() {
  const { toast } = useToast()
  const firestore = useFirestore()

  const hazardsRef = useMemoFirebase(
    () => (firestore ? collection(firestore, 'hazards') : null),
    [firestore]
  )
  const epcsRef = useMemoFirebase(
    () => (firestore ? collection(firestore, 'epcs') : null),
    [firestore]
  )
  const episRef = useMemoFirebase(
    () => (firestore ? collection(firestore, 'epis') : null),
    [firestore]
  )

  const { data: hazardData, isLoading: isLoadingHazards } = useCollection<Hazard>(hazardsRef)
  const { data: epcData, isLoading: isLoadingEpcs } = useCollection<Epc>(epcsRef)
  const { data: epiData, isLoading: isLoadingEpis } = useCollection<Epi>(episRef)

  const [isHazardDialogOpen, setIsHazardDialogOpen] = useState(false)
  const [isEpcDialogOpen, setIsEpcDialogOpen] = useState(false)
  const [isEpiDialogOpen, setIsEpiDialogOpen] = useState(false)

  const handleAddHazard = (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault()
    if (!hazardsRef) return
    
    const formData = new FormData(event.currentTarget)
    const newHazard: Omit<Hazard, 'id'> = {
      name: formData.get('name') as string,
      esocialCode: formData.get('esocialCode') as string,
      category: formData.get('category') as string,
      method: formData.get('method') as string,
      legalBasis: formData.get('legalBasis') as string,
      potentialEffects: formData.get('potentialEffects') as string,
    }
    
    addDocumentNonBlocking(hazardsRef, newHazard)

    toast({ title: 'Sucesso!', description: 'Perigo/Fator de Risco adicionado.' })
    setIsHazardDialogOpen(false)
  }

  const handleAddEpc = (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault()
    if (!epcsRef) return
    
    const formData = new FormData(event.currentTarget)
    const newEpc: Omit<Epc, 'id'> = {
      name: formData.get('name') as string,
      attenuation: (formData.get('attenuation') as string) || 'N/A',
      active: true,
    }
    
    addDocumentNonBlocking(epcsRef, newEpc)

    toast({ title: 'Sucesso!', description: 'EPC adicionado.' })
    setIsEpcDialogOpen(false)
  }

  const handleAddEpi = (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault()
    if (!episRef) return

    const formData = new FormData(event.currentTarget)
    const newEpi: Omit<Epi, 'id'> = {
      name: formData.get('name') as string,
      ca: formData.get('ca') as string,
      active: true,
    }

    addDocumentNonBlocking(episRef, newEpi)
    
    toast({ title: 'Sucesso!', description: 'EPI adicionado.' })
    setIsEpiDialogOpen(false)
  }
  
  const isLoading = isLoadingHazards || isLoadingEpcs || isLoadingEpis;

  return (
    <div className='grid flex-1 auto-rows-max gap-8'>
      <div className='flex items-center gap-4'>
        <h1 className='flex-1 shrink-0 whitespace-nowrap text-xl font-semibold tracking-tight sm:grow-0'>
          Gestão de Riscos Ocupacionais
        </h1>
      </div>

      <Card>
        <CardHeader>
          <CardTitle className='flex items-center justify-between'>
            Catálogo de Perigos/Fatores de Risco
            <Dialog
              open={isHazardDialogOpen}
              onOpenChange={setIsHazardDialogOpen}
            >
              <DialogTrigger asChild>
                <Button size='sm' className='h-8 gap-1'>
                  <PlusCircle className='h-3.5 w-3.5' />
                  <span className='sr-only sm:not-sr-only sm:whitespace-nowrap'>
                    Adicionar Perigo
                  </span>
                </Button>
              </DialogTrigger>
              <DialogContent>
                <DialogHeader>
                  <DialogTitle>
                    Adicionar Novo Perigo/Fator de Risco
                  </DialogTitle>
                  <DialogDescription>
                    Preencha os detalhes para adicionar um novo item ao
                    catálogo.
                  </DialogDescription>
                </DialogHeader>
                <form id='add-hazard-form' onSubmit={handleAddHazard}>
                  <div className='grid gap-4 py-4'>
                    <div className='grid grid-cols-4 items-center gap-4'>
                      <Label htmlFor='name' className='text-right'>
                        Agente/Risco
                      </Label>
                      <Input
                        id='name'
                        name='name'
                        className='col-span-3'
                        required
                      />
                    </div>
                    <div className='grid grid-cols-4 items-center gap-4'>
                      <Label htmlFor='esocialCode' className='text-right'>
                        Cód. eSocial
                      </Label>
                      <Input
                        id='esocialCode'
                        name='esocialCode'
                        className='col-span-3'
                        required
                      />
                    </div>
                    <div className='grid grid-cols-4 items-center gap-4'>
                      <Label htmlFor='category' className='text-right'>
                        Categoria
                      </Label>
                      <Select name='category' required>
                        <SelectTrigger className='col-span-3'>
                          <SelectValue placeholder='Selecione a categoria' />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value='Físico'>Físico</SelectItem>
                          <SelectItem value='Químico'>Químico</SelectItem>
                          <SelectItem value='Biológico'>Biológico</SelectItem>
                          <SelectItem value='Ergonômico'>Ergonômico</SelectItem>
                          <SelectItem value='Acidente'>Acidente</SelectItem>
                        </SelectContent>
                      </Select>
                    </div>
                    <div className='grid grid-cols-4 items-center gap-4'>
                      <Label htmlFor='method' className='text-right'>
                        Método
                      </Label>
                      <Select name='method' required>
                        <SelectTrigger className='col-span-3'>
                          <SelectValue placeholder='Selecione o método' />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value='Quantitativo'>
                            Quantitativo
                          </SelectItem>
                          <SelectItem value='Qualitativo'>
                            Qualitativo
                          </SelectItem>
                        </SelectContent>
                      </Select>
                    </div>
                     <div className='grid grid-cols-4 items-center gap-4'>
                      <Label htmlFor='legalBasis' className='text-right'>
                        Base Legal
                      </Label>
                      <Input
                        id='legalBasis'
                        name='legalBasis'
                        className='col-span-3'
                      />
                    </div>
                     <div className='grid grid-cols-4 items-center gap-4'>
                      <Label htmlFor='potentialEffects' className='text-right'>
                        Efeitos
                      </Label>
                      <Input
                        id='potentialEffects'
                        name='potentialEffects'
                        className='col-span-3'
                      />
                    </div>
                  </div>
                </form>
                <DialogFooter>
                  <Button
                    variant='outline'
                    onClick={() => setIsHazardDialogOpen(false)}
                  >
                    Cancelar
                  </Button>
                  <Button type='submit' form='add-hazard-form'>
                    Salvar
                  </Button>
                </DialogFooter>
              </DialogContent>
            </Dialog>
          </CardTitle>
          <CardDescription>
            Base de dados central com todos os perigos e fatores de risco
            identificados, conforme a NR1 e Tabela 24 do eSocial.
          </CardDescription>
        </CardHeader>
        <CardContent>
          {isLoadingHazards ? (
            <div className='flex justify-center items-center h-48'>
              <Loader2 className='h-8 w-8 animate-spin' />
            </div>
          ) : (
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Agente/Risco</TableHead>
                <TableHead>Cód. eSocial</TableHead>
                <TableHead>Categoria</TableHead>
                <TableHead>Método</TableHead>
                <TableHead>
                  <span className='sr-only'>Ações</span>
                </TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {hazardData?.map((risk) => (
                <TableRow key={risk.id}>
                  <TableCell className='font-medium'>{risk.name}</TableCell>
                  <TableCell>
                    <Badge variant='outline'>{risk.esocialCode}</Badge>
                  </TableCell>
                  <TableCell>{risk.category}</TableCell>
                  <TableCell>{risk.method}</TableCell>
                  <TableCell>
                    <DropdownMenu>
                      <DropdownMenuTrigger asChild>
                        <Button aria-haspopup='true' size='icon' variant='ghost'>
                          <MoreHorizontal className='h-4 w-4' />
                          <span className='sr-only'>Alternar menu</span>
                        </Button>
                      </DropdownMenuTrigger>
                      <DropdownMenuContent align='end'>
                        <DropdownMenuLabel>Ações</DropdownMenuLabel>
                        <DropdownMenuItem>Editar</DropdownMenuItem>
                        <DropdownMenuItem className='text-destructive'>
                          Excluir
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

      <div className='grid gap-8 md:grid-cols-2'>
        <Card>
          <CardHeader>
            <CardTitle className='flex items-center justify-between'>
              Catálogo de EPC
              <Dialog open={isEpcDialogOpen} onOpenChange={setIsEpcDialogOpen}>
                <DialogTrigger asChild>
                  <Button size='sm' className='h-8 gap-1'>
                    <PlusCircle className='h-3.5 w-3.5' />
                    <span className='sr-only sm:not-sr-only sm:whitespace-nowrap'>
                      Adicionar EPC
                    </span>
                  </Button>
                </DialogTrigger>
                <DialogContent>
                  <DialogHeader>
                    <DialogTitle>Adicionar Novo EPC</DialogTitle>
                    <DialogDescription>
                      Preencha os detalhes do Equipamento de Proteção Coletiva.
                    </DialogDescription>
                  </DialogHeader>
                  <form id='add-epc-form' onSubmit={handleAddEpc}>
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
                        <Label htmlFor='attenuation' className='text-right'>
                          Atenuação
                        </Label>
                        <Input
                          id='attenuation'
                          name='attenuation'
                          placeholder='Ex: 15 dB(A) ou N/A'
                          className='col-span-3'
                        />
                      </div>
                    </div>
                  </form>
                  <DialogFooter>
                    <Button
                      variant='outline'
                      onClick={() => setIsEpcDialogOpen(false)}
                    >
                      Cancelar
                    </Button>
                    <Button type='submit' form='add-epc-form'>
                      Salvar
                    </Button>
                  </DialogFooter>
                </DialogContent>
              </Dialog>
            </CardTitle>
            <CardDescription>
              Gerencie todos os Equipamentos de Proteção Coletiva disponíveis.
            </CardDescription>
          </CardHeader>
          <CardContent>
             {isLoadingEpcs ? (
              <div className='flex justify-center items-center h-48'>
                <Loader2 className='h-8 w-8 animate-spin' />
              </div>
             ) : (
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Nome</TableHead>
                  <TableHead>Atenuação</TableHead>
                  <TableHead>Status</TableHead>
                  <TableHead>
                    <span className='sr-only'>Ações</span>
                  </TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {epcData?.map((epc) => (
                  <TableRow key={epc.id}>
                    <TableCell className='font-medium'>{epc.name}</TableCell>
                    <TableCell>{epc.attenuation}</TableCell>
                    <TableCell>
                      <Badge variant={epc.active ? 'secondary' : 'outline'}>
                        {epc.active ? 'Ativo' : 'Inativo'}
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

        <Card>
          <CardHeader>
            <CardTitle className='flex items-center justify-between'>
              Catálogo de EPI
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
            {isLoadingEpis ? (
                <div className='flex justify-center items-center h-48'>
                  <Loader2 className='h-8 w-8 animate-spin' />
                </div>
              ) : (
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
                  {epiData?.map((epi) => (
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
      </div>
    </div>
  )
}
