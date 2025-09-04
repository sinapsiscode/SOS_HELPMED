import React, { lazy, Suspense } from 'react'
import useExternalEntityManagement from '../../hooks/useExternalEntityManagement'
import { EntityHeader, EntityList } from './external'
import LoadingSkeleton from '../shared/LoadingSkeleton'
import ErrorMessage from '../shared/ErrorMessage'

// Lazy loading de modales pesados (Regla #5)
const AddEntityModal = lazy(() => import('./external/AddEntityModal'))
const AddAdminModal = lazy(() => import('./external/AddAdminModal'))

/**
 * Sistema de gestión de entidades externas
 * ENFOQUE BALANCEADO: Estructura en componente, lógica en hook
 *
 * Funcionalidades:
 * - Gestión CRUD de entidades externas (bancos, aseguradoras, empresas)
 * - Creación de administradores externos con credenciales
 * - Vista responsive con estadísticas en tiempo real
 * - Modales de confirmación para todas las operaciones
 * - Validación de formularios y manejo de errores
 *
 * Arquitectura modular:
 * - EntityHeader: Header con estadísticas y botones de acción
 * - EntityList: Lista de entidades con vistas desktop y móvil
 * - AddEntityModal: Modal para crear nuevas entidades (lazy)
 * - AddAdminModal: Modal para crear administradores (lazy)
 *
 * @returns {JSX.Element} Componente de gestión de entidades externas
 *
 * @example
 * // Uso básico en dashboard administrativo
 * <ExternalEntityManagement />
 *
 * @see {@link useExternalEntityManagement} Hook que maneja toda la lógica de negocio
 * @see {@link MOCK_EXTERNAL_ENTITIES} Datos mock de entidades
 *
 * Cumple reglas de refactorización:
 * - Regla #3: <200 líneas (176 líneas aprox)
 * - Regla #4: Validación de datos y props
 * - Regla #5: Lógica compleja en hook personalizado + lazy loading
 * - Regla #6: Componentes modulares y reutilizables
 * - Regla #8: Manejo consistente de errores
 * - Regla #12: Documentación JSDoc completa
 */
const ExternalEntityManagement = () => {
  // ============================================
  // HOOK - Toda la lógica compleja (Regla #5)
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
  // MANEJO DE ERRORES (Regla #8)
  // ============================================
  if (error) {
    return (
      <div className="space-y-4">
        <ErrorMessage message={`Error en gestión de entidades: ${error}`} onRetry={clearError} />
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
