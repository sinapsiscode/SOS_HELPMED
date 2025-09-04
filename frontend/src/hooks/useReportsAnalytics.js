import { useState, useMemo, useCallback } from 'react'
import useAppStore from '../stores/useAppStore'
import Swal from 'sweetalert2'

/**
 * Hook principal para gestión de reportes y analytics
 * Siguiendo Regla #2: Toda la lógica compleja extraída del componente
 *
 * Funcionalidades principales:
 * - Navegación entre diferentes tipos de reportes
 * - Gestión de filtros de fecha y tipo
 * - Control de exportación de reportes
 * - Cálculo de métricas base compartidas
 * - Estados de carga y error
 *
 * Tipos de reportes soportados:
 * - overview: Vista general del sistema
 * - users: Análisis de usuarios y afiliados
 * - services: Estadísticas de servicios médicos
 * - performance: Rendimiento operacional
 * - geography: Distribución geográfica
 * - finanzas: Reportes financieros
 * - surveys: Análisis de encuestas de satisfacción
 *
 * @returns {Object} Estados y funciones del sistema de reportes
 *
 * Cumple reglas de refactorización:
 * - Regla #2: Lógica compleja en hook personalizado
 * - Regla #8: Manejo consistente de errores
 * - Regla #13: Optimización con useMemo y useCallback
 */
