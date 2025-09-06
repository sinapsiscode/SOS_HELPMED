import { useState, useCallback, useMemo } from 'react'
import { affiliateFormSchema } from '../schemas/affiliateSchema'
import { ERROR_MESSAGES, FORM_CONFIG, RELATIONSHIP_OPTIONS } from '../constants/affiliateConstants'
import { LABELS } from '../config/labels'

/**
 * Hook que maneja TODA la lógica del modal de agregar afiliado
 * El componente NO tomará ninguna decisión, solo mostrará lo que este hook provee
 * Siguiendo Regla #2 - Separación COMPLETA de UI y Lógica
 *
 * @param {Function} onSave - Función para guardar el afiliado
 * @param {Function} onClose - Función para cerrar el modal
 * @param {boolean} externalLoading - Estado de carga externo
 * @returns {Object} Todo lo necesario para el componente UI
 */
export const useAddAffiliateModal = (onSave, onClose, externalLoading = false) => {
  // ============================================
  // ESTADO INTERNO
  // ============================================
  const [formData, setFormData] = useState({
    name: '',
    dni: '',
    phone: '',
    relationship: FORM_CONFIG.DEFAULT_RELATIONSHIP,
    birthDate: ''
  })

  const [errors, setErrors] = useState({})
  const [isSubmitting, setIsSubmitting] = useState(false)

  // ============================================
  // VALORES CALCULADOS Y FORMATEADOS
  // ============================================

  /**
   * Fecha máxima para el campo de fecha de nacimiento
   * Ya formateada y lista para usar
   */
  const maxBirthDate = useMemo(() => {
    return new Date().toISOString().split('T')[0]
  }, [])

  /**
   * Estado deshabilitado del formulario
   */
  const isDisabled = useMemo(() => {
    return isSubmitting || externalLoading
  }, [isSubmitting, externalLoading])

  /**
   * Mensaje de error general formateado
   */
  const generalError = useMemo(() => {
    return errors.general || null
  }, [errors.general])

  /**
   * Estado del botón submit
   */
  const submitButtonState = useMemo(
    () => ({
      isLoading: isSubmitting,
      text: isSubmitting ? 'Agregando...' : 'Agregar',
      disabled: isDisabled
    }),
    [isSubmitting, isDisabled]
  )

  /**
   * Estado del botón cancelar
   */
  const cancelButtonState = useMemo(
    () => ({
      text: 'Cancelar',
      disabled: isDisabled
    }),
    [isDisabled]
  )

  // ============================================
  // VALIDACIÓN
  // ============================================

  /**
   * Valida el formulario completo usando schema de Yup
   * Regla #4 - Validación con esquemas
   *
   * @returns {Promise<boolean>} True si es válido
   */
  const validateForm = useCallback(async () => {
    try {
      await affiliateFormSchema.validate(formData, { abortEarly: false })
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
  }, [formData])

  // ============================================
  // MANEJADORES DE EVENTOS
  // ============================================

  /**
   * Maneja cambios en cualquier campo del formulario
   * Limpia el error del campo cuando el usuario escribe
   */
  const handleFieldChange = useCallback(
    (fieldName, value) => {
      setFormData((prev) => ({
        ...prev,
        [fieldName]: value
      }))

      // Limpiar error del campo si existe
      if (errors[fieldName]) {
        setErrors((prev) => {
          const newErrors = { ...prev }
          delete newErrors[fieldName]
          return newErrors
        })
      }
    },
    [errors]
  )

  /**
   * Manejador para el campo de nombre
   */
  const handleNameChange = useCallback(
    (e) => {
      handleFieldChange('name', e.target.value)
    },
    [handleFieldChange]
  )

  /**
   * Manejador para el campo de DNI
   */
  const handleDniChange = useCallback(
    (e) => {
      handleFieldChange('dni', e.target.value)
    },
    [handleFieldChange]
  )

  /**
   * Manejador para el campo de teléfono
   */
  const handlePhoneChange = useCallback(
    (e) => {
      handleFieldChange('phone', e.target.value)
    },
    [handleFieldChange]
  )

  /**
   * Manejador para el campo de relación
   */
  const handleRelationshipChange = useCallback(
    (e) => {
      handleFieldChange('relationship', e.target.value)
    },
    [handleFieldChange]
  )

  /**
   * Manejador para el campo de fecha de nacimiento
   */
  const handleBirthDateChange = useCallback(
    (e) => {
      handleFieldChange('birthDate', e.target.value)
    },
    [handleFieldChange]
  )

  /**
   * Maneja el envío del formulario
   * Toda la lógica de negocio está aquí, el componente solo ejecuta
   * Regla #8 - Manejo consistente de errores
   */
  const handleSubmit = useCallback(
    async (e) => {
      // Prevenir comportamiento por defecto
      if (e && e.preventDefault) {
        e.preventDefault()
      }

      // Verificar si ya está procesando
      if (isSubmitting || externalLoading) {
        return
      }

      setIsSubmitting(true)

      try {
        // Validar formulario
        const isValid = await validateForm()
        if (!isValid) {
          setIsSubmitting(false)
          return
        }

        // Intentar guardar
        const result = await onSave(formData)

        // Manejar resultado
        if (result && result.success) {
          // Éxito: cerrar modal
          onClose()
        } else {
          // Error: mostrar mensaje
          setErrors({
            general: result?.error || ERROR_MESSAGES.GENERIC
          })
          setIsSubmitting(false)
        }
      } catch (error) {
        // Error inesperado
        setErrors({
          general: error.message || ERROR_MESSAGES.GENERIC
        })
        setIsSubmitting(false)
      }
    },
    [isSubmitting, externalLoading, validateForm, formData, onSave, onClose]
  )

  /**
   * Maneja el cierre del modal
   * Verifica si se puede cerrar
   */
  const handleClose = useCallback(() => {
    // No cerrar si está procesando
    if (isDisabled) {
      return
    }
    onClose()
  }, [isDisabled, onClose])

  // ============================================
  // CONFIGURACIÓN DE CAMPOS
  // ============================================

  /**
   * Configuración completa para cada campo del formulario
   * El componente no necesita saber nada más que esto
   */
  const fields = useMemo(
    () => ({
      name: {
        label: LABELS.admin.affiliates.add.fields.name.label,
        type: 'text',
        name: 'name',
        value: formData.name,
        onChange: handleNameChange,
        error: errors.name,
        disabled: isDisabled,
        placeholder: LABELS.admin.affiliates.add.fields.name.placeholder,
        required: true
      },
      dni: {
        label: LABELS.admin.affiliates.add.fields.dni.label,
        type: 'text',
        name: 'dni',
        value: formData.dni,
        onChange: handleDniChange,
        error: errors.dni,
        disabled: isDisabled,
        placeholder: LABELS.admin.affiliates.add.fields.dni.placeholder,
        required: true
      },
      phone: {
        label: LABELS.admin.affiliates.add.fields.phone.label,
        type: 'tel',
        name: 'phone',
        value: formData.phone,
        onChange: handlePhoneChange,
        error: errors.phone,
        disabled: isDisabled,
        placeholder: LABELS.admin.affiliates.add.fields.phone.placeholder,
        required: false
      },
      relationship: {
        label: LABELS.admin.affiliates.add.fields.relationship.label,
        name: 'relationship',
        value: formData.relationship,
        onChange: handleRelationshipChange,
        error: errors.relationship,
        disabled: isDisabled,
        options: RELATIONSHIP_OPTIONS,
        required: true
      },
      birthDate: {
        label: LABELS.admin.affiliates.add.fields.birthDate.label,
        type: 'date',
        name: 'birthDate',
        value: formData.birthDate,
        onChange: handleBirthDateChange,
        error: errors.birthDate,
        disabled: isDisabled,
        max: maxBirthDate,
        required: false
      }
    }),
    [
      formData,
      errors,
      isDisabled,
      maxBirthDate,
      handleNameChange,
      handleDniChange,
      handlePhoneChange,
      handleRelationshipChange,
      handleBirthDateChange
    ]
  )

  // ============================================
  // RETORNO - Todo listo para el componente
  // ============================================

  return {
    // Datos del formulario
    fields,

    // Estado
    generalError,
    isDisabled,

    // Botones
    submitButton: submitButtonState,
    cancelButton: cancelButtonState,

    // Acciones
    onSubmit: handleSubmit,
    onClose: handleClose,

    // Configuración del modal
    modalConfig: {
      title: LABELS.admin.affiliates.add.title,
      closeButtonAriaLabel: 'Cerrar modal'
    }
  }
}
