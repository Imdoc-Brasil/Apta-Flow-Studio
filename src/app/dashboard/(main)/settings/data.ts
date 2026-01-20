export interface SystemSettings {
    id?: string
    // Notifications
    emailNotifications: boolean
    ticketNotifications: boolean
    dailySummary: boolean

    // Email
    smtpHost: string
    smtpPort: number
    fromEmail: string

    // Security
    twoFactorAuth: boolean
    simultaneousSessions: boolean
    sessionTimeout: number

    // Appearance
    darkMode: boolean
    language: string

    // Regional
    timezone: string
    dateFormat: string
    currency: string

    // Metadata
    updatedAt?: string
    updatedBy?: string
}

export const defaultSettings: Omit<SystemSettings, 'id' | 'updatedAt' | 'updatedBy'> = {
    // Notifications
    emailNotifications: false,
    ticketNotifications: true,
    dailySummary: false,

    // Email
    smtpHost: '',
    smtpPort: 587,
    fromEmail: '',

    // Security
    twoFactorAuth: false,
    simultaneousSessions: true,
    sessionTimeout: 60,

    // Appearance
    darkMode: false,
    language: 'pt-BR',

    // Regional
    timezone: 'America/Sao_Paulo',
    dateFormat: 'DD/MM/YYYY',
    currency: 'BRL',
}
