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
import { Save, FileSignature, Printer, Pencil } from 'lucide-react'
import { useState } from 'react'
import { RadioGroup, RadioGroupItem } from '@/components/ui/radio-group'
import { Separator } from '@/components/ui/separator'

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

  return (
    <div className='grid flex-1 auto-rows-max gap-4'>
      <div className='flex items-center gap-4'>
        <h1 className='flex-1 shrink-0 whitespace-nowrap text-xl font-semibold tracking-tight sm:grow-0'>
          Configuração da Avaliação Clínica
        </h1>
      </div>
      <Tabs defaultValue='settings'>
        <TabsList>
          <TabsTrigger value='settings'>Configurações</TabsTrigger>
          <TabsTrigger value='form-model'>Modelo da Ficha</TabsTrigger>
          <TabsTrigger value='print-model'>Modelo de Impressão</TabsTrigger>
        </TabsList>

        <TabsContent value='settings'>
          <form onSubmit={handleSaveSettings}>
            <Card>
              <CardHeader>
                <CardTitle>Parâmetros da Avaliação Clínica</CardTitle>
                <CardDescription>
                  Defina os detalhes, regras e campos padrão para esta avaliação.
                  Estas são as configurações globais que as empresas clientes
                  herdarão, mas poderão ser personalizadas posteriormente.
                </CardDescription>
              </CardHeader>
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
                  <Label htmlFor='linkedRisk'>Risco Vinculado (Opcional)</Label>
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
                  <Button type='button' onClick={() => setIsEditing(true)}>
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
              <CardTitle>Modelo da Ficha de Atendimento</CardTitle>
              <CardDescription>
                Construa o formulário que o médico irá preencher durante a
                avaliação.
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className='flex flex-1 items-center justify-center rounded-lg border border-dashed shadow-sm h-96'>
                <div className='flex flex-col items-center gap-2 text-center'>
                  <FileSignature className='h-12 w-12 text-muted-foreground' />
                  <h3 className='text-2xl font-bold tracking-tight'>
                    Construtor de Formulário
                  </h3>
                  <p className='text-sm text-muted-foreground'>
                    Arraste e solte campos para montar sua ficha de atendimento.
                  </p>
                  <Button className='mt-4' disabled>
                    Em breve
                  </Button>
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
