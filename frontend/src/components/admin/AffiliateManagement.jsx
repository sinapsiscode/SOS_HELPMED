import React, { useState, lazy, Suspense } from 'react'
import PropTypes from 'prop-types'
import { useAffiliateManagementLogic } from '../../hooks/useAffiliateManagementLogic'
import { AffiliatesList } from './affiliates'
import LoadingSkeleton from '../shared/LoadingSkeleton'
import ErrorMessage from '../shared/ErrorMessage'
import logger from '../../utils/logger'
import { LABELS } from '../../config/labels'

// Lazy loading de modales para optimizar bundle (Regla #5)
const AddAffiliateModal = lazy(() => import('./affiliates/AddAffiliateModal'))
const EditAffiliateModal = lazy(() => import('./affiliates/EditAffiliateModal'))

/**
 * ${LABELS.admin.affiliateManagement.comments.title}
 * ${LABELS.admin.affiliateManagement.comments.refactored}
 *
 * ${LABELS.admin.affiliateManagement.comments.rules.rule1}
 * ${LABELS.admin.affiliateManagement.comments.rules.rule3}
 * ${LABELS.admin.affiliateManagement.comments.rules.rule5}
 * ${LABELS.admin.affiliateManagement.comments.rules.rule8}
 * ${LABELS.admin.affiliateManagement.comments.rules.rule12}
 *
 * @component
 */
const AffiliateManagement = ({ user, onSave, onClose }) => {
  // Labels configuration
  const labels = LABELS.admin.affiliateManagement
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
    logger.error(labels.errors.userRequired)
    return <ErrorModal message={labels.errors.incompleteUserInfo} onClose={onClose} />
  }

  if (!user.profile || typeof user.profile.name !== 'string') {
    logger.error(labels.errors.profileNameRequired)
    return <ErrorModal message={labels.errors.incompleteUserInfo} onClose={onClose} />
  }

  if (!user.plan || typeof user.plan.name !== 'string') {
    logger.error(labels.errors.planNameRequired)
    return <ErrorModal message={labels.errors.userPlanNotFound} onClose={onClose} />
  }

  if (typeof onSave !== 'function') {
    logger.error(labels.errors.onSaveFunction)
    return <ErrorModal message={labels.errors.incorrectConfig} onClose={onClose} />
  }

  if (typeof onClose !== 'function') {
    logger.error(labels.errors.onCloseFunction)
    return <ErrorModal message={labels.errors.incorrectConfig} />
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
        error: result.error || labels.errors.addError,
        code: result.code || 'ADD_ERROR'
      }
    } catch (error) {
      logger.error(labels.errors.unexpectedAddError, error)
      return {
        success: false,
        error: error.message || labels.errors.unexpectedAddError,
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
        error: result.error || labels.errors.editError,
        code: result.code || 'EDIT_ERROR'
      }
    } catch (error) {
      logger.error(labels.errors.unexpectedEditError, error)
      return {
        success: false,
        error: error.message || labels.errors.unexpectedEditError,
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
              {labels.header.title.replace('{name}', user.profile?.name)}
            </h2>
            <p className="text-sm text-gray-600">
              {labels.header.subtitle.replace('{plan}', user.plan?.name).replace('{count}', affiliates.length)}
            </p>
          </div>
          <button
            onClick={onClose}
            className="p-2 text-gray-400 transition-colors rounded-lg hover:text-gray-600 hover:bg-gray-100"
            aria-label={labels.header.closeAriaLabel}
          >
            ✕
          </button>
        </div>

        <div className="p-6 space-y-6">
          {/* Plan Info */}
          <div className="p-4 border border-blue-200 rounded-lg bg-blue-50">
            <h3 className="mb-2 font-semibold text-blue-800">{labels.planInfo.title}</h3>
            <div className="grid grid-cols-1 gap-4 text-sm md:grid-cols-2">
              <div>
                <span className="text-blue-700">
                  <strong>{labels.planInfo.owner}</strong> {user.profile?.name}
                </span>
              </div>
              <div>
                <span className="text-blue-700">
                  <strong>{labels.planInfo.plan}</strong> {user.plan?.name}
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
                  <span>{labels.buttons.addAffiliate}</span>
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
              {labels.buttons.cancel}
            </button>
            <button
              onClick={handleSaveChanges}
              disabled={loading}
              className="flex-1 px-4 py-2 font-medium text-white transition-colors bg-blue-600 rounded-lg hover:bg-blue-700 disabled:opacity-50 disabled:cursor-not-allowed"
            >
              {loading ? labels.buttons.saving : labels.buttons.saveChanges}
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
 * ${LABELS.admin.affiliateManagement.comments.errorModalTitle}
 * ${LABELS.admin.affiliateManagement.comments.errorModalRule}
 */
const ErrorModal = ({ message, onClose }) => {
  const labels = LABELS.admin.affiliateManagement
  
  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-50">
      <div className="bg-white rounded-xl shadow-2xl max-w-md w-full m-4 p-6">
        <h2 className="text-xl font-bold text-red-600 mb-4">{labels.errorModal.title}</h2>
        <p className="text-gray-600 mb-4">{message}</p>
        {onClose && (
          <button
            onClick={onClose}
            className="w-full px-4 py-2 bg-red-600 text-white rounded-lg hover:bg-red-700 transition-colors"
          >
            {labels.buttons.close}
          </button>
        )}
      </div>
    </div>
  )
}

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
