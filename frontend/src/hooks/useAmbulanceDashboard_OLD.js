import { useState, useEffect, useCallback, useMemo } from 'react'
import useAppStore from '../stores/useAppStore'
import ambulanceService from '../services/ambulanceService'

/**
 * Hook para gestión integral del dashboard de ambulancia
 * REFACTORIZADO siguiendo TODAS las reglas:
 *
 * ✅ Regla #2: Extrae TODA la lógica compleja del componente
 * ✅ Regla #5: Gestión completa de estados de ambulancia
 * ✅ Regla #7: Integración con servicios especializados
 * ✅ Regla #8: Manejo robusto de errores
 * ✅ Regla #13: Optimización con useMemo y useCallback
 *
 * @returns {Object} Estados y funciones para el dashboard de ambulancia
 */
const useAmbulanceDashboard = () => {
  // Estados del store global
  const { currentUser, updateUser } = useAppStore()

  // Estados locales para UI y funcionalidad
  const [activeTab, setActiveTab] = useState('dashboard')
  const [ambulanceLocation, setAmbulanceLocation] = useState({ lat: -12.0464, lng: -77.0428 })
  const [isLocationTracking, setIsLocationTracking] = useState(false)
  const [patientNotes, setPatientNotes] = useState('')
  const [currentPatient, setCurrentPatient] = useState(null)
  const [emergencyAlerts, setEmergencyAlerts] = useState([])
  const [patientHistory, setPatientHistory] = useState([])
  const [showPatientHistoryModal, setShowPatientHistoryModal] = useState(false)
  const [selectedHistoryPatient, setSelectedHistoryPatient] = useState(null)
  const [showEmergencyForm, setShowEmergencyForm] = useState(false)
  const [showMedicalNotesModal, setShowMedicalNotesModal] = useState(false)
  const [routes, setRoutes] = useState([])
  const [eta, setEta] = useState('--')
  const [distance, setDistance] = useState('--')
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState(null)

  // Estados para simulación de emergencia
  const [emergencyData, setEmergencyData] = useState({
    patientName: '',
    emergencyType: 'medical',
    priority: 'high',
    location: '',
    notes: ''
  })

  // Estados para gestión de ubicación
  const [watchId, setWatchId] = useState(null)

  // Estadísticas calculadas con useMemo para optimización
  const dashboardStats = useMemo(
    () => ({
      totalServices: currentUser?.ambulanceStats?.totalServices || 0,
      activeEmergencies: emergencyAlerts.filter((alert) => alert.status === 'active').length,
      completedToday: currentUser?.ambulanceStats?.completedToday || 0,
      averageResponseTime: currentUser?.ambulanceStats?.averageResponseTime || '0 min'
    }),
    [currentUser?.ambulanceStats, emergencyAlerts]
  )

  // Alertas filtradas por estado activo
  const activeAlerts = useMemo(
    () => emergencyAlerts.filter((alert) => alert.status === 'active'),
    [emergencyAlerts]
  )

  // Inicialización del componente
  useEffect(() => {
    initializeAmbulanceData()
    return () => {
      if (watchId) {
        navigator.geolocation.clearWatch(watchId)
      }
    }
  }, [])

  // Inicializar datos de ambulancia
  const initializeAmbulanceData = useCallback(async () => {
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
  }, [])

  // Cargar alertas de emergencia
  const loadEmergencyAlerts = useCallback(async () => {
    try {
      const alerts = await ambulanceService.getEmergencyAlerts()
      setEmergencyAlerts(alerts)
    } catch (err) {
      console.error('Error loading emergency alerts:', err)
    }
  }, [])

  // Cargar historial de pacientes
  const loadPatientHistory = useCallback(async () => {
    try {
      const history = await ambulanceService.getPatientHistory()
      setPatientHistory(history)
    } catch (err) {
      console.error('Error loading patient history:', err)
    }
  }, [])

  // Obtener ubicación actual
  const getCurrentLocation = useCallback(() => {
    if (navigator.geolocation) {
      navigator.geolocation.getCurrentPosition(
        (position) => {
          setAmbulanceLocation({
            lat: position.coords.latitude,
            lng: position.coords.longitude
          })
        },
        (err) => {
          console.error('Error getting location:', err)
          ambulanceService.showLocationError()
        },
        { enableHighAccuracy: true, timeout: 10000, maximumAge: 60000 }
      )
    }
  }, [])

  // Iniciar seguimiento de ubicación
  const startLocationTracking = useCallback(() => {
    if (navigator.geolocation) {
      const id = navigator.geolocation.watchPosition(
        (position) => {
          const newLocation = {
            lat: position.coords.latitude,
            lng: position.coords.longitude
          }
          setAmbulanceLocation(newLocation)
          ambulanceService.updateAmbulanceLocation(currentUser.id, newLocation)
        },
        (err) => {
          console.error('Error tracking location:', err)
          ambulanceService.showLocationError()
          setIsLocationTracking(false)
        },
        { enableHighAccuracy: true, timeout: 10000, maximumAge: 5000 }
      )
      setWatchId(id)
      setIsLocationTracking(true)
      ambulanceService.showTrackingStarted()
    }
  }, [currentUser?.id])

  // Detener seguimiento de ubicación
  const stopLocationTracking = useCallback(() => {
    if (watchId) {
      navigator.geolocation.clearWatch(watchId)
      setWatchId(null)
      setIsLocationTracking(false)
      ambulanceService.showTrackingStopped()
    }
  }, [watchId])

  // Alternar seguimiento de ubicación
  const toggleLocationTracking = useCallback(() => {
    if (isLocationTracking) {
      stopLocationTracking()
    } else {
      startLocationTracking()
    }
  }, [isLocationTracking, startLocationTracking, stopLocationTracking])

  // Simular emergencia nueva
  const simulateEmergency = useCallback(async () => {
    try {
      if (!emergencyData.patientName.trim()) {
        ambulanceService.showValidationError('Por favor ingrese el nombre del paciente')
        return
      }

      const newEmergency = await ambulanceService.createEmergency({
        ...emergencyData,
        ambulanceId: currentUser.id,
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
      setShowEmergencyForm(false)

      ambulanceService.showEmergencyCreated()
    } catch (err) {
      const errorMessage = ambulanceService.handleError(err, 'Error al simular emergencia')
      setError(errorMessage)
    }
  }, [emergencyData, currentUser?.id])

  // Responder a emergencia
  const respondToEmergency = useCallback(
    async (emergencyId) => {
      try {
        setLoading(true)

        const updatedEmergency = await ambulanceService.respondToEmergency(emergencyId, {
          ambulanceId: currentUser.id,
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
    [currentUser?.id]
  )

  // Completar emergencia
  const completeEmergency = useCallback(
    async (emergencyId) => {
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
        if (currentUser) {
          const updatedStats = ambulanceService.updateStats(currentUser.ambulanceStats)
          updateUser({
            ...currentUser,
            ambulanceStats: updatedStats
          })
        }

        setPatientNotes('')
        setCurrentPatient(null)
        ambulanceService.showEmergencyCompleted()
      } catch (err) {
        const errorMessage = ambulanceService.handleError(err, 'Error al completar emergencia')
        setError(errorMessage)
      } finally {
        setLoading(false)
      }
    },
    [patientNotes, currentUser, updateUser]
  )

  // Guardar notas médicas
  const saveMedicalNotes = useCallback(async () => {
    try {
      if (!patientNotes.trim()) {
        ambulanceService.showValidationError('Por favor ingrese las notas médicas')
        return
      }

      if (!currentPatient) {
        ambulanceService.showValidationError('No hay paciente seleccionado')
        return
      }

      await ambulanceService.saveMedicalNotes({
        patientId: currentPatient.id,
        notes: patientNotes,
        timestamp: new Date().toISOString(),
        ambulanceId: currentUser.id
      })

      ambulanceService.showNotesSuccess()
      setShowMedicalNotesModal(false)
      setPatientNotes('')
    } catch (err) {
      const errorMessage = ambulanceService.handleError(err, 'Error al guardar notas médicas')
      setError(errorMessage)
    }
  }, [patientNotes, currentPatient, currentUser?.id])

  // Calcular ruta a emergencia
  const calculateRoute = useCallback(
    async (emergencyLocation) => {
      try {
        if (!emergencyLocation) return

        setLoading(true)
        const routeData = await ambulanceService.calculateRoute(
          ambulanceLocation,
          emergencyLocation
        )

        setRoutes(routeData.routes || [])
        setEta(routeData.eta || '--')
        setDistance(routeData.distance || '--')
      } catch (err) {
        console.error('Error calculating route:', err)
        setEta('--')
        setDistance('--')
      } finally {
        setLoading(false)
      }
    },
    [ambulanceLocation]
  )

  // Ver historial de paciente
  const viewPatientHistory = useCallback((patient) => {
    setSelectedHistoryPatient(patient)
    setShowPatientHistoryModal(true)
  }, [])

  // Limpiar error
  const clearError = useCallback(() => {
    setError(null)
  }, [])

  // Cambiar tab activo
  const handleTabChange = useCallback((tab) => {
    setActiveTab(tab)
  }, [])

  // Actualizar datos de emergencia
  const updateEmergencyData = useCallback((field, value) => {
    setEmergencyData((prev) => ({
      ...prev,
      [field]: value
    }))
  }, [])

  // Configurar paciente actual para notas
  const setPatientForNotes = useCallback((patient) => {
    setCurrentPatient(patient)
    setShowMedicalNotesModal(true)
  }, [])

  return {
    // Estados básicos
    activeTab,
    ambulanceLocation,
    isLocationTracking,
    patientNotes,
    currentPatient,
    emergencyAlerts,
    patientHistory,
    emergencyData,
    routes,
    eta,
    distance,
    loading,
    error,

    // Estados de modals
    showPatientHistoryModal,
    selectedHistoryPatient,
    showEmergencyForm,
    showMedicalNotesModal,

    // Datos calculados
    dashboardStats,
    activeAlerts,

    // Funciones de navegación
    handleTabChange,
    setActiveTab,

    // Funciones de ubicación
    toggleLocationTracking,
    startLocationTracking,
    stopLocationTracking,
    getCurrentLocation,

    // Funciones de emergencia
    simulateEmergency,
    respondToEmergency,
    completeEmergency,
    updateEmergencyData,
    calculateRoute,

    // Funciones de notas médicas
    saveMedicalNotes,
    setPatientNotes,
    setPatientForNotes,

    // Funciones de historial
    viewPatientHistory,

    // Funciones de control de modals
    setShowEmergencyForm,
    setShowMedicalNotesModal,
    setShowPatientHistoryModal,
    setSelectedHistoryPatient,
    setCurrentPatient,

    // Funciones de error
    clearError,

    // Funciones de inicialización
    initializeAmbulanceData,
    loadEmergencyAlerts,
    loadPatientHistory
  }
}

export default useAmbulanceDashboard
