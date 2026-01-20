
export interface PhysicalCharacteristics {
  flooring: string;
  lighting: string;
  climateControl: string;
  wallCoverings: string;
  exhaustSystem: string;
}

export interface Environment {
  id: string;
  name: string;
  sectorId: string;
  description: string;
  activities: string;
  equipment: string;
  physicalCharacteristics: PhysicalCharacteristics;
  status?: 'Ativo' | 'Arquivado';
}

export const initialEnvironmentsData: Environment[] = [
  {
    id: 'ENV-01',
    name: 'Sala da Diretoria',
    sectorId: 'SEC-01', // Administrativo
    description: 'Sala de reuniões da alta gestão e decisões estratégicas.',
    activities: 'Reuniões, planejamento estratégico, apresentações.',
    equipment: 'Mesa de reunião, cadeiras ergonômicas, projetor, sistema de videoconferência.',
    physicalCharacteristics: {
      flooring: 'Carpete',
      lighting: 'LED embutida com dimerização',
      climateControl: 'Ar condicionado central',
      wallCoverings: 'Pintura acrílica e painéis de madeira',
      exhaustSystem: 'Não aplicável',
    },
  },
  {
    id: 'ENV-02',
    name: 'Esteira de Montagem 1',
    sectorId: 'SEC-02', // Produção
    description: 'Linha de montagem principal para o produto X.',
    activities: 'Montagem de componentes, inspeção visual, embalagem primária.',
    equipment: 'Esteira rolante, parafusadeiras pneumáticas, bancadas de trabalho.',
    physicalCharacteristics: {
      flooring: 'Piso epóxi de alta resistência',
      lighting: 'Luminárias fluorescentes de alta intensidade',
      climateControl: 'Ventiladores industriais',
      wallCoverings: 'Pintura epóxi lavável',
      exhaustSystem: 'Exaustores eólicos no telhado',
    },
  },
  {
    id: 'ENV-03',
    name: 'Recepção',
    sectorId: 'SEC-01', // Administrativo
    description: 'Área de primeiro contato com visitantes e clientes.',
    activities: 'Atendimento ao público, registro de visitantes, recebimento de correspondência.',
    equipment: 'Balcão de atendimento, computador, telefone, catracas de acesso.',
    physicalCharacteristics: {
      flooring: 'Porcelanato polido',
      lighting: 'Spots de LED e iluminação decorativa',
      climateControl: 'Ar condicionado Split',
      wallCoverings: 'Pintura e painel de vidro',
      exhaustSystem: 'Não aplicável',
    },
  },
];
