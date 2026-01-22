import type { Employee } from './employee'

export interface Aso {
  id: string
  employee: string
  type: string
  issueDate: string
  validity: string
  status: string
}

export interface PcmsoRule {
  id: string
  riskId: string
  examIds: string[]
}

// From attendee-store
export type AttendeeStatus =
  | 'Agendado'
  | 'Aguardando'
  | 'Em Atendimento'
  | 'Concluído'
  | 'Cancelado'
export type ExamStatus = 'Pendente' | 'Realizado'

export interface ScheduledExam {
  id: string
  name: string
  status: ExamStatus
}

export interface Attendee {
  id: string
  patientName: string
  clientName: string
  solicitationType: string
  status: AttendeeStatus
  exams: ScheduledExam[]
  createdAt: string
  checkInTime?: string
  allExamsCompletedAt?: string
}
