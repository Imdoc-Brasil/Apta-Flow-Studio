
// Mapeamento de CNAE para Grau de Risco (NR-4)
// Esta é uma lista de exemplos e não é exaustiva.
// Em uma aplicação real, isso poderia vir de um banco de dados ou uma API.

export interface CnaeData {
  code: string
  description: string
  riskLevel: number
}

export const cnaeList: CnaeData[] = [
  // Grau de Risco 1
  {
    code: '6201501',
    description: 'Desenvolvimento de programas de computador sob encomenda',
    riskLevel: 1,
  },
  {
    code: '8550302',
    description: 'Atividades de apoio à educação, exceto caixas escolares',
    riskLevel: 1,
  },
  {
    code: '9319101',
    description: 'Produção e promoção de eventos esportivos',
    riskLevel: 1,
  },

  // Grau de Risco 2
  {
    code: '4711302',
    description:
      'Comércio varejista de mercadorias em geral, com predominância de produtos alimentícios - supermercados',
    riskLevel: 2,
  },
  {
    code: '5611201',
    description: 'Restaurantes e similares',
    riskLevel: 2,
  },
  {
    code: '8630503',
    description: 'Atividade médica ambulatorial restrita a consultas',
    riskLevel: 2,
  },

  // Grau de Risco 3
  {
    code: '0111302',
    description: 'Cultivo de milho',
    riskLevel: 3,
  },
  {
    code: '1012101',
    description: 'Abate de aves',
    riskLevel: 3,
  },
  {
    code: '4930202',
    description:
      'Transporte rodoviário de carga, exceto produtos perigosos e mudanças, intermunicipal, interestadual e internacional',
    riskLevel: 3,
  },
  {
    code: '8610101',
    description:
      'Atividades de atendimento hospitalar, exceto pronto-socorro e unidades para atendimento a urgências',
    riskLevel: 3,
  },

  // Grau de Risco 4
  {
    code: '0500301',
    description: 'Extração de carvão mineral',
    riskLevel: 4,
  },
  {
    code: '0910600',
    description: 'Atividades de apoio à extração de petróleo e gás natural',
    riskLevel: 4,
  },
  {
    code: '2399101',
    description:
      'Decoração, lapidação, gravação, vitrificação e outros trabalhos em cerâmica, louça, vidro e cristal',
    riskLevel: 4,
  },
]

export const cnaeToRiskLevelMap: { [key: string]: number } = cnaeList.reduce(
  (acc, item) => {
    acc[item.code] = item.riskLevel
    return acc
  },
  {} as { [key: string]: number }
)
