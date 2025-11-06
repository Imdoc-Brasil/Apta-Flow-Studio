'use client'

import { ClientSidebar } from '@/components/client-sidebar'
import { Button } from '@/components/ui/button'
import { PanelLeft } from 'lucide-react'
import { Sheet, SheetContent, SheetTrigger } from '@/components/ui/sheet'
import { Logo } from '@/components/logo'
import Link from 'next/link'
import { SidebarProvider } from '@/components/ui/sidebar'

export default function ClientDetailLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <SidebarProvider>
      <div className='flex h-full'>
        {/* Desktop Sidebar */}
        <aside className='hidden md:flex flex-col w-64 border-r bg-background'>
          <ClientSidebar />
        </aside>

        {/* Mobile Sheet */}
        <div className='md:hidden'>
          <Sheet>
            <SheetTrigger asChild>
              <Button
                size='icon'
                variant='outline'
                className='absolute top-3 left-3 z-40'
              >
                <PanelLeft className='h-5 w-5' />
                <span className='sr-only'>Alternar Menu</span>
              </Button>
            </SheetTrigger>
            <SheetContent side='left' className='sm:max-w-xs'>
              <nav className='grid gap-6 text-lg font-medium'>
                <Link
                  href='/'
                  className='group flex h-10 w-10 shrink-0 items-center justify-center gap-2 rounded-full bg-primary text-lg font-semibold text-primary-foreground md:text-base'
                >
                  <Logo className='text-primary-foreground' />
                  <span className='sr-only'>AptaFlow</span>
                </Link>
                <ClientSidebar />
              </nav>
            </SheetContent>
          </Sheet>
        </div>

        {/* Main Content */}
        <div className='flex-1'>{children}</div>
      </div>
    </SidebarProvider>
  )
}
