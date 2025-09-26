import React, { useState, useEffect } from 'react'
import { Toast } from 'antd-mobile'
import { parseExcelFile } from './utils/excelParser'
import {
  filterTransactions,
  sortTransactions,
  groupTransactionsByDate,
  calculateSummary,
  formatCurrency,
  exportToCSV,
  downloadCSV,
  formatTimeForDisplay,
} from './utils/transactionUtils'

import type { Transaction, Filters, SortOrder } from './types'
import {
  AppContainer,
  Header,
  HeaderTitle,
  HeaderStats,
  StatItem,
  StatValue,
  BalanceValue,
  StatLabel,
  ImportSection,
  ImportButton,
  HiddenInput,
  FiltersContainer,
  FilterRow,
  SearchInput,
  FilterButton,
  AmountInput,
  TransactionList,
  DateGroup,
  DateHeader,
  TransactionItem,
  TransactionHeader,
  MerchantName,
  TransactionAmount,
  TransactionMeta,
  PurchaseDescription,
  TransactionTime,
  EmptyState,
  EmptyStateIcon,
  EmptyStateTitle,
  EmptyStateDescription,
  ExportButton,
  LoadingContainer,
  LoadingSpinner,
} from './components/styled'

function App() {
  const [transactions, setTransactions] = useState<Transaction[]>([])
  const [filteredTransactions, setFilteredTransactions] = useState<
    Transaction[]
  >([])
  const [filters, setFilters] = useState<Filters>({
    searchText: '',
  })
  const [sortOrder, setSortOrder] = useState<SortOrder>('newest')
  const [isLoading, setIsLoading] = useState(false)
  const [showFilters, setShowFilters] = useState(false)

  // Update filtered transactions when transactions or filters change
  useEffect(() => {
    let filtered = filterTransactions(transactions, filters)
    filtered = sortTransactions(filtered, sortOrder)
    setFilteredTransactions(filtered)
  }, [transactions, filters, sortOrder])

  const handleFileImport = async (
    event: React.ChangeEvent<HTMLInputElement>
  ) => {
    const file = event.target.files?.[0]
    if (!file) return

    // Validate file type
    if (!file.name.endsWith('.xlsx') && !file.name.endsWith('.xls')) {
      Toast.show({
        content: 'Будь ласка, оберіть файл Excel (.xlsx або .xls)',
        icon: 'fail',
      })
      return
    }

    setIsLoading(true)

    try {
      const result = await parseExcelFile(file)

      if (result.errors.length > 0) {
        Toast.show({
          content: `Помилки при імпорті: ${result.errors.join(', ')}`,
          icon: 'fail',
          duration: 4000,
        })
      }

      if (result.warnings.length > 0) {
        Toast.show({
          content: `Попередження: ${result.warnings.join(', ')}`,
          icon: 'loading',
          duration: 3000,
        })
      }

      if (result.transactions.length > 0) {
        setTransactions(result.transactions)

        Toast.show({
          content: `Завантажено ${result.transactions.length} транзакцій`,
          icon: 'success',
        })
      } else if (result.errors.length === 0) {
        Toast.show({
          content: 'Файл не містить дійсних транзакцій',
          icon: 'loading',
        })
      }
    } catch (error) {
      Toast.show({
        content: `Помилка читання файлу: ${error instanceof Error ? error.message : 'Невідома помилка'}`,
        icon: 'fail',
      })
    } finally {
      setIsLoading(false)
      // Reset file input
      event.target.value = ''
    }
  }

  const handleExportCSV = () => {
    if (filteredTransactions.length === 0) {
      Toast.show({
        content: 'Немає транзакцій для експорту',
        icon: 'loading',
      })
      return
    }

    try {
      const csvContent = exportToCSV(filteredTransactions)
      downloadCSV(csvContent, 'транзакції.csv')

      Toast.show({
        content: 'Файл успішно експортовано',
        icon: 'success',
      })
    } catch {
      Toast.show({
        content: 'Помилка експорту файлу',
        icon: 'fail',
      })
    }
  }

  const summary = calculateSummary(filteredTransactions)
  const groupedTransactions = groupTransactionsByDate(filteredTransactions)

  return (
    <AppContainer>
      <Header>
        <HeaderTitle>Банківські транзакції</HeaderTitle>
        <HeaderStats>
          <StatItem>
            <BalanceValue isNegative={summary.balance < 0}>
              {formatCurrency(summary.balance)}
            </BalanceValue>
            <StatLabel>Баланс</StatLabel>
          </StatItem>
          <StatItem>
            <StatValue>{formatCurrency(summary.spending)}</StatValue>
            <StatLabel>Витрати</StatLabel>
          </StatItem>
          <StatItem>
            <StatValue>{summary.totalTransactions}</StatValue>
            <StatLabel>Операцій</StatLabel>
          </StatItem>
        </HeaderStats>
      </Header>

      <ImportSection>
        <ImportButton htmlFor="file-input">
          {isLoading ? (
            <>
              <LoadingSpinner />
              Завантаження...
            </>
          ) : (
            <>📊 Імпортувати Excel файл</>
          )}
        </ImportButton>
        <HiddenInput
          id="file-input"
          type="file"
          accept=".xlsx,.xls"
          onChange={handleFileImport}
          disabled={isLoading}
        />
      </ImportSection>

      {transactions.length > 0 && (
        <FiltersContainer>
          <FilterRow>
            <SearchInput
              type="text"
              placeholder="Пошук по магазину або покупці..."
              value={filters.searchText}
              onChange={(e) =>
                setFilters((prev) => ({ ...prev, searchText: e.target.value }))
              }
            />
            <FilterButton
              onClick={() => setShowFilters(!showFilters)}
              active={showFilters}
            >
              Фільтри
            </FilterButton>
          </FilterRow>

          {showFilters && (
            <>
              <FilterRow>
                <AmountInput
                  type="number"
                  placeholder="Мін. сума"
                  value={filters.minAmount || ''}
                  onChange={(e) =>
                    setFilters((prev) => ({
                      ...prev,
                      minAmount: e.target.value
                        ? Number(e.target.value)
                        : undefined,
                    }))
                  }
                />
                <AmountInput
                  type="number"
                  placeholder="Макс. сума"
                  value={filters.maxAmount || ''}
                  onChange={(e) =>
                    setFilters((prev) => ({
                      ...prev,
                      maxAmount: e.target.value
                        ? Number(e.target.value)
                        : undefined,
                    }))
                  }
                />
                <FilterButton
                  onClick={() =>
                    setSortOrder(sortOrder === 'newest' ? 'oldest' : 'newest')
                  }
                  active={sortOrder === 'newest'}
                >
                  {sortOrder === 'newest' ? 'Новіші' : 'Старіші'}
                </FilterButton>
              </FilterRow>

              <FilterRow>
                <input
                  type="date"
                  value={filters.dateFrom || ''}
                  onChange={(e) =>
                    setFilters((prev) => ({
                      ...prev,
                      dateFrom: e.target.value || undefined,
                    }))
                  }
                  style={{
                    padding: '12px 16px',
                    border: '2px solid #e9ecef',
                    borderRadius: '8px',
                    fontSize: '16px',
                    flex: 1,
                  }}
                />
                <input
                  type="date"
                  value={filters.dateTo || ''}
                  onChange={(e) =>
                    setFilters((prev) => ({
                      ...prev,
                      dateTo: e.target.value || undefined,
                    }))
                  }
                  style={{
                    padding: '12px 16px',
                    border: '2px solid #e9ecef',
                    borderRadius: '8px',
                    fontSize: '16px',
                    flex: 1,
                  }}
                />
              </FilterRow>
            </>
          )}
        </FiltersContainer>
      )}

      <TransactionList>
        {isLoading ? (
          <LoadingContainer>
            <LoadingSpinner />
            Обробка файлу...
          </LoadingContainer>
        ) : groupedTransactions.length > 0 ? (
          <>
            {groupedTransactions.map((group) => (
              <DateGroup key={group.date}>
                <DateHeader>{group.displayDate}</DateHeader>
                {group.transactions.map((transaction) => (
                  <TransactionItem key={transaction.id}>
                    <TransactionHeader>
                      <MerchantName>{transaction.store}</MerchantName>
                      <TransactionAmount isPositive={false}>
                        {formatCurrency(-Math.abs(transaction.cost))}
                      </TransactionAmount>
                    </TransactionHeader>
                    <TransactionMeta>
                      <PurchaseDescription>
                        {transaction.purchase}
                      </PurchaseDescription>
                      <TransactionTime>
                        {formatTimeForDisplay(transaction.date)}
                      </TransactionTime>
                    </TransactionMeta>
                  </TransactionItem>
                ))}
              </DateGroup>
            ))}
          </>
        ) : (
          <EmptyState>
            <EmptyStateIcon>📊</EmptyStateIcon>
            <EmptyStateTitle>
              {transactions.length > 0
                ? 'Немає результатів'
                : 'Немає транзакцій'}
            </EmptyStateTitle>
            <EmptyStateDescription>
              {transactions.length > 0
                ? 'Спробуйте змінити фільтри пошуку'
                : 'Імпортуйте Excel файл з транзакціями щоб розпочати'}
            </EmptyStateDescription>
          </EmptyState>
        )}
      </TransactionList>

      {filteredTransactions.length > 0 && (
        <ExportButton onClick={handleExportCSV} title="Експортувати в CSV">
          💾
        </ExportButton>
      )}
    </AppContainer>
  )
}

export default App
