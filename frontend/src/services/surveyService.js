import Swal from 'sweetalert2'
import jsPDF from 'jspdf'
import 'jspdf-autotable'
import * as XLSX from 'xlsx'
import { saveAs } from 'file-saver'

/**
 * Servicio especializado para gestión y análisis de encuestas
 * Siguiendo Regla #10: Servicios modulares para lógica compleja
 *
 * Proporciona:
 * - Validación de preguntas de encuesta
 * - Cálculos de métricas y análisis (NPS, satisfacción)
 * - Exportación de reportes de encuestas (PDF/Excel)
 * - Análisis de tendencias y distribuciones
 * - Utilidades de formateo para encuestas
 *
 * Cumple reglas de refactorización:
 * - Regla #2: Separación de lógica compleja
 * - Regla #8: Manejo consistente de errores
 * - Regla #10: Arquitectura modular
 */
export const surveyService = {
  // ============================================
  // VALIDACIÓN DE PREGUNTAS
  // ============================================
  validateQuestions(questions) {
    const errors = []

    if (!questions || questions.length === 0) {
      errors.push('Debe haber al menos una pregunta')
    }

    questions.forEach((question, index) => {
      if (!question.text || question.text.trim().length < 5) {
        errors.push(`Pregunta ${index + 1}: El texto debe tener al menos 5 caracteres`)
      }

      if (!question.category || question.category.trim().length === 0) {
        errors.push(`Pregunta ${index + 1}: Debe tener una categoría`)
      }

      if (question.text && question.text.length > 200) {
        errors.push(`Pregunta ${index + 1}: El texto no puede exceder 200 caracteres`)
      }
    })

    // Verificar que no haya preguntas duplicadas
    const questionTexts = questions.map((q) => q.text.trim().toLowerCase())
    const duplicates = questionTexts.filter((text, index) => questionTexts.indexOf(text) !== index)

    if (duplicates.length > 0) {
      errors.push('No puede haber preguntas duplicadas')
    }

    return {
      isValid: errors.length === 0,
      errors
    }
  },

  // ============================================
  // CÁLCULOS DE MÉTRICAS AVANZADAS
  // ============================================
  calculateAdvancedMetrics(responses, questions) {
    if (!responses || responses.length === 0) {
      return {
        satisfactionIndex: 0,
        loyaltyScore: 0,
        qualityScore: 0,
        reliabilityIndex: 0,
        categoryScores: {},
        correlationMatrix: {}
      }
    }

    // Índice de satisfacción general
    const satisfactionIndex = this.calculateSatisfactionIndex(responses)

    // Puntaje de lealtad basado en NPS
    const loyaltyScore = this.calculateLoyaltyScore(responses)

    // Puntaje de calidad promedio
    const qualityScore = this.calculateQualityScore(responses, questions)

    // Índice de confiabilidad (consistencia de respuestas)
    const reliabilityIndex = this.calculateReliabilityIndex(responses)

    // Puntajes por categoría
    const categoryScores = this.calculateCategoryScores(responses, questions)

    // Matriz de correlación entre preguntas
    const correlationMatrix = this.calculateCorrelationMatrix(responses, questions)

    return {
      satisfactionIndex,
      loyaltyScore,
      qualityScore,
      reliabilityIndex,
      categoryScores,
      correlationMatrix
    }
  },

  calculateSatisfactionIndex(responses) {
    const totalRatings = responses.reduce((sum, response) => sum + response.average, 0)
    const maxPossibleRating = responses.length * 5
    return maxPossibleRating > 0 ? Math.round((totalRatings / maxPossibleRating) * 100) : 0
  },

  calculateLoyaltyScore(responses) {
    // Basado en pregunta de recomendación (question5)
    const recommendationRatings = responses
      .map((r) => r.ratings.question5)
      .filter((r) => r !== undefined && r !== null)

    if (recommendationRatings.length === 0) return 0

    const promoters = recommendationRatings.filter((rating) => rating >= 4).length
    const detractors = recommendationRatings.filter((rating) => rating <= 2).length

    return Math.round(((promoters - detractors) / recommendationRatings.length) * 100)
  },

  calculateQualityScore(responses, questions) {
    // Promedio ponderado considerando todas las preguntas de calidad
    const qualityQuestions = questions.filter(
      (q) => q.category === 'calidad' || q.category === 'personal'
    )

    if (qualityQuestions.length === 0) return 0

    let totalScore = 0
    let totalResponses = 0

    qualityQuestions.forEach((question) => {
      responses.forEach((response) => {
        if (response.ratings[question.id]) {
          totalScore += response.ratings[question.id]
          totalResponses++
        }
      })
    })

    return totalResponses > 0 ? Math.round((totalScore / totalResponses) * 20) : 0
  },

  calculateReliabilityIndex(responses) {
    // Mide la consistencia de las respuestas de cada usuario
    let totalConsistency = 0

    responses.forEach((response) => {
      const ratings = Object.values(response.ratings).filter((r) => r !== undefined)
      if (ratings.length > 1) {
        const avg = ratings.reduce((sum, r) => sum + r, 0) / ratings.length
        const variance = ratings.reduce((sum, r) => sum + Math.pow(r - avg, 2), 0) / ratings.length
        const consistency = Math.max(0, 100 - variance * 25) // Penalizar alta varianza
        totalConsistency += consistency
      }
    })

    return responses.length > 0 ? Math.round(totalConsistency / responses.length) : 0
  },

  calculateCategoryScores(responses, questions) {
    const categories = {}

    questions.forEach((question) => {
      const category = question.category
      if (!categories[category]) {
        categories[category] = {
          totalScore: 0,
          totalResponses: 0,
          average: 0
        }
      }

      responses.forEach((response) => {
        if (response.ratings[question.id]) {
          categories[category].totalScore += response.ratings[question.id]
          categories[category].totalResponses++
        }
      })
    })

    // Calcular promedios
    Object.keys(categories).forEach((category) => {
      const cat = categories[category]
      cat.average =
        cat.totalResponses > 0 ? parseFloat((cat.totalScore / cat.totalResponses).toFixed(1)) : 0
    })

    return categories
  },

  calculateCorrelationMatrix(responses, questions) {
    // Matriz de correlación simple entre preguntas
    const matrix = {}

    questions.forEach((q1) => {
      matrix[q1.id] = {}

      questions.forEach((q2) => {
        if (q1.id === q2.id) {
          matrix[q1.id][q2.id] = 1
        } else {
          // Calcular correlación simple
          const pairs = responses
            .map((r) => ({ x: r.ratings[q1.id], y: r.ratings[q2.id] }))
            .filter((p) => p.x !== undefined && p.y !== undefined)

          if (pairs.length > 1) {
            const correlation = this.calculatePearsonCorrelation(pairs)
            matrix[q1.id][q2.id] = parseFloat(correlation.toFixed(2))
          } else {
            matrix[q1.id][q2.id] = 0
          }
        }
      })
    })

    return matrix
  },

  calculatePearsonCorrelation(pairs) {
    const n = pairs.length
    if (n === 0) return 0

    const sumX = pairs.reduce((sum, p) => sum + p.x, 0)
    const sumY = pairs.reduce((sum, p) => sum + p.y, 0)
    const sumXY = pairs.reduce((sum, p) => sum + p.x * p.y, 0)
    const sumX2 = pairs.reduce((sum, p) => sum + p.x * p.x, 0)
    const sumY2 = pairs.reduce((sum, p) => sum + p.y * p.y, 0)

    const numerator = n * sumXY - sumX * sumY
    const denominator = Math.sqrt((n * sumX2 - sumX * sumX) * (n * sumY2 - sumY * sumY))

    return denominator === 0 ? 0 : numerator / denominator
  },

  // ============================================
  // EXPORTACIÓN A PDF
  // ============================================
  async exportToPDF(exportData) {
    try {
      const { metrics, questions, responses, filters } = exportData
      const currentDate = new Date().toLocaleDateString('es-PE')
      const fileName = `Reporte_Encuestas_${currentDate.replace(/\//g, '-')}.pdf`

      const doc = new jsPDF()

      // Header del documento
      doc.setFontSize(18)
      doc.setTextColor(211, 47, 47) // Color rojo HelpMED
      doc.text('HelpMED - Reporte de Encuestas de Satisfacción', 105, 20, { align: 'center' })

      doc.setFontSize(12)
      doc.setTextColor(100, 100, 100)
      doc.text(`Generado el: ${currentDate}`, 105, 30, { align: 'center' })

      let yPos = 45

      // Filtros aplicados
      doc.setFontSize(10)
      doc.setTextColor(60, 60, 60)
      doc.text(
        `Período: ${this.getFilterText(filters.dateFilter)} | Plan: ${this.getFilterText(filters.planFilter, 'plan')}`,
        20,
        yPos
      )
      yPos += 15

      // Resumen ejecutivo
      doc.setFontSize(14)
      doc.setTextColor(25, 118, 210)
      doc.text('Resumen Ejecutivo', 20, yPos)
      yPos += 10

      const summaryData = [
        ['Métrica', 'Valor'],
        ['Total de Respuestas', metrics.totalResponses.toString()],
        ['Calificación Promedio', `${metrics.averageRating}/5.0`],
        ['Net Promoter Score (NPS)', `${metrics.npsScore}%`],
        ['Promotores', metrics.promoters.toString()],
        ['Detractores', metrics.detractors.toString()],
        [
          'Tendencia',
          metrics.satisfactionTrend === 'improving'
            ? 'Mejorando'
            : metrics.satisfactionTrend === 'declining'
              ? 'Declinando'
              : 'Estable'
        ]
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

      // Promedio por pregunta
      if (questions.length > 0) {
        doc.setFontSize(14)
        doc.setTextColor(25, 118, 210)
        doc.text('Calificación por Pregunta', 20, yPos)
        yPos += 10

        const questionData = [['Pregunta', 'Promedio']]
        questions.forEach((question) => {
          const avg = metrics.questionAverages[question.id] || 0
          questionData.push([
            question.text.substring(0, 50) + (question.text.length > 50 ? '...' : ''),
            `${avg.toFixed(1)}/5.0`
          ])
        })

        doc.autoTable({
          startY: yPos,
          head: [questionData[0]],
          body: questionData.slice(1),
          theme: 'striped',
          headStyles: { fillColor: [76, 175, 80] },
          styles: { fontSize: 9 }
        })

        yPos = doc.lastAutoTable.finalY + 15
      }

      // Nueva página para distribución
      if (yPos > 250) {
        doc.addPage()
        yPos = 20
      }

      // Distribución de calificaciones
      doc.setFontSize(14)
      doc.setTextColor(25, 118, 210)
      doc.text('Distribución de Calificaciones', 20, yPos)
      yPos += 10

      const distributionData = [['Calificación', 'Cantidad', 'Porcentaje']]
      Object.entries(metrics.distribution).forEach(([rating, count]) => {
        const percentage =
          metrics.totalResponses > 0 ? ((count / metrics.totalResponses) * 100).toFixed(1) : '0'
        distributionData.push([
          `${rating} estrella${rating !== '1' ? 's' : ''}`,
          count.toString(),
          `${percentage}%`
        ])
      })

      doc.autoTable({
        startY: yPos,
        head: [distributionData[0]],
        body: distributionData.slice(1),
        theme: 'striped',
        headStyles: { fillColor: [156, 39, 176] },
        styles: { fontSize: 10 }
      })

      // Comentarios destacados (si existen)
      const commentsWithRatings = responses
        .filter((r) => r.comments && r.comments.trim().length > 0)
        .sort((a, b) => b.average - a.average)
        .slice(0, 5)

      if (commentsWithRatings.length > 0) {
        yPos = doc.lastAutoTable.finalY + 15

        if (yPos > 250) {
          doc.addPage()
          yPos = 20
        }

        doc.setFontSize(14)
        doc.setTextColor(25, 118, 210)
        doc.text('Comentarios Destacados', 20, yPos)
        yPos += 10

        commentsWithRatings.forEach((response) => {
          if (yPos > 270) {
            doc.addPage()
            yPos = 20
          }

          doc.setFontSize(10)
          doc.setTextColor(0, 0, 0)
          doc.text(`"${response.comments}"`, 20, yPos, { maxWidth: 170 })
          yPos += 10

          doc.setFontSize(8)
          doc.setTextColor(100, 100, 100)
          doc.text(
            `- ${response.patientName} (${response.serviceType}, ${response.average}/5.0)`,
            25,
            yPos
          )
          yPos += 15
        })
      }

      // Footer
      const pageCount = doc.internal.getNumberOfPages()
      for (let i = 1; i <= pageCount; i++) {
        doc.setPage(i)
        doc.setFontSize(8)
        doc.setTextColor(100, 100, 100)
        doc.text(`Página ${i} de ${pageCount}`, 105, 285, { align: 'center' })
        doc.text('HelpMED - Sistema de Encuestas de Satisfacción', 105, 290, { align: 'center' })
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
  // EXPORTACIÓN A EXCEL
  // ============================================
  async exportToExcel(exportData) {
    try {
      const { metrics, questions, responses, filters } = exportData
      const currentDate = new Date().toLocaleDateString('es-PE')
      const fileName = `Reporte_Encuestas_${currentDate.replace(/\//g, '-')}.xlsx`

      const wb = XLSX.utils.book_new()

      // Hoja de resumen
      const summaryData = [
        { Métrica: 'Total de Respuestas', Valor: metrics.totalResponses },
        { Métrica: 'Calificación Promedio', Valor: `${metrics.averageRating}/5.0` },
        { Métrica: 'Net Promoter Score', Valor: `${metrics.npsScore}%` },
        { Métrica: 'Promotores', Valor: metrics.promoters },
        { Métrica: 'Detractores', Valor: metrics.detractors },
        { Métrica: 'Pasivos', Valor: metrics.passives }
      ]

      const summaryWS = XLSX.utils.json_to_sheet(summaryData)
      XLSX.utils.book_append_sheet(wb, summaryWS, 'Resumen')

      // Hoja de respuestas detalladas
      const responsesData = responses.map((response) => ({
        'ID Servicio': response.serviceId,
        'Tipo de Servicio': response.serviceType,
        Cliente: response.patientName,
        Fecha: new Date(response.timestamp).toLocaleDateString('es-PE'),
        'Calificación Promedio': response.average,
        'Tipo de Usuario': response.userType,
        Comentarios: response.comments || '',
        ...Object.keys(response.ratings).reduce((acc, questionId) => {
          const question = questions.find((q) => q.id === questionId)
          acc[question ? question.text.substring(0, 30) : questionId] = response.ratings[questionId]
          return acc
        }, {})
      }))

      const responsesWS = XLSX.utils.json_to_sheet(responsesData)
      XLSX.utils.book_append_sheet(wb, responsesWS, 'Respuestas')

      // Hoja de análisis por pregunta
      const questionAnalysis = questions.map((question) => ({
        Pregunta: question.text,
        Categoría: question.category,
        Promedio: (metrics.questionAverages[question.id] || 0).toFixed(1),
        'Total Respuestas': responses.filter((r) => r.ratings[question.id]).length
      }))

      const questionWS = XLSX.utils.json_to_sheet(questionAnalysis)
      XLSX.utils.book_append_sheet(wb, questionWS, 'Análisis por Pregunta')

      // Hoja de distribución
      const distributionData = Object.entries(metrics.distribution).map(([rating, count]) => ({
        Calificación: `${rating} estrella${rating !== '1' ? 's' : ''}`,
        Cantidad: count,
        Porcentaje:
          metrics.totalResponses > 0
            ? ((count / metrics.totalResponses) * 100).toFixed(1) + '%'
            : '0%'
      }))

      const distributionWS = XLSX.utils.json_to_sheet(distributionData)
      XLSX.utils.book_append_sheet(wb, distributionWS, 'Distribución')

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
  // UTILIDADES
  // ============================================
  getFilterText(filterValue, type = 'date') {
    if (type === 'date') {
      const dateFilters = {
        last7days: 'Últimos 7 días',
        last30days: 'Últimos 30 días',
        last3months: 'Últimos 3 meses',
        all: 'Todo el período'
      }
      return dateFilters[filterValue] || 'Todo el período'
    } else if (type === 'plan') {
      const planFilters = {
        all: 'Todos los planes',
        familiar: 'Plan Familiar',
        corporativo: 'Plan Corporativo'
      }
      return planFilters[filterValue] || 'Todos los planes'
    }
    return filterValue
  },

  formatRating(rating) {
    return `${parseFloat(rating).toFixed(1)}/5.0`
  },

  getCategoryIcon(category) {
    const icons = {
      tiempo: 'fas fa-clock',
      personal: 'fas fa-user-md',
      calidad: 'fas fa-heart',
      comunicacion: 'fas fa-comments',
      recomendacion: 'fas fa-star',
      general: 'fas fa-question'
    }
    return icons[category] || icons.general
  },

  getSatisfactionColor(rating) {
    if (rating >= 4.5) return 'text-green-600'
    if (rating >= 3.5) return 'text-yellow-600'
    if (rating >= 2.5) return 'text-orange-600'
    return 'text-red-600'
  },

  getNPSColor(npsScore) {
    if (npsScore >= 50) return 'text-green-600'
    if (npsScore >= 0) return 'text-yellow-600'
    return 'text-red-600'
  }
}

export default surveyService
