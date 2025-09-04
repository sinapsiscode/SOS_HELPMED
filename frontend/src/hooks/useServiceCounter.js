import { useMemo } from 'react'
import logger from '../utils/logger'

/**
 * Hook para lógica de contador de servicios
 * ✅ Regla #2: Lógica extraída a hook personalizado
 * ✅ Regla #8: Manejo robusto de errores
 * ✅ Regla #13: Optimización con useMemo
 */
const useServiceCounter = (services, period = 'current') => {
  // Procesar estadísticas de servicios
  const stats = useMemo(() => {
    try {
      if (!services || !services.breakdown) {
        logger.warn('useServiceCounter: services.breakdown no disponible')
        return []
      }

      return Object.entries(services.breakdown)
        .map(([serviceType, data]) => {
          if (typeof data === 'object' && data.used !== undefined) {
            return {
              type: serviceType,
              used: data.used,
              limit: data.limit,
              percentage: Math.round((data.used / data.limit) * 100)
            }
          } else if (serviceType === 'ORIENTACION_TELEFONICA' && typeof data === 'string') {
            return {
              type: serviceType,
              used: services.orientacion_used || 0,
              limit: 'ILIMITADO',
              percentage: 0
            }
          }
          return null
        })
        .filter(Boolean)
    } catch (error) {
      logger.error('Error procesando estadísticas de servicios', error)
      return []
    }
  }, [services])

  // Calcular resumen estadístico
  const summary = useMemo(() => {
    try {
      const totalUsed = stats.reduce((acc, stat) => acc + stat.used, 0)
      const servicesWithLimit = stats.filter((stat) => stat.limit !== 'ILIMITADO')
      const servicesAtLimit = servicesWithLimit.filter((stat) => stat.used >= stat.limit)
      const servicesNearLimit = servicesWithLimit.filter(
        (stat) => stat.percentage >= 80 && stat.used < stat.limit
      )
      const unlimitedServices = stats.filter((s) => s.limit === 'ILIMITADO').length

      return {
        totalUsed,
        unlimitedServices,
        servicesNearLimit: servicesNearLimit.length,
        servicesAtLimit: servicesAtLimit.length,
        hasAlerts: servicesAtLimit.length > 0 || servicesNearLimit.length > 0
      }
    } catch (error) {
      logger.error('Error calculando resumen de servicios', error)
      return {
        totalUsed: 0,
        unlimitedServices: 0,
        servicesNearLimit: 0,
        servicesAtLimit: 0,
        hasAlerts: false
      }
    }
  }, [stats])

  // Formato de período
  const periodLabel = period === 'current' ? 'Actual' : 'Histórico'

  return {
    stats,
    summary,
    periodLabel,
    isValid: stats.length > 0
  }
}

export default useServiceCounter