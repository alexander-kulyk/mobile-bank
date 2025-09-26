import { describe, it, expect } from 'vitest'

// We need to extract the header mapping logic to test it
// Since it's currently internal to the parseExcelFile function,
// let's create a separate testable function

const HEADER_MAPPINGS: Record<string, string> = {
  // English
  date: 'date',
  time: 'time',
  store: 'store',
  purchase: 'purchase',
  cost: 'cost',
  // Ukrainian
  дата: 'date',
  час: 'time',
  магазин: 'store',
  покупка: 'purchase',
  вартість: 'cost',
  // Variations
  shop: 'store',
  merchant: 'store',
  amount: 'cost',
  price: 'cost',
  sum: 'cost',
  сума: 'cost',
}

function normalizeHeader(header: string): string {
  const normalized = header
    .toLowerCase()
    .trim()
    .replace(/[_\s]+/g, '')
  return HEADER_MAPPINGS[normalized] || header
}

function normalizeHeaders(headers: string[]): Record<string, number> {
  const headerMap: Record<string, number> = {}

  headers.forEach((header, index) => {
    if (header && typeof header === 'string') {
      const normalizedKey = normalizeHeader(header)
      headerMap[normalizedKey] = index
    }
  })

  return headerMap
}

describe('Header Mapping', () => {
  describe('normalizeHeader', () => {
    it('should normalize English headers', () => {
      expect(normalizeHeader('Date')).toBe('date')
      expect(normalizeHeader('TIME')).toBe('time')
      expect(normalizeHeader('Store')).toBe('store')
      expect(normalizeHeader('Purchase')).toBe('purchase')
      expect(normalizeHeader('Cost')).toBe('cost')
    })

    it('should normalize Ukrainian headers', () => {
      expect(normalizeHeader('Дата')).toBe('date')
      expect(normalizeHeader('ЧАС')).toBe('time')
      expect(normalizeHeader('Магазин')).toBe('store')
      expect(normalizeHeader('Покупка')).toBe('purchase')
      expect(normalizeHeader('Вартість')).toBe('cost')
    })

    it('should handle header variations', () => {
      expect(normalizeHeader('Shop')).toBe('store')
      expect(normalizeHeader('Merchant')).toBe('store')
      expect(normalizeHeader('Amount')).toBe('cost')
      expect(normalizeHeader('Price')).toBe('cost')
      expect(normalizeHeader('Sum')).toBe('cost')
      expect(normalizeHeader('Сума')).toBe('cost')
    })

    it('should handle headers with spaces and underscores', () => {
      expect(normalizeHeader('Date Time')).toBe('datetime')
      expect(normalizeHeader('Store_Name')).toBe('storename')
      expect(normalizeHeader('  Purchase  Description  ')).toBe(
        'purchasedescription'
      )
    })

    it('should return original header if no mapping found', () => {
      expect(normalizeHeader('Unknown Header')).toBe('unknownheader')
    })
  })

  describe('normalizeHeaders', () => {
    it('should create correct header mapping', () => {
      const headers = ['Date', 'Time', 'Store', 'Purchase', 'Cost']
      const result = normalizeHeaders(headers)

      expect(result).toEqual({
        date: 0,
        time: 1,
        store: 2,
        purchase: 3,
        cost: 4,
      })
    })

    it('should handle mixed language headers', () => {
      const headers = ['Дата', 'Time', 'Магазин', 'Purchase', 'Сума']
      const result = normalizeHeaders(headers)

      expect(result).toEqual({
        date: 0,
        time: 1,
        store: 2,
        purchase: 3,
        cost: 4,
      })
    })

    it('should skip empty or invalid headers', () => {
      const headers = ['Date', '', 'Store', 'Cost']
      const result = normalizeHeaders(headers)

      expect(result).toEqual({
        date: 0,
        store: 2,
        cost: 3,
      })
    })
  })
})
