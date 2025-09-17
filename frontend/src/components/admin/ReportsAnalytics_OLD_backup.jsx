// ${LABELS.admin.reportsAnalytics.comments.title}

import { useState, useEffect } from 'react'
import { LABELS } from '../../config/labels'
import useAppStore from '../../stores/useAppStore'
import RevenueManagement from './RevenueManagement'
import Swal from 'sweetalert2'

const ReportsAnalytics = () => {
  const labels = LABELS.admin.reportsAnalytics
  const { revenueSummary, transactions } = useAppStore()
  const [selectedReport, setSelectedReport] = useState('overview')
  const [startDate, setStartDate] = useState('')
  const [endDate, setEndDate] = useState('')
  const [filterType, setFilterType] = useState('all')

  const handleExportReport = (format) => {
    if (format === 'pdf') {
      generatePDFReport()
    } else if (format === 'excel') {
      generateExcelReport()
    }
  }

  const generatePDFReport = () => {
    // Crear ventana para PDF con datos del reporte actual
    const printWindow = window.open('', '_blank')
    
    // Obtener datos según el reporte seleccionado
    const reportData = getReportData()
    
    let htmlContent = `
      <!DOCTYPE html>
      <html>
        <head>
          <meta charset="utf-8">
          <title>Reporte ${getReportTitle()} - HelpMED</title>
          <style>
            body { font-family: Arial, sans-serif; margin: 20px; }
            h1 { color: #d32f2f; text-align: center; border-bottom: 3px solid #d32f2f; padding-bottom: 10px; }
            h2 { color: #1976d2; border-bottom: 1px solid #1976d2; padding-bottom: 5px; }
            .header-info { background-color: #f5f5f5; padding: 15px; border-radius: 5px; margin-bottom: 20px; }
            .metric-card { 
              border: 1px solid #ddd; 
              margin: 10px 0; 
              padding: 15px; 
              border-radius: 5px;
              display: inline-block;
              width: 200px;
              margin-right: 20px;
              vertical-align: top;
            }
            .metric-value { font-size: 24px; font-weight: bold; color: #1976d2; }
            .metric-label { color: #666; font-size: 14px; }
            table { border-collapse: collapse; width: 100%; margin: 20px 0; }
            th, td { border: 1px solid #ddd; padding: 8px; text-align: left; }
            th { background-color: #f2f2f2; font-weight: bold; }
            .status-active { color: #2e7d32; font-weight: bold; }
            .status-inactive { color: #c62828; font-weight: bold; }
            @media print {
              body { margin: 0; }
              .no-print { display: none; }
            }
          </style>
        </head>
        <body>
          <h1>Reporte ${getReportTitle()}</h1>
          
          <div class="header-info">
            <strong>Período:</strong> ${getDateRangeText()}<br>
            <strong>Fecha de generación:</strong> ${new Date().toLocaleDateString('es-PE')} - ${new Date().toLocaleTimeString('es-PE')}<br>
            <strong>Sistema:</strong> HelpMED - Plataforma de Emergencias Médicas
          </div>
          
          <div class="no-print" style="text-align: center; margin: 20px 0;">
            <button onclick="window.print()" style="background: #d32f2f; color: white; border: none; padding: 10px 20px; border-radius: 5px; cursor: pointer;">
${labels.printButton}
            </button>
            <button onclick="window.close()" style="background: #666; color: white; border: none; padding: 10px 20px; border-radius: 5px; cursor: pointer; margin-left: 10px;">
              ❌ Cerrar
            </button>
          </div>
          
          ${reportData.content}
        </body>
      </html>
    `
    
    printWindow.document.write(htmlContent)
    printWindow.document.close()

    Swal.fire({
      title: labels.exportMessages.pdfReady.title,
      text: labels.exportMessages.pdfReady.text,
      icon: 'info',
      timer: 3000,
      showConfirmButton: false
    })
  }

  const generateExcelReport = () => {
    // Obtener datos según el reporte seleccionado
    const reportData = getReportData()
    
    // Crear contenido HTML que Excel puede interpretar
    let htmlContent = `
      <html>
        <head>
          <meta charset="utf-8">
          <style>
            table { border-collapse: collapse; width: 100%; }
            th, td { border: 1px solid #000; padding: 8px; text-align: left; }
            th { background-color: #4CAF50; color: white; font-weight: bold; }
            .header { background-color: #2196F3; color: white; font-weight: bold; }
            .metric { background-color: #f9f9f9; }
          </style>
        </head>
        <body>
          <h1>Reporte ${getReportTitle()} - HelpMED</h1>
          <p><strong>Período:</strong> ${getDateRangeText()}</p>
          <p><strong>Fecha:</strong> ${new Date().toLocaleDateString('es-PE')} ${new Date().toLocaleTimeString('es-PE')}</p>
          
          ${reportData.tables}
        </body>
      </html>
    `

    // Crear blob y descargar como archivo Excel
    const blob = new Blob([htmlContent], { type: 'application/vnd.ms-excel' })
    const url = URL.createObjectURL(blob)
    const a = document.createElement('a')
    a.href = url
    a.download = `Reporte_${selectedReport}_${new Date().toISOString().split('T')[0]}.xls`
    a.click()
    URL.revokeObjectURL(url)

    Swal.fire({
      title: labels.exportMessages.excelGenerated.title,
      text: labels.exportMessages.excelGenerated.text,
      icon: 'success',
      timer: 2000,
      showConfirmButton: false
    })
  }

  const getReportTitle = () => {
    return labels.reportTitles[selectedReport] || labels.reportTitles.default
  }

  const getDateRangeText = () => {
    if (startDate && endDate) {
      return `${new Date(startDate).toLocaleDateString('es-PE')} - ${new Date(endDate).toLocaleDateString('es-PE')}`
    }
    return labels.dateRange.selectPeriod
  }

  const getReportData = () => {
    // Mock data - En producción estos datos vendrían de la API
    const baseData = {
      overview: {
        metrics: [
          { label: labels.overview.metrics.totalUsers, value: '2,847', change: '+12%' },
          { label: labels.overview.metrics.completedServices, value: '1,234', change: '+8%' },
          { label: labels.overview.metrics.totalRevenue, value: 'S/ 45,680', change: '+15%' },
          { label: labels.overview.metrics.avgResponseTime, value: '8.5 min', change: '-5%' }
        ],
        content: `
          <h2>${labels.overview.mainMetrics}</h2>
          <div>
            <div class="metric-card">
              <div class="metric-value">2,847</div>
              <div class="metric-label">${labels.overview.metrics.totalUsers} (+12%)</div>
            </div>
            <div class="metric-card">
              <div class="metric-value">1,234</div>
              <div class="metric-label">${labels.overview.metrics.completedServices} (+8%)</div>
            </div>
            <div class="metric-card">
              <div class="metric-value">S/ 45,680</div>
              <div class="metric-label">${labels.overview.metrics.totalRevenue} (+15%)</div>
            </div>
            <div class="metric-card">
              <div class="metric-value">8.5 min</div>
              <div class="metric-label">${labels.overview.metrics.avgResponseTime} (-5%)</div>
            </div>
          </div>
          
          <h2>${labels.overview.userDistribution}</h2>
          <table>
            <tr><th>Plan</th><th>Usuarios</th><th>Porcentaje</th><th>Ingresos</th></tr>
            <tr><td>Plan Help</td><td>1,245</td><td>43.7%</td><td>S/ 15,680</td></tr>
            <tr><td>Plan Básico</td><td>892</td><td>31.3%</td><td>S/ 18,420</td></tr>
            <tr><td>Plan VIP</td><td>456</td><td>16.0%</td><td>S/ 8,960</td></tr>
            <tr><td>Plan Dorado</td><td>254</td><td>8.9%</td><td>S/ 2,620</td></tr>
          </table>
        `,
        tables: `
          <table>
            <tr class="header"><td colspan="4">Métricas Principales</td></tr>
            <tr><th>Métrica</th><th>Valor</th><th>Cambio</th><th>Período</th></tr>
            <tr><td>Total Usuarios</td><td>2,847</td><td>+12%</td><td>${getDateRangeText()}</td></tr>
            <tr><td>Servicios Completados</td><td>1,234</td><td>+8%</td><td>${getDateRangeText()}</td></tr>
            <tr><td>Ingresos Totales</td><td>S/ 45,680</td><td>+15%</td><td>${getDateRangeText()}</td></tr>
            <tr><td>Tiempo Promedio Respuesta</td><td>8.5 min</td><td>-5%</td><td>${getDateRangeText()}</td></tr>
          </table>
          
          <br>
          
          <table>
            <tr class="header"><td colspan="4">Distribución por Plan</td></tr>
            <tr><th>Plan</th><th>Usuarios</th><th>Porcentaje</th><th>Ingresos</th></tr>
            <tr><td>Plan Help</td><td>1,245</td><td>43.7%</td><td>S/ 15,680</td></tr>
            <tr><td>Plan Básico</td><td>892</td><td>31.3%</td><td>S/ 18,420</td></tr>
            <tr><td>Plan VIP</td><td>456</td><td>16.0%</td><td>S/ 8,960</td></tr>
            <tr><td>Plan Dorado</td><td>254</td><td>8.9%</td><td>S/ 2,620</td></tr>
          </table>
        `
      },
      users: {
        content: `
          <h2>${labels.users.userAnalysis}</h2>
          <div>
            <div class="metric-card">
              <div class="metric-value">2,847</div>
              <div class="metric-label">Total Usuarios</div>
            </div>
            <div class="metric-card">
              <div class="metric-value">156</div>
              <div class="metric-label">Nuevos Usuarios</div>
            </div>
            <div class="metric-card">
              <div class="metric-value">2,691</div>
              <div class="metric-label">Usuarios Activos</div>
            </div>
          </div>
          
          <h2>${labels.users.usersByType}</h2>
          <table>
            <tr><th>Tipo</th><th>Cantidad</th><th>Porcentaje</th><th>Estado</th></tr>
            <tr><td>Familiares</td><td>2,156</td><td>75.7%</td><td class="status-active">Activo</td></tr>
            <tr><td>Corporativos</td><td>468</td><td>16.4%</td><td class="status-active">Activo</td></tr>
            <tr><td>Externos</td><td>223</td><td>7.8%</td><td class="status-active">Activo</td></tr>
          </table>
        `,
        tables: `
          <table>
            <tr class="header"><td colspan="4">${labels.users.userAnalysis}</td></tr>
            <tr><th>Tipo</th><th>Cantidad</th><th>Porcentaje</th><th>Estado</th></tr>
            <tr><td>Familiares</td><td>2,156</td><td>75.7%</td><td>Activo</td></tr>
            <tr><td>Corporativos</td><td>468</td><td>16.4%</td><td>Activo</td></tr>
            <tr><td>Externos</td><td>223</td><td>7.8%</td><td>Activo</td></tr>
          </table>
        `
      },
      services: {
        content: `
          <h2>${labels.services.serviceAnalysis}</h2>
          <div>
            <div class="metric-card">
              <div class="metric-value">1,234</div>
              <div class="metric-label">Total Servicios</div>
            </div>
            <div class="metric-card">
              <div class="metric-value">1,156</div>
              <div class="metric-label">Completados</div>
            </div>
            <div class="metric-card">
              <div class="metric-value">78</div>
              <div class="metric-label">En Proceso</div>
            </div>
          </div>
          
          <h2>${labels.services.servicesByType}</h2>
          <table>
            <tr><th>Tipo de Servicio</th><th>Cantidad</th><th>Tiempo Promedio</th><th>Satisfacción</th></tr>
            <tr><td>Emergencias</td><td>567</td><td>7.2 min</td><td>4.8/5</td></tr>
            <tr><td>Urgencias</td><td>445</td><td>12.4 min</td><td>4.6/5</td></tr>
            <tr><td>Médico a Domicilio</td><td>156</td><td>25.8 min</td><td>4.9/5</td></tr>
            <tr><td>Traslados</td><td>66</td><td>18.6 min</td><td>4.7/5</td></tr>
          </table>
        `,
        tables: `
          <table>
            <tr class="header"><td colspan="4">${labels.services.serviceAnalysis}</td></tr>
            <tr><th>Tipo de Servicio</th><th>Cantidad</th><th>Tiempo Promedio</th><th>Satisfacción</th></tr>
            <tr><td>Emergencias</td><td>567</td><td>7.2 min</td><td>4.8/5</td></tr>
            <tr><td>Urgencias</td><td>445</td><td>12.4 min</td><td>4.6/5</td></tr>
            <tr><td>Médico a Domicilio</td><td>156</td><td>25.8 min</td><td>4.9/5</td></tr>
            <tr><td>Traslados</td><td>66</td><td>18.6 min</td><td>4.7/5</td></tr>
          </table>
        `
      }
    }
    
    return baseData[selectedReport] || baseData.overview
  }

  const renderReportContent = () => {
    const dateRange = { startDate, endDate }
    
    switch (selectedReport) {
      case 'overview':
        return <OverviewReport dateRange={dateRange} />
      case 'users':
        return <UsersReport dateRange={dateRange} filterType={filterType} />
      case 'services':
        return <ServicesReport dateRange={dateRange} />
      case 'performance':
        return <PerformanceReport dateRange={dateRange} />
      case 'geography':
        return <GeographyReport dateRange={dateRange} />
      case 'finanzas':
        return <RevenueManagement />
      case 'surveys':
        return <SurveysReport dateRange={dateRange} />
      default:
        return <OverviewReport dateRange={dateRange} revenueSummary={revenueSummary} />
    }
  }

  return (
    <div className="space-y-6">
      {/* Header y Controles */}
      <div className="bg-white rounded-xl shadow-medium p-4 sm:p-6">
        <div className="flex flex-col space-y-4 sm:space-y-0 sm:flex-row sm:items-center sm:justify-between mb-6">
          <h1 className="text-xl sm:text-2xl font-bold text-gray-800">{labels.header.title}</h1>
          <div className="flex flex-col space-y-3 sm:space-y-0 sm:flex-row sm:items-end sm:space-x-3">
            <div className="flex flex-col sm:flex-row sm:items-end space-y-2 sm:space-y-0 sm:space-x-3">
              <div className="flex flex-col">
                <label className="text-xs text-gray-600 mb-1">{labels.dateFilters.startDateLabel}</label>
                <input
                  type="date"
                  value={startDate}
                  onChange={(e) => setStartDate(e.target.value)}
                  className="border border-gray-300 rounded-lg px-3 py-2 text-sm w-full sm:w-auto"
                />
              </div>
              <div className="flex flex-col">
                <label className="text-xs text-gray-600 mb-1">{labels.dateFilters.endDateLabel}</label>
                <input
                  type="date"
                  value={endDate}
                  onChange={(e) => setEndDate(e.target.value)}
                  min={startDate}
                  className="border border-gray-300 rounded-lg px-3 py-2 text-sm w-full sm:w-auto"
                />
              </div>
              <button
                onClick={() => {
                  const today = new Date()
                  const thirtyDaysAgo = new Date(today.getTime() - 30 * 24 * 60 * 60 * 1000)
                  setStartDate(thirtyDaysAgo.toISOString().split('T')[0])
                  setEndDate(today.toISOString().split('T')[0])
                }}
                className="bg-blue-600 hover:bg-blue-700 text-white px-3 py-2 rounded-lg text-sm transition-colors whitespace-nowrap"
              >
                {labels.dateFilters.last30Days}
              </button>
            </div>
            
            <div className="flex space-x-2">
              <button
                onClick={() => handleExportReport('pdf')}
                className="bg-red-600 hover:bg-red-700 text-white px-3 sm:px-4 py-2 rounded-lg transition-colors text-sm flex items-center justify-center flex-1 sm:flex-none"
              >
                <i className="fas fa-file-pdf mr-1 sm:mr-2"></i>{labels.exportButtons.pdf}
              </button>
              <button
                onClick={() => handleExportReport('excel')}
                className="bg-green-600 hover:bg-green-700 text-white px-3 sm:px-4 py-2 rounded-lg transition-colors text-sm flex items-center justify-center flex-1 sm:flex-none"
              >
                <i className="fas fa-file-excel mr-1 sm:mr-2"></i>{labels.exportButtons.excel}
              </button>
            </div>
          </div>
        </div>

        {/* Navigation Tabs */}
        <div className="flex space-x-1 bg-gray-100 rounded-lg p-1 overflow-x-auto scrollbar-hide">
          {labels.tabs.map((tab) => (
            <button
              key={tab.id}
              onClick={() => setSelectedReport(tab.id)}
              className={`flex flex-col sm:flex-row items-center sm:space-x-2 px-2 sm:px-4 py-2 rounded-lg font-medium text-xs sm:text-sm transition-colors whitespace-nowrap ${
                selectedReport === tab.id
                  ? 'bg-white text-blue-600 shadow-sm'
                  : 'text-gray-600 hover:text-gray-800'
              }`}
            >
              <i className={`${tab.icon} text-sm mb-1 sm:mb-0`}></i>
              <span className="hidden sm:inline">{tab.label}</span>
              <span className="sm:hidden text-xs">{tab.short}</span>
            </button>
          ))}
        </div>
      </div>

      {/* Contenido del Reporte */}
      {renderReportContent()}
    </div>
  )
}

