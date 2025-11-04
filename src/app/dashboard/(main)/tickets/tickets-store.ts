'use client'

import { create } from 'zustand'

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
  dueDate: string
  completedBy?: string
  completedAt?: string
  assignedTo?: string[]
}

export interface Checklist {
  id: string
  title: string
  items: ChecklistItem[]
}

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
    checklists: [],
    attachments: [],
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
    checklists: [
      {
        id: 'cl-1',
        title: 'Desenvolvimento Frontend',
        items: [
          {
            id: 'item-1-1',
            text: 'Criar variáveis de cor para o tema escuro',
            completed: true,
            dueDate: '2024-07-25',
            completedBy: 'David Rodriguez',
            completedAt: new Date('2024-07-22T14:00:00Z').toISOString(),
            assignedTo: ['david.r@aptaflow.com'],
          },
          {
            id: 'item-1-2',
            text: 'Aplicar tema aos componentes principais',
            completed: false,
            dueDate: '2024-07-28',
            assignedTo: ['david.r@aptaflow.com'],
          },
          {
            id: 'item-1-3',
            text: 'Testar em todos os navegadores',
            completed: false,
            dueDate: '2024-07-30',
          },
        ],
      },
    ],
    attachments: [
      {
        id: 'att-1',
        name: 'mockup-dark-mode.png',
        url: '#',
      },
    ],
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
    checklists: [],
    attachments: [],
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
    checklists: [],
    attachments: [],
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
    checklists: [],
    attachments: [],
  },
] as const

export type TicketStatus = 'Aberto' | 'Em Progresso' | 'Resolvido' | 'Fechado'
export type Ticket = Omit<
  (typeof initialTicketsData)[0],
  'assignedTo' | 'labels' | 'checklists' | 'attachments'
> & {
  assignedTo?: string[]
  labels?: Label[]
  checklists?: Checklist[]
  attachments?: Attachment[]
}

type TicketStore = {
  tickets: Ticket[]
  addTicket: (
    newTicket: Omit<
      Ticket,
      'id' | 'status' | 'updated' | 'assignedTo' | 'labels' | 'checklists' | 'attachments'
    >
  ) => void
  setTickets: (tickets: Ticket[]) => void
  addChecklist: (
    ticketId: string,
    title: string,
    firstItemText: string,
    firstItemDueDate: string,
    firstItemAssignedTo?: string[]
  ) => void
  addChecklistItem: (
    ticketId: string,
    checklistId: string,
    text: string,
    dueDate: string,
    assignedTo?: string[]
  ) => void
  toggleChecklistItem: (
    ticketId: string,
    checklistId: string,
    itemId: string,
    completed: boolean,
    user: string
  ) => void
  addAttachment: (ticketId: string, name: string, file: File) => void
}

export const useTicketStore = create<TicketStore>((set) => ({
  tickets: [...initialTicketsData].map((ticket) => ({
    ...ticket,
    updated: new Date(ticket.updated).toISOString(),
    assignedTo: ticket.assignedTo ? [...ticket.assignedTo] : [],
    labels: ticket.labels ? [...ticket.labels] : [],
    checklists: ticket.checklists
      ? ticket.checklists.map((cl) => ({
          ...cl,
          items: cl.items.map((item) => ({ ...item, assignedTo: item.assignedTo ? [...item.assignedTo] : [] })),
        }))
      : [],
    attachments: ticket.attachments ? [...ticket.attachments] : [],
  })),
  addTicket: (newTicket) =>
    set((state) => ({
      tickets: [
        {
          ...newTicket,
          id: `TKT-${Math.random()
            .toString(36)
            .substring(2, 5)
            .toUpperCase()}`,
          status: 'Aberto',
          updated: new Date().toISOString(),
          assignedTo: [],
          labels: [],
          checklists: [],
          attachments: [],
        },
        ...state.tickets,
      ],
    })),
  setTickets: (tickets) => set({ tickets }),
  addChecklist: (
    ticketId,
    title,
    firstItemText,
    firstItemDueDate,
    firstItemAssignedTo
  ) =>
    set((state) => ({
      tickets: state.tickets.map((ticket) => {
        if (ticket.id === ticketId) {
          const newChecklist: Checklist = {
            id: `cl-${Date.now()}`,
            title,
            items: [
              {
                id: `item-${Date.now()}`,
                text: firstItemText,
                completed: false,
                dueDate: firstItemDueDate,
                assignedTo: firstItemAssignedTo || [],
              },
            ],
          }
          return {
            ...ticket,
            checklists: [...(ticket.checklists || []), newChecklist],
          }
        }
        return ticket
      }),
    })),
  addChecklistItem: (ticketId, checklistId, text, dueDate, assignedTo) =>
    set((state) => ({
      tickets: state.tickets.map((ticket) => {
        if (ticket.id === ticketId) {
          return {
            ...ticket,
            checklists: (ticket.checklists || []).map((checklist) => {
              if (checklist.id === checklistId) {
                const newItem: ChecklistItem = {
                  id: `item-${Date.now()}`,
                  text,
                  completed: false,
                  dueDate,
                  assignedTo: assignedTo || [],
                }
                return {
                  ...checklist,
                  items: [...checklist.items, newItem],
                }
              }
              return checklist
            }),
          }
        }
        return ticket
      }),
    })),
  toggleChecklistItem: (ticketId, checklistId, itemId, completed, user) =>
    set((state) => ({
      tickets: state.tickets.map((ticket) => {
        if (ticket.id === ticketId) {
          return {
            ...ticket,
            checklists: (ticket.checklists || []).map((checklist) => {
              if (checklist.id === checklistId) {
                return {
                  ...checklist,
                  items: checklist.items.map((item) => {
                    if (item.id === itemId) {
                      return {
                        ...item,
                        completed,
                        completedBy: completed ? user : undefined,
                        completedAt: completed
                          ? new Date().toISOString()
                          : undefined,
                      }
                    }
                    return item
                  }),
                }
              }
              return checklist
            }),
          }
        }
        return ticket
      }),
    })),
  addAttachment: (ticketId, name, file) =>
    set((state) => ({
      tickets: state.tickets.map((ticket) => {
        if (ticket.id === ticketId) {
          const newAttachment: Attachment = {
            id: `att-${Date.now()}`,
            name,
            url: URL.createObjectURL(file), // Placeholder URL
          };
          return {
            ...ticket,
            attachments: [...(ticket.attachments || []), newAttachment],
          };
        }
        return ticket;
      }),
    })),
}))
