
import { Button } from '@/components/ui/button';
import { ClientSidebar } from '@/components/client-sidebar';
import { ArrowLeft } from 'lucide-react';
import Link from 'next/link';

export default function ClientDetailLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <div className="grid flex-1 md:grid-cols-[220px_1fr] lg:grid-cols-[280px_1fr]">
      <aside className="hidden border-r bg-muted/40 md:block">
        <div className="flex h-full max-h-screen flex-col gap-2">
          <div className="flex h-14 items-center border-b px-4 lg:h-[60px] lg:px-6">
            <Button variant="ghost" size="sm" asChild>
                <Link href="/dashboard/clients">
                    <ArrowLeft className="mr-2 h-4 w-4" />
                    Todos os Clientes
                </Link>
            </Button>
          </div>
          <div className="flex-1">
            <ClientSidebar />
          </div>
        </div>
      </aside>
      <div className="flex flex-col">
        <main className="flex flex-1 flex-col gap-4 p-4 lg:gap-6 lg:p-6">
          {children}
        </main>
      </div>
    </div>
  );
}
