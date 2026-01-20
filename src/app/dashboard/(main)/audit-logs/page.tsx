'use client'

import { useState, useMemo } from 'react'
import { useFirestore, useCollection, useMemoFirebase, type AuditLog } from '@/firebase'
import { collection, query, orderBy, limit, where } from 'firebase/firestore'
import {
    Card,
    CardContent,
    CardDescription,
    CardHeader,
    CardTitle,
} from '@/components/ui/card'
import {
    Table,
    TableBody,
    TableCell,
    TableHead,
    TableHeader,
    TableRow,
} from '@/components/ui/table'
import { Badge } from '@/components/ui/badge'
import { Input } from '@/components/ui/input'
import { Search, Loader2, Shield, Archive, UserX, Edit, Trash2, Eye } from 'lucide-react'
import {
    Select,
    SelectContent,
    SelectItem,
    SelectTrigger,
    SelectValue,
} from '@/components/ui/select'
import { format } from 'date-fns'
import { ptBR } from 'date-fns/locale'

const actionIcons = {
    archive: Archive,
    suspend: UserX,
    change_status: Edit,
    deactivate: Trash2,
    update_permissions: Shield,
    restore: Archive,
    view: Eye,
}

const actionLabels: Record<string, string> = {
    archive: 'Arquivou',
    suspend: 'Suspendeu',
    change_status: 'Alterou Status',
    deactivate: 'Desativou',
    update_permissions: 'Atualizou Permissões',
    restore: 'Restaurou',
    view: 'Visualizou',
}

const moduleLabels: Record<string, string> = {
    tickets: 'Tickets',
    staffs: 'Equipe',
    clients: 'Clientes',
    profiles: 'Perfis',
    processes: 'Processos',
}

