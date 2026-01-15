
'use client'

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
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs'
import { Button } from '@/components/ui/button'
import { File, PlusCircle, Percent } from 'lucide-react'
import { Badge } from '@/components/ui/badge'
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from '@/components/ui/dialog'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { useToast } from '@/hooks/use-toast'
import { useState } from 'react'
import {
  sstPrograms,
  technicalAdvisory,
  rentals,
  outsourcing,
} from './data'

function ServiceTableActions({
  buttonLabel,
  onAddClick,
}: {
  buttonLabel: string
  onAddClick: () => void
}) {
  return (
    <div className='ml-auto flex items-center gap-2'>
      <Button size='sm' variant='outline' className='h-8 gap-1'>
        <File className='h-3.5 w-3.5' />
        <span className='sr-only sm:not-sr-only sm:whitespace-nowrap'>
          Exportar
        </span>
      </Button>
      <Button size='sm' className='h-8 gap-1' onClick={onAddClick}>
        <PlusCircle className='h-3.5 w-3.5' />
        <span className='sr-only sm:not-sr-only sm:whitespace-nowrap'>
          {buttonLabel}
        </span>
      </Button>
    </div>
  )
}

function AddServiceDialog({
  open,
  onOpenChange,
  title,
  description,
}: {
  open: boolean
  onOpenChange: (open: boolean) => void
  title: string
  description: string
}) {
  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>{title}</DialogTitle>
          <DialogDescription>{description}</DialogDescription>
        </DialogHeader>
        <div className='py-4 text-center text-muted-foreground'>
          O formulário para adicionar este serviço apareceria aqui.
        </div>
        <DialogFooter>
          <Button variant='outline' onClick={() => onOpenChange(false)}>
            Fechar
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  )
}

