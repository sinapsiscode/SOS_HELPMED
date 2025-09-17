// Sistema completo de reportes y analytics para administradores - MODULARIZADO
import { useState, lazy, Suspense } from 'react'
import useAppStore from '../../stores/useAppStore'
import Swal from 'sweetalert2'
import { LABELS } from '../../config/labels'

// Lazy loading de reportes para mejor performance
const OverviewReport = lazy(() => import('./reports/OverviewReportSimple'))
const UsersReport = lazy(() => import('./reports/UsersReport'))
const ServicesReport = lazy(() => import('./reports/ServicesReport'))
const PerformanceReport = lazy(() => import('./reports/PerformanceReport'))
const GeographyReport = lazy(() => import('./reports/GeographyReport'))
const FinancialReport = lazy(() => import('./reports/FinancialReport')) // Reporte financiero con gráficos completos
const SurveysReport = lazy(() => import('./reports/SurveysReport'))

// Loading Spinner Component
const LoadingSpinner = () => {
  const labels = LABELS.admin.reports.reportsAnalytics
  return (
    <div className="flex items-center justify-center py-12">
      <div className="text-center">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-red-600 mx-auto mb-4"></div>
        <p className="text-gray-600">{labels.loading}</p>
      </div>
    </div>
  )
}

const ReportsAnalytics = () => {
  const labels = LABELS.admin.reports?.reportsAnalytics || {}
  const store = useAppStore()
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
          <title>${labels.pdfTemplate.title.replace('{reportTitle}', getReportTitle())}</title>
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
          <h1>${labels.pdfTemplate.title.replace('{reportTitle}', getReportTitle())}</h1>
          
          <div class="header-info">
            <strong>${labels.pdfTemplate.period}</strong> ${getDateRangeText()}<br>
            <strong>${labels.pdfTemplate.generationDate}</strong> ${new Date().toLocaleDateString('es-PE')} - ${new Date().toLocaleTimeString('es-PE')}<br>
            <strong>${labels.pdfTemplate.system}</strong> ${labels.pdfTemplate.systemName}
          </div>
          
          <div class="no-print" style="text-align: center; margin: 20px 0;">
            <button onclick="window.print()" style="background: #d32f2f; color: white; border: none; padding: 10px 20px; border-radius: 5px; cursor: pointer;">
              ${labels.export.printButton}
            </button>
            <button onclick="window.close()" style="background: #666; color: white; border: none; padding: 10px 20px; border-radius: 5px; cursor: pointer; margin-left: 10px;">
              ${labels.export.closeButton}
            </button>
          </div>
          
          <div id="report-content">
            <!-- El contenido del reporte se insertaría aquí dinámicamente -->
            <p>${labels.pdfTemplate.contentLabel.replace('{reportTitle}', getReportTitle())}</p>
          </div>
        </body>
      </html>
    `
    
    printWindow.document.write(htmlContent)
    printWindow.document.close()

    Swal.fire({
      title: labels.export.pdfTitle,
      text: labels.export.pdfMessage,
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
          <h1>${labels.pdfTemplate.title.replace('{reportTitle}', getReportTitle())}</h1>
          <p><strong>${labels.pdfTemplate.period}</strong> ${getDateRangeText()}</p>
          <p><strong>${labels.pdfTemplate.generationDate}</strong> ${new Date().toLocaleDateString('es-PE')} ${new Date().toLocaleTimeString('es-PE')}</p>
          
          <table>
            <tr><th>${labels.excelTemplate.headers.metric}</th><th>${labels.excelTemplate.headers.value}</th><th>${labels.excelTemplate.headers.change}</th></tr>
            <tr><td>${labels.excelTemplate.sampleData.totalUsers}</td><td>2,847</td><td>+12%</td></tr>
            <tr><td>${labels.excelTemplate.sampleData.completedServices}</td><td>1,234</td><td>+8%</td></tr>
            <tr><td>${labels.excelTemplate.sampleData.totalRevenue}</td><td>S/ 45,680</td><td>+15%</td></tr>
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
      title: labels.export.excelTitle,
      text: labels.export.excelMessage,
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
      'overview': labels.reportTitles.overview,
      'users': labels.reportTitles.users,
      'services': labels.reportTitles.services,
      'performance': labels.reportTitles.performance,
      'geography': labels.reportTitles.geography,
      'finanzas': labels.reportTitles.finanzas,
      'surveys': labels.reportTitles.surveys
    }
    return titles[selectedReport] || labels.reportTitles.default
  }

  const getDateRangeText = () => {
    if (startDate && endDate) {
      return `${new Date(startDate).toLocaleDateString('es-PE')} - ${new Date(endDate).toLocaleDateString('es-PE')}`
    }
    return labels.dateRange.selectPeriod
  }

  const renderReportContent = () => {
    try {
      const dateRange = { startDate, endDate }
      
      // Construir baseMetrics con la estructura esperada - con valores seguros
      const allUsers = store.allUsers || {}
      const revenueSummary = store.revenueSummary || {}
      const emergencyServices = store.emergencyServices || []
      const surveys = store.surveyResponses || []
      
      const totalUsers = Object.values(allUsers).reduce((sum, users) => sum + (Array.isArray(users) ? users.length : 0), 0)
      
      const baseMetrics = {
        total: {
          users: totalUsers,
          revenue: revenueSummary.totalRevenue || 0,
          services: emergencyServices.length || 0
        },
        filtered: {
          services: emergencyServices,
          surveys: surveys
        },
        dateRange
      }
      
      switch (selectedReport) {
        case 'overview':
          return <OverviewReport dateRange={dateRange} revenueSummary={revenueSummary} />
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
          return <OverviewReport dateRange={dateRange} revenueSummary={revenueSummary} />
      }
    } catch (error) {
      console.error('Error rendering report content:', error)
      return (
        <div className="text-center py-12">
          <div className="text-red-600 mb-4">
            <i className="fas fa-exclamation-triangle text-4xl"></i>
          </div>
          <h3 className="text-lg font-semibold text-gray-800 mb-2">Error al cargar el reporte</h3>
          <p className="text-gray-600 mb-4">Por favor, recarga la página e intenta de nuevo.</p>
          <p className="text-xs text-gray-500">{error.message}</p>
        </div>
      )
    }
  }

  return (
    <div className="space-y-6">
      {/* Header y Controles */}
      <div className="bg-white rounded-xl shadow-medium p-4 sm:p-6">
        <div className="flex flex-col space-y-4 sm:space-y-0 sm:flex-row sm:items-center sm:justify-between mb-6">
          <h1 className="text-xl sm:text-2xl font-bold text-gray-800">{labels.title}</h1>
          <div className="flex flex-col space-y-3 sm:space-y-0 sm:flex-row sm:items-end sm:space-x-3">
            <div className="flex flex-col sm:flex-row sm:items-end space-y-2 sm:space-y-0 sm:space-x-3">
              <div className="flex flex-col">
                <label className="text-xs text-gray-600 mb-1">{labels.dateRange.startLabel}</label>
                <input
                  type="date"
                  value={startDate}
                  onChange={(e) => setStartDate(e.target.value)}
                  className="border border-gray-300 rounded-lg px-3 py-2 text-sm w-full sm:w-auto"
                />
              </div>
              <div className="flex flex-col">
                <label className="text-xs text-gray-600 mb-1">{labels.dateRange.endLabel}</label>
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
                {labels.dateRange.last30Days}
              </button>
            </div>
            
            <div className="flex space-x-2">
              <button
                onClick={() => handleExportReport('pdf')}
                className="bg-red-600 hover:bg-red-700 text-white px-3 sm:px-4 py-2 rounded-lg transition-colors text-sm flex items-center justify-center flex-1 sm:flex-none"
              >
                <i className="fas fa-file-pdf mr-1 sm:mr-2"></i>{labels.export.pdf}
              </button>
              <button
                onClick={() => handleExportReport('excel')}
                className="bg-green-600 hover:bg-green-700 text-white px-3 sm:px-4 py-2 rounded-lg transition-colors text-sm flex items-center justify-center flex-1 sm:flex-none"
              >
                <i className="fas fa-file-excel mr-1 sm:mr-2"></i>{labels.export.excel}
              </button>
            </div>
          </div>
        </div>

        {/* Navigation Tabs */}
        <div className="flex space-x-1 bg-gray-100 rounded-lg p-1 overflow-x-auto scrollbar-hide">
          {[
            { id: 'overview', label: labels.tabs.overview.label, icon: labels.tabs.overview.icon, short: labels.tabs.overview.short },
            { id: 'users', label: labels.tabs.users.label, icon: labels.tabs.users.icon, short: labels.tabs.users.short },
            { id: 'services', label: labels.tabs.services.label, icon: labels.tabs.services.icon, short: labels.tabs.services.short },
            { id: 'performance', label: labels.tabs.performance.label, icon: labels.tabs.performance.icon, short: labels.tabs.performance.short },
            { id: 'geography', label: labels.tabs.geography.label, icon: labels.tabs.geography.icon, short: labels.tabs.geography.short },
            { id: 'finanzas', label: labels.tabs.finanzas.label, icon: labels.tabs.finanzas.icon, short: labels.tabs.finanzas.short },
            { id: 'surveys', label: labels.tabs.surveys.label, icon: labels.tabs.surveys.icon, short: labels.tabs.surveys.short }
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