const useReportsAnalytics = () => {
  // ============================================
  // CONEXIÓN CON STORE
  // ============================================
  const { revenueSummary, transactions, users, emergencyServices, surveys, affiliates } =
    useAppStore()

  // ============================================
  // ESTADOS PRINCIPALES
  // ============================================
  const [selectedReport, setSelectedReport] = useState('overview')
  const [startDate, setStartDate] = useState('')
  const [endDate, setEndDate] = useState('')
  const [filterType, setFilterType] = useState('all')
  const [isExporting, setIsExporting] = useState(false)
  const [error, setError] = useState(null)

  // ============================================
  // CONFIGURACIÓN DE REPORTES
  // ============================================
  const reportTabs = useMemo(
    () => [
      {
        id: 'overview',
        name: 'Vista General',
        icon: 'fas fa-chart-pie',
        description: 'Resumen ejecutivo del sistema'
      },
      {
        id: 'users',
        name: 'Usuarios',
        icon: 'fas fa-users',
        description: 'Análisis de usuarios y afiliados'
      },
      {
        id: 'services',
        name: 'Servicios',
        icon: 'fas fa-ambulance',
        description: 'Estadísticas de servicios médicos'
      },
      {
        id: 'performance',
        name: 'Rendimiento',
        icon: 'fas fa-tachometer-alt',
        description: 'Métricas de performance operacional'
      },
      {
        id: 'geography',
        name: 'Geografía',
        icon: 'fas fa-map-marked-alt',
        description: 'Distribución geográfica de servicios'
      },
      {
        id: 'finanzas',
        name: 'Finanzas',
        icon: 'fas fa-dollar-sign',
        description: 'Reportes financieros y facturación'
      },
      {
        id: 'surveys',
        name: 'Satisfacción',
        icon: 'fas fa-star',
        description: 'Análisis de encuestas y feedback'
      }
    ],
    []
  )

  // ============================================
  // CÁLCULOS BASE COMPARTIDOS
  // ============================================
  const baseMetrics = useMemo(() => {
    // Métricas generales que todos los reportes pueden usar
    const totalUsers = users?.length || 0
    const totalServices = emergencyServices?.length || 0
    const totalRevenue = revenueSummary?.total || 0
    const totalTransactions = transactions?.length || 0
    const totalSurveys = surveys?.length || 0
    const totalAffiliates = affiliates?.length || 0

    // Filtrado por fechas si se especifican
    let filteredData = {
      services: emergencyServices || [],
      transactions: transactions || [],
      surveys: surveys || []
    }

    if (startDate && endDate) {
      const start = new Date(startDate)
      const end = new Date(endDate)

      filteredData = {
        services:
          emergencyServices?.filter((service) => {
            const serviceDate = new Date(service.createdAt || service.date)
            return serviceDate >= start && serviceDate <= end
          }) || [],
        transactions:
          transactions?.filter((transaction) => {
            const transactionDate = new Date(transaction.date || transaction.createdAt)
            return transactionDate >= start && transactionDate <= end
          }) || [],
        surveys:
          surveys?.filter((survey) => {
            const surveyDate = new Date(survey.createdAt || survey.date)
            return surveyDate >= start && surveyDate <= end
          }) || []
      }
    }

    return {
      total: {
        users: totalUsers,
        services: totalServices,
        revenue: totalRevenue,
        transactions: totalTransactions,
        surveys: totalSurveys,
        affiliates: totalAffiliates
      },
      filtered: filteredData,
      dateRange: {
        start: startDate,
        end: endDate,
        hasFilter: !!(startDate && endDate)
      }
    }
  }, [
    users,
    emergencyServices,
    revenueSummary,
    transactions,
    surveys,
    affiliates,
    startDate,
    endDate
  ])

  // ============================================
  // FUNCIONES DE NAVEGACIÓN
  // ============================================
  const handleReportChange = useCallback((reportId) => {
    setSelectedReport(reportId)
    setError(null)
  }, [])

  const handleDateFilterChange = useCallback((start, end) => {
    setStartDate(start)
    setEndDate(end)
  }, [])

  const handleFilterTypeChange = useCallback((type) => {
    setFilterType(type)
  }, [])

  const clearFilters = useCallback(() => {
    setStartDate('')
    setEndDate('')
    setFilterType('all')
  }, [])

  // ============================================
  // FUNCIONES DE EXPORTACIÓN
  // ============================================
  const handleExportReport = useCallback(
    async (format) => {
      try {
        setIsExporting(true)
        setError(null)

        if (format === 'pdf') {
          await generatePDFReport()
        } else if (format === 'excel') {
          await generateExcelReport()
        } else {
          throw new Error('Formato de exportación no soportado')
        }
      } catch (error) {
        console.error('Error exportando reporte:', error)
        setError('Error al exportar el reporte: ' + error.message)

        await Swal.fire({
          title: 'Error de Exportación',
          text: 'No se pudo exportar el reporte. Intenta nuevamente.',
          icon: 'error',
          confirmButtonColor: '#DC2626'
        })
      } finally {
        setIsExporting(false)
      }
    },
    [selectedReport, baseMetrics]
  )

  /**
   * Generar reporte PDF
   * Crea una ventana de impresión con el contenido del reporte actual
   */
  const generatePDFReport = useCallback(async () => {
    const printWindow = window.open('', '_blank')
    const reportData = getReportData()

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
            @media print { body { margin: 0; } .no-print { display: none; } }
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
          
          ${reportData.content}
        </body>
      </html>
    `

    printWindow.document.write(htmlContent)
    printWindow.document.close()

    await Swal.fire({
      title: 'PDF Preparado',
      text: 'Se ha abierto una nueva ventana. Presiona Ctrl+P para imprimir o guardar como PDF',
      icon: 'info',
      timer: 3000,
      showConfirmButton: false
    })
  }, [selectedReport, baseMetrics])

  /**
   * Generar reporte Excel
   * Crea un archivo Excel con los datos del reporte
   */
  const generateExcelReport = useCallback(async () => {
    const reportData = getReportData()

    const htmlContent = `
      <html>
        <head>
          <meta charset="utf-8">
          <style>
            table { border-collapse: collapse; width: 100%; }
            th, td { border: 1px solid #000; padding: 8px; text-align: left; }
            th { background-color: #f2f2f2; font-weight: bold; }
          </style>
        </head>
        <body>
          <h1>Reporte ${getReportTitle()} - HelpMED</h1>
          <p>Período: ${getDateRangeText()}</p>
          <p>Generado: ${new Date().toLocaleDateString('es-PE')} ${new Date().toLocaleTimeString('es-PE')}</p>
          ${reportData.excelContent || reportData.content}
        </body>
      </html>
    `

    const blob = new Blob([htmlContent], { type: 'application/vnd.ms-excel' })
    const url = URL.createObjectURL(blob)
    const a = document.createElement('a')
    a.href = url
    a.download = `Reporte_${getReportTitle()}_${new Date().toISOString().split('T')[0]}.xls`
    a.click()
    URL.revokeObjectURL(url)

    await Swal.fire({
      title: 'Excel Generado',
      text: 'El archivo Excel ha sido descargado exitosamente',
      icon: 'success',
      timer: 2000,
      showConfirmButton: false
    })
  }, [selectedReport, baseMetrics])

  // ============================================
  // FUNCIONES UTILITARIAS
  // ============================================
  const getReportTitle = useCallback(() => {
    const report = reportTabs.find((tab) => tab.id === selectedReport)
    return report ? report.name : 'Reporte'
  }, [selectedReport, reportTabs])

  const getDateRangeText = useCallback(() => {
    if (startDate && endDate) {
      return `${new Date(startDate).toLocaleDateString('es-PE')} - ${new Date(endDate).toLocaleDateString('es-PE')}`
    }
    return 'Todo el período disponible'
  }, [startDate, endDate])

  const getReportData = useCallback(() => {
    // Esta función será implementada por cada hook específico
    // Por ahora retorna estructura básica
    return {
      content: '<p>Contenido del reporte será generado por el hook específico</p>',
      excelContent: '<p>Contenido Excel será generado por el hook específico</p>'
    }
  }, [selectedReport, baseMetrics])

  const clearError = useCallback(() => {
    setError(null)
  }, [])

  // ============================================
  // RETORNO DEL HOOK
  // ============================================
  return {
    // Estados principales
    selectedReport,
    startDate,
    endDate,
    filterType,
    isExporting,
    error,

    // Configuración
    reportTabs,
    baseMetrics,

    // Funciones de navegación
    handleReportChange,
    handleDateFilterChange,
    handleFilterTypeChange,
    clearFilters,

    // Funciones de exportación
    handleExportReport,
    generatePDFReport,
    generateExcelReport,

    // Funciones utilitarias
    getReportTitle,
    getDateRangeText,
    getReportData,
    clearError
  }
}

export default useReportsAnalytics
