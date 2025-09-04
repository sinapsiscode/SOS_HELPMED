import React, { useState } from 'react'

/**
 * Modal para agregar nota a la emergencia
 * Se muestra cuando se hace clic en "Agregar Nota" desde Notas de Emergencia
 */
const AddEmergencyNoteModal = ({ isOpen, onClose, onAddNote, emergencyCode = 'EMG-175696195833' }) => {
  const [formData, setFormData] = useState({
    noteType: 'Observación General',
    description: '',
    priority: 'Normal'
  })

  if (!isOpen) return null

  const noteTypes = [
    'Observación General',
    'Signos Vitales',
    'Tratamiento Aplicado',
    'Medicación Administrada',
    'Estado del Paciente',
    'Cambios en Condición',
    'Procedimiento Realizado'
  ]

  const priorities = [
    'Baja',
    'Normal',
    'Alta',
    'Crítica'
  ]

  const handleInputChange = (field, value) => {
    setFormData(prev => ({
      ...prev,
      [field]: value
    }))
  }

  const handleSubmit = (e) => {
    e.preventDefault()
    if (!formData.description.trim()) {
      alert('Por favor ingresa la descripción de la nota')
      return
    }
    
    const noteData = {
      ...formData,
      emergencyCode,
      timestamp: new Date(),
      id: Date.now()
    }
    
    onAddNote(noteData)
    
    // Reset form
    setFormData({
      noteType: 'Observación General',
      description: '',
      priority: 'Normal'
    })
    
    onClose()
  }

  const handleCancel = () => {
    setFormData({
      noteType: 'Observación General',
      description: '',
      priority: 'Normal'
    })
    onClose()
  }

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
      <div className="bg-white rounded-lg shadow-2xl max-w-md w-full max-h-[90vh] overflow-y-auto">
        {/* Header */}
        <div className="p-6 border-b border-gray-200">
          <h2 className="text-xl font-bold text-gray-900">Agregar Nota a la Emergencia</h2>
        </div>

        {/* Información de la emergencia */}
        <div className="mx-6 mt-6 mb-4">
          <div className="bg-blue-50 border border-blue-200 rounded-lg p-4">
            <div className="flex items-center mb-2">
              <i className="fas fa-clipboard-list text-blue-600 mr-2"></i>
              <h3 className="font-semibold text-blue-900">Nueva Nota</h3>
            </div>
            <div className="text-sm space-y-1">
              <div>
                <span className="font-medium text-blue-800">Emergencia:</span> 
                <span className="ml-1 text-blue-700">{emergencyCode}</span>
              </div>
              <div>
                <span className="font-medium text-blue-800">Paciente:</span> 
                <span className="ml-1 text-blue-700">No especificado</span>
              </div>
            </div>
          </div>
        </div>

        {/* Formulario */}
        <form onSubmit={handleSubmit} className="p-6 space-y-4">
          {/* Tipo de Nota */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Tipo de Nota
            </label>
            <select
              value={formData.noteType}
              onChange={(e) => handleInputChange('noteType', e.target.value)}
              className="w-full p-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
            >
              {noteTypes.map(type => (
                <option key={type} value={type}>{type}</option>
              ))}
            </select>
          </div>

          {/* Descripción de la Nota */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Descripción de la Nota *
            </label>
            <textarea
              value={formData.description}
              onChange={(e) => handleInputChange('description', e.target.value)}
              placeholder="Describe la observación, actualización o información relevante..."
              rows={5}
              className="w-full p-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 resize-none"
              required
            />
          </div>

          {/* Prioridad */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Prioridad
            </label>
            <select
              value={formData.priority}
              onChange={(e) => handleInputChange('priority', e.target.value)}
              className="w-full p-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
            >
              {priorities.map(priority => (
                <option key={priority} value={priority}>{priority}</option>
              ))}
            </select>
          </div>

          {/* Botones */}
          <div className="flex space-x-3 pt-4">
            <button
              type="submit"
              className="flex-1 bg-blue-600 hover:bg-blue-700 text-white py-3 px-4 rounded-lg font-medium transition-colors"
            >
              Agregar Nota
            </button>
            <button
              type="button"
              onClick={handleCancel}
              className="flex-1 bg-gray-400 hover:bg-gray-500 text-white py-3 px-4 rounded-lg font-medium transition-colors"
            >
              Cancelar
            </button>
          </div>
        </form>
      </div>
    </div>
  )
}

export default AddEmergencyNoteModal