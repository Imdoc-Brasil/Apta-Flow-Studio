'use client'

import { useMemo } from 'react'
import { doc } from 'firebase/firestore'
import { useDoc } from '@/firebase/firestore/use-doc'
import { useUser } from '@/firebase/provider'
import { useFirestore } from '@/firebase/provider'

export function useAdmin() {
  const { user, isUserLoading } = useUser()
  const firestore = useFirestore()

  const adminDocRef = useMemo(() => {
    if (!user || !firestore) return null
    return doc(firestore, 'roles_admin', user.uid)
  }, [user, firestore])

  const {
    data: adminDoc,
    isLoading: isAdminDocLoading,
    error: adminDocError,
  } = useDoc(adminDocRef)

  const isAdmin = !!adminDoc
  const isAdminLoading = isUserLoading || isAdminDocLoading

  return { isAdmin, isAdminLoading, adminDocError }
}
