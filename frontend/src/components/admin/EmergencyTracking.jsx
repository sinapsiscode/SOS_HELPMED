import React, { lazy, Suspense } from 'react'
import { useEmergencyTracking } from '../../hooks/useEmergencyTracking'
import { EmergencyHeader, EmergencyCard } from './emergency'
import LoadingSkeleton from '../shared/LoadingSkeleton'
import ErrorMessage from '../shared/ErrorMessage'
import { LABELS } from '../../config/labels'

// ${LABELS.admin.emergencyTracking.comments.lazyLoading}
const EmergencyTimelineItem = lazy(() => import('./emergency/EmergencyTimelineItem'))
const EmergencyDetailPanel = lazy(() => import('./emergency/EmergencyDetailPanel'))
const EmergencyMapView = lazy(() => import('./emergency/EmergencyMapView'))

/**
 * ${LABELS.admin.emergencyTracking.comments.title}
 * ${LABELS.admin.emergencyTracking.comments.approach}
 *
 * ${LABELS.admin.emergencyTracking.comments.features.title}
 * ${LABELS.admin.emergencyTracking.comments.features.monitoring}
 * ${LABELS.admin.emergencyTracking.comments.features.filtering}
 * ${LABELS.admin.emergencyTracking.comments.features.views}
 * ${LABELS.admin.emergencyTracking.comments.features.assignment}
 * ${LABELS.admin.emergencyTracking.comments.features.eta}
 * ${LABELS.admin.emergencyTracking.comments.features.details}
 * ${LABELS.admin.emergencyTracking.comments.features.notes}
 *
 * ${LABELS.admin.emergencyTracking.comments.architecture.title}
 * ${LABELS.admin.emergencyTracking.comments.architecture.header}
 * ${LABELS.admin.emergencyTracking.comments.architecture.card}
 * ${LABELS.admin.emergencyTracking.comments.architecture.timeline}
 * ${LABELS.admin.emergencyTracking.comments.architecture.detailPanel}
 * ${LABELS.admin.emergencyTracking.comments.architecture.mapView}
 *
 * @returns {JSX.Element} Componente de seguimiento de emergencias
 *
 * ${LABELS.admin.emergencyTracking.comments.example.title}
 * ${LABELS.admin.emergencyTracking.comments.example.usage}
 * ${LABELS.admin.emergencyTracking.comments.example.component}
 *
 * ${LABELS.admin.emergencyTracking.comments.see.hook}
 * ${LABELS.admin.emergencyTracking.comments.see.mockData}
 *
 * ${LABELS.admin.emergencyTracking.comments.rules.title}
 * ${LABELS.admin.emergencyTracking.comments.rules.rule3}
 * ${LABELS.admin.emergencyTracking.comments.rules.rule4}
 * ${LABELS.admin.emergencyTracking.comments.rules.rule5}
 * ${LABELS.admin.emergencyTracking.comments.rules.rule6}
 * ${LABELS.admin.emergencyTracking.comments.rules.rule8}
 * ${LABELS.admin.emergencyTracking.comments.rules.rule12}
 */
const EmergencyTracking = () => {
  const labels = LABELS.admin.emergencyTracking
  
  // ============================================
  // ${LABELS.admin.emergencyTracking.comments.businessLogic}
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
  // ${LABELS.admin.emergencyTracking.comments.errorHandling}
  // ============================================
  if (error) {
    return (
      <div className="space-y-4">
        <ErrorMessage
          message={labels.errors.trackingError.replace('{error}', error)}
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
                  {labels.header.emergenciesCount.replace('{count}', filteredEmergencies.length)}
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
