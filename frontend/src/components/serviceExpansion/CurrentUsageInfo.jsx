import PropTypes from 'prop-types'

/**
 * Información de uso actual de servicios
 * ✅ Regla #1: <200 líneas
 * ✅ Regla #3: PropTypes definidos
 */
const CurrentUsageInfo = ({ usage }) => (
  <div className="p-6 bg-gray-50 border-b border-gray-200">
    <h3 className="text-sm font-medium text-gray-700 mb-2">Tu situación actual:</h3>
    <div className="grid grid-cols-3 gap-4 text-center">
      <div className="bg-white rounded-lg p-3">
        <div className="text-lg font-bold text-blue-600">{usage.used}</div>
        <div className="text-xs text-gray-600">Servicios Usados</div>
      </div>
      <div className="bg-white rounded-lg p-3">
        <div className="text-lg font-bold text-red-600">{usage.remaining}</div>
        <div className="text-xs text-gray-600">Restantes</div>
      </div>
      <div className="bg-white rounded-lg p-3">
        <div className="text-lg font-bold text-gray-600">{usage.total}</div>
        <div className="text-xs text-gray-600">Total Contratado</div>
      </div>
    </div>
  </div>
)

CurrentUsageInfo.propTypes = {
  usage: PropTypes.shape({
    used: PropTypes.number.isRequired,
    remaining: PropTypes.number.isRequired,
    total: PropTypes.number.isRequired
  }).isRequired
}

export default CurrentUsageInfo