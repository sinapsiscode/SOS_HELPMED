import { useState } from 'react'
import useAppStore from '../stores/useAppStore'
import Swal from 'sweetalert2'
import L from 'leaflet'

/**
 * Hook para gestión del mapa de asignaciones
 * Centraliza lógica compleja de mapas y asignaciones (Regla #2)
 */
export const useAssignmentMap = () => {
  const { ambulanceUsers, updateAmbulanceStatus, setEstimatedArrivalTime } = useAppStore()
  const [selectedEmergency, setSelectedEmergency] = useState(null)
  const [selectedUnit, setSelectedUnit] = useState(null)
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState(null)

  // ============================================
  // UTILIDADES DE MARCADORES (Regla #2)
  // ============================================

  /**
   * Crea íconos personalizados para el mapa
   * Función compleja que debe estar en hook
   */
  const createCustomIcon = (color, iconClass, size = [32, 32]) => {
    return L.divIcon({
      html: `<div style="background-color: ${color}; width: ${size[0]}px; height: ${size[1]}px; border-radius: 50%; display: flex; align-items: center; justify-content: center; border: 3px solid white; box-shadow: 0 2px 4px rgba(0,0,0,0.3);"><i class="${iconClass}" style="color: white; font-size: 14px;"></i></div>`,
      className: 'custom-marker',
      iconSize: size,
      iconAnchor: [size[0] / 2, size[1] / 2]
    })
  }

  const getEmergencyIcon = (emergency) => {
    if (!emergency || !emergency.priority || !emergency.type) {
      console.error('getEmergencyIcon: emergency con priority y type requeridos')
      return createCustomIcon('#6B7280', 'fas fa-heartbeat', [36, 36])
    }

    const priorityColors = {
      alta: '#DC2626', // red-600
      media: '#F59E0B', // amber-500
      baja: '#059669' // emerald-600
    }

    const typeIcons = {
      EMERGENCIA: 'fas fa-exclamation-triangle',
      URGENCIA: 'fas fa-exclamation-circle',
      MEDICO_DOMICILIO: 'fas fa-user-md',
      TRASLADO_PROGRAMADO: 'fas fa-route'
    }

    return createCustomIcon(
      priorityColors[emergency.priority] || '#6B7280',
      typeIcons[emergency.type] || 'fas fa-heartbeat',
      [36, 36]
    )
  }

  const getUnitIcon = (unit) => {
    if (!unit || !unit.currentStatus) {
      console.error('getUnitIcon: unit con currentStatus requerido')
      return createCustomIcon('#6B7280', 'fas fa-ambulance', [32, 32])
    }

    const statusColors = {
      available: '#10B981', // emerald-500
      en_route: '#3B82F6', // blue-500
      on_scene: '#8B5CF6' // violet-500
    }

    return createCustomIcon(
      statusColors[unit.currentStatus] || '#6B7280',
      'fas fa-ambulance',
      [32, 32]
    )
  }

  // ============================================
  // TRANSFORMACIONES DE DATOS (Regla #2)
  // ============================================

  /**
   * Procesa ambulancias agregando ubicaciones simuladas
   * Lógica compleja de transformación de datos
   */
  const processAmbulancesWithLocation = () => {
    if (!Array.isArray(ambulanceUsers)) {
      console.error('processAmbulancesWithLocation: ambulanceUsers debe ser array')
      return []
    }

    return ambulanceUsers.map((ambulance) => ({
      ...ambulance,
      location: ambulance.currentLocation || {
        latitude: -12.0464 + (Math.random() - 0.5) * 0.1,
        longitude: -77.0428 + (Math.random() - 0.5) * 0.1,
        timestamp: new Date().toISOString()
      }
    }))
  }

  const ambulancesWithLocation = processAmbulancesWithLocation()

  const availableUnits = ambulancesWithLocation.filter(
    (unit) => unit.status === 'active' && unit.currentStatus === 'available'
  )

  const busyUnits = ambulancesWithLocation.filter(
    (unit) =>
      unit.status === 'active' &&
      (unit.currentStatus === 'en_route' || unit.currentStatus === 'on_scene')
  )

  // ============================================
  // HANDLERS CON MANEJO DE ERRORES (Regla #8)
  // ============================================

  const handleAssignUnit = async (emergency, unit) => {
    if (!emergency || !unit) {
      return { success: false, error: 'Emergencia y unidad requeridas', code: 'MISSING_PARAMS' }
    }

    try {
      const result = await Swal.fire({
        title: 'Confirmar Asignación',
        html: `
          <div class="text-left space-y-3">
            <div class="bg-red-50 p-3 rounded-lg border border-red-200">
              <h4 class="font-semibold text-red-800">Emergencia</h4>
              <p class="text-sm text-red-700">${emergency.description}</p>
              <p class="text-sm text-red-600"><strong>Paciente:</strong> ${emergency.affiliateInfo?.name}</p>
              <p class="text-sm text-red-600"><strong>Ubicación:</strong> ${emergency.location?.address}</p>
            </div>
            <div class="bg-green-50 p-3 rounded-lg border border-green-200">
              <h4 class="font-semibold text-green-800">Unidad Asignada</h4>
              <p class="text-sm text-green-700"><strong>Unidad:</strong> ${unit.ambulance?.unit_id}</p>
              <p class="text-sm text-green-700"><strong>Conductor:</strong> ${unit.profile?.name}</p>
              <p class="text-sm text-green-600"><strong>Estado:</strong> Disponible</p>
            </div>
          </div>
        `,
        icon: 'question',
        showCancelButton: true,
        confirmButtonText: 'Asignar Unidad',
        cancelButtonText: 'Cancelar',
        confirmButtonColor: '#10B981',
        cancelButtonColor: '#6B7280'
      })

      if (result.isConfirmed) {
        setLoading(true)
        setError(null)

        await updateAmbulanceStatus(unit.id, 'en_route')

        Swal.fire({
          title: '¡Unidad Asignada!',
          html: `
            <div class="text-center">
              <div class="text-green-600 mb-2">
                <i class="fas fa-check-circle text-4xl"></i>
              </div>
              <p><strong>${unit.ambulance?.unit_id}</strong> ha sido asignada exitosamente</p>
              <p class="text-sm text-gray-600 mt-2">La unidad está en camino hacia ${emergency.location?.address}</p>
            </div>
          `,
          icon: 'success',
          timer: 3000,
          showConfirmButton: false
        })

        // Clear selections
        setSelectedEmergency(null)
        setSelectedUnit(null)
        setLoading(false)

        return { success: true, data: { emergency, unit } }
      }

      return { success: false, error: 'Operación cancelada', code: 'CANCELLED' }
    } catch (error) {
      setLoading(false)
      const errorMessage = 'No se pudo asignar la unidad'
      setError(errorMessage)

      Swal.fire({
        title: 'Error',
        text: `${errorMessage}. Intente nuevamente.`,
        icon: 'error'
      })

      return { success: false, error: error.message || errorMessage, code: 'ASSIGN_ERROR' }
    }
  }

  const handleSetArrivalTime = async (emergencyId) => {
    if (!emergencyId) {
      return { success: false, error: 'ID de emergencia requerido', code: 'MISSING_ID' }
    }

    try {
      const { value: minutes } = await Swal.fire({
        title: 'Establecer Tiempo de Llegada',
        html: `
          <div class="text-left space-y-3">
            <p>Ingrese el tiempo estimado de llegada en minutos:</p>
            <input id="arrival-time" type="number" min="1" max="120" value="15" class="swal2-input" placeholder="Minutos">
          </div>
        `,
        icon: 'question',
        showCancelButton: true,
        confirmButtonText: 'Establecer',
        cancelButtonText: 'Cancelar',
        confirmButtonColor: '#10B981',
        preConfirm: () => {
          const time = document.getElementById('arrival-time').value
          if (!time || time < 1 || time > 120) {
            Swal.showValidationMessage('Por favor ingrese un tiempo válido entre 1 y 120 minutos')
            return false
          }
          return time
        }
      })

      if (minutes) {
        setLoading(true)
        setError(null)

        setEstimatedArrivalTime(emergencyId, parseInt(minutes))

        Swal.fire({
          title: '¡Tiempo Establecido!',
          text: `Tiempo estimado de llegada: ${minutes} minutos`,
          icon: 'success',
          timer: 2000,
          showConfirmButton: false
        })

        setLoading(false)
        return { success: true, data: { emergencyId, minutes: parseInt(minutes) } }
      }

      return { success: false, error: 'Operación cancelada', code: 'CANCELLED' }
    } catch (error) {
      setLoading(false)
      const errorMessage = 'No se pudo establecer el tiempo de llegada'
      setError(errorMessage)

      Swal.fire({
        title: 'Error',
        text: errorMessage,
        icon: 'error'
      })

      return { success: false, error: error.message || errorMessage, code: 'TIME_ERROR' }
    }
  }

  const handleMapClick = () => {
    setSelectedEmergency(null)
    setSelectedUnit(null)
  }

  const handleEmergencyClick = (emergency) => {
    if (emergency) {
      setSelectedEmergency(emergency)
    }
  }

  const handleUnitClick = (unit) => {
    if (unit) {
      setSelectedUnit(unit)
    }
  }

  const clearSelections = () => {
    setSelectedEmergency(null)
    setSelectedUnit(null)
  }

  const clearError = () => setError(null)

  // ============================================
  // CLASES CSS DINÁMICAS (Regla #5)
  // ============================================

  /**
   * Obtiene clases CSS para prioridad de emergencia
   * Lógica de clases dinámicas pertenece al hook
   */
  const getPriorityClass = (priority) => {
    const classes = {
      alta: 'px-2 py-1 rounded text-xs font-medium bg-red-100 text-red-800',
      media: 'px-2 py-1 rounded text-xs font-medium bg-yellow-100 text-yellow-800',
      baja: 'px-2 py-1 rounded text-xs font-medium bg-green-100 text-green-800'
    }
    return classes[priority] || 'px-2 py-1 rounded text-xs font-medium bg-gray-100 text-gray-800'
  }

  /**
   * Obtiene clases CSS para estado de unidad
   * Lógica de clases dinámicas pertenece al hook
   */
  const getUnitStatusClass = (status) => {
    const classes = {
      en_route: 'px-2 py-1 rounded text-xs font-medium bg-blue-100 text-blue-800',
      on_scene: 'px-2 py-1 rounded text-xs font-medium bg-purple-100 text-purple-800',
      available: 'px-2 py-1 rounded text-xs font-medium bg-green-100 text-green-800'
    }
    return classes[status] || 'px-2 py-1 rounded text-xs font-medium bg-gray-100 text-gray-800'
  }

  return {
    // Estado
    selectedEmergency,
    selectedUnit,
    loading,
    error,
    ambulancesWithLocation,
    availableUnits,
    busyUnits,

    // Funciones de marcadores
    getEmergencyIcon,
    getUnitIcon,

    // Handlers
    handleAssignUnit,
    handleSetArrivalTime,
    handleMapClick,
    handleEmergencyClick,
    handleUnitClick,
    clearSelections,
    clearError,

    // Clases CSS dinámicas
    getPriorityClass,
    getUnitStatusClass
  }
}
