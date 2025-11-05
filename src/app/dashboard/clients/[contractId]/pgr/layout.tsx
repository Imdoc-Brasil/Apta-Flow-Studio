'use client'

import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from '@/components/ui/card'
import { Tabs, TabsList, TabsTrigger } from '@/components/ui/tabs'
import Link from 'next/link'
import { useParams, usePathname } from 'next/navigation'
import { Button } from '@/components/ui/button'
import { ArrowLeft } from 'lucide-react'

export default function PgrLayout({ children }: { children: React.ReactNode }) {
  const params = useParams()
  const pathname = usePathname()
  const contractId = params.contractId as string
  const pgrId = params.pgrId as string // Assuming the dynamic route is [pgrId]

  // If there is no pgrId, it means we are on the list page, so we render children directly.
  if (!pgrId) {
    return <>{children}</>
  }

  const basePath = `/dashboard/clients/${contractId}/pgr/${pgrId}`

  const tabs = [
    { name: 'Inventário de Riscos', href: `${basePath}/inventory` },
    { name: 'Avaliações Quantitativas', href: `${basePath}/measurements` },
    { name: 'Plano de Ação', href: `${basePath}/action-plan` },
  ]

  // Determine the active tab based on the current path
  const activeTab = tabs.find((tab) => pathname.startsWith(tab.href))?.href

  return (
    <div className='flex flex-col gap-4'>
      <div className='flex items-center gap-4'>
        <Button variant='outline' size='icon' className='h-7 w-7' asChild>
          <Link href={`/dashboard/clients/${contractId}/pgr`}>
            <ArrowLeft className='h-4 w-4' />
            <span className='sr-only'>Voltar para lista de PGRs</span>
          </Link>
        </Button>
        <h1 className='font-semibold text-lg'>Gerenciando PGR: {pgrId}</h1>
      </div>
      <Card>
        <CardHeader>
          <CardTitle>Gestão de Riscos (PGR)</CardTitle>
          <CardDescription>
            Gerencie o Programa de Gerenciamento de Riscos, incluindo o
            inventário de riscos e o plano de ação.
          </CardDescription>
        </CardHeader>
        <CardContent>
          <Tabs value={activeTab}>
            <TabsList>
              {tabs.map((tab) => (
                <TabsTrigger key={tab.href} value={tab.href} asChild>
                  <Link href={tab.href}>{tab.name}</Link>
                </TabsTrigger>
              ))}
            </TabsList>
          </Tabs>
        </CardContent>
      </Card>
      {children}
    </div>
  )
}
