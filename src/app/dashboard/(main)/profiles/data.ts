/**
 * Estrutura de Permissões e Perfis
 */
import type { PermissionModule, Action } from '@/lib/types/profile'

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
