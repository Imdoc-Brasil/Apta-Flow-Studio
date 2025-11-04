'use client'

import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { PlusCircle, FileText } from 'lucide-react'
import { useState } from 'react'

export default function PcmsoPage() {
  const [hasPcmso, setHasPcmso] = useState(false)

  return (
    <Card>
      <CardHeader>
        <CardTitle className='flex items-center justify-between'>
          Gestão de PCMSO
          <Button
            size='sm'
            className='h-8 gap-1'
            onClick={() => setHasPcmso(true)}
          >
            <PlusCircle className='h-3.5 w-3.5' />
            <span className='sr-only sm:not-sr-only sm:whitespace-nowrap'>
              Gerar PCMSO
            </span>
          </Button>
        </CardTitle>
        <CardDescription>
          Gerencie o Programa de Controle Médico de Saúde Ocupacional, incluindo
          exames e relatórios anuais.
        </CardDescription>
      </CardHeader>
      <CardContent>
        {hasPcmso ? (
          <div className='flex flex-col items-center justify-center rounded-lg border border-dashed shadow-sm h-96 p-8 text-center'>
            <FileText className='h-16 w-16 text-primary mb-4' />
            <h3 className='text-2xl font-bold tracking-tight'>
              PCMSO Gerado com Sucesso!
            </h3>
            <p className='text-sm text-muted-foreground max-w-md mx-auto mt-2'>
              O documento base do PCMSO foi criado. Agora você pode prosseguir
              para a definição de exames por função, agendamentos e emissão do
              relatório anual.
            </p>
            <div className='flex gap-2 mt-6'>
              <Button>Baixar Documento Base</Button>
              <Button variant='outline'>Ver Relatório Anual</Button>
            </div>
          </div>
        ) : (
          <div className='flex flex-1 items-center justify-center rounded-lg border border-dashed shadow-sm h-96'>
            <div className='flex flex-col items-center gap-1 text-center'>
              <h3 className='text-2xl font-bold tracking-tight'>
                PCMSO não iniciado
              </h3>
              <p className='text-sm text-muted-foreground'>
                Comece gerando o documento base do PCMSO para este cliente.
              </p>
              <Button className='mt-4' onClick={() => setHasPcmso(true)}>
                Gerar Documento PCMSO
              </Button>
            </div>
          </div>
        )}
      </CardContent>
    </Card>
  )
}
