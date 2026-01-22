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
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { useToast } from '@/hooks/use-toast'
import { useFirestore } from '@/firebase'
import { doc } from 'firebase/firestore'
import type { Attachment } from '@/lib/types/ticket'

export function AddAttachmentDialog({
  ticketId,
  children,
}: {
  ticketId: string
  children: React.ReactNode
}) {
  const [open, setOpen] = useState(false)
  const { toast } = useToast()
  const [file, setFile] = useState<File | null>(null)
  const firestore = useFirestore()

  const handleSubmit = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault()
    if (!firestore || !ticketId) return
    const formData = new FormData(e.currentTarget)
    const name = formData.get('name') as string

    if (!name || !file) {
      toast({
        variant: 'destructive',
        title: 'Campos obrigatórios',
        description: 'Por favor, forneça um nome e selecione um arquivo.',
      })
      return
    }

    // This is a placeholder. Real implementation would upload the file and get a URL.
    const newAttachment: Attachment = {
      id: `att-${Date.now()}`,
      name,
      url: URL.createObjectURL(file), // Placeholder URL
    }

    const ticketDocRef = doc(firestore, 'tickets', ticketId)
    // In a real app, you'd fetch the current ticket data and update the array
    // This is a simplified approach for demonstration
    // const newAttachments = [...(currentTicket.attachments || []), newAttachment]
    // updateDocumentNonBlocking(ticketDocRef, { attachments: newAttachments })

    toast({
      title: 'Anexo Adicionado!',
      description: `O arquivo "${name}" foi adicionado ao ticket.`,
    })
    setOpen(false)
    setFile(null)
    ;(e.currentTarget as HTMLFormElement).reset()
  }

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>{children}</DialogTrigger>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>Adicionar Novo Anexo</DialogTitle>
          <DialogDescription>
            Forneça um nome para o anexo e selecione o arquivo para upload.
          </DialogDescription>
        </DialogHeader>
        <form id='add-attachment-form' onSubmit={handleSubmit}>
          <div className='grid gap-4 py-4'>
            <div className='space-y-2'>
              <Label htmlFor='name'>Nome/Título do Anexo</Label>
              <Input
                id='name'
                name='name'
                placeholder='Ex: Relatório de Erro.pdf'
                required
              />
            </div>
            <div className='space-y-2'>
              <Label htmlFor='file'>Arquivo</Label>
              <Input
                id='file'
                name='file'
                type='file'
                onChange={(e) => setFile(e.target.files?.[0] || null)}
                required
              />
            </div>
          </div>
          <DialogFooter>
            <Button variant='outline' onClick={() => setOpen(false)}>
              Cancelar
            </Button>
            <Button type='submit' form='add-attachment-form'>
              Adicionar
            </Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  )
}
