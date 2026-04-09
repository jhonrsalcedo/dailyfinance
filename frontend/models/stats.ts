export interface Stat {
  category: string
  total: number
}

export interface StatsResponse {
  total_expenses: number
  expenses_by_category: Stat[]
}
