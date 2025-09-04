import React from 'react'

/**
 * Vista de mapa para emergencias
 * ENFOQUE BALANCEADO: Solo presentación con validación de props
 *
 * @param {Array} emergencies - Lista de emergencias
 * @param {Function} onSelectEmergency - Función para seleccionar emergencia
 */
const EmergencyMapView = ({ emergencies, onSelectEmergency }) => {
  // ============================================
  // VALIDACIÓN DE PROPS (Regla #4)
  // ============================================
  if (!Array.isArray(emergencies)) {
    console.error('EmergencyMapView: emergencies debe ser un array')
    return null
  }

  if (typeof onSelectEmergency !== 'function') {
    console.error('EmergencyMapView: onSelectEmergency debe ser una función')
    return null
  }

  return (
    <div className="bg-white rounded-xl shadow-medium p-6">
      <h2 className="text-lg font-bold text-gray-800 mb-4">Mapa de Emergencias</h2>
      <div className="h-96 bg-gray-100 rounded-lg flex items-center justify-center">
        <div className="text-center text-gray-500">
          <i className="fas fa-map text-4xl mb-4"></i>
          <p className="mb-2">Mapa interactivo de emergencias activas</p>
          <p className="text-sm">Mostraría la ubicación en tiempo real de todas las emergencias</p>
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
                  className={`text-xs ${emergency.priority === 'CRITICA' ? 'text-red-600' : 'text-yellow-600'}`}
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
