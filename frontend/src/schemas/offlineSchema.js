import * as yup from 'yup'

/**
 * Esquema de validación para datos offline y sincronización
 * ✅ Regla #4: Validación completa con Yup
 * ✅ Regla #6: Documentación completa
 */

// Esquema para acción de sincronización
export const syncActionSchema = yup.object({
  type: yup
    .string()
    .required('El tipo de acción es requerido')
    .oneOf([
      'CREATE_EMERGENCY_REQUEST',
      'UPDATE_PROFILE',
      'CANCEL_SERVICE',
      'RATE_SERVICE',
      'UPDATE_MEDICAL_INFO',
      'ADD_EMERGENCY_CONTACT'
    ], 'Tipo de acción inválido'),

  data: yup
    .object()
    .required('Los datos de la acción son requeridos'),

  entityId: yup
    .string()
    .optional(),

  metadata: yup
    .object({
      userAgent: yup.string().optional(),
      timestamp: yup.date().optional(),
      retryCount: yup.number().min(0).optional()
    })
    .optional()
})

// Esquema para item pendiente de sincronización
export const pendingSyncItemSchema = yup.object({
  id: yup
    .string()
    .required('ID del item es requerido'),

  timestamp: yup
    .date()
    .required('Timestamp es requerido'),

  action: syncActionSchema.required('La acción es requerida'),

  userId: yup
    .string()
    .required('ID de usuario es requerido'),

  retryCount: yup
    .number()
    .min(0, 'El contador de reintentos no puede ser negativo')
    .max(10, 'Demasiados reintentos')
    .default(0),

  maxRetries: yup
    .number()
    .min(1, 'Debe permitir al menos 1 reintento')
    .max(10, 'Máximo 10 reintentos permitidos')
    .default(3),

  lastError: yup
    .string()
    .optional(),

  lastRetryAt: yup
    .date()
    .optional()
})

// Esquema para datos offline almacenados
export const offlineDataSchema = yup.object({
  // Datos pueden ser cualquier estructura, pero validamos metadatos
}).test('valid-offline-structure', 'Estructura de datos offline inválida', (value) => {
  if (!value || typeof value !== 'object') return false
  
  // Validar que cada entrada tenga la estructura correcta
  for (const [key, entry] of Object.entries(value)) {
    if (!entry || typeof entry !== 'object') return false
    
    // Verificar estructura básica de entrada offline
    const hasValidStructure = 
      typeof entry.timestamp === 'string' &&
      entry.data !== undefined &&
      typeof entry.synced === 'boolean'
    
    if (!hasValidStructure) return false
  }
  
  return true
})

// Esquema para configuración de almacenamiento offline
export const offlineConfigSchema = yup.object({
  maxStorageSize: yup
    .number()
    .min(1024, 'Tamaño mínimo de almacenamiento: 1KB')
    .max(50 * 1024 * 1024, 'Tamaño máximo de almacenamiento: 50MB')
    .default(10 * 1024 * 1024), // 10MB por defecto

  maxPendingItems: yup
    .number()
    .min(1, 'Debe permitir al menos 1 item pendiente')
    .max(1000, 'Máximo 1000 items pendientes')
    .default(100),

  syncInterval: yup
    .number()
    .min(30, 'Intervalo mínimo de sincronización: 30 segundos')
    .max(3600, 'Intervalo máximo de sincronización: 1 hora')
    .default(300), // 5 minutos por defecto

  retentionDays: yup
    .number()
    .min(1, 'Retención mínima: 1 día')
    .max(30, 'Retención máxima: 30 días')
    .default(7)
})

// Esquema para estadísticas de sincronización
export const syncStatsSchema = yup.object({
  totalSynced: yup
    .number()
    .min(0, 'Total sincronizado no puede ser negativo')
    .default(0),

  totalFailed: yup
    .number()
    .min(0, 'Total fallido no puede ser negativo')
    .default(0),

  lastSyncAt: yup
    .date()
    .optional(),

  averageSyncTime: yup
    .number()
    .min(0, 'Tiempo promedio no puede ser negativo')
    .optional(),

  successRate: yup
    .number()
    .min(0, 'Tasa de éxito mínima: 0%')
    .max(100, 'Tasa de éxito máxima: 100%')
    .optional()
})

/**
 * Valida datos offline
 * @param {Object} data - Datos offline a validar
 * @returns {Object} Resultado de validación
 */
export const validateOfflineData = async (data) => {
  try {
    await offlineDataSchema.validate(data, { abortEarly: false })
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
 * Valida acción de sincronización
 * @param {Object} action - Acción a validar
 * @returns {Object} Resultado de validación
 */
export const validateSyncAction = async (action) => {
  try {
    await syncActionSchema.validate(action, { abortEarly: false })
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
 * Valida item pendiente de sincronización
 * @param {Object} item - Item a validar
 * @returns {Object} Resultado de validación
 */
export const validatePendingSyncItem = async (item) => {
  try {
    await pendingSyncItemSchema.validate(item, { abortEarly: false })
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
 * Valida configuración offline
 * @param {Object} config - Configuración a validar
 * @returns {Object} Resultado de validación
 */
export const validateOfflineConfig = async (config) => {
  try {
    await offlineConfigSchema.validate(config, { abortEarly: false })
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
 * Valida estadísticas de sincronización
 * @param {Object} stats - Estadísticas a validar
 * @returns {Object} Resultado de validación
 */
export const validateSyncStats = async (stats) => {
  try {
    await syncStatsSchema.validate(stats, { abortEarly: false })
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
 * Verifica si una acción es válida para sincronización
 * @param {string} actionType - Tipo de acción
 * @returns {boolean} Si es válida
 */
export const isValidSyncActionType = (actionType) => {
  const validTypes = [
    'CREATE_EMERGENCY_REQUEST',
    'UPDATE_PROFILE',
    'CANCEL_SERVICE',
    'RATE_SERVICE',
    'UPDATE_MEDICAL_INFO',
    'ADD_EMERGENCY_CONTACT'
  ]
  return validTypes.includes(actionType)
}

/**
 * Calcula el tamaño de datos en bytes
 * @param {Object} data - Datos a medir
 * @returns {number} Tamaño en bytes
 */
export const calculateDataSize = (data) => {
  return new Blob([JSON.stringify(data)]).size
}

/**
 * Verifica si los datos exceden el límite de almacenamiento
 * @param {Object} data - Datos a verificar
 * @param {number} maxSize - Tamaño máximo en bytes
 * @returns {boolean} Si excede el límite
 */
export const exceedsStorageLimit = (data, maxSize = 10 * 1024 * 1024) => {
  return calculateDataSize(data) > maxSize
}