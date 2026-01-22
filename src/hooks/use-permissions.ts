'use client'

import { useMemo } from 'react'
import { doc } from 'firebase/firestore'
import { useDoc, useFirestore, useMemoFirebase } from '@/firebase'
import { useStaffProfile } from '@/hooks/use-staff-profile'
import type { Profile, Permission } from '@/lib/types/profile'

export function usePermissions() {
  const { staffProfile, isLoading: isStaffLoading } = useStaffProfile()
  const firestore = useFirestore()

  const profileId = staffProfile?.perfilId

  const profileDocRef = useMemoFirebase(
    () => (firestore && profileId ? doc(firestore, 'profiles', profileId) : null),
    [firestore, profileId]
  )

  const {
    data: profile,
    isLoading: isProfileLoading,
    error: profileError,
  } = useDoc<Profile>(profileDocRef)

  const permissions = useMemo(() => {
    // The super_admin has all permissions implicitly.
    if (profileId === 'super_admin') {
      return new Set<Permission | '*'>(['*'])
    }
    return new Set(profile?.permissions || [])
  }, [profile, profileId])

  const hasPermission = (permission: Permission) => {
    if (permissions.has('*')) {
      return true
    }
    return permissions.has(permission)
  }

  return {
    permissions,
    hasPermission,
    isLoading: isStaffLoading || isProfileLoading,
    error: profileError,
  }
}
