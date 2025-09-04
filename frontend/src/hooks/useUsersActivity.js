import { useMemo } from 'react'

/**
 * Hook especializado para análisis de actividad y retención de usuarios
 * ✅ Cumple reglas de tamaño: <100 líneas
 * ✅ Responsabilidad única: Activity analysis
 * ✅ Optimizado con useMemo
 */
const useUsersActivity = (users, emergencyServices) => {
  const activityAnalysis = useMemo(() => {
    if (!users?.length) return {}

    const now = new Date()
    const thirtyDaysAgo = new Date(now.getTime() - 30 * 24 * 60 * 60 * 1000)
    const sevenDaysAgo = new Date(now.getTime() - 7 * 24 * 60 * 60 * 1000)

    // Usuarios activos en diferentes períodos
    const activeUsers = {
      last7Days: users.filter(
        (user) => user.lastActivity && new Date(user.lastActivity) >= sevenDaysAgo
      ).length,
      last30Days: users.filter(
        (user) => user.lastActivity && new Date(user.lastActivity) >= thirtyDaysAgo
      ).length,
      total: users.length
    }

    // Usuarios que han usado servicios
    const usersWithServices = users.filter((user) =>
      emergencyServices?.some((service) => service.userId === user.id)
    ).length

    // Tasa de utilización de servicios
    const serviceUtilizationRate =
      users.length > 0 ? ((usersWithServices / users.length) * 100).toFixed(1) : 0

    // Nuevos registros por período
    const newUsers = {
      thisWeek: users.filter((user) => user.createdAt && new Date(user.createdAt) >= sevenDaysAgo)
        .length,
      thisMonth: users.filter((user) => user.createdAt && new Date(user.createdAt) >= thirtyDaysAgo)
        .length
    }

    return {
      activeUsers,
      usersWithServices,
      serviceUtilizationRate: parseFloat(serviceUtilizationRate),
      newUsers
    }
  }, [users, emergencyServices])

  return {
    activityAnalysis
  }
}

export default useUsersActivity