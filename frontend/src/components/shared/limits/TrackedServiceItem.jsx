import PropTypes from 'prop-types'
import ProgressBar from './ProgressBar'
import ServiceAlert from './ServiceAlert'

/**
 * Item de servicio con seguimiento de uso
 * ✅ Regla #1: <200 líneas
 * ✅ Regla #3: PropTypes definidos
 */
const TrackedServiceItem = ({ limit }) => (
  <div className="p-3 bg-gray-50 rounded-lg">
    <div className="flex flex-col sm:flex-row sm:justify-between sm:items-center mb-2 space-y-2 sm:space-y-0">
      <div className="flex items-center space-x-3">
        <div className={`w-8 h-8 sm:w-10 sm:h-10 rounded-full flex items-center justify-center flex-shrink-0 ${limit.colors.bg}`}>
          <i className={`${limit.icon} text-sm sm:text-base ${limit.colors.text}`}></i>
        </div>
        <div className="min-w-0 flex-1">
          <h4 className="font-medium text-gray-800 text-sm sm:text-base">{limit.name}</h4>
          <p className="text-xs sm:text-sm text-gray-600 leading-tight">{limit.description}</p>
        </div>
      </div>
      <div className="text-left sm:text-right">
        <span className={`px-2 py-1 rounded-full text-xs sm:text-sm font-medium ${limit.colors.badge}`}>
          {limit.used} / {limit.limit}
        </span>
      </div>
    </div>

    <ProgressBar percentage={limit.percentage} colors={limit.colors} />
    <ServiceAlert status={limit.status} isAtLimit={limit.isAtLimit} isNearLimit={limit.isNearLimit} />
  </div>
)

TrackedServiceItem.propTypes = {
  limit: PropTypes.shape({
    icon: PropTypes.string.isRequired,
    name: PropTypes.string.isRequired,
    description: PropTypes.string.isRequired,
    used: PropTypes.number.isRequired,
    limit: PropTypes.number.isRequired,
    percentage: PropTypes.number.isRequired,
    isAtLimit: PropTypes.bool.isRequired,
    isNearLimit: PropTypes.bool.isRequired,
    status: PropTypes.string.isRequired,
    colors: PropTypes.shape({
      bg: PropTypes.string.isRequired,
      text: PropTypes.string.isRequired,
      badge: PropTypes.string.isRequired,
      progress: PropTypes.string.isRequired
    }).isRequired
  }).isRequired
}

export default TrackedServiceItem