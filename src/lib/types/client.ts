
export interface Client {
  id: string
  name: string
  cnpj: string
  status: 'Ativo' | 'Inativo'

  // New fields from CNPJ data
  tradeName?: string; // Nome Fantasia
  cnae?: string;
  secondaryCnaes?: string[];
  address?: string;
  riskLevel?: string;

  // New responsible fields (now optional)
  adminResponsibleName?: string;
  adminResponsibleCPF?: string;
  contractResponsibleName?: string;
  contractResponsiblePhone?: string;
  contractResponsibleEmail?: string;

  // Document paths (placeholders for now)
  cnpjCardUrl?: string;
  socialContractUrl?: string;
  priceTableUrl?: string;
}
