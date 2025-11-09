'use client'

import { create } from 'zustand'

export type Status = 'Agendado' | 'Em Atendimento' | 'Concluído'

export interface Attendee {
  id: string
  patientName: string
  clientName: string
  examType: string
  status: Status
}

export const initialAttendees: Attendee[] = [
  {
    id: '1',
    patientName: 'Carlos Pereira',
    clientName: 'Innovate Inc.',
    examType: 'ASO Periódico',
    status: 'Agendado',
  },
  {
    id: '2',
    patientName: 'Ana Costa',
    clientName: 'Solutions Co.',
    examType: 'Eletrocardiograma',
    status: 'Em Atendimento',
  },
  {
    id: '3',
    patientName: 'João da Silva',
    clientName: 'Innovate Inc.',
    examType: 'Avaliação Clínica',
    status: 'Concluído',
  },
  {
    id: '4',
    patientName: 'Maria Oliveira',
    clientName: 'Quantum Dynamics',
    examType: 'Raio-X de Tórax',
    status: 'Agendado',
  },
]

type AttendeeStore = {
  attendees: Attendee[]
  addAttendee: (newAttendeeData: Omit<Attendee, 'id'>) => void
  setAttendees: (attendees: Attendee[]) => void
}

export const useAttendeeStore = create<AttendeeStore>((set) => ({
  attendees: initialAttendees,
  addAttendee: (newAttendeeData) =>
    set((state) => ({
      attendees: [
        {
          ...newAttendeeData,
          id: `att-${Date.now()}`,
        },
        ...state.attendees,
      ],
    })),
  setAttendees: (attendees) => set({ attendees }),
}))
