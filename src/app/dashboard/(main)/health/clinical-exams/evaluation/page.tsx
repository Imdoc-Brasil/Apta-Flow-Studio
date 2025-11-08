'use client'

import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
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
import { Save, FileSignature, Printer } from 'lucide-react'

export default function ClinicalEvaluationPage() {
  const { toast } = useToast()

  const handleSaveSettings = (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault()
    // Logic to save settings would go here
    toast({
      title: 'Configurações Salvas!',
      description: 'As configurações da avaliação clínica foram salvas com sucesso.',
    })
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
                      required
                    />
                  </div>
                  <div className='space-y-2'>
                    <Label htmlFor='esocialCode'>Código (eSocial)</Label>
                    <Input
                      id='esocialCode'
                      name='esocialCode'
                      defaultValue='0201'
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
                    defaultValue='Realizada para avaliar a aptidão do colaborador para a função, considerando os riscos ocupacionais.'
                  />
                </div>

                <div className='space-y-2'>
                  <Label htmlFor='instructions'>
                    Instruções (Quando e como deve ser feito)
                  </Label>
                  <Textarea
                    id='instructions'
                    name='instructions'
                    placeholder='Detalhe o procedimento, critérios e periodicidade.'
                    defaultValue='Deve ser realizada no exame admissional, periódico, de retorno ao trabalho, mudança de risco e demissional, conforme prazos do PCMSO.'
                    className='h-24'
                  />
                </div>

                <div className='space-y-2'>
                  <Label htmlFor='recommendations'>
                    Recomendações Padrão
                  </Label>
                  <Textarea
                    id='recommendations'
                    name='recommendations'
                    placeholder='Adicione recomendações que podem ser sugeridas ao médico.'
                    defaultValue='- Manter hábitos de vida saudáveis.\n- Realizar pausas durante a jornada de trabalho.\n- Utilizar corretamente os EPIs fornecidos.'
                  />
                </div>

                <div className='space-y-2'>
                  <Label htmlFor='linkedRisk'>Risco Vinculado (Opcional)</Label>
                  <Select name='linkedRisk'>
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
              <CardFooter className='border-t px-6 py-4'>
                <Button type='submit'>
                  <Save className='mr-2 h-4 w-4' />
                  Salvar Configurações
                </Button>
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
