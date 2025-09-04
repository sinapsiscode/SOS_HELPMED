import * as yup from 'yup'

/**
 * Schema de validación para configuraciones del sistema
 * Define reglas para ajustes administrativos
 */
export const systemSettingsSchema = yup.object({
  corporateServicesAlertThreshold: yup
    .number()
    .required('El umbral para corporativos es requerido')
    .min(1, 'El umbral debe ser al menos 1')
    .max(20, 'El umbral no puede superar 20 servicios')
    .integer('Debe ser un número entero'),

  familiarServicesAlertThreshold: yup
    .number()
    .required('El umbral para familiares es requerido')
    .min(0, 'El umbral debe ser al menos 0')
    .max(10, 'El umbral no puede superar 10 servicios')
    .integer('Debe ser un número entero'),

  contractExpirationAlertDays: yup
    .number()
    .required('Los días de alerta son requeridos')
    .min(1, 'Debe ser al menos 1 día')
    .max(365, 'No puede superar 365 días')
    .integer('Debe ser un número entero'),

  autoEmailReminders: yup.boolean().required('La configuración de recordatorios es requerida'),

  smsNotifications: yup.boolean().required('La configuración de SMS es requerida'),

  maxFileUploadSize: yup
    .number()
    .optional()
    .min(1, 'El tamaño mínimo es 1 MB')
    .max(100, 'El tamaño máximo es 100 MB')
    .integer('Debe ser un número entero'),

  sessionTimeout: yup
    .number()
    .optional()
    .min(15, 'El timeout mínimo es 15 minutos')
    .max(480, 'El timeout máximo es 8 horas (480 minutos)')
    .integer('Debe ser un número entero')
})

/**
 * Schema para reportes y consultas administrativas
 * Valida parámetros de generación de reportes
 */
export const reportQuerySchema = yup.object({
  startDate: yup
    .date()
    .required('La fecha de inicio es requerida')
    .max(new Date(), 'La fecha de inicio no puede ser futura'),

  endDate: yup
    .date()
    .required('La fecha de fin es requerida')
    .min(yup.ref('startDate'), 'La fecha de fin debe ser posterior a la de inicio')
    .max(new Date(), 'La fecha de fin no puede ser futura'),

  reportType: yup
    .string()
    .required('El tipo de reporte es requerido')
    .oneOf(['users', 'emergencies', 'revenue', 'performance'], 'Tipo de reporte inválido'),

  format: yup
    .string()
    .required('El formato es requerido')
    .oneOf(['pdf', 'excel', 'csv'], 'Formato inválido'),

  includeDetails: yup.boolean().optional().default(false),

  groupBy: yup.string().optional().oneOf(['day', 'week', 'month'], 'Agrupación inválida')
})

/**
 * Schema para notificaciones del sistema
 * Valida envío de notificaciones administrativas
 */
export const notificationSchema = yup.object({
  title: yup
    .string()
    .required('El título es requerido')
    .trim()
    .min(5, 'El título debe tener al menos 5 caracteres')
    .max(100, 'El título no puede superar 100 caracteres'),

  message: yup
    .string()
    .required('El mensaje es requerido')
    .trim()
    .min(10, 'El mensaje debe tener al menos 10 caracteres')
    .max(500, 'El mensaje no puede superar 500 caracteres'),

  type: yup
    .string()
    .required('El tipo de notificación es requerido')
    .oneOf(['info', 'warning', 'error', 'success'], 'Tipo de notificación inválido'),

  audience: yup
    .string()
    .required('La audiencia es requerida')
    .oneOf(['all', 'admins', 'corporates', 'familiars'], 'Audiencia inválida'),

  priority: yup
    .string()
    .optional()
    .oneOf(['low', 'normal', 'high', 'urgent'], 'Prioridad inválida')
    .default('normal'),

  scheduledFor: yup.date().optional().min(new Date(), 'La fecha programada debe ser futura'),

  channels: yup
    .array()
    .of(yup.string().oneOf(['email', 'sms', 'push', 'in-app']))
    .min(1, 'Debe seleccionar al menos un canal')
    .required('Los canales son requeridos')
})
