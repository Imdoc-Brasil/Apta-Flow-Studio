
/**
 * Catálogo de Serviços SST e outros serviços.
 */

export const sstPrograms = [
  {
    sigla: 'PGR',
    documento: 'Programa de Gerenciamento de Riscos',
    baseLegal: 'NR 1',
    aplicabilidade: 'Obrigatório para quase todas as empresas',
    vigencia:
      'Revisão: Mínimo a cada 2 anos (para empresas sem acidentes graves) ou sempre que houver alterações nos riscos (modificações de processos, tecnologias, etc.). Arquivamento: Mínimo de 20 anos.',
    valor: 'Sob Consulta',
  },
  {
    sigla: 'PCMSO',
    documento: 'Programa de Controle Médico de Saúde Ocupacional',
    baseLegal: 'NR 7',
    aplicabilidade: 'Obrigatório para quase todas as empresas',
    vigencia:
      'Revisão/Planejamento: Anual. Arquivamento: O relatório analítico anual deve ser arquivado por, no mínimo, 20 anos.',
    valor: 'Sob Consulta',
  },
  {
    sigla: 'ASO',
    documento: 'Atestado de Saúde Ocupacional',
    baseLegal: 'NR 7',
    aplicabilidade: 'Obrigatório para todos os empregados',
    vigencia:
      'Vigência: Varia. Exame periódico geralmente é anual, mas pode ser bienal ou semestral dependendo do risco/idade. Arquivamento: Mínimo de 20 anos após o desligamento do trabalhador.',
    valor: 'Sob Consulta',
  },
  {
    sigla: 'OS',
    documento: 'Ordem de Serviço de SST',
    baseLegal: 'NR 1',
    aplicabilidade: 'Obrigatório para todos os empregadores',
    vigencia:
      'Vigência: Deve ser atualizada sempre que houver alteração nos riscos ou nas medidas preventivas. Arquivamento: Indeterminado ou enquanto o trabalhador estiver na empresa.',
    valor: 'Sob Consulta',
  },
  {
    sigla: '(Ficha EPI)',
    documento: 'Ficha ou Registro de Entrega de EPI',
    baseLegal: 'NR 6 e NR 1',
    aplicabilidade: 'Obrigatório para todos os empregadores que fornecem EPIs',
    vigencia:
      'Vigência: Emitida a cada entrega de EPI. Arquivamento: Mínimo de 20 anos (sugerido junto ao ASO/PPP) para fins de comprovação.',
    valor: 'Sob Consulta',
  },
  {
    sigla: 'PPP',
    documento: 'Perfil Profissiográfico Previdenciário',
    baseLegal: '(Previdenciária - INSS)',
    aplicabilidade: 'Obrigatório para todas as empresas',
    vigencia:
      'Vigência: Preenchido na rescisão do contrato ou sempre que solicitado. Arquivamento: Indeterminado (para sempre), pois é um documento histórico do trabalhador para o INSS.',
    valor: 'Sob Consulta',
  },
  {
    sigla: 'LTCAT',
    documento: 'Laudo Técnico das Condições Ambientais do Trabalho',
    baseLegal: '(Previdenciária - INSS)',
    aplicabilidade: 'Obrigatório para empresas com exposição a agentes nocivos',
    vigencia:
      'Vigência: Não tem validade fixa. Deve ser revisado sempre que houver alteração no ambiente ou processo de trabalho. Arquivamento: Indeterminado.',
    valor: 'Sob Consulta',
  },
  {
    sigla: 'AET',
    documento: 'Análise Ergonômica do Trabalho',
    baseLegal: 'NR 17',
    aplicabilidade: 'Obrigatório para atividades com riscos ergonômicos',
    vigencia:
      'Vigência: Não tem validade fixa. Deve ser revisada quando houver alterações significativas nas condições de trabalho (layout, máquinas, métodos).',
    valor: 'Sob Consulta',
  },
  {
    sigla: 'Laudo Insalubridade',
    documento: 'Laudo de Insalubridade',
    baseLegal: 'NR 15',
    aplicabilidade: 'Obrigatório se houver suspeita de exposição',
    vigencia:
      'Vigência: Não tem validade fixa. Deve ser revisado sempre que houver mudanças no ambiente ou processo de trabalho que possam alterar o nível de exposição.',
    valor: 'Sob Consulta',
  },
  {
    sigla: 'Laudo Periculosidade',
    documento: 'Laudo de Periculosidade',
    baseLegal: 'NR 16',
    aplicabilidade: 'Obrigatório se houver suspeita de atividades perigosas',
    vigencia:
      'Vigência: Não tem validade fixa. Deve ser revisado sempre que houver mudanças no ambiente ou processo de trabalho que possam alterar a condição de periculosidade.',
    valor: 'Sob Consulta',
  },
  {
    sigla: 'Certificado Treinamento',
    documento: 'Certificado de Treinamento e Capacitação',
    baseLegal: 'NRs diversas',
    aplicabilidade: 'Obrigatório (registros de treinamentos específicos)',
    vigencia:
      'Vigência: Varia conforme a NR. Ex: NR 10 (bienal), NR 33 (anual), NR 35 (anual). Arquivamento: Pelo menos 20 anos (sugerido).',
    valor: 'Sob Consulta',
  },
  {
    sigla: 'Documentos CIPA',
    documento: 'CIPA - (Atas, Calendário e Eleição)',
    baseLegal: 'NR 5',
    aplicabilidade: 'Obrigatório para empresas com 20+ empregados',
    vigencia:
      'Vigência: A gestão da CIPA tem duração de 1 ano. Arquivamento: Atas de eleição e posse: 20 anos; Atas de reuniões ordinárias/extraordinárias: 5 anos.',
    valor: 'Sob Consulta',
  },
  {
    sigla: 'PT',
    documento: 'Permissão para o Trabalho',
    baseLegal: 'NRs diversas (ex: 10, 34, 35)',
    aplicabilidade: 'Obrigatório para atividades de alto risco',
    vigencia:
      'Vigência: Válida apenas para a duração da atividade específica para a qual foi emitida (geralmente diária ou por turno). Arquivamento: Mínimo de 5 anos (NR 10 sugere 5 anos).',
    valor: 'Sob Consulta',
  },
  {
    sigla: 'PPR',
    documento: 'Programa de Proteção Respiratória',
    baseLegal: '(Fundacentro/ NR 9)',
    aplicabilidade: 'Obrigatório onde os trabalhadores utilizam respiradores',
    vigencia: 'Revisão: Anual, no mínimo, ou sempre que necessário.',
    valor: 'Sob Consulta',
  },
  {
    sigla: 'PCA',
    documento: 'Programa de Conservação Auditiva',
    baseLegal: '(Fundacentro/ NR 9)',
    aplicabilidade:
      'Obrigatório para empresas com exposição a níveis de ruído elevados',
    vigencia: 'Revisão: Anual, no mínimo, ou sempre que necessário.',
    valor: 'Sob Consulta',
  },
  {
    sigla: 'PGRTR',
    documento: 'Programa de Gerenciamento de Riscos no Trabalho Rural',
    baseLegal: 'NR 31',
    aplicabilidade: 'Obrigatório para empregadores rurais/aquicultura',
    vigencia:
      'Revisão: Mínimo a cada 2 anos ou sempre que houver alterações (similar ao PGR). Arquivamento: Mínimo de 20 anos.',
    valor: 'Sob Consulta',
  },
  {
    sigla: 'PGRSS',
    documento: 'Programa de Gerenciamento de Resíduos de Serviços de Saúde',
    baseLegal: 'NR 32',
    aplicabilidade: 'Obrigatório para serviços de saúde',
    vigencia:
      'Revisão: Não tem validade fixa, deve ser revisado em caso de alterações. Arquivamento: 20 anos (sugerido).',
    valor: 'Sob Consulta',
  },
  {
    sigla: 'Inventário Máquinas',
    documento: 'Inventário de Máquinas e Equipamentos',
    baseLegal: 'NR 12',
    aplicabilidade:
      'Obrigatório para indústrias e empresas que possuem máquinas',
    vigencia: 'Vigência: Deve ser mantido atualizado.',
    valor: 'Sob Consulta',
  },
  {
    sigla: 'Prontuário Elétrico',
    documento: 'Prontuário de Instalações Elétricas',
    baseLegal: 'NR 10',
    aplicabilidade:
      'Obrigatório para empresas com instalações elétricas e serviços com eletricidade',
    vigencia:
      'Vigência: Deve ser mantido atualizado com as inspeções e manutenções.',
    valor: 'Sob Consulta',
  },
  {
    sigla: 'Prontuário Caldeiras',
    documento: 'Documentação de Caldeiras, Vasos de Pressão',
    baseLegal: 'NR 13',
    aplicabilidade:
      'Obrigatório para empresas que possuem caldeiras, vasos de pressão, tubulações e tanques',
    vigencia:
      'Vigência: Os relatórios de inspeção têm validade definida na NR-13 (ex: 1 a 3 anos, dependendo do equipamento/categoria).',
    valor: 'Sob Consulta',
  },
]

