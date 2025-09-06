import React from 'react'
import { LABELS } from '../../../config/labels'

/**
 * ${LABELS.admin.external.addAdminModal.comments.title}
 * ${LABELS.admin.external.addAdminModal.comments.approach}
 *
 * @param {boolean} isOpen - Si el modal está abierto
 * @param {Object} adminForm - Formulario de administrador
 * @param {Array} entitiesWithoutAdmin - Entidades sin administrador
 * @param {Function} onClose - Función para cerrar modal
 * @param {Function} onSubmit - Función para enviar formulario
 * @param {Function} updateAdminForm - Función para actualizar formulario
 * @param {boolean} isLoading - Estado de carga
 * @param {Function} isFormValid - Función de validación de formulario
 * @returns {JSX.Element|null} Modal de nuevo administrador
 */
const AddAdminModal = ({
  isOpen,
  adminForm,
  entitiesWithoutAdmin,
  onClose,
  onSubmit,
  updateAdminForm,
  isLoading,
  isFormValid
}) => {
  const labels = LABELS.admin.external.addAdminModal

  // ============================================
  // VALIDACIÓN DE PROPS (Regla #4)
  // ============================================
  if (typeof isOpen !== 'boolean') {
    console.error(labels.errors.isOpenRequired)
    return null
  }

  if (!adminForm || typeof adminForm !== 'object') {
    console.error(labels.errors.adminFormRequired)
    return null
  }

  if (!Array.isArray(entitiesWithoutAdmin)) {
    console.error(labels.errors.entitiesRequired)
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

  if (typeof updateAdminForm !== 'function') {
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
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-2 sm:p-4">
      <div className="bg-white rounded-xl shadow-2xl max-w-lg w-full max-h-[95vh] sm:max-h-[90vh] overflow-y-auto">
        {/* Header */}
        <div className="p-4 sm:p-6 border-b">
          <div className="flex items-center justify-between">
            <h3 className="text-lg sm:text-xl font-bold text-gray-800">
              {labels.title}
            </h3>
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
        <div className="p-4 sm:p-6 space-y-4">
          {/* Selección de entidad */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">{labels.fields.entity.label}</label>
            <select
              value={adminForm.entityId}
              onChange={(e) => updateAdminForm('entityId', e.target.value)}
              disabled={isLoading}
              className="w-full px-4 py-2 border rounded-lg focus:ring-2 focus:ring-green-500 disabled:opacity-50 disabled:bg-gray-100"
            >
              <option value="">{labels.fields.entity.placeholder}</option>
              {entitiesWithoutAdmin.map((entity) => (
                <option key={entity.id} value={entity.id}>
                  {labels.fields.entity.format.replace('{name}', entity.name).replace('{code}', entity.code)}
                </option>
              ))}
            </select>
          </div>

          {/* Credenciales */}
          <div className="grid grid-cols-1 gap-3 sm:gap-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">{labels.fields.username.label}</label>
              <input
                type="text"
                value={adminForm.username}
                onChange={(e) => updateAdminForm('username', e.target.value)}
                disabled={isLoading}
                className="w-full px-4 py-2 border rounded-lg focus:ring-2 focus:ring-green-500 disabled:opacity-50 disabled:bg-gray-100"
                placeholder={labels.fields.username.placeholder}
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">{labels.fields.password.label}</label>
              <input
                type="text"
                value={adminForm.password}
                onChange={(e) => updateAdminForm('password', e.target.value)}
                disabled={isLoading}
                className="w-full px-4 py-2 border rounded-lg focus:ring-2 focus:ring-green-500 disabled:opacity-50 disabled:bg-gray-100"
                placeholder={labels.fields.password.placeholder}
              />
              <p className="text-xs text-gray-500 mt-1">
                {labels.fields.password.hint}
              </p>
            </div>
          </div>

          {/* Información personal */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              {labels.fields.name.label}
            </label>
            <input
              type="text"
              value={adminForm.name}
              onChange={(e) => updateAdminForm('name', e.target.value)}
              disabled={isLoading}
              className="w-full px-4 py-2 border rounded-lg focus:ring-2 focus:ring-green-500 disabled:opacity-50 disabled:bg-gray-100"
              placeholder={labels.fields.name.placeholder}
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">{labels.fields.email.label}</label>
            <input
              type="email"
              value={adminForm.email}
              onChange={(e) => updateAdminForm('email', e.target.value)}
              disabled={isLoading}
              className="w-full px-4 py-2 border rounded-lg focus:ring-2 focus:ring-green-500 disabled:opacity-50 disabled:bg-gray-100"
              placeholder={labels.fields.email.placeholder}
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">{labels.fields.phone.label}</label>
            <input
              type="tel"
              value={adminForm.phone}
              onChange={(e) => updateAdminForm('phone', e.target.value)}
              disabled={isLoading}
              className="w-full px-4 py-2 border rounded-lg focus:ring-2 focus:ring-green-500 disabled:opacity-50 disabled:bg-gray-100"
              placeholder={labels.fields.phone.placeholder}
            />
          </div>

          {/* Información importante */}
          <div className="bg-yellow-50 border border-yellow-200 rounded-lg p-3">
            <div className="flex items-start space-x-2">
              <i className="fas fa-info-circle text-yellow-600 mt-1 flex-shrink-0"></i>
              <div className="text-sm text-yellow-800">
                <p className="font-medium mb-1">{labels.privileges.title}</p>
                <ul className="list-disc list-inside space-y-1">
                  {labels.privileges.items.map((item, index) => (
                    <li key={index}>{item}</li>
                  ))}
                </ul>
              </div>
            </div>
          </div>
        </div>

        {/* Footer */}
        <div className="p-4 sm:p-6 border-t flex flex-col sm:flex-row justify-end space-y-2 sm:space-y-0 sm:space-x-3">
          <button
            onClick={onClose}
            disabled={isLoading}
            className="w-full sm:w-auto px-6 py-2 border border-gray-300 rounded-lg hover:bg-gray-50 transition-colors disabled:opacity-50"
          >
            {labels.buttons.cancel}
          </button>
          <button
            onClick={onSubmit}
            disabled={isLoading || !isFormValid()}
            className="w-full sm:w-auto px-6 py-2 bg-green-600 hover:bg-green-700 text-white rounded-lg transition-colors disabled:opacity-50 disabled:cursor-not-allowed font-medium flex items-center justify-center space-x-2"
          >
            {isLoading ? (
              <>
                <i className="fas fa-spinner fa-spin"></i>
                <span>{labels.buttons.submitting}</span>
              </>
            ) : (
              <>
                <i className="fas fa-user-shield"></i>
                <span>{labels.buttons.submit}</span>
              </>
            )}
          </button>
        </div>
      </div>
    </div>
  )
}

export default AddAdminModal
