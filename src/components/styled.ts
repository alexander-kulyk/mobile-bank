import styled from 'styled-components'

// Main app container
export const AppContainer = styled.div`
  max-width: 400px;
  margin: 0 auto;
  height: 100vh;
  background: #ffffff;
  position: relative;
  padding: 0;
  overflow: hidden;
  display: flex;
  flex-direction: column;
  border: 10px solid #000000;
  border-radius: 30px;
`

// Header
export const Header = styled.header`
  background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
  color: white;
  padding: 20px;
  margin: 0;
  border-radius: 0;
  position: relative;
  z-index: 10;
  box-shadow: 0 2px 10px rgba(0, 0, 0, 0.1);
  flex-shrink: 0;
`

export const HeaderTitle = styled.h1`
  margin: 0 0 16px 0;
  font-size: 24px;
  font-weight: 600;
`

export const HeaderStats = styled.div`
  display: flex;
  justify-content: space-between;
  gap: 16px;
`

export const StatItem = styled.div`
  text-align: center;
  flex: 1;
`

export const StatValue = styled.div`
  font-size: 18px;
  font-weight: 700;
  margin-bottom: 4px;
`

export const StatLabel = styled.div`
  font-size: 12px;
  opacity: 0.9;
`

// Import section
export const ImportSection = styled.div`
  padding: 20px;
  margin: 0;
  background: white;
  border-bottom: 1px solid #e9ecef;
  position: relative;
  z-index: 10;
  flex-shrink: 0;
`

export const ImportButton = styled.label`
  display: flex;
  align-items: center;
  justify-content: center;
  gap: 8px;
  background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
  color: white;
  padding: 14px 20px;
  border-radius: 12px;
  font-weight: 600;
  cursor: pointer;
  transition: all 0.2s ease;
  border: none;
  font-size: 16px;

  &:hover {
    transform: translateY(-2px);
    box-shadow: 0 4px 15px rgba(102, 126, 234, 0.4);
  }

  &:active {
    transform: translateY(0);
  }
`

export const HiddenInput = styled.input`
  display: none;
`

// Filters
export const FiltersContainer = styled.div`
  background: white;
  padding: 20px;
  margin: 0;
  border-bottom: 1px solid #e9ecef;
  position: relative;
  z-index: 10;
  flex-shrink: 0;
`

export const FilterRow = styled.div`
  display: flex;
  gap: 12px;
  margin-bottom: 12px;

  &:last-child {
    margin-bottom: 0;
  }
`

export const SearchInput = styled.input`
  flex: 1;
  padding: 12px 16px;
  border: 2px solid #e9ecef;
  border-radius: 8px;
  font-size: 16px;
  transition: border-color 0.2s ease;

  &:focus {
    outline: none;
    border-color: #667eea;
  }

  &::placeholder {
    color: #6c757d;
  }
`

export const FilterButton = styled.button<{ active?: boolean }>`
  padding: 8px 16px;
  border: 2px solid ${(props) => (props.active ? '#667eea' : '#e9ecef')};
  background: ${(props) => (props.active ? '#667eea' : 'white')};
  color: ${(props) => (props.active ? 'white' : '#6c757d')};
  border-radius: 8px;
  font-size: 14px;
  font-weight: 500;
  cursor: pointer;
  transition: all 0.2s ease;

  &:hover {
    border-color: #667eea;
    background: ${(props) => (props.active ? '#5a67d8' : '#f8f9fe')};
  }
`

export const AmountInput = styled.input`
  width: 100px;
  padding: 12px 16px;
  border: 2px solid #e9ecef;
  border-radius: 8px;
  font-size: 16px;
  transition: border-color 0.2s ease;

  &:focus {
    outline: none;
    border-color: #667eea;
  }
`

// Transaction list
export const TransactionList = styled.div`
  padding: 20px;
  margin: 0;
  background: white;
  flex: 1;
  overflow-y: auto;
  position: relative;
  z-index: 10;
`

export const DateGroup = styled.div`
  margin-bottom: 24px;
`

export const DateHeader = styled.h2`
  font-size: 16px;
  font-weight: 600;
  color: #495057;
  margin: 0 0 12px 0;
  padding: 8px 0;
  border-bottom: 1px solid #e9ecef;
`

export const TransactionItem = styled.div`
  background: white;
  border-radius: 12px;
  padding: 16px;
  margin-bottom: 12px;
  box-shadow: 0 2px 4px rgba(0, 0, 0, 0.05);
  border: 1px solid #e9ecef;
  transition:
    transform 0.2s ease,
    box-shadow 0.2s ease;

  &:hover {
    transform: translateY(-1px);
    box-shadow: 0 4px 12px rgba(0, 0, 0, 0.1);
  }
`

export const TransactionHeader = styled.div`
  display: flex;
  justify-content: space-between;
  align-items: flex-start;
  margin-bottom: 8px;
`

export const MerchantName = styled.div`
  font-weight: 600;
  font-size: 16px;
  color: #212529;
  flex: 1;
`

export const TransactionAmount = styled.div<{ isPositive: boolean }>`
  font-weight: 700;
  font-size: 18px;
  color: ${(props) => (props.isPositive ? '#28a745' : '#dc3545')};
  text-align: right;
`

export const TransactionMeta = styled.div`
  display: flex;
  justify-content: space-between;
  align-items: center;
`

export const PurchaseDescription = styled.div`
  font-size: 14px;
  color: #6c757d;
  flex: 1;
`

export const TransactionTime = styled.div`
  font-size: 12px;
  color: #adb5bd;
  font-weight: 500;
`

// Empty state
export const EmptyState = styled.div`
  text-align: center;
  padding: 60px 20px;
  color: #6c757d;
  background: white;
  border-radius: 12px;
  border: 1px solid #e9ecef;
`

export const EmptyStateIcon = styled.div`
  font-size: 48px;
  margin-bottom: 16px;
  opacity: 0.5;
`

export const EmptyStateTitle = styled.h3`
  font-size: 18px;
  margin: 0 0 8px 0;
  color: #495057;
`

export const EmptyStateDescription = styled.p`
  margin: 0;
  font-size: 14px;
`

// Export button
export const ExportButton = styled.button`
  position: fixed;
  bottom: 20px;
  right: 20px;
  background: #28a745;
  color: white;
  border: none;
  border-radius: 50%;
  width: 56px;
  height: 56px;
  font-size: 20px;
  cursor: pointer;
  box-shadow: 0 4px 12px rgba(40, 167, 69, 0.4);
  transition: all 0.2s ease;
  z-index: 50;

  &:hover {
    transform: scale(1.1);
    box-shadow: 0 6px 16px rgba(40, 167, 69, 0.5);
  }

  &:active {
    transform: scale(0.95);
  }
`

// Loading state
export const LoadingContainer = styled.div`
  display: flex;
  align-items: center;
  justify-content: center;
  padding: 40px;
  color: #6c757d;
`

export const LoadingSpinner = styled.div`
  width: 24px;
  height: 24px;
  border: 3px solid #e9ecef;
  border-top: 3px solid #667eea;
  border-radius: 50%;
  animation: spin 1s linear infinite;
  margin-right: 12px;

  @keyframes spin {
    0% {
      transform: rotate(0deg);
    }
    100% {
      transform: rotate(360deg);
    }
  }
`

// Toast notifications (will be styled with antd-mobile)
export const ToastContainer = styled.div`
  position: fixed;
  top: 20px;
  left: 50%;
  transform: translateX(-50%);
  z-index: 1000;
`
