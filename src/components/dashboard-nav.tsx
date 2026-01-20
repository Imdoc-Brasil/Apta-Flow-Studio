
'use client'

import Link from 'next/link'
import { usePathname } from 'next/navigation'
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
  GraduationCap,
  HeartPulse,
  Stethoscope,
  ChevronRight,
  FlaskConical,
  FileHeart,
  List,
} from 'lucide-react'
import { cn } from '@/lib/utils'
import {
  SidebarHeader,
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
  SidebarTrigger,
} from '@/components/ui/sidebar'
import {
  Collapsible,
  CollapsibleContent,
  CollapsibleTrigger,
} from '@/components/ui/collapsible'
import { useState, useEffect, useCallback } from 'react'
import { Logo } from '@/components/logo'

const mainNavItems = [
  { href: '/dashboard', icon: LayoutDashboard, label: 'Painel' },
  { href: '/dashboard/clients', icon: Briefcase, label: 'Clientes' },
  { href: '/dashboard/tickets', icon: Ticket, label: 'Tickets' },
  { href: '/dashboard/services', icon: ClipboardList, label: 'Serviços' },
  { href: '/dashboard/risks', icon: ShieldAlert, label: 'Riscos' },
  { href: '/dashboard/trainings', icon: GraduationCap, label: 'Treinamentos' },
  { href: '/dashboard/processes/diagram', icon: Workflow, label: 'Processos' },
  { href: '/dashboard/performance', icon: Activity, label: 'Desempenho' },
  { href: '/dashboard/analytics', icon: BarChart2, label: 'Analytics' },
  { href: '/dashboard/admin', icon: HardHat, label: 'Administração' },
]

const saudeSubNavItems = [
  {
    href: '/dashboard/health/queue',
    label: 'Fila de Atendimento',
    icon: List,
    subItems: [],
  },
  {
    href: '/dashboard/health/exams',
    label: 'Catálogo de Exames',
    icon: Stethoscope,
    subItems: [],
  },
  {
    href: '/dashboard/health/clinical-exams/settings',
    label: 'Config. Exames Clínicos',
    icon: FileHeart,
    subItems: [],
  },
  {
    href: '/dashboard/health/reports-portal',
    label: 'Portal de Laudos',
    icon: Stethoscope,
    subItems: [
      {
        href: '/dashboard/health/reports-portal/ecg/analysis',
        label: 'Análise de ECG (IA)',
      },
    ],
  },
]

export function DashboardNav({ isSheet = false }: { isSheet?: boolean }) {
  const pathname = usePathname()

  const getIsActive = useCallback(
    (href: string) => {
      // Exact match for the main dashboard page
      if (href === '/dashboard') {
        return pathname === href
      }
      // For other items, check if the path starts with the href.
      return pathname.startsWith(href)
    },
    [pathname]
  )

  const isSaudeActive = getIsActive('/dashboard/health')
  const [isSaudeOpen, setIsSaudeOpen] = useState(isSaudeActive)
  const [isPortalLaudosOpen, setIsPortalLaudosOpen] = useState(
    getIsActive('/dashboard/health/reports-portal')
  )

  useEffect(() => {
    if (isSaudeActive) setIsSaudeOpen(true)
    // Do not auto-collapse if not active, let user control it
    // else setIsSaudeOpen(false)

    if (getIsActive('/dashboard/health/reports-portal'))
      setIsPortalLaudosOpen(true)
    // else setIsPortalLaudosOpen(false)
  }, [pathname, isSaudeActive, getIsActive])

  return (
    <>
      <SidebarHeader className='flex items-center justify-between'>
        <Logo />
        <SidebarTrigger />
      </SidebarHeader>

      <SidebarMenu>
        {mainNavItems.map((item) => (
          <SidebarMenuItem key={item.label}>
            <Link href={item.href}>
              <SidebarMenuButton
                isActive={getIsActive(item.href)}
                tooltip={item.label}
              >
                <item.icon />
                <span className='group-data-[collapsible=icon]:hidden'>
                  {item.label}
                </span>
              </SidebarMenuButton>
            </Link>
          </SidebarMenuItem>
        ))}
        <SidebarMenuItem>
          <Collapsible open={isSaudeOpen} onOpenChange={setIsSaudeOpen}>
            <CollapsibleTrigger asChild>
              <SidebarMenuButton
                isActive={isSaudeActive}
                tooltip='Sistema de Saúde'
                className='justify-between'
              >
                <div className='flex items-center gap-2'>
                  <HeartPulse />
                  <span className='group-data-[collapsible=icon]:hidden'>
                    Sistema de Saúde
                  </span>
                </div>
                <ChevronRight
                  className={cn(
                    'h-4 w-4 transition-transform group-data-[collapsible=icon]:hidden',
                    isSaudeOpen && 'rotate-90'
                  )}
                />
              </SidebarMenuButton>
            </CollapsibleTrigger>
            <CollapsibleContent asChild>
              <ul className='pl-6 pt-1 space-y-1'>
                {saudeSubNavItems.map((item) => (
                  <li key={item.label}>
                    {item.subItems.length > 0 ? (
                      <Collapsible
                        open={isPortalLaudosOpen}
                        onOpenChange={setIsPortalLaudosOpen}
                      >
                        <CollapsibleTrigger asChild>
                          <div className='w-full'>
                            <Link href={item.href}>
                              <SidebarMenuButton
                                isActive={getIsActive(item.href)}
                                tooltip={item.label}
                                className='h-8 w-full justify-between'
                              >
                                <div className='flex items-center gap-2'>
                                  <item.icon />
                                  <span className='group-data-[collapsible=icon]:hidden'>
                                    {item.label}
                                  </span>
                                </div>
                                <ChevronRight
                                  className={cn(
                                    'h-4 w-4 transition-transform group-data-[collapsible=icon]:hidden',
                                    isPortalLaudosOpen && 'rotate-90'
                                  )}
                                />
                              </SidebarMenuButton>
                            </Link>
                          </div>
                        </CollapsibleTrigger>
                        <CollapsibleContent asChild>
                          <ul className='pl-6 pt-1 space-y-1'>
                            {item.subItems.map((subItem) => (
                              <li key={subItem.label}>
                                <Link href={subItem.href}>
                                  <SidebarMenuButton
                                    isActive={pathname === subItem.href}
                                    tooltip={subItem.label}
                                    className='h-8'
                                  >
                                    <span className='group-data-[collapsible=icon]:hidden'>
                                      {subItem.label}
                                    </span>
                                  </SidebarMenuButton>
                                </Link>
                              </li>
                            ))}
                          </ul>
                        </CollapsibleContent>
                      </Collapsible>
                    ) : (
                      <Link href={item.href}>
                        <SidebarMenuButton
                          isActive={getIsActive(item.href)}
                          tooltip={item.label}
                          className='h-8'
                        >
                          <item.icon />
                          <span className='group-data-[collapsible=icon]:hidden'>
                            {item.label}
                          </span>
                        </SidebarMenuButton>
                      </Link>
                    )}
                  </li>
                ))}
              </ul>
            </CollapsibleContent>
          </Collapsible>
        </SidebarMenuItem>
      </SidebarMenu>
    </>
  )
}
