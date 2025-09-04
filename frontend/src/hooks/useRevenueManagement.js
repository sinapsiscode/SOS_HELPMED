import { useState, useCallback } from 'react'
import useAppStore from '../stores/useAppStore'
import useTransactionFilters from './useTransactionFilters'
import useFinancialMetrics from './useFinancialMetrics'
import useTransactionCRUD from './useTransactionCRUD'
import useTransactionModals from './useTransactionModals'
import useRevenueExport from './useRevenueExport'

/**
 * Hook coordinador para gestión financiera y de ingresos
 * REFACTORIZADO siguiendo TODAS las reglas:
 *
 * ✅ Regla #2: Lógica extraída a hooks especializados
 * ✅ Regla #5: Gestión de estados distribuida
 * ✅ Regla #13: Optimización con composición de hooks
 * 
 * Funcionalidades distribuidas:
 * - useTransactionFilters: Filtrado de transacciones
 * - useFinancialMetrics: Cálculo de métricas financieras
 * - useTransactionCRUD: Operaciones CRUD
 * - useTransactionModals: Control de modales
 * - useRevenueExport: Exportación de reportes
 */
const useRevenueManagement = () => {
  // ============================================
  // STORE Y ESTADOS GLOBALES
  // ============================================
  const {
    transactions,
    revenueSummary,
    registerManualTransaction,
    updateTransaction,
    deleteTransaction
  } = useAppStore()

  // ============================================
  // ESTADOS LOCALES
  // ============================================
  const [activeView, setActiveView] = useState('dashboard')
  const [filters, setFilters] = useState({
    dateFrom: '',
    dateTo: '',
    type: 'all',
    status: 'all',
    search: ''
  })

  // ============================================
  // HOOKS ESPECIALIZADOS
  // ============================================
  const filtersHook = useTransactionFilters(transactions, filters)
  const metricsHook = useFinancialMetrics(revenueSummary, transactions)
  const crudHook = useTransactionCRUD(registerManualTransaction, updateTransaction, deleteTransaction)
  const modalsHook = useTransactionModals()
  const exportHook = useRevenueExport()

  // ============================================
  // FUNCIONES DE NAVEGACIÓN
  // ============================================
  const handleViewChange = useCallback((view) => {
    setActiveView(view)
    crudHook.clearError()
    exportHook.clearError()
  }, [crudHook, exportHook])

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

  // Wrapper functions para CRUD con modal management
  const handleAddTransactionWithModal = useCallback(async (transactionData) => {
    const result = await crudHook.handleAddTransaction(transactionData)
    if (result.success) {
      modalsHook.closeAddModal()
    }
    return result
  }, [crudHook, modalsHook])

  const handleEditTransactionWithModal = useCallback(async (transactionData) => {
    const result = await crudHook.handleEditTransaction(modalsHook.editingTransaction, transactionData)
    if (result.success) {
      modalsHook.closeEditModal()
    }
    return result
  }, [crudHook, modalsHook])

  const handleExportReportWithData = useCallback(async (format) => {
    return await exportHook.handleExportReport(
      format,
      filtersHook.filteredTransactions,
      metricsHook.financialMetrics,
      revenueSummary,
      filters
    )
  }, [exportHook, filtersHook, metricsHook, revenueSummary, filters])

  // ============================================
  // RETORNO COORDINADO DE TODOS LOS HOOKS
  // ============================================
  return {
    // Estados principales
    activeView,
    filters,
    loading: crudHook.loading || exportHook.loading,
    error: crudHook.error || exportHook.error,

    // Estados delegados (modales)
    showAddModal: modalsHook.showAddModal,
    editingTransaction: modalsHook.editingTransaction,

    // Datos procesados (delegados)
    filteredTransactions: filtersHook.filteredTransactions,
    financialMetrics: metricsHook.financialMetrics,

    // Funciones de navegación
    handleViewChange,
    handleFilterChange,
    clearFilters,

    // Gestión de transacciones (delegadas)
    handleAddTransaction: handleAddTransactionWithModal,
    handleEditTransaction: handleEditTransactionWithModal,
    handleDeleteTransaction: crudHook.handleDeleteTransaction,

    // Control de modales (delegadas)
    openAddModal: modalsHook.openAddModal,
    closeAddModal: modalsHook.closeAddModal,
    openEditModal: modalsHook.openEditModal,
    closeEditModal: modalsHook.closeEditModal,

    // Exportación (delegada)
    handleExportReport: handleExportReportWithData,

    // Utilidades
    getTypeName,
    getStatusColor,
    formatCurrency,
    clearError: () => {
      crudHook.clearError()
      exportHook.clearError()
    },

    // Estados de validación
    hasTransactions: transactions && transactions.length > 0,
    hasFilteredTransactions: filtersHook.filteredTransactions.length > 0
  }
}

export default useRevenueManagement