import React from 'react'

/**
 * Componente para mostrar tarjetas de alertas de emergencia
 * Siguiendo Regla #3: Componente específico <200 líneas
 * Siguiendo Regla #2: Solo presentación
 *
 * @param {Object} props - Props del componente
 * @param {Object} props.alert - Datos de la alerta
 * @param {Function} props.onRespond - Función para responder
 * @param {Function} props.onComplete - Función para completar
 * @param {Function} props.onViewRoute - Función para ver ruta
 * @returns {JSX.Element} Tarjeta de alerta de emergencia
 */
const EmergencyAlertCard = ({ alert, onRespond, onComplete, onViewRoute }) => {
  const getPriorityColor = (priority) => {
    switch (priority) {
      case 'critical':
        return 'bg-red-100 text-red-800 border-red-200'
      case 'high':
        return 'bg-orange-100 text-orange-800 border-orange-200'
      case 'medium':
        return 'bg-yellow-100 text-yellow-800 border-yellow-200'
      case 'low':
        return 'bg-green-100 text-green-800 border-green-200'
      default:
        return 'bg-gray-100 text-gray-800 border-gray-200'
    }
  }

  const getStatusColor = (status) => {
    switch (status) {
      case 'active':
        return 'bg-red-100 text-red-800'
      case 'responding':
        return 'bg-blue-100 text-blue-800'
      case 'completed':
        return 'bg-green-100 text-green-800'
      default:
        return 'bg-gray-100 text-gray-800'
    }
  }

  const getEmergencyTypeIcon = (type) => {
    switch (type) {
      case 'cardiac':
        return 'fas fa-heartbeat text-red-500'
      case 'accident':
        return 'fas fa-car-crash text-orange-500'
      case 'respiratory':
        return 'fas fa-lungs text-blue-500'
      case 'medical':
        return 'fas fa-stethoscope text-green-500'
      default:
        return 'fas fa-exclamation-triangle text-yellow-500'
    }
  }

  const formatTime = (timestamp) => {
    const date = new Date(timestamp)
    const now = new Date()
    const diffMinutes = Math.floor((now - date) / (1000 * 60))

    if (diffMinutes < 1) return 'Ahora mismo'
    if (diffMinutes < 60) return `Hace ${diffMinutes} min`

    const diffHours = Math.floor(diffMinutes / 60)
    return `Hace ${diffHours}h ${diffMinutes % 60}min`
  }

  const getEmergencyTypeLabel = (type) => {
    const labels = {
      cardiac: 'Cardiaca',
      accident: 'Accidente',
      respiratory: 'Respiratoria',
      medical: 'Médica',
      trauma: 'Trauma',
      overdose: 'Sobredosis'
    }
    return labels[type] || 'General'
  }

  const getPriorityLabel = (priority) => {
    const labels = {
      critical: 'Crítica',
      high: 'Alta',
      medium: 'Media',
      low: 'Baja'
    }
    return labels[priority] || priority
  }

  return (
    <div className="bg-white border border-gray-200 rounded-xl shadow-sm hover:shadow-md transition-all duration-200 p-6">
      {/* Header con tipo de emergencia y prioridad */}
      <div className="flex items-center justify-between mb-4">
        <div className="flex items-center space-x-3">
          <div className="p-2 rounded-lg bg-gray-50">
            <i className={`${getEmergencyTypeIcon(alert.emergencyType)} text-xl`}></i>
          </div>
          <div>
            <h3 className="text-lg font-bold text-gray-800 font-exo">{alert.patientName}</h3>
            <p className="text-sm text-gray-600 font-roboto">
              {getEmergencyTypeLabel(alert.emergencyType)}
            </p>
          </div>
        </div>

        <div className="flex flex-col items-end space-y-2">
          <span
            className={`px-3 py-1 rounded-full text-xs font-medium border ${getPriorityColor(alert.priority)}`}
          >
            {getPriorityLabel(alert.priority)}
          </span>
          <span
            className={`px-3 py-1 rounded-full text-xs font-medium ${getStatusColor(alert.status)}`}
          >
            {alert.status === 'active'
              ? 'Activa'
              : alert.status === 'responding'
                ? 'Respondiendo'
                : 'Completada'}
          </span>
        </div>
      </div>

      {/* Información de ubicación y tiempo */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-4">
        <div className="space-y-2">
          <div className="flex items-start space-x-2">
            <i className="fas fa-map-marker-alt text-red-500 mt-1"></i>
            <div>
              <p className="text-sm font-medium text-gray-700">Ubicación</p>
              <p className="text-sm text-gray-600 font-roboto">{alert.location}</p>
            </div>
          </div>
        </div>

        <div className="space-y-2">
          <div className="flex items-start space-x-2">
            <i className="fas fa-clock text-blue-500 mt-1"></i>
            <div>
              <p className="text-sm font-medium text-gray-700">Tiempo</p>
              <p className="text-sm text-gray-600 font-roboto">{formatTime(alert.timestamp)}</p>
              {alert.estimatedTime && (
                <p className="text-xs text-green-600">ETA: {alert.estimatedTime}</p>
              )}
            </div>
          </div>
        </div>
      </div>

      {/* Notas de la emergencia */}
      {alert.notes && (
        <div className="bg-gray-50 rounded-lg p-3 mb-4">
          <p className="text-sm font-medium text-gray-700 mb-1">
            <i className="fas fa-notes-medical mr-1"></i>
            Notas
          </p>
          <p className="text-sm text-gray-600 font-roboto">{alert.notes}</p>
        </div>
      )}

      {/* Botones de acción */}
      <div className="flex flex-wrap gap-2">
        {alert.status === 'active' && (
          <>
            <button
              onClick={() => onRespond(alert.id)}
              className="flex-1 min-w-[120px] flex items-center justify-center px-4 py-2 bg-blue-600 hover:bg-blue-700 text-white rounded-lg transition-colors font-roboto text-sm"
            >
              <i className="fas fa-ambulance mr-2"></i>
              Responder
            </button>
            <button
              onClick={() => onViewRoute(alert)}
              className="flex items-center justify-center px-3 py-2 bg-gray-100 hover:bg-gray-200 text-gray-700 rounded-lg transition-colors"
              title="Ver ruta"
            >
              <i className="fas fa-route"></i>
            </button>
          </>
        )}

        {alert.status === 'responding' && (
          <button
            onClick={() => onComplete(alert.id)}
            className="flex-1 flex items-center justify-center px-4 py-2 bg-green-600 hover:bg-green-700 text-white rounded-lg transition-colors font-roboto text-sm"
          >
            <i className="fas fa-check-circle mr-2"></i>
            Completar
          </button>
        )}

        {alert.status === 'completed' && (
          <div className="flex-1 flex items-center justify-center px-4 py-2 bg-green-100 text-green-700 rounded-lg">
            <i className="fas fa-check-double mr-2"></i>
            <span className="font-roboto text-sm">Completada</span>
          </div>
        )}
      </div>
    </div>
  )
}

export default EmergencyAlertCard
