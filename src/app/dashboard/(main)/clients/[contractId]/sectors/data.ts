
export interface Sector {
  id: string
  code?: string
  name: string
  description: string
  unitId: string
}

// Export array vazio para compatibilidade com imports
export const sectors: Sector[] = []
