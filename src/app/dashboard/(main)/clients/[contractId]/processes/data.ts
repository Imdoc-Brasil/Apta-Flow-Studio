
export interface ProcessStep {
  id: string
  name: string
  responsibleRole: string
  description: string
  isControlPoint: boolean
}

export interface Process {
  id: string
  name: string
  objective: string
  primarySector: string
  steps: ProcessStep[]
}

export const initialProcessesData: Process[] = [
  {
    id: 'PROC-001',
    name: 'Manutenção Corretiva de Veículos',
    objective:
      'Garantir que os veículos retornem à operação em condições seguras e funcionais, prevenindo acidentes e novas falhas.',
    primarySector: 'Manutenção',
    steps: [
      {
        id: 'STEP-001',
        name: 'Recebimento e Diagnóstico da Falha',
        responsibleRole: 'Supervisor de Manutenção',
        description: 'Receber o veículo, registrar a queixa do motorista e realizar o diagnóstico inicial para identificar a causa raiz do problema.',
        isControlPoint: false,
      },
      {
        id: 'STEP-002',
        name: 'Abertura da Ordem de Serviço (OS)',
        responsibleRole: 'Supervisor de Manutenção',
        description: 'Criar uma OS detalhando a falha diagnosticada e os serviços a serem executados, incluindo a troca de peças, se necessário.',
        isControlPoint: true,
      },
      {
        id: 'STEP-003',
        name: 'Execução da Manutenção',
        responsibleRole: 'Mecânico',
        description: 'Executar os reparos e trocas de peças conforme especificado na Ordem de Serviço.',
        isControlPoint: false,
      },
      {
        id: 'STEP-004',
        name: 'Verificação e Teste de Qualidade',
        responsibleRole: 'Mecânico Líder',
        description: 'Testar o veículo para garantir que o reparo foi bem-sucedido e que a falha foi resolvida. Comparar o serviço executado com a OS.',
        isControlPoint: true,
      },
      {
        id: 'STEP-005',
        name: 'Liberação do Veículo',
        responsibleRole: 'Supervisor de Manutenção',
        description: 'Realizar a inspeção final, assinar a liberação na OS e comunicar o setor de logística que o veículo está apto para uso.',
        isControlPoint: true,
      },
    ],
  },
]
