
'use client'

import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { ArrowLeft, BrainCircuit } from 'lucide-react'
import Link from 'next/link'
import { useParams, useSearchParams } from 'next/navigation'
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  Tooltip,
  ResponsiveContainer,
  ReferenceLine,
  CartesianGrid,
} from 'recharts'
import {
  ChartContainer,
  ChartTooltip,
  ChartTooltipContent,
  ChartConfig,
} from '@/components/ui/chart'
import { Separator } from '@/components/ui/separator'
import { psychosocialSurveyData, initialSurveys } from '../data'
import { Logo } from '@/components/logo'

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

// ANALYSIS LOGIC & BENCHMARK DATA
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

    let benchmark25 = 3.5
    let benchmark75 = 4.5

    // Using example benchmarks from the provided image
    if (group.name.includes('Demand')) benchmark25 = 3.34
    if (group.name.includes('Control')) benchmark75 = 3.75

    return {
      name: group.name,
      yourScore: parseFloat(averageScore.toFixed(2)),
      benchmark25: benchmark25,
      benchmark75: benchmark75,
    }
  })
}

const analysisData = calculateScores()

const chartConfig = {
  yourScore: {
    label: 'Sua Pontuação',
    color: 'hsl(var(--primary))',
  },
  benchmark: {
    label: 'Benchmark',
    color: 'hsl(var(--muted-foreground))',
  },
} satisfies ChartConfig

