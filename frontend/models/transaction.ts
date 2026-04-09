export interface Category {
  id: number
  name: string
}

export interface PaymentMethod {
  id: number
  name: string
}

export interface TransactionFormData {
  amount: number
  category_id: number
  method_id: number
  description?: string
  date: string
}
