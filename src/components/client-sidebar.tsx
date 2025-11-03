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
  HardHat,
  Factory,
  GraduationCap,
  Syringe,
  Siren,
  ChevronRight,
  ClipboardCheck,
  CalendarCheck,
} from 'lucide-react';
import {
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
} from '@/components/ui/sidebar';
import {
  Collapsible,
  CollapsibleContent,
  CollapsibleTrigger,
} from '@/components/ui/collapsible';
import { cn } from '@/lib/utils';
import { useState } from 'react';

export function ClientSidebar() {
  const pathname = usePathname();
  const params = useParams();
  const contractId = params.contractId as string;
  const [isSstOpen, setIsSstOpen] = useState(false);

  if (!contractId) {
    return null; // Don't render sidebar on the main clients list page
  }

  const basePath = `/dashboard/clients/${contractId}`;

  const mainNavItems = [
    { href: `${basePath}/info`, label: 'Informações', icon: Info },
    { href: `${basePath}/billing`, label: 'Faturamento', icon: CreditCard },
    { href: `${basePath}/units`, label: 'Unidades', icon: Building },
    { href: `${basePath}/sectors`, label: 'Setores', icon: HeartPulse },
    { href: `${basePath}/roles`, label: 'Cargos', icon: Briefcase },
    { href: `${basePath}/employees`, label: 'Colaboradores', icon: Users },
    { href: `${basePath}/events`, label: 'Gestão de Eventos', icon: Siren },
    { href: `${basePath}/services`, label: 'Serviços', icon: ListTodo },
    { href: `${basePath}/prices`, label: 'Preços', icon: DollarSign },
  ];

  const sstNavItems = [
    { href: `${basePath}/pgr`, label: 'Gestão de Riscos (PGR)', icon: ShieldAlert },
    { href: `${basePath}/pcmso`, label: 'Gestão de PCMSO', icon: BookUser },
    { href: `${basePath}/asos`, label: 'Gestão de ASOs', icon: ClipboardCheck },
    { href: `${basePath}/periodicos`, label: 'Gestão de Periódicos', icon: CalendarCheck },
    { href: `${basePath}/pgr-inventory`, label: 'Inventário de Riscos', icon: FileText },
    { href: `${basePath}/pgr-action-plan`, label: 'Plano de Ação', icon: ClipboardList },
    { href: `${basePath}/epis`, label: 'Gestão de EPIs', icon: HardHat },
    { href: `${basePath}/epc`, label: 'Gestão de EPC', icon: Factory },
    { href: `${basePath}/trainings`, label: 'Gestão de Treinamentos', icon: GraduationCap },
    { href: `${basePath}/vaccines`, label: 'Gestão de Vacinas', icon: Syringe },
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
  
  const isSstActive = sstNavItems.some(item => getIsActive(item.href));


  return (
    <SidebarMenu>
      {mainNavItems.map((item) => (
        <SidebarMenuItem key={item.label}>
          <Link href={item.href} asChild>
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

      <SidebarMenuItem>
        <Collapsible open={isSstOpen} onOpenChange={setIsSstOpen}>
          <CollapsibleTrigger asChild>
             <SidebarMenuButton
                isActive={isSstActive}
                tooltip="Gestão de SST"
                className="justify-between"
              >
                <div className="flex items-center gap-2">
                  <ShieldAlert />
                  <span>Gestão de SST</span>
                </div>
                <ChevronRight className={cn("h-4 w-4 transition-transform", isSstOpen && "rotate-90")} />
              </SidebarMenuButton>
          </CollapsibleTrigger>
          <CollapsibleContent>
             <div className="pl-6 pt-1 space-y-1">
                 {sstNavItems.map((item) => (
                    <SidebarMenuItem key={item.label}>
                        <Link href={item.href} asChild>
                            <SidebarMenuButton
                                isActive={getIsActive(item.href)}
                                tooltip={item.label}
                                className="h-8"
                            >
                                <item.icon />
                                <span>{item.label}</span>
                            </SidebarMenuButton>
                        </Link>
                    </SidebarMenuItem>
                ))}
             </div>
          </CollapsibleContent>
        </Collapsible>
      </SidebarMenuItem>
    </SidebarMenu>
  );
}
