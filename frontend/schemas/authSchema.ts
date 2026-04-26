import { z } from 'zod'

const emailRegex = /^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/

export const loginSchema = z.object({
  email: z
    .string()
    .min(1, 'Email requerido')
    .refine((val) => emailRegex.test(val), {
      message: 'Email inválido. Ejemplo: usuario@ejemplo.com',
    }),
  password: z.string().min(1, 'Password requerido'),
})

export const registerSchema = z.object({
  email: z
    .string()
    .min(1, 'Email requerido')
    .refine((val) => emailRegex.test(val), {
      message: 'Email inválido. Ejemplo: usuario@ejemplo.com',
    }),
  password: z
    .string()
    .min(8, 'Mínimo 8 caracteres')
    .max(72, 'Máximo 72 caracteres')
    .regex(/[A-Z]/, 'Al menos una mayúscula')
    .regex(/[a-z]/, 'Al menos una minúscula')
    .regex(/[0-9]/, 'Al menos un número'),
  username: z.string().min(1, 'Nombre requerido').max(100).optional(),
})

export type LoginFormData = z.infer<typeof loginSchema>
export type RegisterFormData = z.infer<typeof registerSchema>

export const PASSWORD_REQUIREMENTS = [
  { id: 'length', label: 'Al menos 8 caracteres', test: (p: string) => p.length >= 8 },
  { id: 'maxLength', label: 'Máximo 72 caracteres', test: (p: string) => p.length <= 72 },
  { id: 'uppercase', label: 'Al menos una mayúscula', test: (p: string) => /[A-Z]/.test(p) },
  { id: 'lowercase', label: 'Al menos una minúscula', test: (p: string) => /[a-z]/.test(p) },
  { id: 'number', label: 'Al menos un número', test: (p: string) => /[0-9]/.test(p) },
] as const

export type PasswordRequirement = typeof PASSWORD_REQUIREMENTS[number]