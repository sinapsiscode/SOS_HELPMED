import React from 'react'

/**
 * Componente del header de la encuesta
 * Siguiendo Regla #2: Solo presentación
 * Siguiendo Regla #3: Componente pequeño y enfocado
 */
const SurveyHeader = ({ onClose }) => {
  return (
    <div className="bg-gradient-to-r from-blue-500 to-blue-600 p-4 sm:p-6 rounded-t-2xl">
      <div className="flex items-center justify-between">
        <div className="min-w-0 flex-1">
          <h2 className="text-lg sm:text-2xl font-bold text-white">Encuesta de Satisfacción</h2>
          <p className="text-blue-100 mt-1 text-sm sm:text-base">
            Tu opinión es muy importante para nosotros
          </p>
        </div>
        <button
          onClick={onClose}
          className="text-white hover:text-blue-100 transition-colors p-1 ml-3"
        >
          <i className="fas fa-times text-lg sm:text-2xl" />
        </button>
      </div>
    </div>
  )
}

export default SurveyHeader
