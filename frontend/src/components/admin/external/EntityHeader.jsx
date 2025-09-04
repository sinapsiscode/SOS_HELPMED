import React from 'react'

/**
 * Header de la gestión de entidades externas
 * ENFOQUE BALANCEADO: Solo presentación con validación de props
 *
 * @param {Object} stats - Estadísticas de entidades
 * @param {Function} onOpenAddEntity - Función para abrir modal de nueva entidad
 * @param {Function} onOpenAddAdmin - Función para abrir modal de nuevo admin
 * @returns {JSX.Element} Header con estadísticas y botones de acción
 */
const EntityHeader = ({ stats, onOpenAddEntity, onOpenAddAdmin }) => {
  // ============================================
  // VALIDACIÓN DE PROPS (Regla #4)
  // ============================================
  if (!stats || typeof stats !== 'object') {
    console.error('EntityHeader: stats es requerido y debe ser un objeto')
    return null
  }

  if (typeof onOpenAddEntity !== 'function') {
    console.error('EntityHeader: onOpenAddEntity debe ser una función')
    return null
  }

  if (typeof onOpenAddAdmin !== 'function') {
    console.error('EntityHeader: onOpenAddAdmin debe ser una función')
    return null
  }

  return (
    <div className="bg-white rounded-xl shadow-medium p-4 sm:p-6">
      {/* Título y descripción */}
      <div className="flex flex-col space-y-4 sm:flex-row sm:items-center sm:justify-between sm:space-y-0 mb-4 sm:mb-6">
        <div className="min-w-0">
          <h2 className="text-xl sm:text-2xl font-bold text-gray-800">
            Gestión de Entidades Externas
          </h2>
          <p className="text-sm sm:text-base text-gray-600 mt-1">
            Configura las entidades de donde pueden venir los afiliados externos
          </p>
        </div>

        {/* Botones de acción - Responsive */}
        <div className="flex flex-col sm:flex-row space-y-2 sm:space-y-0 sm:space-x-3">
          <button
            onClick={onOpenAddEntity}
            className="bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 sm:py-2.5 rounded-lg transition-colors flex items-center justify-center space-x-2 text-sm font-medium"
          >
            <i className="fas fa-plus"></i>
            <span className="hidden sm:inline">Nueva Entidad</span>
            <span className="sm:hidden">Agregar Entidad</span>
          </button>
          <button
            onClick={onOpenAddAdmin}
            className="bg-green-600 hover:bg-green-700 text-white px-4 py-2 sm:py-2.5 rounded-lg transition-colors flex items-center justify-center space-x-2 text-sm font-medium"
          >
            <i className="fas fa-user-shield"></i>
            <span className="hidden sm:inline">Crear Admin Externo</span>
            <span className="sm:hidden">Crear Admin</span>
          </button>
        </div>
      </div>

      {/* Estadísticas - Responsive */}
      <div className="grid grid-cols-2 sm:grid-cols-2 md:grid-cols-4 gap-3 sm:gap-4">
        <div className="bg-blue-50 border border-blue-200 rounded-lg p-3 sm:p-4">
          <div className="flex items-center justify-between">
            <div className="min-w-0 flex-1">
              <p className="text-xs sm:text-sm text-blue-600 font-medium leading-tight">
                Total Entidades
              </p>
              <p className="text-lg sm:text-xl md:text-2xl font-bold text-blue-800">
                {stats.total}
              </p>
            </div>
            <i className="fas fa-building text-blue-500 text-lg sm:text-xl md:text-2xl flex-shrink-0 ml-2"></i>
          </div>
        </div>

        <div className="bg-green-50 border border-green-200 rounded-lg p-3 sm:p-4">
          <div className="flex items-center justify-between">
            <div className="min-w-0 flex-1">
              <p className="text-xs sm:text-sm text-green-600 font-medium leading-tight">
                Ent. Activas
              </p>
              <p className="text-lg sm:text-xl md:text-2xl font-bold text-green-800">
                {stats.active}
              </p>
            </div>
            <i className="fas fa-check-circle text-green-500 text-lg sm:text-xl md:text-2xl flex-shrink-0 ml-2"></i>
          </div>
        </div>

        <div className="bg-purple-50 border border-purple-200 rounded-lg p-3 sm:p-4">
          <div className="flex items-center justify-between">
            <div className="min-w-0 flex-1">
              <p className="text-xs sm:text-sm text-purple-600 font-medium leading-tight">
                Usuarios
              </p>
              <p className="text-lg sm:text-xl md:text-2xl font-bold text-purple-800">
                {stats.totalUsers}
              </p>
            </div>
            <i className="fas fa-users text-purple-500 text-lg sm:text-xl md:text-2xl flex-shrink-0 ml-2"></i>
          </div>
        </div>

        <div className="bg-orange-50 border border-orange-200 rounded-lg p-3 sm:p-4">
          <div className="flex items-center justify-between">
            <div className="min-w-0 flex-1">
              <p className="text-xs sm:text-sm text-orange-600 font-medium leading-tight">Admins</p>
              <p className="text-lg sm:text-xl md:text-2xl font-bold text-orange-800">
                {stats.totalAdmins}
              </p>
            </div>
            <i className="fas fa-user-shield text-orange-500 text-lg sm:text-xl md:text-2xl flex-shrink-0 ml-2"></i>
          </div>
        </div>
      </div>
    </div>
  )
}

export default EntityHeader
