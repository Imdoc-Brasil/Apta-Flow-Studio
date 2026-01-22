export type Action = 'view' | 'create' | 'edit' | 'delete'

export type Module =
  | 'clients'
  | 'clients.info'
  | 'clients.tickets'
  | 'clients.structure'
  | 'clients.sst'
  | 'staffs'
  | 'tickets'
  | 'services'
  | 'services.catalog'
  | 'services.advisory'
  | 'services.rentals'
  | 'services.outsourcing'
  | 'risks'
  | 'risks.hazards'
  | 'risks.epc'
  | 'risks.epi'
  | 'health'
  | 'health.queue'
  | 'health.exams'
  | 'health.reports'
  | 'health.clinical-exams'
  | 'performance'
  | 'processes'
  | 'analytics'

export type Permission = `${Action}:${Module}`

export interface SubModule {
  id: Module
  name: string
}

export interface PermissionModule {
  id: Module
  name: string
  subModules?: SubModule[]
}

export interface Profile {
  id: string
  name: string
  code?: string
  createdBy?: string
  createdAt?: string
  permissions?: Permission[]
}
