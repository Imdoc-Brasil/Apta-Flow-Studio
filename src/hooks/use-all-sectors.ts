'use client'

import { useState, useEffect } from 'react'
import { useFirestore, useCollection, useMemoFirebase } from '@/firebase'
import { collection, getDocs } from 'firebase/firestore'
import type { Unit } from '@/lib/types/unit'
import type { Sector } from '@/lib/types/sector'

export function useAllSectors(contractId: string) {
  const firestore = useFirestore()
  const unitsRef = useMemoFirebase(
    () =>
      firestore ? collection(firestore, `clients/${contractId}/units`) : null,
    [firestore, contractId]
  )
  const { data: units, isLoading: areUnitsLoading } = useCollection<Unit>(unitsRef)

  const [allSectors, setAllSectors] = useState<Sector[]>([])
  const [isLoadingSectors, setIsLoadingSectors] = useState(true)

  useEffect(() => {
    if (units && firestore) {
      setIsLoadingSectors(true)
      const fetchAllSectors = async () => {
        try {
          const sectorsData: Sector[] = []
          for (const unit of units) {
            const sectorsColRef = collection(
              firestore,
              `clients/${contractId}/units/${unit.id}/sectors`
            )
            const sectorsSnap = await getDocs(sectorsColRef)
            sectorsSnap.forEach((doc) => {
              sectorsData.push({
                id: doc.id,
                ...doc.data(),
              } as Sector)
            })
          }
          setAllSectors(sectorsData)
        } catch (error) {
          console.error('Error fetching all sectors:', error)
          setAllSectors([])
        } finally {
          setIsLoadingSectors(false)
        }
      }
      fetchAllSectors()
    } else if (!areUnitsLoading) {
      setIsLoadingSectors(false)
    }
  }, [units, firestore, contractId, areUnitsLoading])

  return { allSectors, isLoadingSectors: areUnitsLoading || isLoadingSectors }
}