// --- Other Service Data ---

export interface TechnicalAdvisory {
  contractNumber: string
  name: string
  hours: number
  hourValue: string
  total: string
  validity: string
}

export const technicalAdvisory: TechnicalAdvisory[] = [
  {
    contractNumber: 'CT-MED-01',
    name: 'Assessoria em Medicina do Trabalho',
    hours: 10,
    hourValue: 'R$ 250,00',
    total: 'R$ 2.500,00',
    validity: '12 meses',
  },
  {
    contractNumber: 'CT-SEG-01',
    name: 'Assessoria em Segurança do Trabalho',
    hours: 20,
    hourValue: 'R$ 200,00',
    total: 'R$ 4.000,00',
    validity: '12 meses',
  },
]

export interface Rental {
  code: string
  description: string
  dailyRate: string
  insurance: string
}

export const rentals: Rental[] = [
  {
    code: 'RENT-01',
    description: 'Unidade Móvel',
    dailyRate: 'R$ 1.500,00',
    insurance: 'R$ 300,00',
  },
  {
    code: 'RENT-02',
    description: 'Eletrocardiograma',
    dailyRate: 'R$ 250,00',
    insurance: 'R$ 50,00',
  },
]

export interface Outsourcing {
  code: string
  professional: string
  hourValue: string
  hours: number
  professionals: number
  total: string
}

export const outsourcing: Outsourcing[] = [
  {
    code: 'SESMT-01',
    professional: 'Médico do Trabalho',
    hourValue: 'R$ 300,00',
    hours: 40,
    professionals: 1,
    total: 'R$ 12.000,00',
  },
  {
    code: 'SESMT-02',
    professional: 'Técnico de Segurança do Trabalho',
    hourValue: 'R$ 150,00',
    hours: 80,
    professionals: 2,
    total: 'R$ 24.000,00',
  },
]
