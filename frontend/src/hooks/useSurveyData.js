import { useState, useEffect, useMemo } from 'react'
import useAppStore from '../stores/useAppStore'

/**
 * Hook personalizado para gestión de datos de encuestas
 * Maneja toda la lógica de negocio y cálculos
 */
const useSurveyData = () => {
  const { surveyResponses = [], surveyQuestions } = useAppStore()
  
  // Estados locales para filtros
  const [planFilter, setPlanFilter] = useState('all')
  
  // Inicializar con los últimos 30 días por defecto
  const getDefaultDateRange = () => {
    const endDate = new Date()
    const startDate = new Date()
    startDate.setDate(startDate.getDate() - 30)
    
    return {
      startDate: startDate.toISOString().split('T')[0],
      endDate: endDate.toISOString().split('T')[0]
    }
  }
  
  const [dateRange, setDateRange] = useState(getDefaultDateRange())
  
  // Preguntas por defecto si no hay en el store
  const defaultQuestions = [
    { 
      id: 1, 
      text: '¿Qué tan satisfecho está con la rapidez de nuestro servicio?',
      category: 'calidad',
      active: true
    },
    { 
      id: 2, 
      text: '¿Cómo calificaría la profesionalidad de nuestro personal?',
      category: 'personal', 
      active: true
    },
    { 
      id: 3, 
      text: '¿Qué tan satisfecho está con la calidad de la atención médica recibida?',
      category: 'calidad',
      active: true
    },
    { 
      id: 4, 
      text: '¿Cómo calificaría la comunicación durante el servicio?',
      category: 'comunicación',
      active: true
    },
    { 
      id: 5, 
      text: '¿Recomendaría nuestros servicios a familiares y amigos?',
      category: 'recomendación',
      active: true
    }
  ]
  
  const questions = surveyQuestions || defaultQuestions

  // Filtrar respuestas según los filtros activos
  const filteredResponses = useMemo(() => {
    let filtered = [...surveyResponses]
    
    // Filtro por fecha - siempre usar el rango personalizado
    if (dateRange.startDate && dateRange.endDate) {
      const startDate = new Date(dateRange.startDate)
      const endDate = new Date(dateRange.endDate)
      endDate.setHours(23, 59, 59, 999) // Incluir todo el día final
      
      filtered = filtered.filter(r => {
        const responseDate = new Date(r.date)
        return responseDate >= startDate && responseDate <= endDate
      })
    }
    
    // Filtro por plan
    if (planFilter !== 'all') {
      filtered = filtered.filter(r => r.plan === planFilter)
    }
    
    return filtered
  }, [surveyResponses, dateRange, planFilter])

  // Calcular métricas
  const metrics = useMemo(() => {
    const total = filteredResponses.length
    
    if (total === 0) {
      return {
        totalResponses: 0,
        averageRating: 0,
        npsScore: 0,
        todayResponses: 0,
        responseRate: 0
      }
    }
    
    // Calcular promedio de calificación
    const totalRating = filteredResponses.reduce((sum, r) => {
      const avgQuestionRating = r.ratings 
        ? Object.values(r.ratings).reduce((a, b) => a + b, 0) / Object.values(r.ratings).length
        : 0
      return sum + avgQuestionRating
    }, 0)
    const averageRating = totalRating / total
    
    // Calcular NPS (Net Promoter Score)
    const promoters = filteredResponses.filter(r => {
      const recommendationRating = r.ratings?.[5] || 0 // Pregunta 5 es de recomendación
      return recommendationRating >= 4
    }).length
    
    const detractors = filteredResponses.filter(r => {
      const recommendationRating = r.ratings?.[5] || 0
      return recommendationRating <= 2
    }).length
    
    const npsScore = Math.round(((promoters - detractors) / total) * 100)
    
    // Respuestas de hoy
    const today = new Date()
    today.setHours(0, 0, 0, 0)
    const todayResponses = filteredResponses.filter(r => {
      const responseDate = new Date(r.date)
      responseDate.setHours(0, 0, 0, 0)
      return responseDate.getTime() === today.getTime()
    }).length
    
    // Tasa de respuesta (simulada)
    const responseRate = 78 // En producción esto vendría del backend
    
    return {
      totalResponses: total,
      averageRating: averageRating.toFixed(1),
      npsScore,
      todayResponses,
      responseRate
    }
  }, [filteredResponses])

  // Calcular promedios por pregunta
  const questionAverages = useMemo(() => {
    if (filteredResponses.length === 0) {
      return questions.map(q => ({ ...q, average: 0 }))
    }
    
    return questions.map(q => {
      const ratings = filteredResponses
        .map(r => r.ratings?.[q.id] || 0)
        .filter(rating => rating > 0)
      
      const average = ratings.length > 0 
        ? ratings.reduce((a, b) => a + b, 0) / ratings.length 
        : 0
        
      return { ...q, average: average.toFixed(1) }
    })
  }, [filteredResponses, questions])

  // Calcular distribución de calificaciones
  const ratingsDistribution = useMemo(() => {
    const distribution = { 1: 0, 2: 0, 3: 0, 4: 0, 5: 0 }
    
    filteredResponses.forEach(response => {
      if (response.ratings) {
        Object.values(response.ratings).forEach(rating => {
          if (rating >= 1 && rating <= 5) {
            distribution[rating]++
          }
        })
      }
    })
    
    const total = Object.values(distribution).reduce((a, b) => a + b, 0)
    
    return Object.entries(distribution).map(([rating, count]) => ({
      rating: parseInt(rating),
      count,
      percentage: total > 0 ? Math.round((count / total) * 100) : 0
    })).reverse() // Para mostrar de 5 a 1
  }, [filteredResponses])

  // Obtener respuestas recientes para la tabla
  const recentResponses = useMemo(() => {
    return filteredResponses
      .sort((a, b) => new Date(b.date) - new Date(a.date))
      .slice(0, 10)
      .map(r => ({
        ...r,
        averageRating: r.ratings 
          ? (Object.values(r.ratings).reduce((a, b) => a + b, 0) / Object.values(r.ratings).length).toFixed(1)
          : 0
      }))
  }, [filteredResponses])

  return {
    questions,
    metrics,
    questionAverages,
    ratingsDistribution,
    recentResponses,
    planFilter,
    setPlanFilter,
    dateRange,
    setDateRange,
    totalResponses: filteredResponses.length
  }
}

export default useSurveyData