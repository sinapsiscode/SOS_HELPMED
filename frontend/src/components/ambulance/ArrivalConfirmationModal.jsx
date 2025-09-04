import React from 'react'

/**
 * Modal de confirmación de llegada
 * Aparece cuando el usuario hace clic en "Confirmar Llegada"
 */
const ArrivalConfirmationModal = ({ isOpen, onConfirm, onCancel }) => {
  if (!isOpen) return null

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
      <div className="bg-white rounded-2xl shadow-2xl max-w-md w-full p-6">
        <div className="flex flex-col items-center">
          {/* Icono de pregunta */}
          <div className="w-20 h-20 bg-blue-100 rounded-full flex items-center justify-center mb-4">
            <span className="text-4xl text-blue-600">?</span>
          </div>
          
          {/* Título */}
          <h2 className="text-2xl font-bold text-gray-900 mb-2">
            ¿Llegaste al lugar?
          </h2>
          
          {/* Descripción */}
          <p className="text-gray-600 text-center mb-6">
            Confirma que has llegado al lugar de la emergencia
          </p>
          
          {/* Botones */}
          <div className="flex space-x-3 w-full">
            <button
              onClick={onConfirm}
              className="flex-1 bg-blue-600 hover:bg-blue-700 text-white py-3 px-6 rounded-lg font-semibold transition-colors"
            >
              Confirmar Llegada
            </button>
            <button
              onClick={onCancel}
              className="flex-1 bg-gray-500 hover:bg-gray-600 text-white py-3 px-6 rounded-lg font-semibold transition-colors"
            >
              Cancelar
            </button>
          </div>
        </div>
      </div>
    </div>
  )
}

export default ArrivalConfirmationModal