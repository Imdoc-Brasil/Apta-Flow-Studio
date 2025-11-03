'use client';

import Link from 'next/link';
import { usePathname } from 'next/navigation';
import {
  LayoutDashboard,
  Users,
  Briefcase,
  FileText,
  Ticket,
  Activity,
  Workflow,
  BarChart2,
  ClipboardList,
  ShieldAlert,
  HardHat,
} from 'lucide-react';
import { cn } from '@/lib/utils';
import {
  Tooltip,
  TooltipContent,
  TooltipTrigger,
} from '@/components/ui/tooltip';

const navItems = [
  { href: '/dashboard', icon: LayoutDashboard, label: 'Painel' },
  { href: '/dashboard/clients', icon: Briefcase, label: 'Clientes' },
  { href: '/dashboard/employees', icon: Users, label: 'Funcionários' },
  { href: '/dashboard/services', icon: ClipboardList, label: 'Serviços' },
  { href: '/dashboard/risks', icon: ShieldAlert, label: 'Riscos' },
  { href: '/dashboard/epis', icon: HardHat, label: 'EPIs' },
  { href: '/dashboard/documents', icon: FileText, label: 'Documentos' },
  { href: '/dashboard/tickets', icon: Ticket, label: 'Tickets' },
  { href: '/dashboard/performance', icon: Activity, label: 'Desempenho' },
  { href: '/dashboard/processes', icon: Workflow, label: 'Processos' },
  { href: '/dashboard/analytics', icon: BarChart2, label: 'Analytics' },
];

export function DashboardNav({ isSheet = false }: { isSheet?: boolean }) {
  const pathname = usePathname();

  const commonLinkClass = 'flex items-center gap-4 px-2.5 text-muted-foreground hover:text-foreground';
  const activeLinkClass = 'font-semibold text-foreground';

  if (isSheet) {
    return (
        <nav className="grid gap-6 text-lg font-medium">
            {navItems.map((item) => (
                <Link
                key={item.href}
                href={item.href}
                className={cn(
                    commonLinkClass,
                    pathname === item.href && activeLinkClass
                )}
                >
                <item.icon className="h-5 w-5" />
                {item.label}
                </Link>
            ))}
        </nav>
    );
  }

  return (
    <nav className="flex flex-col items-center gap-4 px-2 sm:py-5">
      {navItems.map((item) => (
        <Tooltip key={item.href}>
          <TooltipTrigger asChild>
            <Link
              href={item.href}
              className={cn(
                'flex h-9 w-9 items-center justify-center rounded-lg text-muted-foreground transition-colors hover:text-foreground md:h-8 md:w-8',
                pathname.startsWith(item.href) && (item.href !== '/dashboard' || pathname === '/dashboard') && 'bg-accent text-accent-foreground'
              )}
            >
              <item.icon className="h-5 w-5" />
              <span className="sr-only">{item.label}</span>
            </Link>
          </TooltipTrigger>
          <TooltipContent side="right">{item.label}</TooltipContent>
        </Tooltip>
      ))}
    </nav>
  );
}
