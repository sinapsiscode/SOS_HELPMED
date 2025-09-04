import * as yup from 'yup'
import {
  RELATIONSHIP_TYPES,
  VALIDATION_RULES,
  ERROR_MESSAGES
} from '../constants/affiliateConstants'

/**
 * Schema de validación para afiliados
 * Define reglas completas para crear y actualizar afiliados
 */
export const affiliateSchema = yup.object({
  name: yup
    .string()
    .required('El nombre es obligatorio')
    .trim()
    .min(
      VALIDATION_RULES.NAME.MIN_LENGTH,
      `El nombre debe tener al menos ${VALIDATION_RULES.NAME.MIN_LENGTH} caracteres`
    )
    .max(
      VALIDATION_RULES.NAME.MAX_LENGTH,
      `El nombre no puede superar ${VALIDATION_RULES.NAME.MAX_LENGTH} caracteres`
    )
    .matches(VALIDATION_RULES.NAME.PATTERN, 'El nombre solo puede contener letras y espacios'),

  dni: yup
    .string()
    .required('El DNI es obligatorio')
    .trim()
    .min(
      VALIDATION_RULES.DNI.MIN_LENGTH,
      `El DNI debe tener al menos ${VALIDATION_RULES.DNI.MIN_LENGTH} dígitos`
    )
    .max(
      VALIDATION_RULES.DNI.MAX_LENGTH,
      `El DNI no puede superar ${VALIDATION_RULES.DNI.MAX_LENGTH} dígitos`
    )
    .matches(VALIDATION_RULES.DNI.PATTERN, 'El DNI solo puede contener números'),

  phone: yup
    .string()
    .optional()
    .nullable()
    .test('phone-validation', 'El teléfono debe tener un formato válido', function(value) {
      if (!value || value.length === 0) return true
      
      if (value.length < VALIDATION_RULES.PHONE.MIN_LENGTH) {
        return this.createError({ 
          message: `El teléfono debe tener al menos ${VALIDATION_RULES.PHONE.MIN_LENGTH} dígitos` 
        })
      }
      
      if (value.length > VALIDATION_RULES.PHONE.MAX_LENGTH) {
        return this.createError({ 
          message: `El teléfono no puede superar ${VALIDATION_RULES.PHONE.MAX_LENGTH} caracteres` 
        })
      }
      
      if (!VALIDATION_RULES.PHONE.PATTERN.test(value)) {
        return this.createError({ 
          message: 'El teléfono debe tener un formato válido' 
        })
      }
      
      return true
    }),

  relationship: yup
    .string()
    .required('La relación familiar es obligatoria')
    .oneOf(Object.values(RELATIONSHIP_TYPES), 'La relación familiar debe ser válida'),

  birthDate: yup
    .date()
    .optional()
    .nullable()
    .max(new Date(), 'La fecha de nacimiento no puede ser futura')
    .test('age-limit', 'La edad no puede superar 120 años', function (value) {
      if (!value) return true

      const today = new Date()
      const age = today.getFullYear() - value.getFullYear()
      return age <= VALIDATION_RULES.AGE.MAX
    })
})

/**
 * Schema para validación de formulario de afiliado
 * Versión más estricta para formularios de creación
 */
