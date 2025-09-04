import { useState, useCallback } from 'react'
import { financialService } from '../services/financialService'
import Swal from 'sweetalert2'

/**
 * Hook especializado para exportación de reportes financieros
 * ✅ Cumple reglas de tamaño: <100 líneas
 * ✅ Responsabilidad única: Export functionality
 * ✅ Manejo de errores incluido
 */
const useRevenueExport = () => {
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState(null)

  const handleExportReport = useCallback(
    async (format, filteredTransactions, financialMetrics, revenueSummary, filters) => {
      try {
        setLoading(true)
        setError(null)

        const reportData = {
          transactions: filteredTransactions,
          metrics: financialMetrics,
          summary: revenueSummary,
          filters
        }

        if (format === 'excel') {
          await financialService.exportToExcel(reportData)
        } else if (format === 'pdf') {
          await financialService.exportToPDF(reportData)
        }

        return { success: true }
      } catch (error) {
        console.error('Error exportando reporte:', error)
        setError('Error al exportar el reporte: ' + error.message)

        await Swal.fire({
          title: 'Error de Exportación',
          text: 'No se pudo exportar el reporte. Intenta nuevamente.',
          icon: 'error',
          confirmButtonColor: '#DC2626'
        })

        return { success: false, error }
      } finally {
        setLoading(false)
      }
    },
    []
  )

  return {
    loading,
    error,
    handleExportReport,
    clearError: () => setError(null)
  }
}

export default useRevenueExport