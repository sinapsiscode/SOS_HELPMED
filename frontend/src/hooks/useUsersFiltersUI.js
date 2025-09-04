import { useState, useCallback, useMemo } from 'react'

/**
 * Hook para manejar la UI de filtros de usuarios
 * Se encarga de la lógica de interacción, no del procesamiento de datos
 */
export const useUsersFiltersUI = (onSearchChange, onStatusChange) => {
  const [error, setError] = useState(null)

  // Opciones de estado para el filtro
  const statusOptions = useMemo(() => [
    { value: 'all', label: 'Todos los usuarios' },
    { value: 'active', label: 'Activos' },
    { value: 'inactive', label: 'Inactivos' },
    { value: 'new', label: 'Nuevos' }
  ], [])

  // Manejador de cambio de búsqueda
  const handleSearchChange = useCallback((event) => {
    try {
      const value = event.target.value
      onSearchChange(value)
      setError(null)
    } catch (err) {
      setError('Error al procesar búsqueda')
      console.error('Error en handleSearchChange:', err)
    }
  }, [onSearchChange])

  // Manejador de cambio de estado
  const handleStatusChange = useCallback((event) => {
    try {
      const value = event.target.value
      onStatusChange(value)
      setError(null)
    } catch (err) {
      setError('Error al cambiar filtro de estado')
      console.error('Error en handleStatusChange:', err)
    }
  }, [onStatusChange])

  return {
    handleSearchChange,
    handleStatusChange,
    statusOptions,
    error
  }
}

export default useUsersFiltersUI