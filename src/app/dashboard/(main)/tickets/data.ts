
export const availableLabels = [
  { id: 'bug', name: 'Bug', color: 'bg-red-500' },
  { id: 'feature', name: 'Feature', color: 'bg-blue-500' },
  { id: 'docs', name: 'Documentation', color: 'bg-green-500' },
  { id: 'urgent', name: 'Urgent', color: 'bg-yellow-500 text-black' },
] as const

export type Label = (typeof availableLabels)[number]

export interface Attachment {
  id: string
  name: string
  url: string
}

export interface ChecklistItem {
  id: string
  text: string
  completed: boolean
  dueDate?: string
  completedBy?: string
  completedAt?: string
  assignedTo?: string[]
}

export interface Checklist {
  id: string
  title: string
  items: ChecklistItem[]
  creator: string
  creatorAvatar?: string
  creatorFallback?: string
  createdAt: string
}

export interface TextElement {
  id: string
  type: 'note' | 'question' | 'comment'
  title: string
  content: string
  creator: string
  creatorAvatar?: string
  creatorFallback?: string
  createdAt: string
  dueDate?: string
  assignedTo?: string[]
}

export type TicketStatus = 'Aberto' | 'Em Progresso' | 'Resolvido' | 'Fechado' | 'Arquivado'

export const kanbanColumns: TicketStatus[] = [
  'Aberto',
  'Em Progresso',
  'Resolvido',
  'Fechado',
]

export type Ticket = {
  id: string
  subject: string
  client: string
  priority: 'Alta' | 'Média' | 'Baixa'
  status: TicketStatus
  updated: string
  createdAt: string
  description?: string
  assignedTo?: string[]
  labels?: Label[]
  checklists?: Checklist[]
  attachments?: Attachment[]
  textElements?: TextElement[]
  relatedEmployee?: string
  solicitationType?: string // Added for health requests
}
