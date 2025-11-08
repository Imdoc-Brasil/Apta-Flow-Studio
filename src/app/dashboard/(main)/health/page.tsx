'use client'

import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from '@/components/ui/card'
import { Stethoscope } from 'lucide-react'

export default function HealthPage() {
  return (
    <div className='grid flex-1 auto-rows-max gap-4'>
      <div className='flex items-center gap-4'>
        <h1 className='flex-1 shrink-0 whitespace-nowrap text-xl font-semibold tracking-tight sm:grow-0'>
          Gestão de Saúde
        </h1>
      </div>
      <Card>
        <CardHeader>
          <CardTitle>Sistema de Saúde</CardTitle>
          <CardDescription>
            Gerencie o catálogo de exames clínicos, laboratoriais e outras
            atividades de saúde.
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className='flex flex-1 items-center justify-center rounded-lg border border-dashed shadow-sm h-96'>
            <div className='flex flex-col items-center gap-1 text-center'>
              <Stethoscope className='h-12 w-12 text-muted-foreground' />
              <h3 className='text-2xl font-bold tracking-tight'>
                Bem-vindo à Gestão de Saúde
              </h3>
              <p className='text-sm text-muted-foreground'>
                Utilize este espaço para configurar e gerenciar todos os
                serviços de saúde oferecidos.
              </p>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  )
}
