import { useMemo } from 'react'

/**
 * Hook especializado para métricas de eficiencia operacional
 * ✅ Cumple reglas de tamaño: <100 líneas
 * ✅ Responsabilidad única: Efficiency calculation
 * ✅ Optimizado con useMemo
 */
const useEfficiencyMetrics = (services, ambulances) => {
  const efficiencyMetrics = useMemo(() => {
    if (!services.length) return {}

    // 1. Servicios completados vs iniciados
    const completedServices = services.filter(
      (service) => service.status === 'completed' || service.status === 'successful'
    ).length
    const completionRate =
      services.length > 0 ? ((completedServices / services.length) * 100).toFixed(1) : 0

    // 2. Tiempo promedio por servicio
    const serviceDurations = services
      .filter((service) => service.duration)
      .map((service) => service.duration)
    const avgServiceDuration =
      serviceDurations.length > 0
        ? (
            serviceDurations.reduce((sum, duration) => sum + duration, 0) / serviceDurations.length
          ).toFixed(1)
        : 0

    // 3. Costo promedio por servicio
    const serviceCosts = services
      .filter((service) => service.cost || service.price)
      .map((service) => service.cost || service.price)
    const avgCostPerService =
      serviceCosts.length > 0
        ? (serviceCosts.reduce((sum, cost) => sum + cost, 0) / serviceCosts.length).toFixed(2)
        : 0

    // 4. Ratio de servicios por ambulancia por día
    const totalDays = Math.max(
      1,
      Math.ceil(
        (new Date() - new Date(Date.now() - 30 * 24 * 60 * 60 * 1000)) / (1000 * 60 * 60 * 24)
      )
    )
    const totalAmbulances = ambulances?.length || 5
    const servicesPerAmbulancePerDay =
      totalAmbulances > 0 && totalDays > 0
        ? (services.length / (totalAmbulances * totalDays)).toFixed(1)
        : 0

    // 5. Tasa de reasignaciones
    const reassignedServices = services.filter(
      (service) => service.reassigned || (service.attempts && service.attempts > 1)
    ).length
    const reassignmentRate =
      services.length > 0 ? ((reassignedServices / services.length) * 100).toFixed(1) : 0

    // 6. Tiempo de inactividad por ambulancia (simulado)
    const avgDowntimePerAmbulance = 2.5 // horas por día

    return {
      completionRate: parseFloat(completionRate),
      avgServiceDuration: parseFloat(avgServiceDuration),
      avgCostPerService: parseFloat(avgCostPerService),
      servicesPerAmbulancePerDay: parseFloat(servicesPerAmbulancePerDay),
      reassignmentRate: parseFloat(reassignmentRate),
      avgDowntimePerAmbulance
    }
  }, [services, ambulances])

  return {
    efficiencyMetrics
  }
}

export default useEfficiencyMetrics