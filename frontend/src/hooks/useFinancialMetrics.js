import { useMemo } from 'react'

/**
 * Hook especializado para cálculo de métricas financieras
 * ✅ Cumple reglas de tamaño: <100 líneas
 * ✅ Responsabilidad única: Financial calculations
 * ✅ Optimizado con useMemo
 */
const useFinancialMetrics = (revenueSummary, transactions) => {
  const financialMetrics = useMemo(() => {
    if (!revenueSummary || !transactions) {
      return {
        totalRevenue: 0,
        monthlyRevenue: 0,
        dailyRevenue: 0,
        averageTransaction: 0,
        monthlyGrowth: 0,
        byType: {},
        byStatus: {},
        trends: []
      }
    }

    // Cálculo de promedio por transacción
    const completedTransactions = transactions.filter((t) => t.status === 'COMPLETED')
    const avgTransaction =
      completedTransactions.length > 0
        ? revenueSummary.totalRevenue / completedTransactions.length
        : 0

    // Cálculo de crecimiento mensual
    const monthlyGrowth =
      revenueSummary.byPeriod?.thisMonth > 0 && revenueSummary.byPeriod?.lastMonth > 0
        ? (revenueSummary.byPeriod.thisMonth / revenueSummary.byPeriod.lastMonth - 1) * 100
        : 0

    // Ingresos por tipo
    const byType = transactions.reduce((acc, transaction) => {
      if (transaction.status === 'COMPLETED') {
        const type = transaction.type || 'other'
        acc[type] = (acc[type] || 0) + transaction.amount
      }
      return acc
    }, {})

    // Distribución por estado
    const byStatus = transactions.reduce((acc, transaction) => {
      const status = transaction.status || 'unknown'
      acc[status] = (acc[status] || 0) + 1
      return acc
    }, {})

    // Tendencias de los últimos 6 meses
    const trends = Array.from({ length: 6 }, (_, i) => {
      const date = new Date()
      date.setMonth(date.getMonth() - (5 - i))

      const monthTransactions = transactions.filter((t) => {
        const tDate = new Date(t.date)
        return (
          tDate.getMonth() === date.getMonth() &&
          tDate.getFullYear() === date.getFullYear() &&
          t.status === 'COMPLETED'
        )
      })

      const revenue = monthTransactions.reduce((sum, t) => sum + t.amount, 0)

      return {
        month: date.toLocaleDateString('es-PE', { month: 'short' }),
        revenue,
        transactions: monthTransactions.length
      }
    })

    return {
      totalRevenue: revenueSummary.totalRevenue || 0,
      monthlyRevenue: revenueSummary.byPeriod?.thisMonth || 0,
      dailyRevenue: revenueSummary.byPeriod?.today || 0,
      averageTransaction: avgTransaction,
      monthlyGrowth,
      byType,
      byStatus,
      trends
    }
  }, [revenueSummary, transactions])

  return {
    financialMetrics
  }
}

export default useFinancialMetrics