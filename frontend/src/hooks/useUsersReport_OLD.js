import { useState, useMemo, useCallback } from 'react'
import useAppStore from '../stores/useAppStore'
import { reportService } from '../services/reportService'

/**
 * Hook especializado para el reporte de Usuarios
 * Siguiendo Regla #2: Lógica compleja extraída del componente
 *
 * Proporciona:
 * - Análisis demográfico de usuarios
 * - Estadísticas de afiliación y actividad
 * - Distribución por planes y tipos de usuario
 * - Métricas de retención y engagement
 * - Análisis de crecimiento por períodos
 *
 * @param {Object} baseMetrics - Métricas base del hook principal
 * @returns {Object} Datos y funciones específicas del reporte de usuarios
 */
const useUsersReport = (baseMetrics) => {
  const { users, affiliates, emergencyServices, plans } = useAppStore()

  const [userFilter, setUserFilter] = useState('all') // all, active, inactive, new
  const [sortBy, setSortBy] = useState('registrationDate') // registrationDate, activity, plan

  // ============================================
  // ANÁLISIS DEMOGRÁFICO
  // ============================================
  const demographicAnalysis = useMemo(() => {
    if (!users?.length) return {}

    // Distribución por tipo de usuario
    const userTypes = {}
    users.forEach((user) => {
      const type = user.role || user.userType || 'familiar'
      userTypes[type] = (userTypes[type] || 0) + 1
    })

    // Distribución por género
    const genderDistribution = {}
    users.forEach((user) => {
      const gender = user.gender || 'no_specified'
      genderDistribution[gender] = (genderDistribution[gender] || 0) + 1
    })

    // Distribución por grupos de edad
    const ageGroups = {
      '18-25': 0,
      '26-35': 0,
      '36-45': 0,
      '46-55': 0,
      '56-65': 0,
      '65+': 0
    }

    users.forEach((user) => {
      if (user.birthDate) {
        const age = new Date().getFullYear() - new Date(user.birthDate).getFullYear()
        if (age <= 25) ageGroups['18-25']++
        else if (age <= 35) ageGroups['26-35']++
        else if (age <= 45) ageGroups['36-45']++
        else if (age <= 55) ageGroups['46-55']++
        else if (age <= 65) ageGroups['56-65']++
        else ageGroups['65+']++
      }
    })

    // Distribución geográfica (por departamento)
    const locationDistribution = {}
    users.forEach((user) => {
      const location = user.department || user.city || 'No especificado'
      locationDistribution[location] = (locationDistribution[location] || 0) + 1
    })

    return {
      userTypes,
      genderDistribution,
      ageGroups,
      locationDistribution,
      totalUsers: users.length
    }
  }, [users])

  // ============================================
  // ANÁLISIS DE AFILIACIÓN Y PLANES
  // ============================================
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

  // ============================================
  // ANÁLISIS DE ACTIVIDAD Y RETENCIÓN
  // ============================================
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

  // ============================================
  // USUARIOS FILTRADOS Y ORDENADOS
  // ============================================
  const processedUsers = useMemo(() => {
    if (!users?.length) return []

    let filtered = [...users]

    // Aplicar filtros
    switch (userFilter) {
      case 'active':
        const weekAgo = new Date(Date.now() - 7 * 24 * 60 * 60 * 1000)
        filtered = filtered.filter(
          (user) => user.lastActivity && new Date(user.lastActivity) >= weekAgo
        )
        break
      case 'inactive':
        const monthAgo = new Date(Date.now() - 30 * 24 * 60 * 60 * 1000)
        filtered = filtered.filter(
          (user) => !user.lastActivity || new Date(user.lastActivity) < monthAgo
        )
        break
      case 'new':
        const thisMonth = new Date(Date.now() - 30 * 24 * 60 * 60 * 1000)
        filtered = filtered.filter(
          (user) => user.createdAt && new Date(user.createdAt) >= thisMonth
        )
        break
    }

    // Aplicar ordenamiento
    switch (sortBy) {
      case 'registrationDate':
        filtered.sort((a, b) => new Date(b.createdAt || 0) - new Date(a.createdAt || 0))
        break
      case 'activity':
        filtered.sort((a, b) => new Date(b.lastActivity || 0) - new Date(a.lastActivity || 0))
        break
      case 'plan':
        filtered.sort((a, b) => (a.planType || '').localeCompare(b.planType || ''))
        break
    }

    return filtered
  }, [users, userFilter, sortBy])

  // ============================================
  // GENERACIÓN DE CONTENIDO PARA REPORTES
  // ============================================
  const generateUsersContent = useMemo(() => {
    const demo = demographicAnalysis
    const affiliation = affiliationAnalysis
    const activity = activityAnalysis

    return {
      title: 'Análisis de Usuarios y Afiliados',
      content: `
        <h2>👥 Resumen Ejecutivo</h2>
        <div class="metrics-grid">
          <div class="metric-card">
            <div class="metric-value">${demo.totalUsers?.toLocaleString() || 0}</div>
            <div class="metric-label">Total de Usuarios</div>
          </div>
          
          <div class="metric-card">
            <div class="metric-value">${activity.activeUsers?.last30Days || 0}</div>
            <div class="metric-label">Usuarios Activos (30 días)</div>
          </div>
          
          <div class="metric-card">
            <div class="metric-value">${activity.serviceUtilizationRate || 0}%</div>
            <div class="metric-label">Tasa de Utilización</div>
          </div>
          
          <div class="metric-card">
            <div class="metric-value">${affiliation.affiliateStats?.totalAffiliates || 0}</div>
            <div class="metric-label">Total de Afiliados</div>
          </div>
        </div>

        <h2>📊 Distribución Demográfica</h2>
        <h3>Por Tipo de Usuario</h3>
        <table>
          <tr><th>Tipo</th><th>Cantidad</th><th>Porcentaje</th></tr>
          ${Object.entries(demo.userTypes || {})
            .map(([type, count]) => {
              const percentage = ((count / demo.totalUsers) * 100).toFixed(1)
              const typeName =
                {
                  familiar: 'Familiares',
                  corporate: 'Corporativo',
                  external: 'Externo',
                  admin: 'Administrador'
                }[type] || type

              return `<tr><td>${typeName}</td><td>${count}</td><td>${percentage}%</td></tr>`
            })
            .join('')}
        </table>

        <h3>Por Grupo de Edad</h3>
        <table>
          <tr><th>Rango de Edad</th><th>Cantidad</th><th>Porcentaje</th></tr>
          ${Object.entries(demo.ageGroups || {})
            .map(([range, count]) => {
              const percentage =
                demo.totalUsers > 0 ? ((count / demo.totalUsers) * 100).toFixed(1) : 0
              return `<tr><td>${range} años</td><td>${count}</td><td>${percentage}%</td></tr>`
            })
            .join('')}
        </table>

        <h2>📈 Análisis de Actividad</h2>
        <table>
          <tr><th>Métrica</th><th>Valor</th><th>Descripción</th></tr>
          <tr><td>Usuarios Activos (7 días)</td><td>${activity.activeUsers?.last7Days || 0}</td><td>Usuarios con actividad reciente</td></tr>
          <tr><td>Usuarios Activos (30 días)</td><td>${activity.activeUsers?.last30Days || 0}</td><td>Usuarios activos del mes</td></tr>
          <tr><td>Usuarios con Servicios</td><td>${activity.usersWithServices || 0}</td><td>Han utilizado al menos un servicio</td></tr>
          <tr><td>Nuevos Registros (7 días)</td><td>${activity.newUsers?.thisWeek || 0}</td><td>Registros de la semana</td></tr>
          <tr><td>Nuevos Registros (30 días)</td><td>${activity.newUsers?.thisMonth || 0}</td><td>Registros del mes</td></tr>
        </table>

        <h2>🏥 Distribución por Planes</h2>
        <table>
          <tr><th>Plan</th><th>Usuarios</th><th>Porcentaje</th></tr>
          ${Object.entries(affiliation.planDistribution || {})
            .map(([plan, count]) => {
              const percentage =
                demo.totalUsers > 0 ? ((count / demo.totalUsers) * 100).toFixed(1) : 0
              const planName =
                {
                  basic: 'Básico',
                  premium: 'Premium',
                  corporate: 'Corporativo',
                  family: 'Familiar'
                }[plan] || plan

              return `<tr><td>${planName}</td><td>${count}</td><td>${percentage}%</td></tr>`
            })
            .join('')}
        </table>
      `,
      excelContent: `
        <h2>Reporte Detallado - Usuarios</h2>
        <table>
          <tr><th>Usuario</th><th>Email</th><th>Tipo</th><th>Plan</th><th>Estado</th><th>Fecha Registro</th><th>Última Actividad</th></tr>
          ${processedUsers
            .slice(0, 100)
            .map(
              (user) => `
            <tr>
              <td>${user.name || 'Sin nombre'}</td>
              <td>${user.email || 'Sin email'}</td>
              <td>${user.role || user.userType || 'Familiar'}</td>
              <td>${user.planType || 'Básico'}</td>
              <td>${user.status || 'Activo'}</td>
              <td>${user.createdAt ? new Date(user.createdAt).toLocaleDateString('es-PE') : 'N/A'}</td>
              <td>${user.lastActivity ? new Date(user.lastActivity).toLocaleDateString('es-PE') : 'N/A'}</td>
            </tr>
          `
            )
            .join('')}
        </table>
      `,
      metrics: {
        demographic: demo,
        affiliation,
        activity
      }
    }
  }, [demographicAnalysis, affiliationAnalysis, activityAnalysis, processedUsers])

  // ============================================
  // FUNCIONES DE FILTRADO Y ORDENAMIENTO
  // ============================================
  const handleFilterChange = useCallback((newFilter) => {
    setUserFilter(newFilter)
  }, [])

  const handleSortChange = useCallback((newSort) => {
    setSortBy(newSort)
  }, [])

  // ============================================
  // FUNCIÓN DE EXPORTACIÓN ESPECÍFICA
  // ============================================
  const exportUsersReport = async (format) => {
    const reportData = generateUsersContent

    if (format === 'pdf') {
      await reportService.generatePDF({
        reportType: 'users',
        title: reportData.title,
        content: reportData.content,
        dateRange: baseMetrics.dateRange,
        metrics: reportData.metrics
      })
    } else if (format === 'excel') {
      await reportService.generateExcel({
        reportType: 'users',
        title: reportData.title,
        content: reportData.excelContent,
        dateRange: baseMetrics.dateRange,
        metrics: reportData.metrics
      })
    }
  }

  // ============================================
  // RETORNO DEL HOOK
  // ============================================
  return {
    // Análisis principales
    demographicAnalysis,
    affiliationAnalysis,
    activityAnalysis,

    // Usuarios procesados
    processedUsers,
    userFilter,
    sortBy,

    // Funciones de control
    handleFilterChange,
    handleSortChange,

    // Contenido para reportes
    reportContent: generateUsersContent,

    // Funciones específicas
    exportReport: exportUsersReport,

    // Utilidades
    hasData: demographicAnalysis.totalUsers > 0,
    totalFilteredUsers: processedUsers.length
  }
}

export default useUsersReport
