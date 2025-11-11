
'use client'

import { useState, useMemo } from 'react'
import {
  MoreHorizontal,
  PlusCircle,
  Search,
  Filter,
  Loader2,
  FilePlus,
  Check,
  ChevronsUpDown,
  X,
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
import { collection, query, where, getDocs } from 'firebase/firestore'
import { useToast } from '@/hooks/use-toast'
import { Textarea } from '@/components/ui/textarea'
import { Separator } from '@/components/ui/separator'
import { ScrollArea } from '@/components/ui/scroll-area'
import { cnaeList, type CnaeData } from '@/lib/cnae-risk-map'
import {
  Command,
  CommandEmpty,
  CommandGroup,
  CommandInput,
  CommandItem,
  CommandList,
} from '@/components/ui/command'
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from '@/components/ui/popover'
import { cn } from '@/lib/utils'
import { Checkbox } from '@/components/ui/checkbox'

export default function ClientsPage() {
  const [isDialogOpen, setIsDialogOpen] = useState(false)
  const firestore = useFirestore()
  const { toast } = useToast()

  const clientsRef = useMemoFirebase(
    () => (firestore ? collection(firestore, 'clients') : null),
    [firestore]
  )

  const { data: clients, isLoading } = useCollection<Client>(clientsRef)

  const [cnpj, setCnpj] = useState('')
  const [isCnpjLoading, setIsCnpjLoading] = useState(false)
  const [cnpjError, setCnpjError] = useState<string | null>(null)

  const [cnae, setCnae] = useState('')
  const [riskLevel, setRiskLevel] = useState('')
  const [isCnaePopoverOpen, setIsCnaePopoverOpen] = useState(false)

  const [secondaryCnaes, setSecondaryCnaes] = useState<CnaeData[]>([])
  const [isSecondaryCnaePopoverOpen, setIsSecondaryCnaePopoverOpen] =
    useState(false)

  const handleAddClient = async (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault()
    if (!clientsRef) return

    const formData = new FormData(event.currentTarget)
    const newClientData = {
      name: formData.get('name') as string,
      tradeName: formData.get('tradeName') as string,
      cnpj: formData.get('cnpj') as string,
      address: formData.get('address') as string,
      cnae: formData.get('cnae') as string,
      riskLevel: formData.get('riskLevel') as string,
      secondaryCnaes: secondaryCnaes.map((c) => c.code),
      status: 'Ativo',
      adminResponsibleName: formData.get('adminResponsibleName') as string,
      adminResponsibleCPF: formData.get('adminResponsibleCPF') as string,
      contractResponsibleName: formData.get(
        'contractResponsibleName'
      ) as string,
      contractResponsiblePhone: formData.get(
        'contractResponsiblePhone'
      ) as string,
      contractResponsibleEmail: formData.get(
        'contractResponsibleEmail'
      ) as string,
    }

    addDocumentNonBlocking(clientsRef, newClientData)
    toast({
      title: 'Cliente Adicionado!',
      description: `O cliente "${newClientData.name}" foi adicionado com sucesso.`,
    })

    setIsDialogOpen(false)
    setSecondaryCnaes([])
  }

  const handleCnpjBlur = async () => {
    if (!cnpj || !firestore || !clientsRef) return

    // Basic CNPJ format validation
    const cnpjRegex = /^(\d{2}\.?\d{3}\.?\d{3}\/\d{4}-?\d{2})$/
    if (!cnpjRegex.test(cnpj)) {
      setCnpjError('Formato de CNPJ inválido.')
      return
    }

    setIsCnpjLoading(true)
    setCnpjError(null)

    const q = query(clientsRef, where('cnpj', '==', cnpj))
    const querySnapshot = await getDocs(q)

    if (!querySnapshot.empty) {
      setCnpjError('Este CNPJ já está cadastrado.')
    } else {
      // Here you would call the external API
      // For now, we'll just clear the loading state
    }

    setIsCnpjLoading(false)
  }

  const handleCnaeSelect = (selectedCnae: CnaeData) => {
    setCnae(selectedCnae.code)
    setRiskLevel(selectedCnae.riskLevel.toString())
    setIsCnaePopoverOpen(false)
  }

  const handleSecondaryCnaeSelect = (selectedCnae: CnaeData) => {
    if (
      !secondaryCnaes.some((c) => c.code === selectedCnae.code) &&
      cnae !== selectedCnae.code
    ) {
      setSecondaryCnaes((prev) => [...prev, selectedCnae])
    }
    // Não fechar o popover: setIsSecondaryCnaePopoverOpen(false)
  }

  const handleRemoveSecondaryCnae = (cnaeCode: string) => {
    setSecondaryCnaes((prev) => prev.filter((c) => c.code !== cnaeCode))
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
              <DialogContent className='sm:max-w-2xl'>
                <DialogHeader>
                  <DialogTitle>Adicionar Novo Cliente</DialogTitle>
                  <DialogDescription>
                    Preencha os detalhes para cadastrar um novo cliente.
                  </DialogDescription>
                </DialogHeader>
                <form id='add-client-form' onSubmit={handleAddClient}>
                  <ScrollArea className='h-[60vh] pr-6'>
                    <div className='grid gap-6 py-4'>
                      <div className='space-y-2'>
                        <Label htmlFor='cnpj'>CNPJ</Label>
                        <div className='flex gap-2'>
                          <Input
                            id='cnpj'
                            name='cnpj'
                            placeholder='00.000.000/0000-00'
                            required
                            value={cnpj}
                            onChange={(e) => {
                              setCnpj(e.target.value)
                              setCnpjError(null)
                            }}
                            onBlur={handleCnpjBlur}
                          />
                          <Button
                            type='button'
                            variant='secondary'
                            disabled={isCnpjLoading}
                          >
                            {isCnpjLoading ? (
                              <Loader2 className='h-4 w-4 animate-spin' />
                            ) : (
                              <Search className='h-4 w-4' />
                            )}
                          </Button>
                        </div>
                        {cnpjError && (
                          <p className='text-sm text-destructive'>
                            {cnpjError}
                          </p>
                        )}
                      </div>

                      <fieldset
                        className='grid gap-4'
                        disabled={isCnpjLoading || !!cnpjError}
                      >
                        {/* Autopopulated fields */}
                        <div className='grid grid-cols-2 gap-4'>
                          <div className='space-y-2'>
                            <Label htmlFor='name'>Nome Empresarial</Label>
                            <Input id='name' name='name' required />
                          </div>
                          <div className='space-y-2'>
                            <Label htmlFor='tradeName'>Nome Fantasia</Label>
                            <Input id='tradeName' name='tradeName' />
                          </div>
                        </div>
                        <div className='space-y-2'>
                          <Label htmlFor='address'>Endereço</Label>
                          <Textarea id='address' name='address' rows={2} />
                        </div>
                        <div className='grid grid-cols-4 gap-4'>
                          <div className='space-y-2 col-span-3'>
                            <Label>CNAE Principal</Label>
                            <Popover
                              open={isCnaePopoverOpen}
                              onOpenChange={setIsCnaePopoverOpen}
                            >
                              <PopoverTrigger asChild>
                                <Button
                                  variant='outline'
                                  role='combobox'
                                  aria-expanded={isCnaePopoverOpen}
                                  className='w-full justify-between font-normal'
                                >
                                  <span className='truncate'>
                                    {cnae
                                      ? cnaeList.find(
                                          (item) => item.code === cnae
                                        )?.description
                                      : 'Selecione ou busque um CNAE...'}
                                  </span>
                                  <ChevronsUpDown className='ml-2 h-4 w-4 shrink-0 opacity-50' />
                                </Button>
                              </PopoverTrigger>
                              <PopoverContent className='w-[--radix-popover-trigger-width] p-0'>
                                <Command>
                                  <CommandInput placeholder='Buscar CNAE por código ou descrição...' />
                                  <CommandEmpty>
                                    Nenhum CNAE encontrado.
                                  </CommandEmpty>
                                  <CommandList>
                                    <CommandGroup>
                                      {cnaeList.map((item) => (
                                        <CommandItem
                                          key={item.code}
                                          value={`${item.code} ${item.description}`}
                                          onSelect={() =>
                                            handleCnaeSelect(item)
                                          }
                                          onClick={() =>
                                            handleCnaeSelect(item)
                                          }
                                        >
                                          <Check
                                            className={cn(
                                              'mr-2 h-4 w-4',
                                              cnae === item.code
                                                ? 'opacity-100'
                                                : 'opacity-0'
                                            )}
                                          />
                                          <div className='flex flex-col'>
                                            <span className='font-medium'>
                                              {item.description}
                                            </span>
                                            <span className='text-xs text-muted-foreground'>
                                              {item.code} - Grau de Risco:{' '}
                                              {item.riskLevel}
                                            </span>
                                          </div>
                                        </CommandItem>
                                      ))}
                                    </CommandGroup>
                                  </CommandList>
                                </Command>
                              </PopoverContent>
                            </Popover>
                            <Input
                              id='cnae'
                              name='cnae'
                              value={cnae}
                              className='hidden'
                              readOnly
                            />
                          </div>
                          <div className='space-y-2 col-span-1'>
                            <Label htmlFor='riskLevel'>Grau de Risco</Label>
                            <Input
                              id='riskLevel'
                              name='riskLevel'
                              value={riskLevel}
                              readOnly
                              className='bg-muted'
                              placeholder='Automático'
                            />
                          </div>
                        </div>

                        <div className='space-y-2'>
                          <Label>CNAEs Secundários</Label>
                          <Popover
                            open={isSecondaryCnaePopoverOpen}
                            onOpenChange={setIsSecondaryCnaePopoverOpen}
                          >
                            <PopoverTrigger asChild>
                              <Button
                                variant='outline'
                                role='combobox'
                                aria-expanded={isSecondaryCnaePopoverOpen}
                                className='w-full justify-between font-normal'
                              >
                                Adicionar CNAE secundário...
                                <ChevronsUpDown className='ml-2 h-4 w-4 shrink-0 opacity-50' />
                              </Button>
                            </PopoverTrigger>
                            <PopoverContent className='w-[--radix-popover-trigger-width] p-0'>
                              <Command>
                                <CommandInput placeholder='Buscar CNAE...' />
                                <CommandEmpty>
                                  Nenhum CNAE encontrado.
                                </CommandEmpty>
                                <CommandList>
                                  <CommandGroup>
                                    {cnaeList
                                      .filter(
                                        (c) =>
                                          c.code !== cnae &&
                                          !secondaryCnaes.some(
                                            (sc) => sc.code === c.code
                                          )
                                      )
                                      .map((item) => (
                                        <CommandItem
                                          key={item.code}
                                          value={`${item.code} ${item.description}`}
                                          onSelect={(currentValue) => {
                                            handleSecondaryCnaeSelect(item)
                                            // Não fecha o popover
                                          }}
                                        >
                                          <div className='flex flex-col'>
                                            <span className='font-medium'>
                                              {item.description}
                                            </span>
                                            <span className='text-xs text-muted-foreground'>
                                              {item.code}
                                            </span>
                                          </div>
                                        </CommandItem>
                                      ))}
                                  </CommandGroup>
                                </CommandList>
                              </Command>
                            </PopoverContent>
                          </Popover>
                          <div className='mt-2 flex flex-wrap gap-2'>
                            {secondaryCnaes.map((cnae) => (
                              <Badge
                                key={cnae.code}
                                variant='secondary'
                                className='flex items-center gap-1'
                              >
                                {cnae.code}
                                <button
                                  type='button'
                                  onClick={() =>
                                    handleRemoveSecondaryCnae(cnae.code)
                                  }
                                >
                                  <X className='h-3 w-3' />
                                </button>
                              </Badge>
                            ))}
                          </div>
                        </div>

                        <Separator className='my-4' />

                        {/* Manual fields */}
                        <h3 className='text-lg font-semibold'>Responsáveis</h3>
                        <div className='grid grid-cols-2 gap-4'>
                          <div className='space-y-2'>
                            <Label htmlFor='adminResponsibleName'>
                              Responsável Administrativo
                            </Label>
                            <Input
                              id='adminResponsibleName'
                              name='adminResponsibleName'
                              required
                            />
                          </div>
                          <div className='space-y-2'>
                            <Label htmlFor='adminResponsibleCPF'>
                              CPF do Resp. Administrativo
                            </Label>
                            <Input
                              id='adminResponsibleCPF'
                              name='adminResponsibleCPF'
                              required
                            />
                          </div>
                        </div>
                        <div className='space-y-2'>
                          <Label htmlFor='contractResponsibleName'>
                            Responsável pelo Contrato
                          </Label>
                          <Input
                            id='contractResponsibleName'
                            name='contractResponsibleName'
                            required
                          />
                        </div>
                        <div className='grid grid-cols-2 gap-4'>
                          <div className='space-y-2'>
                            <Label htmlFor='contractResponsiblePhone'>
                              Telefone do Resp. Contrato
                            </Label>
                            <Input
                              id='contractResponsiblePhone'
                              name='contractResponsiblePhone'
                              type='tel'
                              required
                            />
                          </div>
                          <div className='space-y-2'>
                            <Label htmlFor='contractResponsibleEmail'>
                              E-mail do Resp. Contrato
                            </Label>
                            <Input
                              id='contractResponsibleEmail'
                              name='contractResponsibleEmail'
                              type='email'
                              required
                            />
                          </div>
                        </div>

                        <Separator className='my-4' />

                        <h3 className='text-lg font-semibold'>
                          Checklist de Documentos
                        </h3>
                        <div className='space-y-3'>
                          <div className='flex items-center justify-between p-2 border rounded-md'>
                            <Label>Cartão CNPJ</Label>
                            <Button
                              type='button'
                              size='sm'
                              variant='outline'
                            >
                              <FilePlus className='mr-2 h-4 w-4' />
                              Adicionar
                            </Button>
                          </div>
                          <div className='flex items-center justify-between p-2 border rounded-md'>
                            <Label>Contrato Social</Label>
                            <Button
                              type='button'
                              size='sm'
                              variant='outline'
                            >
                              <FilePlus className='mr-2 h-4 w-4' />
                              Adicionar
                            </Button>
                          </div>
                          <div className='flex items-center justify-between p-2 border rounded-md'>
                            <Label>Serviços e Tabela de Preços</Label>
                            <Button
                              type='button'
                              size='sm'
                              variant='outline'
                            >
                              <FilePlus className='mr-2 h-4 w-4' />
                              Adicionar
                            </Button>
                          </div>
                        </div>
                      </fieldset>
                    </div>
                  </ScrollArea>
                </form>
                <DialogFooter>
                  <Button
                    variant='outline'
                    onClick={() => setIsDialogOpen(false)}
                  >
                    Cancelar
                  </Button>
                  <Button
                    type='submit'
                    form='add-client-form'
                    disabled={isCnpjLoading || !!cnpjError}
                  >
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
