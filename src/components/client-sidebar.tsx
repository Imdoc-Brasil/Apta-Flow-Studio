
'use client';

import Link from 'next/link';
import { usePathname, useParams } from 'next/navigation';
import {
  BookUser,
  Building,
  Briefcase,
  DollarSign,
  HeartPulse,
  Info,
  ListTodo,
  Users,
} from 'lucide-react';
import { cn } from '@/lib/utils';

export function ClientSidebar() {
  const pathname = usePathname();
  const params = useParams();
  const contractId = params.contractId as string;

  if (!contractId) {
    return null; // Don't render sidebar on the main clients list page
  }
  
  const basePath = `/dashboard/clients/${contractId}`;

  const navItems = [
    { href: `${basePath}/info`, label: 'Informações Gerais', icon: Info },
    { href: `${basePath}/units`, label: 'Unidades', icon: Building },
    { href: `${basePath}/sectors`, label: 'Setores', icon: HeartPulse },
    { href: `${basePath}/roles`, label: 'Cargos', icon: Briefcase },
    { href: `${basePath}/employees`, label: 'Colaboradores', icon: Users },
    { href: `${basePath}/docs-sst`, label: 'Documentos SST', icon: BookUser },
    { href: `${basePath}/services`, label: 'Serviços', icon: ListTodo },
    { href: `${basePath}/prices`, label: 'Tabela de Preços', icon: DollarSign },
  ];

  const getIsActive = (href: string) => {
    // Exact match for info page
    if (href.endsWith('/info')) {
      return pathname === href || pathname === basePath;
    }
    return pathname.startsWith(href);
  };


  return (
    <nav className="grid items-start px-2 text-sm font-medium lg:px-4">
      {navItems.map((item) => (
        <Link
          key={item.label}
          href={item.href}
          className={cn(
            'flex items-center gap-3 rounded-lg px-3 py-2 text-muted-foreground transition-all hover:text-primary',
            getIsActive(item.href) && 'bg-muted text-primary'
          )}
        >
          <item.icon className="h-4 w-4" />
          {item.label}
        </Link>
      ))}
    </nav>
  );
}
