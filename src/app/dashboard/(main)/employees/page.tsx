
'use client'

import { useState, useMemo, useEffect } from 'react'
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
  DropdownMenuSub,
  DropdownMenuSubContent,
  DropdownMenuSubTrigger,
  DropdownMenuPortal,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
  DropdownMenuCheckboxItem,
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
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from '@/components/ui/alert-dialog'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar'
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select'
import {
  useCollection,
  useFirestore,
  useMemoFirebase,
  addDocumentNonBlocking,
  updateDocumentNonBlocking,
  useUser,
  useDoc,
  setDocumentNonBlocking,
  createAuditLog,
} from '@/firebase'
import { collection, doc } from 'firebase/firestore'
import { useToast } from '@/hooks/use-toast'
import { useForm } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import { z } from 'zod'
import {
  Form,
  FormControl,
  FormDescription,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from '@/components/ui/form'
import type { Client } from '@/app/dashboard/(main)/clients/data'
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from '@/components/ui/popover'
import {
  Command,
  CommandEmpty,
  CommandInput,
  CommandGroup,
  CommandItem,
  CommandList,
} from '@/components/ui/command'
import { cn } from '@/lib/utils'
import { Checkbox } from '@/components/ui/checkbox'
import type { Staff, StaffStatus } from '@/lib/types/staff'
import type { Profile } from '@/lib/types/profile'

const staffFormSchema = z.object({
  name: z
    .string()
    .min(2, { message: 'O nome deve ter pelo menos 2 caracteres.' }),
  email: z.string().email({ message: 'Por favor, insira um email válido.' }),
  perfilId: z.string({ required_error: 'Por favor, selecione um perfil.' }),
  assinatura: z.string().min(2, { message: 'A assinatura é obrigatória.' }),
  phone: z.string().optional(),
  contractId: z.string().optional(),
  clientIds: z.array(z.string()).optional(),
  allClients: z.boolean().optional(),
  avatar: z.string().optional(),
})

type StaffFormValues = z.infer<typeof staffFormSchema>

export default function StaffsPage() {
  const firestore = useFirestore()
  const { user } = useUser()
  const staffsRef = useMemoFirebase(
    () => (firestore ? collection(firestore, 'staffs') : null),
    [firestore]
  )
  const { data: staffs, isLoading } = useCollection<Staff>(staffsRef)

  const clientsRef = useMemoFirebase(
    () => (firestore ? collection(firestore, 'clients') : null),
    [firestore]
  )
  const { data: clientsData, isLoading: areClientsLoading } =
    useCollection<Client>(clientsRef)

  const profilesRef = useMemoFirebase(
    () => (firestore ? collection(firestore, 'profiles') : null),
    [firestore]
  )
  const { data: profiles, isLoading: areProfilesLoading } =
    useCollection<Profile>(profilesRef)

  // Effect to add initial data if collection is empty
  useEffect(() => {
    if (firestore && !isLoading && staffs) {
      const superAdminExists = staffs.some(
        (s) => s.id === 'gilbert@aptaesocial.com.br'
      )
      if (!superAdminExists) {
        const superAdminData: Staff = {
          id: 'gilbert@aptaesocial.com.br',
          name: 'Gilbert Jackson',
          email: 'gilbert@aptaesocial.com.br',
          phone: '71999055517',
          perfilId: 'super_admin',
          assinatura: 'Diretor Médico | CRM-BA 21452',
          code: 'ADM-001',
          status: 'Ativo',
          situacao: 'Offline',
          avatar: `https://i.pravatar.cc/150?u=gilbert`,
          fallback: 'GJ',
        }
        const staffDocRef = doc(
          firestore,
          'staffs',
          superAdminData.email as string
        )
        setDocumentNonBlocking(staffDocRef, superAdminData, { merge: true })
      }
    }
  }, [firestore, isLoading, staffs])


  const [isAddDialogOpen, setIsAddDialogOpen] = useState(false)
  const [isEditDialogOpen, setIsEditDialogOpen] = useState(false)
  const [isDetailOpen, setIsDetailOpen] = useState(false)
  const [isDeleteDialogOpen, setIsDeleteDialogOpen] = useState(false)
  const [currentStaff, setCurrentStaff] = useState<Staff | null>(null)
  const [searchTerm, setSearchTerm] = useState('')
  const [statusFilter, setStatusFilter] = useState<string[]>([
    'Ativo',
    'Licença',
  ])
  const { toast } = useToast()

  const form = useForm<StaffFormValues>({
    resolver: zodResolver(staffFormSchema),
    defaultValues: {
      name: '',
      email: '',
      assinatura: '',
      phone: '',
      contractId: '',
      clientIds: [],
      allClients: false,
    },
  })

  const editForm = useForm<StaffFormValues>({
    resolver: zodResolver(staffFormSchema),
  })

  const filteredStaffs = useMemo(() => {
    if (!staffs) return []
    return staffs
      .filter((staff) => {
        const term = searchTerm.toLowerCase()
        if (!term) return true
        return (
          staff.name.toLowerCase().includes(term) ||
          staff.email.toLowerCase().includes(term)
        )
      })
      .filter((staff) => {
        if (statusFilter.length === 0) return false
        return statusFilter.includes(staff.status)
      })
  }, [staffs, searchTerm, statusFilter])

  function onSubmit(data: StaffFormValues) {
    if (!staffsRef) return
    const name = data.name
    const fallback = name
      .split(' ')
      .map((n) => n[0])
      .join('')
      .substring(0, 2)
      .toUpperCase()

    const newStaff: Omit<Staff, 'id'> = {
      name: data.name,
      email: data.email,
      perfilId: data.perfilId,
      assinatura: data.assinatura,
      phone: data.phone || '',
      code: `STF-${Math.floor(100 + Math.random() * 900)}`,
      status: 'Ativo',
      situacao: 'Offline',
      avatar: data.avatar || `https://i.pravatar.cc/150?u=${Math.random()}`,
      fallback,
      ...(data.perfilId === 'cliente' && { contractId: data.contractId }),
      ...(data.perfilId !== 'cliente' && { clientIds: data.allClients ? [] : data.clientIds }),
    }

    addDocumentNonBlocking(staffsRef, newStaff)
    toast({
      title: 'Membro Adicionado!',
      description: `${name} foi adicionado à equipe.`,
    })
    setIsAddDialogOpen(false)
    form.reset()
  }

  function onEditSubmit(data: StaffFormValues) {
    if (!currentStaff?.id || !firestore) return
    const staffDocRef = doc(firestore, 'staffs', currentStaff.id)

    const name = data.name
    const fallback = name
      .split(' ')
      .map((n) => n[0])
      .join('')
      .substring(0, 2)
      .toUpperCase()

    const updatedData: Partial<Staff> = {
      name: data.name,
      email: data.email,
      perfilId: data.perfilId,
      assinatura: data.assinatura,
      phone: data.phone || '',
      fallback,
      ...(data.avatar && { avatar: data.avatar }),
    };

    if (data.perfilId === 'cliente') {
      updatedData.contractId = data.contractId;
      updatedData.clientIds = [];
    } else {
      updatedData.clientIds = data.allClients ? [] : data.clientIds;
      updatedData.contractId = '';
    }

    updateDocumentNonBlocking(staffDocRef, updatedData)
    toast({
      title: 'Membro Atualizado!',
      description: 'As informações foram atualizadas com sucesso.',
    })
    setIsEditDialogOpen(false)
    setCurrentStaff(null)
  }

  const handleDeleteStaff = () => {
    if (!currentStaff?.id || !firestore) return
    const staffDocRef = doc(firestore, 'staffs', currentStaff.id)
    updateDocumentNonBlocking(staffDocRef, { status: 'Suspenso' })
    createAuditLog(firestore, {
      userId: user?.uid || '',
      userEmail: user?.email || '',
      userName: user?.displayName || '',
      action: 'suspend',
      module: 'staffs',
      entityId: currentStaff.id,
      entityName: currentStaff.name,
      details: { previousStatus: currentStaff.status }
    })
    toast({
      title: 'Membro Desativado!',
      variant: 'destructive',
    })
    setIsDeleteDialogOpen(false)
    setCurrentStaff(null)
  }

  const handleChangeStatus = (staffId: string, newStatus: StaffStatus) => {
    if (!firestore) return
    const staffDocRef = doc(firestore, 'staffs', staffId)
    const staff = staffs?.find(s => s.id === staffId || s.email === staffId)

    updateDocumentNonBlocking(staffDocRef, { status: newStatus })

    createAuditLog(firestore, {
      userId: user?.uid || '',
      userEmail: user?.email || '',
      userName: user?.displayName || '',
      action: 'change_status',
      module: 'staffs',
      entityId: staffId,
      entityName: staff?.name || staffId,
      details: { previousStatus: staff?.status, newStatus }
    })
  }

  const openEditDialog = (staff: Staff) => {
    setCurrentStaff(staff)
    editForm.reset({
      name: staff.name,
      email: staff.email,
      perfilId: staff.perfilId,
      assinatura: staff.assinatura,
      phone: staff.phone,
      contractId: staff.contractId || '',
      clientIds: staff.clientIds || [],
      allClients: !staff.clientIds || staff.clientIds.length === 0,
      avatar: staff.avatar,
    })
    setIsEditDialogOpen(true)
  }

  const openDetailDialog = (staff: Staff) => {
    setCurrentStaff(staff)
    setIsDetailOpen(true)
  }

  const openDeleteDialog = (staff: Staff) => {
    setCurrentStaff(staff)
    setIsDeleteDialogOpen(true)
  }

  const getProfileName = (perfilId: string) => {
    return profiles?.find((p) => p.id === perfilId)?.name || 'N/A'
  }

  const getClientName = (contractId: string) => {
    return clientsData?.find((c) => c.id === contractId)?.name || 'N/A'
  }

  const getStatusBadgeVariant = (status: StaffStatus) => {
    switch (status) {
      case 'Ativo':
        return 'secondary'
      case 'Suspenso':
        return 'destructive'
      case 'Licença':
        return 'outline'
      default:
        return 'default'
    }
  }

  const isLoadingData = isLoading || areProfilesLoading || areClientsLoading

  return (
    <>
      <Card>
        <CardHeader>
          <CardTitle>Equipe</CardTitle>
          <CardDescription>
            Gerencie a equipe interna da sua empresa.
          </CardDescription>
          <div className='flex items-center justify-between pt-4'>
            <div className='flex items-center gap-2'>
              <div className='relative w-full max-w-sm'>
                <Search className='absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground' />
                <Input
                  type='search'
                  placeholder='Buscar por nome ou email...'
                  className='pl-8'
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                />
              </div>
              <DropdownMenu>
                <DropdownMenuTrigger asChild>
                  <Button
                    variant='outline'
                    size='sm'
                    className='h-10 gap-1 text-sm'
                  >
                    <Filter className='h-3.5 w-3.5' />
                    <span className='sr-only sm:not-sr-only'>Filtro</span>
                  </Button>
                </DropdownMenuTrigger>
                <DropdownMenuContent align='end'>
                  <DropdownMenuLabel>Filtrar por Status</DropdownMenuLabel>
                  <DropdownMenuSeparator />
                  {['Ativo', 'Licença', 'Suspenso'].map((status) => (
                    <DropdownMenuCheckboxItem
                      key={status}
                      checked={statusFilter.includes(status)}
                      onCheckedChange={(checked) => {
                        setStatusFilter((prev) =>
                          checked
                            ? [...prev, status]
                            : prev.filter((s) => s !== status)
                        )
                      }}
                    >
                      {status}
                    </DropdownMenuCheckboxItem>
                  ))}
                </DropdownMenuContent>
              </DropdownMenu>
            </div>
            <Dialog open={isAddDialogOpen} onOpenChange={setIsAddDialogOpen}>
              <DialogTrigger asChild>
                <Button
                  size='sm'
                  className='h-8 gap-1'
                  onClick={() => form.reset()}
                >
                  <PlusCircle className='h-3.5 w-3.5' />
                  <span className='sr-only sm:not-sr-only sm:whitespace-nowrap'>
                    Adicionar Membro
                  </span>
                </Button>
              </DialogTrigger>
              <DialogContent className='sm:max-w-lg'>
                <DialogHeader>
                  <DialogTitle>Adicionar Novo Membro da Equipe</DialogTitle>
                  <DialogDescription>
                    Preencha os detalhes para adicionar um novo membro à equipe.
                  </DialogDescription>
                </DialogHeader>
                <Form {...form}>
                  <form
                    id='add-staff-form'
                    onSubmit={form.handleSubmit(onSubmit)}
                    className='space-y-4 py-4'
                  >
                    <div className='flex items-center gap-4'>
                      <Avatar className='h-16 w-16'>
                        <AvatarFallback>AV</AvatarFallback>
                      </Avatar>
                      <div className='flex-1 space-y-2'>
                        <Label htmlFor='avatar-upload'>Avatar</Label>
                        <Input
                          id='avatar-upload'
                          name='avatar-upload'
                          type='file'
                          className='text-sm'
                        />
                      </div>
                    </div>

                    <div className='grid grid-cols-3 gap-4'>
                      <div className='col-span-2 space-y-2'>
                        <FormField
                          control={form.control}
                          name='name'
                          render={({ field }) => (
                            <FormItem>
                              <FormLabel>Nome</FormLabel>
                              <FormControl>
                                <Input {...field} />
                              </FormControl>
                              <FormMessage />
                            </FormItem>
                          )}
                        />
                      </div>
                      <div className='col-span-1 space-y-2'>
                        <Label htmlFor='code'>Código</Label>
                        <Input
                          id='code'
                          name='code'
                          value={`STF-${'####'}`}
                          disabled
                        />
                      </div>
                    </div>

                    <div className='grid grid-cols-2 gap-4'>
                      <FormField
                        control={form.control}
                        name='email'
                        render={({ field }) => (
                          <FormItem>
                            <FormLabel>Email</FormLabel>
                            <FormControl>
                              <Input type='email' {...field} />
                            </FormControl>
                            <FormMessage />
                          </FormItem>
                        )}
                      />
                      <FormField
                        control={form.control}
                        name='phone'
                        render={({ field }) => (
                          <FormItem>
                            <FormLabel>Telefone</FormLabel>
                            <FormControl>
                              <Input {...field} />
                            </FormControl>
                            <FormMessage />
                          </FormItem>
                        )}
                      />
                    </div>

                    <div className='grid grid-cols-2 gap-4'>
                      <FormField
                        control={form.control}
                        name='perfilId'
                        render={({ field }) => (
                          <FormItem>
                            <FormLabel>Perfil</FormLabel>
                            <Select
                              onValueChange={field.onChange}
                              defaultValue={field.value}
                            >
                              <FormControl>
                                <SelectTrigger>
                                  <SelectValue placeholder='Selecione um perfil' />
                                </SelectTrigger>
                              </FormControl>
                              <SelectContent>
                                {profiles?.map((profile) => (
                                  <SelectItem
                                    key={profile.id}
                                    value={profile.id}
                                  >
                                    {profile.name}
                                  </SelectItem>
                                ))}
                              </SelectContent>
                            </Select>
                            <FormMessage />
                          </FormItem>
                        )}
                      />
                      <FormField
                        control={form.control}
                        name='assinatura'
                        render={({ field }) => (
                          <FormItem>
                            <FormLabel>Assinatura (Credencial)</FormLabel>
                            <FormControl>
                              <Input
                                placeholder='Ex: Eng. Civil'
                                {...field}
                              />
                            </FormControl>
                            <FormMessage />
                          </FormItem>
                        )}
                      />
                    </div>

                    {form.watch('perfilId') === 'cliente' && (
                      <FormField
                        control={form.control}
                        name='contractId'
                        render={({ field }) => (
                          <FormItem>
                            <FormLabel>Empresa Cliente</FormLabel>
                            <Select
                              onValueChange={field.onChange}
                              value={field.value || ''}
                            >
                              <FormControl>
                                <SelectTrigger>
                                  <SelectValue placeholder='Selecione a empresa do cliente' />
                                </SelectTrigger>
                              </FormControl>
                              <SelectContent>
                                {clientsData?.map((client) => (
                                  <SelectItem
                                    key={client.id}
                                    value={client.id!}
                                  >
                                    {client.name}
                                  </SelectItem>
                                ))}
                              </SelectContent>
                            </Select>
                            <FormMessage />
                          </FormItem>
                        )}
                      />
                    )}

                    {form.watch('perfilId') !== 'cliente' && form.watch('perfilId') && (
                      <FormField
                        control={form.control}
                        name='clientIds'
                        render={({ field }) => (
                          <FormItem>
                            <FormLabel>Acesso a Clientes</FormLabel>
                            <FormField
                              control={form.control}
                              name="allClients"
                              render={({ field: allClientsField }) => (
                                <FormItem className="flex flex-row items-center space-x-3 space-y-0 rounded-md border p-4 mb-4">
                                  <FormControl>
                                    <Checkbox
                                      checked={allClientsField.value}
                                      onCheckedChange={allClientsField.onChange}
                                    />
                                  </FormControl>
                                  <div className="space-y-1 leading-none">
                                    <FormLabel>
                                      Conceder acesso a todas as empresas
                                    </FormLabel>
                                    <FormDescription>
                                      O membro terá acesso a todos os clientes atuais e futuros.
                                    </FormDescription>
                                  </div>
                                </FormItem>
                              )}
                            />

                            {!form.watch('allClients') && (
                              <Popover>
                                <PopoverTrigger asChild>
                                  <FormControl>
                                    <Button
                                      variant='outline'
                                      role='combobox'
                                      className={cn(
                                        'w-full justify-between font-normal',
                                        !field.value?.length &&
                                        'text-muted-foreground'
                                      )}
                                    >
                                      Selecionar clientes...
                                      <ChevronsUpDown className='ml-2 h-4 w-4 shrink-0 opacity-50' />
                                    </Button>
                                  </FormControl>
                                </PopoverTrigger>
                                <PopoverContent className='w-[--radix-popover-trigger-width] p-0'>
                                  <Command>
                                    <CommandInput placeholder='Buscar cliente...' />
                                    <CommandEmpty>
                                      Nenhum cliente encontrado.
                                    </CommandEmpty>
                                    <CommandList>
                                      <CommandGroup>
                                        {areClientsLoading ? (
                                          <Loader2 className='mx-auto h-4 w-4 animate-spin' />
                                        ) : (
                                          clientsData?.map((client) => (
                                            <CommandItem
                                              key={client.id}
                                              onSelect={() => {
                                                const selected =
                                                  field.value || []
                                                const newSelection =
                                                  selected.includes(client.id!)
                                                    ? selected.filter(
                                                      (id) => id !== client.id
                                                    )
                                                    : [...selected, client.id!]
                                                field.onChange(newSelection)
                                              }}
                                            >
                                              <Check
                                                className={cn(
                                                  'mr-2 h-4 w-4',
                                                  field.value?.includes(
                                                    client.id!
                                                  )
                                                    ? 'opacity-100'
                                                    : 'opacity-0'
                                                )}
                                              />
                                              {client.name}
                                            </CommandItem>
                                          ))
                                        )}
                                      </CommandGroup>
                                    </CommandList>
                                  </Command>
                                </PopoverContent>
                              </Popover>
                            )}
                            <div className='mt-2 flex flex-wrap gap-1'>
                              {(form.watch('clientIds') || []).map(
                                (clientId: string) => (
                                  <Badge key={clientId} variant='secondary'>
                                    {getClientName(clientId)}
                                    <button
                                      type='button'
                                      className='ml-1 rounded-full outline-none ring-offset-background focus:ring-2 focus:ring-ring focus:ring-offset-2'
                                      onClick={() =>
                                        field.onChange(
                                          (
                                            form.watch('clientIds') || []
                                          ).filter(
                                            (id: string) => id !== clientId
                                          )
                                        )
                                      }
                                    >
                                      <X className='h-3 w-3 text-muted-foreground hover:text-foreground' />
                                    </button>
                                  </Badge>
                                )
                              )}
                            </div>
                            <FormMessage />
                          </FormItem>
                        )}
                      />
                    )}
                  </form>
                </Form>
                <DialogFooter>
                  <Button
                    variant='outline'
                    onClick={() => setIsAddDialogOpen(false)}
                  >
                    Cancelar
                  </Button>
                  <Button type='submit' form='add-staff-form'>
                    Salvar
                  </Button>
                </DialogFooter>
              </DialogContent>
            </Dialog>
          </div>
        </CardHeader>
        <CardContent>
          {isLoadingData ? (
            <div className='flex justify-center items-center h-64'>
              <Loader2 className='h-8 w-8 animate-spin text-muted-foreground' />
            </div>
          ) : (
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Membro</TableHead>
                  <TableHead>Perfil</TableHead>
                  <TableHead>Acesso ao Cliente</TableHead>
                  <TableHead>Status</TableHead>
                  <TableHead>
                    <span className='sr-only'>Ações</span>
                  </TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {filteredStaffs.map((staff) => (
                  <TableRow key={staff.id}>
                    <TableCell>
                      <div className='flex items-center gap-3'>
                        <Avatar className='h-9 w-9'>
                          <AvatarImage src={staff.avatar} alt={staff.name} />
                          <AvatarFallback>{staff.fallback}</AvatarFallback>
                        </Avatar>
                        <div className='grid gap-1'>
                          <p className='font-medium leading-none'>
                            {staff.name}
                          </p>
                          <p className='text-sm text-muted-foreground'>
                            {staff.email}
                          </p>
                        </div>
                      </div>
                    </TableCell>
                    <TableCell>{getProfileName(staff.perfilId)}</TableCell>
                    <TableCell>
                      {staff.perfilId === 'cliente' && staff.contractId ? (
                        <Badge variant='secondary'>
                          {getClientName(staff.contractId)}
                        </Badge>
                      ) : (staff.clientIds === undefined || staff.clientIds.length === 0) ? (
                        <Badge>Todos</Badge>
                      ) : (
                        <div className='flex flex-wrap gap-1'>
                          {staff.clientIds.slice(0, 2).map((id) => (
                            <Badge key={id} variant='outline'>
                              {getClientName(id)}
                            </Badge>
                          ))}
                          {staff.clientIds.length > 2 && (
                            <Badge variant='outline'>
                              +{staff.clientIds.length - 2}
                            </Badge>
                          )}
                        </div>
                      )}
                    </TableCell>
                    <TableCell>
                      <Badge variant={getStatusBadgeVariant(staff.status)}>
                        {staff.status}
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
                            <span className='sr-only'>Alternar menu</span>
                          </Button>
                        </DropdownMenuTrigger>
                        <DropdownMenuContent align='end'>
                          <DropdownMenuLabel>Ações</DropdownMenuLabel>
                          <DropdownMenuItem
                            onClick={() => openDetailDialog(staff)}
                          >
                            Ver Detalhes
                          </DropdownMenuItem>
                          <DropdownMenuItem
                            onClick={() => openEditDialog(staff)}
                          >
                            Editar
                          </DropdownMenuItem>
                          <DropdownMenuSeparator />
                          <DropdownMenuSub>
                            <DropdownMenuSubTrigger>
                              Alterar Status
                            </DropdownMenuSubTrigger>
                            <DropdownMenuPortal>
                              <DropdownMenuSubContent>
                                <DropdownMenuItem
                                  onClick={() =>
                                    handleChangeStatus(
                                      staff.id as string,
                                      'Ativo'
                                    )
                                  }
                                >
                                  Ativo
                                </DropdownMenuItem>
                                <DropdownMenuItem
                                  onClick={() =>
                                    handleChangeStatus(
                                      staff.id as string,
                                      'Licença'
                                    )
                                  }
                                >
                                  Licença
                                </DropdownMenuItem>
                                <DropdownMenuItem
                                  onClick={() =>
                                    handleChangeStatus(
                                      staff.id as string,
                                      'Suspenso'
                                    )
                                  }
                                >
                                  Suspenso
                                </DropdownMenuItem>
                              </DropdownMenuSubContent>
                            </DropdownMenuPortal>
                          </DropdownMenuSub>
                          <DropdownMenuSeparator />
                          <DropdownMenuItem
                            className='text-destructive'
                            onClick={() => openDeleteDialog(staff)}
                          >
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

      {/* Edit Dialog */}
      <Dialog open={isEditDialogOpen} onOpenChange={setIsEditDialogOpen}>
        <DialogContent className='sm:max-w-lg'>
          <DialogHeader>
            <DialogTitle>Editar Membro da Equipe</DialogTitle>
            <DialogDescription>
              Modifique os detalhes do membro da equipe.
            </DialogDescription>
          </DialogHeader>
          <Form {...editForm}>
            <form
              id='edit-staff-form'
              onSubmit={editForm.handleSubmit(onEditSubmit)}
              className='space-y-4 py-4'
            >
              <div className='flex items-center gap-4'>
                <Avatar className='h-16 w-16'>
                  <AvatarImage src={currentStaff?.avatar} />
                  <AvatarFallback>
                    {currentStaff?.fallback || 'AV'}
                  </AvatarFallback>
                </Avatar>
                <div className='flex-1 space-y-2'>
                  <Label htmlFor='avatar-upload'>Avatar</Label>
                  <Input
                    id='avatar-upload'
                    name='avatar-upload'
                    type='file'
                    className='text-sm'
                    onChange={(e) => {
                      if (e.target.files?.[0]) {
                        const file = e.target.files[0];
                        const reader = new FileReader();
                        reader.onloadend = () => {
                          editForm.setValue('avatar', reader.result as string);
                        };
                        reader.readAsDataURL(file);
                      }
                    }}
                  />
                </div>
              </div>

              <div className='grid grid-cols-3 gap-4'>
                <div className='col-span-2 space-y-2'>
                  <FormField
                    control={editForm.control}
                    name='name'
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Nome</FormLabel>
                        <FormControl>
                          <Input {...field} />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                </div>
                <div className='col-span-1 space-y-2'>
                  <Label htmlFor='code'>Código</Label>
                  <Input
                    id='code'
                    name='code'
                    value={currentStaff?.code || `STF-${'####'}`}
                    disabled
                  />
                </div>
              </div>

              <div className='grid grid-cols-2 gap-4'>
                <FormField
                  control={editForm.control}
                  name='email'
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Email</FormLabel>
                      <FormControl>
                        <Input type='email' {...field} />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
                <FormField
                  control={editForm.control}
                  name='phone'
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Telefone</FormLabel>
                      <FormControl>
                        <Input {...field} />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
              </div>

              <div className='grid grid-cols-2 gap-4'>
                <FormField
                  control={editForm.control}
                  name='perfilId'
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Perfil</FormLabel>
                      <Select
                        onValueChange={field.onChange}
                        defaultValue={field.value}
                      >
                        <FormControl>
                          <SelectTrigger>
                            <SelectValue placeholder='Selecione um perfil' />
                          </SelectTrigger>
                        </FormControl>
                        <SelectContent>
                          {profiles?.map((profile) => (
                            <SelectItem key={profile.id} value={profile.id}>
                              {profile.name}
                            </SelectItem>
                          ))}
                        </SelectContent>
                      </Select>
                      <FormMessage />
                    </FormItem>
                  )}
                />
                <FormField
                  control={editForm.control}
                  name='assinatura'
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Assinatura (Credencial)</FormLabel>
                      <FormControl>
                        <Input placeholder='Ex: Eng. Civil' {...field} />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
              </div>
              {editForm.watch('perfilId') === 'cliente' ? (
                <FormField
                  control={editForm.control}
                  name='contractId'
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Empresa Cliente</FormLabel>
                      <Select
                        onValueChange={field.onChange}
                        value={field.value || ''}
                      >
                        <FormControl>
                          <SelectTrigger>
                            <SelectValue placeholder='Selecione a empresa do cliente' />
                          </SelectTrigger>
                        </FormControl>
                        <SelectContent>
                          {clientsData?.map((client) => (
                            <SelectItem key={client.id} value={client.id!}>
                              {client.name}
                            </SelectItem>
                          ))}
                        </SelectContent>
                      </Select>
                      <FormMessage />
                    </FormItem>
                  )}
                />
              ) : (
                editForm.watch('perfilId') && (
                  <FormField
                    control={editForm.control}
                    name='clientIds'
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Acesso a Clientes</FormLabel>
                        <FormField
                          control={editForm.control}
                          name="allClients"
                          render={({ field: allClientsField }) => (
                            <FormItem className="flex flex-row items-center space-x-3 space-y-0 rounded-md border p-4 mb-4">
                              <FormControl>
                                <Checkbox
                                  checked={allClientsField.value}
                                  onCheckedChange={allClientsField.onChange}
                                />
                              </FormControl>
                              <div className="space-y-1 leading-none">
                                <FormLabel>
                                  Conceder acesso a todas as empresas
                                </FormLabel>
                              </div>
                            </FormItem>
                          )}
                        />

                        {!editForm.watch('allClients') && (
                          <Popover>
                            <PopoverTrigger asChild>
                              <FormControl>
                                <Button
                                  variant='outline'
                                  role='combobox'
                                  className={cn(
                                    'w-full justify-between font-normal',
                                    !field.value?.length &&
                                    'text-muted-foreground'
                                  )}
                                >
                                  Selecionar clientes...
                                  <ChevronsUpDown className='ml-2 h-4 w-4 shrink-0 opacity-50' />
                                </Button>
                              </FormControl>
                            </PopoverTrigger>
                            <PopoverContent className='w-[--radix-popover-trigger-width] p-0'>
                              <Command>
                                <CommandInput placeholder='Buscar cliente...' />
                                <CommandEmpty>Nenhum cliente encontrado.</CommandEmpty>
                                <CommandList>
                                  <CommandGroup>
                                    {areClientsLoading ? (
                                      <Loader2 className='mx-auto h-4 w-4 animate-spin' />
                                    ) : (
                                      clientsData?.map((client) => (
                                        <CommandItem
                                          key={client.id}
                                          onSelect={() => {
                                            const selected = field.value || []
                                            const newSelection = selected.includes(
                                              client.id!
                                            )
                                              ? selected.filter(
                                                (id) => id !== client.id
                                              )
                                              : [...selected, client.id!]
                                            field.onChange(newSelection)
                                          }}
                                        >
                                          <Check
                                            className={cn(
                                              'mr-2 h-4 w-4',
                                              field.value?.includes(client.id!)
                                                ? 'opacity-100'
                                                : 'opacity-0'
                                            )}
                                          />
                                          {client.name}
                                        </CommandItem>
                                      ))
                                    )}
                                  </CommandGroup>
                                </CommandList>
                              </Command>
                            </PopoverContent>
                          </Popover>
                        )}
                        <div className='mt-2 flex flex-wrap gap-1'>
                          {(editForm.watch('clientIds') || []).map(
                            (clientId: string) => (
                              <Badge key={clientId} variant='secondary'>
                                {getClientName(clientId)}
                                <button
                                  type='button'
                                  className='ml-1 rounded-full outline-none ring-offset-background focus:ring-2 focus:ring-ring focus:ring-offset-2'
                                  onClick={() =>
                                    field.onChange(
                                      (
                                        editForm.watch('clientIds') || []
                                      ).filter(
                                        (id: string) => id !== clientId
                                      )
                                    )
                                  }
                                >
                                  <X className='h-3 w-3 text-muted-foreground hover:text-foreground' />
                                </button>
                              </Badge>
                            )
                          )}
                        </div>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                )
              )}
            </form>
          </Form>
          <DialogFooter>
            <Button
              variant='outline'
              onClick={() => setIsEditDialogOpen(false)}
            >
              Cancelar
            </Button>
            <Button type='submit' form='edit-staff-form'>
              Salvar Alterações
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* Detail Dialog */}
      <Dialog open={isDetailOpen} onOpenChange={setIsDetailOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Detalhes do Membro</DialogTitle>
          </DialogHeader>
          {currentStaff && (
            <div className='grid gap-4 py-4'>
              <div className='flex items-center gap-4'>
                <Avatar className='h-16 w-16'>
                  <AvatarImage
                    src={currentStaff.avatar}
                    alt={currentStaff.name}
                  />
                  <AvatarFallback>{currentStaff.fallback}</AvatarFallback>
                </Avatar>
                <div>
                  <p className='font-bold text-lg'>{currentStaff.name}</p>
                  <p className='text-sm text-muted-foreground'>
                    {currentStaff.email}
                  </p>
                  <p className='text-sm text-muted-foreground'>
                    {currentStaff.phone}
                  </p>
                </div>
              </div>
              <div className='space-y-2'>
                <p className='text-sm font-medium'>Código</p>
                <p className='text-muted-foreground'>{currentStaff.code}</p>
              </div>
              <div className='space-y-2'>
                <p className='text-sm font-medium'>Perfil</p>
                <p className='text-muted-foreground'>
                  {getProfileName(currentStaff.perfilId)}
                </p>
              </div>
              <div className='space-y-2'>
                <p className='text-sm font-medium'>Assinatura</p>
                <p className='text-muted-foreground'>
                  {currentStaff.assinatura}
                </p>
              </div>
              <div className='space-y-2'>
                <p className='text-sm font-medium'>Status</p>
                <Badge variant={getStatusBadgeVariant(currentStaff.status)}>
                  {currentStaff.status}
                </Badge>
              </div>
              <div className='space-y-2'>
                <p className='text-sm font-medium'>Situação</p>
                <div className='flex items-center gap-2'>
                  <span
                    className={`h-2 w-2 rounded-full ${currentStaff.situacao === 'Online'
                      ? 'bg-green-500'
                      : 'bg-gray-400'
                      }`}
                  ></span>
                  <span>{currentStaff.situacao}</span>
                </div>
              </div>
            </div>
          )}
          <DialogFooter>
            <Button onClick={() => setIsDetailOpen(false)}>Fechar</Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* Delete Confirmation Dialog */}
      <AlertDialog
        open={isDeleteDialogOpen}
        onOpenChange={setIsDeleteDialogOpen}
      >
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Você tem certeza?</AlertDialogTitle>
            <AlertDialogDescription>
              Esta ação não pode ser desfeita. Isso irá excluir
              permanentemente o membro{' '}
              <span className='font-semibold'>{currentStaff?.name}</span>.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel onClick={() => setCurrentStaff(null)}>
              Cancelar
            </AlertDialogCancel>
            <AlertDialogAction onClick={handleDeleteStaff}>
              Excluir
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </>
  )
}
