
export interface ProcessStep {
  id: string
  name: string
  responsibleRole: string // Will store Role ID
  description: string
  isControlPoint: boolean
  isRiskSource?: boolean
  sectorId?: string // Store Sector ID
}

export type ProcessType = 'POP' | 'PP' | 'PRS' | 'PRT' | 'PI' | 'Outro'

export interface Process {
  id: string
  name: string
  objective: string
  steps: ProcessStep[]
  type: ProcessType
  obligations: string[]
  isCritical: boolean
  status?: 'Ativo' | 'Arquivado'
}
