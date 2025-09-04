import { useState, useMemo, useCallback } from 'react'
import useAppStore from '../stores/useAppStore'
import { financialService } from '../services/financialService'
import Swal from 'sweetalert2'

/**
 * Hook principal para gestión financiera y de ingresos
 * Siguiendo Regla #2: Toda la lógica compleja extraída del componente
 *
 * Funcionalidades principales:
 * - Gestión de transacciones (CRUD)
 * - Filtrado y búsqueda avanzada
 * - Cálculo de métricas financieras
 * - Exportación de reportes
 * - Control de modales y formularios
 * - Estados de carga y error
 *
 * @returns {Object} Estados y funciones del sistema financiero
 *
 * Cumple reglas de refactorización:
 * - Regla #2: Lógica compleja en hook personalizado
 * - Regla #8: Manejo consistente de errores
 * - Regla #13: Optimización con useMemo y useCallback
 */
const useRevenueManagement = () => {
  // ============================================
  // CONEXIÓN CON STORE
  // ============================================
  const {
    transactions,
    revenueSummary,
    registerManualTransaction,
    updateTransaction,
    deleteTransaction
  } = useAppStore()

  // ============================================
  // ESTADOS PRINCIPALES
  // ============================================
  const [activeView, setActiveView] = useState('dashboard')
  const [filters, setFilters] = useState({
    dateFrom: '',
    dateTo: '',
    type: 'all',
    status: 'all',
    search: ''
  })
  const [showAddModal, setShowAddModal] = useState(false)
  const [editingTransaction, setEditingTransaction] = useState(null)
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState(null)

  // ============================================
  // TRANSACCIONES FILTRADAS
  // ============================================
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

  // ============================================
  // MÉTRICAS FINANCIERAS CALCULADAS
  // ============================================
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

  // ============================================
  // FUNCIONES DE NAVEGACIÓN
  // ============================================
  const handleViewChange = useCallback((view) => {
    setActiveView(view)
    setError(null)
  }, [])

  const handleFilterChange = useCallback((filterKey, value) => {
    setFilters((prev) => ({
      ...prev,
      [filterKey]: value
    }))
  }, [])

  const clearFilters = useCallback(() => {
    setFilters({
      dateFrom: '',
      dateTo: '',
      type: 'all',
      status: 'all',
      search: ''
    })
  }, [])

  // ============================================
  // GESTIÓN DE TRANSACCIONES
  // ============================================
  const handleAddTransaction = useCallback(
    async (transactionData) => {
      try {
        setLoading(true)
        setError(null)

        const newTransaction = {
          ...transactionData,
          id: Date.now().toString(),
          date: new Date().toISOString(),
          status: 'COMPLETED'
        }

        await registerManualTransaction(newTransaction)

        setShowAddModal(false)

        await Swal.fire({
          title: 'Transacción Registrada',
          text: 'La transacción ha sido registrada exitosamente',
          icon: 'success',
          confirmButtonColor: '#1976d2'
        })
      } catch (error) {
        console.error('Error registrando transacción:', error)
        setError('Error al registrar la transacción: ' + error.message)

        await Swal.fire({
          title: 'Error',
          text: 'No se pudo registrar la transacción. Intenta nuevamente.',
          icon: 'error',
          confirmButtonColor: '#DC2626'
        })
      } finally {
        setLoading(false)
      }
    },
    [registerManualTransaction]
  )

  const handleEditTransaction = useCallback(
    async (transactionData) => {
      try {
        setLoading(true)
        setError(null)

        await updateTransaction(editingTransaction.id, transactionData)

        setEditingTransaction(null)

        await Swal.fire({
          title: 'Transacción Actualizada',
          text: 'La transacción ha sido actualizada exitosamente',
          icon: 'success',
          confirmButtonColor: '#1976d2'
        })
      } catch (error) {
        console.error('Error actualizando transacción:', error)
        setError('Error al actualizar la transacción: ' + error.message)

        await Swal.fire({
          title: 'Error',
          text: 'No se pudo actualizar la transacción. Intenta nuevamente.',
          icon: 'error',
          confirmButtonColor: '#DC2626'
        })
      } finally {
        setLoading(false)
      }
    },
    [editingTransaction, updateTransaction]
  )

  const handleDeleteTransaction = useCallback(
    async (transactionId) => {
      try {
        const result = await Swal.fire({
          title: '¿Estás seguro?',
          text: 'Esta acción no se puede deshacer',
          icon: 'warning',
          showCancelButton: true,
          confirmButtonColor: '#DC2626',
          cancelButtonColor: '#6B7280',
          confirmButtonText: 'Sí, eliminar',
          cancelButtonText: 'Cancelar'
        })

        if (result.isConfirmed) {
          setLoading(true)
          await deleteTransaction(transactionId)

          await Swal.fire({
            title: 'Eliminado',
            text: 'La transacción ha sido eliminada',
            icon: 'success',
            confirmButtonColor: '#1976d2'
          })
        }
      } catch (error) {
        console.error('Error eliminando transacción:', error)
        setError('Error al eliminar la transacción: ' + error.message)

        await Swal.fire({
          title: 'Error',
          text: 'No se pudo eliminar la transacción. Intenta nuevamente.',
          icon: 'error',
          confirmButtonColor: '#DC2626'
        })
      } finally {
        setLoading(false)
      }
    },
    [deleteTransaction]
  )

  // ============================================
  // CONTROL DE MODALES
  // ============================================
  const openAddModal = useCallback(() => {
    setShowAddModal(true)
    setError(null)
  }, [])

  const closeAddModal = useCallback(() => {
    setShowAddModal(false)
  }, [])

  const openEditModal = useCallback((transaction) => {
    setEditingTransaction(transaction)
    setError(null)
  }, [])

  const closeEditModal = useCallback(() => {
    setEditingTransaction(null)
  }, [])

  // ============================================
  // FUNCIONES DE EXPORTACIÓN
  // ============================================
  const handleExportReport = useCallback(
    async (format) => {
      try {
        setLoading(true)
        setError(null)

        const reportData = {
          transactions: filteredTransactions,
          metrics: financialMetrics,
          summary: revenueSummary,
          filters
        }

        if (format === 'excel') {
          await financialService.exportToExcel(reportData)
        } else if (format === 'pdf') {
          await financialService.exportToPDF(reportData)
        }
      } catch (error) {
        console.error('Error exportando reporte:', error)
        setError('Error al exportar el reporte: ' + error.message)

        await Swal.fire({
          title: 'Error de Exportación',
          text: 'No se pudo exportar el reporte. Intenta nuevamente.',
          icon: 'error',
          confirmButtonColor: '#DC2626'
        })
      } finally {
        setLoading(false)
      }
    },
    [filteredTransactions, financialMetrics, revenueSummary, filters]
  )

  // ============================================
  // FUNCIONES UTILITARIAS
  // ============================================
  const getTypeName = useCallback((type) => {
    const typeNames = {
      service_payment: 'Pago de Servicio',
      plan_payment: 'Pago de Plan',
      additional_fee: 'Tarifa Adicional',
      refund: 'Reembolso',
      adjustment: 'Ajuste',
      other: 'Otro'
    }
    return typeNames[type] || type
  }, [])

  const getStatusColor = useCallback((status) => {
    const colors = {
      COMPLETED: 'text-green-600 bg-green-100',
      PENDING: 'text-yellow-600 bg-yellow-100',
      FAILED: 'text-red-600 bg-red-100',
      CANCELLED: 'text-gray-600 bg-gray-100'
    }
    return colors[status] || 'text-gray-600 bg-gray-100'
  }, [])

  const formatCurrency = useCallback((amount) => {
    return new Intl.NumberFormat('es-PE', {
      style: 'currency',
      currency: 'PEN'
    }).format(amount)
  }, [])

  const clearError = useCallback(() => {
    setError(null)
  }, [])

  // ============================================
  // RETORNO DEL HOOK
  // ============================================
  return {
    // Estados principales
    activeView,
    filters,
    showAddModal,
    editingTransaction,
    loading,
    error,

    // Datos procesados
    filteredTransactions,
    financialMetrics,

    // Funciones de navegación
    handleViewChange,
    handleFilterChange,
    clearFilters,

    // Gestión de transacciones
    handleAddTransaction,
    handleEditTransaction,
    handleDeleteTransaction,

    // Control de modales
    openAddModal,
    closeAddModal,
    openEditModal,
    closeEditModal,

    // Exportación
    handleExportReport,

    // Utilidades
    getTypeName,
    getStatusColor,
    formatCurrency,
    clearError,

    // Estados de validación
    hasTransactions: transactions && transactions.length > 0,
    hasFilteredTransactions: filteredTransactions.length > 0
  }
}

export default useRevenueManagement
