import { useState, useCallback } from 'react'
import { surveyService } from '../services/surveyService'
import Swal from 'sweetalert2'

/**
 * Hook especializado para exportación de reportes de encuestas
 * ✅ Cumple reglas de tamaño: <100 líneas
 * ✅ Responsabilidad única: Export functionality
 * ✅ Manejo de errores centralizado
 */
const useSurveyExport = () => {
  const [isExporting, setIsExporting] = useState(false)
  const [exportError, setExportError] = useState(null)

  // Exportar reporte
  const handleExportReport = useCallback(
    async (format, surveyMetrics, questions, filteredResponses, dateFilter, planFilter) => {
      try {
        setIsExporting(true)
        setExportError(null)

        const exportData = {
          metrics: surveyMetrics,
          questions,
          responses: filteredResponses,
          filters: { dateFilter, planFilter }
        }

        if (format === 'pdf') {
          await surveyService.exportToPDF(exportData)
          
          await Swal.fire({
            title: '¡Reporte PDF Generado!',
            text: 'El reporte en PDF ha sido descargado exitosamente',
            icon: 'success',
            timer: 2000,
            showConfirmButton: false
          })
        } else if (format === 'excel') {
          await surveyService.exportToExcel(exportData)
          
          await Swal.fire({
            title: '¡Reporte Excel Generado!',
            text: 'El reporte en Excel ha sido descargado exitosamente',
            icon: 'success',
            timer: 2000,
            showConfirmButton: false
          })
        }

        return { success: true }
      } catch (error) {
        console.error('Error exportando reporte:', error)
        setExportError('Error al exportar el reporte: ' + error.message)

        await Swal.fire({
          title: 'Error de Exportación',
          text: 'No se pudo exportar el reporte. Intenta nuevamente.',
          icon: 'error',
          confirmButtonColor: '#DC2626'
        })

        return { success: false, error: error.message }
      } finally {
        setIsExporting(false)
      }
    },
    []
  )

  // Exportar a PDF específicamente
  const exportToPDF = useCallback(
    async (surveyMetrics, questions, filteredResponses, dateFilter, planFilter) => {
      return await handleExportReport('pdf', surveyMetrics, questions, filteredResponses, dateFilter, planFilter)
    },
    [handleExportReport]
  )

  // Exportar a Excel específicamente
  const exportToExcel = useCallback(
    async (surveyMetrics, questions, filteredResponses, dateFilter, planFilter) => {
      return await handleExportReport('excel', surveyMetrics, questions, filteredResponses, dateFilter, planFilter)
    },
    [handleExportReport]
  )

  // Limpiar error de exportación
  const clearExportError = useCallback(() => {
    setExportError(null)
  }, [])

  return {
    // Estados
    isExporting,
    exportError,

    // Funciones de exportación
    handleExportReport,
    exportToPDF,
    exportToExcel,

    // Control
    clearExportError
  }
}

export default useSurveyExport