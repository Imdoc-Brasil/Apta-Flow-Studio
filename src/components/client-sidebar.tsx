
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
import {
  SidebarMenu,
  SidebarMenuItem,
  SidebarMenuButton,
} from '@/components/ui/sidebar';

export function ClientSidebar() {
  const pathname = usePathname();
  const params = useParams();
  const contractId = params.contractId as string;

  if (!contractId) {
    return null; // Don't render sidebar on the main clients list page
  }

  const basePath = `/dashboard/clients/${contractId}`;

  const navItems = [
    { href: `${basePath}/info`, label: 'Informações', icon: Info },
    { href: `${basePath}/units`, label: 'Unidades', icon: Building },
    { href: `${basePath}/sectors`, label: 'Setores', icon: HeartPulse },
    { href: `${basePath}/roles`, label: 'Cargos', icon: Briefcase },
    { href: `${basePath}/employees`, label: 'Colaboradores', icon: Users },
    { href: `${basePath}/docs-sst`, label: 'Documentos SST', icon: BookUser },
    { href: `${basePath}/services`, label: 'Serviços', icon: ListTodo },
    { href: `${basePath}/prices`, label: 'Preços', icon: DollarSign },
  ];

  const getIsActive = (href: string) => {
    // Exact match for info page, or if we are at the base client path
    if (href.endsWith('/info')) {
      return pathname === href || pathname === basePath;
    }
    return pathname.startsWith(href);
  };

  return (
    <SidebarMenu>
      {navItems.map((item) => (
        <SidebarMenuItem key={item.label}>
          <Link href={item.href} passHref legacyBehavior>
            <SidebarMenuButton
              isActive={getIsActive(item.href)}
              tooltip={item.label}
            >
              <item.icon />
              <span>{item.label}</span>
            </SidebarMenuButton>
          </Link>
        </SidebarMenuItem>
      ))}
    </SidebarMenu>
  );
}
