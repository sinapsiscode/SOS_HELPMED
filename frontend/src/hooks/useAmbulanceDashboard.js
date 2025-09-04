import { useState, useEffect, useCallback } from 'react'
import useAppStore from '../stores/useAppStore'
import useAmbulanceLocation from './useAmbulanceLocation'
import useAmbulanceEmergencies from './useAmbulanceEmergencies'
import useAmbulanceMedicalNotes from './useAmbulanceMedicalNotes'
import useAmbulanceRoutes from './useAmbulanceRoutes'
import useAmbulanceData from './useAmbulanceData'
import useServiceCompletion from './useServiceCompletion'

/**
 * Hook coordinador para gestión integral del dashboard de ambulancia
 * REFACTORIZADO siguiendo TODAS las reglas:
 *
 * ✅ Regla #2: Lógica extraída a hooks especializados
 * ✅ Regla #5: Gestión de estados distribuida
 * ✅ Regla #13: Optimización con composición de hooks
 * 
 * Funcionalidades distribuidas:
 * - useAmbulanceLocation: Gestión de ubicación y tracking
 * - useAmbulanceEmergencies: Operaciones de emergencias
 * - useAmbulanceMedicalNotes: Gestión de notas médicas
 * - useAmbulanceRoutes: Cálculo de rutas
 * - useAmbulanceData: Gestión de datos y estadísticas
 */
const useAmbulanceDashboard = () => {
  // ============================================
  // STORE Y ESTADOS GLOBALES
  // ============================================
  const { currentUser, updateUser } = useAppStore()

  // ============================================
  // ESTADOS LOCALES
  // ============================================
  const [activeTab, setActiveTab] = useState('dashboard')
  const [showEmergencyForm, setShowEmergencyForm] = useState(false)

  // ============================================
  // HOOKS ESPECIALIZADOS
  // ============================================
  const locationHook = useAmbulanceLocation(currentUser?.id)
  const emergenciesHook = useAmbulanceEmergencies(currentUser?.id, updateUser)
  const notesHook = useAmbulanceMedicalNotes(currentUser?.id)
  const routesHook = useAmbulanceRoutes()
  const dataHook = useAmbulanceData(currentUser, emergenciesHook.emergencyAlerts)
  const completionHook = useServiceCompletion()

  // ============================================
  // INICIALIZACIÓN
  // ============================================
  useEffect(() => {
    dataHook.initializeAmbulanceData(
      locationHook.getCurrentLocation,
      emergenciesHook.loadEmergencyAlerts
    )
    return () => {
      locationHook.cleanup()
    }
  }, [])

  // ============================================
  // FUNCIONES DE CONTROL
  // ============================================
  const handleTabChange = useCallback((tab) => {
    setActiveTab(tab)
  }, [])

  // Wrappers para integrar hooks
  const handleCompleteEmergency = useCallback(async (emergencyId) => {
    // Obtener datos de la emergencia actual
    const emergency = emergenciesHook.emergencyAlerts.find(e => e.id === emergencyId)
    
    if (emergency) {
      // Preparar información del paciente
      const patientInfo = {
        name: emergency.patientName || emergency.userName,
        age: emergency.patientAge || 'No especificada',
        symptoms: emergency.description || 'No especificados',
        requestedService: emergency.type || 'médical'
      }
      
      // Abrir el modal de clasificación
      completionHook.openCompletionModal({
        id: emergencyId,
        patientInfo,
        emergencyCode: emergency.code || `EMG-${emergencyId}`
      })
    }
  }, [emergenciesHook.emergencyAlerts, completionHook])

  const handleCalculateRoute = useCallback(async (emergencyLocation) => {
    await routesHook.calculateRoute(locationHook.ambulanceLocation, emergencyLocation)
  }, [routesHook, locationHook])

  const handleSimulateEmergency = useCallback(async () => {
    await emergenciesHook.simulateEmergency()
    setShowEmergencyForm(false)
  }, [emergenciesHook])

  // ============================================
  // RETORNO COORDINADO DE TODOS LOS HOOKS
  // ============================================
  return {
    // Estados básicos
    activeTab,
    loading: emergenciesHook.loading || dataHook.loading || routesHook.loading,
    error: emergenciesHook.error || notesHook.error || dataHook.error,

    // Estados de modals
    showEmergencyForm,
    showPatientHistoryModal: dataHook.showPatientHistoryModal,
    selectedHistoryPatient: dataHook.selectedHistoryPatient,
    showMedicalNotesModal: notesHook.showMedicalNotesModal,
    showCompletionModal: completionHook.isModalOpen,
    completionModalData: completionHook.currentEmergency,

    // Datos delegados
    ambulanceLocation: locationHook.ambulanceLocation,
    isLocationTracking: locationHook.isLocationTracking,
    emergencyAlerts: emergenciesHook.emergencyAlerts,
    emergencyData: emergenciesHook.emergencyData,
    patientHistory: dataHook.patientHistory,
    patientNotes: notesHook.patientNotes,
    currentPatient: notesHook.currentPatient,
    routes: routesHook.routes,
    eta: routesHook.eta,
    distance: routesHook.distance,
    dashboardStats: dataHook.dashboardStats,
    activeAlerts: dataHook.activeAlerts,

    // Funciones de navegación
    handleTabChange,
    setActiveTab,

    // Funciones de ubicación (delegadas)
    toggleLocationTracking: locationHook.toggleLocationTracking,
    startLocationTracking: locationHook.startLocationTracking,
    stopLocationTracking: locationHook.stopLocationTracking,
    getCurrentLocation: locationHook.getCurrentLocation,

    // Funciones de emergencia (delegadas)
    simulateEmergency: handleSimulateEmergency,
    respondToEmergency: emergenciesHook.respondToEmergency,
    completeEmergency: handleCompleteEmergency,
    updateEmergencyData: emergenciesHook.updateEmergencyData,
    calculateRoute: handleCalculateRoute,

    // Funciones de notas médicas (delegadas)
    saveMedicalNotes: notesHook.saveMedicalNotes,
    setPatientNotes: notesHook.setPatientNotes,
    setPatientForNotes: notesHook.setPatientForNotes,

    // Funciones de historial (delegadas)
    viewPatientHistory: dataHook.viewPatientHistory,

    // Funciones de control de modals
    setShowEmergencyForm,
    setShowMedicalNotesModal: notesHook.setShowMedicalNotesModal,
    setShowPatientHistoryModal: dataHook.setShowPatientHistoryModal,
    setSelectedHistoryPatient: dataHook.setSelectedHistoryPatient,
    setCurrentPatient: notesHook.setCurrentPatient,
    
    // Funciones del modal de completar servicio
    closeCompletionModal: completionHook.closeCompletionModal,
    processServiceCompletion: completionHook.processServiceCompletion,

    // Funciones de error
    clearError: () => {
      emergenciesHook.clearError()
      notesHook.clearError()
      dataHook.clearError()
    },

    // Funciones de inicialización (delegadas)
    initializeAmbulanceData: dataHook.initializeAmbulanceData,
    loadEmergencyAlerts: emergenciesHook.loadEmergencyAlerts,
    loadPatientHistory: dataHook.loadPatientHistory
  }
}

export default useAmbulanceDashboard