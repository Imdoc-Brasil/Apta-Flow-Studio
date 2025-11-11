export type UnitType = 'Unidade' | 'Obra' | 'Contrato'

export interface PropertyInfo {
  address: string
  zipCode: string
  neighborhood: string
  city: string
  state: string
  country: string
  totalArea: string
  builtArea: string
}

export interface ContractingCompany {
  name: string
  cnpj: string
  cnae: string
  riskLevel: string
}

export interface Unit {
  id?: string
  name: string
  type: UnitType
  description: string
  cnpj: string
  propertyInfo: PropertyInfo
  status: 'Ativa' | 'Inativa'
  cnae: string
  riskLevel: string
  legalResponsible: string
  pgrResponsible: string
  ltcatResponsible: string
  pcmsoResponsible: string
  cno?: string
  contractingCompany?: ContractingCompany
}


export const initialUnitsData: Unit[] = [
  {
    id: 'UNIT-001',
    name: 'Matriz São Paulo',
    type: 'Unidade' as UnitType,
    description: 'Sede administrativa e operações centrais.',
    cnpj: '12.345.678/0001-99',
    propertyInfo: {
      address: 'Rua das Flores, 123, Sala 101',
      zipCode: '01234-567',
      neighborhood: 'Centro',
      city: 'São Paulo',
      state: 'SP',
      country: 'Brasil',
      totalArea: '1000m²',
      builtArea: '800m²',
    },
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
    propertyInfo: {
      address: 'Avenida Atlântica, 456',
      zipCode: '22070-002',
      neighborhood: 'Copacabana',
      city: 'Rio de Janeiro',
      state: 'RJ',
      country: 'Brasil',
      totalArea: '500m²',
      builtArea: '400m²',
    },
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
    cno: '90.123456.78.99',
    propertyInfo: {
      address: 'Av. Paulista, 1000',
      zipCode: '01310-100',
      neighborhood: 'Bela Vista',
      city: 'São Paulo',
      state: 'SP',
      country: 'Brasil',
      totalArea: '5000m²',
      builtArea: '20000m² (em construção)',
    },
    status: 'Ativa',
    cnae: '41.20-4-00',
    riskLevel: '4',
    legalResponsible: 'Dr. Ricardo Mendes',
    pgrResponsible: 'Eng. Marcos Lima',
    ltcatResponsible: 'Eng. Marcos Lima',
    pcmsoResponsible: 'Dra. Sofia Almeida',
  },
]
