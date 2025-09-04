import React from 'react'

/**
 * Panel de control para seguimiento de ubicación
 * Siguiendo Regla #3: Componente específico <200 líneas
 * Siguiendo Regla #2: Solo presentación
 *
 * @param {Object} props - Props del componente
 * @param {Object} props.location - Ubicación actual
 * @param {boolean} props.isTracking - Estado de seguimiento
 * @param {Function} props.onToggleTracking - Toggle de seguimiento
 * @param {Function} props.onGetCurrentLocation - Obtener ubicación actual
 * @param {string} props.eta - Tiempo estimado de llegada
 * @param {string} props.distance - Distancia estimada
 * @returns {JSX.Element} Panel de seguimiento de ubicación
 */
const LocationTrackingPanel = ({
  location,
  isTracking,
  onToggleTracking,
  onGetCurrentLocation,
  eta,
  distance
}) => {
  const formatCoordinate = (coord) => {
    return coord ? coord.toFixed(6) : '0.000000'
  }

  return (
    <div className="bg-white rounded-xl shadow-medium p-6">
      {/* Header */}
      <div className="flex items-center justify-between mb-6">
        <div>
          <h3 className="text-lg font-bold text-gray-800 font-exo">
            <i className="fas fa-map-marked-alt text-helpmed-blue mr-2"></i>
            Control de Ubicación
          </h3>
          <p className="text-gray-600 font-roboto text-sm mt-1">
            Gestión de geolocalización en tiempo real
          </p>
        </div>
      </div>

      {/* Estado actual de ubicación */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-6">
        <div className="bg-gray-50 rounded-lg p-4">
          <div className="flex items-center mb-2">
            <i className="fas fa-crosshairs text-blue-500 mr-2"></i>
            <h4 className="font-medium text-gray-700 font-roboto">Coordenadas Actuales</h4>
          </div>
          <div className="space-y-1">
            <p className="text-sm text-gray-600">
              <strong>Lat:</strong> {formatCoordinate(location?.lat)}
            </p>
            <p className="text-sm text-gray-600">
              <strong>Lng:</strong> {formatCoordinate(location?.lng)}
            </p>
          </div>
        </div>

        <div className="bg-gray-50 rounded-lg p-4">
          <div className="flex items-center mb-2">
            <i className="fas fa-route text-green-500 mr-2"></i>
            <h4 className="font-medium text-gray-700 font-roboto">Información de Ruta</h4>
          </div>
          <div className="space-y-1">
            <p className="text-sm text-gray-600">
              <strong>ETA:</strong> {eta}
            </p>
            <p className="text-sm text-gray-600">
              <strong>Distancia:</strong> {distance}
            </p>
          </div>
        </div>
      </div>

      {/* Controles de ubicación */}
      <div className="space-y-4">
        {/* Botón de seguimiento principal */}
        <div className="flex items-center justify-between p-4 bg-gray-50 rounded-lg">
          <div className="flex items-center">
            <div
              className={`w-3 h-3 rounded-full mr-3 ${
                isTracking ? 'bg-green-500 animate-pulse' : 'bg-gray-400'
              }`}
            ></div>
            <div>
              <p className="font-medium text-gray-800 font-roboto">Seguimiento en Tiempo Real</p>
              <p className="text-sm text-gray-600">
                {isTracking
                  ? 'La ubicación se está actualizando automáticamente'
                  : 'El seguimiento está pausado'}
              </p>
            </div>
          </div>

          <button
            onClick={onToggleTracking}
            className={`px-4 py-2 rounded-lg font-medium transition-colors ${
              isTracking
                ? 'bg-red-600 hover:bg-red-700 text-white'
                : 'bg-green-600 hover:bg-green-700 text-white'
            }`}
          >
            {isTracking ? (
              <>
                <i className="fas fa-stop mr-2"></i>
                Detener
              </>
            ) : (
              <>
                <i className="fas fa-play mr-2"></i>
                Iniciar
              </>
            )}
          </button>
        </div>

        {/* Botón de actualización manual */}
        <div className="flex items-center justify-between p-4 bg-blue-50 rounded-lg">
          <div className="flex items-center">
            <i className="fas fa-sync-alt text-blue-500 mr-3"></i>
            <div>
              <p className="font-medium text-gray-800 font-roboto">Actualización Manual</p>
              <p className="text-sm text-gray-600">Obtener ubicación actual una sola vez</p>
            </div>
          </div>

          <button
            onClick={onGetCurrentLocation}
            className="px-4 py-2 bg-blue-600 hover:bg-blue-700 text-white rounded-lg font-medium transition-colors"
          >
            <i className="fas fa-location-arrow mr-2"></i>
            Actualizar
          </button>
        </div>

        {/* Información adicional */}
        <div className="bg-yellow-50 border border-yellow-200 rounded-lg p-4">
          <div className="flex items-start">
            <i className="fas fa-info-circle text-yellow-600 mr-3 mt-0.5"></i>
            <div>
              <p className="text-sm font-medium text-yellow-800 mb-1">
                Información sobre el Seguimiento
              </p>
              <ul className="text-sm text-yellow-700 space-y-1">
                <li>• El seguimiento en tiempo real actualiza la ubicación cada 5 segundos</li>
                <li>• Asegúrese de permitir el acceso a la ubicación en su navegador</li>
                <li>• La precisión puede variar según las condiciones del GPS</li>
              </ul>
            </div>
          </div>
        </div>
      </div>

      {/* Estado del GPS */}
      <div className="mt-4 pt-4 border-t border-gray-200">
        <div className="flex items-center justify-between text-sm">
          <span className="text-gray-600">Estado del GPS:</span>
          <span className={`font-medium ${isTracking ? 'text-green-600' : 'text-gray-600'}`}>
            {isTracking ? 'Activo' : 'Inactivo'}
          </span>
        </div>
        <div className="flex items-center justify-between text-sm mt-1">
          <span className="text-gray-600">Última actualización:</span>
          <span className="text-gray-600">{new Date().toLocaleTimeString('es-PE')}</span>
        </div>
      </div>
    </div>
  )
}

export default LocationTrackingPanel
