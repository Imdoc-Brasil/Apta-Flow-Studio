
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
import { ArrowLeft, BrainCircuit, Loader2 } from 'lucide-react'
import Link from 'next/link'
import { useParams, useSearchParams } from 'next/navigation'
import Image from 'next/image'
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  ResponsiveContainer,
  ReferenceLine,
  CartesianGrid,
  Cell,
  LabelList,
} from 'recharts'
import {
  ChartConfig,
  ChartContainer,
  ChartTooltip,
  ChartTooltipContent,
} from '@/components/ui/chart'
import { Separator } from '@/components/ui/separator'
import {
  psychosocialSurveyData,
  type PsychosocialSurvey,
  type PsychosocialStressorGroup,
} from '@/app/dashboard/(main)/clients/[contractId]/psychosocial/data'
import { Logo } from '@/components/logo'
import { useSurveyStore } from '@/app/dashboard/(main)/clients/[contractId]/psychosocial/psychosocial-store'
import { useMemo } from 'react'
import { cn } from '@/lib/utils'
import { useDoc, useFirestore, useMemoFirebase } from '@/firebase'
import { doc } from 'firebase/firestore'

// --- DYNAMIC ANALYSIS LOGIC ---

// Helper function to calculate scores based on stored responses
const calculateScoresFromResponses = (
  responses: { [key: string]: number },
  domains: PsychosocialStressorGroup[]
) => {
  const domainScores: { [key: string]: number[] } = {}

  // Initialize arrays for each domain
  domains.forEach((domain) => {
    domainScores[domain.name] = []
  })

  // Group scores by domain, assuming a single respondent for simplicity in this prototype
  const respondentIds = [
    ...new Set(Object.keys(responses).map((key) => key.split('-')[1])),
  ]

  respondentIds.forEach((respondentId) => {
    domains.forEach((domain) => {
      let domainTotal = 0
      let questionCount = 0
      domain.questions.forEach((question: any) => {
        const responseKey = `${question.id}-${respondentId}`
        if (responses[responseKey] !== undefined) {
          domainTotal += responses[responseKey]
          questionCount++
        }
      })
      if (questionCount > 0) {
        domainScores[domain.name].push(domainTotal / questionCount)
      }
    })
  })

  // Calculate average for each domain
  const finalScores = Object.keys(domainScores).map((domainName) => {
    const scores = domainScores[domainName]
    const averageScore =
      scores.length > 0
        ? scores.reduce((acc, val) => acc + val, 0) / scores.length
        : 0
    return {
      name: domainName,
      yourScore: parseFloat(averageScore.toFixed(2)),
    }
  })

  return finalScores
}

const calculateQuestionDetailsFromResponses = (
  responses: { [key: string]: number },
  domains: PsychosocialStressorGroup[]
) => {
  const details: {
    [domainId: string]: {
      domainName: string
      overallScore: number
      questions: {
        id: string
        text: string
        mean: number
        distribution: { name: string; value: number }[]
      }[]
    }
  } = {}

  domains.forEach((domain) => {
    let domainTotalMean = 0
    let questionCountInDomain = 0

    const questionDetails = domain.questions.map((question: any) => {
      // Find all responses for this question across all respondents
      const questionResponses = Object.entries(responses)
        .filter(([key]) => key.startsWith(question.id))
        .map(([, value]) => value)

      const mean =
        questionResponses.length > 0
          ? questionResponses.reduce((a, b) => a + b, 0) /
            questionResponses.length
          : 0
      if (mean > 0) {
        domainTotalMean += mean
        questionCountInDomain++
      }

      const totalResponses = questionResponses.length || 1 // Avoid division by zero

      const unfavourable =
        (questionResponses.filter((r) => r <= 2).length / totalResponses) * 100
      const neutral =
        (questionResponses.filter((r) => r === 3).length / totalResponses) *
        100
      const favourable =
        (questionResponses.filter((r) => r >= 4).length / totalResponses) *
        100

      return {
        id: question.id,
        text: question.text,
        mean: parseFloat(mean.toFixed(2)),
        distribution: [
          { name: 'Unfavourable', value: unfavourable },
          { name: 'Neutral', value: neutral },
          { name: 'Favourable', value: favourable },
        ],
      }
    })

    const overallScore =
      questionCountInDomain > 0 ? domainTotalMean / questionCountInDomain : 0

    details[domain.id] = {
      domainName: domain.name,
      overallScore: parseFloat(overallScore.toFixed(2)),
      questions: questionDetails,
    }
  })
  return details
}
// --- END DYNAMIC ANALYSIS LOGIC ---

