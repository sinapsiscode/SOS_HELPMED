import { useMemo } from 'react'

/**
 * Hook especializado para filtrado y ordenamiento de usuarios
 * ✅ Cumple reglas de tamaño: <100 líneas
 * ✅ Responsabilidad única: Filtering logic
 * ✅ Optimizado con useMemo
 */
const useUsersFilters = (users, userFilter, sortBy) => {
  const processedUsers = useMemo(() => {
    // Validar que users sea un array y tenga elementos
    if (!Array.isArray(users) || !users.length) return []

    let filtered = [...users]

    // Aplicar filtros
    switch (userFilter) {
      case 'active':
        const weekAgo = new Date(Date.now() - 7 * 24 * 60 * 60 * 1000)
        filtered = filtered.filter(
          (user) => user.lastActivity && new Date(user.lastActivity) >= weekAgo
        )
        break
      case 'inactive':
        const monthAgo = new Date(Date.now() - 30 * 24 * 60 * 60 * 1000)
        filtered = filtered.filter(
          (user) => !user.lastActivity || new Date(user.lastActivity) < monthAgo
        )
        break
      case 'new':
        const thisMonth = new Date(Date.now() - 30 * 24 * 60 * 60 * 1000)
        filtered = filtered.filter(
          (user) => user.createdAt && new Date(user.createdAt) >= thisMonth
        )
        break
    }

    // Aplicar ordenamiento
    switch (sortBy) {
      case 'registrationDate':
        filtered.sort((a, b) => new Date(b.createdAt || 0) - new Date(a.createdAt || 0))
        break
      case 'activity':
        filtered.sort((a, b) => new Date(b.lastActivity || 0) - new Date(a.lastActivity || 0))
        break
      case 'plan':
        filtered.sort((a, b) => (a.planType || '').localeCompare(b.planType || ''))
        break
    }

    return filtered
  }, [users, userFilter, sortBy])

  return {
    processedUsers
  }
}

export { useUsersFilters }
export default useUsersFilters