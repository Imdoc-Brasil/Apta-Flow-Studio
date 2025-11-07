
export const initialEpiData = [
  {
    id: 'EPI-01',
    name: 'Protetor auricular tipo concha',
    ca: '12345',
    shelfLife: 365,
    active: true,
    fabricante: '3M',
    vencimentoCA: '2025-12-31',
    specifications:
      'Protetor auditivo circum-auricular, composto por duas conchas de plástico ABS, com espuma interna. Haste em aço mola inoxidável.',
    hygiene:
      'Limpar as conchas com pano úmido e sabão neutro. As espumas devem ser trocadas a cada 6 meses.',
    replacement:
      'Substituir o equipamento a cada 12 meses de uso contínuo ou quando apresentar danos visíveis.',
    usage:
      'Ajustar a haste sobre a cabeça, garantindo que as conchas cubram completamente as orelhas e estejam bem vedadas.',
  },
  {
    id: 'EPI-02',
    name: 'Luva de segurança para proteção contra agentes mecânicos',
    ca: '67890',
    shelfLife: 180,
    active: true,
    fabricante: 'Ansell',
    vencimentoCA: '2024-10-15',
    specifications:
      'Luva tricotada em fios de polietileno de alta densidade (HPPE), revestimento em poliuretano (PU) na palma e dedos.',
    hygiene: 'Lavar com água e sabão neutro. Secar à sombra.',
    replacement:
      'Substituir quando apresentar furos, rasgos ou desgaste excessivo do revestimento.',
    usage:
      'Utilizar em atividades com risco de corte ou abrasão. Verificar a integridade antes de cada uso.',
  },
  {
    id: 'EPI-03',
    name: 'Respirador purificador de ar',
    ca: '11223',
    shelfLife: 90,
    active: true,
    fabricante: 'Honeywell',
    vencimentoCA: '2025-01-20',
    specifications: 'Peça semifacial em elastômero, com dois filtros para partículas P2.',
    hygiene: 'Limpar a peça facial com lenço umedecido após o uso. Não lavar os filtros.',
    replacement: 'Substituir os filtros quando a respiração se tornar difícil ou a cada 30 dias.',
    usage: 'Ajustar as tiras de fixação para garantir vedação total no rosto. Realizar teste de pressão negativa.',
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
