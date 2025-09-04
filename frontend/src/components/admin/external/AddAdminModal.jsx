import React from 'react'

/**
 * Modal para crear administrador externo
 * ENFOQUE BALANCEADO: Solo presentación con validación de props
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
  // ============================================
  // VALIDACIÓN DE PROPS (Regla #4)
  // ============================================
  if (typeof isOpen !== 'boolean') {
    console.error('AddAdminModal: isOpen debe ser boolean')
    return null
  }

  if (!adminForm || typeof adminForm !== 'object') {
    console.error('AddAdminModal: adminForm es requerido y debe ser un objeto')
    return null
  }

  if (!Array.isArray(entitiesWithoutAdmin)) {
    console.error('AddAdminModal: entitiesWithoutAdmin debe ser un array')
    return null
  }

  if (typeof onClose !== 'function') {
    console.error('AddAdminModal: onClose debe ser una función')
    return null
  }

  if (typeof onSubmit !== 'function') {
    console.error('AddAdminModal: onSubmit debe ser una función')
    return null
  }

  if (typeof updateAdminForm !== 'function') {
    console.error('AddAdminModal: updateAdminForm debe ser una función')
    return null
  }

  if (typeof isLoading !== 'boolean') {
    console.error('AddAdminModal: isLoading debe ser boolean')
    return null
  }

  if (typeof isFormValid !== 'function') {
    console.error('AddAdminModal: isFormValid debe ser una función')
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
              Crear Administrador Externo
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
            <label className="block text-sm font-medium text-gray-700 mb-2">Entidad *</label>
            <select
              value={adminForm.entityId}
              onChange={(e) => updateAdminForm('entityId', e.target.value)}
              disabled={isLoading}
              className="w-full px-4 py-2 border rounded-lg focus:ring-2 focus:ring-green-500 disabled:opacity-50 disabled:bg-gray-100"
            >
              <option value="">Selecciona una entidad</option>
              {entitiesWithoutAdmin.map((entity) => (
                <option key={entity.id} value={entity.id}>
                  {entity.name} ({entity.code})
                </option>
              ))}
            </select>
          </div>

          {/* Credenciales */}
          <div className="grid grid-cols-1 gap-3 sm:gap-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">Usuario *</label>
              <input
                type="text"
                value={adminForm.username}
                onChange={(e) => updateAdminForm('username', e.target.value)}
                disabled={isLoading}
                className="w-full px-4 py-2 border rounded-lg focus:ring-2 focus:ring-green-500 disabled:opacity-50 disabled:bg-gray-100"
                placeholder="usuario_admin"
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">Contraseña *</label>
              <input
                type="text"
                value={adminForm.password}
                onChange={(e) => updateAdminForm('password', e.target.value)}
                disabled={isLoading}
                className="w-full px-4 py-2 border rounded-lg focus:ring-2 focus:ring-green-500 disabled:opacity-50 disabled:bg-gray-100"
                placeholder="Contraseña segura"
              />
              <p className="text-xs text-gray-500 mt-1">
                La contraseña se mostrará al crear el administrador
              </p>
            </div>
          </div>

          {/* Información personal */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Nombre Completo *
            </label>
            <input
              type="text"
              value={adminForm.name}
              onChange={(e) => updateAdminForm('name', e.target.value)}
              disabled={isLoading}
              className="w-full px-4 py-2 border rounded-lg focus:ring-2 focus:ring-green-500 disabled:opacity-50 disabled:bg-gray-100"
              placeholder="Nombre del administrador"
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">Email *</label>
            <input
              type="email"
              value={adminForm.email}
              onChange={(e) => updateAdminForm('email', e.target.value)}
              disabled={isLoading}
              className="w-full px-4 py-2 border rounded-lg focus:ring-2 focus:ring-green-500 disabled:opacity-50 disabled:bg-gray-100"
              placeholder="admin@entidad.com"
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">Teléfono</label>
            <input
              type="tel"
              value={adminForm.phone}
              onChange={(e) => updateAdminForm('phone', e.target.value)}
              disabled={isLoading}
              className="w-full px-4 py-2 border rounded-lg focus:ring-2 focus:ring-green-500 disabled:opacity-50 disabled:bg-gray-100"
              placeholder="999-999-999"
            />
          </div>

          {/* Información importante */}
          <div className="bg-yellow-50 border border-yellow-200 rounded-lg p-3">
            <div className="flex items-start space-x-2">
              <i className="fas fa-info-circle text-yellow-600 mt-1 flex-shrink-0"></i>
              <div className="text-sm text-yellow-800">
                <p className="font-medium mb-1">Privilegios del administrador externo:</p>
                <ul className="list-disc list-inside space-y-1">
                  <li>Gestionar usuarios de su entidad</li>
                  <li>Ver reportes de su organización</li>
                  <li>Configurar límites y restricciones</li>
                  <li>No puede modificar configuración del sistema</li>
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
            Cancelar
          </button>
          <button
            onClick={onSubmit}
            disabled={isLoading || !isFormValid()}
            className="w-full sm:w-auto px-6 py-2 bg-green-600 hover:bg-green-700 text-white rounded-lg transition-colors disabled:opacity-50 disabled:cursor-not-allowed font-medium flex items-center justify-center space-x-2"
          >
            {isLoading ? (
              <>
                <i className="fas fa-spinner fa-spin"></i>
                <span>Creando...</span>
              </>
            ) : (
              <>
                <i className="fas fa-user-shield"></i>
                <span>Crear Administrador</span>
              </>
            )}
          </button>
        </div>
      </div>
    </div>
  )
}

export default AddAdminModal
