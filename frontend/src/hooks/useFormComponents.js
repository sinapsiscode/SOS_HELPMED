import { useMemo } from 'react'

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
    return 'bg-red-50 border border-red-200 rounded-lg p-3 text-sm text-red-600'
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
      wrapper: 'px-6 py-4 border-b border-gray-200',
      content: 'flex items-center justify-between'
    }),
    []
  )

  /**
   * Configuración del título
   */
  const titleConfig = useMemo(
    () => ({
      text: title || '',
      className: 'text-lg font-bold text-gray-800'
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
      className: 'text-gray-400 hover:text-gray-600 transition-colors disabled:cursor-not-allowed',
      ariaLabel: 'Cerrar modal',
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
  submitText = 'Agregar',
  submittingText = 'Agregando...'
}) => {
  /**
   * Clases para el contenedor
   */
  const containerClassName = useMemo(() => {
    return 'flex space-x-3 pt-4'
  }, [])

  /**
   * Configuración del botón de cancelar
   */
  const cancelButton = useMemo(
    () => ({
      type: 'button',
      onClick: onCancel,
      disabled: isDisabled || false,
      className:
        'flex-1 px-4 py-2 border border-gray-300 rounded-lg text-gray-700 font-medium hover:bg-gray-50 transition-colors disabled:cursor-not-allowed disabled:opacity-50',
      text: 'Cancelar'
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
      className:
        'flex-1 px-4 py-2 bg-blue-600 hover:bg-blue-700 text-white rounded-lg font-medium transition-colors disabled:cursor-not-allowed disabled:opacity-50 flex items-center justify-center',
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
      className: 'animate-spin -ml-1 mr-2 h-4 w-4 text-white',
      svg: {
        xmlns: 'http://www.w3.org/2000/svg',
        fill: 'none',
        viewBox: '0 0 24 24'
      },
      circle: {
        className: 'opacity-25',
        cx: '12',
        cy: '12',
        r: '10',
        stroke: 'currentColor',
        strokeWidth: '4'
      },
      path: {
        className: 'opacity-75',
        fill: 'currentColor',
        d: 'M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z'
      }
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
      className: 'animate-spin -ml-1 mr-2 h-4 w-4 text-white',
      svg: {
        xmlns: 'http://www.w3.org/2000/svg',
        fill: 'none',
        viewBox: '0 0 24 24'
      },
      circle: {
        className: 'opacity-25',
        cx: '12',
        cy: '12',
        r: '10',
        stroke: 'currentColor',
        strokeWidth: '4'
      },
      path: {
        className: 'opacity-75',
        fill: 'currentColor',
        d: 'M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z'
      }
    }),
    []
  )

  return spinnerConfig
}
