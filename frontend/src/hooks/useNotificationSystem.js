import { useState } from 'react'
import useAppStore from '../stores/useAppStore'
import {
  INITIAL_NOTIFICATION_CONFIG,
  INITIAL_MUTED_ALERTS,
  ALERT_TYPES
} from '../mocks/notificationData'
import useNotificationAlerts from './useNotificationAlerts'
import useNotificationSounds from './useNotificationSounds'
import useNotificationPopups from './useNotificationPopups'
import useNotificationConfig from './useNotificationConfig'

/**
 * Hook coordinador para el sistema de notificaciones y alertas
 * REFACTORIZADO siguiendo TODAS las reglas:
 *
 * ✅ Regla #2: Lógica extraída a hooks especializados
 * ✅ Regla #5: Gestión de estados distribuida
 * ✅ Regla #13: Optimización con composición de hooks
 * 
 * Funcionalidades distribuidas:
 * - useNotificationAlerts: Cálculo de alertas críticas
 * - useNotificationSounds: Reproducción de sonidos
 * - useNotificationPopups: Manejo de popups automáticos
 * - useNotificationConfig: Gestión de configuración
 */
const useNotificationSystem = () => {
  // ============================================
  // STORE Y ESTADOS GLOBALES
  // ============================================
  const {
    activeEmergencies,
    ambulanceUsers,
    allUsers,
    systemSettings,
    notifications,
    removeNotification,
    updateSystemSettings
  } = useAppStore()

  // ============================================
  // ESTADOS LOCALES
  // ============================================
  const [activeTab, setActiveTab] = useState('alerts')
  const [viewedEmergencies, setViewedEmergencies] = useState(new Set())
  const [mutedAlerts, setMutedAlerts] = useState(INITIAL_MUTED_ALERTS)

  // ============================================
  // HOOKS ESPECIALIZADOS
  // ============================================
  const configHook = useNotificationConfig({
    ...INITIAL_NOTIFICATION_CONFIG,
    // Sincronizar con systemSettings si existe configuración previa
    ...(systemSettings?.notificationConfig || {}),
    // Los umbrales se toman directamente del systemSettings
    lowServiceThreshold: systemSettings?.familiarServicesAlertThreshold || 2,
    corporateServiceThreshold: systemSettings?.corporateServicesAlertThreshold || 3,
    contractExpirationDays: systemSettings?.contractExpirationAlertDays || 7,
    noAmbulanceAlert: true
  }, systemSettings, updateSystemSettings)

  const alertsHook = useNotificationAlerts(
    configHook.notificationConfig,
    mutedAlerts,
    activeEmergencies,
    ambulanceUsers,
    allUsers,
    systemSettings
  )

  const soundsHook = useNotificationSounds()

  const popupsHook = useNotificationPopups(
    activeEmergencies,
    viewedEmergencies,
    setViewedEmergencies,
    configHook.notificationConfig,
    mutedAlerts,
    (emergencyType) => {
      if (configHook.notificationConfig.playSound) {
        soundsHook.playEmergencySound(emergencyType)
      }
    }
  )

  // ============================================
  // FUNCIONES DE FILTRADO
  // ============================================
  const getFilteredNotifications = () => {
    const activeAlerts = alertsHook.activeAlerts
    const allNotifs = [
      ...activeAlerts.map((alert) => ({
        ...alert,
        timestamp: new Date(),
        isAlert: true
      })),
      ...(notifications || [])
    ]

    if (configHook.notificationConfig.notificationMode === 'quiet') {
      // Solo críticas
      return allNotifs.filter((n) => n.type === 'critical' || n.type === 'error')
    }

    return allNotifs
  }

  // ============================================
  // GESTIÓN DE SILENCIADO
  // ============================================
  const toggleMute = (alertType) => {
    setMutedAlerts((prev) => ({
      ...prev,
      [alertType]: !prev[alertType]
    }))
  }

  // ============================================
  // DATOS CALCULADOS PARA RESUMEN
  // ============================================
  const getSummaryStats = () => {
    return {
      activeEmergenciesCount:
        activeEmergencies?.filter((e) => e.status === 'pending' || e.status === 'requested')
          .length || 0,
      availableAmbulancesCount:
        ambulanceUsers?.filter((a) => a.currentStatus === 'available').length || 0,
      activeClientsCount:
        allUsers?.familiar?.filter((u) => u.plan?.status === 'active').length || 0,
      todayServicesCount:
        activeEmergencies?.filter((e) => {
          const today = new Date().toDateString()
          return e.status === 'completed' && new Date(e.timestamp).toDateString() === today
        }).length || 0
    }
  }

  // ============================================
  // RETORNO COORDINADO DE TODOS LOS HOOKS
  // ============================================
  return {
    // Estados locales
    activeTab,
    mutedAlerts,
    
    // Estados delegados
    notificationConfig: configHook.notificationConfig,
    isLoading: configHook.isLoading,
    error: configHook.error,

    // Datos calculados (delegados)
    activeAlerts: alertsHook.activeAlerts,
    filteredNotifications: getFilteredNotifications().slice(0, 20),
    summaryStats: getSummaryStats(),

    // Funciones de configuración (delegadas)
    updateNotificationConfig: configHook.updateNotificationConfig,
    saveConfiguration: configHook.saveConfiguration,
    resetToDefaults: configHook.resetToDefaults,
    clearError: configHook.clearError,

    // Funciones de alertas (delegadas)
    handleAlertClick: popupsHook.handleAlertClick,
    toggleMute,

    // Funciones de navegación
    setActiveTab,

    // Funciones de notificaciones
    removeNotification,

    // Constantes
    ALERT_TYPES
  }
}

export default useNotificationSystem