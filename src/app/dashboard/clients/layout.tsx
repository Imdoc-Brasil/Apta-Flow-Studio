
'use client';

import {
  Sidebar,
  SidebarContent,
  SidebarHeader,
  SidebarInset,
  SidebarProvider,
  SidebarTrigger,
} from '@/components/ui/sidebar';
import { ClientSidebar } from '@/components/client-sidebar';
import { Button } from '@/components/ui/button';
import { ArrowLeft } from 'lucide-react';
import Link from 'next/link';

export default function ClientDetailLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <SidebarProvider>
      <div className="grid flex-1 grid-cols-1 md:grid-cols-[auto_1fr]">
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
                <Link href="/dashboard/clients">
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
        <div className="flex flex-col">
          <header className="flex h-14 items-center gap-4 border-b bg-muted/40 px-4 md:hidden">
            <SidebarTrigger>
              <Button size="icon" variant="outline">
                <ArrowLeft />
              </Button>
            </SidebarTrigger>
            <h1 className="text-lg font-semibold">Menu do Cliente</h1>
          </header>
          <main className="flex flex-1 flex-col gap-4 p-4 lg:gap-6 lg:p-6">
            {children}
          </main>
        </div>
      </div>
    </SidebarProvider>
  );
}
