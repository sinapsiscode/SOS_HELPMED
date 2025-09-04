import { useState, useCallback } from 'react'
import ambulanceService from '../services/ambulanceService'

/**
 * Hook especializado para operaciones de emergencias de ambulancia
 * ✅ Cumple reglas de tamaño: <100 líneas
 * ✅ Responsabilidad única: Emergency operations
 * ✅ Manejo de errores incluido
 */
const useAmbulanceEmergencies = (userId, updateUser) => {
  const [emergencyAlerts, setEmergencyAlerts] = useState([])
  const [emergencyData, setEmergencyData] = useState({
    patientName: '',
    emergencyType: 'medical',
    priority: 'high',
    location: '',
    notes: ''
  })
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState(null)

  // Cargar alertas de emergencia
  const loadEmergencyAlerts = useCallback(async () => {
    try {
      const alerts = await ambulanceService.getEmergencyAlerts()
      setEmergencyAlerts(alerts)
    } catch (err) {
      console.error('Error loading emergency alerts:', err)
    }
  }, [])

  // Simular emergencia nueva
  const simulateEmergency = useCallback(async () => {
    try {
      if (!emergencyData.patientName.trim()) {
        ambulanceService.showValidationError('Por favor ingrese el nombre del paciente')
        return
      }

      const newEmergency = await ambulanceService.createEmergency({
        ...emergencyData,
        ambulanceId: userId,
        timestamp: new Date().toISOString(),
        status: 'active',
        id: `emergency_${Date.now()}`
      })

      setEmergencyAlerts((prev) => [newEmergency, ...prev])
      setEmergencyData({
        patientName: '',
        emergencyType: 'medical',
        priority: 'high',
        location: '',
        notes: ''
      })

      ambulanceService.showEmergencyCreated()
    } catch (err) {
      const errorMessage = ambulanceService.handleError(err, 'Error al simular emergencia')
      setError(errorMessage)
    }
  }, [emergencyData, userId])

  // Responder a emergencia
  const respondToEmergency = useCallback(
    async (emergencyId) => {
      try {
        setLoading(true)

        const updatedEmergency = await ambulanceService.respondToEmergency(emergencyId, {
          ambulanceId: userId,
          respondedAt: new Date().toISOString(),
          status: 'responding'
        })

        setEmergencyAlerts((prev) =>
          prev.map((alert) => (alert.id === emergencyId ? updatedEmergency : alert))
        )

        ambulanceService.showEmergencyResponse()
      } catch (err) {
        const errorMessage = ambulanceService.handleError(err, 'Error al responder a emergencia')
        setError(errorMessage)
      } finally {
        setLoading(false)
      }
    },
    [userId]
  )

  // Completar emergencia
  const completeEmergency = useCallback(
    async (emergencyId, patientNotes, user) => {
      try {
        setLoading(true)

        const completedEmergency = await ambulanceService.completeEmergency(emergencyId, {
          completedAt: new Date().toISOString(),
          status: 'completed',
          notes: patientNotes
        })

        setEmergencyAlerts((prev) =>
          prev.map((alert) => (alert.id === emergencyId ? completedEmergency : alert))
        )

        // Actualizar estadísticas del usuario
        if (user) {
          const updatedStats = ambulanceService.updateStats(user.ambulanceStats)
          updateUser({
            ...user,
            ambulanceStats: updatedStats
          })
        }

        ambulanceService.showEmergencyCompleted()
      } catch (err) {
        const errorMessage = ambulanceService.handleError(err, 'Error al completar emergencia')
        setError(errorMessage)
      } finally {
        setLoading(false)
      }
    },
    []
  )

  // Actualizar datos de emergencia
  const updateEmergencyData = useCallback((field, value) => {
    setEmergencyData((prev) => ({
      ...prev,
      [field]: value
    }))
  }, [])

  return {
    emergencyAlerts,
    emergencyData,
    loading,
    error,
    loadEmergencyAlerts,
    simulateEmergency,
    respondToEmergency,
    completeEmergency,
    updateEmergencyData,
    clearError: () => setError(null)
  }
}

export default useAmbulanceEmergencies