const domainChartConfig = {
  yourScore: {
    label: 'Sua Pontuação',
    color: 'hsl(var(--primary))',
  },
} satisfies ChartConfig

const questionChartConfig = {
  Unfavourable: {
    label: 'Desfavorável',
    color: 'hsl(var(--destructive))',
  },
  Neutral: {
    label: 'Neutra',
    color: 'hsl(var(--chart-2))',
  },
  Favourable: {
    label: 'Favorável',
    color: 'hsl(var(--chart-1))',
  },
} satisfies ChartConfig

const domainTextMap: { [key: string]: string } = {
  'Demandas do Trabalho':
    'Este domínio refere-se a aspectos do trabalho como carga de trabalho, padrões de trabalho e ambiente de trabalho. Organizações com bom desempenho nesta área são propensas a ter prazos alcançáveis, demandas adequadas em relação às horas de trabalho e sistemas para responder a preocupações individuais.',
  'Organização do Trabalho':
    'Refere-se ao quanto uma pessoa tem a dizer sobre a forma como faz seu trabalho. Organizações com bom desempenho nesta área provavelmente incentivam a autonomia e a iniciativa, com sistemas claros para que os funcionários influenciem seus próprios padrões de trabalho.',
  'Apoio da Liderança':
    'Este domínio inclui o encorajamento e o apoio fornecidos pela gestão. Organizações com bom desempenho aqui provavelmente têm sistemas claros que permitem e incentivam os gestores a apoiar sua equipe e fornecer feedback regular e construtivo.',
  'Apoio dos Colegas':
    'Este domínio inclui o encorajamento, o patrocínio e os recursos fornecidos pelos colegas. Organizações com bom desempenho nesta área provavelmente têm equipes prestativas e compassivas, com sistemas que facilitam o respeito e o apoio mútuo.',
  'Relacionamentos e Interações Pessoais':
    'Isto inclui a promoção de um trabalho positivo para evitar conflitos e lidar com comportamentos inaceitáveis. Organizações com bom desempenho nesta área provavelmente promovem um trabalho positivo e lidam eficazmente com conflitos e comportamentos inaceitáveis.',
  'Papel no Trabalho':
    'Se as pessoas entendem seu papel na organização e se a organização garante que elas não tenham papéis conflitantes. Organizações com bom desempenho nesta área provavelmente promovem deveres, metas e responsabilidades claras e têm sistemas para lidar com conflitos de papéis.',
  'Mudanças Organizacionais':
    'Como a mudança organizacional (grande ou pequena) é gerenciada e comunicada na organização. Organizações com bom desempenho nesta área provavelmente têm sistemas de gestão de mudanças eficazes que garantem que a mudança seja consultada, implementada de forma ponderada e bem comunicada.',
}

