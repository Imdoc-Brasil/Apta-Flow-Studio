'use client'

import { useUser } from '@/firebase'
import { useRouter, usePathname } from 'next/navigation'
import { useEffect } from 'react'
import { DashboardNav } from '@/components/dashboard-nav'
import { ClientSidebar } from '@/components/client-sidebar'
import {
  Sidebar,
  SidebarProvider,
  SidebarTrigger,
} from '@/components/ui/sidebar'
import { UserNav } from '@/components/user-nav'
import { Sheet, SheetContent, SheetTrigger } from '@/components/ui/sheet'
import { Button } from '@/components/ui/button'
import { Loader2, PanelLeft } from 'lucide-react'
import { Breadcrumb } from '@/components/breadcrumb'

export default function DashboardLayout({
  children,
}: {
  children: React.ReactNode
}) {
  const { user, isUserLoading } = useUser()
  const router = useRouter()
  const pathname = usePathname()

  useEffect(() => {
    if (!isUserLoading && !user) {
      router.push('/login')
    }
  }, [isUserLoading, user, router])

  const isClientSpecificRoute = /^\/dashboard\/clients\/.+/.test(pathname)

  if (isUserLoading || !user) {
    return (
      <div className='flex min-h-screen w-full flex-col items-center justify-center bg-muted/40'>
        <Loader2 className='h-8 w-8 animate-spin text-primary' />
        <p className='mt-4 text-muted-foreground'>Carregando...</p>
      </div>
    )
  }

  const SidebarComponent = isClientSpecificRoute ? ClientSidebar : DashboardNav

  return (
    <SidebarProvider>
      <div className='group flex min-h-screen w-full flex-row bg-muted/40'>
        <Sidebar collapsible='icon'>
          <SidebarComponent />
        </Sidebar>
        <div className='flex flex-1 flex-col sm:pl-14 group-data-[state=expanded]:sm:pl-72 transition-all duration-300 ease-in-out'>
          <header className='sticky top-0 z-30 flex h-14 items-center gap-4 border-b bg-background px-4 sm:static sm:h-auto sm:border-0 sm:bg-transparent sm:px-6'>
            <SidebarTrigger className='sm:flex hidden' />
            <Sheet>
              <SheetTrigger asChild>
                <Button size='icon' variant='outline' className='sm:hidden'>
                  <PanelLeft className='h-5 w-5' />
                  <span className='sr-only'>Toggle Menu</span>
                </Button>
              </SheetTrigger>
              <SheetContent side='left' className='sm:max-w-xs'>
                <SidebarComponent />
              </SheetContent>
            </Sheet>
            <Breadcrumb />
            <div className='relative ml-auto flex-1 md:grow-0'>
              {/* This can be a global search in the future */}
            </div>
            <UserNav />
          </header>
          <main className='flex flex-1 flex-col gap-4 p-4 lg:gap-6 lg:p-6'>
            {children}
          </main>
        </div>
      </div>
    </SidebarProvider>
  )
}
