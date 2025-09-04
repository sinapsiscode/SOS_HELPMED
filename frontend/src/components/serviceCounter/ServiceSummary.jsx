import PropTypes from 'prop-types'
import ServiceSummaryStats from './ServiceSummaryStats'
import ServiceSummaryAlerts from './ServiceSummaryAlerts'

/**
 * Resumen completo de servicios
 * ✅ Regla #1: <200 líneas
 * ✅ Regla #3: PropTypes definidos
 * ✅ Regla #14: Estructura modular
 */
const ServiceSummary = ({ summary }) => (
  <div>
    <h3 className="font-medium text-gray-800 mb-3">Resumen</h3>
    <ServiceSummaryStats summary={summary} />
    <ServiceSummaryAlerts summary={summary} />
  </div>
)

ServiceSummary.propTypes = {
  summary: PropTypes.shape({
    totalUsed: PropTypes.number.isRequired,
    unlimitedServices: PropTypes.number.isRequired,
    servicesNearLimit: PropTypes.number.isRequired,
    servicesAtLimit: PropTypes.number.isRequired,
    hasAlerts: PropTypes.bool.isRequired
  }).isRequired
}

export default ServiceSummary