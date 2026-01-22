
'use client'

import { useState, useEffect } from 'react'
import { useFirestore } from '@/firebase'
import { collection, getDocs } from 'firebase/firestore'
import type { Environment } from '@/lib/types/environment'
import { useAllSectors } from './use-all-sectors'

export function useAllEnvironments(contractId: string) {
  const firestore = useFirestore()
  const { allSectors, isLoadingSectors } = useAllSectors(contractId)

  const [allEnvironments, setAllEnvironments] = useState<Environment[]>([])
  const [isLoadingEnvironments, setIsLoadingEnvironments] = useState(true)

  useEffect(() => {
    if (firestore && !isLoadingSectors) {
      if (allSectors.length === 0) {
        setAllEnvironments([])
        setIsLoadingEnvironments(false)
        return
      }
      
      setIsLoadingEnvironments(true)
      const fetchAllEnvironments = async () => {
        try {
          const environmentsData: Environment[] = []
          for (const sector of allSectors) {
            const environmentsColRef = collection(
              firestore,
              `clients/${contractId}/units/${sector.unitId}/sectors/${sector.id}/environments`
            )
            const environmentsSnap = await getDocs(environmentsColRef)
            environmentsSnap.forEach((doc) => {
              environmentsData.push({
                id: doc.id,
                ...doc.data(),
              } as Environment)
            })
          }
          setAllEnvironments(environmentsData)
        } catch (error) {
          console.error('Error fetching all environments:', error)
          setAllEnvironments([])
        } finally {
          setIsLoadingEnvironments(false)
        }
      }
      fetchAllEnvironments()
    }
  }, [allSectors, firestore, contractId, isLoadingSectors])

  return { allEnvironments, isLoadingEnvironments: isLoadingSectors || isLoadingEnvironments }
}
