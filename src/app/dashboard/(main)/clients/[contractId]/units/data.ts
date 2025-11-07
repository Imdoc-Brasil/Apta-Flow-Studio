export type UnitType = 'Unidade' | 'Obra' | 'Contrato'

export const initialUnitsData = [
  {
    id: 'UNIT-001',
    name: 'Matriz São Paulo',
    type: 'Unidade' as UnitType,
    description: 'Sede administrativa e operações centrais.',
    cnpj: '12.345.678/0001-99',
    address: '123 Tech Avenue, Silicon Valley, CA',
    status: 'Ativa',
    cnae: '62.01-5-01',
    riskLevel: '3',
    legalResponsible: 'Dr. Ricardo Mendes',
    pgrResponsible: 'Eng. Ana Beatriz',
    ltcatResponsible: 'Eng. Ana Beatriz',
    pcmsoResponsible: 'Dr. Carlos Alberto',
  },
  {
    id: 'UNIT-002',
    name: 'Filial Rio de Janeiro',
    type: 'Unidade' as UnitType,
    description: 'Foco em vendas e suporte ao cliente regional.',
    cnpj: '12.345.678/0002-88',
    address: '456 Ocean Drive, Rio de Janeiro, RJ',
    status: 'Ativa',
    cnae: '62.01-5-01',
    riskLevel: '3',
    legalResponsible: 'Dr. Ricardo Mendes',
    pgrResponsible: 'Eng. Carlos Silva',
    ltcatResponsible: 'Eng. Carlos Silva',
    pcmsoResponsible: 'Dra. Fernanda Costa',
  },
  {
    id: 'UNIT-003',
    name: 'Obra Edifício Comercial',
    type: 'Obra' as UnitType,
    description: 'Construção do novo centro comercial na Av. Paulista.',
    cnpj: '12.345.678/0001-99', // CNPJ da Matriz
    address: 'Av. Paulista, 1000, São Paulo, SP',
    status: 'Ativa',
    cnae: '41.20-4-00',
    riskLevel: '4',
    legalResponsible: 'Dr. Ricardo Mendes',
    pgrResponsible: 'Eng. Marcos Lima',
    ltcatResponsible: 'Eng. Marcos Lima',
    pcmsoResponsible: 'Dra. Sofia Almeida',
  },
]

export type Unit = (typeof initialUnitsData)[0]
