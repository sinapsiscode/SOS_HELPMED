import React from 'react'

/**
 * Componente para mostrar lista de traslados programados
 *  Separado del componente principal
 *  Props claramente definidos
 *  Responsabilidad única: Display transfers list
 */
const TransfersList = ({ transfers, onCancelTransfer }) => {
  /**
   * Obtener icono según el estado del traslado
   */
  const getStatusIcon = (status) => {
    switch (status) {
      case 'scheduled':
        return 'fas fa-clock text-blue-600'
      case 'in_progress':
        return 'fas fa-ambulance text-orange-600'
      case 'completed':
        return 'fas fa-check-circle text-green-600'
      case 'cancelled':
        return 'fas fa-times-circle text-red-600'
      default:
        return 'fas fa-clock text-gray-600'
    }
  }

  /**
   * Obtener texto del estado
   */
  const getStatusText = (status) => {
    switch (status) {
      case 'scheduled':
        return 'Programado'
      case 'in_progress':
        return 'En Progreso'
      case 'completed':
        return 'Completado'
      case 'cancelled':
        return 'Cancelado'
      default:
        return 'Pendiente'
    }
  }

  /**
   * Obtener clases CSS para el estado
   */
  const getStatusClasses = (status) => {
    switch (status) {
      case 'scheduled':
        return 'bg-blue-100 text-blue-800'
      case 'in_progress':
        return 'bg-orange-100 text-orange-800'
      case 'completed':
        return 'bg-green-100 text-green-800'
      case 'cancelled':
        return 'bg-red-100 text-red-800'
      default:
        return 'bg-gray-100 text-gray-800'
    }
  }

  if (transfers.length === 0) {
    return (
      <div className="bg-white rounded-xl shadow-medium p-6 sm:p-8 text-center">
        <i className="fas fa-calendar-alt text-3xl sm:text-4xl text-gray-400 mb-4"></i>
        <h3 className="text-base sm:text-lg font-semibold text-gray-800 mb-2">
          No tienes traslados programados
        </h3>
        <p className="text-sm sm:text-base text-gray-600">
          Programa tu primer traslado usando el calendario
        </p>
      </div>
    )
  }

  return (
    <div className="bg-white rounded-xl shadow-medium overflow-hidden">
      <div className="px-4 sm:px-6 py-3 sm:py-4 border-b border-gray-200">
        <h3 className="text-base sm:text-lg font-semibold text-gray-800">
          Mis Traslados Programados ({transfers.length})
        </h3>
      </div>

      <div className="divide-y divide-gray-200">
        {transfers.map((transfer) => (
          <div key={transfer.id} className="p-4 sm:p-6 hover:bg-gray-50 transition-colors">
            <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between space-y-3 lg:space-y-0">
              <div className="flex-1 min-w-0">
                <div className="flex flex-col sm:flex-row sm:items-center space-y-2 sm:space-y-0 sm:space-x-3 mb-3">
                  <div className="flex items-center space-x-2">
                    <i className={getStatusIcon(transfer.status)}></i>
                    <h4 className="text-base sm:text-lg font-semibold text-gray-800 truncate">
                      {transfer.destination}
                    </h4>
                  </div>
                  <span
                    className={`px-2 py-1 rounded-full text-xs font-medium self-start ${getStatusClasses(transfer.status)}`}
                  >
                    {getStatusText(transfer.status)}
                  </span>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-2 sm:gap-4 text-sm text-gray-600">
                  <div className="flex items-center space-x-1">
                    <i className="fas fa-calendar text-xs"></i>
                    <span>
                      {new Date(transfer.scheduledDate).toLocaleDateString('es-CL', {
                        day: '2-digit',
                        month: '2-digit',
                        year: 'numeric'
                      })}
                    </span>
                  </div>
                  <div className="flex items-center space-x-1">
                    <i className="fas fa-clock text-xs"></i>
                    <span>
                      {new Date(transfer.scheduledDate).toLocaleTimeString('es-CL', {
                        hour: '2-digit',
                        minute: '2-digit',
                        hour12: false
                      })}
                    </span>
                  </div>
                  <div className="flex items-center space-x-1">
                    <i className="fas fa-user text-xs"></i>
                    <span className="truncate">{transfer.patientName}</span>
                  </div>
                  <div className="flex items-center space-x-1">
                    <i className="fas fa-stethoscope text-xs"></i>
                    <span className="truncate">{transfer.reason}</span>
                  </div>
                </div>

                <div className="mt-2 grid grid-cols-1 sm:grid-cols-2 gap-2 text-sm text-gray-600">
                  <div className="flex items-start space-x-1">
                    <i className="fas fa-map-marker-alt text-xs mt-0.5 text-green-600"></i>
                    <span className="truncate">
                      <span className="font-medium">Origen:</span> {transfer.origin}
                    </span>
                  </div>
                  <div className="flex items-start space-x-1">
                    <i className="fas fa-map-marker-alt text-xs mt-0.5 text-red-600"></i>
                    <span className="truncate">
                      <span className="font-medium">Destino:</span> {transfer.destination}
                    </span>
                  </div>
                </div>

                {transfer.specialRequirements && (
                  <div className="mt-2 flex items-start space-x-1 text-sm">
                    <i className="fas fa-info-circle text-xs mt-0.5 text-blue-600"></i>
                    <span className="text-blue-800">
                      <span className="font-medium">Req. especiales:</span> {transfer.specialRequirements}
                    </span>
                  </div>
                )}

                {transfer.isRoundTrip && (
                  <div className="mt-2 flex items-center space-x-1 text-sm">
                    <i className="fas fa-exchange-alt text-xs text-purple-600"></i>
                    <span className="text-purple-800 font-medium">Traslado de ida y vuelta</span>
                  </div>
                )}

                {transfer.waitingType === 'con_espera' && (
                  <div className="mt-2 flex items-center space-x-1 text-sm">
                    <i className="fas fa-hourglass-half text-xs text-yellow-600"></i>
                    <span className="text-yellow-800">
                      <span className="font-medium">Espera:</span> {transfer.waitingTime} minutos
                    </span>
                  </div>
                )}
              </div>

              {/* Acciones */}
              <div className="flex flex-col sm:flex-row space-y-2 sm:space-y-0 sm:space-x-2 flex-shrink-0">
                <button className="px-3 py-2 text-blue-600 border border-blue-200 rounded-lg hover:bg-blue-50 transition-colors text-sm">
                  <i className="fas fa-eye mr-1 sm:mr-2"></i>
                  <span className="hidden sm:inline">Ver Detalles</span>
                  <span className="sm:hidden">Detalles</span>
                </button>

                {(transfer.status === 'scheduled') && (
                  <button
                    onClick={() => onCancelTransfer(transfer.id)}
                    className="px-3 py-2 text-red-600 border border-red-200 rounded-lg hover:bg-red-50 transition-colors text-sm"
                  >
                    <i className="fas fa-times mr-1 sm:mr-2"></i>
                    <span className="hidden sm:inline">Cancelar</span>
                    <span className="sm:hidden">Cancelar</span>
                  </button>
                )}

                {transfer.status === 'completed' && (
                  <button className="px-3 py-2 text-green-600 border border-green-200 rounded-lg hover:bg-green-50 transition-colors text-sm">
                    <i className="fas fa-star mr-1 sm:mr-2"></i>
                    <span className="hidden sm:inline">Evaluar</span>
                    <span className="sm:hidden">Evaluar</span>
                  </button>
                )}
              </div>
            </div>

            {transfer.notes && (
              <div className="mt-3 pt-3 border-t border-gray-100">
                <div className="flex items-start space-x-2 text-sm">
                  <i className="fas fa-sticky-note text-xs mt-0.5 text-gray-500"></i>
                  <div>
                    <span className="font-medium text-gray-700">Notas:</span>
                    <p className="text-gray-600 mt-1">{transfer.notes}</p>
                  </div>
                </div>
              </div>
            )}
          </div>
        ))}
      </div>
    </div>
  )
}

export default TransfersList