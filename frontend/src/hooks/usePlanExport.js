import { useCallback, useState } from 'react'
import Swal from 'sweetalert2'
import * as XLSX from 'xlsx'
import jsPDF from 'jspdf'
import logger from '../utils/logger'

/**
 * Hook especializado para operaciones de exportación de planes
 * ✅ Cumple reglas de tamaño: <100 líneas
 * ✅ Responsabilidad única: Export operations
 * ✅ Funciones extraídas a utils
 */
const usePlanExport = () => {
  const [isExporting, setIsExporting] = useState(false)
  const [exportError, setExportError] = useState(null)

  // Exportar a Excel
  const exportToExcel = useCallback(async (plansData, filters) => {
    try {
      setIsExporting(true)
      setExportError(null)

      // Preparar datos para Excel
      const excelData = []
      Object.entries(plansData).forEach(([category, plans]) => {
        Object.values(plans).forEach(plan => {
          excelData.push({
            'Categoría': category.toUpperCase(),
            'Plan': plan.name,
            'Tipo': plan.plan_type,
            'Estado': plan.active ? 'ACTIVO' : 'INACTIVO',
            'Precio': plan.monthly_cost,
            'Servicios': plan.benefits?.EMERGENCIA?.included || 0,
            'Creado': new Date(plan.created_at).toLocaleDateString('es-CL'),
            'Actualizado': new Date(plan.updated_at).toLocaleDateString('es-CL')
          })
        })
      })

      const ws = XLSX.utils.json_to_sheet(excelData)
      const wb = XLSX.utils.book_new()
      XLSX.utils.book_append_sheet(wb, ws, 'Planes')

      const fileName = `planes_${new Date().toISOString().split('T')[0]}.xlsx`
      XLSX.writeFile(wb, fileName)

      await Swal.fire({
        title: '¡Exportación Exitosa!',
        text: `Archivo ${fileName} descargado correctamente.`,
        icon: 'success',
        confirmButtonColor: '#1D44D1'
      })

      logger.info('Planes exportados a Excel', { fileName, recordCount: excelData.length })
      return { success: true, fileName }

    } catch (error) {
      logger.error('Error exportando a Excel', error)
      setExportError(error.message)
      
      await Swal.fire({
        title: 'Error de Exportación',
        text: 'No se pudo exportar a Excel: ' + error.message,
        icon: 'error',
        confirmButtonColor: '#1D44D1'
      })

      return { success: false, error: error.message }
    } finally {
      setIsExporting(false)
    }
  }, [])

  // Exportar a PDF
  const exportToPDF = useCallback(async (plansData, filters) => {
    try {
      setIsExporting(true)
      setExportError(null)

      const pdf = new jsPDF()
      
      // Título del documento
      pdf.setFontSize(16)
      pdf.text('Reporte de Planes Configurados', 20, 20)
      
      pdf.setFontSize(10)
      pdf.text(`Fecha: ${new Date().toLocaleDateString('es-CL')}`, 20, 30)

      let yPosition = 50
      let totalPlans = 0

      Object.entries(plansData).forEach(([category, plans]) => {
        // Título de categoría
        pdf.setFontSize(12)
        pdf.text(category.toUpperCase(), 20, yPosition)
        yPosition += 10

        Object.values(plans).forEach(plan => {
          if (yPosition > 270) {
            pdf.addPage()
            yPosition = 20
          }

          pdf.setFontSize(9)
          pdf.text(`• ${plan.name} - ${plan.plan_type} - $${plan.monthly_cost}`, 25, yPosition)
          yPosition += 8
          totalPlans++
        })

        yPosition += 5
      })

      // Resumen final
      yPosition += 10
      pdf.setFontSize(10)
      pdf.text(`Total de planes: ${totalPlans}`, 20, yPosition)

      const fileName = `planes_reporte_${new Date().toISOString().split('T')[0]}.pdf`
      pdf.save(fileName)

      await Swal.fire({
        title: '¡PDF Generado!',
        text: `Reporte ${fileName} descargado correctamente.`,
        icon: 'success',
        confirmButtonColor: '#1D44D1'
      })

      logger.info('Planes exportados a PDF', { fileName, totalPlans })
      return { success: true, fileName }

    } catch (error) {
      logger.error('Error exportando a PDF', error)
      setExportError(error.message)
      
      await Swal.fire({
        title: 'Error de Exportación',
        text: 'No se pudo generar el PDF: ' + error.message,
        icon: 'error',
        confirmButtonColor: '#1D44D1'
      })

      return { success: false, error: error.message }
    } finally {
      setIsExporting(false)
    }
  }, [])

  // Exportar a CSV
  const exportToCSV = useCallback(async (plansData, filters) => {
    try {
      setIsExporting(true)
      setExportError(null)

      const csvRows = ['Categoría,Plan,Tipo,Estado,Precio,Servicios,Creado,Actualizado']
      
      Object.entries(plansData).forEach(([category, plans]) => {
        Object.values(plans).forEach(plan => {
          const row = [
            category.toUpperCase(),
            `"${plan.name}"`,
            plan.plan_type,
            plan.active ? 'ACTIVO' : 'INACTIVO',
            plan.monthly_cost,
            plan.benefits?.EMERGENCIA?.included || 0,
            new Date(plan.created_at).toLocaleDateString('es-CL'),
            new Date(plan.updated_at).toLocaleDateString('es-CL')
          ].join(',')
          csvRows.push(row)
        })
      })

      const csvContent = csvRows.join('\n')
      const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' })
      const link = document.createElement('a')
      const url = URL.createObjectURL(blob)
      
      link.setAttribute('href', url)
      const fileName = `planes_${new Date().toISOString().split('T')[0]}.csv`
      link.setAttribute('download', fileName)
      link.style.visibility = 'hidden'
      
      document.body.appendChild(link)
      link.click()
      document.body.removeChild(link)

      await Swal.fire({
        title: '¡CSV Exportado!',
        text: `Archivo ${fileName} descargado correctamente.`,
        icon: 'success',
        confirmButtonColor: '#1D44D1'
      })

      logger.info('Planes exportados a CSV', { fileName, recordCount: csvRows.length - 1 })
      return { success: true, fileName }

    } catch (error) {
      logger.error('Error exportando a CSV', error)
      setExportError(error.message)
      
      await Swal.fire({
        title: 'Error de Exportación',
        text: 'No se pudo exportar a CSV: ' + error.message,
        icon: 'error',
        confirmButtonColor: '#1D44D1'
      })

      return { success: false, error: error.message }
    } finally {
      setIsExporting(false)
    }
  }, [])

  return {
    // Estado
    isExporting,
    exportError,

    // Operaciones de exportación
    exportToExcel,
    exportToPDF,
    exportToCSV
  }
}

export default usePlanExport