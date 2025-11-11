
export interface PsychosocialQuestion {
  id: string
  text: string
}

export interface PsychosocialStressorGroup {
  id: string
  name: string
  questions: PsychosocialQuestion[]
}

export const psychosocialSurveyData: PsychosocialStressorGroup[] = [
  {
    id: 'DEMANDAS_TRABALHO',
    name: 'Demandas do Trabalho',
    questions: [
      {
        id: 'DT01',
        text: 'Diferentes grupos no trabalho exigem de mim coisas que são difíceis de combinar',
      },
      { id: 'DT02', text: 'Tenho prazos inatingíveis' },
      { id: 'DT03', text: 'Tenho que trabalhar muito intensamente' },
      {
        id: 'DT04',
        text: 'Tenho que negligenciar algumas tarefas porque tenho muito o que fazer',
      },
      { id: 'DT05', text: 'Não consigo fazer pausas suficientes' },
      { id: 'DT06', text: 'Estou pressionado a trabalhar muitas horas' },
      { id: 'DT07', text: 'Tenho que trabalhar muito rápido' },
      { id: 'DT08', text: 'Tenho pressões de tempo irrealistas' },
    ],
  },
  {
    id: 'ORGANIZACAO_TRABALHO',
    name: 'Organização do Trabalho',
    questions: [
      {
        id: 'OT01',
        text: 'Você tem influência sobre as decisões importantes em seu trabalho?',
      },
      { id: 'OT02', text: 'Você tem voz na escolha de seus projetos?' },
      {
        id: 'OT03',
        text: 'Você pode influenciar a quantidade de trabalho que lhe é atribuída?',
      },
      {
        id: 'OT04',
        text: 'Você tem a possibilidade de escolher o que fazer no trabalho?',
      },
      { id: 'OT05', text: 'Você tem controle sobre o seu ritmo de trabalho?' },
      {
        id: 'OT06',
        text: 'Você tem a oportunidade de desenvolver suas habilidades no trabalho?',
      },
    ],
  },
  {
    id: 'APOIO_LIDERANCA',
    name: 'Apoio da Liderança',
    questions: [
      {
        id: 'AL01',
        text: 'Seu supervisor imediato é bom em planejar e organizar o trabalho?',
      },
      {
        id: 'AL02',
        text: 'Seu supervisor imediato distribui o trabalho de forma justa?',
      },
      {
        id: 'AL03',
        text: 'Recebo o respeito que mereço da minha gerência sênior.',
      },
    ],
  },
  {
    id: 'APOIO_COLEGAS',
    name: 'Apoio dos Colegas',
    questions: [
      {
        id: 'AC01',
        text: 'Você recebe apoio e ajuda de seus colegas quando necessário?',
      },
      {
        id: 'AC02',
        text: 'Há um bom ambiente de colaboração entre os colegas?',
      },
      {
        id: 'AC03',
        text: 'Sinto que posso contar com meus colegas.',
      },
    ],
  },
  {
    id: 'RELACIONAMENTOS_INTERACOES',
    name: 'Relacionamentos e Interações Pessoais',
    questions: [
      {
        id: 'RI01',
        text: 'Você foi exposto a fofocas ou rumores sobre você?',
      },
      {
        id: 'RI02',
        text: 'Você teve informações importantes para o seu trabalho retidas de você?',
      },
      {
        id: 'RI03',
        text: 'Você foi humilhado ou ridicularizado em seu trabalho?',
      },
    ],
  },
  {
    id: 'MUDANCAS_ORGANIZACIONAIS',
    name: 'Mudanças Organizacionais',
    questions: [
      { id: 'MO01', text: 'Você está preocupado em ser demitido?' },
      {
        id: 'MO02',
        text: 'As mudanças são comunicadas de forma eficaz na organização?',
      },
      {
        id: 'MO03',
        text: 'Sinto que tenho informações suficientes para entender as mudanças.',
      },
    ],
  },
  {
    id: 'PAPEL_TRABALHO',
    name: 'Papel no Trabalho',
    questions: [
      {
        id: 'PT01',
        text: 'Eu entendo claramente quais são minhas funções e responsabilidades.',
      },
      {
        id: 'PT02',
        text: 'Eu tenho clareza sobre os objetivos e metas da minha equipe.',
      },
      {
        id: 'PT03',
        text: 'Eu sei como meu trabalho se encaixa nos objetivos gerais da empresa.',
      },
    ],
  },
]

export type SurveyStatus = 'Planejada' | 'Em Andamento' | 'Concluída'

export interface PsychosocialSurvey {
  id: string
  creationDate: string
  clientName: string
  unit: string
  circumstances: string
  status: SurveyStatus
}

export const initialSurveys: PsychosocialSurvey[] = [
  {
    id: 'SURV-2023-001',
    creationDate: '2023-10-15',
    clientName: 'Innovate Inc.',
    unit: 'Matriz São Paulo',
    circumstances: 'Avaliação Anual 2023',
    status: 'Concluída',
  },
]
