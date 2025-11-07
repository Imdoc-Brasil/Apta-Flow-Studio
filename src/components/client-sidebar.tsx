'use client'

import Link from 'next/link'
import { usePathname, useParams } from 'next/navigation'
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
  Network,
  Stethoscope,
  FlaskConical,
  BarChart3,
  FileHeart,
  AlertTriangle,
  ArrowLeft,
  Ticket,
  MapPin,
} from 'lucide-react'
import {
  Sidebar,
  SidebarContent,
  SidebarHeader,
  SidebarMenuItem,
  SidebarMenu,
  SidebarMenuButton,
} from '@/components/ui/sidebar'
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
    { href: `${basePath}/info`, label: 'Informações', icon: Info },
    { href: `${basePath}/tickets`, label: 'Meus Chamados', icon: Ticket },
    { href: `${basePath}/events`, label: 'Gestão de Eventos', icon: Siren },
  ]

  const contratoNavItems = [
    { href: `${basePath}/billing`, label: 'Faturamento', icon: CreditCard },
    { href: `${basePath}/services`, label: 'Serviços', icon: ListTodo },
    { href: `${basePath}/prices`, label: 'Preços', icon: DollarSign },
  ]

  const estruturaNavItems = [
    { href: `${basePath}/units`, label: 'Unidades', icon: Building },
    { href: `${basePath}/sectors`, label: 'Setores', icon: HeartPulse },
    { href: `${basePath}/environments`, label: 'Ambientes', icon: MapPin },
    { href: `${basePath}/roles`, label: 'Cargos', icon: Briefcase },
    { href: `${basePath}/employees`, label: 'Colaboradores', icon: Users },
    { href: `${basePath}/ghe`, label: 'GHE', icon: Users },
    { href: `${basePath}/processes`, label: 'Processos', icon: Network },
    {
      href: `${basePath}/activities`,
      label: 'Atividades',
      icon: ClipboardList,
    },
    {
      href: `${basePath}/machines`,
      label: 'Máquinas e Equipamentos',
      icon: Factory,
    },
  ]

  const saudeNavItems = [
    {
      href: `${basePath}/clinical-exams`,
      label: 'Exames Clínicos',
      icon: FileHeart,
    },
    {
      href: `${basePath}/lab-exams`,
      label: 'Exames Laboratoriais',
      icon: FlaskConical,
    },
    {
      href: `${basePath}/graphical-exams`,
      label: 'Exames Gráficos',
      icon: BarChart3,
    },
    {
      href: `${basePath}/pending-issues`,
      label: 'Gestão de Pendências',
      icon: AlertTriangle,
    },
  ]

  const sstNavItems = [
    {
      href: `${basePath}/pgr`,
      label: 'Inventário de Riscos',
      icon: ShieldAlert,
    },
    {
      href: `${basePath}/pgr/history`,
      label: 'Gestão de PGR',
      icon: FileText,
    },
    { href: `${basePath}/pcmso`, label: 'Gestão de PCMSO', icon: BookUser },
    { href: `${basePath}/asos`, label: 'Gestão de ASOs', icon: ClipboardCheck },
    {
      href: `${basePath}/periodicos`,
      label: 'Gestão de Periódicos',
      icon: CalendarCheck,
    },
    { href: `${basePath}/epis`, label: 'Gestão de EPIs', icon: HardHat },
    {
      href: `${basePath}/epis/recommendation`,
      label: 'Matriz de Recomendação',
      icon: ClipboardList,
    },
    { href: `${basePath}/epc`, label: 'Gestão de EPC', icon: Factory },
    {
      href: `${basePath}/trainings`,
      label: 'Gestão de Treinamentos',
      icon: GraduationCap,
    },
    {
      href: `${basePath}/vaccines`,
      label: 'Gestão de Vacinas',
      icon: Syringe,
    },
    { href: `${basePath}/docs-sst`, label: 'Documentos de SST', icon: FileText },
  ]

  const getIsActive = (href: string) => {
    // Exact match for info page, or if we are at the base client path
    if (href.endsWith('/info')) {
      return pathname === href || pathname === basePath
    }
    // For other items, check if the path starts with the href.
    // This handles nested routes like /pgr/inventory correctly.
    if (href !== basePath && href !== `${basePath}/info`) {
      return pathname.startsWith(href)
    }

    return pathname === href
  }

  const isSstActive = sstNavItems.some((item) => getIsActive(item.href))
  const isEstruturaActive = estruturaNavItems.some((item) =>
    getIsActive(item.href)
  )
  const isContratoActive = contratoNavItems.some((item) =>
    getIsActive(item.href)
  )
  const isSaudeActive = saudeNavItems.some((item) => getIsActive(item.href))

  const [isSstOpen, setIsSstOpen] = useState(isSstActive)
  const [isEstruturaOpen, setIsEstruturaOpen] = useState(isEstruturaActive)
  const [isContratoOpen, setIsContratoOpen] = useState(isContratoActive)
  const [isSaudeOpen, setIsSaudeOpen] = useState(isSaudeActive)

  useEffect(() => {
    if (isSstActive) setIsSstOpen(true)
    if (isEstruturaActive) setIsEstruturaOpen(true)
    if (isContratoActive) setIsContratoOpen(true)
    if (isSaudeActive) setIsSaudeOpen(true)
  }, [
    pathname,
    isSstActive,
    isEstruturaActive,
    isContratoActive,
    isSaudeActive,
  ])

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
        <Collapsible open={isContratoOpen} onOpenChange={setIsContratoOpen}>
          <CollapsibleTrigger asChild>
            <SidebarMenuButton
              isActive={isContratoActive}
              tooltip='Gestão de Contrato'
              className='justify-between'
            >
              <div className='flex items-center gap-2'>
                <FileText />
                <span>Gestão de Contrato</span>
              </div>
              <ChevronRight
                className={cn(
                  'h-4 w-4 transition-transform',
                  isContratoOpen && 'rotate-90'
                )}
              />
            </SidebarMenuButton>
          </CollapsibleTrigger>
          <CollapsibleContent asChild>
            <ul className='pl-6 pt-1 space-y-1'>
              {contratoNavItems.map((item) => (
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
              tooltip='Gestão de Saúde'
              className='justify-between'
            >
              <div className='flex items-center gap-2'>
                <Stethoscope />
                <span>Gestão de Saúde</span>
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
              tooltip='Gestão de SST'
              className='justify-between'
            >
              <div className='flex items-center gap-2'>
                <ShieldAlert />
                <span>Gestão de SST</span>
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
              {sstNavItems
                .map((item) => (
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
