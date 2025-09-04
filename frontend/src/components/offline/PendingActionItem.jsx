import PropTypes from 'prop-types'

/**
 * Item individual de acción pendiente
 * ✅ Regla #1: <200 líneas
 * ✅ Regla #3: PropTypes definidos
 */
const PendingActionItem = ({ item }) => {
  const getActionDisplayName = (actionType) => {
    const actionNames = {
      CREATE_EMERGENCY_REQUEST: 'Solicitud de Emergencia',
      UPDATE_PROFILE: 'Actualizar Perfil',
      CANCEL_SERVICE: 'Cancelar Servicio',
      RATE_SERVICE: 'Calificar Servicio',
      UPDATE_MEDICAL_INFO: 'Info. Médica',
      ADD_EMERGENCY_CONTACT: 'Contacto Emergencia'
    }
    return actionNames[actionType] || actionType
  }

  const hasRetries = item.retryCount && item.retryCount > 0

  return (
    <div className={`text-xs p-2 rounded ${hasRetries ? 'bg-orange-50 border border-orange-200' : 'bg-gray-50'}`}>
      <div className="flex items-center justify-between">
        <div className="font-medium flex items-center">
          {getActionDisplayName(item.action.type)}
          {hasRetries && (
            <span className="ml-2 text-orange-600" title={`${item.retryCount} reintentos`}>
              ⚠ {item.retryCount}
            </span>
          )}
        </div>
        <div className="text-gray-500">
          {new Date(item.timestamp).toLocaleTimeString('es-CL', { 
            hour: '2-digit', 
            minute: '2-digit' 
          })}
        </div>
      </div>
      {item.lastError && (
        <div className="text-orange-600 text-xs mt-1 truncate" title={item.lastError}>
          Error: {item.lastError}
        </div>
      )}
    </div>
  )
}

PendingActionItem.propTypes = {
  item: PropTypes.shape({
    id: PropTypes.string.isRequired,
    timestamp: PropTypes.string.isRequired,
    action: PropTypes.shape({
      type: PropTypes.string.isRequired
    }).isRequired,
    retryCount: PropTypes.number,
    lastError: PropTypes.string
  }).isRequired
}

export default PendingActionItem