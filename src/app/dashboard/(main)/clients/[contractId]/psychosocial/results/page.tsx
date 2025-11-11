
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
import { useParams, useSearchParams } from 'next/navigation'
import { psychosocialSurveyData } from '../data'

export default function PsychosocialResultsPage() {
  const params = useParams()
  const contractId = params.contractId as string
  const searchParams = useSearchParams()
  const surveyId = searchParams.get('surveyId')

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
          <CardTitle>Análise de Resultados - {surveyId || 'Avaliação Anual 2023'}</CardTitle>
          <CardDescription>
            Visão geral dos indicadores de bem-estar e estresse no trabalho para
            cada fator de estresse.
          </CardDescription>
        </CardHeader>
        <CardContent className='grid gap-6 md:grid-cols-2 lg:grid-cols-3'>
          {psychosocialSurveyData.map((group) => (
            <Card key={group.id}>
              <CardHeader>
                <CardTitle className='text-lg'>{group.name}</CardTitle>
              </CardHeader>
              <CardContent>
                 <div className='flex flex-col items-center justify-center h-48 rounded-lg border border-dashed text-sm text-muted-foreground'>
                    <BarChart2 className='h-8 w-8 mb-2' />
                    <p>Gráfico de pontuação</p>
                 </div>
              </CardContent>
            </Card>
          ))}
        </CardContent>
      </Card>
    </div>
  )
}
