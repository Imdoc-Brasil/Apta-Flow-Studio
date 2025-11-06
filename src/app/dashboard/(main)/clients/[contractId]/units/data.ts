export const initialUnitsData = [
  {
    id: 'UNIT-001',
    name: 'Matriz São Paulo',
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
]

export type Unit = (typeof initialUnitsData)[0]
