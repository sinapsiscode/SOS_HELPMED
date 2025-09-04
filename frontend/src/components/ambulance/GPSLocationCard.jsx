import React from 'react'

/**
 * Componente para mostrar información GPS de la ambulancia
 * Siguiendo el diseño específico de la imagen
 *
 * @param {Object} props - Props del componente
 * @param {Object} props.location - Ubicación actual con lat, lng
 * @param {number} props.precision - Precisión en metros
 * @param {string} props.lastUpdate - Última actualización
 * @returns {JSX.Element} Tarjeta de ubicación GPS
 */
const GPSLocationCard = ({ 
  location = { lat: -12.089900, lng: -77.046900 },
  precision = 6762,
  lastUpdate = '11:09:44 p. m.'
}) => {
  const formatCoordinate = (coord) => {
    return coord ? coord.toFixed(6) : '0.000000'
  }

  return (
    <div className="bg-white rounded-lg shadow p-6">
      <h2 className="text-lg font-semibold text-gray-900 mb-4">Ubicación GPS</h2>
      
      <div className="space-y-4">
        <div className="flex justify-between items-center">
          <span className="text-gray-600">Latitud:</span>
          <span className="text-gray-900 font-mono">{formatCoordinate(location.lat)}</span>
        </div>

        <div className="flex justify-between items-center">
          <span className="text-gray-600">Longitud:</span>
          <span className="text-gray-900 font-mono">{formatCoordinate(location.lng)}</span>
        </div>

        <div className="flex justify-between items-center">
          <span className="text-gray-600">Precisión:</span>
          <span className="text-gray-900">{precision}m</span>
        </div>

        <div className="flex justify-between items-center">
          <span className="text-gray-600">Actualizado:</span>
          <span className="text-gray-900">{lastUpdate}</span>
        </div>
      </div>
    </div>
  )
}

export default GPSLocationCard