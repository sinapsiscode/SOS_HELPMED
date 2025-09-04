/**
 * Sistema de logging centralizado
 * ✅ Regla #12: No usar console.log directo
 *
 * @module logger
 */

const isDevelopment = process.env.NODE_ENV === 'development'
const isProduction = process.env.NODE_ENV === 'production'

/**
 * Niveles de log
 */
const LogLevel = {
  DEBUG: 'debug',
  INFO: 'info',
  WARN: 'warn',
  ERROR: 'error'
}

/**
 * Logger centralizado para toda la aplicación
 */
const logger = {
  /**
   * Log de depuración (solo en desarrollo)
   * @param {string} message - Mensaje a loggear
   * @param {*} data - Datos adicionales
   */
  debug: (message, data = null) => {
    if (isDevelopment) {
      console.log(`[DEBUG] ${new Date().toISOString()} - ${message}`, data || '')
    }
  },

  /**
   * Log informativo
   * @param {string} message - Mensaje a loggear
   * @param {*} data - Datos adicionales
   */
  info: (message, data = null) => {
    if (isDevelopment) {
      console.info(`[INFO] ${new Date().toISOString()} - ${message}`, data || '')
    }

    // En producción, enviar a servicio de logging
    if (isProduction && window.logService) {
      window.logService.log(LogLevel.INFO, message, data)
    }
  },

  /**
   * Log de advertencia
   * @param {string} message - Mensaje a loggear
   * @param {*} data - Datos adicionales
   */
  warn: (message, data = null) => {
    console.warn(`[WARN] ${new Date().toISOString()} - ${message}`, data || '')

    // En producción, enviar a servicio de logging
    if (isProduction && window.logService) {
      window.logService.log(LogLevel.WARN, message, data)
    }
  },

  /**
   * Log de error
   * @param {string} message - Mensaje de error
   * @param {Error|*} error - Error o datos adicionales
   * @param {Object} context - Contexto adicional
   */
  error: (message, error = null, context = {}) => {
    const errorData = {
      message,
      timestamp: new Date().toISOString(),
      context,
      stack: error?.stack,
      errorMessage: error?.message
    }

    console.error(`[ERROR] ${errorData.timestamp} - ${message}`, errorData)

    // En producción, enviar a servicio de monitoreo
    if (isProduction) {
      // Enviar a Sentry, LogRocket, etc.
      if (window.Sentry) {
        window.Sentry.captureException(error || new Error(message), {
          extra: context
        })
      }

      if (window.logService) {
        window.logService.log(LogLevel.ERROR, message, errorData)
      }
    }
  },

  /**
   * Log de métrica/performance
   * @param {string} metric - Nombre de la métrica
   * @param {number} value - Valor
   * @param {Object} tags - Tags adicionales
   */
  metric: (metric, value, tags = {}) => {
    if (isDevelopment) {
      console.log(`[METRIC] ${metric}: ${value}`, tags)
    }

    // En producción, enviar a servicio de métricas
    if (isProduction && window.metricsService) {
      window.metricsService.track(metric, value, tags)
    }
  },

  /**
   * Grupo de logs colapsable (útil para debugging)
   * @param {string} label - Etiqueta del grupo
   * @param {Function} callback - Función con los logs
   */
  group: (label, callback) => {
    if (isDevelopment) {
      console.group(label)
      try {
        callback()
      } finally {
        console.groupEnd()
      }
    }
  },

  /**
   * Log de tabla (útil para datos tabulares)
   * @param {*} data - Datos a mostrar en tabla
   */
  table: (data) => {
    if (isDevelopment && console.table) {
      console.table(data)
    }
  }
}

export default logger

// Exportar niveles de log
export { LogLevel }
