import React from 'react'

/**
 * Componente de filtros y búsqueda para planes
 * ENFOQUE BALANCEADO: Solo presentación con validación de props
 *
 * @param {string} searchTerm - Término de búsqueda actual
 * @param {string} filterType - Filtro de tipo seleccionado
 * @param {string} sortBy - Campo de ordenación seleccionado
 * @param {Function} onSearch - Función para manejar búsqueda
 * @param {Function} onFilterChange - Función para cambiar filtro
 * @param {Function} onSortChange - Función para cambiar ordenación
 * @param {Function} onClearFilters - Función para limpiar filtros
 * @returns {JSX.Element} Barra de filtros y controles de búsqueda
 */
const PlanFilters = ({
  searchTerm,
  filterType,
  sortBy,
  onSearch,
  onFilterChange,
  onSortChange,
  onClearFilters
}) => {
  // ============================================
  // VALIDACIÓN DE PROPS (Regla #4)
  // ============================================
  if (typeof searchTerm !== 'string') {
    console.error('PlanFilters: searchTerm debe ser string')
    return null
  }

  if (typeof filterType !== 'string') {
    console.error('PlanFilters: filterType debe ser string')
    return null
  }

  if (typeof sortBy !== 'string') {
    console.error('PlanFilters: sortBy debe ser string')
    return null
  }

  if (typeof onSearch !== 'function') {
    console.error('PlanFilters: onSearch debe ser una función')
    return null
  }

  if (typeof onFilterChange !== 'function') {
    console.error('PlanFilters: onFilterChange debe ser una función')
    return null
  }

  if (typeof onSortChange !== 'function') {
    console.error('PlanFilters: onSortChange debe ser una función')
    return null
  }

  if (typeof onClearFilters !== 'function') {
    console.error('PlanFilters: onClearFilters debe ser una función')
    return null
  }

  const filterOptions = [
    { value: 'all', label: 'Todos los Planes', icon: 'fas fa-list' },
    { value: 'familiar', label: 'Familiares', icon: 'fas fa-home' },
    { value: 'corporativo', label: 'Corporativos', icon: 'fas fa-building' },
    { value: 'externo', label: 'Externos', icon: 'fas fa-globe' }
  ]

  const sortOptions = [
    { value: 'name', label: 'Por Nombre' },
    { value: 'price', label: 'Por Precio' },
    { value: 'created', label: 'Por Fecha de Creación' }
  ]

  return (
    <div className="bg-white rounded-xl shadow-medium p-4 space-y-4">
      <h3 className="text-lg font-semibold text-gray-800">Filtros y Búsqueda</h3>

      {/* Barra de búsqueda */}
      <div className="relative">
        <input
          type="text"
          placeholder="Buscar planes por nombre o descripción..."
          value={searchTerm}
          onChange={(e) => onSearch(e.target.value)}
          className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
        />
        <i className="fas fa-search absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400"></i>

        {searchTerm && (
          <button
            onClick={() => onSearch('')}
            className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-400 hover:text-gray-600"
          >
            <i className="fas fa-times"></i>
          </button>
        )}
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        {/* Filtro por categoría */}
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">Categoría de Plan</label>
          <div className="grid grid-cols-2 gap-1">
            {filterOptions.map((option) => (
              <button
                key={option.value}
                onClick={() => onFilterChange(option.value)}
                className={`p-2 text-xs rounded-lg flex items-center justify-center space-x-1 transition-colors ${
                  filterType === option.value
                    ? 'bg-blue-600 text-white'
                    : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
                }`}
              >
                <i className={option.icon}></i>
                <span className="hidden sm:inline">{option.label}</span>
              </button>
            ))}
          </div>
        </div>

        {/* Ordenación */}
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">Ordenar por</label>
          <select
            value={sortBy}
            onChange={(e) => onSortChange(e.target.value)}
            className="w-full border border-gray-300 rounded-lg px-3 py-2 focus:ring-2 focus:ring-blue-500 focus:border-transparent"
          >
            {sortOptions.map((option) => (
              <option key={option.value} value={option.value}>
                {option.label}
              </option>
            ))}
          </select>
        </div>

        {/* Controles adicionales */}
        <div className="flex flex-col justify-end">
          <button
            onClick={onClearFilters}
            className="bg-gray-100 hover:bg-gray-200 text-gray-700 px-4 py-2 rounded-lg flex items-center justify-center space-x-2 transition-colors"
          >
            <i className="fas fa-eraser"></i>
            <span>Limpiar Filtros</span>
          </button>
        </div>
      </div>

      {/* Indicadores activos */}
      {(searchTerm || filterType !== 'all' || sortBy !== 'name') && (
        <div className="flex flex-wrap gap-2 pt-2 border-t border-gray-200">
          <span className="text-sm text-gray-600">Filtros activos:</span>

          {searchTerm && (
            <span className="bg-blue-100 text-blue-800 px-2 py-1 rounded-full text-xs">
              Búsqueda: "{searchTerm}"
            </span>
          )}

          {filterType !== 'all' && (
            <span className="bg-green-100 text-green-800 px-2 py-1 rounded-full text-xs">
              Categoría: {filterOptions.find((opt) => opt.value === filterType)?.label}
            </span>
          )}

          {sortBy !== 'name' && (
            <span className="bg-purple-100 text-purple-800 px-2 py-1 rounded-full text-xs">
              Orden: {sortOptions.find((opt) => opt.value === sortBy)?.label}
            </span>
          )}
        </div>
      )}
    </div>
  )
}

export default PlanFilters
