'use client'

import { useState, useMemo } from 'react'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Badge } from '@/components/ui/badge'
import { Database, HardDrive, RefreshCw, Download, Upload, AlertTriangle, Loader2 } from 'lucide-react'
import { Alert, AlertDescription, AlertTitle } from '@/components/ui/alert'
import { useFirestore, useCollection, useMemoFirebase } from '@/firebase'
import { collection } from 'firebase/firestore'
import { useToast } from '@/hooks/use-toast'

export default function DatabasePage() {
    const firestore = useFirestore()
    const { toast } = useToast()
    const [isExporting, setIsExporting] = useState(false)

    // Fetch collections for statistics
    const clientsRef = useMemoFirebase(
        () => (firestore ? collection(firestore, 'clients') : null),
        [firestore]
    )
    const staffsRef = useMemoFirebase(
        () => (firestore ? collection(firestore, 'staffs') : null),
        [firestore]
    )
    const ticketsRef = useMemoFirebase(
        () => (firestore ? collection(firestore, 'tickets') : null),
        [firestore]
    )
    const profilesRef = useMemoFirebase(
        () => (firestore ? collection(firestore, 'profiles') : null),
        [firestore]
    )
    const auditLogsRef = useMemoFirebase(
        () => (firestore ? collection(firestore, 'audit_logs') : null),
        [firestore]
    )

    const { data: clients } = useCollection(clientsRef)
    const { data: staffs } = useCollection(staffsRef)
    const { data: tickets } = useCollection(ticketsRef)
    const { data: profiles } = useCollection(profilesRef)
    const { data: auditLogs } = useCollection(auditLogsRef)

    const collections = useMemo(() => [
        { name: 'clients', docs: clients?.length || 0, description: 'Dados de clientes' },
        { name: 'staffs', docs: staffs?.length || 0, description: 'Equipe interna' },
        { name: 'tickets', docs: tickets?.length || 0, description: 'Tickets de serviço' },
        { name: 'profiles', docs: profiles?.length || 0, description: 'Perfis de acesso' },
        { name: 'audit_logs', docs: auditLogs?.length || 0, description: 'Logs de auditoria' },
    ], [clients, staffs, tickets, profiles, auditLogs])

    const totalDocs = collections.reduce((sum, col) => sum + col.docs, 0)

    const handleExport = async () => {
        setIsExporting(true)

        try {
            // Simulate export
            const exportData = {
                clients: clients || [],
                staffs: staffs || [],
                tickets: tickets || [],
                profiles: profiles || [],
                audit_logs: auditLogs || [],
                exportedAt: new Date().toISOString(),
            }

            const blob = new Blob([JSON.stringify(exportData, null, 2)], { type: 'application/json' })
            const url = URL.createObjectURL(blob)
            const a = document.createElement('a')
            a.href = url
            a.download = `firestore-backup-${new Date().toISOString().split('T')[0]}.json`
            document.body.appendChild(a)
            a.click()
            document.body.removeChild(a)
            URL.revokeObjectURL(url)

            toast({
                title: 'Exportação Concluída!',
                description: 'Os dados foram exportados com sucesso.',
            })
        } catch (error) {
            toast({
                title: 'Erro na Exportação',
                description: 'Não foi possível exportar os dados.',
                variant: 'destructive',
            })
        } finally {
            setIsExporting(false)
        }
    }

    return (
        <div className="flex flex-col gap-6">
            <div>
                <h1 className="font-headline text-3xl font-bold">Gerenciamento de Banco de Dados</h1>
                <p className="text-muted-foreground">
                    Ferramentas de manutenção e monitoramento do Firestore
                </p>
            </div>

            <Alert>
                <AlertTriangle className="h-4 w-4" />
                <AlertTitle>Atenção</AlertTitle>
                <AlertDescription>
                    Esta seção contém ferramentas avançadas. Use com cuidado para evitar perda de dados.
                </AlertDescription>
            </Alert>

            <div className="grid gap-6 md:grid-cols-2">
                <Card>
                    <CardHeader>
                        <div className="flex items-center gap-2">
                            <Database className="h-5 w-5" />
                            <CardTitle>Status do Banco</CardTitle>
                        </div>
                        <CardDescription>
                            Informações sobre o Firestore
                        </CardDescription>
                    </CardHeader>
                    <CardContent className="space-y-4">
                        <div className="flex justify-between items-center">
                            <span className="text-sm font-medium">Status</span>
                            <Badge variant="default" className="bg-green-600">Conectado</Badge>
                        </div>
                        <div className="flex justify-between items-center">
                            <span className="text-sm font-medium">Projeto</span>
                            <span className="text-sm text-muted-foreground">studio-9804515494-e1a53</span>
                        </div>
                        <div className="flex justify-between items-center">
                            <span className="text-sm font-medium">Região</span>
                            <span className="text-sm text-muted-foreground">us-central1</span>
                        </div>
                        <div className="flex justify-between items-center">
                            <span className="text-sm font-medium">Modo</span>
                            <Badge variant="outline">Produção</Badge>
                        </div>
                    </CardContent>
                </Card>

                <Card>
                    <CardHeader>
                        <div className="flex items-center gap-2">
                            <HardDrive className="h-5 w-5" />
                            <CardTitle>Uso de Armazenamento</CardTitle>
                        </div>
                        <CardDescription>
                            Estatísticas de uso do Firestore
                        </CardDescription>
                    </CardHeader>
                    <CardContent className="space-y-4">
                        <div className="flex justify-between items-center">
                            <span className="text-sm font-medium">Documentos</span>
                            <span className="text-sm font-semibold">{totalDocs.toLocaleString()}</span>
                        </div>
                        <div className="flex justify-between items-center">
                            <span className="text-sm font-medium">Coleções</span>
                            <span className="text-sm font-semibold">{collections.length}</span>
                        </div>
                        <div className="flex justify-between items-center">
                            <span className="text-sm font-medium">Maior Coleção</span>
                            <span className="text-sm text-muted-foreground">
                                {collections.reduce((max, col) => col.docs > max.docs ? col : max, collections[0])?.name || 'N/A'}
                            </span>
                        </div>
                        <div className="flex justify-between items-center">
                            <span className="text-sm font-medium">Última Atualização</span>
                            <span className="text-sm text-muted-foreground">
                                {new Date().toLocaleString('pt-BR')}
                            </span>
                        </div>
                    </CardContent>
                </Card>
            </div>

            <Card>
                <CardHeader>
                    <CardTitle>Coleções Principais</CardTitle>
                    <CardDescription>
                        Visão geral das coleções do sistema
                    </CardDescription>
                </CardHeader>
                <CardContent>
                    <div className="space-y-3">
                        {collections.map((collection) => {
                            const percentage = totalDocs > 0 ? Math.round((collection.docs / totalDocs) * 100) : 0

                            return (
                                <div key={collection.name} className="flex items-center justify-between p-3 border rounded-lg">
                                    <div className="flex-1">
                                        <div className="flex items-center justify-between mb-2">
                                            <div>
                                                <p className="font-medium">{collection.name}</p>
                                                <p className="text-sm text-muted-foreground">{collection.description}</p>
                                            </div>
                                            <div className="text-right">
                                                <p className="text-sm font-medium">{collection.docs.toLocaleString()}</p>
                                                <p className="text-xs text-muted-foreground">documentos</p>
                                            </div>
                                        </div>
                                        <div className="h-2 bg-muted rounded-full overflow-hidden">
                                            <div
                                                className="h-full bg-primary"
                                                style={{ width: `${percentage}%` }}
                                            />
                                        </div>
                                    </div>
                                </div>
                            )
                        })}
                    </div>
                </CardContent>
            </Card>

            <Card>
                <CardHeader>
                    <CardTitle>Ferramentas de Manutenção</CardTitle>
                    <CardDescription>
                        Operações de backup e manutenção
                    </CardDescription>
                </CardHeader>
                <CardContent className="space-y-3">
                    <div className="grid gap-3 md:grid-cols-2">
                        <Button variant="outline" className="justify-start" onClick={handleExport} disabled={isExporting}>
                            {isExporting ? (
                                <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                            ) : (
                                <Download className="mr-2 h-4 w-4" />
                            )}
                            Exportar Dados
                        </Button>
                        <Button variant="outline" className="justify-start" disabled>
                            <Upload className="mr-2 h-4 w-4" />
                            Importar Dados
                        </Button>
                        <Button variant="outline" className="justify-start" disabled>
                            <RefreshCw className="mr-2 h-4 w-4" />
                            Reindexar Coleções
                        </Button>
                        <Button variant="outline" className="justify-start" disabled>
                            <AlertTriangle className="mr-2 h-4 w-4" />
                            Limpar Cache
                        </Button>
                    </div>
                </CardContent>
            </Card>

            <Card className="border-destructive">
                <CardHeader>
                    <CardTitle className="text-destructive">Zona de Perigo</CardTitle>
                    <CardDescription>
                        Ações irreversíveis - use com extremo cuidado
                    </CardDescription>
                </CardHeader>
                <CardContent className="space-y-3">
                    <Alert variant="destructive">
                        <AlertTriangle className="h-4 w-4" />
                        <AlertDescription>
                            As ações abaixo podem causar perda permanente de dados. Certifique-se de ter um backup antes de prosseguir.
                        </AlertDescription>
                    </Alert>
                    <div className="grid gap-3">
                        <Button variant="destructive" disabled>
                            Limpar Logs Antigos (&gt;1 ano)
                        </Button>
                        <Button variant="destructive" disabled>
                            Remover Dados Arquivados
                        </Button>
                        <Button variant="destructive" disabled>
                            Reset Completo do Banco
                        </Button>
                    </div>
                </CardContent>
            </Card>
        </div>
    )
}
