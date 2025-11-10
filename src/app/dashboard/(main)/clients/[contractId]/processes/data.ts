

export interface ProcessStep {
  id: string
  name: string
  responsibleRole: string // Will store Role ID
  description: string
  isControlPoint: boolean
  isRiskSource?: boolean
  sectorId?: string // Store Sector ID
}

export type ProcessType = 'POP' | 'PP' | 'PRS' | 'PRT' | 'PI' | 'Outro'

export interface Process {
  id: string
  name: string
  objective: string
  steps: ProcessStep[]
  type: ProcessType
  obligations: string[]
  isCritical: boolean
}

export const initialProcessesData: Process[] = [
  {
    id: 'PROC-TEMPLATE-01',
    name: 'Processo de Admissão de Novo Colaborador',
    objective:
      'Padronizar o fluxo de entrada de novos colaboradores, garantindo a conformidade com as normas de saúde e segurança do trabalho desde o primeiro dia.',
    steps: [
      {
        id: 'STEP-ADM-01',
        name: 'Cadastro do Novo Colaborador',
        responsibleRole: 'Analista de RH', // Placeholder Role
        description:
          'Acessar Menu > Estrutura da Empresa > Colaboradores e preencher o formulário com os dados do candidato.',
        isControlPoint: true,
        sectorId: 'SEC-01', // Administrativo
      },
      {
        id: 'STEP-ADM-02',
        name: 'Geração do Pedido de Atendimento Admissional',
        responsibleRole: 'Analista de RH', // Placeholder Role
        description:
          'Gerar o pedido de atendimento para a realização do ASO Admissional, selecionando o tipo "Avaliação Admissional".',
        isControlPoint: true,
        sectorId: 'SEC-01', // Administrativo
      },
      {
        id: 'STEP-ADM-03',
        name: 'Convocação e Treinamento de Integração',
        responsibleRole: 'Supervisor de Área', // Placeholder Role
        description:
          'Após a liberação do ASO Admissional como "Apto", convocar o candidato para assumir o cargo e realizar o treinamento de integração (NR-01).',
        isControlPoint: true,
      },
      {
        id: 'STEP-ADM-04',
        name: 'Emissão do Certificado de Integração',
        responsibleRole: 'Supervisor de Área', // Placeholder Role
        description:
          'Após a conclusão do treinamento, emitir e arquivar o certificado de conclusão da integração de segurança.',
        isControlPoint: false,
      },
      {
        id: 'STEP-ADM-05',
        name: 'Ativação do Colaborador',
        responsibleRole: 'Analista de RH', // Placeholder Role
        description:
          'Com o ASO Apto e o certificado de integração emitido, alterar o status do colaborador de "Candidato" para "Ativo" no sistema.',
        isControlPoint: true,
        sectorId: 'SEC-01', // Administrativo
      },
    ],
    type: 'PI',
    obligations: ['NR-1', 'NR-7'],
    isCritical: true,
  },
  {
    id: 'PROC-001',
    name: 'Manutenção Corretiva de Veículos',
    objective:
      'Garantir que os veículos retornem à operação em condições seguras e funcionais, prevenindo acidentes e novas falhas.',
    steps: [
      {
        id: 'STEP-001',
        name: 'Recebimento e Diagnóstico da Falha',
        responsibleRole: 'Supervisor de Manutenção',
        description:
          'Receber o veículo, registrar a queixa do motorista e realizar o diagnóstico inicial para identificar a causa raiz do problema.',
        isControlPoint: false,
      },
      {
        id: 'STEP-002',
        name: 'Abertura da Ordem de Serviço (OS)',
        responsibleRole: 'Supervisor de Manutenção',
        description:
          'Criar uma OS detalhando a falha diagnosticada e os serviços a serem executados, incluindo a troca de peças, se necessário.',
        isControlPoint: true,
      },
      {
        id: 'STEP-003',
        name: 'Execução da Manutenção',
        responsibleRole: 'Mecânico',
        description:
          'Executar os reparos e trocas de peças conforme especificado na Ordem de Serviço.',
        isControlPoint: false,
      },
      {
        id: 'STEP-004',
        name: 'Verificação e Teste de Qualidade',
        responsibleRole: 'Mecânico Líder',
        description:
          'Testar o veículo para garantir que o reparo foi bem-sucedido e que a falha foi resolvida. Comparar o serviço executado com a OS.',
        isControlPoint: true,
      },
      {
        id: 'STEP-005',
        name: 'Liberação do Veículo',
        responsibleRole: 'Supervisor de Manutenção',
        description:
          'Realizar a inspeção final, assinar a liberação na OS e comunicar o setor de logística que o veículo está apto para uso.',
        isControlPoint: true,
      },
    ],
    type: 'PRS',
    obligations: ['NR-12'],
    isCritical: true,
  },
]
