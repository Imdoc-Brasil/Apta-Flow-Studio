
'use client'

import { useState } from 'react'
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { MoreHorizontal, PlusCircle, Search } from 'lucide-react'
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
  DialogHeader,
  DialogTitle,
  DialogTrigger,
  DialogFooter,
} from '@/components/ui/dialog'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Textarea } from '@/components/ui/textarea'
import { useToast } from '@/hooks/use-toast'
import { initialActivitiesData, type Activity } from './data'

export default function ActivitiesPage() {
  const [activities, setActivities] = useState(initialActivitiesData)
  const [isDialogOpen, setIsDialogOpen] = useState(false)
  const [editingActivity, setEditingActivity] = useState<Activity | null>(null)
  const { toast } = useToast()

  const handleFormSubmit = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault()
    const formData = new FormData(e.currentTarget)
    const newActivityData = {
      name: formData.get('name') as string,
      description: formData.get('description') as string,
    }

    if (editingActivity) {
      // Update
      const updatedActivity = { ...editingActivity, ...newActivityData }
      setActivities((prev) =>
        prev.map((act) => (act.id === editingActivity.id ? updatedActivity : act))
      )
      toast({
        title: 'Atividade Atualizada!',
        description: `A atividade "${updatedActivity.name}" foi atualizada.`,
      })
    } else {
      // Create
      const newActivity: Activity = {
        id: `ACT-${Date.now().toString().slice(-4)}`,
        ...newActivityData,
      }
      setActivities((prev) => [newActivity, ...prev])
      toast({
        title: 'Atividade Adicionada!',
        description: `A atividade "${newActivity.name}" foi criada.`,
      })
    }

    setIsDialogOpen(false)
    setEditingActivity(null)
  }

  const openDialog = (activity: Activity | null) => {
    setEditingActivity(activity)
    setIsDialogOpen(true)
  }

  const renderForm = (activity: Activity | null) => (
    <div className='grid gap-4 py-4'>
      <div className='space-y-2'>
        <Label htmlFor='name'>Nome da Atividade</Label>
        <Input
          id='name'
          name='name'
          defaultValue={activity?.name}
          placeholder='Ex: Operar Empilhadeira'
          required
        />
      </div>
      <div className='space-y-2'>
        <Label htmlFor='description'>Descrição</Label>
        <Textarea
          id='description'
          name='description'
          defaultValue={activity?.description}
          placeholder='Descreva o que é feito nesta atividade.'
        />
      </div>
    </div>
  )

  return (
    <>
      <Card>
        <CardHeader>
          <CardTitle>Catálogo de Atividades</CardTitle>
          <CardDescription>
            Gerencie as atividades e tarefas padronizadas da sua empresa.
          </CardDescription>
          <div className='flex items-center justify-between pt-4'>
            <div className='relative w-full max-w-sm'>
              <Search className='absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground' />
              <Input
                type='search'
                placeholder='Buscar por nome...'
                className='pl-8'
              />
            </div>
            <Button size='sm' className='h-8 gap-1' onClick={() => openDialog(null)}>
              <PlusCircle className='h-3.5 w-3.5' />
              <span className='sr-only sm:not-sr-only sm:whitespace-nowrap'>
                Adicionar Atividade
              </span>
            </Button>
          </div>
        </CardHeader>
        <CardContent>
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Atividade</TableHead>
                <TableHead>Descrição</TableHead>
                <TableHead>
                  <span className='sr-only'>Ações</span>
                </TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {activities.map((activity) => (
                <TableRow
                  key={activity.id}
                  onClick={() => openDialog(activity)}
                  className='cursor-pointer'
                >
                  <TableCell className='font-medium'>{activity.name}</TableCell>
                  <TableCell>
                    <p className='line-clamp-1 text-sm text-muted-foreground'>
                      {activity.description}
                    </p>
                  </TableCell>
                  <TableCell>
                    <Button aria-haspopup='true' size='icon' variant='ghost'>
                      <MoreHorizontal className='h-4 w-4' />
                      <span className='sr-only'>Alternar menu</span>
                    </Button>
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </CardContent>
      </Card>
      <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>
              {editingActivity ? 'Editar' : 'Adicionar'} Atividade
            </DialogTitle>
          </DialogHeader>
          <form id='activity-form' onSubmit={handleFormSubmit}>
            {renderForm(editingActivity)}
          </form>
          <DialogFooter>
            <Button
              variant='outline'
              onClick={() => {
                setIsDialogOpen(false)
                setEditingActivity(null)
              }}
            >
              Cancelar
            </Button>
            <Button type='submit' form='activity-form'>
              Salvar
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </>
  )
}
