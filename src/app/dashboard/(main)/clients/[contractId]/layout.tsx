'use client'

// This layout is now simplified, as the main dashboard layout handles the sidebar logic.
export default function ClientDetailLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return <>{children}</>
}
