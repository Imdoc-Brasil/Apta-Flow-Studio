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
