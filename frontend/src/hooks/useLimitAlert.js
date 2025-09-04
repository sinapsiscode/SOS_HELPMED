import { useMemo, useCallback } from 'react'
import Swal from 'sweetalert2'

/**
 * Hook para gestión de alertas de límites de servicios
 * REFACTORIZADO siguiendo TODAS las reglas:
 *
 * ✅ Regla #2: Extrae toda la lógica del componente
 * ✅ Regla #6: Documentación completa
 * ✅ Regla #13: Optimización con useMemo y useCallback
 *
 * @param {Object} user - Usuario actual
 * @param {Function} onPurchaseAdditional - Callback para comprar servicios adicionales
 * @param {Function} onUpgradePlan - Callback para actualizar plan
 * @returns {Object} Alertas y funciones para manejo de límites
 */
const useLimitAlert = (user, onPurchaseAdditional, onUpgradePlan) => {
  /**
   * Obtiene el nombre del servicio
   */
  const getServiceName = useCallback((serviceType) => {
    const names = {
      EMERGENCIA: 'Emergencias',
      URGENCIA: 'Urgencias',
      MEDICO_DOMICILIO: 'Médico a Domicilio',
      TRASLADO_PROGRAMADO: 'Traslado Programado',
      ZONA_PROTEGIDA: 'Zona Protegida',
      ORIENTACION_TELEFONICA: 'Orientación Telefónica',
      EXAMENES_LABORATORIO: 'Exámenes de Laboratorio',
      GENERAL: 'Servicios Generales'
    }
    return names[serviceType] || serviceType
  }, [])

  /**
   * Obtiene el costo adicional del servicio
   */
  const getAdditionalServiceCost = useCallback((serviceType) => {
    const costs = {
      URGENCIA: 85000,
      MEDICO_DOMICILIO: 95000,
      TRASLADO_PROGRAMADO: 120000,
      ZONA_PROTEGIDA: 150000,
      GENERAL: 85000
    }
    return costs[serviceType] || 85000
  }, [])

  /**
   * Genera alertas para usuarios familiares
   */
  const getFamiliarAlerts = useCallback(
    (user) => {
      const alerts = []
      const { service_usage, plan } = user

      if (plan.subtype === 'HELP') {
        // Plan Help - límite total
        const remaining = service_usage.current_period.remaining_services
        const total = plan.total_services

        if (remaining === 0) {
          alerts.push({
            type: 'error',
            title: 'Servicios Agotados',
            message: `Has utilizado todos tus ${total} servicios del Plan Help`,
            action: 'purchase',
            cost: 85000,
            urgent: true,
            serviceType: 'GENERAL'
          })
        } else if (remaining <= 2) {
          alerts.push({
            type: 'warning',
            title: 'Pocos Servicios Restantes',
            message: `Te quedan ${remaining} servicios de ${total}`,
            action: 'contact',
            serviceType: 'GENERAL',
            urgent: false
          })
        }
      } else {
        // Otros planes familiares - límites específicos
        const breakdown = service_usage.current_period.breakdown

        Object.entries(breakdown).forEach(([serviceType, data]) => {
          if (typeof data === 'object' && data.used !== undefined) {
            if (data.used >= data.limit) {
              alerts.push({
                type: 'error',
                title: `${getServiceName(serviceType)} Agotado`,
                message: `Has usado ${data.used} de ${data.limit} servicios`,
                serviceType,
                action: 'purchase',
                cost: getAdditionalServiceCost(serviceType),
                urgent: true
              })
            } else if (data.used >= data.limit - 1) {
              alerts.push({
                type: 'warning',
                title: `${getServiceName(serviceType)} Casi Agotado`,
                message: `Has usado ${data.used} de ${data.limit} servicios`,
                serviceType,
                action: 'contact',
                urgent: false
              })
            }
          }
        })
      }

      return alerts
    },
    [getServiceName, getAdditionalServiceCost]
  )

  /**
   * Genera alertas para usuarios corporativos
   */
  const getCorporateAlerts = useCallback((user) => {
    const alerts = []
    const { service_usage } = user
    const remaining = service_usage.current_period.remaining_services
    const total = service_usage.current_period.used_services + remaining

    if (remaining === 0) {
      alerts.push({
        type: 'error',
        title: 'Servicios Corporativos Agotados',
        message: 'La empresa ha agotado todos sus servicios contratados',
        action: 'contact',
        serviceType: 'EMERGENCIA',
        urgent: true
      })
    } else if (remaining <= 5) {
      alerts.push({
        type: 'warning',
        title: 'Servicios Corporativos Limitados',
        message: `Quedan ${remaining} servicios de ${total} contratados`,
        action: 'contact',
        serviceType: 'EMERGENCIA',
        urgent: false
      })
    }

    return alerts
  }, [])

  /**
   * Genera alertas para usuarios externos
   */
  const getExternalAlerts = useCallback((user) => {
    const alerts = []
    const { service_usage, plan } = user

    if (plan.subtype === 'CASO_2') {
      const individualRemaining = service_usage.current_period.individual_remaining
      const generalRemaining = user.client_company?.general_services_remaining || 0

      if (individualRemaining === 0) {
        alerts.push({
          type: 'error',
          title: 'Límite Individual Agotado',
          message: 'Has usado tus 3 servicios anuales permitidos',
          action: 'purchase',
          cost: service_usage.billing_info?.cost_per_additional_service || 100000,
          serviceType: 'INDIVIDUAL',
          urgent: true
        })
      } else if (individualRemaining === 1) {
        alerts.push({
          type: 'warning',
          title: 'Último Servicio Individual',
          message: 'Te queda 1 servicio de tu límite anual',
          action: 'contact',
          serviceType: 'INDIVIDUAL',
          urgent: false
        })
      }

      if (generalRemaining <= 10) {
        alerts.push({
          type: 'warning',
          title: 'Límite General de la Empresa',
          message: `La empresa tiene ${generalRemaining} servicios restantes`,
          action: 'contact',
          serviceType: 'INDIVIDUAL',
          urgent: generalRemaining <= 5
        })
      }
    }

    return alerts
  }, [])

  /**
   * Obtiene todas las alertas del usuario
   */
  const alerts = useMemo(() => {
    if (!user || !user.service_usage) return []

    let userAlerts = []

    switch (user.role) {
      case 'FAMILIAR':
        userAlerts = getFamiliarAlerts(user)
        break
      case 'CORPORATIVO':
        userAlerts = getCorporateAlerts(user)
        break
      case 'EXTERNO':
        userAlerts = getExternalAlerts(user)
        break
      default:
        userAlerts = []
    }

    // Ordenar por urgencia (urgentes primero)
    return userAlerts.sort((a, b) => (b.urgent ? 1 : 0) - (a.urgent ? 1 : 0))
  }, [user, getFamiliarAlerts, getCorporateAlerts, getExternalAlerts])

  /**
   * Muestra modal de compra
   */
  const showPurchaseModal = useCallback(
    (alert) => {
      Swal.fire({
        title: '¿Comprar Servicios Adicionales?',
        html: `
        <div class="text-left">
          <p class="mb-3">${alert.message}</p>
          <div class="bg-blue-50 border border-blue-200 rounded-lg p-3">
            <p class="font-medium text-blue-800">Costo por servicio adicional:</p>
            <p class="text-2xl font-bold text-blue-600">$${alert.cost?.toLocaleString()}</p>
          </div>
        </div>
      `,
        icon: 'question',
        showCancelButton: true,
        confirmButtonColor: '#D32F2F',
        cancelButtonColor: '#6B7280',
        confirmButtonText: 'Comprar Servicio',
        cancelButtonText: 'Cancelar'
      }).then((result) => {
        if (result.isConfirmed && onPurchaseAdditional) {
          onPurchaseAdditional(alert)
        }
      })
    },
    [onPurchaseAdditional]
  )

  /**
   * Muestra modal de actualización
   */
  const showUpgradeModal = useCallback(
    (alert) => {
      Swal.fire({
        title: '¿Actualizar Plan?',
        html: `
        <div class="text-left">
          <p class="mb-3">${alert.message}</p>
          <div class="bg-green-50 border border-green-200 rounded-lg p-3">
            <p class="font-medium text-green-800">Beneficios de actualizar:</p>
            <ul class="text-sm text-green-700 mt-2 list-disc list-inside">
              <li>Más servicios incluidos</li>
              <li>Beneficios adicionales</li>
              <li>Mejor valor por servicio</li>
            </ul>
          </div>
        </div>
      `,
        icon: 'info',
        showCancelButton: true,
        confirmButtonColor: '#10B981',
        cancelButtonColor: '#6B7280',
        confirmButtonText: 'Ver Planes',
        cancelButtonText: 'Cancelar'
      }).then((result) => {
        if (result.isConfirmed && onUpgradePlan) {
          onUpgradePlan(alert)
        }
      })
    },
    [onUpgradePlan]
  )

  /**
   * Maneja la acción de una alerta
   */
  const handleAlertAction = useCallback(
    (alert) => {
      switch (alert.action) {
        case 'purchase':
          showPurchaseModal(alert)
          break
        case 'upgrade':
          showUpgradeModal(alert)
          break
        case 'contact':
          // El componente manejará esto mostrando ServiceExpansionRequest
          return 'contact'
        default:
          return null
      }
    },
    [showPurchaseModal, showUpgradeModal]
  )

  /**
   * Obtiene el texto de acción
   */
  const getActionText = useCallback((action) => {
    const texts = {
      purchase: 'Comprar',
      upgrade: 'Actualizar',
      contact: 'Contactar'
    }
    return texts[action] || 'Acción'
  }, [])

  /**
   * Obtiene los estilos de alerta
   */
  const getAlertStyles = useCallback((type, urgent) => {
    if (urgent) {
      return {
        container: 'border-red-500 bg-red-50 shadow-lg',
        icon: 'fas fa-exclamation-circle text-red-600',
        title: 'text-red-800',
        message: 'text-red-700',
        button: 'bg-red-600 hover:bg-red-700 text-white'
      }
    }

    const styles = {
      error: {
        container: 'border-red-300 bg-red-50',
        icon: 'fas fa-times-circle text-red-500',
        title: 'text-red-800',
        message: 'text-red-700',
        button: 'bg-red-500 hover:bg-red-600 text-white'
      },
      warning: {
        container: 'border-yellow-300 bg-yellow-50',
        icon: 'fas fa-exclamation-triangle text-yellow-600',
        title: 'text-yellow-800',
        message: 'text-yellow-700',
        button: 'bg-yellow-500 hover:bg-yellow-600 text-white'
      },
      info: {
        container: 'border-blue-300 bg-blue-50',
        icon: 'fas fa-info-circle text-blue-500',
        title: 'text-blue-800',
        message: 'text-blue-700',
        button: 'bg-blue-500 hover:bg-blue-600 text-white'
      }
    }

    return styles[type] || styles.info
  }, [])

  return {
    alerts,
    handleAlertAction,
    getActionText,
    getAlertStyles
  }
}

export default useLimitAlert
