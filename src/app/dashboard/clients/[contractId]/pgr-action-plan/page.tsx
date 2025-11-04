'use client'

import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { MoreHorizontal, PlusCircle } from 'lucide-react'
import { useState } from 'react'
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table'
import { Badge } from '@/components/ui/badge'
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu'
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from '@/components/ui/dialog'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select'
import { Textarea } from '@/components/ui/textarea'

const initialActionPlan = [
  {
    id: 'PA-001',
    riskId: 'INV-001',
    action: 'Implementar enclausuramento acústico na fonte de ruído.',
    responsible: 'Eng. de Segurança',
    deadline: '2024-09-30',
    status: 'Em Andamento',
  },
  {
    id: 'PA-002',
    riskId: 'INV-002',
    action: 'Realizar treinamento de levantamento de peso para estoquistas.',
    responsible: 'RH / Téc. Segurança',
    deadline: '2024-08-15',
    status: 'Concluída',
  },
  {
    id: 'PA-003',
    riskId: 'INV-003',
    action: 'Realizar medição de iluminamento e adequar luminárias.',
    responsible: 'Manutenção',
    deadline: '2024-08-30',
    status: 'Não Iniciada',
  },
]

type ActionPlanItem = (typeof initialActionPlan)[0]

export default function PgrActionPlanPage() {
  const [plan, setPlan] = useState(initialActionPlan)
  const [isDialogOpen, setIsDialogOpen] = useState(false)

  const handleAddAction = (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault()
    const formData = new FormData(event.currentTarget)
    const newItem: ActionPlanItem = {
      id: `PA-${Math.random().toString(36).substr(2, 4).toUpperCase()}`,
      riskId: formData.get('riskId') as string,
      action: formData.get('action') as string,
      responsible: formData.get('responsible') as string,
      deadline: formData.get('deadline') as string,
      status: 'Não Iniciada',
    }
    setPlan((prev) => [newItem, ...prev])
    setIsDialogOpen(false)
    ;(event.target as HTMLFormElement).reset()
  }

  return (
    <Card>
      <CardHeader>
        <CardTitle className='flex items-center justify-between'>
          Plano de Ação
          <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
            <DialogTrigger asChild>
              <Button size='sm' className='h-8 gap-1'>
                <PlusCircle className='h-3.5 w-3.5' />
                <span className='sr-only sm:not-sr-only sm:whitespace-nowrap'>
                  Adicionar Ação
                </span>
              </Button>
            </DialogTrigger>
            <DialogContent>
              <DialogHeader>
                <DialogTitle>Adicionar Nova Ação ao Plano</DialogTitle>
                <DialogDescription>
                  Descreva a medida de controle, o responsável e o prazo.
                </DialogDescription>
              </DialogHeader>
              <form id='add-action-form' onSubmit={handleAddAction}>
                <div className='grid gap-4 py-4'>
                  <div className='grid grid-cols-4 items-center gap-4'>
                    <Label htmlFor='riskId' className='text-right'>
                      ID do Risco
                    </Label>
                    <Input
                      id='riskId'
                      name='riskId'
                      placeholder='Ex: INV-001'
                      className='col-span-3'
                      required
                    />
                  </div>
                  <div className='grid grid-cols-4 items-center gap-4'>
                    <Label htmlFor='action' className='text-right'>
                      Ação
                    </Label>
                    <Textarea
                      id='action'
                      name='action'
                      className='col-span-3'
                      required
                    />
                  </div>
                  <div className='grid grid-cols-4 items-center gap-4'>
                    <Label htmlFor='responsible' className='text-right'>
                      Responsável
                    </Label>
                    <Input
                      id='responsible'
                      name='responsible'
                      className='col-span-3'
                      required
                    />
                  </div>
                  <div className='grid grid-cols-4 items-center gap-4'>
                    <Label htmlFor='deadline' className='text-right'>
                      Prazo
                    </Label>
                    <Input
                      id='deadline'
                      name='deadline'
                      type='date'
                      className='col-span-3'
                      required
                    />
                  </div>
                </div>
                <DialogFooter>
                  <Button
                    variant='outline'
                    onClick={() => setIsDialogOpen(false)}
                  >
                    Cancelar
                  </Button>
                  <Button type='submit' form='add-action-form'>
                    Salvar Ação
                  </Button>
                </DialogFooter>
              </form>
            </DialogContent>
          </Dialog>
        </CardTitle>
        <CardDescription>
          Crie e acompanhe o plano de ação para mitigar os riscos
          identificados.
        </CardDescription>
      </CardHeader>
      <CardContent>
        {plan.length > 0 ? (
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Ação Corretiva</TableHead>
                <TableHead>Responsável</TableHead>
                <TableHead>Prazo</TableHead>
                <TableHead>Status</TableHead>
                <TableHead>
                  <span className='sr-only'>Ações</span>
                </TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {plan.map((item) => (
                <TableRow key={item.id}>
                  <TableCell className='font-medium max-w-sm'>
                    <p className='truncate'>{item.action}</p>
                    <p className='text-xs text-muted-foreground'>
                      Risco: {item.riskId}
                    </p>
                  </TableCell>
                  <TableCell>{item.responsible}</TableCell>
                  <TableCell>{item.deadline}</TableCell>
                  <TableCell>
                    <Badge
                      variant={
                        item.status === 'Concluída'
                          ? 'secondary'
                          : item.status === 'Em Andamento'
                            ? 'default'
                            : 'outline'
                      }
                    >
                      {item.status}
                    </Badge>
                  </TableCell>
                  <TableCell className='text-right'>
                    <DropdownMenu>
                      <DropdownMenuTrigger asChild>
                        <Button size='icon' variant='ghost'>
                          <MoreHorizontal className='h-4 w-4' />
                        </Button>
                      </DropdownMenuTrigger>
                      <DropdownMenuContent>
                        <DropdownMenuItem>Atualizar Status</DropdownMenuItem>
                        <DropdownMenuItem>Editar</DropdownMenuItem>
                      </DropdownMenuContent>
                    </DropdownMenu>
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        ) : (
          <div className='flex flex-1 items-center justify-center rounded-lg border border-dashed shadow-sm h-96'>
            <div className='flex flex-col items-center gap-1 text-center'>
              <h3 className='text-2xl font-bold tracking-tight'>
                Nenhuma ação no plano
              </h3>
              <p className='text-sm text-muted-foreground'>
                Comece adicionando a primeira ação ao plano.
              </p>
              <Button className='mt-4' onClick={() => setIsDialogOpen(true)}>
                Adicionar Ação
              </Button>
            </div>
          </div>
        )}
      </CardContent>
    </Card>
  )
}
