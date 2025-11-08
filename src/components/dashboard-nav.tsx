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
import { useState, useEffect } from 'react'
import { Logo } from './logo'

const mainNavItems = [
  { href: '/dashboard', icon: LayoutDashboard, label: 'Painel' },
  { href: '/dashboard/clients', icon: Briefcase, label: 'Clientes' },
  { href: '/dashboard/employees', icon: Users, label: 'Staffs' },
  { href: '/dashboard/profiles', icon: HardHat, label: 'Perfis' },
  { href: '/dashboard/services', icon: ClipboardList, label: 'Serviços' },
  { href: '/dashboard/risks', icon: ShieldAlert, label: 'Riscos' },
  { href: '/dashboard/trainings', icon: GraduationCap, label: 'Treinamentos' },
  { href: '/dashboard/documents', icon: FileText, label: 'Documentos' },
  { href: '/dashboard/tickets', icon: Ticket, label: 'Tickets' },
  { href: '/dashboard/performance', icon: Activity, label: 'Desempenho' },
  { href: '/dashboard/processes', icon: Workflow, label: 'Processos' },
  { href: '/dashboard/analytics', icon: BarChart2, label: 'Analytics' },
]

const saudeSubNavItems = [
  {
    href: '/dashboard/health/clinical-exams',
    label: 'Exames Clínicos',
    icon: FileHeart,
    subItems: [
      {
        href: '/dashboard/health/clinical-exams/evaluation',
        label: 'Avaliação Clínica',
      },
      {
        href: '/dashboard/health/clinical-exams/psychosocial',
        label: 'Avaliação Psicossocial',
      },
    ],
  },
  { href: '/dashboard/health/lab-exams', label: 'Exames Laboratoriais', icon: FlaskConical, subItems: [] },
]

export function DashboardNav({ isSheet = false }: { isSheet?: boolean }) {
  const pathname = usePathname()

  const getIsActive = (href: string, isSub?: boolean) => {
    if (isSub) {
      return pathname === href
    }
    return pathname.startsWith(href) && (href !== '/dashboard' || pathname === '/dashboard')
  }
  
  const isSaudeActive = getIsActive('/dashboard/health')
  const [isSaudeOpen, setIsSaudeOpen] = useState(isSaudeActive)
  
  useEffect(() => {
    if (isSaudeActive) setIsSaudeOpen(true)
  }, [pathname, isSaudeActive])


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
                <span>{item.label}</span>
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
                  <span>Sistema de Saúde</span>
                </div>
                <ChevronRight
                  className={cn(
                    'h-4 w-4 transition-transform',
                    isSaudeOpen && 'rotate-90'
                  )}
                />
              </SidebarMenuButton>
            </CollapsibleTrigger>
            <CollapsibleContent asChild>
              <ul className='pl-6 pt-1 space-y-1'>
                 {saudeSubNavItems.map((item) => (
                  <li key={item.label}>
                     <Collapsible>
                      <CollapsibleTrigger className='w-full'>
                         <SidebarMenuButton
                           isActive={getIsActive(item.href)}
                           tooltip={item.label}
                           className='h-8 w-full justify-between'
                         >
                           <div className='flex items-center gap-2'>
                             <item.icon />
                             <span>{item.label}</span>
                           </div>
                           {item.subItems.length > 0 && <ChevronRight className={cn('h-4 w-4 transition-transform')} />}
                         </SidebarMenuButton>
                      </CollapsibleTrigger>
                       {item.subItems.length > 0 && (
                        <CollapsibleContent asChild>
                           <ul className='pl-6 pt-1 space-y-1'>
                            {item.subItems.map(subItem => (
                              <li key={subItem.label}>
                                <Link href={subItem.href}>
                                   <SidebarMenuButton
                                     isActive={getIsActive(subItem.href, true)}
                                     tooltip={subItem.label}
                                     className='h-8'
                                   >
                                     <span>{subItem.label}</span>
                                   </SidebarMenuButton>
                                </Link>
                              </li>
                            ))}
                           </ul>
                        </CollapsibleContent>
                       )}
                     </Collapsible>
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
