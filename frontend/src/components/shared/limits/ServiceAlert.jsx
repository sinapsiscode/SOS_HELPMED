import PropTypes from 'prop-types'

/**
 * Alerta para servicios según su estado
 * ✅ Regla #1: <200 líneas
 * ✅ Regla #3: PropTypes definidos
 */
const ServiceAlert = ({ status, isAtLimit, isNearLimit }) => {
  if (isAtLimit) {
    return (
      <div className="mt-2 p-2 bg-red-50 border border-red-200 rounded text-sm text-red-700">
        <i className="fas fa-exclamation-triangle mr-1"></i>
        Has agotado este servicio. Puedes contratar servicios adicionales.
      </div>
    )
  }

  if (isNearLimit && !isAtLimit) {
    return (
      <div className="mt-2 p-2 bg-yellow-50 border border-yellow-200 rounded text-sm text-yellow-700">
        <i className="fas fa-exclamation-triangle mr-1"></i>
        Te quedan pocos servicios disponibles.
      </div>
    )
  }

  return null
}

ServiceAlert.propTypes = {
  status: PropTypes.string.isRequired,
  isAtLimit: PropTypes.bool.isRequired,
  isNearLimit: PropTypes.bool.isRequired
}

export default ServiceAlert