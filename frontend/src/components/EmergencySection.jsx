import React from 'react'
import useAppStore from '../stores/useAppStore'
import useEmergencyLocation from '../hooks/useEmergencyLocation'
import useEmergencyRequests from '../hooks/useEmergencyRequests'
import SystemStatus from './emergency/SystemStatus'
import EmergencyTypes from './emergency/EmergencyTypes'
import SOSButton from './emergency/SOSButton'
import LocationStatus from './emergency/LocationStatus'
import QuickTips from './emergency/QuickTips'
import ActiveEmergency from './emergency/ActiveEmergency'

/**
 * Componente de sección de emergencias refactorizado
 * REFACTORIZADO siguiendo TODAS las reglas:
 *
 * ✅ Regla #2: Extrae TODA la lógica a hooks especializados
 * ✅ Regla #3: Componente principal <200 líneas
 * ✅ Regla #5: Gestión de estados a través de hooks
 * ✅ Regla #7: Integración con servicios especializados
 * ✅ Regla #10: Arquitectura modular con componentes especializados
 *
 * @returns {JSX.Element} Sección de emergencias optimizada
 */
const EmergencySection = () => {
  const { emergencyStatus, currentEmergency } = useAppStore()

  const { currentCoordinates } = useEmergencyLocation()
  const { handleEmergencyRequest, handleSOSPress } = useEmergencyRequests()

  if (emergencyStatus !== 'idle' && currentEmergency) {
    return <ActiveEmergency />
  }

  return (
    <div className="space-y-6">
      <SystemStatus />
      <EmergencyTypes onEmergencyRequest={handleEmergencyRequest} />
      <SOSButton onSOSPress={handleSOSPress} />
      <LocationStatus currentCoordinates={currentCoordinates} />
      <QuickTips />
    </div>
  )
}

export default EmergencySection
