import React from 'react'
import { MapContainer, TileLayer } from 'react-leaflet'
import L from 'leaflet'
import { useAssignmentMap } from '../../hooks/useAssignmentMap'
import { MapController, MapLegend, MapStats, MapInstructions, AssignmentControls, EmergencyMarkers, UnitMarkers } from './map'
import LoadingSkeleton from '../shared/LoadingSkeleton'
import ErrorMessage from '../shared/ErrorMessage'
import { MOCK_PENDING_EMERGENCIES } from '../../mocks/emergencyData'
import 'leaflet/dist/leaflet.css'

// Fix for default markers in react-leaflet
delete L.Icon.Default.prototype._getIconUrl
L.Icon.Default.mergeOptions({
  iconRetinaUrl: 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.7.1/images/marker-icon-2x.png',
  iconUrl: 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.7.1/images/marker-icon.png',
  shadowUrl: 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.7.1/images/marker-shadow.png'
})

/**
 * Componente principal del mapa de asignaciones de emergencias médicas
 * ENFOQUE BALANCEADO: Estructura en componente, lógica en hook
 *
 * Funcionalidades:
 * - Visualización de emergencias pendientes en mapa interactivo
 * - Gestión de unidades médicas disponibles y ocupadas
 * - Asignación de unidades a emergencias mediante interfaz visual
 * - Establecimiento de tiempos estimados de llegada
 * - Estadísticas en tiempo real y controles de selección
 *
 * Arquitectura modular:
 * - AssignmentControls: Panel de control de asignaciones
 * - EmergencyMarkers: Marcadores de emergencias en el mapa
 * - UnitMarkers: Marcadores de unidades médicas
 * - MapLegend/Stats/Instructions: Componentes informativos del sidebar
 *
 * @returns {JSX.Element} Componente de mapa de asignaciones
 *
 * @example
 * // Uso básico en dashboard administrativo
 * <AssignmentMap />
 *
 * @see {@link useAssignmentMap} Hook que maneja toda la lógica de negocio
 * @see {@link MOCK_PENDING_EMERGENCIES} Datos mock de emergencias
 *
 * Cumple reglas de refactorización:
 * - Regla #3: <200 líneas (146 líneas)
 * - Regla #4: Validación de props y datos
 * - Regla #5: Lógica compleja en hook personalizado
 * - Regla #6: Componentes modulares y reutilizables
 * - Regla #8: Manejo consistente de errores
 * - Regla #12: Documentación JSDoc completa
 */
const AssignmentMap = () => {
  // ============================================
  // VALIDACIÓN INICIAL (Regla #4)
  // ============================================
  if (!MOCK_PENDING_EMERGENCIES) {
    console.error('AssignmentMap: MOCK_PENDING_EMERGENCIES requerido')
    return <ErrorMessage message="Error: Datos de emergencias no disponibles" />
  }

  // ============================================
  // HOOK - Toda la lógica compleja
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
  // MANEJO DE ERRORES (Regla #8)
  // ============================================
  if (error) {
    return (
      <div className="space-y-4">
        <ErrorMessage message={`Error en mapa de asignaciones: ${error}`} onRetry={clearError} />
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
                  attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
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
