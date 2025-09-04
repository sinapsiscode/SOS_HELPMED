import * as Yup from 'yup'

/**
 * Esquemas de validación para UnitsSection
 * ✅ Regla #4: Validación con esquema Yup
 */

// Esquema para unidad médica
export const unitSchema = Yup.object().shape({
  id: Yup.string()
    .required('ID de unidad es requerido')
    .min(1, 'ID debe tener al menos 1 carácter'),
  type: Yup.string()
    .required('Tipo de unidad es requerido')
    .oneOf([
      'Ambulancia Básica',
      'Ambulancia Avanzada',
      'Unidad de Rescate',
      'Unidad Especializada'
    ], 'Tipo de unidad inválido'),
  status: Yup.string()
    .required('Estado es requerido')
    .oneOf(['available', 'busy', 'maintenance'], 'Estado inválido'),
  location: Yup.string()
    .required('Ubicación es requerida')
    .min(3, 'Ubicación debe tener al menos 3 caracteres'),
  crew: Yup.number()
    .required('Número de tripulación es requerido')
    .integer('Debe ser un número entero')
    .min(1, 'Debe tener al menos 1 tripulante')
    .max(6, 'No puede tener más de 6 tripulantes'),
  equipment: Yup.string()
    .required('Equipamiento es requerido')
    .min(5, 'Descripción de equipamiento muy corta')
})

// Esquema para array de unidades
export const unitsArraySchema = Yup.array()
  .of(unitSchema)
  .min(0, 'Array de unidades inválido')

// Esquema para estadísticas de unidades
export const unitStatsSchema = Yup.object().shape({
  available: Yup.number()
    .min(0, 'Unidades disponibles no puede ser negativo')
    .required('Unidades disponibles requerido'),
  busy: Yup.number()
    .min(0, 'Unidades ocupadas no puede ser negativo')
    .required('Unidades ocupadas requerido'),
  maintenance: Yup.number()
    .min(0, 'Unidades en mantenimiento no puede ser negativo')
    .default(0),
  total: Yup.number()
    .min(0, 'Total de unidades no puede ser negativo')
    .required('Total de unidades requerido')
})

/**
 * Validador para unidad individual
 */
export const validateUnit = (unit) => {
  try {
    unitSchema.validateSync(unit, { abortEarly: false })
    return { isValid: true, errors: [] }
  } catch (error) {
    return {
      isValid: false,
      errors: error.errors || [error.message]
    }
  }
}

/**
 * Validador para array de unidades
 */
export const validateUnitsArray = (units) => {
  try {
    unitsArraySchema.validateSync(units, { abortEarly: false })
    return { isValid: true, errors: [] }
  } catch (error) {
    return {
      isValid: false,
      errors: error.errors || [error.message]
    }
  }
}

/**
 * Función para calcular estadísticas de unidades
 */
export const calculateUnitStats = (units) => {
  if (!Array.isArray(units)) {
    return {
      available: 0,
      busy: 0,
      maintenance: 0,
      total: 0
    }
  }

  const stats = units.reduce(
    (acc, unit) => {
      if (unit.status === 'available') acc.available++
      else if (unit.status === 'busy') acc.busy++
      else if (unit.status === 'maintenance') acc.maintenance++
      acc.total++
      return acc
    },
    { available: 0, busy: 0, maintenance: 0, total: 0 }
  )

  return stats
}