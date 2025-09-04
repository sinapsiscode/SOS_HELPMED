import { useMemo } from 'react'

/**
 * Hook especializado para métricas de performance de servicios
 * ✅ Cumple reglas de tamaño: <100 líneas
 * ✅ Responsabilidad única: Performance metrics
 * ✅ Optimizado con useMemo
 */
const useServicesPerformance = (services) => {
  const performanceMetrics = useMemo(() => {
    if (!services.length) return {}

    // Tiempo promedio de respuesta
    const responseTimes = services
      .filter((service) => service.responseTime || (service.startTime && service.requestTime))
      .map((service) => {
        if (service.responseTime) return service.responseTime

        const requestTime = new Date(service.requestTime || service.createdAt)
        const startTime = new Date(service.startTime)
        return Math.abs(startTime - requestTime) / (1000 * 60) // minutos
      })

    const avgResponseTime =
      responseTimes.length > 0
        ? (responseTimes.reduce((sum, time) => sum + time, 0) / responseTimes.length).toFixed(1)
        : 0

    // Tiempo promedio de duración del servicio
    const durations = services
      .filter((service) => service.duration || (service.startTime && service.endTime))
      .map((service) => {
        if (service.duration) return service.duration

        const startTime = new Date(service.startTime)
        const endTime = new Date(service.endTime)
        return Math.abs(endTime - startTime) / (1000 * 60) // minutos
      })

    const avgServiceDuration =
      durations.length > 0
        ? (durations.reduce((sum, time) => sum + time, 0) / durations.length).toFixed(1)
        : 0

    // Tasa de éxito
    const completedServices = services.filter(
      (service) => service.status === 'completed' || service.status === 'successful'
    ).length
    const successRate =
      services.length > 0 ? ((completedServices / services.length) * 100).toFixed(1) : 0

    // Servicios cancelados
    const cancelledServices = services.filter(
      (service) => service.status === 'cancelled' || service.status === 'failed'
    ).length
    const cancellationRate =
      services.length > 0 ? ((cancelledServices / services.length) * 100).toFixed(1) : 0

    // Tiempo de espera promedio
    const waitTimes = services
      .filter((service) => service.waitTime || service.queueTime)
      .map((service) => service.waitTime || service.queueTime)

    const avgWaitTime =
      waitTimes.length > 0
        ? (waitTimes.reduce((sum, time) => sum + time, 0) / waitTimes.length).toFixed(1)
        : 0

    return {
      avgResponseTime: parseFloat(avgResponseTime),
      avgServiceDuration: parseFloat(avgServiceDuration),
      successRate: parseFloat(successRate),
      cancellationRate: parseFloat(cancellationRate),
      avgWaitTime: parseFloat(avgWaitTime),
      totalCompleted: completedServices,
      totalCancelled: cancelledServices
    }
  }, [services])

  return {
    performanceMetrics
  }
}

export default useServicesPerformance