'use client'

import { useParams, redirect } from 'next/navigation'

export default function PgrPage() {
  const params = useParams()
  const contractId = params.contractId as string

  // Redirect to the default tab
  redirect(`/dashboard/clients/${contractId}/pgr/inventory`)

  return null
}
