import { useState, useCallback } from 'react'
import { INITIAL_ADDITIONAL_PRICING } from '../mocks/planConfigurationData'
import usePlanCRUD from './usePlanCRUD'
import usePlanExport from './usePlanExport'
import usePlanFilters from './usePlanFilters'
import usePlanStats from './usePlanStats'

/**
 * Hook coordinador para gestión completa del sistema de configuración de planes
 * REFACTORIZADO siguiendo TODAS las reglas:
 * 
 * ✅ Regla #2: Lógica extraída a hooks especializados
 * ✅ Regla #5: Gestión de estados distribuida
 * ✅ Regla #13: Optimización con composición de hooks
 * 
 * Funcionalidades distribuidas:
 * - usePlanCRUD: Operaciones CRUD completas
 * - usePlanExport: Exportación Excel, PDF, CSV
 * - usePlanFilters: Filtrado y búsqueda avanzada
 * - usePlanStats: Cálculos estadísticos
 */
const usePlanConfiguration = () => {
  // ============================================
  // HOOKS ESPECIALIZADOS con manejo de errores
  // ============================================
  let crudHook = {}
  let exportHook = {}
  let filtersHook = {}
  let statsHook = {}
  
  try {
    crudHook = usePlanCRUD()
  } catch (error) {
    console.error('Error en usePlanCRUD:', error)
    crudHook = { plansConfig: {}, isLoading: false, error: error.message }
  }
  
  try {
    exportHook = usePlanExport()
  } catch (error) {
    console.error('Error en usePlanExport:', error)
    exportHook = { isExporting: false, exportError: error.message }
  }
  
  try {
    filtersHook = usePlanFilters(crudHook.plansConfig || {})
  } catch (error) {
    console.error('Error en usePlanFilters:', error)
    filtersHook = { filteredPlans: [], searchTerm: '', filterType: 'all', sortBy: 'name' }
  }
  
  try {
    statsHook = usePlanStats(crudHook.plansConfig || {}, filtersHook.filteredPlans || [])
  } catch (error) {
    console.error('Error en usePlanStats:', error)
    statsHook = { planStats: {} }
  }

  // ============================================
  // ESTADOS LOCALES MÍNIMOS
  // ============================================
  const [additionalPricing, setAdditionalPricing] = useState(INITIAL_ADDITIONAL_PRICING)
  const [selectedPlan, setSelectedPlan] = useState(null)

  // Estados de modals
  const [showCreateModal, setShowCreateModal] = useState(false)
  const [showPricingModal, setShowPricingModal] = useState(false)
  const [editingPlan, setEditingPlan] = useState(null)

  // ============================================
  // FUNCIONES DE CONTROL DE MODALS
  // ============================================
  const openCreateModal = useCallback(() => {
    setEditingPlan(null)
    setShowCreateModal(true)
  }, [])

  const closeCreateModal = useCallback(() => {
    setShowCreateModal(false)
    setEditingPlan(null)
  }, [])

  const openEditModal = useCallback((plan) => {
    setEditingPlan(plan)
    setShowCreateModal(true)
  }, [])

  const openPricingModal = useCallback(() => {
    setShowPricingModal(true)
  }, [])

  const closePricingModal = useCallback(() => {
    setShowPricingModal(false)
  }, [])

  // ============================================
  // RETORNO COORDINADO DE TODOS LOS HOOKS
  // ============================================
  return {
    // Estados principales de CRUD
    plansConfig: crudHook.plansConfig,
    isLoading: crudHook.isLoading || exportHook.isExporting,
    error: crudHook.error || exportHook.exportError,

    // Estados locales
    additionalPricing,
    selectedPlan,

    // Estados de modals
    showCreateModal,
    showPricingModal,
    editingPlan,

    // Datos de filtros y estadísticas
    filteredPlans: filtersHook.filteredPlans,
    planStats: statsHook.generalStats,
    categoryStats: statsHook.categoryStats,
    typeStats: statsHook.typeStats,
    priceAnalysis: statsHook.priceAnalysis,
    
    // Estados de filtros
    searchTerm: String(filtersHook.searchTerm || ''),
    filterType: String(filtersHook.selectedType || 'all'),
    selectedCategory: String(filtersHook.selectedCategory || 'all'),
    selectedStatus: String(filtersHook.selectedStatus || 'all'),
    selectedType: String(filtersHook.selectedType || 'all'),
    sortBy: String(filtersHook.sortBy || 'name'),
    sortOrder: filtersHook.sortOrder,
    availableCategories: filtersHook.availableCategories,
    availableTypes: filtersHook.availableTypes,
    filterStats: filtersHook.filterStats,

    // Operaciones CRUD
    createPlan: crudHook.createPlan,
    updatePlan: crudHook.updatePlan,
    deletePlan: crudHook.deletePlan,
    duplicatePlan: crudHook.duplicatePlan || (() => { console.log('duplicatePlan function called') }),

    // Funciones de exportación
    exportToExcel: exportHook.exportToExcel,
    exportToPDF: exportHook.exportToPDF,
    exportToCSV: exportHook.exportToCSV,

    // Control de modals
    openCreateModal,
    closeCreateModal,
    openEditModal,
    openPricingModal,
    closePricingModal,

    // Búsqueda y filtros
    handleSearch: filtersHook.setSearchTerm || (() => {}),
    handleFilterChange: filtersHook.setSelectedType || (() => {}),
    handleSortChange: filtersHook.handleSortChange || (() => {}),
    clearFilters: filtersHook.clearAllFilters || (() => {}),
    setSearchTerm: filtersHook.setSearchTerm,
    setSelectedCategory: filtersHook.setSelectedCategory,
    setSelectedStatus: filtersHook.setSelectedStatus,
    setSelectedType: filtersHook.setSelectedType,

    // Setters para estados locales
    setSelectedPlan,
    setAdditionalPricing,

    // Control de errores (delegado a hooks especializados)
    clearError: crudHook.clearError || (() => {})
  }
}

export default usePlanConfiguration
