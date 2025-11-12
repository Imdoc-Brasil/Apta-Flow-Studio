
'use client'

import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { FileText } from 'lucide-react'
import Link from 'next/link'

export default function DocumentsPage() {
  return (
    <div className='grid flex-1 auto-rows-max gap-4'>
      <h1 className='font-headline text-3xl font-bold'>
        Repositório de Documentos
      </h1>
      <Card>
        <CardHeader>
          <CardTitle>Página Descontinuada</CardTitle>
        </CardHeader>
        <CardContent>
          <div className='flex flex-col items-center justify-center h-64 text-center'>
            <FileText className='h-12 w-12 text-muted-foreground mb-4' />
            <p className='text-lg font-semibold'>
              A gestão de documentos agora é feita por cliente.
            </p>
            <p className='text-muted-foreground'>
              Por favor, acesse a página de um cliente para ver ou adicionar
              documentos.
            </p>
            <Link
              href='/dashboard/clients'
              className='mt-4 inline-flex items-center justify-center rounded-md bg-primary px-4 py-2 text-sm font-medium text-primary-foreground shadow transition-colors hover:bg-primary/90 focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-ring disabled:pointer-events-none disabled:opacity-50'
            >
              Ir para Clientes
            </Link>
          </div>
        </CardContent>
      </Card>
    </div>
  )
}
