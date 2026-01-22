export type StaffStatus = 'Ativo' | 'Licença' | 'Suspenso'
export type StaffSituation = 'Online' | 'Offline'

export interface Staff {
  id?: string
  code: string
  name: string
  perfilId: string
  assinatura: string
  avatar: string
  fallback: string
  email: string
  phone?: string
  status: StaffStatus
  situacao: StaffSituation
  contractId?: string
  clientIds?: string[]
}
