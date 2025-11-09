'use client'

import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
  CardFooter,
} from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { FileHeart, Settings } from 'lucide-react'
import Link from 'next/link'

export default function ClinicalExamsPage() {
  return (
    <div className='grid flex-1 auto-rows-max gap-4'>
      <div className='flex items-center gap-4'>
        <h1 className='flex-1 shrink-0 whitespace-nowrap text-xl font-semibold tracking-tight sm:grow-0'>
          Gestão de Exames Clínicos
        </h1>
      </div>
      <Card>
        <CardHeader>
          <CardTitle>Configurações de Avaliações</CardTitle>
          <CardDescription>
            Gerencie os modelos, parâmetros e regras para as avaliações e
            exames clínicos realizados.
          </CardDescription>
        </CardHeader>
        <CardContent>
          <Card>
            <CardHeader>
              <CardTitle className='text-lg'>Avaliação Clínica</CardTitle>
              <CardDescription>
                Configure o formulário de anamnese, parâmetros de normalidade e
                regras de aplicação.
              </CardDescription>
            </CardHeader>
            <CardFooter>
              <Button asChild>
                <Link href='/dashboard/health/clinical-exams/settings'>
                  <Settings className='mr-2 h-4 w-4' /> Configurar
                </Link>
              </Button>
            </CardFooter>
          </Card>
        </CardContent>
      </Card>
    </div>
  )
}
