import { useMemo } from 'react'

/**
 * Hook especializado para análisis de tendencias de performance
 * ✅ Cumple reglas de tamaño: <100 líneas
 * ✅ Responsabilidad única: Trend analysis
 * ✅ Optimizado con useMemo
 */
const usePerformanceTrends = (services, performancePeriod) => {
  const trendAnalysis = useMemo(() => {
    if (!services.length) return {}

    // Análisis por períodos
    const periodLength = performancePeriod === 'week' ? 7 : performancePeriod === 'month' ? 30 : 90

    const periods = Array.from({ length: 6 }, (_, i) => {
      const endDate = new Date()
      endDate.setDate(endDate.getDate() - i * periodLength)
      const startDate = new Date(endDate)
      startDate.setDate(startDate.getDate() - periodLength)

      const periodServices = services.filter((service) => {
        const serviceDate = new Date(service.createdAt || service.date)
        return serviceDate >= startDate && serviceDate <= endDate
      })

      // Métricas del período
      const responseTimes = periodServices
        .filter((service) => service.responseTime)
        .map((service) => service.responseTime)
      const avgResponse =
        responseTimes.length > 0
          ? (responseTimes.reduce((sum, time) => sum + time, 0) / responseTimes.length).toFixed(1)
          : 0

      const completed = periodServices.filter(
        (service) => service.status === 'completed' || service.status === 'successful'
      ).length
      const completionRate =
        periodServices.length > 0 ? ((completed / periodServices.length) * 100).toFixed(1) : 0

      return {
        period: startDate.toLocaleDateString('es-PE', { month: 'short', day: '2-digit' }),
        services: periodServices.length,
        avgResponseTime: parseFloat(avgResponse),
        completionRate: parseFloat(completionRate)
      }
    }).reverse()

    // Comparación con período anterior
    const currentPeriodServices = periods[periods.length - 1]?.services || 0
    const previousPeriodServices = periods[periods.length - 2]?.services || 0
    const serviceGrowth =
      previousPeriodServices > 0
        ? (
            ((currentPeriodServices - previousPeriodServices) / previousPeriodServices) *
            100
          ).toFixed(1)
        : 0

    return {
      periods,
      serviceGrowth: parseFloat(serviceGrowth),
      trendDirection: serviceGrowth > 0 ? 'up' : serviceGrowth < 0 ? 'down' : 'stable'
    }
  }, [services, performancePeriod])

  return {
    trendAnalysis
  }
}

export default usePerformanceTrends