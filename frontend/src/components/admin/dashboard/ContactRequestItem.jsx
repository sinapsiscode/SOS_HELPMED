import React from 'react'

/**
 * Componente individual de solicitud de contacto
 * Diseño exacto según imagen de referencia con Tailwind preciso
 */
const ContactRequestItem = ({ request, onContactClient, onViewDetail }) => {
  const formatDate = (date) => {
    const d = new Date(date)
    return `${d.getDate().toString().padStart(2, '0')}-${(d.getMonth() + 1).toString().padStart(2, '0')}-${d.getFullYear()}`
  }

  return (
    <div className="bg-white border-b border-gray-200 px-4 py-3">
      {/* Header with name and status */}
      <div className="flex items-start justify-between mb-2">
        <div className="flex items-center gap-3">
          <div className="w-6 h-6 bg-orange-500 rounded-full flex items-center justify-center">
            <span className="text-white text-xs font-bold">!</span>
          </div>
          <div className="font-semibold text-gray-900 text-base">{request.userName}</div>
        </div>
        <span className="px-3 py-1 bg-orange-50 text-orange-600 border border-orange-200 rounded-full text-xs font-medium">
          ALTA
        </span>
      </div>

      {/* Badges */}
      <div className="flex gap-2 mb-3 ml-9">
        <span className="px-2 py-1 bg-blue-100 text-blue-700 rounded text-xs font-medium">
          Familiar
        </span>
        {request.serviceType === 'TRASLADO_PROGRAMADO' && (
          <span className="px-2 py-1 bg-red-100 text-red-700 rounded text-xs font-medium inline-flex items-center gap-1">
            <i className="fas fa-exclamation-triangle" style={{ fontSize: '9px' }}></i>
            Zona Protegida
          </span>
        )}
      </div>

      {/* Details */}
      <div className="mb-3 ml-9">
        <div className="text-sm text-gray-700 mb-1">
          <span className="font-medium">Motivo:</span> Zona Protegida - Solo 1 restante
        </div>
        <div className="text-sm text-gray-700">
          <span className="font-medium">Plan:</span> {request.planName}
        </div>
      </div>

      {/* Cards */}
      <div className="grid grid-cols-2 gap-3 mb-3 ml-9">
        {/* Uso de Servicios Card */}
        <div className="bg-blue-50 rounded-lg p-3">
          <div className="flex items-center gap-2 mb-2">
            <i className="fas fa-chart-line text-blue-600" style={{ fontSize: '12px' }}></i>
            <span className="text-xs font-medium text-blue-700">Uso de Servicios</span>
          </div>
          <div className="text-sm font-semibold text-blue-800">
            0/1 (Zona Protegida)
          </div>
        </div>

        {/* Contacto Card */}
        <div className="bg-green-50 rounded-lg p-3">
          <div className="flex items-center gap-2 mb-2">
            <i className="fas fa-phone text-green-600" style={{ fontSize: '12px' }}></i>
            <span className="text-xs font-medium text-green-700">Contacto</span>
          </div>
          <div className="text-xs text-gray-800">
            <div className="font-medium">{request.contactPhone}</div>
            <div className="text-green-600">{request.contactEmail}</div>
          </div>
        </div>
      </div>

      {/* Footer with dates and buttons */}
      <div className="flex items-center justify-between pt-3 border-t border-gray-100">
        <div className="text-xs text-gray-500 ml-9">
          <span>Solicitud: {formatDate(request.requestDate)}</span>
          <span className="ml-4">Último servicio: {formatDate(request.lastServiceDate)}</span>
        </div>
        <div className="flex gap-3">
          <button
            onClick={() => onContactClient && onContactClient(request)}
            className="bg-green-600 hover:bg-green-700 text-white px-4 py-2 rounded-full text-sm font-medium inline-flex items-center gap-2 transition-colors"
          >
            <i className="fas fa-phone" style={{ fontSize: '11px' }}></i>
            Contactar
          </button>
          <button
            onClick={() => onViewDetail && onViewDetail(request)}
            className="bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded-full text-sm font-medium inline-flex items-center gap-2 transition-colors"
          >
            <i className="fas fa-eye" style={{ fontSize: '11px' }}></i>
            Ver Detalle
          </button>
        </div>
      </div>
    </div>
  )
}

export default ContactRequestItem