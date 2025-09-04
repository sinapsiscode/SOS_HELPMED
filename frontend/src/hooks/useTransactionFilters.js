import { useMemo } from 'react'

/**
 * Hook especializado para filtrado de transacciones
 * ✅ Cumple reglas de tamaño: <100 líneas
 * ✅ Responsabilidad única: Transaction filtering
 * ✅ Optimizado con useMemo
 */
const useTransactionFilters = (transactions, filters) => {
  const filteredTransactions = useMemo(() => {
    if (!transactions) return []

    return transactions.filter((transaction) => {
      let matches = true

      if (filters.dateFrom) {
        matches = matches && new Date(transaction.date) >= new Date(filters.dateFrom)
      }
      if (filters.dateTo) {
        matches = matches && new Date(transaction.date) <= new Date(filters.dateTo)
      }
      if (filters.type !== 'all') {
        matches = matches && transaction.type === filters.type
      }
      if (filters.status !== 'all') {
        matches = matches && transaction.status === filters.status
      }
      if (filters.search) {
        const searchLower = filters.search.toLowerCase()
        matches =
          matches &&
          (transaction.concept?.toLowerCase().includes(searchLower) ||
            transaction.userName?.toLowerCase().includes(searchLower) ||
            transaction.companyName?.toLowerCase().includes(searchLower))
      }

      return matches
    })
  }, [transactions, filters])

  return {
    filteredTransactions
  }
}

export default useTransactionFilters