'use client'

import { create } from 'zustand'
import {
  type Ticket,
  type TicketStatus,
  type Checklist,
  type ChecklistItem,
  type TextElement,
  type Attachment,
} from './data'

type NewTicketData = Omit<
  Ticket,
  'id' | 'status' | 'updated' | 'checklists' | 'attachments' | 'textElements'
>

type TicketStore = {
  tickets: Ticket[]
  setTickets: (tickets: Ticket[]) => void
}

// The store now only holds the in-memory state.
// Persistence is handled by Firestore in the page component.
export const useTicketStore = create<TicketStore>()((set) => ({
  tickets: [],
  setTickets: (tickets) => set({ tickets }),
}))
