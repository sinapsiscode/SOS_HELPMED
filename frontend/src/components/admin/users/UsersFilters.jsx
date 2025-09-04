import React from 'react'
import { useUsersFiltersUI } from '../../../hooks/useUsersFiltersUI'

/**
 * Filtros para la lista de usuarios
 * ENFOQUE BALANCEADO: Clases estáticas en componente, lógica en hook
 * Optimizado con React.memo solo si hay problemas de performance medidos
 *
 * @param {string} searchTerm - Término de búsqueda
 * @param {Function} onSearchChange - Callback para cambio de búsqueda
 * @param {string} filterStatus - Estado de filtro
 * @param {Function} onStatusChange - Callback para cambio de estado
 */
const UsersFilters = React.memo(({ searchTerm, onSearchChange, filterStatus, onStatusChange }) => {
  // Validación de props (Regla #4)
  if (typeof onSearchChange !== 'function') {
    console.error('UsersFilters: onSearchChange debe ser una función')
    return null
  }
  if (typeof onStatusChange !== 'function') {
    console.error('UsersFilters: onStatusChange debe ser una función')
    return null
  }
  // ============================================
  // HOOK - Solo lógica de negocio y estado
  // ============================================
  const { handleSearchChange, handleStatusChange, statusOptions, error } = useUsersFiltersUI(
    onSearchChange,
    onStatusChange
  )

  // Manejo de errores consistente (Regla #8)
  if (error) {
    return (
      <div className="bg-red-50 border border-red-200 rounded-lg p-4">
        <p className="text-red-600 text-sm">Error en filtros: {error}</p>
      </div>
    )
  }

  // ============================================
  // RENDER - Template con clases estáticas
  // ============================================
  return (
    <div className="bg-white p-4 rounded-lg shadow">
      <div className="flex flex-col sm:flex-row gap-4">
        {/* Campo de búsqueda */}
        <div className="flex-1">
          <label htmlFor="search" className="sr-only">
            Buscar usuarios
          </label>
          <div className="relative">
            <span className="absolute inset-y-0 left-0 pl-3 flex items-center text-gray-400">
              🔍
            </span>
            <input
              id="search"
              type="text"
              placeholder="Buscar por nombre o email..."
              value={searchTerm || ''}
              onChange={handleSearchChange}
              className="block w-full pl-10 pr-3 py-2 border border-gray-300 rounded-md leading-5 bg-white placeholder-gray-500 focus:outline-none focus:placeholder-gray-400 focus:ring-1 focus:ring-blue-500 focus:border-blue-500"
            />
          </div>
        </div>

        {/* Filtro por estado */}
        <div className="sm:w-48">
          <label htmlFor="status-filter" className="sr-only">
            Filtrar por estado
          </label>
          <select
            id="status-filter"
            value={filterStatus || 'all'}
            onChange={handleStatusChange}
            className="block w-full px-3 py-2 border border-gray-300 rounded-md leading-5 bg-white focus:outline-none focus:ring-1 focus:ring-blue-500 focus:border-blue-500"
          >
            {statusOptions.map((option) => (
              <option key={option.value} value={option.value}>
                {option.label}
              </option>
            ))}
          </select>
        </div>
      </div>
    </div>
  )
})

UsersFilters.displayName = 'UsersFilters'

export default UsersFilters
