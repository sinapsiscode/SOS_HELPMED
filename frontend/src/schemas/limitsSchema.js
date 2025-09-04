import * as yup from 'yup'

/**
 * Esquema de validación para datos de límites de servicios
 * ✅ Regla #4: Validación completa con Yup
 * ✅ Regla #6: Documentación completa
 */

// Esquema para límite con uso
const usageLimitSchema = yup.object({
  used: yup
    .number()
    .min(0, 'El uso no puede ser negativo')
    .required('El uso es requerido'),
  limit: yup
    .number()
    .min(1, 'El límite debe ser mayor a 0')
    .required('El límite es requerido')
})

// Esquema para beneficios del plan
const planBenefitsSchema = yup.object({
  emergencias_ilimitadas: yup.boolean().optional(),
  orientacion_telefonica: yup.boolean().optional(),
  zona_protegida: yup.boolean().optional(),
  seguro_accidentes: yup.boolean().optional(),
  examenes_laboratorio: yup.boolean().optional()
}).optional()

// Esquema para información del plan
const planInfoSchema = yup.object({
  name: yup.string().required('El nombre del plan es requerido'),
  total_services: yup.number().min(1, 'Total de servicios debe ser mayor a 0').optional(),
  benefits: planBenefitsSchema
}).optional()

// Esquema para un límite individual (puede ser string, number o object)
const limitSchema = yup.lazy((value) => {
  if (typeof value === 'string') {
    return yup.string().oneOf(
      ['ILIMITADO', 'FLEXIBLE', 'NO DISPONIBLE'],
      'Valor de límite string inválido'
    )
  }
  if (typeof value === 'number') {
    return yup.number().min(0, 'El límite numérico no puede ser negativo')
  }
  if (typeof value === 'object' && value !== null) {
    return usageLimitSchema
  }
  return yup.mixed().required('El límite es requerido')
})

// Esquema principal para datos de límites
export const limitsDataSchema = yup.object({
  title: yup
    .string()
    .min(3, 'El título debe tener al menos 3 caracteres')
    .required('El título es requerido'),
  
  limits: yup
    .object()
    .test('limits-not-empty', 'Debe tener al menos un límite', (value) => {
      return value && Object.keys(value).length > 0
    })
    .test('valid-limits', 'Límites inválidos', async (value) => {
      if (!value) return false
      
      try {
        for (const [key, limit] of Object.entries(value)) {
          await limitSchema.validate(limit)
        }
        return true
      } catch {
        return false
      }
    })
    .required('Los límites son requeridos'),
  
  userType: yup
    .string()
    .oneOf(['FAMILIAR', 'CORPORATIVO', 'EXTERNO', 'ADMIN'], 'Tipo de usuario inválido')
    .required('El tipo de usuario es requerido'),
  
  planInfo: planInfoSchema
})

/**
 * Valida datos de límites
 * @param {Object} data - Datos a validar
 * @returns {Object} Resultado de validación
 */
export const validateLimitsData = async (data) => {
  try {
    await limitsDataSchema.validate(data, { abortEarly: false })
    return { isValid: true, errors: {} }
  } catch (error) {
    const errors = {}
    if (error.inner) {
      error.inner.forEach((err) => {
        errors[err.path] = err.message
      })
    } else {
      errors.general = error.message
    }
    return { isValid: false, errors }
  }
}

/**
 * Valida un límite individual
 * @param {*} limit - Límite a validar
 * @returns {boolean} Si es válido
 */
export const isValidLimit = async (limit) => {
  try {
    await limitSchema.validate(limit)
    return true
  } catch {
    return false
  }
}

/**
 * Valida tipo de usuario
 * @param {string} userType - Tipo de usuario
 * @returns {boolean} Si es válido
 */
export const isValidUserType = (userType) => {
  const validTypes = ['FAMILIAR', 'CORPORATIVO', 'EXTERNO', 'ADMIN']
  return validTypes.includes(userType)
}

/**
 * Valida beneficios del plan
 * @param {Object} benefits - Beneficios a validar
 * @returns {boolean} Si es válido
 */
export const isValidPlanBenefits = async (benefits) => {
  try {
    await planBenefitsSchema.validate(benefits)
    return true
  } catch {
    return false
  }
}