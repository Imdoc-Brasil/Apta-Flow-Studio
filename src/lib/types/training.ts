export type TrainingModality = 'Online' | 'Presencial' | 'Híbrido'
export type TrainingType = 'NR' | 'Uso de EPI' | 'Procedimento Interno' | 'Outro'
export type ModuleType = 'Video' | 'Texto' | 'Quiz'
export type ScheduledStatus =
  | 'Agendado'
  | 'Em Andamento'
  | 'Concluído'
  | 'Cancelado'

export interface TrainingModule {
  id: string
  title: string
  type: ModuleType
  content: string
}

export interface Training {
  id: string
  title: string
  description: string
  type: TrainingType
  modality: TrainingModality
  workload: number // in hours
  validity: number // in months
  modules?: TrainingModule[]
}

export interface ScheduledTraining {
  id: string
  trainingId: string
  title: string
  modality: TrainingModality
  scheduledDate: string
  status: ScheduledStatus
  instructorId: string
  enrolledEmployees: string[]
}
