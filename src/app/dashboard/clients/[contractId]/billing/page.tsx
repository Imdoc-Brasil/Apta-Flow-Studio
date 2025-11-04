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
import { Badge } from '@/components/ui/badge'
import { Button } from '@/components/ui/button'
import { Download, FileText, Landmark } from 'lucide-react'
import { differenceInDays, format, parseISO } from 'date-fns'
import { ptBR } from 'date-fns/locale'
import { useState } from 'react'

const initialInvoiceData = [
  {
    refMonth: '2024-07',
    dueDate: '2024-08-10',
    status: 'Em aberto',
    amount: 3500.0,
    invoiceUrl: '#',
    boletoUrl: '#',
  },
  {
    refMonth: '2024-06',
    dueDate: '2024-07-10',
    status: 'Paga',
    amount: 3500.0,
    invoiceUrl: '#',
    boletoUrl: '#',
  },
  {
    refMonth: '2024-05',
    dueDate: '2024-06-10',
    status: 'Paga',
    amount: 3450.0,
    invoiceUrl: '#',
    boletoUrl: '#',
  },
  {
    refMonth: '2024-04',
    dueDate: '2024-05-10',
    status: 'Atrasada',
    amount: 3450.0,
    invoiceUrl: '#',
    boletoUrl: '#',
  },
]

export default function BillingPage() {
  const [invoiceData, setInvoiceData] = useState(initialInvoiceData)
  const [contractStatus, setContractStatus] = useState('Ativo')

  const getStatusBadge = (status: string, dueDate: string) => {
    const daysOverdue = differenceInDays(new Date(), parseISO(dueDate))

    switch (status) {
      case 'Paga':
        return <Badge variant='secondary'>Paga</Badge>
      case 'Em aberto':
        if (daysOverdue > 0) {
          return (
            <Badge variant='destructive'>{`${daysOverdue} dias de atraso`}</Badge>
          )
        }
        const daysUntilDue = differenceInDays(parseISO(dueDate), new Date())
        return (
          <Badge variant='default'>{`Vence em ${daysUntilDue} dias`}</Badge>
        )
      case 'Atrasada':
        return (
          <Badge variant='destructive'>{`${daysOverdue} dias de atraso`}</Badge>
        )
      default:
        return <Badge variant='outline'>{status}</Badge>
    }
  }

  const getCardStatus = () => {
    const openInvoice = invoiceData.find(
      (inv) => inv.status === 'Em aberto' || inv.status === 'Atrasada'
    )
    if (!openInvoice)
      return (
        <p className='text-sm text-muted-foreground'>
          Todas as faturas estão em dia.
        </p>
      )

    const days = differenceInDays(new Date(), parseISO(openInvoice.dueDate))

    if (days > 0) {
      return (
        <>
          <div className='text-2xl font-bold text-destructive'>
            {days} dias de atraso
          </div>
          <p className='text-xs text-muted-foreground'>
            Fatura de{' '}
            {format(parseISO(openInvoice.refMonth), "MMMM 'de' yyyy", {
              locale: ptBR,
            })}
          </p>
        </>
      )
    }

    const daysUntilDue = differenceInDays(
      parseISO(openInvoice.dueDate),
      new Date()
    )
    return (
      <>
        <div className='text-2xl font-bold'>Disponível para Pagamento</div>
        <p className='text-xs text-muted-foreground'>
          Vence em {daysUntilDue} dias ({format(parseISO(openInvoice.dueDate), 'dd/MM/yyyy')})
        </p>
      </>
    )
  }

  return (
    <div className='grid flex-1 auto-rows-max gap-4'>
      <div className='grid gap-4 md:grid-cols-2 lg:grid-cols-7'>
        <Card className='lg:col-span-2'>
          <CardHeader className='flex flex-row items-center justify-between space-y-0 pb-2'>
            <CardTitle className='text-sm font-medium'>
              Status do Contrato
            </CardTitle>
            <FileText className='h-4 w-4 text-muted-foreground' />
          </CardHeader>
          <CardContent>
            <div className='text-2xl font-bold'>{contractStatus}</div>
            <p className='text-xs text-muted-foreground'>
              O contrato de serviço está ativo e sem pendências.
            </p>
          </CardContent>
        </Card>
        <Card className='lg:col-span-2'>
          <CardHeader className='flex flex-row items-center justify-between space-y-0 pb-2'>
            <CardTitle className='text-sm font-medium'>Fatura Atual</CardTitle>
            <Landmark className='h-4 w-4 text-muted-foreground' />
          </CardHeader>
          <CardContent>{getCardStatus()}</CardContent>
        </Card>
      </div>

      <Card>
        <CardHeader>
          <CardTitle>Histórico de Faturamento</CardTitle>
          <CardDescription>
            Acesse e gerencie suas faturas e boletos de pagamento.
          </CardDescription>
        </CardHeader>
        <CardContent>
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Mês de Referência</TableHead>
                <TableHead>Vencimento</TableHead>
                <TableHead>Status</TableHead>
                <TableHead className='text-right'>Ações</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {invoiceData.map((invoice, index) => (
                <TableRow key={index}>
                  <TableCell className='font-medium'>
                    {format(parseISO(invoice.refMonth), "MMMM 'de' yyyy", {
                      locale: ptBR,
                    })}
                  </TableCell>
                  <TableCell>
                    {format(parseISO(invoice.dueDate), 'dd/MM/yyyy')}
                  </TableCell>
                  <TableCell>
                    {getStatusBadge(invoice.status, invoice.dueDate)}
                  </TableCell>
                  <TableCell className='text-right'>
                    <Button variant='outline' size='sm' asChild>
                      <a
                        href={invoice.invoiceUrl}
                        target='_blank'
                        rel='noopener noreferrer'
                      >
                        <Download className='mr-2 h-3.5 w-3.5' />
                        Fatura (PDF)
                      </a>
                    </Button>
                    <Button variant='default' size='sm' className='ml-2' asChild>
                      <a
                        href={invoice.boletoUrl}
                        target='_blank'
                        rel='noopener noreferrer'
                      >
                        <Download className='mr-2 h-3.5 w-3.5' />
                        Boleto
                      </a>
                    </Button>
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
