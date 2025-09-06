import React from 'react'
import { Marker, Popup } from 'react-leaflet'
import { LABELS } from '../../../config/labels'

/**
 * ${LABELS.admin.map.emergencyMarkers.comments.title}
 * ${LABELS.admin.map.emergencyMarkers.comments.approach}
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
  const labels = LABELS.admin.map.emergencyMarkers

  // ============================================
  // VALIDACIÓN DE PROPS (Regla #4)
  // ============================================
  if (!Array.isArray(emergencies)) {
    console.error(labels.errors.emergenciesArray)
    return null
  }

  if (typeof getEmergencyIcon !== 'function') {
    console.error(labels.errors.getEmergencyIconFunction)
    return null
  }

  if (typeof handleEmergencyClick !== 'function') {
    console.error(labels.errors.handleEmergencyClickFunction)
    return null
  }

  if (typeof handleSetArrivalTime !== 'function') {
    console.error(labels.errors.handleSetArrivalTimeFunction)
    return null
  }

  if (typeof getPriorityClass !== 'function') {
    console.error(labels.errors.getPriorityClassFunction)
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
                  <strong>{labels.popup.labels.patient}</strong> {emergency.affiliateInfo.name}
                </p>
                <p>
                  <strong>{labels.popup.labels.description}</strong> {emergency.description}
                </p>
                <p>
                  <strong>{labels.popup.labels.location}</strong> {emergency.location.address}
                </p>
                <p>
                  <strong>{labels.popup.labels.time}</strong>{' '}
                  {Math.floor((Date.now() - emergency.timestamp) / (1000 * 60))}{labels.popup.timeUnit}
                </p>
              </div>
              <div className="space-y-2 mt-2">
                <button
                  onClick={() => handleSetArrivalTime(emergency.id)}
                  className="w-full bg-orange-500 hover:bg-orange-600 text-white px-3 py-1 rounded text-sm font-medium transition-colors"
                >
                  <i className="fas fa-clock mr-1"></i>
                  {labels.popup.buttons.setArrivalTime}
                </button>
                <button
                  onClick={() => handleEmergencyClick(emergency)}
                  className="w-full bg-red-600 hover:bg-red-700 text-white px-3 py-1 rounded text-sm font-medium transition-colors"
                >
                  {labels.popup.buttons.selectForAssignment}
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
