'use client'

import React, { Fragment } from 'react'
import Link from 'next/link'
import { usePathname } from 'next/navigation'
import { ChevronRight, Home } from 'lucide-react'

// Mapeamento de segmentos de URL para nomes amigáveis
const breadcrumbNameMap: { [key: string]: string } = {
  dashboard: 'Painel',
  clients: 'Clientes',
  employees: 'Colaboradores',
  info: 'Informações',
  units: 'Unidades',
  sectors: 'Setores',
  roles: 'Cargos',
  ghe: 'GHE',
  pgr: 'PGR',
  history: 'Histórico',
  tickets: 'Chamados',
  events: 'Eventos',
  billing: 'Faturamento',
  services: 'Serviços',
  prices: 'Preços',
  environments: 'Postos de Trabalho',
  processes: 'Processos',
  machines: 'Máquinas e Equipamentos',
  pcmso: 'PCMSO',
  asos: 'ASOs',
  periodicos: 'Periódicos',
  epis: 'EPIs',
  recommendation: 'Recomendação',
  vaccines: 'Vacinas',
  'docs-sst': 'Documentos de SST',
  health: 'Saúde',
  queue: 'Fila de Atendimento',
  evaluation: 'Avaliação',
  'clinical-exams': 'Exames Clínicos',
  settings: 'Configurações',
  'reports-portal': 'Portal de Laudos',
  ecg: 'ECG',
  analysis: 'Análise',
  profiles: 'Perfis',
  risks: 'Riscos',
  trainings: 'Treinamentos',
  performance: 'Desempenho',
  analytics: 'Analytics',
  diagram: 'Diagrama',
}

export function Breadcrumb() {
  const pathname = usePathname()

  // Não renderizar o breadcrumb em certas páginas base
  if (pathname === '/dashboard') {
    return null
  }

  // Esconde o breadcrumb em rotas que não fazem parte do fluxo principal do dashboard
  if (!pathname.startsWith('/dashboard/')) {
    return null
  }

  const pathSegments = pathname.split('/').filter((segment) => segment)

  // Ocultar o primeiro segmento 'dashboard' da exibição
  const visibleSegments = pathSegments.slice(1)

  return (
    <nav aria-label='Breadcrumb' className='hidden md:flex'>
      <ol className='flex items-center gap-1 text-sm text-muted-foreground'>
        <li>
          <Link
            href='/dashboard'
            className='font-semibold text-foreground transition-colors hover:text-foreground'
          >
            <Home className='h-4 w-4' />
            <span className='sr-only'>Painel</span>
          </Link>
        </li>
        {visibleSegments.map((segment, index) => {
          const href = `/dashboard/${visibleSegments.slice(0, index + 1).join('/')}`
          const isLast = index === visibleSegments.length - 1
          const name = breadcrumbNameMap[segment] || segment

          // Não renderizar segmentos que são IDs dinâmicos (geralmente não estão no map)
          if (!breadcrumbNameMap[segment]) {
            return null
          }

          return (
            <Fragment key={href}>
              <li className='flex items-center'>
                <ChevronRight className='h-4 w-4' />
              </li>
              <li>
                {isLast ? (
                  <span className='font-medium text-foreground'>{name}</span>
                ) : (
                  <Link
                    href={href}
                    className='font-medium transition-colors hover:text-foreground'
                  >
                    {name}
                  </Link>
                )}
              </li>
            </Fragment>
          )
        })}
      </ol>
    </nav>
  )
}
