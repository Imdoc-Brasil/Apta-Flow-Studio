import Link from 'next/link'
import { PanelLeft } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { Sheet, SheetContent, SheetTrigger } from '@/components/ui/sheet'
import { Logo } from '@/components/logo'
import { DashboardNav } from '@/components/dashboard-nav'
import { UserNav } from '@/components/user-nav'
import {
  Sidebar,
  SidebarProvider,
  SidebarTrigger,
} from '@/components/ui/sidebar'

export default function DashboardLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <SidebarProvider>
      <div className='flex min-h-screen w-full flex-col bg-muted/40'>
        <Sidebar>
          <DashboardNav />
        </Sidebar>
        <div className='flex flex-col sm:pl-14 group-data-[state=expanded]:sm:pl-72 transition-all duration-300'>
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
                <DashboardNav isSheet={true} />
              </SheetContent>
            </Sheet>
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
