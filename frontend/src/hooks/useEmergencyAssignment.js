import { useState } from 'react'
import useAppStore from '../stores/useAppStore'
import Swal from 'sweetalert2'

/**
 * Hook para gestión de asignación de emergencias
 * Centraliza lógica compleja de cálculos geográficos y asignaciones (Regla #2)
 */
export const useEmergencyAssignment = () => {
  const { updateAmbulanceStatus, setEstimatedArrivalTime } = useAppStore()
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState(null)

  // ============================================
  // CÁLCULOS GEOGRÁFICOS COMPLEJOS
  // ============================================

  /**
   * Calcula distancia entre dos puntos usando fórmula de Haversine
   * Función compleja que debe estar en hook (Regla #2)
   */
  const calculateDistance = (lat1, lon1, lat2, lon2) => {
    const R = 6371 // Radio de la Tierra en km
    const dLat = ((lat2 - lat1) * Math.PI) / 180
    const dLon = ((lon2 - lon1) * Math.PI) / 180
    const a =
      Math.sin(dLat / 2) * Math.sin(dLat / 2) +
      Math.cos((lat1 * Math.PI) / 180) *
        Math.cos((lat2 * Math.PI) / 180) *
        Math.sin(dLon / 2) *
        Math.sin(dLon / 2)
    const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a))
    return R * c // Distancia en km
  }

  /**
   * Estima tiempo de llegada basado en distancia
   * Lógica de negocio compleja (Regla #2)
   */
  const estimateArrivalTime = (distance) => {
    const avgSpeed = 40 // Velocidad promedio en km/h (considerando tráfico)
    const timeInHours = distance / avgSpeed
    const timeInMinutes = Math.ceil(timeInHours * 60)
    return timeInMinutes
  }

  /**
   * Procesa unidades disponibles con distancias y tiempos
   * Transformación compleja de datos (Regla #2)
   */
  const processAvailableUnits = (availableUnits, emergency) => {
    if (!Array.isArray(availableUnits) || !emergency?.location?.coordinates) {
      return []
    }

    return availableUnits
      .map((unit) => {
        // Generar ubicación simulada para la unidad si no tiene
        const unitLocation = unit.currentLocation || {
          latitude: -12.0464 + (Math.random() - 0.5) * 0.1,
          longitude: -77.0428 + (Math.random() - 0.5) * 0.1
        }

        // Calcular distancia y tiempo estimado
        const distance = calculateDistance(
          emergency.location.coordinates.latitude,
          emergency.location.coordinates.longitude,
          unitLocation.latitude,
          unitLocation.longitude
        )
        const estimatedTime = estimateArrivalTime(distance)

        return {
          ...unit,
          distance: distance,
          estimatedTime: estimatedTime,
          unitLocation: unitLocation
        }
      })
      .sort((a, b) => a.distance - b.distance) // Ordenar por distancia
  }

  // ============================================
  // HANDLERS CON MANEJO DE ERRORES (Regla #8)
  // ============================================

  const handleAssignUnit = async (emergency, unitId) => {
    if (!emergency || !unitId) {
      return { success: false, error: 'Emergencia y unidad requeridas', code: 'MISSING_PARAMS' }
    }

    try {
      const result = await Swal.fire({
        title: 'Asignar Unidad',
        html: `
          <div class="text-left space-y-3">
            <div><strong>Emergencia:</strong> ${emergency.description}</div>
            <div><strong>Paciente:</strong> ${emergency.affiliateInfo.name} (${emergency.affiliateInfo.relation})</div>
            <div><strong>Ubicación:</strong> ${emergency.location.address}</div>
          </div>
        `,
        text: `¿Confirmar asignación de ${unitId} a esta emergencia?`,
        icon: 'question',
        showCancelButton: true,
        confirmButtonText: 'Asignar',
        cancelButtonText: 'Cancelar',
        confirmButtonColor: '#10B981'
      })

      if (result.isConfirmed) {
        setLoading(true)
        setError(null)

        // Actualizar estado de la ambulancia
        await updateAmbulanceStatus(unitId, 'en_route')

        Swal.fire({
          title: '¡Unidad Asignada!',
          text: `${unitId} ha sido asignada y está en camino`,
          icon: 'success',
          timer: 2000,
          showConfirmButton: false
        })

        setLoading(false)
        return { success: true, data: { emergency, unitId } }
      }

      return { success: false, error: 'Operación cancelada', code: 'CANCELLED' }
    } catch (error) {
      setLoading(false)
      const errorMessage = 'No se pudo asignar la unidad'
      setError(errorMessage)

      Swal.fire({
        title: 'Error',
        text: errorMessage,
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

  // ============================================
  // UTILIDADES DE PRESENTACIÓN
  // ============================================

  const getPriorityColor = (priority) => {
    switch (priority) {
      case 'alta':
        return 'bg-red-100 text-red-800 border-red-200'
      case 'media':
        return 'bg-yellow-100 text-yellow-800 border-yellow-200'
      case 'baja':
        return 'bg-green-100 text-green-800 border-green-200'
      default:
        return 'bg-gray-100 text-gray-800 border-gray-200'
    }
  }

  const getServiceTypeIcon = (type) => {
    switch (type) {
      case 'EMERGENCIA':
        return 'fas fa-exclamation-triangle text-red-600'
      case 'URGENCIA':
        return 'fas fa-exclamation-circle text-orange-600'
      case 'MEDICO_DOMICILIO':
        return 'fas fa-user-md text-blue-600'
      case 'TRASLADO_PROGRAMADO':
        return 'fas fa-route text-green-600'
      default:
        return 'fas fa-heartbeat text-gray-600'
    }
  }

  const clearError = () => setError(null)

  return {
    // Estado
    loading,
    error,

    // Funciones de cálculo
    calculateDistance,
    estimateArrivalTime,
    processAvailableUnits,

    // Handlers
    handleAssignUnit,
    handleSetArrivalTime,

    // Utilidades
    getPriorityColor,
    getServiceTypeIcon,
    clearError
  }
}
