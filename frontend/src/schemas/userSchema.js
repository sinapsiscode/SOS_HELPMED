import * as yup from 'yup'
import { VALIDATION_LIMITS } from '../constants/adminDashboard'

/**
 * Schema de validación para usuarios del sistema
 * Define reglas de validación para crear y actualizar usuarios
 */
export const userSchema = yup.object({
  name: yup
    .string()
    .required('El nombre es requerido')
    .trim()
    .min(2, 'El nombre debe tener al menos 2 caracteres')
    .max(
      VALIDATION_LIMITS.NAME_MAX_LENGTH,
      `El nombre no puede superar ${VALIDATION_LIMITS.NAME_MAX_LENGTH} caracteres`
    )
    .matches(/^[a-zA-ZáéíóúÁÉÍÓÚñÑ\s]+$/, 'El nombre solo puede contener letras y espacios'),

  email: yup
    .string()
    .required('El email es requerido')
    .trim()
    .email('El email debe tener un formato válido')
    .max(
      VALIDATION_LIMITS.EMAIL_MAX_LENGTH,
      `El email no puede superar ${VALIDATION_LIMITS.EMAIL_MAX_LENGTH} caracteres`
    )
    .lowercase(),

  role: yup
    .string()
    .required('El rol es requerido')
    .oneOf(['familiar', 'corporate', 'admin'], 'El rol debe ser familiar, corporate o admin'),

  status: yup
    .string()
    .required('El estado es requerido')
    .oneOf(['active', 'inactive', 'suspended'], 'El estado debe ser active, inactive o suspended'),

  plan: yup
    .string()
    .required('El plan es requerido')
    .oneOf(['Básico', 'Premium', 'Corporativo'], 'El plan debe ser Básico, Premium o Corporativo'),

  phone: yup
    .string()
    .optional()
    .matches(/^\+?[\d\s\-\(\)]+$/, 'El teléfono debe tener un formato válido')
    .min(8, 'El teléfono debe tener al menos 8 dígitos')
    .max(20, 'El teléfono no puede superar 20 caracteres'),

  age: yup
    .number()
    .optional()
    .positive('La edad debe ser un número positivo')
    .min(18, 'Debe ser mayor de edad')
    .max(120, 'La edad no puede superar 120 años')
    .integer('La edad debe ser un número entero')
})

/**
 * Schema para búsqueda de usuarios
 * Valida los parámetros de filtrado y búsqueda
 */
export const userSearchSchema = yup.object({
  searchTerm: yup
    .string()
    .optional()
    .trim()
    .min(
      VALIDATION_LIMITS.SEARCH_MIN_LENGTH,
      `La búsqueda debe tener al menos ${VALIDATION_LIMITS.SEARCH_MIN_LENGTH} caracteres`
    )
    .max(
      VALIDATION_LIMITS.SEARCH_MAX_LENGTH,
      `La búsqueda no puede superar ${VALIDATION_LIMITS.SEARCH_MAX_LENGTH} caracteres`
    ),

  status: yup
    .string()
    .optional()
    .oneOf(['all', 'active', 'inactive', 'suspended'], 'Estado de filtro inválido'),

  role: yup
    .string()
    .optional()
    .oneOf(['all', 'familiar', 'corporate', 'admin'], 'Rol de filtro inválido'),

  sortBy: yup
    .string()
    .optional()
    .oneOf(['name', 'email', 'createdAt', 'status'], 'Campo de ordenamiento inválido'),

  sortOrder: yup.string().optional().oneOf(['asc', 'desc'], 'Orden inválido')
})

/**
 * Schema para actualización masiva de usuarios
 * Valida operaciones en lote
 */
export const bulkUserUpdateSchema = yup.object({
  userIds: yup
    .array()
    .of(yup.string().required())
    .min(1, 'Debe seleccionar al menos un usuario')
    .max(100, 'No se pueden actualizar más de 100 usuarios a la vez')
    .required('Los IDs de usuario son requeridos'),

  action: yup
    .string()
    .required('La acción es requerida')
    .oneOf(['activate', 'deactivate', 'suspend', 'delete'], 'Acción inválida'),

  reason: yup
    .string()
    .when('action', {
      is: (action) => ['suspend', 'delete'].includes(action),
      then: (schema) => schema.required('La razón es requerida para esta acción'),
      otherwise: (schema) => schema.optional()
    })
    .max(500, 'La razón no puede superar 500 caracteres')
})
