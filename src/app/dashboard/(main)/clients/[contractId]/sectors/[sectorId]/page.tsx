
'use client'

import { useParams, useRouter, useSearchParams } from 'next/navigation'
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import {
  ArrowLeft,
  MoreHorizontal,
  PlusCircle,
  Loader2,
} from 'lucide-react'
import Link from 'next/link'
import { useState, useMemo } from 'react'
import {
  type Environment,
} from '../../environments/data'
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table'
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog'
import { ScrollArea } from '@/components/ui/scroll-area'
import { Label } from '@/components/ui/label'
import { Input } from '@/components/ui/input'
import { Textarea } from '@/components/ui/textarea'
import { useToast } from '@/hooks/use-toast'
import {
  useFirestore,
  useCollection,
  useMemoFirebase,
  addDocumentNonBlocking,
  updateDocumentNonBlocking,
  useDoc,
} from '@/firebase'
import { collection, doc } from 'firebase/firestore'
import type { Sector } from '../data'
import type { Unit } from '../../units/data'

export default function SectorDetailsPage() {
  const params = useParams()
  const { toast } = useToast()
  const contractId = params.contractId as string
  const sectorId = params.sectorId as string
  const firestore = useFirestore()
  
  const router = useRouter()
  const searchParams = useSearchParams()
  const unitId = searchParams.get('unitId');
  
  const sectorRef = useMemoFirebase(() => {
    if (!firestore || !unitId || !sectorId) return null
    return doc(firestore, `clients/${contractId}/units/${unitId}/sectors`, sectorId)
  }, [firestore, contractId, unitId, sectorId])

  const unitRef = useMemoFirebase(() => {
     if (!firestore || !unitId) return null
     return doc(firestore, `clients/${contractId}/units`, unitId)
  }, [firestore, contractId, unitId])

  const environmentsRef = useMemoFirebase(
    () =>
      firestore && unitId
        ? collection(
            firestore,
            `clients/${contractId}/units/${unitId}/sectors/${sectorId}/environments`
          )
        : null,
    [firestore, contractId, unitId, sectorId]
  )

  const { data: sector, isLoading: isSectorLoading } = useDoc<Sector>(sectorRef)
  const { data: unit, isLoading: isUnitLoading } = useDoc<Unit>(unitRef)
  const { data: environments, isLoading: areEnvironmentsLoading } = useCollection<Environment>(environmentsRef)

  const [isFormDialogOpen, setIsFormDialogOpen] = useState(false)
  const [editingEnvironment, setEditingEnvironment] =
    useState<Environment | null>(null)

  const handleFormSubmit = (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault()
    if (!environmentsRef || !firestore) return

    const formData = new FormData(event.currentTarget)

    const environmentData: Omit<Environment, 'id'> = {
      name: formData.get('name') as string,
      description: formData.get('description') as string,
      activities: formData.get('activities') as string,
      equipment: formData.get('equipment') as string,
      sectorId: sectorId, // Add sectorId to the environment
      physicalCharacteristics: {
        flooring: formData.get('flooring') as string,
        lighting: formData.get('lighting') as string,
        climateControl: formData.get('climateControl') as string,
        wallCoverings: formData.get('wallCoverings') as string,
        exhaustSystem: formData.get('exhaustSystem') as string,
      },
    }

    if (editingEnvironment) {
      const docRef = doc(firestore, environmentsRef.path, editingEnvironment.id as string)
      updateDocumentNonBlocking(docRef, environmentData)
      toast({
        title: 'Posto de Trabalho Atualizado!',
        description: `O posto de trabalho "${environmentData.name}" foi atualizado.`,
      })
    } else {
      addDocumentNonBlocking(environmentsRef, environmentData)
      toast({
        title: 'Posto de Trabalho Adicionado!',
        description: `O posto de trabalho "${environmentData.name}" foi criado.`,
      })
    }

    setIsFormDialogOpen(false)
    setEditingEnvironment(null)
  }

  const openFormDialog = (environment: Environment | null) => {
    setEditingEnvironment(environment)
    setIsFormDialogOpen(true)
  }

  const renderEnvironmentForm = (environment?: Environment | null) => (
    <ScrollArea className='h-[70vh]'>
      <div className='grid gap-6 p-1 pr-6'>
        <div className='grid grid-cols-1 md:grid-cols-2 gap-4'>
          <div className='space-y-2'>
            <Label htmlFor='name'>Nome do Posto de Trabalho</Label>
            <Input
              id='name'
              name='name'
              defaultValue={environment?.name}
              required
            />
          </div>
          <div className='space-y-2'>
            <Label htmlFor='sectorId'>Setor</Label>
            <Input value={sector?.name} disabled />
          </div>
        </div>

        <div className='space-y-2'>
          <Label htmlFor='description'>Descrição do Posto de Trabalho</Label>
          <Textarea
            id='description'
            name='description'
            defaultValue={environment?.description}
            placeholder='Descreva o propósito geral deste posto de trabalho.'
          />
        </div>
        <div className='space-y-2'>
          <Label htmlFor='activities'>Atividades Desenvolvidas</Label>
          <Textarea
            id='activities'
            name='activities'
            defaultValue={environment?.activities}
            placeholder='Liste as principais tarefas realizadas neste local.'
          />
        </div>
        <div className='space-y-2'>
          <Label htmlFor='equipment'>Máquinas e Equipamentos</Label>
          <Textarea
            id='equipment'
            name='equipment'
            defaultValue={environment?.equipment}
            placeholder='Liste as máquinas e equipamentos presentes.'
          />
        </div>

        <fieldset className='rounded-lg border p-4'>
          <legend className='-ml-1 px-1 text-sm font-medium'>
            Características Físicas
          </legend>
          <div className='grid grid-cols-1 md:grid-cols-2 gap-4 pt-2'>
            <div className='space-y-2'>
              <Label htmlFor='flooring'>Tipo de Piso</Label>
              <Input
                id='flooring'
                name='flooring'
                defaultValue={environment?.physicalCharacteristics.flooring}
              />
            </div>
            <div className='space-y-2'>
              <Label htmlFor='lighting'>Iluminação</Label>
              <Input
                id='lighting'
                name='lighting'
                defaultValue={environment?.physicalCharacteristics.lighting}
              />
            </div>
            <div className='space-y-2'>
              <Label htmlFor='climateControl'>Climatização</Label>
              <Input
                id='climateControl'
                name='climateControl'
                defaultValue={
                  environment?.physicalCharacteristics.climateControl
                }
              />
            </div>
            <div className='space-y-2'>
              <Label htmlFor='wallCoverings'>Revestimento de Paredes</Label>
              <Input
                id='wallCoverings'
                name='wallCoverings'
                defaultValue={
                  environment?.physicalCharacteristics.wallCoverings
                }
              />
            </div>
            <div className='space-y-2'>
              <Label htmlFor='exhaustSystem'>Sistema de Exaustão</Label>
              <Input
                id='exhaustSystem'
                name='exhaustSystem'
                defaultValue={
                  environment?.physicalCharacteristics.exhaustSystem
                }
              />
            </div>
          </div>
        </fieldset>
      </div>
    </ScrollArea>
  )
  
  const isLoading = isSectorLoading || isUnitLoading || areEnvironmentsLoading;

  if (isLoading) {
    return <div className='flex items-center justify-center h-full'><Loader2 className='h-8 w-8 animate-spin' /></div>
  }

  if (!sector || !unit) {
    return (
      <div className='flex flex-col items-center justify-center h-full text-center'>
        <h2 className='text-2xl font-bold'>Setor ou Unidade não encontrado</h2>
        <p className='text-muted-foreground'>
          Verifique se a URL está correta e tente novamente.
        </p>
        <Button asChild className='mt-4'>
          <Link href={`/dashboard/clients/${contractId}/sectors`}>
            <ArrowLeft className='mr-2 h-4 w-4' />
            Voltar para Setores
          </Link>
        </Button>
      </div>
    )
  }

  return (
    <>
      <div className='grid flex-1 auto-rows-max gap-4'>
        <div className='flex items-center gap-4'>
          <Button variant='outline' size='icon' className='h-7 w-7' asChild>
            <Link
              href={`/dashboard/clients/${contractId}/sectors?unitId=${sector.unitId}`}
            >
              <ArrowLeft className='h-4 w-4' />
              <span className='sr-only'>Voltar</span>
            </Link>
          </Button>
          <h1 className='flex-1 shrink-0 whitespace-nowrap text-xl font-semibold tracking-tight sm:grow-0'>
            {sector.name}
          </h1>
        </div>
        <div className='grid gap-4 md:grid-cols-2 lg:grid-cols-3'>
          <Card className='md:col-span-2 lg:col-span-3'>
            <CardHeader>
              <CardTitle>Detalhes do Setor</CardTitle>
              <CardDescription>{sector.description}</CardDescription>
            </CardHeader>
            <CardContent>
              <p className='text-sm text-muted-foreground'>
                Unidade:{' '}
                <span className='font-semibold text-foreground'>
                  {unit?.name || 'N/A'}
                </span>
              </p>
            </CardContent>
          </Card>
        </div>

        <Card>
          <CardHeader>
            <CardTitle>Postos de Trabalho</CardTitle>
            <CardDescription>
              Locais de trabalho e etapas de processo dentro deste setor.
            </CardDescription>
            <div className='flex justify-end'>
              <Button size='sm' onClick={() => openFormDialog(null)}>
                <PlusCircle className='mr-2 h-4 w-4' />
                Adicionar Posto de Trabalho
              </Button>
            </div>
          </CardHeader>
          <CardContent>
            {isLoading ? (
              <div className='flex items-center justify-center h-48'>
                <Loader2 className='h-8 w-8 animate-spin' />
              </div>
            ) : (
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>Posto de Trabalho</TableHead>
                    <TableHead>Atividades</TableHead>
                    <TableHead>
                      <span className='sr-only'>Ações</span>
                    </TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {environments?.map((env) => (
                    <TableRow
                      key={env.id}
                      onClick={() => openFormDialog(env)}
                      className='cursor-pointer'
                    >
                      <TableCell className='font-medium'>{env.name}</TableCell>
                      <TableCell>
                        <p className='line-clamp-1 text-sm text-muted-foreground'>
                          {env.activities}
                        </p>
                      </TableCell>
                      <TableCell>
                        <Button
                          aria-haspopup='true'
                          size='icon'
                          variant='ghost'
                        >
                          <MoreHorizontal className='h-4 w-4' />
                          <span className='sr-only'>Alternar menu</span>
                        </Button>
                      </TableCell>
                    </TableRow>
                  ))}
                  {environments?.length === 0 && (
                    <TableRow>
                      <TableCell colSpan={3} className='text-center h-24'>
                        Nenhum posto de trabalho cadastrado para este setor.
                      </TableCell>
                    </TableRow>
                  )}
                </TableBody>
              </Table>
            )}
          </CardContent>
        </Card>
      </div>

      <Dialog open={isFormDialogOpen} onOpenChange={setIsFormDialogOpen}>
        <DialogContent className='sm:max-w-3xl'>
          <DialogHeader>
            <DialogTitle>
              {editingEnvironment ? 'Editar' : 'Adicionar'} Posto de Trabalho
            </DialogTitle>
            <DialogDescription>
              {editingEnvironment
                ? 'Atualize os detalhes'
                : 'Preencha os detalhes'}{' '}
              para este posto de trabalho.
            </DialogDescription>
          </DialogHeader>
          <form id='environment-form' onSubmit={handleFormSubmit}>
            {renderEnvironmentForm(editingEnvironment)}
          </form>
          <DialogFooter>
            <Button
              variant='outline'
              onClick={() => {
                setIsFormDialogOpen(false)
                setEditingEnvironment(null)
              }}
            >
              Cancelar
            </Button>
            <Button type='submit' form='environment-form'>
              {editingEnvironment
                ? 'Salvar Alterações'
                : 'Salvar Posto de Trabalho'}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </>
  )
}
