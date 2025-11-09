'use client'

import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import {
  Stethoscope,
  ChevronRight,
  List,
  FileHeart,
} from 'lucide-react'
import Link from 'next/link'

const healthServices = [
  {
    name: 'Fila de Atendimento',
    description: 'Gerencie o fluxo de pacientes e atendimentos em tempo real.',
    href: '/dashboard/health/queue',
    icon: List,
  },
  {
    name: 'Catálogo de Exames',
    description: 'Consulte e gerencie todos os exames clínicos e laboratoriais.',
    href: '/dashboard/health/exams',
    icon: Stethoscope,
  },
  {
    name: 'Portal de Laudos',
    description:
      'Acesse o assistente de IA e configure os modelos de laudos.',
    href: '/dashboard/health/reports-portal',
    icon: FileHeart,
  },
]

export default function HealthPage() {
  return (
    <div className='grid flex-1 auto-rows-max gap-4'>
      <div className='flex items-center gap-4'>
        <h1 className='flex-1 shrink-0 whitespace-nowrap text-xl font-semibold tracking-tight sm:grow-0'>
          Hub do Sistema de Saúde
        </h1>
      </div>
      <Card>
        <CardHeader>
          <CardTitle>Módulos de Saúde</CardTitle>
          <CardDescription>
            Navegue pelos principais módulos para gerenciar a operação de saúde
            ocupacional.
          </CardDescription>
        </CardHeader>
        <CardContent className='grid gap-4 sm:grid-cols-2 lg:grid-cols-3'>
          {healthServices.map((service) => (
            <Card key={service.name} className='hover:shadow-md'>
              <CardHeader className='flex-row items-center gap-4 pb-2'>
                <service.icon className='h-8 w-8 text-primary' />
                <CardTitle className='text-lg'>{service.name}</CardTitle>
              </CardHeader>
              <CardContent>
                <p className='text-sm text-muted-foreground'>
                  {service.description}
                </p>
              </CardContent>
              <CardContent>
                <Button asChild className='w-full'>
                  <Link href={service.href}>
                    Acessar <ChevronRight className='ml-2 h-4 w-4' />
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
