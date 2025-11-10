'use client'

import { ClientSidebar } from '@/components/client-sidebar'
import { useAdmin } from '@/firebase'

export default function ClientDetailLayout({
  children,
}: {
  children: React.ReactNode
}) {
  const { isAdmin, isAdminLoading } = useAdmin()

  // For admins, the main dashboard layout already provides the sidebar structure.
  // We just render the children.
  if (isAdminLoading || isAdmin) {
    return <>{children}</>
  }

  // For non-admins (clients), we render the specific client-focused layout.
  // This layout will have its own sidebar defined in ClientSidebar.
  return (
    <div className='flex min-h-screen w-full flex-col bg-muted/40'>
      <aside className='fixed inset-y-0 left-0 z-10 hidden w-72 flex-col border-r bg-background sm:flex'>
        <ClientSidebar />
      </aside>
      <div className='flex flex-col sm:pl-72'>
        <main className='flex flex-1 flex-col gap-4 p-4 lg:gap-6 lg:p-6'>
          {children}
        </main>
      </div>
    </div>
  )
}
