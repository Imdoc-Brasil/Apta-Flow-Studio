
'use client'

import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { FileText, Download } from 'lucide-react'
import Link from 'next/link'
import { useParams } from 'next/navigation'

const sstDocuments = [
  {
    name: 'PGR (Programa de Gerenciamento de Riscos)',
    description: 'Documento base que identifica e avalia os riscos ocupacionais.',
    link: '/dashboard/clients/[contractId]/pgr',
  },
  {
    name: 'PCMSO (Programa de Controle Médico de Saúde Ocupacional)',
    description: 'Relatório anual com o planejamento das ações de saúde.',
    link: '/dashboard/clients/[contractId]/pcmso',
  },
  {
    name: 'Relatório Analítico do PCMSO',
    description: 'Análise estatística dos resultados dos exames realizados.',
    link: '#',
  },
  {
    name: 'LTCAT (Laudo Técnico das Condições Ambientais do Trabalho)',
    description: 'Laudo conclusivo sobre a exposição a agentes nocivos para fins de aposentadoria especial.',
    link: '#',
  },
  {
    name: 'AET (Análise Ergonômica do Trabalho)',
    description: 'Análise detalhada das condições ergonômicas dos postos de trabalho.',
    link: '#',
  },
  {
    name: 'Laudo de Insalubridade e Periculosidade',
    description: 'Laudos que determinam o direito aos respectivos adicionais.',
    link: '#',
  },
]

export default function SstDocsPage() {
  const params = useParams()
  const contractId = params.contractId as string;

  return (
    <div className='grid flex-1 auto-rows-max gap-4'>
      <div className='flex items-center gap-4'>
        <h1 className='flex-1 shrink-0 whitespace-nowrap text-xl font-semibold tracking-tight sm:grow-0'>
          Documentos de SST
        </h1>
      </div>
      <Card>
        <CardHeader>
          <CardTitle>Repositório de Documentos</CardTitle>
          <CardDescription>
            Acesse e baixe todos os programas, laudos e relatórios de Saúde e Segurança do Trabalho gerados para este cliente.
          </CardDescription>
        </CardHeader>
        <CardContent className='grid gap-4 sm:grid-cols-2 lg:grid-cols-3'>
          {sstDocuments.map((doc) => (
            <Card key={doc.name} className='flex flex-col'>
              <CardHeader>
                <CardTitle className='flex items-start gap-3 text-lg'>
                  <FileText className='h-6 w-6 mt-1 text-primary' />
                  <span>{doc.name}</span>
                </CardTitle>
              </CardHeader>
              <CardContent className='flex-grow'>
                <p className='text-sm text-muted-foreground'>
                  {doc.description}
                </p>
              </CardContent>
              <CardFooter>
                <Button asChild className='w-full' disabled={doc.link === '#'}>
                  <Link href={doc.link.replace('[contractId]', contractId)}>
                    <Download className='mr-2 h-4 w-4' />
                    {doc.link === '#' ? 'Gerar Documento' : 'Acessar e Gerar'}
                  </Link>
                </Button>
              </CardFooter>
            </Card>
          ))}
        </CardContent>
      </Card>
    </div>
  )
}
