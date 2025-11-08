
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

// --- Mock Data ---

const initialMedicalExams = [
  {
    code: '0201',
    name: 'Avaliação Clínica Ocupacional',
    type: 'Profissional Agenda',
    price: 'R$ 50,00',
    periodicity: '12 meses',
  },
  {
    code: '0211',
    name: 'Avaliação da acuidade visual',
    type: 'Laboratório',
    price: 'R$ 35,00',
    periodicity: '24 meses',
  },
  {
    code: 'N/A',
    name: 'Avaliação Psicossocial',
    type: 'Terceirizado',
    price: 'R$ 150,00',
    periodicity: 'Conforme PCMSO',
  },
  {
    code: '0212',
    name: 'Exame oftalmológico',
    type: 'Terceirizado',
    price: 'R$ 200,00',
    periodicity: 'Conforme PCMSO',
  },
  {
    code: '0215',
    name: 'Glicemia',
    type: 'Laboratório',
    price: 'R$ 25,00',
    periodicity: 'Anual',
  },
]

export const sstPrograms = [
    {
      sigla: 'PGR',
      documento: 'Programa de Gerenciamento de Riscos',
      baseLegal: 'NR 1',
      aplicabilidade: 'Obrigatório para quase todas as empresas',
      vigencia: 'Revisão: Mínimo a cada 2 anos (para empresas sem acidentes graves) ou sempre que houver alterações nos riscos (modificações de processos, tecnologias, etc.). Arquivamento: Mínimo de 20 anos.',
      valor: 'Sob Consulta',
    },
    {
      sigla: 'PCMSO',
      documento: 'Programa de Controle Médico de Saúde Ocupacional',
      baseLegal: 'NR 7',
      aplicabilidade: 'Obrigatório para quase todas as empresas',
      vigencia: 'Revisão/Planejamento: Anual. Arquivamento: O relatório analítico anual deve ser arquivado por, no mínimo, 20 anos.',
      valor: 'Sob Consulta',
    },
    {
      sigla: 'ASO',
      documento: 'Atestado de Saúde Ocupacional',
      baseLegal: 'NR 7',
      aplicabilidade: 'Obrigatório para todos os empregados',
      vigencia: 'Vigência: Varia. Exame periódico geralmente é anual, mas pode ser bienal ou semestral dependendo do risco/idade. Arquivamento: Mínimo de 20 anos após o desligamento do trabalhador.',
      valor: 'Sob Consulta',
    },
    {
      sigla: 'OS',
      documento: 'Ordem de Serviço de SST',
      baseLegal: 'NR 1',
      aplicabilidade: 'Obrigatório para todos os empregadores',
      vigencia: 'Vigência: Deve ser atualizada sempre que houver alteração nos riscos ou nas medidas preventivas. Arquivamento: Indeterminado ou enquanto o trabalhador estiver na empresa.',
      valor: 'Sob Consulta',
    },
    {
      sigla: '(Ficha EPI)',
      documento: 'Ficha ou Registro de Entrega de EPI',
      baseLegal: 'NR 6 e NR 1',
      aplicabilidade: 'Obrigatório para todos os empregadores que fornecem EPIs',
      vigencia: 'Vigência: Emitida a cada entrega de EPI. Arquivamento: Mínimo de 20 anos (sugerido junto ao ASO/PPP) para fins de comprovação.',
      valor: 'Sob Consulta',
    },
    {
      sigla: 'PPP',
      documento: 'Perfil Profissiográfico Previdenciário',
      baseLegal: '(Previdenciária - INSS)',
      aplicabilidade: 'Obrigatório para todas as empresas',
      vigencia: 'Vigência: Preenchido na rescisão do contrato ou sempre que solicitado. Arquivamento: Indeterminado (para sempre), pois é um documento histórico do trabalhador para o INSS.',
      valor: 'Sob Consulta',
    },
    {
      sigla: 'LTCAT',
      documento: 'Laudo Técnico das Condições Ambientais do Trabalho',
      baseLegal: '(Previdenciária - INSS)',
      aplicabilidade: 'Obrigatório para empresas com exposição a agentes nocivos',
      vigencia: 'Vigência: Não tem validade fixa. Deve ser revisado sempre que houver alteração no ambiente ou processo de trabalho. Arquivamento: Indeterminado.',
      valor: 'Sob Consulta',
    },
    {
      sigla: 'AET',
      documento: 'Análise Ergonômica do Trabalho',
      baseLegal: 'NR 17',
      aplicabilidade: 'Obrigatório para atividades com riscos ergonômicos',
      vigencia: 'Vigência: Não tem validade fixa. Deve ser revisada quando houver alterações significativas nas condições de trabalho (layout, máquinas, métodos).',
      valor: 'Sob Consulta',
    },
    {
      sigla: 'Laudo Insalubridade',
      documento: 'Laudo de Insalubridade',
      baseLegal: 'NR 15',
      aplicabilidade: 'Obrigatório se houver suspeita de exposição',
      vigencia: 'Vigência: Não tem validade fixa. Deve ser revisado sempre que houver mudanças no ambiente ou processo de trabalho que possam alterar o nível de exposição.',
      valor: 'Sob Consulta',
    },
    {
      sigla: 'Laudo Periculosidade',
      documento: 'Laudo de Periculosidade',
      baseLegal: 'NR 16',
      aplicabilidade: 'Obrigatório se houver suspeita de atividades perigosas',
      vigencia: 'Vigência: Não tem validade fixa. Deve ser revisado sempre que houver mudanças no ambiente ou processo de trabalho que possam alterar a condição de periculosidade.',
      valor: 'Sob Consulta',
    },
    {
      sigla: 'Certificado Treinamento',
      documento: 'Certificado de Treinamento e Capacitação',
      baseLegal: 'NRs diversas',
      aplicabilidade: 'Obrigatório (registros de treinamentos específicos)',
      vigencia: 'Vigência: Varia conforme a NR. Ex: NR 10 (bienal), NR 33 (anual), NR 35 (anual). Arquivamento: Pelo menos 20 anos (sugerido).',
      valor: 'Sob Consulta',
    },
    {
      sigla: 'Documentos CIPA',
      documento: 'CIPA - (Atas, Calendário e Eleição)',
      baseLegal: 'NR 5',
      aplicabilidade: 'Obrigatório para empresas com 20+ empregados',
      vigencia: 'Vigência: A gestão da CIPA tem duração de 1 ano. Arquivamento: Atas de eleição e posse: 20 anos; Atas de reuniões ordinárias/extraordinárias: 5 anos.',
      valor: 'Sob Consulta',
    },
    {
      sigla: 'PT',
      documento: 'Permissão para o Trabalho',
      baseLegal: 'NRs diversas (ex: 10, 34, 35)',
      aplicabilidade: 'Obrigatório para atividades de alto risco',
      vigencia: 'Vigência: Válida apenas para a duração da atividade específica para a qual foi emitida (geralmente diária ou por turno). Arquivamento: Mínimo de 5 anos (NR 10 sugere 5 anos).',
      valor: 'Sob Consulta',
    },
    {
      sigla: 'PPR',
      documento: 'Programa de Proteção Respiratória',
      baseLegal: '(Fundacentro/ NR 9)',
      aplicabilidade: 'Obrigatório onde os trabalhadores utilizam respiradores',
      vigencia: 'Revisão: Anual, no mínimo, ou sempre que necessário.',
      valor: 'Sob Consulta',
    },
    {
      sigla: 'PCA',
      documento: 'Programa de Conservação Auditiva',
      baseLegal: '(Fundacentro/ NR 9)',
      aplicabilidade: 'Obrigatório para empresas com exposição a níveis de ruído elevados',
      vigencia: 'Revisão: Anual, no mínimo, ou sempre que necessário.',
      valor: 'Sob Consulta',
    },
    {
      sigla: 'PGRTR',
      documento: 'Programa de Gerenciamento de Riscos no Trabalho Rural',
      baseLegal: 'NR 31',
      aplicabilidade: 'Obrigatório para empregadores rurais/aquicultura',
      vigencia: 'Revisão: Mínimo a cada 2 anos ou sempre que houver alterações (similar ao PGR). Arquivamento: Mínimo de 20 anos.',
      valor: 'Sob Consulta',
    },
    {
      sigla: 'PGRSS',
      documento: 'Programa de Gerenciamento de Resíduos de Serviços de Saúde',
      baseLegal: 'NR 32',
      aplicabilidade: 'Obrigatório para serviços de saúde',
      vigencia: 'Revisão: Não tem validade fixa, deve ser revisado em caso de alterações. Arquivamento: 20 anos (sugerido).',
      valor: 'Sob Consulta',
    },
    {
      sigla: 'Inventário Máquinas',
      documento: 'Inventário de Máquinas e Equipamentos',
      baseLegal: 'NR 12',
      aplicabilidade: 'Obrigatório para indústrias e empresas que possuem máquinas',
      vigencia: 'Vigência: Deve ser mantido atualizado.',
      valor: 'Sob Consulta',
    },
    {
      sigla: 'Prontuário Elétrico',
      documento: 'Prontuário de Instalações Elétricas',
      baseLegal: 'NR 10',
      aplicabilidade: 'Obrigatório para empresas com instalações elétricas e serviços com eletricidade',
      vigencia: 'Vigência: Deve ser mantido atualizado com as inspeções e manutenções.',
      valor: 'Sob Consulta',
    },
    {
      sigla: 'Prontuário Caldeiras',
      documento: 'Documentação de Caldeiras, Vasos de Pressão',
      baseLegal: 'NR 13',
      aplicabilidade: 'Obrigatório para empresas que possuem caldeiras, vasos de pressão, tubulações e tanques',
      vigencia: 'Vigência: Os relatórios de inspeção têm validade definida na NR-13 (ex: 1 a 3 anos, dependendo do equipamento/categoria).',
      valor: 'Sob Consulta',
    },
]


