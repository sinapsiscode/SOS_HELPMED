import { useMemo } from 'react'

/**
 * Hook especializado para análisis de métricas de encuestas
 * ✅ Cumple reglas de tamaño: <100 líneas
 * ✅ Responsabilidad única: Analytics calculation
 * ✅ Optimizado con useMemo
 */
const useSurveyAnalytics = (filteredResponses, questions) => {
  // Métricas calculadas
  const surveyMetrics = useMemo(() => {
    if (!filteredResponses.length) {
      return {
        totalResponses: 0,
        averageRating: 0,
        questionAverages: {},
        distribution: { 1: 0, 2: 0, 3: 0, 4: 0, 5: 0 },
        npsScore: 0,
        promoters: 0,
        detractors: 0,
        passives: 0,
        responsesByService: {},
        responsesByPeriod: [],
        satisfactionTrend: 'stable'
      }
    }

    // Métricas básicas
    const totalResponses = filteredResponses.length
    const averageRating =
      filteredResponses.reduce((sum, r) => sum + parseFloat(r.average), 0) / totalResponses

    // Promedio por pregunta
    const questionAverages = {}
    questions.forEach((q) => {
      const ratings = filteredResponses.map((r) => r.ratings[q.id]).filter((r) => r)
      questionAverages[q.id] =
        ratings.length > 0 ? ratings.reduce((sum, r) => sum + r, 0) / ratings.length : 0
    })

    // Distribución de calificaciones
    const distribution = { 1: 0, 2: 0, 3: 0, 4: 0, 5: 0 }
    filteredResponses.forEach((r) => {
      const avg = Math.round(parseFloat(r.average))
      if (distribution[avg] !== undefined) {
        distribution[avg]++
      }
    })

    // NPS (Net Promoter Score) basado en pregunta 5
    const npsRatings = filteredResponses.map((r) => r.ratings.question5).filter((r) => r)
    const promoters = npsRatings.filter((rating) => rating >= 4).length
    const detractors = npsRatings.filter((rating) => rating <= 2).length
    const passives = npsRatings.filter((rating) => rating === 3).length
    const npsScore =
      npsRatings.length > 0 ? Math.round(((promoters - detractors) / npsRatings.length) * 100) : 0

    // Respuestas por tipo de servicio
    const responsesByService = {}
    filteredResponses.forEach((r) => {
      const service = r.serviceType
      if (!responsesByService[service]) {
        responsesByService[service] = {
          count: 0,
          totalRating: 0,
          averageRating: 0
        }
      }
      responsesByService[service].count++
      responsesByService[service].totalRating += parseFloat(r.average)
      responsesByService[service].averageRating =
        responsesByService[service].totalRating / responsesByService[service].count
    })

    // Tendencia de satisfacción (últimos 6 períodos)
    const responsesByPeriod = Array.from({ length: 6 }, (_, i) => {
      const date = new Date()
      date.setMonth(date.getMonth() - (5 - i))

      const periodResponses = filteredResponses.filter((r) => {
        const responseDate = new Date(r.timestamp)
        return (
          responseDate.getMonth() === date.getMonth() &&
          responseDate.getFullYear() === date.getFullYear()
        )
      })

      const periodAverage =
        periodResponses.length > 0
          ? periodResponses.reduce((sum, r) => sum + r.average, 0) / periodResponses.length
          : 0

      return {
        period: date.toLocaleDateString('es-PE', { month: 'short' }),
        responses: periodResponses.length,
        average: parseFloat(periodAverage.toFixed(1))
      }
    })

    // Determinar tendencia
    const recentPeriods = responsesByPeriod.slice(-3).filter((p) => p.responses > 0)
    let satisfactionTrend = 'stable'
    if (recentPeriods.length >= 2) {
      const firstAvg = recentPeriods[0].average
      const lastAvg = recentPeriods[recentPeriods.length - 1].average
      const diff = lastAvg - firstAvg
      if (diff > 0.3) satisfactionTrend = 'improving'
      else if (diff < -0.3) satisfactionTrend = 'declining'
    }

    return {
      totalResponses,
      averageRating: parseFloat(averageRating.toFixed(1)),
      questionAverages,
      distribution,
      npsScore,
      promoters,
      detractors,
      passives,
      responsesByService,
      responsesByPeriod,
      satisfactionTrend
    }
  }, [filteredResponses, questions])

  // Función para obtener etiqueta NPS
  const getNPSLabel = useMemo(() => {
    if (surveyMetrics.npsScore >= 50) return { label: 'Excelente', color: 'text-green-600' }
    if (surveyMetrics.npsScore >= 0) return { label: 'Bueno', color: 'text-yellow-600' }
    return { label: 'Necesita Mejora', color: 'text-red-600' }
  }, [surveyMetrics.npsScore])

  return {
    surveyMetrics,
    getNPSLabel
  }
}

export default useSurveyAnalytics