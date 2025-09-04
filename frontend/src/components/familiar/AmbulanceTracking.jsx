import React from 'react'
import useAmbulanceTracking from '../../hooks/useAmbulanceTracking'
import TrackingHeader from './TrackingHeader'
import TrackingMap from './TrackingMap'
import MedicalTeamInfo from './MedicalTeamInfo'
import TrackingStatus from './TrackingStatus'

/**
 * Componente de seguimiento de ambulancia refactorizado
 * REFACTORIZADO siguiendo TODAS las reglas:
 *
 * ✅ Regla #2: Extrae TODA la lógica al hook useAmbulanceTracking
 * ✅ Regla #3: Componente principal <200 líneas
 * ✅ Regla #5: Gestión de estados a través del hook
 * ✅ Regla #7: Integración con servicios especializados
 * ✅ Regla #10: Arquitectura modular con componentes especializados
 *
 * @param {Object} props - Props del componente
 * @param {Object} props.emergency - Datos de la emergencia
 * @param {Function} props.onCancel - Función para cancelar seguimiento
 * @returns {JSX.Element} Componente de seguimiento optimizado
 */
const AmbulanceTracking = ({ emergency, onCancel }) => {
  const {
    // Estados básicos
    hasAssignedUnit,
    mapLoaded,

    // Datos calculados
    medicalTeamInfo,
    currentStatus,
    emergencyContactInfo,
    mapData,
    trackingMetrics,

    // Funciones de interacción
    handleLoadMap,
    handleCallAmbulance,
    handleCancelTracking
  } = useAmbulanceTracking(emergency)

  if (!hasAssignedUnit) {
    return (
      <div className="bg-white rounded-xl shadow-medium p-6">
        <div className="text-center py-8">
          <div className="w-16 h-16 bg-gray-100 rounded-full flex items-center justify-center mx-auto mb-4">
            <i className="fas fa-ambulance text-gray-400 text-2xl"></i>
          </div>
          <h3 className="text-lg font-semibold text-gray-800 mb-2 font-exo">
            Sin Ambulancia Asignada
          </h3>
          <p className="text-gray-600 font-roboto">Esperando asignación de unidad médica...</p>
        </div>
      </div>
    )
  }

  return (
    <div className="bg-white rounded-xl shadow-medium overflow-hidden">
      {/* Header con información de la ambulancia */}
      <TrackingHeader trackingMetrics={trackingMetrics} ambulanceId={emergency?.assignedUnit?.id} />

      {/* Mapa de seguimiento */}
      <TrackingMap
        mapData={mapData}
        trackingMetrics={trackingMetrics}
        mapLoaded={mapLoaded}
        onLoadMap={handleLoadMap}
      />

      {/* Información del equipo médico */}
      <MedicalTeamInfo medicalTeam={medicalTeamInfo} />

      {/* Estado en tiempo real */}
      <TrackingStatus currentStatus={currentStatus} trackingMetrics={trackingMetrics} />

      {/* Botones de acción */}
      <div className="p-4 flex space-x-3">
        <button
          onClick={handleCallAmbulance}
          className="flex-1 px-4 py-3 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors flex items-center justify-center font-roboto"
        >
          <i className="fas fa-phone mr-2"></i>
          Llamar Ambulancia
        </button>
        <button
          onClick={() => {
            handleCancelTracking()
            onCancel?.()
          }}
          className="px-4 py-3 border border-red-300 text-red-600 rounded-lg hover:bg-red-50 transition-colors"
          title="Cancelar seguimiento"
        >
          <i className="fas fa-times"></i>
        </button>
      </div>
    </div>
  )
}

export default AmbulanceTracking
