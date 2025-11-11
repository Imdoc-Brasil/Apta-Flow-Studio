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
  DialogTrigger,
} from '@/components/ui/dialog'
import { PlusCircle, MoreHorizontal } from 'lucide-react'
import { Badge } from '@/components/ui/badge'
import { useToast } from '@/hooks/use-toast'
import { Label } from '@/components/ui/label'
import { Textarea } from '@/components/ui/textarea'
import { initialClientsData } from '../../../clients/data'
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select'
import { useParams } from 'next/navigation'
import { initialUnitsData } from '../units/data'

type SurveyStatus = 'Planejada' | 'Em Andamento' | 'Concluída'

interface PsychosocialSurvey {
  id: string
  creationDate: string
  clientName: string
  unit: string
  circumstances: string
  status: SurveyStatus
}

const initialSurveys: PsychosocialSurvey[] = [
  {
    id: 'SURV-2023-001',
    creationDate: '2023-10-15',
    clientName: 'Innovate Inc.',
    unit: 'Matriz São Paulo',
    circumstances: 'Avaliação Anual 2023',
    status: 'Concluída',
  },
]

export default function PsychosocialPage() {
  const { toast } = useToast()
  const params = useParams()
  const contractId = params.contractId as string
  const client = initialClientsData.find((c) => c.contractId === contractId)
  const clientUnits = initialUnitsData.filter(
    (u) =>
      initialClientsData.find((c) => c.name === client?.name)?.name ===
      client?.name
  ) // This logic is a bit convoluted due to mock data structure

  const [surveys, setSurveys] = useState(initialSurveys)
  const [isDialogOpen, setIsDialogOpen] = useState(false)

  const handleCreateSurvey = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault()
    const formData = new FormData(e.currentTarget)
    const unitId = formData.get('unitId') as string
    const circumstances = formData.get('circumstances') as string
    const unitName =
      unitId === 'all'
        ? 'Todas as Unidades'
        : clientUnits.find((u) => u.id === unitId)?.name || 'N/A'

    if (!unitId || !circumstances || !client) {
      toast({
        variant: 'destructive',
        title: 'Campos Incompletos',
        description:
          'Por favor, selecione a unidade e descreva as circunstâncias.',
      })
      return
    }

    const newSurvey: PsychosocialSurvey = {
      id: `SURV-${new Date().getFullYear()}-${Math.random()
        .toString(36)
        .substring(2, 6)
        .toUpperCase()}`,
      creationDate: new Date().toISOString().split('T')[0],
      clientName: client.name,
      unit: unitName,
      circumstances,
      status: 'Planejada',
    }

    setSurveys((prev) => [newSurvey, ...prev])
    setIsDialogOpen(false)
    toast({
      title: 'Pesquisa Criada com Sucesso!',
      description: `A pesquisa "${circumstances}" foi criada e está pronta para ser iniciada.`,
    })
  }

  const getStatusVariant = (status: SurveyStatus) => {
    switch (status) {
      case 'Planejada':
        return 'default'
      case 'Em Andamento':
        return 'secondary'
      case 'Concluída':
        return 'outline'
      default:
        return 'default'
    }
  }

  return (
    <Card>
      <CardHeader>
        <div className='flex items-center justify-between'>
          <div>
            <CardTitle>Gestão de Riscos Psicossociais</CardTitle>
            <CardDescription>
              Crie, gerencie e analise as pesquisas de riscos psicossociais para
              as empresas clientes.
            </CardDescription>
          </div>
          <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
            <DialogTrigger asChild>
              <Button>
                <PlusCircle className='mr-2 h-4 w-4' />
                Criar Nova Pesquisa
              </Button>
            </DialogTrigger>
            <DialogContent>
              <DialogHeader>
                <DialogTitle>Criar Nova Pesquisa Psicossocial</DialogTitle>
                <DialogDescription>
                  Defina as informações básicas para iniciar uma nova campanha
                  de pesquisa.
                </DialogDescription>
              </DialogHeader>
              <form id='create-survey-form' onSubmit={handleCreateSurvey}>
                <div className='grid gap-4 py-4'>
                  <div className='space-y-2'>
                    <Label htmlFor='unitId'>Unidade(s)</Label>
                    <Select name='unitId' required>
                      <SelectTrigger>
                        <SelectValue placeholder='Selecione a unidade ou todas' />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value='all'>Todas as Unidades</SelectItem>
                        {clientUnits.map((unit) => (
                          <SelectItem key={unit.id} value={unit.id}>
                            {unit.name}
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                  </div>
                  <div className='space-y-2'>
                    <Label htmlFor='circumstances'>
                      Nome / Circunstâncias da Pesquisa
                    </Label>
                    <Textarea
                      id='circumstances'
                      name='circumstances'
                      placeholder='Ex: Avaliação Anual 2024, Investigação Pós-Incidente...'
                      required
                    />
                  </div>
                  <p className='text-sm text-muted-foreground'>
                    Após a criação, você poderá gerar o link e definir os
                    parâmetros demográficos.
                  </p>
                </div>
              </form>
              <DialogFooter>
                <Button variant='outline' onClick={() => setIsDialogOpen(false)}>
                  Cancelar
                </Button>
                <Button type='submit' form='create-survey-form'>
                  Criar Pesquisa
                </Button>
              </DialogFooter>
            </DialogContent>
          </Dialog>
        </div>
      </CardHeader>
      <CardContent>
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>ID da Pesquisa</TableHead>
              <TableHead>Unidade</TableHead>
              <TableHead>Circunstância</TableHead>
              <TableHead>Data de Criação</TableHead>
              <TableHead>Status</TableHead>
              <TableHead>
                <span className='sr-only'>Ações</span>
              </TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {surveys.map((survey) => (
              <TableRow key={survey.id}>
                <TableCell className='font-mono text-sm'>
                  {survey.id}
                </TableCell>
                <TableCell>{survey.unit}</TableCell>
                <TableCell className='font-medium'>
                  {survey.circumstances}
                </TableCell>
                <TableCell>
                  {new Date(survey.creationDate).toLocaleDateString('pt-BR', {
                    timeZone: 'UTC',
                  })}
                </TableCell>
                <TableCell>
                  <Badge variant={getStatusVariant(survey.status)}>
                    {survey.status}
                  </Badge>
                </TableCell>
                <TableCell>
                  <Button variant='ghost' size='icon'>
                    <MoreHorizontal className='h-4 w-4' />
                    <span className='sr-only'>Menu</span>
                  </Button>
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </CardContent>
    </Card>
  )
}
