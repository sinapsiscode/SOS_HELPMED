import { useState, useMemo, useCallback } from 'react'

/**
 * Hook especializado para filtrado de respuestas de encuestas
 * ✅ Cumple reglas de tamaño: <100 líneas
 * ✅ Responsabilidad única: Filtering logic
 * ✅ Optimizado con useMemo y useCallback
 */
const useSurveyFilters = (surveyResponses, mockResponses) => {
  const [dateFilter, setDateFilter] = useState('last30days')
  const [planFilter, setPlanFilter] = useState('all')

  // Respuestas filtradas
  const filteredResponses = useMemo(() => {
    const responses = surveyResponses || mockResponses

    return responses.filter((response) => {
      let dateMatch = true
      const planMatch = planFilter === 'all' || response.userType === planFilter

      // Aplicar filtro de fecha
      const now = new Date()
      const responseDate = new Date(response.timestamp)

      switch (dateFilter) {
        case 'last7days':
          dateMatch = now - responseDate <= 7 * 24 * 60 * 60 * 1000
          break
        case 'last30days':
          dateMatch = now - responseDate <= 30 * 24 * 60 * 60 * 1000
          break
        case 'last3months':
          dateMatch = now - responseDate <= 90 * 24 * 60 * 60 * 1000
          break
        default:
          dateMatch = true
      }

      return dateMatch && planMatch
    })
  }, [surveyResponses, mockResponses, dateFilter, planFilter])

  // Cambiar filtro de fecha
  const handleDateFilterChange = useCallback((filter) => {
    setDateFilter(filter)
  }, [])

  // Cambiar filtro de plan
  const handlePlanFilterChange = useCallback((filter) => {
    setPlanFilter(filter)
  }, [])

  // Obtener texto del filtro de fecha
  const getDateFilterText = useCallback(() => {
    const filterTexts = {
      last7days: 'Últimos 7 días',
      last30days: 'Últimos 30 días',
      last3months: 'Últimos 3 meses',
      all: 'Todo el período'
    }
    return filterTexts[dateFilter] || 'Todo el período'
  }, [dateFilter])

  // Obtener texto del filtro de plan
  const getPlanFilterText = useCallback(() => {
    const filterTexts = {
      all: 'Todos los planes',
      familiar: 'Plan Familiar',
      corporativo: 'Plan Corporativo'
    }
    return filterTexts[planFilter] || 'Todos los planes'
  }, [planFilter])

  // Limpiar todos los filtros
  const clearAllFilters = useCallback(() => {
    setDateFilter('last30days')
    setPlanFilter('all')
  }, [])

  return {
    // Estados de filtros
    dateFilter,
    planFilter,

    // Datos filtrados
    filteredResponses,

    // Funciones de cambio
    handleDateFilterChange,
    handlePlanFilterChange,
    clearAllFilters,

    // Utilidades
    getDateFilterText,
    getPlanFilterText,

    // Estado de validación
    hasResponses: filteredResponses.length > 0
  }
}

export default useSurveyFilters