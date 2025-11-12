
export type EmployeeStatus = 'Ativo' | 'Férias' | 'Desligado' | 'Candidato'

export interface Employee {
  id: string
  name: string
  roleId: string
  email: string
  phone: string
  status: EmployeeStatus
  admissionDate: string
  avatar: string
}
