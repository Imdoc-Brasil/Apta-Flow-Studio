import type { TicketStatus } from "@/lib/types/ticket";

export const availableLabels = [
  { id: 'bug', name: 'Bug', color: 'bg-red-500' },
  { id: 'feature', name: 'Feature', color: 'bg-blue-500' },
  { id: 'docs', name: 'Documentation', color: 'bg-green-500' },
  { id: 'urgent', name: 'Urgent', color: 'bg-yellow-500 text-black' },
] as const

export const kanbanColumns: TicketStatus[] = [
  'Aberto',
  'Em Progresso',
  'Resolvido',
  'Fechado',
]
