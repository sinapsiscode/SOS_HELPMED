import React from 'react'
import { ENTITY_TYPES } from '../../../mocks/externalUsersData'
import { LABELS } from '../../../config/labels'

/**
 * ${LABELS.admin.externalUsers.addEntityAdminModal.comments.title}
 * ${LABELS.admin.externalUsers.addEntityAdminModal.comments.approach}
 *
 * @param {boolean} isOpen - Si el modal está abierto
 * @param {Object} entityAdminForm - Formulario de entidad con administrador
 * @param {Function} onClose - Función para cerrar modal
 * @param {Function} onSubmit - Función para enviar formulario
 * @param {Function} updateForm - Función para actualizar formulario
 * @param {boolean} isLoading - Estado de carga
 * @param {Function} isFormValid - Función de validación de formulario
 * @returns {JSX.Element|null} Modal de nueva entidad con administrador
 */
const AddEntityAdminModal = ({
  isOpen,
  entityAdminForm,
  onClose,
  onSubmit,
  updateForm,
  isLoading,
  isFormValid
}) => {
  const labels = LABELS.admin.externalUsers.addEntityAdminModal

  // ============================================
  // VALIDACIÓN DE PROPS (Regla #4)
  // ============================================
  if (typeof isOpen !== 'boolean') {
    console.error(labels.errors.isOpenRequired)
    return null
  }

  if (!entityAdminForm || typeof entityAdminForm !== 'object') {
    console.error(labels.errors.entityAdminFormRequired)
    return null
  }

  if (typeof onClose !== 'function') {
    console.error(labels.errors.onCloseRequired)
    return null
  }

  if (typeof onSubmit !== 'function') {
    console.error(labels.errors.onSubmitRequired)
    return null
  }

  if (typeof updateForm !== 'function') {
    console.error(labels.errors.updateFormRequired)
    return null
  }

  if (typeof isLoading !== 'boolean') {
    console.error(labels.errors.isLoadingRequired)
    return null
  }

  if (typeof isFormValid !== 'function') {
    console.error(labels.errors.isFormValidRequired)
    return null
  }

  if (!isOpen) return null

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
      <div className="bg-white rounded-xl shadow-2xl max-w-2xl w-full max-h-[90vh] overflow-y-auto">
        {/* Header */}
        <div className="p-6 border-b bg-gradient-to-r from-blue-50 to-white">
          <div className="flex items-center justify-between">
            <div>
              <h3 className="text-xl font-bold text-gray-800">{labels.title}</h3>
              <p className="text-sm text-gray-600 mt-1">
                {labels.subtitle}
              </p>
            </div>
            <button
              onClick={onClose}
              disabled={isLoading}
              className="text-gray-500 hover:text-gray-700 transition-colors p-1 disabled:opacity-50"
            >
              <i className="fas fa-times text-lg"></i>
            </button>
          </div>
        </div>

        {/* Contenido */}
        <div className="p-6 space-y-6">
          {/* Sección de Entidad */}
          <div className="bg-blue-50 border border-blue-200 rounded-lg p-4">
            <h4 className="font-semibold text-blue-800 mb-3 flex items-center">
              <i className="fas fa-building mr-2"></i>
              {labels.sections.entity.title}
            </h4>

            <div className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  {labels.sections.entity.fields.name.label}
                </label>
                <input
                  type="text"
                  value={entityAdminForm.entityName}
                  onChange={(e) => updateForm('entityName', e.target.value)}
                  disabled={isLoading}
                  className="w-full px-4 py-2 border rounded-lg focus:ring-2 focus:ring-blue-500 disabled:opacity-50 disabled:bg-gray-100"
                  placeholder={labels.sections.entity.fields.name.placeholder}
                />
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    {labels.sections.entity.fields.code.label}
                  </label>
                  <input
                    type="text"
                    value={entityAdminForm.entityCode}
                    onChange={(e) => updateForm('entityCode', e.target.value)}
                    disabled={isLoading}
                    className="w-full px-4 py-2 border rounded-lg focus:ring-2 focus:ring-blue-500 disabled:opacity-50 disabled:bg-gray-100"
                    placeholder={labels.sections.entity.fields.code.placeholder}
                    maxLength="10"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    {labels.sections.entity.fields.type.label}
                  </label>
                  <select
                    value={entityAdminForm.entityType}
                    onChange={(e) => updateForm('entityType', e.target.value)}
                    disabled={isLoading}
                    className="w-full px-4 py-2 border rounded-lg focus:ring-2 focus:ring-blue-500 disabled:opacity-50 disabled:bg-gray-100"
                  >
                    {ENTITY_TYPES.map((type) => (
                      <option key={type.value} value={type.value}>
                        {type.label}
                      </option>
                    ))}
                  </select>
                </div>
              </div>
            </div>
          </div>

          {/* Sección del Administrador */}
          <div className="bg-green-50 border border-green-200 rounded-lg p-4">
            <h4 className="font-semibold text-green-800 mb-3 flex items-center">
              <i className="fas fa-user-shield mr-2"></i>
              {labels.sections.admin.title}
            </h4>

            <div className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  {labels.sections.admin.fields.name.label}
                </label>
                <input
                  type="text"
                  value={entityAdminForm.adminName}
                  onChange={(e) => updateForm('adminName', e.target.value)}
                  disabled={isLoading}
                  className="w-full px-4 py-2 border rounded-lg focus:ring-2 focus:ring-green-500 disabled:opacity-50 disabled:bg-gray-100"
                  placeholder={labels.sections.admin.fields.name.placeholder}
                />
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    {labels.sections.admin.fields.username.label}
                  </label>
                  <input
                    type="text"
                    value={entityAdminForm.adminUsername}
                    onChange={(e) => updateForm('adminUsername', e.target.value)}
                    disabled={isLoading}
                    className="w-full px-4 py-2 border rounded-lg focus:ring-2 focus:ring-green-500 disabled:opacity-50 disabled:bg-gray-100"
                    placeholder={labels.sections.admin.fields.username.placeholder}
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    {labels.sections.admin.fields.password.label}
                  </label>
                  <input
                    type="text"
                    value={entityAdminForm.adminPassword}
                    onChange={(e) => updateForm('adminPassword', e.target.value)}
                    disabled={isLoading}
                    className="w-full px-4 py-2 border rounded-lg focus:ring-2 focus:ring-green-500 disabled:opacity-50 disabled:bg-gray-100"
                    placeholder={labels.sections.admin.fields.password.placeholder}
                  />
                  <p className="text-xs text-gray-500 mt-1">
                    {labels.sections.admin.fields.password.hint}
                  </p>
                </div>
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    {labels.sections.admin.fields.email.label}
                  </label>
                  <input
                    type="email"
                    value={entityAdminForm.adminEmail}
                    onChange={(e) => updateForm('adminEmail', e.target.value)}
                    disabled={isLoading}
                    className="w-full px-4 py-2 border rounded-lg focus:ring-2 focus:ring-green-500 disabled:opacity-50 disabled:bg-gray-100"
                    placeholder={labels.sections.admin.fields.email.placeholder}
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    {labels.sections.admin.fields.phone.label}
                  </label>
                  <input
                    type="tel"
                    value={entityAdminForm.adminPhone}
                    onChange={(e) => updateForm('adminPhone', e.target.value)}
                    disabled={isLoading}
                    className="w-full px-4 py-2 border rounded-lg focus:ring-2 focus:ring-green-500 disabled:opacity-50 disabled:bg-gray-100"
                    placeholder={labels.sections.admin.fields.phone.placeholder}
                  />
                </div>
              </div>
            </div>
          </div>

          {/* Nota informativa */}
          <div className="bg-yellow-50 border border-yellow-200 rounded-lg p-3">
            <p className="text-sm text-yellow-800">
              <i className="fas fa-info-circle mr-1"></i>
              <strong>{labels.note.title}</strong> {labels.note.text}
            </p>
          </div>
        </div>

        {/* Footer */}
        <div className="p-6 border-t bg-gray-50 flex justify-end space-x-3">
          <button
            onClick={onClose}
            disabled={isLoading}
            className="px-6 py-2 border border-gray-300 rounded-lg hover:bg-gray-50 transition-colors disabled:opacity-50"
          >
            {labels.buttons.cancel}
          </button>
          <button
            onClick={onSubmit}
            disabled={isLoading || !isFormValid()}
            className="px-6 py-2 bg-gradient-to-r from-blue-600 to-green-600 hover:from-blue-700 hover:to-green-700 text-white rounded-lg transition-all disabled:opacity-50 disabled:cursor-not-allowed flex items-center space-x-2"
          >
            {isLoading ? (
              <>
                <i className="fas fa-spinner fa-spin"></i>
                <span>{labels.buttons.submitting}</span>
              </>
            ) : (
              <>
                <i className="fas fa-plus-circle"></i>
                <span>{labels.buttons.submit}</span>
              </>
            )}
          </button>
        </div>
      </div>
    </div>
  )
}

export default AddEntityAdminModal
