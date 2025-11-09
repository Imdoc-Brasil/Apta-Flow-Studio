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
import { Save, Printer, Pencil } from 'lucide-react'
import { useState } from 'react'
import { RadioGroup, RadioGroupItem } from '@/components/ui/radio-group'
import { Separator } from '@/components/ui/separator'

export default function PsychosocialEvaluationPage() {
  const { toast } = useToast()
  const [isPeriodic, setIsPeriodic] = useState('nao')
  const [isEditing, setIsEditing] = useState(false)

  const handleSaveSettings = (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault()
    // Logic to save settings would go here
    toast({
      title: 'Configurações Salvas!',
      description: 'As configurações do teste SRQ-20 foram salvas.',
    })
    setIsEditing(false)
  }

  const handleCancel = () => {
    setIsEditing(false)
  }

  const srqQuestions = [
    'Você tem dores de cabeça frequente?',
    'Tem falta de apetite?',
    'Dorme mal?',
    'Assusta-se com facilidade?',
    'Tem tremores nas mãos?',
    'Sente-se nervoso(a), tenso(a) ou preocupado(a)?',
    'Tem má digestão?',
    'Tem dificuldades de pensar com clareza?',
    'Tem se sentido triste ultimamente?',
    'Tem chorado mais do que de costume?',
    'Encontra dificuldades para realizar com satisfação suas atividades diárias?',
    'Tem dificuldades para tomar decisões?',
    'Tem dificuldades no serviço (seu trabalho é penoso, causa-lhe sofrimento?)',
    'É incapaz de desempenhar um papel útil em sua vida?',
    'Tem perdido o interesse pelas coisas?',
    'Você se sente uma pessoa inútil, sem préstimo?',
    'Tem tido ideia de acabar com a vida?',
    'Sente-se cansado(a) o tempo todo?',
    'Você se cansa com facilidade?',
    'Tem sensações desagradáveis no estômago?',
  ]

  return (
    <div className='grid flex-1 auto-rows-max gap-4'>
      <div className='flex items-center gap-4'>
        <h1 className='flex-1 shrink-0 whitespace-nowrap text-xl font-semibold tracking-tight sm:grow-0'>
          TESTE: SRQ 20 – SELF REPORT QUESTIONNAIRE
        </h1>
      </div>
      <Tabs defaultValue='form-model'>
        <TabsList>
          <TabsTrigger value='settings'>Configurações</TabsTrigger>
          <TabsTrigger value='form-model'>Modelo da Ficha</TabsTrigger>
          <TabsTrigger value='print-model'>Modelo de Impressão</TabsTrigger>
        </TabsList>

        <TabsContent value='settings'>
          <form onSubmit={handleSaveSettings}>
            <Card>
              <CardHeader>
                <CardTitle>Parâmetros do Teste SRQ-20</CardTitle>
                <CardDescription>
                  Defina os detalhes, regras e campos padrão para esta
                  avaliação. Estas são as configurações globais que as empresas
                  clientes herdarão.
                </CardDescription>
              </CardHeader>
              <CardContent className='space-y-6'>
                <div className='grid grid-cols-1 md:grid-cols-2 gap-4'>
                  <div className='space-y-2'>
                    <Label htmlFor='name'>Nome da Avaliação</Label>
                    <Input
                      id='name'
                      name='name'
                      defaultValue='SRQ 20 – SELF REPORT QUESTIONNAIRE'
                      disabled={!isEditing}
                      required
                    />
                  </div>
                  <div className='space-y-2'>
                    <Label htmlFor='esocialCode'>Código (eSocial)</Label>
                    <Input
                      id='esocialCode'
                      name='esocialCode'
                      defaultValue='0206'
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
                    defaultValue='Avaliação de sofrimento mental através de questionário autoaplicável de 20 perguntas.'
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
                    placeholder='Adicione recomendações que podem ser sugeridas.'
                    defaultValue='- Em caso de sofrimento mental detectado, encaminhar para avaliação com psicólogo ou médico psiquiatra.'
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
              <CardFooter className='border-t px-6 py-4 justify-end gap-2'>
                {isEditing ? (
                  <>
                    <Button variant='outline' onClick={handleCancel}>
                      Cancelar
                    </Button>
                    <Button type='submit'>
                      <Save className='mr-2 h-4 w-4' />
                      Salvar Configurações
                    </Button>
                  </>
                ) : (
                  <Button
                    type='button'
                    onClick={() => setIsEditing(true)}
                  >
                    <Pencil className='mr-2 h-4 w-4' />
                    Editar
                  </Button>
                )}
              </CardFooter>
            </Card>
          </form>
        </TabsContent>

        <TabsContent value='form-model'>
          <Card>
            <CardHeader>
              <CardTitle>Modelo de Ficha - SRQ-20</CardTitle>
              <CardDescription>
                Este é o modelo de questionário que será apresentado ao
                colaborador.
              </CardDescription>
            </CardHeader>
            <CardContent className='space-y-6'>
              <div className='rounded-lg border bg-muted/50 p-4 text-sm'>
                <p className='font-bold'>Instruções</p>
                <p>
                  Estas questões são relacionadas a certas dores e problemas
                  que podem ter lhe incomodado nos últimos 30 dias. Se você
                  acha que a questão se aplica a você e você teve o problema
                  descrito nos últimos 30 dias responda SIM. Por outro lado, se
                  a questão não se aplica a você e você não teve o problema nos
                  últimos 30 dias, responda NÃO. Lembre-se que o diagnóstico
                  definitivo só pode ser fornecido por um profissional.
                </p>
              </div>

              <div className='space-y-4'>
                {srqQuestions.map((question, index) => (
                  <div
                    key={index}
                    className='flex items-center justify-between rounded-md border p-3'
                  >
                    <p className='text-sm font-medium'>
                      {index + 1}. {question}
                    </p>
                    <RadioGroup
                      name={`q-${index}`}
                      className='flex items-center gap-4'
                    >
                      <div className='flex items-center space-x-2'>
                        <RadioGroupItem value='sim' id={`q-${index}-sim`} />
                        <Label htmlFor={`q-${index}-sim`}>Sim</Label>
                      </div>
                      <div className='flex items-center space-x-2'>
                        <RadioGroupItem value='nao' id={`q-${index}-nao`} />
                        <Label htmlFor={`q-${index}-nao`}>Não</Label>
                      </div>
                    </RadioGroup>
                  </div>
                ))}
              </div>

              <Separator />

              <div className='space-y-6 rounded-lg border p-4'>
                <h3 className='font-semibold'>Resultados</h3>
                <div className='grid md:grid-cols-2 gap-6'>
                  <div className='flex items-center gap-4'>
                    <Label htmlFor='total-sim' className='font-medium'>
                      Total de respostas SIM:
                    </Label>
                    <Input
                      id='total-sim'
                      type='number'
                      className='w-24'
                      readOnly
                      value={0}
                    />
                  </div>
                  <div className='flex items-center gap-4'>
                    <Label className='font-medium'>
                      Sofrimento mental leve:
                    </Label>
                    <RadioGroup className='flex items-center gap-4'>
                      <div className='flex items-center space-x-2'>
                        <RadioGroupItem value='sim' id='sofrimento-sim' />
                        <Label htmlFor='sofrimento-sim'>Sim</Label>
                      </div>
                      <div className='flex items-center space-x-2'>
                        <RadioGroupItem value='nao' id='sofrimento-nao' />
                        <Label htmlFor='sofrimento-nao'>Não</Label>
                      </div>
                    </RadioGroup>
                  </div>
                </div>
                <p className='text-xs text-muted-foreground font-semibold bg-yellow-50 border border-yellow-200 p-2 rounded-md'>
                  RESULTADO: Se o resultado for ≥ 7 (maior ou igual a sete
                  respostas SIM) está comprovado sofrimento mental.
                </p>
                <div>
                  <Label htmlFor='observations'>Observações</Label>
                  <Textarea
                    id='observations'
                    placeholder='Use este espaço para qualquer observação pertinente a esta coleta de dados.'
                  />
                </div>
              </div>
            </CardContent>
          </Card>
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
