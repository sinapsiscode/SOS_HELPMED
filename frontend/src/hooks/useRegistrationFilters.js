import { useMemo } from 'react'

/**
 * Hook especializado para filtrado de solicitudes de registro
 * ✅ Cumple reglas de tamaño: <100 líneas
 * ✅ Responsabilidad única: Filtering logic
 * ✅ Optimizado con useMemo
 */
const useRegistrationFilters = (registrationRequests, filter) => {
  const filteredRequests = useMemo(() => {
    if (filter === 'all') return registrationRequests
    return registrationRequests.filter((request) => request.status === filter)
  }, [registrationRequests, filter])

  return {
    filteredRequests
  }
}

export default useRegistrationFilters