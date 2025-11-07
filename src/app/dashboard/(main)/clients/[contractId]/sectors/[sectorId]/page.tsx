'use client'

import { useParams } from 'next/navigation'
import { initialSectorsData, type Sector } from '../data'
import { initialUnitsData } from '../../units/data'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { ArrowLeft } from 'lucide-react'
import Link from 'next/link'

const getSectorById = (sectorId: string): Sector | undefined => {
  return initialSectorsData.find((sector) => sector.id === sectorId)
}

const getUnitById = (unitId: string) => {
    return initialUnitsData.find((unit) => unit.id === unitId)
}

export default function SectorDetailsPage() {
  const params = useParams()
  const contractId = params.contractId as string
  const sectorId = params.sectorId as string
  const sector = getSectorById(sectorId)
  const unit = sector ? getUnitById(sector.unitId) : undefined

  if (!sector) {
    return (
      <div className='flex flex-col items-center justify-center h-full text-center'>
        <h2 className='text-2xl font-bold'>Setor não encontrado</h2>
        <p className='text-muted-foreground'>
          O setor que você está procurando não existe.
        </p>
        <Button asChild className='mt-4'>
          <Link href={`/dashboard/clients/${contractId}/sectors`}>
            <ArrowLeft className='mr-2 h-4 w-4' />
            Voltar para Setores
          </Link>
        </Button>
      </div>
    )
  }

  return (
    <div className='grid flex-1 auto-rows-max gap-4'>
       <div className='flex items-center gap-4'>
        <Button variant='outline' size='icon' className='h-7 w-7' asChild>
          <Link href={`/dashboard/clients/${contractId}/sectors?unitId=${sector.unitId}`}>
            <ArrowLeft className='h-4 w-4' />
            <span className='sr-only'>Voltar</span>
          </Link>
        </Button>
        <h1 className='flex-1 shrink-0 whitespace-nowrap text-xl font-semibold tracking-tight sm:grow-0'>
          {sector.name}
        </h1>
      </div>
      <Card>
        <CardHeader>
          <CardTitle>Detalhes do Setor</CardTitle>
          <CardDescription>
            {sector.description}
          </CardDescription>
        </CardHeader>
        <CardContent>
           <p className='text-sm text-muted-foreground'>
             Unidade: <span className='font-semibold text-foreground'>{unit?.name || 'N/A'}</span>
            </p>
        </CardContent>
      </Card>
    </div>
  )
}
