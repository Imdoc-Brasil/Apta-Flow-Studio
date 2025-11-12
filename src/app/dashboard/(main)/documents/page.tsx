
'use client'

import { MoreHorizontal, Upload, Loader2 } from 'lucide-react'
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
  DropdownMenuSeparator,
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
import { Label } from '@/components/ui/label'
import { Input } from '@/components/ui/input'
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
import {
  useFirestore,
  useCollection,
  useMemoFirebase,
  addDocumentNonBlocking,
  deleteDocumentNonBlocking,
} from '@/firebase'
import { collection, doc } from 'firebase/firestore'
import { useToast } from '@/hooks/use-toast'
import { ClientSideDateFormatter } from '@/components/client-side-date-formatter'

interface Document {
  id: string
  name: string
  type: string
  size: string
  modified: string
  relatedTo: string
  url?: string
}

export default function DocumentsPage() {
  const { toast } = useToast()
  const firestore = useFirestore()
  const documentsRef = useMemoFirebase(
    () => (firestore ? collection(firestore, 'documents') : null),
    [firestore]
  )

  const { data: documents, isLoading } = useCollection<Document>(documentsRef)

  const [isDialogOpen, setIsDialogOpen] = useState(false)
  const [isDeleteDialogOpen, setIsDeleteDialogOpen] = useState(false)
  const [documentToDelete, setDocumentToDelete] = useState<Document | null>(null)

  const handleUploadDocument = (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault()
    if (!documentsRef) return

    const formData = new FormData(event.currentTarget)
    const file = formData.get('file') as File

    if (!file) {
      toast({
        variant: 'destructive',
        title: 'Arquivo não selecionado',
        description: 'Por favor, selecione um arquivo para carregar.',
      })
      return
    }

    const newDocument: Omit<Document, 'id'> = {
      name: file.name,
      type: formData.get('type') as string,
      size: `${(file.size / (1024 * 1024)).toFixed(2)} MB`,
      modified: new Date().toISOString(),
      relatedTo: formData.get('relatedTo') as string,
      // In a real app, you'd upload the file to Firebase Storage and get the URL
      url: '#',
    }

    addDocumentNonBlocking(documentsRef, newDocument)

    toast({
      title: 'Sucesso!',
      description: `O documento "${newDocument.name}" foi adicionado.`,
    })
    setIsDialogOpen(false)
  }

  const openDeleteDialog = (doc: Document) => {
    setDocumentToDelete(doc)
    setIsDeleteDialogOpen(true)
  }

  const handleDeleteDocument = () => {
    if (documentToDelete && documentsRef) {
      const docRef = doc(firestore, 'documents', documentToDelete.id)
      deleteDocumentNonBlocking(docRef)
      toast({
        title: 'Documento excluído!',
        variant: 'destructive',
      })
      setIsDeleteDialogOpen(false)
      setDocumentToDelete(null)
    }
  }

  return (
    <>
      <Card>
        <CardHeader>
          <CardTitle>Repositório de Documentos</CardTitle>
          <CardDescription>
            Armazenamento e gestão segura de contratos, documentação e
            relatórios.
          </CardDescription>
          <div className='flex items-center gap-2 pt-4'>
            <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
              <DialogTrigger asChild>
                <Button size='sm' className='h-8 gap-1'>
                  <Upload className='h-3.5 w-3.5' />
                  <span className='sr-only sm:not-sr-only sm:whitespace-nowrap'>
                    Carregar Documento
                  </span>
                </Button>
              </DialogTrigger>
              <DialogContent>
                <DialogHeader>
                  <DialogTitle>Carregar Novo Documento</DialogTitle>
                  <DialogDescription>
                    Selecione um arquivo para adicionar ao repositório.
                  </DialogDescription>
                </DialogHeader>
                <form id='upload-doc-form' onSubmit={handleUploadDocument}>
                  <div className='grid gap-4 py-4'>
                    <div className='grid grid-cols-4 items-center gap-4'>
                      <Label htmlFor='file' className='text-right'>
                        Arquivo
                      </Label>
                      <Input
                        id='file'
                        name='file'
                        type='file'
                        className='col-span-3'
                        required
                      />
                    </div>
                    <div className='grid grid-cols-4 items-center gap-4'>
                      <Label htmlFor='type' className='text-right'>
                        Tipo
                      </Label>
                      <Input
                        id='type'
                        name='type'
                        placeholder='Ex: Contrato, Relatório...'
                        className='col-span-3'
                        required
                      />
                    </div>
                    <div className='grid grid-cols-4 items-center gap-4'>
                      <Label htmlFor='relatedTo' className='text-right'>
                        Relacionado a
                      </Label>
                      <Input
                        id='relatedTo'
                        name='relatedTo'
                        placeholder='Ex: Innovate Inc.'
                        className='col-span-3'
                        required
                      />
                    </div>
                  </div>
                </form>
                <DialogFooter>
                  <Button
                    variant='outline'
                    onClick={() => setIsDialogOpen(false)}
                  >
                    Cancelar
                  </Button>
                  <Button type='submit' form='upload-doc-form'>
                    Salvar
                  </Button>
                </DialogFooter>
              </DialogContent>
            </Dialog>
          </div>
        </CardHeader>
        <CardContent>
          {isLoading ? (
             <div className='flex justify-center items-center h-64'>
                <Loader2 className='h-8 w-8 animate-spin' />
              </div>
          ) : (
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Nome</TableHead>
                  <TableHead className='hidden sm:table-cell'>Tipo</TableHead>
                  <TableHead className='hidden sm:table-cell'>
                    Relacionado a
                  </TableHead>
                  <TableHead className='hidden md:table-cell'>
                    Última Modificação
                  </TableHead>
                  <TableHead className='text-right'>Tamanho</TableHead>
                  <TableHead>
                    <span className='sr-only'>Ações</span>
                  </TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {documents?.map((doc) => (
                  <TableRow key={doc.id}>
                    <TableCell className='font-medium'>{doc.name}</TableCell>
                    <TableCell className='hidden sm:table-cell'>
                      <Badge variant='outline'>{doc.type}</Badge>
                    </TableCell>
                    <TableCell className='hidden sm:table-cell'>
                      {doc.relatedTo}
                    </TableCell>
                    <TableCell className='hidden md:table-cell'>
                      <ClientSideDateFormatter dateString={doc.modified} />
                    </TableCell>
                    <TableCell className='text-right'>{doc.size}</TableCell>
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
                          <DropdownMenuItem>Baixar</DropdownMenuItem>
                          <DropdownMenuItem>Compartilhar</DropdownMenuItem>
                          <DropdownMenuSeparator />
                          <DropdownMenuItem
                            className='text-destructive'
                            onClick={() => openDeleteDialog(doc)}
                          >
                            Excluir
                          </DropdownMenuItem>
                        </DropdownMenuContent>
                      </DropdownMenu>
                    </TableCell>
                  </TableRow>
                ))}
                 {documents?.length === 0 && (
                  <TableRow>
                    <TableCell colSpan={6} className="h-24 text-center">
                      Nenhum documento encontrado.
                    </TableCell>
                  </TableRow>
                )}
              </TableBody>
            </Table>
          )}
        </CardContent>
      </Card>
      <AlertDialog
        open={isDeleteDialogOpen}
        onOpenChange={setIsDeleteDialogOpen}
      >
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Você tem certeza?</AlertDialogTitle>
            <AlertDialogDescription>
              Esta ação não pode ser desfeita. Isso irá excluir o documento{' '}
              <span className='font-bold'>{documentToDelete?.name}</span>.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel onClick={() => setDocumentToDelete(null)}>
              Cancelar
            </AlertDialogCancel>
            <AlertDialogAction onClick={handleDeleteDocument}>
              Excluir
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </>
  )
}
