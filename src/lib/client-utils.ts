import type { Client } from '@/lib/types/client'

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
