import PropTypes from 'prop-types'

/**
 * Información de estado de sincronización
 * ✅ Regla #1: <200 líneas
 * ✅ Regla #3: PropTypes definidos
 */
const SyncStatusInfo = ({ isOnline, syncStats, lastSync }) => (
  <>
    <div className="flex justify-between items-center">
      <span className="text-sm text-gray-600">Estado de conexión:</span>
      <span className={`text-sm font-medium ${isOnline ? 'text-green-600' : 'text-red-600'}`}>
        {isOnline ? 'Conectado' : 'Sin conexión'}
      </span>
    </div>

    <div className="flex justify-between items-center">
      <span className="text-sm text-gray-600">Elementos pendientes:</span>
      <span className="text-sm font-medium text-blue-600">
        {syncStats.pendingCount}
        {syncStats.hasFailedItems && (
          <span className="text-orange-500 ml-1" title="Algunos elementos han fallado">
            ⚠
          </span>
        )}
      </span>
    </div>

    {lastSync && (
      <div className="flex justify-between items-center">
        <span className="text-sm text-gray-600">Última sincronización:</span>
        <div className="text-right">
          <span className="text-sm text-gray-800">
            {lastSync.toLocaleString('es-CL')}
          </span>
          {syncStats.syncAge !== null && (
            <div className="text-xs text-gray-500">
              hace {syncStats.syncAge} min
            </div>
          )}
        </div>
      </div>
    )}

    {syncStats.oldestPending && (
      <div className="flex justify-between items-center">
        <span className="text-sm text-gray-600">Pendiente más antiguo:</span>
        <span className="text-sm text-orange-600">
          {syncStats.oldestPending.toLocaleString('es-CL')}
        </span>
      </div>
    )}
  </>
)

SyncStatusInfo.propTypes = {
  isOnline: PropTypes.bool.isRequired,
  syncStats: PropTypes.shape({
    pendingCount: PropTypes.number.isRequired,
    hasFailedItems: PropTypes.bool.isRequired,
    oldestPending: PropTypes.instanceOf(Date),
    syncAge: PropTypes.number
  }).isRequired,
  lastSync: PropTypes.instanceOf(Date)
}

export default SyncStatusInfo