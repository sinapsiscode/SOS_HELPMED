import React, { lazy, Suspense } from 'react'
import useExternalUsersManagement from '../../hooks/useExternalUsersManagement'
import { UsersHeader, HierarchicalView } from './externalUsers'
import LoadingSkeleton from '../shared/LoadingSkeleton'
import ErrorMessage from '../shared/ErrorMessage'
import { LABELS } from '../../config/labels'

// ${LABELS.admin.externalUsersManagement.comments.lazyLoading}
const AddEntityAdminModal = lazy(() => import('./externalUsers/AddEntityAdminModal'))

/**
 * ${LABELS.admin.externalUsersManagement.comments.title}
 * ${LABELS.admin.externalUsersManagement.comments.approach}
 *
 * ${LABELS.admin.externalUsersManagement.comments.features.title}
 * ${LABELS.admin.externalUsersManagement.comments.features.hierarchy}
 * ${LABELS.admin.externalUsersManagement.comments.features.entityCreation}
 * ${LABELS.admin.externalUsersManagement.comments.features.expandableView}
 * ${LABELS.admin.externalUsersManagement.comments.features.filtering}
 * ${LABELS.admin.externalUsersManagement.comments.features.activation}
 * ${LABELS.admin.externalUsersManagement.comments.features.stats}
 *
 * ${LABELS.admin.externalUsersManagement.comments.architecture.title}
 * ${LABELS.admin.externalUsersManagement.comments.architecture.header}
 * ${LABELS.admin.externalUsersManagement.comments.architecture.hierarchicalView}
 * ${LABELS.admin.externalUsersManagement.comments.architecture.addEntityAdminModal}
 *
 * ${LABELS.admin.externalUsersManagement.comments.notes.title}
 * ${LABELS.admin.externalUsersManagement.comments.notes.registration}
 * ${LABELS.admin.externalUsersManagement.comments.notes.adminRequired}
 * ${LABELS.admin.externalUsersManagement.comments.notes.viewOnly}
 *
 * @returns {JSX.Element} Componente de gestión de usuarios externos
 *
 * ${LABELS.admin.externalUsersManagement.comments.example.title}
 * ${LABELS.admin.externalUsersManagement.comments.example.usage}
 * ${LABELS.admin.externalUsersManagement.comments.example.component}
 *
 * ${LABELS.admin.externalUsersManagement.comments.see.hook}
 * ${LABELS.admin.externalUsersManagement.comments.see.mockData}
 *
 * ${LABELS.admin.externalUsersManagement.comments.rules.title}
 * ${LABELS.admin.externalUsersManagement.comments.rules.rule3}
 * ${LABELS.admin.externalUsersManagement.comments.rules.rule4}
 * ${LABELS.admin.externalUsersManagement.comments.rules.rule5}
 * ${LABELS.admin.externalUsersManagement.comments.rules.rule6}
 * ${LABELS.admin.externalUsersManagement.comments.rules.rule8}
 * ${LABELS.admin.externalUsersManagement.comments.rules.rule12}
 */
const ExternalUsersManagement = () => {
  const labels = LABELS.admin.externalUsersManagement
  
  // ============================================
  // ${LABELS.admin.externalUsersManagement.comments.businessLogic}
  // ============================================
  const {
    // Estados
    filteredStructure,
    expandedEntity,
    showAddEntity,
    searchTerm,
    viewMode,
    entityAdminForm,
    isLoading,
    error,

    // Datos calculados
    globalStats,

    // Funciones utilitarias
    getEntityIcon,
    getEntityColor,
    getUserStatusColor,
    getUserStatusText,

    // Funciones principales
    handleCreateEntityWithAdmin,
    handleToggleUserStatus,

    // Gestión de formularios
    updateEntityAdminForm,

    // Gestión de vistas
    toggleEntityExpansion,
    toggleViewMode,
    openAddEntityModal,
    closeAddEntityModal,

    // Funciones de búsqueda
    updateSearchTerm,

    // Validaciones
    isEntityAdminFormValid,

    // Control de errores
    clearError,

    // Constantes
    VIEW_MODES
  } = useExternalUsersManagement()

  // ============================================
  // ${LABELS.admin.externalUsersManagement.comments.errorHandling}
  // ============================================
  if (error) {
    return (
      <div className="space-y-4">
        <ErrorMessage
          message={labels.errors.managementError.replace('{error}', error)}
          onRetry={clearError}
        />
      </div>
    )
  }

  if (isLoading && !filteredStructure.length) {
    return <LoadingSkeleton rows={3} />
  }

  return (
    <div className="space-y-6">
      {/* Header con estadísticas, búsqueda y controles */}
      <UsersHeader
        globalStats={globalStats}
        viewMode={viewMode}
        searchTerm={searchTerm}
        onToggleViewMode={toggleViewMode}
        onOpenAddEntity={openAddEntityModal}
        onSearchChange={updateSearchTerm}
      />

      {/* Vista jerárquica (única vista disponible) */}
      {viewMode === VIEW_MODES.HIERARCHICAL && (
        <HierarchicalView
          entities={filteredStructure}
          expandedEntity={expandedEntity}
          onToggleExpansion={toggleEntityExpansion}
          onToggleUserStatus={handleToggleUserStatus}
          getEntityIcon={getEntityIcon}
          getEntityColor={getEntityColor}
          getUserStatusColor={getUserStatusColor}
          getUserStatusText={getUserStatusText}
        />
      )}

      {/* Mensaje si no hay resultados de búsqueda */}
      {filteredStructure.length === 0 && searchTerm && (
        <div className="bg-white rounded-xl shadow-medium p-8 text-center">
          <i className="fas fa-search text-gray-400 text-4xl mb-4"></i>
          <h3 className="text-lg font-medium text-gray-800 mb-2">{labels.search.noResults}</h3>
          <p className="text-gray-600 mb-4">
            {labels.search.noMatchesFor.replace('{searchTerm}', searchTerm)}
          </p>
          <button
            onClick={() => updateSearchTerm('')}
            className="bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded-lg transition-colors"
          >
            {labels.search.clearSearch}
          </button>
        </div>
      )}

      {/* Modal con lazy loading */}
      <Suspense fallback={<LoadingSkeleton rows={1} />}>
        <AddEntityAdminModal
          isOpen={showAddEntity}
          entityAdminForm={entityAdminForm}
          onClose={closeAddEntityModal}
          onSubmit={handleCreateEntityWithAdmin}
          updateForm={updateEntityAdminForm}
          isLoading={isLoading}
          isFormValid={isEntityAdminFormValid}
        />
      </Suspense>
    </div>
  )
}

export default ExternalUsersManagement
