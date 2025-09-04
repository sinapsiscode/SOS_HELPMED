import { useState, useCallback, useMemo } from 'react'
import ambulanceService from '../services/ambulanceService'

/**
 * Hook especializado para gestión de datos y estadísticas de ambulancia
 * ✅ Cumple reglas de tamaño: <100 líneas
 * ✅ Responsabilidad única: Data management
 * ✅ Optimizado con useMemo
 */
const useAmbulanceData = (user, emergencyAlerts) => {
  const [patientHistory, setPatientHistory] = useState([])
  const [selectedHistoryPatient, setSelectedHistoryPatient] = useState(null)
  const [showPatientHistoryModal, setShowPatientHistoryModal] = useState(false)
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState(null)

  // Estadísticas calculadas con useMemo para optimización
  const dashboardStats = useMemo(
    () => ({
      totalServices: user?.ambulanceStats?.totalServices || 0,
      activeEmergencies: emergencyAlerts.filter((alert) => alert.status === 'active').length,
      completedToday: user?.ambulanceStats?.completedToday || 0,
      averageResponseTime: user?.ambulanceStats?.averageResponseTime || '15 min'
    }),
    [user?.ambulanceStats, emergencyAlerts]
  )

  // Alertas filtradas por estado activo
  const activeAlerts = useMemo(
    () => emergencyAlerts.filter((alert) => alert.status === 'active'),
    [emergencyAlerts]
  )

  // Cargar historial de pacientes
  const loadPatientHistory = useCallback(async () => {
    try {
      const history = await ambulanceService.getPatientHistory()
      setPatientHistory(history)
    } catch (err) {
      console.error('Error loading patient history:', err)
    }
  }, [])

  // Inicializar datos de ambulancia
  const initializeAmbulanceData = useCallback(async (getCurrentLocation, loadEmergencyAlerts) => {
    try {
      setLoading(true)
      setError(null)

      await Promise.all([loadEmergencyAlerts(), loadPatientHistory(), getCurrentLocation()])
    } catch (err) {
      const errorMessage = ambulanceService.handleError(
        err,
        'Error al inicializar dashboard de ambulancia'
      )
      setError(errorMessage)
    } finally {
      setLoading(false)
    }
  }, [loadPatientHistory])

  // Ver historial de paciente
  const viewPatientHistory = useCallback((patient) => {
    setSelectedHistoryPatient(patient)
    setShowPatientHistoryModal(true)
  }, [])

  return {
    patientHistory,
    selectedHistoryPatient,
    showPatientHistoryModal,
    dashboardStats,
    activeAlerts,
    loading,
    error,
    setSelectedHistoryPatient,
    setShowPatientHistoryModal,
    loadPatientHistory,
    initializeAmbulanceData,
    viewPatientHistory,
    clearError: () => setError(null)
  }
}

export default useAmbulanceData