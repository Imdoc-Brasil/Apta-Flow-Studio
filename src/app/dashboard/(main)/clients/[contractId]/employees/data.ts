
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

export const initialEmployeesData: Employee[] = [
  {
    id: 'EMP-001',
    name: 'João da Silva',
    roleId: 'ROLE-03', // Almoxarife
    email: 'joao.silva@example.com',
    phone: '(11) 98765-4321',
    status: 'Ativo',
    admissionDate: '2022-01-15',
    avatar: 'https://i.pravatar.cc/150?u=emp001',
  },
  {
    id: 'EMP-002',
    name: 'Maria Oliveira',
    roleId: 'ROLE-02', // Operador de Máquinas
    email: 'maria.oliveira@example.com',
    phone: '(21) 91234-5678',
    status: 'Ativo',
    admissionDate: '2021-08-20',
    avatar: 'https://i.pravatar.cc/150?u=emp002',
  },
  {
    id: 'EMP-003',
    name: 'Carlos Pereira',
    roleId: 'ROLE-01', // Analista Financeiro
    email: 'carlos.pereira@example.com',
    phone: '(31) 99999-8888',
    status: 'Férias',
    admissionDate: '2023-03-10',
    avatar: 'https://i.pravatar.cc/150?u=emp003',
  },
  {
    id: 'EMP-004',
    name: 'Ana Costa',
    roleId: 'ROLE-01', // Analista Financeiro
    email: 'ana.costa@example.com',
    phone: '(51) 98877-6655',
    status: 'Desligado',
    admissionDate: '2022-11-05',
    avatar: 'https://i.pravatar.cc/150?u=emp004',
  },
]
