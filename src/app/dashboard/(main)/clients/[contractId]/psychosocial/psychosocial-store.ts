
'use client'

import { create } from 'zustand'
import { persist, createJSONStorage } from 'zustand/middleware'

// This store will hold the survey responses.
// The key for responses will be a unique identifier for each answer,
// e.g., `${questionId}-${respondentId}` to allow for multiple respondents.

interface SurveyState {
  responses: { [key: string]: number } // e.g., { 'DT01-resp123': 5, 'DT02-resp123': 4 }
  addResponse: (responseId: string, value: number) => void
  clearResponses: () => void
}

export const useSurveyStore = create<SurveyState>()(
  persist(
    (set) => ({
      responses: {},
      addResponse: (responseId, value) =>
        set((state) => ({
          responses: { ...state.responses, [responseId]: value },
        })),
      clearResponses: () => set({ responses: {} }),
    }),
    {
      name: 'psychosocial-survey-storage', // name of the item in storage (must be unique)
      storage: createJSONStorage(() => sessionStorage), // (optional) by default, 'localStorage' is used
    }
  )
)
