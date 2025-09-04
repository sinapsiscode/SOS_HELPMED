import { reportService } from '../services/reportService'

/**
 * Hook especializado para exportación de reportes de usuarios
 * ✅ Cumple reglas de tamaño: <100 líneas
 * ✅ Responsabilidad única: Export functionality
 * ✅ Lógica pura sin estado
 */
const useUsersExport = () => {
  const exportUsersReport = async (format, reportContent, baseMetrics) => {
    const reportData = reportContent

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

  return {
    exportUsersReport
  }
}

export default useUsersExport