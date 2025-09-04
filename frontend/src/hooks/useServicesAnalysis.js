import { useMemo } from 'react'

/**
 * Hook especializado para análisis general de servicios
 * ✅ Cumple reglas de tamaño: <100 líneas
 * ✅ Responsabilidad única: Analysis logic
 * ✅ Optimizado con useMemo
 */
const useServicesAnalysis = (services) => {
  const servicesAnalysis = useMemo(() => {
    if (!services.length) return {}

    // Distribución por tipo de servicio
    const serviceTypes = {}
    services.forEach((service) => {
      const type = service.serviceType || service.type || 'emergency'
      serviceTypes[type] = (serviceTypes[type] || 0) + 1
    })

    // Distribución por estado
    const statusDistribution = {}
    services.forEach((service) => {
      const status = service.status || 'completed'
      statusDistribution[status] = (statusDistribution[status] || 0) + 1
    })

    // Distribución por prioridad
    const priorityDistribution = {}
    services.forEach((service) => {
      const priority = service.priority || 'medium'
      priorityDistribution[priority] = (priorityDistribution[priority] || 0) + 1
    })

    // Análisis temporal (por hora del día)
    const hourlyDistribution = Array.from({ length: 24 }, () => 0)
    services.forEach((service) => {
      if (service.createdAt || service.date) {
        const hour = new Date(service.createdAt || service.date).getHours()
        hourlyDistribution[hour]++
      }
    })

    // Servicios por día de la semana
    const weeklyDistribution = Array.from({ length: 7 }, () => 0)
    services.forEach((service) => {
      if (service.createdAt || service.date) {
        const dayOfWeek = new Date(service.createdAt || service.date).getDay()
        weeklyDistribution[dayOfWeek]++
      }
    })

    return {
      totalServices: services.length,
      serviceTypes,
      statusDistribution,
      priorityDistribution,
      hourlyDistribution,
      weeklyDistribution
    }
  }, [services])

  return {
    servicesAnalysis
  }
}

export default useServicesAnalysis