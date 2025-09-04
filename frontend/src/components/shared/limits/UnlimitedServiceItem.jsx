import PropTypes from 'prop-types'

/**
 * Item de servicio ilimitado
 * ✅ Regla #1: <200 líneas
 * ✅ Regla #3: PropTypes definidos
 */
const UnlimitedServiceItem = ({ limit }) => (
  <div className="flex flex-col sm:flex-row sm:justify-between sm:items-center p-3 bg-gray-50 rounded-lg space-y-2 sm:space-y-0">
    <div className="flex items-center space-x-3">
      <div className="w-8 h-8 sm:w-10 sm:h-10 bg-green-100 rounded-full flex items-center justify-center flex-shrink-0">
        <i className={`${limit.icon} text-green-600 text-sm sm:text-base`}></i>
      </div>
      <div className="min-w-0 flex-1">
        <h4 className="font-medium text-gray-800 text-sm sm:text-base">{limit.name}</h4>
        <p className="text-xs sm:text-sm text-gray-600 leading-tight">{limit.description}</p>
      </div>
    </div>
    <div className="text-left sm:text-right">
      <span className="bg-green-100 text-green-800 px-2 py-1 rounded-full text-xs sm:text-sm font-medium">
        {limit.value}
      </span>
    </div>
  </div>
)

UnlimitedServiceItem.propTypes = {
  limit: PropTypes.shape({
    icon: PropTypes.string.isRequired,
    name: PropTypes.string.isRequired,
    description: PropTypes.string.isRequired,
    value: PropTypes.string.isRequired
  }).isRequired
}

export default UnlimitedServiceItem