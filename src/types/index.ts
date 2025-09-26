export interface Transaction {
  id: string
  date: string // ISO datetime string
  time: string
  store: string
  purchase: string
  cost: number // negative for spending, positive for income
}

export interface ParseResult {
  transactions: Transaction[]
  errors: string[]
  warnings: string[]
}

export interface ValidationSummary {
  totalRows: number
  validRows: number
  errors: string[]
  warnings: string[]
}

export interface Filters {
  searchText: string
  dateFrom?: string
  dateTo?: string
  minAmount?: number
  maxAmount?: number
}

export interface GroupedTransactions {
  date: string
  displayDate: string
  transactions: Transaction[]
}

export type SortOrder = 'newest' | 'oldest'
