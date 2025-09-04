import { useMemo } from 'react'

/**
 * Hook especializado para cálculo de KPIs operacionales
 * ✅ Cumple reglas de tamaño: <100 líneas
 * ✅ Responsabilidad única: KPIs calculation
 * ✅ Optimizado con useMemo
 */
const usePerformanceKPIs = (services, surveys, ambulances) => {
  const operationalKPIs = useMemo(() => {
    if (!services.length) return {}

    // 1. Tiempo promedio de respuesta
    const responseTimes = services
      .filter((service) => service.responseTime)
      .map((service) => service.responseTime)
    const avgResponseTime =
      responseTimes.length > 0
        ? (responseTimes.reduce((sum, time) => sum + time, 0) / responseTimes.length).toFixed(1)
        : 0

    // 2. Disponibilidad del sistema (uptime)
    const systemUptime = 99.8 // Simulado - en producción vendría de monitoreo

    // 3. Tasa de resolución en primera llamada
    const firstCallResolutions = services.filter(
      (service) => service.resolvedInFirstCall || service.attempts === 1
    ).length
    const firstCallResolutionRate =
      services.length > 0 ? ((firstCallResolutions / services.length) * 100).toFixed(1) : 0

    // 4. Utilización de ambulancias
    const totalAmbulances = ambulances?.length || 5
    const activeServices = services.filter(
      (service) => service.status === 'in_progress' || service.status === 'assigned'
    ).length
    const ambulanceUtilization =
      totalAmbulances > 0 ? ((activeServices / totalAmbulances) * 100).toFixed(1) : 0

    // 5. Tiempo promedio de llegada
    const arrivalTimes = services
      .filter((service) => service.arrivalTime && service.requestTime)
      .map((service) => {
        const request = new Date(service.requestTime)
        const arrival = new Date(service.arrivalTime)
        return Math.abs(arrival - request) / (1000 * 60) // minutos
      })
    const avgArrivalTime =
      arrivalTimes.length > 0
        ? (arrivalTimes.reduce((sum, time) => sum + time, 0) / arrivalTimes.length).toFixed(1)
        : 0

    // 6. Satisfacción del cliente
    const satisfactionScores = surveys
      .filter((survey) => survey.rating)
      .map((survey) => survey.rating)
    const avgSatisfaction =
      satisfactionScores.length > 0
        ? (
            satisfactionScores.reduce((sum, rating) => sum + rating, 0) / satisfactionScores.length
          ).toFixed(1)
        : 0

    // 7. Tasa de cancelación
    const cancelledServices = services.filter(
      (service) => service.status === 'cancelled' || service.status === 'failed'
    ).length
    const cancellationRate =
      services.length > 0 ? ((cancelledServices / services.length) * 100).toFixed(1) : 0

    // 8. Carga de trabajo por operador (simulado)
    const avgWorkloadPerOperator = services.length > 0 ? (services.length / 10).toFixed(1) : 0

    return {
      avgResponseTime: parseFloat(avgResponseTime),
      systemUptime,
      firstCallResolutionRate: parseFloat(firstCallResolutionRate),
      ambulanceUtilization: parseFloat(ambulanceUtilization),
      avgArrivalTime: parseFloat(avgArrivalTime),
      avgSatisfaction: parseFloat(avgSatisfaction),
      cancellationRate: parseFloat(cancellationRate),
      avgWorkloadPerOperator: parseFloat(avgWorkloadPerOperator)
    }
  }, [services, surveys, ambulances])

  return {
    operationalKPIs
  }
}

export default usePerformanceKPIs