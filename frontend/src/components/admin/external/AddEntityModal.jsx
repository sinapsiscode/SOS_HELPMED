import React from 'react'
import { ENTITY_TYPES } from '../../../mocks/externalEntityData'

/**
 * Modal para agregar nueva entidad externa
 * ENFOQUE BALANCEADO: Solo presentación con validación de props
 *
 * @param {boolean} isOpen - Si el modal está abierto
 * @param {Object} entityForm - Formulario de entidad
 * @param {Function} onClose - Función para cerrar modal
 * @param {Function} onSubmit - Función para enviar formulario
 * @param {Function} updateEntityForm - Función para actualizar formulario
 * @param {boolean} isLoading - Estado de carga
 * @param {Function} isFormValid - Función de validación de formulario
 * @returns {JSX.Element|null} Modal de nueva entidad
 */
const AddEntityModal = ({
  isOpen,
  entityForm,
  onClose,
  onSubmit,
  updateEntityForm,
  isLoading,
  isFormValid
}) => {
  // ============================================
  // VALIDACIÓN DE PROPS (Regla #4)
  // ============================================
  if (typeof isOpen !== 'boolean') {
    console.error('AddEntityModal: isOpen debe ser boolean')
    return null
  }

  if (!entityForm || typeof entityForm !== 'object') {
    console.error('AddEntityModal: entityForm es requerido y debe ser un objeto')
    return null
  }

  if (typeof onClose !== 'function') {
    console.error('AddEntityModal: onClose debe ser una función')
    return null
  }

  if (typeof onSubmit !== 'function') {
    console.error('AddEntityModal: onSubmit debe ser una función')
    return null
  }

  if (typeof updateEntityForm !== 'function') {
    console.error('AddEntityModal: updateEntityForm debe ser una función')
    return null
  }

  if (typeof isLoading !== 'boolean') {
    console.error('AddEntityModal: isLoading debe ser boolean')
    return null
  }

  if (typeof isFormValid !== 'function') {
    console.error('AddEntityModal: isFormValid debe ser una función')
    return null
  }

  if (!isOpen) return null

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-2 sm:p-4">
      <div className="bg-white rounded-xl shadow-2xl max-w-2xl w-full max-h-[95vh] sm:max-h-[90vh] overflow-y-auto">
        {/* Header */}
        <div className="p-4 sm:p-6 border-b">
          <div className="flex items-center justify-between">
            <h3 className="text-lg sm:text-xl font-bold text-gray-800">Nueva Entidad Externa</h3>
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
          {/* Información básica */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 sm:gap-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Nombre de la Entidad *
              </label>
              <input
                type="text"
                value={entityForm.name}
                onChange={(e) => updateEntityForm('name', e.target.value)}
                disabled={isLoading}
                className="w-full px-4 py-2 border rounded-lg focus:ring-2 focus:ring-blue-500 disabled:opacity-50 disabled:bg-gray-100"
                placeholder="Ej: Banco Nacional"
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">Código *</label>
              <input
                type="text"
                value={entityForm.code}
                onChange={(e) => updateEntityForm('code', e.target.value)}
                disabled={isLoading}
                className="w-full px-4 py-2 border rounded-lg focus:ring-2 focus:ring-blue-500 disabled:opacity-50 disabled:bg-gray-100"
                placeholder="Ej: BN"
                maxLength="10"
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Tipo de Entidad *
              </label>
              <select
                value={entityForm.type}
                onChange={(e) => updateEntityForm('type', e.target.value)}
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

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Límite de Usuarios
              </label>
              <input
                type="number"
                value={entityForm.maxUsers}
                onChange={(e) => updateEntityForm('maxUsers', e.target.value)}
                disabled={isLoading}
                className="w-full px-4 py-2 border rounded-lg focus:ring-2 focus:ring-blue-500 disabled:opacity-50 disabled:bg-gray-100"
                placeholder="Sin límite"
                min="1"
              />
            </div>
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">Descripción</label>
            <textarea
              value={entityForm.description}
              onChange={(e) => updateEntityForm('description', e.target.value)}
              disabled={isLoading}
              className="w-full px-4 py-2 border rounded-lg focus:ring-2 focus:ring-blue-500 disabled:opacity-50 disabled:bg-gray-100"
              rows="2"
              placeholder="Descripción de la entidad..."
            />
          </div>

          {/* Información de contacto */}
          <div className="border-t pt-4">
            <h4 className="font-medium text-gray-800 mb-3">Información de Contacto</h4>
            <div className="grid grid-cols-1 gap-3 sm:gap-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Nombre del Contacto
                </label>
                <input
                  type="text"
                  value={entityForm.contactName}
                  onChange={(e) => updateEntityForm('contactName', e.target.value)}
                  disabled={isLoading}
                  className="w-full px-4 py-2 border rounded-lg focus:ring-2 focus:ring-blue-500 disabled:opacity-50 disabled:bg-gray-100"
                  placeholder="Nombre del contacto principal"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Email del Contacto
                </label>
                <input
                  type="email"
                  value={entityForm.contactEmail}
                  onChange={(e) => updateEntityForm('contactEmail', e.target.value)}
                  disabled={isLoading}
                  className="w-full px-4 py-2 border rounded-lg focus:ring-2 focus:ring-blue-500 disabled:opacity-50 disabled:bg-gray-100"
                  placeholder="contacto@entidad.com"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Teléfono del Contacto
                </label>
                <input
                  type="tel"
                  value={entityForm.contactPhone}
                  onChange={(e) => updateEntityForm('contactPhone', e.target.value)}
                  disabled={isLoading}
                  className="w-full px-4 py-2 border rounded-lg focus:ring-2 focus:ring-blue-500 disabled:opacity-50 disabled:bg-gray-100"
                  placeholder="999-999-999"
                />
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
            Cancelar
          </button>
          <button
            onClick={onSubmit}
            disabled={isLoading || !isFormValid()}
            className="w-full sm:w-auto px-6 py-2 bg-blue-600 hover:bg-blue-700 text-white rounded-lg transition-colors font-medium disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center space-x-2"
          >
            {isLoading ? (
              <>
                <i className="fas fa-spinner fa-spin"></i>
                <span>Creando...</span>
              </>
            ) : (
              <>
                <i className="fas fa-plus"></i>
                <span>Crear Entidad</span>
              </>
            )}
          </button>
        </div>
      </div>
    </div>
  )
}

export default AddEntityModal
