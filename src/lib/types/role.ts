
export interface Role {
  id: string
  name: string
  description: string
  sectorId: string
  cbo: string
  activities: string[]
  requirements: string
  mainWorkstationId?: string
  additionalWorkstationIds?: string[]
  requiredExams?: string
  status?: 'Ativo' | 'Arquivado'
}
