'use client'

import { useParams, redirect } from 'next/navigation'

export default function EpisPage() {
  const params = useParams()
  const contractId = params.contractId as string

  // Redirect to the default tab
  redirect(`/dashboard/clients/${contractId}/epis/inventory`)

  return null
}