// Componentes de Reportes Específicos
const OverviewReport = ({ dateRange, revenueSummary }) => {
  const { allUsers, transactions, surveyResponses, activeEmergencies } = useAppStore()
  const [metrics, setMetrics] = useState({
    totalUsers: 0,
    revenue: 0,
    completedServices: 0,
    satisfaction: 0,
    activeEmergencies: 0,
    utilizationRate: 0
  })
  
  // ✅ MÉTRICAS CALCULABLES DINÁMICAMENTE - Actualizan en tiempo real
  useEffect(() => {
    const calculateMetrics = () => {
      // Total de usuarios real
      const totalUsers = Object.values(allUsers).reduce((sum, users) => sum + (users?.length || 0), 0)
      
      // Ingresos reales del store
      const revenue = revenueSummary?.totalRevenue || 0
      
      // Servicios completados (transacciones completadas)
      const completedServices = transactions?.filter(t => t.status === 'COMPLETED').length || 0
      
      // Satisfacción real desde encuestas (promedio de estrellas)
      const satisfaction = calculateSatisfactionRating(surveyResponses || [])
      
      // Emergencias activas reales
      const currentActiveEmergencies = activeEmergencies?.length || 0
      
      // Análisis de utilización de servicios
      const serviceUtilization = calculateServiceUtilization(allUsers.familiar || [], allUsers.corporativo || [])
      
      return {
        totalUsers,
        revenue,
        completedServices,
        satisfaction,
        activeEmergencies: currentActiveEmergencies,
        utilizationRate: serviceUtilization.utilizationRate
      }
    }
    
    setMetrics(calculateMetrics())
  }, [allUsers, transactions, surveyResponses, activeEmergencies, revenueSummary])

  return (
    <div className="space-y-6">
      {/* KPIs Principales */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        <KPICard
          title={labels.cards.totalUsers}
          value={metrics.totalUsers.toLocaleString()}
          change=""
          icon="fas fa-users"
          color="blue"
        />
        <KPICard
          title={labels.cards.activeEmergencies}
          value={metrics.activeEmergencies.toString()}
          change=""
          icon="fas fa-exclamation-triangle"
          color="red"
        />
        <KPICard
          title={labels.cards.totalRevenue}
          value={`S/ ${metrics.revenue.toLocaleString()}`}
          change=""
          icon="fas fa-dollar-sign"
          color="purple"
        />
        <KPICard
          title={labels.cards.clientSatisfaction}
          value={metrics.satisfaction > 0 ? `${metrics.satisfaction} ⭐` : 'Sin datos'}
          change=""
          icon="fas fa-star"
          color="yellow"
        />
      </div>

      {/* Análisis de Usuarios */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-4 sm:gap-6">
        <UserDistributionChart allUsers={allUsers} />
        <ServiceUtilizationChart utilization={metrics.utilizationRate} />
      </div>

      {/* Tabla de Resumen */}
      <SummaryTable dateRange={dateRange} />
    </div>
  )
}

const UsersReport = ({ dateRange, filterType }) => {
  const { allUsers } = useAppStore()
  const [userStats, setUserStats] = useState({})

  // ✅ CALCULAR ESTADÍSTICAS REALES DE USUARIOS DINÁMICAMENTE (sin ambulancias - están en resumen general)
  useEffect(() => {
    const calculateUserStats = () => {
      const distribution = calculateUserDistribution(allUsers, false) // Sin ambulancias
      const totalUsers = Object.values(distribution).reduce((sum, count) => sum + count, 0)
      
      const stats = {}
      Object.entries(distribution).forEach(([type, count]) => {
        if (count > 0 && type !== 'ambulancia') { // Excluir ambulancias explícitamente
          stats[type] = {
            count,
            percentage: totalUsers > 0 ? Math.round((count / totalUsers) * 100) : 0,
            growth: '' // Sin datos históricos para calcular crecimiento real
          }
        }
      })
      
      return stats
    }
    
    setUserStats(calculateUserStats())
  }, [allUsers])

  return (
    <div className="space-y-6">
      {/* Filtros adicionales */}
      <div className="bg-white rounded-xl shadow-medium p-6">
        <div className="flex items-center space-x-4 mb-4">
          <h3 className="text-lg font-bold text-gray-800">{labels.userFilters.title}</h3>
          <select
            value={filterType}
            onChange={(e) => setFilterType(e.target.value)}
            className="border border-gray-300 rounded-lg px-3 py-2"
          >
            <option value="all">Todos los tipos</option>
            <option value="familiar">Solo Familiares</option>
            <option value="corporativo">Solo Corporativos</option>
          </select>
        </div>

        {/* Distribución por tipo */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
          {Object.entries(userStats).map(([type, stats]) => (
            <UserTypeCard key={type} type={type} stats={stats} />
          ))}
        </div>
      </div>

      {/* Análisis detallado */}
      <div className="grid grid-cols-1 gap-6">
        <UserRegistrationChart dateRange={dateRange} />
      </div>

      {/* Tabla de usuarios activos */}
      <ActiveUsersTable dateRange={dateRange} filterType={filterType} />
    </div>
  )
}

const ServicesReport = ({ dateRange }) => {
  const { allUsers, transactions, activeEmergencies, emergencyHistory } = useAppStore()
  const [serviceMetrics, setServiceMetrics] = useState({})

  // ✅ CALCULAR MÉTRICAS DE SERVICIOS REALES DINÁMICAMENTE
  useEffect(() => {
    const calculateServiceMetrics = () => {
      const metrics = {
        emergencias: { total: 0, completed: 0, inProgress: 0 },
        domicilio: { total: 0, completed: 0, inProgress: 0 },
        urgencias: { total: 0, completed: 0, inProgress: 0 },
        traslados: { total: 0, completed: 0, inProgress: 0 }
      }

      // Contar servicios usados desde todos los usuarios
      if (allUsers.familiar) {
        allUsers.familiar.forEach(user => {
          if (user.service_usage?.current_period?.breakdown) {
            const breakdown = user.service_usage.current_period.breakdown
            Object.entries(breakdown).forEach(([serviceType, service]) => {
              if (typeof service === 'object' && service.used) {
                const used = service.used || 0
                switch (serviceType) {
                  case 'EMERGENCIA':
                    metrics.emergencias.completed += used
                    metrics.emergencias.total += used
                    break
                  case 'MEDICO_DOMICILIO':
                    metrics.domicilio.completed += used
                    metrics.domicilio.total += used
                    break
                  case 'URGENCIA':
                    metrics.urgencias.completed += used
                    metrics.urgencias.total += used
                    break
                  case 'TRASLADO_PROGRAMADO':
                    metrics.traslados.completed += used
                    metrics.traslados.total += used
                    break
                }
              }
            })
          } else if (user.plan?.subtype === 'HELP') {
            // Para planes HELP, contamos servicios generales como emergencias
            const total = user.plan.total_services || 10
            const remaining = user.service_usage?.current_period?.remaining_services || 0
            const used = total - remaining
            metrics.emergencias.completed += used
            metrics.emergencias.total += used
          }
        })
      }

      // Contar servicios corporativos (zona protegida)
      if (allUsers.corporativo) {
        allUsers.corporativo.forEach(user => {
          const used = user.service_usage?.current_period?.used_services || 0
          metrics.emergencias.completed += used // Servicios corporativos son principalmente emergencias
          metrics.emergencias.total += used
        })
      }

      // Emergencias activas (en progreso)
      const activeCount = activeEmergencies?.length || 0
      metrics.emergencias.inProgress = activeCount

      return metrics
    }

    setServiceMetrics(calculateServiceMetrics())
  }, [allUsers, activeEmergencies, emergencyHistory])

  return (
    <div className="space-y-6">
      {/* ✅ MÉTRICAS DE SERVICIOS REALES */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
        <ServiceMetricCard
          title={labels.cards.emergencies}
          total={serviceMetrics.emergencias?.total || 0}
          completed={serviceMetrics.emergencias?.completed || 0}
          inProgress={serviceMetrics.emergencias?.inProgress || 0}
          icon="fas fa-ambulance"
          color="red"
        />
        <ServiceMetricCard
          title={labels.cards.homeService}
          total={serviceMetrics.domicilio?.total || 0}
          completed={serviceMetrics.domicilio?.completed || 0}
          inProgress={serviceMetrics.domicilio?.inProgress || 0}
          icon="fas fa-user-md"
          color="blue"
        />
        <ServiceMetricCard
          title={labels.cards.urgencies}
          total={serviceMetrics.urgencias?.total || 0}
          completed={serviceMetrics.urgencias?.completed || 0}
          inProgress={serviceMetrics.urgencias?.inProgress || 0}
          icon="fas fa-heartbeat"
          color="orange"
        />
        <ServiceMetricCard
          title={labels.cards.transfers}
          total={serviceMetrics.traslados?.total || 0}
          completed={serviceMetrics.traslados?.completed || 0}
          inProgress={serviceMetrics.traslados?.inProgress || 0}
          icon="fas fa-route"
          color="green"
        />
      </div>

      {/* ✅ ANÁLISIS DE SERVICIOS REALES */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-4 sm:gap-6">
        <ServiceTypeDistributionReal serviceMetrics={serviceMetrics} />
        <ServiceUtilizationByPlan allUsers={allUsers} />
      </div>

      {/* ✅ ANÁLISIS DE PLANES Y SERVICIOS */}
      <ServicesByPlanAnalysis allUsers={allUsers} />
    </div>
  )
}

// FinancialReport eliminado - funcionalidad fusionada con RevenueManagement

const PerformanceReport = ({ dateRange }) => {
  const { 
    allUsers, 
    surveyResponses, 
    ambulanceUsers, 
    activeEmergencies,
    emergencyHistory 
  } = useAppStore()

  // Calcular tiempo de respuesta promedio real
  const calculateAverageResponseTime = () => {
    // Simulación basada en emergencias completadas
    const completedEmergencies = activeEmergencies?.filter(e => e.status === 'completed') || []
    if (completedEmergencies.length === 0) return { value: '—', status: 'warning' }
    
    // Simular tiempos basados en tipo de emergencia
    const avgTime = completedEmergencies.reduce((sum, emergency) => {
      const baseTime = emergency.type === 'sos' ? 5 : emergency.type === 'medical' ? 8 : 12
      const randomVariation = (Math.random() - 0.5) * 4 // ±2 minutos
      return sum + baseTime + randomVariation
    }, 0) / completedEmergencies.length

    const roundedTime = Math.max(1, Math.round(avgTime * 10) / 10)
    const status = roundedTime <= 10 ? 'good' : roundedTime <= 15 ? 'warning' : 'critical'
    
    return { 
      value: `${roundedTime} min`, 
      status,
      count: completedEmergencies.length
    }
  }

  // Calcular satisfacción real desde encuestas
  const calculateSatisfactionRating = () => {
    if (!surveyResponses || surveyResponses.length === 0) {
      return { value: '—', status: 'warning', count: 0 }
    }
    
    const totalRating = surveyResponses.reduce((sum, response) => {
      return sum + parseFloat(response.average || 0)
    }, 0)
    
    const avgRating = (totalRating / surveyResponses.length)
    const percentage = Math.round((avgRating / 5) * 100)
    const status = percentage >= 90 ? 'excellent' : percentage >= 80 ? 'good' : percentage >= 70 ? 'warning' : 'critical'
    
    return { 
      value: `${percentage}%`, 
      status,
      count: surveyResponses.length,
      stars: avgRating.toFixed(1)
    }
  }

  // Calcular utilización de unidades
  const calculateUnitUtilization = () => {
    if (!ambulanceUsers || ambulanceUsers.length === 0) {
      return { value: '—', status: 'warning' }
    }
    
    const totalUnits = ambulanceUsers.length
    const activeUnits = ambulanceUsers.filter(unit => 
      unit.currentStatus === 'en_route' || 
      unit.currentStatus === 'busy' || 
      unit.currentStatus === 'available'
    ).length
    const busyUnits = ambulanceUsers.filter(unit => 
      unit.currentStatus === 'en_route' || 
      unit.currentStatus === 'busy'
    ).length
    
    const utilization = totalUnits > 0 ? Math.round((busyUnits / totalUnits) * 100) : 0
    const availability = totalUnits > 0 ? Math.round((activeUnits / totalUnits) * 100) : 0
    const status = availability >= 95 ? 'excellent' : availability >= 85 ? 'good' : availability >= 70 ? 'warning' : 'critical'
    
    return { 
      value: `${availability}%`, 
      status,
      utilization,
      activeUnits,
      totalUnits
    }
  }


  const responseTime = calculateAverageResponseTime()
  const satisfaction = calculateSatisfactionRating()
  const unitUtilization = calculateUnitUtilization()

  return (
    <div className="space-y-6">
      {/* Métricas de rendimiento */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 sm:gap-6">
        <PerformanceMetric
          title={labels.performance.responseTime}
          value={responseTime.value}
          target="< 10 min"
          status={responseTime.status}
          subtitle={responseTime.count ? `Basado en ${responseTime.count} servicios` : 'Sin datos disponibles'}
        />
        <PerformanceMetric
          title={labels.performance.unitAvailability}
          value={unitUtilization.value}
          target="> 90%"
          status={unitUtilization.status}
          subtitle={`${unitUtilization.activeUnits}/${unitUtilization.totalUnits} unidades activas`}
        />
        <PerformanceMetric
          title={labels.performance.satisfaction}
          value={satisfaction.value}
          target="> 90%"
          status={satisfaction.status}
          subtitle={satisfaction.count ? `${satisfaction.stars}⭐ (${satisfaction.count} encuestas)` : 'Sin encuestas disponibles'}
        />
      </div>

      {/* Análisis de performance */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-4 sm:gap-6">
        <ResponseTimeAnalysis 
          dateRange={dateRange} 
          responseTime={responseTime}
          activeEmergencies={activeEmergencies}
        />
        <UnitUtilizationChart 
          dateRange={dateRange} 
          ambulanceUsers={ambulanceUsers}
          utilization={unitUtilization}
        />
      </div>

      {/* Alertas de performance */}
      <PerformanceAlerts 
        responseTime={responseTime}
        satisfaction={satisfaction}
        unitUtilization={unitUtilization}
      />
    </div>
  )
}

const GeographyReport = ({ dateRange }) => {
  const { allUsers, activeEmergencies, ambulanceUsers } = useAppStore()
  const [selectedDistrict, setSelectedDistrict] = useState(null)
  
  // Calcular KPIs principales para el dashboard
  const calculateKPIs = () => {
    const totalUsers = [
      ...(allUsers?.familiar || []),
      ...(allUsers?.corporativo || []),
      ...(allUsers?.externo || [])
    ].length
    
    const completedEmergencies = activeEmergencies?.filter(e => e.status === 'completed') || []
    const averageResponseTime = completedEmergencies.length > 0
      ? Math.round(completedEmergencies.reduce((sum, e) => sum + (e.responseTimeMinutes || 0), 0) / completedEmergencies.length)
      : 0
    
    const activeUnits = ambulanceUsers?.filter(u => u.status === 'active').length || 0
    const availableUnits = ambulanceUsers?.filter(u => u.currentStatus === 'available').length || 0
    const coveragePercentage = activeUnits > 0 ? Math.round((availableUnits / activeUnits) * 100) : 0
    
    return {
      totalUsers,
      totalEmergencies: completedEmergencies.length,
      averageResponseTime,
      coveragePercentage,
      activeUnits,
      availableUnits
    }
  }
  
  const kpis = calculateKPIs()
  
  return (
    <div className="space-y-6">
      {/* Header con contexto y navegación */}
      <div className="bg-gradient-to-r from-blue-600 to-purple-600 rounded-xl p-6 text-white">
        <div className="flex items-center justify-between">
          <div>
            <h2 className="text-2xl font-bold mb-2">{labels.geography.geographicAnalysis}</h2>
            <p className="text-blue-100 text-sm">
              Distribución de servicios y cobertura por zonas de Lima Metropolitana
            </p>
          </div>
          <div className="flex items-center space-x-2">
            <i className="fas fa-map-marked-alt text-3xl text-blue-200"></i>
            <div className="text-right">
              <div className="text-2xl font-bold">{kpis.totalUsers.toLocaleString()}</div>
              <div className="text-sm text-blue-200">Usuarios Totales</div>
            </div>
          </div>
        </div>
      </div>
      
      {/* KPIs Dashboard */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
        <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-4">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-gray-600 font-medium">Emergencias</p>
              <p className="text-2xl font-bold text-gray-900">{kpis.totalEmergencies}</p>
            </div>
            <div className="w-12 h-12 bg-red-100 rounded-lg flex items-center justify-center">
              <i className="fas fa-ambulance text-red-600 text-xl"></i>
            </div>
          </div>
          <div className="mt-2">
            <span className="text-sm text-green-600 font-medium">
              ↑ 12% vs mes anterior
            </span>
          </div>
        </div>
        
        <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-4">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-gray-600 font-medium">Tiempo Promedio</p>
              <p className="text-2xl font-bold text-gray-900">{kpis.averageResponseTime}min</p>
            </div>
            <div className="w-12 h-12 bg-yellow-100 rounded-lg flex items-center justify-center">
              <i className="fas fa-clock text-yellow-600 text-xl"></i>
            </div>
          </div>
          <div className="mt-2">
            <span className={`text-sm font-medium ${
              kpis.averageResponseTime <= 8 ? 'text-green-600' : 'text-red-600'
            }`}>
              {kpis.averageResponseTime <= 8 ? '✓ Excelente' : '⚠ Mejorable'}
            </span>
          </div>
        </div>
        
        <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-4">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-gray-600 font-medium">Cobertura</p>
              <p className="text-2xl font-bold text-gray-900">{kpis.coveragePercentage}%</p>
            </div>
            <div className="w-12 h-12 bg-green-100 rounded-lg flex items-center justify-center">
              <i className="fas fa-shield-alt text-green-600 text-xl"></i>
            </div>
          </div>
          <div className="mt-2">
            <span className="text-sm text-gray-600">
              {kpis.availableUnits}/{kpis.activeUnits} unidades
            </span>
          </div>
        </div>
        
        <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-4">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-gray-600 font-medium">Zonas Cubiertas</p>
              <p className="text-2xl font-bold text-gray-900">9</p>
            </div>
            <div className="w-12 h-12 bg-purple-100 rounded-lg flex items-center justify-center">
              <i className="fas fa-map text-purple-600 text-xl"></i>
            </div>
          </div>
          <div className="mt-2">
            <span className="text-sm text-green-600 font-medium">
              100% Lima Metro
            </span>
          </div>
        </div>
      </div>
      
      
      {/* Contenido unificado de geografía */}
      <div className="space-y-6">
        {/* Resumen ejecutivo */}
        <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
          <div className="flex items-center space-x-3 mb-4">
            <div className="w-10 h-10 bg-blue-100 rounded-lg flex items-center justify-center">
              <i className="fas fa-chart-line text-blue-600"></i>
            </div>
            <div>
              <h3 className="text-lg font-semibold text-gray-900">{labels.geography.executiveSummary}</h3>
              <p className="text-sm text-gray-600">Principales métricas y tendencias geográficas</p>
            </div>
          </div>
          
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 sm:gap-6">
            <div className="text-center p-3 sm:p-4 bg-gradient-to-b from-green-50 to-green-100 rounded-lg border border-green-200">
              <i className="fas fa-trophy text-green-600 text-xl sm:text-2xl mb-2"></i>
              <h4 className="font-semibold text-green-800 text-sm sm:text-base">{labels.geography.leaderDistrict}</h4>
              <p className="text-xs sm:text-sm text-green-700">Surco con {Math.floor(kpis.totalUsers * 0.18)} usuarios</p>
              <p className="text-xs text-green-600 mt-1">18% del total</p>
            </div>
            
            <div className="text-center p-3 sm:p-4 bg-gradient-to-b from-blue-50 to-blue-100 rounded-lg border border-blue-200">
              <i className="fas fa-zap text-blue-600 text-xl sm:text-2xl mb-2"></i>
              <h4 className="font-semibold text-blue-800 text-sm sm:text-base">{labels.geography.fastestResponse}</h4>
              <p className="text-xs sm:text-sm text-blue-700">Miraflores: 7 min promedio</p>
              <p className="text-xs text-blue-600 mt-1">25% bajo objetivo</p>
            </div>
            
            <div className="text-center p-3 sm:p-4 bg-gradient-to-b from-purple-50 to-purple-100 rounded-lg border border-purple-200">
              <i className="fas fa-bullseye text-purple-600 text-xl sm:text-2xl mb-2"></i>
              <h4 className="font-semibold text-purple-800 text-sm sm:text-base">{labels.geography.opportunity}</h4>
              <p className="text-xs sm:text-sm text-purple-700">Callao necesita refuerzo</p>
              <p className="text-xs text-purple-600 mt-1">18 min promedio</p>
            </div>
          </div>
        </div>
        
        {/* Análisis unificado por distrito */}
        <UnifiedDistrictAnalysis dateRange={dateRange} />
      </div>
      
    </div>
  )
}

// Componentes auxiliares
const KPICard = ({ title, value, change, icon, color }) => {
  const colorClasses = {
    blue: 'bg-blue-50 border-blue-200 text-blue-600',
    green: 'bg-green-50 border-green-200 text-green-600',
    purple: 'bg-purple-50 border-purple-200 text-purple-600',
    yellow: 'bg-yellow-50 border-yellow-200 text-yellow-600'
  }

  return (
    <div className={`border rounded-xl p-6 ${colorClasses[color]}`}>
      <div className="flex items-center justify-between mb-4">
        <i className={`${icon} text-2xl opacity-75`}></i>
        <span className="text-sm font-medium text-green-600">{change}</span>
      </div>
      <h3 className="text-2xl font-bold text-gray-800 mb-1">{value}</h3>
      <p className="text-sm opacity-75">{title}</p>
    </div>
  )
}

const ServicesTrendChart = ({ dateRange }) => {
  // Datos mock para los últimos 6 meses
  const servicesData = {
    last30days: [
      { period: 'Hace 30 días', emergencias: 45, urgencias: 32, domicilio: 28, traslados: 12 },
      { period: 'Hace 25 días', emergencias: 52, urgencias: 38, domicilio: 31, traslados: 15 },
      { period: 'Hace 20 días', emergencias: 48, urgencias: 35, domicilio: 29, traslados: 14 },
      { period: 'Hace 15 días', emergencias: 58, urgencias: 42, domicilio: 35, traslados: 18 },
      { period: 'Hace 10 días', emergencias: 61, urgencias: 45, domicilio: 38, traslados: 20 },
      { period: 'Hace 5 días', emergencias: 65, urgencias: 48, domicilio: 41, traslados: 22 },
      { period: 'Hoy', emergencias: 70, urgencias: 52, domicilio: 45, traslados: 25 }
    ],
    last3months: [
      { period: 'Hace 3 meses', emergencias: 420, urgencias: 310, domicilio: 280, traslados: 95 },
      { period: 'Hace 2 meses', emergencias: 465, urgencias: 340, domicilio: 315, traslados: 110 },
      { period: 'Mes pasado', emergencias: 510, urgencias: 375, domicilio: 350, traslados: 125 },
      { period: 'Este mes', emergencias: 580, urgencias: 420, domicilio: 385, traslados: 145 }
    ]
  }
  
  const data = servicesData[dateRange] || servicesData.last30days
  const maxValue = Math.max(...data.flatMap(d => [d.emergencias, d.urgencias, d.domicilio, d.traslados]))
  
  return (
    <div className="bg-white rounded-xl shadow-medium p-6">
      <div className="flex items-center justify-between mb-4">
        <h3 className="text-lg font-bold text-gray-800">{labels.performance.serviceTrends}</h3>
        <div className="flex items-center space-x-4 text-xs">
          <div className="flex items-center space-x-1">
            <div className="w-3 h-3 bg-red-500 rounded-full"></div>
            <span>{labels.performance.serviceTypes.emergencies}</span>
          </div>
          <div className="flex items-center space-x-1">
            <div className="w-3 h-3 bg-yellow-500 rounded-full"></div>
            <span>{labels.performance.serviceTypes.urgencies}</span>
          </div>
          <div className="flex items-center space-x-1">
            <div className="w-3 h-3 bg-blue-500 rounded-full"></div>
            <span>{labels.performance.serviceTypes.home}</span>
          </div>
          <div className="flex items-center space-x-1">
            <div className="w-3 h-3 bg-green-500 rounded-full"></div>
            <span>{labels.performance.serviceTypes.transfers}</span>
          </div>
        </div>
      </div>
      
      <div className="h-80 relative mb-4">
        {/* Eje Y */}
        <div className="absolute left-0 top-0 bottom-8 w-8 flex flex-col justify-between text-xs text-gray-500">
          <span>{maxValue}</span>
          <span>{Math.round(maxValue * 0.75)}</span>
          <span>{Math.round(maxValue * 0.5)}</span>
          <span>{Math.round(maxValue * 0.25)}</span>
          <span>0</span>
        </div>
        
        {/* Área del gráfico */}
        <div className="ml-10 mr-4 h-full pb-8 relative">
          {/* Líneas de cuadrícula */}
          <div className="absolute inset-0 flex flex-col justify-between">
            {[...Array(5)].map((_, i) => (
              <div key={i} className="border-t border-gray-200 w-full"></div>
            ))}
          </div>
          
          {/* Datos del gráfico */}
          <div className="relative h-full flex items-end justify-between px-2">
            {data.map((point, index) => {
              const total = point.emergencias + point.urgencias + point.domicilio + point.traslados
              const totalHeight = Math.min((total / maxValue) * 240, 240) // Altura máxima 240px
              
              // Calcular alturas proporcionales dentro de la barra total
              const emergenciaHeight = (point.emergencias / total) * totalHeight
              const urgenciaHeight = (point.urgencias / total) * totalHeight
              const domicilioHeight = (point.domicilio / total) * totalHeight
              const trasladoHeight = (point.traslados / total) * totalHeight
              
              return (
                <div key={index} className="flex-1 flex flex-col items-center group relative">
                  {/* Barra apilada */}
                  <div className="relative w-12 flex flex-col-reverse" style={{ height: `${totalHeight}px` }}>
                    {/* Traslados (verde) - abajo */}
                    <div 
                      className="bg-green-500 w-full transition-opacity hover:opacity-80"
                      style={{ height: `${trasladoHeight}px` }}
                      title={`Traslados: ${point.traslados}`}
                    ></div>
                    {/* Domicilio (azul) */}
                    <div 
                      className="bg-blue-500 w-full transition-opacity hover:opacity-80"
                      style={{ height: `${domicilioHeight}px` }}
                      title={`Médico Domicilio: ${point.domicilio}`}
                    ></div>
                    {/* Urgencias (amarillo) */}
                    <div 
                      className="bg-yellow-500 w-full transition-opacity hover:opacity-80"
                      style={{ height: `${urgenciaHeight}px` }}
                      title={`Urgencias: ${point.urgencias}`}
                    ></div>
                    {/* Emergencias (rojo) - arriba */}
                    <div 
                      className="bg-red-500 w-full transition-opacity hover:opacity-80"
                      style={{ height: `${emergenciaHeight}px` }}
                      title={`Emergencias: ${point.emergencias}`}
                    ></div>
                  </div>
                  
                  {/* Valor total arriba de la barra */}
                  <div className="absolute -top-6 text-xs font-semibold text-gray-700">
                    {total}
                  </div>
                  
                  {/* Tooltip en hover */}
                  <div className="invisible group-hover:visible absolute -top-28 left-1/2 transform -translate-x-1/2 bg-gray-800 text-white p-3 rounded-lg text-xs whitespace-nowrap z-20 shadow-lg">
                    <div className="font-semibold mb-2 text-center">{point.period}</div>
                    <div className="space-y-1">
                      <div className="flex items-center justify-between">
                        <span className="flex items-center"><div className="w-2 h-2 bg-red-500 rounded mr-2"></div>Emergencias:</span>
                        <span className="font-semibold ml-2">{point.emergencias}</span>
                      </div>
                      <div className="flex items-center justify-between">
                        <span className="flex items-center"><div className="w-2 h-2 bg-yellow-500 rounded mr-2"></div>Urgencias:</span>
                        <span className="font-semibold ml-2">{point.urgencias}</span>
                      </div>
                      <div className="flex items-center justify-between">
                        <span className="flex items-center"><div className="w-2 h-2 bg-blue-500 rounded mr-2"></div>Domicilio:</span>
                        <span className="font-semibold ml-2">{point.domicilio}</span>
                      </div>
                      <div className="flex items-center justify-between">
                        <span className="flex items-center"><div className="w-2 h-2 bg-green-500 rounded mr-2"></div>Traslados:</span>
                        <span className="font-semibold ml-2">{point.traslados}</span>
                      </div>
                      <div className="border-t pt-1 mt-1 flex justify-between">
                        <span>Total:</span>
                        <span className="font-bold">{total}</span>
                      </div>
                    </div>
                  </div>
                </div>
              )
            })}
          </div>
          
          {/* Eje X */}
          <div className="absolute -bottom-8 left-0 right-0 flex justify-between text-xs text-gray-500 px-2">
            {data.map((point, index) => (
              <div key={index} className="text-center flex-1">
                <span className="block transform -rotate-45 origin-center">
                  {point.period.replace('Hace ', '').replace(' días', 'd').replace(' meses', 'm').replace('Este mes', 'Actual')}
                </span>
              </div>
            ))}
          </div>
        </div>
      </div>
      
      {/* Resumen */}
      <div className="mt-4 grid grid-cols-4 gap-4 pt-4 border-t">
        <div className="text-center">
          <div className="text-2xl font-bold text-red-600">{data[data.length - 1]?.emergencias || 0}</div>
          <div className="text-xs text-gray-500">Emergencias hoy</div>
        </div>
        <div className="text-center">
          <div className="text-2xl font-bold text-yellow-600">{data[data.length - 1]?.urgencias || 0}</div>
          <div className="text-xs text-gray-500">Urgencias hoy</div>
        </div>
        <div className="text-center">
          <div className="text-2xl font-bold text-blue-600">{data[data.length - 1]?.domicilio || 0}</div>
          <div className="text-xs text-gray-500">Domicilio hoy</div>
        </div>
        <div className="text-center">
          <div className="text-2xl font-bold text-green-600">{data[data.length - 1]?.traslados || 0}</div>
          <div className="text-xs text-gray-500">Traslados hoy</div>
        </div>
      </div>
    </div>
  )
}

const UserGrowthChart = ({ dateRange }) => {
  // Datos mock para crecimiento de usuarios
  const usersData = {
    last30days: [
      { period: 'Sem 1', familiar: 15, corporativo: 2, externo: 1, total: 18 },
      { period: 'Sem 2', familiar: 22, corporativo: 3, externo: 1, total: 26 },
      { period: 'Sem 3', familiar: 18, corporativo: 4, externo: 2, total: 24 },
      { period: 'Sem 4', familiar: 28, corporativo: 5, externo: 1, total: 34 }
    ],
    last3months: [
      { period: 'Hace 3m', familiar: 180, corporativo: 25, externo: 8, total: 213 },
      { period: 'Hace 2m', familiar: 205, corporativo: 32, externo: 12, total: 249 },
      { period: 'Mes pasado', familiar: 245, corporativo: 41, externo: 15, total: 301 },
      { period: 'Este mes', familiar: 285, corporativo: 48, externo: 18, total: 351 }
    ],
    lastyear: [
      { period: 'Ene', familiar: 45, corporativo: 5, externo: 2, total: 52 },
      { period: 'Feb', familiar: 52, corporativo: 8, externo: 3, total: 63 },
      { period: 'Mar', familiar: 48, corporativo: 12, externo: 4, total: 64 },
      { period: 'Abr', familiar: 65, corporativo: 15, externo: 5, total: 85 },
      { period: 'May', familiar: 72, corporativo: 18, externo: 6, total: 96 },
      { period: 'Jun', familiar: 68, corporativo: 22, externo: 7, total: 97 },
      { period: 'Jul', familiar: 85, corporativo: 28, externo: 8, total: 121 },
      { period: 'Ago', familiar: 92, corporativo: 35, externo: 10, total: 137 },
      { period: 'Sep', familiar: 88, corporativo: 42, externo: 12, total: 142 },
      { period: 'Oct', familiar: 105, corporativo: 48, externo: 15, total: 168 },
      { period: 'Nov', familiar: 115, corporativo: 52, externo: 18, total: 185 },
      { period: 'Dic', familiar: 125, corporativo: 58, externo: 22, total: 205 }
    ]
  }
  
  const data = usersData[dateRange] || usersData.last30days
  const maxValue = Math.max(...data.map(d => d.total))
  const totalUsers = data.reduce((sum, d) => sum + d.total, 0)
  const avgGrowth = data.length > 1 ? ((data[data.length - 1].total / data[0].total - 1) * 100).toFixed(1) : 0
  
  return (
    <div className="bg-white rounded-xl shadow-medium p-6">
      <div className="flex items-center justify-between mb-4">
        <h3 className="text-lg font-bold text-gray-800">Crecimiento de Usuarios</h3>
        <div className="flex items-center space-x-4 text-xs">
          <div className="flex items-center space-x-1">
            <div className="w-3 h-3 bg-blue-500 rounded-full"></div>
            <span>Familiar</span>
          </div>
          <div className="flex items-center space-x-1">
            <div className="w-3 h-3 bg-green-500 rounded-full"></div>
            <span>Corporativo</span>
          </div>
          <div className="flex items-center space-x-1">
            <div className="w-3 h-3 bg-purple-500 rounded-full"></div>
            <span>Externo</span>
          </div>
        </div>
      </div>
      
      <div className="h-80 relative mb-4">
        {/* Eje Y */}
        <div className="absolute left-0 top-0 bottom-8 w-8 flex flex-col justify-between text-xs text-gray-500">
          <span>{maxValue}</span>
          <span>{Math.round(maxValue * 0.75)}</span>
          <span>{Math.round(maxValue * 0.5)}</span>
          <span>{Math.round(maxValue * 0.25)}</span>
          <span>0</span>
        </div>
        
        {/* Área del gráfico */}
        <div className="ml-10 mr-4 h-full pb-8 relative">
          {/* Líneas de cuadrícula */}
          <div className="absolute inset-0 flex flex-col justify-between">
            {[...Array(5)].map((_, i) => (
              <div key={i} className="border-t border-gray-200 w-full"></div>
            ))}
          </div>
          
          {/* Gráfico de barras */}
          <div className="relative h-full flex items-end justify-between px-2">
            {data.map((point, index) => {
              const totalHeight = Math.min((point.total / maxValue) * 240, 240) // Altura máxima 240px
              
              // Calcular alturas proporcionales dentro de la barra total
              const familiarHeight = (point.familiar / point.total) * totalHeight
              const corporativoHeight = (point.corporativo / point.total) * totalHeight  
              const externoHeight = (point.externo / point.total) * totalHeight
              
              return (
                <div key={index} className="flex-1 flex flex-col items-center group relative">
                  <div className="relative w-14 flex flex-col-reverse" style={{ height: `${totalHeight}px` }}>
                    {/* Barra apilada de abajo hacia arriba */}
                    {/* Externo (morado) - abajo */}
                    <div 
                      className="bg-purple-500 w-full transition-opacity hover:opacity-80"
                      style={{ height: `${externoHeight}px` }}
                      title={`Externo: ${point.externo}`}
                    ></div>
                    {/* Corporativo (verde) - medio */}
                    <div 
                      className="bg-green-500 w-full transition-opacity hover:opacity-80"
                      style={{ height: `${corporativoHeight}px` }}
                      title={`Corporativo: ${point.corporativo}`}
                    ></div>
                    {/* Familiar (azul) - arriba */}
                    <div 
                      className="bg-blue-500 w-full transition-opacity hover:opacity-80"
                      style={{ height: `${familiarHeight}px` }}
                      title={`Familiar: ${point.familiar}`}
                    ></div>
                  </div>
                  
                  {/* Valor total encima de la barra */}
                  <div className="absolute -top-6 text-xs font-semibold text-gray-700">
                    {point.total}
                  </div>
                  
                  {/* Tooltip */}
                  <div className="invisible group-hover:visible absolute -top-32 left-1/2 transform -translate-x-1/2 bg-gray-800 text-white p-3 rounded-lg text-xs whitespace-nowrap z-20 shadow-lg">
                    <div className="font-semibold mb-2 text-center">{point.period}</div>
                    <div className="space-y-1">
                      <div className="flex items-center justify-between">
                        <span className="flex items-center"><div className="w-2 h-2 bg-blue-500 rounded mr-2"></div>Familiar:</span>
                        <span className="font-semibold ml-2">{point.familiar}</span>
                      </div>
                      <div className="flex items-center justify-between">
                        <span className="flex items-center"><div className="w-2 h-2 bg-green-500 rounded mr-2"></div>Corporativo:</span>
                        <span className="font-semibold ml-2">{point.corporativo}</span>
                      </div>
                      <div className="flex items-center justify-between">
                        <span className="flex items-center"><div className="w-2 h-2 bg-purple-500 rounded mr-2"></div>Externo:</span>
                        <span className="font-semibold ml-2">{point.externo}</span>
                      </div>
                      <div className="border-t pt-1 mt-1 flex justify-between">
                        <span>Total:</span>
                        <span className="font-bold">{point.total}</span>
                      </div>
                    </div>
                  </div>
                </div>
              )
            })}
          </div>
          
          {/* Línea de tendencia simplificada */}
          <div className="absolute inset-0 pointer-events-none">
            {data.map((point, index) => {
              if (index === data.length - 1) return null
              const currentHeight = (point.total / maxValue) * 240
              const nextHeight = (data[index + 1].total / maxValue) * 240
              const isGrowing = nextHeight > currentHeight
              
              return (
                <div
                  key={index}
                  className={`absolute w-1 ${isGrowing ? 'bg-green-400' : 'bg-red-400'} opacity-60`}
                  style={{
                    left: `${(index / (data.length - 1)) * 100}%`,
                    bottom: `${currentHeight}px`,
                    height: `${Math.abs(nextHeight - currentHeight)}px`
                  }}
                ></div>
              )
            })}
          </div>
          
          {/* Eje X */}
          <div className="absolute -bottom-8 left-0 right-0 flex justify-between text-xs text-gray-500 px-2">
            {data.map((point, index) => (
              <div key={index} className="text-center flex-1">
                <span className="block">
                  {point.period}
                </span>
              </div>
            ))}
          </div>
        </div>
      </div>
      
      {/* Estadísticas */}
      <div className="mt-4 grid grid-cols-3 gap-4 pt-4 border-t">
        <div className="text-center">
          <div className="text-2xl font-bold text-gray-800">{totalUsers.toLocaleString()}</div>
          <div className="text-xs text-gray-500">Total registrados</div>
        </div>
        <div className="text-center">
          <div className="text-2xl font-bold text-green-600">+{avgGrowth}%</div>
          <div className="text-xs text-gray-500">Crecimiento</div>
        </div>
        <div className="text-center">
          <div className="text-2xl font-bold text-blue-600">{data[data.length - 1]?.total || 0}</div>
          <div className="text-xs text-gray-500">Últimos registros</div>
        </div>
      </div>
    </div>
  )
}

const SummaryTable = ({ dateRange }) => {
  const { allUsers } = useAppStore()
  
  // Calcular datos reales por tipo de plan
  const planSummary = calculatePlanSummary(allUsers)
  
  return (
    <div className="bg-white rounded-xl shadow-medium p-6">
      <h3 className="text-lg font-bold text-gray-800 mb-4">Resumen por Tipo de Plan</h3>
      <div className="overflow-x-auto">
        <table className="w-full">
          <thead>
            <tr className="border-b">
              <th className="text-left py-3">Tipo de Plan</th>
              <th className="text-center py-3">Usuarios</th>
              <th className="text-center py-3">Servicios Usados</th>
              <th className="text-center py-3">Ingresos Anuales</th>
              <th className="text-center py-3">Utilización</th>
            </tr>
          </thead>
          <tbody>
            {planSummary.map((plan, index) => (
              <tr key={index} className={index < planSummary.length - 1 ? "border-b" : ""}>
                <td className="py-3 font-medium">{plan.type}</td>
                <td className="text-center py-3">{plan.users}</td>
                <td className="text-center py-3">{plan.servicesUsed.toLocaleString()}</td>
                <td className="text-center py-3">S/ {plan.revenue.toLocaleString()}</td>
                <td className="text-center py-3">
                  <span className={`px-2 py-1 rounded-full text-xs font-medium ${
                    plan.utilizationRate > 80 ? 'bg-red-100 text-red-800' :
                    plan.utilizationRate > 60 ? 'bg-yellow-100 text-yellow-800' :
                    'bg-green-100 text-green-800'
                  }`}>
                    {plan.utilizationRate}%
                  </span>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
      
      {planSummary.length === 0 && (
        <div className="text-center py-8 text-gray-500">
          <i className="fas fa-info-circle text-4xl mb-2"></i>
          <p>No hay datos de planes disponibles</p>
        </div>
      )}
    </div>
  )
}

// Componentes placeholder para los reportes específicos
const UserTypeCard = ({ type, stats }) => (
  <div className="bg-gray-50 rounded-lg p-4">
    <h4 className="font-medium text-gray-800 capitalize mb-2">{type}</h4>
    <div className="text-2xl font-bold text-gray-900">{stats.count}</div>
    <div className="flex justify-between items-center mt-2">
      <span className="text-sm text-gray-600">{stats.percentage}%</span>
      <span className="text-sm text-green-600">{stats.growth}</span>
    </div>
  </div>
)

const UserRegistrationChart = ({ dateRange }) => {
  const { allUsers, registrationRequests } = useAppStore()
  
  // ✅ ANÁLISIS ESPECIALIZADO DE ESTADO DE REGISTROS
  const calculateRegistrationAnalysis = () => {
    // Analizar estado de usuarios
    const usersByStatus = {
      active: 0,
      inactive: 0,
      pending: 0
    }
    
    // Contar usuarios activos/inactivos
    Object.values(allUsers).forEach(userGroup => {
      if (Array.isArray(userGroup)) {
        userGroup.forEach(user => {
          const status = user.plan?.status || user.status || 'active'
          if (status === 'active') {
            usersByStatus.active++
          } else {
            usersByStatus.inactive++
          }
        })
      }
    })
    
    // Contar solicitudes por estado
    const requestsByStatus = {
      pending: registrationRequests?.filter(req => req.status === 'pending').length || 0,
      approved: registrationRequests?.filter(req => req.status === 'approved').length || 0,
      rejected: registrationRequests?.filter(req => req.status === 'rejected').length || 0
    }
    
    // Análisis por tipo de plan solicitado
    const requestsByType = {
      familiar: registrationRequests?.filter(req => req.planType === 'familiar').length || 0,
      corporativo: registrationRequests?.filter(req => req.planType === 'corporativo').length || 0,
      externo: registrationRequests?.filter(req => req.planType === 'externo').length || 0
    }
    
    return {
      usersByStatus,
      requestsByStatus,
      requestsByType,
      totalUsers: usersByStatus.active + usersByStatus.inactive,
      totalRequests: requestsByStatus.pending + requestsByStatus.approved + requestsByStatus.rejected
    }
  }
  
  const analysis = calculateRegistrationAnalysis()
  
  return (
    <div className="bg-white rounded-xl shadow-medium p-6">
      <div className="flex items-center justify-between mb-6">
        <h3 className="text-lg font-bold text-gray-800">Análisis de Registros y Solicitudes</h3>
        <div className="text-sm text-gray-600">
          Estado actual del sistema
        </div>
      </div>
      
      <div className="space-y-8">
        {/* ✅ ESTADO DE USUARIOS REGISTRADOS */}
        <div>
          <h4 className="font-medium text-gray-800 mb-4">Estado de Usuarios Registrados</h4>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {/* Usuarios Activos */}
            <div className="bg-green-50 border border-green-200 rounded-lg p-4">
              <div className="flex items-center justify-between">
                <div>
                  <div className="text-2xl font-bold text-green-600">{analysis.usersByStatus.active}</div>
                  <div className="text-sm text-green-700">Usuarios Activos</div>
                </div>
                <div className="text-green-500">
                  <i className="fas fa-check-circle text-2xl"></i>
                </div>
              </div>
              <div className="mt-2 text-xs text-green-600">
                {analysis.totalUsers > 0 ? Math.round((analysis.usersByStatus.active / analysis.totalUsers) * 100) : 0}% del total
              </div>
            </div>
            
            {/* Usuarios Inactivos */}
            <div className="bg-gray-50 border border-gray-200 rounded-lg p-4">
              <div className="flex items-center justify-between">
                <div>
                  <div className="text-2xl font-bold text-gray-600">{analysis.usersByStatus.inactive}</div>
                  <div className="text-sm text-gray-700">Usuarios Inactivos</div>
                </div>
                <div className="text-gray-500">
                  <i className="fas fa-pause-circle text-2xl"></i>
                </div>
              </div>
              <div className="mt-2 text-xs text-gray-600">
                {analysis.totalUsers > 0 ? Math.round((analysis.usersByStatus.inactive / analysis.totalUsers) * 100) : 0}% del total
              </div>
            </div>
          </div>
        </div>
        
        {/* ✅ ESTADO DE SOLICITUDES DE REGISTRO */}
        <div>
          <h4 className="font-medium text-gray-800 mb-4">Estado de Solicitudes de Registro</h4>
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 sm:gap-4">
            {/* Pendientes */}
            <div className="bg-yellow-50 border border-yellow-200 rounded-lg p-3 sm:p-4">
              <div className="flex items-center justify-between">
                <div>
                  <div className="text-xl sm:text-2xl font-bold text-yellow-600">{analysis.requestsByStatus.pending}</div>
                  <div className="text-xs sm:text-sm text-yellow-700">Pendientes</div>
                </div>
                <div className="text-yellow-500">
                  <i className="fas fa-clock text-xl sm:text-2xl"></i>
                </div>
              </div>
              <div className="mt-2 text-xs text-yellow-600">
                Requieren revisión
              </div>
            </div>
            
            {/* Aprobadas */}
            <div className="bg-green-50 border border-green-200 rounded-lg p-3 sm:p-4">
              <div className="flex items-center justify-between">
                <div>
                  <div className="text-xl sm:text-2xl font-bold text-green-600">{analysis.requestsByStatus.approved}</div>
                  <div className="text-xs sm:text-sm text-green-700">Aprobadas</div>
                </div>
                <div className="text-green-500">
                  <i className="fas fa-check text-xl sm:text-2xl"></i>
                </div>
              </div>
              <div className="mt-2 text-xs text-green-600">
                Usuarios creados
              </div>
            </div>
            
            {/* Rechazadas */}
            <div className="bg-red-50 border border-red-200 rounded-lg p-4">
              <div className="flex items-center justify-between">
                <div>
                  <div className="text-2xl font-bold text-red-600">{analysis.requestsByStatus.rejected}</div>
                  <div className="text-sm text-red-700">Rechazadas</div>
                </div>
                <div className="text-red-500">
                  <i className="fas fa-times text-2xl"></i>
                </div>
              </div>
              <div className="mt-2 text-xs text-red-600">
                No procesadas
              </div>
            </div>
          </div>
        </div>
        
        {/* ✅ DISTRIBUCIÓN POR TIPO DE PLAN SOLICITADO */}
        <div>
          <h4 className="font-medium text-gray-800 mb-4">Solicitudes por Tipo de Plan</h4>
          <div className="space-y-3">
            {/* Planes Familiares */}
            <div className="flex items-center space-x-4">
              <div className="w-24 text-sm font-medium text-gray-700">Familiar</div>
              <div className="flex-1 relative">
                <div className="w-full bg-gray-200 rounded-full h-6">
                  <div 
                    className="h-6 rounded-full bg-blue-500 flex items-center justify-end px-2 transition-all duration-500"
                    style={{ 
                      width: `${analysis.totalRequests > 0 ? Math.max((analysis.requestsByType.familiar / analysis.totalRequests) * 100, 5) : 0}%` 
                    }}
                  >
                    <span className="text-white text-xs font-semibold">
                      {analysis.requestsByType.familiar}
                    </span>
                  </div>
                </div>
              </div>
              <div className="w-12 text-right text-sm font-semibold text-gray-600">
                {analysis.totalRequests > 0 ? Math.round((analysis.requestsByType.familiar / analysis.totalRequests) * 100) : 0}%
              </div>
            </div>
            
            {/* Planes Corporativos */}
            <div className="flex items-center space-x-4">
              <div className="w-24 text-sm font-medium text-gray-700">Corporativo</div>
              <div className="flex-1 relative">
                <div className="w-full bg-gray-200 rounded-full h-6">
                  <div 
                    className="h-6 rounded-full bg-green-500 flex items-center justify-end px-2 transition-all duration-500"
                    style={{ 
                      width: `${analysis.totalRequests > 0 ? Math.max((analysis.requestsByType.corporativo / analysis.totalRequests) * 100, 5) : 0}%` 
                    }}
                  >
                    <span className="text-white text-xs font-semibold">
                      {analysis.requestsByType.corporativo}
                    </span>
                  </div>
                </div>
              </div>
              <div className="w-12 text-right text-sm font-semibold text-gray-600">
                {analysis.totalRequests > 0 ? Math.round((analysis.requestsByType.corporativo / analysis.totalRequests) * 100) : 0}%
              </div>
            </div>
            
            {/* Planes Externos */}
            <div className="flex items-center space-x-4">
              <div className="w-24 text-sm font-medium text-gray-700">Externo</div>
              <div className="flex-1 relative">
                <div className="w-full bg-gray-200 rounded-full h-6">
                  <div 
                    className="h-6 rounded-full bg-purple-500 flex items-center justify-end px-2 transition-all duration-500"
                    style={{ 
                      width: `${analysis.totalRequests > 0 ? Math.max((analysis.requestsByType.externo / analysis.totalRequests) * 100, 5) : 0}%` 
                    }}
                  >
                    <span className="text-white text-xs font-semibold">
                      {analysis.requestsByType.externo}
                    </span>
                  </div>
                </div>
              </div>
              <div className="w-12 text-right text-sm font-semibold text-gray-600">
                {analysis.totalRequests > 0 ? Math.round((analysis.requestsByType.externo / analysis.totalRequests) * 100) : 0}%
              </div>
            </div>
          </div>
        </div>
        
        {/* ✅ ALERTAS Y RECOMENDACIONES */}
        {analysis.requestsByStatus.pending > 0 && (
          <div className="bg-amber-50 border-l-4 border-amber-400 rounded-r-lg p-4">
            <div className="flex items-center">
              <i className="fas fa-exclamation-triangle text-amber-600 mr-3"></i>
              <div>
                <h5 className="font-medium text-amber-800">Acción Requerida</h5>
                <p className="text-sm text-amber-700 mt-1">
                  Hay {analysis.requestsByStatus.pending} solicitud(es) de registro pendiente(s) que requieren revisión.
                </p>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  )
}

// UserActivityChart eliminado por solicitud del usuario

const ActiveUsersTable = ({ dateRange, filterType }) => {
  const { allUsers, transactions } = useAppStore()
  
  // ✅ CALCULAR USUARIOS MÁS ACTIVOS DESDE DATOS REALES
  const getActiveUsers = () => {
    let usersData = []
    
    // Analizar usuarios familiares
    if (allUsers.familiar && filterType !== 'corporativo') {
      allUsers.familiar.forEach(user => {
        const serviceUsage = calculateUserActivity(user, 'familiar')
        if (serviceUsage.totalUsed > 0 || filterType === 'all') {
          usersData.push({
            id: user.id,
            name: user.profile?.name || user.name || 'Usuario',
            type: 'Familiar',
            plan: user.plan?.name || user.plan?.subtype || 'Sin plan',
            servicesUsed: serviceUsage.totalUsed,
            servicesRemaining: serviceUsage.totalRemaining,
            utilizationRate: serviceUsage.utilizationRate,
            lastActivity: serviceUsage.lastActivity || 'Sin actividad',
            status: user.plan?.status || 'active',
            memberSince: user.profile?.memberSince || user.memberSince || new Date().toISOString()
          })
        }
      })
    }
    
    // Analizar usuarios corporativos
    if (allUsers.corporativo && filterType !== 'familiar') {
      allUsers.corporativo.forEach(user => {
        const serviceUsage = calculateUserActivity(user, 'corporativo')
        if (serviceUsage.totalUsed > 0 || filterType === 'all') {
          usersData.push({
            id: user.id,
            name: user.company?.name || user.profile?.name || 'Empresa',
            type: 'Corporativo',
            plan: 'Área Protegida',
            servicesUsed: serviceUsage.totalUsed,
            servicesRemaining: serviceUsage.totalRemaining,
            utilizationRate: serviceUsage.utilizationRate,
            lastActivity: serviceUsage.lastActivity || 'Sin actividad',
            status: user.plan?.status || 'active',
            memberSince: user.plan?.start_date || new Date().toISOString(),
            employees: user.company?.employees_count || 0
          })
        }
      })
    }
    
    // Ordenar por servicios usados (más activos primero)
    return usersData
      .sort((a, b) => b.servicesUsed - a.servicesUsed)
      .slice(0, 20) // Top 20 usuarios más activos
  }
  
  const activeUsers = getActiveUsers()
  
  return (
    <div className="bg-white rounded-xl shadow-medium p-6">
      <div className="flex items-center justify-between mb-4">
        <h3 className="text-lg font-bold text-gray-800">Usuarios Más Activos</h3>
        <div className="text-sm text-gray-600">
          Filtro: <span className="font-medium">{filterType === 'all' ? 'Todos' : filterType}</span>
        </div>
      </div>
      
      {activeUsers.length > 0 ? (
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead>
              <tr className="border-b bg-gray-50">
                <th className="text-left py-3 px-4 font-medium text-gray-700">Usuario</th>
                <th className="text-left py-3 px-4 font-medium text-gray-700">Tipo</th>
                <th className="text-left py-3 px-4 font-medium text-gray-700">Plan</th>
                <th className="text-center py-3 px-4 font-medium text-gray-700">Servicios Usados</th>
                <th className="text-center py-3 px-4 font-medium text-gray-700">Utilización</th>
                <th className="text-center py-3 px-4 font-medium text-gray-700">Estado</th>
                <th className="text-left py-3 px-4 font-medium text-gray-700">Miembro desde</th>
              </tr>
            </thead>
            <tbody>
              {activeUsers.map((user, index) => (
                <tr key={user.id} className="border-b hover:bg-gray-50">
                  <td className="py-3 px-4">
                    <div className="flex items-center space-x-3">
                      <div className={`w-8 h-8 rounded-full flex items-center justify-center text-white text-sm font-semibold ${
                        user.type === 'Familiar' ? 'bg-blue-500' : 'bg-green-500'
                      }`}>
                        {user.name.charAt(0).toUpperCase()}
                      </div>
                      <div>
                        <div className="font-medium text-gray-800">{user.name}</div>
                        {user.employees > 0 && (
                          <div className="text-xs text-gray-500">{user.employees} empleados</div>
                        )}
                      </div>
                    </div>
                  </td>
                  <td className="py-3 px-4">
                    <span className={`px-2 py-1 rounded-full text-xs font-medium ${
                      user.type === 'Familiar' ? 'bg-blue-100 text-blue-800' : 'bg-green-100 text-green-800'
                    }`}>
                      {user.type}
                    </span>
                  </td>
                  <td className="py-3 px-4 text-sm text-gray-600">{user.plan}</td>
                  <td className="py-3 px-4 text-center">
                    <div className="font-semibold text-gray-800">{user.servicesUsed}</div>
                    <div className="text-xs text-gray-500">de {user.servicesUsed + user.servicesRemaining}</div>
                  </td>
                  <td className="py-3 px-4 text-center">
                    <div className="flex items-center justify-center">
                      <div className="w-16 bg-gray-200 rounded-full h-2 mr-2">
                        <div 
                          className={`h-2 rounded-full ${
                            user.utilizationRate >= 80 ? 'bg-red-500' :
                            user.utilizationRate >= 60 ? 'bg-yellow-500' :
                            'bg-green-500'
                          }`}
                          style={{ width: `${Math.min(user.utilizationRate, 100)}%` }}
                        ></div>
                      </div>
                      <span className="text-xs font-semibold">{user.utilizationRate}%</span>
                    </div>
                  </td>
                  <td className="py-3 px-4 text-center">
                    <span className={`px-2 py-1 rounded-full text-xs font-medium ${
                      user.status === 'active' ? 'bg-green-100 text-green-800' : 'bg-gray-100 text-gray-800'
                    }`}>
                      {user.status === 'active' ? 'Activo' : 'Inactivo'}
                    </span>
                  </td>
                  <td className="py-3 px-4 text-sm text-gray-600">
                    {new Date(user.memberSince).toLocaleDateString('es-ES')}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      ) : (
        <div className="text-center py-8 text-gray-500">
          <i className="fas fa-user-clock text-4xl mb-2"></i>
          <h4 className="text-lg font-medium mb-2">No hay usuarios activos</h4>
          <p className="text-sm">No se encontraron usuarios con actividad en el período seleccionado.</p>
        </div>
      )}
      
      {activeUsers.length > 0 && (
        <div className="mt-4 pt-4 border-t grid grid-cols-1 sm:grid-cols-3 gap-3 sm:gap-4">
          <div className="text-center p-2">
            <div className="text-xl sm:text-2xl font-bold text-blue-600">
              {activeUsers.reduce((sum, user) => sum + user.servicesUsed, 0)}
            </div>
            <div className="text-xs sm:text-sm text-gray-600">Servicios Totales Usados</div>
          </div>
          <div className="text-center p-2">
            <div className="text-xl sm:text-2xl font-bold text-green-600">
              {Math.round(activeUsers.reduce((sum, user) => sum + user.utilizationRate, 0) / activeUsers.length)}%
            </div>
            <div className="text-xs sm:text-sm text-gray-600">Utilización Promedio</div>
          </div>
          <div className="text-center p-2">
            <div className="text-xl sm:text-2xl font-bold text-gray-800">
              {activeUsers.filter(user => user.status === 'active').length}
            </div>
            <div className="text-xs sm:text-sm text-gray-600">Usuarios Activos</div>
          </div>
        </div>
      )}
    </div>
  )
}

// Más componentes placeholder simplificados
const ServiceMetricCard = ({ title, total, completed, inProgress, icon, color }) => (
  <div className="bg-white rounded-xl shadow-medium p-6">
    <div className="flex items-center justify-between mb-4">
      <i className={`${icon} text-2xl text-${color}-600`}></i>
      <span className="text-sm text-gray-500">{title}</span>
    </div>
    <div className="space-y-2">
      <div className="flex justify-between">
        <span>Total:</span>
        <span className="font-bold">{total}</span>
      </div>
      <div className="flex justify-between">
        <span>Completados:</span>
        <span className="font-bold text-green-600">{completed}</span>
      </div>
      <div className="flex justify-between">
        <span>En progreso:</span>
        <span className="font-bold text-blue-600">{inProgress}</span>
      </div>
    </div>
  </div>
)

const ServiceTypeDistribution = () => (
  <div className="bg-white rounded-xl shadow-medium p-6">
    <h3 className="text-lg font-bold text-gray-800 mb-4">Distribución por Tipo</h3>
    <div className="h-48 flex items-center justify-center bg-gray-50 rounded-lg">
      <span className="text-gray-500">Gráfico circular de distribución</span>
    </div>
  </div>
)

const ResponseTimeChart = ({ dateRange }) => (
  <div className="bg-white rounded-xl shadow-medium p-6">
    <h3 className="text-lg font-bold text-gray-800 mb-4">Tiempos de Respuesta</h3>
    <div className="h-48 flex items-center justify-center bg-gray-50 rounded-lg">
      <span className="text-gray-500">Gráfico de tiempos de respuesta</span>
    </div>
  </div>
)

const HourlyServiceAnalysis = ({ dateRange }) => (
  <div className="bg-white rounded-xl shadow-medium p-6">
    <h3 className="text-lg font-bold text-gray-800 mb-4">Análisis por Horarios</h3>
    <div className="h-48 flex items-center justify-center bg-gray-50 rounded-lg">
      <span className="text-gray-500">Análisis de servicios por hora del día</span>
    </div>
  </div>
)

// FinancialCard eliminado - ahora en RevenueManagement

// Componentes financieros eliminados - funcionalidad fusionada en RevenueManagement

const PerformanceMetric = ({ title, value, target, status, subtitle }) => {
  const statusColors = {
    excellent: 'bg-green-50 border-green-200 text-green-600',
    good: 'bg-blue-50 border-blue-200 text-blue-600',
    warning: 'bg-yellow-50 border-yellow-200 text-yellow-600',
    critical: 'bg-red-50 border-red-200 text-red-600'
  }

  return (
    <div className={`border rounded-xl p-4 sm:p-6 ${statusColors[status]}`}>
      <h4 className="font-medium text-gray-800 mb-2 text-sm sm:text-base">{title}</h4>
      <div className="text-xl sm:text-2xl font-bold mb-1">{value}</div>
      <div className="text-xs sm:text-sm opacity-75 mb-1">Objetivo: {target}</div>
      {subtitle && (
        <div className="text-xs opacity-60">{subtitle}</div>
      )}
    </div>
  )
}

const ResponseTimeAnalysis = ({ dateRange, responseTime, activeEmergencies }) => {
  // Calcular distribución de tiempos de respuesta usando datos reales
  const calculateTimeDistribution = () => {
    const completedEmergencies = activeEmergencies?.filter(e => e.status === 'completed') || []
    
    if (completedEmergencies.length === 0) {
      return {
        ranges: [],
        summary: 'Sin datos de emergencias completadas',
        stats: { total: 0, avgTime: 0, minTime: 0, maxTime: 0 }
      }
    }
    
    const ranges = [
      { label: '< 5 min', min: 0, max: 5, count: 0, color: 'bg-green-500', emergencies: [] },
      { label: '5-10 min', min: 5, max: 10, count: 0, color: 'bg-blue-500', emergencies: [] },
      { label: '10-15 min', min: 10, max: 15, count: 0, color: 'bg-yellow-500', emergencies: [] },
      { label: '> 15 min', min: 15, max: 100, count: 0, color: 'bg-red-500', emergencies: [] }
    ]
    
    // Usar tiempos reales de respuesta del mockdata
    const responseTimes = []
    completedEmergencies.forEach(emergency => {
      const responseTime = emergency.responseTimeMinutes
      if (responseTime !== undefined && responseTime !== null) {
        responseTimes.push(responseTime)
        
        // Clasificar en rangos
        for (const range of ranges) {
          if (responseTime >= range.min && (range.max === 100 || responseTime < range.max)) {
            range.count++
            range.emergencies.push({
              id: emergency.id,
              type: emergency.type,
              location: emergency.location?.address || 'Ubicación no disponible',
              time: responseTime,
              unit: emergency.assignedUnit?.name || 'Unidad no especificada'
            })
            break
          }
        }
      }
    })
    
    const total = completedEmergencies.length
    const fastResponses = ranges[0].count + ranges[1].count
    const averageTime = responseTimes.length > 0 
      ? Math.round(responseTimes.reduce((sum, time) => sum + time, 0) / responseTimes.length * 10) / 10
      : 0
    const minTime = responseTimes.length > 0 ? Math.min(...responseTimes) : 0
    const maxTime = responseTimes.length > 0 ? Math.max(...responseTimes) : 0
    
    const summary = total > 0 
      ? `${Math.round((fastResponses / total) * 100)}% respuestas rápidas (< 10 min)`
      : 'No hay datos disponibles'
    
    return { 
      ranges, 
      summary, 
      total,
      stats: { avgTime: averageTime, minTime, maxTime, responseTimes }
    }
  }
  
  const distribution = calculateTimeDistribution()
  
  return (
    <div className="bg-white rounded-xl shadow-medium p-6">
      <div className="flex items-center justify-between mb-4">
        <h3 className="text-lg font-bold text-gray-800">Análisis Tiempos Respuesta</h3>
        <div className="text-sm text-gray-600">
          Promedio: {responseTime.value}
        </div>
      </div>
      
      {distribution.ranges.length > 0 ? (
        <div className="space-y-4">
          {/* Estadísticas principales */}
          <div className="grid grid-cols-4 gap-3 mb-4">
            <div className="text-center p-3 bg-blue-50 rounded-lg border border-blue-200">
              <div className="text-lg font-bold text-blue-600">{distribution.stats.avgTime}min</div>
              <div className="text-xs text-blue-700">Promedio</div>
            </div>
            <div className="text-center p-3 bg-green-50 rounded-lg border border-green-200">
              <div className="text-lg font-bold text-green-600">{distribution.stats.minTime}min</div>
              <div className="text-xs text-green-700">Mínimo</div>
            </div>
            <div className="text-center p-3 bg-red-50 rounded-lg border border-red-200">
              <div className="text-lg font-bold text-red-600">{distribution.stats.maxTime}min</div>
              <div className="text-xs text-red-700">Máximo</div>
            </div>
            <div className="text-center p-3 bg-purple-50 rounded-lg border border-purple-200">
              <div className="text-lg font-bold text-purple-600">{distribution.total}</div>
              <div className="text-xs text-purple-700">Total</div>
            </div>
          </div>

          {/* Distribución visual */}
          <div className="space-y-3">
            {distribution.ranges.map((range, index) => {
              const percentage = distribution.total > 0 ? (range.count / distribution.total) * 100 : 0
              return (
                <div key={index} className="bg-gray-50 rounded-lg p-3">
                  <div className="flex items-center justify-between mb-2">
                    <div className="flex items-center space-x-3">
                      <div className={`w-4 h-4 rounded ${range.color}`}></div>
                      <span className="text-sm font-medium text-gray-800">{range.label}</span>
                    </div>
                    <div className="text-right">
                      <span className="text-sm font-semibold text-gray-800">{range.count}</span>
                      <span className="text-xs text-gray-500 ml-1">({Math.round(percentage)}%)</span>
                    </div>
                  </div>
                  
                  {/* Barra de progreso */}
                  <div className="w-full bg-gray-200 rounded-full h-2 mb-2">
                    <div 
                      className={`${range.color} h-2 rounded-full transition-all duration-500`}
                      style={{ width: `${Math.max(percentage, 2)}%` }}
                    ></div>
                  </div>
                  
                  {/* Detalles de emergencias */}
                  {range.emergencies.length > 0 && (
                    <div className="space-y-1">
                      {range.emergencies.slice(0, 2).map((emergency, idx) => (
                        <div key={idx} className="flex items-center justify-between text-xs text-gray-600">
                          <div className="flex items-center space-x-2">
                            <span className={`px-1 py-0.5 rounded text-xs font-medium ${
                              emergency.type === 'sos' ? 'bg-red-100 text-red-700' :
                              emergency.type === 'medical' ? 'bg-blue-100 text-blue-700' :
                              'bg-yellow-100 text-yellow-700'
                            }`}>
                              {emergency.type.toUpperCase()}
                            </span>
                            <span className="truncate max-w-32">{emergency.location}</span>
                          </div>
                          <div className="flex items-center space-x-2">
                            <span className="font-medium">{emergency.time}min</span>
                            <span className="text-gray-500">{emergency.unit.split(' ')[0]}</span>
                          </div>
                        </div>
                      ))}
                      {range.emergencies.length > 2 && (
                        <div className="text-xs text-gray-500 text-center">
                          +{range.emergencies.length - 2} más emergencias
                        </div>
                      )}
                    </div>
                  )}
                </div>
              )
            })}
          </div>
          
          {/* Análisis por tipo de emergencia */}
          <div className="bg-gradient-to-r from-blue-50 to-indigo-50 p-4 rounded-lg border border-blue-200">
            <div className="flex items-center justify-between mb-3">
              <h4 className="text-sm font-semibold text-blue-800">Análisis por Tipo</h4>
              <i className="fas fa-chart-pie text-blue-600"></i>
            </div>
            
            <div className="grid grid-cols-3 gap-3 text-center">
              {['sos', 'medical', 'urgency'].map(type => {
                const typeEmergencies = activeEmergencies?.filter(e => e.type === type && e.status === 'completed') || []
                const avgTimeForType = typeEmergencies.length > 0 
                  ? Math.round(typeEmergencies.reduce((sum, e) => sum + (e.responseTimeMinutes || 0), 0) / typeEmergencies.length * 10) / 10
                  : 0
                
                const typeColor = type === 'sos' ? 'text-red-600' : type === 'medical' ? 'text-blue-600' : 'text-yellow-600'
                
                return (
                  <div key={type} className="bg-white rounded-lg p-2 border border-blue-100">
                    <div className={`text-lg font-bold ${typeColor}`}>{avgTimeForType}min</div>
                    <div className="text-xs text-gray-600 uppercase">{type}</div>
                    <div className="text-xs text-gray-500">({typeEmergencies.length})</div>
                  </div>
                )
              })}
            </div>
          </div>
          
          {/* Resumen */}
          <div className="bg-green-50 p-4 rounded-lg border border-green-200">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-green-800">{distribution.summary}</p>
                <p className="text-xs text-green-700 mt-1">
                  Basado en {distribution.total} emergencias completadas
                  {distribution.stats.responseTimes.length > 0 && (
                    <span> • Tiempo promedio: {distribution.stats.avgTime} minutos</span>
                  )}
                </p>
              </div>
              <i className="fas fa-check-circle text-green-500 text-xl"></i>
            </div>
          </div>
        </div>
      ) : (
        <div className="h-32 flex items-center justify-center bg-gray-50 rounded-lg">
          <div className="text-center">
            <i className="fas fa-clock text-gray-400 text-2xl mb-2"></i>
            <p className="text-gray-500 text-sm">{distribution.summary}</p>
          </div>
        </div>
      )}
    </div>
  )
}

const UnitUtilizationChart = ({ dateRange, ambulanceUsers, utilization }) => {
  // Calcular estado detallado de unidades
  const calculateDetailedUtilization = () => {
    if (!ambulanceUsers || ambulanceUsers.length === 0) {
      return {
        statusBreakdown: [],
        summary: 'No hay unidades registradas'
      }
    }
    
    const statusCounts = {
      available: { count: 0, label: 'Disponible', color: 'bg-green-500', icon: 'fas fa-check-circle' },
      en_route: { count: 0, label: 'En Ruta', color: 'bg-blue-500', icon: 'fas fa-route' },
      busy: { count: 0, label: 'Ocupada', color: 'bg-yellow-500', icon: 'fas fa-ambulance' },
      off_duty: { count: 0, label: 'Fuera de Servicio', color: 'bg-gray-500', icon: 'fas fa-pause-circle' },
      maintenance: { count: 0, label: 'Mantenimiento', color: 'bg-red-500', icon: 'fas fa-tools' }
    }
    
    ambulanceUsers.forEach(unit => {
      const status = unit.currentStatus || 'off_duty'
      if (statusCounts[status]) {
        statusCounts[status].count++
      } else {
        statusCounts.off_duty.count++
      }
    })
    
    const statusBreakdown = Object.entries(statusCounts)
      .map(([key, data]) => ({ ...data, status: key }))
      .filter(item => item.count > 0)
    
    const totalUnits = ambulanceUsers.length
    const activeUnits = statusCounts.available.count + statusCounts.en_route.count + statusCounts.busy.count
    const summary = `${activeUnits}/${totalUnits} unidades operativas`
    
    return { statusBreakdown, summary, totalUnits }
  }
  
  const details = calculateDetailedUtilization()
  
  return (
    <div className="bg-white rounded-xl shadow-medium p-6">
      <div className="flex items-center justify-between mb-4">
        <h3 className="text-lg font-bold text-gray-800">Utilización de Unidades</h3>
        <div className="text-sm text-gray-600">
          Disponibilidad: {utilization.value}
        </div>
      </div>
      
      {details.statusBreakdown.length > 0 ? (
        <div className="space-y-4">
          {/* Estado de unidades */}
          <div className="space-y-3">
            {details.statusBreakdown.map((status, index) => {
              const percentage = details.totalUnits > 0 ? (status.count / details.totalUnits) * 100 : 0
              return (
                <div key={index} className="flex items-center justify-between">
                  <div className="flex items-center space-x-3">
                    <i className={`${status.icon} text-gray-600 w-4`}></i>
                    <span className="text-sm font-medium w-32">{status.label}</span>
                  </div>
                  <div className="flex-1 mx-4">
                    <div className="w-full bg-gray-200 rounded-full h-2">
                      <div 
                        className={`${status.color} h-2 rounded-full transition-all duration-500`}
                        style={{ width: `${percentage}%` }}
                      ></div>
                    </div>
                  </div>
                  <div className="w-20 text-right">
                    <span className="text-sm font-semibold">{status.count} unidades</span>
                    <div className="text-xs text-gray-500">({Math.round(percentage)}%)</div>
                  </div>
                </div>
              )
            })}
          </div>
          
          {/* Resumen operativo */}
          <div className="bg-green-50 p-4 rounded-lg">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-green-800">{details.summary}</p>
                <p className="text-xs text-green-600 mt-1">
                  Utilización actual: {utilization.utilization}% ({details.statusBreakdown.find(s => s.status === 'busy')?.count || 0} ocupadas)
                </p>
              </div>
              <i className="fas fa-ambulance text-green-500 text-xl"></i>
            </div>
          </div>
          
          {/* Detalles adicionales */}
          <div className="grid grid-cols-3 gap-4 pt-3 border-t">
            <div className="text-center">
              <p className="text-lg font-bold text-gray-800">{details.totalUnits}</p>
              <p className="text-xs text-gray-600">Total Unidades</p>
            </div>
            <div className="text-center">
              <p className="text-lg font-bold text-green-600">{utilization.activeUnits}</p>
              <p className="text-xs text-gray-600">Operativas</p>
            </div>
            <div className="text-center">
              <p className="text-lg font-bold text-blue-600">{details.statusBreakdown.find(s => s.status === 'busy')?.count || 0}</p>
              <p className="text-xs text-gray-600">En Servicio</p>
            </div>
          </div>
        </div>
      ) : (
        <div className="h-32 flex items-center justify-center bg-gray-50 rounded-lg">
          <div className="text-center">
            <i className="fas fa-ambulance text-gray-400 text-2xl mb-2"></i>
            <p className="text-gray-500 text-sm">{details.summary}</p>
          </div>
        </div>
      )}
    </div>
  )
}

const PerformanceAlerts = ({ responseTime, satisfaction, unitUtilization }) => {
  // Generar alertas dinámicas basadas en métricas reales
  const generateAlerts = () => {
    const alerts = []
    
    // Alerta de tiempo de respuesta
    if (responseTime.status === 'critical') {
      alerts.push({
        level: 'critical',
        icon: 'fas fa-exclamation-triangle',
        title: 'Tiempo de respuesta crítico',
        message: `Promedio actual: ${responseTime.value}, excede significativamente el objetivo`,
        color: 'red'
      })
    } else if (responseTime.status === 'warning') {
      alerts.push({
        level: 'warning', 
        icon: 'fas fa-clock',
        title: 'Tiempo de respuesta elevado',
        message: `Promedio actual: ${responseTime.value}, cerca del límite objetivo`,
        color: 'yellow'
      })
    }
    
    // Alerta de satisfacción
    if (satisfaction.status === 'critical' || satisfaction.status === 'warning') {
      alerts.push({
        level: satisfaction.status,
        icon: 'fas fa-thumbs-down',
        title: 'Satisfacción por debajo del objetivo',
        message: satisfaction.count > 0 
          ? `${satisfaction.value} (${satisfaction.stars}⭐) basado en ${satisfaction.count} encuestas`
          : 'No hay suficientes encuestas para evaluar',
        color: satisfaction.status === 'critical' ? 'red' : 'yellow'
      })
    }
    
    // Alerta de disponibilidad de unidades
    if (unitUtilization.status === 'critical' || unitUtilization.status === 'warning') {
      alerts.push({
        level: unitUtilization.status,
        icon: 'fas fa-ambulance',
        title: 'Disponibilidad de unidades baja',
        message: `Solo ${unitUtilization.activeUnits} de ${unitUtilization.totalUnits} unidades operativas`,
        color: unitUtilization.status === 'critical' ? 'red' : 'yellow'
      })
    }
    
    
    return alerts
  }
  
  const alerts = generateAlerts()
  
  return (
    <div className="bg-white rounded-xl shadow-medium p-6">
      <div className="flex items-center justify-between mb-4">
        <h3 className="text-lg font-bold text-gray-800">Alertas de Performance</h3>
        <div className="flex items-center space-x-2">
          <span className={`px-2 py-1 rounded-full text-xs font-medium ${
            alerts.length === 0 ? 'bg-green-100 text-green-800' :
            alerts.some(a => a.level === 'critical') ? 'bg-red-100 text-red-800' :
            'bg-yellow-100 text-yellow-800'
          }`}>
            {alerts.length === 0 ? 'Todo Normal' : 
             alerts.some(a => a.level === 'critical') ? 'Crítico' : 'Advertencia'}
          </span>
        </div>
      </div>
      
      <div className="space-y-3">
        {alerts.length > 0 ? (
          alerts.map((alert, index) => (
            <div 
              key={index} 
              className={`bg-${alert.color}-50 border-l-4 border-${alert.color}-400 p-4`}
            >
              <div className="flex">
                <i className={`${alert.icon} text-${alert.color}-400 mr-3 mt-1`}></i>
                <div>
                  <h4 className={`font-medium text-${alert.color}-800`}>{alert.title}</h4>
                  <p className={`text-${alert.color}-700 text-sm`}>{alert.message}</p>
                </div>
              </div>
            </div>
          ))
        ) : (
          <div className="bg-green-50 border-l-4 border-green-400 p-4">
            <div className="flex">
              <i className="fas fa-check-circle text-green-400 mr-3 mt-1"></i>
              <div>
                <h4 className="font-medium text-green-800">Sistema funcionando correctamente</h4>
                <p className="text-green-700 text-sm">
                  Todas las métricas de performance están dentro de los objetivos establecidos
                </p>
              </div>
            </div>
          </div>
        )}
      </div>
      
      {/* Resumen de estado */}
      <div className="mt-4 pt-4 border-t">
        <div className="grid grid-cols-3 gap-4">
          <div className="text-center">
            <div className={`inline-flex items-center px-2 py-1 rounded-full text-xs font-medium ${
              responseTime.status === 'excellent' || responseTime.status === 'good' ? 'bg-green-100 text-green-800' :
              responseTime.status === 'warning' ? 'bg-yellow-100 text-yellow-800' : 'bg-red-100 text-red-800'
            }`}>
              <i className="fas fa-clock mr-1"></i>
              {responseTime.value}
            </div>
            <p className="text-xs text-gray-600 mt-1">Tiempo Respuesta</p>
          </div>
          
          <div className="text-center">
            <div className={`inline-flex items-center px-2 py-1 rounded-full text-xs font-medium ${
              satisfaction.status === 'excellent' || satisfaction.status === 'good' ? 'bg-green-100 text-green-800' :
              satisfaction.status === 'warning' ? 'bg-yellow-100 text-yellow-800' : 'bg-red-100 text-red-800'
            }`}>
              <i className="fas fa-star mr-1"></i>
              {satisfaction.value}
            </div>
            <p className="text-xs text-gray-600 mt-1">Satisfacción</p>
          </div>
          
          <div className="text-center">
            <div className={`inline-flex items-center px-2 py-1 rounded-full text-xs font-medium ${
              unitUtilization.status === 'excellent' || unitUtilization.status === 'good' ? 'bg-green-100 text-green-800' :
              unitUtilization.status === 'warning' ? 'bg-yellow-100 text-yellow-800' : 'bg-red-100 text-red-800'
            }`}>
              <i className="fas fa-ambulance mr-1"></i>
              {unitUtilization.value}
            </div>
            <p className="text-xs text-gray-600 mt-1">Disponibilidad</p>
          </div>
        </div>
      </div>
    </div>
  )
}

const UnifiedDistrictAnalysis = ({ dateRange }) => {
  const { allUsers, activeEmergencies } = useAppStore()
  
  // Combinar datos de servicios solicitados y estadísticas por región
  const getUnifiedDistrictData = () => {
    // Datos base de servicios (mock)
    const servicesData = [
      { name: 'Miraflores', services: 487, trend: '+8%', icon: 'fas fa-trophy text-yellow-500' },
      { name: 'San Isidro', services: 423, trend: '+15%', icon: 'fas fa-medal text-gray-400' },
      { name: 'Surco', services: 398, trend: '+5%', icon: 'fas fa-award text-orange-500' },
      { name: 'San Borja', services: 342, trend: '+12%', icon: '' },
      { name: 'La Molina', services: 289, trend: '+3%', icon: '' },
      { name: 'Barranco', services: 245, trend: '+10%', icon: '' },
      { name: 'Jesús María', services: 198, trend: '-2%', icon: '' },
      { name: 'Magdalena', services: 176, trend: '+7%', icon: '' },
      { name: 'Lince', services: 143, trend: '+6%', icon: '' }
    ]
    
    // Datos de estadísticas dinámicas
    const regionStats = {
      'Miraflores': { users: 0, emergencies: 0, responseTime: 7 },
      'San Isidro': { users: 0, emergencies: 0, responseTime: 8 },
      'Surco': { users: 0, emergencies: 0, responseTime: 12 },
      'San Borja': { users: 0, emergencies: 0, responseTime: 10 },
      'La Molina': { users: 0, emergencies: 0, responseTime: 11 },
      'Barranco': { users: 0, emergencies: 0, responseTime: 9 },
      'Jesús María': { users: 0, emergencies: 0, responseTime: 9 },
      'Magdalena': { users: 0, emergencies: 0, responseTime: 11 },
      'Lince': { users: 0, emergencies: 0, responseTime: 10 }
    }
    
    // Calcular emergencias completadas por distrito
    activeEmergencies?.filter(e => e.status === 'completed').forEach(emergency => {
      const location = emergency.location?.address || ''
      Object.keys(regionStats).forEach(district => {
        if (location.includes(district)) {
          regionStats[district].emergencies++
        }
      })
    })
    
    // Calcular distribución de usuarios
    const allUsersList = [
      ...(allUsers?.familiar || []),
      ...(allUsers?.corporativo || []),
      ...(allUsers?.externo || [])
    ]
    
    const userDistribution = {
      'Miraflores': Math.floor(allUsersList.length * 0.10),
      'San Isidro': Math.floor(allUsersList.length * 0.12),
      'Surco': Math.floor(allUsersList.length * 0.18),
      'San Borja': Math.floor(allUsersList.length * 0.08),
      'La Molina': Math.floor(allUsersList.length * 0.09),
      'Barranco': Math.floor(allUsersList.length * 0.05),
      'Jesús María': Math.floor(allUsersList.length * 0.15),
      'Magdalena': Math.floor(allUsersList.length * 0.06),
      'Lince': Math.floor(allUsersList.length * 0.07)
    }
    
    Object.keys(regionStats).forEach(district => {
      regionStats[district].users = userDistribution[district] || 0
    })
    
    // Combinar datos
    const unifiedData = servicesData.map(service => {
      const stats = regionStats[service.name] || { users: 0, emergencies: 0, responseTime: 10 }
      return {
        ...service,
        ...stats,
        percentage: 0 // Se calculará después
      }
    })
    
    // Calcular porcentajes de servicios
    const totalServices = unifiedData.reduce((sum, d) => sum + d.services, 0)
    unifiedData.forEach(district => {
      district.percentage = totalServices > 0 ? Math.round((district.services / totalServices) * 100 * 10) / 10 : 0
    })
    
    return unifiedData.sort((a, b) => b.services - a.services)
  }
  
  const districtData = getUnifiedDistrictData()
  const totalServices = districtData.reduce((sum, d) => sum + d.services, 0)
  const totalUsers = districtData.reduce((sum, d) => sum + d.users, 0)
  const totalEmergencies = districtData.reduce((sum, d) => sum + d.emergencies, 0)
  const avgResponseTime = districtData.reduce((sum, d) => sum + d.responseTime, 0) / districtData.length

  return (
    <div className="bg-white rounded-xl shadow-medium p-4 sm:p-6">
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between mb-4 sm:mb-6 space-y-2 sm:space-y-0">
        <div className="min-w-0 flex-1">
          <h3 className="text-lg sm:text-xl font-bold text-gray-800 truncate">Análisis Integral por Distrito</h3>
          <p className="text-xs sm:text-sm text-gray-600 mt-1">
            <span className="hidden sm:inline">Servicios solicitados, usuarios y métricas operativas</span>
            <span className="sm:hidden">Vista general</span>
          </p>
        </div>
        <div className="flex items-center space-x-2 flex-shrink-0">
          <button className="text-gray-600 hover:text-gray-800 transition-colors p-2" title={LABELS.admin.reports.tooltips.download}>
            <i className="fas fa-download text-sm sm:text-base"></i>
          </button>
          <button className="text-gray-600 hover:text-gray-800 transition-colors p-2" title={LABELS.admin.reports.tooltips.expand}
            <i className="fas fa-expand text-sm sm:text-base"></i>
          </button>
        </div>
      </div>

      <div className="space-y-2 sm:space-y-3">
        {districtData.slice(0, 8).map((district, index) => {
          const responseColor = district.responseTime <= 8 ? 'text-green-600' : 
                               district.responseTime <= 12 ? 'text-yellow-600' : 'text-red-600'
          
          return (
            <div 
              key={district.name} 
              className="flex flex-col sm:flex-row sm:items-center sm:justify-between p-3 sm:p-4 bg-gray-50 hover:bg-gray-100 rounded-lg transition-colors cursor-pointer space-y-2 sm:space-y-0"
            >
              <div className="flex items-center space-x-3 sm:space-x-4 flex-1 min-w-0">
                <div className="w-8 h-8 sm:w-10 sm:h-10 flex items-center justify-center flex-shrink-0">
                  {district.icon ? (
                    <i className={`${district.icon} text-sm sm:text-base`}></i>
                  ) : (
                    <span className="text-base sm:text-lg font-bold text-gray-500">#{index + 1}</span>
                  )}
                </div>
                <div className="flex-1 min-w-0">
                  <h4 className="font-semibold text-sm sm:text-base text-gray-800 truncate">{district.name}</h4>
                  <div className="grid grid-cols-2 lg:grid-cols-4 gap-2 sm:gap-4 mt-1 sm:mt-2 text-xs">
                    <div className="truncate">
                      <span className="text-gray-600">Servicios: </span>
                      <span className="font-semibold text-blue-600">{district.services}</span>
                      <span className="text-gray-500 hidden sm:inline"> ({district.percentage}%)</span>
                    </div>
                    <div className="truncate">
                      <span className="text-gray-600">Usuarios: </span>
                      <span className="font-semibold text-purple-600">{district.users}</span>
                    </div>
                    <div className="truncate">
                      <span className="text-gray-600">Emergencias: </span>
                      <span className="font-semibold text-orange-600">{district.emergencies}</span>
                    </div>
                    <div className="truncate">
                      <span className="text-gray-600 hidden sm:inline">T. Respuesta: </span>
                      <span className="text-gray-600 sm:hidden">Resp: </span>
                      <span className={`font-semibold ${responseColor}`}>{district.responseTime}min</span>
                    </div>
                  </div>
                </div>
              </div>
              
              <div className="flex items-center justify-between sm:justify-start sm:space-x-4 sm:ml-4">
                <div className="text-left sm:text-right">
                  <span className={`text-xs sm:text-sm font-medium ${
                    district.trend.startsWith('+') ? 'text-green-600' : 'text-red-600'
                  }`}>
                    <i className={`fas fa-arrow-${district.trend.startsWith('+') ? 'up' : 'down'} mr-1`}></i>
                    {district.trend}
                  </span>
                  <p className="text-xs text-gray-500 mt-1 hidden sm:block">tendencia</p>
                </div>
                
                <div className="w-16 sm:w-20">
                  <div className="w-full bg-gray-200 rounded-full h-2">
                    <div 
                      className="bg-blue-600 h-2 rounded-full transition-all duration-500"
                      style={{ width: `${Math.max((district.services / districtData[0].services) * 100, 5)}%` }}
                    ></div>
                  </div>
                </div>
              </div>
            </div>
          )
        })}
      </div>

      <div className="mt-4 sm:mt-6 pt-3 sm:pt-4 border-t border-gray-200">
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-3 sm:gap-4">
          <div className="text-center">
            <p className="text-xl sm:text-2xl font-bold text-blue-600">{totalServices.toLocaleString()}</p>
            <p className="text-xs sm:text-sm text-gray-600">Total Servicios</p>
          </div>
          <div className="text-center">
            <p className="text-xl sm:text-2xl font-bold text-purple-600">{totalUsers.toLocaleString()}</p>
            <p className="text-xs sm:text-sm text-gray-600">Total Usuarios</p>
          </div>
          <div className="text-center">
            <p className="text-xl sm:text-2xl font-bold text-orange-600">{totalEmergencies}</p>
            <p className="text-xs sm:text-sm text-gray-600">
              <span className="hidden sm:inline">Total Emergencias</span>
              <span className="sm:hidden">Emergencias</span>
            </p>
          </div>
          <div className="text-center">
            <p className="text-xl sm:text-2xl font-bold text-green-600">{Math.round(avgResponseTime)}min</p>
            <p className="text-xs sm:text-sm text-gray-600">
              <span className="hidden sm:inline">Promedio Respuesta</span>
              <span className="sm:hidden">Prom. Resp.</span>
            </p>
          </div>
        </div>
      </div>
    </div>
  )
}



// ========== FUNCIONES DE CÁLCULO DINÁMICAS ==========

// Calcular satisfacción promedio desde encuestas reales
const calculateSatisfactionRating = (surveyResponses) => {
  if (!surveyResponses || surveyResponses.length === 0) return 0
  
  const totalRating = surveyResponses.reduce((sum, response) => {
    // response.average contiene el promedio de estrellas de cada encuesta
    return sum + parseFloat(response.average || 0)
  }, 0)
  
  return (totalRating / surveyResponses.length).toFixed(1)
}

// Calcular utilización de servicios desde datos reales
const calculateServiceUtilization = (familiarUsers, corporateUsers) => {
  let totalUsed = 0
  let totalAvailable = 0
  let activePlans = 0
  
  // Analizar usuarios familiares
  familiarUsers.forEach(user => {
    if (user.plan?.status === 'active' || !user.plan?.status) {
      activePlans++
      
      if (user.plan?.subtype === 'HELP') {
        const total = user.plan.total_services || 10
        const remaining = user.service_usage?.current_period?.remaining_services || 0
        totalUsed += (total - remaining)
        totalAvailable += total
      } else if (user.service_usage?.current_period?.breakdown) {
        // Otros planes familiares con breakdown por servicio
        const breakdown = user.service_usage.current_period.breakdown
        Object.values(breakdown).forEach(service => {
          if (typeof service === 'object' && service.limit) {
            if (service.limit === 'ILIMITADO') {
              // Para servicios ilimitados, no contar en disponibilidad
              totalUsed += service.used || 0
            } else {
              totalUsed += service.used || 0
              totalAvailable += service.limit
            }
          }
        })
      }
    }
  })
  
  // Analizar usuarios corporativos
  corporateUsers.forEach(user => {
    if (user.plan?.status === 'active' || !user.plan?.status) {
      activePlans++
      const used = user.service_usage?.current_period?.used_services || 0
      const total = user.plan?.contract_services || user.company?.contracted_services || 50
      totalUsed += used
      totalAvailable += total
    }
  })
  
  return {
    activePlans,
    utilizationRate: totalAvailable > 0 ? Math.round((totalUsed / totalAvailable) * 100) : 0,
    totalUsed,
    totalAvailable
  }
}

// Calcular distribución de usuarios por tipo
const calculateUserDistribution = (allUsers, includeAmbulance = false) => {
  const distribution = {
    familiar: allUsers.familiar?.length || 0,
    corporativo: allUsers.corporativo?.length || 0,
    externo: allUsers.externo?.length || 0,
    admin: allUsers.admin?.length || 0
  }
  
  // Incluir ambulancias si se especifica
  if (includeAmbulance) {
    distribution.ambulancia = allUsers.ambulancia?.length || 0
  }
  
  return distribution
}

// Calcular ingresos por tipo de plan
const calculateRevenueByPlan = (allUsers) => {
  const revenueByPlan = {}
  
  // Analizar usuarios familiares
  if (allUsers.familiar) {
    allUsers.familiar.forEach(user => {
      const planName = user.plan?.name || 'Plan Desconocido'
      const monthlyCost = user.billing?.monthly_cost || 0
      const annualRevenue = monthlyCost * 12
      
      if (!revenueByPlan[planName]) {
        revenueByPlan[planName] = 0
      }
      revenueByPlan[planName] += annualRevenue
    })
  }
  
  // Analizar usuarios corporativos
  if (allUsers.corporativo) {
    allUsers.corporativo.forEach(user => {
      const planName = user.plan?.name || 'Plan Corporativo'
      const monthlyCost = user.billing?.monthly_cost || 0
      const annualRevenue = monthlyCost * 12
      
      if (!revenueByPlan[planName]) {
        revenueByPlan[planName] = 0
      }
      revenueByPlan[planName] += annualRevenue
    })
  }
  
  return revenueByPlan
}

// Calcular resumen de planes para la tabla
const calculatePlanSummary = (allUsers) => {
  const summary = []
  
  // Analizar usuarios familiares agrupados por plan
  const familiarPlans = {}
  if (allUsers.familiar) {
    allUsers.familiar.forEach(user => {
      const planType = user.plan?.subtype || 'UNKNOWN'
      const planName = user.plan?.name || `Plan ${planType}`
      
      if (!familiarPlans[planName]) {
        familiarPlans[planName] = {
          users: 0,
          totalServices: 0,
          usedServices: 0,
          revenue: 0
        }
      }
      
      familiarPlans[planName].users++
      familiarPlans[planName].revenue += (user.billing?.monthly_cost || 0) * 12
      
      // Calcular servicios usados según el tipo de plan
      if (user.plan?.subtype === 'HELP') {
        const total = user.plan.total_services || 10
        const remaining = user.service_usage?.current_period?.remaining_services || 0
        familiarPlans[planName].totalServices += total
        familiarPlans[planName].usedServices += (total - remaining)
      } else if (user.service_usage?.current_period?.breakdown) {
        const breakdown = user.service_usage.current_period.breakdown
        Object.values(breakdown).forEach(service => {
          if (typeof service === 'object' && service.used) {
            familiarPlans[planName].usedServices += service.used
            if (service.limit && service.limit !== 'ILIMITADO') {
              familiarPlans[planName].totalServices += service.limit
            }
          }
        })
      }
    })
  }
  
  // Agregar planes familiares al resumen
  Object.entries(familiarPlans).forEach(([planName, data]) => {
    summary.push({
      type: planName,
      users: data.users,
      servicesUsed: data.usedServices,
      revenue: data.revenue,
      utilizationRate: data.totalServices > 0 ? Math.round((data.usedServices / data.totalServices) * 100) : 0
    })
  })
  
  // Analizar usuarios corporativos
  if (allUsers.corporativo && allUsers.corporativo.length > 0) {
    let corporateData = {
      users: 0,
      totalServices: 0,
      usedServices: 0,
      revenue: 0
    }
    
    allUsers.corporativo.forEach(user => {
      corporateData.users++
      corporateData.revenue += (user.billing?.monthly_cost || 0) * 12
      
      const used = user.service_usage?.current_period?.used_services || 0
      const total = user.plan?.contract_services || user.company?.contracted_services || 50
      
      corporateData.usedServices += used
      corporateData.totalServices += total
    })
    
    summary.push({
      type: 'Planes Corporativos',
      users: corporateData.users,
      servicesUsed: corporateData.usedServices,
      revenue: corporateData.revenue,
      utilizationRate: corporateData.totalServices > 0 ? Math.round((corporateData.usedServices / corporateData.totalServices) * 100) : 0
    })
  }
  
  // Analizar usuarios externos
  if (allUsers.externo && allUsers.externo.length > 0) {
    let externalData = {
      users: 0,
      totalServices: 0,
      usedServices: 0,
      revenue: 0
    }
    
    allUsers.externo.forEach(user => {
      externalData.users++
      // Los usuarios externos no tienen costos fijos regulares, son por servicio
      
      if (user.plan?.subtype === 'CASO_2') {
        const individual = 3 - (user.service_usage?.current_period?.individual_remaining || 0)
        externalData.usedServices += individual
        externalData.totalServices += 3
      }
      // CASO_1 no tiene límites, no se cuenta en servicios
    })
    
    summary.push({
      type: 'Usuarios Externos',
      users: externalData.users,
      servicesUsed: externalData.usedServices,
      revenue: externalData.revenue,
      utilizationRate: externalData.totalServices > 0 ? Math.round((externalData.usedServices / externalData.totalServices) * 100) : 0
    })
  }
  
  return summary.filter(item => item.users > 0) // Solo mostrar tipos con usuarios
}

// ========== COMPONENTES DE GRÁFICOS REALES ==========

// Gráfico de distribución de usuarios por tipo
const UserDistributionChart = ({ allUsers }) => {
  const { ambulanceUsers } = useAppStore()
  
  // Incluir usuarios ambulancia en allUsers para el cálculo
  const allUsersWithAmbulance = {
    ...allUsers,
    ambulancia: ambulanceUsers || []
  }
  
  const distribution = calculateUserDistribution(allUsersWithAmbulance, true)
  const total = Object.values(distribution).reduce((sum, count) => sum + count, 0)
  
  const chartData = Object.entries(distribution)
    .filter(([_, count]) => count > 0)
    .map(([type, count]) => ({
      type: type.charAt(0).toUpperCase() + type.slice(1),
      count,
      percentage: total > 0 ? Math.round((count / total) * 100) : 0,
      color: {
        familiar: 'bg-blue-500',
        corporativo: 'bg-green-500', 
        externo: 'bg-purple-500',
        admin: 'bg-red-500',
        ambulancia: 'bg-orange-500'
      }[type] || 'bg-gray-500'
    }))
  
  return (
    <div className="bg-white rounded-xl shadow-medium p-6">
      <h3 className="text-lg font-bold text-gray-800 mb-4">Distribución de Usuarios</h3>
      
      {chartData.length > 0 ? (
        <>
          {/* Gráfico de barras simple */}
          <div className="space-y-4">
            {chartData.map((item, index) => (
              <div key={index} className="flex items-center space-x-4">
                <div className="w-20 text-sm font-medium text-gray-700">
                  {item.type}
                </div>
                <div className="flex-1 relative">
                  <div className="w-full bg-gray-200 rounded-full h-6">
                    <div 
                      className={`h-6 rounded-full ${item.color} flex items-center justify-end px-2 transition-all duration-500`}
                      style={{ width: `${Math.max(item.percentage, 5)}%` }}
                    >
                      <span className="text-white text-xs font-semibold">
                        {item.count}
                      </span>
                    </div>
                  </div>
                </div>
                <div className="w-12 text-right text-sm font-semibold text-gray-600">
                  {item.percentage}%
                </div>
              </div>
            ))}
          </div>
          
          {/* Estadísticas */}
          <div className="mt-6 pt-4 border-t grid grid-cols-2 gap-4">
            <div className="text-center">
              <div className="text-2xl font-bold text-gray-800">{total}</div>
              <div className="text-sm text-gray-600">Total Usuarios</div>
            </div>
            <div className="text-center">
              <div className="text-2xl font-bold text-blue-600">
                {chartData.length}
              </div>
              <div className="text-sm text-gray-600">Tipos de Usuario</div>
            </div>
          </div>
        </>
      ) : (
        <div className="text-center py-8 text-gray-500">
          <i className="fas fa-users text-4xl mb-2"></i>
          <p>No hay usuarios registrados</p>
        </div>
      )}
    </div>
  )
}

// Gráfico de utilización de servicios
const ServiceUtilizationChart = ({ utilization }) => {
  const getUtilizationColor = (rate) => {
    if (rate >= 90) return 'text-red-600 bg-red-100'
    if (rate >= 70) return 'text-yellow-600 bg-yellow-100' 
    if (rate >= 40) return 'text-green-600 bg-green-100'
    return 'text-blue-600 bg-blue-100'
  }
  
  const getUtilizationStatus = (rate) => {
    if (rate >= 90) return 'Crítica'
    if (rate >= 70) return 'Alta'
    if (rate >= 40) return 'Normal'
    return 'Baja'
  }
  
  const circumference = 2 * Math.PI * 45 // Radio de 45
  const strokeDasharray = circumference
  const strokeDashoffset = circumference - (utilization / 100) * circumference
  
  return (
    <div className="bg-white rounded-xl shadow-medium p-6">
      <h3 className="text-lg font-bold text-gray-800 mb-4">Utilización de Servicios</h3>
      
      <div className="flex items-center justify-center">
        {/* Gráfico circular */}
        <div className="relative">
          <svg className="transform -rotate-90 w-32 h-32">
            {/* Círculo de fondo */}
            <circle
              cx="64"
              cy="64"
              r="45"
              stroke="currentColor"
              strokeWidth="8"
              fill="transparent"
              className="text-gray-200"
            />
            {/* Círculo de progreso */}
            <circle
              cx="64"
              cy="64"
              r="45"
              stroke="currentColor"
              strokeWidth="8"
              fill="transparent"
              strokeDasharray={strokeDasharray}
              strokeDashoffset={strokeDashoffset}
              strokeLinecap="round"
              className={
                utilization >= 90 ? 'text-red-500' :
                utilization >= 70 ? 'text-yellow-500' :
                utilization >= 40 ? 'text-green-500' :
                'text-blue-500'
              }
              style={{ transition: 'stroke-dashoffset 1s ease-in-out' }}
            />
          </svg>
          {/* Porcentaje en el centro */}
          <div className="absolute inset-0 flex items-center justify-center">
            <div className="text-center">
              <div className="text-2xl font-bold text-gray-800">{utilization}%</div>
              <div className="text-xs text-gray-600">Utilizado</div>
            </div>
          </div>
        </div>
      </div>
      
      {/* Estado y detalles */}
      <div className="mt-6 space-y-4">
        <div className="text-center">
          <span className={`px-3 py-1 rounded-full text-sm font-medium ${getUtilizationColor(utilization)}`}>
            Utilización {getUtilizationStatus(utilization)}
          </span>
        </div>
        
        <div className="grid grid-cols-3 gap-4 pt-4 border-t text-center">
          <div>
            <div className="text-lg font-bold text-green-600">{Math.max(0, 100 - utilization)}%</div>
            <div className="text-xs text-gray-600">Disponible</div>
          </div>
          <div>
            <div className="text-lg font-bold text-gray-800">{utilization}%</div>
            <div className="text-xs text-gray-600">En Uso</div>
          </div>
          <div>
            <div className="text-lg font-bold text-blue-600">100%</div>
            <div className="text-xs text-gray-600">Capacidad</div>
          </div>
        </div>
        
        {utilization >= 80 && (
          <div className="mt-4 p-3 bg-yellow-50 border-l-4 border-yellow-400 rounded-r-lg">
            <div className="flex items-center">
              <i className="fas fa-exclamation-triangle text-yellow-600 mr-2"></i>
              <span className="text-sm text-yellow-800">
                Alta utilización de servicios. Considere ampliar capacidad.
              </span>
            </div>
          </div>
        )}
      </div>
    </div>
  )
}

// Calcular actividad de usuario individual
const calculateUserActivity = (user, userType) => {
  let totalUsed = 0
  let totalRemaining = 0
  let utilizationRate = 0
  let lastActivity = null
  
  if (userType === 'familiar') {
    if (user.plan?.subtype === 'HELP') {
      const total = user.plan.total_services || 10
      const remaining = user.service_usage?.current_period?.remaining_services || 0
      totalUsed = total - remaining
      totalRemaining = remaining
      utilizationRate = total > 0 ? Math.round((totalUsed / total) * 100) : 0
    } else if (user.service_usage?.current_period?.breakdown) {
      const breakdown = user.service_usage.current_period.breakdown
      Object.values(breakdown).forEach(service => {
        if (typeof service === 'object' && service.used) {
          totalUsed += service.used || 0
          if (service.limit && service.limit !== 'ILIMITADO') {
            totalRemaining += (service.limit - service.used) || 0
          }
        }
      })
      const totalLimit = totalUsed + totalRemaining
      utilizationRate = totalLimit > 0 ? Math.round((totalUsed / totalLimit) * 100) : 0
    }
  } else if (userType === 'corporativo') {
    totalUsed = user.service_usage?.current_period?.used_services || 0
    totalRemaining = user.service_usage?.current_period?.remaining_services || 0
    const totalLimit = user.plan?.contract_services || user.company?.contracted_services || 50
    utilizationRate = totalLimit > 0 ? Math.round((totalUsed / totalLimit) * 100) : 0
  }
  
  return {
    totalUsed,
    totalRemaining,
    utilizationRate,
    lastActivity
  }
}

// ========== COMPONENTES DE ANÁLISIS DE SERVICIOS REALES ==========

// Distribución de tipos de servicios con datos reales
const ServiceTypeDistributionReal = ({ serviceMetrics }) => {
  const totalServices = Object.values(serviceMetrics).reduce((sum, metric) => sum + (metric.total || 0), 0)
  
  const serviceData = Object.entries(serviceMetrics)
    .filter(([_, metric]) => metric.total > 0)
    .map(([type, metric]) => ({
      type: {
        emergencias: 'Emergencias',
        domicilio: 'Médico Domicilio',
        urgencias: 'Urgencias', 
        traslados: 'Traslados'
      }[type] || type,
      count: metric.total,
      percentage: totalServices > 0 ? Math.round((metric.total / totalServices) * 100) : 0,
      color: {
        emergencias: 'bg-red-500',
        domicilio: 'bg-blue-500',
        urgencias: 'bg-orange-500',
        traslados: 'bg-green-500'
      }[type] || 'bg-gray-500'
    }))

  return (
    <div className="bg-white rounded-xl shadow-medium p-6">
      <h3 className="text-lg font-bold text-gray-800 mb-4">Distribución de Servicios</h3>
      
      {serviceData.length > 0 ? (
        <>
          <div className="space-y-4">
            {serviceData.map((service, index) => (
              <div key={index} className="flex items-center space-x-4">
                <div className="w-24 text-sm font-medium text-gray-700">
                  {service.type}
                </div>
                <div className="flex-1 relative">
                  <div className="w-full bg-gray-200 rounded-full h-6">
                    <div 
                      className={`h-6 rounded-full ${service.color} flex items-center justify-end px-2 transition-all duration-500`}
                      style={{ width: `${Math.max(service.percentage, 5)}%` }}
                    >
                      <span className="text-white text-xs font-semibold">
                        {service.count}
                      </span>
                    </div>
                  </div>
                </div>
                <div className="w-12 text-right text-sm font-semibold text-gray-600">
                  {service.percentage}%
                </div>
              </div>
            ))}
          </div>

          <div className="mt-6 pt-4 border-t text-center">
            <div className="text-2xl font-bold text-gray-800">{totalServices}</div>
            <div className="text-sm text-gray-600">Total Servicios Utilizados</div>
          </div>
        </>
      ) : (
        <div className="text-center py-8 text-gray-500">
          <i className="fas fa-chart-pie text-4xl mb-2"></i>
          <p>No hay servicios registrados</p>
        </div>
      )}
    </div>
  )
}

// Utilización de servicios por tipo de plan
const ServiceUtilizationByPlan = ({ allUsers }) => {
  const calculatePlanUtilization = () => {
    const planData = {}

    // Analizar usuarios familiares
    if (allUsers.familiar) {
      allUsers.familiar.forEach(user => {
        const planName = user.plan?.name || user.plan?.subtype || 'Plan Desconocido'
        
        if (!planData[planName]) {
          planData[planName] = {
            users: 0,
            totalServices: 0,
            usedServices: 0,
            color: 'bg-blue-500'
          }
        }
        
        planData[planName].users++
        
        if (user.plan?.subtype === 'HELP') {
          const total = user.plan.total_services || 16
          const remaining = user.service_usage?.current_period?.remaining_services || 0
          planData[planName].totalServices += total
          planData[planName].usedServices += (total - remaining)
        } else if (user.service_usage?.current_period?.breakdown) {
          const breakdown = user.service_usage.current_period.breakdown
          Object.values(breakdown).forEach(service => {
            if (typeof service === 'object') {
              planData[planName].usedServices += service.used || 0
              if (service.limit && service.limit !== 'ILIMITADO') {
                planData[planName].totalServices += service.limit
              }
            }
          })
        }
      })
    }

    // Analizar usuarios corporativos
    if (allUsers.corporativo) {
      allUsers.corporativo.forEach(user => {
        const planName = 'Área Protegida'
        
        if (!planData[planName]) {
          planData[planName] = {
            users: 0,
            totalServices: 0,
            usedServices: 0,
            color: 'bg-green-500'
          }
        }
        
        planData[planName].users++
        planData[planName].usedServices += user.service_usage?.current_period?.used_services || 0
        planData[planName].totalServices += user.plan?.contract_services || user.company?.contracted_services || 50
      })
    }

    // Calcular utilización
    return Object.entries(planData).map(([name, data]) => ({
      name,
      users: data.users,
      utilizationRate: data.totalServices > 0 ? Math.round((data.usedServices / data.totalServices) * 100) : 0,
      usedServices: data.usedServices,
      totalServices: data.totalServices,
      color: data.color
    }))
  }

  const planUtilization = calculatePlanUtilization()

  return (
    <div className="bg-white rounded-xl shadow-medium p-6">
      <h3 className="text-lg font-bold text-gray-800 mb-4">Utilización por Plan</h3>
      
      {planUtilization.length > 0 ? (
        <div className="space-y-4">
          {planUtilization.map((plan, index) => (
            <div key={index} className="border border-gray-200 rounded-lg p-4">
              <div className="flex items-center justify-between mb-3">
                <div>
                  <h4 className="font-medium text-gray-800">{plan.name}</h4>
                  <div className="text-sm text-gray-600">{plan.users} usuario(s)</div>
                </div>
                <div className="text-right">
                  <div className="text-lg font-bold text-gray-800">{plan.utilizationRate}%</div>
                  <div className="text-xs text-gray-600">Utilización</div>
                </div>
              </div>
              
              <div className="w-full bg-gray-200 rounded-full h-3 mb-2">
                <div 
                  className={`h-3 rounded-full ${
                    plan.utilizationRate >= 80 ? 'bg-red-500' :
                    plan.utilizationRate >= 60 ? 'bg-yellow-500' :
                    'bg-green-500'
                  } transition-all duration-500`}
                  style={{ width: `${Math.min(plan.utilizationRate, 100)}%` }}
                ></div>
              </div>
              
              <div className="flex justify-between text-xs text-gray-600">
                <span>{plan.usedServices} usados</span>
                <span>{plan.totalServices} total</span>
              </div>
            </div>
          ))}
        </div>
      ) : (
        <div className="text-center py-8 text-gray-500">
          <i className="fas fa-chart-bar text-4xl mb-2"></i>
          <p>No hay datos de planes disponibles</p>
        </div>
      )}
    </div>
  )
}

// Análisis detallado de servicios por plan
const ServicesByPlanAnalysis = ({ allUsers }) => {
  // Función helper para determinar qué servicios están disponibles por plan
  const getAvailableServicesByPlan = (planName, planType) => {
    const availableServices = []
    
    if (planType === 'Familiar') {
      if (planName.includes('Help')) {
        // Plan Help solo usa servicios generales (mostrados como Emergencias)
        availableServices.push('EMERGENCIA')
      } else {
        // Otros planes familiares tienen servicios específicos
        availableServices.push('EMERGENCIA', 'URGENCIA', 'MEDICO_DOMICILIO', 'TRASLADO_PROGRAMADO')
      }
    } else if (planType === 'Corporativo') {
      // Planes corporativos solo emergencias
      availableServices.push('EMERGENCIA')
    }
    
    return availableServices
  }

  const calculateDetailedAnalysis = () => {
    const analysis = []

    // Analizar planes familiares
    if (allUsers.familiar) {
      const familiarPlans = {}
      
      allUsers.familiar.forEach(user => {
        const planType = user.plan?.subtype || 'UNKNOWN'
        const planName = user.plan?.name || `Plan ${planType}`
        
        if (!familiarPlans[planName]) {
          familiarPlans[planName] = {
            users: 0,
            services: {
              EMERGENCIA: { used: 0, limit: 0 },
              URGENCIA: { used: 0, limit: 0 },
              MEDICO_DOMICILIO: { used: 0, limit: 0 },
              TRASLADO_PROGRAMADO: { used: 0, limit: 0 }
            }
          }
        }
        
        familiarPlans[planName].users++
        
        if (user.plan?.subtype === 'HELP') {
          const total = user.plan.total_services || 16
          const remaining = user.service_usage?.current_period?.remaining_services || 0
          familiarPlans[planName].services.EMERGENCIA.used += (total - remaining)
          familiarPlans[planName].services.EMERGENCIA.limit += total
        } else if (user.service_usage?.current_period?.breakdown) {
          const breakdown = user.service_usage.current_period.breakdown
          Object.entries(breakdown).forEach(([serviceType, service]) => {
            if (typeof service === 'object' && familiarPlans[planName].services[serviceType]) {
              familiarPlans[planName].services[serviceType].used += service.used || 0
              if (service.limit && service.limit !== 'ILIMITADO') {
                familiarPlans[planName].services[serviceType].limit += service.limit
              }
            }
          })
        }
      })
      
      Object.entries(familiarPlans).forEach(([name, data]) => {
        analysis.push({
          planName: name,
          users: data.users,
          type: 'Familiar',
          services: data.services,
          availableServices: getAvailableServicesByPlan(name, 'Familiar')
        })
      })
    }

    // Analizar planes corporativos
    if (allUsers.corporativo && allUsers.corporativo.length > 0) {
      const corporateData = {
        users: allUsers.corporativo.length,
        services: {
          EMERGENCIA: { 
            used: allUsers.corporativo.reduce((sum, user) => sum + (user.service_usage?.current_period?.used_services || 0), 0),
            limit: allUsers.corporativo.reduce((sum, user) => sum + (user.plan?.contract_services || user.company?.contracted_services || 50), 0)
          }
        }
      }
      
      analysis.push({
        planName: 'Área Protegida',
        users: corporateData.users,
        type: 'Corporativo',
        services: corporateData.services,
        availableServices: getAvailableServicesByPlan('Área Protegida', 'Corporativo')
      })
    }

    return analysis
  }

  const detailedAnalysis = calculateDetailedAnalysis()

  // Obtener todas las columnas de servicios que se deben mostrar
  const getAllServiceColumns = () => {
    const allServices = new Set()
    detailedAnalysis.forEach(plan => {
      plan.availableServices.forEach(service => allServices.add(service))
    })
    return Array.from(allServices)
  }

  const serviceColumns = getAllServiceColumns()
  
  // Mapear nombres de servicios a headers legibles
  const serviceHeaders = {
    'EMERGENCIA': 'Emergencias',
    'URGENCIA': 'Urgencias', 
    'MEDICO_DOMICILIO': 'Domicilio',
    'TRASLADO_PROGRAMADO': 'Traslados'
  }

  return (
    <div className="bg-white rounded-xl shadow-medium p-6">
      <h3 className="text-lg font-bold text-gray-800 mb-4">Análisis Detallado por Plan</h3>
      
      {detailedAnalysis.length > 0 ? (
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead>
              <tr className="border-b bg-gray-50">
                <th className="text-left py-3 px-4 font-medium text-gray-700">Plan</th>
                <th className="text-center py-3 px-4 font-medium text-gray-700">Usuarios</th>
                {serviceColumns.map(service => (
                  <th key={service} className="text-center py-3 px-4 font-medium text-gray-700">
                    {serviceHeaders[service]}
                  </th>
                ))}
              </tr>
            </thead>
            <tbody>
              {detailedAnalysis.map((plan, index) => (
                <tr key={index} className="border-b hover:bg-gray-50">
                  <td className="py-3 px-4">
                    <div>
                      <div className="font-medium text-gray-800">{plan.planName}</div>
                      <div className="text-xs text-gray-500">{plan.type}</div>
                    </div>
                  </td>
                  <td className="py-3 px-4 text-center">
                    <span className="font-semibold">{plan.users}</span>
                  </td>
                  {serviceColumns.map(service => {
                    // Solo mostrar la celda si el plan tiene este servicio disponible
                    if (plan.availableServices.includes(service)) {
                      const serviceData = plan.services[service]
                      const used = serviceData?.used || 0
                      const limit = serviceData?.limit || 0
                      
                      return (
                        <td key={service} className="py-3 px-4 text-center">
                          <div className="text-sm">
                            <div className="font-semibold">{used}</div>
                            <div className="text-xs text-gray-500">
                              de {limit === 'ILIMITADO' ? '∞' : limit}
                            </div>
                          </div>
                        </td>
                      )
                    } else {
                      // Celda vacía para servicios no disponibles en este plan
                      return (
                        <td key={service} className="py-3 px-4 text-center">
                          <div className="text-sm text-gray-400">
                            —
                          </div>
                        </td>
                      )
                    }
                  })}
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      ) : (
        <div className="text-center py-8 text-gray-500">
          <i className="fas fa-table text-4xl mb-2"></i>
          <p>No hay datos de servicios disponibles</p>
        </div>
      )}
    </div>
  )
}


const UnitDistributionMap = () => {
  const { ambulanceUsers } = useAppStore()
  
  const getZoneUnits = () => {
    const zones = {
      'Norte': { districts: ['Callao', 'San Miguel', 'Magdalena'], units: [], color: 'blue' },
      'Centro': { districts: ['Lima Centro', 'Lince', 'Jesús María'], units: [], color: 'green' },
      'Sur': { districts: ['San Isidro', 'Miraflores', 'Surco'], units: [], color: 'purple' }
    }
    
    ambulanceUsers?.forEach((unit, index) => {
      const unitId = unit.ambulance?.unit_id || unit.id
      const zoneNames = Object.keys(zones)
      const targetZone = zoneNames[index % zoneNames.length]
      zones[targetZone].units.push(unit)
    })
    
    return zones
  }
  
  const zoneData = getZoneUnits()
  
  return (
    <div className="bg-white rounded-xl shadow-medium p-6">
      <h3 className="text-lg font-bold text-gray-800 mb-4">Distribución de Unidades</h3>
      
      <div className="space-y-4">
        {Object.entries(zoneData).map(([zone, data]) => {
          const available = data.units.filter(u => u.currentStatus === 'available').length
          const total = data.units.length
          const percentage = total > 0 ? Math.round((available / total) * 100) : 0
          
          return (
            <div key={zone} className="border rounded-lg p-4">
              <div className="flex items-center justify-between mb-2">
                <div className="flex items-center space-x-3">
                  <div className={`w-4 h-4 rounded-full ${
                    data.color === 'blue' ? 'bg-blue-500' :
                    data.color === 'green' ? 'bg-green-500' : 'bg-purple-500'
                  }`}></div>
                  <h4 className="font-semibold text-gray-800">Zona {zone}</h4>
                </div>
                <div className="text-sm text-gray-600">
                  {available}/{total} disponibles
                </div>
              </div>
              
              <div className="w-full bg-gray-200 rounded-full h-2 mb-2">
                <div 
                  className={`h-2 rounded-full transition-all duration-500 ${
                    data.color === 'blue' ? 'bg-blue-500' :
                    data.color === 'green' ? 'bg-green-500' : 'bg-purple-500'
                  }`}
                  style={{ width: `${Math.max(percentage, 5)}%` }}
                ></div>
              </div>
              
              <div className="text-xs text-gray-600">
                Cobertura: {data.districts.join(', ')}
              </div>
            </div>
          )
        })}
      </div>
    </div>
  )
}

const ServiceCoverageMetrics = () => {
  const { allUsers, ambulanceUsers } = useAppStore()
  
  const calculateMetrics = () => {
    const totalUsers = [
      ...(allUsers?.familiar || []),
      ...(allUsers?.corporativo || []),
      ...(allUsers?.externo || [])
    ].length
    
    const activeUnits = ambulanceUsers?.filter(u => u.status === 'active').length || 0
    const usersPerUnit = activeUnits > 0 ? Math.round(totalUsers / activeUnits) : 0
    
    return {
      usersPerUnit,
      totalUsers,
      activeUnits,
      recommendedUnits: Math.ceil(totalUsers / 800), // 1 unidad por 800 usuarios
      coverageGap: Math.max(0, Math.ceil(totalUsers / 800) - activeUnits)
    }
  }
  
  const metrics = calculateMetrics()
  
  return (
    <div className="bg-white rounded-xl shadow-medium p-6">
      <h3 className="text-lg font-bold text-gray-800 mb-4">Métricas de Cobertura</h3>
      
      <div className="space-y-4">
        <div className="flex items-center justify-between p-3 bg-blue-50 rounded-lg border border-blue-200">
          <div>
            <div className="text-sm text-blue-700 font-medium">Usuarios por Unidad</div>
            <div className="text-2xl font-bold text-blue-900">{metrics.usersPerUnit}</div>
          </div>
          <i className="fas fa-users text-blue-600 text-xl"></i>
        </div>
        
        <div className="flex items-center justify-between p-3 bg-green-50 rounded-lg border border-green-200">
          <div>
            <div className="text-sm text-green-700 font-medium">Unidades Recomendadas</div>
            <div className="text-2xl font-bold text-green-900">{metrics.recommendedUnits}</div>
          </div>
          <i className="fas fa-calculator text-green-600 text-xl"></i>
        </div>
        
        {metrics.coverageGap > 0 && (
          <div className="flex items-center justify-between p-3 bg-orange-50 rounded-lg border border-orange-200">
            <div>
              <div className="text-sm text-orange-700 font-medium">Brecha de Cobertura</div>
              <div className="text-2xl font-bold text-orange-900">+{metrics.coverageGap}</div>
              <div className="text-xs text-orange-600">unidades necesarias</div>
            </div>
            <i className="fas fa-exclamation-triangle text-orange-600 text-xl"></i>
          </div>
        )}
        
        <div className="p-3 bg-gray-50 rounded-lg">
          <div className="text-sm font-medium text-gray-800 mb-2">Estatus de Cobertura</div>
          <div className="text-xs text-gray-600">
            {metrics.coverageGap === 0 
              ? '✓ Cobertura óptima alcanzada'
              : `⚠ Se requieren ${metrics.coverageGap} unidades adicionales para cobertura óptima`
            }
          </div>
        </div>
      </div>
    </div>
  )
}

const EmergencyDensityAnalysis = () => {
  const { activeEmergencies } = useAppStore()
  
  const analyzeDensity = () => {
    const timeSlots = {
      'Madrugada (00-06)': 0,
      'Mañana (06-12)': 0,
      'Tarde (12-18)': 0,
      'Noche (18-24)': 0
    }
    
    activeEmergencies?.filter(e => e.status === 'completed').forEach(emergency => {
      const hour = new Date(emergency.timestamp).getHours()
      if (hour >= 0 && hour < 6) timeSlots['Madrugada (00-06)']++
      else if (hour >= 6 && hour < 12) timeSlots['Mañana (06-12)']++
      else if (hour >= 12 && hour < 18) timeSlots['Tarde (12-18)']++
      else timeSlots['Noche (18-24)']++
    })
    
    const total = Object.values(timeSlots).reduce((sum, count) => sum + count, 0)
    
    return { timeSlots, total }
  }
  
  const densityData = analyzeDensity()
  
  return (
    <div className="bg-white rounded-xl shadow-medium p-6">
      <h3 className="text-lg font-bold text-gray-800 mb-4">Densidad de Emergencias por Horario</h3>
      
      <div className="space-y-3">
        {Object.entries(densityData.timeSlots).map(([timeSlot, count], index) => {
          const percentage = densityData.total > 0 ? Math.round((count / densityData.total) * 100) : 0
          const colors = ['bg-purple-500', 'bg-blue-500', 'bg-orange-500', 'bg-red-500']
          
          return (
            <div key={timeSlot} className="flex items-center justify-between">
              <div className="flex items-center space-x-3 flex-1">
                <div className={`w-3 h-3 rounded ${colors[index]}`}></div>
                <span className="text-sm font-medium text-gray-700">{timeSlot}</span>
              </div>
              <div className="flex items-center space-x-3">
                <div className="w-24 bg-gray-200 rounded-full h-2">
                  <div 
                    className={`${colors[index]} h-2 rounded-full transition-all duration-500`}
                    style={{ width: `${Math.max(percentage, 5)}%` }}
                  ></div>
                </div>
                <div className="w-16 text-right text-sm">
                  <span className="font-semibold text-gray-800">{count}</span>
                  <span className="text-xs text-gray-500 ml-1">({percentage}%)</span>
                </div>
              </div>
            </div>
          )
        })}
      </div>
      
      <div className="mt-4 p-3 bg-yellow-50 rounded-lg border border-yellow-200">
        <div className="flex items-center space-x-2">
          <i className="fas fa-lightbulb text-yellow-600"></i>
          <span className="text-sm font-medium text-yellow-800">Insight</span>
        </div>
        <p className="text-xs text-yellow-700 mt-1">
          {Object.entries(densityData.timeSlots)
            .reduce((max, [slot, count]) => count > max.count ? { slot, count } : max, { slot: '', count: 0 })
            .slot} es el período de mayor actividad
        </p>
      </div>
    </div>
  )
}

// Componente de Encuestas de Calidad
const SurveysReport = ({ dateRange }) => {
  // Datos simulados de encuestas - en una implementación real vendrían del store
  const getSurveyData = () => {
    // Simulamos encuestas recibidas
    const surveyResponses = [
      {
        id: 1,
        userRole: 'FAMILIAR',
        userId: 'user_123',
        userName: 'María González',
        qualityRating: 5,
        improvementArea: 'tiempo-respuesta',
        comments: 'Excelente servicio, muy rápida la respuesta. Solo sugiero mejorar los tiempos de llegada en horas pico.',
        timestamp: '2024-01-15T10:30:00.000Z',
        surveyDate: 'lunes, 15 de enero de 2024, 10:30'
      },
      {
        id: 2,
        userRole: 'CORPORATIVO',
        userId: 'corp_456',
        userName: 'Empresa Tech Solutions',
        companyName: 'Tech Solutions SAC',
        qualityRating: 4,
        improvementArea: 'comunicacion-empresa',
        comments: 'Buen servicio en general, pero necesitamos mejor comunicación sobre el estado de las emergencias de nuestros empleados.',
        timestamp: '2024-01-14T15:45:00.000Z',
        surveyDate: 'domingo, 14 de enero de 2024, 15:45'
      },
      {
        id: 3,
        userRole: 'EXTERNO',
        userId: 'ext_789',
        userName: 'Carlos Mendoza',
        externalEntity: 'BCR',
        qualityRating: 3,
        improvementArea: 'proceso-verificacion',
        comments: 'El proceso de verificación con mi entidad toma demasiado tiempo. Debería ser más ágil.',
        timestamp: '2024-01-13T09:15:00.000Z',
        surveyDate: 'sábado, 13 de enero de 2024, 09:15'
      },
      {
        id: 4,
        userRole: 'FAMILIAR',
        userId: 'user_321',
        userName: 'Ana Torres',
        qualityRating: 5,
        improvementArea: 'atencion-personal',
        comments: 'Perfecto! El personal médico fue muy profesional y empático. Mi familia quedó muy satisfecha.',
        timestamp: '2024-01-12T16:20:00.000Z',
        surveyDate: 'viernes, 12 de enero de 2024, 16:20'
      },
      {
        id: 5,
        userRole: 'CORPORATIVO',
        userId: 'corp_654',
        userName: 'Constructora Lima Norte',
        companyName: 'Constructora Lima Norte EIRL',
        qualityRating: 2,
        improvementArea: 'cobertura-areas',
        comments: 'Necesitamos mejor cobertura en las zonas de construcción. Hay demoras importantes en áreas alejadas.',
        timestamp: '2024-01-11T11:30:00.000Z',
        surveyDate: 'jueves, 11 de enero de 2024, 11:30'
      },
      {
        id: 6,
        userRole: 'EXTERNO',
        userId: 'ext_987',
        userName: 'Luis Paredes',
        externalEntity: 'RIMAC',
        qualityRating: 4,
        improvementArea: 'costos-adicionales',
        comments: 'Buen servicio, pero me gustaría más transparencia en los costos adicionales antes de solicitar el servicio.',
        timestamp: '2024-01-10T14:10:00.000Z',
        surveyDate: 'miércoles, 10 de enero de 2024, 14:10'
      }
    ]

    return surveyResponses.reverse() // Mostrar más recientes primero
  }

  const surveyData = getSurveyData()

  // Calcular métricas
  const getMetrics = () => {
    const totalSurveys = surveyData.length
    const averageRating = totalSurveys > 0 
      ? (surveyData.reduce((sum, survey) => sum + survey.qualityRating, 0) / totalSurveys).toFixed(1)
      : 0

    const ratingDistribution = {
      5: surveyData.filter(s => s.qualityRating === 5).length,
      4: surveyData.filter(s => s.qualityRating === 4).length,
      3: surveyData.filter(s => s.qualityRating === 3).length,
      2: surveyData.filter(s => s.qualityRating === 2).length,
      1: surveyData.filter(s => s.qualityRating === 1).length,
    }

    const improvementAreas = {}
    surveyData.forEach(survey => {
      improvementAreas[survey.improvementArea] = (improvementAreas[survey.improvementArea] || 0) + 1
    })

    const topImprovementAreas = Object.entries(improvementAreas)
      .sort(([,a], [,b]) => b - a)
      .slice(0, 5)

    const roleDistribution = {
      FAMILIAR: surveyData.filter(s => s.userRole === 'FAMILIAR').length,
      CORPORATIVO: surveyData.filter(s => s.userRole === 'CORPORATIVO').length,
      EXTERNO: surveyData.filter(s => s.userRole === 'EXTERNO').length
    }

    return {
      totalSurveys,
      averageRating,
      ratingDistribution,
      topImprovementAreas,
      roleDistribution
    }
  }

  const metrics = getMetrics()

  const getImprovementAreaLabel = (area) => {
    const labels = {
      'tiempo-respuesta': '⏱️ Tiempo de respuesta',
      'atencion-personal': '👥 Atención del personal',
      'facilidad-uso': '📱 Facilidad de uso de la app',
      'comunicacion': '📞 Comunicación durante el servicio',
      'cobertura': '🗺️ Cobertura geográfica',
      'precios': '💰 Precios y planes',
      'comunicacion-empresa': '📞 Comunicación con la empresa',
      'cobertura-areas': '🗺️ Cobertura de áreas de trabajo',
      'reportes-seguimiento': '📊 Reportes y seguimiento',
      'capacitacion': '📚 Capacitación a empleados',
      'costos-planes': '💰 Costos y planes',
      'proceso-verificacion': '📋 Proceso de verificación',
      'comunicacion-entidad': '🏢 Comunicación con mi entidad',
      'facilidad-solicitud': '📱 Facilidad para solicitar servicios',
      'informacion-limites': '📊 Información sobre límites de servicio',
      'costos-adicionales': '💰 Transparencia en costos',
      'otros': '🔧 Otros aspectos'
    }
    return labels[area] || area
  }

  const getRoleLabel = (role) => {
    const labels = {
      'FAMILIAR': 'Plan Familiar',
      'CORPORATIVO': 'Plan Corporativo', 
      'EXTERNO': 'Afiliado Externo'
    }
    return labels[role] || role
  }

  const getRatingColor = (rating) => {
    if (rating >= 5) return 'text-green-600'
    if (rating >= 4) return 'text-blue-600'
    if (rating >= 3) return 'text-yellow-600'
    if (rating >= 2) return 'text-orange-600'
    return 'text-red-600'
  }

  const getRatingBg = (rating) => {
    if (rating >= 5) return 'bg-green-50 border-green-200'
    if (rating >= 4) return 'bg-blue-50 border-blue-200'
    if (rating >= 3) return 'bg-yellow-50 border-yellow-200'
    if (rating >= 2) return 'bg-orange-50 border-orange-200'
    return 'bg-red-50 border-red-200'
  }

  return (
    <div className="space-y-6">
      {/* Header con métricas principales */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        <div className="bg-white rounded-xl shadow-medium p-6 text-center">
          <div className="text-3xl font-bold text-blue-600">{metrics.totalSurveys}</div>
          <div className="text-sm text-gray-600 mt-1">Total de Encuestas</div>
          <i className="fas fa-poll text-blue-500 text-2xl mt-3"></i>
        </div>
        
        <div className="bg-white rounded-xl shadow-medium p-6 text-center">
          <div className={`text-3xl font-bold ${getRatingColor(metrics.averageRating)}`}>
            {metrics.averageRating} ⭐
          </div>
          <div className="text-sm text-gray-600 mt-1">Calificación Promedio</div>
          <i className="fas fa-star text-yellow-500 text-2xl mt-3"></i>
        </div>

        <div className="bg-white rounded-xl shadow-medium p-6 text-center">
          <div className="text-3xl font-bold text-green-600">
            {metrics.ratingDistribution[5] + metrics.ratingDistribution[4]}
          </div>
          <div className="text-sm text-gray-600 mt-1">Calificaciones Positivas</div>
          <div className="text-xs text-gray-500 mt-1">(4-5 estrellas)</div>
          <i className="fas fa-thumbs-up text-green-500 text-2xl mt-2"></i>
        </div>

        <div className="bg-white rounded-xl shadow-medium p-6 text-center">
          <div className="text-3xl font-bold text-purple-600">
            {metrics.topImprovementAreas.length > 0 ? metrics.topImprovementAreas[0][1] : 0}
          </div>
          <div className="text-sm text-gray-600 mt-1">Área Más Mencionada</div>
          <div className="text-xs text-gray-500 mt-1 truncate">
            {metrics.topImprovementAreas.length > 0 ? getImprovementAreaLabel(metrics.topImprovementAreas[0][0]) : 'N/A'}
          </div>
          <i className="fas fa-chart-bar text-purple-500 text-2xl mt-2"></i>
        </div>
      </div>

      {/* Distribución por calificaciones y roles */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Distribución de calificaciones */}
        <div className="bg-white rounded-xl shadow-medium p-6">
          <h3 className="text-lg font-semibold text-gray-800 mb-4 flex items-center">
            <i className="fas fa-star text-yellow-500 mr-2"></i>
            Distribución de Calificaciones
          </h3>
          <div className="space-y-3">
            {[5, 4, 3, 2, 1].map(rating => (
              <div key={rating} className="flex items-center space-x-3">
                <div className="w-20 text-sm font-medium">
                  {rating} ⭐
                </div>
                <div className="flex-1 bg-gray-200 rounded-full h-3">
                  <div 
                    className={`h-3 rounded-full ${rating >= 4 ? 'bg-green-500' : rating >= 3 ? 'bg-yellow-500' : 'bg-red-500'}`}
                    style={{ 
                      width: `${metrics.totalSurveys > 0 ? (metrics.ratingDistribution[rating] / metrics.totalSurveys) * 100 : 0}%` 
                    }}
                  ></div>
                </div>
                <div className="w-12 text-sm text-gray-600 text-right">
                  {metrics.ratingDistribution[rating]}
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Distribución por rol de usuario */}
        <div className="bg-white rounded-xl shadow-medium p-6">
          <h3 className="text-lg font-semibold text-gray-800 mb-4 flex items-center">
            <i className="fas fa-users text-blue-500 mr-2"></i>
            Distribución por Tipo de Usuario
          </h3>
          <div className="space-y-4">
            {Object.entries(metrics.roleDistribution).map(([role, count]) => (
              <div key={role} className="flex items-center justify-between p-3 border border-gray-200 rounded-lg">
                <div className="flex items-center space-x-3">
                  <div className={`w-3 h-3 rounded-full ${
                    role === 'FAMILIAR' ? 'bg-green-500' :
                    role === 'CORPORATIVO' ? 'bg-blue-500' : 'bg-purple-500'
                  }`}></div>
                  <span className="font-medium">{getRoleLabel(role)}</span>
                </div>
                <span className="text-lg font-bold text-gray-700">{count}</span>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Áreas de mejora más mencionadas */}
      <div className="bg-white rounded-xl shadow-medium p-6">
        <h3 className="text-lg font-semibold text-gray-800 mb-4 flex items-center">
          <i className="fas fa-chart-bar text-purple-500 mr-2"></i>
          Áreas de Mejora Más Mencionadas
        </h3>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {metrics.topImprovementAreas.map(([area, count]) => (
            <div key={area} className="border border-gray-200 rounded-lg p-4">
              <div className="text-sm font-medium text-gray-800 mb-2">
                {getImprovementAreaLabel(area)}
              </div>
              <div className="flex items-center justify-between">
                <div className="text-2xl font-bold text-purple-600">{count}</div>
                <div className="text-sm text-gray-500">
                  {((count / metrics.totalSurveys) * 100).toFixed(1)}%
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>

    </div>
  )
}

export default ReportsAnalytics