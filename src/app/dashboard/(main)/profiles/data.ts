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
  { id: 'staffs', name: 'Equipe (Staffs)' },
  { id: 'tickets', name: 'Tickets (Geral)' },
  {
    id: 'services',
    name: 'Serviços',
    subModules: [
      { id: 'services.catalog', name: 'Programas e Laudos' },
      { id: 'services.advisory', name: 'Assessoria Técnica' },
      { id: 'services.rentals', name: 'Aluguéis' },
      { id: 'services.outsourcing', name: 'Terceirização SESMT' },
    ],
  },
  {
    id: 'risks',
    name: 'Riscos (Catálogos Globais)',
    subModules: [
        { id: 'risks.hazards', name: 'Catálogo de Perigos' },
        { id: 'risks.epc', name: 'Catálogo de EPC' },
        { id: 'risks.epi', name: 'Catálogo de EPI' },
    ]
  },
  {
    id: 'health',
    name: 'Saúde',
    subModules: [
      { id: 'health.queue', name: 'Fila de Atendimento' },
      { id: 'health.exams', name: 'Catálogo de Exames' },
      { id: 'health.clinical-exams', name: 'Config. Exames Clínicos' },
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
