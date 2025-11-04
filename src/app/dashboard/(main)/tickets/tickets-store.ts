import { create } from 'zustand'

export const initialTicketsData = [
  {
    id: 'TKT-001',
    subject: 'Não consigo fazer login no portal',
    client: 'Innovate Inc.',
    priority: 'Alta',
    status: 'Aberto',
    updated: '2024-07-21 10:30',
    description:
      'Ao tentar acessar o portal do cliente, recebo uma mensagem de "usuário ou senha inválida", mas minhas credenciais estão corretas. Já tentei limpar o cache e usar outro navegador.',
  },
  {
    id: 'TKT-002',
    subject: 'Pedido de recurso: Modo Escuro',
    client: 'Solutions Co.',
    priority: 'Média',
    status: 'Em Progresso',
    updated: '2024-07-21 09:15',
    description:
      'Gostaríamos de solicitar a implementação de um tema escuro na plataforma para melhorar o conforto visual durante o uso noturno.',
  },
  {
    id: 'TKT-003',
    subject: 'Consulta de faturamento',
    client: 'Stellar Tech',
    priority: 'Baixa',
    status: 'Aberto',
    updated: '2024-07-20 16:00',
    description:
      'Tenho uma dúvida sobre um item que apareceu na nossa última fatura. Podemos agendar uma chamada para esclarecer?',
  },
  {
    id: 'TKT-004',
    subject: 'Endpoint da API retornando erro 500',
    client: 'Quantum Dynamics',
    priority: 'Alta',
    status: 'Resolvido',
    updated: '2024-07-19 11:00',
    description:
      'O endpoint GET /api/v1/data está retornando um erro 500 Internal Server Error desde ontem. Isso está impactando nossa integração.',
  },
  {
    id: 'TKT-005',
    subject: 'Dúvida sobre integração',
    client: 'Apex Innovations',
    priority: 'Baixa',
    status: 'Fechado',
    updated: '2024-07-18 14:45',
    description:
      'Estamos tentando integrar nosso sistema com a API de vocês e precisamos de ajuda para entender o fluxo de autenticação OAuth2.',
  },
] as const

export type TicketStatus = 'Aberto' | 'Em Progresso' | 'Resolvido' | 'Fechado'
export type Ticket = (typeof initialTicketsData)[0]

type TicketStore = {
  tickets: Ticket[]
  addTicket: (newTicket: Omit<Ticket, 'id' | 'status' | 'updated'>) => void
  setTickets: (tickets: Ticket[]) => void
}

export const useTicketStore = create<TicketStore>((set) => ({
  tickets: [...initialTicketsData],
  addTicket: (newTicket) =>
    set((state) => ({
      tickets: [
        {
          ...newTicket,
          id: `TKT-${Math.random().toString(36).substring(2, 5).toUpperCase()}`,
          status: 'Aberto',
          updated: new Date().toISOString().replace('T', ' ').substring(0, 16),
        },
        ...state.tickets,
      ],
    })),
  setTickets: (tickets) => set({ tickets }),
}))
