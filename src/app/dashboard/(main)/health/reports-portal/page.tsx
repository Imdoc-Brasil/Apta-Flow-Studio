'use client'

import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from '@/components/ui/card'
import { Stethoscope } from 'lucide-react'

export default function ReportsPortalPage() {
  return (
    <div className='grid flex-1 auto-rows-max gap-4'>
      <div className='flex items-center gap-4'>
        <h1 className='flex-1 shrink-0 whitespace-nowrap text-xl font-semibold tracking-tight sm:grow-0'>
          Portal de Laudos
        </h1>
      </div>
      <Card>
        <CardHeader>
          <CardTitle>Portal de Laudos</CardTitle>
          <CardDescription>
            Central de recebimento de exames, emissão de laudos e acompanhamento de pendências.
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className='flex flex-1 items-center justify-center rounded-lg border border-dashed shadow-sm h-96'>
            <div className='flex flex-col items-center gap-1 text-center'>
              <Stethoscope className='h-12 w-12 text-muted-foreground' />
              <h3 className='text-2xl font-bold tracking-tight'>
                Bem-vindo ao Portal de Laudos
              </h3>
              <p className='text-sm text-muted-foreground'>
                Aqui você poderá visualizar filas de exames, laudar e liberar resultados.
              </p>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  )
}
