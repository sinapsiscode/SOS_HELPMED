import { useMemo } from 'react'

/**
 * Hook especializado para análisis de costos de servicios
 * ✅ Cumple reglas de tamaño: <100 líneas
 * ✅ Responsabilidad única: Cost analysis
 * ✅ Optimizado con useMemo
 */
const useServicesCost = (services) => {
  const costAnalysis = useMemo(() => {
    if (!services.length) return {}

    // Costo total por tipo de servicio
    const costByType = {}
    services.forEach((service) => {
      const type = service.serviceType || service.type || 'emergency'
      const cost = service.cost || service.price || 0
      costByType[type] = (costByType[type] || 0) + cost
    })

    // Costo promedio por servicio
    const totalCost = services.reduce(
      (sum, service) => sum + (service.cost || service.price || 0),
      0
    )
    const avgCostPerService = services.length > 0 ? (totalCost / services.length).toFixed(2) : 0

    // Ingresos por mes (últimos 6 meses)
    const monthlyRevenue = Array.from({ length: 6 }, (_, i) => {
      const date = new Date()
      date.setMonth(date.getMonth() - (5 - i))

      const monthServices = services.filter((service) => {
        const serviceDate = new Date(service.createdAt || service.date)
        return (
          serviceDate.getMonth() === date.getMonth() &&
          serviceDate.getFullYear() === date.getFullYear()
        )
      })

      const revenue = monthServices.reduce(
        (sum, service) => sum + (service.cost || service.price || 0),
        0
      )

      return {
        month: date.toLocaleDateString('es-PE', { month: 'short' }),
        revenue,
        serviceCount: monthServices.length
      }
    })

    return {
      totalCost,
      avgCostPerService: parseFloat(avgCostPerService),
      costByType,
      monthlyRevenue
    }
  }, [services])

  return {
    costAnalysis
  }
}

export default useServicesCost