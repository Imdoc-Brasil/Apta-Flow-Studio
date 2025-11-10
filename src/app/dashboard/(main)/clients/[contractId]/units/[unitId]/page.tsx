'use client'

import { useParams } from 'next/navigation'
import { initialUnitsData, type Unit } from '../data'
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { ArrowLeft, ChevronDown, Pencil } from 'lucide-react'
import Link from 'next/link'
import { Badge } from '@/components/ui/badge'
import { Separator } from '@/components/ui/separator'
import { initialSectorsData } from '../../sectors/data'
import { initialRolesData } from '../../roles/data'
import { initialEmployeesData } from '../../employees/data'
import { cn } from '@/lib/utils'
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu'
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from '@/components/ui/dialog'
import { Label } from '@/components/ui/label'
import { Input } from '@/components/ui/input'
import { Textarea } from '@/components/ui/textarea'
import { useState, useMemo } from 'react'
import { ScrollArea } from '@/components/ui/scroll-area'
import { useToast } from '@/hooks/use-toast'

const getUnitById = (unitId: string): Unit | undefined => {
  return initialUnitsData.find((unit) => unit.id === unitId)
}

export default function UnitDetailsPage() {
  const params = useParams()
  const { toast } = useToast()
  const contractId = params.contractId as string
  const unitId = params.unitId as string
  const [currentUnit, setCurrentUnit] = useState(() => getUnitById(unitId))

  const [isEditDialogOpen, setIsEditDialogOpen] = useState(false)

  const { totalSectors, totalRoles, totalEmployees } = useMemo(() => {
    const sectorsInUnit = initialSectorsData.filter((s) => s.unitId === unitId)
    const sectorIdsInUnit = sectorsInUnit.map((s) => s.id)

    const rolesInUnit = initialRolesData.filter((r) =>
      sectorIdsInUnit.includes(r.sectorId)
    )
    const roleIdsInUnit = rolesInUnit.map((r) => r.id)

    const employeesInUnit = initialEmployeesData.filter(
      (e) => e.status === 'Ativo' && roleIdsInUnit.includes(e.roleId)
    )

    return {
      totalSectors: sectorsInUnit.length,
      totalRoles: rolesInUnit.length,
      totalEmployees: employeesInUnit.length,
    }
  }, [unitId])

  const expiredAsos = 0 // Placeholder
  const pcdEmployees = 0 // Placeholder
  const expiredTrainings = 0 // Placeholder
  const expiredVaccines = 0 // Placeholder

  const handleEditUnit = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault()
    // Here you would typically handle form submission to your backend
    // For now, we'll just show a success toast and close the dialog
    toast({
      title: 'Sucesso!',
      description: 'As informações da unidade foram atualizadas.',
    })
    setIsEditDialogOpen(false)
  }

  if (!currentUnit) {
    return (
      <div className='flex flex-col items-center justify-center h-full text-center'>
        <h2 className='text-2xl font-bold'>Unidade não encontrada</h2>
        <p className='text-muted-foreground'>
          A unidade que você está procurando não existe.
        </p>
        <Button asChild className='mt-4'>
          <Link href={`/dashboard/clients/${contractId}/units`}>
            <ArrowLeft className='mr-2 h-4 w-4' />
            Voltar para Unidades
          </Link>
        </Button>
      </div>
    )
  }

  const renderEditForm = (unitToEdit: Unit) => (
    <ScrollArea className='h-[70vh] pr-6'>
      <div className='grid gap-4 py-4'>
        <fieldset className='grid gap-4 rounded-lg border p-4'>
          <legend className='-ml-1 px-1 text-sm font-medium'>
            Informações Gerais
          </legend>
          <div className='space-y-2'>
            <Label htmlFor='name'>Nome da Unidade</Label>
            <Input id='name' name='name' defaultValue={unitToEdit.name} />
          </div>
          <div className='space-y-2'>
            <Label htmlFor='description'>Descrição</Label>
            <Textarea
              id='description'
              name='description'
              defaultValue={unitToEdit.description}
            />
          </div>
          <div className='grid grid-cols-1 md:grid-cols-2 gap-4'>
            <div className='space-y-2'>
              <Label htmlFor='cnpj'>CNPJ</Label>
              <Input id='cnpj' name='cnpj' defaultValue={unitToEdit.cnpj} />
            </div>
            <div className='space-y-2'>
              <Label htmlFor='cnae'>CNAE</Label>
              <Input id='cnae' name='cnae' defaultValue={unitToEdit.cnae} />
            </div>
            <div className='space-y-2'>
              <Label htmlFor='riskLevel'>Grau de Risco</Label>
              <Input
                id='riskLevel'
                name='riskLevel'
                defaultValue={unitToEdit.riskLevel}
              />
            </div>
          </div>
        </fieldset>

        <fieldset className='grid gap-4 rounded-lg border p-4'>
          <legend className='-ml-1 px-1 text-sm font-medium'>
            Informações do Imóvel
          </legend>
          <div className='space-y-2'>
            <Label htmlFor='edit-address'>Endereço Completo</Label>
            <Input
              id='edit-address'
              name='address'
              defaultValue={unitToEdit.propertyInfo.address}
            />
          </div>
          <div className='grid grid-cols-1 md:grid-cols-2 gap-4'>
            <div className='space-y-2'>
              <Label htmlFor='edit-zipCode'>CEP</Label>
              <Input
                id='edit-zipCode'
                name='zipCode'
                defaultValue={unitToEdit.propertyInfo.zipCode}
              />
            </div>
            <div className='space-y-2'>
              <Label htmlFor='edit-neighborhood'>Bairro</Label>
              <Input
                id='edit-neighborhood'
                name='neighborhood'
                defaultValue={unitToEdit.propertyInfo.neighborhood}
              />
            </div>
            <div className='space-y-2'>
              <Label htmlFor='edit-city'>Cidade</Label>
              <Input
                id='edit-city'
                name='city'
                defaultValue={unitToEdit.propertyInfo.city}
              />
            </div>
            <div className='space-y-2'>
              <Label htmlFor='edit-state'>Estado</Label>
              <Input
                id='edit-state'
                name='state'
                defaultValue={unitToEdit.propertyInfo.state}
              />
            </div>
          </div>
        </fieldset>

        <fieldset className='grid gap-4 rounded-lg border p-4'>
          <legend className='-ml-1 px-1 text-sm font-medium'>
            Responsáveis Técnicos
          </legend>
          <div className='grid grid-cols-1 md:grid-cols-2 gap-4'>
            <div className='space-y-2'>
              <Label htmlFor='legalResponsible'>Responsável Legal</Label>
              <Input
                id='legalResponsible'
                name='legalResponsible'
                defaultValue={unitToEdit.legalResponsible}
              />
            </div>
            <div className='space-y-2'>
              <Label htmlFor='pgrResponsible'>Responsável pelo PGR</Label>
              <Input
                id='pgrResponsible'
                name='pgrResponsible'
                defaultValue={unitToEdit.pgrResponsible}
              />
            </div>
            <div className='space-y-2'>
              <Label htmlFor='ltcatResponsible'>Responsável pelo LTCAT</Label>
              <Input
                id='ltcatResponsible'
                name='ltcatResponsible'
                defaultValue={unitToEdit.ltcatResponsible}
              />
            </div>
            <div className='space-y-2'>
              <Label htmlFor='pcmsoResponsible'>Responsável pelo PCMSO</Label>
              <Input
                id='pcmsoResponsible'
                name='pcmsoResponsible'
                defaultValue={unitToEdit.pcmsoResponsible}
              />
            </div>
          </div>
        </fieldset>
      </div>
    </ScrollArea>
  )

  return (
    <>
      <div className='grid flex-1 auto-rows-max gap-4'>
        <div className='flex items-center gap-4'>
          <Button variant='outline' size='icon' className='h-7 w-7' asChild>
            <Link href={`/dashboard/clients/${contractId}/units`}>
              <ArrowLeft className='h-4 w-4' />
              <span className='sr-only'>Voltar</span>
            </Link>
          </Button>
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button variant='ghost' className='gap-1 text-xl font-semibold'>
                {currentUnit.name}
                <ChevronDown className='h-4 w-4' />
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent align='start'>
              {initialUnitsData.map((navUnit) => (
                <Link
                  key={navUnit.id}
                  href={`/dashboard/clients/${contractId}/units/${navUnit.id}`}
                  onClick={() => setCurrentUnit(getUnitById(navUnit.id))}
                >
                  <DropdownMenuItem
                    disabled={navUnit.id === unitId}
                    className='cursor-pointer'
                  >
                    {navUnit.name}
                  </DropdownMenuItem>
                </Link>
              ))}
            </DropdownMenuContent>
          </DropdownMenu>

          <Badge variant='outline' className='ml-auto sm:ml-0'>
            {currentUnit.type}
          </Badge>
          <div className='hidden items-center gap-2 md:ml-auto md:flex'>
            <Button
              variant='outline'
              size='sm'
              onClick={() => setIsEditDialogOpen(true)}
            >
              <Pencil className='mr-2 h-4 w-4' />
              Editar Unidade
            </Button>
          </div>
        </div>
        <div className='grid gap-4 md:grid-cols-[1fr_250px] lg:grid-cols-3 lg:gap-8'>
          <div className='grid auto-rows-max items-start gap-4 lg:col-span-2 lg:gap-8'>
            <Card>
              <CardHeader>
                <CardTitle>Detalhes da Unidade</CardTitle>
                <CardDescription>{currentUnit.description}</CardDescription>
              </CardHeader>
              <CardContent className='grid gap-4 sm:grid-cols-2 md:grid-cols-3'>
                <div className='space-y-1'>
                  <p className='text-sm font-medium text-muted-foreground'>
                    CNPJ
                  </p>
                  <p>{currentUnit.cnpj}</p>
                </div>
                <div className='space-y-1'>
                  <p className='text-sm font-medium text-muted-foreground'>
                    CNAE
                  </p>
                  <p>{currentUnit.cnae}</p>
                </div>
                <div className='space-y-1'>
                  <p className='text-sm font-medium text-muted-foreground'>
                    Grau de Risco
                  </p>
                  <p>{currentUnit.riskLevel}</p>
                </div>
                {currentUnit.cno && (
                  <div className='space-y-1'>
                    <p className='text-sm font-medium text-muted-foreground'>
                      CNO
                    </p>
                    <p>{currentUnit.cno}</p>
                  </div>
                )}
              </CardContent>
            </Card>

            {currentUnit.contractingCompany && (
              <Card>
                <CardHeader>
                  <CardTitle>Empresa Contratante</CardTitle>
                </CardHeader>
                <CardContent className='grid gap-4 sm:grid-cols-2 md:grid-cols-2'>
                  <div className='space-y-1'>
                    <p className='text-sm font-medium text-muted-foreground'>
                      Razão Social
                    </p>
                    <p>{currentUnit.contractingCompany.name}</p>
                  </div>
                  <div className='space-y-1'>
                    <p className='text-sm font-medium text-muted-foreground'>
                      CNPJ
                    </p>
                    <p>{currentUnit.contractingCompany.cnpj}</p>
                  </div>
                  <div className='space-y-1'>
                    <p className='text-sm font-medium text-muted-foreground'>
                      CNAE
                    </p>
                    <p>{currentUnit.contractingCompany.cnae}</p>
                  </div>
                  <div className='space-y-1'>
                    <p className='text-sm font-medium text-muted-foreground'>
                      Grau de Risco
                    </p>
                    <p>{currentUnit.contractingCompany.riskLevel}</p>
                  </div>
                </CardContent>
              </Card>
            )}

            <Card>
              <CardHeader>
                <CardTitle>Informações do Imóvel</CardTitle>
              </CardHeader>
              <CardContent className='grid gap-4 sm:grid-cols-2 md:grid-cols-3'>
                <div className='space-y-1 md:col-span-3'>
                  <p className='text-sm font-medium text-muted-foreground'>
                    Endereço
                  </p>
                  <p>{currentUnit.propertyInfo.address}</p>
                </div>
                <div className='space-y-1'>
                  <p className='text-sm font-medium text-muted-foreground'>
                    Bairro
                  </p>
                  <p>{currentUnit.propertyInfo.neighborhood}</p>
                </div>
                <div className='space-y-1'>
                  <p className='text-sm font-medium text-muted-foreground'>
                    CEP
                  </p>
                  <p>{currentUnit.propertyInfo.zipCode}</p>
                </div>
                <div className='space-y-1'>
                  <p className='text-sm font-medium text-muted-foreground'>
                    Cidade / Estado
                  </p>
                  <p>
                    {currentUnit.propertyInfo.city} /{' '}
                    {currentUnit.propertyInfo.state}
                  </p>
                </div>
                <div className='space-y-1'>
                  <p className='text-sm font-medium text-muted-foreground'>
                    Área Total
                  </p>
                  <p>{currentUnit.propertyInfo.totalArea}</p>
                </div>
                <div className='space-y-1'>
                  <p className='text-sm font-medium text-muted-foreground'>
                    Área Construída
                  </p>
                  <p>{currentUnit.propertyInfo.builtArea}</p>
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle>Responsáveis Técnicos</CardTitle>
              </CardHeader>
              <CardContent className='grid gap-4 sm:grid-cols-2'>
                <div className='space-y-1'>
                  <p className='text-sm font-medium text-muted-foreground'>
                    Responsável Legal
                  </p>
                  <p>{currentUnit.legalResponsible}</p>
                </div>
                <div className='space-y-1'>
                  <p className='text-sm font-medium text-muted-foreground'>
                    Responsável pelo PGR
                  </p>
                  <p>{currentUnit.pgrResponsible}</p>
                </div>
                <div className='space-y-1'>
                  <p className='text-sm font-medium text-muted-foreground'>
                    Responsável pelo LTCAT
                  </p>
                  <p>{currentUnit.ltcatResponsible}</p>
                </div>
                <div className='space-y-1'>
                  <p className='text-sm font-medium text-muted-foreground'>
                    Responsável pelo PCMSO
                  </p>
                  <p>{currentUnit.pcmsoResponsible}</p>
                </div>
              </CardContent>
            </Card>
          </div>
          <div className='grid auto-rows-max items-start gap-4 lg:gap-8'>
            <Card>
              <CardHeader>
                <CardTitle>Resumo</CardTitle>
              </CardHeader>
              <CardContent className='grid gap-2 text-sm'>
                <Link
                  href={`/dashboard/clients/${contractId}/sectors?unitId=${unitId}`}
                  className='flex items-center justify-between rounded-md border p-3 bg-background hover:bg-accent hover:text-accent-foreground transition-colors'
                >
                  <span className='text-muted-foreground'>Setores</span>
                  <span className='font-semibold'>{totalSectors}</span>
                </Link>
                <Link
                  href={`/dashboard/clients/${contractId}/roles`}
                  className='flex items-center justify-between rounded-md border p-3 bg-background hover:bg-accent hover:text-accent-foreground transition-colors'
                >
                  <span className='text-muted-foreground'>Cargos</span>
                  <span className='font-semibold'>{totalRoles}</span>
                </Link>
                <Link
                  href={`/dashboard/clients/${contractId}/employees`}
                  className='flex items-center justify-between rounded-md border p-3 bg-background hover:bg-accent hover:text-accent-foreground transition-colors'
                >
                  <span className='text-muted-foreground'>
                    Total de colaboradores
                  </span>
                  <span className='font-semibold'>{totalEmployees}</span>
                </Link>
                <Link
                  href='#'
                  className='flex items-center justify-between rounded-md border p-3 bg-background hover:bg-accent hover:text-accent-foreground transition-colors'
                >
                  <span className='text-muted-foreground'>ASOs vencidos</span>
                  <span
                    className={cn(
                      'font-semibold',
                      expiredAsos > 0 && 'text-destructive'
                    )}
                  >
                    {expiredAsos}
                  </span>
                </Link>
                <Link
                  href='#'
                  className='flex items-center justify-between rounded-md border p-3 bg-background hover:bg-accent hover:text-accent-foreground transition-colors'
                >
                  <span className='text-muted-foreground'>
                    Treinamentos vencidos
                  </span>
                  <span
                    className={cn(
                      'font-semibold',
                      expiredTrainings > 0 && 'text-destructive'
                    )}
                  >
                    {expiredTrainings}
                  </span>
                </Link>
                <Link
                  href='#'
                  className='flex items-center justify-between rounded-md border p-3 bg-background hover:bg-accent hover:text-accent-foreground transition-colors'
                >
                  <span className='text-muted-foreground'>
                    Vacinas vencidas
                  </span>
                  <span
                    className={cn(
                      'font-semibold',
                      expiredVaccines > 0 && 'text-destructive'
                    )}
                  >
                    {expiredVaccines}
                  </span>
                </Link>
                <Link
                  href='#'
                  className='flex items-center justify-between rounded-md border p-3 bg-background hover:bg-accent hover:text-accent-foreground transition-colors'
                >
                  <span className='text-muted-foreground'>
                    Total de colaboradores PCD
                  </span>
                  <span className='font-semibold'>{pcdEmployees}</span>
                </Link>
              </CardContent>
            </Card>
          </div>
        </div>
      </div>

      <Dialog open={isEditDialogOpen} onOpenChange={setIsEditDialogOpen}>
        <DialogContent className='sm:max-w-2xl'>
          <DialogHeader>
            <DialogTitle>Editar Unidade</DialogTitle>
            <DialogDescription>
              Atualize as informações desta unidade.
            </DialogDescription>
          </DialogHeader>
          <form id='edit-unit-form' onSubmit={handleEditUnit}>
            {renderEditForm(currentUnit)}
          </form>
          <DialogFooter>
            <Button
              variant='outline'
              onClick={() => setIsEditDialogOpen(false)}
            >
              Cancelar
            </Button>
            <Button type='submit' form='edit-unit-form'>
              Salvar Alterações
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </>
  )
}
