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
import { useToast } from '@/hooks/use-toast'
import { Save, Printer, Pencil } from 'lucide-react'
import { useState } from 'react'

export default function EcgEvaluationPage() {
  const { toast } = useToast()
  const [isEditing, setIsEditing] = useState(false)

  const handleSaveSettings = (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault()
    toast({
      title: 'Configurações Salvas!',
      description:
        'As configurações do modelo de laudo de ECG foram salvas com sucesso.',
    })
    setIsEditing(false)
  }

  const handleCancel = () => {
    setIsEditing(false)
  }

  return (
    <div className='grid flex-1 auto-rows-max gap-4'>
      <div className='flex items-center gap-4'>
        <h1 className='flex-1 shrink-0 whitespace-nowrap text-xl font-semibold tracking-tight sm:grow-0'>
          Configuração de Laudo: Eletrocardiograma (ECG)
        </h1>
      </div>
      <Tabs defaultValue='settings'>
        <TabsList>
          <TabsTrigger value='settings'>Configurações</TabsTrigger>
          <TabsTrigger value='laudomodel'>Modelo de Laudo</TabsTrigger>
          <TabsTrigger value='printmodel'>Modelo de Impressão</TabsTrigger>
        </TabsList>

        <TabsContent value='settings'>
          <Card>
            <CardHeader>
              <CardTitle>Parâmetros do Laudo de ECG</CardTitle>
              <CardDescription>
                Defina os detalhes e regras padrão para este tipo de laudo.
              </CardDescription>
            </CardHeader>
            <form id='settings-form' onSubmit={handleSaveSettings}>
              <CardContent className='space-y-6'>
                <div className='grid grid-cols-1 md:grid-cols-2 gap-4'>
                  <div className='space-y-2'>
                    <Label htmlFor='name'>Nome do Exame</Label>
                    <Input
                      id='name'
                      name='name'
                      defaultValue='Eletrocardiograma (ECG)'
                      disabled={!isEditing}
                      required
                    />
                  </div>
                  <div className='space-y-2'>
                    <Label htmlFor='esocialCode'>Código (eSocial)</Label>
                    <Input
                      id='esocialCode'
                      name='esocialCode'
                      defaultValue='530'
                      disabled={!isEditing}
                      required
                    />
                  </div>
                </div>

                <div className='space-y-2'>
                  <Label htmlFor='description'>Descrição do Exame</Label>
                  <Textarea
                    id='description'
                    name='description'
                    placeholder='Descreva o objetivo deste exame.'
                    defaultValue='Análise da atividade elétrica do coração para detectar anomalias no ritmo cardíaco, isquemias e outras condições cardiovasculares.'
                    disabled={!isEditing}
                  />
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

        <TabsContent value='laudomodel'>
          <Card>
            <CardHeader>
              <CardTitle>Modelo do Laudo Estruturado</CardTitle>
              <CardDescription>
                Defina as seções e campos que a IA deve preencher para gerar o
                laudo preliminar.
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className='space-y-4 rounded-lg border p-4'>
                <h3 className='font-medium'>Seções do Laudo</h3>
                <div className='space-y-2'>
                  <Label>Ritmo Cardíaco</Label>
                  <Textarea
                    placeholder='Ex: Ritmo sinusal, taquicardia...'
                    disabled
                  />
                </div>
                <div className='space-y-2'>
                  <Label>Intervalos (PR, QRS, QT)</Label>
                  <Textarea
                    placeholder='Ex: Intervalo PR dentro dos limites...'
                    disabled
                  />
                </div>
                <div className='space-y-2'>
                  <Label>Análise de Segmento ST e Onda T</Label>
                  <Textarea
                    placeholder='Ex: Ausência de alterações...'
                    disabled
                  />
                </div>
                <div className='space-y-2'>
                  <Label>Conclusão</Label>
                  <Textarea placeholder='Ex: Exame dentro dos limites...' disabled />
                </div>
                 <div className='space-y-2'>
                  <Label>Observações/Recomendações</Label>
                  <Textarea placeholder='Ex: Sugere-se correlação clínica...' disabled />
                </div>
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value='printmodel'>
          <Card>
            <CardHeader>
              <CardTitle>Modelo de Impressão</CardTitle>
              <CardDescription>
                Configure o layout do laudo que será gerado para impressão ou
                PDF.
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
