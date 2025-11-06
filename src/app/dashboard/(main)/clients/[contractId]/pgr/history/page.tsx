'use client'

import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from '@/components/ui/card'
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table'
import { Button } from '@/components/ui/button'
import { MoreHorizontal, FileDown, PlusCircle } from 'lucide-react'
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu'
import { Badge } from '@/components/ui/badge'
import React, { useState, useEffect } from 'react'
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
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select'
import { initialStaffsData } from '@/app/dashboard/(main)/employees/page'
import { useToast } from '@/hooks/use-toast'

const initialPgrHistoryData = [
  {
    version: '2.0',
    issueDate: '2024-01-15',
    validity: '24 meses',
    responsible: 'Eng. Ana Beatriz',
    status: 'Vigente',
  },
  {
    version: '1.0',
    issueDate: '2022-01-15',
    validity: '24 meses',
    responsible: 'Eng. Carlos Silva',
    status: 'Expirado',
  },
]

type PgrEntry = (typeof initialPgrHistoryData)[0]

function ClientSideDateFormatter({ dateString }: { dateString: string }) {
  const [formattedDate, setFormattedDate] = useState('')

  useEffect(() => {
    // A 'T00:00:00' garante que a data seja interpretada em UTC,
    // evitando que ela mude de dia dependendo do fuso horário do navegador.
    const date = new Date(`${dateString}T00:00:00`)
    setFormattedDate(date.toLocaleDateString('pt-BR'))
  }, [dateString])

  if (!formattedDate) {
    return null // Retorna nulo durante a renderização do servidor e a primeira renderização do cliente
  }

  return <>{formattedDate}</>
}

export default function PgrHistoryPage() {
  const [pgrHistory, setPgrHistory] = useState(initialPgrHistoryData)
  const [isDialogOpen, setIsDialogOpen] = useState(false)
  const { toast } = useToast()

  const getNextVersion = () => {
    if (pgrHistory.length === 0) return '1.0'
    const latestVersion = Math.max(
      ...pgrHistory.map((p) => parseFloat(p.version))
    )
    return (latestVersion + 1).toFixed(1)
  }

  const handleEmitPgr = (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault()
    const formData = new FormData(event.currentTarget)
    const responsibleName =
      initialStaffsData.find(
        (staff) => staff.email === (formData.get('responsible') as string)
      )?.name || 'Não definido'

    const newPgr: PgrEntry = {
      version: formData.get('version') as string,
      issueDate: new Date().toISOString().split('T')[0],
      validity: formData.get('validity') as string,
      responsible: responsibleName,
      status: 'Vigente',
    }
    setPgrHistory((prev) => [newPgr, ...prev])
    setIsDialogOpen(false)
    toast({
      title: 'PGR Emitido com Sucesso!',
      description: `A versão ${newPgr.version} do PGR foi adicionada ao histórico.`,
    })
  }

  return (
    <div className='grid flex-1 auto-rows-max gap-4'>
      <div className='flex items-center gap-4'>
        <h1 className='flex-1 shrink-0 whitespace-nowrap text-xl font-semibold tracking-tight sm:grow-0'>
          Gestão de Documentos PGR
        </h1>
        <div className='ml-auto flex items-center gap-2'>
          <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
            <DialogTrigger asChild>
              <Button>
                <PlusCircle className='mr-2 h-4 w-4' />
                Emitir Novo PGR
              </Button>
            </DialogTrigger>
            <DialogContent>
              <DialogHeader>
                <DialogTitle>Emitir Novo PGR</DialogTitle>
                <DialogDescription>
                  Preencha as informações para gerar uma nova versão do
                  documento PGR.
                </DialogDescription>
              </DialogHeader>
              <form id='emit-pgr-form' onSubmit={handleEmitPgr}>
                <div className='grid gap-4 py-4'>
                  <div className='grid grid-cols-4 items-center gap-4'>
                    <Label htmlFor='version' className='text-right'>
                      Versão
                    </Label>
                    <Input
                      id='version'
                      name='version'
                      className='col-span-3'
                      defaultValue={getNextVersion()}
                      required
                    />
                  </div>
                  <div className='grid grid-cols-4 items-center gap-4'>
                    <Label htmlFor='validity' className='text-right'>
                      Vigência
                    </Label>
                    <Input
                      id='validity'
                      name='validity'
                      placeholder='Ex: 24 meses'
                      className='col-span-3'
                      required
                    />
                  </div>
                  <div className='grid grid-cols-4 items-center gap-4'>
                    <Label htmlFor='responsible' className='text-right'>
                      Responsável
                    </Label>
                    <Select name='responsible' required>
                      <SelectTrigger className='col-span-3'>
                        <SelectValue placeholder='Selecione um responsável' />
                      </SelectTrigger>
                      <SelectContent>
                        {initialStaffsData.map((staff) => (
                          <SelectItem key={staff.email} value={staff.email}>
                            {staff.name}
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
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
                <Button type='submit' form='emit-pgr-form'>
                  Emitir
                </Button>
              </DialogFooter>
            </DialogContent>
          </Dialog>
        </div>
      </div>
      <Card>
        <CardHeader>
          <CardTitle>Histórico de Emissões</CardTitle>
          <CardDescription>
            Visualize e gerencie todas as versões do Programa de Gerenciamento
            de Riscos emitidas para este cliente.
          </CardDescription>
        </CardHeader>
        <CardContent>
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Versão</TableHead>
                <TableHead>Data de Emissão</TableHead>
                <TableHead>Vigência</TableHead>
                <TableHead>Responsável Técnico</TableHead>
                <TableHead>Status</TableHead>
                <TableHead>
                  <span className='sr-only'>Ações</span>
                </TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {pgrHistory.map((item) => (
                <TableRow key={item.version}>
                  <TableCell className='font-medium'>{item.version}</TableCell>
                  <TableCell>
                    <ClientSideDateFormatter dateString={item.issueDate} />
                  </TableCell>
                  <TableCell>{item.validity}</TableCell>
                  <TableCell>{item.responsible}</TableCell>
                  <TableCell>
                    <Badge
                      variant={
                        item.status === 'Vigente' ? 'secondary' : 'outline'
                      }
                    >
                      {item.status}
                    </Badge>
                  </TableCell>
                  <TableCell>
                    <DropdownMenu>
                      <DropdownMenuTrigger asChild>
                        <Button
                          aria-haspopup='true'
                          size='icon'
                          variant='ghost'
                        >
                          <MoreHorizontal className='h-4 w-4' />
                        </Button>
                      </DropdownMenuTrigger>
                      <DropdownMenuContent align='end'>
                        <DropdownMenuLabel>Ações</DropdownMenuLabel>
                        <DropdownMenuItem>
                          <FileDown className='mr-2 h-4 w-4' />
                          Baixar Documento
                        </DropdownMenuItem>
                      </DropdownMenuContent>
                    </DropdownMenu>
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </CardContent>
      </Card>
    </div>
  )
}
