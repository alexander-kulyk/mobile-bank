import type { Transaction } from '../types'

const STORAGE_KEY = 'database-parser-transactions'

export const saveTransactionsToStorage = (
  transactions: Transaction[]
): void => {
  try {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(transactions))
  } catch (error) {
    console.error('Failed to save transactions to localStorage:', error)
  }
}

export const loadTransactionsFromStorage = (): Transaction[] => {
  try {
    const stored = localStorage.getItem(STORAGE_KEY)
    if (stored) {
      return JSON.parse(stored) as Transaction[]
    }
  } catch (error) {
    console.error('Failed to load transactions from localStorage:', error)
  }
  return []
}

export const clearTransactionsFromStorage = (): void => {
  try {
    localStorage.removeItem(STORAGE_KEY)
  } catch (error) {
    console.error('Failed to clear transactions from localStorage:', error)
  }
}
