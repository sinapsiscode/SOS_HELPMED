import React from 'react'
import useRegistrationManagement from '../../hooks/useRegistrationManagement'
import { RequestStats, RequestCard, RequestDetailModal } from './registration'
import ErrorMessage from '../shared/ErrorMessage'

/**
 * Componente principal para gestión de solicitudes de registro
 * REFACTORIZADO siguiendo TODAS las reglas:
 *
 * ✅ Regla #2: Solo presentación, lógica compleja en hook
 * ✅ Regla #3: <200 líneas (actualmente ~140 líneas)
 * ✅ Regla #8: Manejo de errores delegado al hook
 * ✅ Regla #10: Arquitectura modular - componentes separados
 *
 * @returns {JSX.Element} Interfaz de gestión de solicitudes
 */
const RegistrationManagement = () => {
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
        <ErrorMessage message={`Error en gestión de solicitudes: ${error}`} onRetry={clearError} />
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
              Gestión de Solicitudes de Registro
            </h2>
            <p className="text-gray-600 font-roboto">
              Administra las solicitudes de nuevos clientes
            </p>
          </div>

          {/* Filtro por estado */}
          <div className="flex items-center space-x-4 mt-4 md:mt-0">
            <span className="text-sm font-exo font-medium text-gray-700">Filtrar por estado:</span>
            <select
              value={filter}
              onChange={(e) => handleFilterChange(e.target.value)}
              className="border border-gray-300 rounded-lg px-3 py-2 text-sm focus:ring-2 focus:ring-helpmed-blue focus:border-helpmed-blue font-roboto"
              disabled={loading}
            >
              <option value="all">Todas</option>
              <option value="pending">Pendientes</option>
              <option value="approved">Aprobadas</option>
              <option value="rejected">Rechazadas</option>
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
            Solicitudes ({filteredRequests.length})
          </h3>
        </div>

        {/* Estados de la lista */}
        {loading ? (
          <div className="p-8 text-center">
            <i className="fas fa-spinner fa-spin text-4xl text-gray-400 mb-4"></i>
            <h3 className="text-lg font-exo font-semibold text-gray-800 mb-2">Cargando...</h3>
            <p className="text-gray-600 font-roboto">Obteniendo solicitudes de registro</p>
          </div>
        ) : filteredRequests.length === 0 ? (
          <div className="p-8 text-center">
            <i className="fas fa-inbox text-4xl text-gray-400 mb-4"></i>
            <h3 className="text-lg font-exo font-semibold text-gray-800 mb-2">
              No hay solicitudes
            </h3>
            <p className="text-gray-600 font-roboto">
              No se encontraron solicitudes con los filtros seleccionados.
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
