import { useState, useCallback, useMemo } from 'react'
import useAppStore from '../stores/useAppStore'
import Swal from 'sweetalert2'

/**
 * Hook que maneja toda la lógica de negocio compleja para gestión de ambulancias
 * ENFOQUE BALANCEADO: Concentra lógica de negocio, validaciones y notificaciones
 *
 * @returns {Object} Estado y handlers para gestión de ambulancias
 */
export const useAmbulanceManagementLogic = () => {
  const {
    ambulanceUsers,
    createAmbulanceUser,
    updateAmbulanceUser,
    deleteAmbulanceUser,
    pendingEmergencies,
    assignUnitToEmergency,
    updateAmbulanceStatus,
    activeEmergencies,
    setEstimatedArrivalTime,
    updateEmergencyStatus
  } = useAppStore()

  const [showCreateForm, setShowCreateForm] = useState(false)
  const [selectedAmbulance, setSelectedAmbulance] = useState(null)
  const [filter, setFilter] = useState('all')
  const [activeTab, setActiveTab] = useState('units')

  /**
   * Filtra ambulancias según criterio seleccionado
   */
  const filteredAmbulances = useMemo(() => {
    return ambulanceUsers.filter((ambulance) => {
      if (filter === 'all') return true
      if (filter === 'active') return ambulance.status === 'active'
      if (filter === 'inactive') return ambulance.status === 'inactive'
      if (filter === 'on_duty')
        return ambulance.currentStatus === 'available' || ambulance.currentStatus === 'en_route'
      return true
    })
  }, [ambulanceUsers, filter])

  /**
   * Maneja la eliminación de una ambulancia con confirmación
   *
   * @param {string} ambulanceId - ID de la ambulancia a eliminar
   */
  const handleDeleteAmbulance = useCallback(
    async (ambulanceId) => {
      const result = await Swal.fire({
        title: '¿Eliminar Ambulancia?',
        text: 'Esta acción no se puede deshacer',
        icon: 'warning',
        showCancelButton: true,
        confirmButtonText: 'Eliminar',
        cancelButtonText: 'Cancelar',
        confirmButtonColor: '#EF4444'
      })

      if (result.isConfirmed) {
        try {
          await deleteAmbulanceUser(ambulanceId)
          Swal.fire({
            title: '¡Eliminado!',
            text: 'La ambulancia ha sido eliminada',
            icon: 'success',
            timer: 2000,
            showConfirmButton: false
          })
        } catch (error) {
          Swal.fire({
            title: 'Error',
            text: 'No se pudo eliminar la ambulancia',
            icon: 'error'
          })
        }
      }
    },
    [deleteAmbulanceUser]
  )

  /**
   * Maneja el guardado de formulario (crear o actualizar)
   *
   * @param {Object} formData - Datos del formulario
   */
  const handleSaveAmbulance = useCallback(
    async (formData) => {
      try {
        if (selectedAmbulance) {
          await updateAmbulanceUser(selectedAmbulance.id, formData)
          Swal.fire({
            title: '¡Actualizado!',
            text: 'La ambulancia ha sido actualizada',
            icon: 'success',
            timer: 2000,
            showConfirmButton: false
          })
        } else {
          await createAmbulanceUser(formData)
          Swal.fire({
            title: '¡Creado!',
            text: 'La ambulancia ha sido creada',
            icon: 'success',
            timer: 2000,
            showConfirmButton: false
          })
        }
        setShowCreateForm(false)
        setSelectedAmbulance(null)
      } catch (error) {
        Swal.fire({
          title: 'Error',
          text: 'No se pudo guardar la ambulancia',
          icon: 'error'
        })
      }
    },
    [selectedAmbulance, createAmbulanceUser, updateAmbulanceUser]
  )

  /**
   * Asigna una unidad a una emergencia con confirmación
   *
   * @param {Object} emergency - Datos de la emergencia
   * @param {string} unitId - ID de la unidad a asignar
   */
  const handleAssignUnit = useCallback(
    async (emergency, unitId) => {
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
        try {
          await updateAmbulanceStatus(unitId, 'en_route')

          Swal.fire({
            title: '¡Unidad Asignada!',
            text: `${unitId} ha sido asignada y está en camino`,
            icon: 'success',
            timer: 2000,
            showConfirmButton: false
          })
        } catch (error) {
          Swal.fire({
            title: 'Error',
            text: 'No se pudo asignar la unidad',
            icon: 'error'
          })
        }
      }
    },
    [updateAmbulanceStatus]
  )

  /**
   * Establece el tiempo estimado de llegada para una emergencia
   *
   * @param {string} emergencyId - ID de la emergencia
   */
  const handleSetArrivalTime = useCallback(
    async (emergencyId) => {
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
        try {
          setEstimatedArrivalTime(emergencyId, parseInt(minutes))

          Swal.fire({
            title: '¡Tiempo Establecido!',
            text: `Tiempo estimado de llegada: ${minutes} minutos`,
            icon: 'success',
            timer: 2000,
            showConfirmButton: false
          })
        } catch (error) {
          Swal.fire({
            title: 'Error',
            text: 'No se pudo establecer el tiempo de llegada',
            icon: 'error'
          })
        }
      }
    },
    [setEstimatedArrivalTime]
  )

  /**
   * Calcula distancia entre dos puntos usando fórmula de Haversine
   *
   * @param {number} lat1 - Latitud punto 1
   * @param {number} lon1 - Longitud punto 1
   * @param {number} lat2 - Latitud punto 2
   * @param {number} lon2 - Longitud punto 2
   * @returns {number} Distancia en kilómetros
   */
  const calculateDistance = useCallback((lat1, lon1, lat2, lon2) => {
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
    return R * c
  }, [])

  /**
   * Estima tiempo de llegada basado en distancia
   *
   * @param {number} distance - Distancia en kilómetros
   * @returns {number} Tiempo estimado en minutos
   */
  const estimateArrivalTime = useCallback((distance) => {
    const avgSpeed = 40 // Velocidad promedio en km/h (considerando tráfico)
    const timeInHours = distance / avgSpeed
    const timeInMinutes = Math.ceil(timeInHours * 60)
    return timeInMinutes
  }, [])

  // Handlers para modales
  const handleCreateAmbulance = useCallback(() => {
    setSelectedAmbulance(null)
    setShowCreateForm(true)
  }, [])

  const handleEditAmbulance = useCallback((ambulance) => {
    setSelectedAmbulance(ambulance)
    setShowCreateForm(true)
  }, [])

  return {
    // Estado
    ambulanceUsers,
    filteredAmbulances,
    showCreateForm,
    selectedAmbulance,
    filter,
    activeTab,
    pendingEmergencies,

    // Setters simples
    setFilter,
    setActiveTab,
    setShowCreateForm,

    // Handlers complejos
    handleCreateAmbulance,
    handleEditAmbulance,
    handleDeleteAmbulance,
    handleSaveAmbulance,
    handleAssignUnit,
    handleSetArrivalTime,

    // Utilidades
    calculateDistance,
    estimateArrivalTime
  }
}
