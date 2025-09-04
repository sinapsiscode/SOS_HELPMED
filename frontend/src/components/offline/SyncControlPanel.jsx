import PropTypes from 'prop-types'
import SyncStatusInfo from './SyncStatusInfo'
import PendingActionsList from './PendingActionsList'
import SyncActionButtons from './SyncActionButtons'

/**
 * Panel de control de sincronización
 * ✅ Regla #1: <200 líneas
 * ✅ Regla #3: PropTypes definidos
 */
const SyncControlPanel = ({
  isOnline,
  syncStats,
  lastSync,
  displayPendingItems,
  syncInProgress,
  onSync,
  onClearData
}) => (
  <div className="mt-2 bg-white rounded-lg shadow-xl border p-4 min-w-80">
    <h3 className="font-bold text-gray-800 mb-3">Estado de Sincronización</h3>

    <div className="space-y-3">
      {/* Información de estado */}
      <SyncStatusInfo 
        isOnline={isOnline} 
        syncStats={syncStats} 
        lastSync={lastSync} 
      />

      {/* Lista de acciones pendientes */}
      {syncStats.pendingCount > 0 && (
        <PendingActionsList items={displayPendingItems} totalCount={syncStats.pendingCount} />
      )}

      {/* Botones de acción */}
      <SyncActionButtons
        isOnline={isOnline}
        hasPendingItems={syncStats.pendingCount > 0}
        syncInProgress={syncInProgress}
        onSync={onSync}
        onClearData={onClearData}
      />
    </div>
  </div>
)

SyncControlPanel.propTypes = {
  isOnline: PropTypes.bool.isRequired,
  syncStats: PropTypes.shape({
    pendingCount: PropTypes.number.isRequired,
    hasFailedItems: PropTypes.bool.isRequired,
    oldestPending: PropTypes.instanceOf(Date),
    syncAge: PropTypes.number
  }).isRequired,
  lastSync: PropTypes.instanceOf(Date),
  displayPendingItems: PropTypes.arrayOf(
    PropTypes.shape({
      id: PropTypes.string.isRequired,
      timestamp: PropTypes.string.isRequired,
      action: PropTypes.shape({
        type: PropTypes.string.isRequired
      }).isRequired
    })
  ).isRequired,
  syncInProgress: PropTypes.bool.isRequired,
  onSync: PropTypes.func.isRequired,
  onClearData: PropTypes.func.isRequired
}

export default SyncControlPanel