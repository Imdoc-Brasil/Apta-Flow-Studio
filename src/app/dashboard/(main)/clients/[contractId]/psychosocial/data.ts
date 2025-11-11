
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
      { id: 'DT01', text: 'Seu trabalho exige um ritmo acelerado?' },
      {
        id: 'DT02',
        text: 'Suas tarefas exigem que você esconda seus sentimentos?',
      },
      { id: 'DT03', text: 'Suas tarefas são difíceis?' },
      {
        id: 'DT04',
        text: 'Seu trabalho exige longos períodos de concentração intensa?',
      },
      { id: 'DT05', text: 'Seu trabalho é emocionalmente exigente?' },
      {
        id: 'DT06',
        text: 'Você tem que lidar com pessoas emocionalmente difíceis em seu trabalho?',
      },
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
      {
        id: 'OT07',
        text: 'Seu trabalho lhe dá a sensação de "fazer um bom trabalho"?',
      },
    ],
  },
  {
    id: 'RELACIONAMENTOS_INTERPESSOAIS',
    name: 'Relacionamentos Interpessoais e Liderança',
    questions: [
      {
        id: 'RI01',
        text: 'Seu supervisor imediato é bom em planejar e organizar o trabalho?',
      },
      {
        id: 'RI02',
        text: 'Seu supervisor imediato distribui o trabalho de forma justa?',
      },
      {
        id: 'RI03',
        text: 'Você recebe apoio e ajuda de seus colegas quando necessário?',
      },
      {
        id: 'RI04',
        text: 'Há um bom ambiente de colaboração entre os colegas?',
      },
      {
        id: 'RI05',
        text: 'Você se sente parte de uma comunidade em seu local de trabalho?',
      },
    ],
  },
  {
    id: 'CONFLITO_TRABALHO_FAMILIA',
    name: 'Conflito Trabalho-Família',
    questions: [
      {
        id: 'CTF01',
        text: 'Com que frequência você não tem tempo para a família/amigos por causa do trabalho?',
      },
      {
        id: 'CTF02',
        text: 'Com que frequência você volta do trabalho cansado demais para fazer as coisas que gostaria em casa?',
      },
      {
        id: 'CTF03',
        text: 'A família e os amigos dizem que você deveria trabalhar menos?',
      },
      {
        id: 'CTF04',
        text: 'Seu trabalho interfere na sua vida familiar e em seus momentos de lazer?',
      },
    ],
  },
  {
    id: 'INSEGURANCA_EMPREGO',
    name: 'Insegurança no Emprego',
    questions: [
      { id: 'IE01', text: 'Você está preocupado em ser demitido?' },
      {
        id: 'IE02',
        text: 'Você está preocupado com a possibilidade de uma grande mudança organizacional?',
      },
      {
        id: 'IE03',
        text: 'Você está preocupado em ter que assumir novas funções sem o devido preparo?',
      },
    ],
  },
  {
    id: 'VALORES_TRABALHO',
    name: 'Valores no Trabalho',
    questions: [
      {
        id: 'VT01',
        text: 'Seu trabalho tem um propósito e significado para você?',
      },
      {
        id: 'VT02',
        text: 'Seu trabalho lhe dá a sensação de "fazer um bom trabalho"?',
      },
      {
        id: 'VT03',
        text: 'Você sente que o trabalho que você faz é importante?',
      },
      {
        id: 'VT04',
        text: 'Você se sente motivado e engajado em seu trabalho?',
      },
    ],
  },
  {
    id: 'ASSEDIO_MORAL',
    name: 'Assédio Moral',
    questions: [
      {
        id: 'AM01',
        text: 'Você foi exposto a fofocas ou rumores sobre você?',
      },
      {
        id: 'AM02',
        text: 'Você teve informações importantes para o seu trabalho retidas de você?',
      },
      { id: 'AM03', text: 'Você foi humilhado ou ridicularizado em seu trabalho?' },
      { id: 'AM04', text: 'Você foi ignorado ou excluído?' },
      {
        id: 'AM05',
        text: 'Você recebeu críticas ou ofensas pessoais e depreciativas?',
      },
      {
        id: 'AM06',
        text: 'Suas opiniões e pontos de vista foram ignorados?',
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

    