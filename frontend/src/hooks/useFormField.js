import { useMemo } from 'react'

/**
 * Hook que maneja TODA la lógica de un campo de formulario
 * Siguiendo Regla #2 - Separación COMPLETA de UI y Lógica
 *
 * @param {Object} props - Props del campo
 * @returns {Object} Todo lo necesario para renderizar el campo
 */
export const useFormField = ({
  label,
  name,
  type = 'text',
  value,
  onChange,
  error,
  disabled,
  placeholder,
  required = false,
  maxDate = null,
  className = ''
}) => {
  // ============================================
  // CLASES CSS CALCULADAS
  // ============================================

  /**
   * Clases para el input basadas en el estado
   * Toda la lógica de decisión está aquí
   */
  const inputClassName = useMemo(() => {
    const baseClasses =
      'w-full px-3 py-2 border rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-colors'
    const borderClass = error ? 'border-red-300' : 'border-gray-300'
    const disabledClass = disabled ? 'bg-gray-100 cursor-not-allowed' : ''

    return `${baseClasses} ${borderClass} ${disabledClass} ${className}`.trim()
  }, [error, disabled, className])

  /**
   * Clases para el label
   */
  const labelClassName = useMemo(() => {
    return 'block text-sm font-medium text-gray-700 mb-2'
  }, [])

  /**
   * Clases para el mensaje de error
   */
  const errorClassName = useMemo(() => {
    return 'mt-1 text-sm text-red-600'
  }, [])

  // ============================================
  // TEXTOS Y CONTENIDO
  // ============================================

  /**
   * Texto del label con asterisco si es requerido
   */
  const labelText = useMemo(() => {
    return required ? `${label} *` : label
  }, [label, required])

  /**
   * Determinar si mostrar el error
   */
  const showError = useMemo(() => {
    return Boolean(error)
  }, [error])

  // ============================================
  // CONFIGURACIÓN DEL INPUT
  // ============================================

  /**
   * Props completas para el input
   * El componente no necesita procesar nada
   */
  const inputProps = useMemo(
    () => ({
      type,
      name,
      value: value || '',
      onChange,
      disabled,
      placeholder,
      required,
      className: inputClassName,
      ...(type === 'date' && maxDate ? { max: maxDate } : {})
    }),
    [type, name, value, onChange, disabled, placeholder, required, inputClassName, maxDate]
  )

  // ============================================
  // ESTRUCTURA DE DATOS
  // ============================================

  /**
   * Toda la configuración lista para el componente
   */
  return {
    // Configuración del label
    label: {
      text: labelText,
      className: labelClassName
    },

    // Configuración del input
    input: inputProps,

    // Configuración del error
    error: {
      show: showError,
      message: error,
      className: errorClassName
    },

    // Clases del contenedor
    containerClassName: 'div'
  }
}

/**
 * Hook que maneja TODA la lógica de un campo select
 * Siguiendo Regla #2 - Separación COMPLETA de UI y Lógica
 *
 * @param {Object} props - Props del select
 * @returns {Object} Todo lo necesario para renderizar el select
 */
export const useSelectField = ({
  label,
  name,
  value,
  onChange,
  error,
  disabled,
  required = false,
  options = []
}) => {
  // ============================================
  // CLASES CSS CALCULADAS
  // ============================================

  /**
   * Clases para el select basadas en el estado
   */
  const selectClassName = useMemo(() => {
    const baseClasses =
      'w-full px-3 py-2 border rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-colors'
    const borderClass = error ? 'border-red-300' : 'border-gray-300'
    const disabledClass = disabled ? 'bg-gray-100 cursor-not-allowed' : ''

    return `${baseClasses} ${borderClass} ${disabledClass}`.trim()
  }, [error, disabled])

  /**
   * Clases para el label
   */
  const labelClassName = useMemo(() => {
    return 'block text-sm font-medium text-gray-700 mb-2'
  }, [])

  /**
   * Clases para el mensaje de error
   */
  const errorClassName = useMemo(() => {
    return 'mt-1 text-sm text-red-600'
  }, [])

  // ============================================
  // TEXTOS Y CONTENIDO
  // ============================================

  /**
   * Texto del label con asterisco si es requerido
   */
  const labelText = useMemo(() => {
    return required ? `${label} *` : label
  }, [label, required])

  /**
   * Determinar si mostrar el error
   */
  const showError = useMemo(() => {
    return Boolean(error)
  }, [error])

  // ============================================
  // OPCIONES PROCESADAS
  // ============================================

  /**
   * Opciones con key única garantizada
   */
  const processedOptions = useMemo(() => {
    return options.map((option, index) => ({
      ...option,
      key: option.key || option.value || index
    }))
  }, [options])

  // ============================================
  // CONFIGURACIÓN DEL SELECT
  // ============================================

  /**
   * Props completas para el select
   */
  const selectProps = useMemo(
    () => ({
      name,
      value: value || '',
      onChange,
      disabled,
      required,
      className: selectClassName
    }),
    [name, value, onChange, disabled, required, selectClassName]
  )

  // ============================================
  // ESTRUCTURA DE DATOS
  // ============================================

  return {
    // Configuración del label
    label: {
      text: labelText,
      className: labelClassName
    },

    // Configuración del select
    select: selectProps,

    // Opciones procesadas
    options: processedOptions,

    // Configuración del error
    error: {
      show: showError,
      message: error,
      className: errorClassName
    },

    // Clases del contenedor
    containerClassName: 'div'
  }
}
