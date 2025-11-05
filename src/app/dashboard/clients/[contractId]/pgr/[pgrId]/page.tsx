'use client'

import { useParams, redirect } from 'next/navigation'
import { useEffect } from 'react'

export default function PgrDetailPage() {
  const params = useParams()
  const { contractId, pgrId } = params

  useEffect(() => {
    if (contractId && pgrId) {
      redirect(
        `/dashboard/clients/${contractId as string}/pgr/${
          pgrId as string
        }/inventory`
      )
    }
  }, [contractId, pgrId])

  return null
}
