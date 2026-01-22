
'use client'

import React, { useState, useMemo } from 'react'
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from '@/components/ui/card'
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table'
import { Badge } from '@/components/ui/badge'
import { Button } from '@/components/ui/button'
import { MoreHorizontal, PlusCircle, Lock, Loader2 } from 'lucide-react'
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu'
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs'
import { cn } from '@/lib/utils'
import { getHazardById } from '@/lib/risk-utils'
import Link from 'next/link'
import { useParams } from 'next/navigation'
import {
  useFirestore,
  useCollection,
  useMemoFirebase,
} from '@/firebase'
import { collection } from 'firebase/firestore'
import type { Hazard, PgrInventoryItem } from '@/lib/types/risk'
import type { Unit } from '@/lib/types/unit'
import type { Role } from '@/lib/types/role'
import type { GHE } from '@/lib/types/ghe'
import type { Employee } from '@/lib/types/employee'
import { AddPgrRiskDialog } from '@/components/add-pgr-risk-dialog'


export default function PgrPage() {
  const params = useParams()
  const contractId = params.contractId as string
  const firestore = useFirestore()

  const inventoryRef = useMemoFirebase(
    () =>
      firestore
        ? collection(firestore, `clients/${contractId}/pgr_inventory`)
        : null,
    [firestore, contractId]
  )
  const { data: inventory, isLoading: isLoadingInventory } =
    useCollection<PgrInventoryItem>(inventoryRef)

  const hazardsRef = useMemoFirebase(
    () => (firestore ? collection(firestore, 'hazards') : null),
    [firestore]
  )
  const { data: hazardData, isLoading: isLoadingHazards } =
    useCollection<Hazard>(hazardsRef)

  // Data for forms
  const unitsRef = useMemoFirebase(
    () =>
      firestore ? collection(firestore, `clients/${contractId}/units`) : null,
    [firestore, contractId]
  )
  const { data: unitsData, isLoading: areUnitsLoading } =
    useCollection<Unit>(unitsRef)

  const rolesRef = useMemoFirebase(
    () =>
      firestore ? collection(firestore, `clients/${contractId}/roles`) : null,
    [firestore, contractId]
  )
  const { data: rolesData, isLoading: areRolesLoading } =
    useCollection<Role>(rolesRef)

  const ghesRef = useMemoFirebase(
    () =>
      firestore ? collection(firestore, `clients/${contractId}/ghes`) : null,
    [firestore, contractId]
  )
  const { data: ghesData, isLoading: areGhesLoading } = useCollection<GHE>(
    ghesRef
  )

  const employeesRef = useMemoFirebase(
    () =>
      firestore
        ? collection(firestore, `clients/${contractId}/staffs`)
        : null,
    [firestore, contractId]
  )
  const { data: employeesData, isLoading: areEmployeesLoading } =
    useCollection<Employee>(employeesRef)

  const [isAddRiskDialogOpen, setIsAddRiskDialogOpen] = useState(false)

  const isLoading =
    isLoadingInventory ||
    isLoadingHazards ||
    areUnitsLoading ||
    areRolesLoading ||
    areGhesLoading ||
    areEmployeesLoading

  return (
    <div className='grid flex-1 auto-rows-max gap-4'>
      <div className='flex items-center gap-4'>
        <h1 className='flex-1 shrink-0 whitespace-nowrap text-xl font-semibold tracking-tight sm:grow-0'>
          Programa de Gerenciamento de Riscos (PGR)
        </h1>
      </div>
      <Tabs defaultValue='inventory'>
        <div className='flex items-center'>
          <TabsList>
            <TabsTrigger value='inventory'>Inventário de Riscos</TabsTrigger>
            <TabsTrigger value='plan'>Plano de Ação</TabsTrigger>
          </TabsList>
          <div className='ml-auto flex items-center gap-2'>
            <Button asChild variant='outline'>
              <Link href={`/dashboard/clients/${contractId}/pgr/history`}>
                <Lock className='mr-2 h-4 w-4' />
                Gestão de PGR
              </Link>
            </Button>

            <Button onClick={() => setIsAddRiskDialogOpen(true)}>
              <PlusCircle className='mr-2 h-4 w-4' />
              Adicionar Risco ao Inventário
            </Button>
          </div>
        </div>
        <TabsContent value='inventory'>
          <Card>
            <CardHeader>
              <CardTitle>Inventário de Riscos Ocupacionais</CardTitle>
              <CardDescription>
                Listagem de todos os perigos e riscos identificados na empresa.
                Avalie cada risco para determinar sua prioridade.
              </CardDescription>
            </CardHeader>
            <CardContent>
              {isLoading ? (
                <div className='flex justify-center items-center h-64'>
                  <Loader2 className='h-8 w-8 animate-spin' />
                </div>
              ) : (
                <Table>
                  <TableHeader>
                    <TableRow>
                      <TableHead>Perigo / Fator de Risco</TableHead>
                      <TableHead>Setor</TableHead>
                      <TableHead>Nível de Risco</TableHead>
                      <TableHead>Status</TableHead>
                      <TableHead>
                        <span className='sr-only'>Ações</span>
                      </TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {inventory?.map((item) => {
                      const hazard = getHazardById(item.hazardId, hazardData)
                      if (!hazard) return null
                      return (
                        <TableRow key={item.id}>
                          <TableCell className='font-medium'>
                            <div className='font-medium'>{hazard.name}</div>
                            <div className='text-sm text-muted-foreground'>
                              {item.source}
                            </div>
                          </TableCell>
                          <TableCell>{item.sector}</TableCell>
                          <TableCell>
                            {item.evaluation ? (
                              <div className='flex items-center gap-2'>
                                <span
                                  className={cn(
                                    'h-3 w-3 rounded-full',
                                    item.evaluation.riskColor
                                  )}
                                />
                                <span>{item.evaluation.riskLabel}</span>
                              </div>
                            ) : (
                              <span className='text-muted-foreground'>
                                Não avaliado
                              </span>
                            )}
                          </TableCell>
                          <TableCell>
                            <Badge
                              variant={
                                item.evaluation ? 'secondary' : 'outline'
                              }
                            >
                              {item.evaluation ? 'Avaliado' : 'Pendente'}
                            </Badge>
                          </TableCell>
                          <TableCell>
                            <DropdownMenu>
                              <DropdownMenuTrigger asChild>
                                <Button
                                  aria-haspopup='true'
                                  size='icon'
                                  variant='ghost'
                                >
                                  <MoreHorizontal className='h-4 w-4' />
                                </Button>
                              </DropdownMenuTrigger>
                              <DropdownMenuContent align='end'>
                                <DropdownMenuLabel>Ações</DropdownMenuLabel>
                                <DropdownMenuItem>Editar Risco</DropdownMenuItem>
                                <DropdownMenuSeparator />
                                <DropdownMenuItem disabled={!item.evaluation}>
                                  Criar Plano de Ação
                                </DropdownMenuItem>
                                <DropdownMenuItem className='text-destructive'>
                                  Excluir
                                </DropdownMenuItem>
                              </DropdownMenuContent>
                            </DropdownMenu>
                          </TableCell>
                        </TableRow>
                      )
                    })}
                  </TableBody>
                </Table>
              )}
            </CardContent>
          </Card>
        </TabsContent>
        <TabsContent value='plan'>
          <Card>
            <CardHeader>
              <CardTitle>Plano de Ação</CardTitle>
              <CardDescription>
                Ações de melhoria para mitigar ou eliminar os riscos
                identificados.
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className='flex flex-1 items-center justify-center rounded-lg border border-dashed shadow-sm h-96'>
                <div className='flex flex-col items-center gap-1 text-center'>
                  <h3 className='text-2xl font-bold tracking-tight'>
                    Nenhuma ação planejada
                  </h3>
                  <p className='text-sm text-muted-foreground'>
                    Avalie um risco no inventário para criar uma ação.
                  </p>
                </div>
              </div>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
      <AddPgrRiskDialog
        open={isAddRiskDialogOpen}
        onOpenChange={setIsAddRiskDialogOpen}
        contractId={contractId}
        hazardData={hazardData}
        unitsData={unitsData}
        rolesData={rolesData}
        ghesData={ghesData}
        employeesData={employeesData}
      />
    </div>
  )
}
