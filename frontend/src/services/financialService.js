import * as XLSX from 'xlsx'
import { saveAs } from 'file-saver'
import jsPDF from 'jspdf'
import 'jspdf-autotable'
import Swal from 'sweetalert2'

/**
 * Servicio especializado para operaciones financieras
 * Siguiendo Regla #10: Servicios modulares para lógica compleja
 *
 * Proporciona:
 * - Exportación de reportes financieros (PDF/Excel)
 * - Formateo de datos financieros
 * - Validación de transacciones
 * - Utilidades de cálculo financiero
 * - Generación de templates profesionales
 *
 * Cumple reglas de refactorización:
 * - Regla #2: Separación de lógica compleja
 * - Regla #8: Manejo consistente de errores
 * - Regla #10: Arquitectura modular
 */
export const financialService = {
  // ============================================
  // EXPORTACIÓN A EXCEL
  // ============================================
  async exportToExcel(reportData) {
    try {
      const { transactions, metrics, summary, filters } = reportData
      const currentDate = new Date().toLocaleDateString('es-PE')
      const fileName = `Reporte_Financiero_${currentDate.replace(/\//g, '-')}.xlsx`

      // Preparar datos de transacciones
      const transactionsData = transactions.map((transaction) => ({
        ID: transaction.id,
        Fecha: new Date(transaction.date).toLocaleDateString('es-PE'),
        Concepto: transaction.concept,
        Cliente: transaction.userName || transaction.companyName || '-',
        Tipo: this.getTypeName(transaction.type),
        'Monto (S/)': transaction.amount,
        Estado: transaction.status === 'COMPLETED' ? 'Completado' : 'Pendiente',
        'Método de Pago': transaction.paymentMethod || '-',
        Notas: transaction.notes || '-'
      }))

      // Preparar resumen financiero
      const summaryData = [
        { Métrica: 'Ingresos Totales', Valor: `S/ ${metrics.totalRevenue.toLocaleString()}` },
        { Métrica: 'Ingresos del Mes', Valor: `S/ ${metrics.monthlyRevenue.toLocaleString()}` },
        { Métrica: 'Ingresos de Hoy', Valor: `S/ ${metrics.dailyRevenue.toLocaleString()}` },
        { Métrica: 'Total Transacciones', Valor: transactions.length },
        {
          Métrica: 'Transacciones Completadas',
          Valor: transactions.filter((t) => t.status === 'COMPLETED').length
        },
        {
          Métrica: 'Transacciones Pendientes',
          Valor: transactions.filter((t) => t.status === 'PENDING').length
        },
        { Métrica: 'Transacción Promedio', Valor: `S/ ${metrics.averageTransaction.toFixed(2)}` },
        { Métrica: 'Crecimiento Mensual', Valor: `${metrics.monthlyGrowth.toFixed(1)}%` }
      ]

      // Preparar datos por tipo
      const byTypeData = Object.entries(metrics.byType).map(([type, amount]) => ({
        'Tipo de Transacción': this.getTypeName(type),
        'Monto Total': `S/ ${amount.toLocaleString()}`,
        Porcentaje: `${((amount / metrics.totalRevenue) * 100).toFixed(1)}%`
      }))

      // Preparar tendencias
      const trendsData = metrics.trends.map((trend) => ({
        Mes: trend.month,
        Ingresos: `S/ ${trend.revenue.toLocaleString()}`,
        Transacciones: trend.transactions,
        Promedio:
          trend.transactions > 0 ? `S/ ${(trend.revenue / trend.transactions).toFixed(2)}` : 'S/ 0'
      }))

      // Crear workbook
      const wb = XLSX.utils.book_new()

      // Hoja de resumen
      const summaryWS = XLSX.utils.json_to_sheet(summaryData)
      XLSX.utils.book_append_sheet(wb, summaryWS, 'Resumen')

      // Hoja de transacciones
      const transactionsWS = XLSX.utils.json_to_sheet(transactionsData)
      XLSX.utils.book_append_sheet(wb, transactionsWS, 'Transacciones')

      // Hoja por tipo
      if (byTypeData.length > 0) {
        const byTypeWS = XLSX.utils.json_to_sheet(byTypeData)
        XLSX.utils.book_append_sheet(wb, byTypeWS, 'Por Tipo')
      }

      // Hoja de tendencias
      if (trendsData.length > 0) {
        const trendsWS = XLSX.utils.json_to_sheet(trendsData)
        XLSX.utils.book_append_sheet(wb, trendsWS, 'Tendencias')
      }

      // Generar y descargar archivo
      const excelBuffer = XLSX.write(wb, { bookType: 'xlsx', type: 'array' })
      const blob = new Blob([excelBuffer], {
        type: 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet'
      })
      saveAs(blob, fileName)

      await Swal.fire({
        title: 'Excel Generado',
        text: `El archivo ${fileName} ha sido descargado exitosamente`,
        icon: 'success',
        timer: 3000,
        showConfirmButton: false
      })
    } catch (error) {
      console.error('Error generando Excel:', error)
      throw new Error('No se pudo generar el archivo Excel: ' + error.message)
    }
  },

  // ============================================
  // EXPORTACIÓN A PDF
  // ============================================
  async exportToPDF(reportData) {
    try {
      const { transactions, metrics, summary, filters } = reportData
      const currentDate = new Date().toLocaleDateString('es-PE')
      const fileName = `Reporte_Financiero_${currentDate.replace(/\//g, '-')}.pdf`

      const doc = new jsPDF()

      // Header del documento
      doc.setFontSize(18)
      doc.setTextColor(211, 47, 47) // Color rojo HelpMED
      doc.text('HelpMED - Reporte Financiero', 105, 20, { align: 'center' })

      doc.setFontSize(12)
      doc.setTextColor(100, 100, 100)
      doc.text(`Generado el: ${currentDate}`, 105, 30, { align: 'center' })

      // Filtros aplicados
      let yPos = 45
      if (filters.dateFrom || filters.dateTo) {
        doc.setFontSize(10)
        doc.setTextColor(60, 60, 60)
        const filterText = `Período: ${filters.dateFrom || 'Sin límite'} - ${filters.dateTo || 'Sin límite'}`
        doc.text(filterText, 20, yPos)
        yPos += 10
      }

      // Resumen ejecutivo
      yPos += 5
      doc.setFontSize(14)
      doc.setTextColor(25, 118, 210) // Color azul
      doc.text('Resumen Ejecutivo', 20, yPos)
      yPos += 10

      const summaryData = [
        ['Métrica', 'Valor'],
        ['Ingresos Totales', `S/ ${metrics.totalRevenue.toLocaleString()}`],
        ['Ingresos del Mes', `S/ ${metrics.monthlyRevenue.toLocaleString()}`],
        ['Ingresos de Hoy', `S/ ${metrics.dailyRevenue.toLocaleString()}`],
        ['Total Transacciones', transactions.length.toString()],
        [
          'Transacciones Completadas',
          transactions.filter((t) => t.status === 'COMPLETED').length.toString()
        ],
        ['Transacción Promedio', `S/ ${metrics.averageTransaction.toFixed(2)}`],
        ['Crecimiento Mensual', `${metrics.monthlyGrowth.toFixed(1)}%`]
      ]

      doc.autoTable({
        startY: yPos,
        head: [summaryData[0]],
        body: summaryData.slice(1),
        theme: 'striped',
        headStyles: { fillColor: [25, 118, 210] },
        styles: { fontSize: 10 }
      })

      yPos = doc.lastAutoTable.finalY + 15

      // Ingresos por tipo
      if (Object.keys(metrics.byType).length > 0) {
        doc.setFontSize(14)
        doc.setTextColor(25, 118, 210)
        doc.text('Ingresos por Tipo de Transacción', 20, yPos)
        yPos += 10

        const byTypeData = [['Tipo', 'Monto', 'Porcentaje']]

        Object.entries(metrics.byType).forEach(([type, amount]) => {
          byTypeData.push([
            this.getTypeName(type),
            `S/ ${amount.toLocaleString()}`,
            `${((amount / metrics.totalRevenue) * 100).toFixed(1)}%`
          ])
        })

        doc.autoTable({
          startY: yPos,
          head: [byTypeData[0]],
          body: byTypeData.slice(1),
          theme: 'striped',
          headStyles: { fillColor: [76, 175, 80] },
          styles: { fontSize: 10 }
        })

        yPos = doc.lastAutoTable.finalY + 15
      }

      // Nueva página para transacciones si es necesario
      if (yPos > 250) {
        doc.addPage()
        yPos = 20
      }

      // Transacciones detalladas (últimas 20)
      doc.setFontSize(14)
      doc.setTextColor(25, 118, 210)
      doc.text('Transacciones Recientes (Últimas 20)', 20, yPos)
      yPos += 10

      const recentTransactions = transactions.slice(-20)
      const transactionsTableData = [['Fecha', 'Concepto', 'Tipo', 'Monto', 'Estado']]

      recentTransactions.forEach((transaction) => {
        transactionsTableData.push([
          new Date(transaction.date).toLocaleDateString('es-PE'),
          (transaction.concept || '').substring(0, 20) +
            (transaction.concept?.length > 20 ? '...' : ''),
          this.getTypeName(transaction.type).substring(0, 15),
          `S/ ${transaction.amount.toLocaleString()}`,
          transaction.status === 'COMPLETED' ? 'Completado' : 'Pendiente'
        ])
      })

      doc.autoTable({
        startY: yPos,
        head: [transactionsTableData[0]],
        body: transactionsTableData.slice(1),
        theme: 'striped',
        headStyles: { fillColor: [156, 39, 176] },
        styles: { fontSize: 8 },
        columnStyles: {
          0: { cellWidth: 25 },
          1: { cellWidth: 50 },
          2: { cellWidth: 40 },
          3: { cellWidth: 30 },
          4: { cellWidth: 25 }
        }
      })

      // Footer
      const pageCount = doc.internal.getNumberOfPages()
      for (let i = 1; i <= pageCount; i++) {
        doc.setPage(i)
        doc.setFontSize(8)
        doc.setTextColor(100, 100, 100)
        doc.text(`Página ${i} de ${pageCount}`, 105, 285, { align: 'center' })
        doc.text('HelpMED - Sistema de Emergencias Médicas', 105, 290, { align: 'center' })
      }

      // Descargar PDF
      doc.save(fileName)

      await Swal.fire({
        title: 'PDF Generado',
        text: `El archivo ${fileName} ha sido descargado exitosamente`,
        icon: 'success',
        timer: 3000,
        showConfirmButton: false
      })
    } catch (error) {
      console.error('Error generando PDF:', error)
      throw new Error('No se pudo generar el archivo PDF: ' + error.message)
    }
  },

  // ============================================
  // VALIDACIÓN DE TRANSACCIONES
  // ============================================
  validateTransaction(transactionData) {
    const errors = []

    if (!transactionData.concept || transactionData.concept.trim().length < 3) {
      errors.push('El concepto debe tener al menos 3 caracteres')
    }

    if (!transactionData.amount || transactionData.amount <= 0) {
      errors.push('El monto debe ser mayor a 0')
    }

    if (!transactionData.type) {
      errors.push('Debe seleccionar un tipo de transacción')
    }

    if (transactionData.amount > 50000) {
      errors.push('Montos superiores a S/ 50,000 requieren autorización especial')
    }

    return {
      isValid: errors.length === 0,
      errors
    }
  },

  // ============================================
  // CÁLCULOS FINANCIEROS
  // ============================================
  calculateTaxes(amount, taxRate = 0.18) {
    const taxes = amount * taxRate
    const subtotal = amount - taxes

    return {
      subtotal: Math.round(subtotal * 100) / 100,
      taxes: Math.round(taxes * 100) / 100,
      total: Math.round(amount * 100) / 100
    }
  },

  calculateCommission(amount, commissionRate = 0.03) {
    const commission = amount * commissionRate
    const netAmount = amount - commission

    return {
      grossAmount: Math.round(amount * 100) / 100,
      commission: Math.round(commission * 100) / 100,
      netAmount: Math.round(netAmount * 100) / 100
    }
  },

  // ============================================
  // UTILIDADES DE FORMATO
  // ============================================
  formatCurrency(amount) {
    return new Intl.NumberFormat('es-PE', {
      style: 'currency',
      currency: 'PEN'
    }).format(amount)
  },

  getTypeName(type) {
    const typeNames = {
      service_payment: 'Pago de Servicio',
      plan_payment: 'Pago de Plan',
      additional_fee: 'Tarifa Adicional',
      refund: 'Reembolso',
      adjustment: 'Ajuste',
      consultation_fee: 'Consulta Médica',
      emergency_fee: 'Servicio de Emergencia',
      transfer_fee: 'Traslado',
      insurance_payment: 'Pago de Seguro',
      other: 'Otro'
    }
    return typeNames[type] || type
  },

  getStatusColor(status) {
    const colors = {
      COMPLETED: 'success',
      PENDING: 'warning',
      FAILED: 'error',
      CANCELLED: 'secondary'
    }
    return colors[status] || 'secondary'
  },

  // ============================================
  // ANÁLISIS DE TENDENCIAS
  // ============================================
  analyzeTrends(transactions, periods = 6) {
    const trends = []
    const now = new Date()

    for (let i = periods - 1; i >= 0; i--) {
      const date = new Date(now.getFullYear(), now.getMonth() - i, 1)
      const nextMonth = new Date(now.getFullYear(), now.getMonth() - i + 1, 1)

      const monthTransactions = transactions.filter((t) => {
        const tDate = new Date(t.date)
        return tDate >= date && tDate < nextMonth && t.status === 'COMPLETED'
      })

      const revenue = monthTransactions.reduce((sum, t) => sum + t.amount, 0)

      trends.push({
        period: date.toLocaleDateString('es-PE', { year: 'numeric', month: 'short' }),
        transactions: monthTransactions.length,
        revenue,
        averageTransaction: monthTransactions.length > 0 ? revenue / monthTransactions.length : 0
      })
    }

    return trends
  },

  // ============================================
  // MÉTRICAS DE PERFORMANCE
  // ============================================
  calculateKPIs(transactions, revenueSummary) {
    if (!transactions || !revenueSummary) return {}

    const completedTransactions = transactions.filter((t) => t.status === 'COMPLETED')
    const pendingTransactions = transactions.filter((t) => t.status === 'PENDING')

    return {
      totalRevenue: revenueSummary.totalRevenue || 0,
      monthlyRevenue: revenueSummary.byPeriod?.thisMonth || 0,
      dailyRevenue: revenueSummary.byPeriod?.today || 0,
      completionRate:
        transactions.length > 0 ? (completedTransactions.length / transactions.length) * 100 : 0,
      averageTransaction:
        completedTransactions.length > 0
          ? revenueSummary.totalRevenue / completedTransactions.length
          : 0,
      pendingAmount: pendingTransactions.reduce((sum, t) => sum + t.amount, 0),
      transactionVolume: transactions.length,
      conversionRate: 95.5 // Simulado - en producción se calcularía
    }
  }
}

export default financialService
