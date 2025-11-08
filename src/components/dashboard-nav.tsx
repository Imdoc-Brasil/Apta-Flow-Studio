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
  GitFork,
  HeartPulse,
  Stethoscope,
  ChevronRight,
} from 'lucide-react'
import { cn } from '@/lib/utils'
import {
  Tooltip,
  TooltipContent,
  TooltipTrigger,
} from '@/components/ui/tooltip'
import {
  Collapsible,
  CollapsibleContent,
  CollapsibleTrigger,
} from '@/components/ui/collapsible'
import { useState } from 'react'

const navItems = [
  { href: '/dashboard', icon: LayoutDashboard, label: 'Painel' },
  { href: '/dashboard/clients', icon: Briefcase, label: 'Clientes' },
  { href: '/dashboard/employees', icon: Users, label: 'Staffs' },
  { href: '/dashboard/profiles', icon: HardHat, label: 'Perfis' },
  { href: '/dashboard/services', icon: ClipboardList, label: 'Serviços' },
  {
    href: '/dashboard/health',
    icon: HeartPulse,
    label: 'Saúde',
    subItems: [
      {
        href: '/dashboard/health/clinical-exams',
        icon: Stethoscope,
        label: 'Exames Clínicos',
      },
    ],
  },
  { href: '/dashboard/risks', icon: ShieldAlert, label: 'Riscos' },
  { href: '/dashboard/trainings', icon: GraduationCap, label: 'Treinamentos' },
  { href: '/dashboard/documents', icon: FileText, label: 'Documentos' },
  { href: '/dashboard/tickets', icon: Ticket, label: 'Tickets' },
  { href: '/dashboard/performance', icon: Activity, label: 'Desempenho' },
  { href: '/dashboard/processes', icon: Workflow, label: 'Processos' },
  { href: '/dashboard/analytics', icon: BarChart2, label: 'Analytics' },
]

export function DashboardNav({ isSheet = false }: { isSheet?: boolean }) {
  const pathname = usePathname()
  const [isHealthOpen, setIsHealthOpen] = useState(
    pathname.startsWith('/dashboard/health')
  )

  const commonLinkClass =
    'flex items-center gap-4 px-2.5 text-muted-foreground hover:text-foreground'
  const activeLinkClass = 'font-semibold text-foreground'

  const getIsActive = (href: string, isSubItem = false) => {
    if (isSubItem) {
        return pathname === href;
    }
    return pathname.startsWith(href) && (href !== '/dashboard' || pathname === '/dashboard')
  }

  if (isSheet) {
    return (
      <nav className='grid gap-6 text-lg font-medium'>
        {navItems.map((item) =>
          item.subItems ? (
            <Collapsible
              key={item.href}
              open={isHealthOpen}
              onOpenChange={setIsHealthOpen}
            >
              <CollapsibleTrigger asChild>
                <div
                  className={cn(
                    commonLinkClass,
                    'justify-between',
                    getIsActive(item.href) && activeLinkClass
                  )}
                >
                  <div className='flex items-center gap-4'>
                    <item.icon className='h-5 w-5' />
                    {item.label}
                  </div>
                  <ChevronRight
                    className={cn(
                      'h-4 w-4 transition-transform',
                      isHealthOpen && 'rotate-90'
                    )}
                  />
                </div>
              </CollapsibleTrigger>
              <CollapsibleContent className='pl-8'>
                 <ul className='flex flex-col gap-4 mt-4'>
                    {item.subItems.map((subItem) => (
                      <li key={subItem.href}>
                         <Link
                          href={subItem.href}
                          className={cn(
                            commonLinkClass,
                            getIsActive(subItem.href, true) && activeLinkClass
                          )}
                        >
                          <subItem.icon className='h-5 w-5' />
                          {subItem.label}
                        </Link>
                      </li>
                    ))}
                 </ul>
              </CollapsibleContent>
            </Collapsible>
          ) : (
            <Link
              key={item.href}
              href={item.href}
              className={cn(
                commonLinkClass,
                getIsActive(item.href) && activeLinkClass
              )}
            >
              <item.icon className='h-5 w-5' />
              {item.label}
            </Link>
          )
        )}
      </nav>
    )
  }

  return (
    <nav className='flex flex-col items-center gap-4 px-2 sm:py-5'>
      {navItems.map((item) => (
        <Tooltip key={item.href}>
          <TooltipTrigger asChild>
            <Link
              href={item.href}
              className={cn(
                'flex h-9 w-9 items-center justify-center rounded-lg text-muted-foreground transition-colors hover:text-foreground md:h-8 md:w-8',
                getIsActive(item.href) && 'bg-accent text-accent-foreground'
              )}
            >
              <item.icon className='h-5 w-5' />
              <span className='sr-only'>{item.label}</span>
            </Link>
          </TooltipTrigger>
          <TooltipContent side='right'>{item.label}</TooltipContent>
        </Tooltip>
      ))}
    </nav>
  )
}
