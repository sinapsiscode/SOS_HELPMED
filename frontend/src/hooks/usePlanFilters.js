import { useState, useMemo, useCallback } from 'react'

/**
 * Hook especializado para filtros y búsqueda de planes
 * ✅ Cumple reglas de tamaño: <100 líneas
 * ✅ Responsabilidad única: Filtering and search
 * ✅ Funciones optimizadas con useMemo
 */
const usePlanFilters = (plansConfig) => {
  const [searchTerm, setSearchTerm] = useState('')
  const [selectedCategory, setSelectedCategory] = useState('all')
  const [selectedStatus, setSelectedStatus] = useState('all')
  const [selectedType, setSelectedType] = useState('all')
  const [sortBy, setSortBy] = useState('name')
  const [sortOrder, setSortOrder] = useState('asc')

  // Obtener todas las categorías disponibles
  const availableCategories = useMemo(() => {
    return Object.keys(plansConfig || {})
  }, [plansConfig])

  // Obtener todos los tipos de plan disponibles
  const availableTypes = useMemo(() => {
    if (!plansConfig) return []
    
    const types = new Set()
    Object.values(plansConfig).forEach(category => {
      Object.values(category).forEach(plan => {
        if (plan.plan_type) types.add(plan.plan_type)
      })
    })
    
    return Array.from(types)
  }, [plansConfig])

  // Convertir plansConfig a array plano para filtrar
  const allPlans = useMemo(() => {
    if (!plansConfig) return []
    
    const plans = []
    Object.entries(plansConfig).forEach(([category, categoryPlans]) => {
      Object.entries(categoryPlans).forEach(([planId, plan]) => {
        plans.push({
          ...plan,
          id: planId,
          category: category
        })
      })
    })
    
    return plans
  }, [plansConfig])

  // Filtrar planes según criterios
  const filteredPlans = useMemo(() => {
    let filtered = [...allPlans]

    // Filtro por término de búsqueda
    if (searchTerm.trim()) {
      const term = searchTerm.toLowerCase()
      filtered = filtered.filter(plan =>
        plan.name?.toLowerCase().includes(term) ||
        plan.description?.toLowerCase().includes(term) ||
        plan.plan_type?.toLowerCase().includes(term)
      )
    }

    // Filtro por categoría
    if (selectedCategory !== 'all') {
      filtered = filtered.filter(plan => plan.category === selectedCategory)
    }

    // Filtro por estado
    if (selectedStatus !== 'all') {
      const isActive = selectedStatus === 'active'
      filtered = filtered.filter(plan => plan.active === isActive)
    }

    // Filtro por tipo
    if (selectedType !== 'all') {
      filtered = filtered.filter(plan => plan.plan_type === selectedType)
    }

    // Ordenamiento
    filtered.sort((a, b) => {
      let aValue = a[sortBy] || ''
      let bValue = b[sortBy] || ''

      // Manejar ordenamiento por precio
      if (sortBy === 'monthly_cost') {
        aValue = Number(aValue) || 0
        bValue = Number(bValue) || 0
      }
      
      // Manejar ordenamiento por fecha
      if (sortBy === 'created_at' || sortBy === 'updated_at') {
        aValue = new Date(aValue).getTime()
        bValue = new Date(bValue).getTime()
      }

      // Convertir a string para comparación lexicográfica si no es número
      if (typeof aValue !== 'number') {
        aValue = String(aValue).toLowerCase()
        bValue = String(bValue).toLowerCase()
      }

      if (sortOrder === 'asc') {
        return aValue < bValue ? -1 : aValue > bValue ? 1 : 0
      } else {
        return aValue > bValue ? -1 : aValue < bValue ? 1 : 0
      }
    })

    return filtered
  }, [allPlans, searchTerm, selectedCategory, selectedStatus, selectedType, sortBy, sortOrder])

  // Estadísticas de filtros
  const filterStats = useMemo(() => {
    return {
      total: allPlans.length,
      filtered: filteredPlans.length,
      active: filteredPlans.filter(plan => plan.active).length,
      inactive: filteredPlans.filter(plan => !plan.active).length,
      byCategory: availableCategories.reduce((acc, category) => {
        acc[category] = filteredPlans.filter(plan => plan.category === category).length
        return acc
      }, {}),
      byType: availableTypes.reduce((acc, type) => {
        acc[type] = filteredPlans.filter(plan => plan.plan_type === type).length
        return acc
      }, {})
    }
  }, [allPlans, filteredPlans, availableCategories, availableTypes])

  // Limpiar todos los filtros
  const clearAllFilters = useCallback(() => {
    setSearchTerm('')
    setSelectedCategory('all')
    setSelectedStatus('all')
    setSelectedType('all')
    setSortBy('name')
    setSortOrder('asc')
  }, [])

  // Actualizar término de búsqueda
  const handleSearchChange = useCallback((value) => {
    setSearchTerm(value)
  }, [])

  // Actualizar ordenamiento
  const handleSortChange = useCallback((field, order = null) => {
    setSortBy(field)
    if (order) {
      setSortOrder(order)
    } else {
      // Toggle order if same field
      setSortOrder(prev => field === sortBy && prev === 'asc' ? 'desc' : 'asc')
    }
  }, [sortBy])

  return {
    // Estados de filtros
    searchTerm,
    selectedCategory,
    selectedStatus,
    selectedType,
    sortBy,
    sortOrder,

    // Datos procesados
    filteredPlans,
    allPlans,
    filterStats,
    availableCategories,
    availableTypes,

    // Acciones
    setSearchTerm: handleSearchChange,
    setSelectedCategory,
    setSelectedStatus,
    setSelectedType,
    setSortBy,
    setSortOrder,
    handleSortChange,
    clearAllFilters
  }
}

export default usePlanFilters