function ReportCover({
  clientName,
  unitName,
  creationDate,
}: {
  clientName?: string
  unitName?: string
  creationDate?: string
}) {
  return (
    <div className='bg-background mb-8 overflow-hidden rounded-lg border shadow-lg'>
      {/* Top Section */}
      <div className='flex h-[400px]'>
        <div className='w-20 bg-primary'></div>
        <div className='flex flex-1 flex-col p-12'>
          <div className='flex items-start justify-end'>
            <Logo />
          </div>
          <div className='flex-grow flex flex-col justify-center'>
            <h1 className='font-headline text-4xl font-bold'>
              Relatório de Avaliação Preliminar de Riscos Psicossociais
            </h1>
            <p className='text-sm text-muted-foreground mt-2'>
              De acordo com a NR-01, Portaria MTE nº 1.419, publicada em 27 de
              agosto de 2024.
            </p>
            <h2 className='text-3xl text-muted-foreground mt-6'>
              {clientName} - {unitName}
            </h2>
            <p className='mt-6 text-muted-foreground'>
              Data de Realização da Pesquisa:{' '}
              {creationDate
                ? new Date(creationDate).toLocaleDateString('pt-BR', {
                    timeZone: 'UTC',
                  })
                : '[Data de Realização]'}
            </p>
          </div>
        </div>
      </div>
      {/* Bottom Section */}
      <div className='flex h-[400px] items-center justify-center bg-primary p-12'>
        <div className='relative flex h-64 w-64 items-center justify-center rounded-full bg-background'>
          <BrainCircuit className='h-40 w-40 text-primary' />
        </div>
      </div>
    </div>
  )
}

