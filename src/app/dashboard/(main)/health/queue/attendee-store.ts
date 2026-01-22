
'use client'

import { create } from 'zustand'
import { persist, createJSONStorage } from 'zustand/middleware'
import type { Attendee, AttendeeStatus, ExamStatus } from '@/lib/types/health'

type AttendeeStore = {
  attendees: Attendee[]
  addAttendee: (newAttendeeData: Omit<Attendee, 'id' | 'status' | 'createdAt' | 'allExamsCompletedAt'>) => void
  setAttendees: (attendees: Attendee[]) => void
  updateAttendeeStatus: (attendeeId: string, status: AttendeeStatus) => void
  updateExamStatus: (
    attendeeId: string,
    examId: string,
    status: ExamStatus
  ) => void
}

export const useAttendeeStore = create<AttendeeStore>()(
  persist(
    (set) => ({
      attendees: [],
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
    }),
    {
      name: 'attendee-queue-storage', // name of the item in storage (must be unique)
      storage: createJSONStorage(() => localStorage), // use localStorage
    }
  )
)
