
export interface Hazard {
    id: string
    name: string
    esocialCode: string
    method: string
    category: string
    legalBasis: string
    potentialEffects: string
}

export interface Epc {
    id: string
    name: string
    active: boolean
    attenuation: string
}

export interface Epi {
    id: string
    name: string
    ca: string
    active: boolean
}

export interface EpiStock {
    id: string
    epiId: string
    quantity: number
    minStock: number
}

export interface EpiDelivery {
    id: string
    epiId: string
    epiName: string
    employeeId: string
    employeeName: string
    deliveryDate: string
    quantity: number
}

export type RiskLevelLabel =
  | 'Irrelevante'
  | 'Leve'
  | 'Médio'
  | 'Alto'
  | 'Crítico'

export type RiskColor =
  | 'bg-gray-300'
  | 'bg-lime-200'
  | 'bg-yellow-200'
  | 'bg-orange-300'
  | 'bg-red-400'
  | 'bg-red-500'

export interface RiskEvaluation {
  frequency: number
  severity: number
  riskLevel: number
  riskLabel: RiskLevelLabel
  riskColor: RiskColor
  riskDescription: string
}

export interface PgrInventoryItem {
  id?: string
  hazardId: string
  unitId: string
  sector: string
  source: string
  evaluation: RiskEvaluation | null
}
