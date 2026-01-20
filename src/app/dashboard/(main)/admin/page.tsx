'use client'

import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Users, Shield, FileText, Activity, Settings, Database } from 'lucide-react'
import Link from 'next/link'

const adminModules = [
    {
        title: 'Gestão de Equipe',
        description: 'Gerencie membros da equipe interna e suas permissões',
        icon: Users,
        href: '/dashboard/employees',
        color: 'text-blue-600',
        bgColor: 'bg-blue-50',
    },
    {
        title: 'Perfis de Acesso',
        description: 'Configure perfis e permissões do sistema',
        icon: Shield,
        href: '/dashboard/profiles',
        color: 'text-purple-600',
        bgColor: 'bg-purple-50',
    },
    {
        title: 'Logs de Auditoria',
        description: 'Visualize o histórico de ações críticas do sistema',
        icon: FileText,
        href: '/dashboard/audit-logs',
        color: 'text-amber-600',
        bgColor: 'bg-amber-50',
    },
    {
        title: 'Compliance',
        description: 'Dashboard de conformidade e métricas de auditoria',
        icon: Shield,
        href: '/dashboard/compliance',
        color: 'text-emerald-600',
        bgColor: 'bg-emerald-50',
    },
    {
        title: 'Analytics',
        description: 'Análise de dados e relatórios do sistema',
        icon: Activity,
        href: '/dashboard/analytics',
        color: 'text-green-600',
        bgColor: 'bg-green-50',
    },
    {
        title: 'Configurações',
        description: 'Configurações gerais do sistema',
        icon: Settings,
        href: '/dashboard/settings',
        color: 'text-gray-600',
        bgColor: 'bg-gray-50',
    },
    {
        title: 'Banco de Dados',
        description: 'Gerenciamento e manutenção do Firestore',
        icon: Database,
        href: '/dashboard/database',
        color: 'text-red-600',
        bgColor: 'bg-red-50',
    },
]

export default function AdminPage() {
    return (
        <div className="flex flex-col gap-6">
            <div>
                <h1 className="font-headline text-3xl font-bold">Painel Administrativo</h1>
                <p className="text-muted-foreground">
                    Ferramentas de gestão e configuração do sistema
                </p>
            </div>

            <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
                {adminModules.map((module) => {
                    const Icon = module.icon
                    return (
                        <Link key={module.href} href={module.href}>
                            <Card className="h-full transition-all hover:shadow-lg hover:scale-[1.02] cursor-pointer">
                                <CardHeader>
                                    <div className={`w-12 h-12 rounded-lg ${module.bgColor} flex items-center justify-center mb-4`}>
                                        <Icon className={`h-6 w-6 ${module.color}`} />
                                    </div>
                                    <CardTitle className="text-xl">{module.title}</CardTitle>
                                    <CardDescription>{module.description}</CardDescription>
                                </CardHeader>
                                <CardContent>
                                    <Button variant="ghost" className="w-full justify-start" asChild>
                                        <span>
                                            Acessar módulo →
                                        </span>
                                    </Button>
                                </CardContent>
                            </Card>
                        </Link>
                    )
                })}
            </div>

            <Card>
                <CardHeader>
                    <CardTitle>Acesso Rápido</CardTitle>
                    <CardDescription>Ações administrativas frequentes</CardDescription>
                </CardHeader>
                <CardContent className="grid gap-2 md:grid-cols-2 lg:grid-cols-4">
                    <Button variant="outline" asChild>
                        <Link href="/dashboard/employees">
                            <Users className="mr-2 h-4 w-4" />
                            Adicionar Membro
                        </Link>
                    </Button>
                    <Button variant="outline" asChild>
                        <Link href="/dashboard/profiles">
                            <Shield className="mr-2 h-4 w-4" />
                            Criar Perfil
                        </Link>
                    </Button>
                    <Button variant="outline" asChild>
                        <Link href="/dashboard/audit-logs">
                            <FileText className="mr-2 h-4 w-4" />
                            Ver Logs
                        </Link>
                    </Button>
                    <Button variant="outline" asChild>
                        <Link href="/dashboard/analytics">
                            <Activity className="mr-2 h-4 w-4" />
                            Relatórios
                        </Link>
                    </Button>
                </CardContent>
            </Card>
        </div>
    )
}
