export const initialEpiData = [
  {
    id: 'EPI-01',
    name: 'Protetor auricular tipo concha',
    ca: '12345',
    active: true,
  },
  {
    id: 'EPI-02',
    name: 'Luva de segurança para proteção contra agentes mecânicos',
    ca: '67890',
    active: true,
  },
  {
    id: 'EPI-03',
    name: 'Respirador purificador de ar',
    ca: '11223',
    active: true,
  },
]

export type Epi = (typeof initialEpiData)[0]
