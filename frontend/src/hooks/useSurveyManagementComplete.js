import { useState, useCallback, useMemo } from 'react'
import { MOCK_SURVEY_RESPONSES } from '../mocks/surveyData'

/**
 * Hook completo para gestión de encuestas de satisfacción
 * Incluye todas las funcionalidades necesarias para SurveyManagement
 */
const useSurveyManagementComplete = (currentUser) => {
  // Estados principales
  const [activeTab, setActiveTab] = useState('configure')
  const [editMode, setEditMode] = useState(false)
  const [questions, setQuestions] = useState([
    {
      id: 1,
      text: '¿Cómo calificarías la calidad del servicio recibido?',
      type: 'rating',
      required: true,
      options: ['1', '2', '3', '4', '5']
    },
    {
      id: 2,
      text: '¿Qué aspecto consideras más importante mejorar?',
      type: 'select',
      required: true,
      options: [
        'Tiempo de respuesta',
        'Atención del personal',
        'Facilidad de uso',
        'Comunicación',
        'Cobertura',
        'Precios'
      ]
    },
    {
      id: 3,
      text: 'Comentarios y sugerencias',
      type: 'text',
      required: false
    }
  ])
  const [dateFilter, setDateFilter] = useState('all')
  const [planFilter, setPlanFilter] = useState('all')
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState(null)

  // Respuestas mockeadas
  const responses = MOCK_SURVEY_RESPONSES || []

  // Filtrar respuestas
  const filteredResponses = useMemo(() => {
    let filtered = [...responses]

    // Filtro por fecha
    if (dateFilter !== 'all') {
      const now = new Date()
      const days = dateFilter === 'week' ? 7 : dateFilter === 'month' ? 30 : 365
      const cutoffDate = new Date(now.setDate(now.getDate() - days))
      filtered = filtered.filter(r => new Date(r.date) >= cutoffDate)
    }

    // Filtro por plan
    if (planFilter !== 'all') {
      filtered = filtered.filter(r => r.userPlan === planFilter)
    }

    return filtered
  }, [responses, dateFilter, planFilter])

  // Métricas de encuestas
  const surveyMetrics = useMemo(() => {
    const total = filteredResponses.length
    if (total === 0) {
      return {
        totalResponses: 0,
        averageRating: 0,
        npsScore: 0,
        completionRate: 0,
        satisfactionLevel: 0,
        distribution: { 1: 0, 2: 0, 3: 0, 4: 0, 5: 0 },
        topImprovementAreas: []
      }
    }

    const ratings = filteredResponses.map(r => r.rating).filter(Boolean)
    const averageRating = ratings.reduce((sum, r) => sum + r, 0) / ratings.length || 0

    // Calcular distribución de calificaciones
    const distribution = ratings.reduce((acc, rating) => {
      acc[rating] = (acc[rating] || 0) + 1
      return acc
    }, { 1: 0, 2: 0, 3: 0, 4: 0, 5: 0 })

    // Calcular NPS
    const promoters = ratings.filter(r => r >= 4).length
    const detractors = ratings.filter(r => r <= 2).length
    const npsScore = ((promoters - detractors) / total) * 100

    // Áreas de mejora más mencionadas
    const improvementAreas = filteredResponses
      .map(r => r.improvementArea)
      .filter(Boolean)
      .reduce((acc, area) => {
        acc[area] = (acc[area] || 0) + 1
        return acc
      }, {})
    
    const topImprovementAreas = Object.entries(improvementAreas)
      .sort(([,a], [,b]) => b - a)
      .slice(0, 5)
      .map(([area, count]) => ({ area, count, percentage: ((count / total) * 100).toFixed(1) }))

    return {
      totalResponses: total,
      averageRating: averageRating.toFixed(1),
      npsScore: Math.round(npsScore),
      completionRate: 95,
      satisfactionLevel: averageRating >= 4 ? 'Alto' : averageRating >= 3 ? 'Medio' : 'Bajo',
      distribution,
      topImprovementAreas
    }
  }, [filteredResponses])

  // Handlers
  const handleTabChange = useCallback((tab) => {
    setActiveTab(tab)
    setEditMode(false)
  }, [])

  const handleDateFilterChange = useCallback((filter) => {
    setDateFilter(filter)
  }, [])

  const handlePlanFilterChange = useCallback((plan) => {
    setPlanFilter(plan)
  }, [])

  const handleQuestionEdit = useCallback((questionId, updates) => {
    setQuestions(prev => 
      prev.map(q => q.id === questionId ? { ...q, ...updates } : q)
    )
  }, [])

  const handleAddQuestion = useCallback(() => {
    const newQuestion = {
      id: Date.now(),
      text: 'Nueva pregunta',
      type: 'text',
      required: false,
      options: []
    }
    setQuestions(prev => [...prev, newQuestion])
  }, [])

  const handleRemoveQuestion = useCallback((questionId) => {
    setQuestions(prev => prev.filter(q => q.id !== questionId))
  }, [])

  const handleSaveQuestions = useCallback(() => {
    // Aquí iría la lógica para guardar en el backend
    console.log('Guardando preguntas:', questions)
    setEditMode(false)
  }, [questions])

  const enableEditMode = useCallback(() => {
    setEditMode(true)
  }, [])

  const cancelEditMode = useCallback(() => {
    setEditMode(false)
    // Restaurar preguntas originales si es necesario
  }, [])

  const handleExportReport = useCallback((format) => {
    console.log(`Exportando reporte en formato ${format}`)
    // Aquí iría la lógica de exportación
  }, [])

  const clearError = useCallback(() => {
    setError(null)
  }, [])

  // Utilidades
  const getDateFilterText = useCallback(() => {
    switch (dateFilter) {
      case 'week': return 'Última semana'
      case 'month': return 'Último mes'
      case 'year': return 'Último año'
      default: return 'Todas las fechas'
    }
  }, [dateFilter])

  const getPlanFilterText = useCallback(() => {
    switch (planFilter) {
      case 'basic': return 'Plan Básico'
      case 'premium': return 'Plan Premium'
      case 'corporate': return 'Plan Corporativo'
      default: return 'Todos los planes'
    }
  }, [planFilter])

  const getNPSLabel = useCallback((score) => {
    if (score >= 50) {
      return {
        label: 'Excelente',
        color: 'text-green-600'
      }
    }
    if (score >= 0) {
      return {
        label: 'Bueno',
        color: 'text-blue-600'
      }
    }
    return {
      label: 'Necesita mejora',
      color: 'text-orange-600'
    }
  }, [])

  // Validaciones
  const hasResponses = filteredResponses.length > 0
  const hasQuestions = questions.length > 0
  const canSave = editMode && hasQuestions

  return {
    // Estados
    activeTab,
    editMode,
    questions,
    dateFilter,
    planFilter,
    loading,
    error,
    
    // Datos
    filteredResponses,
    surveyMetrics,
    
    // Handlers
    handleTabChange,
    handleDateFilterChange,
    handlePlanFilterChange,
    handleQuestionEdit,
    handleAddQuestion,
    handleRemoveQuestion,
    handleSaveQuestions,
    enableEditMode,
    cancelEditMode,
    handleExportReport,
    
    // Utilidades
    getDateFilterText,
    getPlanFilterText,
    getNPSLabel,
    clearError,
    
    // Validaciones
    hasResponses,
    hasQuestions,
    canSave
  }
}

export default useSurveyManagementComplete