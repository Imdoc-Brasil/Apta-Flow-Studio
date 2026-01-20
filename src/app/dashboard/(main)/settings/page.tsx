'use client'

import { useState, useEffect } from 'react'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Label } from '@/components/ui/label'
import { Input } from '@/components/ui/input'
import { Switch } from '@/components/ui/switch'
import { Separator } from '@/components/ui/separator'
import { Bell, Mail, Lock, Palette, Globe, Loader2 } from 'lucide-react'
import { useToast } from '@/hooks/use-toast'
import {
    useFirestore,
    useDoc,
    useUser,
    useMemoFirebase,
    setDocumentNonBlocking,
    createAuditLog,
} from '@/firebase'
import { doc } from 'firebase/firestore'
import type { SystemSettings } from './data'
import { defaultSettings } from './data'

export default function SettingsPage() {
    const firestore = useFirestore()
    const { user } = useUser()
    const { toast } = useToast()

    // Reference to settings document
    const settingsDocRef = useMemoFirebase(
        () => (firestore ? doc(firestore, 'system_settings', 'global') : null),
        [firestore]
    )

    const { data: settingsData, isLoading } = useDoc<SystemSettings>(settingsDocRef)

    // Local state for form
    const [settings, setSettings] = useState<SystemSettings>(defaultSettings)
    const [isSaving, setIsSaving] = useState(false)

    // Load settings from Firestore
    useEffect(() => {
        if (settingsData) {
            setSettings(settingsData)
        }
    }, [settingsData])

    const handleSave = async () => {
        if (!firestore || !user) return

        setIsSaving(true)

        const updatedSettings: SystemSettings = {
            ...settings,
            updatedAt: new Date().toISOString(),
            updatedBy: user.email || '',
        }

        setDocumentNonBlocking(
            doc(firestore, 'system_settings', 'global'),
            updatedSettings,
            { merge: true }
        )

        createAuditLog(firestore, {
            userId: user.uid,
            userEmail: user.email || '',
            userName: user.displayName || '',
            action: 'update_settings',
            module: 'settings',
            entityId: 'global',
            entityName: 'System Settings',
            details: { settings: updatedSettings },
        })

        toast({
            title: 'Configurações Salvas!',
            description: 'As configurações do sistema foram atualizadas.',
        })

        setIsSaving(false)
    }

    if (isLoading) {
        return (
            <div className="flex items-center justify-center h-96">
                <Loader2 className="h-8 w-8 animate-spin" />
            </div>
        )
    }

    return (
        <div className="flex flex-col gap-6">
            <div>
                <h1 className="font-headline text-3xl font-bold">Configurações do Sistema</h1>
                <p className="text-muted-foreground">
                    Gerencie as configurações gerais da aplicação
                </p>
            </div>

            <div className="grid gap-6">
                <Card>
                    <CardHeader>
                        <div className="flex items-center gap-2">
                            <Bell className="h-5 w-5" />
                            <CardTitle>Notificações</CardTitle>
                        </div>
                        <CardDescription>
                            Configure como e quando receber notificações
                        </CardDescription>
                    </CardHeader>
                    <CardContent className="space-y-4">
                        <div className="flex items-center justify-between">
                            <div className="space-y-0.5">
                                <Label>Notificações por Email</Label>
                                <p className="text-sm text-muted-foreground">
                                    Receba atualizações importantes por email
                                </p>
                            </div>
                            <Switch
                                checked={settings.emailNotifications}
                                onCheckedChange={(checked) =>
                                    setSettings({ ...settings, emailNotifications: checked })
                                }
                            />
                        </div>
                        <Separator />
                        <div className="flex items-center justify-between">
                            <div className="space-y-0.5">
                                <Label>Notificações de Tickets</Label>
                                <p className="text-sm text-muted-foreground">
                                    Alertas quando tickets são atribuídos a você
                                </p>
                            </div>
                            <Switch
                                checked={settings.ticketNotifications}
                                onCheckedChange={(checked) =>
                                    setSettings({ ...settings, ticketNotifications: checked })
                                }
                            />
                        </div>
                        <Separator />
                        <div className="flex items-center justify-between">
                            <div className="space-y-0.5">
                                <Label>Resumo Diário</Label>
                                <p className="text-sm text-muted-foreground">
                                    Receba um resumo das atividades do dia
                                </p>
                            </div>
                            <Switch
                                checked={settings.dailySummary}
                                onCheckedChange={(checked) =>
                                    setSettings({ ...settings, dailySummary: checked })
                                }
                            />
                        </div>
                    </CardContent>
                </Card>

                <Card>
                    <CardHeader>
                        <div className="flex items-center gap-2">
                            <Mail className="h-5 w-5" />
                            <CardTitle>Email</CardTitle>
                        </div>
                        <CardDescription>
                            Configurações de envio de email
                        </CardDescription>
                    </CardHeader>
                    <CardContent className="space-y-4">
                        <div className="grid gap-2">
                            <Label htmlFor="smtp-host">Servidor SMTP</Label>
                            <Input
                                id="smtp-host"
                                placeholder="smtp.exemplo.com"
                                value={settings.smtpHost}
                                onChange={(e) => setSettings({ ...settings, smtpHost: e.target.value })}
                            />
                        </div>
                        <div className="grid gap-2">
                            <Label htmlFor="smtp-port">Porta</Label>
                            <Input
                                id="smtp-port"
                                placeholder="587"
                                type="number"
                                value={settings.smtpPort}
                                onChange={(e) =>
                                    setSettings({ ...settings, smtpPort: parseInt(e.target.value) || 587 })
                                }
                            />
                        </div>
                        <div className="grid gap-2">
                            <Label htmlFor="from-email">Email Remetente</Label>
                            <Input
                                id="from-email"
                                placeholder="noreply@exemplo.com"
                                type="email"
                                value={settings.fromEmail}
                                onChange={(e) => setSettings({ ...settings, fromEmail: e.target.value })}
                            />
                        </div>
                    </CardContent>
                </Card>

                <Card>
                    <CardHeader>
                        <div className="flex items-center gap-2">
                            <Lock className="h-5 w-5" />
                            <CardTitle>Segurança</CardTitle>
                        </div>
                        <CardDescription>
                            Configurações de segurança e autenticação
                        </CardDescription>
                    </CardHeader>
                    <CardContent className="space-y-4">
                        <div className="flex items-center justify-between">
                            <div className="space-y-0.5">
                                <Label>Autenticação de Dois Fatores</Label>
                                <p className="text-sm text-muted-foreground">
                                    Adicione uma camada extra de segurança
                                </p>
                            </div>
                            <Switch
                                checked={settings.twoFactorAuth}
                                onCheckedChange={(checked) =>
                                    setSettings({ ...settings, twoFactorAuth: checked })
                                }
                            />
                        </div>
                        <Separator />
                        <div className="flex items-center justify-between">
                            <div className="space-y-0.5">
                                <Label>Sessões Simultâneas</Label>
                                <p className="text-sm text-muted-foreground">
                                    Permitir login em múltiplos dispositivos
                                </p>
                            </div>
                            <Switch
                                checked={settings.simultaneousSessions}
                                onCheckedChange={(checked) =>
                                    setSettings({ ...settings, simultaneousSessions: checked })
                                }
                            />
                        </div>
                        <Separator />
                        <div className="grid gap-2">
                            <Label htmlFor="session-timeout">Tempo de Sessão (minutos)</Label>
                            <Input
                                id="session-timeout"
                                type="number"
                                value={settings.sessionTimeout}
                                onChange={(e) =>
                                    setSettings({ ...settings, sessionTimeout: parseInt(e.target.value) || 60 })
                                }
                            />
                        </div>
                    </CardContent>
                </Card>

                <Card>
                    <CardHeader>
                        <div className="flex items-center gap-2">
                            <Palette className="h-5 w-5" />
                            <CardTitle>Aparência</CardTitle>
                        </div>
                        <CardDescription>
                            Personalize a aparência do sistema
                        </CardDescription>
                    </CardHeader>
                    <CardContent className="space-y-4">
                        <div className="flex items-center justify-between">
                            <div className="space-y-0.5">
                                <Label>Modo Escuro</Label>
                                <p className="text-sm text-muted-foreground">
                                    Ative o tema escuro do sistema
                                </p>
                            </div>
                            <Switch
                                checked={settings.darkMode}
                                onCheckedChange={(checked) =>
                                    setSettings({ ...settings, darkMode: checked })
                                }
                            />
                        </div>
                        <Separator />
                        <div className="grid gap-2">
                            <Label htmlFor="language">Idioma</Label>
                            <Input
                                id="language"
                                value={settings.language}
                                onChange={(e) => setSettings({ ...settings, language: e.target.value })}
                            />
                        </div>
                    </CardContent>
                </Card>

                <Card>
                    <CardHeader>
                        <div className="flex items-center gap-2">
                            <Globe className="h-5 w-5" />
                            <CardTitle>Regional</CardTitle>
                        </div>
                        <CardDescription>
                            Configurações de localização e formato
                        </CardDescription>
                    </CardHeader>
                    <CardContent className="space-y-4">
                        <div className="grid gap-2">
                            <Label htmlFor="timezone">Fuso Horário</Label>
                            <Input
                                id="timezone"
                                value={settings.timezone}
                                onChange={(e) => setSettings({ ...settings, timezone: e.target.value })}
                            />
                        </div>
                        <div className="grid gap-2">
                            <Label htmlFor="date-format">Formato de Data</Label>
                            <Input
                                id="date-format"
                                value={settings.dateFormat}
                                onChange={(e) => setSettings({ ...settings, dateFormat: e.target.value })}
                            />
                        </div>
                        <div className="grid gap-2">
                            <Label htmlFor="currency">Moeda</Label>
                            <Input
                                id="currency"
                                value={settings.currency}
                                onChange={(e) => setSettings({ ...settings, currency: e.target.value })}
                            />
                        </div>
                    </CardContent>
                </Card>

                {/* Save Button */}
                <div className="flex justify-end gap-2">
                    <Button variant="outline" onClick={() => setSettings(settingsData || defaultSettings)}>
                        Cancelar
                    </Button>
                    <Button onClick={handleSave} disabled={isSaving}>
                        {isSaving && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
                        Salvar Configurações
                    </Button>
                </div>
            </div>
        </div>
    )
}
