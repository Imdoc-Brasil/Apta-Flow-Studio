
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
import {
  permissionActions,
  permissionModules,
} from '@/app/dashboard/(main)/profiles/data'
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
  const [selectedPermissions, setSelectedPermissions] = useState<
    Set<Permission>
  >(new Set())

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
      const [action, moduleId] = permission.split(':') as [Action, string]

      const isParent = !moduleId.includes('.')

      if (isParent) {
        // Handle parent checkbox click
        if (checked) newSet.add(permission); else newSet.delete(permission)

        // Cascade to children
        const mainModule = permissionModules.find((m) => m.id === moduleId)
        if (mainModule?.subModules) {
          mainModule.subModules.forEach((sub) => {
            const subPermission = `${action}:${sub.id}` as Permission
            if (checked) newSet.add(subPermission); else newSet.delete(subPermission)
          })
        }
      } else {
        // Handle child checkbox click
        if (checked) newSet.add(permission); else newSet.delete(permission)

        // Update parent state
        const parentModuleId = moduleId.split('.')[0] as Module
        const parentModule = permissionModules.find(
          (m) => m.id === parentModuleId
        )
        const parentPermission = `${action}:${parentModuleId}` as Permission

        if (parentModule?.subModules) {
          const allChildrenChecked = parentModule.subModules.every((sub) =>
            newSet.has(`${action}:${sub.id}` as Permission)
          )

          if (allChildrenChecked) {
            newSet.add(parentPermission)
          } else {
            // if any child is unchecked, parent should be unchecked
            newSet.delete(parentPermission)
          }
        }
      }
      return newSet
    })
  }

  const getParentState = (
    module: PermissionModule,
    action: Action
  ): boolean | 'indeterminate' => {
    if (!module.subModules || module.subModules.length === 0) {
      return selectedPermissions.has(`${action}:${module.id}` as Permission)
    }
    const subModulePermissions = module.subModules.map(
      (sm) => `${action}:${sm.id}` as Permission
    )
    const checkedCount = subModulePermissions.filter((p) =>
      selectedPermissions.has(p)
    ).length

    if (checkedCount === 0) return false
    if (checkedCount === subModulePermissions.length) return true
    return 'indeterminate'
  }

  const handlePermissionsSubmit = (
    event: React.FormEvent<HTMLFormElement>
  ) => {
    event.preventDefault()
    if (!profile || !firestore) return

    const updatedPermissions = Array.from(selectedPermissions)
    const profileDocRef = doc(firestore, 'profiles', profile.id)
    updateDocumentNonBlocking(profileDocRef, {
      permissions: updatedPermissions,
    })

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
                    <AccordionTrigger
                      className='flex-1 p-0 pl-4 font-medium text-sm hover:no-underline'
                      disabled={!module.subModules}
                    >
                      <div className='py-3'>{module.name}</div>
                    </AccordionTrigger>
                    <div className='grid grid-cols-4 gap-4 w-[300px]'>
                      {permissionActions.map(
                        (action: { id: Action; name: string }) => {
                          const isChecked = getParentState(module, action.id)
                          return (
                            <div
                              key={`${module.id}-${action.id}`}
                              className='flex justify-center'
                            >
                              <Checkbox
                                checked={isChecked}
                                onCheckedChange={(checked) =>
                                  handlePermissionChange(
                                    `${action.id}:${module.id}`,
                                    checked === 'indeterminate'
                                      ? true
                                      : !!checked
                                  )
                                }
                              />
                            </div>
                          )
                        }
                      )}
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
                              {permissionActions.map(
                                (action: { id: Action; name: string }) => (
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
                                )
                              )}
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
