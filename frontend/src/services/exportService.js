import Swal from 'sweetalert2'

/**
 * Servicio de exportación para planes médicos
 * Siguiendo Regla #10: Arquitectura modular clara - Servicios separados
 * Siguiendo Regla #6: Funciones complejas documentadas
 * Siguiendo Regla #8: Manejo consistente de errores
 *
 * Proporciona funciones para exportar datos de planes a múltiples formatos:
 * - Excel (.xls): Formato compatible con Microsoft Excel
 * - PDF: Reporte visual imprimible
 * - CSV: Datos estructurados para análisis
 *
 * Todas las funciones incluyen:
 * - Validación de datos de entrada
 * - Manejo de errores con feedback visual
 * - Formato profesional optimizado
 * - Compatibilidad multiplataforma
 */
export const exportService = {
  /**
   * Exporta la configuración de planes a formato Excel
   * Genera una tabla HTML que Excel puede interpretar correctamente
   *
   * @param {Object} plansConfig - Configuración completa de planes
   * @param {Object} plansConfig.familiar - Planes familiares
   * @param {Object} plansConfig.corporativo - Planes corporativos
   * @param {Object} plansConfig.externo - Planes externos
   * @returns {Promise<Object>} Resultado de la operación
   *
   * @example
   * const result = await exportService.exportToExcel(plansConfig)
   * if (result.success) {
   *   console.log('Archivo Excel descargado')
   * }
   */
  async exportToExcel(plansConfig) {
    try {
      // Validar entrada
      if (!plansConfig || typeof plansConfig !== 'object') {
        throw new Error('Configuración de planes inválida')
      }

      let htmlContent = `
        <html>
          <head>
            <meta charset="utf-8">
            <style>
              table { border-collapse: collapse; width: 100%; }
              th, td { border: 1px solid #000; padding: 8px; text-align: left; }
              th { background-color: #f2f2f2; font-weight: bold; }
              .section-header { background-color: #4CAF50; color: white; font-weight: bold; }
            </style>
          </head>
          <body>
            <h1>Configuración de Planes HelpMED</h1>
            <p>Fecha de exportación: ${new Date().toLocaleDateString('es-PE')} ${new Date().toLocaleTimeString('es-PE')}</p>
      `

      // Generar contenido para cada tipo de plan
      Object.entries(plansConfig).forEach(([planType, plans]) => {
        htmlContent += `
          <h2>Planes ${planType.charAt(0).toUpperCase() + planType.slice(1)}</h2>
          <table>
            <tr class="section-header">
              <th>Nombre</th>
              <th>Descripción</th>
              <th>Estado</th>
              <th>Precio</th>
              <th>Límites/Servicios</th>
              <th>Mercado Objetivo</th>
              <th>Última Actualización</th>
            </tr>
        `

        Object.entries(plans).forEach(([planKey, planData]) => {
          const precio = this._formatPrice(planType, planData)
          const limites = this._formatLimits(planType, planData)

          htmlContent += `
            <tr>
              <td>${planData.name}</td>
              <td>${planData.description}</td>
              <td>${planData.active ? 'Activo' : 'Inactivo'}</td>
              <td>${precio}</td>
              <td>${limites}</td>
              <td>${planData.target_market || 'N/A'}</td>
              <td>${planData.updated_at || 'N/A'}</td>
            </tr>
          `
        })

        htmlContent += '</table><br>'
      })

      htmlContent += '</body></html>'

      // Crear y descargar archivo
      const blob = new Blob([htmlContent], { type: 'application/vnd.ms-excel' })
      const url = URL.createObjectURL(blob)
      const a = document.createElement('a')
      a.href = url
      a.download = `Configuracion_Planes_${new Date().toISOString().split('T')[0]}.xls`
      a.click()
      URL.revokeObjectURL(url)

      // Notificación de éxito
      await Swal.fire({
        title: 'Excel Generado',
        text: 'El archivo Excel ha sido descargado exitosamente',
        icon: 'success',
        timer: 2000,
        showConfirmButton: false
      })

      return { success: true, message: 'Archivo Excel generado correctamente' }
    } catch (error) {
      console.error('Error exportando a Excel:', error)

      await Swal.fire({
        title: 'Error de Exportación',
        text: `No se pudo generar el archivo Excel: ${error.message}`,
        icon: 'error',
        confirmButtonColor: '#DC2626'
      })

      return { success: false, error: error.message }
    }
  },

  /**
   * Genera un reporte PDF con la configuración de planes
   * Crea una nueva ventana optimizada para impresión/guardado
   *
   * @param {Object} plansConfig - Configuración completa de planes
   * @returns {Promise<Object>} Resultado de la operación
   *
   * @example
   * const result = await exportService.exportToPDF(plansConfig)
   */
  async exportToPDF(plansConfig) {
    try {
      // Validar entrada
      if (!plansConfig || typeof plansConfig !== 'object') {
        throw new Error('Configuración de planes inválida')
      }

      const printWindow = window.open('', '_blank')

      let htmlContent = `
        <!DOCTYPE html>
        <html>
          <head>
            <meta charset="utf-8">
            <title>Configuración de Planes HelpMED</title>
            <style>
              body { font-family: Arial, sans-serif; margin: 20px; }
              h1 { color: #d32f2f; text-align: center; }
              h2 { color: #1976d2; border-bottom: 2px solid #1976d2; padding-bottom: 5px; }
              .plan-card { 
                border: 1px solid #ddd; 
                margin: 10px 0; 
                padding: 15px; 
                border-radius: 5px;
                page-break-inside: avoid;
              }
              .plan-header { 
                background-color: #f5f5f5; 
                padding: 10px; 
                margin: -15px -15px 10px -15px; 
                border-radius: 5px 5px 0 0;
              }
              .plan-name { font-size: 18px; font-weight: bold; margin: 0; }
              .plan-status { 
                display: inline-block; 
                padding: 3px 8px; 
                border-radius: 12px; 
                font-size: 12px; 
                margin-left: 10px;
              }
              .active { background-color: #c8e6c9; color: #2e7d32; }
              .inactive { background-color: #ffcdd2; color: #c62828; }
              .detail-row { margin: 5px 0; }
              .label { font-weight: bold; }
              @media print {
                body { margin: 0; }
                .no-print { display: none; }
              }
            </style>
          </head>
          <body>
            <h1>Configuración de Planes HelpMED</h1>
            <p><strong>Fecha de exportación:</strong> ${new Date().toLocaleDateString('es-PE')} - ${new Date().toLocaleTimeString('es-PE')}</p>
            
            <div class="no-print" style="text-align: center; margin: 20px 0;">
              <button onclick="window.print()" style="background: #d32f2f; color: white; border: none; padding: 10px 20px; border-radius: 5px; cursor: pointer;">
                🖨️ Imprimir/Guardar como PDF
              </button>
              <button onclick="window.close()" style="background: #666; color: white; border: none; padding: 10px 20px; border-radius: 5px; cursor: pointer; margin-left: 10px;">
                ❌ Cerrar
              </button>
            </div>
      `

      // Generar contenido para cada tipo de plan
      Object.entries(plansConfig).forEach(([planType, plans]) => {
        htmlContent += `<h2>Planes ${planType.charAt(0).toUpperCase() + planType.slice(1)} (${Object.keys(plans).length})</h2>`

        Object.entries(plans).forEach(([planKey, planData]) => {
          const precio = this._formatPrice(planType, planData)

          htmlContent += `
            <div class="plan-card">
              <div class="plan-header">
                <span class="plan-name">${planData.name}</span>
                <span class="plan-status ${planData.active ? 'active' : 'inactive'}">
                  ${planData.active ? 'Activo' : 'Inactivo'}
                </span>
              </div>
              
              <div class="detail-row">
                <span class="label">Descripción:</span> ${planData.description}
              </div>
              
              <div class="detail-row">
                <span class="label">Precio:</span> ${precio}
              </div>
              
              ${
                planData.target_market
                  ? `
                <div class="detail-row">
                  <span class="label">Mercado Objetivo:</span> ${planData.target_market}
                </div>
              `
                  : ''
              }
              
              <div class="detail-row">
                <span class="label">Última Actualización:</span> ${planData.updated_at || 'N/A'}
              </div>
            </div>
          `
        })
      })

      htmlContent += '</body></html>'

      printWindow.document.write(htmlContent)
      printWindow.document.close()

      // Notificación
      await Swal.fire({
        title: 'PDF Preparado',
        text: 'Se ha abierto una nueva ventana. Usa Ctrl+P para imprimir o guardar como PDF',
        icon: 'info',
        timer: 3000,
        showConfirmButton: false
      })

      return { success: true, message: 'Ventana de PDF abierta correctamente' }
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
   * Exporta datos de planes a formato CSV
   * Compatible con Excel y herramientas de análisis
   *
   * @param {Object} plansConfig - Configuración completa de planes
   * @returns {Promise<Object>} Resultado de la operación
   *
   * @example
   * const result = await exportService.exportToCSV(plansConfig)
   */
  async exportToCSV(plansConfig) {
    try {
      // Validar entrada
      if (!plansConfig || typeof plansConfig !== 'object') {
        throw new Error('Configuración de planes inválida')
      }

      // Preparar datos para CSV
      const csvData = []

      // Header
      csvData.push([
        'Tipo Plan',
        'Nombre',
        'Descripción',
        'Estado',
        'Precio',
        'Límites',
        'Mercado Objetivo',
        'Fecha Creación',
        'Última Actualización'
      ])

      // Datos
      Object.entries(plansConfig).forEach(([planType, plans]) => {
        Object.entries(plans).forEach(([planKey, planData]) => {
          const precio = this._formatPriceSimple(planType, planData)
          const limites = this._formatLimitsSimple(planType, planData)

          csvData.push([
            planType.charAt(0).toUpperCase() + planType.slice(1),
            planData.name,
            planData.description,
            planData.active ? 'Activo' : 'Inactivo',
            precio,
            limites,
            planData.target_market || 'N/A',
            planData.created_at || 'N/A',
            planData.updated_at || 'N/A'
          ])
        })
      })

      // Convertir a CSV con escape correcto
      const csvContent = csvData
        .map((row) => row.map((cell) => `"${String(cell).replace(/"/g, '""')}"`).join(','))
        .join('\n')

      // Crear archivo con BOM para Excel
      const BOM = '\uFEFF'
      const blob = new Blob([BOM + csvContent], { type: 'text/csv;charset=utf-8' })
      const url = URL.createObjectURL(blob)
      const a = document.createElement('a')
      a.href = url
      a.download = `Configuracion_Planes_${new Date().toISOString().split('T')[0]}.csv`
      a.click()
      URL.revokeObjectURL(url)

      // Notificación
      await Swal.fire({
        title: 'CSV Generado',
        text: 'El archivo CSV ha sido descargado. Se abrirá automáticamente en Excel',
        icon: 'success',
        timer: 2000,
        showConfirmButton: false
      })

      return { success: true, message: 'Archivo CSV generado correctamente' }
    } catch (error) {
      console.error('Error exportando a CSV:', error)

      await Swal.fire({
        title: 'Error de CSV',
        text: `No se pudo generar el archivo CSV: ${error.message}`,
        icon: 'error',
        confirmButtonColor: '#DC2626'
      })

      return { success: false, error: error.message }
    }
  },

  // ============================================
  // MÉTODOS PRIVADOS DE FORMATEO
  // ============================================

  /**
   * Formatea precio para mostrar en reportes detallados
   * @private
   */
  _formatPrice(planType, planData) {
    if (planType === 'familiar') {
      return `S/ ${(planData.pricing?.annually || 0).toLocaleString()}/año (S/ ${Math.round((planData.pricing?.annually || 0) / 12).toLocaleString()}/mes)`
    } else if (planType === 'corporativo') {
      return `S/ ${(planData.pricing?.per_employee || 0).toLocaleString()}/empleado`
    } else {
      return 'Facturación variable'
    }
  },

  /**
   * Formatea precio para CSV (formato simple)
   * @private
   */
  _formatPriceSimple(planType, planData) {
    if (planType === 'familiar') {
      return `S/ ${planData.pricing?.annually || 0}/año`
    } else if (planType === 'corporativo') {
      return `S/ ${planData.pricing?.per_employee || 0}/empleado`
    } else {
      return 'Variable'
    }
  },

  /**
   * Formatea límites para mostrar en reportes
   * @private
   */
  _formatLimits(planType, planData) {
    if (planType === 'familiar') {
      return `Emergencias: ${planData.limits?.EMERGENCIA || 'N/A'}, Urgencias: ${planData.limits?.URGENCIA || 'N/A'}`
    } else if (planType === 'corporativo') {
      return `${planData.limits?.services_per_employee || 0} servicios/empleado`
    } else {
      return `${planData.pricing?.annual_services || 0} servicios anuales`
    }
  },

  /**
   * Formatea límites para CSV (formato simple)
   * @private
   */
  _formatLimitsSimple(planType, planData) {
    if (planType === 'familiar') {
      return `Emergencias: ${planData.limits?.EMERGENCIA || 'N/A'} | Urgencias: ${planData.limits?.URGENCIA || 'N/A'}`
    } else {
      return `${planData.limits?.services_per_employee || 0} servicios/empleado`
    }
  }
}
