import React from 'react'

/**
 * Selector de tipo de servicio médico
 * Siguiendo Regla #3: Componente específico <200 líneas
 * Siguiendo Regla #2: Solo presentación
 *
 * @param {Object} props - Props del componente
 * @param {Object} props.prices - Configuración de precios de servicios
 * @param {string} props.selectedService - Servicio actualmente seleccionado
 * @param {Function} props.onServiceSelect - Función para seleccionar servicio
 * @param {Function} props.getServiceInfo - Función para obtener info del servicio
 * @param {string} props.error - Error de validación
 * @returns {JSX.Element} Selector de servicios
 */
const ServiceSelector = ({ prices, selectedService, onServiceSelect, getServiceInfo, error }) => {
  return (
    <div>
      <label className="block text-sm font-medium text-gray-700 mb-3 font-exo">
        Seleccione el servicio que necesita
      </label>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
        {Object.entries(prices).map(([type, service]) => (
          <ServiceCard
            key={type}
            type={type}
            service={service}
            isSelected={selectedService === type}
            onSelect={() => onServiceSelect(type)}
            serviceInfo={getServiceInfo(type)}
          />
        ))}
      </div>

      {error && (
        <p className="mt-2 text-sm text-red-600 flex items-center font-roboto">
          <i className="fas fa-exclamation-circle mr-1"></i>
          {error}
        </p>
      )}
    </div>
  )
}

/**
 * Tarjeta individual de servicio
 */
const ServiceCard = ({ type, service, isSelected, onSelect, serviceInfo }) => {
  const { color, icon } = serviceInfo

  return (
    <button
      type="button"
      onClick={onSelect}
      className={`p-4 border-2 rounded-lg transition-all duration-200 text-left hover:shadow-md ${
        isSelected
          ? `border-${color}-500 bg-${color}-50 shadow-md`
          : 'border-gray-200 hover:border-gray-300'
      }`}
    >
      <div className="flex items-start space-x-3">
        <ServiceIcon icon={icon} color={color} isSelected={isSelected} />
        <ServiceInfo service={service} isSelected={isSelected} />
      </div>
    </button>
  )
}

/**
 * Icono del servicio
 */
const ServiceIcon = ({ icon, color, isSelected }) => {
  return (
    <div
      className={`w-10 h-10 rounded-full flex items-center justify-center transition-colors ${
        isSelected ? `bg-${color}-500 text-white` : `bg-${color}-100 text-${color}-600`
      }`}
    >
      <i className={icon}></i>
    </div>
  )
}

/**
 * Información del servicio
 */
const ServiceInfo = ({ service, isSelected }) => {
  return (
    <div className="flex-1">
      <h4 className="font-semibold text-gray-800 font-exo">{service.name}</h4>
      <p className="text-sm text-gray-600 mt-1 font-roboto">{service.description}</p>
      <p
        className={`text-lg font-bold mt-2 font-exo transition-colors ${
          isSelected ? 'text-gray-900' : 'text-gray-800'
        }`}
      >
        Desde S/ {service.basePrice}
      </p>
    </div>
  )
}

export default ServiceSelector
