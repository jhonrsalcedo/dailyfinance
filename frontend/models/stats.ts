export interface Stat {
  category: string
  total: number
  count: number
}

export interface StatsResponse {
  total_expenses: number
  expenses_by_category: Stat[]
}
