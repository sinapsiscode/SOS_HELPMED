import React from 'react'

/**
 * Tarjeta de emergencia individual para vista grid
 * ENFOQUE BALANCEADO: Solo presentación con validación de props
 *
 * @param {Object} emergency - Datos de la emergencia
 * @param {Function} onSelect - Función para seleccionar emergencia
 * @param {Function} onAssignUnit - Función para asignar unidad
 * @param {Function} onUpdateStatus - Función para actualizar estado
 * @param {Function} onAddNote - Función para agregar nota
 * @param {Function} onSetArrivalTime - Función para establecer tiempo llegada
 * @param {Function} getPriorityCardColor - Función para obtener color prioridad
 * @param {Function} getStatusColor - Función para obtener color estado
 * @param {Function} getElapsedTime - Función para calcular tiempo transcurrido
 * @param {boolean} isSelected - Si la emergencia está seleccionada
 */
const EmergencyCard = ({
  emergency,
  onSelect,
  onAssignUnit,
  onUpdateStatus,
  onAddNote,
  onSetArrivalTime,
  getPriorityCardColor,
  getStatusColor,
  getElapsedTime,
  isSelected
}) => {
  // ============================================
  // VALIDACIÓN DE PROPS (Regla #4)
  // ============================================
  if (!emergency) {
    console.error('EmergencyCard: emergency es requerido')
    return null
  }

  if (typeof onSelect !== 'function') {
    console.error('EmergencyCard: onSelect debe ser una función')
    return null
  }

  if (typeof getPriorityCardColor !== 'function') {
    console.error('EmergencyCard: getPriorityCardColor debe ser una función')
    return null
  }

  if (typeof getStatusColor !== 'function') {
    console.error('EmergencyCard: getStatusColor debe ser una función')
    return null
  }

  if (typeof getElapsedTime !== 'function') {
    console.error('EmergencyCard: getElapsedTime debe ser una función')
    return null
  }

  return (
    <div
      className={`border rounded-lg p-4 cursor-pointer transition-all ${
        isSelected ? 'border-blue-500 bg-blue-50' : 'border-gray-200 hover:border-gray-300'
      }`}
      onClick={onSelect}
    >
      <div className="flex items-start justify-between mb-3">
        <div>
          <h3 className="font-semibold text-gray-800">{emergency.id}</h3>
          <p className="text-sm text-gray-600">{emergency.type.replace(/_/g, ' ')}</p>
        </div>
        <div className="flex flex-col items-end space-y-1">
          <span
            className={`px-2 py-1 rounded-full text-xs font-medium border ${getPriorityCardColor(emergency.priority)}`}
          >
            {emergency.priority}
          </span>
          <span
            className={`px-2 py-1 rounded-full text-xs font-medium ${getStatusColor(emergency.status)}`}
          >
            {emergency.status.replace('_', ' ')}
          </span>
        </div>
      </div>

      <div className="space-y-2 text-sm text-gray-600 mb-3">
        <div className="flex items-center">
          <i className="fas fa-user w-4 mr-2"></i>
          <span>
            {emergency.patient?.name}, {emergency.patient?.age} años
          </span>
        </div>
        <div className="flex items-center">
          <i className="fas fa-map-marker-alt w-4 mr-2"></i>
          <span className="truncate">{emergency.location?.address}</span>
        </div>
        <div className="flex items-center">
          <i className="fas fa-clock w-4 mr-2"></i>
          <span>Hace {getElapsedTime(emergency.startTime)} min</span>
        </div>
        {emergency.assignedUnit && (
          <div className="flex items-center">
            <i className="fas fa-ambulance w-4 mr-2 text-blue-600"></i>
            <span className="text-blue-700">{emergency.assignedUnit.name}</span>
          </div>
        )}
        {emergency.estimatedArrivalTime && (
          <div className="flex items-center">
            <i className="fas fa-route w-4 mr-2 text-green-600"></i>
            <span className="text-green-700">Llegada: {emergency.estimatedArrivalTime} min</span>
          </div>
        )}
        {emergency.waitTime && (
          <div className="flex items-center">
            <i className="fas fa-hourglass-half w-4 mr-2 text-red-600"></i>
            <span className="text-red-700">Esperando {emergency.waitTime} min</span>
          </div>
        )}
      </div>

      {/* Botones de acción */}
      <div className="flex flex-wrap gap-2" onClick={(e) => e.stopPropagation()}>
        {!emergency.assignedUnit && emergency.status === 'PENDIENTE' && onAssignUnit && (
          <button
            onClick={() => onAssignUnit(emergency)}
            className="flex-1 bg-blue-600 hover:bg-blue-700 text-white py-1 px-2 rounded text-xs"
          >
            <i className="fas fa-ambulance mr-1"></i>Asignar
          </button>
        )}
        {emergency.assignedUnit && emergency.status !== 'COMPLETADA' && onSetArrivalTime && (
          <button
            onClick={() => onSetArrivalTime(emergency)}
            className="flex-1 bg-purple-600 hover:bg-purple-700 text-white py-1 px-2 rounded text-xs"
          >
            <i className="fas fa-clock mr-1"></i>Tiempo Llegada
          </button>
        )}
        {emergency.status !== 'COMPLETADA' && onUpdateStatus && (
          <button
            onClick={() => onUpdateStatus(emergency, 'COMPLETADA')}
            className="flex-1 bg-green-600 hover:bg-green-700 text-white py-1 px-2 rounded text-xs"
          >
            <i className="fas fa-check mr-1"></i>Completar
          </button>
        )}
        {onAddNote && (
          <button
            onClick={() => onAddNote(emergency)}
            className="flex-1 bg-gray-600 hover:bg-gray-700 text-white py-1 px-2 rounded text-xs"
          >
            <i className="fas fa-note-sticky mr-1"></i>Nota
          </button>
        )}
      </div>
    </div>
  )
}

export default EmergencyCard
