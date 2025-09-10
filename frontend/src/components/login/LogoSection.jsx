import React from 'react'

/**
 * Sección del logo y título de Help MED
 * Siguiendo Regla #3: Componente específico <200 líneas
 * Siguiendo Regla #2: Solo presentación
 *
 * @returns {JSX.Element} Sección del logo
 */
const LogoSection = () => {
  return (
    <div className="text-center mb-4">
      <LogoIcon />
      <LogoTitle />
      <LogoSubtitle />
    </div>
  )
}

/**
 * Icono del logo
 */
const LogoIcon = () => {
  return (
    <div className="w-48 h-40 mx-auto mb-2 flex items-center justify-center">
      <img 
        src="/Logo-Helpmed-negativo.png" 
        alt="Help MED Logo" 
        className="w-full h-full object-contain"
      />
    </div>
  )
}

/**
 * Título principal
 */
const LogoTitle = () => {
  return null
}

/**
 * Subtítulo descriptivo
 */
const LogoSubtitle = () => {
  return <p className="text-gray-600 font-roboto">Emergencias Médicas 24/7</p>
}

export default LogoSection
