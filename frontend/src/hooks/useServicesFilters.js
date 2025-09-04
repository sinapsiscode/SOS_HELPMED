import { useMemo } from 'react'

/**
 * Hook especializado para filtrado y ordenamiento de servicios
 * ✅ Cumple reglas de tamaño: <100 líneas
 * ✅ Responsabilidad única: Filtering logic
 * ✅ Optimizado con useMemo
 */
const useServicesFilters = (services, serviceFilter, sortBy) => {
  const processedServices = useMemo(() => {
    if (!services.length) return []

    let filtered = [...services]

    // Aplicar filtros
    switch (serviceFilter) {
      case 'emergency':
        filtered = filtered.filter(
          (service) => service.serviceType === 'emergency' || service.type === 'emergency'
        )
        break
      case 'scheduled':
        filtered = filtered.filter(
          (service) => service.serviceType === 'scheduled' || service.type === 'scheduled'
        )
        break
      case 'completed':
        filtered = filtered.filter(
          (service) => service.status === 'completed' || service.status === 'successful'
        )
        break
      case 'pending':
        filtered = filtered.filter(
          (service) => service.status === 'pending' || service.status === 'in_progress'
        )
        break
    }

    // Aplicar ordenamiento
    switch (sortBy) {
      case 'date':
        filtered.sort(
          (a, b) => new Date(b.createdAt || b.date || 0) - new Date(a.createdAt || a.date || 0)
        )
        break
      case 'type':
        filtered.sort((a, b) =>
          (a.serviceType || a.type || '').localeCompare(b.serviceType || b.type || '')
        )
        break
      case 'priority':
        const priorityOrder = { high: 3, medium: 2, low: 1 }
        filtered.sort((a, b) => (priorityOrder[b.priority] || 0) - (priorityOrder[a.priority] || 0))
        break
      case 'duration':
        filtered.sort((a, b) => (b.duration || 0) - (a.duration || 0))
        break
    }

    return filtered
  }, [services, serviceFilter, sortBy])

  return {
    processedServices
  }
}

export default useServicesFilters