
'use client'

import { useState, useEffect } from 'react'
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogFooter,
} from '@/components/ui/dialog'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select'
import { useForm } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import {
  Form,
  FormControl,
  FormDescription,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from '@/components/ui/form'
import type { Client } from '@/lib/types/client'
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
import { Check, ChevronsUpDown, X, Loader2 } from 'lucide-react'
import { Checkbox } from '@/components/ui/checkbox'
import { Avatar, AvatarFallback } from '@/components/ui/avatar'
import type { Profile } from '@/lib/types/profile'
import { addStaffFormSchema, type AddStaffFormValues } from '@/lib/schemas/staff'
import { useAuth, useFirestore, setDocumentNonBlocking } from '@/firebase'
import { createUserWithEmailAndPassword } from 'firebase/auth'
import { doc } from 'firebase/firestore'
import { useToast } from '@/hooks/use-toast'
import type { Staff } from '@/lib/types/staff'
import { Badge } from '@/components/ui/badge'

interface AddStaffDialogProps {
  open: boolean
  onOpenChange: (open: boolean) => void
  profiles: Profile[] | null
  clientsData: Client[] | null
  areClientsLoading: boolean
}

export function AddStaffDialog({
  open,
  onOpenChange,
  profiles,
  clientsData,
  areClientsLoading,
}: AddStaffDialogProps) {
  const form = useForm<AddStaffFormValues>({
    resolver: zodResolver(addStaffFormSchema),
    defaultValues: {
      name: '',
      email: '',
      password: '',
      confirmPassword: '',
      assinatura: '',
      phone: '',
      contractId: '',
      clientIds: [],
      allClients: false,
    },
  })

  const { toast } = useToast()
  const auth = useAuth()
  const firestore = useFirestore()

  useEffect(() => {
    if (!open) {
      form.reset()
    }
  }, [open, form])

  const getClientName = (clientId: string) => {
    return clientsData?.find((c) => c.id === clientId)?.name || 'N/A'
  }

  async function onSubmit(data: AddStaffFormValues) {
    if (!auth || !firestore) return

    try {
      // 1. Create Firebase Auth user
      const userCredential = await createUserWithEmailAndPassword(
        auth,
        data.email,
        data.password!
      )
      const user = userCredential.user

      // 2. Create Firestore document with the UID as the ID
      const staffDocRef = doc(firestore, 'staffs', user.uid)

      const fallback = data.name
        .split(' ')
        .map((n) => n[0])
        .join('')
        .substring(0, 2)
        .toUpperCase()

      const newStaffData: Staff = {
        id: user.uid,
        name: data.name,
        email: data.email,
        perfilId: data.perfilId,
        assinatura: data.assinatura,
        phone: data.phone || '',
        code: `STF-${Math.floor(100 + Math.random() * 900)}`,
        status: 'Ativo',
        situacao: 'Offline',
        avatar: data.avatar || `https://i.pravatar.cc/150?u=${user.uid}`,
        fallback,
        ...(data.perfilId === 'cliente' && { contractId: data.contractId }),
        ...(data.perfilId !== 'cliente' && {
          clientIds: data.allClients ? [] : data.clientIds,
        }),
      }

      setDocumentNonBlocking(staffDocRef, newStaffData, { merge: false })

      toast({
        title: 'Membro Adicionado!',
        description: `${data.name} foi criado e pode fazer login com a senha definida.`,
      })
      onOpenChange(false)
    } catch (error: any) {
      console.error('Error creating user:', error)
      let description = 'Ocorreu um erro ao criar o usuário. Tente novamente.'
      if (error.code === 'auth/email-already-in-use') {
        description = 'Este endereço de email já está em uso por outra conta.'
      } else if (error.code === 'auth/weak-password') {
        description = 'A senha fornecida é muito fraca.'
      }
      toast({
        variant: 'destructive',
        title: 'Falha ao criar membro',
        description: description,
      })
    }
  }

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
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
                <Input id='avatar-upload' name='avatar-upload' type='file' className='text-sm' />
              </div>
            </div>

            <div className='grid grid-cols-3 gap-4'>
              <div className='col-span-3 space-y-2'>
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
            </div>

            <div className='grid grid-cols-2 gap-4'>
              <FormField
                control={form.control}
                name='email'
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Email (para login)</FormLabel>
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
                name='password'
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Senha Provisória</FormLabel>
                    <FormControl>
                      <Input type="password" {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
               <FormField
                control={form.control}
                name='confirmPassword'
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Confirmar Senha</FormLabel>
                    <FormControl>
                      <Input type="password" {...field} />
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
                control={form.control}
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
            )}

            {form.watch('perfilId') !== 'cliente' &&
              form.watch('perfilId') && (
                <FormField
                  control={form.control}
                  name='clientIds'
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Acesso a Clientes</FormLabel>
                      <FormField
                        control={form.control}
                        name='allClients'
                        render={({ field: allClientsField }) => (
                          <FormItem className='flex flex-row items-center space-x-3 space-y-0 rounded-md border p-4 mb-4'>
                            <FormControl>
                              <Checkbox
                                checked={allClientsField.value}
                                onCheckedChange={allClientsField.onChange}
                              />
                            </FormControl>
                            <div className='space-y-1 leading-none'>
                              <FormLabel>
                                Conceder acesso a todas as empresas
                              </FormLabel>
                              <FormDescription>
                                O membro terá acesso a todos os clientes atuais
                                e futuros.
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
                                          const selected = field.value || []
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
                        {(form.watch('clientIds') || []).map(
                          (clientId: string) => (
                            <Badge key={clientId} variant='secondary'>
                              {getClientName(clientId)}
                              <button
                                type='button'
                                className='ml-1 rounded-full outline-none ring-offset-background focus:ring-2 focus:ring-ring focus:ring-offset-2'
                                onClick={() =>
                                  field.onChange(
                                    (form.watch('clientIds') || []).filter(
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
          <Button variant='outline' onClick={() => onOpenChange(false)}>
            Cancelar
          </Button>
          <Button type='submit' form='add-staff-form'>
            Salvar
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  )
}
