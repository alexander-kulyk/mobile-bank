import * as XLSX from 'xlsx'
import { format, parse } from 'date-fns'
import type { Transaction, ParseResult, ValidationSummary } from '../types'

// Header mappings for different languages and formats
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

function parseDateTime(dateValue: unknown, timeValue: unknown): string | null {
  try {
    let dateStr = ''

    // Handle Excel date serial numbers
    if (typeof dateValue === 'number') {
      const excelDate = new Date((dateValue - 25569) * 86400 * 1000)
      dateStr = format(excelDate, 'yyyy-MM-dd')
    } else if (dateValue instanceof Date) {
      dateStr = format(dateValue, 'yyyy-MM-dd')
    } else if (typeof dateValue === 'string') {
      // Try to parse various date formats
      const dateFormats = [
        'yyyy-MM-dd',
        'dd.MM.yyyy',
        'dd/MM/yyyy',
        'MM/dd/yyyy',
        'yyyy/MM/dd',
      ]

      for (const formatStr of dateFormats) {
        try {
          const parsedDate = parse(dateValue.trim(), formatStr, new Date())
          if (!isNaN(parsedDate.getTime())) {
            dateStr = format(parsedDate, 'yyyy-MM-dd')
            break
          }
        } catch {
          continue
        }
      }
    }

    if (!dateStr) return null

    // Handle time
    let timeStr = '00:00'
    if (timeValue) {
      if (typeof timeValue === 'number' && timeValue < 1) {
        // Excel time serial (fraction of a day)
        const hours = Math.floor(timeValue * 24)
        const minutes = Math.floor((timeValue * 24 * 60) % 60)
        timeStr = `${hours.toString().padStart(2, '0')}:${minutes.toString().padStart(2, '0')}`
      } else if (typeof timeValue === 'string') {
        const timeMatch = timeValue.match(/^(\d{1,2}):(\d{2})/)
        if (timeMatch) {
          timeStr = `${timeMatch[1].padStart(2, '0')}:${timeMatch[2]}`
        }
      }
    }

    return `${dateStr}T${timeStr}:00.000Z`
  } catch (error) {
    console.error('Error parsing date/time:', error)
    return null
  }
}

function parseCost(costValue: unknown): number {
  if (typeof costValue === 'number') {
    return costValue
  }

  if (typeof costValue === 'string') {
    // Remove currency symbols, spaces, and replace comma with dot
    const cleanValue = costValue
      .replace(/[₴$€£\s]/g, '')
      .replace(',', '.')
      .trim()

    const parsed = parseFloat(cleanValue)
    return isNaN(parsed) ? 0 : parsed
  }

  return 0
}

export function parseExcelFile(file: File): Promise<ParseResult> {
  return new Promise((resolve) => {
    const reader = new FileReader()

    reader.onload = (e) => {
      try {
        const data = e.target?.result as ArrayBuffer
        const workbook = XLSX.read(data, { type: 'array' })

        // Find the correct sheet (prefer "Transactions" if exists)
        let sheetName = workbook.SheetNames[0]
        const transactionSheet = workbook.SheetNames.find((name) =>
          name.toLowerCase().includes('transaction')
        )
        if (transactionSheet) {
          sheetName = transactionSheet
        }

        const worksheet = workbook.Sheets[sheetName]
        const jsonData = XLSX.utils.sheet_to_json(worksheet, { header: 1 })

        if (!jsonData.length) {
          resolve({
            transactions: [],
            errors: ['Empty spreadsheet'],
            warnings: [],
          })
          return
        }

        const [headerRow, ...dataRows] = jsonData as unknown[][]
        const headerMap = normalizeHeaders(headerRow as string[])

        // Check required columns
        const requiredFields = ['date', 'store', 'purchase', 'cost']
        const missingFields = requiredFields.filter(
          (field) => !(field in headerMap)
        )

        if (missingFields.length > 0) {
          resolve({
            transactions: [],
            errors: [`Missing required columns: ${missingFields.join(', ')}`],
            warnings: [],
          })
          return
        }

        const transactions: Transaction[] = []
        const errors: string[] = []
        const warnings: string[] = []

        dataRows.forEach((row, index) => {
          const rowNumber = index + 2 // +2 because of 0-indexing and header row

          // Skip empty rows
          if (!row || row.every((cell) => !cell)) {
            return
          }

          try {
            const dateValue = row[headerMap.date]
            const timeValue = row[headerMap.time]
            const store = row[headerMap.store]
            const purchase = row[headerMap.purchase]
            const costValue = row[headerMap.cost]

            // Validate required fields
            if (
              !dateValue ||
              !store ||
              !purchase ||
              costValue === undefined ||
              costValue === null
            ) {
              warnings.push(`Row ${rowNumber}: Missing required data`)
              return
            }

            const parsedDate = parseDateTime(dateValue, timeValue)
            if (!parsedDate) {
              errors.push(`Row ${rowNumber}: Could not parse date`)
              return
            }

            const cost = parseCost(costValue)

            const transaction: Transaction = {
              id: `${rowNumber}-${Date.now()}`,
              date: parsedDate,
              time: timeValue ? String(timeValue) : '',
              store: String(store).trim(),
              purchase: String(purchase).trim(),
              cost: cost,
            }

            transactions.push(transaction)
          } catch (error) {
            errors.push(
              `Row ${rowNumber}: ${error instanceof Error ? error.message : 'Parse error'}`
            )
          }
        })

        resolve({
          transactions,
          errors,
          warnings,
        })
      } catch (error) {
        resolve({
          transactions: [],
          errors: [
            `Failed to parse file: ${error instanceof Error ? error.message : 'Unknown error'}`,
          ],
          warnings: [],
        })
      }
    }

    reader.onerror = () => {
      resolve({
        transactions: [],
        errors: ['Failed to read file'],
        warnings: [],
      })
    }

    reader.readAsArrayBuffer(file)
  })
}

export function validateTransactions(
  transactions: Transaction[]
): ValidationSummary {
  const errors: string[] = []
  const warnings: string[] = []
  let validCount = 0

  transactions.forEach((transaction, index) => {
    let isValid = true

    if (!transaction.store.trim()) {
      errors.push(`Transaction ${index + 1}: Empty store name`)
      isValid = false
    }

    if (!transaction.purchase.trim()) {
      errors.push(`Transaction ${index + 1}: Empty purchase description`)
      isValid = false
    }

    if (transaction.cost === 0) {
      warnings.push(`Transaction ${index + 1}: Zero cost amount`)
    }

    const date = new Date(transaction.date)
    if (isNaN(date.getTime())) {
      errors.push(`Transaction ${index + 1}: Invalid date`)
      isValid = false
    }

    if (isValid) {
      validCount++
    }
  })

  return {
    totalRows: transactions.length,
    validRows: validCount,
    errors,
    warnings,
  }
}
