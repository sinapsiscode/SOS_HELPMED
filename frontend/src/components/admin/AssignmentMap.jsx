import React from 'react'
import { MapContainer, TileLayer } from 'react-leaflet'
import L from 'leaflet'
import { useAssignmentMap } from '../../hooks/useAssignmentMap'
import { MapController, MapLegend, MapStats, MapInstructions, AssignmentControls, EmergencyMarkers, UnitMarkers } from './map'
import LoadingSkeleton from '../shared/LoadingSkeleton'
import ErrorMessage from '../shared/ErrorMessage'
import { MOCK_PENDING_EMERGENCIES } from '../../mocks/emergencyData'
import { LABELS } from '../../config/labels'
import 'leaflet/dist/leaflet.css'

// Fix for default markers in react-leaflet
delete L.Icon.Default.prototype._getIconUrl
L.Icon.Default.mergeOptions({
  iconRetinaUrl: 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.7.1/images/marker-icon-2x.png',
  iconUrl: 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.7.1/images/marker-icon.png',
  shadowUrl: 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.7.1/images/marker-shadow.png'
})

/**
 * ${LABELS.admin.assignmentMap.comments.title}
 * ${LABELS.admin.assignmentMap.comments.approach}
 *
 * ${LABELS.admin.assignmentMap.comments.features.title}
 * ${LABELS.admin.assignmentMap.comments.features.visualization}
 * ${LABELS.admin.assignmentMap.comments.features.management}
 * ${LABELS.admin.assignmentMap.comments.features.assignment}
 * ${LABELS.admin.assignmentMap.comments.features.eta}
 * ${LABELS.admin.assignmentMap.comments.features.stats}
 *
 * ${LABELS.admin.assignmentMap.comments.architecture.title}
 * ${LABELS.admin.assignmentMap.comments.architecture.controls}
 * ${LABELS.admin.assignmentMap.comments.architecture.emergencyMarkers}
 * ${LABELS.admin.assignmentMap.comments.architecture.unitMarkers}
 * ${LABELS.admin.assignmentMap.comments.architecture.sidebar}
 *
 * @returns {JSX.Element} Componente de mapa de asignaciones
 *
 * ${LABELS.admin.assignmentMap.comments.example.title}
 * ${LABELS.admin.assignmentMap.comments.example.usage}
 * ${LABELS.admin.assignmentMap.comments.example.component}
 *
 * ${LABELS.admin.assignmentMap.comments.see.hook}
 * ${LABELS.admin.assignmentMap.comments.see.mockData}
 *
 * ${LABELS.admin.assignmentMap.comments.rules.title}
 * ${LABELS.admin.assignmentMap.comments.rules.rule3}
 * ${LABELS.admin.assignmentMap.comments.rules.rule4}
 * ${LABELS.admin.assignmentMap.comments.rules.rule5}
 * ${LABELS.admin.assignmentMap.comments.rules.rule6}
 * ${LABELS.admin.assignmentMap.comments.rules.rule8}
 * ${LABELS.admin.assignmentMap.comments.rules.rule12}
 */
const AssignmentMap = () => {
  const labels = LABELS.admin.assignmentMap
  
  // ============================================
  // ${LABELS.admin.assignmentMap.comments.validation}
  // ============================================
  if (!MOCK_PENDING_EMERGENCIES) {
    console.error(labels.errors.dataRequired)
    return <ErrorMessage message={labels.errors.dataNotAvailable} />
  }

  // ============================================
  // ${LABELS.admin.assignmentMap.comments.businessLogic}
  // ============================================
  const {
    selectedEmergency,
    selectedUnit,
    loading,
    error,
    availableUnits,
    busyUnits,
    getEmergencyIcon,
    getUnitIcon,
    handleAssignUnit,
    handleSetArrivalTime,
    handleMapClick,
    handleEmergencyClick,
    handleUnitClick,
    clearSelections,
    clearError,
    getPriorityClass,
    getUnitStatusClass
  } = useAssignmentMap()

  // ============================================
  // ${LABELS.admin.assignmentMap.comments.errorHandling}
  // ============================================
  if (error) {
    return (
      <div className="space-y-4">
        <ErrorMessage message={labels.errors.mapError.replace('{error}', error)} onRetry={clearError} />
      </div>
    )
  }

  if (loading) {
    return <LoadingSkeleton rows={3} />
  }

  return (
    <div className="space-y-4">
      {/* Assignment Controls */}
      <AssignmentControls
        selectedEmergency={selectedEmergency}
        selectedUnit={selectedUnit}
        loading={loading}
        handleAssignUnit={handleAssignUnit}
        clearSelections={clearSelections}
      />

      <div className="grid grid-cols-1 lg:grid-cols-4 gap-4">
        {/* Map */}
        <div className="lg:col-span-3">
          <div className="bg-white rounded-lg shadow-medium overflow-hidden">
            <div className="h-96 lg:h-[600px] relative">
              <MapContainer
                center={[-12.0464, -77.0428]}
                zoom={12}
                style={{ height: '100%', width: '100%' }}
                zoomControl={true}
              >
                <TileLayer
                  attribution={labels.map.attribution}
                  url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
                />

                <MapController onMapClick={handleMapClick} />

                {/* Emergency Markers */}
                <EmergencyMarkers
                  emergencies={MOCK_PENDING_EMERGENCIES}
                  getEmergencyIcon={getEmergencyIcon}
                  handleEmergencyClick={handleEmergencyClick}
                  handleSetArrivalTime={handleSetArrivalTime}
                  getPriorityClass={getPriorityClass}
                />

                {/* Unit Markers */}
                <UnitMarkers
                  availableUnits={availableUnits}
                  busyUnits={busyUnits}
                  getUnitIcon={getUnitIcon}
                  handleUnitClick={handleUnitClick}
                  getUnitStatusClass={getUnitStatusClass}
                />
              </MapContainer>
            </div>
          </div>
        </div>

        {/* Sidebar with components */}
        <div className="space-y-4">
          <MapLegend />
          <MapStats
            pendingEmergencies={MOCK_PENDING_EMERGENCIES}
            availableUnits={availableUnits}
            busyUnits={busyUnits}
            totalUnits={availableUnits.length + busyUnits.length}
          />
          <MapInstructions />
        </div>
      </div>
    </div>
  )
}

export default AssignmentMap
