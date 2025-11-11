'use client'

import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { ArrowLeft, BarChart2 } from 'lucide-react'
import Link from 'next/link'
import { useParams } from 'next/navigation'

export default function PsychosocialResultsPage() {
  const params = useParams()
  const contractId = params.contractId as string

  return (
    <div className='grid flex-1 auto-rows-max gap-4'>
      <div className='flex items-center gap-4'>
        <Button asChild variant='outline' size='icon' className='h-7 w-7'>
          <Link href={`/dashboard/clients/${contractId}/psychosocial`}>
            <ArrowLeft className='h-4 w-4' />
            <span className='sr-only'>Voltar</span>
          </Link>
        </Button>
        <h1 className='flex-1 shrink-0 whitespace-nowrap text-xl font-semibold tracking-tight sm:grow-0'>
          Resultados da Pesquisa Psicossocial
        </h1>
      </div>
      <Card>
        <CardHeader>
          <CardTitle>Análise de Resultados - Avaliação Anual 2023</CardTitle>
          <CardDescription>
            Visão geral dos indicadores de bem-estar e estresse no trabalho.
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className='flex flex-1 items-center justify-center rounded-lg border border-dashed shadow-sm h-96'>
            <div className='flex flex-col items-center gap-2 text-center'>
              <BarChart2 className='h-12 w-12 text-muted-foreground' />
              <h3 className='text-2xl font-bold tracking-tight'>
                Análise em Desenvolvimento
              </h3>
              <p className='text-sm text-muted-foreground'>
                Os gráficos e indicadores para esta pesquisa aparecerão aqui em
                breve.
              </p>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  )
}
