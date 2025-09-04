import React from 'react'

/**
 * Componente para seguimiento de emergencias
 * Incluye notas de emergencia y ubicación ambulancia
 *
 * @param {Object} props - Props del componente
 * @param {Function} props.onOpenNoteModal - Función para abrir modal de notas
 * @param {Function} props.onUpdateLocation - Función para actualizar ubicación
 * @returns {JSX.Element} Sección de seguimiento de emergencias
 */
const EmergencyTrackingSection = ({ onOpenNoteModal, onUpdateLocation }) => {

  return (
    <div className="bg-white rounded-lg shadow p-6">
        <div className="flex items-center mb-6">
          <div className="w-6 h-6 bg-blue-600 rounded flex items-center justify-center mr-3">
            <i className="fas fa-lock text-white text-sm"></i>
          </div>
          <h2 className="text-lg font-semibold text-gray-900">Seguimiento de Emergencias</h2>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Notas de Emergencia */}
        <div className="bg-blue-50 border border-blue-200 rounded-lg p-4">
          <div className="flex items-center mb-3">
            <div className="w-8 h-8 bg-blue-600 rounded-lg flex items-center justify-center mr-3">
              <i className="fas fa-clipboard-list text-white text-sm"></i>
            </div>
            <h3 className="font-semibold text-blue-900">Notas de Emergencia</h3>
          </div>
          
          <p className="text-blue-800 text-sm mb-4">
            Registra observaciones, signos vitales, tratamientos aplicados durante la atención
          </p>

          <div className="space-y-3">
            <div className="bg-blue-100 border border-blue-200 rounded-lg p-3 text-sm text-blue-800 min-h-[96px] flex items-center justify-center">
              Registra observaciones, signos vitales, tratamientos aplicados durante la atención
            </div>
            
            <button
              onClick={onOpenNoteModal}
              className="w-full bg-gray-400 hover:bg-gray-500 text-white py-2 px-4 rounded-lg text-sm font-medium transition-colors flex items-center justify-center"
            >
              <i className="fas fa-plus mr-2"></i>
              Agregar Nota
            </button>
          </div>
        </div>

        {/* Ubicación Ambulancia */}
        <div className="bg-green-50 border border-green-200 rounded-lg p-4">
          <div className="flex items-center mb-3">
            <div className="w-8 h-8 bg-green-600 rounded-lg flex items-center justify-center mr-3">
              <i className="fas fa-map-marker-alt text-white text-sm"></i>
            </div>
            <h3 className="font-semibold text-green-900">Ubicación Ambulancia</h3>
          </div>
          
          <p className="text-green-800 text-sm mb-4">
            Actualiza tu ubicación y informa sobre el estado del viaje
          </p>

          <button
            onClick={onUpdateLocation}
            className="w-full bg-green-600 hover:bg-green-700 text-white py-2 px-4 rounded-lg text-sm font-medium transition-colors flex items-center justify-center"
          >
            <i className="fas fa-sync mr-2"></i>
            Actualizar Posición
          </button>
        </div>
      </div>
    </div>
  )
}

export default EmergencyTrackingSection