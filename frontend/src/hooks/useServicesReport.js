import { useState, useMemo, useCallback } from 'react'
import useAppStore from '../stores/useAppStore'
import { reportService } from '../services/reportService'
import useServicesAnalysis from './useServicesAnalysis'
import useServicesPerformance from './useServicesPerformance'
import useServicesCost from './useServicesCost'
import useServicesFilters from './useServicesFilters'

/**
 * Hook coordinador para el reporte de Servicios Médicos
 * REFACTORIZADO siguiendo TODAS las reglas:
 *
 * ✅ Regla #2: Lógica extraída a hooks especializados
 * ✅ Regla #5: Gestión de estados distribuida
 * ✅ Regla #13: Optimización con composición de hooks
 * 
 * Funcionalidades distribuidas:
 * - useServicesAnalysis: Análisis general y distribuciones
 * - useServicesPerformance: Métricas de performance
 * - useServicesCost: Análisis de costos y financiero
 * - useServicesFilters: Filtrado y ordenamiento
 */
const useServicesReport = (baseMetrics) => {
  const { emergencyServices, users, ambulances, plans } = useAppStore()

  const [serviceFilter, setServiceFilter] = useState('all') // all, emergency, scheduled, completed, pending
  const [sortBy, setSortBy] = useState('date') // date, type, priority, duration

  // ============================================
  // HOOKS ESPECIALIZADOS
  // ============================================
  const analysisHook = useServicesAnalysis(baseMetrics.filtered.services || [])
  const performanceHook = useServicesPerformance(baseMetrics.filtered.services || [])
  const costHook = useServicesCost(baseMetrics.filtered.services || [])
  const filtersHook = useServicesFilters(baseMetrics.filtered.services || [], serviceFilter, sortBy)

  // ============================================
  // GENERACIÓN DE CONTENIDO PARA REPORTES
  // ============================================
  const generateServicesContent = useMemo(() => {
    const analysis = analysisHook.servicesAnalysis
    const performance = performanceHook.performanceMetrics
    const costs = costHook.costAnalysis

    return {
      title: 'Análisis de Servicios Médicos',
      content: `
        <h2>🚑 Resumen Ejecutivo de Servicios</h2>
        <div class="metrics-grid">
          <div class="metric-card">
            <div class="metric-value">${analysis.totalServices?.toLocaleString() || 0}</div>
            <div class="metric-label">Total de Servicios</div>
          </div>
          
          <div class="metric-card">
            <div class="metric-value">${performance.avgResponseTime || 0} min</div>
            <div class="metric-label">Tiempo Promedio Respuesta</div>
          </div>
          
          <div class="metric-card">
            <div class="metric-value">${performance.successRate || 0}%</div>
            <div class="metric-label">Tasa de Éxito</div>
          </div>
          
          <div class="metric-card">
            <div class="metric-value">S/ ${costs.totalCost?.toLocaleString() || 0}</div>
            <div class="metric-label">Ingresos Totales</div>
          </div>
        </div>

        <h2>📊 Distribución por Tipo de Servicio</h2>
        <table>
          <tr><th>Tipo de Servicio</th><th>Cantidad</th><th>Porcentaje</th><th>Ingresos</th></tr>
          ${Object.entries(analysis.serviceTypes || {})
            .map(([type, count]) => {
              const percentage = ((count / analysis.totalServices) * 100).toFixed(1)
              const revenue = costs.costByType?.[type] || 0
              const typeName =
                {
                  emergency: 'Emergencias',
                  scheduled: 'Citas Programadas',
                  transfer: 'Traslados',
                  consultation: 'Consultas',
                  home_visit: 'Visitas Domiciliarias'
                }[type] || type

              return `<tr><td>${typeName}</td><td>${count}</td><td>${percentage}%</td><td>S/ ${revenue.toLocaleString()}</td></tr>`
            })
            .join('')}
        </table>

        <h2>⚡ Métricas de Performance</h2>
        <table>
          <tr><th>Métrica</th><th>Valor</th><th>Objetivo</th><th>Estado</th></tr>
          <tr>
            <td>Tiempo Promedio de Respuesta</td>
            <td>${performance.avgResponseTime || 0} min</td>
            <td>< 15 min</td>
            <td>${(performance.avgResponseTime || 0) < 15 ? '✅' : '❌'}</td>
          </tr>
          <tr>
            <td>Duración Promedio del Servicio</td>
            <td>${performance.avgServiceDuration || 0} min</td>
            <td>< 60 min</td>
            <td>${(performance.avgServiceDuration || 0) < 60 ? '✅' : '❌'}</td>
          </tr>
          <tr>
            <td>Tasa de Éxito</td>
            <td>${performance.successRate || 0}%</td>
            <td>> 95%</td>
            <td>${(performance.successRate || 0) > 95 ? '✅' : '❌'}</td>
          </tr>
          <tr>
            <td>Tasa de Cancelación</td>
            <td>${performance.cancellationRate || 0}%</td>
            <td>< 5%</td>
            <td>${(performance.cancellationRate || 0) < 5 ? '✅' : '❌'}</td>
          </tr>
          <tr>
            <td>Tiempo Promedio de Espera</td>
            <td>${performance.avgWaitTime || 0} min</td>
            <td>< 10 min</td>
            <td>${(performance.avgWaitTime || 0) < 10 ? '✅' : '❌'}</td>
          </tr>
        </table>

        <h2>📈 Análisis Temporal</h2>
        <h3>Distribución por Día de la Semana</h3>
        <table>
          <tr><th>Día</th><th>Cantidad de Servicios</th><th>Porcentaje</th></tr>
          ${['Domingo', 'Lunes', 'Martes', 'Miércoles', 'Jueves', 'Viernes', 'Sábado']
            .map((day, index) => {
              const count = analysis.weeklyDistribution?.[index] || 0
              const percentage =
                analysis.totalServices > 0 ? ((count / analysis.totalServices) * 100).toFixed(1) : 0

              return `<tr><td>${day}</td><td>${count}</td><td>${percentage}%</td></tr>`
            })
            .join('')}
        </table>

        <h2>💰 Análisis Financiero</h2>
        <table>
          <tr><th>Mes</th><th>Servicios</th><th>Ingresos</th><th>Promedio por Servicio</th></tr>
          ${costs.monthlyRevenue
            ?.map((month) => {
              const avgPerService =
                month.serviceCount > 0 ? (month.revenue / month.serviceCount).toFixed(2) : 0

              return `
              <tr>
                <td>${month.month}</td>
                <td>${month.serviceCount}</td>
                <td>S/ ${month.revenue.toLocaleString()}</td>
                <td>S/ ${avgPerService}</td>
              </tr>
            `
            })
            .join('')}
        </table>
      `,
      excelContent: `
        <h2>Reporte Detallado - Servicios</h2>
        <table>
          <tr><th>Fecha</th><th>Tipo</th><th>Usuario</th><th>Estado</th><th>Prioridad</th><th>Duración (min)</th><th>Costo</th></tr>
          ${filtersHook.processedServices
            .slice(0, 100)
            .map(
              (service) => `
            <tr>
              <td>${service.createdAt ? new Date(service.createdAt).toLocaleDateString('es-PE') : 'N/A'}</td>
              <td>${service.serviceType || service.type || 'N/A'}</td>
              <td>${service.userName || service.userId || 'N/A'}</td>
              <td>${service.status || 'N/A'}</td>
              <td>${service.priority || 'N/A'}</td>
              <td>${service.duration || 'N/A'}</td>
              <td>S/ ${(service.cost || service.price || 0).toFixed(2)}</td>
            </tr>
          `
            )
            .join('')}
        </table>
      `,
      metrics: {
        analysis,
        performance,
        costs
      }
    }
  }, [analysisHook.servicesAnalysis, performanceHook.performanceMetrics, costHook.costAnalysis, filtersHook.processedServices])

  // ============================================
  // FUNCIONES DE FILTRADO Y ORDENAMIENTO
  // ============================================
  const handleFilterChange = useCallback((newFilter) => {
    setServiceFilter(newFilter)
  }, [])

  const handleSortChange = useCallback((newSort) => {
    setSortBy(newSort)
  }, [])

  // ============================================
  // FUNCIÓN DE EXPORTACIÓN ESPECÍFICA
  // ============================================
  const exportServicesReport = async (format) => {
    const reportData = generateServicesContent

    if (format === 'pdf') {
      await reportService.generatePDF({
        reportType: 'services',
        title: reportData.title,
        content: reportData.content,
        dateRange: baseMetrics.dateRange,
        metrics: reportData.metrics
      })
    } else if (format === 'excel') {
      await reportService.generateExcel({
        reportType: 'services',
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
    // Análisis principales (delegados)
    servicesAnalysis: analysisHook.servicesAnalysis,
    performanceMetrics: performanceHook.performanceMetrics,
    costAnalysis: costHook.costAnalysis,

    // Servicios procesados (delegados)
    processedServices: filtersHook.processedServices,
    serviceFilter,
    sortBy,

    // Funciones de control
    handleFilterChange,
    handleSortChange,

    // Contenido para reportes
    reportContent: generateServicesContent,

    // Funciones específicas
    exportReport: exportServicesReport,

    // Utilidades
    hasData: (analysisHook.servicesAnalysis?.totalServices || 0) > 0,
    totalFilteredServices: filtersHook.processedServices.length
  }
}

export default useServicesReport
