import React from 'react'

/**
 * Estado de la ubicación actual
 * Siguiendo Regla #3: Componente específico <200 líneas
 * Siguiendo Regla #2: Solo presentación
 *
 * @param {Object} props - Props del componente
 * @param {Object} props.currentCoordinates - Coordenadas actuales
 * @returns {JSX.Element} Estado de ubicación
 */
const LocationStatus = ({ currentCoordinates }) => {
  if (!currentCoordinates) return null

  return (
    <div className="bg-green-50 border border-green-200 rounded-xl p-4">
      <div className="flex items-center justify-between">
        <div className="flex items-center space-x-2">
          <i className="fas fa-map-marker-alt text-green-600"></i>
          <span className="text-green-700 font-semibold font-roboto">Ubicación actualizada</span>
        </div>
        <span className="text-green-600 text-sm font-roboto">
          Precisión: {currentCoordinates.accuracy.toFixed(1)}m
        </span>
      </div>
    </div>
  )
}

export default LocationStatus
