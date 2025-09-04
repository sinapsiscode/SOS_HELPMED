/**
 * Hook especializado para validaciones de contratos corporativos
 * ✅ Cumple reglas de tamaño: <100 líneas
 * ✅ Responsabilidad única: Business validations
 * ✅ Lógica pura sin efectos secundarios
 */
const useCorporateValidations = (corporateUsers) => {
  /**
   * Valida si un RUC ya existe en el sistema
   */
  const checkDuplicateRUT = (rut) => {
    if (!rut) return false
    return corporateUsers.some((user) => user.company.rut === rut)
  }

  /**
   * Valida si un email ya existe en el sistema
   */
  const checkDuplicateEmail = (email) => {
    if (!email) return false
    return corporateUsers.some((user) => user.profile.email.toLowerCase() === email.toLowerCase())
  }

  /**
   * Valida si un nombre de empresa ya existe
   */
  const checkDuplicateCompanyName = (name) => {
    if (!name) return false
    return corporateUsers.some(
      (user) => user.company.name.toLowerCase().trim() === name.toLowerCase().trim()
    )
  }

  return {
    checkDuplicateRUT,
    checkDuplicateEmail,
    checkDuplicateCompanyName
  }
}

export default useCorporateValidations