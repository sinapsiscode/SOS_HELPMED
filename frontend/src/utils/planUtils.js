/**
 * Utilidades para manejo de planes y límites
 * ✅ Funciones puras para transformación de datos de planes
 */

/**
 * Obtener límites formateados para mostrar en la UI
 * @param {Object} user - Usuario con información de plan y uso
 * @returns {Object} Límites formateados para display
 */
export const getLimitsForDisplay = (user) => {
  if (!user || !user.plan || !user.service_usage) {
    return {}
  }

  const { plan, service_usage } = user
  const currentPeriod = service_usage.current_period || {}
  
  // Para planes HELP (más simples)
  if (plan.subtype === 'HELP') {
    return {
      general: {
        services: {
          used: currentPeriod.used_services || 0,
          limit: plan.total_services || 16
        }
      }
    }
  }

  // Para otros planes con breakdown detallado
  const breakdown = currentPeriod.breakdown || {}
  const planLimits = plan.limits || {}
  
  const limits = {}
  
  // Emergencias
  if (breakdown.emergencies) {
    limits.emergencies = {
      used: breakdown.emergencies.used || 0,
      limit: planLimits.monthly_emergencies || 0,
      type: 'Emergencias'
    }
  }
  
  // Consultas médicas
  if (breakdown.medical_consultations) {
    limits.medical_consultations = {
      used: breakdown.medical_consultations.used || 0,
      limit: planLimits.monthly_consultations || 0,
      type: 'Consultas Médicas'
    }
  }
  
  // Traslados programados
  if (breakdown.programmed_transfers) {
    limits.programmed_transfers = {
      used: breakdown.programmed_transfers.used || 0,
      limit: planLimits.monthly_transfers || 0,
      type: 'Traslados Programados'
    }
  }

  return limits
}

/**
 * Calcular porcentaje de uso de un servicio
 * @param {number} used - Cantidad usada
 * @param {number} limit - Límite total
 * @returns {number} Porcentaje de uso (0-100)
 */
export const calculateUsagePercentage = (used, limit) => {
  if (!limit || limit === 0) return 0
  return Math.min(Math.round((used / limit) * 100), 100)
}

/**
 * Obtener color CSS basado en el porcentaje de uso
 * @param {number} percentage - Porcentaje de uso (0-100)
 * @returns {string} Clases CSS para el color
 */
export const getUsageColor = (percentage) => {
  if (percentage >= 90) return 'text-red-600 bg-red-100'
  if (percentage >= 70) return 'text-yellow-600 bg-yellow-100'
  return 'text-green-600 bg-green-100'
}

/**
 * Formatear nombre del plan para mostrar
 * @param {Object} plan - Objeto plan
 * @returns {string} Nombre formateado del plan
 */
export const formatPlanName = (plan) => {
  if (!plan) return 'Plan no especificado'
  
  const planNames = {
    'HELP': 'Plan Help',
    'BASICO': 'Plan Básico',
    'VIP': 'Plan VIP',
    'DORADO': 'Plan Dorado'
  }
  
  return planNames[plan.subtype] || plan.name || 'Plan desconocido'
}