import PropTypes from 'prop-types'

/**
 * Grid de estadísticas del resumen
 * ✅ Regla #1: <200 líneas
 * ✅ Regla #3: PropTypes definidos
 */
const ServiceSummaryStats = ({ summary }) => (
  <div className="grid grid-cols-2 md:grid-cols-4 gap-4 text-center">
    <div className="bg-blue-50 border border-blue-200 rounded-lg p-3">
      <div className="text-2xl font-bold text-blue-600">{summary.totalUsed}</div>
      <div className="text-xs text-blue-700">Total Usado</div>
    </div>

    <div className="bg-green-50 border border-green-200 rounded-lg p-3">
      <div className="text-2xl font-bold text-green-600">{summary.unlimitedServices}</div>
      <div className="text-xs text-green-700">Ilimitados</div>
    </div>

    <div className="bg-yellow-50 border border-yellow-200 rounded-lg p-3">
      <div className="text-2xl font-bold text-yellow-600">{summary.servicesNearLimit}</div>
      <div className="text-xs text-yellow-700">Cerca Límite</div>
    </div>

    <div className="bg-red-50 border border-red-200 rounded-lg p-3">
      <div className="text-2xl font-bold text-red-600">{summary.servicesAtLimit}</div>
      <div className="text-xs text-red-700">Agotados</div>
    </div>
  </div>
)

ServiceSummaryStats.propTypes = {
  summary: PropTypes.shape({
    totalUsed: PropTypes.number.isRequired,
    unlimitedServices: PropTypes.number.isRequired,
    servicesNearLimit: PropTypes.number.isRequired,
    servicesAtLimit: PropTypes.number.isRequired
  }).isRequired
}

export default ServiceSummaryStats