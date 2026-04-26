export interface UserSettings {
  id: number
  username: string | null
  email: string | null
  salary: number | null
  currency: string | null
  notifications_enabled: boolean | null
  created_at: string | null
  updated_at: string | null
}

export interface SettingsUpdate {
  salary: number | null
}

export interface ProfileUpdate {
  username?: string
  email?: string
  currency?: string
  notifications_enabled?: boolean
  salary?: number
}

export const CURRENCIES = [
  { code: 'COP', name: 'Peso Colombiano', symbol: '$' },
  { code: 'USD', name: 'Dólar Americano', symbol: '$' },
  { code: 'EUR', name: 'Euro', symbol: '€' },
  { code: 'GBP', name: 'Libra Esterlina', symbol: '£' },
  { code: 'MXN', name: 'Peso Mexicano', symbol: '$' },
]