import React from 'react'

/**
 * Prompt para registro de nuevo cliente
 * Siguiendo Regla #3: Componente específico <200 líneas
 * Siguiendo Regla #2: Solo presentación
 *
 * @param {Object} props - Props del componente
 * @param {Function} props.onGoToRegistration - Función para ir al registro
 * @returns {JSX.Element} Prompt de registro
 */
const RegistrationPrompt = ({ onGoToRegistration }) => {
  return (
    <div className="mt-2 text-center">
      <PromptText />
      <RegistrationButton onGoToRegistration={onGoToRegistration} />
    </div>
  )
}

/**
 * Texto del prompt
 */
const PromptText = () => {
  return <p className="text-sm text-gray-600 mb-3 font-roboto">¿No tienes cuenta?</p>
}

/**
 * Botón de registro
 */
const RegistrationButton = ({ onGoToRegistration }) => {
  return (
    <button
      onClick={onGoToRegistration}
      className="text-helpmed-blue hover:text-primary-blue font-exo font-medium transition-colors"
    >
      Solicitar registro como cliente
    </button>
  )
}

export default RegistrationPrompt
