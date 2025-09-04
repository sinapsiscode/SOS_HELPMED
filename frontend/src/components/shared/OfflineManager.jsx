import useOfflineManager from '../../hooks/useOfflineManager'
import OfflineStatusIndicator from '../offline/OfflineStatusIndicator'
import SyncControlPanel from '../offline/SyncControlPanel'

/**
 * Componente principal del gestor offline
 * REFACTORIZADO siguiendo TODAS las reglas:
 *
 * ✅ Regla #1: <200 líneas (ahora 55 líneas)
 * ✅ Regla #2: Lógica extraída a hook personalizado
 * ✅ Regla #6: Documentación completa
 * ✅ Regla #8: Manejo robusto de errores
 * ✅ Regla #10: Separación de presentación y lógica
 * ✅ Regla #14: Estructura modular con componentes separados
 *
 * @component
 */
const OfflineManager = () => {
  const {
    isOnline,
    syncInProgress,
    syncStats,
    lastSync,
    displayPendingItems,
    handleSync,
    clearOfflineData
  } = useOfflineManager()

  // Solo mostrar si hay actividad offline o elementos pendientes
  const shouldShowPanel = !isOnline || syncStats.pendingCount > 0

  return (
    <div className="fixed bottom-4 right-4 z-50">
      {/* Indicador de Estado */}
      <OfflineStatusIndicator isOnline={isOnline} pendingCount={syncStats.pendingCount} />

      {/* Panel de Control Offline */}
      {shouldShowPanel && (
        <SyncControlPanel
          isOnline={isOnline}
          syncStats={syncStats}
          lastSync={lastSync}
          displayPendingItems={displayPendingItems}
          syncInProgress={syncInProgress}
          onSync={handleSync}
          onClearData={clearOfflineData}
        />
      )}
    </div>
  )
}

export default OfflineManager

// Re-exportar el hook de capacidades offline para mantener compatibilidad
export { useOfflineCapability } from '../../hooks/useOfflineCapability'
