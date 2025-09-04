import * as yup from 'yup'

/**
 * Esquema de validación para solicitudes de expansión de servicios
 * ✅ Regla #4: Validación completa con Yup
 */

// Tipos de servicio válidos
const validServiceTypes = [
  'GENERAL',
  'URGENCIA',
  'MEDICO_DOMICILIO',
  'TRASLADO_PROGRAMADO',
  'ZONA_PROTEGIDA',
  'EMERGENCIA',
  'INDIVIDUAL'
]

// Niveles de urgencia válidos
const validUrgencyLevels = ['baja', 'media', 'alta']

// Esquema principal de expansión de servicios
export const serviceExpansionSchema = yup.object({
  selectedService: yup
    .string()
    .oneOf(validServiceTypes, 'Tipo de servicio inválido')
    .required('Debe seleccionar un tipo de servicio'),

  reason: yup
    .string()
    .min(10, 'El motivo debe tener al menos 10 caracteres')
    .max(500, 'El motivo no puede exceder 500 caracteres')
    .required('El motivo es obligatorio'),

  urgency: yup
    .string()
    .oneOf(validUrgencyLevels, 'Nivel de urgencia inválido')
    .required('Debe seleccionar un nivel de urgencia'),

  userInfo: yup
    .object({
      phone: yup
        .string()
        .matches(/^[0-9]{9,15}$/, 'Teléfono inválido')
        .required('El teléfono es requerido'),

      email: yup.string().email('Email inválido').required('El email es requerido')
    })
    .optional()
})

/**
 * Valida datos de expansión de servicio
 * @param {Object} data - Datos a validar
 * @returns {Promise<Object>} Resultado de validación
 */
export const validateExpansionData = async (data) => {
  try {
    await serviceExpansionSchema.validate(data, { abortEarly: false })
    return { isValid: true, errors: {} }
  } catch (error) {
    const errors = {}
    if (error.inner) {
      error.inner.forEach((err) => {
        errors[err.path] = err.message
      })
    }
    return { isValid: false, errors }
  }
}

/**
 * Valida solo el campo de razón
 * @param {string} reason - Razón a validar
 * @returns {Object} Resultado de validación
 */
export const validateReason = (reason) => {
  const reasonSchema = yup
    .string()
    .min(10, 'El motivo debe tener al menos 10 caracteres')
    .max(500, 'El motivo no puede exceder 500 caracteres')
    .required('El motivo es obligatorio')

  try {
    reasonSchema.validateSync(reason)
    return { isValid: true, error: null }
  } catch (error) {
    return { isValid: false, error: error.message }
  }
}
