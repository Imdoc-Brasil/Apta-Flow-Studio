
export interface Role {
  id: string
  name: string
  description: string
  sectorId: string
  cbo: string
  activities: string[]
  requirements: string
  mainWorkstationId?: string
  additionalWorkstationIds?: string[]
  requiredExams?: string
  status?: 'Ativo' | 'Arquivado'
}

export const initialRolesData: Role[] = [
  {
    id: 'ROLE-01',
    name: 'Analista Financeiro',
    description: 'Responsável pela análise e gestão financeira.',
    sectorId: 'SEC-01', // Administrativo
    cbo: '2525-05',
    activities: ['Contas a pagar e receber', 'conciliação bancária', 'relatórios'],
    requirements: 'Superior em Administração ou Contabilidade, Excel avançado.',
    mainWorkstationId: 'ENV-01', // Sala da Diretoria
    requiredExams: 'ASO Admissional, Periódico.',
  },
  {
    id: 'ROLE-02',
    name: 'Operador de Máquinas',
    description: 'Opera máquinas na linha de produção.',
    sectorId: 'SEC-02', // Produção
    cbo: '7825-10',
    activities: ['Operar prensa', 'setup de ferramentas', 'inspeção de peças'],
    requirements: 'Ensino Médio, Curso de Mecânica Básica, NR-12.',
    mainWorkstationId: 'ENV-02', // Esteira de Montagem 1
    requiredExams: 'Audiometria, Acuidade Visual.',
  },
  {
    id: 'ROLE-03',
    name: 'Almoxarife',
    description: 'Controla o estoque e a expedição de materiais.',
    sectorId: 'SEC-03', // Logística
    cbo: '4141-05',
    activities: ['Recebimento', 'conferência', 'armazenagem e expedição'],
    requirements: 'Curso de Operador de Empilhadeira.',
    requiredExams: 'ASO, Exame de Coluna.',
  },
  {
    id: 'ROLE-04',
    name: 'Vendedor Externo',
    description: 'Realiza vendas e prospecção de clientes.',
    sectorId: 'SEC-04', // Vendas
    cbo: '3541-25',
    activities: ['Visitas a clientes', 'negociação', 'fechamento de pedidos'],
    requirements: 'CNH B, experiência com vendas.',
    requiredExams: 'ASO.',
  },
  {
    id: 'ROLE-05',
    name: 'Gerente de Contas',
    description: 'Gerencia a carteira de clientes da filial.',
    sectorId: 'SEC-04', // Vendas
    cbo: '1423-15',
    activities: [
      'Relacionamento com cliente',
      'acompanhamento de projetos',
      'pós-venda',
    ],
    requirements: 'Superior em Administração ou Marketing.',
    requiredExams: 'ASO.',
  },
]
