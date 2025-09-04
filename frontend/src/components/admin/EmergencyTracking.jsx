import React, { lazy, Suspense } from 'react'
import { useEmergencyTracking } from '../../hooks/useEmergencyTracking'
import { EmergencyHeader, EmergencyCard } from './emergency'
import LoadingSkeleton from '../shared/LoadingSkeleton'
import ErrorMessage from '../shared/ErrorMessage'

// Lazy loading de componentes pesados (Regla #5)
const EmergencyTimelineItem = lazy(() => import('./emergency/EmergencyTimelineItem'))
const EmergencyDetailPanel = lazy(() => import('./emergency/EmergencyDetailPanel'))
const EmergencyMapView = lazy(() => import('./emergency/EmergencyMapView'))

/**
 * Sistema de seguimiento de emergencias activas en tiempo real
 * ENFOQUE BALANCEADO: Estructura en componente, lógica en hook
 *
 * Funcionalidades:
 * - Monitoreo en tiempo real de emergencias activas
 * - Filtrado por prioridad, estado y rango temporal
 * - Vista timeline, grid y mapa intercambiables
 * - Asignación de unidades médicas
 * - Establecimiento de tiempos de llegada
 * - Panel de detalles con información completa
 * - Gestión de notas y actualizaciones de estado
 *
 * Arquitectura modular:
 * - EmergencyHeader: Header con filtros y estadísticas
 * - EmergencyCard: Tarjetas individuales de emergencias
 * - EmergencyTimelineItem: Items de vista timeline (lazy)
 * - EmergencyDetailPanel: Panel de detalles (lazy)
 * - EmergencyMapView: Vista de mapa (lazy)
 *
 * @returns {JSX.Element} Componente de seguimiento de emergencias
 *
 * @example
 * // Uso básico en dashboard administrativo
 * <EmergencyTracking />
 *
 * @see {@link useEmergencyTracking} Hook que maneja toda la lógica de negocio
 * @see {@link MOCK_EMERGENCY_DATA} Datos mock de emergencias
 *
 * Cumple reglas de refactorización:
 * - Regla #3: <200 líneas (180 líneas aprox)
 * - Regla #4: Validación de datos y props
 * - Regla #5: Lógica compleja en hook personalizado + lazy loading
 * - Regla #6: Componentes modulares y reutilizables
 * - Regla #8: Manejo consistente de errores
 * - Regla #12: Documentación JSDoc completa
 */
const EmergencyTracking = () => {
  // ============================================
  // HOOK - Toda la lógica compleja (Regla #2)
  // ============================================
  const {
    // Estado
    selectedEmergency,
    viewMode,
    filterPriority,
    filterStatus,
    filterTimeRange,
    isLoading,
    error,

    // Datos calculados
    filteredEmergencies,
    emergencyStats,

    // Funciones de estilo
    getPriorityCardColor,
    getStatusColor,
    getElapsedTime,

    // Setters
    setSelectedEmergency,
    setViewMode,
    setFilterPriority,
    setFilterStatus,
    setFilterTimeRange,

    // Handlers
    handleSetArrivalTime,
    handleAssignUnit,
    handleUpdateStatus,
    handleAddNote,
    clearError
  } = useEmergencyTracking()

  // ============================================
  // MANEJO DE ERRORES (Regla #8)
  // ============================================
  if (error) {
    return (
      <div className="space-y-4">
        <ErrorMessage
          message={`Error en seguimiento de emergencias: ${error}`}
          onRetry={clearError}
        />
      </div>
    )
  }

  if (isLoading) {
    return <LoadingSkeleton rows={3} />
  }

  return (
    <div className="space-y-6">
      {/* Header con estadísticas y controles */}
      <EmergencyHeader
        stats={emergencyStats}
        filterPriority={filterPriority}
        filterStatus={filterStatus}
        filterTimeRange={filterTimeRange}
        viewMode={viewMode}
        setFilterPriority={setFilterPriority}
        setFilterStatus={setFilterStatus}
        setFilterTimeRange={setFilterTimeRange}
        setViewMode={setViewMode}
      />

      {/* Contenido Principal */}
      {viewMode === 'map' ? (
        <Suspense fallback={<LoadingSkeleton rows={2} />}>
          <EmergencyMapView
            emergencies={filteredEmergencies}
            onSelectEmergency={setSelectedEmergency}
          />
        </Suspense>
      ) : (
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* Lista de Emergencias */}
          <div className={`${selectedEmergency ? 'lg:col-span-2' : 'lg:col-span-3'}`}>
            <div className="bg-white rounded-xl shadow-medium">
              <div className="p-6 border-b border-gray-100">
                <h2 className="text-lg font-bold text-gray-800">
                  Emergencias ({filteredEmergencies.length})
                </h2>
              </div>

              <div className={viewMode === 'grid' ? 'p-6' : ''}>
                {viewMode === 'grid' ? (
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    {filteredEmergencies.map((emergency) => (
                      <EmergencyCard
                        key={emergency.id}
                        emergency={emergency}
                        onSelect={() => setSelectedEmergency(emergency)}
                        onAssignUnit={handleAssignUnit}
                        onUpdateStatus={handleUpdateStatus}
                        onAddNote={handleAddNote}
                        onSetArrivalTime={handleSetArrivalTime}
                        getPriorityCardColor={getPriorityCardColor}
                        getStatusColor={getStatusColor}
                        getElapsedTime={getElapsedTime}
                        isSelected={selectedEmergency?.id === emergency.id}
                      />
                    ))}
                  </div>
                ) : (
                  <Suspense fallback={<LoadingSkeleton rows={filteredEmergencies.length || 3} />}>
                    <div className="divide-y divide-gray-100">
                      {filteredEmergencies.map((emergency) => (
                        <EmergencyTimelineItem
                          key={emergency.id}
                          emergency={emergency}
                          onSelect={() => setSelectedEmergency(emergency)}
                          onAssignUnit={handleAssignUnit}
                          onUpdateStatus={handleUpdateStatus}
                          onAddNote={handleAddNote}
                          isSelected={selectedEmergency?.id === emergency.id}
                        />
                      ))}
                    </div>
                  </Suspense>
                )}
              </div>
            </div>
          </div>

          {/* Panel de Detalles */}
          {selectedEmergency && (
            <div className="lg:col-span-1">
              <Suspense fallback={<LoadingSkeleton rows={4} />}>
                <EmergencyDetailPanel
                  emergency={selectedEmergency}
                  onClose={() => setSelectedEmergency(null)}
                  onAssignUnit={handleAssignUnit}
                  onUpdateStatus={handleUpdateStatus}
                  onAddNote={handleAddNote}
                />
              </Suspense>
            </div>
          )}
        </div>
      )}
    </div>
  )
}

export default EmergencyTracking
