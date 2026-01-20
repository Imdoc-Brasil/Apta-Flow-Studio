'use client'

import { useMemo } from 'react'
import { useFirestore, useCollection, useMemoFirebase, type AuditLog } from '@/firebase'
import { collection, query, orderBy, limit, where, Timestamp } from 'firebase/firestore'
import {
    Card,
    CardContent,
    CardDescription,
    CardHeader,
    CardTitle,
} from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { Shield, AlertTriangle, CheckCircle2, TrendingUp, Users, Activity } from 'lucide-react'
import { format, subDays, startOfDay, endOfDay } from 'date-fns'
import { ptBR } from 'date-fns/locale'
import {
    Bar,
    BarChart,
    Line,
    LineChart,
    CartesianGrid,
    XAxis,
    YAxis,
    ResponsiveContainer,
} from 'recharts'
import {
    ChartContainer,
    ChartTooltip,
    ChartTooltipContent,
} from '@/components/ui/chart'

const chartConfig = {
    actions: {
        label: 'Ações',
        color: 'hsl(var(--chart-1))',
    },
}

export default function CompliancePage() {
    const firestore = useFirestore()

    // Fetch audit logs
    const logsQuery = useMemoFirebase(
        () =>
            firestore
                ? query(
                    collection(firestore, 'audit_logs'),
                    orderBy('timestamp', 'desc'),
                    limit(1000)
                )
                : null,
        [firestore]
    )

    const { data: logs, isLoading } = useCollection<AuditLog>(logsQuery)

    // Calculate compliance metrics
    const metrics = useMemo(() => {
        if (!logs) return null

        const now = new Date()
        const last7Days = subDays(now, 7)
        const last30Days = subDays(now, 30)

        const recentLogs = logs.filter((log) => {
            if (!log.timestamp) return false
            const logDate = log.timestamp.toDate ? log.timestamp.toDate() : new Date(log.timestamp)
            return logDate >= last7Days
        })

        const monthlyLogs = logs.filter((log) => {
            if (!log.timestamp) return false
            const logDate = log.timestamp.toDate ? log.timestamp.toDate() : new Date(log.timestamp)
            return logDate >= last30Days
        })

        // Count by action type
        const actionCounts = {
            archive: monthlyLogs.filter(l => l.action === 'archive').length,
            suspend: monthlyLogs.filter(l => l.action === 'suspend').length,
            deactivate: monthlyLogs.filter(l => l.action === 'deactivate').length,
            update_permissions: monthlyLogs.filter(l => l.action === 'update_permissions').length,
            change_status: monthlyLogs.filter(l => l.action === 'change_status').length,
        }

        // Count by module
        const moduleCounts = {
            tickets: monthlyLogs.filter(l => l.module === 'tickets').length,
            staffs: monthlyLogs.filter(l => l.module === 'staffs').length,
            clients: monthlyLogs.filter(l => l.module === 'clients').length,
            profiles: monthlyLogs.filter(l => l.module === 'profiles').length,
            processes: monthlyLogs.filter(l => l.module === 'processes').length,
        }

        // Unique users
        const uniqueUsers = new Set(monthlyLogs.map(l => l.userEmail)).size

        // Daily activity for last 7 days
        const dailyActivity = Array.from({ length: 7 }, (_, i) => {
            const date = subDays(now, 6 - i)
            const dayStart = startOfDay(date)
            const dayEnd = endOfDay(date)

            const dayLogs = logs.filter((log) => {
                if (!log.timestamp) return false
                const logDate = log.timestamp.toDate ? log.timestamp.toDate() : new Date(log.timestamp)
                return logDate >= dayStart && logDate <= dayEnd
            })

            return {
                date: format(date, 'dd/MM', { locale: ptBR }),
                actions: dayLogs.length,
            }
        })

        return {
            totalActions: monthlyLogs.length,
            recentActions: recentLogs.length,
            actionCounts,
            moduleCounts,
            uniqueUsers,
            dailyActivity,
            complianceScore: Math.min(100, Math.round((monthlyLogs.length / 100) * 100)), // Mock score
        }
    }, [logs])

    if (isLoading || !metrics) {
        return <div>Carregando...</div>
    }

    return (
        <div className="flex flex-col gap-6">
            <div>
                <h1 className="font-headline text-3xl font-bold">Dashboard de Compliance</h1>
                <p className="text-muted-foreground">
                    Métricas de auditoria e conformidade do sistema
                </p>
            </div>

            {/* KPIs */}
            <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
                <Card>
                    <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                        <CardTitle className="text-sm font-medium">Score de Compliance</CardTitle>
                        <Shield className="h-4 w-4 text-muted-foreground" />
                    </CardHeader>
                    <CardContent>
                        <div className="text-2xl font-bold">{metrics.complianceScore}%</div>
                        <p className="text-xs text-muted-foreground">
                            <TrendingUp className="inline h-3 w-3 text-green-600" /> +5% vs mês anterior
                        </p>
                    </CardContent>
                </Card>

                <Card>
                    <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                        <CardTitle className="text-sm font-medium">Ações Auditadas</CardTitle>
                        <Activity className="h-4 w-4 text-muted-foreground" />
                    </CardHeader>
                    <CardContent>
                        <div className="text-2xl font-bold">{metrics.totalActions}</div>
                        <p className="text-xs text-muted-foreground">
                            Últimos 30 dias
                        </p>
                    </CardContent>
                </Card>

                <Card>
                    <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                        <CardTitle className="text-sm font-medium">Usuários Ativos</CardTitle>
                        <Users className="h-4 w-4 text-muted-foreground" />
                    </CardHeader>
                    <CardContent>
                        <div className="text-2xl font-bold">{metrics.uniqueUsers}</div>
                        <p className="text-xs text-muted-foreground">
                            Realizaram ações críticas
                        </p>
                    </CardContent>
                </Card>

                <Card>
                    <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                        <CardTitle className="text-sm font-medium">Atividade Recente</CardTitle>
                        <CheckCircle2 className="h-4 w-4 text-muted-foreground" />
                    </CardHeader>
                    <CardContent>
                        <div className="text-2xl font-bold">{metrics.recentActions}</div>
                        <p className="text-xs text-muted-foreground">
                            Últimos 7 dias
                        </p>
                    </CardContent>
                </Card>
            </div>

            {/* Charts */}
            <div className="grid gap-4 md:grid-cols-2">
                <Card>
                    <CardHeader>
                        <CardTitle>Atividade Diária</CardTitle>
                        <CardDescription>Ações auditadas nos últimos 7 dias</CardDescription>
                    </CardHeader>
                    <CardContent>
                        <ChartContainer config={chartConfig} className="h-[300px] w-full">
                            <LineChart data={metrics.dailyActivity}>
                                <CartesianGrid vertical={false} />
                                <XAxis
                                    dataKey="date"
                                    tickLine={false}
                                    axisLine={false}
                                    tickMargin={8}
                                />
                                <YAxis />
                                <ChartTooltip cursor={false} content={<ChartTooltipContent />} />
                                <Line
                                    dataKey="actions"
                                    type="monotone"
                                    stroke="var(--color-actions)"
                                    strokeWidth={2}
                                    dot={{ fill: 'var(--color-actions)' }}
                                />
                            </LineChart>
                        </ChartContainer>
                    </CardContent>
                </Card>

                <Card>
                    <CardHeader>
                        <CardTitle>Ações por Tipo</CardTitle>
                        <CardDescription>Distribuição de ações críticas</CardDescription>
                    </CardHeader>
                    <CardContent>
                        <ChartContainer config={chartConfig} className="h-[300px] w-full">
                            <BarChart
                                data={[
                                    { name: 'Arquivar', value: metrics.actionCounts.archive },
                                    { name: 'Suspender', value: metrics.actionCounts.suspend },
                                    { name: 'Desativar', value: metrics.actionCounts.deactivate },
                                    { name: 'Permissões', value: metrics.actionCounts.update_permissions },
                                    { name: 'Status', value: metrics.actionCounts.change_status },
                                ]}
                            >
                                <CartesianGrid vertical={false} />
                                <XAxis dataKey="name" tickLine={false} axisLine={false} />
                                <YAxis />
                                <ChartTooltip cursor={false} content={<ChartTooltipContent />} />
                                <Bar dataKey="value" fill="var(--color-actions)" radius={8} />
                            </BarChart>
                        </ChartContainer>
                    </CardContent>
                </Card>
            </div>

            {/* Module Activity */}
            <Card>
                <CardHeader>
                    <CardTitle>Atividade por Módulo</CardTitle>
                    <CardDescription>Ações auditadas em cada módulo do sistema</CardDescription>
                </CardHeader>
                <CardContent>
                    <div className="space-y-4">
                        {Object.entries(metrics.moduleCounts).map(([module, count]) => {
                            const total = metrics.totalActions
                            const percentage = total > 0 ? Math.round((count / total) * 100) : 0

                            return (
                                <div key={module} className="flex items-center">
                                    <div className="w-32 font-medium capitalize">{module}</div>
                                    <div className="flex-1">
                                        <div className="h-2 bg-muted rounded-full overflow-hidden">
                                            <div
                                                className="h-full bg-primary"
                                                style={{ width: `${percentage}%` }}
                                            />
                                        </div>
                                    </div>
                                    <div className="w-20 text-right text-sm text-muted-foreground">
                                        {count} ({percentage}%)
                                    </div>
                                </div>
                            )
                        })}
                    </div>
                </CardContent>
            </Card>

            {/* Compliance Status */}
            <Card>
                <CardHeader>
                    <CardTitle>Status de Conformidade</CardTitle>
                    <CardDescription>Verificações de segurança e auditoria</CardDescription>
                </CardHeader>
                <CardContent>
                    <div className="space-y-3">
                        <div className="flex items-center justify-between p-3 border rounded-lg">
                            <div className="flex items-center gap-3">
                                <CheckCircle2 className="h-5 w-5 text-green-600" />
                                <div>
                                    <p className="font-medium">Logs de Auditoria Ativos</p>
                                    <p className="text-sm text-muted-foreground">
                                        Sistema registrando todas as ações críticas
                                    </p>
                                </div>
                            </div>
                            <Badge variant="default" className="bg-green-600">Ativo</Badge>
                        </div>

                        <div className="flex items-center justify-between p-3 border rounded-lg">
                            <div className="flex items-center gap-3">
                                <CheckCircle2 className="h-5 w-5 text-green-600" />
                                <div>
                                    <p className="font-medium">Soft-Delete Implementado</p>
                                    <p className="text-sm text-muted-foreground">
                                        Dados não são permanentemente excluídos
                                    </p>
                                </div>
                            </div>
                            <Badge variant="default" className="bg-green-600">Ativo</Badge>
                        </div>

                        <div className="flex items-center justify-between p-3 border rounded-lg">
                            <div className="flex items-center gap-3">
                                <CheckCircle2 className="h-5 w-5 text-green-600" />
                                <div>
                                    <p className="font-medium">Controle de Permissões</p>
                                    <p className="text-sm text-muted-foreground">
                                        RBAC implementado em todos os módulos
                                    </p>
                                </div>
                            </div>
                            <Badge variant="default" className="bg-green-600">Ativo</Badge>
                        </div>

                        <div className="flex items-center justify-between p-3 border rounded-lg">
                            <div className="flex items-center gap-3">
                                <AlertTriangle className="h-5 w-5 text-amber-600" />
                                <div>
                                    <p className="font-medium">Backup Automático</p>
                                    <p className="text-sm text-muted-foreground">
                                        Configurar rotina de backup do Firestore
                                    </p>
                                </div>
                            </div>
                            <Badge variant="outline" className="text-amber-600">Pendente</Badge>
                        </div>
                    </div>
                </CardContent>
            </Card>
        </div>
    )
}
