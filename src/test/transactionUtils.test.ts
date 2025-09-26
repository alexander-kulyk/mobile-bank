import { describe, it, expect } from 'vitest'
import {
  filterTransactions,
  sortTransactions,
  groupTransactionsByDate,
  calculateSummary,
  formatCurrency,
  exportToCSV,
} from '../utils/transactionUtils'
import type { Transaction, Filters } from '../types'

const mockTransactions: Transaction[] = [
  {
    id: '1',
    date: '2023-12-01T10:30:00.000Z',
    time: '10:30',
    store: 'АТБ',
    purchase: 'Продукти',
    cost: -150.5,
  },
  {
    id: '2',
    date: '2023-12-01T15:00:00.000Z',
    time: '15:00',
    store: 'Сільпо',
    purchase: 'Хліб',
    cost: -25.0,
  },
  {
    id: '3',
    date: '2023-12-02T09:00:00.000Z',
    time: '09:00',
    store: 'Банкомат',
    purchase: 'Зняття готівки',
    cost: -200.0,
  },
  {
    id: '4',
    date: '2023-12-02T16:30:00.000Z',
    time: '16:30',
    store: 'Зарплата',
    purchase: 'Зарплата грудень',
    cost: 15000.0,
  },
]

describe('Transaction Utils', () => {
  describe('filterTransactions', () => {
    it('should filter by search text in store name', () => {
      const filters: Filters = { searchText: 'АТБ' }
      const result = filterTransactions(mockTransactions, filters)

      expect(result).toHaveLength(1)
      expect(result[0].store).toBe('АТБ')
    })

    it('should filter by search text in purchase description', () => {
      const filters: Filters = { searchText: 'хліб' }
      const result = filterTransactions(mockTransactions, filters)

      expect(result).toHaveLength(1)
      expect(result[0].purchase).toBe('Хліб')
    })

    it('should filter by date range', () => {
      const filters: Filters = {
        searchText: '',
        dateFrom: '2023-12-01',
        dateTo: '2023-12-01',
      }
      const result = filterTransactions(mockTransactions, filters)

      expect(result).toHaveLength(2)
    })

    it('should filter by minimum amount', () => {
      const filters: Filters = {
        searchText: '',
        minAmount: 100,
      }
      const result = filterTransactions(mockTransactions, filters)

      expect(result).toHaveLength(3) // Two expenses and one income above 100
    })

    it('should filter by maximum amount', () => {
      const filters: Filters = {
        searchText: '',
        maxAmount: 50,
      }
      const result = filterTransactions(mockTransactions, filters)

      expect(result).toHaveLength(1) // Only the 25 UAH bread
    })
  })

  describe('sortTransactions', () => {
    it('should sort transactions by newest first', () => {
      const result = sortTransactions(mockTransactions, 'newest')

      expect(result[0].id).toBe('4') // 2023-12-02 16:30
      expect(result[1].id).toBe('3') // 2023-12-02 09:00
      expect(result[2].id).toBe('2') // 2023-12-01 15:00
      expect(result[3].id).toBe('1') // 2023-12-01 10:30
    })

    it('should sort transactions by oldest first', () => {
      const result = sortTransactions(mockTransactions, 'oldest')

      expect(result[0].id).toBe('1') // 2023-12-01 10:30
      expect(result[1].id).toBe('2') // 2023-12-01 15:00
      expect(result[2].id).toBe('3') // 2023-12-02 09:00
      expect(result[3].id).toBe('4') // 2023-12-02 16:30
    })
  })

  describe('groupTransactionsByDate', () => {
    it('should group transactions by date', () => {
      const result = groupTransactionsByDate(mockTransactions)

      expect(result).toHaveLength(2)
      expect(result[0].date).toBe('2023-12-02')
      expect(result[0].transactions).toHaveLength(2)
      expect(result[1].date).toBe('2023-12-01')
      expect(result[1].transactions).toHaveLength(2)
    })
  })

  describe('calculateSummary', () => {
    it('should calculate summary correctly', () => {
      const result = calculateSummary(mockTransactions)

      expect(result.spending).toBe(15375.5) // 150.50 + 25.00 + 200.00 + 15000.00 (всі як витрати)
      expect(result.income).toBe(0) // Немає доходів, всі транзакції - витрати
      expect(result.balance).toBe(-14375.5) // 1000 - 15375.5 (початковий баланс 1000 грн мінус витрати)
      expect(result.totalTransactions).toBe(4)
    })
  })

  describe('formatCurrency', () => {
    it('should format positive amounts correctly', () => {
      const result = formatCurrency(1500.75)
      expect(result).toContain('1')
      expect(result).toContain('500')
      expect(result).toContain('75')
    })

    it('should format negative amounts correctly', () => {
      const result = formatCurrency(-150.5)
      expect(result).toContain('-')
      expect(result).toContain('150')
      expect(result).toContain('50')
    })
  })

  describe('exportToCSV', () => {
    it('should export transactions to CSV format', () => {
      const result = exportToCSV(mockTransactions.slice(0, 2))
      const lines = result.split('\n')

      expect(lines[0]).toBe('Date,Time,Store,Purchase,Cost')
      expect(lines[1]).toContain('2023-12-01')
      expect(lines[1]).toContain('АТБ')
      expect(lines[1]).toContain('Продукти')
      expect(lines[1]).toContain('-150.5')
    })
  })
})
