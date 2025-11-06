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

const pgrHistoryData = [
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
  return (
    <div className='grid flex-1 auto-rows-max gap-4'>
      <div className='flex items-center gap-4'>
        <h1 className='flex-1 shrink-0 whitespace-nowrap text-xl font-semibold tracking-tight sm:grow-0'>
          Gestão de Documentos PGR
        </h1>
        <div className='ml-auto flex items-center gap-2'>
          <Button>
            <PlusCircle className='mr-2 h-4 w-4' />
            Emitir Novo PGR
          </Button>
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
              {pgrHistoryData.map((item) => (
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
