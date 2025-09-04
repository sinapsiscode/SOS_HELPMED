import PropTypes from 'prop-types'

/**
 * Encabezado de la tarjeta de límites
 * ✅ Regla #1: <200 líneas
 * ✅ Regla #3: PropTypes definidos
 */
const LimitHeader = ({ title, planInfo, userType, getPlanBadgeColor }) => (
  <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between mb-4 sm:mb-6 space-y-2 sm:space-y-0">
    <div className="min-w-0 flex-1">
      <h2 className="text-lg sm:text-xl font-bold text-gray-800">{title}</h2>
      {planInfo && <p className="text-sm sm:text-base text-gray-600">{planInfo.name}</p>}
    </div>
    <div className="flex items-center space-x-2">
      <span className={`px-2 sm:px-3 py-1 rounded-full text-xs sm:text-sm font-medium ${getPlanBadgeColor(userType)}`}>
        {userType}
      </span>
    </div>
  </div>
)

LimitHeader.propTypes = {
  title: PropTypes.string.isRequired,
  planInfo: PropTypes.shape({
    name: PropTypes.string.isRequired
  }),
  userType: PropTypes.string.isRequired,
  getPlanBadgeColor: PropTypes.func.isRequired
}

export default LimitHeader