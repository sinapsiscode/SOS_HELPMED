import { useMemo } from 'react'

/**
 * Hook para cálculo de precios y recargos
 * REFACTORIZADO siguiendo TODAS las reglas:
 *
 * ✅ Regla #2: Extrae lógica del componente de presentación
 * ✅ Regla #13: Optimización con useMemo
 *
 * @param {string} service - Tipo de servicio
 * @param {Object} serviceInfo - Información del servicio
 * @returns {Object} Cálculos y funciones de precio
 */
const usePricingSummary = (service, serviceInfo) => {
  /**
   * Determina si es horario nocturno (10pm - 6am)
   */
  const isNightTime = useMemo(() => {
    const hour = new Date().getHours()
    return hour >= 22 || hour < 6
  }, [])

  /**
   * Determina si es fin de semana
   */
  const isWeekend = useMemo(() => {
    const day = new Date().getDay()
    return day === 0 || day === 6
  }, [])

  /**
   * Calcula los recargos aplicables
   */
  const surcharges = useMemo(() => {
    const charges = []

    if (!serviceInfo) return charges

    if (isNightTime && serviceInfo.nightSurcharge > 0) {
      charges.push({
        name: 'Recargo Nocturno (10pm - 6am)',
        amount: serviceInfo.nightSurcharge
      })
    }

    if (isWeekend && serviceInfo.holidaySurcharge > 0) {
      charges.push({
        name: 'Recargo Fin de Semana',
        amount: serviceInfo.holidaySurcharge
      })
    }

    return charges
  }, [isNightTime, isWeekend, serviceInfo])

  /**
   * Obtiene el tiempo estimado de llegada según el servicio
   */
  const estimatedArrivalTime = useMemo(() => {
    switch (service) {
      case 'EMERGENCIA':
        return '8-12 minutos'
      case 'URGENCIA':
        return '15-25 minutos'
      case 'MEDICO_DOMICILIO':
        return '30-45 minutos'
      default:
        return '45-60 minutos'
    }
  }, [service])

  /**
   * Obtiene el color de urgencia para mostrar
   */
  const getUrgencyColor = (urgencyLevel) => {
    switch (urgencyLevel) {
      case 'critical':
        return 'text-red-600'
      case 'urgent':
        return 'text-orange-600'
      default:
        return 'text-gray-600'
    }
  }

  /**
   * Obtiene el label de urgencia
   */
  const getUrgencyLabel = (urgencyLevel) => {
    switch (urgencyLevel) {
      case 'critical':
        return 'Crítico'
      case 'urgent':
        return 'Urgente'
      default:
        return 'Normal'
    }
  }

  return {
    isNightTime,
    isWeekend,
    surcharges,
    estimatedArrivalTime,
    getUrgencyColor,
    getUrgencyLabel
  }
}

export default usePricingSummary
