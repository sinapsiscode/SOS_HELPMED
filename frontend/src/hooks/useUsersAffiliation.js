import { useMemo } from 'react'

/**
 * Hook especializado para análisis de afiliación y planes de usuarios
 * ✅ Cumple reglas de tamaño: <100 líneas
 * ✅ Responsabilidad única: Affiliation analysis
 * ✅ Optimizado con useMemo
 */
const useUsersAffiliation = (users, affiliates) => {
  const affiliationAnalysis = useMemo(() => {
    if (!users?.length) return {}

    // Usuarios por plan
    const planDistribution = {}
    users.forEach((user) => {
      const planType = user.planType || 'basic'
      planDistribution[planType] = (planDistribution[planType] || 0) + 1
    })

    // Análisis de afiliados
    const affiliateStats = {
      totalAffiliates: affiliates?.length || 0,
      activeAffiliates: affiliates?.filter((a) => a.status === 'active').length || 0,
      pendingAffiliates: affiliates?.filter((a) => a.status === 'pending').length || 0
    }

    // Tiempo promedio de afiliación
    const affiliationTimes = users
      .filter((user) => user.createdAt && user.affiliatedAt)
      .map((user) => {
        const created = new Date(user.createdAt)
        const affiliated = new Date(user.affiliatedAt)
        return Math.abs(affiliated - created) / (1000 * 60 * 60 * 24) // días
      })

    const avgAffiliationTime =
      affiliationTimes.length > 0
        ? (affiliationTimes.reduce((sum, time) => sum + time, 0) / affiliationTimes.length).toFixed(
            1
          )
        : 0

    return {
      planDistribution,
      affiliateStats,
      avgAffiliationTime: parseFloat(avgAffiliationTime)
    }
  }, [users, affiliates])

  return {
    affiliationAnalysis
  }
}

export default useUsersAffiliation