/**
 * Estrutura de Permissões e Perfis
 */

export type Action = 'view' | 'create' | 'edit' | 'delete'

export type Module =
    | 'clients'
    | 'clients.info'
    | 'clients.tickets'
    | 'clients.structure'
    | 'clients.sst'
    | 'staffs'
    | 'tickets'
    | 'services'
    | 'risks'
    | 'health'
    | 'health.queue'
    | 'health.exams'
    | 'health.reports'
    | 'performance'
    | 'processes'
    | 'analytics'

export type Permission = `${Action}:${Module}`

export interface SubModule {
    id: Module
    name: string
}

export interface PermissionModule {
    id: Module
    name: string
    subModules?: SubModule[]
}

export const permissionModules: PermissionModule[] = [
    {
        id: 'clients',
        name: 'Clientes',
        subModules: [
            { id: 'clients.info', name: 'Informações Gerais' },
            { id: 'clients.tickets', name: 'Chamados do Cliente' },
            { id: 'clients.structure', name: 'Estrutura da Empresa' },
            { id: 'clients.sst', name: 'Gestão de SST' },
        ],
    },
    { id: 'staffs', name: 'Staffs' },
    { id: 'tickets', name: 'Tickets (Geral)' },
    { id: 'services', name: 'Serviços' },
    { id: 'risks', name: 'Riscos' },
    {
        id: 'health',
        name: 'Saúde',
        subModules: [
            { id: 'health.queue', name: 'Fila de Atendimento' },
            { id: 'health.exams', name: 'Catálogo de Exames' },
            { id: 'health.reports', name: 'Portal de Laudos' },
        ],
    },
    { id: 'performance', name: 'Desempenho' },
    { id: 'processes', name: 'Processos' },
    { id: 'analytics', name: 'Analytics' },
]

export const permissionActions: { id: Action; name: string }[] = [
    { id: 'view', name: 'Ver' },
    { id: 'create', name: 'Criar' },
    { id: 'edit', name: 'Editar' },
    { id: 'delete', name: 'Excluir' },
]
