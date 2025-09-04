import * as yup from 'yup'

/**
 * Esquema de validación para información de facturación
 * ✅ Regla #4: Validación completa con Yup
 * ✅ Regla #6: Documentación completa
 */

// Esquema para información de facturación
export const billingInfoSchema = yup.object({
  monthly_cost: yup
    .number()
    .min(0, 'El costo mensual no puede ser negativo')
    .required('El costo mensual es requerido'),
  
  payment_method: yup
    .string()
    .oneOf(
      ['credit_card', 'debit_card', 'bank_transfer', 'invoice'],
      'Método de pago inválido'
    )
    .required('El método de pago es requerido'),
  
  auto_renewal: yup
    .boolean()
    .required('El estado de auto-renovación es requerido'),
  
  billing_contact: yup.object({
    name: yup.string().min(2, 'Nombre debe tener al menos 2 caracteres'),
    email: yup.string().email('Email inválido')
  }).optional()
})

// Esquema para servicios adicionales
export const additionalServiceSchema = yup.object({
  description: yup
    .string()
    .min(3, 'La descripción debe tener al menos 3 caracteres')
    .required('La descripción es requerida'),
  
  cost: yup
    .number()
    .min(0, 'El costo no puede ser negativo')
    .required('El costo es requerido'),
  
  date: yup
    .date()
    .required('La fecha es requerida')
})

// Esquema para validación de datos de facturación completos
export const fullBillingDataSchema = yup.object({
  user: yup.object({
    id: yup.string().required('ID de usuario requerido'),
    role: yup
      .string()
      .oneOf(['FAMILIAR', 'CORPORATIVO', 'EXTERNO'], 'Rol inválido')
      .required('Rol requerido'),
    billing: billingInfoSchema.required('Información de facturación requerida'),
    plan: yup.object({
      name: yup.string(),
      renewal_date: yup.date(),
      start_date: yup.date(),
      endDate: yup.date()
    }).optional()
  }).required('Usuario requerido'),
  
  additionalServices: yup
    .array()
    .of(additionalServiceSchema)
    .optional()
})

/**
 * Valida datos de facturación
 * @param {Object} data - Datos a validar
 * @returns {Object} Resultado de validación
 */
export const validateBillingData = async (data) => {
  try {
    await fullBillingDataSchema.validate(data, { abortEarly: false })
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
 * Valida método de pago
 * @param {string} method - Método de pago
 * @returns {boolean} Si es válido
 */
export const isValidPaymentMethod = (method) => {
  const validMethods = ['credit_card', 'debit_card', 'bank_transfer', 'invoice']
  return validMethods.includes(method)
}

/**
 * Valida montos de facturación
 * @param {number} amount - Monto a validar
 * @returns {boolean} Si es válido
 */
export const isValidAmount = (amount) => {
  return typeof amount === 'number' && amount >= 0 && isFinite(amount)
}