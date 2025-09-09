import React from 'react'
import { LABELS } from '../../config/labels'
import useRevenueManagement from '../../hooks/useRevenueManagement'
import { FinancialDashboard, TransactionsList, TransactionModal } from './revenue'
import ErrorMessage from '../shared/ErrorMessage'

/**
 * ${LABELS.admin.revenueManagement.comments.title}
 * ${LABELS.admin.revenueManagement.comments.refactored}
 *
 * ${LABELS.admin.revenueManagement.comments.rules.rule2}
 * ${LABELS.admin.revenueManagement.comments.rules.rule3}
 * ${LABELS.admin.revenueManagement.comments.rules.rule8}
 * ${LABELS.admin.revenueManagement.comments.rules.rule10}
 * ${LABELS.admin.revenueManagement.comments.rules.rule4}
 *
 * @returns {JSX.Element} Interfaz principal de gestión financiera
 */
const RevenueManagement = () => {
  const labels = LABELS.admin.revenueManagement
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
        <ErrorMessage message={labels.errors.managementError.replace('{error}', error)} onRetry={clearError} />
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
              {labels.header.title}
            </h1>
            <p className="text-gray-600 font-roboto mt-2">
              {labels.header.subtitle}
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
              {labels.buttons.newTransaction}
            </button>

            <div className="flex items-center space-x-2">
              <button
                onClick={() => handleExportReport('pdf')}
                disabled={loading || !hasFilteredTransactions}
                className="flex items-center px-4 py-2 bg-red-600 text-white rounded-lg hover:bg-red-700 transition-colors font-roboto disabled:opacity-50"
              >
                <i className="fas fa-file-pdf mr-2"></i>
                {labels.buttons.pdf}
              </button>

              <button
                onClick={() => handleExportReport('excel')}
                disabled={loading || !hasFilteredTransactions}
                className="flex items-center px-4 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700 transition-colors font-roboto disabled:opacity-50"
              >
                <i className="fas fa-file-excel mr-2"></i>
                {labels.buttons.excel}
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
                <div className="font-semibold">{labels.dashboard.title}</div>
                <div className="text-xs opacity-75">{labels.dashboard.subtitle}</div>
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
                <div className="font-semibold">{labels.transactions.title}</div>
                <div className="text-xs opacity-75">{labels.transactions.subtitle}</div>
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
            {labels.empty.title}
          </h3>
          <p className="text-gray-600 font-roboto mb-8 max-w-md mx-auto">
            {labels.empty.description}
          </p>
          <button
            onClick={openAddModal}
            className="flex items-center mx-auto px-6 py-3 bg-helpmed-blue text-white rounded-lg hover:bg-blue-700 transition-colors font-roboto"
          >
            <i className="fas fa-plus mr-2"></i>
            {labels.empty.registerFirst}
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
              {labels.footer.systemInfo}
            </span>
          </div>

          {hasFilteredTransactions && (
            <div className="text-sm text-gray-600 font-roboto">
              <i className="fas fa-calculator mr-1"></i>
              {labels.footer.totalShown}{' '}
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
