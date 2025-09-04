import { useEffect } from 'react'
import Swal from 'sweetalert2'

/**
 * Hook especializado para manejo de popups y alertas interactivas
 * ✅ Cumple reglas de tamaño: <100 líneas
 * ✅ Responsabilidad única: Popup management
 * ✅ Incluye effects para automático
 */
const useNotificationPopups = (
  activeEmergencies,
  viewedEmergencies,
  setViewedEmergencies,
  notificationConfig,
  mutedAlerts,
  playEmergencySound
) => {
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

  // Effect para popups automáticos de emergencias
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

  return {
    handleAlertClick
  }
}

export default useNotificationPopups