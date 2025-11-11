
'use client'

import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { ArrowLeft } from 'lucide-react'
import Link from 'next/link'
import { useParams, useSearchParams } from 'next/navigation'
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
  ReferenceLine,
} from 'recharts'
import {
  ChartContainer,
  ChartTooltip,
  ChartTooltipContent,
  ChartConfig,
} from '@/components/ui/chart'
import { Separator } from '@/components/ui/separator'
import { psychosocialSurveyData } from '../data'

// SIMULATED DATA: In a real app, this would come from your database
// Simulating 50 employees responding
const generateMockResponses = () => {
  const responses: { [key: string]: number[] } = {}
  psychosocialSurveyData.forEach((group) => {
    group.questions.forEach((question) => {
      responses[question.id] = Array.from({ length: 50 }, () =>
        Math.floor(Math.random() * 5 + 1)
      )
    })
  })
  return responses
}

const mockResponses = generateMockResponses()

// ANALYSIS LOGIC
const calculateScores = () => {
  return psychosocialSurveyData.map((group) => {
    const questionIds = group.questions.map((q) => q.id)
    const totalScores = questionIds.reduce((sum, qId) => {
      const questionScores = mockResponses[qId] || []
      const questionSum = questionScores.reduce((acc, score) => acc + score, 0)
      return sum + questionSum
    }, 0)
    const totalResponses = questionIds.reduce(
      (count, qId) => count + (mockResponses[qId]?.length || 0),
      0
    )
    const averageScore = totalResponses > 0 ? totalScores / totalResponses : 0
    return {
      name: group.name,
      score: averageScore,
    }
  })
}

const chartData = calculateScores()

const chartConfig = {
  score: {
    label: 'Pontuação Média',
    color: 'hsl(var(--primary))',
  },
  '25th': {
    label: 'Percentil 25 (Benchmark)',
    color: 'hsl(var(--destructive))',
  },
  '75th': {
    label: 'Percentil 75 (Benchmark)',
    color: 'hsl(var(--accent))',
  },
} satisfies ChartConfig

const domainText = {
  'Demandas do Trabalho':
    'Este domínio refere-se a aspectos do trabalho como carga de trabalho, padrões de trabalho e ambiente de trabalho. Organizações com bom desempenho nesta área provavelmente têm prazos alcançáveis, demandas adequadas em relação às horas de trabalho e sistemas para responder às preocupações individuais.',
  'Organização do Trabalho':
    'Refere-se ao quanto uma pessoa tem a dizer sobre a forma como faz seu trabalho. Organizações com bom desempenho nesta área provavelmente incentivam a autonomia e a iniciativa, com sistemas claros para que os funcionários influenciem seus próprios padrões de trabalho.',
  'Relacionamentos Interpessoais e Liderança':
    'Este domínio inclui o encorajamento e o apoio fornecidos pelos colegas. Organizações com bom desempenho aqui provavelmente têm equipes prestativas e compassivas, com sistemas que facilitam o respeito e o apoio mútuo.',
  'Conflito Trabalho-Família':
    'Isso inclui a promoção de um trabalho positivo para evitar conflitos e lidar com comportamentos inaceitáveis. Organizações com bom desempenho nesta área provavelmente promovem um trabalho positivo e lidam eficazmente com conflitos e comportamentos inaceitáveis.',
  'Insegurança no Emprego':
    'Como a mudança organizacional (grande ou pequena) é gerenciada e comunicada na organização. Organizações com bom desempenho nesta área provavelmente têm sistemas de gestão de mudanças eficazes que garantem que a mudança seja consultada, implementada de forma ponderada e bem comunicada.',
  'Valores no Trabalho':
    'Se as pessoas entendem seu papel na organização e se a organização garante que elas não tenham papéis conflitantes. Organizações com bom desempenho nesta área provavelmente promovem deveres, metas e responsabilidades claras e têm sistemas para lidar com conflitos de papéis.',
  'Assédio Moral':
    'Refere-se ao incentivo, patrocínio e recursos fornecidos pela organização e pela gestão de linha. Organizações com bom desempenho nesta área provavelmente têm sistemas claros que permitem e incentivam os gestores a apoiar sua equipe e fornecer feedback regular e construtivo.',
}

