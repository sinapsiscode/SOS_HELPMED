import React from 'react'
import { Marker, Popup } from 'react-leaflet'

/**
 * Componente de marcadores de emergencias
 * ENFOQUE BALANCEADO: Solo presentación con validación de props
 *
 * @param {Array} emergencies - Lista de emergencias
 * @param {Function} getEmergencyIcon - Función para obtener icono
 * @param {Function} handleEmergencyClick - Función para click en emergencia
 * @param {Function} handleSetArrivalTime - Función para establecer tiempo de llegada
 */
const EmergencyMarkers = ({
  emergencies,
  getEmergencyIcon,
  handleEmergencyClick,
  handleSetArrivalTime,
  getPriorityClass
}) => {
  // ============================================
  // VALIDACIÓN DE PROPS (Regla #4)
  // ============================================
  if (!Array.isArray(emergencies)) {
    console.error('EmergencyMarkers: emergencies debe ser un array')
    return null
  }

  if (typeof getEmergencyIcon !== 'function') {
    console.error('EmergencyMarkers: getEmergencyIcon debe ser una función')
    return null
  }

  if (typeof handleEmergencyClick !== 'function') {
    console.error('EmergencyMarkers: handleEmergencyClick debe ser una función')
    return null
  }

  if (typeof handleSetArrivalTime !== 'function') {
    console.error('EmergencyMarkers: handleSetArrivalTime debe ser una función')
    return null
  }

  if (typeof getPriorityClass !== 'function') {
    console.error('EmergencyMarkers: getPriorityClass debe ser una función')
    return null
  }

  return (
    <>
      {emergencies.map((emergency) => (
        <Marker
          key={emergency.id}
          position={[
            emergency.location.coordinates.latitude,
            emergency.location.coordinates.longitude
          ]}
          icon={getEmergencyIcon(emergency)}
          eventHandlers={{
            click: () => handleEmergencyClick(emergency)
          }}
        >
          <Popup>
            <div className="w-64">
              <div className="flex items-center space-x-2 mb-2">
                <i className="fas fa-exclamation-triangle text-red-600"></i>
                <h4 className="font-exo font-semibold">{emergency.type.replace('_', ' ')}</h4>
                <span className={getPriorityClass(emergency.priority)}>
                  {emergency.priority.toUpperCase()}
                </span>
              </div>
              <div className="space-y-1 text-sm">
                <p>
                  <strong>Paciente:</strong> {emergency.affiliateInfo.name}
                </p>
                <p>
                  <strong>Descripción:</strong> {emergency.description}
                </p>
                <p>
                  <strong>Ubicación:</strong> {emergency.location.address}
                </p>
                <p>
                  <strong>Tiempo:</strong>{' '}
                  {Math.floor((Date.now() - emergency.timestamp) / (1000 * 60))} min
                </p>
              </div>
              <div className="space-y-2 mt-2">
                <button
                  onClick={() => handleSetArrivalTime(emergency.id)}
                  className="w-full bg-orange-500 hover:bg-orange-600 text-white px-3 py-1 rounded text-sm font-medium transition-colors"
                >
                  <i className="fas fa-clock mr-1"></i>
                  Establecer Tiempo de Llegada
                </button>
                <button
                  onClick={() => handleEmergencyClick(emergency)}
                  className="w-full bg-red-600 hover:bg-red-700 text-white px-3 py-1 rounded text-sm font-medium transition-colors"
                >
                  Seleccionar para Asignación
                </button>
              </div>
            </div>
          </Popup>
        </Marker>
      ))}
    </>
  )
}

export default EmergencyMarkers