export default function ServicesPage() {
  const { toast } = useToast()
  const [isAddProgramDialogOpen, setIsAddProgramDialogOpen] = useState(false)
  const [isAddContractDialogOpen, setIsAddContractDialogOpen] = useState(false)
  const [isAddItemDialogOpen, setIsAddItemDialogOpen] = useState(false)
  const [isAddProfessionalDialogOpen, setIsAddProfessionalDialogOpen] =
    useState(false)

  return (
    <div className='grid flex-1 auto-rows-max gap-4'>
      <div className='flex items-center gap-4'>
        <h1 className='flex-1 shrink-0 whitespace-nowrap text-xl font-semibold tracking-tight sm:grow-0'>
          Catálogo de Serviços
        </h1>
      </div>
      <Tabs defaultValue='programs'>
        <TabsList className='grid w-full grid-cols-1 sm:grid-cols-2 md:grid-cols-2 lg:grid-cols-4'>
          <TabsTrigger value='programs'>Programas e Laudos</TabsTrigger>
          <TabsTrigger value='advisory'>Assessoria Técnica</TabsTrigger>
          <TabsTrigger value='rentals'>Aluguéis</TabsTrigger>
          <TabsTrigger value='outsourcing'>Terceirização SESMT</TabsTrigger>
        </TabsList>
        <TabsContent value='programs'>
          <Card>
            <CardHeader>
              <CardTitle>Programas e Laudos de SST</CardTitle>
              <CardDescription>
                Serviços cobrados por demanda para emissão de programas e laudos
                de segurança do trabalho.
              </CardDescription>
              <div className='pt-4'>
                <ServiceTableActions
                  buttonLabel='Adicionar Programa'
                  onAddClick={() => setIsAddProgramDialogOpen(true)}
                />
              </div>
            </CardHeader>
            <CardContent>
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>Sigla</TableHead>
                    <TableHead>Programa/Documento</TableHead>
                    <TableHead>Base Legal</TableHead>
                    <TableHead>Aplicabilidade</TableHead>
                    <TableHead>Vigência e Arquivamento</TableHead>
                    <TableHead>Valor Unitário</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {sstPrograms.map((program) => (
                    <TableRow key={program.documento}>
                      <TableCell className='font-medium'>
                        {program.sigla}
                      </TableCell>
                      <TableCell>{program.documento}</TableCell>
                      <TableCell>{program.baseLegal}</TableCell>
                      <TableCell>{program.aplicabilidade}</TableCell>
                      <TableCell>{program.vigencia}</TableCell>
                      <TableCell>{program.valor}</TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value='advisory'>
          <Card>
            <CardHeader>
              <CardTitle>Assessoria Técnica</CardTitle>
              <CardDescription>
                Contratos de recorrência mensal para assessoria técnica
                especializada.
              </CardDescription>
              <div className='pt-4'>
                <ServiceTableActions
                  buttonLabel='Adicionar Contrato'
                  onAddClick={() => setIsAddContractDialogOpen(true)}
                />
              </div>
            </CardHeader>
            <CardContent>
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>Nº Contrato</TableHead>
                    <TableHead>Contrato</TableHead>
                    <TableHead>Horas Mensais</TableHead>
                    <TableHead>Valor por Hora</TableHead>
                    <TableHead>Valor Total Mensal</TableHead>
                    <TableHead>Vigência</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {technicalAdvisory.map((item) => (
                    <TableRow key={item.contractNumber}>
                      <TableCell className='font-medium'>
                        {item.contractNumber}
                      </TableCell>
                      <TableCell>{item.name}</TableCell>
                      <TableCell>{item.hours}</TableCell>
                      <TableCell>{item.hourValue}</TableCell>
                      <TableCell>{item.total}</TableCell>
                      <TableCell>{item.validity}</TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value='rentals'>
          <Card>
            <CardHeader>
              <CardTitle>Aluguel de Unidade Móvel e Equipamentos</CardTitle>
              <CardDescription>
                Disponibilização de equipamentos e unidades móveis para
                atendimento in-company.
              </CardDescription>
              <div className='pt-4'>
                <ServiceTableActions
                  buttonLabel='Adicionar Item'
                  onAddClick={() => setIsAddItemDialogOpen(true)}
                />
              </div>
            </CardHeader>
            <CardContent>
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>Código</TableHead>
                    <TableHead>Descrição</TableHead>
                    <TableHead>Valor por Diária</TableHead>
                    <TableHead>Seguro</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {rentals.map((item) => (
                    <TableRow key={item.code}>
                      <TableCell className='font-medium'>{item.code}</TableCell>
                      <TableCell>{item.description}</TableCell>
                      <TableCell>{item.dailyRate}</TableCell>
                      <TableCell>{item.insurance}</TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value='outsourcing'>
          <Card>
            <CardHeader>
              <CardTitle>Terceirização de SESMT</CardTitle>
              <CardDescription>
                Alocação de profissionais de Saúde e Segurança do Trabalho para
                compor o SESMT do cliente.
              </CardDescription>
              <div className='pt-4'>
                <ServiceTableActions
                  buttonLabel='Adicionar Profissional'
                  onAddClick={() => setIsAddProfessionalDialogOpen(true)}
                />
              </div>
            </CardHeader>
            <CardContent>
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>Código</TableHead>
                    <TableHead>Profissional</TableHead>
                    <TableHead>Valor por Hora</TableHead>
                    <TableHead>Horas Contratadas</TableHead>
                    <TableHead>Nº Profissionais</TableHead>
                    <TableHead>Valor Total</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {outsourcing.map((item) => (
                    <TableRow key={item.code}>
                      <TableCell className='font-medium'>{item.code}</TableCell>
                      <TableCell>{item.professional}</TableCell>
                      <TableCell>{item.hourValue}</TableCell>
                      <TableCell>{item.hours}</TableCell>
                      <TableCell>{item.professionals}</TableCell>
                      <TableCell>{item.total}</TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
      <AddServiceDialog
        open={isAddProgramDialogOpen}
        onOpenChange={setIsAddProgramDialogOpen}
        title='Adicionar Novo Programa/Laudo'
        description='Preencha os detalhes para adicionar um novo serviço de programa ou laudo.'
      />
      <AddServiceDialog
        open={isAddContractDialogOpen}
        onOpenChange={setIsAddContractDialogOpen}
        title='Adicionar Novo Contrato de Assessoria'
        description='Preencha os detalhes para adicionar um novo modelo de contrato de assessoria.'
      />
      <AddServiceDialog
        open={isAddItemDialogOpen}
        onOpenChange={setIsAddItemDialogOpen}
        title='Adicionar Novo Item para Aluguel'
        description='Preencha os detalhes para adicionar um novo equipamento ou unidade para aluguel.'
      />
      <AddServiceDialog
        open={isAddProfessionalDialogOpen}
        onOpenChange={setIsAddProfessionalDialogOpen}
        title='Adicionar Novo Profissional para Terceirização'
        description='Preencha os detalhes para adicionar um novo tipo de profissional para terceirização.'
      />
    </div>
  )
}
