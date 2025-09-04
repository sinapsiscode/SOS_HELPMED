import React from 'react'

/**
 * Campo de entrada de ubicación
 * Siguiendo Regla #3: Componente específico <200 líneas
 * Siguiendo Regla #2: Solo presentación
 *
 * @param {Object} props - Props del componente
 * @param {string} props.selectedService - Tipo de servicio seleccionado
 * @param {string} props.location - Ubicación actual
 * @param {Function} props.onLocationChange - Función para cambiar ubicación
 * @param {Object} props.locationInfo - Información de ubicación
 * @param {Function} props.onGetLocation - Función para obtener GPS
 * @param {Function} props.onUseAddress - Función para usar dirección registrada
 * @param {boolean} props.isGettingLocation - Si está obteniendo ubicación
 * @returns {JSX.Element} Campo de ubicación
 */
const LocationInput = ({
  selectedService,
  location,
  onLocationChange,
  locationInfo,
  onGetLocation,
  onUseAddress,
  isGettingLocation
}) => {
  const isDomiciliaryService = ['URGENCIA', 'MEDICO_DOMICILIO', 'ZONA_PROTEGIDA'].includes(
    selectedService
  )

  const getServiceLocationMessage = () => {
    const messages = {
      ZONA_PROTEGIDA:
        'Zona Protegida: atención de emergencia/urgencia para terceros en tu dirección registrada',
      URGENCIA: 'Este servicio se realizará en tu dirección registrada',
      MEDICO_DOMICILIO: 'Este servicio se realizará en tu dirección registrada'
    }
    return messages[selectedService] || ''
  }

  const getLocationHint = () => {
    if (selectedService === 'EMERGENCIA') {
      return '💡 Recomendado: Usa el botón GPS 📍 para máxima precisión en emergencias'
    }
    if (isDomiciliaryService) {
      return '🏠 Los servicios domiciliarios se realizan en tu dirección registrada'
    }
    if (selectedService === 'ZONA_PROTEGIDA') {
      return '🛡️ Zona Protegida es para atender emergencias de terceros en tu domicilio'
    }
    return ''
  }

  return (
    <div>
      <label className="block text-sm font-medium text-gray-700 mb-2 font-exo">Ubicación</label>

      {/* Campo para servicios domiciliarios (no modificable) */}
      {isDomiciliaryService ? (
        <div className="relative">
          <input
            type="text"
            value={location}
            readOnly
            className="w-full border border-gray-300 bg-gray-50 rounded-lg px-3 py-2 text-gray-700 cursor-not-allowed font-roboto"
            placeholder="Dirección registrada del cliente"
          />
          <div className="absolute right-3 top-1/2 transform -translate-y-1/2">
            <i className="fas fa-home text-gray-500"></i>
          </div>
          <div className="mt-2 p-2 bg-blue-50 border border-blue-200 rounded-lg">
            <div className="flex items-center space-x-2 text-blue-700 text-sm">
              <i className="fas fa-info-circle"></i>
              <span className="font-roboto">{getServiceLocationMessage()}</span>
            </div>
          </div>
        </div>
      ) : (
        /* Campo para emergencias (modificable con GPS) */
        <div className="flex space-x-2">
          <input
            type="text"
            value={location}
            onChange={(e) => onLocationChange(e.target.value)}
            className="flex-1 border border-gray-300 rounded-lg px-3 py-2 focus:ring-2 focus:ring-primary-red focus:border-primary-red font-roboto"
            placeholder="Dirección completa o coordenadas GPS..."
            required
          />
          <button
            type="button"
            className="bg-blue-500 hover:bg-blue-600 text-white px-4 py-2 rounded-lg transition-colors flex items-center space-x-1"
            onClick={onGetLocation}
            disabled={isGettingLocation}
            title="Obtener ubicación GPS de alta precisión"
          >
            {isGettingLocation ? (
              <i className="fas fa-spinner fa-spin"></i>
            ) : (
              <i className="fas fa-map-marker-alt"></i>
            )}
          </button>
          <button
            type="button"
            className="bg-gray-500 hover:bg-gray-600 text-white px-4 py-2 rounded-lg transition-colors"
            onClick={onUseAddress}
            title="Usar dirección registrada"
          >
            <i className="fas fa-home"></i>
          </button>
        </div>
      )}

      {/* Indicador de ubicación GPS */}
      {locationInfo.hasGPS && (
        <div className="mt-2 p-2 bg-green-50 border border-green-200 rounded-lg">
          <div className="flex items-center justify-between text-sm">
            <div className="flex items-center space-x-2 text-green-700">
              <i className="fas fa-check-circle"></i>
              <span className="font-medium font-exo">Ubicación GPS registrada</span>
            </div>
            <span className="text-green-600 font-roboto">
              Precisión: {locationInfo.precision?.toFixed(1)}m
            </span>
          </div>
        </div>
      )}

      {/* Información adicional */}
      <div className="mt-2 space-y-1">
        <p className="text-xs text-gray-500 font-roboto">
          Dirección registrada: {locationInfo.registeredAddress}
        </p>

        {getLocationHint() && (
          <p
            className={`text-xs font-roboto ${
              selectedService === 'EMERGENCIA'
                ? 'text-blue-600'
                : isDomiciliaryService
                  ? 'text-green-600'
                  : selectedService === 'ZONA_PROTEGIDA'
                    ? 'text-orange-600'
                    : 'text-gray-500'
            }`}
          >
            {getLocationHint()}
          </p>
        )}
      </div>
    </div>
  )
}

export default LocationInput
