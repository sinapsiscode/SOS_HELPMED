import React from 'react'

/**
 * Formulario para simular nuevas emergencias
 * Siguiendo Regla #3: Componente específico <200 líneas
 * Siguiendo Regla #2: Solo presentación
 *
 * @param {Object} props - Props del componente
 * @param {boolean} props.isOpen - Estado del modal
 * @param {Object} props.emergencyData - Datos del formulario
 * @param {Function} props.onUpdateData - Función para actualizar datos
 * @param {Function} props.onSubmit - Función para enviar formulario
 * @param {Function} props.onClose - Función para cerrar modal
 * @returns {JSX.Element} Formulario de simulación de emergencia
 */
const EmergencySimulationForm = ({ isOpen, emergencyData, onUpdateData, onSubmit, onClose }) => {
  if (!isOpen) return null

  const handleSubmit = (e) => {
    e.preventDefault()
    onSubmit()
  }

  const emergencyTypes = [
    { value: 'cardiac', label: 'Emergencia Cardiaca', icon: 'fas fa-heartbeat' },
    { value: 'accident', label: 'Accidente Vehicular', icon: 'fas fa-car-crash' },
    { value: 'respiratory', label: 'Problema Respiratorio', icon: 'fas fa-lungs' },
    { value: 'medical', label: 'Emergencia Médica General', icon: 'fas fa-stethoscope' },
    { value: 'trauma', label: 'Trauma/Lesiones', icon: 'fas fa-band-aid' },
    { value: 'overdose', label: 'Sobredosis', icon: 'fas fa-pills' }
  ]

  const priorityLevels = [
    { value: 'critical', label: 'Crítica', color: 'text-red-600' },
    { value: 'high', label: 'Alta', color: 'text-orange-600' },
    { value: 'medium', label: 'Media', color: 'text-yellow-600' },
    { value: 'low', label: 'Baja', color: 'text-green-600' }
  ]

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
      <div className="bg-white rounded-xl shadow-2xl max-w-2xl w-full m-4 max-h-[90vh] overflow-y-auto">
        {/* Header */}
        <div className="p-6 border-b border-gray-100">
          <div className="flex items-center justify-between">
            <div>
              <h2 className="text-xl font-bold text-gray-800 font-exo">
                <i className="fas fa-plus-circle text-helpmed-blue mr-3"></i>
                Simular Nueva Emergencia
              </h2>
              <p className="text-gray-600 font-roboto mt-1">
                Crear una emergencia de prueba para el sistema
              </p>
            </div>
            <button
              onClick={onClose}
              className="p-2 text-gray-500 hover:text-gray-700 rounded-lg transition-colors"
            >
              <i className="fas fa-times text-xl"></i>
            </button>
          </div>
        </div>

        {/* Formulario */}
        <form onSubmit={handleSubmit} className="p-6 space-y-6">
          {/* Información del paciente */}
          <div className="space-y-4">
            <h3 className="text-lg font-semibold text-gray-800 font-exo">
              Información del Paciente
            </h3>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Nombre del Paciente *
              </label>
              <input
                type="text"
                value={emergencyData.patientName || ''}
                onChange={(e) => onUpdateData('patientName', e.target.value)}
                className="w-full border border-gray-300 rounded-lg px-3 py-2 focus:ring-2 focus:ring-helpmed-blue focus:border-helpmed-blue font-roboto"
                placeholder="Ej: Juan Pérez Martínez"
                required
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">Ubicación *</label>
              <input
                type="text"
                value={emergencyData.location || ''}
                onChange={(e) => onUpdateData('location', e.target.value)}
                className="w-full border border-gray-300 rounded-lg px-3 py-2 focus:ring-2 focus:ring-helpmed-blue focus:border-helpmed-blue font-roboto"
                placeholder="Ej: Av. Arequipa 2450, Lince, Lima"
                required
              />
            </div>
          </div>

          {/* Tipo de emergencia */}
          <div className="space-y-4">
            <h3 className="text-lg font-semibold text-gray-800 font-exo">
              Clasificación de Emergencia
            </h3>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Tipo de Emergencia *
              </label>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                {emergencyTypes.map((type) => (
                  <label
                    key={type.value}
                    className={`flex items-center p-3 border rounded-lg cursor-pointer transition-colors ${
                      emergencyData.emergencyType === type.value
                        ? 'border-helpmed-blue bg-blue-50'
                        : 'border-gray-200 hover:border-gray-300'
                    }`}
                  >
                    <input
                      type="radio"
                      name="emergencyType"
                      value={type.value}
                      checked={emergencyData.emergencyType === type.value}
                      onChange={(e) => onUpdateData('emergencyType', e.target.value)}
                      className="sr-only"
                    />
                    <i className={`${type.icon} text-gray-600 mr-3`}></i>
                    <span className="text-sm font-medium text-gray-700 font-roboto">
                      {type.label}
                    </span>
                  </label>
                ))}
              </div>
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">Prioridad *</label>
              <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
                {priorityLevels.map((priority) => (
                  <label
                    key={priority.value}
                    className={`flex items-center justify-center p-3 border rounded-lg cursor-pointer transition-colors ${
                      emergencyData.priority === priority.value
                        ? 'border-helpmed-blue bg-blue-50'
                        : 'border-gray-200 hover:border-gray-300'
                    }`}
                  >
                    <input
                      type="radio"
                      name="priority"
                      value={priority.value}
                      checked={emergencyData.priority === priority.value}
                      onChange={(e) => onUpdateData('priority', e.target.value)}
                      className="sr-only"
                    />
                    <span className={`text-sm font-medium font-roboto ${priority.color}`}>
                      {priority.label}
                    </span>
                  </label>
                ))}
              </div>
            </div>
          </div>

          {/* Notas adicionales */}
          <div className="space-y-4">
            <h3 className="text-lg font-semibold text-gray-800 font-exo">Información Adicional</h3>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Notas de la Emergencia
              </label>
              <textarea
                value={emergencyData.notes || ''}
                onChange={(e) => onUpdateData('notes', e.target.value)}
                rows="4"
                className="w-full border border-gray-300 rounded-lg px-3 py-2 focus:ring-2 focus:ring-helpmed-blue focus:border-helpmed-blue font-roboto"
                placeholder="Describe los síntomas, circunstancias o información relevante sobre la emergencia..."
              />
            </div>
          </div>

          {/* Advertencia */}
          <div className="bg-yellow-50 border border-yellow-200 rounded-lg p-4">
            <div className="flex items-start">
              <i className="fas fa-exclamation-triangle text-yellow-600 mr-3 mt-0.5"></i>
              <div>
                <p className="text-sm font-medium text-yellow-800 mb-1">Nota Importante</p>
                <p className="text-sm text-yellow-700">
                  Esta es una simulación para fines de prueba. Los datos ingresados no representan
                  una emergencia real.
                </p>
              </div>
            </div>
          </div>

          {/* Botones */}
          <div className="flex space-x-4 pt-4 border-t border-gray-100">
            <button
              type="button"
              onClick={onClose}
              className="flex-1 bg-gray-500 hover:bg-gray-600 text-white py-3 px-4 rounded-lg transition-colors font-roboto"
            >
              <i className="fas fa-times mr-2"></i>
              Cancelar
            </button>
            <button
              type="submit"
              className="flex-1 bg-helpmed-blue hover:bg-blue-700 text-white py-3 px-4 rounded-lg transition-colors font-roboto"
            >
              <i className="fas fa-plus mr-2"></i>
              Crear Emergencia
            </button>
          </div>
        </form>
      </div>
    </div>
  )
}

export default EmergencySimulationForm
