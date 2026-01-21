
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
