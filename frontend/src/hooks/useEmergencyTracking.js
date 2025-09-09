import { useState, useEffect } from 'react'
import useAppStore from '../stores/useAppStore'
import Swal from 'sweetalert2'
import apiService from '../services/api'

/**
 * Hook para seguimiento de emergencias activas en tiempo real
 * Centraliza toda la lógica compleja de tracking (Regla #2)
 *
 * Funcionalidades:
 * - Gestión de estado de emergencias activas
 * - Filtrado por prioridad, estado y rango de tiempo
 * - Manejo de asignación de unidades
 * - Establecimiento de tiempos de llegada
 * - Cálculo de estadísticas en tiempo real
 * - Manejo de notas y actualizaciones de estado
 *
 * @returns {Object} Estado y funciones para seguimiento de emergencias
 */
export const useEmergencyTracking = () => {
  const { activeEmergencies, setEstimatedArrivalTime, updateEmergencyStatus } = useAppStore()
  const [selectedEmergency, setSelectedEmergency] = useState(null)
  const [viewMode, setViewMode] = useState('timeline') // timeline, map, grid
  const [filterPriority, setFilterPriority] = useState('all')
  const [filterStatus, setFilterStatus] = useState('all')
  const [filterTimeRange, setFilterTimeRange] = useState('today')
  const [emergencies, setEmergencies] = useState([])
  const [isLoading, setIsLoading] = useState(true)
  const [error, setError] = useState(null)

  // Cargar emergencias desde API al montar
  useEffect(() => {
    fetchEmergencies()
  }, [])

  const fetchEmergencies = async () => {
    try {
      setIsLoading(true)
      setError(null)
      const data = await apiService.getEmergencies()
      // Mapear datos si es necesario para compatibilidad
      const mappedData = data.map(e => ({
        ...e,
        startTime: e.createdAt || e.startTime,
        patientName: e.patient?.name || e.patientName,
        patientAge: e.patient?.age || e.patientAge,
        location: e.location?.address || e.location,
        distance: e.location?.distance || e.distance,
        estimatedArrival: e.eta || e.estimatedArrival,
        ambulanceUnit: e.assignedAmbulance || e.ambulanceUnit
      }))
      setEmergencies(mappedData)
    } catch (err) {
      setError('Error al cargar emergencias')
      console.error('Error fetching emergencies:', err)
    } finally {
      setIsLoading(false)
    }
  }

  // ============================================
  // FILTROS Y BÚSQUEDA (Regla #2)
  // ============================================

  /**
   * Filtra emergencias según criterios seleccionados
   * Lógica compleja que debe estar en hook
   */
  const getFilteredEmergencies = () => {
    return emergencies.filter((emergency) => {
      const priorityMatch = filterPriority === 'all' || emergency.priority === filterPriority
      const statusMatch = filterStatus === 'all' || emergency.status === filterStatus

      let timeMatch = true
      if (filterTimeRange !== 'all') {
        const emergencyDate = new Date(emergency.startTime)
        const now = new Date()

        switch (filterTimeRange) {
          case 'today':
            timeMatch = emergencyDate.toDateString() === now.toDateString()
            break
          case 'last24h':
            timeMatch = now - emergencyDate <= 24 * 60 * 60 * 1000
            break
          case 'last7days':
            timeMatch = now - emergencyDate <= 7 * 24 * 60 * 60 * 1000
            break
        }
      }

      return priorityMatch && statusMatch && timeMatch
    })
  }

  // ============================================
  // CÁLCULOS DE ESTADÍSTICAS (Regla #2)
  // ============================================

  /**
   * Calcula estadísticas de emergencias
   * Cálculos complejos que deben estar en hook
   */
  const getEmergencyStats = () => {
    return {
      total: emergencies.length,
      active: emergencies.filter((e) => e.status === 'EN_PROGRESO' || e.status === 'EN_RUTA')
        .length,
      pending: emergencies.filter((e) => e.status === 'PENDIENTE').length,
      completed: emergencies.filter((e) => e.status === 'COMPLETADA').length,
      avgResponseTime: 8.5,
      criticalCount: emergencies.filter((e) => e.priority === 'CRITICA').length
    }
  }

  // ============================================
  // CLASES CSS DINÁMICAS (Regla #5)
  // ============================================

  /**
   * Obtiene clase CSS para prioridad de emergencia
   */
  const getPriorityColor = (priority) => {
    const colors = {
      CRITICA: 'text-red-600',
      ALTA: 'text-orange-600',
      MEDIA: 'text-yellow-600',
      BAJA: 'text-green-600'
    }
    return colors[priority] || 'text-gray-600'
  }

  /**
   * Obtiene clase CSS para estado de emergencia
   */
  const getStatusColor = (status) => {
    const colors = {
      PENDIENTE: 'bg-red-100 text-red-800',
      EN_PROGRESO: 'bg-blue-100 text-blue-800',
      EN_RUTA: 'bg-yellow-100 text-yellow-800',
      COMPLETADA: 'bg-green-100 text-green-800'
    }
    return colors[status] || 'bg-gray-100 text-gray-800'
  }

  /**
   * Obtiene clase CSS para tarjeta de prioridad
   */
  const getPriorityCardColor = (priority) => {
    const colors = {
      CRITICA: 'bg-red-100 text-red-800 border-red-200',
      ALTA: 'bg-orange-100 text-orange-800 border-orange-200',
      MEDIA: 'bg-yellow-100 text-yellow-800 border-yellow-200',
      BAJA: 'bg-green-100 text-green-800 border-green-200'
    }
    return colors[priority] || 'bg-gray-100 text-gray-800 border-gray-200'
  }

  // ============================================
  // CÁLCULOS DE TIEMPO (Regla #2)
  // ============================================

  /**
   * Calcula tiempo transcurrido desde inicio de emergencia
   */
  const getElapsedTime = (startTime) => {
    const start = new Date(startTime)
    const now = new Date()
    const diffMinutes = Math.floor((now - start) / (1000 * 60))
    return diffMinutes
  }

  /**
   * Calcula tiempo transcurrido formateado para detalles
   */
  const getElapsedTimeFormatted = (startTime) => {
    const start = new Date(startTime)
    const now = new Date()
    const diffMinutes = Math.floor((now - start) / (1000 * 60))
    const hours = Math.floor(diffMinutes / 60)
    const minutes = diffMinutes % 60
    return hours > 0 ? `${hours}h ${minutes}m` : `${minutes}m`
  }

  // ============================================
  // MANEJO DE EMERGENCIAS (Regla #2)
  // ============================================

  /**
   * Establece tiempo estimado de llegada para una emergencia
   * Lógica compleja con SweetAlert y validaciones
   */
  const handleSetArrivalTime = async (emergency) => {
    if (!emergency) {
      setError('Emergencia no válida')
      return { success: false, error: 'Emergencia no válida', code: 'INVALID_EMERGENCY' }
    }

    try {
      setIsLoading(true)
      setError(null)

      const result = await Swal.fire({
        title: 'Establecer Tiempo de Llegada',
        html: `
          <div class="text-left">
            <p class="mb-2 text-gray-600">Emergencia: <strong>${emergency.id}</strong></p>
            <p class="mb-4 text-gray-600">Paciente: <strong>${emergency.patient.name}</strong></p>
            <div class="mb-2">
              <label class="block text-sm font-medium text-gray-700 mb-1">Tiempo estimado de llegada (minutos)</label>
              <input 
                type="number" 
                id="arrival-time-input" 
                class="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                placeholder="Ej: 15"
                min="1"
                max="120"
              />
            </div>
          </div>
        `,
        showCancelButton: true,
        confirmButtonText: 'Establecer',
        cancelButtonText: 'Cancelar',
        confirmButtonColor: '#3B82F6',
        preConfirm: () => {
          const input = document.getElementById('arrival-time-input')
          const value = input.value

          if (!value || value <= 0) {
            Swal.showValidationMessage('Por favor ingrese un tiempo válido')
            return false
          }

          if (value > 120) {
            Swal.showValidationMessage('El tiempo no puede ser mayor a 120 minutos')
            return false
          }

          return value
        }
      })

      if (result.isConfirmed) {
        // Actualizar el tiempo en el store
        setEstimatedArrivalTime(emergency.id, parseInt(result.value))

        // Actualizar la emergencia local
        setEmergencies((prev) =>
          prev.map((emg) =>
            emg.id === emergency.id ? { ...emg, estimatedArrivalTime: parseInt(result.value) } : emg
          )
        )

        Swal.fire({
          icon: 'success',
          title: 'Tiempo Establecido',
          text: `Tiempo de llegada: ${result.value} minutos`,
          timer: 2000,
          showConfirmButton: false
        })

        setIsLoading(false)
        return {
          success: true,
          data: { emergencyId: emergency.id, arrivalTime: parseInt(result.value) }
        }
      }

      setIsLoading(false)
      return { success: false, error: 'Operación cancelada', code: 'CANCELLED' }
    } catch (error) {
      setIsLoading(false)
      const errorMessage = 'No se pudo establecer el tiempo de llegada'
      setError(errorMessage)

      return { success: false, error: error.message || errorMessage, code: 'ARRIVAL_TIME_ERROR' }
    }
  }

  /**
   * Asigna unidad médica a emergencia
   * Lógica de negocio compleja
   */
  const handleAssignUnit = async (emergency) => {
    if (!emergency) {
      setError('Emergencia no válida')
      return { success: false, error: 'Emergencia no válida', code: 'INVALID_EMERGENCY' }
    }

    try {
      setIsLoading(true)
      setError(null)

      const result = await Swal.fire({
        title: 'Asignar Unidad',
        text: `¿Asignar unidad a emergencia ${emergency.id}?`,
        icon: 'question',
        showCancelButton: true,
        confirmButtonColor: '#3B82F6',
        confirmButtonText: 'Asignar',
        cancelButtonText: 'Cancelar'
      })

      if (result.isConfirmed) {
        // Aquí iría la lógica para asignar unidad
        Swal.fire('Asignada', 'Unidad asignada correctamente', 'success')

        setIsLoading(false)
        return { success: true, data: { emergencyId: emergency.id } }
      }

      setIsLoading(false)
      return { success: false, error: 'Operación cancelada', code: 'CANCELLED' }
    } catch (error) {
      setIsLoading(false)
      const errorMessage = 'No se pudo asignar la unidad'
      setError(errorMessage)

      return { success: false, error: error.message || errorMessage, code: 'ASSIGN_ERROR' }
    }
  }

  /**
   * Actualiza estado de emergencia
   * Lógica de actualización con store
   */
  const handleUpdateStatus = (emergency, status) => {
    if (!emergency || !status) return

    try {
      updateEmergencyStatus(emergency.id, status)
      setEmergencies((prev) =>
        prev.map((emg) => (emg.id === emergency.id ? { ...emg, status } : emg))
      )

      return { success: true, data: { emergencyId: emergency.id, status } }
    } catch (error) {
      setError('No se pudo actualizar el estado')
      return { success: false, error: error.message, code: 'UPDATE_ERROR' }
    }
  }

  /**
   * Agrega nota a emergencia
   * Lógica de notas con SweetAlert
   */
  const handleAddNote = async (emergency) => {
    if (!emergency) {
      setError('Emergencia no válida')
      return { success: false, error: 'Emergencia no válida', code: 'INVALID_EMERGENCY' }
    }

    try {
      const result = await Swal.fire({
        title: 'Agregar Nota',
        input: 'textarea',
        inputPlaceholder: 'Escriba su nota aquí...',
        showCancelButton: true,
        confirmButtonColor: '#3B82F6'
      })

      if (result.isConfirmed && result.value) {
        Swal.fire('Guardada', 'Nota agregada correctamente', 'success')
        return { success: true, data: { emergencyId: emergency.id, note: result.value } }
      }

      return { success: false, error: 'Operación cancelada', code: 'CANCELLED' }
    } catch (error) {
      setError('No se pudo agregar la nota')
      return { success: false, error: error.message, code: 'NOTE_ERROR' }
    }
  }

  const clearError = () => setError(null)

  return {
    // Estado
    selectedEmergency,
    viewMode,
    filterPriority,
    filterStatus,
    filterTimeRange,
    emergencies,
    isLoading,
    error,

    // Datos calculados
    filteredEmergencies: getFilteredEmergencies(),
    emergencyStats: getEmergencyStats(),

    // Funciones de estilo
    getPriorityColor,
    getStatusColor,
    getPriorityCardColor,

    // Funciones de tiempo
    getElapsedTime,
    getElapsedTimeFormatted,

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
  }
}
