import { useState, useCallback } from 'react'
import ambulanceService from '../services/ambulanceService'

/**
 * Hook para gestionar la lógica de completar y clasificar servicios
 * ARQUITECTURA MODULAR:
 * - Separa la lógica del componente visual
 * - Maneja estados y operaciones de forma centralizada
 * - Integra con servicios externos
 * 
 * @returns {Object} Estados y funciones para completar servicios
 */
const useServiceCompletion = () => {
  const [isModalOpen, setIsModalOpen] = useState(false)
  const [currentEmergency, setCurrentEmergency] = useState(null)
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState(null)

  /**
   * Abrir modal de completar servicio
   */
  const openCompletionModal = useCallback((emergencyData) => {
    setCurrentEmergency(emergencyData)
    setIsModalOpen(true)
    setError(null)
  }, [])

  /**
   * Cerrar modal
   */
  const closeCompletionModal = useCallback(() => {
    setIsModalOpen(false)
    setCurrentEmergency(null)
    setError(null)
  }, [])

  /**
   * Procesar la clasificación del servicio
   */
  const processServiceCompletion = useCallback(async (completionData) => {
    try {
      setLoading(true)
      setError(null)

      // Preparar datos para enviar
      const dataToSubmit = {
        emergencyId: currentEmergency?.id,
        classification: completionData.serviceClassification,
        treatment: completionData.treatmentApplied,
        observations: completionData.additionalObservations,
        completedAt: completionData.completedAt,
        patientInfo: completionData.patientInfo
      }

      // Simular envío al backend (aquí se haría la llamada real a la API)
      await ambulanceService.completeEmergencyWithClassification(
        currentEmergency?.id, 
        dataToSubmit
      )

      // Mostrar mensaje de éxito
      await ambulanceService.showServiceCompletionSuccess(
        getClassificationLabel(completionData.serviceClassification)
      )

      // Cerrar modal
      closeCompletionModal()

      // Retornar éxito
      return { success: true, data: dataToSubmit }
    } catch (err) {
      const errorMessage = ambulanceService.handleError(
        err, 
        'Error al completar el servicio'
      )
      setError(errorMessage)
      return { success: false, error: errorMessage }
    } finally {
      setLoading(false)
    }
  }, [currentEmergency, closeCompletionModal])

  /**
   * Obtener etiqueta de clasificación
   */
  const getClassificationLabel = (classification) => {
    const labels = {
      'emergency_real': 'Emergencia Real',
      'medical_urgency': 'Urgencia Médica',
      'home_doctor': 'Médico a Domicilio',
      'scheduled_transfer': 'Traslado Programado',
      'protected_zone': 'Zona Protegida',
      'false_alarm': 'Falsa Alarma'
    }
    return labels[classification] || classification
  }

  /**
   * Obtener estadísticas de clasificación
   */
  const getClassificationStats = useCallback((completedServices) => {
    if (!completedServices || !Array.isArray(completedServices)) {
      return {
        emergency_real: 0,
        medical_urgency: 0,
        home_doctor: 0,
        scheduled_transfer: 0,
        protected_zone: 0,
        false_alarm: 0,
        total: 0
      }
    }

    const stats = completedServices.reduce((acc, service) => {
      const classification = service.classification || 'unknown'
      acc[classification] = (acc[classification] || 0) + 1
      acc.total++
      return acc
    }, { total: 0 })

    return stats
  }, [])

  /**
   * Validar si se puede completar un servicio
   */
  const canCompleteService = useCallback((emergency) => {
    // Verificar que la emergencia esté en estado que permite completarla
    const allowedStatuses = ['responding', 'on_site', 'in_progress']
    return emergency && allowedStatuses.includes(emergency.status)
  }, [])

  return {
    // Estados
    isModalOpen,
    currentEmergency,
    loading,
    error,

    // Funciones principales
    openCompletionModal,
    closeCompletionModal,
    processServiceCompletion,

    // Funciones auxiliares
    getClassificationLabel,
    getClassificationStats,
    canCompleteService
  }
}

export default useServiceCompletion