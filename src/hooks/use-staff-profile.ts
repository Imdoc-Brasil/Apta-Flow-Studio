'use client'

import { doc } from 'firebase/firestore'
import { useDoc, useUser, useFirestore, useMemoFirebase } from '@/firebase'
import type { Staff } from '@/lib/types/staff'

export function useStaffProfile() {
  const { user, isUserLoading } = useUser()
  const firestore = useFirestore()

  const staffDocRef = useMemoFirebase(
    () => (firestore && user ? doc(firestore, 'staffs', user.uid) : null),
    [firestore, user]
  )
  const {
    data: staffProfile,
    isLoading: isStaffLoading,
    error: staffError,
  } = useDoc<Staff>(staffDocRef)

  return {
    staffProfile,
    isLoading: isUserLoading || isStaffLoading,
    error: staffError,
  }
}
