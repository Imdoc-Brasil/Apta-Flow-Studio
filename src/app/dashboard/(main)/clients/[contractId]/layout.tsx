'use client'

import { useParams } from 'next/navigation'
import { Badge } from '@/components/ui/badge'
import Link from 'next/link'
import { Button } from '@/components/ui/button'
import { ArrowLeft, Loader2 } from 'lucide-react'
import { useDoc, useFirestore, useMemoFirebase } from '@/firebase'
import { doc } from 'firebase/firestore'
import { type Client } from '../data'

export default function ClientDetailLayout({
  children,
}: {
  children: React.ReactNode
}) {
  const params = useParams()
  const contractId = params.contractId as string
  const firestore = useFirestore()

  const clientRef = useMemoFirebase(
    () => (firestore ? doc(firestore, 'clients', contractId) : null),
    [firestore, contractId]
  )
  const { data: client, isLoading } = useDoc<Client>(clientRef)

  if (isLoading) {
    return (
      <div className='flex items-center justify-center h-full'>
        <Loader2 className='h-8 w-8 animate-spin' />
      </div>
    )
  }

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
