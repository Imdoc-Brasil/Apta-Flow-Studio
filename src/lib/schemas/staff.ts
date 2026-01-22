import { z } from 'zod'

// Base schema for staff data
const staffObjectSchema = z.object({
  name: z
    .string()
    .min(2, { message: 'O nome deve ter pelo menos 2 caracteres.' }),
  email: z.string().email({ message: 'Por favor, insira um email válido.' }),
  password: z
    .string()
    .min(6, { message: 'A senha deve ter no mínimo 6 caracteres.' }),
  confirmPassword: z.string(),
  perfilId: z.string({ required_error: 'Por favor, selecione um perfil.' }),
  assinatura: z.string().min(2, { message: 'A assinatura é obrigatória.' }),
  phone: z.string().optional(),
  contractId: z.string().optional(),
  clientIds: z.array(z.string()).optional(),
  allClients: z.boolean().optional(),
  avatar: z.string().optional(),
})

// Schema for adding a new staff member, includes password confirmation
export const addStaffFormSchema = staffObjectSchema.refine(
  (data) => data.password === data.confirmPassword,
  {
    message: 'As senhas não coincidem.',
    path: ['confirmPassword'],
  }
)

// Schema for editing, omits password fields from the base object
export const editStaffFormSchema = staffObjectSchema.omit({
  password: true,
  confirmPassword: true,
})

export type AddStaffFormValues = z.infer<typeof addStaffFormSchema>
export type EditStaffFormValues = z.infer<typeof editStaffFormSchema>
