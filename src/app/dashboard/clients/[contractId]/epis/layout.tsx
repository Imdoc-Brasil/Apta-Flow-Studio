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

export default function EpisLayout({ children }: { children: React.ReactNode }) {
  const params = useParams()
  const pathname = usePathname()
  const contractId = params.contractId as string

  const basePath = `/dashboard/clients/${contractId}/epis`

  const tabs = [
    { name: 'Inventário de EPIs', href: `${basePath}/inventory` },
    { name: 'Histórico de Entregas', href: `${basePath}/deliveries` },
  ]

  const activeTab = tabs.find((tab) => pathname.startsWith(tab.href))?.href

  return (
    <div className='flex flex-col gap-4'>
      <Card>
        <CardHeader>
          <CardTitle>Gestão de EPIs</CardTitle>
          <CardDescription>
            Gerencie o inventário de equipamentos, registre entregas e
            acompanhe a validade dos EPIs.
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
