import { useMemo } from 'react'
import { LABELS } from '../config/labels'
import { FORM_STYLES, MODAL_STYLES } from '../config/styles'

/**
 * Hook que maneja la lógica del componente ErrorAlert
 * Siguiendo Regla #2 - Separación COMPLETA de UI y Lógica
 *
 * @param {string} message - Mensaje de error a mostrar
 * @returns {Object} Configuración para renderizar
 */
export const useErrorAlert = (message) => {
  /**
   * Determinar si el componente debe renderizarse
   */
  const shouldRender = useMemo(() => {
    return Boolean(message)
  }, [message])

  /**
   * Clases CSS para el contenedor
   */
  const containerClassName = useMemo(() => {
    return FORM_STYLES.error.alert
  }, [])

  return {
    shouldRender,
    message: message || '',
    className: containerClassName
  }
}

/**
 * Hook que maneja la lógica del ModalHeader
 * Siguiendo Regla #2 - Separación COMPLETA de UI y Lógica
 *
 * @param {string} title - Título del modal
 * @param {Function} onClose - Función para cerrar
 * @param {boolean} disabled - Estado deshabilitado
 * @returns {Object} Configuración para renderizar
 */
export const useModalHeader = (title, onClose, disabled) => {
  /**
   * Clases para el contenedor
   */
  const containerClasses = useMemo(
    () => ({
      wrapper: MODAL_STYLES.header.wrapper,
      content: MODAL_STYLES.header.content
    }),
    []
  )

  /**
   * Configuración del título
   */
  const titleConfig = useMemo(
    () => ({
      text: title || '',
      className: MODAL_STYLES.header.title
    }),
    [title]
  )

  /**
   * Configuración del botón de cerrar
   */
  const closeButton = useMemo(
    () => ({
      onClick: onClose,
      disabled: disabled || false,
      className: MODAL_STYLES.header.closeButton,
      ariaLabel: LABELS.forms.accessibility.closeModal,
      icon: '✕'
    }),
    [onClose, disabled]
  )

  return {
    classes: containerClasses,
    title: titleConfig,
    closeButton
  }
}

/**
 * Hook que maneja la lógica de FormButtons
 * Siguiendo Regla #2 - Separación COMPLETA de UI y Lógica
 *
 * @param {Object} props - Props del componente
 * @returns {Object} Configuración para renderizar
 */
export const useFormButtons = ({
  onCancel,
  isDisabled,
  isSubmitting,
  submitText = LABELS.forms.buttons.submit,
  submittingText = LABELS.forms.buttons.submitting
}) => {
  /**
   * Clases para el contenedor
   */
  const containerClassName = useMemo(() => {
    return FORM_STYLES.container.formButtons
  }, [])

  /**
   * Configuración del botón de cancelar
   */
  const cancelButton = useMemo(
    () => ({
      type: 'button',
      onClick: onCancel,
      disabled: isDisabled || false,
      className: FORM_STYLES.button.secondary,
      text: LABELS.forms.buttons.cancel
    }),
    [onCancel, isDisabled]
  )

  /**
   * Configuración del botón de submit
   */
  const submitButton = useMemo(
    () => ({
      type: 'submit',
      disabled: isDisabled || false,
      className: `${FORM_STYLES.button.primary} ${FORM_STYLES.button.withSpinner}`,
      showSpinner: isSubmitting || false,
      text: isSubmitting ? submittingText : submitText
    }),
    [isDisabled, isSubmitting, submitText, submittingText]
  )

  /**
   * Configuración del spinner
   */
  const spinnerConfig = useMemo(
    () => ({
      show: isSubmitting || false,
      className: FORM_STYLES.spinner.base,
      svg: FORM_STYLES.spinner.svg,
      circle: FORM_STYLES.spinner.circle,
      path: FORM_STYLES.spinner.path
    }),
    [isSubmitting]
  )

  return {
    containerClassName,
    cancelButton,
    submitButton,
    spinner: spinnerConfig
  }
}

/**
 * Hook para el LoadingSpinner
 * Siguiendo Regla #2 - Separación COMPLETA de UI y Lógica
 *
 * @returns {Object} Configuración del spinner
 */
export const useLoadingSpinner = () => {
  /**
   * Toda la configuración del spinner
   */
  const spinnerConfig = useMemo(
    () => ({
      className: FORM_STYLES.spinner.base,
      svg: FORM_STYLES.spinner.svg,
      circle: FORM_STYLES.spinner.circle,
      path: FORM_STYLES.spinner.path
    }),
    []
  )

  return spinnerConfig
}
