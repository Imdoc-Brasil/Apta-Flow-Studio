
export interface Sector {
  id: string
  name: string
  description: string
  unitId: string
}

export const initialSectorsData: Sector[] = [
  {
    id: 'SEC-01',
    name: 'Administrativo',
    description: 'Atividades de escritório e gestão.',
    unitId: 'UNIT-001',
  },
  {
    id: 'SEC-02',
    name: 'Produção',
    description: 'Linha de montagem e fabricação.',
    unitId: 'UNIT-001',
  },
  {
    id: 'SEC-03',
    name: 'Logística',
    description: 'Armazenamento e expedição.',
    unitId: 'UNIT-001',
  },
  {
    id: 'SEC-04',
    name: 'Vendas',
    description: 'Equipe de vendas e atendimento ao cliente.',
    unitId: 'UNIT-002',
  },
]
