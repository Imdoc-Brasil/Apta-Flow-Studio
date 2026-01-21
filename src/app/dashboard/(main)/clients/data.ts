
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

// Helper function to check if client has pending information
export function getClientPendingFields(client: Client): string[] {
  const pending: string[] = []

  if (!client.adminResponsibleName) pending.push('Responsável Administrativo')
  if (!client.adminResponsibleCPF) pending.push('CPF do Responsável Administrativo')
  if (!client.contractResponsibleName) pending.push('Responsável pelo Contrato')
  if (!client.contractResponsiblePhone) pending.push('Telefone do Responsável')
  if (!client.contractResponsibleEmail) pending.push('E-mail do Responsável')

  return pending
}

// Check if client has any pending fields
export function hasClientPendingFields(client: Client): boolean {
  return getClientPendingFields(client).length > 0
}
