import { useState } from 'react'
import useAppStore from '../stores/useAppStore'
import Swal from 'sweetalert2'

/**
 * Hook personalizado para gestión de ambulancias
 * Centraliza toda la lógica de negocio compleja (Regla #2)
 *
 * @returns {Object} Estado y funciones para gestionar ambulancias
 */
export const useAmbulanceManagement = () => {
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
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState(null)

  // ============================================
  // FILTROS Y TRANSFORMACIONES
  // ============================================
  const filteredAmbulances = ambulanceUsers.filter((ambulance) => {
    if (filter === 'all') return true
    if (filter === 'active') return ambulance.status === 'active'
    if (filter === 'inactive') return ambulance.status === 'inactive'
    if (filter === 'on_duty')
      return ambulance.currentStatus === 'available' || ambulance.currentStatus === 'en_route'
    return true
  })

  const availableUnits = ambulanceUsers.filter(
    (unit) => unit.status === 'active' && unit.currentStatus === 'available'
  )

  // ============================================
  // HANDLERS CON MANEJO DE ERRORES (Regla #8)
  // ============================================
  const handleCreateAmbulance = () => {
    setSelectedAmbulance(null)
    setShowCreateForm(true)
    setError(null)
  }

  const handleEditAmbulance = (ambulance) => {
    if (!ambulance || !ambulance.id) {
      setError('Ambulancia inválida para editar')
      return { success: false, error: 'Ambulancia inválida', code: 'INVALID_AMBULANCE' }
    }
    setSelectedAmbulance(ambulance)
    setShowCreateForm(true)
    setError(null)
  }

  const handleDeleteAmbulance = async (ambulanceId) => {
    if (!ambulanceId) {
      return { success: false, error: 'ID de ambulancia requerido', code: 'MISSING_ID' }
    }

    try {
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
        setLoading(true)
        await deleteAmbulanceUser(ambulanceId)

        Swal.fire({
          title: '¡Eliminado!',
          text: 'La ambulancia ha sido eliminada',
          icon: 'success',
          timer: 2000,
          showConfirmButton: false
        })

        setLoading(false)
        return { success: true, data: { ambulanceId } }
      }
      return { success: false, error: 'Operación cancelada', code: 'CANCELLED' }
    } catch (error) {
      setLoading(false)
      const errorMessage = 'No se pudo eliminar la ambulancia'
      setError(errorMessage)

      Swal.fire({
        title: 'Error',
        text: errorMessage,
        icon: 'error'
      })

      return { success: false, error: error.message || errorMessage, code: 'DELETE_ERROR' }
    }
  }

  const handleSaveAmbulance = async (formData) => {
    if (!formData) {
      return { success: false, error: 'Datos del formulario requeridos', code: 'MISSING_DATA' }
    }

    try {
      setLoading(true)
      setError(null)

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
      setLoading(false)
      return { success: true, data: formData }
    } catch (error) {
      setLoading(false)
      const errorMessage = 'No se pudo guardar la ambulancia'
      setError(errorMessage)

      Swal.fire({
        title: 'Error',
        text: errorMessage,
        icon: 'error'
      })

      return { success: false, error: error.message || errorMessage, code: 'SAVE_ERROR' }
    }
  }

  const handleStatusChange = async (ambulanceId, newStatus) => {
    if (!ambulanceId || !newStatus) {
      return { success: false, error: 'ID y estado son requeridos', code: 'MISSING_PARAMS' }
    }

    try {
      setLoading(true)
      await updateAmbulanceStatus(ambulanceId, newStatus)
      setLoading(false)
      return { success: true, data: { ambulanceId, newStatus } }
    } catch (error) {
      setLoading(false)
      const errorMessage = 'No se pudo actualizar el estado'
      setError(errorMessage)

      Swal.fire({
        title: 'Error',
        text: errorMessage,
        icon: 'error'
      })

      return { success: false, error: error.message || errorMessage, code: 'STATUS_ERROR' }
    }
  }

  // ============================================
  // UTILIDADES
  // ============================================
  const getStatusColor = (status) => {
    switch (status) {
      case 'active':
        return 'bg-green-100 text-green-800 border-green-200'
      case 'inactive':
        return 'bg-gray-100 text-gray-800 border-gray-200'
      case 'maintenance':
        return 'bg-yellow-100 text-yellow-800 border-yellow-200'
      default:
        return 'bg-gray-100 text-gray-800 border-gray-200'
    }
  }

  const getCurrentStatusColor = (status) => {
    switch (status) {
      case 'available':
        return 'bg-green-100 text-green-800 border-green-200'
      case 'en_route':
        return 'bg-yellow-100 text-yellow-800 border-yellow-200'
      case 'on_scene':
        return 'bg-blue-100 text-blue-800 border-blue-200'
      case 'off_duty':
        return 'bg-gray-100 text-gray-800 border-gray-200'
      default:
        return 'bg-gray-100 text-gray-800 border-gray-200'
    }
  }

  const getStatusText = (status) => {
    switch (status) {
      case 'active':
        return 'ACTIVA'
      case 'inactive':
        return 'INACTIVA'
      case 'maintenance':
        return 'MANTENIMIENTO'
      default:
        return 'DESCONOCIDO'
    }
  }

  const getCurrentStatusText = (status) => {
    switch (status) {
      case 'available':
        return 'DISPONIBLE'
      case 'en_route':
        return 'EN CAMINO'
      case 'on_scene':
        return 'EN SITIO'
      case 'off_duty':
        return 'FUERA DE SERVICIO'
      default:
        return 'DESCONOCIDO'
    }
  }

  const clearError = () => setError(null)

  return {
    // Estado
    ambulanceUsers,
    filteredAmbulances,
    availableUnits,
    showCreateForm,
    selectedAmbulance,
    filter,
    activeTab,
    loading,
    error,
    pendingEmergencies,

    // Setters
    setShowCreateForm,
    setFilter,
    setActiveTab,

    // Handlers
    handleCreateAmbulance,
    handleEditAmbulance,
    handleDeleteAmbulance,
    handleSaveAmbulance,
    handleStatusChange,

    // Utilidades
    getStatusColor,
    getCurrentStatusColor,
    getStatusText,
    getCurrentStatusText,
    clearError
  }
}
