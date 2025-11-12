'use client'

import {
  ArrowLeft,
  FileText,
  Mail,
  MapPin,
  Phone,
  User,
  Building,
  ArrowRight,
} from 'lucide-react'
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
  CardDescription,
  CardFooter,
} from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import Link from 'next/link'
import { useDoc, useFirestore, useMemoFirebase } from '@/firebase'
import { doc, collection } from 'firebase/firestore'
import { useParams } from 'next/navigation'
import type { Client } from '../data'
import type { Unit } from './units/data'
import { Loader2 } from 'lucide-react'
import { useCollection } from '@/firebase/firestore/use-collection'

export default function ClientDashboardPage() {
  const params = useParams()
  const contractId = params.contractId as string
  const firestore = useFirestore()

  const clientRef = useMemoFirebase(
    () => (firestore ? doc(firestore, 'clients', contractId) : null),
    [firestore, contractId]
  )

  const unitsRef = useMemoFirebase(
    () =>
      firestore
        ? collection(firestore, 'clients', contractId, 'units')
        : null,
    [firestore, contractId]
  )
  
  const employeesRef = useMemoFirebase(
    () =>
      firestore
        ? collection(firestore, 'clients', contractId, 'staffs')
        : null,
    [firestore, contractId]
  )
  
  const ticketsRef = useMemoFirebase(
    () =>
      firestore
        ? collection(firestore, 'tickets')
        : null,
    [firestore]
  )


  const { data: client, isLoading: isClientLoading } = useDoc<Client>(clientRef)
  const { data: units, isLoading: areUnitsLoading } = useCollection<Unit>(unitsRef)
  const { data: employees, isLoading: areEmployeesLoading } = useCollection(employeesRef)
  const { data: tickets, isLoading: areTicketsLoading } = useCollection(ticketsRef)


  const isLoading = isClientLoading || areUnitsLoading || areEmployeesLoading || areTicketsLoading;


  if (isLoading) {
    return (
      <div className='flex items-center justify-center h-64'>
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
    
  const clientTickets = tickets?.filter(t => t.client === client.name);
  const openTicketsCount = clientTickets?.filter(t => t.status === 'Aberto' || t.status === 'Em Progresso').length || 0;

  return (
    <div className='grid flex-1 auto-rows-max gap-8'>
       <div className="grid gap-4 md:grid-cols-2 md:gap-8 lg:grid-cols-4">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Colaboradores</CardTitle>
            <Users className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{employees?.length || 0}</div>
            <p className="text-xs text-muted-foreground">
              Total de colaboradores ativos
            </p>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Chamados Abertos</CardTitle>
            <Ticket className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{openTicketsCount}</div>
            <p className="text-xs text-muted-foreground">
               Total de {clientTickets?.length || 0} chamados
            </p>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Unidades</CardTitle>
            <Building className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{units?.length || 0}</div>
            <p className="text-xs text-muted-foreground">
              Unidades e canteiros de obra
            </p>
          </CardContent>
        </Card>
         <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Grau de Risco (NR4)</CardTitle>
             <div className={`h-4 w-4 rounded-full ${riskInfo.color}`} />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">Grau {client.riskLevel}</div>
            <p className="text-xs text-muted-foreground">
              {riskInfo.label}
            </p>
          </CardContent>
        </Card>
      </div>
      <Card>
        <CardHeader>
          <CardTitle>Informações do Contrato</CardTitle>
          <CardDescription>
            Detalhes sobre o cliente, contrato e responsável.
          </CardDescription>
        </CardHeader>
        <CardContent className='grid gap-6 md:grid-cols-2 lg:grid-cols-3'>
          <div className='space-y-1'>
            <p className='text-sm font-medium text-muted-foreground'>CNPJ</p>
            <p className='text-sm font-semibold'>{client.cnpj}</p>
          </div>
          <div className='space-y-1'>
            <p className='text-sm font-medium text-muted-foreground'>CNAE</p>
            <p className='text-sm font-semibold'>{client.cnae}</p>
          </div>
         
          <div className='space-y-1'>
            <p className='text-sm font-medium text-muted-foreground'>Email</p>
            <div className='flex items-center gap-2 text-sm font-semibold'>
              <Mail className='h-4 w-4 text-muted-foreground' /> {client.contractResponsibleEmail}
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
          <div className='space-y-4'>
            <p className='text-sm font-medium text-muted-foreground'>
              Responsável
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
          </div>
          <div className='space-y-4'>
            <p className='text-sm font-medium text-muted-foreground'>
              Contrato
            </p>
            <div className='flex items-center gap-2'>
              <FileText className='h-5 w-5 text-muted-foreground' />
              <h4 className='font-semibold'>Detalhes</h4>
            </div>
            <div className='pl-7 space-y-1'>
              <p className='text-sm'>
                <span className='font-medium text-muted-foreground'>ID:</span>{' '}
                {client.id}
              </p>
            </div>
          </div>
        </CardContent>
         <CardFooter>
          <Button asChild variant="outline">
              <Link href={`/dashboard/clients/${contractId}/info`}>Ver todas as informações</Link>
          </Button>
        </CardFooter>
      </Card>
    </div>
  )
}
