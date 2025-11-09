'use client'

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
import { ArrowLeft, FileUp, Loader2 } from 'lucide-react'
import { useState, useEffect, useCallback } from 'react'
import { useParams, useRouter } from 'next/navigation'
import { useAttendeeStore } from '@/app/dashboard/(main)/health/queue/attendee-store'
import Link from 'next/link'

export default function PerformExamPage() {
  const params = useParams()
  const router = useRouter()
  const { toast } = useToast()

  const attendeeId = params.attendeeId as string
  const examId = params.examId as string

  const { updateExamStatus } = useAttendeeStore()
  const attendee = useAttendeeStore((state) =>
    state.attendees.find((a) => a.id === attendeeId)
  )
  const exam = attendee?.exams.find((e) => e.id === examId)

  const [file, setFile] = useState<File | null>(null)
  const [filePreview, setFilePreview] = useState<string | null>(null)
  const [isFinishing, setIsFinishing] = useState(false)

  const handleFileChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    const selectedFile = event.target.files?.[0]
    if (selectedFile) {
      setFile(selectedFile)
      const reader = new FileReader()
      reader.onloadend = () => {
        setFilePreview(reader.result as string)
      }
      reader.readAsDataURL(selectedFile)
    }
  }

  const handleFinishExam = useCallback(() => {
    if (!file) {
      toast({
        variant: 'destructive',
        title: 'Nenhum arquivo anexado',
        description: 'Por favor, anexe o resultado do exame para finalizar.',
      })
      return
    }

    setIsFinishing(true)

    // Simulate API call
    setTimeout(() => {
      updateExamStatus(attendeeId, examId, 'Realizado')
      toast({
        title: 'Exame Finalizado!',
        description: `O resultado para "${exam?.name}" foi salvo com sucesso.`,
      })
      setIsFinishing(false)
      router.push(`/dashboard/health/evaluation/${attendeeId}`)
    }, 1000)
  }, [file, updateExamStatus, attendeeId, examId, exam?.name, router, toast])

  if (!attendee || !exam) {
    return (
      <div className='flex items-center justify-center h-full'>
        <p>Carregando informações do exame...</p>
      </div>
    )
  }

  return (
    <div className='grid flex-1 auto-rows-max gap-4'>
      <div className='flex items-center gap-4'>
        <Button variant='outline' size='icon' className='h-7 w-7' asChild>
          <Link href={`/dashboard/health/evaluation/${attendeeId}`}>
            <ArrowLeft className='h-4 w-4' />
            <span className='sr-only'>Voltar</span>
          </Link>
        </Button>
        <h1 className='flex-1 shrink-0 whitespace-nowrap text-xl font-semibold tracking-tight sm:grow-0'>
          Realizar Exame: {exam.name}
        </h1>
      </div>
      <Card>
        <CardHeader>
          <CardTitle>Anexar Resultado</CardTitle>
          <CardDescription>
            Faça o upload do arquivo de resultado para este exame (ex: PDF do
            gráfico, imagem do Raio-X).
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className='space-y-4'>
            <div className='space-y-2'>
              <Label htmlFor='exam-file'>Arquivo do Resultado</Label>
              <Input
                id='exam-file'
                type='file'
                accept='image/*,application/pdf'
                onChange={handleFileChange}
              />
            </div>
            {filePreview && (
              <div className='border rounded-lg p-2 bg-muted/50 max-h-[60vh] overflow-auto'>
                {file?.type.startsWith('image/') ? (
                  <img
                    src={filePreview}
                    alt='Pré-visualização do resultado'
                    className='w-full h-auto rounded-md'
                  />
                ) : (
                  <iframe
                    src={filePreview}
                    className='w-full h-[60vh] border-none'
                    title='Pré-visualização do PDF'
                  />
                )}
              </div>
            )}
            {!filePreview && (
              <div className='flex flex-col items-center justify-center h-64 border-2 border-dashed rounded-lg text-muted-foreground'>
                <FileUp className='h-12 w-12 mb-4' />
                <p>A pré-visualização do arquivo aparecerá aqui.</p>
              </div>
            )}
          </div>
        </CardContent>
        <CardFooter>
          <Button onClick={handleFinishExam} disabled={isFinishing || !file}>
            {isFinishing ? (
              <>
                <Loader2 className='mr-2 h-4 w-4 animate-spin' />
                Finalizando...
              </>
            ) : (
              'Finalizar Exame'
            )}
          </Button>
        </CardFooter>
      </Card>
    </div>
  )
}
