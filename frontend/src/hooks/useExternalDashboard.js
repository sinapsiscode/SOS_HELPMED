import { useState, useEffect, useCallback } from 'react'
import useAppStore from '../stores/useAppStore'
import externalService from '../services/externalService'
import useHighPrecisionGPS from './useHighPrecisionGPS'
import useExternalStats from './useExternalStats'
import useExternalServiceForm from './useExternalServiceForm'

/**
 * Hook coordinador para gestión integral del dashboard de usuarios externos
 * REFACTORIZADO siguiendo TODAS las reglas:
 *
 * ✅ Regla #2: Lógica extraída a hooks especializados
 * ✅ Regla #5: Gestión de estados distribuida
 * ✅ Regla #13: Optimización con composición de hooks
 * 
 * Funcionalidades distribuidas:
 * - useHighPrecisionGPS: Geolocalización de alta precisión
 * - useExternalStats: Cálculos estadísticos del usuario
 * - useExternalServiceForm: Gestión del formulario de servicio
 */
const useExternalDashboard = () => {
  // ============================================
  // HOOKS ESPECIALIZADOS
  // ============================================
  const { currentUser, requestEmergency } = useAppStore()
  const gpsHook = useHighPrecisionGPS()
  const statsHook = useExternalStats(currentUser)
  const formHook = useExternalServiceForm(currentUser)

  // ============================================
  // ESTADOS LOCALES MÍNIMOS
  // ============================================
  const [activeTab, setActiveTab] = useState('overview')
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState(null)

  // ============================================
  // INICIALIZACIÓN
  // ============================================
  useEffect(() => {
    if (!statsHook.isValidExternalUser) {
      setError('Usuario externo no válido')
      return
    }
    initializeExternalData()
  }, [statsHook.isValidExternalUser])

  // Inicializar datos del usuario externo
  const initializeExternalData = useCallback(async () => {
    try {
      setLoading(true)
      setError(null)
      // Inicialización básica completada
    } catch (err) {
      const errorMessage = externalService.handleError(
        err,
        'Error al inicializar dashboard externo'
      )
      setError(errorMessage)
    } finally {
      setLoading(false)
    }
  }, [])

  // ============================================
  // FUNCIONES DE UBICACIÓN GPS
  // ============================================
  const handleGetLocation = useCallback(async () => {
    try {
      await externalService.showLocationLoadingDialog()
      const coordinates = await gpsHook.getHighPrecisionLocation()
      externalService.hideLocationDialog()

      // Actualizar ubicación en el formulario
      formHook.updateLocationWithGPS(coordinates)
      await externalService.showLocationSuccess(coordinates)
    } catch (error) {
      externalService.hideLocationDialog()
      externalService.showLocationError(error.message)
    }
  }, [gpsHook.getHighPrecisionLocation, formHook.updateLocationWithGPS])

  // ============================================
  // FUNCIONES DE SERVICIO
  // ============================================
  const handleServiceRequest = useCallback(
    async (serviceType, description, location) => {
      if (!formHook.validateServiceForm()) {
        return
      }

      try {
        setLoading(true)

        // Verificar si el servicio tiene costo adicional
        if (statsHook.hasAdditionalCost(serviceType)) {
          const confirmed = await externalService.confirmAdditionalCost(serviceType)
          if (!confirmed) {
            setLoading(false)
            return
          }
        }

        // Preparar ubicación final (coordenadas o texto)
        const finalLocation = gpsHook.currentCoordinates || location

        const result = await requestEmergency(serviceType, description, finalLocation)

        if (result.success) {
          // Limpiar formulario y coordenadas
          formHook.clearForm()
          gpsHook.clearLocation()

          // Determinar tipo de mensaje según caso
          const hasAdditionalCostFlag =
            !statsHook.userCaseType.isCaso1 &&
            currentUser.service_usage.current_period.individual_remaining <= 0

          let message = 'Tu solicitud ha sido procesada.'
          if (statsHook.userCaseType.isCaso1) {
            message = 'La facturación será enviada directamente a tu empresa.'
          } else if (hasAdditionalCostFlag) {
            message =
              'Servicio solicitado con costo adicional de $45.000. El cargo será incluido en tu próxima facturación.'
          }

          // Mostrar confirmación de éxito
          await externalService.showServiceSuccess(message, hasAdditionalCostFlag)

          // Mostrar encuesta de calidad después de un delay
          setTimeout(async () => {
            const serviceDescription = externalService.getServiceDescription(serviceType)
            await externalService.showServiceQualitySurvey(
              serviceType,
              serviceDescription,
              currentUser
            )
          }, 1000)
        } else {
          externalService.showServiceError(result.error)
        }
      } catch (err) {
        const errorMessage = externalService.handleError(err, 'Error al solicitar servicio')
        setError(errorMessage)
      } finally {
        setLoading(false)
      }
    },
    [
      formHook.validateServiceForm,
      statsHook.hasAdditionalCost,
      requestEmergency,
      gpsHook.currentCoordinates,
      statsHook.userCaseType,
      currentUser,
      formHook.clearForm,
      gpsHook.clearLocation
    ]
  )

  // Manejar compra de servicios adicionales
  const handlePurchaseAdditional = useCallback(
    (alert) => {
      if (statsHook.userCaseType.isCaso2) {
        externalService.showPurchaseAdditionalDialog(alert, currentUser)
      }
    },
    [statsHook.userCaseType, currentUser]
  )

  // ============================================
  // FUNCIONES DE CONTROL
  // ============================================
  const handleTabChange = useCallback((tab) => {
    setActiveTab(tab)
  }, [])

  const clearError = useCallback(() => {
    setError(null)
  }, [])

  // ============================================
  // RETORNO COORDINADO
  // ============================================
  return {
    // Estados básicos
    currentUser,
    activeTab,
    loading: loading || gpsHook.isGettingLocation,
    error: error || gpsHook.error,

    // Estados de usuario externo (delegados)
    isValidExternalUser: statsHook.isValidExternalUser,
    userCaseType: statsHook.userCaseType,
    externalStats: statsHook.externalStats,
    displayLimits: statsHook.displayLimits,
    serviceBreakdown: statsHook.serviceBreakdown,

    // Estados del formulario (delegados)
    serviceFormData: formHook.serviceFormData,
    formErrors: formHook.formErrors,

    // Estados de ubicación GPS (delegados)
    isGettingLocation: gpsHook.isGettingLocation,
    currentCoordinates: gpsHook.currentCoordinates,

    // Funciones de navegación
    handleTabChange,

    // Funciones del formulario de servicio
    handleServiceRequest,
    updateServiceFormData: formHook.updateServiceFormData,
    validateServiceForm: formHook.validateServiceForm,
    useRegisteredAddress: formHook.useRegisteredAddress,

    // Funciones de ubicación GPS
    handleGetLocation,

    // Funciones de servicios (delegadas)
    canUseService: statsHook.canUseService,
    hasAdditionalCost: statsHook.hasAdditionalCost,
    handlePurchaseAdditional,

    // Funciones de control
    clearError,
    initializeExternalData
  }
}

export default useExternalDashboard
