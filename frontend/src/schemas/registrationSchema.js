import * as Yup from 'yup'

/**
 * Esquemas de validación para RegistrationForm
 * ✅ Regla #4: Validación con esquema Yup
 */

// Esquema base para datos personales
const personalDataSchema = Yup.object().shape({
  name: Yup.string()
    .required('El nombre es requerido')
    .min(2, 'El nombre debe tener al menos 2 caracteres')
    .max(50, 'El nombre no puede exceder 50 caracteres'),
  lastName: Yup.string()
    .required('El apellido es requerido')
    .min(2, 'El apellido debe tener al menos 2 caracteres')
    .max(50, 'El apellido no puede exceder 50 caracteres'),
  email: Yup.string()
    .required('El email es requerido')
    .email('Debe ser un email válido'),
  phone: Yup.string()
    .required('El teléfono es requerido')
    .matches(/^[0-9+\-\s()]+$/, 'Formato de teléfono inválido')
    .min(9, 'El teléfono debe tener al menos 9 dígitos'),
  dni: Yup.string()
    .required('El DNI es requerido')
    .matches(/^[0-9]{8}$/, 'El DNI debe tener 8 dígitos'),
  address: Yup.string()
    .required('La dirección es requerida')
    .min(10, 'La dirección debe ser más específica'),
  district: Yup.string()
    .required('El distrito es requerido'),
  city: Yup.string()
    .required('La ciudad es requerida')
})

// Esquema para plan familiar
const familiarPlanSchema = personalDataSchema.shape({
  planType: Yup.string()
    .required('El tipo de plan es requerido')
    .equals(['familiar'], 'Debe ser plan familiar'),
  planSubtype: Yup.string()
    .required('El subtipo de plan es requerido')
    .oneOf(['help', 'basico', 'vip', 'dorado'], 'Subtipo de plan inválido'),
  birthDate: Yup.date()
    .required('La fecha de nacimiento es requerida')
    .max(new Date(), 'La fecha no puede ser futura')
    .test('age', 'Debe ser mayor de 18 años', function(birthDate) {
      if (!birthDate) return false
      const today = new Date()
      const age = today.getFullYear() - birthDate.getFullYear()
      return age >= 18
    }),
  emergencyContactName: Yup.string()
    .required('El nombre del contacto de emergencia es requerido'),
  emergencyContactPhone: Yup.string()
    .required('El teléfono del contacto de emergencia es requerido')
    .matches(/^[0-9+\-\s()]+$/, 'Formato de teléfono inválido'),
  emergencyContactRelation: Yup.string()
    .required('La relación del contacto de emergencia es requerida')
    .oneOf(['padre', 'madre', 'conyuge', 'hijo', 'hermano', 'amigo', 'otro'], 'Relación inválida'),
  medicalConditions: Yup.string()
    .max(500, 'Las condiciones médicas no pueden exceder 500 caracteres'),
  comments: Yup.string()
    .max(500, 'Los comentarios no pueden exceder 500 caracteres')
})

// Esquema para plan corporativo
const corporativePlanSchema = personalDataSchema.shape({
  planType: Yup.string()
    .required('El tipo de plan es requerido')
    .equals(['corporativo'], 'Debe ser plan corporativo'),
  planSubtype: Yup.string()
    .required('El subtipo de plan es requerido')
    .oneOf(['area_protegida'], 'Subtipo de plan inválido'),
  companyName: Yup.string()
    .required('El nombre de la empresa es requerido')
    .min(3, 'El nombre de la empresa debe tener al menos 3 caracteres'),
  ruc: Yup.string()
    .required('El RUC es requerido')
    .matches(/^[0-9]{11}$/, 'El RUC debe tener 11 dígitos'),
  contactPosition: Yup.string()
    .required('El cargo en la empresa es requerido')
    .min(3, 'El cargo debe tener al menos 3 caracteres')
})

// Esquema para plan externo
const externPlanSchema = personalDataSchema.shape({
  planType: Yup.string()
    .required('El tipo de plan es requerido')
    .equals(['externo'], 'Debe ser plan externo'),
  planSubtype: Yup.string()
    .required('El subtipo de plan es requerido')
    .oneOf(['caso1', 'caso2'], 'Subtipo de plan inválido'),
  birthDate: Yup.date()
    .required('La fecha de nacimiento es requerida')
    .max(new Date(), 'La fecha no puede ser futura'),
  externalEntity: Yup.string()
    .required('La entidad de procedencia es requerida')
    .oneOf(['BCR', 'RIMAC', 'PACIFICO', 'MAPFRE', 'other'], 'Entidad inválida'),
  externalEntityOther: Yup.string()
    .when('externalEntity', {
      is: 'other',
      then: (schema) => schema.required('Debe especificar la entidad'),
      otherwise: (schema) => schema.notRequired()
    }),
  emergencyContactName: Yup.string()
    .required('El nombre del contacto de emergencia es requerido'),
  emergencyContactPhone: Yup.string()
    .required('El teléfono del contacto de emergencia es requerido')
    .matches(/^[0-9+\-\s()]+$/, 'Formato de teléfono inválido'),
  emergencyContactRelation: Yup.string()
    .required('La relación del contacto de emergencia es requerida'),
  medicalConditions: Yup.string()
    .max(500, 'Las condiciones médicas no pueden exceder 500 caracteres'),
  comments: Yup.string()
    .max(500, 'Los comentarios no pueden exceder 500 caracteres')
})

/**
 * Función para obtener el esquema apropiado según el tipo de plan
 */
export const getRegistrationSchema = (planType) => {
  switch (planType) {
    case 'familiar':
      return familiarPlanSchema
    case 'corporativo':
      return corporativePlanSchema
    case 'externo':
      return externPlanSchema
    default:
      return personalDataSchema
  }
}

/**
 * Validador para datos de registro
 */
export const validateRegistrationData = (data) => {
  try {
    const schema = getRegistrationSchema(data.planType)
    schema.validateSync(data, { abortEarly: false })
    return { isValid: true, errors: [] }
  } catch (error) {
    return {
      isValid: false,
      errors: error.errors || [error.message]
    }
  }
}

/**
 * Validador asíncrono para datos de registro
 */
export const validateRegistrationDataAsync = async (data) => {
  try {
    const schema = getRegistrationSchema(data.planType)
    await schema.validate(data, { abortEarly: false })
    return { isValid: true, errors: [] }
  } catch (error) {
    return {
      isValid: false,
      errors: error.errors || [error.message]
    }
  }
}

export {
  personalDataSchema,
  familiarPlanSchema,
  corporativePlanSchema,
  externPlanSchema
}