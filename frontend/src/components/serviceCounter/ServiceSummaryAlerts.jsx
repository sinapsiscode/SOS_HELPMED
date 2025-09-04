import PropTypes from 'prop-types'

/**
 * Alertas del resumen de servicios
 * ✅ Regla #1: <200 líneas
 * ✅ Regla #3: PropTypes definidos
 */
const ServiceSummaryAlerts = ({ summary }) => (
  <>
    {/* Alerta de servicios agotados */}
    {summary.servicesAtLimit > 0 && (
      <div className="mt-4 p-3 bg-red-50 border border-red-200 rounded-lg">
        <div className="flex items-center space-x-2 text-red-700">
          <i className="fas fa-exclamation-circle"></i>
          <span className="text-sm font-medium">
            Tienes {summary.servicesAtLimit} servicio{summary.servicesAtLimit > 1 ? 's' : ''}{' '}
            agotado{summary.servicesAtLimit > 1 ? 's' : ''}
          </span>
        </div>
      </div>
    )}

    {/* Alerta de servicios cerca del límite (solo si no hay agotados) */}
    {summary.servicesNearLimit > 0 && summary.servicesAtLimit === 0 && (
      <div className="mt-4 p-3 bg-yellow-50 border border-yellow-200 rounded-lg">
        <div className="flex items-center space-x-2 text-yellow-700">
          <i className="fas fa-exclamation-triangle"></i>
          <span className="text-sm font-medium">
            Tienes {summary.servicesNearLimit} servicio{summary.servicesNearLimit > 1 ? 's' : ''}{' '}
            cerca del límite
          </span>
        </div>
      </div>
    )}
  </>
)

ServiceSummaryAlerts.propTypes = {
  summary: PropTypes.shape({
    servicesAtLimit: PropTypes.number.isRequired,
    servicesNearLimit: PropTypes.number.isRequired
  }).isRequired
}

export default ServiceSummaryAlerts