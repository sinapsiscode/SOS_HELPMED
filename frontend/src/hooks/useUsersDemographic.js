import { useMemo } from 'react'

/**
 * Hook especializado para análisis demográfico de usuarios
 * ✅ Cumple reglas de tamaño: <100 líneas
 * ✅ Responsabilidad única: Demographic analysis
 * ✅ Optimizado con useMemo
 */
const useUsersDemographic = (users) => {
  const demographicAnalysis = useMemo(() => {
    if (!users?.length) return {}

    // Distribución por tipo de usuario
    const userTypes = {}
    users.forEach((user) => {
      const type = user.role || user.userType || 'familiar'
      userTypes[type] = (userTypes[type] || 0) + 1
    })

    // Distribución por género
    const genderDistribution = {}
    users.forEach((user) => {
      const gender = user.gender || 'no_specified'
      genderDistribution[gender] = (genderDistribution[gender] || 0) + 1
    })

    // Distribución por grupos de edad
    const ageGroups = {
      '18-25': 0,
      '26-35': 0,
      '36-45': 0,
      '46-55': 0,
      '56-65': 0,
      '65+': 0
    }

    users.forEach((user) => {
      if (user.birthDate) {
        const age = new Date().getFullYear() - new Date(user.birthDate).getFullYear()
        if (age <= 25) ageGroups['18-25']++
        else if (age <= 35) ageGroups['26-35']++
        else if (age <= 45) ageGroups['36-45']++
        else if (age <= 55) ageGroups['46-55']++
        else if (age <= 65) ageGroups['56-65']++
        else ageGroups['65+']++
      }
    })

    // Distribución geográfica (por departamento)
    const locationDistribution = {}
    users.forEach((user) => {
      const location = user.department || user.city || 'No especificado'
      locationDistribution[location] = (locationDistribution[location] || 0) + 1
    })

    return {
      userTypes,
      genderDistribution,
      ageGroups,
      locationDistribution,
      totalUsers: users.length
    }
  }, [users])

  return {
    demographicAnalysis
  }
}

export default useUsersDemographic