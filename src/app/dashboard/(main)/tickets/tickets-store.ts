'use client'

import { create } from 'zustand'

export const availableLabels = [
  { id: 'bug', name: 'Bug', color: 'bg-red-500' },
  { id: 'feature', name: 'Feature', color: 'bg-blue-500' },
  { id: 'docs', name: 'Documentation', color: 'bg-green-500' },
  { id: 'urgent', name: 'Urgent', color: 'bg-yellow-500 text-black' },
] as const

export type Label = (typeof availableLabels)[number]

export const initialTicketsData = [
  {
    id: 'TKT-001',
    subject: 'Não consigo fazer login no portal',
    client: 'Innovate Inc.',
    priority: 'Alta',
    status: 'Aberto',
    updated: new Date('2024-07-21T10:30:00').toISOString(),
    description:
      'Ao tentar acessar o portal do cliente, recebo uma mensagem de "usuário ou senha inválida", mas minhas credenciais estão corretas. Já tentei limpar o cache e usar outro navegador.',
    assignedTo: ['sarah.chen@aptaflow.com'],
    labels: [availableLabels[0], availableLabels[3]],
  },
  {
    id: 'TKT-002',
    subject: 'Pedido de recurso: Modo Escuro',
    client: 'Solutions Co.',
    priority: 'Média',
    status: 'Em Progresso',
    updated: new Date('2024-07-21T09:15:00').toISOString(),
    description:
      'Gostaríamos de solicitar a implementação de um tema escuro na plataforma para melhorar o conforto visual durante o uso noturno.',
    labels: [availableLabels[1]],
  },
  {
    id: 'TKT-003',
    subject: 'Consulta de faturamento',
    client: 'Stellar Tech',
    priority: 'Baixa',
    status: 'Aberto',
    updated: new Date('2024-07-20T16:00:00').toISOString(),
    description:
      'Tenho uma dúvida sobre um item que apareceu na nossa última fatura. Podemos agendar uma chamada para esclarecer?',
    labels: [],
  },
  {
    id: 'TKT-004',
    subject: 'Endpoint da API retornando erro 500',
    client: 'Quantum Dynamics',
    priority: 'Alta',
    status: 'Resolvido',
    updated: new Date('2024-07-19T11:00:00').toISOString(),
    description:
      'O endpoint GET /api/v1/data está retornando um erro 500 Internal Server Error desde ontem. Isso está impactando nossa integração.',
    assignedTo: ['david.r@aptaflow.com', 'michael.b@aptaflow.com'],
    labels: [availableLabels[0]],
  },
  {
    id: 'TKT-005',
    subject: 'Dúvida sobre integração',
    client: 'Apex Innovations',
    priority: 'Baixa',
    status: 'Fechado',
    updated: new Date('2024-07-18T14:45:00').toISOString(),
    description:
      'Estamos tentando integrar nosso sistema com a API de vocês e precisamos de ajuda para entender o fluxo de autenticação OAuth2.',
    labels: [availableLabels[2]],
  },
] as const

export type TicketStatus = 'Aberto' | 'Em Progresso' | 'Resolvido' | 'Fechado'
export type Ticket = Omit<
  (typeof initialTicketsData)[0],
  'assignedTo' | 'labels'
> & {
  assignedTo?: string[]
  labels?: Label[]
}

type TicketStore = {
  tickets: Ticket[]
  addTicket: (
    newTicket: Omit<
      Ticket,
      'id' | 'status' | 'updated' | 'assignedTo' | 'labels'
    >
  ) => void
  setTickets: (tickets: Ticket[]) => void
}

export const useTicketStore = create<TicketStore>((set) => ({
  tickets: [...initialTicketsData].map((ticket) => ({
    ...ticket,
    updated: new Date(ticket.updated).toISOString(),
    assignedTo: ticket.assignedTo || [],
    labels: ticket.labels || [],
  })),
  addTicket: (newTicket) =>
    set((state) => ({
      tickets: [
        {
          ...newTicket,
          id: `TKT-${Math.random().toString(36).substring(2, 5).toUpperCase()}`,
          status: 'Aberto',
          updated: new Date().toISOString(),
          assignedTo: [],
          labels: [],
        },
        ...state.tickets,
      ],
    })),
  setTickets: (tickets) => set({ tickets }),
}))
