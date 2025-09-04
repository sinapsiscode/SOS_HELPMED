import { useCallback } from 'react'
import useAppStore from '../stores/useAppStore'
import Swal from 'sweetalert2'

/**
 * Hook para manejar la lógica de una fila de ambulancia individual
 * ENFOQUE BALANCEADO: Solo lógica de negocio y transformaciones
 *
 * @param {string} ambulanceId - ID de la ambulancia
 * @returns {Object} Handlers y utilidades para la fila
 */
export const useAmbulanceRowLogic = (ambulanceId) => {
  const { updateAmbulanceStatus } = useAppStore()

  /**
   * Maneja el cambio de estado de la ambulancia
   *
   * @param {string} newStatus - Nuevo estado a establecer
   */
  const handleStatusChange = useCallback(
    async (newStatus) => {
      try {
        await updateAmbulanceStatus(ambulanceId, newStatus)
      } catch (error) {
        Swal.fire({
          title: 'Error',
          text: 'No se pudo actualizar el estado',
          icon: 'error'
        })
      }
    },
    [ambulanceId, updateAmbulanceStatus]
  )

  /**
   * Formatea la ubicación para mostrar
   *
   * @param {Object} location - Objeto con datos de ubicación
   * @returns {string} Ubicación formateada
   */
  const formatLocation = useCallback((location) => {
    if (!location) return 'Sin ubicación'
    if (location.simulated) return 'Ubicación simulada'
    return `${location.latitude.toFixed(4)}, ${location.longitude.toFixed(4)}`
  }, [])

  /**
   * Obtiene las clases CSS para el estado principal
   *
   * @param {string} status - Estado de la ambulancia
   * @returns {string} Clases CSS
   */
  const getStatusColor = useCallback((status) => {
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
  }, [])

  /**
   * Obtiene las clases CSS para el estado actual
   *
   * @param {string} status - Estado actual de la ambulancia
   * @returns {string} Clases CSS
   */
  const getCurrentStatusColor = useCallback((status) => {
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
  }, [])

  /**
   * Obtiene el texto para mostrar el estado
   *
   * @param {string} status - Estado de la ambulancia
   * @returns {string} Texto del estado
   */
  const getStatusText = useCallback((status) => {
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
  }, [])

  /**
   * Obtiene el texto para el estado actual
   *
   * @param {string} status - Estado actual
   * @returns {string} Texto del estado actual
   */
  const getCurrentStatusText = useCallback((status) => {
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
  }, [])

  return {
    handleStatusChange,
    formatLocation,
    getStatusColor,
    getCurrentStatusColor,
    getStatusText,
    getCurrentStatusText
  }
}
