import Swal from 'sweetalert2'

/**
 * Servicio de generación y exportación de reportes
 * Siguiendo Regla #10: Arquitectura modular clara - Servicios separados
 * Siguiendo Regla #6: Funciones complejas documentadas
 *
 * Proporciona funciones especializadas para:
 * - Generación de reportes PDF con formato profesional
 * - Exportación a Excel con datos estructurados
 * - Templates HTML personalizables por tipo de reporte
 * - Validación de datos antes de exportación
 * - Manejo de errores y feedback visual
 *
 * Tipos de reportes soportados:
 * - Overview: Resumen ejecutivo
 * - Users: Análisis de usuarios
 * - Services: Estadísticas de servicios
 * - Performance: Métricas de rendimiento
 * - Geography: Distribución geográfica
 * - Financial: Reportes financieros
 * - Surveys: Análisis de satisfacción
 */
export const reportService = {
  /**
   * Generar reporte PDF personalizado
   * Crea una ventana de impresión con el contenido específico del reporte
   *
   * @param {Object} options - Opciones del reporte
   * @param {string} options.reportType - Tipo de reporte
   * @param {string} options.title - Título del reporte
   * @param {string} options.content - Contenido HTML del reporte
   * @param {string} options.dateRange - Rango de fechas
   * @param {Object} options.metrics - Métricas del reporte
   * @returns {Promise<Object>} Resultado de la operación
   */
  async generatePDF({ reportType, title, content, dateRange, metrics = {} }) {
    try {
      // Validar parámetros requeridos
      if (!reportType || !title || !content) {
        throw new Error('Faltan parámetros requeridos para generar el PDF')
      }

      const printWindow = window.open('', '_blank')
      if (!printWindow) {
        throw new Error(
          'No se pudo abrir la ventana para el PDF. Verifica que no esté bloqueada por el navegador.'
        )
      }

      const htmlContent = this._generatePDFTemplate({
        reportType,
        title,
        content,
        dateRange,
        metrics
      })

      printWindow.document.write(htmlContent)
      printWindow.document.close()

      await Swal.fire({
        title: 'PDF Preparado',
        text: 'Se ha abierto una nueva ventana. Presiona Ctrl+P para imprimir o guardar como PDF',
        icon: 'info',
        timer: 3000,
        showConfirmButton: false
      })

      return { success: true, message: 'PDF generado correctamente' }
    } catch (error) {
      console.error('Error generando PDF:', error)

      await Swal.fire({
        title: 'Error de PDF',
        text: `No se pudo generar el PDF: ${error.message}`,
        icon: 'error',
        confirmButtonColor: '#DC2626'
      })

      return { success: false, error: error.message }
    }
  },

  /**
   * Exportar reporte a Excel
   * Genera un archivo Excel con los datos del reporte
   *
   * @param {Object} options - Opciones del reporte
   * @param {string} options.reportType - Tipo de reporte
   * @param {string} options.title - Título del reporte
   * @param {Array|string} options.data - Datos para Excel (array o HTML)
   * @param {string} options.dateRange - Rango de fechas
   * @param {Object} options.summary - Resumen de métricas
   * @returns {Promise<Object>} Resultado de la operación
   */
  async exportToExcel({ reportType, title, data, dateRange, summary = {} }) {
    try {
      // Validar parámetros requeridos
      if (!reportType || !title || !data) {
        throw new Error('Faltan parámetros requeridos para exportar a Excel')
      }

      const excelContent = this._generateExcelContent({
        reportType,
        title,
        data,
        dateRange,
        summary
      })

      // Crear archivo Excel
      const blob = new Blob([excelContent], {
        type: 'application/vnd.ms-excel;charset=utf-8'
      })

      const url = URL.createObjectURL(blob)
      const a = document.createElement('a')
      a.href = url
      a.download = `HelpMED_${title.replace(/\s+/g, '_')}_${new Date().toISOString().split('T')[0]}.xls`
      a.style.display = 'none'

      document.body.appendChild(a)
      a.click()
      document.body.removeChild(a)
      URL.revokeObjectURL(url)

      await Swal.fire({
        title: 'Excel Generado',
        text: 'El archivo Excel ha sido descargado exitosamente',
        icon: 'success',
        timer: 2000,
        showConfirmButton: false
      })

      return { success: true, message: 'Excel exportado correctamente' }
    } catch (error) {
      console.error('Error exportando a Excel:', error)

      await Swal.fire({
        title: 'Error de Excel',
        text: `No se pudo exportar a Excel: ${error.message}`,
        icon: 'error',
        confirmButtonColor: '#DC2626'
      })

      return { success: false, error: error.message }
    }
  },

  /**
   * Generar template HTML para PDF
   * Crea el HTML completo con estilos para impresión
   * @private
   */
  _generatePDFTemplate({ reportType, title, content, dateRange, metrics }) {
    const metricsCards = this._generateMetricsCards(metrics)

    return `
      <!DOCTYPE html>
      <html>
        <head>
          <meta charset="utf-8">
          <title>Reporte ${title} - HelpMED</title>
          <style>
            body { 
              font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif; 
              margin: 20px; 
              line-height: 1.6;
              color: #333;
            }
            h1 { 
              color: #d32f2f; 
              text-align: center; 
              border-bottom: 3px solid #d32f2f; 
              padding-bottom: 15px;
              margin-bottom: 30px;
              font-size: 28px;
            }
            h2 { 
              color: #1976d2; 
              border-bottom: 2px solid #1976d2; 
              padding-bottom: 8px;
              margin-top: 30px;
              margin-bottom: 20px;
            }
            h3 {
              color: #424242;
              margin-top: 25px;
              margin-bottom: 15px;
            }
            .header-info { 
              background: linear-gradient(135deg, #f5f5f5 0%, #e8e8e8 100%);
              padding: 20px; 
              border-radius: 8px; 
              margin-bottom: 30px;
              border-left: 4px solid #d32f2f;
            }
            .metrics-container {
              display: flex;
              flex-wrap: wrap;
              gap: 15px;
              margin: 20px 0;
              justify-content: space-around;
            }
            .metric-card { 
              border: 1px solid #ddd; 
              padding: 20px; 
              border-radius: 8px;
              text-align: center;
              min-width: 150px;
              background: #fafafa;
              box-shadow: 0 2px 4px rgba(0,0,0,0.1);
            }
            .metric-value { 
              font-size: 32px; 
              font-weight: bold; 
              color: #1976d2; 
              margin-bottom: 8px;
            }
            .metric-label { 
              color: #666; 
              font-size: 14px;
              font-weight: 500;
            }
            table { 
              border-collapse: collapse; 
              width: 100%; 
              margin: 20px 0;
              box-shadow: 0 2px 8px rgba(0,0,0,0.1);
            }
            th, td { 
              border: 1px solid #ddd; 
              padding: 12px 8px; 
              text-align: left; 
            }
            th { 
              background: linear-gradient(135deg, #f8f9fa 0%, #e9ecef 100%);
              font-weight: 600;
              color: #495057;
              text-transform: uppercase;
              font-size: 12px;
              letter-spacing: 0.5px;
            }
            tr:nth-child(even) {
              background-color: #f8f9fa;
            }
            .status-active { color: #2e7d32; font-weight: bold; }
            .status-inactive { color: #c62828; font-weight: bold; }
            .footer {
              margin-top: 40px;
              padding-top: 20px;
              border-top: 2px solid #eee;
              text-align: center;
              color: #666;
              font-size: 12px;
            }
            @media print {
              body { margin: 0; }
              .no-print { display: none; }
              h1 { page-break-after: avoid; }
              .metric-card { break-inside: avoid; }
              table { page-break-inside: avoid; }
            }
            @page {
              margin: 2cm;
              @bottom-center {
                content: "Página " counter(page) " de " counter(pages);
              }
            }
          </style>
        </head>
        <body>
          <h1>Reporte ${title}</h1>
          
          <div class="header-info">
            <strong>📊 Tipo de Reporte:</strong> ${this._getReportTypeLabel(reportType)}<br>
            <strong>📅 Período:</strong> ${dateRange || 'Todo el período disponible'}<br>
            <strong>🕒 Fecha de generación:</strong> ${new Date().toLocaleDateString('es-PE')} - ${new Date().toLocaleTimeString('es-PE')}<br>
            <strong>🏥 Sistema:</strong> HelpMED - Plataforma de Emergencias Médicas
          </div>
          
          <div class="no-print" style="text-align: center; margin: 30px 0; padding: 20px; background: #f0f0f0; border-radius: 8px;">
            <button onclick="window.print()" style="background: #d32f2f; color: white; border: none; padding: 12px 24px; border-radius: 6px; cursor: pointer; margin-right: 10px; font-size: 14px;">
              🖨️ Imprimir/Guardar como PDF
            </button>
            <button onclick="window.close()" style="background: #666; color: white; border: none; padding: 12px 24px; border-radius: 6px; cursor: pointer; font-size: 14px;">
              ❌ Cerrar
            </button>
          </div>

          ${metricsCards}
          
          <div class="content">
            ${content}
          </div>

          <div class="footer">
            <p>Reporte generado por HelpMED - Sistema de Gestión de Emergencias Médicas</p>
            <p>Para soporte técnico: soporte@helpmed.pe | www.helpmed.pe</p>
          </div>
        </body>
      </html>
    `
  },

  /**
   * Generar contenido Excel estructurado
   * @private
   */
  _generateExcelContent({ reportType, title, data, dateRange, summary }) {
    const summarySection = this._generateExcelSummary(summary)
    const dataSection = Array.isArray(data) ? this._arrayToExcelTable(data) : data

    return `
      <html>
        <head>
          <meta charset="utf-8">
          <style>
            table { border-collapse: collapse; width: 100%; margin: 10px 0; }
            th, td { border: 1px solid #000; padding: 8px; text-align: left; vertical-align: top; }
            th { background-color: #f2f2f2; font-weight: bold; text-align: center; }
            .header { background-color: #d32f2f; color: white; text-align: center; font-weight: bold; }
            .summary { background-color: #e3f2fd; font-weight: bold; }
            .number { text-align: right; }
          </style>
        </head>
        <body>
          <table>
            <tr class="header">
              <td colspan="10">REPORTE ${title.toUpperCase()} - HELPMED</td>
            </tr>
            <tr>
              <td><b>Período:</b></td>
              <td colspan="9">${dateRange || 'Todo el período disponible'}</td>
            </tr>
            <tr>
              <td><b>Generado:</b></td>
              <td colspan="9">${new Date().toLocaleDateString('es-PE')} ${new Date().toLocaleTimeString('es-PE')}</td>
            </tr>
            <tr><td colspan="10"></td></tr>
          </table>

          ${summarySection}
          ${dataSection}

          <table>
            <tr><td colspan="10"></td></tr>
            <tr>
              <td colspan="10" style="text-align: center; color: #666; font-size: 12px;">
                HelpMED - Sistema de Gestión de Emergencias Médicas
              </td>
            </tr>
          </table>
        </body>
      </html>
    `
  },

  /**
   * Generar cards de métricas para PDF
   * @private
   */
  _generateMetricsCards(metrics) {
    if (!metrics || Object.keys(metrics).length === 0) {
      return ''
    }

    const cards = Object.entries(metrics)
      .map(([key, value]) => {
        const label = this._formatMetricLabel(key)
        const formattedValue = this._formatMetricValue(value)

        return `
        <div class="metric-card">
          <div class="metric-value">${formattedValue}</div>
          <div class="metric-label">${label}</div>
        </div>
      `
      })
      .join('')

    return `
      <div class="metrics-container">
        ${cards}
      </div>
    `
  },

  /**
   * Generar resumen para Excel
   * @private
   */
  _generateExcelSummary(summary) {
    if (!summary || Object.keys(summary).length === 0) {
      return ''
    }

    const rows = Object.entries(summary)
      .map(([key, value]) => {
        const label = this._formatMetricLabel(key)
        const formattedValue = this._formatMetricValue(value)

        return `
        <tr class="summary">
          <td><b>${label}</b></td>
          <td class="number"><b>${formattedValue}</b></td>
          <td colspan="8"></td>
        </tr>
      `
      })
      .join('')

    return `
      <table>
        <tr>
          <th colspan="10">RESUMEN EJECUTIVO</th>
        </tr>
        ${rows}
        <tr><td colspan="10"></td></tr>
      </table>
    `
  },

  /**
   * Convertir array a tabla Excel
   * @private
   */
  _arrayToExcelTable(data) {
    if (!Array.isArray(data) || data.length === 0) {
      return '<p>No hay datos para mostrar</p>'
    }

    const headers = Object.keys(data[0])
    const headerRow = headers
      .map((header) => `<th>${this._formatMetricLabel(header)}</th>`)
      .join('')

    const dataRows = data
      .map((item) => {
        const cells = headers
          .map((header) => {
            const value = item[header]
            const cellClass = typeof value === 'number' ? 'number' : ''
            return `<td class="${cellClass}">${this._formatMetricValue(value)}</td>`
          })
          .join('')
        return `<tr>${cells}</tr>`
      })
      .join('')

    return `
      <table>
        <tr>${headerRow}</tr>
        ${dataRows}
      </table>
    `
  },

  /**
   * Formatear etiquetas de métricas
   * @private
   */
  _formatMetricLabel(key) {
    const labels = {
      totalUsers: 'Total Usuarios',
      totalServices: 'Total Servicios',
      totalRevenue: 'Ingresos Totales',
      totalTransactions: 'Transacciones',
      averageResponseTime: 'Tiempo Promedio Respuesta',
      satisfactionRate: 'Índice Satisfacción',
      activeUsers: 'Usuarios Activos',
      pendingServices: 'Servicios Pendientes',
      completedServices: 'Servicios Completados'
    }

    return labels[key] || key.replace(/([A-Z])/g, ' $1').replace(/^./, (str) => str.toUpperCase())
  },

  /**
   * Formatear valores de métricas
   * @private
   */
  _formatMetricValue(value) {
    if (typeof value === 'number') {
      if (value > 1000000) {
        return (value / 1000000).toFixed(1) + 'M'
      } else if (value > 1000) {
        return (value / 1000).toFixed(1) + 'K'
      }
      return value.toLocaleString('es-PE')
    }

    return value || 'N/A'
  },

  /**
   * Obtener etiqueta del tipo de reporte
   * @private
   */
  _getReportTypeLabel(reportType) {
    const types = {
      overview: 'Vista General',
      users: 'Análisis de Usuarios',
      services: 'Estadísticas de Servicios',
      performance: 'Rendimiento Operacional',
      geography: 'Distribución Geográfica',
      finanzas: 'Reportes Financieros',
      surveys: 'Análisis de Satisfacción'
    }

    return types[reportType] || 'Reporte Personalizado'
  }
}
