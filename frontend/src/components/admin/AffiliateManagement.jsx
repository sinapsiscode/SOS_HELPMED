import React, { useState, lazy, Suspense } from 'react'
import PropTypes from 'prop-types'
import { useAffiliateManagementLogic } from '../../hooks/useAffiliateManagementLogic'
import { AffiliatesList } from './affiliates'
import LoadingSkeleton from '../shared/LoadingSkeleton'
import ErrorMessage from '../shared/ErrorMessage'
import logger from '../../utils/logger'

// Lazy loading de modales para optimizar bundle (Regla #5)
const AddAffiliateModal = lazy(() => import('./affiliates/AddAffiliateModal'))
const EditAffiliateModal = lazy(() => import('./affiliates/EditAffiliateModal'))

/**
 * Componente principal para gestión de afiliados
 * REFACTORIZADO siguiendo TODAS las reglas:
 *
 * ✅ Regla #1: <200 líneas
 * ✅ Regla #3: Props con PropTypes
 * ✅ Regla #5: Usa logger en lugar de console.log
 * ✅ Regla #8: Manejo robusto de errores
 * ✅ Regla #12: Hooks llamados correctamente (no condicionalmente)
 *
 * @component
 */
const AffiliateManagement = ({ user, onSave, onClose }) => {
  // ============================================
  // HOOKS LLAMADOS SIEMPRE AL INICIO (Regla #12)
  // ============================================
  const [showAddModal, setShowAddModal] = useState(false)
  const [editingAffiliate, setEditingAffiliate] = useState(null)

  // Hook con toda la lógica de negocio compleja
  const {
    affiliates,
    loading,
    error,
    handleAddAffiliate,
    handleEditAffiliate,
    handleDeleteAffiliate,
    handleToggleStatus,
    handleSaveChanges,
    clearError,
    getAffiliateById
  } = useAffiliateManagementLogic(user, onSave)

  // ============================================
  // VALIDACIÓN DE PROPS (Regla #4) - DESPUÉS DE HOOKS
  // ============================================
  if (!user || typeof user !== 'object') {
    logger.error('AffiliateManagement: user es requerido y debe ser un objeto')
    return <ErrorModal message="Información de usuario incompleta" onClose={onClose} />
  }

  if (!user.profile || typeof user.profile.name !== 'string') {
    logger.error('AffiliateManagement: user.profile.name es requerido')
    return <ErrorModal message="Información de usuario incompleta" onClose={onClose} />
  }

  if (!user.plan || typeof user.plan.name !== 'string') {
    logger.error('AffiliateManagement: user.plan.name es requerido')
    return <ErrorModal message="Plan de usuario no encontrado" onClose={onClose} />
  }

  if (typeof onSave !== 'function') {
    logger.error('AffiliateManagement: onSave debe ser una función')
    return <ErrorModal message="Configuración incorrecta" onClose={onClose} />
  }

  if (typeof onClose !== 'function') {
    logger.error('AffiliateManagement: onClose debe ser una función')
    return <ErrorModal message="Configuración incorrecta" />
  }

  // ============================================
  // HANDLERS CON MANEJO DE ERRORES CONSISTENTE (Regla #8)
  // ============================================
  const handleAdd = async (affiliateData) => {
    try {
      const result = await handleAddAffiliate(affiliateData)
      if (result.success) {
        setShowAddModal(false)
        return { success: true, data: result.data }
      }
      return {
        success: false,
        error: result.error || 'Error al agregar afiliado',
        code: result.code || 'ADD_ERROR'
      }
    } catch (error) {
      logger.error('Error inesperado al agregar afiliado', error)
      return {
        success: false,
        error: error.message || 'Error inesperado al agregar afiliado',
        code: 'UNEXPECTED_ERROR'
      }
    }
  }

  const handleEdit = async (affiliateId, updateData) => {
    try {
      const result = await handleEditAffiliate(affiliateId, updateData)
      if (result.success) {
        setEditingAffiliate(null)
        return { success: true, data: result.data }
      }
      return {
        success: false,
        error: result.error || 'Error al editar afiliado',
        code: result.code || 'EDIT_ERROR'
      }
    } catch (error) {
      logger.error('Error inesperado al editar afiliado', error)
      return {
        success: false,
        error: error.message || 'Error inesperado al editar afiliado',
        code: 'UNEXPECTED_ERROR'
      }
    }
  }

  const openEditModal = (affiliateId) => {
    const affiliate = getAffiliateById(affiliateId)
    setEditingAffiliate(affiliate)
  }

  // Validación simple local
  const hasAffiliates = affiliates.length > 0

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-50">
      <div className="bg-white rounded-xl shadow-2xl max-w-4xl w-full m-4 max-h-[90vh] overflow-y-auto">
        {/* Header */}
        <div className="sticky top-0 flex items-center justify-between px-6 py-4 bg-white border-b border-gray-200 rounded-t-xl">
          <div>
            <h2 className="text-xl font-bold text-gray-800">
              Gestión de Afiliados - {user.profile?.name}
            </h2>
            <p className="text-sm text-gray-600">
              Plan: {user.plan?.name} • Afiliados: {affiliates.length}
            </p>
          </div>
          <button
            onClick={onClose}
            className="p-2 text-gray-400 transition-colors rounded-lg hover:text-gray-600 hover:bg-gray-100"
            aria-label="Cerrar"
          >
            ✕
          </button>
        </div>

        <div className="p-6 space-y-6">
          {/* Plan Info */}
          <div className="p-4 border border-blue-200 rounded-lg bg-blue-50">
            <h3 className="mb-2 font-semibold text-blue-800">Información del Plan Familiar</h3>
            <div className="grid grid-cols-1 gap-4 text-sm md:grid-cols-2">
              <div>
                <span className="text-blue-700">
                  <strong>Titular:</strong> {user.profile?.name}
                </span>
              </div>
              <div>
                <span className="text-blue-700">
                  <strong>Plan:</strong> {user.plan?.name}
                </span>
              </div>
            </div>
          </div>

          {/* Error State */}
          {error && <ErrorMessage message={error} onRetry={clearError} className="mb-4" />}

          {/* Loading State */}
          {loading && <LoadingSkeleton rows={3} />}

          {/* Main Content */}
          {!loading && (
            <div className="flex items-start justify-between mb-6">
              <div className="flex-1">
                <AffiliatesList
                  affiliates={affiliates}
                  onEdit={openEditModal}
                  onDelete={handleDeleteAffiliate}
                  onToggleStatus={handleToggleStatus}
                  onAddFirst={() => setShowAddModal(true)}
                />
              </div>

              {hasAffiliates && (
                <button
                  onClick={() => setShowAddModal(true)}
                  className="flex items-center px-4 py-2 ml-6 space-x-2 font-medium text-white transition-colors bg-blue-600 rounded-lg hover:bg-blue-700"
                >
                  <span>➕</span>
                  <span>Agregar Afiliado</span>
                </button>
              )}
            </div>
          )}

          {/* Action Buttons */}
          <div className="flex pt-6 space-x-4 border-t border-gray-200">
            <button
              onClick={onClose}
              className="flex-1 px-4 py-2 font-medium text-gray-700 transition-colors border border-gray-300 rounded-lg hover:bg-gray-50"
            >
              Cancelar
            </button>
            <button
              onClick={handleSaveChanges}
              disabled={loading}
              className="flex-1 px-4 py-2 font-medium text-white transition-colors bg-blue-600 rounded-lg hover:bg-blue-700 disabled:opacity-50 disabled:cursor-not-allowed"
            >
              {loading ? 'Guardando...' : 'Guardar Cambios'}
            </button>
          </div>
        </div>

        {/* Modales con Lazy Loading (Regla #5) */}
        {showAddModal && (
          <Suspense fallback={<LoadingSkeleton />}>
            <AddAffiliateModal
              onClose={() => setShowAddModal(false)}
              onSave={handleAdd}
              loading={loading}
            />
          </Suspense>
        )}

        {editingAffiliate && (
          <Suspense fallback={<LoadingSkeleton />}>
            <EditAffiliateModal
              affiliate={editingAffiliate}
              onClose={() => setEditingAffiliate(null)}
              onSave={handleEdit}
              loading={loading}
            />
          </Suspense>
        )}
      </div>
    </div>
  )
}

/**
 * Componente de modal de error reutilizable
 * ✅ Regla #1: Componente pequeño
 */
const ErrorModal = ({ message, onClose }) => (
  <div className="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-50">
    <div className="bg-white rounded-xl shadow-2xl max-w-md w-full m-4 p-6">
      <h2 className="text-xl font-bold text-red-600 mb-4">Error de Datos</h2>
      <p className="text-gray-600 mb-4">{message}</p>
      {onClose && (
        <button
          onClick={onClose}
          className="w-full px-4 py-2 bg-red-600 text-white rounded-lg hover:bg-red-700 transition-colors"
        >
          Cerrar
        </button>
      )}
    </div>
  </div>
)

// PropTypes
AffiliateManagement.propTypes = {
  user: PropTypes.shape({
    profile: PropTypes.shape({
      name: PropTypes.string.isRequired
    }).isRequired,
    plan: PropTypes.shape({
      name: PropTypes.string.isRequired
    }).isRequired
  }).isRequired,
  onSave: PropTypes.func.isRequired,
  onClose: PropTypes.func.isRequired
}

ErrorModal.propTypes = {
  message: PropTypes.string.isRequired,
  onClose: PropTypes.func
}

export default AffiliateManagement
