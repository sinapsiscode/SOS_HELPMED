import React from 'react'
import { useFormField, useSelectField } from '../../../hooks/useFormField'
import {
  useErrorAlert,
  useModalHeader,
  useFormButtons,
  useLoadingSpinner
} from '../../../hooks/useFormComponents'

/**
 * Campo de formulario - COMPONENTE UI PURO (Regla #2)
 * Toda la lógica en useFormField, optimizado con React.memo (Regla #13)
 */
export const FormField = React.memo((props) => {
  const { label, input, error } = useFormField(props)
  return (
    <div>
      <label className={label.className}>{label.text}</label>
      <input {...input} />
      {error.show && <p className={error.className}>{error.message}</p>}
    </div>
  )
})

/**
 * Campo select - COMPONENTE UI PURO (Regla #2)
 * Toda la lógica en useSelectField, optimizado con React.memo (Regla #13)
 */
export const SelectField = React.memo((props) => {
  const { label, select, options, error } = useSelectField(props)
  return (
    <div>
      <label className={label.className}>{label.text}</label>
      <select {...select}>
        {options.map((option) => (
          <option key={option.key} value={option.value}>
            {option.label}
          </option>
        ))}
      </select>
      {error.show && <p className={error.className}>{error.message}</p>}
    </div>
  )
})

/**
 * Alerta de error - COMPONENTE UI PURO (Regla #2)
 * Toda la lógica en useErrorAlert, optimizado con React.memo (Regla #13)
 */
export const ErrorAlert = React.memo(({ message }) => {
  const { shouldRender, className, message: errorMessage } = useErrorAlert(message)
  if (!shouldRender) return null
  return <div className={className}>{errorMessage}</div>
})

/**
 * Spinner de carga - COMPONENTE UI PURO (Regla #2)
 * Toda la lógica en useLoadingSpinner, optimizado con React.memo (Regla #13)
 */
export const LoadingSpinner = React.memo(() => {
  const config = useLoadingSpinner()
  return (
    <svg
      className={config.className}
      xmlns={config.svg.xmlns}
      fill={config.svg.fill}
      viewBox={config.svg.viewBox}
    >
      <circle
        className={config.circle.className}
        cx={config.circle.cx}
        cy={config.circle.cy}
        r={config.circle.r}
        stroke={config.circle.stroke}
        strokeWidth={config.circle.strokeWidth}
      />
      <path className={config.path.className} fill={config.path.fill} d={config.path.d} />
    </svg>
  )
})

/**
 * Header de modal - COMPONENTE UI PURO (Regla #2)
 * Toda la lógica en useModalHeader, optimizado con React.memo (Regla #13)
 */
export const ModalHeader = React.memo(({ title, onClose, disabled }) => {
  const { classes, title: titleConfig, closeButton } = useModalHeader(title, onClose, disabled)
  return (
    <div className={classes.wrapper}>
      <div className={classes.content}>
        <h3 className={titleConfig.className}>{titleConfig.text}</h3>
        <button
          onClick={closeButton.onClick}
          disabled={closeButton.disabled}
          className={closeButton.className}
          aria-label={closeButton.ariaLabel}
        >
          {closeButton.icon}
        </button>
      </div>
    </div>
  )
})

/**
 * Botones de formulario - COMPONENTE UI PURO (Regla #2)
 * Toda la lógica en useFormButtons, optimizado con React.memo (Regla #13)
 */
export const FormButtons = React.memo((props) => {
  const { containerClassName, cancelButton, submitButton, spinner } = useFormButtons(props)
  return (
    <div className={containerClassName}>
      <button
        type={cancelButton.type}
        onClick={cancelButton.onClick}
        disabled={cancelButton.disabled}
        className={cancelButton.className}
      >
        {cancelButton.text}
      </button>
      <button
        type={submitButton.type}
        disabled={submitButton.disabled}
        className={submitButton.className}
      >
        {submitButton.showSpinner ? (
          <>
            <LoadingSpinner />
            {submitButton.text}
          </>
        ) : (
          submitButton.text
        )}
      </button>
    </div>
  )
})

// Nombres para debugging
FormField.displayName = 'FormField'
SelectField.displayName = 'SelectField'
ErrorAlert.displayName = 'ErrorAlert'
LoadingSpinner.displayName = 'LoadingSpinner'
ModalHeader.displayName = 'ModalHeader'
FormButtons.displayName = 'FormButtons'

// Exportación por defecto
export default {
  FormField,
  SelectField,
  ErrorAlert,
  LoadingSpinner,
  ModalHeader,
  FormButtons
}