export default function PsychosocialResultsPage() {
  const params = useParams()
  const contractId = params.contractId as string
  const searchParams = useSearchParams()
  const surveyId = searchParams.get('surveyId')

  // Map the correct text based on group name
  const domainTextMap: { [key: string]: string } = {
    "Demandas do Trabalho": domainText["Demandas do Trabalho"],
    "Organização do Trabalho": domainText["Organização do Trabalho"],
    "Relacionamentos Interpessoais e Liderança": domainText["Relacionamento"],
    "Conflito Trabalho-Família": domainText["Conflito Trabalho-Família"],
    "Insegurança no Emprego": domainText["Insegurança no Emprego"],
    "Valores no Trabalho": domainText["Valores no Trabalho"],
    "Assédio Moral": domainText["Assédio Moral"],
  };


  return (
    <div className='grid flex-1 auto-rows-max gap-8'>
      <div className='flex items-center gap-4'>
        <Button asChild variant='outline' size='icon' className='h-7 w-7'>
          <Link href={`/dashboard/clients/${contractId}/psychosocial`}>
            <ArrowLeft className='h-4 w-4' />
            <span className='sr-only'>Voltar</span>
          </Link>
        </Button>
        <div>
          <h1 className='text-2xl font-bold tracking-tight'>
            Sumário Executivo dos Riscos Psicossociais
          </h1>
          <p className='text-muted-foreground'>
            Resultados da pesquisa: {surveyId || 'Avaliação Anual 2023'}
          </p>
        </div>
      </div>

      <Card>
        <CardHeader>
          <CardTitle>Resultados Gerais por Domínio</CardTitle>
          <CardDescription>
            Pontuação média para cada um dos 7 fatores de estresse, comparados
            com o benchmark do setor. As pontuações variam de 1 (ruim) a 5
            (desejável).
          </CardDescription>
        </CardHeader>
        <CardContent>
          <ChartContainer
            config={chartConfig}
            className='min-h-[400px] w-full'
          >
            <BarChart
              data={chartData}
              layout='vertical'
              margin={{ left: 20, right: 40 }}
            >
              <CartesianGrid horizontal={false} />
              <YAxis
                dataKey='name'
                type='category'
                tickLine={false}
                axisLine={false}
                tickMargin={10}
                width={120}
              />
              <XAxis dataKey='score' type='number' domain={[1, 5]} />
              <ChartTooltip
                cursor={{ fill: 'hsl(var(--muted))' }}
                content={<ChartTooltipContent />}
              />
              <Bar dataKey='score' radius={4}>
                {chartData.map((entry, index) => (
                  <ReferenceLine
                    key={`label-${index}`}
                    y={entry.name}
                    stroke='transparent'
                    label={{
                      position: 'insideRight',
                      value: entry.score.toFixed(2),
                      fill: 'white',
                      fontSize: 12,
                      fontWeight: 'bold',
                    }}
                  />
                ))}
              </Bar>
              <ReferenceLine
                y={0}
                stroke='hsl(var(--destructive))'
                strokeDasharray='3 3'
                label={{
                  position: 'insideTopRight',
                  value: 'Percentil 25',
                  fill: 'hsl(var(--destructive))',
                  fontSize: 12,
                }}
              />
              <ReferenceLine
                y={0}
                stroke='hsl(var(--accent))'
                strokeDasharray='3 3'
                label={{
                  position: 'insideBottomRight',
                  value: 'Percentil 75',
                  fill: 'hsl(var(--accent))',
                  fontSize: 12,
                }}
              />
            </BarChart>
          </ChartContainer>
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle>Análise Detalhada dos Domínios</CardTitle>
          <CardDescription>
            Interpretação dos resultados para cada fator de estresse e
            recomendações.
          </CardDescription>
        </CardHeader>
        <CardContent className='space-y-6'>
          {chartData.map((item) => (
            <div key={item.name}>
              <h3 className='font-semibold text-lg'>{item.name}</h3>
              <p className='text-muted-foreground mt-1 text-sm'>
                {domainTextMap[item.name]}
              </p>
              <div className='mt-3 rounded-lg border bg-muted/30 p-4 space-y-2'>
                <p className='text-sm font-medium'>
                  Sua pontuação: {item.score.toFixed(2)}
                </p>
                <p className='text-sm text-muted-foreground'>
                  [Análise gerada por IA sobre o desempenho e recomendação de
                  ações aparecerá aqui...]
                </p>
              </div>
              <Separator className='mt-6' />
            </div>
          ))}
        </CardContent>
      </Card>
    </div>
  )
}
