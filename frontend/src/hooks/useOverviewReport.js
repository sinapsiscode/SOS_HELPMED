import { useState, useMemo, useEffect } from 'react'
import useAppStore from '../stores/useAppStore'
import { reportService } from '../services/reportService'

/**
 * Hook especializado para el reporte Overview (Vista General)
 * Siguiendo Regla #2: Lógica compleja extraída del componente
 *
 * Proporciona:
 * - Métricas ejecutivas del sistema
 * - Estadísticas comparativas (períodos anteriores)
 * - Gráficos de tendencias principales
 * - KPIs operacionales críticos
 * - Resumen de ingresos y servicios
 *
 * @param {Object} baseMetrics - Métricas base del hook principal
 * @returns {Object} Datos y funciones específicas del reporte overview
 */
const useOverviewReport = (baseMetrics) => {
  const { users, emergencyServices, revenueSummary, transactions, surveys, affiliates } =
    useAppStore()

  const [chartData, setChartData] = useState({})
  const [loading, setLoading] = useState(false)

  // ============================================
  // MÉTRICAS PRINCIPALES DEL OVERVIEW
  // ============================================
  const overviewMetrics = useMemo(() => {
    const totalUsers = baseMetrics.total.users || 0
    const totalServices = baseMetrics.filtered.services.length || 0
    const totalRevenue = baseMetrics.total.revenue || 0
    const totalSurveys = baseMetrics.filtered.surveys.length || 0

    // Cálculos de crecimiento (simulated - en producción vendría de API)
    const previousPeriodUsers = Math.floor(totalUsers * 0.85)
    const previousPeriodServices = Math.floor(totalServices * 0.78)
    const previousPeriodRevenue = Math.floor(totalRevenue * 0.82)

    const userGrowth =
      totalUsers > 0
        ? (((totalUsers - previousPeriodUsers) / previousPeriodUsers) * 100).toFixed(1)
        : 0
    const serviceGrowth =
      totalServices > 0
        ? (((totalServices - previousPeriodServices) / previousPeriodServices) * 100).toFixed(1)
        : 0
    const revenueGrowth =
      totalRevenue > 0
        ? (((totalRevenue - previousPeriodRevenue) / previousPeriodRevenue) * 100).toFixed(1)
        : 0

    // Métricas de satisfacción
    const averageSatisfaction =
      totalSurveys > 0
        ? (
            baseMetrics.filtered.surveys.reduce((sum, survey) => sum + (survey.rating || 0), 0) /
            totalSurveys
          ).toFixed(1)
        : 0

    // Tiempo promedio de respuesta (simulated)
    const avgResponseTime = totalServices > 0 ? (Math.random() * 15 + 8).toFixed(1) : 0

    return {
      users: {
        total: totalUsers,
        growth: parseFloat(userGrowth),
        previous: previousPeriodUsers
      },
      services: {
        total: totalServices,
        growth: parseFloat(serviceGrowth),
        previous: previousPeriodServices
      },
      revenue: {
        total: totalRevenue,
        growth: parseFloat(revenueGrowth),
        previous: previousPeriodRevenue
      },
      satisfaction: {
        average: parseFloat(averageSatisfaction),
        total: totalSurveys
      },
      performance: {
        avgResponseTime: parseFloat(avgResponseTime),
        successRate: 96.5 // Simulated KPI
      }
    }
  }, [baseMetrics, users, emergencyServices, revenueSummary, surveys])

  // ============================================
  // DATOS PARA GRÁFICOS
  // ============================================
  const processChartData = useMemo(() => {
    // Procesar datos para diferentes tipos de gráficos

    // 1. Distribución de servicios por tipo
    const serviceTypes = {}
    baseMetrics.filtered.services.forEach((service) => {
      const type = service.serviceType || 'emergency'
      serviceTypes[type] = (serviceTypes[type] || 0) + 1
    })

    // 2. Ingresos por mes (últimos 6 meses)
    const revenueByMonth = Array.from({ length: 6 }, (_, i) => {
      const date = new Date()
      date.setMonth(date.getMonth() - (5 - i))
      return {
        month: date.toLocaleDateString('es-PE', { month: 'short' }),
        revenue: Math.floor(Math.random() * 50000 + 20000)
      }
    })

    // 3. Usuarios activos vs nuevos registros
    const userActivity = Array.from({ length: 7 }, (_, i) => {
      const date = new Date()
      date.setDate(date.getDate() - (6 - i))
      return {
        day: date.toLocaleDateString('es-PE', { weekday: 'short' }),
        active: Math.floor(Math.random() * 200 + 100),
        new: Math.floor(Math.random() * 50 + 10)
      }
    })

    // 4. Satisfacción por categoría
    const satisfactionByCategory = [
      { category: 'Tiempo Respuesta', rating: 4.2 },
      { category: 'Calidad Servicio', rating: 4.5 },
      { category: 'Personal Médico', rating: 4.7 },
      { category: 'Facilidad Uso', rating: 4.1 },
      { category: 'Comunicación', rating: 4.3 }
    ]

    return {
      serviceTypes,
      revenueByMonth,
      userActivity,
      satisfactionByCategory
    }
  }, [baseMetrics])

  // ============================================
  // GENERACIÓN DE CONTENIDO PARA REPORTES
  // ============================================
  const generateOverviewContent = useMemo(() => {
    const metrics = overviewMetrics

    return {
      title: 'Vista General del Sistema',
      content: `
        <h2>📊 Métricas Ejecutivas</h2>
        <div class="metrics-grid">
          <div class="metric-card">
            <div class="metric-value">${metrics.users.total.toLocaleString()}</div>
            <div class="metric-label">Usuarios Totales</div>
            <div class="metric-growth ${metrics.users.growth >= 0 ? 'positive' : 'negative'}">
              ${metrics.users.growth >= 0 ? '+' : ''}${metrics.users.growth}%
            </div>
          </div>
          
          <div class="metric-card">
            <div class="metric-value">${metrics.services.total.toLocaleString()}</div>
            <div class="metric-label">Servicios Prestados</div>
            <div class="metric-growth ${metrics.services.growth >= 0 ? 'positive' : 'negative'}">
              ${metrics.services.growth >= 0 ? '+' : ''}${metrics.services.growth}%
            </div>
          </div>
          
          <div class="metric-card">
            <div class="metric-value">S/ ${metrics.revenue.total.toLocaleString()}</div>
            <div class="metric-label">Ingresos Totales</div>
            <div class="metric-growth ${metrics.revenue.growth >= 0 ? 'positive' : 'negative'}">
              ${metrics.revenue.growth >= 0 ? '+' : ''}${metrics.revenue.growth}%
            </div>
          </div>
          
          <div class="metric-card">
            <div class="metric-value">${metrics.satisfaction.average}/5.0</div>
            <div class="metric-label">Satisfacción Promedio</div>
            <div class="metric-growth">
              ${metrics.satisfaction.total} encuestas
            </div>
          </div>
        </div>

        <h2>🎯 KPIs Operacionales</h2>
        <table>
          <tr>
            <th>Métrica</th>
            <th>Valor Actual</th>
            <th>Objetivo</th>
            <th>Estado</th>
          </tr>
          <tr>
            <td>Tiempo Promedio de Respuesta</td>
            <td>${metrics.performance.avgResponseTime} min</td>
            <td>< 15 min</td>
            <td>${metrics.performance.avgResponseTime < 15 ? '✅' : '❌'}</td>
          </tr>
          <tr>
            <td>Tasa de Éxito de Servicios</td>
            <td>${metrics.performance.successRate}%</td>
            <td>> 95%</td>
            <td>${metrics.performance.successRate > 95 ? '✅' : '❌'}</td>
          </tr>
          <tr>
            <td>Satisfacción del Cliente</td>
            <td>${metrics.satisfaction.average}/5.0</td>
            <td>> 4.0</td>
            <td>${metrics.satisfaction.average > 4.0 ? '✅' : '❌'}</td>
          </tr>
        </table>

        <h2>📈 Distribución de Servicios</h2>
        <table>
          <thead>
            <tr>
              <th>Tipo de Servicio</th>
              <th>Cantidad</th>
              <th>Porcentaje</th>
            </tr>
          </thead>
          <tbody>
            ${Object.entries(processChartData.serviceTypes)
              .map(([type, count]) => {
                const percentage = ((count / metrics.services.total) * 100).toFixed(1)
                const typeName =
                  {
                    emergency: 'Emergencias',
                    scheduled: 'Citas Programadas',
                    transfer: 'Traslados',
                    consultation: 'Consultas'
                  }[type] || type

                return `
                  <tr>
                    <td>${typeName}</td>
                    <td>${count}</td>
                    <td>${percentage}%</td>
                  </tr>
                `
              })
              .join('')}
          </tbody>
        </table>
      `,
      excelContent: `
        <h2>Reporte Ejecutivo - Vista General</h2>
        <table>
          <tr><th>Métrica</th><th>Valor Actual</th><th>Período Anterior</th><th>Crecimiento</th></tr>
          <tr><td>Usuarios Totales</td><td>${metrics.users.total}</td><td>${metrics.users.previous}</td><td>${metrics.users.growth}%</td></tr>
          <tr><td>Servicios Prestados</td><td>${metrics.services.total}</td><td>${metrics.services.previous}</td><td>${metrics.services.growth}%</td></tr>
          <tr><td>Ingresos Totales</td><td>S/ ${metrics.revenue.total}</td><td>S/ ${metrics.revenue.previous}</td><td>${metrics.revenue.growth}%</td></tr>
          <tr><td>Satisfacción Promedio</td><td>${metrics.satisfaction.average}/5.0</td><td>-</td><td>-</td></tr>
        </table>
      `,
      metrics
    }
  }, [overviewMetrics, processChartData])

  // ============================================
  // FUNCIÓN DE EXPORTACIÓN ESPECÍFICA
  // ============================================
  const exportOverviewReport = async (format) => {
    const reportData = generateOverviewContent

    if (format === 'pdf') {
      await reportService.generatePDF({
        reportType: 'overview',
        title: reportData.title,
        content: reportData.content,
        dateRange: baseMetrics.dateRange,
        metrics: reportData.metrics
      })
    } else if (format === 'excel') {
      await reportService.generateExcel({
        reportType: 'overview',
        title: reportData.title,
        content: reportData.excelContent,
        dateRange: baseMetrics.dateRange,
        metrics: reportData.metrics
      })
    }
  }

  // ============================================
  // EFECTO PARA PROCESAR DATOS AL MONTAR
  // ============================================
  useEffect(() => {
    setLoading(true)

    // Simular procesamiento de datos pesados
    const timer = setTimeout(() => {
      setChartData(processChartData)
      setLoading(false)
    }, 500)

    return () => clearTimeout(timer)
  }, [processChartData])

  // ============================================
  // RETORNO DEL HOOK
  // ============================================
  return {
    // Datos principales
    overviewMetrics,
    chartData,
    loading,

    // Contenido para reportes
    reportContent: generateOverviewContent,

    // Funciones específicas
    exportReport: exportOverviewReport,

    // Utilidades
    hasData: overviewMetrics.users.total > 0 || overviewMetrics.services.total > 0
  }
}

export default useOverviewReport
