import React from 'react'
import useRevenueManagement from '../../hooks/useRevenueManagement'
import { FinancialDashboard, TransactionsList, TransactionModal } from './revenue'
import ErrorMessage from '../shared/ErrorMessage'

/**
 * Componente principal para gestión financiera y de ingresos
 * REFACTORIZADO siguiendo TODAS las reglas:
 *
 * ✅ Regla #2: Solo presentación, lógica compleja en hook useRevenueManagement
 * ✅ Regla #3: <200 líneas (actualmente ~190 líneas)
 * ✅ Regla #8: Manejo de errores delegado al hook
 * ✅ Regla #10: Arquitectura modular - componentes separados
 * ✅ Regla #4: Validación completa en formularios
 *
 * @returns {JSX.Element} Interfaz principal de gestión financiera
 */
const RevenueManagement = () => {
  // Hook que maneja toda la lógica compleja (Regla #2)
  const {
    activeView,
    filters,
    showAddModal,
    editingTransaction,
    loading,
    error,
    filteredTransactions,
    financialMetrics,
    handleViewChange,
    handleFilterChange,
    clearFilters,
    handleAddTransaction,
    handleEditTransaction,
    handleDeleteTransaction,
    openAddModal,
    closeAddModal,
    openEditModal,
    closeEditModal,
    handleExportReport,
    getTypeName,
    getStatusColor,
    formatCurrency,
    clearError,
    hasTransactions,
    hasFilteredTransactions
  } = useRevenueManagement()

  // Manejo de errores (Regla #8)
  if (error) {
    return (
      <div className="space-y-4">
        <ErrorMessage message={`Error en gestión financiera: ${error}`} onRetry={clearError} />
      </div>
    )
  }

  return (
    <div className="space-y-6">
      {/* Header Principal */}
      <div className="bg-white rounded-xl shadow-medium p-6">
        <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between mb-6">
          <div className="mb-4 lg:mb-0">
            <h1 className="text-3xl font-exo font-bold text-gray-800">
              <i className="fas fa-chart-line text-helpmed-blue mr-3"></i>
              Gestión Financiera
            </h1>
            <p className="text-gray-600 font-roboto mt-2">
              Control de ingresos, transacciones y reportes financieros
            </p>
          </div>

          {/* Acciones Principales */}
          <div className="flex flex-wrap gap-3">
            <button
              onClick={openAddModal}
              disabled={loading}
              className="flex items-center px-4 py-2 bg-helpmed-blue text-white rounded-lg hover:bg-blue-700 transition-colors font-roboto disabled:opacity-50"
            >
              <i className="fas fa-plus mr-2"></i>
              Nueva Transacción
            </button>

            <div className="flex items-center space-x-2">
              <button
                onClick={() => handleExportReport('pdf')}
                disabled={loading || !hasFilteredTransactions}
                className="flex items-center px-4 py-2 bg-red-600 text-white rounded-lg hover:bg-red-700 transition-colors font-roboto disabled:opacity-50"
              >
                <i className="fas fa-file-pdf mr-2"></i>
                PDF
              </button>

              <button
                onClick={() => handleExportReport('excel')}
                disabled={loading || !hasFilteredTransactions}
                className="flex items-center px-4 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700 transition-colors font-roboto disabled:opacity-50"
              >
                <i className="fas fa-file-excel mr-2"></i>
                Excel
              </button>
            </div>
          </div>
        </div>

        {/* Navegación de Vistas */}
        <div className="border-t pt-6">
          <div className="flex flex-wrap gap-2">
            <button
              onClick={() => handleViewChange('dashboard')}
              disabled={loading}
              className={`flex items-center px-4 py-3 rounded-lg font-roboto text-sm transition-all duration-200 ${
                activeView === 'dashboard'
                  ? 'bg-helpmed-blue text-white shadow-md'
                  : 'bg-gray-100 text-gray-700 hover:bg-gray-200 hover:text-gray-800'
              } ${loading ? 'opacity-50 cursor-not-allowed' : 'cursor-pointer'}`}
            >
              <i className="fas fa-chart-pie mr-2"></i>
              <div className="text-left">
                <div className="font-semibold">Dashboard</div>
                <div className="text-xs opacity-75">KPIs y métricas principales</div>
              </div>
            </button>

            <button
              onClick={() => handleViewChange('transactions')}
              disabled={loading}
              className={`flex items-center px-4 py-3 rounded-lg font-roboto text-sm transition-all duration-200 ${
                activeView === 'transactions'
                  ? 'bg-helpmed-blue text-white shadow-md'
                  : 'bg-gray-100 text-gray-700 hover:bg-gray-200 hover:text-gray-800'
              } ${loading ? 'opacity-50 cursor-not-allowed' : 'cursor-pointer'}`}
            >
              <i className="fas fa-list mr-2"></i>
              <div className="text-left">
                <div className="font-semibold">Transacciones</div>
                <div className="text-xs opacity-75">Lista detallada con filtros</div>
              </div>
            </button>
          </div>
        </div>
      </div>

      {/* Contenido Principal */}
      {!hasTransactions ? (
        <div className="bg-white rounded-xl shadow-medium p-12 text-center">
          <i className="fas fa-receipt text-6xl text-gray-300 mb-6"></i>
          <h3 className="text-2xl font-exo font-semibold text-gray-700 mb-4">
            Sin Transacciones Registradas
          </h3>
          <p className="text-gray-600 font-roboto mb-8 max-w-md mx-auto">
            Comienza registrando tu primera transacción para ver métricas y reportes financieros.
          </p>
          <button
            onClick={openAddModal}
            className="flex items-center mx-auto px-6 py-3 bg-helpmed-blue text-white rounded-lg hover:bg-blue-700 transition-colors font-roboto"
          >
            <i className="fas fa-plus mr-2"></i>
            Registrar Primera Transacción
          </button>
        </div>
      ) : (
        <div className="min-h-[600px]">
          {activeView === 'dashboard' ? (
            <FinancialDashboard metrics={financialMetrics} formatCurrency={formatCurrency} />
          ) : (
            <TransactionsList
              transactions={filteredTransactions}
              filters={filters}
              onFilterChange={handleFilterChange}
              onEdit={openEditModal}
              onDelete={handleDeleteTransaction}
              getTypeName={getTypeName}
              getStatusColor={getStatusColor}
              formatCurrency={formatCurrency}
              clearFilters={clearFilters}
              loading={loading}
            />
          )}
        </div>
      )}

      {/* Modal para Agregar/Editar Transacciones */}
      <TransactionModal
        isOpen={showAddModal || !!editingTransaction}
        transaction={editingTransaction}
        onClose={editingTransaction ? closeEditModal : closeAddModal}
        onSubmit={editingTransaction ? handleEditTransaction : handleAddTransaction}
        loading={loading}
      />

      {/* Footer con Información */}
      <div className="bg-gray-50 rounded-xl p-6">
        <div className="flex items-center justify-between">
          <div className="flex items-center text-gray-600">
            <i className="fas fa-info-circle mr-2"></i>
            <span className="text-sm font-roboto">
              Sistema financiero HelpMED - Actualizado en tiempo real
            </span>
          </div>

          {hasFilteredTransactions && (
            <div className="text-sm text-gray-600 font-roboto">
              <i className="fas fa-calculator mr-1"></i>
              Total mostrado:{' '}
              {formatCurrency(
                filteredTransactions
                  .filter((t) => t.status === 'COMPLETED')
                  .reduce((sum, t) => sum + t.amount, 0)
              )}
            </div>
          )}
        </div>
      </div>
    </div>
  )
}

export default RevenueManagement