const domainTextMap: { [key: string]: string } = {
  'Demandas do Trabalho':
    'Este domínio refere-se a aspectos do trabalho como carga de trabalho, padrões de trabalho e ambiente de trabalho. Organizações com bom desempenho nesta área são propensas a ter prazos alcançáveis, demandas adequadas em relação às horas de trabalho e sistemas para responder a preocupações individuais.',
  'Organização do Trabalho':
    'Refere-se ao quanto uma pessoa tem a dizer sobre a forma como faz seu trabalho. Organizações com bom desempenho nesta área provavelmente incentivam a autonomia e a iniciativa, com sistemas claros para que os funcionários influenciem seus próprios padrões de trabalho.',
  'Relacionamentos Interpessoais e Liderança':
    'Este domínio inclui o encorajamento e o apoio fornecidos pela gestão e pelos colegas. Organizações com bom desempenho aqui provavelmente têm equipes prestativas e compassivas, com sistemas que facilitam o respeito e o apoio mútuo.',
  'Conflito Trabalho-Família':
    'Isto inclui a promoção de um trabalho positivo para evitar conflitos e lidar com comportamentos inaceitáveis. Organizações com bom desempenho nesta área provavelmente promovem um trabalho positivo e lidam eficazmente com conflitos e comportamentos inaceitáveis.',
  'Insegurança no Emprego':
    'Como a mudança organizacional (grande ou pequena) é gerenciada e comunicada na organização. Organizações com bom desempenho nesta área provavelmente têm sistemas de gestão de mudanças eficazes que garantem que a mudança seja consultada, implementada de forma ponderada e bem comunicada.',
  'Valores no Trabalho':
    'Se as pessoas entendem seu papel na organização e se a organização garante que elas não tenham papéis conflitantes. Organizações com bom desempenho nesta área provavelmente promovem deveres, metas e responsabilidades claras e têm sistemas para lidar com conflitos de papéis.',
  'Assédio Moral':
    'Refere-se ao incentivo, patrocínio e recursos fornecidos pela organização e pela gestão de linha. Organizações com bom desempenho nesta área provavelmente têm sistemas claros que permitem e incentivam os gestores a apoiar sua equipe e fornecer feedback regular e construtivo.',
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

  const survey = initialSurveys.find((s) => s.id === surveyId)
  
  const numConvidado = 50 // Placeholder
  const numRespostas = 48 // Placeholder

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
          <CardTitle className='font-headline text-3xl'>Resumo Executivo</CardTitle>
        </CardHeader>
        <CardContent className='space-y-4 text-sm text-muted-foreground'>
            <p>
                Este Relatório do(a) <strong>{survey?.circumstances}</strong> contém os resultados da Pesquisa realizada pela <strong>{survey?.clientName}</strong> na(s) sua(s) unidade(s): <strong>{survey?.unit}</strong>.
            </p>
            <p>
                Esta pesquisa investigou as percepções sobre o trabalho do ponto de vista dos seus colaboradores. <strong>{numConvidado}</strong> foram convidados a responder à pesquisa e <strong>{numRespostas}</strong> concluíram o envio das respostas. Consulte o Apêndice A para um resumo dos detalhes [vamos criar posteriormente os Apêndices].
            </p>
            <p>
                A ferramenta de <strong>Avaliação de Riscos Psicossociais Relacionados ao Trabalho (ARPT)</strong> foi desenvolvida pela <strong>AptaFlow</strong> para medir as atitudes e percepções da força de trabalho sobre aspectos do trabalho que são conhecidos por estarem associados ao estresse relacionado ao trabalho. A <strong>ARPT</strong> faz parte dos Padrões de Gerenciamento de Riscos Psicossociais Relacionados ao Trabalho da <strong>ARPT</strong>, que são a abordagem de avaliação de risco da <strong>AptaFlow</strong> para ajudar os empregadores a gerenciar as causas do estresse no local de trabalho.
            </p>
            <p>
                A <strong>AptaFlow</strong> defende o uso da <strong>ARPT</strong> no Programa de Gerenciamento de Risco (PGR), como uma fonte de dados que pode ser usada para identificar a extensão em que o estresse relacionado ao trabalho é um problema na empresa avaliada.
            </p>
            <p>
                Este relatório resume as respostas fornecidas pelos colaboradores e permitirá que a empresa <strong>{survey?.clientName}</strong> se concentre nas áreas prioritárias e faça melhorias direcionadas.
            </p>
             <h3 className='font-headline text-lg font-bold text-foreground pt-4'>Como os resultados são apresentados</h3>
            <p>
                O sistema de pontuação usado na pesquisa <strong>ARPT</strong> foi baseado em uma escala de 5 pontos. O sistema de pontuação é complexo, pois algumas escalas e itens são pontuados inversamente na ferramenta por razões psicométricas. Para auxiliar sua interpretação significativa, os resultados foram agrupados em três categorias: respostas favoráveis, neutras e desfavoráveis, apresentadas como porcentagens de respondentes. A categoria neutra contém respostas que pontuaram 3, onde as opções de resposta eram 'às vezes' ou 'neutro'. As categorias favorável e desfavorável combinam as duas respostas em ambos os lados da escala. Por exemplo, para o item 'Eu posso decidir quando fazer uma pausa', as respostas 'Frequentemente' e 'Sempre' são combinadas para produzir a porcentagem de respondentes que deram uma resposta favorável, enquanto as respostas 'Nunca' e 'Raramente' são combinadas para produzir a porcentagem de respondentes que deram uma resposta desfavorável. No entanto, para as pontuações de Relacionamentos, estas são apresentadas como categorias de resposta em vez de favorável/desfavorável. Isso ocorre porque, se os respondentes responderem "às vezes" às perguntas neste domínio, isso pode indicar a presença de bullying ou assédio, e qualquer relato de tais comportamentos deve ser considerado sério pela organização.
            </p>
            <p>
                No primeiro gráfico abaixo, que resume o desempenho geral da sua organização, todas as pontuações são apresentadas de forma que uma pontuação alta indique características de trabalho saudáveis ​​e uma pontuação baixa indique características de trabalho menos saudáveis. Portanto, uma pontuação baixa pode indicar que é necessário fazer melhorias para proteger a saúde e o bem-estar da sua força de trabalho.
            </p>
            <p>
                É útil revisar a pontuação da sua organização para cada domínio em relação aos benchmarks de uma amostra comparativa de 17.286 respondentes de 123 avaliações do setor privado da União Europeia, optamos por usar esses dados, por alguns motivos. O primeiro é pela ausência de informações e indicadores de riscos psicossociais do setor privado no Brasil e América Latina, outro é por que o Reino Unido e a União Europeia possuem a maior pesquisa e o maior banco de dados desses indicadores.
            </p>
            <p>
                No entanto, é importante observar que os Padrões de Gestão são projetados como padrões em relação aos quais as organizações devem buscar atingir uma pontuação de cinco para cada domínio. Portanto, o desempenho em relação aos benchmarks deve ser analisado com cautela, e qualquer domínio para o qual o desempenho seja inferior a cinco indica uma área potencial para melhoria.
            </p>
            <p>Observe que pontuações que indicam desempenho razoável/bom ainda podem incluir áreas com desempenho inferior.</p>
            <p>Revisar seus dados com uma análise mais detalhada (ou seja, por diferentes categorias demográficas) e realizar grupos focais pode ajudá-lo a explorar e validar suas pontuações com mais profundidade.</p>
            <p>Para obter mais informações sobre os dados de referência, consulte: Edwards, J.A., & Webster, S. (2012).</p>

             <h3 className='font-headline text-lg font-bold text-foreground pt-4'>Principais Conclusões</h3>
            <p>
                O gráfico a seguir mostra as pontuações médias da empresa <strong>{survey?.clientName}</strong> para cada um dos seis domínios, em comparação com os benchmarks do setor privado. A linha vermelha indica a pontuação do 25º percentil e a linha verde indica a pontuação do 75º percentil para a amostra comparativa. Isso significa que, em comparação com os
                benchmarks, as organizações com pontuação abaixo da linha vermelha tiveram um desempenho inferior a 75% das organizações; as organizações com pontuação entre as linhas vermelha e verde ficaram entre os 50% intermediários das organizações. As pontuações acima da linha verde são melhores do que 75% das organizações.
            </p>
            <ul className='list-disc pl-5 space-y-2'>
                <li><strong>Demandas</strong> - isso inclui questões como carga de trabalho, padrões de trabalho e ambiente de trabalho. As empresas com bom desempenho nesta área provavelmente têm prazos alcançáveis, demandas adequadas em relação às horas de trabalho e sistemas em implementação para responder a preocupações individuais.</li>
                <li><strong>Controle</strong> – refere-se ao quanto a pessoa tem influência sobre a maneira como realiza seu trabalho. Empresas com bom desempenho nessa área tendem a promover a autonomia e a iniciativa, com sistemas claros para que os funcionários influenciem seu próprio trabalho e padrões de trabalho.</li>
                <li><strong>Apoio</strong> – inclui o incentivo, apoio e os recursos fornecidos pela empresa, pela gestão direta e pelos colegas, e pode ser dividido em duas ocasiões de subdomínio para "Apoio da Gestão" e "Apoio dos Colegas". Empresas com bom desempenho nessa área tendem a ter sistemas claros que permitem e incentivam os gestores a apoiar suas equipes e fornecer feedback regular e construtivo. Eles também possuem equipes prestativas e compassivas, com sistemas que facilitam o respeito e o apoio entre pares.</li>
                <li><strong>Relacionamentos</strong> – inclui a promoção de um ambiente de trabalho positivo para evitar conflitos e lidar com comportamentos inaceitáveis. Empresas com bom desempenho nessa área tendem a promover um ambiente de trabalho positivo e a lidar eficazmente com conflitos e comportamentos inaceitáveis.</li>
                <li><strong>Papel</strong> – se as pessoas entendem seu papel dentro da organização e se a organização garante que elas não tenham papéis conflitantes. Organizações com bom desempenho nesta área provavelmente promovem deveres, metas e responsabilidades claras e possuem sistemas implementados para lidar com conflitos de papéis.</li>
                <li><strong>Mudança</strong> - como uma mudança organizacional (grande ou pequena) é gerenciada e comunicada na organização. Organizações com bom desempenho provavelmente possuem sistemas de gestão de mudanças que garantem que a mudança seja devidamente consultada, renovada de forma criteriosa e bem comunicada.</li>
            </ul>
            <p>As seis áreas são relacionadas como sete fatores porque o "Apoio" é dividido em dois fatores: Apoio dos Gestores e Apoio dos Pares. As opções variam de 1 (ruim) a 5 (desejável).</p>
        
            <div className='h-[400px] w-full pt-8'>
              <ChartContainer config={chartConfig} className="w-full h-full">
                <BarChart data={analysisData} margin={{ top: 20, right: 30, left: 20, bottom: 5 }}>
                  <CartesianGrid vertical={false} />
                  <XAxis dataKey="name" tick={{ fontSize: 10 }} angle={-45} textAnchor="end" height={80} />
                  <YAxis domain={[1, 5]} />
                  <ChartTooltip content={<ChartTooltipContent />} />
                  <Bar dataKey="yourScore" fill="var(--color-yourScore)" radius={4} />
                  <ReferenceLine y={3.5} label={{ value: 'Benchmark Inferior', position: 'insideTopLeft', fill: 'hsl(var(--destructive))', fontSize: 12 }} stroke="hsl(var(--destructive))" strokeDasharray="3 3" />
                  <ReferenceLine y={4.5} label={{ value: 'Benchmark Superior', position: 'insideTopLeft', fill: 'hsl(var(--chart-2))', fontSize: 12 }} stroke="hsl(var(--chart-2))" strokeDasharray="3 3" />
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
        <CardContent className='space-y-10'>
          {analysisData.map((item) => (
            <div key={item.name}>
              <h3 className='font-headline text-2xl font-semibold'>
                {item.name}
              </h3>
              <p className='text-muted-foreground mt-2 text-sm leading-relaxed'>
                {domainTextMap[item.name]}
              </p>

              <div className='mt-6 rounded-lg border bg-muted/30 p-6 space-y-4'>
                <h4 className='font-semibold'>Seu Desempenho no Contexto</h4>
                <ChartContainer
                  config={chartConfig}
                  className='h-[80px] w-full'
                >
                  <BarChart
                    data={[item]}
                    layout='vertical'
                    margin={{ left: 10, right: 10 }}
                  >
                    <XAxis
                      type='number'
                      dataKey='yourScore'
                      domain={[1, 5]}
                      hide
                    />
                    <YAxis type='category' dataKey='name' hide />
                    <ChartTooltip
                      cursor={false}
                      content={<ChartTooltipContent hideLabel />}
                    />
                    <Bar
                      dataKey='yourScore'
                      layout='vertical'
                      fill='var(--color-yourScore)'
                      radius={4}
                      barSize={20}
                    >
                      <text
                        x={-10}
                        y={10}
                        textAnchor='end'
                        fill='hsl(var(--foreground))'
                        className='text-sm font-bold'
                      >
                        Sua Pontuação
                      </text>
                      <text
                        x='98%'
                        y={10}
                        textAnchor='end'
                        fill='hsl(var(--primary-foreground))'
                        className='text-sm font-bold'
                      >
                        {item.yourScore.toFixed(2)}
                      </text>
                    </Bar>
                    <ReferenceLine
                      x={item.benchmark25}
                      stroke='hsl(var(--destructive))'
                      strokeWidth={2}
                      strokeDasharray='3 3'
                    />
                    <ReferenceLine
                      x={item.benchmark75}
                      stroke='hsl(var(--chart-2))'
                      strokeWidth={2}
                      strokeDasharray='3 3'
                    />
                  </BarChart>
                </ChartContainer>
                <div className='flex items-center justify-between text-xs text-muted-foreground px-2'>
                  <span>1</span>
                  <span>2</span>
                  <span>3</span>
                  <span>4</span>
                  <span>5</span>
                </div>

                <div className='text-sm text-muted-foreground pt-4'>
                  <p>
                    A linha{' '}
                    <span className='font-semibold text-destructive'>
                      vermelha
                    </span>{' '}
                    indica o 25º percentil e a linha{' '}
                    <span className='font-semibold text-accent-foreground bg-green-500 px-1 rounded-sm'>
                      verde
                    </span>{' '}
                    indica o 75º percentil para a amostra comparativa.
                  </p>
                  <p className='mt-2'>
                    Sua pontuação de{' '}
                    <span className='font-bold text-foreground'>
                      {item.yourScore.toFixed(2)}
                    </span>{' '}
                    sugere que o desempenho da sua organização está{' '}
                    <span className='font-bold text-foreground'>
                      {item.yourScore > item.benchmark75
                        ? 'acima do percentil 75'
                        : item.yourScore < item.benchmark25
                        ? 'abaixo do percentil 25'
                        : 'entre os percentis 25 e 75'}
                    </span>
                    .
                  </p>
                </div>
              </div>
              <Separator className='mt-10' />
            </div>
          ))}
        </CardContent>
      </Card>
    </div>
  )
}
