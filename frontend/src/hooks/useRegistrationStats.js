import { useMemo } from 'react'

/**
 * Hook especializado para cálculo de estadísticas de registros
 * ✅ Cumple reglas de tamaño: <100 líneas
 * ✅ Responsabilidad única: Statistics calculations
 * ✅ Optimizado con useMemo
 */
const useRegistrationStats = (registrationRequests) => {
  const requestStats = useMemo(() => {
    const stats = {
      total: registrationRequests.length,
      pending: 0,
      approved: 0,
      rejected: 0
    }

    registrationRequests.forEach((request) => {
      switch (request.status) {
        case 'pending':
          stats.pending++
          break
        case 'approved':
          stats.approved++
          break
        case 'rejected':
          stats.rejected++
          break
      }
    })

    return stats
  }, [registrationRequests])

  return {
    requestStats
  }
}

export default useRegistrationStats