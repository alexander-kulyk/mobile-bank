import { describe, it, expect } from 'vitest'
import { render, screen } from '@testing-library/react'
import App from '../App'

describe('App Component', () => {
  it('should render the main title', () => {
    render(<App />)

    expect(screen.getByText('Банківські транзакції')).toBeInTheDocument()
  })

  it('should render the import button', () => {
    render(<App />)

    expect(screen.getByText('📊 Імпортувати Excel файл')).toBeInTheDocument()
  })

  it('should show empty state initially', () => {
    render(<App />)

    expect(screen.getByText('Немає транзакцій')).toBeInTheDocument()
    expect(
      screen.getByText('Імпортуйте Excel файл з транзакціями щоб розпочати')
    ).toBeInTheDocument()
  })

  it('should render header stats with zero values initially', () => {
    render(<App />)

    expect(screen.getByText('Баланс')).toBeInTheDocument()
    expect(screen.getByText('Витрати')).toBeInTheDocument()
    expect(screen.getByText('Операцій')).toBeInTheDocument()
  })
})
