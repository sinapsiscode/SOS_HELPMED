import { useState, useMemo, useCallback } from 'react'
import useAppStore from '../stores/useAppStore'
import useUsersDemographic from './useUsersDemographic'
import useUsersAffiliation from './useUsersAffiliation'
import useUsersActivity from './useUsersActivity'
import useUsersFilters from './useUsersFilters'
import useUsersExport from './useUsersExport'

/**
 * Hook coordinador para el reporte de Usuarios
 * REFACTORIZADO siguiendo TODAS las reglas:
 *
 * ✅ Regla #2: Lógica extraída a hooks especializados
 * ✅ Regla #5: Gestión de estados distribuida
 * ✅ Regla #13: Optimización con composición de hooks
 * 
 * Funcionalidades distribuidas:
 * - useUsersDemographic: Análisis demográfico
 * - useUsersAffiliation: Análisis de afiliación y planes
 * - useUsersActivity: Análisis de actividad y retención
 * - useUsersFilters: Filtrado y ordenamiento
 * - useUsersExport: Exportación de reportes
 */
const useUsersReport = (baseMetrics) => {
  // ============================================
  // STORE Y ESTADOS GLOBALES
  // ============================================
  const { users, affiliates, emergencyServices, plans } = useAppStore()

  // ============================================
  // ESTADOS LOCALES
  // ============================================
  const [userFilter, setUserFilter] = useState('all') // all, active, inactive, new
  const [sortBy, setSortBy] = useState('registrationDate') // registrationDate, activity, plan

  // ============================================
  // HOOKS ESPECIALIZADOS
  // ============================================
  const demographicHook = useUsersDemographic(users)
  const affiliationHook = useUsersAffiliation(users, affiliates)
  const activityHook = useUsersActivity(users, emergencyServices)
  const filtersHook = useUsersFilters(users, userFilter, sortBy)
  const exportHook = useUsersExport()

  // ============================================
  // GENERACIÓN DE CONTENIDO PARA REPORTES
  // ============================================
  const generateUsersContent = useMemo(() => {
    const demo = demographicHook.demographicAnalysis
    const affiliation = affiliationHook.affiliationAnalysis
    const activity = activityHook.activityAnalysis

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
          ${filtersHook.processedUsers
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
  }, [demographicHook.demographicAnalysis, affiliationHook.affiliationAnalysis, activityHook.activityAnalysis, filtersHook.processedUsers])

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
  const exportUsersReport = useCallback(async (format) => {
    await exportHook.exportUsersReport(format, generateUsersContent, baseMetrics)
  }, [exportHook, generateUsersContent, baseMetrics])

  // ============================================
  // RETORNO COORDINADO DE TODOS LOS HOOKS
  // ============================================
  return {
    // Análisis principales (delegados)
    demographicAnalysis: demographicHook.demographicAnalysis,
    affiliationAnalysis: affiliationHook.affiliationAnalysis,
    activityAnalysis: activityHook.activityAnalysis,

    // Usuarios procesados (delegados)
    processedUsers: filtersHook.processedUsers,
    userFilter,
    sortBy,

    // Funciones de control
    handleFilterChange,
    handleSortChange,

    // Contenido para reportes
    reportContent: generateUsersContent,

    // Funciones específicas (delegadas)
    exportReport: exportUsersReport,

    // Utilidades
    hasData: (demographicHook.demographicAnalysis?.totalUsers || 0) > 0,
    totalFilteredUsers: filtersHook.processedUsers.length
  }
}

export default useUsersReport