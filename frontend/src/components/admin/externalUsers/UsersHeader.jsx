import React from 'react'
import { LABELS } from '../../../config/labels'

/**
 * ${LABELS.admin.externalUsers.usersHeader.comments.title}
 * ${LABELS.admin.externalUsers.usersHeader.comments.approach}
 *
 * @param {Object} globalStats - Estadísticas globales del sistema
 * @param {string} viewMode - Modo de vista actual ('hierarchical' | 'list')
 * @param {string} searchTerm - Término de búsqueda actual
 * @param {Function} onToggleViewMode - Función para cambiar modo de vista
 * @param {Function} onOpenAddEntity - Función para abrir modal de nueva entidad
 * @param {Function} onSearchChange - Función para actualizar búsqueda
 * @returns {JSX.Element} Header con controles y estadísticas
 */
const UsersHeader = ({
  globalStats,
  viewMode,
  searchTerm,
  onToggleViewMode,
  onOpenAddEntity,
  onSearchChange
}) => {
  const labels = LABELS.admin.externalUsers.usersHeader

  // ============================================
  // VALIDACIÓN DE PROPS (Regla #4)
  // ============================================
  if (!globalStats || typeof globalStats !== 'object') {
    console.error(labels.errors.globalStatsRequired)
    return null
  }

  if (typeof viewMode !== 'string') {
    console.error(labels.errors.viewModeRequired)
    return null
  }

  if (typeof searchTerm !== 'string') {
    console.error(labels.errors.searchTermRequired)
    return null
  }

  if (typeof onToggleViewMode !== 'function') {
    console.error(labels.errors.onToggleViewModeRequired)
    return null
  }

  if (typeof onOpenAddEntity !== 'function') {
    console.error(labels.errors.onOpenAddEntityRequired)
    return null
  }

  if (typeof onSearchChange !== 'function') {
    console.error(labels.errors.onSearchChangeRequired)
    return null
  }

  return (
    <div className="bg-white rounded-xl shadow-medium p-6">
      {/* Título y controles */}
      <div className="flex items-center justify-between mb-6">
        <div>
          <h2 className="text-lg font-bold text-gray-800">{labels.title}</h2>
          <p className="text-sm text-gray-600 mt-1">
            {labels.subtitle}
          </p>
        </div>
        <div className="flex space-x-3">
          <button
            onClick={onToggleViewMode}
            className="bg-gray-100 hover:bg-gray-200 text-gray-700 px-4 py-2 rounded-lg transition-colors flex items-center space-x-2"
          >
            <i className={`fas fa-${viewMode === 'hierarchical' ? 'list' : 'sitemap'}`}></i>
            <span>{viewMode === 'hierarchical' ? labels.buttons.viewMode.list : labels.buttons.viewMode.hierarchical}</span>
          </button>
          <button
            onClick={onOpenAddEntity}
            className="bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded-lg transition-colors flex items-center space-x-2"
          >
            <i className="fas fa-building-user"></i>
            <span>{labels.buttons.newEntity}</span>
          </button>
        </div>
      </div>

      {/* Estadísticas */}
      <div className="grid grid-cols-1 md:grid-cols-5 gap-4 mb-6">
        <div className="bg-blue-50 border border-blue-200 rounded-lg p-3">
          <div className="text-2xl font-bold text-blue-800">{globalStats.totalEntities}</div>
          <div className="text-sm text-blue-600">{labels.stats.entities}</div>
        </div>

        <div className="bg-green-50 border border-green-200 rounded-lg p-3">
          <div className="text-2xl font-bold text-green-800">{globalStats.totalAdmins}</div>
          <div className="text-sm text-green-600">{labels.stats.admins}</div>
        </div>

        <div className="bg-purple-50 border border-purple-200 rounded-lg p-3">
          <div className="text-2xl font-bold text-purple-800">{globalStats.totalUsers}</div>
          <div className="text-sm text-purple-600">{labels.stats.totalUsers}</div>
        </div>

        <div className="bg-orange-50 border border-orange-200 rounded-lg p-3">
          <div className="text-2xl font-bold text-orange-800">{globalStats.activeUsers}</div>
          <div className="text-sm text-orange-600">{labels.stats.activeUsers}</div>
        </div>

        <div className="bg-indigo-50 border border-indigo-200 rounded-lg p-3">
          <div className="text-2xl font-bold text-indigo-800">{globalStats.monthlyServices}</div>
          <div className="text-sm text-indigo-600">{labels.stats.monthlyServices}</div>
        </div>
      </div>

      {/* Búsqueda */}
      <div className="relative">
        <input
          type="text"
          placeholder={labels.search.placeholder}
          value={searchTerm}
          onChange={(e) => onSearchChange(e.target.value)}
          className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500"
        />
        <i className="fas fa-search absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400"></i>
        {searchTerm && (
          <button
            onClick={() => onSearchChange('')}
            className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-400 hover:text-gray-600"
          >
            <i className="fas fa-times"></i>
          </button>
        )}
      </div>
    </div>
  )
}

export default UsersHeader
