import * as yup from 'yup'

/**
 * Esquema de validación para datos de perfil de usuario
 * ✅ Regla #4: Validación completa con Yup
 * ✅ Regla #6: Documentación completa
 */

// Esquema para datos básicos de perfil
export const profileDataSchema = yup.object({
  phone: yup
    .string()
    .required('El teléfono es requerido')
    .matches(
      /^[\+]?[(]?[\+]?\d{2,3}[)]?[-\s\.]?\d{3,4}[-\s\.]?\d{3,6}$/,
      'El formato del teléfono no es válido'
    )
    .min(9, 'El teléfono debe tener al menos 9 dígitos')
    .max(15, 'El teléfono no puede tener más de 15 dígitos'),

  email: yup
    .string()
    .required('El email es requerido')
    .email('El formato del email no es válido')
    .max(100, 'El email no puede tener más de 100 caracteres')
})

// Esquema para contacto de emergencia
export const emergencyContactSchema = yup.object({
  name: yup
    .string()
    .required('El nombre es requerido')
    .min(2, 'El nombre debe tener al menos 2 caracteres')
    .max(50, 'El nombre no puede tener más de 50 caracteres'),

  relationship: yup
    .string()
    .required('La relación es requerida')
    .min(2, 'La relación debe tener al menos 2 caracteres')
    .max(30, 'La relación no puede tener más de 30 caracteres'),

  phone: yup
    .string()
    .required('El teléfono es requerido')
    .matches(
      /^[\+]?[(]?[\+]?\d{2,3}[)]?[-\s\.]?\d{3,4}[-\s\.]?\d{3,6}$/,
      'El formato del teléfono no es válido'
    ),

  isPrimary: yup.boolean().optional()
})

// Esquema para información médica
export const medicalInfoSchema = yup.object({
  bloodType: yup
    .string()
    .optional()
    .oneOf(['A+', 'A-', 'B+', 'B-', 'AB+', 'AB-', 'O+', 'O-'], 'Tipo de sangre inválido'),

  allergies: yup
    .string()
    .optional()
    .max(200, 'Las alergias no pueden tener más de 200 caracteres'),

  medicalConditions: yup
    .string()
    .optional()
    .max(300, 'Las condiciones médicas no pueden tener más de 300 caracteres'),

  medications: yup
    .string()
    .optional()
    .max(300, 'Los medicamentos no pueden tener más de 300 caracteres'),

  emergencyMedicalInfo: yup
    .string()
    .optional()
    .max(500, 'La información médica de emergencia no puede tener más de 500 caracteres')
})

// Esquema completo de perfil
export const fullProfileSchema = yup.object({
  personalInfo: profileDataSchema.required('La información personal es requerida'),
  
  emergencyContacts: yup
    .array()
    .of(emergencyContactSchema)
    .min(1, 'Debe tener al menos un contacto de emergencia')
    .max(3, 'No puede tener más de 3 contactos de emergencia')
    .test('primary-contact', 'Debe tener exactamente un contacto principal', (contacts) => {
      if (!contacts || contacts.length === 0) return true
      const primaryContacts = contacts.filter(contact => contact.isPrimary)
      return primaryContacts.length === 1
    })
    .optional(),

  medicalInfo: medicalInfoSchema.optional()
})

/**
 * Valida datos básicos de perfil
 * @param {Object} data - Datos a validar
 * @returns {Object} Resultado de validación
 */
export const validateProfileData = async (data) => {
  try {
    await profileDataSchema.validate(data, { abortEarly: false })
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
 * Valida contacto de emergencia
 * @param {Object} contact - Contacto a validar
 * @returns {Object} Resultado de validación
 */
export const validateEmergencyContact = async (contact) => {
  try {
    await emergencyContactSchema.validate(contact, { abortEarly: false })
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
 * Valida información médica
 * @param {Object} medicalData - Datos médicos a validar
 * @returns {Object} Resultado de validación
 */
export const validateMedicalInfo = async (medicalData) => {
  try {
    await medicalInfoSchema.validate(medicalData, { abortEarly: false })
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
 * Valida perfil completo
 * @param {Object} profileData - Datos completos de perfil
 * @returns {Object} Resultado de validación
 */
export const validateFullProfile = async (profileData) => {
  try {
    await fullProfileSchema.validate(profileData, { abortEarly: false })
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
 * Valida formato de teléfono
 * @param {string} phone - Teléfono a validar
 * @returns {boolean} Si es válido
 */
export const isValidPhone = (phone) => {
  const phoneRegex = /^[\+]?[(]?[\+]?\d{2,3}[)]?[-\s\.]?\d{3,4}[-\s\.]?\d{3,6}$/
  return phoneRegex.test(phone?.replace(/\s/g, '') || '')
}

/**
 * Valida formato de email
 * @param {string} email - Email a validar
 * @returns {boolean} Si es válido
 */
export const isValidEmail = (email) => {
  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/
  return emailRegex.test(email || '')
}