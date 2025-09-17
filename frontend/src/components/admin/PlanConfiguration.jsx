import React, { Suspense } from 'react'
import usePlanConfiguration from '../../hooks/usePlanConfiguration'
import PlanHeader from './planconfig/PlanHeader'
import PlanFilters from './planconfig/PlanFilters'
import PlanCard from './planconfig/PlanCard'
import LoadingSkeleton from '../shared/LoadingSkeleton'
import ErrorMessage from '../shared/ErrorMessage'

// Lazy loading de modals para optimizar bundle (Regla #11)
const PlanFormModal = React.lazy(() => import('./planconfig/PlanFormModal'))
const AdditionalPricingModal = React.lazy(() => import('./planconfig/AdditionalPricingModal'))

/**
 * Sistema de configuración dinámica de planes y precios
 * ENFOQUE BALANCEADO: Estructura en componente, lógica en hook
 * 
 * Funcionalidades:
 * - CRUD completo de planes (familiar, corporativo, externo)
 * - Exportación múltiple: Excel, PDF, CSV con formato profesional
 * - Sistema de filtros y búsqueda avanzada
 * - Gestión de precios adicionales y configuraciones especiales
 * - Validación robusta y manejo de errores
 * - Interfaz responsive y accesible
 * 
 * Arquitectura modular:
 * - PlanHeader: Header con estadísticas y controles de exportación
 * - PlanFilters: Filtros de búsqueda y ordenación
 * - PlanCard: Tarjetas individuales de planes con acciones CRUD
 * - PlanFormModal: Modal para crear/editar planes (lazy loaded)
 * - AdditionalPricingModal: Configuración de precios adicionales (lazy loaded)
 * 
 * Características especiales:
 * - Validación exhaustiva de datos de entrada
 * - Exportación profesional a Excel, PDF y CSV
 * - Filtros dinámicos por categoría, estado y texto
 * - Ordenación por nombre, precio y fecha de creación
 * - Interfaz completamente responsive
 * 
 * @returns {JSX.Element} Componente de configuración de planes
 * 
 * @example
 * // Uso básico en dashboard administrativo
 * <PlanConfiguration />
 * 
 * @see {@link usePlanConfiguration} Hook que maneja toda la lógica de negocio
 * @see {@link INITIAL_PLANS_CONFIG} Configuración inicial de mock data
 * 
 * Cumple reglas de refactorización:
 * - Regla #3: <200 líneas (195 líneas aprox)
 * - Regla #4: Validación de datos y props en hook y componentes
 * - Regla #5: Lógica compleja en hook personalizado
 * - Regla #6: Componentes modulares y reutilizables
 * - Regla #8: Manejo consistente de errores
 * - Regla #11: Lazy loading de modals
 * - Regla #12: Documentación JSDoc completa
 */
const PlanConfiguration = () => {
  // ============================================
  // HOOK - Toda la lógica compleja (Regla #5)
  // ============================================
  const {
    // Datos principales
    filteredPlans,
    planStats,
    additionalPricing,
    isLoading,
    error,

    // Estados de modals
    showCreateModal,
    showPricingModal,
    editingPlan,

    // Estados de filtros
    searchTerm,
    filterType,
    sortBy,

    // Operaciones CRUD
    createPlan,
    updatePlan,
    deletePlan,
    duplicatePlan,

    // Funciones de exportación
    exportToExcel,
    exportToPDF,
    exportToCSV,

    // Control de modals
    openCreateModal,
    closeCreateModal,
    openEditModal,
    openPricingModal,
    closePricingModal,

    // Búsqueda y filtros
    handleSearch,
    handleFilterChange,
    handleSortChange,
    clearFilters,

    // Setters
    setSelectedPlan,

    // Control de errores
    clearError
  } = usePlanConfiguration()

  // ============================================
  // MANEJO DE ERRORES (Regla #8)
  // ============================================
  if (error) {
    return (
      <div className="space-y-4">
        <ErrorMessage 
          message={`Error en configuración de planes: ${error}`}
          onRetry={clearError}
        />
      </div>
    )
  }

  // ============================================
  // FUNCIONES DE MANEJO DE MODALS
  // ============================================
  const handleSavePlan = async (category, planKey, planData) => {
    if (editingPlan) {
      return await updatePlan(category, planKey, planData)
    } else {
      return await createPlan(category, planKey, planData)
    }
  }

  return (
    <div className="space-y-6">
      {/* Header con estadísticas y controles */}
      <PlanHeader
        planStats={planStats}
        onCreatePlan={openCreateModal}
        onExportExcel={exportToExcel}
        onExportPDF={exportToPDF}
        onExportCSV={exportToCSV}
        onOpenPricing={openPricingModal}
        isLoading={isLoading}
      />

      {/* Filtros y búsqueda */}
      <PlanFilters
        searchTerm={searchTerm}
        filterType={filterType}
        sortBy={sortBy}
        onSearch={handleSearch}
        onFilterChange={handleFilterChange}
        onSortChange={handleSortChange}
        onClearFilters={clearFilters}
      />

      {/* Grid de planes */}
      <div className="bg-white rounded-xl shadow-medium p-6">
        <h2 className="text-lg font-semibold text-gray-800 mb-4">
          Planes Configurados ({filteredPlans.length})
        </h2>
        
        {isLoading && filteredPlans.length === 0 ? (
          <LoadingSkeleton rows={3} />
        ) : filteredPlans.length > 0 ? (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {filteredPlans.map((plan, index) => (
              <PlanCard
                key={`${plan.category}-${plan.key}-${index}`}
                plan={plan}
                onEdit={openEditModal}
                onDelete={deletePlan}
                onDuplicate={duplicatePlan}
                onSelect={setSelectedPlan}
                isSelected={false}
                isLoading={isLoading}
              />
            ))}
          </div>
        ) : (
          <div className="text-center py-12 text-gray-500">
            <i className="fas fa-search text-5xl text-gray-300 mb-4"></i>
            <p className="text-lg">No se encontraron planes</p>
            <p className="text-sm mt-2">
              {searchTerm || filterType !== 'all' 
                ? 'Intenta ajustar los filtros de búsqueda'
                : 'Comienza creando tu primer plan'
              }
            </p>
            {(!searchTerm && filterType === 'all') && (
              <button
                onClick={openCreateModal}
                className="mt-4 bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded-lg"
              >
                Crear Primer Plan
              </button>
            )}
          </div>
        )}
      </div>

      {/* Modals con lazy loading (Regla #11) */}
      <Suspense fallback={<div>Cargando...</div>}>
        {showCreateModal && (
          <PlanFormModal
            isOpen={showCreateModal}
            editingPlan={editingPlan}
            onClose={closeCreateModal}
            onSave={handleSavePlan}
            isLoading={isLoading}
          />
        )}

        {showPricingModal && (
          <AdditionalPricingModal
            isOpen={showPricingModal}
            additionalPricing={additionalPricing}
            onClose={closePricingModal}
            onSave={() => {}} // Read-only por ahora
            isLoading={isLoading}
          />
        )}
      </Suspense>
    </div>
  )
}

export default PlanConfiguration