'use client'

import { create } from 'zustand'

export type Status = 'Agendado' | 'Em Atendimento' | 'Concluído'
export type ExamStatus = 'Pendente' | 'Realizado'

export interface Exam {
  id: string
  name: string
  status: ExamStatus
}

export interface Attendee {
  id: string
  patientName: string
  clientName: string
  solicitationType: string // Gatilho principal, ex: "ASO Periódico"
  status: Status
  exams: Exam[]
}

export const initialAttendees: Attendee[] = [
  {
    id: '1',
    patientName: 'Carlos Pereira',
    clientName: 'Innovate Inc.',
    solicitationType: 'ASO Periódico',
    status: 'Agendado',
    exams: [
      { id: 'EXM-001-A', name: 'Avaliação Clínica', status: 'Pendente' },
      { id: 'EXM-001-B', name: 'Audiometria', status: 'Pendente' },
    ],
  },
  {
    id: '2',
    patientName: 'Ana Costa',
    clientName: 'Solutions Co.',
    solicitationType: 'Eletrocardiograma',
    status: 'Em Atendimento',
    exams: [{ id: 'EXM-003', name: 'Eletrocardiograma', status: 'Pendente' }],
  },
  {
    id: '3',
    patientName: 'João da Silva',
    clientName: 'Innovate Inc.',
    solicitationType: 'Avaliação Clínica',
    status: 'Concluído',
    exams: [
      { id: 'EXM-004', name: 'Avaliação Clínica', status: 'Realizado' },
    ],
  },
  {
    id: '4',
    patientName: 'Maria Oliveira',
    clientName: 'Quantum Dynamics',
    solicitationType: 'Exames de Imagem',
    status: 'Agendado',
    exams: [
      { id: 'EXM-005', name: 'Raio-X de Tórax', status: 'Pendente' },
      { id: 'EXM-006', name: 'Raio-X de Coluna Lombar', status: 'Pendente' },
    ],
  },
]

type AttendeeStore = {
  attendees: Attendee[]
  addAttendee: (newAttendeeData: Omit<Attendee, 'id'>) => void
  setAttendees: (attendees: Attendee[]) => void
  updateExamStatus: (
    attendeeId: string,
    examId: string,
    status: ExamStatus
  ) => void
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
  updateExamStatus: (attendeeId, examId, status) =>
    set((state) => ({
      attendees: state.attendees.map((attendee) => {
        if (attendee.id === attendeeId) {
          const updatedExams = attendee.exams.map((exam) =>
            exam.id === examId ? { ...exam, status } : exam
          )
          // Opcional: Atualizar o status geral do atendimento se todos os exames estiverem concluídos
          const allExamsDone = updatedExams.every(
            (e) => e.status === 'Realizado'
          )
          return {
            ...attendee,
            exams: updatedExams,
            status: allExamsDone ? 'Concluído' : attendee.status,
          }
        }
        return attendee
      }),
    })),
}))
