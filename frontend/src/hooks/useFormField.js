import { useMemo } from 'react'
import { LABELS } from '../config/labels'
import { FORM_STYLES } from '../config/styles'

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
    const borderClass = error ? FORM_STYLES.input.error : FORM_STYLES.input.normal
    const disabledClass = disabled ? FORM_STYLES.input.disabled : ''

    return `${FORM_STYLES.input.base} ${borderClass} ${disabledClass} ${className}`.trim()
  }, [error, disabled, className])

  /**
   * Clases para el label
   */
  const labelClassName = useMemo(() => {
    return FORM_STYLES.label.base
  }, [])

  /**
   * Clases para el mensaje de error
   */
  const errorClassName = useMemo(() => {
    return FORM_STYLES.error.text
  }, [])

  // ============================================
  // TEXTOS Y CONTENIDO
  // ============================================

  /**
   * Texto del label con asterisco si es requerido
   */
  const labelText = useMemo(() => {
    return required ? `${label} ${LABELS.forms.fields.requiredIndicator}` : label
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
    const borderClass = error ? FORM_STYLES.input.error : FORM_STYLES.input.normal
    const disabledClass = disabled ? FORM_STYLES.input.disabled : ''

    return `${FORM_STYLES.input.base} ${borderClass} ${disabledClass}`.trim()
  }, [error, disabled])

  /**
   * Clases para el label
   */
  const labelClassName = useMemo(() => {
    return FORM_STYLES.label.base
  }, [])

  /**
   * Clases para el mensaje de error
   */
  const errorClassName = useMemo(() => {
    return FORM_STYLES.error.text
  }, [])

  // ============================================
  // TEXTOS Y CONTENIDO
  // ============================================

  /**
   * Texto del label con asterisco si es requerido
   */
  const labelText = useMemo(() => {
    return required ? `${label} ${LABELS.forms.fields.requiredIndicator}` : label
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
