
export interface Client {
  id: string
  name: string
  cnpj: string
  status: 'Ativo' | 'Inativo'
  responsibleName: string
  responsibleContact: string
  cnae: string
  riskLevel: string
  contact: string
  address: string
}

export const initialClientsData: Client[] = [
  {
    id: 'CTR-2024-001',
    name: 'Innovate Inc.',
    cnpj: '12.345.678/0001-99',
    status: 'Ativo',
    responsibleName: 'Juliana Paes',
    responsibleContact: 'juliana.paes@innovateinc.com',
    cnae: '62.01-5-01',
    riskLevel: '3',
    contact: 'contact@innovateinc.com',
    address: 'Rua das Flores, 123, Sala 101, Centro, São Paulo, SP, 01234-567',
  },
  {
    id: 'CTR-2024-002',
    name: 'Solutions Co.',
    cnpj: '98.765.432/0001-11',
    status: 'Ativo',
    responsibleName: 'Márcio Garcia',
    responsibleContact: 'marcio.garcia@solutionsco.com',
    cnae: '63.11-9-00',
    riskLevel: '2',
    contact: 'support@solutionsco.com',
    address: '456 Business Blvd, New York, NY',
  },
  {
    id: 'CTR-2024-003',
    name: 'Quantum Dynamics',
    cnpj: '55.555.555/0001-55',
    status: 'Inativo',
    responsibleName: 'Fernanda Lima',
    responsibleContact: 'fernanda.lima@quantum.com',
    cnae: '72.10-0-00',
    riskLevel: '4',
    contact: 'fernanda.lima@quantum.com',
    address: '789 Innovation Dr, Boston, MA',
  },
  {
    id: 'CTR-2024-004',
    name: 'Stellar Tech',
    cnpj: '11.222.333/0001-44',
    status: 'Ativo',
    responsibleName: 'Rodrigo Hilbert',
    responsibleContact: 'rodrigo.hilbert@stellar.com',
    cnae: '26.21-3-00',
    riskLevel: '3',
    contact: 'rodrigo.hilbert@stellar.com',
    address: '101 Galaxy Way, Seattle, WA',
  },
  {
    id: 'CTR-2024-005',
    name: 'Apex Innovations',
    cnpj: '44.555.666/0001-77',
    status: 'Ativo',
    responsibleName: 'Taís Araújo',
    responsibleContact: 'tais.araujo@apex.com',
    cnae: '62.03-1-00',
    riskLevel: '2',
    contact: 'contact@apexinnovations.com',
    address: '210 Apex Circle, Austin, TX',
  },
]
