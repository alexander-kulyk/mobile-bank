import { describe, it, expect } from 'vitest'
import { validateTransactions } from '../utils/excelParser'
import type { Transaction } from '../types'

describe('Excel Parser', () => {
  describe('validateTransactions', () => {
    it('should validate valid transactions', () => {
      const transactions: Transaction[] = [
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

      const result = validateTransactions(transactions)

      expect(result.totalRows).toBe(2)
      expect(result.validRows).toBe(2)
      expect(result.errors).toHaveLength(0)
    })

    it('should detect empty store names', () => {
      const transactions: Transaction[] = [
        {
          id: '1',
          date: '2023-12-01T10:30:00.000Z',
          time: '10:30',
          store: '',
          purchase: 'Продукти',
          cost: -150.5,
        },
      ]

      const result = validateTransactions(transactions)

      expect(result.validRows).toBe(0)
      expect(result.errors).toContain('Transaction 1: Empty store name')
    })

    it('should detect empty purchase descriptions', () => {
      const transactions: Transaction[] = [
        {
          id: '1',
          date: '2023-12-01T10:30:00.000Z',
          time: '10:30',
          store: 'АТБ',
          purchase: '',
          cost: -150.5,
        },
      ]

      const result = validateTransactions(transactions)

      expect(result.validRows).toBe(0)
      expect(result.errors).toContain(
        'Transaction 1: Empty purchase description'
      )
    })

    it('should warn about zero cost amounts', () => {
      const transactions: Transaction[] = [
        {
          id: '1',
          date: '2023-12-01T10:30:00.000Z',
          time: '10:30',
          store: 'АТБ',
          purchase: 'Продукти',
          cost: 0,
        },
      ]

      const result = validateTransactions(transactions)

      expect(result.validRows).toBe(1)
      expect(result.warnings).toContain('Transaction 1: Zero cost amount')
    })

    it('should detect invalid dates', () => {
      const transactions: Transaction[] = [
        {
          id: '1',
          date: 'invalid-date',
          time: '10:30',
          store: 'АТБ',
          purchase: 'Продукти',
          cost: -150.5,
        },
      ]

      const result = validateTransactions(transactions)

      expect(result.validRows).toBe(0)
      expect(result.errors).toContain('Transaction 1: Invalid date')
    })
  })
})
