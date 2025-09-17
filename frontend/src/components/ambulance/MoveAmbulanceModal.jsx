import React, { useState } from 'react'

/**
 * Modal para mover ambulancia
 * Se muestra cuando se hace clic en "Actualizar Posición"
 */
const MoveAmbulanceModal = ({ isOpen, onClose, onUpdatePosition, currentLocation }) => {
  const [formData, setFormData] = useState({
    movementType: 'Dirigiéndose a Emergencia',
    serviceType: 'en_ruta', // 'en_ruta' o 'traslado_programado'
    isEmergency: false,
    destination: '',
    transferReason: '',
    patientDetails: '',
    estimatedTime: '5 minutos',
    observations: ''
  })

  if (!isOpen) return null

  const movementTypes = [
    'Dirigiéndose a Emergencia',
    'Regresando a Base',
    'En Traslado a Hospital',
    'Traslado Programado',
    'Patrullaje',
    'Mantenimiento'
  ]

  const transferReasons = [
    'Emergencia médica crítica',
    'Traslado entre centros médicos',
    'Alta médica',
    'Consulta programada',
    'Exámenes médicos',
    'Terapia/Rehabilitación',
    'Otro'
  ]

  const timeOptions = [
    '5 minutos',
    '10 minutos',
    '15 minutos',
    '20 minutos',
    '30 minutos',
    '45 minutos',
    '1 hora'
  ]

  const handleInputChange = (field, value) => {
    setFormData(prev => ({
      ...prev,
      [field]: value
    }))
  }

  const handleSubmit = (e) => {
    e.preventDefault()
    if (!formData.destination.trim()) {
      alert('Por favor ingresa el destino/referencia')
      return
    }
    if (!formData.transferReason) {
      alert('Por favor selecciona el motivo del traslado')
      return
    }
    onUpdatePosition(formData)
    onClose()
  }

  const handleCancel = () => {
    setFormData({
      movementType: 'Dirigiéndose a Emergencia',
      serviceType: 'en_ruta',
      isEmergency: false,
      destination: '',
      transferReason: '',
      patientDetails: '',
      estimatedTime: '5 minutos',
      observations: ''
    })
    onClose()
  }

  const formatCoordinate = (coord) => {
    return coord ? coord.toFixed(4) : '0.0000'
  }

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
      <div className="bg-white rounded-lg shadow-2xl max-w-md w-full max-h-[90vh] overflow-y-auto">
        {/* Header */}
        <div className="p-6 border-b border-gray-200">
          <h2 className="text-xl font-bold text-gray-900">Mover Ambulancia</h2>
        </div>

        {/* Información actual */}
        <div className="mx-6 mt-6 mb-4">
          <div className="bg-green-50 border border-green-200 rounded-lg p-4">
            <div className="flex items-center mb-2">
              <i className="fas fa-map-marker-alt text-green-600 mr-2"></i>
              <h3 className="font-semibold text-green-900">Actualizar Ubicación</h3>
            </div>
            <div className="text-sm">
              <div className="mb-1">
                <span className="font-medium">Unidad:</span> AMB-001
              </div>
              <div>
                <span className="font-medium">Ubicación Actual:</span> 
                <span className="font-mono ml-1">
                  Lat {formatCoordinate(currentLocation?.lat || -12.0899)}, 
                  Lng {formatCoordinate(currentLocation?.lng || -77.0469)}
                </span>
              </div>
            </div>
          </div>
        </div>

        {/* Formulario */}
        <form onSubmit={handleSubmit} className="p-6 space-y-4">
          {/* Tipo de Servicio - En Ruta o Traslado Programado */}
          <div className="grid grid-cols-2 gap-3">
            <label className="cursor-pointer">
              <input
                type="radio"
                name="serviceType"
                value="en_ruta"
                checked={formData.serviceType === 'en_ruta'}
                onChange={(e) => handleInputChange('serviceType', e.target.value)}
                className="sr-only"
              />
              <div className={`p-3 rounded-lg border-2 text-center transition-colors ${
                formData.serviceType === 'en_ruta'
                  ? 'border-green-500 bg-green-50 text-green-700'
                  : 'border-gray-300 hover:border-gray-400'
              }`}>
                <i className="fas fa-route mb-1 text-lg"></i>
                <div className="font-medium">En Ruta</div>
              </div>
            </label>
            <label className="cursor-pointer">
              <input
                type="radio"
                name="serviceType"
                value="traslado_programado"
                checked={formData.serviceType === 'traslado_programado'}
                onChange={(e) => handleInputChange('serviceType', e.target.value)}
                className="sr-only"
              />
              <div className={`p-3 rounded-lg border-2 text-center transition-colors ${
                formData.serviceType === 'traslado_programado'
                  ? 'border-green-500 bg-green-50 text-green-700'
                  : 'border-gray-300 hover:border-gray-400'
              }`}>
                <i className="fas fa-calendar-check mb-1 text-lg"></i>
                <div className="font-medium">Traslado Programado</div>
              </div>
            </label>
          </div>

          {/* Tipo de Movimiento */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Tipo de Movimiento
            </label>
            <select
              value={formData.movementType}
              onChange={(e) => handleInputChange('movementType', e.target.value)}
              className="w-full p-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-green-500"
            >
              {movementTypes.map(type => (
                <option key={type} value={type}>{type}</option>
              ))}
            </select>
          </div>

          {/* Checkbox de Emergencia */}
          <div className="flex items-center space-x-2 p-3 bg-red-50 rounded-lg">
            <input
              type="checkbox"
              id="isEmergency"
              checked={formData.isEmergency}
              onChange={(e) => handleInputChange('isEmergency', e.target.checked)}
              className="w-4 h-4 text-red-600 border-gray-300 rounded focus:ring-red-500"
            />
            <label htmlFor="isEmergency" className="text-sm font-medium text-gray-700">
              <i className="fas fa-exclamation-triangle text-red-600 mr-2"></i>
              Es una emergencia
            </label>
          </div>

          {/* Destino/Referencia */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Destino/Referencia *
            </label>
            <input
              type="text"
              value={formData.destination}
              onChange={(e) => handleInputChange('destination', e.target.value)}
              placeholder="Ej: Hospital Nacional, Av. Principal 123"
              className="w-full p-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-green-500"
              required
            />
          </div>

          {/* Motivo del Traslado */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Motivo del Traslado *
            </label>
            <select
              value={formData.transferReason}
              onChange={(e) => handleInputChange('transferReason', e.target.value)}
              className="w-full p-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-green-500"
              required
            >
              <option value="">Selecciona un motivo</option>
              {transferReasons.map(reason => (
                <option key={reason} value={reason}>{reason}</option>
              ))}
            </select>
          </div>

          {/* Detalles del Paciente/Caso */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Detalles del Paciente/Caso
            </label>
            <textarea
              value={formData.patientDetails}
              onChange={(e) => handleInputChange('patientDetails', e.target.value)}
              placeholder="Nombre del paciente, condición médica, número de caso, etc..."
              rows={3}
              className="w-full p-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-green-500 resize-none"
            />
          </div>

          {/* Tiempo Estimado de Llegada */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Tiempo Estimado de Llegada
            </label>
            <select
              value={formData.estimatedTime}
              onChange={(e) => handleInputChange('estimatedTime', e.target.value)}
              className="w-full p-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-green-500"
            >
              {timeOptions.map(time => (
                <option key={time} value={time}>{time}</option>
              ))}
            </select>
          </div>

          {/* Observaciones */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Observaciones
            </label>
            <textarea
              value={formData.observations}
              onChange={(e) => handleInputChange('observations', e.target.value)}
              placeholder="Condiciones del tráfico, ruta alternativa, etc..."
              rows={4}
              className="w-full p-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-green-500 resize-none"
            />
          </div>

          {/* Botones */}
          <div className="flex space-x-3 pt-4">
            <button
              type="submit"
              className="flex-1 bg-green-600 hover:bg-green-700 text-white py-3 px-4 rounded-lg font-medium transition-colors"
            >
              Actualizar Posición
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

export default MoveAmbulanceModal