export const affiliateFormSchema = affiliateSchema.shape({
  name: yup
    .string()
    .required('El nombre es obligatorio')
    .trim()
    .min(
      VALIDATION_RULES.NAME.MIN_LENGTH,
      `El nombre debe tener al menos ${VALIDATION_RULES.NAME.MIN_LENGTH} caracteres`
    )
    .max(
      VALIDATION_RULES.NAME.MAX_LENGTH,
      `El nombre no puede superar ${VALIDATION_RULES.NAME.MAX_LENGTH} caracteres`
    )
    .matches(VALIDATION_RULES.NAME.PATTERN, 'El nombre solo puede contener letras y espacios')
    .test('no-only-spaces', 'El nombre no puede contener solo espacios', (value) => {
      return value && value.trim().length > 0
    }),

  dni: yup
    .string()
    .required('El DNI es obligatorio')
    .trim()
    .min(
      VALIDATION_RULES.DNI.MIN_LENGTH,
      `El DNI debe tener al menos ${VALIDATION_RULES.DNI.MIN_LENGTH} dígitos`
    )
    .max(
      VALIDATION_RULES.DNI.MAX_LENGTH,
      `El DNI no puede superar ${VALIDATION_RULES.DNI.MAX_LENGTH} dígitos`
    )
    .matches(VALIDATION_RULES.DNI.PATTERN, 'El DNI solo puede contener números')
    .test('valid-dni', 'El DNI debe ser válido', (value) => {
      // Validación básica de DNI peruano (8 dígitos) o extranjero (hasta 12)
      if (!value) return false
      const cleanDni = value.replace(/\D/g, '')
      return cleanDni.length >= 7 && cleanDni.length <= 12
    })
})

/**
 * Schema para validación de actualización parcial
 * Permite campos opcionales para updates
 */
export const affiliateUpdateSchema = yup.object({
  name: yup
    .string()
    .optional()
    .trim()
    .min(
      VALIDATION_RULES.NAME.MIN_LENGTH,
      `El nombre debe tener al menos ${VALIDATION_RULES.NAME.MIN_LENGTH} caracteres`
    )
    .max(
      VALIDATION_RULES.NAME.MAX_LENGTH,
      `El nombre no puede superar ${VALIDATION_RULES.NAME.MAX_LENGTH} caracteres`
    )
    .matches(VALIDATION_RULES.NAME.PATTERN, 'El nombre solo puede contener letras y espacios'),

  dni: yup
    .string()
    .optional()
    .trim()
    .min(
      VALIDATION_RULES.DNI.MIN_LENGTH,
      `El DNI debe tener al menos ${VALIDATION_RULES.DNI.MIN_LENGTH} dígitos`
    )
    .max(
      VALIDATION_RULES.DNI.MAX_LENGTH,
      `El DNI no puede superar ${VALIDATION_RULES.DNI.MAX_LENGTH} dígitos`
    )
    .matches(VALIDATION_RULES.DNI.PATTERN, 'El DNI solo puede contener números'),

  phone: yup
    .string()
    .optional()
    .nullable()
    .test('phone-validation', 'El teléfono debe tener un formato válido', function(value) {
      if (!value || value.length === 0) return true
      
      if (value.length < VALIDATION_RULES.PHONE.MIN_LENGTH) {
        return this.createError({ 
          message: `El teléfono debe tener al menos ${VALIDATION_RULES.PHONE.MIN_LENGTH} dígitos` 
        })
      }
      
      if (value.length > VALIDATION_RULES.PHONE.MAX_LENGTH) {
        return this.createError({ 
          message: `El teléfono no puede superar ${VALIDATION_RULES.PHONE.MAX_LENGTH} caracteres` 
        })
      }
      
      if (!VALIDATION_RULES.PHONE.PATTERN.test(value)) {
        return this.createError({ 
          message: 'El teléfono debe tener un formato válido' 
        })
      }
      
      return true
    }),

  relationship: yup
    .string()
    .optional()
    .oneOf(Object.values(RELATIONSHIP_TYPES), 'La relación familiar debe ser válida'),

  birthDate: yup
    .date()
    .optional()
    .nullable()
    .max(new Date(), 'La fecha de nacimiento no puede ser futura')
})

/**
 * Schema para validación de límites de afiliados
 * Valida restricciones de plan
 */
export const affiliateLimitSchema = yup.object({
  currentCount: yup.number().required().min(0, 'El conteo actual no puede ser negativo'),

  maxAllowed: yup
    .number()
    .required()
    .min(-1, 'El límite máximo debe ser -1 (ilimitado) o mayor a 0')
    .test('limit-check', 'Se ha alcanzado el límite máximo de afiliados', function (value) {
      const { currentCount } = this.parent
      if (value === -1) return true // Sin límite
      return currentCount < value
    })
})
