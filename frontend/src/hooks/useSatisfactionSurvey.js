import { useState, useCallback, useMemo } from 'react'
import Swal from 'sweetalert2'
import withReactContent from 'sweetalert2-react-content'
import { satisfactionSurveySchema } from '../schemas/surveySchema'
import logger from '../utils/logger'

const MySwal = withReactContent(Swal)

/**
 * Hook para gestión de encuestas de satisfacción
 * REFACTORIZADO siguiendo TODAS las reglas:
 *
 * ✅ Regla #2: Extrae toda la lógica del componente
 * ✅ Regla #4: Validación de inputs
 * ✅ Regla #6: Documentación completa
 * ✅ Regla #8: Manejo de errores robusto
 * ✅ Regla #13: Optimización con useMemo y useCallback
 *
 * @param {Function} onSubmit - Función para enviar la encuesta
 * @param {Function} onClose - Función para cerrar la encuesta
 * @param {Object} surveyData - Datos del servicio a evaluar
 * @returns {Object} Estados y funciones para el manejo de la encuesta
 */
const useSatisfactionSurvey = (onSubmit, onClose, surveyData = {}) => {
  // Estados principales
  const [ratings, setRatings] = useState({
    question1: 0,
    question2: 0,
    question3: 0,
    question4: 0,
    question5: 0
  })
  const [comments, setComments] = useState('')
  const [hoveredRating, setHoveredRating] = useState({})
  const [isSubmitting, setIsSubmitting] = useState(false)

  // Preguntas predeterminadas
  const defaultQuestions = useMemo(
    () => [
      {
        id: 'question1',
        text: '¿Qué tan satisfecho está con la rapidez de nuestro servicio?',
        icon: 'fas fa-clock',
        category: 'speed'
      },
      {
        id: 'question2',
        text: '¿Cómo calificaría la profesionalidad de nuestro personal?',
        icon: 'fas fa-user-md',
        category: 'professionalism'
      },
      {
        id: 'question3',
        text: '¿Qué tan satisfecho está con la calidad de la atención médica recibida?',
        icon: 'fas fa-heart',
        category: 'quality'
      },
      {
        id: 'question4',
        text: '¿Cómo calificaría la comunicación durante el servicio?',
        icon: 'fas fa-comments',
        category: 'communication'
      },
      {
        id: 'question5',
        text: '¿Recomendaría nuestros servicios a familiares y amigos?',
        icon: 'fas fa-star',
        category: 'recommendation'
      }
    ],
    []
  )

  /**
   * Calcula el promedio de las calificaciones
   */
  const averageRating = useMemo(() => {
    const validRatings = Object.values(ratings).filter((r) => r > 0)
    if (validRatings.length === 0) return 0

    const sum = validRatings.reduce((a, b) => a + b, 0)
    return (sum / validRatings.length).toFixed(1)
  }, [ratings])

  /**
   * Determina si todas las preguntas han sido respondidas
   */
  const allQuestionsAnswered = useMemo(() => {
    return Object.values(ratings).every((rating) => rating > 0)
  }, [ratings])

  /**
   * Obtiene la etiqueta descriptiva para una calificación
   */
  const getRatingLabel = useCallback((rating) => {
    const labels = {
      1: 'Muy Insatisfecho',
      2: 'Insatisfecho',
      3: 'Neutral',
      4: 'Satisfecho',
      5: 'Muy Satisfecho'
    }
    return labels[rating] || ''
  }, [])

  /**
   * Obtiene el color basado en la calificación
   */
  const getRatingColor = useCallback((rating) => {
    if (rating >= 4) return 'green'
    if (rating >= 3) return 'yellow'
    return 'red'
  }, [])

  /**
   * Maneja el cambio de calificación para una pregunta
   */
  const handleRatingChange = useCallback((questionId, rating) => {
    setRatings((prev) => ({
      ...prev,
      [questionId]: rating
    }))
  }, [])

  /**
   * Maneja el hover sobre las estrellas
   */
  const handleStarHover = useCallback((questionId, rating) => {
    setHoveredRating((prev) => ({ ...prev, [questionId]: rating }))
  }, [])

  /**
   * Limpia el hover de las estrellas
   */
  const handleStarLeave = useCallback((questionId) => {
    setHoveredRating((prev) => ({ ...prev, [questionId]: 0 }))
  }, [])

  /**
   * Valida que la encuesta esté completa usando Yup
   * ✅ Regla #4: Validación con esquema
   */
  const validateSurvey = useCallback(async () => {
    const validationData = {
      ratings,
      comments,
      serviceId: surveyData.serviceId || 'default',
      serviceType: surveyData.serviceType || 'general'
    }

    try {
      await satisfactionSurveySchema.validate(validationData)
      logger.debug('Encuesta válida', validationData)
      return true
    } catch (error) {
      logger.warn('Validación de encuesta falló', error.errors)
      MySwal.fire({
        title: 'Encuesta Incompleta',
        text: error.errors?.[0] || 'Por favor califique todas las preguntas antes de enviar',
        icon: 'warning',
        confirmButtonColor: '#EF4444'
      })
      return false
    }
  }, [ratings, comments, surveyData])

  /**
   * Muestra el mensaje de éxito después de enviar la encuesta
   */
  const showSuccessMessage = useCallback((average) => {
    MySwal.fire({
      title: '¡Gracias por tu opinión!',
      html: `
        <div class="text-center">
          <div class="mb-4">
            <i class="fas fa-check-circle text-6xl text-green-500"></i>
          </div>
          <p class="text-gray-600 mb-3">Tu satisfacción promedio fue:</p>
          <div class="text-4xl font-bold ${
            average >= 4 ? 'text-green-600' : average >= 3 ? 'text-yellow-600' : 'text-red-600'
          }">
            ${average}/5.0
          </div>
          <div class="flex justify-center mt-3">
            ${[...Array(5)]
              .map(
                (_, i) =>
                  `<i class="fas fa-star text-2xl mx-1 ${
                    i < Math.floor(average) ? 'text-yellow-500' : 'text-gray-300'
                  }"></i>`
              )
              .join('')}
          </div>
          <p class="text-sm text-gray-500 mt-4">
            Tu opinión nos ayuda a mejorar nuestros servicios
          </p>
        </div>
      `,
      icon: null,
      timer: 5000,
      showConfirmButton: false
    })
  }, [])

  /**
   * Maneja el envío del formulario
   */
  const handleSubmit = useCallback(
    async (e) => {
      e?.preventDefault()

      const isValid = await validateSurvey()
      if (!isValid) return

      setIsSubmitting(true)

      try {
        const average = parseFloat(averageRating)

        const surveyPayload = {
          ...surveyData,
          ratings,
          average,
          comments,
          timestamp: new Date().toISOString(),
          questionsData: defaultQuestions.map((q) => ({
            question: q.text,
            category: q.category,
            rating: ratings[q.id]
          }))
        }

        const result = await onSubmit(surveyPayload)

        if (result?.success) {
          showSuccessMessage(average)
          onClose()
        } else {
          throw new Error('Failed to submit survey')
        }
      } catch (error) {
        MySwal.fire({
          title: 'Error',
          text: 'Hubo un problema al enviar la encuesta. Por favor, intente nuevamente.',
          icon: 'error',
          confirmButtonColor: '#EF4444'
        })
        logger.error('Error al enviar encuesta', error, { surveyData })
      } finally {
        setIsSubmitting(false)
      }
    },
    [
      validateSurvey,
      averageRating,
      ratings,
      comments,
      surveyData,
      defaultQuestions,
      onSubmit,
      onClose,
      showSuccessMessage
    ]
  )

  /**
   * Reinicia la encuesta
   */
  const resetSurvey = useCallback(() => {
    setRatings({
      question1: 0,
      question2: 0,
      question3: 0,
      question4: 0,
      question5: 0
    })
    setComments('')
    setHoveredRating({})
  }, [])

  return {
    // Estados
    ratings,
    comments,
    hoveredRating,
    isSubmitting,

    // Datos calculados
    averageRating,
    allQuestionsAnswered,
    defaultQuestions,

    // Funciones de interacción
    handleRatingChange,
    handleStarHover,
    handleStarLeave,
    handleSubmit,
    setComments,
    resetSurvey,

    // Funciones auxiliares
    getRatingLabel,
    getRatingColor
  }
}

export default useSatisfactionSurvey
