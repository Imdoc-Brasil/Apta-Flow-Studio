
export type ExamCategory =
  | 'Exame Clínico/Físico'
  | 'Exame Laboratorial'
  | 'Exame de Imagem'
  | 'Exame Gráfico'
  | 'Outros'

export interface Exam {
  code: string
  name: string
  category: ExamCategory
}
