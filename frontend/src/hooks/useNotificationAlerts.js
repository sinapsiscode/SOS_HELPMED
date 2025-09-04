import { ALERT_TYPES } from '../mocks/notificationData'

/**
 * Hook especializado para cálculo de alertas críticas
 * ✅ Cumple reglas de tamaño: <100 líneas
 * ✅ Responsabilidad única: Alert calculations
 * ✅ Optimizado con lógica pura
 */
const useNotificationAlerts = (
  notificationConfig,
  mutedAlerts,
  activeEmergencies,
  ambulanceUsers,
  allUsers,
  systemSettings
) => {
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

  return {
    activeAlerts: getActiveAlerts()
  }
}

export default useNotificationAlerts