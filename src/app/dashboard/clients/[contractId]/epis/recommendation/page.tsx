'use client'

import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { PlusCircle } from 'lucide-react'

export default function RecommendationPage() {
  return (
    <Card>
      <CardHeader>
        <CardTitle className='flex items-center justify-between'>
          Matriz de Recomendação de EPIs
          <Button size='sm' className='h-8 gap-1'>
            <PlusCircle className='h-3.5 w-3.5' />
            <span className='sr-only sm:not-sr-only sm:whitespace-nowrap'>
              Adicionar Recomendação
            </span>
          </Button>
        </CardTitle>
        <CardDescription>
          Vincule os EPIs do inventário aos riscos, GHEs, setores ou cargos
          específicos.
        </CardDescription>
      </CardHeader>
      <CardContent>
        <div className='flex flex-1 items-center justify-center rounded-lg border border-dashed shadow-sm h-96'>
          <div className='flex flex-col items-center gap-1 text-center'>
            <h3 className='text-2xl font-bold tracking-tight'>
              Nenhuma recomendação criada
            </h3>
            <p className='text-sm text-muted-foreground'>
              Comece a vincular EPIs a riscos para automatizar a gestão de
              entregas.
            </p>
            <Button className='mt-4'>Adicionar Recomendação</Button>
          </div>
        </div>
      </CardContent>
    </Card>
  )
}
