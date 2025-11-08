
export interface GHE {
  id: string;
  name: string;
  description: string;
  unitId: string;
  roleIds: string[];
}

export const initialGheData: GHE[] = [
  {
    id: 'GHE-01',
    name: 'GHE Produção - Ruído',
    description: 'Colaboradores da produção expostos a ruído contínuo.',
    unitId: 'UNIT-001',
    roleIds: ['ROLE-02'], // Operador de Máquinas
  },
  {
    id: 'GHE-02',
    name: 'GHE Logística - Poeira',
    description: 'Colaboradores da logística expostos a poeiras.',
    unitId: 'UNIT-001',
    roleIds: ['ROLE-03'], // Almoxarife
  },
  {
    id: 'GHE-03',
    name: 'GHE Vendas - Ergonômico',
    description: 'Colaboradores do setor de vendas com risco ergonômico.',
    unitId: 'UNIT-002',
    roleIds: ['ROLE-04', 'ROLE-05'], // Vendedor e Gerente
  },
];
