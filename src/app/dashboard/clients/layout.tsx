
'use client';

import {
  Sidebar,
  SidebarContent,
  SidebarHeader,
} from '@/components/ui/sidebar';
import { ClientSidebar } from '@/components/client-sidebar';
import { Button } from '@/components/ui/button';
import { ArrowLeft, PanelLeft } from 'lucide-react';
import Link from 'next/link';
import { Sheet, SheetContent, SheetTrigger } from '@/components/ui/sheet';
import { UserNav } from '@/components/user-nav';
import { Logo } from '@/components/logo';

export default function ClientDetailLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <div className="flex min-h-screen w-full bg-muted/40">
      <Sidebar
        variant="sidebar"
        collapsible="icon"
        className="group hidden data-[variant=sidebar]:max-w-60 md:flex"
      >
        <SidebarContent>
          <SidebarHeader>
            <Button
              variant="ghost"
              size="sm"
              className="w-full justify-start"
              asChild
            >
              <Link href="/dashboard/(main)/clients">
                <ArrowLeft />
                <span className="group-data-[collapsible=icon]:hidden">
                  Todos os Clientes
                </span>
              </Link>
            </Button>
          </SidebarHeader>
          <ClientSidebar />
        </SidebarContent>
      </Sidebar>
      <div className="flex flex-1 flex-col transition-all duration-200 ease-in-out md:ml-14 md:group-data-[state=expanded]/sidebar-wrapper:ml-60">
         <header className="sticky top-0 z-30 flex h-14 items-center gap-4 border-b bg-background px-4 sm:static sm:h-auto sm:border-0 sm:bg-transparent sm:px-6">
           <Sheet>
            <SheetTrigger asChild>
              <Button size="icon" variant="outline" className="md:hidden">
                <PanelLeft className="h-5 w-5" />
                <span className="sr-only">Alternar Menu</span>
              </Button>
            </SheetTrigger>
            <SheetContent side="left" className="sm:max-w-xs">
              <nav className="grid gap-6 text-lg font-medium">
                <Link
                  href="/"
                  className="group flex h-10 w-10 shrink-0 items-center justify-center gap-2 rounded-full bg-primary text-lg font-semibold text-primary-foreground md:text-base"
                >
                  <Logo className="text-primary-foreground" />
                  <span className="sr-only">AptaFlow</span>
                </Link>
                 <ClientSidebar />
              </nav>
            </SheetContent>
          </Sheet>
          
          <div className="relative ml-auto flex-1 md:grow-0">
            {/* This can be a global search in the future */}
          </div>
          <UserNav />
        </header>
        <main className="flex flex-1 flex-col gap-4 p-4 lg:gap-6 lg:p-6">
          {children}
        </main>
      </div>
    </div>
  );
}
