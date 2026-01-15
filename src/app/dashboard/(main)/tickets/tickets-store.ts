
'use client'

import { create } from 'zustand'
import { persist, createJSONStorage } from 'zustand/middleware'
import type {
  Ticket,
  TicketStatus,
  Checklist,
  ChecklistItem,
  TextElement,
  Attachment,
} from './data'

type NewTicketData = Omit<
  Ticket,
  'id' | 'status' | 'updated' | 'checklists' | 'attachments' | 'textElements'
>

type TicketStore = {
  tickets: Ticket[]
  addTicket: (newTicket: NewTicketData) => void
  setTickets: (tickets: Ticket[]) => void
  updateTicketStatus: (ticketId: string, status: TicketStatus) => void
  startWorkOnTicket: (ticketId: string, userEmail: string) => void
  addChecklist: (
    ticketId: string,
    title: string,
    firstItemText: string,
    firstItemDueDate?: string,
    firstItemAssignedTo?: string[]
  ) => void
  addChecklistItem: (
    ticketId: string,
    checklistId: string,
    text: string,
    dueDate?: string,
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
  addTextElement: (
    ticketId: string,
    data: Omit<TextElement, 'id' | 'createdAt'>
  ) => void
}

export const useTicketStore = create<TicketStore>()(
  persist(
    (set) => ({
      tickets: [],
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
              createdAt: new Date().toISOString(),
              assignedTo: newTicket.assignedTo || [],
              labels: newTicket.labels || [],
              checklists: [],
              attachments: [],
              textElements: [],
            },
            ...state.tickets,
          ],
        })),
      setTickets: (tickets) => set({ tickets }),
      updateTicketStatus: (ticketId, status) =>
        set((state) => ({
          tickets: state.tickets.map((ticket) =>
            ticket.id === ticketId
              ? { ...ticket, status, updated: new Date().toISOString() }
              : ticket
          ),
        })),
      startWorkOnTicket: (ticketId, userEmail) =>
        set((state) => ({
          tickets: state.tickets.map((ticket) => {
            if (
              ticket.id === ticketId &&
              ticket.status === 'Aberto' &&
              !ticket.assignedTo?.includes(userEmail)
            ) {
              return {
                ...ticket,
                status: 'Em Progresso',
                assignedTo: [...(ticket.assignedTo || []), userEmail],
                updated: new Date().toISOString(),
              }
            }
            return ticket
          }),
        })),
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
              const creator = {
                name: 'Sarah Chen',
                avatar: 'https://i.pravatar.cc/150?u=a042581f4e29026701d',
                fallback: 'SC',
              }
              const newChecklist: Checklist = {
                id: `cl-${Date.now()}`,
                title,
                createdAt: new Date().toISOString(),
                creator: creator.name,
                creatorAvatar: creator.avatar,
                creatorFallback: creator.fallback,
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
              }
              return {
                ...ticket,
                attachments: [...(ticket.attachments || []), newAttachment],
              }
            }
            return ticket
          }),
        })),
      addTextElement: (ticketId, data) =>
        set((state) => ({
          tickets: state.tickets.map((ticket) => {
            if (ticket.id === ticketId) {
              const newTextElement: TextElement = {
                ...data,
                id: `txt-${Date.now()}`,
                createdAt: new Date().toISOString(),
              }
              return {
                ...ticket,
                textElements: [...(ticket.textElements || []), newTextElement],
              }
            }
            return ticket
          }),
        })),
    }),
    {
      name: 'ticket-storage',
      storage: createJSONStorage(() => localStorage),
    }
  )
)
