import React, { lazy, Suspense } from 'react'
import useExternalEntityManagement from '../../hooks/useExternalEntityManagement'
import { EntityHeader, EntityList } from './external'
import LoadingSkeleton from '../shared/LoadingSkeleton'
import ErrorMessage from '../shared/ErrorMessage'
import { LABELS } from '../../config/labels'

// ${LABELS.admin.externalEntityManagement.comments.lazyLoading}
const AddEntityModal = lazy(() => import('./external/AddEntityModal'))
const AddAdminModal = lazy(() => import('./external/AddAdminModal'))

/**
 * ${LABELS.admin.externalEntityManagement.comments.title}
 * ${LABELS.admin.externalEntityManagement.comments.approach}
 *
 * ${LABELS.admin.externalEntityManagement.comments.features.title}
 * ${LABELS.admin.externalEntityManagement.comments.features.crud}
 * ${LABELS.admin.externalEntityManagement.comments.features.adminCreation}
 * ${LABELS.admin.externalEntityManagement.comments.features.responsive}
 * ${LABELS.admin.externalEntityManagement.comments.features.confirmations}
 * ${LABELS.admin.externalEntityManagement.comments.features.validation}
 *
 * ${LABELS.admin.externalEntityManagement.comments.architecture.title}
 * ${LABELS.admin.externalEntityManagement.comments.architecture.header}
 * ${LABELS.admin.externalEntityManagement.comments.architecture.list}
 * ${LABELS.admin.externalEntityManagement.comments.architecture.addEntityModal}
 * ${LABELS.admin.externalEntityManagement.comments.architecture.addAdminModal}
 *
 * @returns {JSX.Element} Componente de gestión de entidades externas
 *
 * ${LABELS.admin.externalEntityManagement.comments.example.title}
 * ${LABELS.admin.externalEntityManagement.comments.example.usage}
 * ${LABELS.admin.externalEntityManagement.comments.example.component}
 *
 * ${LABELS.admin.externalEntityManagement.comments.see.hook}
 * ${LABELS.admin.externalEntityManagement.comments.see.mockData}
 *
 * ${LABELS.admin.externalEntityManagement.comments.rules.title}
 * ${LABELS.admin.externalEntityManagement.comments.rules.rule3}
 * ${LABELS.admin.externalEntityManagement.comments.rules.rule4}
 * ${LABELS.admin.externalEntityManagement.comments.rules.rule5}
 * ${LABELS.admin.externalEntityManagement.comments.rules.rule6}
 * ${LABELS.admin.externalEntityManagement.comments.rules.rule8}
 * ${LABELS.admin.externalEntityManagement.comments.rules.rule12}
 */
const ExternalEntityManagement = () => {
  const labels = LABELS.admin.externalEntityManagement
  
  // ============================================
  // ${LABELS.admin.externalEntityManagement.comments.businessLogic}
  // ============================================
  const {
    // Estados
    entities,
    showAddEntity,
    showAddAdmin,
    entityForm,
    adminForm,
    isLoading,
    error,

    // Datos calculados
    entityStats,
    entitiesWithoutAdmin,

    // Funciones utilitarias
    getEntityTypeIcon,
    getEntityTypeColor,
    getUsagePercentage,
    getUsageColorClass,

    // Funciones de gestión
    handleAddEntity,
    handleCreateAdmin,
    handleToggleEntityStatus,

    // Gestión de formularios
    updateEntityForm,
    updateAdminForm,

    // Gestión de modales
    openAddEntityModal,
    closeAddEntityModal,
    openAddAdminModal,
    closeAddAdminModal,

    // Validaciones
    isEntityFormValid,
    isAdminFormValid,

    // Control de errores
    clearError
  } = useExternalEntityManagement()

  // ============================================
  // ${LABELS.admin.externalEntityManagement.comments.errorHandling}
  // ============================================
  if (error) {
    return (
      <div className="space-y-4">
        <ErrorMessage message={labels.errors.managementError.replace('{error}', error)} onRetry={clearError} />
      </div>
    )
  }

  if (isLoading && !entities.length) {
    return <LoadingSkeleton rows={3} />
  }

  return (
    <div className="space-y-6">
      {/* Header con estadísticas y controles */}
      <EntityHeader
        stats={entityStats}
        onOpenAddEntity={openAddEntityModal}
        onOpenAddAdmin={() => openAddAdminModal()}
      />

      {/* Lista de entidades */}
      <EntityList
        entities={entities}
        onToggleStatus={handleToggleEntityStatus}
        onOpenAddAdmin={openAddAdminModal}
        getEntityTypeIcon={getEntityTypeIcon}
        getEntityTypeColor={getEntityTypeColor}
        getUsagePercentage={getUsagePercentage}
        getUsageColorClass={getUsageColorClass}
      />

      {/* Modales con lazy loading */}
      <Suspense fallback={<LoadingSkeleton rows={1} />}>
        <AddEntityModal
          isOpen={showAddEntity}
          entityForm={entityForm}
          onClose={closeAddEntityModal}
          onSubmit={handleAddEntity}
          updateEntityForm={updateEntityForm}
          isLoading={isLoading}
          isFormValid={isEntityFormValid}
        />
      </Suspense>

      <Suspense fallback={<LoadingSkeleton rows={1} />}>
        <AddAdminModal
          isOpen={showAddAdmin}
          adminForm={adminForm}
          entitiesWithoutAdmin={entitiesWithoutAdmin}
          onClose={closeAddAdminModal}
          onSubmit={handleCreateAdmin}
          updateAdminForm={updateAdminForm}
          isLoading={isLoading}
          isFormValid={isAdminFormValid}
        />
      </Suspense>
    </div>
  )
}

export default ExternalEntityManagement
