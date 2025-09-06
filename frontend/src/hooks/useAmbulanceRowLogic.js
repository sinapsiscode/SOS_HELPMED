import { useState, useCallback } from 'react'
import { LABELS } from '../config/labels'

/**
 * Hook para manejar la lógica de una fila de ambulancia
 * @param {string} ambulanceId - ID de la ambulancia
 * @returns {Object} Funciones y estado para el componente
 */
export const useAmbulanceRowLogic = (ambulanceId) => {
  const [error, setError] = useState(null)
  const labels = LABELS.admin.ambulance

  /**
   * Maneja el cambio de estado de la ambulancia
   * @param {string} newStatus - Nuevo estado
   */
  const handleStatusChange = useCallback(async (newStatus) => {
    try {
      // TODO: Implementar llamada a API para cambiar estado
      console.log(`Cambiando estado de ambulancia ${ambulanceId} a ${newStatus}`)
      
      // Por ahora solo simulamos el cambio
      // await ambulanceService.updateStatus(ambulanceId, newStatus)
    } catch (err) {
      setError(err.message || labels.form.errors.unexpectedError)
    }
  }, [ambulanceId, labels.form.errors.unexpectedError])

  /**
   * Formatea la ubicación GPS para mostrar
   * @param {Object} location - Objeto de ubicación
   * @returns {string} Ubicación formateada
   */
  const formatLocation = useCallback((location) => {
    if (!location || !location.lat || !location.lng) {
      return labels.row.notSpecifiedFemale
    }
    return `${location.lat.toFixed(6)}, ${location.lng.toFixed(6)}`
  }, [labels.row.notSpecifiedFemale])

  /**
   * Formatea el tipo de equipo médico
   * @param {string} medicalTeam - Tipo de equipo médico
   * @returns {string} Texto formateado
   */
  const formatMedicalTeam = useCallback((medicalTeam) => {
    const teamTypes = {
      'tecnico_enfermeria': labels.form.options.medicalTeam.nursingTech,
      'licenciado_enfermeria': labels.form.options.medicalTeam.nursingLicense,
      'ambos': labels.form.options.medicalTeam.both
    }
    
    return teamTypes[medicalTeam] || labels.row.notSpecified
  }, [labels.form.options.medicalTeam, labels.row.notSpecified])

  /**
   * Formatea la fecha para mostrar
   * @param {string|Date} date - Fecha a formatear
   * @returns {string} Fecha formateada
   */
  const formatDate = useCallback((date, format = 'date') => {
    if (!date) return labels.row.never
    
    const dateObj = new Date(date)
    if (isNaN(dateObj.getTime())) return labels.row.never
    
    if (format === 'time') {
      return dateObj.toLocaleTimeString('es-CL')
    }
    return dateObj.toLocaleDateString('es-CL')
  }, [labels.row.never])

  return {
    handleStatusChange,
    formatLocation,
    formatMedicalTeam,
    formatDate,
    error
  }
}