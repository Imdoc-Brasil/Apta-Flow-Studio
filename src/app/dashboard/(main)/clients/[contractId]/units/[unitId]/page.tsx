
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
import { ArrowLeft } from 'lucide-react'
import Link from 'next/link'
import { Badge } from '@/components/ui/badge'
import { Separator } from '@/components/ui/separator'
import { initialSectorsData } from '../../sectors/data'
import { initialRolesData } from '../../roles/data'
import { initialEmployeesData } from '../../employees/data'
import { cn } from '@/lib/utils'

const getUnitById = (unitId: string): Unit | undefined => {
  return initialUnitsData.find((unit) => unit.id === unitId)
}

export default function UnitDetailsPage() {
  const params = useParams()
  const contractId = params.contractId as string
  const unitId = params.unitId as string
  const unit = getUnitById(unitId)

  const sectorsInUnit = initialSectorsData.filter((s) => s.unitId === unitId)
  const sectorIdsInUnit = sectorsInUnit.map((s) => s.id)

  const rolesInUnit = initialRolesData.filter((r) =>
    sectorIdsInUnit.includes(r.sectorId)
  )
  const roleIdsInUnit = rolesInUnit.map((r) => r.id)

  const employeesInUnit = initialEmployeesData.filter(
    (e) => e.status === 'Ativo' && roleIdsInUnit.includes(e.roleId)
  )

  const totalSectors = sectorsInUnit.length
  const totalRoles = rolesInUnit.length
  const totalEmployees = employeesInUnit.length
  const expiredAsos = 0 // Placeholder
  const pcdEmployees = 0 // Placeholder
  const expiredTrainings = 0 // Placeholder
  const expiredVaccines = 0 // Placeholder

  if (!unit) {
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

  return (
    <div className='grid flex-1 auto-rows-max gap-4'>
      <div className='flex items-center gap-4'>
        <Button variant='outline' size='icon' className='h-7 w-7' asChild>
          <Link href={`/dashboard/clients/${contractId}/units`}>
            <ArrowLeft className='h-4 w-4' />
            <span className='sr-only'>Voltar</span>
          </Link>
        </Button>
        <h1 className='flex-1 shrink-0 whitespace-nowrap text-xl font-semibold tracking-tight sm:grow-0'>
          {unit.name}
        </h1>
        <Badge variant='outline' className='ml-auto sm:ml-0'>
          {unit.type}
        </Badge>
        <div className='hidden items-center gap-2 md:ml-auto md:flex'>
          {/* Future buttons like "Edit" can go here */}
        </div>
      </div>
      <div className='grid gap-4 md:grid-cols-[1fr_250px] lg:grid-cols-3 lg:gap-8'>
        <div className='grid auto-rows-max items-start gap-4 lg:col-span-2 lg:gap-8'>
          <Card>
            <CardHeader>
              <CardTitle>Detalhes da Unidade</CardTitle>
              <CardDescription>{unit.description}</CardDescription>
            </CardHeader>
            <CardContent className='space-y-6'>
              <div className='grid grid-cols-1 md:grid-cols-2 gap-4 text-sm'>
                <div>
                  <p className='font-medium text-muted-foreground'>CNPJ</p>
                  <p>{unit.cnpj}</p>
                </div>
                <div>
                  <p className='font-medium text-muted-foreground'>CNAE</p>
                  <p>{unit.cnae}</p>
                </div>
                <div>
                  <p className='font-medium text-muted-foreground'>
                    Grau de Risco
                  </p>
                  <p>{unit.riskLevel}</p>
                </div>
                {unit.cno && (
                  <div>
                    <p className='font-medium text-muted-foreground'>CNO</p>
                    <p>{unit.cno}</p>
                  </div>
                )}
              </div>

              {unit.contractingCompany && (
                <>
                  <Separator />
                  <div>
                    <h3 className='font-semibold mb-2'>Empresa Contratante</h3>
                    <div className='grid grid-cols-1 md:grid-cols-2 gap-4 text-sm'>
                      <div>
                        <p className='font-medium text-muted-foreground'>
                          Razão Social
                        </p>
                        <p>{unit.contractingCompany.name}</p>
                      </div>
                      <div>
                        <p className='font-medium text-muted-foreground'>
                          CNPJ
                        </p>
                        <p>{unit.contractingCompany.cnpj}</p>
                      </div>
                      <div>
                        <p className='font-medium text-muted-foreground'>
                          CNAE
                        </p>
                        <p>{unit.contractingCompany.cnae}</p>
                      </div>
                      <div>
                        <p className='font-medium text-muted-foreground'>
                          Grau de Risco
                        </p>
                        <p>{unit.contractingCompany.riskLevel}</p>
                      </div>
                    </div>
                  </div>
                </>
              )}

              <Separator />
              <div>
                <h3 className='font-semibold mb-2'>Informações do Imóvel</h3>
                <div className='grid grid-cols-1 md:grid-cols-2 gap-4 text-sm'>
                  <div className='col-span-full'>
                    <p className='font-medium text-muted-foreground'>
                      Endereço
                    </p>
                    <p>{unit.propertyInfo.address}</p>
                  </div>
                  <div>
                    <p className='font-medium text-muted-foreground'>Bairro</p>
                    <p>{unit.propertyInfo.neighborhood}</p>
                  </div>
                  <div>
                    <p className='font-medium text-muted-foreground'>CEP</p>
                    <p>{unit.propertyInfo.zipCode}</p>
                  </div>
                  <div>
                    <p className='font-medium text-muted-foreground'>
                      Cidade / Estado
                    </p>
                    <p>
                      {unit.propertyInfo.city} / {unit.propertyInfo.state}
                    </p>
                  </div>
                  <div>
                    <p className='font-medium text-muted-foreground'>
                      Área Total
                    </p>
                    <p>{unit.propertyInfo.totalArea}</p>
                  </div>
                  <div>
                    <p className='font-medium text-muted-foreground'>
                      Área Construída
                    </p>
                    <p>{unit.propertyInfo.builtArea}</p>
                  </div>
                </div>
              </div>

              <Separator />
              <div>
                <h3 className='font-semibold mb-2'>Responsáveis Técnicos</h3>
                <div className='grid grid-cols-1 md:grid-cols-2 gap-4 text-sm'>
                  <div>
                    <p className='font-medium text-muted-foreground'>
                      Responsável Legal
                    </p>
                    <p>{unit.legalResponsible}</p>
                  </div>
                  <div>
                    <p className='font-medium text-muted-foreground'>
                      Responsável pelo PGR
                    </p>
                    <p>{unit.pgrResponsible}</p>
                  </div>
                  <div>
                    <p className='font-medium text-muted-foreground'>
                      Responsável pelo LTCAT
                    </p>
                    <p>{unit.ltcatResponsible}</p>
                  </div>
                  <div>
                    <p className='font-medium text-muted-foreground'>
                      Responsável pelo PCMSO
                    </p>
                    <p>{unit.pcmsoResponsible}</p>
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>
        <div className='grid auto-rows-max items-start gap-4 lg:gap-8'>
          <Card>
            <CardHeader>
              <CardTitle>Resumo</CardTitle>
            </CardHeader>
            <CardContent className='grid gap-1 text-sm'>
              <Link
                href={`/dashboard/clients/${contractId}/sectors?unitId=${unitId}`}
                className='flex items-center justify-between rounded-md p-2 hover:bg-muted'
              >
                <span className='text-muted-foreground'>Setores</span>
                <span className='font-semibold'>{totalSectors}</span>
              </Link>
              <Link
                href={`/dashboard/clients/${contractId}/roles`}
                className='flex items-center justify-between rounded-md p-2 hover:bg-muted'
              >
                <span className='text-muted-foreground'>Cargos</span>
                <span className='font-semibold'>{totalRoles}</span>
              </Link>
              <Link
                href={`/dashboard/clients/${contractId}/employees`}
                className='flex items-center justify-between rounded-md p-2 hover:bg-muted'
              >
                <span className='text-muted-foreground'>
                  Total de colaboradores
                </span>
                <span className='font-semibold'>{totalEmployees}</span>
              </Link>
              <Link
                href='#'
                className='flex items-center justify-between rounded-md p-2 hover:bg-muted'
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
                className='flex items-center justify-between rounded-md p-2 hover:bg-muted'
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
                className='flex items-center justify-between rounded-md p-2 hover:bg-muted'
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
                className='flex items-center justify-between rounded-md p-2 hover:bg-muted'
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
  )
}
