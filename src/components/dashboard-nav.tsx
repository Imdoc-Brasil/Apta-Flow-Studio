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
} from 'lucide-react';
import { cn } from '@/lib/utils';
import {
  Tooltip,
  TooltipContent,
  TooltipTrigger,
} from '@/components/ui/tooltip';

const navItems = [
  { href: '/dashboard', icon: LayoutDashboard, label: 'Dashboard' },
  { href: '/dashboard/clients', icon: Briefcase, label: 'Clients' },
  { href: '/dashboard/employees', icon: Users, label: 'Employees' },
  { href: '/dashboard/documents', icon: FileText, label: 'Documents' },
  { href: '/dashboard/tickets', icon: Ticket, label: 'Tickets' },
  { href: '/dashboard/performance', icon: Activity, label: 'Performance' },
  { href: '/dashboard/processes', icon: Workflow, label: 'Processes' },
  { href: '/dashboard/analytics', icon: BarChart2, label: 'Analytics' },
];

export function DashboardNav() {
  const pathname = usePathname();

  return (
    <nav className="flex flex-col items-center gap-4 px-2 sm:py-5">
      {navItems.map((item) => (
        <Tooltip key={item.href}>
          <TooltipTrigger asChild>
            <Link
              href={item.href}
              className={cn(
                'flex h-9 w-9 items-center justify-center rounded-lg text-muted-foreground transition-colors hover:text-foreground md:h-8 md:w-8',
                pathname === item.href && 'bg-accent text-accent-foreground'
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
