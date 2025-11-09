'use client'

import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Stethoscope, ChevronRight } from 'lucide-react'
import Link from 'next/link'

const laudableExams = [
  {
    name: 'Eletrocardiograma (ECG)',
    description: 'Análise do ritmo e atividade elétrica do coração.',
    href: '/dashboard/health/reports-portal/ecg',
    status: 'active',
  },
  {
    name: 'Eletroencefalograma (EEG)',
    description: 'Análise da atividade elétrica cerebral.',
    href: '#',
    status: 'inactive',
  },
  {
    name: 'Espirometria',
    description: 'Teste de função pulmonar.',
    href: '#',
    status: 'inactive',
  },
  {
    name: 'Raio-X',
    description: 'Laudos de exames de imagem radiográfica.',
    href: '#',
    status: 'inactive',
  },
]

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
          <CardTitle>Tipos de Exame Laudáveis</CardTitle>
          <CardDescription>
            Configure os modelos e parâmetros para cada tipo de exame que
            requer um laudo médico. A IA utilizará esses modelos para gerar
            laudos preliminares.
          </CardDescription>
        </CardHeader>
        <CardContent className='grid gap-4 sm:grid-cols-2 lg:grid-cols-3'>
          {laudableExams.map((exam) => (
            <Card
              key={exam.name}
              className={
                exam.status === 'inactive' ? 'bg-muted/50' : 'hover:shadow-md'
              }
            >
              <CardHeader>
                <CardTitle className='text-lg'>{exam.name}</CardTitle>
                <CardDescription>{exam.description}</CardDescription>
              </CardHeader>
              <CardContent>
                <Button
                  asChild
                  variant={exam.status === 'inactive' ? 'secondary' : 'default'}
                  disabled={exam.status === 'inactive'}
                  className='w-full'
                >
                  <Link href={exam.href}>
                    {exam.status === 'inactive' ? 'Em Breve' : 'Configurar'}
                    {exam.status === 'active' && (
                      <ChevronRight className='ml-2 h-4 w-4' />
                    )}
                  </Link>
                </Button>
              </CardContent>
            </Card>
          ))}
        </CardContent>
      </Card>
    </div>
  )
}