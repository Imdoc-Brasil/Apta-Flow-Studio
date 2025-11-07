
export interface Sector {
  id: string
  code?: string
  name: string
  description: string
  unitId: string
}

export const initialSectorsData: Sector[] = [
  {
    id: 'SEC-01',
    code: 'ADM',
    name: 'Administrativo',
    description: 'Atividades de escritório e gestão.',
    unitId: 'UNIT-001',
  },
  {
    id: 'SEC-02',
    code: 'PROD',
    name: 'Produção',
    description: 'Linha de montagem e fabricação.',
    unitId: 'UNIT-001',
  },
  {
    id: 'SEC-03',
    code: 'LOG',
    name: 'Logística',
    description: 'Armazenamento e expedição.',
    unitId: 'UNIT-001',
  },
  {
    id: 'SEC-04',
    code: 'VEND',
    name: 'Vendas',
    description: 'Equipe de vendas e atendimento ao cliente.',
    unitId: 'UNIT-002',
  },
]
