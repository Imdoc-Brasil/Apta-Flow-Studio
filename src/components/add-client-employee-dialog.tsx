'use client'

import { useState, useEffect, useMemo } from 'react'
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
import { useToast } from '@/hooks/use-toast'
import type { Employee } from '@/lib/types/employee'
import type { Role } from '@/lib/types/role'
import {
    useFirestore,
    addDocumentNonBlocking,
    updateDocumentNonBlocking,
} from '@/firebase'
import { collection, doc } from 'firebase/firestore'
import { Separator } from './ui/separator'

interface AddClientEmployeeDialogProps {
  open: boolean
  onOpenChange: (open: boolean) => void
  contractId: string
  employeeToEdit: Employee | null
  rolesWithDetails: (Role & { sectorName: string; unitName: string })[]
  onSuccess: () => void
}

export function AddClientEmployeeDialog({
  open,
  onOpenChange,
  contractId,
  employeeToEdit,
  rolesWithDetails,
  onSuccess,
}: AddClientEmployeeDialogProps) {
  const firestore = useFirestore()
  const { toast } = useToast()
  const [selectedRoleId, setSelectedRoleId] = useState('')

  useEffect(() => {
    if (open) {
      setSelectedRoleId(employeeToEdit?.roleId || '')
    }
  }, [open, employeeToEdit])

  const selectedRoleDetails = useMemo(() => {
    if (!selectedRoleId) return null
    return rolesWithDetails.find((r) => r.id === selectedRoleId)
  }, [selectedRoleId, rolesWithDetails])

  const handleSubmit = (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault()
    if (!firestore) return

    const formData = new FormData(event.currentTarget)
    const name = formData.get('name') as string

    if (employeeToEdit) {
      // Update logic
      const employeeDocRef = doc(firestore, `clients/${contractId}/staffs`, employeeToEdit.id)
      const updatedData = {
        name,
        roleId: formData.get('roleId') as string,
        email: formData.get('email') as string,
        phone: formData.get('phone') as string,
      }
      updateDocumentNonBlocking(employeeDocRef, updatedData)
      toast({ title: 'Colaborador atualizado!' })
    } else {
      // Create logic
      const employeesRef = collection(firestore, `clients/${contractId}/staffs`)
      const newEmployee: Omit<Employee, 'id'> = {
        name,
        roleId: formData.get('roleId') as string,
        email: formData.get('email') as string,
        phone: formData.get('phone') as string,
        status: 'Candidato',
        admissionDate: new Date().toISOString().split('T')[0],
        avatar: `https://i.pravatar.cc/150?u=${Math.random()}`,
      }
      addDocumentNonBlocking(employeesRef, newEmployee)
      toast({
        title: 'Candidato Adicionado!',
        description: `O candidato "${name}" foi adicionado e aguarda os próximos passos.`,
      })
    }
    onSuccess()
    onOpenChange(false)
  }

  const isEditMode = !!employeeToEdit;

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>
            {isEditMode ? 'Editar Colaborador' : 'Adicionar Novo Colaborador'}
          </DialogTitle>
          <DialogDescription>
            {isEditMode
              ? 'Modifique os detalhes do colaborador.'
              : 'Preencha os detalhes para adicionar um novo colaborador.'}
          </DialogDescription>
        </DialogHeader>
        <form id='employee-form' onSubmit={handleSubmit}>
          <div className='grid gap-4 py-4'>
            <div className='space-y-2'>
              <Label htmlFor='roleId'>Cargo</Label>
              <Select
                name='roleId'
                value={selectedRoleId}
                onValueChange={setSelectedRoleId}
                required
              >
                <SelectTrigger>
                  <SelectValue placeholder='Selecione o cargo para o novo colaborador' />
                </SelectTrigger>
                <SelectContent>
                  {rolesWithDetails?.map((role) => (
                    <SelectItem key={role.id} value={role.id}>
                      {role.name} ({role.sectorName} / {role.unitName})
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>

            {selectedRoleDetails && (
              <div className='grid grid-cols-2 gap-4 rounded-md border bg-muted/50 p-4'>
                <div className='space-y-1'>
                  <p className='text-sm font-medium text-muted-foreground'>
                    Unidade
                  </p>
                  <p className='font-semibold'>{selectedRoleDetails.unitName}</p>
                </div>
                <div className='space-y-1'>
                  <p className='text-sm font-medium text-muted-foreground'>
                    Setor
                  </p>
                  <p className='font-semibold'>
                    {selectedRoleDetails.sectorName}
                  </p>
                </div>
              </div>
            )}

            <fieldset disabled={!isEditMode && !selectedRoleId}>
              <div className='grid gap-4 py-4'>
                <Separator />
                <div className='space-y-2'>
                  <Label htmlFor='name'>Nome do Colaborador</Label>
                  <Input id='name' name='name' defaultValue={employeeToEdit?.name} required />
                </div>
                <div className='grid grid-cols-2 gap-4'>
                  <div className='space-y-2'>
                    <Label htmlFor='email'>Email</Label>
                    <Input
                      id='email'
                      name='email'
                      type='email'
                      defaultValue={employeeToEdit?.email}
                      required
                    />
                  </div>
                  <div className='space-y-2'>
                    <Label htmlFor='phone'>Telefone</Label>
                    <Input id='phone' name='phone' defaultValue={employeeToEdit?.phone} />
                  </div>
                </div>
              </div>
            </fieldset>
          </div>
        </form>
        <DialogFooter>
          <Button variant='outline' onClick={() => onOpenChange(false)}>
            Cancelar
          </Button>
          <Button
            type='submit'
            form='employee-form'
            disabled={!isEditMode && !selectedRoleId}
          >
            {isEditMode ? 'Salvar Alterações' : 'Salvar'}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  )
}
