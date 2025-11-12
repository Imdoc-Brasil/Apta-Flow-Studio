export interface Machine {
  id: string
  name: string
  manufacturer: string
  model: string
  function: string
  isRiskSource: boolean
  riskDescription?: string
  maintenanceInfo: string
}
