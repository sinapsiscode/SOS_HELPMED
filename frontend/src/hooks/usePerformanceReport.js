import { useState, useMemo, useCallback } from 'react'
import useAppStore from '../stores/useAppStore'
import { reportService } from '../services/reportService'
import usePerformanceKPIs from './usePerformanceKPIs'
import useEfficiencyMetrics from './useEfficiencyMetrics'
import usePerformanceTrends from './usePerformanceTrends'
import usePerformanceBenchmarks from './usePerformanceBenchmarks'

/**
 * Hook coordinador para el reporte de Performance/Rendimiento
 * REFACTORIZADO siguiendo TODAS las reglas:
 *
 * ✅ Regla #2: Lógica extraída a hooks especializados
 * ✅ Regla #5: Gestión de estados distribuida
 * ✅ Regla #13: Optimización con composición de hooks
 * 
 * Funcionalidades distribuidas:
 * - usePerformanceKPIs: KPIs operacionales críticos
 * - useEfficiencyMetrics: Métricas de eficiencia
 * - usePerformanceTrends: Análisis de tendencias
 * - usePerformanceBenchmarks: Evaluación contra objetivos
 */
const usePerformanceReport = (baseMetrics) => {
  const { emergencyServices, ambulances, users, surveys } = useAppStore()

  const [performancePeriod, setPerformancePeriod] = useState('month')
  const [kpiFilter, setKpiFilter] = useState('all')

  // ============================================
  // HOOKS ESPECIALIZADOS
  // ============================================
  const kpisHook = usePerformanceKPIs(
    baseMetrics.filtered.services || [],
    baseMetrics.filtered.surveys || [],
    ambulances
  )
  const efficiencyHook = useEfficiencyMetrics(
    baseMetrics.filtered.services || [],
    ambulances
  )
  const trendsHook = usePerformanceTrends(
    baseMetrics.filtered.services || [],
    performancePeriod
  )
  const benchmarksHook = usePerformanceBenchmarks(kpisHook.operationalKPIs)




  // ============================================
  // GENERACIÓN DE CONTENIDO PARA REPORTES
  // ============================================
  const generatePerformanceContent = useMemo(() => {
    const kpis = kpisHook.operationalKPIs
    const efficiency = efficiencyHook.efficiencyMetrics
    const trends = trendsHook.trendAnalysis
    const benchmarks = benchmarksHook.benchmarks

    return {
      title: 'Análisis de Rendimiento Operacional',
      content: `
        <h2>🎯 KPIs Operacionales Críticos</h2>
        <div class="metrics-grid">
          <div class="metric-card ${kpis.avgResponseTime <= 15 ? 'good' : 'warning'}">
            <div class="metric-value">${kpis.avgResponseTime || 0} min</div>
            <div class="metric-label">Tiempo Promedio Respuesta</div>
            <div class="metric-target">Objetivo: ≤ 15 min</div>
          </div>
          
          <div class="metric-card ${kpis.systemUptime >= 99.5 ? 'good' : 'warning'}">
            <div class="metric-value">${kpis.systemUptime || 0}%</div>
            <div class="metric-label">Disponibilidad Sistema</div>
            <div class="metric-target">Objetivo: ≥ 99.5%</div>
          </div>
          
          <div class="metric-card ${kpis.avgSatisfaction >= 4.0 ? 'good' : 'warning'}">
            <div class="metric-value">${kpis.avgSatisfaction || 0}/5.0</div>
            <div class="metric-label">Satisfacción Cliente</div>
            <div class="metric-target">Objetivo: ≥ 4.0</div>
          </div>
          
          <div class="metric-card ${kpis.cancellationRate <= 5 ? 'good' : 'warning'}">
            <div class="metric-value">${kpis.cancellationRate || 0}%</div>
            <div class="metric-label">Tasa Cancelación</div>
            <div class="metric-target">Objetivo: ≤ 5%</div>
          </div>
        </div>

        <h2>📊 Evaluación Completa de KPIs</h2>
        <table>
          <tr><th>KPI</th><th>Valor Actual</th><th>Objetivo</th><th>Rendimiento</th><th>Estado</th></tr>
          ${benchmarks.evaluation
            .map((item) => {
              const statusIcon =
                item.status === 'good' ? '✅' : item.status === 'warning' ? '⚠️' : '❌'
              const metricName =
                {
                  avgResponseTime: 'Tiempo Promedio Respuesta',
                  systemUptime: 'Disponibilidad Sistema',
                  firstCallResolutionRate: 'Resolución Primera Llamada',
                  ambulanceUtilization: 'Utilización Ambulancias',
                  avgArrivalTime: 'Tiempo Promedio Llegada',
                  avgSatisfaction: 'Satisfacción Cliente',
                  cancellationRate: 'Tasa Cancelación',
                  avgWorkloadPerOperator: 'Carga Trabajo Operador'
                }[item.metric] || item.metric

              return `
              <tr class="${item.status}">
                <td>${metricName}${item.critical ? ' *' : ''}</td>
                <td>${item.current} ${item.unit}</td>
                <td>${item.target} ${item.unit}</td>
                <td>${item.performance}%</td>
                <td>${statusIcon}</td>
              </tr>
            `
            })
            .join('')}
        </table>
        <p><small>* Indica KPI crítico para la operación</small></p>

        <h2>⚡ Métricas de Eficiencia</h2>
        <table>
          <tr><th>Métrica</th><th>Valor</th><th>Descripción</th></tr>
          <tr><td>Tasa de Finalización</td><td>${efficiency.completionRate || 0}%</td><td>Servicios completados exitosamente</td></tr>
          <tr><td>Duración Promedio Servicio</td><td>${efficiency.avgServiceDuration || 0} min</td><td>Tiempo promedio por servicio</td></tr>
          <tr><td>Costo Promedio por Servicio</td><td>S/ ${efficiency.avgCostPerService || 0}</td><td>Costo operacional promedio</td></tr>
          <tr><td>Servicios por Ambulancia/Día</td><td>${efficiency.servicesPerAmbulancePerDay || 0}</td><td>Productividad de recursos</td></tr>
          <tr><td>Tasa de Reasignaciones</td><td>${efficiency.reassignmentRate || 0}%</td><td>Servicios que requirieron reasignación</td></tr>
          <tr><td>Tiempo Inactividad Ambulancia</td><td>${efficiency.avgDowntimePerAmbulance || 0} hrs/día</td><td>Tiempo fuera de servicio promedio</td></tr>
        </table>

        <h2>📈 Análisis de Tendencias (Últimos 6 ${performancePeriod === 'week' ? 'Semanas' : performancePeriod === 'month' ? 'Meses' : 'Trimestres'})</h2>
        <table>
          <tr><th>Período</th><th>Servicios</th><th>Tiempo Respuesta Promedio</th><th>Tasa Finalización</th></tr>
          ${trends.periods
            ?.map(
              (period, index) => `
            <tr ${index === trends.periods.length - 1 ? 'class="current-period"' : ''}>
              <td>${period.period}</td>
              <td>${period.services}</td>
              <td>${period.avgResponseTime} min</td>
              <td>${period.completionRate}%</td>
            </tr>
          `
            )
            .join('')}
        </table>
        
        <div class="trend-summary">
          <p><strong>Tendencia de Servicios:</strong> 
            ${trends.serviceGrowth >= 0 ? '+' : ''}${trends.serviceGrowth}% 
            ${trends.trendDirection === 'up' ? '📈' : trends.trendDirection === 'down' ? '📉' : '➡️'}
          </p>
        </div>

        ${
          benchmarks.criticalIssues > 0
            ? `
          <div class="alert critical">
            <h3>⚠️ Alertas Críticas</h3>
            <p>Se detectaron <strong>${benchmarks.criticalIssues}</strong> KPIs críticos fuera de objetivos que requieren atención inmediata.</p>
          </div>
        `
            : ''
        }
      `,
      excelContent: `
        <h2>Reporte de Rendimiento - Datos Detallados</h2>
        <table>
          <tr><th>KPI</th><th>Valor Actual</th><th>Objetivo</th><th>Estado</th><th>Crítico</th></tr>
          ${benchmarks.evaluation
            .map(
              (item) => `
            <tr>
              <td>${item.metric}</td>
              <td>${item.current} ${item.unit}</td>
              <td>${item.target} ${item.unit}</td>
              <td>${item.status}</td>
              <td>${item.critical ? 'Sí' : 'No'}</td>
            </tr>
          `
            )
            .join('')}
        </table>
      `,
      metrics: {
        kpis,
        efficiency,
        trends,
        benchmarks
      }
    }
  }, [kpisHook.operationalKPIs, efficiencyHook.efficiencyMetrics, trendsHook.trendAnalysis, benchmarksHook.benchmarks, performancePeriod])

  // ============================================
  // FUNCIONES DE CONTROL
  // ============================================
  const handlePeriodChange = useCallback((newPeriod) => {
    setPerformancePeriod(newPeriod)
  }, [])

  const handleKpiFilterChange = useCallback((newFilter) => {
    setKpiFilter(newFilter)
  }, [])

  // ============================================
  // FUNCIÓN DE EXPORTACIÓN ESPECÍFICA
  // ============================================
  const exportPerformanceReport = async (format) => {
    const reportData = generatePerformanceContent

    if (format === 'pdf') {
      await reportService.generatePDF({
        reportType: 'performance',
        title: reportData.title,
        content: reportData.content,
        dateRange: baseMetrics.dateRange,
        metrics: reportData.metrics
      })
    } else if (format === 'excel') {
      await reportService.generateExcel({
        reportType: 'performance',
        title: reportData.title,
        content: reportData.excelContent,
        dateRange: baseMetrics.dateRange,
        metrics: reportData.metrics
      })
    }
  }

  // ============================================
  // RETORNO COORDINADO DE TODOS LOS HOOKS
  // ============================================
  return {
    // Métricas principales (delegadas)
    operationalKPIs: kpisHook.operationalKPIs,
    efficiencyMetrics: efficiencyHook.efficiencyMetrics,
    trendAnalysis: trendsHook.trendAnalysis,
    benchmarks: benchmarksHook.benchmarks,

    // Estados de control
    performancePeriod,
    kpiFilter,

    // Funciones de control
    handlePeriodChange,
    handleKpiFilterChange,

    // Contenido para reportes
    reportContent: generatePerformanceContent,

    // Funciones específicas
    exportReport: exportPerformanceReport,

    // Utilidades
    hasData: Object.keys(kpisHook.operationalKPIs).length > 0,
    hasCriticalIssues: benchmarksHook.benchmarks.criticalIssues > 0
  }
}

export default usePerformanceReport
