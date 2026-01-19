
'use client'

import { useState, useEffect } from 'react'
import {
  PlusCircle,
  Loader2,
  FilePlus,
  Check,
  ChevronsUpDown,
  X,
  Search,
} from 'lucide-react'
import { Badge } from '@/components/ui/badge'
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
import {
  useFirestore,
  setDocumentNonBlocking,
} from '@/firebase'
import { collection, query, where, getDocs, doc } from 'firebase/firestore'
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
import type { Client } from '@/app/dashboard/(main)/clients/data'
import axios from 'axios'

export function AddClientDialog({ allClients }: { allClients: Client[] }) {
  const [isDialogOpen, setIsDialogOpen] = useState(false)
  const firestore = useFirestore()
  const { toast } = useToast()

  const [cnpj, setCnpj] = useState('')
  const [isCnpjLoading, setIsCnpjLoading] = useState(false)
  const [cnpjError, setCnpjError] = useState<string | null>(null)

  const [name, setName] = useState('')
  const [tradeName, setTradeName] = useState('')
  const [address, setAddress] = useState('')

  const [cnae, setCnae] = useState('')
  const [riskLevel, setRiskLevel] = useState('')
  const [isCnaePopoverOpen, setIsCnaePopoverOpen] = useState(false)

  const [secondaryCnaes, setSecondaryCnaes] = useState<CnaeData[]>([])
  const [isSecondaryCnaePopoverOpen, setIsSecondaryCnaePopoverOpen] =
    useState(false)

  const [inheritData, setInheritData] = useState(false)
  
  const clientDataForInheritance = allClients?.[0]; // Simplified: just takes the first client

  useEffect(() => {
    if (inheritData && clientDataForInheritance) {
      setName(clientDataForInheritance.name);
      setTradeName(clientDataForInheritance.tradeName || '');
      setAddress(clientDataForInheritance.address || '');
      if (clientDataForInheritance.cnae) {
        const mainCnae = cnaeList.find(c => c.code === clientDataForInheritance.cnae);
        if (mainCnae) handleCnaeSelect(mainCnae);
      }
    } else {
        clearCnpjData();
    }
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [inheritData, clientDataForInheritance])

  const clearForm = () => {
    setCnpj('')
    setCnpjError(null)
    clearCnpjData()
    setInheritData(false)
  }

  const handleAddClient = async (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault()
    if (!firestore) return

    const formData = new FormData(event.currentTarget)

    const highestContractNumber =
      allClients?.reduce((max, client) => {
        const match = client.id.match(/CTR-\d{4}-(\d{3})/)
        if (match) {
          const num = parseInt(match[1], 10)
          return Math.max(max, num)
        }
        return max
      }, 0) || 0

    const newContractId = `CTR-${new Date().getFullYear()}-${(
      highestContractNumber + 1
    )
      .toString()
      .padStart(3, '0')}`

    const newClientData: Omit<Client, 'id'> & { id?: string } = {
      id: newContractId,
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

    const clientDocRef = doc(firestore, 'clients', newContractId)
    setDocumentNonBlocking(clientDocRef, newClientData, { merge: false })

    toast({
      title: 'Cliente Adicionado!',
      description: `O cliente "${newClientData.name}" foi adicionado com sucesso.`,
    })

    setIsDialogOpen(false)
    clearForm()
  }

  const clearCnpjData = () => {
    setName('')
    setTradeName('')
    setAddress('')
    setCnae('')
    setRiskLevel('')
    setSecondaryCnaes([])
  }

  const handleCnpjBlur = async () => {
    if (!cnpj || !firestore) return

    const cnpjRegex = /^(\d{2}\.?\d{3}\.?\d{3}\/?\d{4}-?\d{2}|\d{14})$/
    const cleanCnpj = cnpj.replace(/[^\d]/g, '')

    if (!cnpjRegex.test(cnpj)) {
      setCnpjError('Formato de CNPJ inválido.')
      return
    }

    setIsCnpjLoading(true)
    setCnpjError(null)

    try {
      const q = query(collection(firestore, 'clients'), where('cnpj', '==', cnpj))
      const querySnapshot = await getDocs(q)
      if (!querySnapshot.empty) {
        throw new Error('Este CNPJ já está cadastrado.')
      }

      const { data } = await axios.get(
        `https://brasilapi.com.br/api/cnpj/v1/${cleanCnpj}`
      )

      setName(data.razao_social || '')
      setTradeName(data.nome_fantasia || '')
      setAddress(
        `${data.logradouro}, ${data.numero} - ${data.bairro}, ${data.municipio} - ${data.uf}, CEP: ${data.cep}`
      )

      if (data.cnae_fiscal) {
        const mainCnaeData = cnaeList.find(
          (c) => c.code === data.cnae_fiscal.toString()
        )
        if (mainCnaeData) {
          handleCnaeSelect(mainCnaeData)
        }
      }

      if (data.cnaes_secundarios && data.cnaes_secundarios.length > 0) {
        const secondaryCnaesData = data.cnaes_secundarios
          .map((c: any) =>
            cnaeList.find((cnae) => cnae.code === c.codigo.toString())
          )
          .filter(Boolean)
        setSecondaryCnaes(secondaryCnaesData)
      }
    } catch (error: any) {
      clearCnpjData()
      if (error.message === 'Este CNPJ já está cadastrado.') {
        setCnpjError(error.message)
      } else if (axios.isAxiosError(error) && error.response?.status === 404) {
        setCnpjError('CNPJ não encontrado na base de dados da Receita Federal.')
      } else {
        console.error(error)
        setCnpjError('Erro ao buscar dados do CNPJ. Tente novamente.')
      }
    } finally {
      setIsCnpjLoading(false)
    }
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
  }

  const handleRemoveSecondaryCnae = (cnaeCode: string) => {
    setSecondaryCnaes((prev) => prev.filter((c) => c.code !== cnaeCode))
  }

  return (
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
                <div className='flex gap-2 items-center'>
                  <Input
                    id='cnpj'
                    name='cnpj'
                    placeholder='00.000.000/0000-00'
                    required
                    value={cnpj}
                    onChange={(e) => {
                      setCnpj(e.target.value)
                      setCnpjError(null)
                      clearCnpjData()
                    }}
                    onBlur={handleCnpjBlur}
                  />
                  <Button
                    type='button'
                    variant='secondary'
                    disabled={isCnpjLoading}
                    onClick={handleCnpjBlur}
                  >
                    {isCnpjLoading ? (
                      <Loader2 className='h-4 w-4 animate-spin' />
                    ) : (
                      <Search className='h-4 w-4' />
                    )}
                  </Button>
                </div>
                {cnpjError && (
                  <p className='text-sm text-destructive'>{cnpjError}</p>
                )}
              </div>

              <fieldset className='grid gap-4' disabled={isCnpjLoading}>
                <div className='flex items-center space-x-2'>
                  <Checkbox
                    id='inherit'
                    checked={inheritData}
                    onCheckedChange={(checked) =>
                      setInheritData(checked as boolean)
                    }
                  />
                  <Label htmlFor='inherit' className='cursor-pointer'>
                    Herdar dados da empresa principal (para filiais)
                  </Label>
                </div>
                <div className='grid grid-cols-2 gap-4'>
                  <div className='space-y-2'>
                    <Label htmlFor='name'>Nome Empresarial</Label>
                    <Input
                      id='name'
                      name='name'
                      value={name}
                      onChange={(e) => setName(e.target.value)}
                      required
                    />
                  </div>
                  <div className='space-y-2'>
                    <Label htmlFor='tradeName'>Nome Fantasia</Label>
                    <Input
                      id='tradeName'
                      name='tradeName'
                      value={tradeName}
                      onChange={(e) => setTradeName(e.target.value)}
                    />
                  </div>
                </div>
                <div className='space-y-2'>
                  <Label htmlFor='address'>Endereço</Label>
                  <Textarea
                    id='address'
                    name='address'
                    rows={2}
                    value={address}
                    onChange={(e) => setAddress(e.target.value)}
                  />
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
                              ? cnaeList.find((item) => item.code === cnae)
                                  ?.description
                              : 'Selecione ou busque um CNAE...'}
                          </span>
                          <ChevronsUpDown className='ml-2 h-4 w-4 shrink-0 opacity-50' />
                        </Button>
                      </PopoverTrigger>
                      <PopoverContent className='w-[--radix-popover-trigger-width] p-0'>
                        <Command>
                          <CommandInput placeholder='Buscar CNAE por código ou descrição...' />
                          <CommandEmpty>Nenhum CNAE encontrado.</CommandEmpty>
                          <CommandList>
                            <CommandGroup>
                              {cnaeList.map((item) => (
                                <CommandItem
                                  key={item.code}
                                  value={`${item.code} ${item.description}`}
                                  onSelect={() => handleCnaeSelect(item)}
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
                        <CommandEmpty>Nenhum CNAE encontrado.</CommandEmpty>
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
                                  onSelect={() => {
                                    handleSecondaryCnaeSelect(item)
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
                          onClick={() => handleRemoveSecondaryCnae(cnae.code)}
                        >
                          <X className='h-3 w-3' />
                        </button>
                      </Badge>
                    ))}
                  </div>
                </div>

                <Separator className='my-4' />

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
                    <Button type='button' size='sm' variant='outline'>
                      <FilePlus className='mr-2 h-4 w-4' />
                      Adicionar
                    </Button>
                  </div>
                  <div className='flex items-center justify-between p-2 border rounded-md'>
                    <Label>Contrato Social</Label>
                    <Button type='button' size='sm' variant='outline'>
                      <FilePlus className='mr-2 h-4 w-4' />
                      Adicionar
                    </Button>
                  </div>
                  <div className='flex items-center justify-between p-2 border rounded-md'>
                    <Label>Serviços e Tabela de Preços</Label>
                    <Button type='button' size='sm' variant='outline'>
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
            onClick={() => {
              setIsDialogOpen(false)
              clearForm()
            }}
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
  )
}
