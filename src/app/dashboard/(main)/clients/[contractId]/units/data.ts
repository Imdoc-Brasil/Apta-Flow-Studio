export type UnitType = 'Unidade' | 'Obra' | 'Contrato'

export interface PropertyInfo {
  address: string
  zipCode: string
  neighborhood: string
  city: string
  state: string
  country: string
  totalArea: string
  builtArea: string
}

export interface ContractingCompany {
  name: string
  cnpj: string
  cnae: string
  riskLevel: string
}

export interface Unit {
  id?: string
  name: string
  type: UnitType
  description: string
  cnpj: string
  propertyInfo: PropertyInfo
  status: 'Ativa' | 'Inativa'
  cnae: string
  riskLevel: string
  legalResponsible: string
  pgrResponsible: string
  ltcatResponsible: string
  pcmsoResponsible: string
  cno?: string
  contractingCompany?: ContractingCompany
}
