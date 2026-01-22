
'use client'

import { useState, useMemo, useEffect, Suspense } from 'react'
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from '@/components/ui/card'
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select'
import { RadioGroup, RadioGroupItem } from '@/components/ui/radio-group'
import { Button } from '@/components/ui/button'
import { Label } from '@/components/ui/label'
import { Input } from '@/components/ui/input'
import { useToast } from '@/hooks/use-toast'
import { psychosocialSurveyData } from '../dashboard/(main)/clients/[contractId]/psychosocial/data'
import { Logo } from '@/components/logo'
import { Separator } from '@/components/ui/separator'
import { useSurveyStore } from '../dashboard/(main)/clients/[contractId]/psychosocial/psychosocial-store'
import { useCollection, useFirestore, useMemoFirebase } from '@/firebase'
import { collection, query, where, getDocs } from 'firebase/firestore'
import { useSearchParams } from 'next/navigation'
import type { Unit } from '@/lib/types/unit'
import type { Sector } from '@/lib/types/sector'
import type { Role } from '@/lib/types/role'
import { useAllSectors } from '@/hooks/use-all-sectors'
import { Loader2 } from 'lucide-react'

function SurveyContent() {
  const { toast } = useToast()
  const { addResponse } = useSurveyStore()
  const [step, setStep] = useState(1)
  const firestore = useFirestore()
  const searchParams = useSearchParams()
  const surveyId = searchParams.get('id'); // This is a placeholder, a real app would use this

  // A real implementation would extract the clientId from the survey document
  // For now, we'll hardcode a known client for demo purposes if no surveyId is found
  const contractId = 'CTR-2024-001'

  const unitsRef = useMemoFirebase(() => (firestore ? collection(firestore, `clients/${contractId}/units`) : null), [firestore, contractId]);
  const rolesRef = useMemoFirebase(() => (firestore ? collection(firestore, `clients/${contractId}/roles`) : null), [firestore, contractId]);

  const { data: units, isLoading: unitsLoading } = useCollection<Unit>(unitsRef);
  const { data: roles, isLoading: rolesLoading } = useCollection<Role>(rolesRef);

  const { allSectors, isLoadingSectors } = useAllSectors(contractId)

  const handleSubmit = (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault()
    const formData = new FormData(event.currentTarget)
    const respondentId = `resp-${Date.now()}` // Simple unique ID for this respondent

    let hasMissingAnswers = false
    psychosocialSurveyData.forEach((group) => {
      group.questions.forEach((q) => {
        const value = formData.get(q.id)
        if (value) {
          addResponse(`${q.id}-${respondentId}`, parseInt(value as string, 10))
        } else {
          hasMissingAnswers = true
        }
      })
    })

    if (hasMissingAnswers) {
      toast({
        variant: 'destructive',
        title: 'Perguntas não respondidas',
        description: 'Por favor, responda todas as perguntas antes de enviar.',
      })
      return
    }

    toast({
      title: 'Respostas Enviadas!',
      description:
        'Agradecemos sua participação. Suas respostas foram enviadas anonimamente.',
    })
    setStep(3) // Go to thank you page
  }

  const isLoadingDemographics = unitsLoading || isLoadingSectors || rolesLoading

  if (step === 3) {
    return (
      <div className='flex min-h-screen flex-col items-center justify-center bg-muted/40 p-4'>
        <Card className='w-full max-w-2xl'>
          <CardHeader className='text-center'>
            <div className='mx-auto mb-4'>
              <Logo />
            </div>
            <CardTitle>Obrigado por sua participação!</CardTitle>
            <CardDescription>
              Sua contribuição é fundamental para construirmos um ambiente de
              trabalho melhor e mais seguro.
            </CardDescription>
          </CardHeader>
          <CardContent>
            <p className='text-center text-sm text-muted-foreground'>
              Você já pode fechar esta janela.
            </p>
          </CardContent>
        </Card>
      </div>
    )
  }

  return (
    <div className='flex min-h-screen flex-col items-center bg-muted/40 p-4 sm:p-6 md:p-8'>
      <Card className='w-full max-w-4xl'>
        <CardHeader className='text-center'>
          <div className='mx-auto mb-4'>
            <Logo />
          </div>
          <CardTitle>Pesquisa de Riscos Psicossociais</CardTitle>
          <CardDescription>
            Sua opinião é importante para nós.
          </CardDescription>
        </CardHeader>
        <CardContent>
          {step === 1 && (
            <div className='space-y-6'>
              <div className='prose prose-sm max-w-none text-justify text-muted-foreground'>
                <p>
                  A [Nome da Empresa] está empenhada em proteger a saúde, a
                  segurança e o bem-estar de seus funcionários. Reconhecemos que
                  o estresse relacionado ao trabalho é uma questão de saúde e
                  segurança e valorizamos a importância de combater suas causas
                  em nosso ambiente de trabalho.
                </p>
                <p>
                  Esta pesquisa foi elaborada para entender como você se sente
                  em relação a vários aspectos das suas condições de trabalho.
                  Suas respostas a este questionário permanecerão{' '}
                  <strong>totalmente anônimas</strong> e apenas os dados em grupo
                  serão apresentados. Elas não serão usadas como uma avaliação
                  do seu trabalho ou de suas capacidades.
                </p>
                <p>
                  O questionário leva cerca de 15 minutos para ser preenchido.
                  Para cada pergunta, marque a opção que melhor reflete sua
                  experiência de trabalho.
                </p>
              </div>
              <Separator />
              <h3 className='font-semibold'>
                Parte 1: Informações Demográficas
              </h3>
              <p className='text-sm text-muted-foreground'>
                Estas informações nos ajudam a entender os resultados em
                diferentes grupos, mas não permitem identificar um indivíduo.
              </p>
              <form
                id='demographics-form'
                className='grid grid-cols-1 gap-4 sm:grid-cols-2'
                onSubmit={(e) => {
                  e.preventDefault()
                  setStep(2)
                }}
              >
                {isLoadingDemographics ? (
                  <div className='sm:col-span-2 flex justify-center items-center h-48'>
                    <Loader2 className='h-8 w-8 animate-spin' />
                  </div>
                ) : (
                  <>
                    <div className='space-y-2'>
                      <Label htmlFor='unit'>Unidade</Label>
                      <Select name='unit' required>
                        <SelectTrigger>
                          <SelectValue placeholder='Selecione sua unidade' />
                        </SelectTrigger>
                        <SelectContent>
                          {units?.map((unit) => (
                            <SelectItem key={unit.id} value={unit.id!}>
                              {unit.name}
                            </SelectItem>
                          ))}
                        </SelectContent>
                      </Select>
                    </div>
                    <div className='space-y-2'>
                      <Label htmlFor='sector'>Setor</Label>
                      <Select name='sector' required>
                        <SelectTrigger>
                          <SelectValue placeholder='Selecione seu setor' />
                        </SelectTrigger>
                        <SelectContent>
                          {allSectors?.map((sector) => (
                            <SelectItem key={sector.id} value={sector.id!}>
                              {sector.name}
                            </SelectItem>
                          ))}
                        </SelectContent>
                      </Select>
                    </div>
                    <div className='space-y-2'>
                      <Label htmlFor='role'>Cargo (Opcional)</Label>
                      <Select name='role'>
                        <SelectTrigger>
                          <SelectValue placeholder='Selecione seu cargo' />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value='na'>
                            Prefiro não informar
                          </SelectItem>
                          {roles?.map((role) => (
                            <SelectItem key={role.id} value={role.id!}>
                              {role.name}
                            </SelectItem>
                          ))}
                        </SelectContent>
                      </Select>
                    </div>
                    <div className='space-y-2'>
                      <Label htmlFor='gender'>Gênero</Label>
                      <Select name='gender' required>
                        <SelectTrigger>
                          <SelectValue placeholder='Selecione seu gênero' />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value='masculino'>Masculino</SelectItem>
                          <SelectItem value='feminino'>Feminino</SelectItem>
                          <SelectItem value='outro'>Outro</SelectItem>
                          <SelectItem value='na'>
                            Prefiro não informar
                          </SelectItem>
                        </SelectContent>
                      </Select>
                    </div>
                    <div className='space-y-2'>
                      <Label htmlFor='age'>Faixa Etária</Label>
                      <Select name='age' required>
                        <SelectTrigger>
                          <SelectValue placeholder='Selecione sua idade' />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value='-25'>Até 25 anos</SelectItem>
                          <SelectItem value='26-35'>26 a 35 anos</SelectItem>
                          <SelectItem value='36-45'>36 a 45 anos</SelectItem>
                          <SelectItem value='46-55'>46 a 55 anos</SelectItem>
                          <SelectItem value='56+'>Mais de 56 anos</SelectItem>
                        </SelectContent>
                      </Select>
                    </div>
                    <div className='space-y-2'>
                      <Label htmlFor='service-time'>Tempo de Serviço</Label>
                      <Select name='service-time' required>
                        <SelectTrigger>
                          <SelectValue placeholder='Selecione seu tempo na empresa' />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value='-1'>Menos de 1 ano</SelectItem>
                          <SelectItem value='1-5'>1 a 5 anos</SelectItem>
                          <SelectItem value='6-10'>6 a 10 anos</SelectItem>
                          <SelectItem value='11-15'>11 a 15 anos</SelectItem>
                          <SelectItem value='15+'>Mais de 15 anos</SelectItem>
                        </SelectContent>
                      </Select>
                    </div>
                  </>
                )}
              </form>
              <div className='flex justify-end pt-4'>
                <Button
                  type='submit'
                  form='demographics-form'
                  disabled={isLoadingDemographics}
                >
                  Iniciar Questionário
                </Button>
              </div>
            </div>
          )}
          {step === 2 && (
            <form onSubmit={handleSubmit}>
              <h3 className='font-semibold mb-4'>
                Parte 2: Questionário
              </h3>
              <div className='space-y-8'>
                {psychosocialSurveyData.map((group) => (
                  <div key={group.id}>
                    <h4 className='font-medium mb-4'>{group.name}</h4>
                    <div className='space-y-6 pl-4 border-l-2'>
                      {group.questions.map((q, index) => (
                        <div key={q.id}>
                          <p className='font-medium text-sm mb-2'>
                            {index + 1}. {q.text}
                          </p>
                          <RadioGroup
                            name={q.id}
                            className='flex flex-wrap gap-x-6 gap-y-2'
                            required
                          >
                            <div className='flex items-center space-x-2'>
                              <RadioGroupItem value='1' id={`${q.id}-1`} />
                              <Label htmlFor={`${q.id}-1`}>Nunca</Label>
                            </div>
                            <div className='flex items-center space-x-2'>
                              <RadioGroupItem value='2' id={`${q.id}-2`} />
                              <Label htmlFor={`${q.id}-2`}>Raramente</Label>
                            </div>
                            <div className='flex items-center space-x-2'>
                              <RadioGroupItem value='3' id={`${q.id}-3`} />
                              <Label htmlFor={`${q.id}-3`}>Às vezes</Label>
                            </div>
                            <div className='flex items-center space-x-2'>
                              <RadioGroupItem value='4' id={`${q.id}-4`} />
                              <Label htmlFor={`${q.id}-4`}>
                                Frequentemente
                              </Label>
                            </div>
                            <div className='flex items-center space-x-2'>
                              <RadioGroupItem value='5' id={`${q.id}-5`} />
                              <Label htmlFor={`${q.id}-5`}>Sempre</Label>
                            </div>
                          </RadioGroup>
                        </div>
                      ))}
                    </div>
                  </div>
                ))}
              </div>
              <div className='flex justify-between items-center mt-8'>
                <Button variant='outline' onClick={() => setStep(1)}>
                  Voltar
                </Button>
                <Button type='submit'>Enviar Respostas</Button>
              </div>
            </form>
          )}
        </CardContent>
      </Card>
    </div>
  )
}

export default function SurveyPage() {
  return (
    <Suspense fallback={
      <div className='flex min-h-screen flex-col items-center justify-center bg-muted/40 p-4'>
        <Loader2 className='h-8 w-8 animate-spin' />
      </div>
    }>
      <SurveyContent />
    </Suspense>
  )
}
