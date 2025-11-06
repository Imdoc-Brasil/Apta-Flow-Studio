export const initialEpiData = [
  {
    id: 'EPI-01',
    name: 'Protetor auricular tipo concha',
    ca: '12345',
    shelfLife: 365,
    active: true,
    fabricante: '3M',
    vencimentoCA: '2025-12-31',
  },
  {
    id: 'EPI-02',
    name: 'Luva de segurança para proteção contra agentes mecânicos',
    ca: '67890',
    shelfLife: 180,
    active: true,
    fabricante: 'Ansell',
    vencimentoCA: '2024-10-15',
  },
  {
    id: 'EPI-03',
    name: 'Respirador purificador de ar',
    ca: '11223',
    shelfLife: 90,
    active: true,
    fabricante: 'Honeywell',
    vencimentoCA: '2025-01-20',
  },
]

export const initialEpiStock = [
  { epiId: 'EPI-01', quantity: 50, minStock: 10 },
  { epiId: 'EPI-02', quantity: 120, minStock: 20 },
  { epiId: 'EPI-03', quantity: 5, minStock: 15 },
]

export const initialEpiDeliveries = [
  {
    id: 'DEL-001',
    epiId: 'EPI-01',
    epiName: 'Protetor auricular tipo concha',
    employeeId: 'EMP-001',
    employeeName: 'João da Silva',
    deliveryDate: '2024-07-01',
    quantity: 1,
  },
  {
    id: 'DEL-002',
    epiId: 'EPI-02',
    epiName: 'Luva de segurança para proteção contra agentes mecânicos',
    employeeId: 'EMP-002',
    employeeName: 'Maria Oliveira',
    deliveryDate: '2024-06-15',
    quantity: 2,
  },
]

export const initialCaRiskMapping = [
  { ca: '12345', epiName: 'Protetor auricular tipo concha', risk: 'Ruído' },
  {
    ca: '67890',
    epiName: 'Luva de segurança para proteção contra agentes mecânicos',
    risk: 'Agentes Abrasivos e Escoriantes',
  },
  {
    ca: '11223',
    epiName: 'Respirador purificador de ar',
    risk: 'Poeiras e Névoas',
  },
]

export type Epi = (typeof initialEpiData)[0]
export type EpiStock = (typeof initialEpiStock)[0]
export type EpiDelivery = (typeof initialEpiDeliveries)[0]
export type CaRiskMapping = (typeof initialCaRiskMapping)[0]
