import React, { lazy, Suspense } from 'react'
import useExternalUsersManagement from '../../hooks/useExternalUsersManagement'
import { UsersHeader, HierarchicalView } from './externalUsers'
import LoadingSkeleton from '../shared/LoadingSkeleton'
import ErrorMessage from '../shared/ErrorMessage'

// Lazy loading de modal pesado (Regla #5)
const AddEntityAdminModal = lazy(() => import('./externalUsers/AddEntityAdminModal'))

/**
 * Sistema de gestión de usuarios de entidades externas
 * ENFOQUE BALANCEADO: Estructura en componente, lógica en hook
 *
 * Funcionalidades:
 * - Gestión jerárquica: Entidades -> Administradores -> Usuarios
 * - Creación de entidades con administrador obligatorio
 * - Vista expandible/colapsable de entidades
 * - Filtrado y búsqueda avanzada de usuarios
 * - Activación/desactivación de usuarios externos
 * - Estadísticas globales del sistema
 *
 * Arquitectura modular:
 * - UsersHeader: Header con estadísticas, búsqueda y controles
 * - HierarchicalView: Vista jerárquica expandible de entidades
 * - AddEntityAdminModal: Modal para crear entidad con admin (lazy)
 *
 * Notas importantes:
 * - Los usuarios externos se registran desde el aplicativo móvil
 * - Cada entidad debe tener un administrador obligatorio
 * - Solo se permite vista jerárquica para mejor comprensión
 *
 * @returns {JSX.Element} Componente de gestión de usuarios externos
 *
 * @example
 * // Uso básico en dashboard administrativo
 * <ExternalUsersManagement />
 *
 * @see {@link useExternalUsersManagement} Hook que maneja toda la lógica de negocio
 * @see {@link MOCK_EXTERNAL_STRUCTURE} Datos mock de estructura jerárquica
 *
 * Cumple reglas de refactorización:
 * - Regla #3: <200 líneas (145 líneas aprox)
 * - Regla #4: Validación de datos y props
 * - Regla #5: Lógica compleja en hook personalizado + lazy loading
 * - Regla #6: Componentes modulares y reutilizables
 * - Regla #8: Manejo consistente de errores
 * - Regla #12: Documentación JSDoc completa
 */
const ExternalUsersManagement = () => {
  // ============================================
  // HOOK - Toda la lógica compleja (Regla #5)
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
  // MANEJO DE ERRORES (Regla #8)
  // ============================================
  if (error) {
    return (
      <div className="space-y-4">
        <ErrorMessage
          message={`Error en gestión de usuarios externos: ${error}`}
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
          <h3 className="text-lg font-medium text-gray-800 mb-2">No se encontraron resultados</h3>
          <p className="text-gray-600 mb-4">
            No hay entidades, administradores o usuarios que coincidan con "{searchTerm}"
          </p>
          <button
            onClick={() => updateSearchTerm('')}
            className="bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded-lg transition-colors"
          >
            Limpiar búsqueda
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
