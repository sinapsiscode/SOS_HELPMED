import { useState } from 'react'
import Swal from 'sweetalert2'
import { INITIAL_NOTIFICATION_CONFIG } from '../mocks/notificationData'

/**
 * Hook especializado para gestión de configuración de notificaciones
 * ✅ Cumple reglas de tamaño: <100 líneas
 * ✅ Responsabilidad única: Configuration management
 * ✅ Manejo de errores incluido
 */
const useNotificationConfig = (initialConfig, systemSettings, updateSystemSettings) => {
  const [notificationConfig, setNotificationConfig] = useState(initialConfig)
  const [isLoading, setIsLoading] = useState(false)
  const [error, setError] = useState(null)

  const clearError = () => setError(null)

  const handleError = (error, context) => {
    console.error(`Error en ${context}:`, error)
    setError(`Error en ${context}: ${error.message}`)
    setIsLoading(false)
  }

  const updateNotificationConfig = (field, value) => {
    setNotificationConfig((prev) => ({
      ...prev,
      [field]: value
    }))
  }

  const saveConfiguration = async () => {
    try {
      setIsLoading(true)
      clearError()

      // Actualizar solo la configuración de notificaciones en systemSettings
      await updateSystemSettings({
        ...systemSettings,
        notificationConfig: notificationConfig
      })

      await Swal.fire({
        title: 'Configuración Guardada',
        text: 'Los cambios se han aplicado correctamente',
        icon: 'success',
        timer: 2000,
        showConfirmButton: false
      })
    } catch (error) {
      handleError(error, 'guardar configuración')
    } finally {
      setIsLoading(false)
    }
  }

  const resetToDefaults = async () => {
    try {
      const result = await Swal.fire({
        title: '¿Restablecer configuración?',
        text: 'Se restablecerán todos los valores por defecto',
        icon: 'question',
        showCancelButton: true,
        confirmButtonText: 'Sí, restablecer',
        cancelButtonText: 'Cancelar'
      })

      if (result.isConfirmed) {
        setNotificationConfig({
          ...INITIAL_NOTIFICATION_CONFIG,
          // Mantener umbrales del store
          lowServiceThreshold: systemSettings?.familiarServicesAlertThreshold || 2,
          corporateServiceThreshold: systemSettings?.corporateServicesAlertThreshold || 3,
          contractExpirationDays: systemSettings?.contractExpirationAlertDays || 7,
          noAmbulanceAlert: true
        })
      }
    } catch (error) {
      handleError(error, 'restablecer configuración')
    }
  }

  return {
    notificationConfig,
    isLoading,
    error,
    updateNotificationConfig,
    saveConfiguration,
    resetToDefaults,
    clearError
  }
}

export default useNotificationConfig