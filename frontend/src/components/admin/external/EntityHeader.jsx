import React from 'react'
import { LABELS } from '../../../config/labels'

/**
 * ${LABELS.admin.external.entityHeader.comments.title}
 * ${LABELS.admin.external.entityHeader.comments.approach}
 *
 * @param {Object} stats - Estadísticas de entidades
 * @param {Function} onOpenAddEntity - Función para abrir modal de nueva entidad
 * @param {Function} onOpenAddAdmin - Función para abrir modal de nuevo admin
 * @returns {JSX.Element} Header con estadísticas y botones de acción
 */
const EntityHeader = ({ stats, onOpenAddEntity, onOpenAddAdmin }) => {
  const labels = LABELS.admin.external.entityHeader

  // ============================================
  // VALIDACIÓN DE PROPS (Regla #4)
  // ============================================
  if (!stats || typeof stats !== 'object') {
    console.error(labels.errors.statsRequired)
    return null
  }

  if (typeof onOpenAddEntity !== 'function') {
    console.error(labels.errors.onOpenAddEntityRequired)
    return null
  }

  if (typeof onOpenAddAdmin !== 'function') {
    console.error(labels.errors.onOpenAddAdminRequired)
    return null
  }

  return (
    <div className="bg-white rounded-xl shadow-medium p-4 sm:p-6">
      {/* Título y descripción */}
      <div className="flex flex-col space-y-4 sm:flex-row sm:items-center sm:justify-between sm:space-y-0 mb-4 sm:mb-6">
        <div className="min-w-0">
          <h2 className="text-xl sm:text-2xl font-bold text-gray-800">
            {labels.title}
          </h2>
          <p className="text-sm sm:text-base text-gray-600 mt-1">
            {labels.subtitle}
          </p>
        </div>

        {/* Botones de acción - Responsive */}
        <div className="flex flex-col sm:flex-row space-y-2 sm:space-y-0 sm:space-x-3">
          <button
            onClick={onOpenAddEntity}
            className="bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 sm:py-2.5 rounded-lg transition-colors flex items-center justify-center space-x-2 text-sm font-medium"
          >
            <i className="fas fa-plus"></i>
            <span className="hidden sm:inline">{labels.buttons.newEntity.full}</span>
            <span className="sm:hidden">{labels.buttons.newEntity.short}</span>
          </button>
          <button
            onClick={onOpenAddAdmin}
            className="bg-green-600 hover:bg-green-700 text-white px-4 py-2 sm:py-2.5 rounded-lg transition-colors flex items-center justify-center space-x-2 text-sm font-medium"
          >
            <i className="fas fa-user-shield"></i>
            <span className="hidden sm:inline">{labels.buttons.createAdmin.full}</span>
            <span className="sm:hidden">{labels.buttons.createAdmin.short}</span>
          </button>
        </div>
      </div>

      {/* Estadísticas - Responsive */}
      <div className="grid grid-cols-2 sm:grid-cols-2 md:grid-cols-4 gap-3 sm:gap-4">
        <div className="bg-blue-50 border border-blue-200 rounded-lg p-3 sm:p-4">
          <div className="flex items-center justify-between">
            <div className="min-w-0 flex-1">
              <p className="text-xs sm:text-sm text-blue-600 font-medium leading-tight">
                {labels.stats.totalEntities.label}
              </p>
              <p className="text-lg sm:text-xl md:text-2xl font-bold text-blue-800">
                {stats.total}
              </p>
            </div>
            <i className={`${labels.stats.totalEntities.icon} text-blue-500 text-lg sm:text-xl md:text-2xl flex-shrink-0 ml-2`}></i>
          </div>
        </div>

        <div className="bg-green-50 border border-green-200 rounded-lg p-3 sm:p-4">
          <div className="flex items-center justify-between">
            <div className="min-w-0 flex-1">
              <p className="text-xs sm:text-sm text-green-600 font-medium leading-tight">
                {labels.stats.activeEntities.label}
              </p>
              <p className="text-lg sm:text-xl md:text-2xl font-bold text-green-800">
                {stats.active}
              </p>
            </div>
            <i className={`${labels.stats.activeEntities.icon} text-green-500 text-lg sm:text-xl md:text-2xl flex-shrink-0 ml-2`}></i>
          </div>
        </div>

        <div className="bg-purple-50 border border-purple-200 rounded-lg p-3 sm:p-4">
          <div className="flex items-center justify-between">
            <div className="min-w-0 flex-1">
              <p className="text-xs sm:text-sm text-purple-600 font-medium leading-tight">
                {labels.stats.users.label}
              </p>
              <p className="text-lg sm:text-xl md:text-2xl font-bold text-purple-800">
                {stats.totalUsers}
              </p>
            </div>
            <i className={`${labels.stats.users.icon} text-purple-500 text-lg sm:text-xl md:text-2xl flex-shrink-0 ml-2`}></i>
          </div>
        </div>

        <div className="bg-orange-50 border border-orange-200 rounded-lg p-3 sm:p-4">
          <div className="flex items-center justify-between">
            <div className="min-w-0 flex-1">
              <p className="text-xs sm:text-sm text-orange-600 font-medium leading-tight">{labels.stats.admins.label}</p>
              <p className="text-lg sm:text-xl md:text-2xl font-bold text-orange-800">
                {stats.totalAdmins}
              </p>
            </div>
            <i className={`${labels.stats.admins.icon} text-orange-500 text-lg sm:text-xl md:text-2xl flex-shrink-0 ml-2`}></i>
          </div>
        </div>
      </div>
    </div>
  )
}

export default EntityHeader
