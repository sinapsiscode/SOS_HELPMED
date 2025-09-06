import { useState, useCallback } from 'react'
import { affiliateFormSchema, affiliateUpdateSchema } from '../schemas/affiliateSchema'
import { ERROR_MESSAGES, FORM_CONFIG } from '../constants/affiliateConstants'
import { LABELS } from '../config/labels'

/**
 * Hook personalizado para manejar la lógica de formularios de afiliados
 * Separa la lógica de negocio de los componentes UI siguiendo la Regla #2
 *
 * @param {Object} initialData - Datos iniciales del formulario
 * @param {boolean} isEditMode - Si el formulario es para editar
 * @returns {Object} Estado y funciones del formulario
 */
export const useAffiliateForm = (initialData = null, isEditMode = false) => {
  // Estado inicial del formulario
  const getInitialFormData = () => {
    if (initialData && isEditMode) {
      return {
        name: initialData.name || '',
        dni: initialData.dni || '',
        phone: initialData.phone || '',
        relationship: initialData.relationship || '',
        birthDate: initialData.birthDate || ''
      }
    }

    return {
      name: '',
      dni: '',
      phone: '',
      relationship: FORM_CONFIG.DEFAULT_RELATIONSHIP,
      birthDate: ''
    }
  }

  const [formData, setFormData] = useState(getInitialFormData())
  const [errors, setErrors] = useState({})
  const [isSubmitting, setIsSubmitting] = useState(false)

  /**
   * Maneja cambios en los campos del formulario
   * Limpia errores del campo cuando el usuario escribe
   *
   * @param {Event} e - Evento del input
   */
  const handleInputChange = useCallback(
    (e) => {
      const { name, value } = e.target

      setFormData((prev) => ({
        ...prev,
        [name]: value
      }))

      // Limpiar error del campo cuando el usuario empiece a escribir
      if (errors[name]) {
        setErrors((prev) => ({
          ...prev,
          [name]: ''
        }))
      }
    },
    [errors]
  )

  /**
   * Valida el formulario usando el schema de Yup correspondiente
   *
   * @returns {Promise<boolean>} True si es válido, false si hay errores
   */
  const validateForm = useCallback(async () => {
    try {
      const schema = isEditMode ? affiliateUpdateSchema : affiliateFormSchema
      await schema.validate(formData, { abortEarly: false })
      setErrors({})
      return true
    } catch (err) {
      const validationErrors = {}

      if (err.inner) {
        err.inner.forEach((error) => {
          validationErrors[error.path] = error.message
        })
      } else {
        validationErrors.general = err.message
      }

      setErrors(validationErrors)
      return false
    }
  }, [formData, isEditMode])

  /**
   * Obtiene solo los campos que han cambiado (para modo edición)
   *
   * @returns {Object} Objeto con solo los campos modificados
   */
  const getChangedFields = useCallback(() => {
    if (!isEditMode || !initialData) return formData

    const changedFields = {}
    Object.keys(formData).forEach((key) => {
      if (formData[key] !== (initialData[key] || '')) {
        changedFields[key] = formData[key]
      }
    })

    return changedFields
  }, [formData, initialData, isEditMode])

  /**
   * Maneja el envío del formulario con validación y manejo de errores
   * Sigue el formato consistente de respuesta según Regla #8
   *
   * @param {Function} onSave - Función callback para guardar los datos
   * @returns {Promise<Object>} Resultado con formato {success, data?, error?}
   */
  const handleSubmit = useCallback(
    async (onSave) => {
      if (isSubmitting) {
        return {
          success: false,
          error: LABELS.admin.affiliates.edit.processingRequest
        }
      }

      setIsSubmitting(true)

      try {
        // Validar formulario
        const isValid = await validateForm()
        if (!isValid) {
          return {
            success: false,
            error: LABELS.admin.affiliates.edit.correctErrors
          }
        }

        // En modo edición, verificar si hay cambios
        if (isEditMode) {
          const changedFields = getChangedFields()
          if (Object.keys(changedFields).length === 0) {
            setErrors({ general: LABELS.admin.affiliates.edit.noChanges })
            return {
              success: false,
              error: LABELS.admin.affiliates.edit.noChanges
            }
          }

          // Enviar solo campos modificados
          const result = await onSave(initialData?.id, changedFields)
          return result
        } else {
          // Modo creación: enviar todos los datos
          const result = await onSave(formData)
          return result
        }
      } catch (error) {
        const errorMessage = error.message || ERROR_MESSAGES.GENERIC
        setErrors({ general: errorMessage })

        return {
          success: false,
          error: errorMessage
        }
      } finally {
        setIsSubmitting(false)
      }
    },
    [isSubmitting, validateForm, isEditMode, getChangedFields, formData, initialData]
  )

  /**
   * Resetea el formulario a su estado inicial
   */
  const resetForm = useCallback(() => {
    setFormData(getInitialFormData())
    setErrors({})
    setIsSubmitting(false)
  }, [])

  /**
   * Establece un error general en el formulario
   *
   * @param {string} errorMessage - Mensaje de error a mostrar
   */
  const setGeneralError = useCallback((errorMessage) => {
    setErrors({ general: errorMessage })
  }, [])

  return {
    // Estado
    formData,
    errors,
    isSubmitting,

    // Funciones
    handleInputChange,
    handleSubmit,
    validateForm,
    resetForm,
    setGeneralError,
    getChangedFields,

    // Helpers
    isFormDisabled: isSubmitting,
    hasErrors: Object.keys(errors).length > 0
  }
}
