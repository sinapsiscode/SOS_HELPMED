import PropTypes from 'prop-types'

/**
 * Item individual del contador de servicios
 * ✅ Regla #1: <200 líneas
 * ✅ Regla #3: PropTypes definidos
 */

// Mapeo de iconos por tipo de servicio
const getServiceIcon = (serviceType) => {
  const icons = {
    EMERGENCIA: 'fas fa-ambulance',
    URGENCIA: 'fas fa-clock',
    MEDICO_DOMICILIO: 'fas fa-user-md',
    TRASLADO_PROGRAMADO: 'fas fa-route',
    ZONA_PROTEGIDA: 'fas fa-shield-alt',
    ORIENTACION_TELEFONICA: 'fas fa-phone',
    EXAMENES_LABORATORIO: 'fas fa-flask'
  }
  return icons[serviceType] || 'fas fa-medical-cross'
}

// Mapeo de nombres por tipo de servicio
const getServiceName = (serviceType) => {
  const names = {
    EMERGENCIA: 'Emergencias',
    URGENCIA: 'Urgencias',
    MEDICO_DOMICILIO: 'Médico a Domicilio',
    TRASLADO_PROGRAMADO: 'Traslado Programado',
    ZONA_PROTEGIDA: 'Zona Protegida',
    ORIENTACION_TELEFONICA: 'Orientación Telefónica',
    EXAMENES_LABORATORIO: 'Exámenes Laboratorio'
  }
  return names[serviceType] || serviceType
}

const ServiceCounterItem = ({ stat }) => {
  const isAtLimit = stat.limit !== 'ILIMITADO' && stat.used >= stat.limit
  const isNearLimit = stat.limit !== 'ILIMITADO' && stat.percentage >= 80

  return (
    <div
      className={`p-4 border rounded-lg ${
        isAtLimit
          ? 'border-red-200 bg-red-50'
          : isNearLimit
            ? 'border-yellow-200 bg-yellow-50'
            : 'border-gray-200 bg-gray-50'
      }`}
    >
      <div className="flex items-center justify-between mb-2">
        <div className="flex items-center space-x-3">
          <div
            className={`w-8 h-8 rounded-full flex items-center justify-center ${
              isAtLimit ? 'bg-red-100' : isNearLimit ? 'bg-yellow-100' : 'bg-blue-100'
            }`}
          >
            <i
              className={`${getServiceIcon(stat.type)} text-sm ${
                isAtLimit ? 'text-red-600' : isNearLimit ? 'text-yellow-600' : 'text-blue-600'
              }`}
            ></i>
          </div>
          <div>
            <h4 className="font-medium text-gray-800 text-sm">{getServiceName(stat.type)}</h4>
          </div>
        </div>

        <div className="text-right">
          {stat.limit === 'ILIMITADO' ? (
            <div className="text-green-600 font-medium text-sm">{stat.used}</div>
          ) : (
            <div
              className={`font-medium text-sm ${
                isAtLimit ? 'text-red-600' : isNearLimit ? 'text-yellow-600' : 'text-blue-600'
              }`}
            >
              {stat.used} / {stat.limit}
            </div>
          )}
        </div>
      </div>

      {/* Mini barra de progreso */}
      {stat.limit !== 'ILIMITADO' && (
        <div className="w-full bg-gray-200 rounded-full h-1.5">
          <div
            className={`h-1.5 rounded-full transition-all duration-300 ${
              isAtLimit ? 'bg-red-500' : isNearLimit ? 'bg-yellow-500' : 'bg-blue-500'
            }`}
            style={{ width: `${Math.min(stat.percentage, 100)}%` }}
          ></div>
        </div>
      )}
    </div>
  )
}

ServiceCounterItem.propTypes = {
  stat: PropTypes.shape({
    type: PropTypes.string.isRequired,
    used: PropTypes.number.isRequired,
    limit: PropTypes.oneOfType([PropTypes.number, PropTypes.string]).isRequired,
    percentage: PropTypes.number.isRequired
  }).isRequired
}

export default ServiceCounterItem