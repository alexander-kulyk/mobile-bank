import { describe, it, expect, beforeEach } from 'vitest'
import {
  saveTransactionsToStorage,
  loadTransactionsFromStorage,
  clearTransactionsFromStorage,
} from '../utils/localStorage'
import type { Transaction } from '../types'

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
]

// Mock localStorage for testing
const localStorageMock = (() => {
  let store: Record<string, string> = {}

  return {
    getItem: (key: string) => store[key] || null,
    setItem: (key: string, value: string) => {
      store[key] = value.toString()
    },
    removeItem: (key: string) => {
      delete store[key]
    },
    clear: () => {
      store = {}
    },
  }
})()

Object.defineProperty(window, 'localStorage', {
  value: localStorageMock,
})

describe('localStorage utils', () => {
  beforeEach(() => {
    localStorageMock.clear()
  })

  describe('saveTransactionsToStorage', () => {
    it('should save transactions to localStorage', () => {
      saveTransactionsToStorage(mockTransactions)

      const stored = localStorage.getItem('database-parser-transactions')
      expect(stored).toBeTruthy()

      const parsed = JSON.parse(stored!)
      expect(parsed).toHaveLength(2)
      expect(parsed[0].store).toBe('АТБ')
    })
  })

  describe('loadTransactionsFromStorage', () => {
    it('should load transactions from localStorage', () => {
      localStorage.setItem(
        'database-parser-transactions',
        JSON.stringify(mockTransactions)
      )

      const result = loadTransactionsFromStorage()

      expect(result).toHaveLength(2)
      expect(result[0].store).toBe('АТБ')
      expect(result[1].store).toBe('Сільпо')
    })

    it('should return empty array when no data exists', () => {
      const result = loadTransactionsFromStorage()

      expect(result).toEqual([])
    })

    it('should return empty array when data is corrupted', () => {
      localStorage.setItem('database-parser-transactions', 'invalid-json')

      const result = loadTransactionsFromStorage()

      expect(result).toEqual([])
    })
  })

  describe('clearTransactionsFromStorage', () => {
    it('should clear transactions from localStorage', () => {
      localStorage.setItem(
        'database-parser-transactions',
        JSON.stringify(mockTransactions)
      )

      clearTransactionsFromStorage()

      const result = localStorage.getItem('database-parser-transactions')
      expect(result).toBeNull()
    })
  })
})
