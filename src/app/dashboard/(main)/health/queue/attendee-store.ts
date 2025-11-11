
'use client'

import { create } from 'zustand'

export type Status = 'Agendado' | 'Aguardando' | 'Em Atendimento' | 'Concluído' | 'Cancelado'
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
  solicitationType: string
  status: Status
  exams: Exam[]
  createdAt: string
  checkInTime?: string
  allExamsCompletedAt?: string
}

export const initialAttendees: Attendee[] = [
  {
    id: '1',
    patientName: 'Carlos Pereira',
    clientName: 'Innovate Inc.',
    solicitationType: 'ASO Periódico',
    status: 'Agendado',
    createdAt: new Date('2024-07-22T09:00:00Z').toISOString(),
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
    createdAt: new Date('2024-07-22T09:05:00Z').toISOString(),
    checkInTime: new Date('2024-07-22T09:10:00Z').toISOString(),
    exams: [{ id: 'EXM-003', name: 'Eletrocardiograma', status: 'Pendente' }],
  },
  {
    id: '3',
    patientName: 'João da Silva',
    clientName: 'Innovate Inc.',
    solicitationType: 'Avaliação Clínica',
    status: 'Concluído',
    createdAt: new Date('2024-07-21T14:00:00Z').toISOString(),
    checkInTime: new Date('2024-07-21T14:05:00Z').toISOString(),
    allExamsCompletedAt: new Date('2024-07-21T14:30:00Z').toISOString(),
    exams: [
      { id: 'EXM-004', name: 'Avaliação Clínica', status: 'Realizado' },
    ],
  },
  {
    id: '4',
    patientName: 'Maria Oliveira',
    clientName: 'Quantum Dynamics',
    solicitationType: 'Exames de Imagem',
    status: 'Aguardando',
    createdAt: new Date('2024-07-22T08:30:00Z').toISOString(),
    checkInTime: new Date('2024-07-22T08:45:00Z').toISOString(),
    exams: [
      { id: 'EXM-005', name: 'Raio-X de Tórax', status: 'Pendente' },
      { id: 'EXM-006', name: 'Raio-X de Coluna Lombar', status: 'Pendente' },
    ],
  },
]

type AttendeeStore = {
  attendees: Attendee[]
  addAttendee: (newAttendeeData: Omit<Attendee, 'id' | 'status' | 'createdAt' | 'allExamsCompletedAt'>) => void
  setAttendees: (attendees: Attendee[]) => void
  updateAttendeeStatus: (attendeeId: string, status: Status) => void
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
          status: 'Agendado',
          createdAt: new Date().toISOString(),
        },
        ...state.attendees,
      ],
    })),
  setAttendees: (attendees) => set({ attendees }),
  updateAttendeeStatus: (attendeeId, status) =>
    set((state) => ({
      attendees: state.attendees.map((attendee) => {
        if (attendee.id === attendeeId) {
          const isCheckingIn = status === 'Aguardando' && attendee.status !== 'Aguardando';
          return {
            ...attendee,
            status,
            checkInTime: isCheckingIn ? new Date().toISOString() : attendee.checkInTime
          };
        }
        return attendee;
      }),
    })),
  updateExamStatus: (attendeeId, examId, status) =>
    set((state) => ({
      attendees: state.attendees.map((attendee) => {
        if (attendee.id === attendeeId) {
          const updatedExams = attendee.exams.map((exam) =>
            exam.id === examId ? { ...exam, status } : exam
          );
          
          const allExamsDone = updatedExams.every(
            (e) => e.status === 'Realizado'
          );

          return {
            ...attendee,
            exams: updatedExams,
            status: allExamsDone ? 'Concluído' : attendee.status,
            allExamsCompletedAt: allExamsDone ? new Date().toISOString() : attendee.allExamsCompletedAt,
          };
        }
        return attendee;
      }),
    })),
}))
