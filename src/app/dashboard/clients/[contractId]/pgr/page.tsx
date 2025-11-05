'use client'

import { useState } from 'react'
import { useParams, useRouter } from 'next/navigation'
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
  CardFooter,
} from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { PlusCircle, FileText, ArrowRight } from 'lucide-react'
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from '@/components/ui/dialog'
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select'
import { Label } from '@/components/ui/label'
import { initialUnitsData } from '../units/page'

interface Pgr {
  id: string
  unitId: string
  version: string
  status: 'Ativo' | 'Em Elaboração' | 'Vencido'
  validity: string
}

export default function PgrListPage() {
  const router = useRouter()
  const params = useParams()
  const contractId = params.contractId as string
  const [pgrs, setPgrs] = useState<Pgr[]>([
    {
      id: 'PGR-001',
      unitId: 'UNIT-001',
      version: '1.0',
      status: 'Ativo',
      validity: '2026-03-15',
    },
    {
      id: 'PGR-002',
      unitId: 'UNIT-002',
      version: '1.0',
      status: 'Ativo',
      validity: '2026-03-15',
    },
  ])
  const [isDialogOpen, setIsDialogOpen] = useState(false)
  const [selectedUnit, setSelectedUnit] = useState<string>('')

  const handleGeneratePgr = () => {
    if (!selectedUnit) return

    const newPgr: Pgr = {
      id: `PGR-${Math.random().toString(36).substring(2, 5).toUpperCase()}`,
      unitId: selectedUnit,
      version: '1.0',
      status: 'Em Elaboração',
      validity: new Date(
        new Date().setFullYear(new Date().getFullYear() + 2)
      )
        .toISOString()
        .split('T')[0],
    }

    setPgrs((prev) => [...prev, newPgr])
    setIsDialogOpen(false)
    setSelectedUnit('')
    // Navigate to the inventory of the newly created PGR
    router.push(`/dashboard/clients/${contractId}/pgr/${newPgr.id}/inventory`)
  }

  const unitsWithPgr = pgrs.map((pgr) => pgr.unitId)
  const unitsWithoutPgr = initialUnitsData.filter(
    (unit) => !unitsWithPgr.includes(unit.id)
  )

  if (pgrs.length === 0) {
    return (
      <div className='flex flex-1 items-center justify-center rounded-lg border border-dashed shadow-sm h-96'>
        <div className='flex flex-col items-center gap-1 text-center'>
          <h3 className='text-2xl font-bold tracking-tight'>
            Nenhum PGR Gerado
          </h3>
          <p className='text-sm text-muted-foreground'>
            Comece gerando o primeiro PGR para uma das unidades do cliente.
          </p>
          <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
            <DialogTrigger asChild>
              <Button className='mt-4'>Gerar Novo PGR</Button>
            </DialogTrigger>
            <DialogContent>
              <DialogHeader>
                <DialogTitle>Gerar Novo PGR</DialogTitle>
                <DialogDescription>
                  Selecione a unidade para a qual o novo PGR será gerado.
                </DialogDescription>
              </DialogHeader>
              <div className='grid gap-4 py-4'>
                <div className='space-y-2'>
                  <Label htmlFor='unit-select'>Unidade</Label>
                  <Select value={selectedUnit} onValueChange={setSelectedUnit}>
                    <SelectTrigger id='unit-select'>
                      <SelectValue placeholder='Selecione uma unidade...' />
                    </SelectTrigger>
                    <SelectContent>
                      {unitsWithoutPgr.map((unit) => (
                        <SelectItem key={unit.id} value={unit.id}>
                          {unit.name}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>
              </div>
              <DialogFooter>
                <Button variant='outline' onClick={() => setIsDialogOpen(false)}>
                  Cancelar
                </Button>
                <Button onClick={handleGeneratePgr} disabled={!selectedUnit}>
                  Gerar e Iniciar
                </Button>
              </DialogFooter>
            </DialogContent>
          </Dialog>
        </div>
      </div>
    )
  }

  return (
    <div className='grid flex-1 auto-rows-max gap-4'>
      <div className='flex items-center justify-between'>
        <h1 className='text-xl font-semibold tracking-tight'>
          Programas de Gerenciamento de Risco (PGR)
        </h1>
        <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
          <DialogTrigger asChild>
            <Button>
              <PlusCircle className='mr-2 h-4 w-4' />
              Gerar Novo PGR
            </Button>
          </DialogTrigger>
          <DialogContent>
            <DialogHeader>
              <DialogTitle>Gerar Novo PGR</DialogTitle>
              <DialogDescription>
                Selecione a unidade para a qual o novo PGR será gerado.
              </DialogDescription>
            </DialogHeader>
            <div className='grid gap-4 py-4'>
              <div className='space-y-2'>
                <Label htmlFor='unit-select'>Unidade</Label>
                <Select value={selectedUnit} onValueChange={setSelectedUnit}>
                  <SelectTrigger id='unit-select'>
                    <SelectValue placeholder='Selecione uma unidade...' />
                  </SelectTrigger>
                  <SelectContent>
                    {unitsWithoutPgr.map((unit) => (
                      <SelectItem key={unit.id} value={unit.id}>
                        {unit.name}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
            </div>
            <DialogFooter>
              <Button variant='outline' onClick={() => setIsDialogOpen(false)}>
                Cancelar
              </Button>
              <Button onClick={handleGeneratePgr} disabled={!selectedUnit}>
                Gerar e Iniciar
              </Button>
            </DialogFooter>
          </DialogContent>
        </Dialog>
      </div>

      <div className='grid gap-6 md:grid-cols-2 lg:grid-cols-3'>
        {pgrs.map((pgr) => {
          const unit = initialUnitsData.find((u) => u.id === pgr.unitId)
          return (
            <Card key={pgr.id} className='flex flex-col'>
              <CardHeader>
                <div className='flex items-center justify-between'>
                  <FileText className='h-8 w-8 text-muted-foreground' />
                </div>
                <CardTitle className='pt-4'>{unit?.name}</CardTitle>
                <CardDescription>
                  Versão: {pgr.version} | Validade: {pgr.validity}
                </CardDescription>
              </CardHeader>
              <CardContent className='flex-grow'></CardContent>
              <CardFooter>
                <Button
                  asChild
                  className='w-full'
                  onClick={() =>
                    router.push(
                      `/dashboard/clients/${contractId}/pgr/${pgr.id}/inventory`
                    )
                  }
                >
                  <a href='#'>
                    Gerenciar PGR <ArrowRight className='ml-2 h-4 w-4' />
                  </a>
                </Button>
              </CardFooter>
            </Card>
          )
        })}
      </div>
    </div>
  )
}
