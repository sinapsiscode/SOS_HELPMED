import React from 'react'

/**
 * Componente para mostrar solicitudes de registro pendientes
 * Siguiendo Regla #3: Componente específico <200 líneas
 * Siguiendo Regla #2: Solo presentación, datos del hook
 *
 * @param {Object} props - Props del componente
 * @param {Object} props.request - Solicitud de registro
 * @param {Function} props.onApprove - Función para aprobar solicitud
 * @param {Function} props.onReject - Función para rechazar solicitud
 * @returns {JSX.Element} Tarjeta de solicitud de registro
 */
const RegistrationRequestCard = ({ request, onApprove, onReject }) => {
  const getStatusBadge = (status) => {
    switch (status) {
      case 'pending':
        return (
          <span className="px-3 py-1 bg-yellow-100 text-yellow-800 rounded-full text-sm">
            Pendiente
          </span>
        )
      case 'approved':
        return (
          <span className="px-3 py-1 bg-green-100 text-green-800 rounded-full text-sm">
            Aprobada
          </span>
        )
      case 'rejected':
        return (
          <span className="px-3 py-1 bg-red-100 text-red-800 rounded-full text-sm">Rechazada</span>
        )
      default:
        return null
    }
  }

  const formatDate = (dateString) => {
    return new Date(dateString).toLocaleDateString('es-PE', {
      year: 'numeric',
      month: 'short',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    })
  }

  return (
    <div className="p-6 hover:bg-gray-50 transition-colors">
      <div className="flex items-start justify-between">
        <div className="flex-1">
          <div className="flex items-center space-x-4 mb-3">
            <h3 className="text-lg font-semibold text-gray-800">
              {request.name} {request.lastName}
            </h3>
            {getStatusBadge(request.status)}
            {request.planType === 'externo' && (
              <span className="px-3 py-1 bg-purple-100 text-purple-800 rounded-full text-sm">
                Cliente Externo
              </span>
            )}
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-4">
            <div className="space-y-2">
              <p className="text-sm text-gray-600">
                <i className="fas fa-envelope mr-2"></i>
                {request.email}
              </p>
              <p className="text-sm text-gray-600">
                <i className="fas fa-phone mr-2"></i>
                {request.phone}
              </p>
              <p className="text-sm text-gray-600">
                <i className="fas fa-id-card mr-2"></i>
                DNI: {request.dni}
              </p>
            </div>

            <div className="space-y-2">
              <p className="text-sm text-gray-600">
                <i className="fas fa-map-marker-alt mr-2"></i>
                {request.address}, {request.district}, {request.city}
              </p>
              <p className="text-sm text-gray-600">
                <i className="fas fa-calendar-alt mr-2"></i>
                Solicitud: {formatDate(request.requestDate)}
              </p>
              {request.planType === 'externo' && (
                <>
                  <p className="text-sm text-gray-600">
                    <i className="fas fa-building mr-2"></i>
                    Entidad:{' '}
                    <strong>
                      {request.externalEntity === 'other'
                        ? request.externalEntityOther
                        : request.externalEntity}
                    </strong>
                  </p>
                  {request.employeeId && (
                    <p className="text-sm text-gray-600">
                      <i className="fas fa-badge-check mr-2"></i>
                      Código: {request.employeeId}
                    </p>
                  )}
                </>
              )}
            </div>
          </div>

          <div className="bg-gray-50 rounded-lg p-3 mb-4">
            <p className="text-sm font-medium text-gray-700 mb-1">Plan Solicitado:</p>
            <p className="text-sm text-gray-600">
              {request.planType === 'externo'
                ? `Cliente Externo - ${request.planSubtype === 'caso1' ? 'Sin límites' : 'Con límites'}`
                : `${request.planType} - ${request.planSubtype}`}
            </p>
          </div>

          {request.medicalConditions && (
            <div className="bg-blue-50 rounded-lg p-3 mb-4">
              <p className="text-sm font-medium text-blue-700 mb-1">Condiciones Médicas:</p>
              <p className="text-sm text-blue-600">{request.medicalConditions}</p>
            </div>
          )}

          {request.comments && (
            <div className="bg-gray-50 rounded-lg p-3 mb-4">
              <p className="text-sm font-medium text-gray-700 mb-1">Comentarios:</p>
              <p className="text-sm text-gray-600">{request.comments}</p>
            </div>
          )}

          {request.status === 'rejected' && request.rejectionReason && (
            <div className="bg-red-50 rounded-lg p-3">
              <p className="text-sm font-medium text-red-700 mb-1">Motivo de rechazo:</p>
              <p className="text-sm text-red-600">{request.rejectionReason}</p>
            </div>
          )}
        </div>

        {request.status === 'pending' && (
          <div className="flex flex-col space-y-2 ml-4">
            <button
              onClick={onApprove}
              className="px-4 py-2 bg-green-600 hover:bg-green-700 text-white rounded-lg transition-colors"
            >
              <i className="fas fa-check mr-2"></i>
              Aprobar
            </button>
            <button
              onClick={onReject}
              className="px-4 py-2 bg-red-600 hover:bg-red-700 text-white rounded-lg transition-colors"
            >
              <i className="fas fa-times mr-2"></i>
              Rechazar
            </button>
          </div>
        )}
      </div>
    </div>
  )
}

export default RegistrationRequestCard
