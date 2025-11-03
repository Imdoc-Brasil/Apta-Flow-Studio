
'use client';

import Link from 'next/link';
import { usePathname, useParams } from 'next/navigation';
import {
  BookUser,
  Building,
  Briefcase,
  CreditCard,
  DollarSign,
  HeartPulse,
  Info,
  ListTodo,
  Users,
  ShieldAlert,
  FileText,
  ClipboardList,
} from 'lucide-react';
import {
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
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
    { href: `${basePath}/billing`, label: 'Faturamento', icon: CreditCard },
    { href: `${basePath}/units`, label: 'Unidades', icon: Building },
    { href: `${basePath}/sectors`, label: 'Setores', icon: HeartPulse },
    { href: `${basePath}/roles`, label: 'Cargos', icon: Briefcase },
    { href: `${basePath}/employees`, label: 'Colaboradores', icon: Users },
    { href: `${basePath}/pgr`, label: 'Gestão de Riscos (PGR)', icon: ShieldAlert },
    { href: `${basePath}/pgr-inventory`, label: 'Inventário de Riscos', icon: FileText },
    { href: `${basePath}/pgr-action-plan`, label: 'Plano de Ação', icon: ClipboardList },
    { href: `${basePath}/services`, label: 'Serviços', icon: ListTodo },
    { href: `${basePath}/prices`, label: 'Preços', icon: DollarSign },
  ];

  const getIsActive = (href: string) => {
    // Exact match for info page, or if we are at the base client path
    if (href.endsWith('/info')) {
      return pathname === href || pathname === basePath;
    }
     if (href.endsWith('/pgr')) {
      return pathname === href;
    }
    return pathname.startsWith(href);
  };

  return (
    <SidebarMenu>
      {navItems.map((item) => (
        <SidebarMenuItem key={item.label}>
          <Link href={item.href} passHref legacyBehavior>
             <a>
              <SidebarMenuButton
                isActive={getIsActive(item.href)}
                tooltip={item.label}
              >
                <item.icon />
                <span>{item.label}</span>
              </SidebarMenuButton>
            </a>
          </Link>
        </SidebarMenuItem>
      ))}
    </SidebarMenu>
  );
}
