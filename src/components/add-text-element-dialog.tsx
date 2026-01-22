
'use client'

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
import { Button } from '@/components/ui/button'
import { Label } from '@/components/ui/label'
import { Textarea } from '@/components/ui/textarea'
import { useToast } from '@/hooks/use-toast'
import type { TextElement } from '@/lib/types/ticket'
import type { Staff } from '@/lib/types/staff'
import { useUser, useFirestore, updateDocumentNonBlocking } from '@/firebase'
import { doc } from 'firebase/firestore'

interface AddTextElementDialogProps {
  ticketId: string
  textElements: TextElement[]
  staffs: Staff[] | null
  children: React.ReactNode
  elementType: 'question' | 'comment'
  dialogTitle: string
  dialogDescription: string
}

export function AddTextElementDialog({
  ticketId,
  textElements,
  staffs,
  children,
  elementType,
  dialogTitle,
  dialogDescription,
}: AddTextElementDialogProps) {
  const [open, setOpen] = useState(false)
  const { toast } = useToast()
  const firestore = useFirestore()
  const { user } = useUser()

  const handleAddTextElement = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault()
    if (!firestore || !ticketId || !user) return

    const formData = new FormData(e.currentTarget)
    const content = formData.get('content') as string
    if (!content) {
      toast({
        variant: 'destructive',
        title: 'Conteúdo obrigatório',
        description: 'Por favor, escreva sua mensagem.',
      })
      return
    }

    const staffProfile = staffs?.find((s) => s.email === user.email)

    const newElement: TextElement = {
      id: `txt-${Date.now()}`,
      type: elementType,
      title: elementType === 'question' ? 'Pergunta' : 'Comentário',
      content,
      creator: staffProfile?.name || user?.displayName || 'Usuário',
      creatorAvatar: staffProfile?.avatar,
      creatorFallback: staffProfile?.fallback,
      createdAt: new Date().toISOString(),
    }

    const ticketDocRef = doc(firestore, 'tickets', ticketId)
    updateDocumentNonBlocking(ticketDocRef, {
      textElements: [...(textElements || []), newElement],
    })
    
    setOpen(false)
    toast({ title: 'Mensagem enviada!' })
    ;(e.target as HTMLFormElement).reset()
  }

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>{children}</DialogTrigger>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>{dialogTitle}</DialogTitle>
          <DialogDescription>{dialogDescription}</DialogDescription>
        </DialogHeader>
        <form
          id={`add-text-${elementType}-form`}
          onSubmit={handleAddTextElement}
        >
          <div className='grid gap-4 py-4'>
            <div className='space-y-2'>
              <Label htmlFor='content'>{dialogTitle}</Label>
              <Textarea
                id='content'
                name='content'
                placeholder='Escreva aqui...'
                required
              />
            </div>
          </div>
          <DialogFooter>
            <Button
              type='button'
              variant='outline'
              onClick={() => setOpen(false)}
            >
              Cancelar
            </Button>
            <Button type='submit'>Adicionar</Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  )
}
