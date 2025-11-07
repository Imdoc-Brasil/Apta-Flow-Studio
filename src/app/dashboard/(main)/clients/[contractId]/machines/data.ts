export interface Machine {
  id: string
  name: string
  manufacturer: string
  model: string
  function: string
  isRiskSource: boolean
  riskDescription?: string
  maintenanceInfo: string
}

export const initialMachinesData: Machine[] = [
  {
    id: 'MAC-001',
    name: 'Parafusadeira de Impacto',
    manufacturer: 'PowerTools Inc.',
    model: 'Impact-X 2000',
    function: 'Apertar e soltar parafusos e porcas com alto torque.',
    isRiskSource: true,
    riskDescription: 'Ruído contínuo, Vibração de mãos e braços (VMB).',
    maintenanceInfo:
      'Limpeza diária. Lubrificação dos componentes internos a cada 6 meses. Substituição das escovas de carvão a cada 500 horas de uso.',
  },
  {
    id: 'MAC-002',
    name: 'Prensa Hidráulica',
    manufacturer: 'MetalPress',
    model: 'P-50T',
    function: 'Prensagem e moldagem de peças metálicas.',
    isRiskSource: true,
    riskDescription: 'Risco de esmagamento, Ruído, Projeção de partículas.',
    maintenanceInfo:
      'Verificação semanal do nível do óleo hidráulico. Inspeção de mangueiras e conexões mensalmente. Troca do filtro a cada 1000 horas.',
  },
  {
    id: 'MAC-003',
    name: 'Computador de Escritório',
    manufacturer: 'Office Systems',
    model: 'DeskPro 5',
    function: 'Trabalho administrativo, acesso a sistemas e internet.',
    isRiskSource: false,
    maintenanceInfo: 'Limpeza externa semanal. Verificação de software e atualizações mensais.',
  },
]
