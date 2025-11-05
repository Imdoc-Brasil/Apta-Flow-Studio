'use client'

import { useState, useEffect } from 'react'
import type { FC } from 'react'
import { useParams, usePathname, useRouter } from 'next/navigation'
import {
  PlusCircle,
  ArrowLeft,
  FileText,
  Mail,
  MapPin,
  Phone,
  User,
  Upload,
  Building,
} from 'lucide-react'
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
  CardDescription,
} from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { Button } from '@/components/ui/button'
import { initialClientsData } from '@/app/dashboard/clients/page'
import Link from 'next/link'
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
import { Textarea } from '@/components/ui/textarea'
import { useToast } from '@/hooks/use-toast'

const getClientById = (contractId: string) => {
  return initialClientsData.find((client) => client.contractId === contractId)
}

export default function InfoDashboard() {
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

  const riskLevelMap = {
    '1': { label: 'Muito Baixo', color: 'bg-green-500' },
    '2': { label: 'Baixo', color: 'bg-blue-500' },
    '3': { label: 'Médio', color: 'bg-yellow-500' },
    '4': { label: 'Alto', color: 'bg-red-500' },
  } as const

  const riskInfo =
    riskLevelMap[client.riskLevel as keyof typeof riskLevelMap] || {
      label: 'N/A',
      color: 'bg-gray-400',
    }

  return (
    <>
      <Card>
        <CardHeader>
          <CardTitle>Detalhes da Empresa</CardTitle>
          <CardDescription>
            Informações detalhadas sobre o cliente, contrato e responsável.
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
            <p className='text-sm font-medium text-muted-foreground'>
              Grau de Risco
            </p>
            <div className='flex items-center gap-2'>
              <span className={`h-3 w-3 rounded-full ${riskInfo.color}`} />
              <p className='text-sm font-semibold'>
                {riskInfo.label} (Grau {client.riskLevel})
              </p>
            </div>
          </div>
          <div className='space-y-1'>
            <p className='text-sm font-medium text-muted-foreground'>Email</p>
            <div className='flex items-center gap-2 text-sm font-semibold'>
              <Mail className='h-4 w-4 text-muted-foreground' /> {client.contact}
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
                <p className='font-semibold'>{client.responsibleName}</p>
                <p className='text-sm text-muted-foreground'>
                  Contato Principal
                </p>
              </div>
            </div>
            <div className='flex items-center gap-2 text-sm'>
              <Phone className='h-4 w-4 text-muted-foreground' />
              <span>{client.responsibleContact}</span>
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
                {client.contractId}
              </p>
            </div>
          </div>
        </CardContent>
      </Card>
    </>
  )
}
