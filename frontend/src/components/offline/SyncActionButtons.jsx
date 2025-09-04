import PropTypes from 'prop-types'

/**
 * Botones de acción para sincronización
 * ✅ Regla #1: <200 líneas
 * ✅ Regla #3: PropTypes definidos
 */
const SyncActionButtons = ({
  isOnline,
  hasPendingItems,
  syncInProgress,
  onSync,
  onClearData
}) => (
  <div className="flex space-x-2 pt-3 border-t">
    {isOnline && hasPendingItems && (
      <button
        onClick={onSync}
        disabled={syncInProgress}
        className="flex-1 bg-blue-600 text-white px-3 py-2 rounded-lg text-sm hover:bg-blue-700 disabled:opacity-50 disabled:cursor-not-allowed"
      >
        {syncInProgress ? (
          <div className="flex items-center justify-center">
            <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white mr-2"></div>
            Sincronizando...
          </div>
        ) : (
          <div className="flex items-center justify-center">
            <i className="fas fa-sync-alt mr-2"></i>
            Sincronizar Ahora
          </div>
        )}
      </button>
    )}

    {!isOnline && hasPendingItems && (
      <div className="flex-1 bg-gray-300 text-gray-500 px-3 py-2 rounded-lg text-sm text-center">
        <i className="fas fa-wifi-slash mr-2"></i>
        Sin Conexión
      </div>
    )}

    <button
      onClick={onClearData}
      disabled={syncInProgress}
      className="bg-gray-600 text-white px-3 py-2 rounded-lg text-sm hover:bg-gray-700 disabled:opacity-50"
      title="Limpiar datos offline"
    >
      <i className="fas fa-trash mr-1"></i>
      Limpiar
    </button>
  </div>
)

SyncActionButtons.propTypes = {
  isOnline: PropTypes.bool.isRequired,
  hasPendingItems: PropTypes.bool.isRequired,
  syncInProgress: PropTypes.bool.isRequired,
  onSync: PropTypes.func.isRequired,
  onClearData: PropTypes.func.isRequired
}

export default SyncActionButtons