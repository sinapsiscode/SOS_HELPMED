import * as Yup from 'yup'

/**
 * Esquema de validación para ServiceCounter
 * ✅ Regla #4: Validación con esquema Yup
 */

// Esquema para estadística de servicio individual
export const serviceStatSchema = Yup.object().shape({
  type: Yup.string()
    .required('Tipo de servicio requerido')
    .oneOf([
      'EMERGENCIA',
      'URGENCIA', 
      'MEDICO_DOMICILIO',
      'TRASLADO_PROGRAMADO',
      'ZONA_PROTEGIDA',
      'ORIENTACION_TELEFONICA',
      'EXAMENES_LABORATORIO'
    ], 'Tipo de servicio inválido'),
  used: Yup.number()
    .min(0, 'Uso no puede ser negativo')
    .required('Uso requerido'),
  limit: Yup.mixed()
    .test('valid-limit', 'Límite debe ser número o "ILIMITADO"', (value) => {
      return typeof value === 'number' && value >= 0 || value === 'ILIMITADO'
    })
    .required('Límite requerido'),
  percentage: Yup.number()
    .min(0, 'Porcentaje no puede ser negativo')
    .max(100, 'Porcentaje no puede exceder 100')
    .required('Porcentaje requerido')
})

// Esquema para array de estadísticas
export const serviceStatsSchema = Yup.array()
  .of(serviceStatSchema)
  .min(0, 'Array de estadísticas requerido')

// Esquema para datos de servicios de entrada
export const servicesDataSchema = Yup.object().shape({
  breakdown: Yup.object()
    .required('Breakdown de servicios requerido'),
  orientacion_used: Yup.number()
    .min(0, 'Uso de orientación no puede ser negativo')
    .nullable()
})

// Esquema para resumen de servicios
export const serviceSummarySchema = Yup.object().shape({
  totalUsed: Yup.number()
    .min(0, 'Total usado no puede ser negativo')
    .required('Total usado requerido'),
  unlimitedServices: Yup.number()
    .min(0, 'Servicios ilimitados no puede ser negativo')
    .required('Servicios ilimitados requerido'),
  servicesNearLimit: Yup.number()
    .min(0, 'Servicios cerca límite no puede ser negativo')
    .required('Servicios cerca límite requerido'),
  servicesAtLimit: Yup.number()
    .min(0, 'Servicios agotados no puede ser negativo')
    .required('Servicios agotados requerido'),
  hasAlerts: Yup.boolean()
    .required('Has alerts requerido')
})

/**
 * Validador para datos de servicios
 */
export const validateServicesData = (data) => {
  try {
    servicesDataSchema.validateSync(data, { abortEarly: false })
    return { isValid: true, errors: [] }
  } catch (error) {
    return {
      isValid: false,
      errors: error.errors || [error.message]
    }
  }
}

/**
 * Validador para estadísticas procesadas
 */
export const validateServiceStats = (stats) => {
  try {
    serviceStatsSchema.validateSync(stats, { abortEarly: false })
    return { isValid: true, errors: [] }
  } catch (error) {
    return {
      isValid: false,
      errors: error.errors || [error.message]
    }
  }
}