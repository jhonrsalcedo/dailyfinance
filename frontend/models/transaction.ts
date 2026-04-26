export interface Category {
  id: number
  name: string
  icon?: string
  color?: string
}

export interface PaymentMethod {
  id: number
  name: string
  type?: string
}

export interface TransactionFormData {
  amount: number
  category_id: number
  method_id: number
  description?: string
  date: string
}

export interface Transaction {
  id: number
  amount: number
  date: string
  description: string | null
  category_id: number | null
  method_id: number | null
  category?: Category
  method?: PaymentMethod
}

export interface TransactionListResponse {
  transactions: Transaction[]
  total: number
}