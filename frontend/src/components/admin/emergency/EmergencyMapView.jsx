import React from 'react'
import { LABELS } from '../../../config/labels'

/**
 * ${LABELS.admin.emergency.emergencyMapView.comments.title}
 * ${LABELS.admin.emergency.emergencyMapView.comments.approach}
 *
 * @param {Array} emergencies - Lista de emergencias
 * @param {Function} onSelectEmergency - Función para seleccionar emergencia
 */
const EmergencyMapView = ({ emergencies, onSelectEmergency }) => {
  const labels = LABELS.admin.emergency.emergencyMapView

  // ============================================
  // VALIDACIÓN DE PROPS (Regla #4)
  // ============================================
  if (!Array.isArray(emergencies)) {
    console.error(labels.errors.emergenciesRequired)
    return null
  }

  if (typeof onSelectEmergency !== 'function') {
    console.error(labels.errors.onSelectRequired)
    return null
  }

  return (
    <div className="bg-white rounded-xl shadow-medium p-6">
      <h2 className="text-lg font-bold text-gray-800 mb-4">{labels.title}</h2>
      <div className="h-96 bg-gray-100 rounded-lg flex items-center justify-center">
        <div className="text-center text-gray-500">
          <i className="fas fa-map text-4xl mb-4"></i>
          <p className="mb-2">{labels.placeholder.title}</p>
          <p className="text-sm">{labels.placeholder.description}</p>
          <div className="mt-4 grid grid-cols-2 gap-2 max-w-md">
            {emergencies.map((emergency) => (
              <button
                key={emergency.id}
                onClick={() => onSelectEmergency(emergency)}
                className="text-left p-2 bg-white rounded border hover:border-red-500 text-xs"
              >
                <div className="font-medium">{emergency.id}</div>
                <div className="text-gray-600">{emergency.location?.landmark}</div>
                <div
                  className={`text-xs ${emergency.priority === labels.priorityValue.critical ? 'text-red-600' : 'text-yellow-600'}`}
                >
                  {emergency.priority}
                </div>
              </button>
            ))}
          </div>
        </div>
      </div>
    </div>
  )
}

export default EmergencyMapView
