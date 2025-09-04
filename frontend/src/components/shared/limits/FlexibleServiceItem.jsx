import PropTypes from 'prop-types'
import ProgressBar from './ProgressBar'

/**
 * Item de servicio flexible (Plan Help)
 * ✅ Regla #1: <200 líneas
 * ✅ Regla #3: PropTypes definidos
 */
const FlexibleServiceItem = ({ limit }) => (
  <div className="p-3 bg-gray-50 rounded-lg">
    <div className="flex justify-between items-center mb-2">
      <div className="flex items-center space-x-3">
        <div className={`w-10 h-10 rounded-full flex items-center justify-center ${limit.colors.bg}`}>
          <i className={`fas fa-layer-group ${limit.colors.text}`}></i>
        </div>
        <div>
          <h4 className="font-medium text-gray-800">Servicios Disponibles</h4>
          <p className="text-sm text-gray-600">Emergencias, urgencias y médico a domicilio</p>
        </div>
      </div>
      <div className="text-right">
        <span className={`px-2 py-1 rounded-full text-sm font-medium ${limit.colors.badge}`}>
          {limit.remaining} / {limit.total}
        </span>
      </div>
    </div>

    <ProgressBar percentage={limit.percentage} colors={limit.colors} />
  </div>
)

FlexibleServiceItem.propTypes = {
  limit: PropTypes.shape({
    remaining: PropTypes.number.isRequired,
    total: PropTypes.number.isRequired,
    percentage: PropTypes.number.isRequired,
    colors: PropTypes.shape({
      bg: PropTypes.string.isRequired,
      text: PropTypes.string.isRequired,
      badge: PropTypes.string.isRequired,
      progress: PropTypes.string.isRequired
    }).isRequired
  }).isRequired
}

export default FlexibleServiceItem