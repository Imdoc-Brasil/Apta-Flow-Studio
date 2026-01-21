
'use client'

import { Mail, MapPin, Phone, User, Building } from 'lucide-react'
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
  CardDescription,
} from '@/components/ui/card'
import { useDoc, useFirestore, useMemoFirebase } from '@/firebase'
import { doc } from 'firebase/firestore'
import { useParams } from 'next/navigation'
import type { Client } from '@/lib/types/client'
import { Loader2 } from 'lucide-react'

export default function InfoDashboard() {
  const params = useParams()
  const contractId = params.contractId as string
  const firestore = useFirestore()

  const clientRef = useMemoFirebase(
    () => (firestore ? doc(firestore, 'clients', contractId) : null),
    [firestore, contractId]
  )

  const { data: client, isLoading: isClientLoading } = useDoc<Client>(clientRef)

  if (isClientLoading) {
    return (
      <div className='flex items-center justify-center h-64'>
        <Loader2 className='h-8 w-8 animate-spin' />
      </div>
    )
  }

  if (!client) {
    return <p>Cliente não encontrado.</p>
  }
  
  const riskLevelMap = {
    '1': { label: 'Muito Baixo', color: 'bg-green-500' },
    '2': { label: 'Baixo', color: 'bg-blue-500' },
    '3': { label: 'Médio', color: 'bg-yellow-500' },
    '4': { label: 'Alto', color: 'bg-red-500' },
  } as const

  const riskInfo =
    riskLevelMap[(client.riskLevel || '1') as keyof typeof riskLevelMap] || {
      label: 'N/A',
      color: 'bg-gray-400',
    }

  return (
    <div className='grid flex-1 auto-rows-max gap-8'>
      <Card>
        <CardHeader>
          <CardTitle>Informações Gerais</CardTitle>
          <CardDescription>
            Detalhes cadastrais, fiscais e de contato do cliente.
          </CardDescription>
        </CardHeader>
        <CardContent className='grid gap-6 md:grid-cols-2 lg:grid-cols-3'>
          <div className='space-y-1'>
            <p className='text-sm font-medium text-muted-foreground'>CNPJ</p>
            <p className='text-sm font-semibold'>{client.cnpj}</p>
          </div>
           <div className='space-y-1'>
            <p className='text-sm font-medium text-muted-foreground'>Nome Fantasia</p>
            <p className='text-sm font-semibold'>{client.tradeName || client.name}</p>
          </div>
          <div className='space-y-1'>
            <p className='text-sm font-medium text-muted-foreground'>CNAE Principal</p>
            <p className='text-sm font-semibold'>{client.cnae}</p>
          </div>
          <div className='space-y-1'>
            <p className='text-sm font-medium text-muted-foreground'>
              Grau de Risco (NR-4)
            </p>
            <div className='flex items-center gap-2'>
              <span className={`h-3 w-3 rounded-full ${riskInfo.color}`} />
              <p className='text-sm font-semibold'>
                {riskInfo.label} (Grau {client.riskLevel})
              </p>
            </div>
          </div>
            <div className='space-y-1 col-span-full'>
            <p className='text-sm font-medium text-muted-foreground'>
              Endereço
            </p>
            <div className='flex items-center gap-2 text-sm font-semibold'>
              <MapPin className='h-4 w-4 text-muted-foreground' />{' '}
              {client.address}
            </div>
          </div>
        </CardContent>
      </Card>
      
       <Card>
        <CardHeader>
          <CardTitle>Responsáveis</CardTitle>
        </CardHeader>
        <CardContent className='grid gap-6 md:grid-cols-2'>
            <div className='space-y-4'>
            <p className='text-sm font-medium text-muted-foreground'>
              Responsável pelo Contrato
            </p>
            <div className='flex items-center gap-4'>
              <User className='h-8 w-8 text-muted-foreground' />
              <div>
                <p className='font-semibold'>{client.contractResponsibleName}</p>
                <p className='text-sm text-muted-foreground'>
                  Contato Principal
                </p>
              </div>
            </div>
            <div className='flex items-center gap-2 text-sm'>
              <Phone className='h-4 w-4 text-muted-foreground' />
              <span>{client.contractResponsiblePhone}</span>
            </div>
             <div className='flex items-center gap-2 text-sm'>
              <Mail className='h-4 w-4 text-muted-foreground' />
              <span>{client.contractResponsibleEmail}</span>
            </div>
          </div>
            <div className='space-y-4'>
            <p className='text-sm font-medium text-muted-foreground'>
              Responsável Administrativo
            </p>
            <div className='flex items-center gap-4'>
              <User className='h-8 w-8 text-muted-foreground' />
              <div>
                <p className='font-semibold'>{client.adminResponsibleName}</p>
                 <p className='text-sm text-muted-foreground'>
                  CPF: {client.adminResponsibleCPF}
                </p>
              </div>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  )
}
