
export interface GHE {
  id: string;
  name: string;
  description: string;
  unitId: string;
}

export const initialGheData: GHE[] = [
  {
    id: 'GHE-01',
    name: 'GHE Produção - Ruído',
    description: 'Colaboradores da produção expostos a ruído contínuo.',
    unitId: 'UNIT-001',
  },
  {
    id: 'GHE-02',
    name: 'GHE Logística - Poeira',
    description: 'Colaboradores da logística expostos a poeiras.',
    unitId: 'UNIT-001',
  },
  {
    id: 'GHE-03',
    name: 'GHE Vendas - Ergonômico',
    description: 'Colaboradores do setor de vendas com risco ergonômico.',
    unitId: 'UNIT-002',
  },
];
