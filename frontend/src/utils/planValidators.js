/**
 * Validadores para datos de planes de suscripción
 * ✅ Regla #12: Funciones de utilidad extraídas de componentes
 */

/**
 * Valida los datos de un plan
 * @param {Object} planData - Datos del plan a validar
 * @returns {Object} Resultado de la validación con isValid y errors
 */
export const validatePlanData = (planData) => {
  const errors = {}

  // Validar nombre del plan
  if (!planData.name || planData.name.trim().length === 0) {
    errors.name = 'El nombre del plan es requerido'
  } else if (planData.name.trim().length < 3) {
    errors.name = 'El nombre debe tener al menos 3 caracteres'
  } else if (planData.name.trim().length > 50) {
    errors.name = 'El nombre no puede exceder 50 caracteres'
  }

  // Validar descripción
  if (!planData.description || planData.description.trim().length === 0) {
    errors.description = 'La descripción es requerida'
  } else if (planData.description.trim().length > 200) {
    errors.description = 'La descripción no puede exceder 200 caracteres'
  }

  // Validar precio
  if (planData.price === undefined || planData.price === null) {
    errors.price = 'El precio es requerido'
  } else if (isNaN(planData.price) || planData.price < 0) {
    errors.price = 'El precio debe ser un número válido mayor o igual a 0'
  } else if (planData.price > 999999) {
    errors.price = 'El precio no puede exceder 999,999'
  }

  // Validar límite de emergencias
  if (planData.emergencyLimit !== undefined && planData.emergencyLimit !== null) {
    if (isNaN(planData.emergencyLimit) || planData.emergencyLimit < 0) {
      errors.emergencyLimit = 'El límite debe ser un número válido mayor o igual a 0'
    } else if (planData.emergencyLimit > 9999) {
      errors.emergencyLimit = 'El límite no puede exceder 9,999'
    }
  }

  // Validar área de cobertura
  if (planData.coverage && planData.coverage.length === 0) {
    errors.coverage = 'Debe seleccionar al menos un área de cobertura'
  }

  // Validar servicios incluidos
  if (planData.services && planData.services.length === 0) {
    errors.services = 'Debe seleccionar al menos un servicio'
  }

  return {
    isValid: Object.keys(errors).length === 0,
    errors
  }
}

/**
 * Valida que el nombre del plan sea único
 * @param {string} planName - Nombre del plan
 * @param {Array} existingPlans - Lista de planes existentes
 * @param {string} currentPlanId - ID del plan actual (para edición)
 * @returns {boolean} true si es único
 */
export const validateUniquePlanName = (planName, existingPlans, currentPlanId = null) => {
  if (!planName || !existingPlans) return false

  return !existingPlans.some(plan => 
    plan.name.toLowerCase() === planName.toLowerCase() && 
    plan.id !== currentPlanId
  )
}

/**
 * Valida la estructura completa de un plan
 * @param {Object} planData - Datos completos del plan
 * @returns {Object} Resultado de validación detallado
 */
export const validateCompletePlan = (planData) => {
  const basicValidation = validatePlanData(planData)
  const errors = { ...basicValidation.errors }

  // Validaciones adicionales para plan completo
  if (!planData.type || !['basic', 'premium', 'enterprise'].includes(planData.type)) {
    errors.type = 'Debe seleccionar un tipo de plan válido'
  }

  if (!planData.duration || !['monthly', 'yearly'].includes(planData.duration)) {
    errors.duration = 'Debe seleccionar una duración válida'
  }

  return {
    isValid: Object.keys(errors).length === 0,
    errors
  }
}