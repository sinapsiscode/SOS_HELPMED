import React from 'react'
import { LABELS } from '../../config/labels'
import useRegistrationManagement from '../../hooks/useRegistrationManagement'
import { RequestStats, RequestCard, RequestDetailModal } from './registration'
import ErrorMessage from '../shared/ErrorMessage'

/**
 * ${LABELS.admin.registrationManagement.comments.title}
 * ${LABELS.admin.registrationManagement.comments.refactored}
 *
 * ${LABELS.admin.registrationManagement.comments.rules.rule2}
 * ${LABELS.admin.registrationManagement.comments.rules.rule3}
 * ${LABELS.admin.registrationManagement.comments.rules.rule8}
 * ${LABELS.admin.registrationManagement.comments.rules.rule10}
 *
 * @returns {JSX.Element} Interfaz de gestión de solicitudes
 */
const RegistrationManagement = () => {
  const labels = LABELS.admin.registrationManagement
  // Hook que maneja toda la lógica compleja (Regla #2)
  const {
    filteredRequests,
    requestStats,
    filter,
    selectedRequest,
    loading,
    error,
    handleApprove,
    handleReject,
    handleActivateServices,
    getStatusColor,
    getStatusIcon,
    getPlanTypeName,
    handleFilterChange,
    openRequestDetail,
    closeRequestDetail,
    clearError
  } = useRegistrationManagement()

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
      {/* Header y Filtros */}
      <div className="bg-white rounded-xl shadow-medium p-6">
        <div className="flex flex-col md:flex-row md:items-center md:justify-between mb-6">
          <div>
            <h2 className="text-2xl font-exo font-bold text-gray-800">
              {labels.header.title}
            </h2>
            <p className="text-gray-600 font-roboto">
              {labels.header.subtitle}
            </p>
          </div>

          {/* Filtro por estado */}
          <div className="flex items-center space-x-4 mt-4 md:mt-0">
            <span className="text-sm font-exo font-medium text-gray-700">{labels.filters.label}</span>
            <select
              value={filter}
              onChange={(e) => handleFilterChange(e.target.value)}
              className="border border-gray-300 rounded-lg px-3 py-2 text-sm focus:ring-2 focus:ring-helpmed-blue focus:border-helpmed-blue font-roboto"
              disabled={loading}
            >
              <option value="all">{labels.filters.options.all}</option>
              <option value="pending">{labels.filters.options.pending}</option>
              <option value="approved">{labels.filters.options.approved}</option>
              <option value="rejected">{labels.filters.options.rejected}</option>
            </select>
          </div>
        </div>

        {/* Estadísticas */}
        <RequestStats requestStats={requestStats} />
      </div>

      {/* Lista de Solicitudes */}
      <div className="bg-white rounded-xl shadow-medium overflow-hidden">
        <div className="px-6 py-4 border-b border-gray-200">
          <h3 className="text-lg font-exo font-semibold text-gray-800">
            {labels.list.title.replace('{count}', filteredRequests.length)}
          </h3>
        </div>

        {/* Estados de la lista */}
        {loading ? (
          <div className="p-8 text-center">
            <i className="fas fa-spinner fa-spin text-4xl text-gray-400 mb-4"></i>
            <h3 className="text-lg font-exo font-semibold text-gray-800 mb-2">{labels.list.loading.title}</h3>
            <p className="text-gray-600 font-roboto">{labels.list.loading.message}</p>
          </div>
        ) : filteredRequests.length === 0 ? (
          <div className="p-8 text-center">
            <i className="fas fa-inbox text-4xl text-gray-400 mb-4"></i>
            <h3 className="text-lg font-exo font-semibold text-gray-800 mb-2">
              {labels.list.empty.title}
            </h3>
            <p className="text-gray-600 font-roboto">
              {labels.list.empty.message}
            </p>
          </div>
        ) : (
          <div className="divide-y divide-gray-200">
            {filteredRequests.map((request) => (
              <RequestCard
                key={request.id}
                request={request}
                onApprove={handleApprove}
                onReject={handleReject}
                onActivateServices={handleActivateServices}
                onViewDetail={openRequestDetail}
                getStatusColor={getStatusColor}
                getStatusIcon={getStatusIcon}
                getPlanTypeName={getPlanTypeName}
              />
            ))}
          </div>
        )}
      </div>

      {/* Modal de Detalle */}
      {selectedRequest && (
        <RequestDetailModal
          request={selectedRequest}
          onClose={closeRequestDetail}
          onApprove={handleApprove}
          onReject={handleReject}
          onActivateServices={handleActivateServices}
          getPlanTypeName={getPlanTypeName}
        />
      )}
    </div>
  )
}

export default RegistrationManagement
