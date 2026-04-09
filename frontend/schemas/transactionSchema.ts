import { z } from 'zod'

export const transactionSchema = z.object({
  amount: z
    .number({ required_error: 'El monto es requerido' })
    .positive('El monto debe ser mayor a 0'),
  category_id: z
    .number({ required_error: 'Selecciona una categoría' })
    .min(1, 'Selecciona una categoría'),
  method_id: z
    .number({ required_error: 'Selecciona un método de pago' })
    .min(1, 'Selecciona un método de pago'),
  description: z
    .string()
    .max(200, 'Máximo 200 caracteres')
    .optional(),
  date: z
    .string()
    .regex(/^\d{4}-\d{2}-\d{2}$/, 'Formato de fecha inválido'),
})