export default function AuditLogsPage() {
    const firestore = useFirestore()
    const [searchTerm, setSearchTerm] = useState('')
    const [moduleFilter, setModuleFilter] = useState<string>('all')
    const [actionFilter, setActionFilter] = useState<string>('all')

    const logsQuery = useMemoFirebase(
        () =>
            firestore
                ? query(
                    collection(firestore, 'audit_logs'),
                    orderBy('timestamp', 'desc'),
                    limit(100)
                )
                : null,
        [firestore]
    )

    const { data: logs, isLoading } = useCollection<AuditLog>(logsQuery)

    const filteredLogs = useMemo(() => {
        if (!logs) return []

        return logs.filter((log) => {
            const matchesSearch =
                searchTerm === '' ||
                log.userEmail.toLowerCase().includes(searchTerm.toLowerCase()) ||
                log.userName?.toLowerCase().includes(searchTerm.toLowerCase()) ||
                log.entityName?.toLowerCase().includes(searchTerm.toLowerCase())

            const matchesModule = moduleFilter === 'all' || log.module === moduleFilter
            const matchesAction = actionFilter === 'all' || log.action === actionFilter

            return matchesSearch && matchesModule && matchesAction
        })
    }, [logs, searchTerm, moduleFilter, actionFilter])

    const formatTimestamp = (timestamp: any) => {
        if (!timestamp) return 'N/A'
        try {
            const date = timestamp.toDate ? timestamp.toDate() : new Date(timestamp)
            return format(date, "dd/MM/yyyy 'às' HH:mm", { locale: ptBR })
        } catch {
            return 'Data inválida'
        }
    }

    const getActionIcon = (action: string) => {
        const Icon = actionIcons[action as keyof typeof actionIcons] || Eye
        return <Icon className="h-4 w-4" />
    }

    return (
        <div className="flex flex-col gap-4">
            <div>
                <h1 className="font-headline text-3xl font-bold">Logs de Auditoria</h1>
                <p className="text-muted-foreground">
                    Histórico de ações críticas realizadas no sistema
                </p>
            </div>

            <Card>
                <CardHeader>
                    <CardTitle>Registro de Atividades</CardTitle>
                    <CardDescription>
                        Últimas 100 ações registradas no sistema
                    </CardDescription>
                    <div className="flex items-center gap-2 pt-4">
                        <div className="relative flex-1 max-w-sm">
                            <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground" />
                            <Input
                                type="search"
                                placeholder="Buscar por usuário ou entidade..."
                                className="pl-8"
                                value={searchTerm}
                                onChange={(e) => setSearchTerm(e.target.value)}
                            />
                        </div>
                        <Select value={moduleFilter} onValueChange={setModuleFilter}>
                            <SelectTrigger className="w-[180px]">
                                <SelectValue placeholder="Módulo" />
                            </SelectTrigger>
                            <SelectContent>
                                <SelectItem value="all">Todos os Módulos</SelectItem>
                                {Object.entries(moduleLabels).map(([key, label]) => (
                                    <SelectItem key={key} value={key}>
                                        {label}
                                    </SelectItem>
                                ))}
                            </SelectContent>
                        </Select>
                        <Select value={actionFilter} onValueChange={setActionFilter}>
                            <SelectTrigger className="w-[180px]">
                                <SelectValue placeholder="Ação" />
                            </SelectTrigger>
                            <SelectContent>
                                <SelectItem value="all">Todas as Ações</SelectItem>
                                {Object.entries(actionLabels).map(([key, label]) => (
                                    <SelectItem key={key} value={key}>
                                        {label}
                                    </SelectItem>
                                ))}
                            </SelectContent>
                        </Select>
                    </div>
                </CardHeader>
                <CardContent>
                    {isLoading ? (
                        <div className="flex justify-center items-center h-64">
                            <Loader2 className="h-8 w-8 animate-spin text-muted-foreground" />
                        </div>
                    ) : (
                        <Table>
                            <TableHeader>
                                <TableRow>
                                    <TableHead>Data/Hora</TableHead>
                                    <TableHead>Usuário</TableHead>
                                    <TableHead>Ação</TableHead>
                                    <TableHead>Módulo</TableHead>
                                    <TableHead>Entidade</TableHead>
                                    <TableHead>Detalhes</TableHead>
                                </TableRow>
                            </TableHeader>
                            <TableBody>
                                {filteredLogs.length === 0 ? (
                                    <TableRow>
                                        <TableCell colSpan={6} className="text-center text-muted-foreground">
                                            Nenhum log encontrado
                                        </TableCell>
                                    </TableRow>
                                ) : (
                                    filteredLogs.map((log) => (
                                        <TableRow key={log.id}>
                                            <TableCell className="text-sm">
                                                {formatTimestamp(log.timestamp)}
                                            </TableCell>
                                            <TableCell>
                                                <div className="flex flex-col">
                                                    <span className="font-medium">{log.userName || 'N/A'}</span>
                                                    <span className="text-xs text-muted-foreground">
                                                        {log.userEmail}
                                                    </span>
                                                </div>
                                            </TableCell>
                                            <TableCell>
                                                <div className="flex items-center gap-2">
                                                    {getActionIcon(log.action)}
                                                    <span>{actionLabels[log.action] || log.action}</span>
                                                </div>
                                            </TableCell>
                                            <TableCell>
                                                <Badge variant="outline">
                                                    {moduleLabels[log.module] || log.module}
                                                </Badge>
                                            </TableCell>
                                            <TableCell>
                                                <div className="flex flex-col">
                                                    <span className="font-medium">
                                                        {log.entityName || log.entityId}
                                                    </span>
                                                    {log.entityName && (
                                                        <span className="text-xs text-muted-foreground">
                                                            ID: {log.entityId}
                                                        </span>
                                                    )}
                                                </div>
                                            </TableCell>
                                            <TableCell className="text-xs text-muted-foreground max-w-xs truncate">
                                                {log.details && typeof log.details === 'object'
                                                    ? JSON.stringify(log.details)
                                                    : '-'}
                                            </TableCell>
                                        </TableRow>
                                    ))
                                )}
                            </TableBody>
                        </Table>
                    )}
                </CardContent>
            </Card>
        </div>
    )
}
