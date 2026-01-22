'use client'

import { useState, useMemo } from 'react'
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
import {
  MoreHorizontal,
  PlusCircle,
  Search,
  Filter,
  ArrowRight,
} from 'lucide-react'
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuTrigger,
  DropdownMenuCheckboxItem,
  DropdownMenuSeparator,
} from '@/components/ui/dropdown-menu'
import { Input } from '@/components/ui/input'
import { Badge } from '@/components/ui/badge'
import Link from 'next/link'
import { useToast } from '@/hooks/use-toast'
import {
  useFirestore,
  useCollection,
  useMemoFirebase,
  updateDocumentNonBlocking,
  useDoc,
} from '@/firebase'
import { collection, doc } from 'firebase/firestore'
import { Loader2 } from 'lucide-react'
import type { Client } from '@/lib/types/client'
import { AddUnitDialog } from '@/components/add-unit-dialog'
import type { Unit } from '@/lib/types/unit'

export default function UnitsPage() {
  const params = useParams()
  const router = useRouter()
  const { toast } = useToast()
  const contractId = params.contractId as string
  const firestore = useFirestore()

  const clientRef = useMemoFirebase(
    () => (firestore ? doc(firestore, 'clients', contractId) : null),
    [firestore, contractId]
  )
  const unitsRef = useMemoFirebase(
    () =>
      firestore
        ? collection(firestore, 'clients', contractId, 'units')
        : null,
    [firestore, contractId]
  )
  const { data: client, isLoading: isClientLoading } = useDoc<Client>(clientRef)
  const { data: units, isLoading: areUnitsLoading } =
    useCollection<Unit>(unitsRef)

  const [isAddDialogOpen, setIsAddDialogOpen] = useState(false)
  const [searchTerm, setSearchTerm] = useState('')
  const [statusFilter, setStatusFilter] = useState<string[]>(['Ativa'])
  const [editingUnit, setEditingUnit] = useState<Unit | null>(null)

  const handleArchiveUnit = (unit: Unit) => {
    if (!firestore || !unit.id) return
    const unitDocRef = doc(firestore, `clients/${contractId}/units`, unit.id)
    updateDocumentNonBlocking(unitDocRef, { status: 'Inativa' })
    toast({
      title: 'Unidade Inativada',
      description: 'A unidade foi marcada como Inativa.',
      variant: 'destructive',
    })
  }

  const openAddDialog = () => {
    setEditingUnit(null)
    setIsAddDialogOpen(true)
  }

  const openEditDialog = (unit: Unit) => {
    setEditingUnit(unit)
    setIsAddDialogOpen(true)
  }

  const filteredUnits = useMemo(() => {
    if (!units) return []
    return units.filter((unit) => {
      const matchesSearch = unit.name
        .toLowerCase()
        .includes(searchTerm.toLowerCase())
      const matchesStatus =
        statusFilter.length === 0 || statusFilter.includes(unit.status)
      return matchesSearch && matchesStatus
    })
  }, [units, searchTerm, statusFilter])

  const isLoading = isClientLoading || areUnitsLoading

  return (
    <>
      <Card>
        <CardHeader>
          <CardTitle className='flex items-center justify-between'>
            Mapa de Unidades
            <Button size='sm' className='h-8 gap-1' onClick={openAddDialog}>
              <PlusCircle className='h-3.5 w-3.5' />
              <span className='sr-only sm:not-sr-only sm:whitespace-nowrap'>
                Adicionar
              </span>
            </Button>
          </CardTitle>
          <CardDescription>
            Visualize e gerencie as unidades, obras e contratos ativos do
            cliente.
          </CardDescription>
          <div className='flex items-center gap-2 pt-4'>
            <div className='relative w-full max-w-sm'>
              <Search className='absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground' />
              <Input
                type='search'
                placeholder='Buscar por nome ou CNPJ...'
                className='pl-8'
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
              />
            </div>
            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <Button
                  variant='outline'
                  size='sm'
                  className='h-10 gap-1 text-sm'
                >
                  <Filter className='h-3.5 w-3.5' />
                  <span className='sr-only sm:not-sr-only'>Filtrar</span>
                </Button>
              </DropdownMenuTrigger>
              <DropdownMenuContent align='end'>
                <DropdownMenuLabel>Filtrar por Status</DropdownMenuLabel>
                <DropdownMenuSeparator />
                {['Ativa', 'Inativa'].map((status) => (
                  <DropdownMenuCheckboxItem
                    key={status}
                    checked={statusFilter.includes(status)}
                    onCheckedChange={(checked) => {
                      setStatusFilter((prev) =>
                        checked
                          ? [...prev, status]
                          : prev.filter((s) => s !== status)
                      )
                    }}
                  >
                    {status}
                  </DropdownMenuCheckboxItem>
                ))}
              </DropdownMenuContent>
            </DropdownMenu>
          </div>
        </CardHeader>
        <CardContent>
          {isLoading ? (
            <div className='flex items-center justify-center h-64'>
              <Loader2 className='h-8 w-8 animate-spin' />
            </div>
          ) : filteredUnits.length > 0 ? (
            <div className='grid gap-6 md:grid-cols-2 lg:grid-cols-3'>
              {filteredUnits.map((unit) => (
                <Card
                  key={unit.id}
                  className='flex flex-col h-full hover:shadow-md transition-shadow cursor-pointer'
                  onClick={() =>
                    router.push(
                      `/dashboard/clients/${contractId}/units/${unit.id}`
                    )
                  }
                >
                  <CardHeader>
                    <div className='flex justify-between items-start'>
                      <CardTitle className='text-lg'>{unit.name}</CardTitle>
                      <div className='flex items-center gap-2'>
                        <Badge variant='outline'>{unit.type}</Badge>
                        <DropdownMenu>
                          <DropdownMenuTrigger asChild>
                            <Button
                              variant='ghost'
                              size='icon'
                              className='h-8 w-8'
                              onClick={(e) => e.stopPropagation()}
                            >
                              <MoreHorizontal className='h-4 w-4' />
                            </Button>
                          </DropdownMenuTrigger>
                          <DropdownMenuContent
                            align='end'
                            onClick={(e) => e.stopPropagation()}
                          >
                            <DropdownMenuLabel>Ações</DropdownMenuLabel>
                            <DropdownMenuItem
                              onClick={() => openEditDialog(unit)}
                            >
                              Editar
                            </DropdownMenuItem>
                            <DropdownMenuItem
                              onClick={() => handleArchiveUnit(unit)}
                            >
                              Inativar
                            </DropdownMenuItem>
                          </DropdownMenuContent>
                        </DropdownMenu>
                      </div>
                    </div>
                    <CardDescription>
                      {unit.propertyInfo.address}
                    </CardDescription>
                  </CardHeader>
                  <CardContent className='flex-grow'>
                    <p className='text-sm text-muted-foreground line-clamp-2'>
                      {unit.description}
                    </p>
                  </CardContent>
                  <CardFooter>
                    <Button
                      asChild
                      variant='outline'
                      className='w-full'
                      onClick={(e) => e.stopPropagation()}
                    >
                      <Link
                        href={`/dashboard/clients/${contractId}/sectors?unitId=${unit.id}`}
                      >
                        Setores <ArrowRight className='ml-2 h-4 w-4' />
                      </Link>
                    </Button>
                  </CardFooter>
                </Card>
              ))}
            </div>
          ) : (
            <div className='flex flex-1 items-center justify-center rounded-lg border border-dashed shadow-sm h-96'>
              <div className='flex flex-col items-center gap-1 text-center'>
                <h3 className='text-2xl font-bold tracking-tight'>
                  Nenhuma unidade encontrada
                </h3>
                <p className='text-sm text-muted-foreground'>
                  Cadastre a primeira unidade para este cliente.
                </p>
                <Button className='mt-4' onClick={openAddDialog}>
                  Adicionar Unidade
                </Button>
              </div>
            </div>
          )}
        </CardContent>
      </Card>
      {client && (
        <AddUnitDialog
          open={isAddDialogOpen}
          onOpenChange={setIsAddDialogOpen}
          client={client}
          contractId={contractId}
          unitToEdit={editingUnit}
        />
      )}
    </>
  )
}
