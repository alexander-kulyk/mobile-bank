import { format, startOfDay, isToday, isYesterday, parseISO } from 'date-fns'
import { uk } from 'date-fns/locale'
import type {
  Transaction,
  Filters,
  GroupedTransactions,
  SortOrder,
} from '../types'

// Currency formatter for Ukrainian Hryvnia
export const formatCurrency = (amount: number): string => {
  return new Intl.NumberFormat('uk-UA', {
    style: 'currency',
    currency: 'UAH',
  }).format(amount)
}

// Date formatter for display
export const formatDateForDisplay = (dateString: string): string => {
  try {
    const date = parseISO(dateString)

    if (isToday(date)) {
      return 'Сьогодні'
    }

    if (isYesterday(date)) {
      return 'Учора'
    }

    return format(date, 'd MMM yyyy', { locale: uk })
  } catch {
    return dateString
  }
}

// Time formatter for display
export const formatTimeForDisplay = (dateString: string): string => {
  try {
    const date = parseISO(dateString)
    return format(date, 'HH:mm')
  } catch {
    return '00:00'
  }
}

// Filter transactions based on criteria
export const filterTransactions = (
  transactions: Transaction[],
  filters: Filters
): Transaction[] => {
  return transactions.filter((transaction) => {
    // Text search
    if (filters.searchText) {
      const searchLower = filters.searchText.toLowerCase()
      const matchesStore = transaction.store.toLowerCase().includes(searchLower)
      const matchesPurchase = transaction.purchase
        .toLowerCase()
        .includes(searchLower)

      if (!matchesStore && !matchesPurchase) {
        return false
      }
    }

    // Date range filter
    if (filters.dateFrom || filters.dateTo) {
      const transactionDate = startOfDay(parseISO(transaction.date))

      if (filters.dateFrom) {
        const fromDate = startOfDay(parseISO(filters.dateFrom))
        if (transactionDate < fromDate) {
          return false
        }
      }

      if (filters.dateTo) {
        const toDate = startOfDay(parseISO(filters.dateTo))
        if (transactionDate > toDate) {
          return false
        }
      }
    }

    // Amount range filter
    if (
      filters.minAmount !== undefined &&
      Math.abs(transaction.cost) < filters.minAmount
    ) {
      return false
    }

    if (
      filters.maxAmount !== undefined &&
      Math.abs(transaction.cost) > filters.maxAmount
    ) {
      return false
    }

    return true
  })
}

// Sort transactions
export const sortTransactions = (
  transactions: Transaction[],
  order: SortOrder
): Transaction[] => {
  return [...transactions].sort((a, b) => {
    const dateA = new Date(a.date).getTime()
    const dateB = new Date(b.date).getTime()

    return order === 'newest' ? dateB - dateA : dateA - dateB
  })
}

// Group transactions by date
export const groupTransactionsByDate = (
  transactions: Transaction[]
): GroupedTransactions[] => {
  const groups: Record<string, Transaction[]> = {}

  transactions.forEach((transaction) => {
    const dateKey = format(parseISO(transaction.date), 'yyyy-MM-dd')

    if (!groups[dateKey]) {
      groups[dateKey] = []
    }

    groups[dateKey].push(transaction)
  })

  return Object.entries(groups)
    .map(([date, transactions]) => ({
      date,
      displayDate: formatDateForDisplay(transactions[0].date),
      transactions: sortTransactions(transactions, 'newest'),
    }))
    .sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime())
}

// Calculate total balance and spending
export const calculateSummary = (transactions: Transaction[]) => {
  const spending = transactions
    .filter((t) => t.cost < 0)
    .reduce((sum, t) => sum + Math.abs(t.cost), 0)

  const income = transactions
    .filter((t) => t.cost > 0)
    .reduce((sum, t) => sum + t.cost, 0)

  const balance = income - spending

  return {
    balance,
    spending,
    income,
    totalTransactions: transactions.length,
  }
}

// Export transactions to CSV
export const exportToCSV = (transactions: Transaction[]): string => {
  const headers = ['Date', 'Time', 'Store', 'Purchase', 'Cost']
  const csvContent = [
    headers.join(','),
    ...transactions.map((transaction) =>
      [
        format(parseISO(transaction.date), 'yyyy-MM-dd'),
        formatTimeForDisplay(transaction.date),
        `"${transaction.store}"`,
        `"${transaction.purchase}"`,
        transaction.cost.toString(),
      ].join(',')
    ),
  ].join('\n')

  return csvContent
}

// Download CSV file
export const downloadCSV = (
  csvContent: string,
  filename: string = 'transactions.csv'
) => {
  const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' })
  const link = document.createElement('a')

  if (link.download !== undefined) {
    const url = URL.createObjectURL(blob)
    link.setAttribute('href', url)
    link.setAttribute('download', filename)
    link.style.visibility = 'hidden'
    document.body.appendChild(link)
    link.click()
    document.body.removeChild(link)
  }
}
