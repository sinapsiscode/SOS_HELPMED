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
  const [notificationConfig, setNotificationConfig] = useState({
    ...INITIAL_NOTIFICATION_CONFIG,
    // Sincronizar con systemSettings si existe configuración previa
    ...(systemSettings?.notificationConfig || {}),
    // Los umbrales se toman directamente del systemSettings
    lowServiceThreshold: systemSettings?.familiarServicesAlertThreshold || 2,
    corporateServiceThreshold: systemSettings?.corporateServicesAlertThreshold || 3,
    contractExpirationDays: systemSettings?.contractExpirationAlertDays || 7,
    noAmbulanceAlert: true
  })
  const [isLoading, setIsLoading] = useState(false)
  const [error, setError] = useState(null)

  // ============================================
  // GESTIÓN DE ERRORES (Regla #8)
  // ============================================
  const clearError = () => setError(null)

  const handleError = (error, context) => {
    console.error(`Error en ${context}:`, error)
    setError(`Error en ${context}: ${error.message}`)
    setIsLoading(false)
  }

  // ============================================
  // FUNCIONES DE SONIDO
  // ============================================
  const playEmergencySound = (emergencyType) => {
    if (!notificationConfig.playSound) return

    try {
      const audioContext = new (window.AudioContext || window.webkitAudioContext)()
      const oscillator = audioContext.createOscillator()
      const gainNode = audioContext.createGain()

      oscillator.connect(gainNode)
      gainNode.connect(audioContext.destination)

      const soundConfig = emergencyType === 'sos' ? SOUND_CONFIG.SOS : SOUND_CONFIG.NORMAL

      oscillator.frequency.value = soundConfig.frequency
      oscillator.type = soundConfig.type
      gainNode.gain.setValueAtTime(soundConfig.gain, audioContext.currentTime)
      gainNode.gain.exponentialRampToValueAtTime(
        0.01,
        audioContext.currentTime + soundConfig.duration
      )

      oscillator.start(audioContext.currentTime)
      oscillator.stop(audioContext.currentTime + soundConfig.duration)
    } catch (e) {
      console.log('No se pudo reproducir sonido:', e)
    }
  }

  // ============================================
  // CÁLCULO DE ALERTAS CRÍTICAS
  // ============================================
  const getActiveAlerts = () => {
    const alerts = []

    // 1. Emergencias sin atender
    if (notificationConfig.enableEmergencyAlerts && !mutedAlerts.emergencies) {
      const unattendedEmergencies =
        activeEmergencies?.filter((e) => e.status === 'pending' || e.status === 'requested')
          .length || 0

      if (unattendedEmergencies > 0) {
        alerts.push({
          id: 'emergencies',
          type: ALERT_TYPES.CRITICAL.value,
          icon: 'fas fa-ambulance',
          title: `${unattendedEmergencies} emergencia(s) sin atender`,
          action: () => (window.location.hash = '#emergency-tracking')
        })
      }
    }

    // 2. Sin ambulancias disponibles
    if (
      notificationConfig.enableAmbulanceAlerts &&
      notificationConfig.noAmbulanceAlert &&
      !mutedAlerts.noAmbulances
    ) {
      const availableAmbulances =
        ambulanceUsers?.filter((a) => a.currentStatus === 'available').length || 0

      if (availableAmbulances === 0 && ambulanceUsers?.length > 0) {
        alerts.push({
          id: 'no-ambulances',
          type: ALERT_TYPES.WARNING.value,
          icon: 'fas fa-truck-medical',
          title: 'No hay ambulancias disponibles',
          subtitle: 'Todas las unidades están ocupadas'
        })
      }
    }

    // 3. Usuarios con pocos servicios restantes
    if (notificationConfig.enableServiceAlerts && !mutedAlerts.lowServices) {
      const familiarUsers = allUsers?.familiar || []
      const lowServiceUsers = familiarUsers.filter((user) => {
        if (!user.service_usage?.current_period) return false

        if (user.plan?.subtype === 'HELP') {
          const remaining = user.service_usage.current_period.remaining_services || 0
          const threshold = systemSettings?.familiarServicesAlertThreshold || 2
          return remaining <= threshold && remaining > 0
        }
        return false
      })

      if (lowServiceUsers.length > 0) {
        alerts.push({
          id: 'low-services',
          type: ALERT_TYPES.INFO.value,
          icon: 'fas fa-exclamation-triangle',
          title: `${lowServiceUsers.length} cliente(s) con servicios bajos`,
          subtitle: `${systemSettings?.familiarServicesAlertThreshold || 2} o menos servicios restantes`,
          users: lowServiceUsers
        })
      }
    }

    // 4. Contratos por vencer
    if (notificationConfig.enableContractAlerts && !mutedAlerts.contractExpiration) {
      const corporateUsers = allUsers?.corporativo || []
      const expiringContracts = corporateUsers.filter((corp) => {
        if (!corp.company?.contract_end_date) return false
        const daysLeft = Math.floor(
          (new Date(corp.company.contract_end_date) - new Date()) / (1000 * 60 * 60 * 24)
        )
        const threshold = systemSettings?.contractExpirationAlertDays || 7
        return daysLeft <= threshold && daysLeft > 0
      })

      if (expiringContracts.length > 0) {
        alerts.push({
          id: 'expiring-contracts',
          type: ALERT_TYPES.WARNING.value,
          icon: 'fas fa-calendar-times',
          title: `${expiringContracts.length} contrato(s) por vencer`,
          subtitle: `En los próximos ${systemSettings?.contractExpirationAlertDays || 7} días`,
          contracts: expiringContracts
        })
      }
    }

    return alerts
  }

  // ============================================
  // FUNCIONES DE FILTRADO
  // ============================================
  const getFilteredNotifications = () => {
    const activeAlerts = getActiveAlerts()
    const allNotifs = [
      ...activeAlerts.map((alert) => ({
        ...alert,
        timestamp: new Date(),
        isAlert: true
      })),
      ...(notifications || [])
    ]

    if (notificationConfig.notificationMode === 'quiet') {
      // Solo críticas
      return allNotifs.filter((n) => n.type === 'critical' || n.type === 'error')
    }

    return allNotifs
  }

  // ============================================
  // MANEJO DE ALERTAS Y POPUPS
  // ============================================
  const handleAlertClick = (alert) => {
    if (alert.action) {
      alert.action()
    } else if (alert.users) {
      Swal.fire({
        title: 'Clientes con Servicios Bajos',
        html: `
          <div class="text-left max-h-64 overflow-y-auto">
            ${alert.users
              .map(
                (u) => `
              <div class="mb-2 p-2 bg-yellow-50 rounded">
                <p class="font-semibold">${u.name || u.profile?.name}</p>
                <p class="text-sm">Plan: ${u.plan?.name || 'Sin plan'}</p>
                <p class="text-sm text-red-600">Servicios restantes: ${u.service_usage?.current_period?.remaining_services || 0}</p>
              </div>
            `
              )
              .join('')}
          </div>
        `,
        icon: 'info',
        confirmButtonText: 'Entendido'
      })
    } else if (alert.contracts) {
      Swal.fire({
        title: 'Contratos por Vencer',
        html: `
          <div class="text-left">
            ${alert.contracts
              .map((c) => {
                const daysLeft = Math.floor(
                  (new Date(c.company?.contract_end_date) - new Date()) / (1000 * 60 * 60 * 24)
                )
                return `
                <div class="mb-2 p-2 bg-orange-50 rounded">
                  <p class="font-semibold">${c.company?.name || c.name}</p>
                  <p class="text-sm">Vence en ${daysLeft} día(s)</p>
                  <p class="text-xs text-gray-600">${new Date(c.company?.contract_end_date).toLocaleDateString()}</p>
                </div>
              `
              })
              .join('')}
          </div>
        `,
        icon: 'warning',
        confirmButtonText: 'Entendido'
      })
    }
  }

  // ============================================
  // GESTIÓN DE CONFIGURACIÓN
  // ============================================
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
  // EFFECT PARA POPUPS AUTOMÁTICOS
  // ============================================
  useEffect(() => {
    if (!activeEmergencies || !notificationConfig.autoShowEmergencies || mutedAlerts.emergencies)
      return

    const pendingEmergencies = activeEmergencies.filter(
      (e) => (e.status === 'pending' || e.status === 'requested') && !viewedEmergencies.has(e.id)
    )

    if (pendingEmergencies.length > 0) {
      const emergency = pendingEmergencies[0]
      setViewedEmergencies((prev) => new Set([...prev, emergency.id]))

      // Reproducir sonido si está habilitado
      playEmergencySound(emergency.type)

      // Mostrar popup automático
      const timer =
        emergency.type === 'sos' && notificationConfig.sosNeverAutoClose
          ? null
          : notificationConfig.emergencyPopupDuration * 1000

      Swal.fire({
        title: emergency.type === 'sos' ? '🚨 SOS CRÍTICO 🚨' : '🚨 NUEVA EMERGENCIA',
        html: `
          <div class="text-left">
            <p><strong>Tipo:</strong> ${emergency.type === 'sos' ? 'SOS CRÍTICO' : emergency.type}</p>
            <p><strong>Usuario:</strong> ${emergency.user_id}</p>
            <p><strong>Ubicación:</strong> ${emergency.location?.address || 'Sin ubicación'}</p>
            <p><strong>Hora:</strong> ${new Date(emergency.timestamp).toLocaleTimeString()}</p>
            ${emergency.description ? `<p><strong>Descripción:</strong> ${emergency.description}</p>` : ''}
            ${
              notificationConfig.notificationMode === 'detailed' && emergency.location?.coordinates
                ? `<p class="text-xs text-gray-600 mt-2">Coords: ${emergency.location.coordinates.latitude}, ${emergency.location.coordinates.longitude}</p>`
                : ''
            }
          </div>
        `,
        icon: emergency.type === 'sos' ? 'error' : 'warning',
        confirmButtonText: 'Atender Ahora',
        showCancelButton: true,
        cancelButtonText: 'Ver después',
        confirmButtonColor: emergency.type === 'sos' ? '#DC2626' : '#F59E0B',
        timer: timer,
        timerProgressBar: timer !== null
      }).then((result) => {
        if (result.isConfirmed) {
          window.location.hash = '#emergency-tracking'
        }
      })
    }
  }, [activeEmergencies, viewedEmergencies, mutedAlerts.emergencies, notificationConfig])

  // ============================================
  // RETORNO DEL HOOK
  // ============================================
  return {
    // Estados
    activeTab,
    mutedAlerts,
    notificationConfig,
    isLoading,
    error,

    // Datos calculados
    activeAlerts: getActiveAlerts(),
    filteredNotifications: getFilteredNotifications().slice(0, 20),
    summaryStats: getSummaryStats(),

    // Funciones de configuración
    updateNotificationConfig,
    saveConfiguration,
    resetToDefaults,

    // Funciones de alertas
    handleAlertClick,
    toggleMute,

    // Funciones de navegación
    setActiveTab,

    // Funciones de notificaciones
    removeNotification,

    // Control de errores
    clearError,

    // Constantes
    ALERT_TYPES
  }
}

export default useNotificationSystem
