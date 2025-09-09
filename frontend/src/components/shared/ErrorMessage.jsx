import React from 'react'

const ErrorMessage = ({ message, onRetry }) => {
  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-50">
      <div className="p-8 m-4 border border-red-200 rounded-lg bg-red-50 max-w-2xl">
        <div className="flex items-center mb-4">
          <i className="fas fa-exclamation-triangle text-red-600 text-2xl mr-3"></i>
          <h2 className="text-xl font-bold text-red-600">
            Error
          </h2>
        </div>
        <p className="text-red-700 mb-4">
          {message || 'Ha ocurrido un error inesperado'}
        </p>
        {onRetry && (
          <button
            onClick={onRetry}
            className="px-4 py-2 text-white bg-red-600 rounded hover:bg-red-700 transition-colors"
          >
            <i className="fas fa-redo mr-2"></i>
            Reintentar
          </button>
        )}
      </div>
    </div>
  )
}

export default ErrorMessage