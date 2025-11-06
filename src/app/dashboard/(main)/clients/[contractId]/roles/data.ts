
export interface Role {
  id: string
  name: string
  description: string
  sectorId: string
  cbo: string
}

export const initialRolesData: Role[] = [
  {
    id: 'ROLE-01',
    name: 'Analista Financeiro',
    description: 'Responsável pela análise e gestão financeira.',
    sectorId: 'SEC-01', // Administrativo
    cbo: '2525-05',
  },
  {
    id: 'ROLE-02',
    name: 'Operador de Máquinas',
    description: 'Opera máquinas na linha de produção.',
    sectorId: 'SEC-02', // Produção
    cbo: '7825-10',
  },
  {
    id: 'ROLE-03',
    name: 'Almoxarife',
    description: 'Controla o estoque e a expedição de materiais.',
    sectorId: 'SEC-03', // Logística
    cbo: '4141-05',
  },
  {
    id: 'ROLE-04',
    name: 'Vendedor Externo',
    description: 'Realiza vendas e prospecção de clientes.',
    sectorId: 'SEC-04', // Vendas
    cbo: '3541-25',
  },
  {
    id: 'ROLE-05',
    name: 'Gerente de Contas',
    description: 'Gerencia a carteira de clientes da filial.',
    sectorId: 'SEC-04', // Vendas
    cbo: '1423-15',
  },
]
