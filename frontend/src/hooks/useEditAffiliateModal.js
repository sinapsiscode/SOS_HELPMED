import { useCallback, useMemo } from 'react'
import { useAffiliateForm } from './useAffiliateForm'
import { LABELS } from '../config/labels'
import { RELATIONSHIP_OPTIONS } from '../constants/affiliateConstants'

/**
 * Hook que maneja TODA la lógica del modal de editar afiliado
 * El componente NO tomará ninguna decisión, solo mostrará lo que este hook provee
 * Siguiendo Regla #2 - Separación COMPLETA de UI y Lógica
 *
 * @param {Object} affiliate - Afiliado a editar
 * @param {Function} onSave - Función para guardar el afiliado
 * @param {Function} onClose - Función para cerrar el modal
 * @param {boolean} externalLoading - Estado de carga externo
 * @returns {Object} Todo lo necesario para el componente UI
 */
export const useEditAffiliateModal = (affiliate, onSave, onClose, externalLoading = false) => {
  // Usar el hook base de formulario
  const {
    formData,
    errors,
    isSubmitting,
    handleInputChange,
    handleSubmit: baseHandleSubmit
  } = useAffiliateForm(affiliate, true)

  // ============================================
  // VALORES CALCULADOS Y FORMATEADOS
  // ============================================

  /**
   * Fecha máxima para el campo de fecha de nacimiento
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

  // ============================================
  // MANEJADORES DE EVENTOS
  // ============================================

  /**
   * Maneja el envío del formulario
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

      try {
        // Usar el handleSubmit base
        const result = await baseHandleSubmit(onSave)

        // Manejar resultado
        if (result && result.success) {
          // Éxito: cerrar modal
          onClose()
        }
      } catch (error) {
        console.error('Error en handleSubmit:', error)
      }
    },
    [isSubmitting, externalLoading, baseHandleSubmit, onSave, onClose]
  )

  /**
   * Maneja el cierre del modal
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
   */
  const fields = useMemo(
    () => ({
      name: {
        label: LABELS.admin.affiliates.add.fields.name.label,
        type: 'text',
        name: 'name',
        value: formData.name,
        onChange: handleInputChange,
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
        onChange: handleInputChange,
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
        onChange: handleInputChange,
        error: errors.phone,
        disabled: isDisabled,
        placeholder: LABELS.admin.affiliates.add.fields.phone.placeholder,
        required: false
      },
      relationship: {
        label: LABELS.admin.affiliates.add.fields.relationship.label,
        name: 'relationship',
        value: formData.relationship,
        onChange: handleInputChange,
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
        onChange: handleInputChange,
        error: errors.birthDate,
        disabled: isDisabled,
        max: maxBirthDate,
        required: false
      }
    }),
    [formData, errors, isDisabled, maxBirthDate, handleInputChange]
  )

  // ============================================
  // CONFIGURACIÓN DEL MODAL
  // ============================================

  const modalConfig = useMemo(
    () => ({
      title: LABELS.admin.affiliates.edit.title,
      subtitle: affiliate ? `${LABELS.admin.affiliates.edit.editingLabel}: ${affiliate.name}` : '',
      closeButtonAriaLabel: LABELS.buttons.close,
      submitButton: {
        text: isSubmitting ? LABELS.admin.affiliates.edit.submittingButton : LABELS.admin.affiliates.edit.submitButton,
        disabled: isDisabled
      },
      cancelButton: {
        text: LABELS.buttons.cancel,
        disabled: isDisabled
      }
    }),
    [affiliate, isSubmitting, isDisabled]
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
    isSubmitting,

    // Acciones
    onSubmit: handleSubmit,
    onClose: handleClose,

    // Configuración del modal
    modalConfig
  }
}