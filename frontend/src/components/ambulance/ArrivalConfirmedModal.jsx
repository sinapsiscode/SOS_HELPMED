import React, { useEffect } from 'react'

/**
 * Modal de confirmación de llegada exitosa
 * Se muestra automáticamente después de confirmar llegada y se cierra solo
 */
const ArrivalConfirmedModal = ({ isOpen, onClose }) => {
  useEffect(() => {
    if (isOpen) {
      // Auto cerrar después de 2 segundos
      const timer = setTimeout(() => {
        onClose()
      }, 2000)
      
      return () => clearTimeout(timer)
    }
  }, [isOpen, onClose])

  if (!isOpen) return null

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
      <div className="bg-white rounded-2xl shadow-2xl max-w-sm w-full p-8 transform transition-all animate-bounce-in">
        <div className="flex flex-col items-center">
          {/* Check verde animado */}
          <div className="w-24 h-24 bg-green-100 rounded-full flex items-center justify-center mb-4 animate-pulse">
            <i className="fas fa-check text-5xl text-green-500"></i>
          </div>
          
          {/* Texto de confirmación */}
          <h2 className="text-2xl font-bold text-gray-900 mb-2 text-center">
            Llegada Confirmada
          </h2>
          
          <p className="text-gray-600 text-center">
            Has llegado al lugar de la emergencia
          </p>
        </div>
      </div>
    </div>
  )
}

export default ArrivalConfirmedModal