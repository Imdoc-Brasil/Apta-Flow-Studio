'use client'

import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
  CardFooter,
} from '@/components/ui/card'
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Textarea } from '@/components/ui/textarea'
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select'
import { initialHazardData } from '@/app/dashboard/(main)/risks/page'
import { useToast } from '@/hooks/use-toast'
import {
  Save,
  FileSignature,
  Printer,
  Pencil,
  AlertCircle,
  File,
  Shield,
  Syringe,
  Briefcase,
  FilePlus,
  ChevronRight,
} from 'lucide-react'
import { useState } from 'react'
import { RadioGroup, RadioGroupItem } from '@/components/ui/radio-group'
import { Separator } from '@/components/ui/separator'
import { Checkbox } from '@/components/ui/checkbox'
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table'
import { ScrollArea } from '@/components/ui/scroll-area'
import { Badge } from '@/components/ui/badge'

export default function ClinicalEvaluationPage() {
  const { toast } = useToast()
  const [isPeriodic, setIsPeriodic] = useState('nao')
  const [isEditing, setIsEditing] = useState(false)

  const handleSaveSettings = (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault()
    // Logic to save settings would go here
    toast({
      title: 'Configurações Salvas!',
      description:
        'As configurações da avaliação clínica foram salvas com sucesso.',
    })
    setIsEditing(false)
  }

  const handleCancel = () => {
    // Here you might want to reset form state to its original values
    setIsEditing(false)
    // For now, just toggles the state
  }

  const FieldsetGroup = ({
    children,
    title,
  }: {
    children: React.ReactNode
    title: string
  }) => (
    <fieldset className='space-y-4 rounded-lg border p-4'>
      <legend className='-ml-1 px-1 text-base font-medium'>{title}</legend>
      {children}
    </fieldset>
  )

  const InfoField = ({ label, value }: { label: string; value: string }) => (
    <div className='space-y-1'>
      <p className='text-xs font-medium text-muted-foreground'>{label}</p>
      <p className='text-sm font-semibold'>{value}</p>
    </div>
  )

  const ExamField = ({
    label,
    children,
  }: {
    label: string
    children: React.ReactNode
  }) => (
    <div className='flex items-center justify-between'>
      <Label className='text-sm'>{label}</Label>
      <div className='flex items-center gap-4'>{children}</div>
    </div>
  )

  const NormalAlteredField = ({ label }: { label: string }) => (
    <div className='grid grid-cols-[1fr_2fr] gap-4 items-start'>
      <div className='flex flex-col gap-2'>
        <Label className='text-sm font-medium pt-2'>{label}</Label>
        <RadioGroup defaultValue='normal' className='flex'>
          <div className='flex items-center space-x-2'>
            <RadioGroupItem value='normal' id={`${label}-normal`} />
            <Label htmlFor={`${label}-normal`}>Normal</Label>
          </div>
          <div className='flex items-center space-x-2'>
            <RadioGroupItem value='alterado' id={`${label}-alterado`} />
            <Label htmlFor={`${label}-alterado`}>Alterado</Label>
          </div>
        </RadioGroup>
      </div>
      <Input placeholder='Se alterado, descrever...' />
    </div>
  )

  return (
    <div className='grid flex-1 auto-rows-max gap-4'>
      <div className='flex items-center gap-4'>
        <h1 className='flex-1 shrink-0 whitespace-nowrap text-xl font-semibold tracking-tight sm:grow-0'>
          Configuração da Avaliação Clínica
        </h1>
      </div>
      <Tabs defaultValue='form-model'>
        <TabsList>
          <TabsTrigger value='settings'>Configurações</TabsTrigger>
          <TabsTrigger value='form-model'>Modelo da Ficha</TabsTrigger>
          <TabsTrigger value='print-model'>Modelo de Impressão</TabsTrigger>
        </TabsList>

        <TabsContent value='settings'>
          <Card>
            <CardHeader>
              <CardTitle>Parâmetros da Avaliação Clínica</CardTitle>
              <CardDescription>
                Defina os detalhes, regras e campos padrão para esta avaliação.
                Estas são as configurações globais que as empresas clientes
                herdarão, mas poderão ser personalizadas posteriormente.
              </CardDescription>
            </CardHeader>
            <form id='settings-form' onSubmit={handleSaveSettings}>
              <CardContent className='space-y-6'>
                <div className='grid grid-cols-1 md:grid-cols-2 gap-4'>
                  <div className='space-y-2'>
                    <Label htmlFor='name'>Nome da Avaliação</Label>
                    <Input
                      id='name'
                      name='name'
                      defaultValue='Avaliação Clínica Ocupacional'
                      disabled={!isEditing}
                      required
                    />
                  </div>
                  <div className='space-y-2'>
                    <Label htmlFor='esocialCode'>Código (eSocial)</Label>
                    <Input
                      id='esocialCode'
                      name='esocialCode'
                      defaultValue='0201'
                      disabled={!isEditing}
                      required
                    />
                  </div>
                </div>

                <div className='space-y-2'>
                  <Label htmlFor='description'>Descrição</Label>
                  <Textarea
                    id='description'
                    name='description'
                    placeholder='Descreva o objetivo desta avaliação.'
                    defaultValue='Realizada para avaliar as condições Clínicas e Físico Mentais do paciente quanto a aptidão do colaborador para a função, considerando os riscos ocupacionais.'
                    disabled={!isEditing}
                  />
                </div>

                <fieldset className='space-y-4 rounded-lg border p-4'>
                  <legend className='-ml-1 px-1 text-sm font-medium'>
                    Aplicabilidade (Quando o exame deve ser realizado)
                  </legend>

                  <div className='flex items-center justify-between'>
                    <Label>Admissional</Label>
                    <RadioGroup
                      defaultValue='sim'
                      className='flex items-center gap-4'
                      disabled={!isEditing}
                    >
                      <div className='flex items-center space-x-2'>
                        <RadioGroupItem value='sim' id='admissional-sim' />
                        <Label htmlFor='admissional-sim'>Sim</Label>
                      </div>
                      <div className='flex items-center space-x-2'>
                        <RadioGroupItem value='nao' id='admissional-nao' />
                        <Label htmlFor='admissional-nao'>Não</Label>
                      </div>
                    </RadioGroup>
                  </div>

                  <Separator />

                  <div className='space-y-4'>
                    <div className='flex items-center justify-between'>
                      <Label>Periódico</Label>
                      <RadioGroup
                        value={isPeriodic}
                        onValueChange={setIsPeriodic}
                        className='flex items-center gap-4'
                        disabled={!isEditing}
                      >
                        <div className='flex items-center space-x-2'>
                          <RadioGroupItem value='sim' id='periodico-sim' />
                          <Label htmlFor='periodico-sim'>Sim</Label>
                        </div>
                        <div className='flex items-center space-x-2'>
                          <RadioGroupItem value='nao' id='periodico-nao' />
                          <Label htmlFor='periodico-nao'>Não</Label>
                        </div>
                      </RadioGroup>
                    </div>
                    {isPeriodic === 'sim' && (
                      <div className='grid grid-cols-2 gap-4 pl-6 pt-2 animate-in fade-in-0 zoom-in-95'>
                        <div className='space-y-2'>
                          <Label htmlFor='periodicidade-1'>
                            1ª Periodicidade (meses)
                          </Label>
                          <Input
                            id='periodicidade-1'
                            name='periodicidade-1'
                            type='number'
                            placeholder='Ex: 6'
                            disabled={!isEditing}
                          />
                        </div>
                        <div className='space-y-2'>
                          <Label htmlFor='periodicidade-2'>
                            Periodicidade Subsequente (meses)
                          </Label>
                          <Input
                            id='periodicidade-2'
                            name='periodicidade-2'
                            type='number'
                            placeholder='Ex: 12'
                            disabled={!isEditing}
                          />
                        </div>
                      </div>
                    )}
                  </div>

                  <Separator />

                  <div className='flex items-center justify-between'>
                    <Label>Mudança de Risco</Label>
                    <RadioGroup
                      defaultValue='sim'
                      className='flex items-center gap-4'
                      disabled={!isEditing}
                    >
                      <div className='flex items-center space-x-2'>
                        <RadioGroupItem value='sim' id='mudanca-sim' />
                        <Label htmlFor='mudanca-sim'>Sim</Label>
                      </div>
                      <div className='flex items-center space-x-2'>
                        <RadioGroupItem value='nao' id='mudanca-nao' />
                        <Label htmlFor='mudanca-nao'>Não</Label>
                      </div>
                    </RadioGroup>
                  </div>

                  <Separator />

                  <div className='flex items-center justify-between'>
                    <Label>Retorno ao Trabalho</Label>
                    <RadioGroup
                      defaultValue='sim'
                      className='flex items-center gap-4'
                      disabled={!isEditing}
                    >
                      <div className='flex items-center space-x-2'>
                        <RadioGroupItem value='sim' id='retorno-sim' />
                        <Label htmlFor='retorno-sim'>Sim</Label>
                      </div>
                      <div className='flex items-center space-x-2'>
                        <RadioGroupItem value='nao' id='retorno-nao' />
                        <Label htmlFor='retorno-nao'>Não</Label>
                      </div>
                    </RadioGroup>
                  </div>

                  <Separator />

                  <div className='flex items-center justify-between'>
                    <Label>Demissional</Label>
                    <RadioGroup
                      defaultValue='sim'
                      className='flex items-center gap-4'
                      disabled={!isEditing}
                    >
                      <div className='flex items-center space-x-2'>
                        <RadioGroupItem value='sim' id='demissional-sim' />
                        <Label htmlFor='demissional-sim'>Sim</Label>
                      </div>
                      <div className='flex items-center space-x-2'>
                        <RadioGroupItem value='nao' id='demissional-nao' />
                        <Label htmlFor='demissional-nao'>Não</Label>
                      </div>
                    </RadioGroup>
                  </div>
                </fieldset>

                <div className='space-y-2'>
                  <Label htmlFor='recommendations'>Recomendações Padrão</Label>
                  <Textarea
                    id='recommendations'
                    name='recommendations'
                    placeholder='Adicione recomendações que podem ser sugeridas ao médico.'
                    defaultValue='- Manter hábitos de vida saudáveis.\n- Realizar pausas durante a jornada de trabalho.\n- Utilizar corretamente os EPIs fornecidos.'
                    disabled={!isEditing}
                  />
                </div>

                <div className='space-y-2'>
                  <Label htmlFor='linkedRisk'>
                    Risco Vinculado (Opcional)
                  </Label>
                  <Select name='linkedRisk' disabled={!isEditing}>
                    <SelectTrigger>
                      <SelectValue placeholder='Selecione um risco do catálogo para vincular' />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value='none'>Nenhum</SelectItem>
                      {initialHazardData.map((hazard) => (
                        <SelectItem key={hazard.id} value={hazard.id}>
                          {hazard.name} ({hazard.category})
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>
              </CardContent>
            </form>
            <CardFooter className='border-t px-6 py-4 justify-end gap-2'>
              {isEditing ? (
                <>
                  <Button variant='outline' onClick={handleCancel}>
                    Cancelar
                  </Button>
                  <Button type='submit' form='settings-form'>
                    <Save className='mr-2 h-4 w-4' />
                    Salvar Configurações
                  </Button>
                </>
              ) : (
                <Button type='button' onClick={() => setIsEditing(true)}>
                  <Pencil className='mr-2 h-4 w-4' />
                  Editar
                </Button>
              )}
            </CardFooter>
          </Card>
        </TabsContent>

        <TabsContent value='form-model'>
          <div className='grid md:grid-cols-3 gap-8'>
            <div className='md:col-span-2 space-y-6'>
              <FieldsetGroup title='Seção 01: Dados do Colaborador'>
                <div className='grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-4 text-sm'>
                  <InfoField label='Nome' value='[Nome do Colaborador]' />
                  <InfoField label='Matrícula' value='[Matrícula]' />
                  <InfoField label='Idade' value='[Idade]' />
                  <InfoField label='Sexo' value='[Sexo]' />
                  <InfoField label='CPF' value='[CPF]' />
                  <InfoField label='Empresa' value='[Empresa]' />
                  <InfoField label='Setor' value='[Setor]' />
                  <InfoField label='Cargo' value='[Cargo]' />
                  <InfoField
                    label='Posto de Trabalho'
                    value='[Posto de Trabalho]'
                  />
                  <InfoField label='GHE' value='[GHE]' />
                  <div className='col-span-full'>
                    <InfoField
                      label='Atividades'
                      value='[Atividades do cargo]'
                    />
                  </div>
                  <div className='col-span-full'>
                    <InfoField label='Endereço' value='[Endereço completo]' />
                  </div>
                </div>
              </FieldsetGroup>

              <FieldsetGroup title='Seção 02: Contexto do Exame'>
                <div className='grid grid-cols-1 sm:grid-cols-2 gap-4'>
                  <div className='space-y-2'>
                    <Label>Tipo de Exame</Label>
                    <Input disabled value='[Admissional]' />
                  </div>
                </div>
                <div className='space-y-2'>
                  <Label>Exposto aos Riscos</Label>
                  <Textarea
                    disabled
                    value='[Lista de riscos do PCMSO]'
                    rows={3}
                  />
                </div>
                <div className='space-y-2'>
                  <Label>Exames a Serem Realizados</Label>
                  <Textarea
                    disabled
                    value='[Lista de exames do PCMSO]'
                    rows={3}
                  />
                </div>
              </FieldsetGroup>

              <FieldsetGroup title='Seção 03: Anamnese (Exame Admissional)'>
                <p className='text-sm text-muted-foreground'>
                  As seções a seguir são específicas para o exame admissional.
                </p>
                {/* Subseção 01 */}
                <div className='space-y-4 rounded-md border p-4'>
                  <h4 className='font-medium'>Dados Vitais</h4>
                  <Table>
                    <TableHeader>
                      <TableRow>
                        <TableHead>Parâmetro</TableHead>
                        <TableHead>Última Avaliação</TableHead>
                        <TableHead>Avaliação Atual</TableHead>
                        <TableHead>Resultado</TableHead>
                      </TableRow>
                    </TableHeader>
                    <TableBody>
                      <TableRow>
                        <TableCell>PAS / PAD</TableCell>
                        <TableCell className='text-muted-foreground'>
                          [120/80]
                        </TableCell>
                        <TableCell>
                          <Input placeholder='0/0' className='w-24' />
                        </TableCell>
                        <TableCell>
                          <Input
                            readOnly
                            placeholder='Normal'
                            className='w-24 bg-muted'
                          />
                        </TableCell>
                      </TableRow>
                      <TableRow>
                        <TableCell>Peso (kg) / Altura (m)</TableCell>
                        <TableCell className='text-muted-foreground'>
                          [80 / 1.75]
                        </TableCell>
                        <TableCell>
                          <Input placeholder='0' className='w-24' />
                        </TableCell>
                        <TableCell>
                          <Input placeholder='0' className='w-24' />
                        </TableCell>
                      </TableRow>
                      <TableRow>
                        <TableCell>IMC</TableCell>
                        <TableCell className='text-muted-foreground'>
                          [26.1]
                        </TableCell>
                        <TableCell>
                          <Input
                            readOnly
                            placeholder='0.0'
                            className='w-24 bg-muted'
                          />
                        </TableCell>
                        <TableCell>
                          <Input
                            readOnly
                            placeholder='Sobrepeso'
                            className='w-24 bg-muted'
                          />
                        </TableCell>
                      </TableRow>
                      <TableRow>
                        <TableCell>Circ. Pescoço (cm)</TableCell>
                        <TableCell className='text-muted-foreground'>
                          [40]
                        </TableCell>
                        <TableCell>
                          <Input placeholder='0' className='w-24' />
                        </TableCell>
                        <TableCell />
                      </TableRow>
                      <TableRow>
                        <TableCell>Circ. Abdominal (cm)</TableCell>
                        <TableCell className='text-muted-foreground'>
                          [92]
                        </TableCell>
                        <TableCell>
                          <Input placeholder='0' className='w-24' />
                        </TableCell>
                        <TableCell />
                      </TableRow>
                    </TableBody>
                  </Table>
                </div>
                {/* Subseção 02 */}
                <div className='space-y-4 rounded-md border p-4'>
                  <h4 className='font-medium'>Hábitos de Vida e Doenças</h4>
                  <ExamField label='Fuma?'>
                    <RadioGroup defaultValue='nao' className='flex gap-4'>
                      <div className='flex items-center space-x-2'>
                        <RadioGroupItem value='sim' id='fuma-sim' />
                        <Label htmlFor='fuma-sim'>Sim</Label>
                      </div>
                      <div className='flex items-center space-x-2'>
                        <RadioGroupItem value='nao' id='fuma-nao' />
                        <Label htmlFor='fuma-nao'>Não</Label>
                      </div>
                    </RadioGroup>
                  </ExamField>
                  <ExamField label='Bebida Alcoólica'>
                    <Select>
                      <SelectTrigger className='w-[180px]'>
                        <SelectValue placeholder='Frequência' />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value='diaria'>Diária</SelectItem>
                        <SelectItem value='2-3'>2-3x Semana</SelectItem>
                        <SelectItem value='fds'>Fins de Semana</SelectItem>
                        <SelectItem value='eventual'>Eventual</SelectItem>
                      </SelectContent>
                    </Select>
                  </ExamField>
                  <ExamField label='Atividade Física'>
                    <Select>
                      <SelectTrigger className='w-[180px]'>
                        <SelectValue placeholder='Frequência' />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value='sedentario'>Sedentário</SelectItem>
                        <SelectItem value='2-3'>2-3x Semana</SelectItem>
                        <SelectItem value='4-5'>4-5x Semana</SelectItem>
                        <SelectItem value='+6'>+6x Semana</SelectItem>
                      </SelectContent>
                    </Select>
                  </ExamField>
                  <div className='grid grid-cols-2 gap-4'>
                    <ExamField label='Diabetes?'>
                      <Checkbox />
                    </ExamField>
                    <ExamField label='Hipertensão?'>
                      <Checkbox />
                    </ExamField>
                  </div>
                  <div className='space-y-2'>
                    <Label>Doenças Ortopédicas? Quais?</Label>
                    <Input />
                  </div>
                  <div className='space-y-2'>
                    <Label>
                      Realiza terapias para fatores de riscos psicossociais?
                      Descrever
                    </Label>
                    <Input />
                  </div>
                </div>
                {/* Subseção 03 */}
                <div className='space-y-4 rounded-md border p-4'>
                  <h4 className='font-medium'>Histórico Ocupacional</h4>
                  <div className='space-y-2'>
                    <Label>Cargo no emprego anterior:</Label>
                    <Input />
                  </div>
                  <div className='space-y-2'>
                    <Label>Quais atividades realizava:</Label>
                    <Textarea rows={2} />
                  </div>
                  <div className='space-y-2'>
                    <Label>
                      Já teve algum Acidente de Trabalho? Descreva. Foi afastado
                      pelo INSS?
                    </Label>
                    <Textarea rows={2} />
                  </div>
                  <div className='space-y-2'>
                    <Label>
                      Afastamento pelo INSS por doença comum? Descreva:
                    </Label>
                    <Textarea rows={2} />
                  </div>
                </div>
                {/* Subseção 04 */}
                <div className='space-y-4 rounded-md border p-4'>
                  <h4 className='font-medium'>Queixas Atuais e Anamnese</h4>
                  <Textarea
                    placeholder='[Campo para IA transcrever a conversa ou para digitação livre]'
                    rows={5}
                  />
                </div>
                {/* Subseção 05 */}
                <div className='space-y-4 rounded-md border p-4'>
                  <h4 className='font-medium'>Exame Físico Atual</h4>
                  <div className='space-y-2'>
                    <NormalAlteredField label='Cabeça e Pescoço' />
                    <NormalAlteredField label='Tórax' />
                    <NormalAlteredField label='Abdome' />
                    <h5 className='font-semibold pt-2'>Coluna</h5>
                    <div className='pl-4 space-y-2'>
                      <NormalAlteredField label='Cervical' />
                      <NormalAlteredField label='Dorsal' />
                      <NormalAlteredField label='Lombar' />
                    </div>
                    <h5 className='font-semibold pt-2'>Membros Superiores</h5>
                    <div className='pl-4 space-y-2'>
                      <NormalAlteredField label='Ombros' />
                      <NormalAlteredField label='Braços' />
                      <NormalAlteredField label='Antebraços' />
                      <NormalAlteredField label='Mãos' />
                    </div>
                    <h5 className='font-semibold pt-2'>Membros Inferiores</h5>
                    <div className='pl-4 space-y-2'>
                      <NormalAlteredField label='Quadril' />
                      <NormalAlteredField label='Coxas' />
                      <NormalAlteredField label='Joelhos' />
                      <NormalAlteredField label='Pernas' />
                      <NormalAlteredField label='Pés' />
                    </div>
                  </div>
                </div>
              </FieldsetGroup>

              <FieldsetGroup title='Seção 06: Achados e Observações'>
                <Textarea
                  disabled
                  value='[Carregar automaticamente os achados alterados]'
                />
                <Label>Observações Adicionais</Label>
                <Textarea placeholder='Adicione observações ou notas adicionais aqui...' />
              </FieldsetGroup>
              <FieldsetGroup title='Seção 07: Conclusão'>
                <RadioGroup className='space-y-2'>
                  <div className='flex items-center space-x-2'>
                    <RadioGroupItem value='normal' id='conc-normal' />
                    <Label htmlFor='conc-normal'>Exame normal</Label>
                  </div>
                  <div className='flex items-center space-x-2'>
                    <RadioGroupItem
                      value='achado-sem-incapacidade'
                      id='conc-achado-sem'
                    />
                    <Label htmlFor='conc-achado-sem'>
                      Achados alterados, mas que não incapacita para o trabalho
                    </Label>
                  </div>
                  <div className='flex items-center space-x-2'>
                    <RadioGroupItem value='revisor' id='conc-revisor' />
                    <Label htmlFor='conc-revisor'>
                      Achados alterados, encaminho para avaliação complementar
                      do médico revisor
                    </Label>
                  </div>
                  <div className='flex items-center space-x-2'>
                    <RadioGroupItem value='parecer' id='conc-parecer' />
                    <Label htmlFor='conc-parecer'>
                      Achados alterados, solicito parecer complementar
                    </Label>
                  </div>
                </RadioGroup>
              </FieldsetGroup>
              <FieldsetGroup title='Seção 08: Ações'>
                <div className='flex flex-wrap gap-2'>
                  <Button variant='outline'>
                    <Printer className='mr-2 h-4 w-4' /> Imprimir Recomendações
                  </Button>
                  <Button>
                    <FileSignature className='mr-2 h-4 w-4' /> Finalizar
                    Atendimento
                  </Button>
                  <Button variant='secondary'>
                    <Save className='mr-2 h-4 w-4' /> Salvar, sem finalizar
                  </Button>
                </div>
              </FieldsetGroup>
            </div>

            <aside className='md:col-span-1 space-y-6'>
              <Card>
                <CardHeader>
                  <CardTitle>Resumo do Atendimento</CardTitle>
                </CardHeader>
                <CardContent className='space-y-4 text-sm'>
                  <div className='flex justify-between items-center'>
                    <span>Avaliação Clínica</span>{' '}
                    <Badge variant='secondary'>Concluído</Badge>
                  </div>
                  <div className='flex justify-between items-center'>
                    <span>Audiometria</span>{' '}
                    <Badge variant='outline'>Pendente</Badge>
                  </div>
                  <div className='flex justify-between items-center'>
                    <span>Acuidade Visual</span>{' '}
                    <Badge variant='outline'>Pendente</Badge>
                  </div>
                </CardContent>
              </Card>
              <Card>
                <CardHeader>
                  <CardTitle className='text-base'>
                    Histórico Relevante
                  </CardTitle>
                </CardHeader>
                <CardContent className='space-y-2'>
                  <Button
                    variant='ghost'
                    className='w-full justify-start p-2 h-auto text-left'
                  >
                    <Syringe className='mr-2 h-4 w-4 shrink-0' /> Cartão de
                    Vacinas <ChevronRight className='ml-auto h-4 w-4' />
                  </Button>
                  <Button
                    variant='ghost'
                    className='w-full justify-start p-2 h-auto text-left'
                  >
                    <AlertCircle className='mr-2 h-4 w-4 shrink-0' /> Acidentes
                    de Trabalho <ChevronRight className='ml-auto h-4 w-4' />
                  </Button>
                  <Button
                    variant='ghost'
                    className='w-full justify-start p-2 h-auto text-left'
                  >
                    <Briefcase className='mr-2 h-4 w-4 shrink-0' />{' '}
                    Afastamentos INSS <ChevronRight className='ml-auto h-4 w-4' />
                  </Button>
                </CardContent>
              </Card>
            </aside>
          </div>
        </TabsContent>

        <TabsContent value='print-model'>
          <Card>
            <CardHeader>
              <CardTitle>Modelo de Impressão</CardTitle>
              <CardDescription>
                Configure o layout do documento que será gerado para impressão.
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className='flex flex-1 items-center justify-center rounded-lg border border-dashed shadow-sm h-96'>
                <div className='flex flex-col items-center gap-2 text-center'>
                  <Printer className='h-12 w-12 text-muted-foreground' />
                  <h3 className='text-2xl font-bold tracking-tight'>
                    Editor de Layout de Impressão
                  </h3>
                  <p className='text-sm text-muted-foreground'>
                    Personalize a aparência do seu documento final.
                  </p>
                  <Button className='mt-4' disabled>
                    Em breve
                  </Button>
                </div>
              </div>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  )
}
