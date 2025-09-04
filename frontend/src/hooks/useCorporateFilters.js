import { useMemo } from 'react'

/**
 * Hook especializado para filtrado y búsqueda de contratos corporativos
 * ✅ Cumple reglas de tamaño: <100 líneas
 * ✅ Responsabilidad única: Filtering logic
 * ✅ Optimizado con useMemo
 */
const useCorporateFilters = (corporateUsers, filter, searchTerm) => {
  const filteredContracts = useMemo(() => {
    return corporateUsers.filter((user) => {
      const matchesSearch =
        user.company.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
        user.profile.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
        user.company.rut.includes(searchTerm)

      const matchesFilter =
        filter === 'all' ||
        (filter === 'active' && new Date(user.plan.renewal_date) > new Date()) ||
        (filter === 'expiring' &&
          new Date(user.plan.renewal_date) <= new Date(Date.now() + 30 * 24 * 60 * 60 * 1000))

      return matchesSearch && matchesFilter
    })
  }, [corporateUsers, filter, searchTerm])

  return {
    filteredContracts
  }
}

export default useCorporateFilters