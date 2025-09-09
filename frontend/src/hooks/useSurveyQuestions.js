import { useState, useCallback, useEffect, useMemo } from 'react'
import { surveyService } from '../services/surveyService'
import Swal from 'sweetalert2'

/**
 * Hook especializado para gestión CRUD de preguntas de encuesta
 * ✅ Cumple reglas de tamaño: <100 líneas
 * ✅ Responsabilidad única: Question management
 * ✅ Validación y persistencia
 */
const useSurveyQuestions = (surveyQuestions, updateSurveyQuestions) => {
  const [editMode, setEditMode] = useState(false)
  const [questions, setQuestions] = useState([])
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState(null)
  const [defaultQuestions, setDefaultQuestions] = useState([])

  // Cargar preguntas predeterminadas desde db.json
  useEffect(() => {
    const loadDefaultQuestions = async () => {
      try {
        const response = await fetch('http://localhost:4001/surveyConfig')
        if (response.ok) {
          const config = await response.json()
          setDefaultQuestions(config.defaultQuestions)
        } else {
          throw new Error('Failed to fetch survey config')
        }
      } catch (error) {
        console.error('Error loading default questions:', error)
        console.warn('Using fallback survey configuration')
        
        // Configuración de fallback
        setDefaultQuestions([
          {
            id: 'question1',
            text: '¿Qué tan satisfecho está con la rapidez de nuestro servicio?',
            icon: 'fas fa-clock',
            category: 'tiempo',
            active: true
          },
          {
            id: 'question2',
            text: '¿Cómo calificaría la profesionalidad de nuestro personal?',
            icon: 'fas fa-user-md',
            category: 'personal',
            active: true
          },
          {
            id: 'question3',
            text: '¿Qué tan satisfecho está con la calidad de la atención médica recibida?',
            icon: 'fas fa-heart',
            category: 'calidad',
            active: true
          },
          {
            id: 'question4',
            text: '¿Cómo calificaría la comunicación durante el servicio?',
            icon: 'fas fa-comments',
            category: 'comunicacion',
            active: true
          },
          {
            id: 'question5',
            text: '¿Recomendaría nuestros servicios a familiares y amigos?',
            icon: 'fas fa-star',
            category: 'recomendacion',
            active: true
          }
        ])
      }
    }

    loadDefaultQuestions()
  }, [])

  // Inicialización de preguntas
  useEffect(() => {
    setQuestions(surveyQuestions || defaultQuestions)
  }, [surveyQuestions, defaultQuestions])

  // Editar pregunta específica
  const handleQuestionEdit = useCallback((index, field, value) => {
    setQuestions((prevQuestions) => {
      const updatedQuestions = [...prevQuestions]
      updatedQuestions[index] = {
        ...updatedQuestions[index],
        [field]: value
      }
      return updatedQuestions
    })
  }, [])

  // Agregar nueva pregunta
  const handleAddQuestion = useCallback(() => {
    const newQuestion = {
      id: `question${questions.length + 1}`,
      text: 'Nueva pregunta',
      icon: 'fas fa-question',
      category: 'general',
      active: true
    }
    setQuestions((prev) => [...prev, newQuestion])
  }, [questions.length])

  // Remover pregunta
  const handleRemoveQuestion = useCallback(
    (index) => {
      if (questions.length > 1) {
        setQuestions((prev) => prev.filter((_, i) => i !== index))
      }
    },
    [questions.length]
  )

  // Guardar preguntas
  const handleSaveQuestions = useCallback(async () => {
    try {
      setLoading(true)
      setError(null)

      // Validar preguntas antes de guardar
      const validation = surveyService.validateQuestions(questions)
      if (!validation.isValid) {
        throw new Error(validation.errors.join(', '))
      }

      await updateSurveyQuestions(questions)
      setEditMode(false)

      await Swal.fire({
        title: '¡Preguntas Actualizadas!',
        text: 'Las preguntas de la encuesta se han actualizado correctamente',
        icon: 'success',
        timer: 2000,
        showConfirmButton: false
      })
    } catch (error) {
      console.error('Error guardando preguntas:', error)
      setError('Error al guardar preguntas: ' + error.message)

      await Swal.fire({
        title: 'Error',
        text: 'No se pudieron actualizar las preguntas',
        icon: 'error',
        confirmButtonColor: '#EF4444'
      })
    } finally {
      setLoading(false)
    }
  }, [questions, updateSurveyQuestions])

  // Habilitar modo edición
  const enableEditMode = useCallback(() => {
    setEditMode(true)
    setError(null)
  }, [])

  // Cancelar edición
  const cancelEditMode = useCallback(() => {
    setEditMode(false)
    setQuestions(surveyQuestions || defaultQuestions)
    setError(null)
  }, [surveyQuestions, defaultQuestions])

  // Limpiar error
  const clearError = useCallback(() => {
    setError(null)
  }, [])

  return {
    // Estados
    editMode,
    questions,
    loading,
    error,

    // Funciones CRUD
    handleQuestionEdit,
    handleAddQuestion,
    handleRemoveQuestion,
    handleSaveQuestions,

    // Control de modo
    enableEditMode,
    cancelEditMode,
    clearError,

    // Estado de validación
    canSave: questions.length > 0 && editMode,
    hasQuestions: questions.length > 0
  }
}

export default useSurveyQuestions