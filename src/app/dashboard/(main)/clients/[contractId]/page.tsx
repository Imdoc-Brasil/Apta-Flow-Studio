'use client'

import { useParams } from 'next/navigation'
import { Badge } from '@/components/ui/badge'
import Link from 'next/link'
import { Button } from '@/components/ui/button'
import { ArrowLeft } from 'lucide-react'
import { initialClientsData } from '../data'

const getClientById = (contractId: string) => {
  return initialClientsData.find((client) => client.contractId === contractId)
}

export default function ClientDetailsPage({
  children,
}: {
  children: React.ReactNode
}) {
  const params = useParams()
  const contractId = params.contractId as string
  const client = getClientById(contractId)

  if (!client) {
    return (
      <div className='flex flex-col items-center justify-center h-full text-center'>
        <h2 className='text-2xl font-bold'>Cliente não encontrado</h2>
        <p className='text-muted-foreground'>
          O cliente que você está procurando não existe.
        </p>
        <Button asChild className='mt-4'>
          <Link href='/dashboard/clients'>
            <ArrowLeft className='mr-2 h-4 w-4' />
            Voltar para Clientes
          </Link>
        </Button>
      </div>
    )
  }

  return (
    <div className='grid flex-1 auto-rows-max gap-4'>
      <div className='flex items-center gap-4'>
        <h1 className='flex-1 shrink-0 whitespace-nowrap text-xl font-semibold tracking-tight sm:grow-0'>
          {client.name}
        </h1>
        <Badge
          variant={client.status === 'Ativo' ? 'secondary' : 'outline'}
          className='ml-auto sm:ml-0'
        >
          {client.status}
        </Badge>
      </div>

      {children}
    </div>
  )
}
