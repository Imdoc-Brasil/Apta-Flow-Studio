
'use client'

import Link from 'next/link'
import { usePathname, useParams } from 'next/navigation'
import {
  BookUser,
  Building,
  Briefcase,
  Info,
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
  Network,
  Smile,
  HeartPulse,
  Ticket,
  ArrowLeft,
  LayoutDashboard
} from 'lucide-react'
import { SidebarMenu, SidebarMenuButton, SidebarMenuItem, SidebarHeader } from '@/components/ui/sidebar'
import {
  Collapsible,
  CollapsibleContent,
  CollapsibleTrigger,
} from '@/components/ui/collapsible'
import { cn } from '@/lib/utils'
import { useState, useEffect } from 'react'
import { Button } from './ui/button'

export function ClientSidebar() {
  const pathname = usePathname()
  const params = useParams()
  const contractId = params.contractId as string

  const basePath = `/dashboard/clients/${contractId}`

  const mainNavItems = [
    { href: `${basePath}`, label: 'Painel do Cliente', icon: LayoutDashboard },
    { href: `${basePath}/tickets`, label: 'Meus Chamados', icon: Ticket },
  ]

  const estruturaNavItems = [
    { href: `${basePath}/units`, label: 'Unidades', icon: Building },
    { href: `${basePath}/sectors`, label: 'Setores', icon: HeartPulse },
    { href: `${basePath}/roles`, label: 'Cargos', icon: Briefcase },
    { href: `${basePath}/employees`, label: 'Colaboradores', icon: Users },
    { href: `${basePath}/ghe`, label: 'GHE', icon: Users },
    { href: `${basePath}/processes`, label: 'Processos', icon: Network },
    {
      href: `${basePath}/machines`,
      label: 'Máquinas e Equipamentos',
      icon: Factory,
    },
  ]
  
  const saudeNavItems = [
      { href: `${basePath}/asos`, label: 'Gestão de ASOs', icon: ClipboardCheck },
      { href: `${basePath}/pcmso`, label: 'Gestão de PCMSO', icon: BookUser },
      { href: `${basePath}/periodicos`, label: 'Controle de Periódicos', icon: CalendarCheck },
      { href: `${basePath}/vaccines`, label: 'Controle de Vacinas', icon: Syringe },
  ]

  const sstNavItems = [
    {
      href: `${basePath}/pgr`,
      label: 'Inventário de Riscos (PGR)',
      icon: ShieldAlert,
    },
    {
      href: `${basePath}/epis`,
      label: 'Gestão de EPIs',
      icon: HardHat,
    },
     {
      href: `${basePath}/epis/recommendation`,
      label: 'Matriz de Recomendação',
      icon: ClipboardList,
    },
    {
      href: `${basePath}/trainings`,
      label: 'Gestão de Treinamentos',
      icon: GraduationCap,
    },
     {
      href: `${basePath}/psychosocial`,
      label: 'Riscos Psicossociais',
      icon: Smile,
    },
     { href: `${basePath}/docs-sst`, label: 'Documentos de SST', icon: FileText },
  ]

  const getIsActive = (href: string) => {
    // Exact match for the base client path (dashboard)
    if (href === basePath) {
      return pathname === href
    }
    // For other items, check if the path starts with the href.
    return pathname.startsWith(href)
  }

  const isSstActive = sstNavItems.some((item) => getIsActive(item.href))
  const isEstruturaActive = estruturaNavItems.some((item) =>
    getIsActive(item.href)
  )
  const isSaudeActive = saudeNavItems.some((item) => getIsActive(item.href))

  const [isSstOpen, setIsSstOpen] = useState(isSstActive)
  const [isEstruturaOpen, setIsEstruturaOpen] = useState(isEstruturaActive)
  const [isSaudeOpen, setIsSaudeOpen] = useState(isSaudeActive)


  useEffect(() => {
    if (isSstActive) setIsSstOpen(true)
    if (isEstruturaActive) setIsEstruturaOpen(true)
    if (isSaudeActive) setIsSaudeOpen(true)

  }, [pathname, isSstActive, isEstruturaActive, isSaudeActive])

  if (!contractId) {
    return null // Don't render sidebar on the main clients list page
  }

  return (
    <SidebarMenu>
      <SidebarHeader>
        <Button
          variant='ghost'
          size='sm'
          className='w-full justify-start'
          asChild
        >
          <Link href='/dashboard/clients'>
            <ArrowLeft />
            <span className='group-data-[collapsible=icon]:hidden'>
              Todos os Clientes
            </span>
          </Link>
        </Button>
      </SidebarHeader>

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

      <li className='relative'>
        <Collapsible
          open={isEstruturaOpen}
          onOpenChange={setIsEstruturaOpen}
        >
          <CollapsibleTrigger asChild>
            <SidebarMenuButton
              isActive={isEstruturaActive}
              tooltip='Estrutura da Empresa'
              className='justify-between'
            >
              <div className='flex items-center gap-2'>
                <Network />
                <span>Estrutura da Empresa</span>
              </div>
              <ChevronRight
                className={cn(
                  'h-4 w-4 transition-transform',
                  isEstruturaOpen && 'rotate-90'
                )}
              />
            </SidebarMenuButton>
          </CollapsibleTrigger>
          <CollapsibleContent asChild>
            <ul className='pl-6 pt-1 space-y-1'>
              {estruturaNavItems.map((item) => (
                <SidebarMenuItem key={item.label}>
                  <Link href={item.href}>
                    <SidebarMenuButton
                      isActive={getIsActive(item.href)}
                      tooltip={item.label}
                      className='h-8'
                    >
                      <item.icon />
                      <span>{item.label}</span>
                    </SidebarMenuButton>
                  </Link>
                </SidebarMenuItem>
              ))}
            </ul>
          </CollapsibleContent>
        </Collapsible>
      </li>
      
      <li className='relative'>
        <Collapsible open={isSaudeOpen} onOpenChange={setIsSaudeOpen}>
          <CollapsibleTrigger asChild>
            <SidebarMenuButton
              isActive={isSaudeActive}
              tooltip='Saúde Ocupacional'
              className='justify-between'
            >
              <div className='flex items-center gap-2'>
                <HeartPulse />
                <span>Saúde Ocupacional</span>
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
              {saudeNavItems.map((item) => (
                <SidebarMenuItem key={item.label}>
                  <Link href={item.href}>
                    <SidebarMenuButton
                      isActive={getIsActive(item.href)}
                      tooltip={item.label}
                      className='h-8'
                    >
                      <item.icon />
                      <span>{item.label}</span>
                    </SidebarMenuButton>
                  </Link>
                </SidebarMenuItem>
              ))}
            </ul>
          </CollapsibleContent>
        </Collapsible>
      </li>

      <li className='relative'>
        <Collapsible open={isSstOpen} onOpenChange={setIsSstOpen}>
          <CollapsibleTrigger asChild>
            <SidebarMenuButton
              isActive={isSstActive}
              tooltip='Segurança do Trabalho'
              className='justify-between'
            >
              <div className='flex items-center gap-2'>
                <ShieldAlert />
                <span>Segurança do Trabalho</span>
              </div>
              <ChevronRight
                className={cn(
                  'h-4 w-4 transition-transform',
                  isSstOpen && 'rotate-90'
                )}
              />
            </SidebarMenuButton>
          </CollapsibleTrigger>
          <CollapsibleContent asChild>
            <ul className='pl-6 pt-1 space-y-1'>
              {sstNavItems.map((item) => (
                <SidebarMenuItem key={item.label}>
                  <Link href={item.href}>
                    <SidebarMenuButton
                      isActive={getIsActive(item.href)}
                      tooltip={item.label}
                      className='h-8'
                    >
                      <item.icon />
                      <span>{item.label}</span>
                    </SidebarMenuButton>
                  </Link>
                </SidebarMenuItem>
              ))}
            </ul>
          </CollapsibleContent>
        </Collapsible>
      </li>
    </SidebarMenu>
  )
}
