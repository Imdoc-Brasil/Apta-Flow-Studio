'use client'

import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { PlusCircle, ShieldAlert } from 'lucide-react'
import { useState } from 'react'
import Link from 'next/link'
import { useParams } from 'next/navigation'

export default function PgrPage() {
  const [hasPgr, setHasPgr] = useState(false)
  const params = useParams()
  const contractId = params.contractId as string

  return (
    <Card>
      <CardHeader>
        <CardTitle className='flex items-center justify-between'>
          Gestão de Riscos (PGR)
          <Button
            size='sm'
            className='h-8 gap-1'
            onClick={() => setHasPgr(true)}
          >
            <PlusCircle className='h-3.5 w-3.5' />
            <span className='sr-only sm:not-sr-only sm:whitespace-nowrap'>
              Gerar PGR
            </span>
          </Button>
        </CardTitle>
        <CardDescription>
          Gerencie o Programa de Gerenciamento de Riscos para este cliente,
          incluindo inventário de riscos e plano de ação.
        </CardDescription>
      </CardHeader>
      <CardContent>
        {hasPgr ? (
          <div className='flex flex-col items-center justify-center rounded-lg border border-dashed shadow-sm h-96 p-8 text-center'>
            <ShieldAlert className='h-16 w-16 text-primary mb-4' />
            <h3 className='text-2xl font-bold tracking-tight'>
              PGR Gerado com Sucesso!
            </h3>
            <p className='text-sm text-muted-foreground max-w-md mx-auto mt-2'>
              O documento base do PGR foi criado. Agora você pode começar a
              popular o inventário de riscos e a criar o plano de ação.
            </p>
            <div className='flex gap-2 mt-6'>
              <Button asChild>
                <Link href={`/dashboard/clients/${contractId}/pgr-inventory`}>
                  Acessar Inventário de Riscos
                </Link>
              </Button>
              <Button variant='outline' asChild>
                <Link href={`/dashboard/clients/${contractId}/pgr-action-plan`}>
                  Ver Plano de Ação
                </Link>
              </Button>
            </div>
          </div>
        ) : (
          <div className='flex flex-1 items-center justify-center rounded-lg border border-dashed shadow-sm h-96'>
            <div className='flex flex-col items-center gap-1 text-center'>
              <h3 className='text-2xl font-bold tracking-tight'>
                PGR não iniciado
              </h3>
              <p className='text-sm text-muted-foreground'>
                Comece gerando o documento base do PGR para este cliente.
              </p>
              <Button className='mt-4' onClick={() => setHasPgr(true)}>
                Gerar Documento PGR
              </Button>
            </div>
          </div>
        )}
      </CardContent>
    </Card>
  )
}
