export interface PsychosocialQuestion {
  id: string
  text: string
}

export interface PsychosocialStressorGroup {
  id: string
  name: string
  questions: PsychosocialQuestion[]
}

export type SurveyStatus = 'Planejada' | 'Em Andamento' | 'Concluída'

export interface PsychosocialSurvey {
  id: string
  creationDate: string
  clientName: string
  unit: string
  circumstances: string
  status: SurveyStatus
}
