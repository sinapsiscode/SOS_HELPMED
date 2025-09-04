import React from 'react'

/**
 * Opción de servicio médico
 * Siguiendo Regla #3: Componente específico <200 líneas
 * Siguiendo Regla #2: Solo presentación
 *
 * @param {Object} props - Props del componente
 * @param {Object} props.service - Información del servicio
 * @param {boolean} props.isSelected - Si está seleccionado
 * @param {Function} props.onSelect - Función para seleccionar
 * @param {Object} props.user - Usuario actual
 * @returns {JSX.Element} Opción de servicio
 */
const ServiceOption = ({ service, isSelected, onSelect, user }) => {
  const getColorClasses = (color) => {
    const classes = {
      red: isSelected
        ? 'bg-red-500 text-white border-red-500'
        : 'bg-red-50 text-red-700 border-red-200 hover:bg-red-100',
      orange: isSelected
        ? 'bg-orange-500 text-white border-orange-500'
        : 'bg-orange-50 text-orange-700 border-orange-200 hover:bg-orange-100',
      blue: isSelected
        ? 'bg-blue-500 text-white border-blue-500'
        : 'bg-blue-50 text-blue-700 border-blue-200 hover:bg-blue-100',
      purple: isSelected
        ? 'bg-purple-500 text-white border-purple-500'
        : 'bg-purple-50 text-purple-700 border-purple-200 hover:bg-purple-100',
      green: isSelected
        ? 'bg-green-500 text-white border-green-500'
        : 'bg-green-50 text-green-700 border-green-200 hover:bg-green-100'
    }
    return classes[color] || classes.blue
  }

  const getServiceDescription = (serviceType) => {
    const descriptions = {
      EMERGENCIA: 'Atención inmediata con ambulancia y equipo médico especializado',
      URGENCIA:
        'Consulta médica urgente en tu domicilio para situaciones que requieren atención pronta',
      MEDICO_DOMICILIO: 'Consulta médica general en la comodidad de tu hogar',
      TRASLADO_PROGRAMADO: 'Traslado médico planificado con acompañamiento profesional',
      ZONA_PROTEGIDA: 'Atención de emergencias de terceros en tu domicilio registrado'
    }
    return descriptions[serviceType] || 'Servicio médico especializado'
  }

  return (
    <button
      type="button"
      onClick={onSelect}
      className={`p-4 border rounded-lg transition-all duration-200 text-left ${getColorClasses(service.color)} ${
        isSelected ? 'ring-2 ring-offset-2 ring-current transform scale-105' : ''
      }`}
    >
      <div className="flex items-center justify-between mb-3">
        <div className="flex items-center space-x-3">
          <i className={`${service.icon} text-xl ${isSelected ? 'animate-pulse' : ''}`}></i>
          <div>
            <span className="font-medium text-base font-exo">{service.name}</span>
            {service.urgent && (
              <div className="mt-1">
                <span
                  className={`px-2 py-1 rounded text-xs font-medium ${
                    isSelected ? 'bg-white bg-opacity-20 text-current' : 'bg-red-100 text-red-800'
                  }`}
                >
                  URGENTE
                </span>
              </div>
            )}
          </div>
        </div>

        {isSelected && (
          <div className="flex-shrink-0">
            <i className="fas fa-check-circle text-xl"></i>
          </div>
        )}
      </div>

      {/* Descripción del servicio */}
      <div className={`text-sm mb-3 ${isSelected ? 'text-white text-opacity-90' : 'opacity-75'}`}>
        <p className="font-roboto">{getServiceDescription(service.type)}</p>
      </div>

      {/* Información de disponibilidad */}
      <div className="space-y-2">
        {user.plan.subtype !== 'HELP' && service.remaining !== undefined && (
          <div className={`text-sm font-medium ${isSelected ? 'text-white' : ''}`}>
            <i className="fas fa-chart-bar mr-2"></i>
            {service.remaining} servicio{service.remaining !== 1 ? 's' : ''} restante
            {service.remaining !== 1 ? 's' : ''}
          </div>
        )}

        {user.plan.subtype === 'HELP' && (
          <div className={`text-sm ${isSelected ? 'text-white text-opacity-90' : 'opacity-75'}`}>
            <i className="fas fa-info-circle mr-2"></i>
            <span className="font-roboto">Cuenta del límite total del plan</span>
          </div>
        )}

        {service.type === 'EMERGENCIA' && (
          <div className={`text-xs ${isSelected ? 'text-white text-opacity-80' : 'opacity-60'}`}>
            <i className="fas fa-clock mr-1"></i>
            <span className="font-roboto">Respuesta en 15-20 minutos</span>
          </div>
        )}

        {(service.type === 'URGENCIA' || service.type === 'MEDICO_DOMICILIO') && (
          <div className={`text-xs ${isSelected ? 'text-white text-opacity-80' : 'opacity-60'}`}>
            <i className="fas fa-home mr-1"></i>
            <span className="font-roboto">Atención domiciliaria</span>
          </div>
        )}

        {service.type === 'ZONA_PROTEGIDA' && (
          <div className={`text-xs ${isSelected ? 'text-white text-opacity-80' : 'opacity-60'}`}>
            <i className="fas fa-shield-alt mr-1"></i>
            <span className="font-roboto">Para terceros en tu domicilio</span>
          </div>
        )}
      </div>
    </button>
  )
}

export default ServiceOption
