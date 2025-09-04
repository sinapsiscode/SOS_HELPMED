import PropTypes from 'prop-types'

/**
 * Indicador de estado de conexión
 * ✅ Regla #1: <200 líneas
 * ✅ Regla #3: PropTypes definidos
 */
const OfflineStatusIndicator = ({ isOnline, pendingCount }) => (
  <div
    className={`flex items-center space-x-2 px-4 py-2 rounded-full shadow-lg ${
      isOnline ? 'bg-green-500' : 'bg-red-500'
    } text-white`}
  >
    <div
      className={`w-2 h-2 rounded-full ${
        isOnline ? 'bg-green-200' : 'bg-red-200'
      } ${isOnline ? 'animate-pulse' : ''}`}
    ></div>
    <span className="text-sm font-medium">{isOnline ? 'Online' : 'Offline'}</span>

    {pendingCount > 0 && (
      <span className="bg-white bg-opacity-20 px-2 py-1 rounded-full text-xs">
        {pendingCount} pendientes
      </span>
    )}
  </div>
)

OfflineStatusIndicator.propTypes = {
  isOnline: PropTypes.bool.isRequired,
  pendingCount: PropTypes.number.isRequired
}

export default OfflineStatusIndicator