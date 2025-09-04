// Sistema completo de reportes y analytics para administradores - MODULARIZADO
import { useState, lazy, Suspense } from 'react'
import useAppStore from '../../../stores/useAppStore'
import Swal from 'sweetalert2'

// Lazy loading de reportes para mejor performance
const OverviewReport = lazy(() => import('./OverviewReport'))
const UsersReport = lazy(() => import('./UsersReport'))
const ServicesReport = lazy(() => import('./ServicesReport'))
const PerformanceReport = lazy(() => import('./PerformanceReport'))
const GeographyReport = lazy(() => import('./GeographyReport'))
const FinancialReport = lazy(() => import('./FinancialReport')) // Reporte financiero con gráficos completos
const SurveysReport = lazy(() => import('./SurveysReport'))

// Loading Spinner Component
const LoadingSpinner = () => (
  <div className="flex items-center justify-center py-12">
    <div className="text-center">
      <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-red-600 mx-auto mb-4"></div>
      <p className="text-gray-600">Cargando reporte...</p>
    </div>
  </div>
)

const ReportsAnalytics = () => {
  const { revenueSummary, transactions, allUsers, emergencyServices, surveys } = useAppStore()
  const [selectedReport, setSelectedReport] = useState('overview')
  const [startDate, setStartDate] = useState('')
  const [endDate, setEndDate] = useState('')
  const [filterType, setFilterType] = useState('all')

  // Función para exportar a PDF
  const handleExportPDF = () => {
    const printWindow = window.open('', '_blank')
    
    const htmlContent = `
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
              🖨️ Imprimir/Guardar como PDF
            </button>
            <button onclick="window.close()" style="background: #666; color: white; border: none; padding: 10px 20px; border-radius: 5px; cursor: pointer; margin-left: 10px;">
              ❌ Cerrar
            </button>
          </div>
          
          <div id="report-content">
            <!-- El contenido del reporte se insertaría aquí dinámicamente -->
            <p>Contenido del reporte ${getReportTitle()}</p>
          </div>
        </body>
      </html>
    `
    
    printWindow.document.write(htmlContent)
    printWindow.document.close()

    Swal.fire({
      title: 'PDF Preparado',
      text: 'Se ha abierto una nueva ventana. Presiona Ctrl+P para imprimir o guardar como PDF',
      icon: 'info',
      timer: 3000,
      showConfirmButton: false
    })
  }

  // Función para exportar a Excel
  const handleExportExcel = () => {
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
          
          <table>
            <tr><th>Métrica</th><th>Valor</th><th>Cambio</th></tr>
            <tr><td>Total Usuarios</td><td>2,847</td><td>+12%</td></tr>
            <tr><td>Servicios Completados</td><td>1,234</td><td>+8%</td></tr>
            <tr><td>Ingresos Totales</td><td>S/ 45,680</td><td>+15%</td></tr>
          </table>
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
      title: 'Excel Generado',
      text: 'El archivo Excel ha sido descargado exitosamente',
      icon: 'success',
      timer: 2000,
      showConfirmButton: false
    })
  }

  const handleExportReport = (format) => {
    if (format === 'pdf') {
      handleExportPDF()
    } else if (format === 'excel') {
      handleExportExcel()
    }
  }

  const getReportTitle = () => {
    const titles = {
      'overview': 'Resumen General',
      'users': 'Usuarios',
      'services': 'Servicios',
      'performance': 'Performance',
      'geography': 'Geografía',
      'finanzas': 'Finanzas',
      'surveys': 'Encuestas de Calidad'
    }
    return titles[selectedReport] || 'Reporte'
  }

  const getDateRangeText = () => {
    if (startDate && endDate) {
      return `${new Date(startDate).toLocaleDateString('es-PE')} - ${new Date(endDate).toLocaleDateString('es-PE')}`
    }
    return 'Seleccionar período'
  }

  const renderReportContent = () => {
    const dateRange = { startDate, endDate }
    
    // Construir baseMetrics con la estructura esperada
    const totalUsers = Object.values(allUsers || {}).reduce((sum, users) => sum + (users?.length || 0), 0)
    
    const baseMetrics = {
      total: {
        users: totalUsers,
        revenue: revenueSummary?.totalRevenue || 0,
        services: emergencyServices?.length || 0
      },
      filtered: {
        services: emergencyServices || [],
        surveys: surveys || []
      },
      dateRange
    }
    
    switch (selectedReport) {
      case 'overview':
        return <OverviewReport baseMetrics={baseMetrics} />
      case 'users':
        return <UsersReport baseMetrics={{ dateRange, filterType }} />
      case 'services':
        return <ServicesReport dateRange={dateRange} />
      case 'performance':
        return <PerformanceReport dateRange={dateRange} />
      case 'geography':
        return <GeographyReport dateRange={dateRange} />
      case 'finanzas':
        return <FinancialReport />
      case 'surveys':
        return <SurveysReport dateRange={dateRange} />
      default:
        return <OverviewReport baseMetrics={baseMetrics} />
    }
  }

  return (
    <div className="space-y-6">
      {/* Header y Controles */}
      <div className="bg-white rounded-xl shadow-medium p-4 sm:p-6">
        <div className="flex flex-col space-y-4 sm:space-y-0 sm:flex-row sm:items-center sm:justify-between mb-6">
          <h1 className="text-xl sm:text-2xl font-bold text-gray-800">Reportes y Analytics</h1>
          <div className="flex flex-col space-y-3 sm:space-y-0 sm:flex-row sm:items-end sm:space-x-3">
            <div className="flex flex-col sm:flex-row sm:items-end space-y-2 sm:space-y-0 sm:space-x-3">
              <div className="flex flex-col">
                <label className="text-xs text-gray-600 mb-1">Fecha de inicio</label>
                <input
                  type="date"
                  value={startDate}
                  onChange={(e) => setStartDate(e.target.value)}
                  className="border border-gray-300 rounded-lg px-3 py-2 text-sm w-full sm:w-auto"
                />
              </div>
              <div className="flex flex-col">
                <label className="text-xs text-gray-600 mb-1">Fecha de fin</label>
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
                Últimos 30 días
              </button>
            </div>
            
            <div className="flex space-x-2">
              <button
                onClick={() => handleExportReport('pdf')}
                className="bg-red-600 hover:bg-red-700 text-white px-3 sm:px-4 py-2 rounded-lg transition-colors text-sm flex items-center justify-center flex-1 sm:flex-none"
              >
                <i className="fas fa-file-pdf mr-1 sm:mr-2"></i>PDF
              </button>
              <button
                onClick={() => handleExportReport('excel')}
                className="bg-green-600 hover:bg-green-700 text-white px-3 sm:px-4 py-2 rounded-lg transition-colors text-sm flex items-center justify-center flex-1 sm:flex-none"
              >
                <i className="fas fa-file-excel mr-1 sm:mr-2"></i>Excel
              </button>
            </div>
          </div>
        </div>

        {/* Navigation Tabs */}
        <div className="flex space-x-1 bg-gray-100 rounded-lg p-1 overflow-x-auto scrollbar-hide">
          {[
            { id: 'overview', label: 'Resumen General', icon: 'fas fa-chart-pie', short: 'Resumen' },
            { id: 'users', label: 'Usuarios', icon: 'fas fa-users', short: 'Usuarios' },
            { id: 'services', label: 'Servicios', icon: 'fas fa-ambulance', short: 'Servicios' },
            { id: 'performance', label: 'Performance', icon: 'fas fa-tachometer-alt', short: 'Performance' },
            { id: 'geography', label: 'Geografía', icon: 'fas fa-map-marked-alt', short: 'Geografía' },
            { id: 'finanzas', label: 'Finanzas', icon: 'fas fa-coins', short: 'Finanzas' },
            { id: 'surveys', label: 'Encuestas de Calidad', icon: 'fas fa-poll', short: 'Encuestas' }
          ].map((tab) => (
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

      {/* Contenido del Reporte con Lazy Loading */}
      <Suspense fallback={<LoadingSpinner />}>
        {renderReportContent()}
      </Suspense>
    </div>
  )
}

export default ReportsAnalytics