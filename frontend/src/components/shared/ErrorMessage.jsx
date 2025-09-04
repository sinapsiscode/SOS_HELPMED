import React from 'react'

/**
 * Componente reutilizable para mostrar mensajes de error
 * Incluye opción de retry y mensaje personalizable
 */
const ErrorMessage = ({ message, onRetry, className = '' }) => {
  return (
    <div className={`bg-red-50 border border-red-200 rounded-lg p-4 ${className}`}>
      <div className="flex items-center">
        <div className="flex-shrink-0">
          <span className="text-red-500 text-xl">⚠️</span>
        </div>
        <div className="ml-3 flex-1">
          <p className="text-sm font-medium text-red-800">{message || 'Ha ocurrido un error'}</p>
        </div>
        {onRetry && (
          <div className="ml-4">
            <button
              onClick={onRetry}
              className="px-3 py-1 bg-red-600 text-white text-sm rounded hover:bg-red-700 transition-colors"
            >
              Reintentar
            </button>
          </div>
        )}
      </div>
    </div>
  )
}

export default ErrorMessage
