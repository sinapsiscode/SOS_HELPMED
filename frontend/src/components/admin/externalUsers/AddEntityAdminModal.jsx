import React from 'react'
import { ENTITY_TYPES } from '../../../mocks/externalUsersData'

/**
 * Modal para crear nueva entidad externa con administrador
 * ENFOQUE BALANCEADO: Solo presentación con validación de props
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
  // ============================================
  // VALIDACIÓN DE PROPS (Regla #4)
  // ============================================
  if (typeof isOpen !== 'boolean') {
    console.error('AddEntityAdminModal: isOpen debe ser boolean')
    return null
  }

  if (!entityAdminForm || typeof entityAdminForm !== 'object') {
    console.error('AddEntityAdminModal: entityAdminForm es requerido y debe ser un objeto')
    return null
  }

  if (typeof onClose !== 'function') {
    console.error('AddEntityAdminModal: onClose debe ser una función')
    return null
  }

  if (typeof onSubmit !== 'function') {
    console.error('AddEntityAdminModal: onSubmit debe ser una función')
    return null
  }

  if (typeof updateForm !== 'function') {
    console.error('AddEntityAdminModal: updateForm debe ser una función')
    return null
  }

  if (typeof isLoading !== 'boolean') {
    console.error('AddEntityAdminModal: isLoading debe ser boolean')
    return null
  }

  if (typeof isFormValid !== 'function') {
    console.error('AddEntityAdminModal: isFormValid debe ser una función')
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
              <h3 className="text-xl font-bold text-gray-800">Crear Nueva Entidad Externa</h3>
              <p className="text-sm text-gray-600 mt-1">
                La entidad se creará junto con su administrador obligatorio
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
              Información de la Entidad
            </h4>

            <div className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Nombre de la Entidad *
                </label>
                <input
                  type="text"
                  value={entityAdminForm.entityName}
                  onChange={(e) => updateForm('entityName', e.target.value)}
                  disabled={isLoading}
                  className="w-full px-4 py-2 border rounded-lg focus:ring-2 focus:ring-blue-500 disabled:opacity-50 disabled:bg-gray-100"
                  placeholder="Ej: Banco de la Nación"
                />
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Código de Entidad *
                  </label>
                  <input
                    type="text"
                    value={entityAdminForm.entityCode}
                    onChange={(e) => updateForm('entityCode', e.target.value)}
                    disabled={isLoading}
                    className="w-full px-4 py-2 border rounded-lg focus:ring-2 focus:ring-blue-500 disabled:opacity-50 disabled:bg-gray-100"
                    placeholder="Ej: BN, BCR, RIMAC"
                    maxLength="10"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Tipo de Entidad *
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
              Administrador de la Entidad (Obligatorio)
            </h4>

            <div className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Nombre Completo del Administrador *
                </label>
                <input
                  type="text"
                  value={entityAdminForm.adminName}
                  onChange={(e) => updateForm('adminName', e.target.value)}
                  disabled={isLoading}
                  className="w-full px-4 py-2 border rounded-lg focus:ring-2 focus:ring-green-500 disabled:opacity-50 disabled:bg-gray-100"
                  placeholder="Nombre y apellidos del administrador"
                />
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Usuario de Acceso *
                  </label>
                  <input
                    type="text"
                    value={entityAdminForm.adminUsername}
                    onChange={(e) => updateForm('adminUsername', e.target.value)}
                    disabled={isLoading}
                    className="w-full px-4 py-2 border rounded-lg focus:ring-2 focus:ring-green-500 disabled:opacity-50 disabled:bg-gray-100"
                    placeholder="usuario_admin"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Contraseña *
                  </label>
                  <input
                    type="text"
                    value={entityAdminForm.adminPassword}
                    onChange={(e) => updateForm('adminPassword', e.target.value)}
                    disabled={isLoading}
                    className="w-full px-4 py-2 border rounded-lg focus:ring-2 focus:ring-green-500 disabled:opacity-50 disabled:bg-gray-100"
                    placeholder="Contraseña segura"
                  />
                  <p className="text-xs text-gray-500 mt-1">
                    La contraseña se mostrará al crear el administrador
                  </p>
                </div>
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Email Corporativo *
                  </label>
                  <input
                    type="email"
                    value={entityAdminForm.adminEmail}
                    onChange={(e) => updateForm('adminEmail', e.target.value)}
                    disabled={isLoading}
                    className="w-full px-4 py-2 border rounded-lg focus:ring-2 focus:ring-green-500 disabled:opacity-50 disabled:bg-gray-100"
                    placeholder="admin@entidad.com"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Teléfono de Contacto
                  </label>
                  <input
                    type="tel"
                    value={entityAdminForm.adminPhone}
                    onChange={(e) => updateForm('adminPhone', e.target.value)}
                    disabled={isLoading}
                    className="w-full px-4 py-2 border rounded-lg focus:ring-2 focus:ring-green-500 disabled:opacity-50 disabled:bg-gray-100"
                    placeholder="999-999-999"
                  />
                </div>
              </div>
            </div>
          </div>

          {/* Nota informativa */}
          <div className="bg-yellow-50 border border-yellow-200 rounded-lg p-3">
            <p className="text-sm text-yellow-800">
              <i className="fas fa-info-circle mr-1"></i>
              <strong>Importante:</strong> Una vez creada la entidad con su administrador, el
              administrador podrá agregar usuarios adicionales desde su panel de control.
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
            Cancelar
          </button>
          <button
            onClick={onSubmit}
            disabled={isLoading || !isFormValid()}
            className="px-6 py-2 bg-gradient-to-r from-blue-600 to-green-600 hover:from-blue-700 hover:to-green-700 text-white rounded-lg transition-all disabled:opacity-50 disabled:cursor-not-allowed flex items-center space-x-2"
          >
            {isLoading ? (
              <>
                <i className="fas fa-spinner fa-spin"></i>
                <span>Creando...</span>
              </>
            ) : (
              <>
                <i className="fas fa-plus-circle"></i>
                <span>Crear Entidad y Administrador</span>
              </>
            )}
          </button>
        </div>
      </div>
    </div>
  )
}

export default AddEntityAdminModal
