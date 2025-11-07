
export interface Activity {
  id: string
  name: string
  description: string
}

export const initialActivitiesData: Activity[] = [
  {
    id: 'ACT-001',
    name: 'Receber e Diagnosticar Falha em Veículo',
    description: 'Receber o veículo, registrar a queixa do motorista e realizar o diagnóstico inicial para identificar a causa raiz do problema.',
  },
  {
    id: 'ACT-002',
    name: 'Abrir Ordem de Serviço (OS)',
    description: 'Criar uma OS detalhando a falha diagnosticada e os serviços a serem executados, incluindo peças.',
  },
  {
    id: 'ACT-003',
    name: 'Executar Manutenção Corretiva',
    description: 'Executar os reparos e trocas de peças conforme especificado na Ordem de Serviço.',
  },
  {
    id: 'ACT-004',
    name: 'Verificar e Testar Qualidade de Reparo',
    description: 'Testar o veículo para garantir que o reparo foi bem-sucedido e que a falha foi resolvida. Comparar o serviço executado com a OS.',
  },
  {
    id: 'ACT-005',
    name: 'Operar Prensa Hidráulica',
    description: 'Configurar e operar a prensa hidráulica para moldar peças conforme especificações técnicas.'
  },
  {
    id: 'ACT-006',
    name: 'Realizar Conciliação Bancária',
    description: 'Conferir os lançamentos bancários com os registros internos da empresa para garantir a exatidão das informações financeiras.'
  }
]