export default function PsychosocialResultsPage() {
  const params = useParams()
  const contractId = params.contractId as string
  const searchParams = useSearchParams()
  const surveyId = searchParams.get('surveyId')
  const firestore = useFirestore();

  const surveyRef = useMemoFirebase(
    () => (firestore && surveyId ? doc(firestore, `clients/${contractId}/psychosocial_surveys`, surveyId) : null),
    [firestore, contractId, surveyId]
  )

  const { data: survey, isLoading } = useDoc<PsychosocialSurvey>(surveyRef)


  // Get responses from the store
  const { responses } = useSurveyStore()

  // Calculate analysis data based on stored responses
  const domainAnalysisData = useMemo(
    () => calculateScoresFromResponses(responses, psychosocialSurveyData),
    [responses]
  )

  const detailedAnalysisData = useMemo(
    () =>
      calculateQuestionDetailsFromResponses(responses, psychosocialSurveyData),
    [responses]
  )

  const numConvidado = 50 // This can be made dynamic later
  const numRespostas = useMemo(() => {
    // A simple way to estimate number of respondents
    if (!Object.keys(responses).length) return 0
    const respondentIds = new Set(
      Object.keys(responses).map((key) => key.split('-')[1])
    )
    return respondentIds.size
  }, [responses])

  const benchmarkData: { [key: string]: number } = {
    'Demandas do Trabalho': 3.34,
    'Organização do Trabalho': 3.75,
    'Apoio da Liderança': 3.86,
    'Apoio dos Colegas': 4.13,
    'Relacionamentos e Interações Pessoais': 4.31,
    'Papel no Trabalho': 4.09,
    'Mudanças Organizacionais': 3.1,
  }
  
  if (isLoading) {
    return <div className='flex items-center justify-center h-full'><Loader2 className='h-8 w-8 animate-spin' /></div>
  }

  return (
    <div className='grid flex-1 auto-rows-max gap-8'>
      <div className='flex items-center gap-4'>
        <Button asChild variant='outline' size='icon' className='h-7 w-7'>
          <Link href={`/dashboard/clients/${contractId}/psychosocial`}>
            <ArrowLeft className='h-4 w-4' />
            <span className='sr-only'>Voltar</span>
          </Link>
        </Button>
      </div>

      <ReportCover
        clientName={survey?.clientName}
        unitName={survey?.unit}
        creationDate={survey?.creationDate}
      />

      <Card>
        <CardHeader>
          <CardTitle className='font-headline text-3xl'>
            Resumo Executivo
          </CardTitle>
        </CardHeader>
        <CardContent className='space-y-6 text-sm text-muted-foreground'>
          <p>
            Este Relatório do(a) <strong>{survey?.circumstances}</strong> contém
            os resultados da Pesquisa realizada pela{' '}
            <strong>{survey?.clientName}</strong> na(s) sua(s) unidade(s):{' '}
            <strong>{survey?.unit}</strong>.
          </p>
          <p>
            Esta pesquisa investigou as percepções sobre o trabalho do ponto de
            vista dos seus colaboradores. <strong>{numConvidado}</strong> foram
            convidados a responder à pesquisa e <strong>{numRespostas}</strong>{' '}
            concluíram o envio das respostas. Consulte o Apêndice A para um
            resumo dos detalhes [vamos criar posteriormente os Apêndices].
          </p>
          <p>
            A ferramenta de{' '}
            <strong>
              Avaliação de Riscos Psicossociais Relacionados ao Trabalho (ARPT)
            </strong>{' '}
            foi desenvolvida pela <strong>AptaFlow</strong> para medir as
            atitudes e percepções da força de trabalho sobre aspectos do
            trabalho que são conhecidos por estarem associados ao estresse
            relacionado ao trabalho. A <strong>ARPT</strong> faz parte dos
            Padrões de Gerenciamento de Riscos Psicossociais Relacionados ao
            Trabalho da <strong>ARPT</strong>, que são a abordagem de avaliação
            de risco da <strong>AptaFlow</strong> para ajudar os empregadores a
            gerenciar as causas do estresse no local de trabalho.
          </p>
          <p>
            A <strong>AptaFlow</strong> defende o uso da <strong>ARPT</strong> no
            Programa de Gerenciamento de Risco (PGR), como uma fonte de dados
            que pode ser usada para identificar a extensão em que o estresse
            relacionado ao trabalho é um problema na empresa avaliada.
          </p>
          <p>
            Este relatório resume as respostas fornecidas pelos colaboradores e
            permitirá que a empresa <strong>{survey?.clientName}</strong> se
            concentre nas áreas prioritárias e faça melhorias direcionadas.
          </p>
          <div className='space-y-4 pt-4'>
            <h3 className='font-headline text-lg font-bold text-foreground'>
              Como os resultados são apresentados
            </h3>
            <p>
              O sistema de pontuação usado na pesquisa <strong>ARPT</strong> foi
              baseado em uma escala de 5 pontos. O sistema de pontuação é
              complexo, pois algumas escalas e itens são pontuados inversamente
              na ferramenta por razões psicométricas. Para auxiliar sua
              interpretação significativa, os resultados foram agrupados em três
              categorias: respostas favoráveis, neutras e desfavoráveis,
              apresentadas como porcentagens de respondentes. A categoria neutra
              contém respostas que pontuaram 3, onde as opções de resposta eram
              &apos;às vezes&apos; ou &apos;neutro&apos;. As categorias favorável e desfavorável
              combinam as duas respostas em ambos os lados da escala. Por
              exemplo, para o item &apos;Eu posso decidir quando fazer uma pausa&apos;, as
              respostas &apos;Frequentemente&apos; e &apos;Sempre&apos; são combinadas para produzir
              a porcentagem de respondentes que deram uma resposta favorável,
              enquanto as respostas &apos;Nunca&apos; e &apos;Raramente&apos; são combinadas para
              produzir a porcentagem de respondentes que deram uma resposta
              desfavorável. No entanto, para as pontuações de Relacionamentos,
              estas são apresentadas como categorias de resposta em vez de
              favorável/desfavorável. Isso ocorre porque, se os respondentes
              responderem &quot;às vezes&quot; às perguntas neste domínio, isso pode
              indicar a presença de bullying ou assédio, e qualquer relato de
              tais comportamentos deve ser considerado sério pela organização.
            </p>
            <p>
              No primeiro gráfico abaixo, que resume o desempenho geral da sua
              organização, todas as pontuações são apresentadas de forma que uma
              pontuação alta indique características de trabalho saudáveis ​​e
              uma pontuação baixa indique características de trabalho menos
              saudáveis. Portanto, uma pontuação baixa pode indicar que é
              necessário fazer melhorias para proteger a saúde e o bem-estar da
              sua força de trabalho.
            </p>
            <p>
              É útil revisar a pontuação da sua organização para cada domínio em
              relação aos benchmarks de uma amostra comparativa de 17.286
              respondentes de 123 avaliações do setor privado da União Europeia,
              optamos por usar esses dados, por alguns motivos. O primeiro é
              pela ausência de informações e indicadores de riscos psicossociais
              do setor privado no Brasil e América Latina, outro é por que o
              Reino Unido e a União Europeia possuem a maior pesquisa e o maior
              banco de dados desses indicadores.
            </p>
            <p>
              No entanto, é importante observar que os Padrões de Gestão são
              projetados como padrões em relação aos quais as organizações devem
              buscar atingir uma pontuação de cinco para cada domínio. Portanto,
              o desempenho em relação aos benchmarks deve ser analisado com
              cautela, e qualquer domínio para o qual o desempenho seja inferior
              a cinco indica uma área potencial para melhoria.
            </p>
            <p>
              Observe que pontuações que indicam desempenho razoável/bom ainda
              podem incluir áreas com desempenho inferior.
            </p>
            <p>
              Revisar seus dados com uma análise mais detalhada (ou seja, por
              diferentes categorias demográficas) e realizar grupos focais pode
              ajudá-lo a explorar e validar suas pontuações com mais
              profundidade.
            </p>
            <p>
              Para obter mais informações sobre os dados de referência, consulte:
              Edwards, J.A., & Webster, S. (2012).
            </p>
          </div>

          <div className='space-y-4 pt-4'>
            <h3 className='font-headline text-lg font-bold text-foreground'>
              Principais Conclusões
            </h3>
            <p>
              O gráfico a seguir mostra as pontuações médias da empresa{' '}
              <strong>{survey?.clientName}</strong> para cada um dos domínios,
              em comparação com os benchmarks do setor privado. A linha vermelha
              indica a pontuação do 25º percentil e a linha verde indica a
              pontuação do 75º percentil para a amostra comparativa. Isso
              significa que, em comparação com os benchmarks, as organizações
              com pontuação abaixo da linha vermelha tiveram um desempenho
              inferior a 75% das organizações; as organizações com pontuação
              entre as linhas vermelha e verde ficaram entre os 50%
              intermediários das organizações. As pontuações acima da linha
              verde são melhores do que 75% das organizações.
            </p>
            <ul className='list-disc space-y-2 pl-5'>
              <li>
                <strong>Demandas do Trabalho:</strong> inclui questões como carga
                de trabalho, padrões de trabalho e ambiente de trabalho.
              </li>
              <li>
                <strong>Organização do Trabalho:</strong> refere-se ao quanto a
                pessoa tem influência sobre a maneira como realiza seu trabalho.
              </li>
              <li>
                <strong>Apoio da Liderança e dos Colegas:</strong> inclui o
                incentivo, apoio e os recursos fornecidos pela empresa, pela
                gestão direta e pelos colegas.
              </li>
              <li>
                <strong>Relacionamentos e Interações Pessoais:</strong> inclui a
                promoção de um ambiente de trabalho positivo para evitar
                conflitos e lidar com comportamentos inaceitáveis.
              </li>
              <li>
                <strong>Papel no Trabalho:</strong> se as pessoas entendem seu
                papel dentro da organização e se a organização garante que elas
                não tenham papéis conflitantes.
              </li>
              <li>
                <strong>Mudanças Organizacionais:</strong> como uma mudança
                organizacional (grande ou pequena) é gerenciada e comunicada na
                organização.
              </li>
            </ul>
            <p className='pt-2'>As opções variam de 1 (ruim) a 5 (desejável).</p>
          </div>

          <div className='h-[400px] w-full pt-8'>
            <ChartContainer
              config={domainChartConfig}
              className='w-full h-full'
            >
              <BarChart
                data={domainAnalysisData}
                margin={{ top: 20, right: 30, left: 20, bottom: 80 }}
              >
                <CartesianGrid vertical={false} />
                <XAxis
                  dataKey='name'
                  tick={{ fontSize: 10 }}
                  angle={-45}
                  textAnchor='end'
                  interval={0}
                />
                <YAxis domain={[1, 5]} />
                <ChartTooltip content={<ChartTooltipContent />} />
                <Bar
                  dataKey='yourScore'
                  fill='var(--color-yourScore)'
                  radius={4}
                />
              </BarChart>
            </ChartContainer>
          </div>
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle>Análise Detalhada dos Domínios</CardTitle>
          <CardDescription>
            Interpretação dos resultados para cada fator de estresse e
            recomendações. As pontuações variam de 1 (ruim) a 5 (desejável).
          </CardDescription>
        </CardHeader>
        <CardContent className='space-y-12'>
          {Object.values(detailedAnalysisData).map((domain) => (
            <Card key={domain.domainName}>
              <CardHeader>
                <h3 className='font-headline text-2xl font-semibold'>
                  {domain.domainName}
                </h3>
              </CardHeader>
              <CardContent>
                <p className='text-muted-foreground mt-2 text-sm leading-relaxed'>
                  {domainTextMap[domain.domainName]}
                </p>
                <p className='text-muted-foreground mt-4 text-sm leading-relaxed'>
                  Os resultados para a empresa{' '}
                  <strong>{survey?.clientName}</strong> na pesquisa atual são
                  apresentados abaixo:
                </p>

                <div className='mt-6 rounded-lg border bg-muted/30 p-6 space-y-6'>
                  <div className='grid grid-cols-[1fr_80px] items-center gap-4 text-sm font-semibold'>
                    <h4>{domain.domainName} Geral</h4>
                    <div className='text-right text-lg'>
                      {domain.overallScore.toFixed(2)}
                    </div>
                  </div>
                  {domain.questions.map((q, index) => (
                    <div
                      key={q.id}
                      className='grid grid-cols-[1fr_80px] items-center gap-4'
                    >
                      <div className='text-sm'>
                        {index + 1}. {q.text}
                      </div>
                      <div className='text-right font-bold text-lg'>
                        {q.mean.toFixed(2)}
                      </div>
                      <div className='col-span-2'>
                        <ChartContainer
                          config={questionChartConfig}
                          className='h-6 w-full'
                        >
                          <BarChart
                            layout='vertical'
                            data={[
                              {
                                name: q.text,
                                ...q.distribution.reduce(
                                  (acc, cur) => ({
                                    ...acc,
                                    [cur.name]: cur.value,
                                  }),
                                  {}
                                ),
                              },
                            ]}
                            stackOffset='expand'
                          >
                            <XAxis type='number' hide domain={[0, 100]} />
                            <YAxis type='category' dataKey='name' hide />
                            <Bar
                              dataKey='Unfavourable'
                              fill='var(--color-Unfavourable)'
                              stackId='a'
                              radius={[4, 0, 0, 4]}
                            />
                            <Bar
                              dataKey='Neutral'
                              fill='var(--color-Neutral)'
                              stackId='a'
                            />
                            <Bar
                              dataKey='Favourable'
                              fill='var(--color-Favourable)'
                              stackId='a'
                              radius={[0, 4, 4, 0]}
                            />
                          </BarChart>
                        </ChartContainer>
                      </div>
                    </div>
                  ))}
                </div>

                <Separator className='my-8' />

                <p className='text-sm text-muted-foreground italic text-center'>
                  Seus aspectos mais favoráveis ​​e desfavoráveis ​​em relação
                  às suas {domain.domainName} são apresentados abaixo. Essas
                  afirmações são identificadas de forma comparativa. Portanto,
                  recomenda-se que as pontuações sejam interpretadas dentro do
                  contexto. Por exemplo, as afirmações com as pontuações mais
                  altas ainda podem representar áreas de fragilidade se essas
                  pontuações forem relativamente baixas. Em contrapartida, as
                  afirmações com as pontuações mais baixas podem ter pontuações
                  relativamente altas.
                </p>

                <Separator className='my-8' />

                <div className='mt-8'>
                  <h4 className='font-semibold text-lg'>
                    Seu desempenho no contexto
                  </h4>
                  <p className='text-sm text-muted-foreground mt-2'>
                    O gráfico a seguir mostra sua pontuação média para{' '}
                    {domain.domainName} em comparação com os parâmetros de
                    referência para o setor privado. A linha vermelha indica a
                    pontuação do 25º percentil e a linha verde indica a
                    pontuação do 75º percentil para a amostra comparativa.
                  </p>
                  <div className='h-40 w-full pt-4'>
                    <ChartContainer config={{}} className='h-full w-full'>
                      <BarChart
                        layout='vertical'
                        data={[
                          {
                            name: 'Score',
                            yourScore: domain.overallScore,
                            benchmark: benchmarkData[domain.domainName] || 0,
                          },
                        ]}
                      >
                        <CartesianGrid horizontal={false} />
                        <XAxis
                          type='number'
                          domain={[1, 5]}
                          ticks={[1, 2, 3, 4, 5]}
                        />
                        <YAxis dataKey='name' type='category' hide />
                        <ChartTooltip
                          cursor={false}
                          content={<ChartTooltipContent hideLabel />}
                        />
                        <ReferenceLine
                          x={3.0}
                          stroke='orange'
                          strokeDasharray='3 3'
                        />
                        <ReferenceLine
                          x={benchmarkData[domain.domainName]}
                          stroke='red'
                          strokeDasharray='3 3'
                        />
                        <ReferenceLine
                          x={4.0}
                          stroke='green'
                          strokeDasharray='3 3'
                        />
                        <Bar
                          dataKey='yourScore'
                          fill='hsl(var(--primary))'
                          radius={4}
                        >
                          <LabelList
                            dataKey='yourScore'
                            position='right'
                            offset={10}
                            className='fill-foreground'
                            fontSize={12}
                          />
                          <LabelList
                            dataKey='benchmark'
                            position='insideBottom'
                            offset={20}
                            className='fill-muted-foreground text-xs'
                            formatter={() =>
                              `BM: ${benchmarkData[domain.domainName]}`
                            }
                          />
                        </Bar>
                      </BarChart>
                    </ChartContainer>
                  </div>
                  <p className='text-sm text-muted-foreground mt-4'>
                    O domínio {domain.domainName} refere-se a aspectos do
                    trabalho como carga de trabalho, padrões de trabalho e
                    ambiente de trabalho. Organizações com bom desempenho nessa
                    área provavelmente têm prazos alcançáveis, demandas adequadas
                    em relação à carga horária e sistemas implementados para
                    responder a preocupações individuais. Sua pontuação em{' '}
                    {domain.domainName} está acima do 75º percentil, o que
                    sugere que a percepção dos seus funcionários sobre a carga de
                    trabalho, os padrões de trabalho e o ambiente de trabalho é
                    mais positiva do que a de 75% das organizações na amostra
                    comparativa. Embora ainda possam existir pontos de risco
                    nessa área, sua pontuação geral em {domain.domainName}{' '}
                    indica que sua organização está tendo um bom desempenho no
                    cumprimento dos Padrões de Gestão.
                  </p>
                </div>
              </CardContent>
              <CardFooter>
                <div className='flex justify-center w-full gap-8 text-xs'>
                  <div className='flex items-center gap-2'>
                    <span className='w-3 h-3 rounded-sm bg-destructive' />
                    <span>Desfavorável</span>
                  </div>
                  <div className='flex items-center gap-2'>
                    <span className='w-3 h-3 rounded-sm bg-chart-2' />
                    <span>Neutra</span>
                  </div>
                  <div className='flex items-center gap-2'>
                    <span className='w-3 h-3 rounded-sm bg-chart-1' />
                    <span>Favorável</span>
                  </div>
                </div>
              </CardFooter>
            </Card>
          ))}
        </CardContent>
      </Card>
    </div>
  )
}
