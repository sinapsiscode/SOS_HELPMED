import React from 'react'

/**
 * Header de la gestión de usuarios de entidades externas
 * ENFOQUE BALANCEADO: Solo presentación con validación de props
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
  // ============================================
  // VALIDACIÓN DE PROPS (Regla #4)
  // ============================================
  if (!globalStats || typeof globalStats !== 'object') {
    console.error('UsersHeader: globalStats es requerido y debe ser un objeto')
    return null
  }

  if (typeof viewMode !== 'string') {
    console.error('UsersHeader: viewMode debe ser un string')
    return null
  }

  if (typeof searchTerm !== 'string') {
    console.error('UsersHeader: searchTerm debe ser un string')
    return null
  }

  if (typeof onToggleViewMode !== 'function') {
    console.error('UsersHeader: onToggleViewMode debe ser una función')
    return null
  }

  if (typeof onOpenAddEntity !== 'function') {
    console.error('UsersHeader: onOpenAddEntity debe ser una función')
    return null
  }

  if (typeof onSearchChange !== 'function') {
    console.error('UsersHeader: onSearchChange debe ser una función')
    return null
  }

  return (
    <div className="bg-white rounded-xl shadow-medium p-6">
      {/* Título y controles */}
      <div className="flex items-center justify-between mb-6">
        <div>
          <h2 className="text-lg font-bold text-gray-800">Gestión de Entidades Externas</h2>
          <p className="text-sm text-gray-600 mt-1">
            Administración jerárquica de entidades, administradores y usuarios
          </p>
        </div>
        <div className="flex space-x-3">
          <button
            onClick={onToggleViewMode}
            className="bg-gray-100 hover:bg-gray-200 text-gray-700 px-4 py-2 rounded-lg transition-colors flex items-center space-x-2"
          >
            <i className={`fas fa-${viewMode === 'hierarchical' ? 'list' : 'sitemap'}`}></i>
            <span>Vista {viewMode === 'hierarchical' ? 'Lista' : 'Jerárquica'}</span>
          </button>
          <button
            onClick={onOpenAddEntity}
            className="bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded-lg transition-colors flex items-center space-x-2"
          >
            <i className="fas fa-building-user"></i>
            <span>Nueva Entidad</span>
          </button>
        </div>
      </div>

      {/* Estadísticas */}
      <div className="grid grid-cols-1 md:grid-cols-5 gap-4 mb-6">
        <div className="bg-blue-50 border border-blue-200 rounded-lg p-3">
          <div className="text-2xl font-bold text-blue-800">{globalStats.totalEntities}</div>
          <div className="text-sm text-blue-600">Entidades</div>
        </div>

        <div className="bg-green-50 border border-green-200 rounded-lg p-3">
          <div className="text-2xl font-bold text-green-800">{globalStats.totalAdmins}</div>
          <div className="text-sm text-green-600">Administradores</div>
        </div>

        <div className="bg-purple-50 border border-purple-200 rounded-lg p-3">
          <div className="text-2xl font-bold text-purple-800">{globalStats.totalUsers}</div>
          <div className="text-sm text-purple-600">Usuarios Totales</div>
        </div>

        <div className="bg-orange-50 border border-orange-200 rounded-lg p-3">
          <div className="text-2xl font-bold text-orange-800">{globalStats.activeUsers}</div>
          <div className="text-sm text-orange-600">Usuarios Activos</div>
        </div>

        <div className="bg-indigo-50 border border-indigo-200 rounded-lg p-3">
          <div className="text-2xl font-bold text-indigo-800">{globalStats.monthlyServices}</div>
          <div className="text-sm text-indigo-600">Servicios/Mes</div>
        </div>
      </div>

      {/* Búsqueda */}
      <div className="relative">
        <input
          type="text"
          placeholder="Buscar por entidad, administrador, usuario o código..."
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
