'use client'

import { useState, useCallback } from 'react'
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
  CardFooter,
} from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { useToast } from '@/hooks/use-toast'
import { analyzeEcg, AnalyzeEcgOutput } from '@/ai/flows/analyze-ecg-flow'
import { UploadCloud, Bot, Loader2 } from 'lucide-react'
import { Textarea } from '@/components/ui/textarea'

export default function EcgAnalysisPage() {
  const { toast } = useToast()
  const [file, setFile] = useState<File | null>(null)
  const [filePreview, setFilePreview] = useState<string | null>(null)
  const [isLoading, setIsLoading] = useState(false)
  const [analysisResult, setAnalysisResult] = useState<AnalyzeEcgOutput | null>(
    null
  )

  const handleFileChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    const selectedFile = event.target.files?.[0]
    if (selectedFile) {
      setFile(selectedFile)
      setAnalysisResult(null) // Reset previous results

      const reader = new FileReader()
      reader.onloadend = () => {
        setFilePreview(reader.result as string)
      }
      reader.readAsDataURL(selectedFile)
    }
  }

  const handleAnalyze = useCallback(async () => {
    if (!file || !filePreview) {
      toast({
        variant: 'destructive',
        title: 'Nenhum arquivo selecionado',
        description: 'Por favor, carregue um arquivo de ECG para analisar.',
      })
      return
    }

    setIsLoading(true)
    setAnalysisResult(null)

    try {
      const result = await analyzeEcg({ fileDataUri: filePreview })
      setAnalysisResult(result)
      toast({
        title: 'Análise Concluída!',
        description:
          'O laudo preliminar gerado pela IA está pronto para revisão.',
      })
    } catch (error) {
      console.error('Análise de ECG falhou:', error)
      toast({
        variant: 'destructive',
        title: 'Erro na Análise',
        description:
          'Não foi possível analisar o exame. Tente novamente ou verifique o arquivo.',
      })
    } finally {
      setIsLoading(false)
    }
  }, [file, filePreview, toast])

  return (
    <div className='grid flex-1 auto-rows-max gap-4'>
      <div className='flex items-center gap-4'>
        <h1 className='flex-1 shrink-0 whitespace-nowrap text-xl font-semibold tracking-tight sm:grow-0'>
          Assistente de Laudo de ECG (Beta)
        </h1>
      </div>

      <div className='grid gap-8 lg:grid-cols-2'>
        {/* Coluna de Upload e Visualização */}
        <Card>
          <CardHeader>
            <CardTitle>1. Carregar Exame</CardTitle>
            <CardDescription>
              Selecione o arquivo do eletrocardiograma (imagem ou PDF) para
              análise.
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div className='space-y-4'>
              <div className='space-y-2'>
                <Label htmlFor='ecg-file'>Arquivo do Exame</Label>
                <Input
                  id='ecg-file'
                  type='file'
                  accept='image/*,application/pdf'
                  onChange={handleFileChange}
                />
              </div>
              {filePreview && (
                <div className='border rounded-lg p-2 bg-muted/50 max-h-96 overflow-auto'>
                  {file?.type.startsWith('image/') ? (
                    <img
                      src={filePreview}
                      alt='Pré-visualização do ECG'
                      className='w-full h-auto rounded-md'
                    />
                  ) : (
                    <iframe
                      src={filePreview}
                      className='w-full h-96 border-none'
                      title='Pré-visualização do PDF'
                    />
                  )}
                </div>
              )}
            </div>
          </CardContent>
          <CardFooter>
            <Button onClick={handleAnalyze} disabled={isLoading || !file}>
              {isLoading ? (
                <>
                  <Loader2 className='mr-2 h-4 w-4 animate-spin' />
                  Analisando...
                </>
              ) : (
                <>
                  <Bot className='mr-2 h-4 w-4' />
                  Analisar com IA
                </>
              )}
            </Button>
          </CardFooter>
        </Card>

        {/* Coluna de Resultado */}
        <Card>
          <CardHeader>
            <CardTitle>2. Laudo Preliminar da IA</CardTitle>
            <CardDescription>
              Revise o laudo gerado pelo assistente. Este é um resultado
              preliminar e deve ser validado por um médico especialista.
            </CardDescription>
          </CardHeader>
          <CardContent className='space-y-4'>
            {isLoading && (
              <div className='flex flex-col items-center justify-center h-full text-muted-foreground'>
                <Loader2 className='h-8 w-8 animate-spin mb-4' />
                <p>Processando o exame...</p>
              </div>
            )}
            {!isLoading && !analysisResult && (
              <div className='flex flex-col items-center justify-center h-full text-muted-foreground'>
                <UploadCloud className='h-12 w-12 mb-4' />
                <p className='text-center'>
                  Carregue um exame e clique em "Analisar" para ver o laudo
                  preliminar aqui.
                </p>
              </div>
            )}
            {analysisResult && (
              <div className='space-y-4 text-sm'>
                <div className='space-y-2'>
                  <Label className='font-semibold' htmlFor='ritmo-cardiaco'>
                    Ritmo Cardíaco
                  </Label>
                  <Textarea
                    id='ritmo-cardiaco'
                    defaultValue={analysisResult.ritmoCardiaco}
                  />
                </div>
                <div className='space-y-2'>
                  <Label className='font-semibold' htmlFor='intervalos'>
                    Intervalos
                  </Label>
                  <Textarea
                    id='intervalos'
                    defaultValue={analysisResult.intervalos}
                  />
                </div>
                <div className='space-y-2'>
                  <Label className='font-semibold' htmlFor='analise-st'>
                    Análise do Segmento ST e Onda T
                  </Label>
                  <Textarea
                    id='analise-st'
                    defaultValue={analysisResult.analiseST}
                  />
                </div>
                <div className='space-y-2'>
                  <Label className='font-semibold' htmlFor='conclusao'>
                    Conclusão
                  </Label>
                  <Textarea
                    id='conclusao'
                    defaultValue={analysisResult.conclusao}
                  />
                </div>
                <div className='space-y-2'>
                  <Label className='font-semibold' htmlFor='observacoes'>
                    Observações
                  </Label>
                  <Textarea
                    id='observacoes'
                    defaultValue={analysisResult.observacoes}
                  />
                </div>
              </div>
            )}
          </CardContent>
          <CardFooter>
            <Button
              onClick={() => {
                toast({
                  title: 'Laudo Validado!',
                  description:
                    'O laudo foi salvo e está pronto para ser anexado ao prontuário do paciente.',
                })
              }}
              disabled={!analysisResult}
            >
              Validar e Salvar Laudo
            </Button>
          </CardFooter>
        </Card>
      </div>
    </div>
  )
}
