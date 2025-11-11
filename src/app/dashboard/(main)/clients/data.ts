
export interface Client {
  id: string
  name: string
  cnpj: string
  status: 'Ativo' | 'Inativo'
  
  // New fields from CNPJ data
  tradeName?: string; // Nome Fantasia
  cnae?: string;
  address?: string;
  riskLevel?: string;
  
  // New responsible fields
  adminResponsibleName: string;
  adminResponsibleCPF: string;
  contractResponsibleName: string;
  contractResponsiblePhone: string;
  contractResponsibleEmail: string;

  // Document paths (placeholders for now)
  cnpjCardUrl?: string;
  socialContractUrl?: string;
  priceTableUrl?: string;
}

export const initialClientsData: Client[] = [
  {
    id: 'CTR-2024-001',
    name: 'Innovate Inc.',
    cnpj: '12.345.678/0001-99',
    status: 'Ativo',
    cnae: '62.01-5-01',
    riskLevel: '3',
    address: 'Rua das Flores, 123, Sala 101, Centro, São Paulo, SP, 01234-567',
    adminResponsibleName: 'Juliana Paes',
    adminResponsibleCPF: '111.222.333-44',
    contractResponsibleName: 'Juliana Paes',
    contractResponsibleEmail: 'juliana.paes@innovateinc.com',
    contractResponsiblePhone: '(11) 99999-9999'
  },
  {
    id: 'CTR-2024-002',
    name: 'Solutions Co.',
    cnpj: '98.765.432/0001-11',
    status: 'Ativo',
    cnae: '63.11-9-00',
    riskLevel: '2',
    address: '456 Business Blvd, New York, NY',
    adminResponsibleName: 'Márcio Garcia',
    adminResponsibleCPF: '222.333.444-55',
    contractResponsibleName: 'Márcio Garcia',
    contractResponsibleEmail: 'marcio.garcia@solutionsco.com',
    contractResponsiblePhone: '(21) 88888-8888'
  },
  {
    id: 'CTR-2024-003',
    name: 'Quantum Dynamics',
    cnpj: '55.555.555/0001-55',
    status: 'Inativo',
    cnae: '72.10-0-00',
    riskLevel: '4',
    address: '789 Innovation Dr, Boston, MA',
    adminResponsibleName: 'Fernanda Lima',
    adminResponsibleCPF: '333.444.555-66',
    contractResponsibleName: 'Fernanda Lima',
    contractResponsibleEmail: 'fernanda.lima@quantum.com',
    contractResponsiblePhone: '(31) 77777-7777'
  },
  {
    id: 'CTR-2024-004',
    name: 'Stellar Tech',
    cnpj: '11.222.333/0001-44',
    status: 'Ativo',
    cnae: '26.21-3-00',
    riskLevel: '3',
    address: '101 Galaxy Way, Seattle, WA',
    adminResponsibleName: 'Rodrigo Hilbert',
    adminResponsibleCPF: '444.555.666-77',
    contractResponsibleName: 'Rodrigo Hilbert',
    contractResponsibleEmail: 'rodrigo.hilbert@stellar.com',
    contractResponsiblePhone: '(41) 66666-6666'
  },
  {
    id: 'CTR-2024-005',
    name: 'Apex Innovations',
    cnpj: '44.555.666/0001-77',
    status: 'Ativo',
    cnae: '62.03-1-00',
    riskLevel: '2',
    address: '210 Apex Circle, Austin, TX',
    adminResponsibleName: 'Taís Araújo',
    adminResponsibleCPF: '555.666.777-88',
    contractResponsibleName: 'Taís Araújo',
    contractResponsibleEmail: 'tais.araujo@apex.com',
    contractResponsiblePhone: '(51) 55555-5555'
  },
]
