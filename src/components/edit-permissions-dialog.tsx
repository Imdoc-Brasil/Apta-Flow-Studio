'use client'

import React, { useState, useEffect } from 'react'
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog'
import { Button } from '@/components/ui/button'
import { Checkbox } from '@/components/ui/checkbox'
import { ScrollArea } from '@/components/ui/scroll-area'
import { useToast } from '@/hooks/use-toast'
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from '@/components/ui/accordion'
import {
  useFirestore,
  updateDocumentNonBlocking,
  useUser,
  createAuditLog,
} from '@/firebase'
import { doc } from 'firebase/firestore'
import { ShieldCheck } from 'lucide-react'
import type {
  Profile,
  Permission,
  Action,
  Module,
  PermissionModule,
  SubModule,
} from '@/lib/types/profile'
import { permissionActions, permissionModules } from '@/app/dashboard/(main)/profiles/data'
import { Label } from '@/components/ui/label'

interface EditPermissionsDialogProps {
  open: boolean
  onOpenChange: (open: boolean) => void
  profile: Profile | null
}

export function EditPermissionsDialog({
  open,
  onOpenChange,
  profile,
}: EditPermissionsDialogProps) {
  const { user } = useUser()
  const { toast } = useToast()
  const firestore = useFirestore()
  const [selectedPermissions, setSelectedPermissions] = useState<Set<Permission>>(new Set())

  useEffect(() => {
    if (profile) {
      setSelectedPermissions(new Set(profile.permissions || []))
    }
  }, [profile])

  const handlePermissionChange = (
    permission: Permission,
    checked: boolean
  ) => {
    setSelectedPermissions((prev) => {
      const newSet = new Set(prev)
      const [action, moduleId] = permission.split(':') as [Action, Module]
      const mainModule = permissionModules.find((m: PermissionModule) => m.id === moduleId)

      // Cascade action to submodules
      if (mainModule && mainModule.subModules) {
        mainModule.subModules.forEach((subModule: SubModule) => {
          const subPermission = `${action}:${subModule.id}` as Permission
          if (checked) {
            newSet.add(subPermission)
          } else {
            newSet.delete(subPermission)
          }
        })
      }

      // Main action
      if (checked) {
        newSet.add(permission)
      } else {
        newSet.delete(permission)
      }

      return newSet
    })
  }

  const handlePermissionsSubmit = (
    event: React.FormEvent<HTMLFormElement>
  ) => {
    event.preventDefault()
    if (!profile || !firestore) return

    const updatedPermissions = Array.from(selectedPermissions)
    const profileDocRef = doc(firestore, 'profiles', profile.id)
    updateDocumentNonBlocking(profileDocRef, { permissions: updatedPermissions })

    createAuditLog(firestore, {
      userId: user?.uid || '',
      userEmail: user?.email || '',
      userName: user?.displayName || '',
      action: 'update_permissions',
      module: 'profiles',
      entityId: profile.id,
      entityName: profile.name,
      details: {
        previousPermissions: profile.permissions || [],
        newPermissions: updatedPermissions,
      },
    })

    toast({
      title: 'Permissões atualizadas!',
      description: `As permissões para o perfil "${profile.name}" foram salvas.`,
    })
    onOpenChange(false)
  }

  if (!profile) return null

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className='max-w-4xl'>
        <DialogHeader>
          <DialogTitle>
            Editar Permissões para &quot;{profile?.name}&quot;
          </DialogTitle>
          <DialogDescription>
            Selecione as ações que os usuários com este perfil podem realizar
            em cada módulo.
          </DialogDescription>
        </DialogHeader>
        <form id='permissions-form' onSubmit={handlePermissionsSubmit}>
          <div className='sticky top-0 bg-background/95 p-2 flex items-center border-b z-10'>
            <div className='flex-1 font-semibold pl-4'>Módulo</div>
            <div className='grid grid-cols-4 gap-4 w-[300px] text-center text-xs font-semibold text-muted-foreground'>
              {permissionActions.map((action: { id: Action; name: string }) => (
                <div key={action.id} className='flex justify-center'>
                  {action.name}
                </div>
              ))}
            </div>
          </div>

          <ScrollArea className='h-[60vh] mt-2'>
            <Accordion type='multiple' className='w-full'>
              {permissionModules.map((module: PermissionModule) => (
                <AccordionItem value={module.id} key={module.id}>
                  <div className='flex items-center pr-4 border-b hover:bg-muted/50'>
                    <AccordionTrigger className='flex-1 p-0 pl-4 font-medium text-sm hover:no-underline'>
                      <div className='py-3'>{module.name}</div>
                    </AccordionTrigger>
                    <div className='grid grid-cols-4 gap-4 w-[300px]'>
                      {permissionActions.map((action: { id: Action; name: string }) => (
                        <div
                          key={`${module.id}-${action.id}`}
                          className='flex justify-center'
                        >
                          <Checkbox
                            checked={selectedPermissions.has(
                              `${action.id}:${module.id}`
                            )}
                            onCheckedChange={(checked) =>
                              handlePermissionChange(
                                `${action.id}:${module.id}`,
                                !!checked
                              )
                            }
                          />
                        </div>
                      ))}
                    </div>
                  </div>
                  <AccordionContent>
                    <div className='pl-12 py-2 space-y-2 border-l ml-6'>
                      {module.subModules ? (
                        module.subModules.map((subModule: SubModule) => (
                          <div
                            key={subModule.id}
                            className='flex items-center pr-4'
                          >
                            <div className='flex-1 p-2'>
                              <Label className='font-normal'>
                                {subModule.name}
                              </Label>
                            </div>
                            <div className='grid grid-cols-4 gap-4 w-[300px]'>
                              {permissionActions.map((action: { id: Action; name: string }) => (
                                <div
                                  key={`${subModule.id}-${action.id}`}
                                  className='flex justify-center'
                                >
                                  <Checkbox
                                    checked={selectedPermissions.has(
                                      `${action.id}:${subModule.id}`
                                    )}
                                    onCheckedChange={(checked) =>
                                      handlePermissionChange(
                                        `${action.id}:${subModule.id}`,
                                        !!checked
                                      )
                                    }
                                  />
                                </div>
                              ))}
                            </div>
                          </div>
                        ))
                      ) : (
                        <div className='text-sm text-muted-foreground p-4 text-center'>
                          Nenhum submódulo para configurar.
                        </div>
                      )}
                    </div>
                  </AccordionContent>
                </AccordionItem>
              ))}
            </Accordion>
          </ScrollArea>
        </form>
        <DialogFooter className='mt-4 pt-4 border-t'>
          <Button variant='outline' onClick={() => onOpenChange(false)}>
            Cancelar
          </Button>
          <Button type='submit' form='permissions-form'>
            <ShieldCheck className='mr-2 h-4 w-4' />
            Salvar Permissões
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  )
}
