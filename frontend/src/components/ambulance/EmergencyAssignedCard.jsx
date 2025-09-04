import React, { useState } from 'react'
import PropTypes from 'prop-types'

/**
 * Card de emergencia asignada para el dashboard de ambulancia
 * Muestra la información de la emergencia actual y acciones disponibles
 */
const EmergencyAssignedCard = ({ 
  emergencyData, 
  onConfirmArrival, 
  onViewHistory,
  isVisible = true 
}) => {
  const [showHistory, setShowHistory] = useState(false)

  if (!isVisible || !emergencyData) return null

  // Funciones para navegación
  const handleGoogleMaps = () => {
    const { lat, lng, address } = emergencyData.location || {}
    
    // Si tenemos coordenadas, usar esas, sino usar dirección
    if (lat && lng) {
      const url = `https://www.google.com/maps/dir/?api=1&destination=${lat},${lng}`
      window.open(url, '_blank')
    } else if (address) {
      const url = `https://www.google.com/maps/dir/?api=1&destination=${encodeURIComponent(address)}`
      window.open(url, '_blank')
    } else {
      alert('No se pudo obtener la ubicación de la emergencia')
    }
  }

  const handleWaze = () => {
    const { lat, lng, address } = emergencyData.location || {}
    
    // Waze requiere coordenadas para navegación
    if (lat && lng) {
      const url = `https://waze.com/ul?ll=${lat},${lng}&navigate=yes`
      window.open(url, '_blank')
    } else if (address) {
      // Intentar con búsqueda de dirección
      const url = `https://waze.com/ul?q=${encodeURIComponent(address)}&navigate=yes`
      window.open(url, '_blank')
    } else {
      alert('No se pudo abrir Waze. Ubicación no disponible.')
    }
  }

  const handleConfirmArrival = () => {
    if (onConfirmArrival) {
      onConfirmArrival(emergencyData.id)
    }
  }

  const handleViewHistory = () => {
    setShowHistory(true)
    if (onViewHistory) {
      onViewHistory(emergencyData.patient)
    }
  }

  return (
    <>
      <div className="bg-white rounded-lg shadow-lg overflow-hidden">
        {/* Header */}
        <div className="bg-gradient-to-r from-red-500 to-red-600 text-white p-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center">
              <i className="fas fa-exclamation-triangle text-2xl mr-3 animate-pulse"></i>
              <div>
                <h2 className="text-lg font-bold">Emergencia Asignada</h2>
                <div className="text-sm opacity-90">
                  Código: {emergencyData.code || 'EMG-' + Date.now()}
                </div>
              </div>
            </div>
            <button
              onClick={handleViewHistory}
              className="bg-white/20 hover:bg-white/30 text-white px-3 py-1 rounded-lg text-sm transition-colors"
            >
              <i className="fas fa-history mr-1"></i>
              Ver Historial
            </button>
          </div>
        </div>

        {/* Status Badge */}
        <div className="bg-yellow-50 border-b border-yellow-200 px-4 py-2">
          <div className="flex items-center justify-center">
            <span className="bg-yellow-500 text-white px-4 py-1 rounded-full text-sm font-medium uppercase">
              {emergencyData.status || 'URGENTE'}
            </span>
          </div>
        </div>

        {/* Patient Info */}
        <div className="p-4 border-b border-gray-200">
          <div className="flex items-start space-x-3">
            <div className="w-10 h-10 bg-red-100 rounded-full flex items-center justify-center flex-shrink-0">
              <i className="fas fa-user-injured text-red-600"></i>
            </div>
            <div className="flex-1">
              <h3 className="font-semibold text-gray-900">
                {emergencyData.patient?.name || 'Juan Pérez Simulado'}
              </h3>
              <div className="text-sm text-gray-600 mt-1">
                <div className="mb-1">
                  <span className="font-medium">Edad:</span> {emergencyData.patient?.age || '45 años'}
                </div>
                <div className="mb-1">
                  <span className="font-medium">Síntomas:</span>{' '}
                  <span className="text-red-600">
                    {emergencyData.symptoms || 'Dolor torácico intenso, dificultad respiratoria (SIMULACIÓN)'}
                  </span>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Location Info */}
        <div className="p-4 border-b border-gray-200">
          <div className="flex items-start space-x-3 mb-3">
            <div className="w-10 h-10 bg-blue-100 rounded-full flex items-center justify-center flex-shrink-0">
              <i className="fas fa-map-marker-alt text-blue-600"></i>
            </div>
            <div className="flex-1">
              <div className="font-medium text-gray-900">
                Paciente: {emergencyData.patient?.name || 'Juan Pérez Simulado'}
              </div>
              <div className="text-sm text-gray-600">
                <div>Ubicación: {emergencyData.location?.address || 'Av. Simulación 123, Lima'}</div>
                <div>Contacto: {emergencyData.patient?.phone || '+51 999888777'}</div>
              </div>
            </div>
          </div>

          <div className="grid grid-cols-3 gap-2 text-center mb-3">
            <div className="bg-gray-50 rounded-lg p-2">
              <div className="text-xs text-gray-600">Hora</div>
              <div className="font-semibold text-sm">
                {emergencyData.time || new Date().toLocaleTimeString('es-PE', { hour: '2-digit', minute: '2-digit' })}
              </div>
            </div>
            <div className="bg-gray-50 rounded-lg p-2">
              <div className="text-xs text-gray-600">Prioridad</div>
              <div className="font-semibold text-sm text-red-600">
                {emergencyData.priority || 'Alta'}
              </div>
            </div>
            <div className="bg-gray-50 rounded-lg p-2">
              <div className="text-xs text-gray-600">Distancia</div>
              <div className="font-semibold text-sm">
                {emergencyData.location?.distance || '~0.0 km'}
              </div>
            </div>
          </div>

          {/* Navigation Buttons */}
          <div className="grid grid-cols-2 gap-2">
            <button
              onClick={handleGoogleMaps}
              className="bg-blue-600 hover:bg-blue-700 text-white px-3 py-2 rounded-lg text-sm font-medium transition-colors flex items-center justify-center"
            >
              <i className="fab fa-google mr-2"></i>
              Google Maps
            </button>
            <button
              onClick={handleWaze}
              className="bg-purple-600 hover:bg-purple-700 text-white px-3 py-2 rounded-lg text-sm font-medium transition-colors flex items-center justify-center"
            >
              <i className="fas fa-location-arrow mr-2"></i>
              Waze
            </button>
          </div>
        </div>

        {/* Action Button */}
        <div className="p-4">
          <button
            onClick={handleConfirmArrival}
            className="w-full bg-blue-600 hover:bg-blue-700 text-white py-3 px-4 rounded-lg font-semibold transition-colors flex items-center justify-center"
          >
            <i className="fas fa-map-pin mr-2"></i>
            Confirmar Llegada
          </button>
        </div>
      </div>

      {/* Patient History Modal */}
      {showHistory && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-lg shadow-2xl max-w-lg w-full max-h-[80vh] overflow-y-auto">
            <div className="sticky top-0 bg-white border-b border-gray-200 p-4">
              <div className="flex items-center justify-between">
                <h3 className="text-lg font-bold text-gray-900">
                  Historial del Paciente
                </h3>
                <button
                  onClick={() => setShowHistory(false)}
                  className="text-gray-500 hover:text-gray-700"
                >
                  <i className="fas fa-times text-xl"></i>
                </button>
              </div>
            </div>
            
            <div className="p-6">
              <div className="text-center text-gray-500">
                <i className="fas fa-file-medical-alt text-6xl mb-4"></i>
                <p className="text-lg font-medium mb-2">Historial Médico</p>
                <p className="text-sm">{emergencyData.patient?.name || 'Juan Pérez Simulado'}</p>
                <p className="text-xs text-gray-400 mt-2">
                  No hay registros previos disponibles (SIMULACIÓN)
                </p>
              </div>
            </div>
          </div>
        </div>
      )}
    </>
  )
}

EmergencyAssignedCard.propTypes = {
  emergencyData: PropTypes.shape({
    id: PropTypes.string,
    code: PropTypes.string,
    status: PropTypes.string,
    priority: PropTypes.string,
    time: PropTypes.string,
    symptoms: PropTypes.string,
    patient: PropTypes.shape({
      name: PropTypes.string,
      age: PropTypes.string,
      phone: PropTypes.string
    }),
    location: PropTypes.shape({
      address: PropTypes.string,
      lat: PropTypes.number,
      lng: PropTypes.number,
      distance: PropTypes.string
    })
  }),
  onConfirmArrival: PropTypes.func,
  onViewHistory: PropTypes.func,
  isVisible: PropTypes.bool
}

export default EmergencyAssignedCard