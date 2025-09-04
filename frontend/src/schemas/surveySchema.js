import * as yup from 'yup'

/**
 * Esquema de validación para encuestas de satisfacción
 * ✅ Regla #4: Validación completa con Yup
 */

// Esquema para calificaciones individuales
const ratingSchema = yup
  .number()
  .min(1, 'Debe seleccionar una calificación')
  .max(5, 'La calificación máxima es 5')
  .required('La calificación es requerida')

// Esquema para el formulario de encuesta
export const satisfactionSurveySchema = yup.object({
  ratings: yup
    .object({
      question1: ratingSchema,
      question2: ratingSchema,
      question3: ratingSchema,
      question4: ratingSchema,
      question5: ratingSchema
    })
    .required('Las calificaciones son requeridas'),

  comments: yup.string().max(500, 'Los comentarios no pueden exceder 500 caracteres').optional(),

  serviceId: yup.string().required('El ID del servicio es requerido'),

  serviceType: yup.string().required('El tipo de servicio es requerido')
})

/**
 * Valida datos de encuesta
 * @param {Object} data - Datos a validar
 * @returns {Object} Resultado de validación
 */
export const validateSurveyData = async (data) => {
  try {
    await satisfactionSurveySchema.validate(data, { abortEarly: false })
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