const technicalAdvisory = [
  {
    contractNumber: 'CT-MED-01',
    name: 'Assessoria em Medicina do Trabalho',
    hours: 10,
    hourValue: 'R$ 250,00',
    total: 'R$ 2.500,00',
    validity: '12 meses',
  },
  {
    contractNumber: 'CT-SEG-01',
    name: 'Assessoria em Segurança do Trabalho',
    hours: 20,
    hourValue: 'R$ 200,00',
    total: 'R$ 4.000,00',
    validity: '12 meses',
  },
]

const rentals = [
  {
    code: 'RENT-01',
    description: 'Unidade Móvel',
    dailyRate: 'R$ 1.500,00',
    insurance: 'R$ 300,00',
  },
  {
    code: 'RENT-02',
    description: 'Eletrocardiograma',
    dailyRate: 'R$ 250,00',
    insurance: 'R$ 50,00',
  },
]

const outsourcing = [
  {
    code: 'SESMT-01',
    professional: 'Médico do Trabalho',
    hourValue: 'R$ 300,00',
    hours: 40,
    professionals: 1,
    total: 'R$ 12.000,00',
  },
  {
    code: 'SESMT-02',
    professional: 'Técnico de Segurança do Trabalho',
    hourValue: 'R$ 150,00',
    hours: 80,
    professionals: 2,
    total: 'R$ 24.000,00',
  },
]

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
  const [isAdjustmentDialogOpen, setIsAdjustmentDialogOpen] = useState(false)
  const [isAddExamDialogOpen, setIsAddExamDialogOpen] = useState(false)
  const [isAddProgramDialogOpen, setIsAddProgramDialogOpen] = useState(false)
  const [isAddContractDialogOpen, setIsAddContractDialogOpen] = useState(false)
  const [isAddItemDialogOpen, setIsAddItemDialogOpen] = useState(false)
  const [isAddProfessionalDialogOpen, setIsAddProfessionalDialogOpen] =
    useState(false)

  const handleAdjustment = (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault()
    const formData = new FormData(event.currentTarget)
    const adjustment = formData.get('adjustment') as string

    toast({
      title: 'Reajuste Aplicado!',
      description: `O reajuste de ${adjustment}% foi aplicado a todos os exames.`,
    })

    setIsAdjustmentDialogOpen(false)
  }

  return (
    <div className='grid flex-1 auto-rows-max gap-4'>
      <div className='flex items-center gap-4'>
        <h1 className='flex-1 shrink-0 whitespace-nowrap text-xl font-semibold tracking-tight sm:grow-0'>
          Catálogo de Serviços
        </h1>
      </div>
      <Tabs defaultValue='exams'>
        <TabsList className='grid w-full grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-5'>
          <TabsTrigger value='exams'>Exames Médicos</TabsTrigger>
          <TabsTrigger value='programs'>Programas e Laudos</TabsTrigger>
          <TabsTrigger value='advisory'>Assessoria Técnica</TabsTrigger>
          <TabsTrigger value='rentals'>Aluguéis</TabsTrigger>
          <TabsTrigger value='outsourcing'>Terceirização SESMT</TabsTrigger>
        </TabsList>

        <TabsContent value='exams'>
          <Card>
            <CardHeader>
              <CardTitle>Exames Médicos Ocupacionais</CardTitle>
              <CardDescription>
                Tabela de preços e configurações para exames médicos conforme
                NR7.
              </CardDescription>
              <div className='pt-4 flex items-center gap-2 ml-auto'>
                <Dialog
                  open={isAdjustmentDialogOpen}
                  onOpenChange={setIsAdjustmentDialogOpen}
                >
                  <DialogTrigger asChild>
                    <Button size='sm' variant='outline' className='h-8 gap-1'>
                      <Percent className='h-3.5 w-3.5' />
                      <span className='sr-only sm:not-sr-only sm:whitespace-nowrap'>
                        Aplicar Reajuste Anual
                      </span>
                    </Button>
                  </DialogTrigger>
                  <DialogContent className='sm:max-w-md'>
                    <form onSubmit={handleAdjustment}>
                      <DialogHeader>
                        <DialogTitle>Reajuste Anual de Preços</DialogTitle>
                        <DialogDescription>
                          Aplique um reajuste percentual a todos os exames
                          médicos. Os novos preços serão refletidos em todos os
                          novos contratos.
                        </DialogDescription>
                      </DialogHeader>
                      <div className='grid gap-4 py-4'>
                        <div className='grid grid-cols-4 items-center gap-4'>
                          <Label htmlFor='adjustment' className='text-right'>
                            Percentual (%)
                          </Label>
                          <Input
                            id='adjustment'
                            name='adjustment'
                            type='number'
                            placeholder='Ex: 10'
                            className='col-span-3'
                            required
                          />
                        </div>
                      </div>
                      <DialogFooter>
                        <Button type='submit'>Aplicar Reajuste</Button>
                      </DialogFooter>
                    </form>
                  </DialogContent>
                </Dialog>
                <ServiceTableActions
                  buttonLabel='Adicionar Exame'
                  onAddClick={() => setIsAddExamDialogOpen(true)}
                />
              </div>
            </CardHeader>
            <CardContent>
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>Código (eSocial)</TableHead>
                    <TableHead>Nome</TableHead>
                    <TableHead>Tipo</TableHead>
                    <TableHead>Preço</TableHead>
                    <TableHead>Periodicidade</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {initialMedicalExams.map((exam) => (
                    <TableRow key={exam.code}>
                      <TableCell className='font-medium'>{exam.code}</TableCell>
                      <TableCell>{exam.name}</TableCell>
                      <TableCell>
                        <Badge variant='outline'>{exam.type}</Badge>
                      </TableCell>
                      <TableCell>{exam.price}</TableCell>
                      <TableCell>{exam.periodicity}</TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </CardContent>
          </Card>
        </TabsContent>

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
        open={isAddExamDialogOpen}
        onOpenChange={setIsAddExamDialogOpen}
        title='Adicionar Novo Exame'
        description='Preencha os detalhes para adicionar um novo exame médico ao catálogo.'
      />
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
