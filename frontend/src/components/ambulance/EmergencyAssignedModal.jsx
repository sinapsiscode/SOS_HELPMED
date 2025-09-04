import React, { useState } from 'react'

/**
 * Modal de emergencia asignada
 * Al hacer clic en Google Maps o Waze, cierra el modal y activa la emergencia en el dashboard
 */
const EmergencyAssignedModal = ({ isOpen, onClose, onNavigationStart }) => {
  const [showPatientHistory, setShowPatientHistory] = useState(false)

  if (!isOpen) return null

  const emergencyData = {
    code: 'EMG-3796',
    distance: '2.5 km',
    eta: '8 min',
    patient: {
      name: 'Juan Pérez Simulado',
      age: '45 años',
      phone: '+51 999888777'
    },
    symptoms: 'Dolor torácico intenso, dificultad respiratoria (SIMULACIÓN)',
    location: {
      address: 'Av. Simulación 123, Lima',
      distance: '2.5 km'
    },
    service: 'medical'
  }

  const handleNavigationClick = () => {
    // Notificar al dashboard que se inició la navegación
    if (onNavigationStart) {
      onNavigationStart(emergencyData)
    }
    // Cerrar el modal
    onClose()
  }

  return (
    <>
      <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
        <div className="bg-white rounded-2xl shadow-2xl max-w-sm w-full overflow-hidden">
          {/* Header - Idéntico a la imagen */}
          <div className="bg-blue-600 text-white p-4 relative">
            <div className="flex justify-between items-start">
              <div className="flex items-start space-x-3">
                <i className="fas fa-exclamation-triangle text-2xl mt-1"></i>
                <div>
                  <h2 className="text-lg font-bold">EMERGENCIA</h2>
                  <h2 className="text-lg font-bold -mt-1">ASIGNADA</h2>
                  <div className="text-xs mt-1 opacity-90">
                    <span>{emergencyData.code}</span>
                    <span className="mx-2">•</span>
                    <span>{emergencyData.distance} - {emergencyData.eta}</span>
                  </div>
                </div>
              </div>
              <div className="text-right">
                <div className="bg-white bg-opacity-20 backdrop-blur px-2 py-1 rounded text-xs font-bold">
                  OBLIGATORIA
                </div>
                <div className="text-[10px] opacity-90 mt-1">
                  Asignación<br/>automática
                </div>
              </div>
            </div>
          </div>

          <div className="p-4 space-y-4">
            {/* Información del Paciente */}
            <div>
              <div className="flex items-center justify-between mb-2">
                <div className="flex items-center space-x-2">
                  <i className="fas fa-user text-red-500"></i>
                  <h3 className="font-semibold text-gray-900 text-sm">Información del Paciente</h3>
                </div>
                <button
                  onClick={() => setShowPatientHistory(true)}
                  className="bg-blue-600 text-white px-3 py-1 rounded text-xs font-medium hover:bg-blue-700 flex items-center space-x-1"
                >
                  <i className="fas fa-clipboard-list text-xs"></i>
                  <span>Ver Historial</span>
                </button>
              </div>
              
              <div className="space-y-1 text-sm">
                <div className="flex">
                  <span className="text-gray-600 min-w-[70px]">Nombre:</span>
                  <span className="font-medium text-gray-900">{emergencyData.patient.name}</span>
                </div>
                <div className="flex">
                  <span className="text-gray-600 min-w-[70px]">Edad:</span>
                  <span className="font-medium text-gray-900">{emergencyData.patient.age}</span>
                </div>
                <div className="flex">
                  <span className="text-gray-600 min-w-[70px]">Teléfono:</span>
                  <span className="font-medium text-gray-900">{emergencyData.patient.phone}</span>
                </div>
              </div>
            </div>

            {/* Síntomas Reportados */}
            <div className="bg-yellow-50 border border-yellow-200 rounded-lg p-3">
              <div className="flex items-center space-x-2 mb-2">
                <i className="fas fa-clipboard-list text-orange-500"></i>
                <h3 className="font-semibold text-gray-900 text-sm">Síntomas Reportados</h3>
              </div>
              <p className="text-sm text-gray-700">
                {emergencyData.symptoms}
              </p>
            </div>

            {/* Ubicación */}
            <div className="bg-blue-50 border border-blue-200 rounded-lg p-3">
              <div className="flex items-center space-x-2 mb-2">
                <i className="fas fa-map-marker-alt text-blue-600"></i>
                <h3 className="font-semibold text-gray-900 text-sm">Ubicación</h3>
              </div>
              <p className="text-sm text-gray-700">{emergencyData.location.address}</p>
              <div className="flex items-center space-x-3 mt-2">
                <span className="text-xs text-gray-600 flex items-center">
                  <i className="fas fa-road mr-1 text-xs"></i>
                  {emergencyData.location.distance}
                </span>
                <span className="text-xs text-gray-600 flex items-center bg-gray-100 px-2 py-0.5 rounded">
                  <span className="mr-1">⏱</span>
                  ETA: {emergencyData.eta}
                </span>
              </div>
            </div>

            {/* Botones de navegación - Ahora abren el modal de clasificación */}
            <div className="grid grid-cols-2 gap-3">
              <button
                onClick={handleNavigationClick}
                className="bg-blue-500 text-white py-3 px-4 rounded-xl font-medium hover:bg-blue-600 transition-colors flex items-center justify-center space-x-2"
              >
                <span className="text-lg">G</span>
                <span className="text-sm">Google Maps</span>
              </button>
              <button
                onClick={handleNavigationClick}
                className="bg-purple-500 text-white py-3 px-4 rounded-xl font-medium hover:bg-purple-600 transition-colors flex items-center justify-center space-x-2"
              >
                <i className="fas fa-location-arrow"></i>
                <span className="text-sm">Waze</span>
              </button>
            </div>
          </div>
        </div>

        {/* Modal de Historial del Paciente */}
        {showPatientHistory && (
          <div className="fixed inset-0 bg-black bg-opacity-75 flex items-center justify-center z-60 p-4">
            <div className="bg-white rounded-2xl shadow-2xl max-w-md w-full max-h-[80vh] overflow-y-auto">
              <div className="sticky top-0 bg-white border-b border-gray-200 p-4 rounded-t-2xl">
                <div className="flex items-center justify-between">
                  <h3 className="text-lg font-bold text-gray-900">Historial del Paciente</h3>
                  <button
                    onClick={() => setShowPatientHistory(false)}
                    className="text-gray-500 hover:text-gray-700 p-1"
                  >
                    <i className="fas fa-times text-xl"></i>
                  </button>
                </div>
              </div>
              
              <div className="p-6">
                <div className="text-center text-gray-500">
                  <i className="fas fa-file-medical-alt text-6xl mb-4 text-blue-200"></i>
                  <p className="text-lg font-medium mb-2 text-gray-700">Historial Médico</p>
                  <p className="text-sm text-gray-600">{emergencyData.patient.name}</p>
                  <p className="text-xs text-gray-400 mt-3">
                    No hay registros previos disponibles
                  </p>
                  <p className="text-xs text-gray-400">
                    (SIMULACIÓN)
                  </p>
                </div>
              </div>
              
              <div className="p-4 border-t">
                <button
                  onClick={() => setShowPatientHistory(false)}
                  className="w-full bg-gray-100 text-gray-700 py-2 px-4 rounded-lg text-sm hover:bg-gray-200"
                >
                  Cerrar
                </button>
              </div>
            </div>
          </div>
        )}
      </div>
    </>
  )
}

export default EmergencyAssignedModal