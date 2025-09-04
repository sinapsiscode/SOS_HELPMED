import React, { useState } from 'react'
import ArrivalConfirmationModal from './ArrivalConfirmationModal'
import ArrivalConfirmedModal from './ArrivalConfirmedModal'
import ServiceCompletionModal from './ServiceCompletionModal'

/**
 * Tarjeta de emergencia activa en el dashboard
 * Muestra cuando hay una emergencia en curso con opciones de navegación
 */
const ActiveEmergencyCard = ({ 
  emergencyData, 
  onConfirmArrival,
  onViewHistory,
  isVisible = false 
}) => {
  const [showHistory, setShowHistory] = useState(false)
  const [showConfirmModal, setShowConfirmModal] = useState(false)
  const [showConfirmedModal, setShowConfirmedModal] = useState(false)
  const [showCompletionModal, setShowCompletionModal] = useState(false)
  const [hasArrived, setHasArrived] = useState(false)

  if (!isVisible || !emergencyData) return null

  const handleGoogleMaps = () => {
    const { address } = emergencyData.location || {}
    if (address) {
      const url = `https://www.google.com/maps/dir/?api=1&destination=${encodeURIComponent(address)}`
      window.open(url, '_blank')
    }
  }

  const handleWaze = () => {
    const { address } = emergencyData.location || {}
    if (address) {
      const url = `https://waze.com/ul?q=${encodeURIComponent(address)}&navigate=yes`
      window.open(url, '_blank')
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
      <div className="bg-white rounded-lg shadow-lg p-6">
        <div className="flex items-center justify-between mb-4">
          <h2 className="text-lg font-bold text-gray-900">Emergencia Asignada</h2>
          <button
            onClick={handleViewHistory}
            className="bg-blue-600 text-white px-4 py-2 rounded-lg text-sm font-medium hover:bg-blue-700 flex items-center space-x-2"
          >
            <i className="fas fa-clipboard-list"></i>
            <span>Ver Historial</span>
          </button>
        </div>

        <div className="bg-red-50 border border-red-200 rounded-lg p-4 mb-4">
          <div className="flex items-start space-x-3">
            <i className="fas fa-exclamation-triangle text-red-500 text-xl mt-1"></i>
            <div className="flex-1">
              <div className="flex items-center justify-between mb-2">
                <h3 className="font-semibold text-red-900">Emergencia Médica</h3>
                <span className="bg-red-500 text-white px-3 py-1 rounded-full text-xs font-bold">
                  URGENTE
                </span>
              </div>
              <p className="text-sm text-red-800 mb-1">
                {emergencyData.symptoms}
              </p>
            </div>
          </div>
        </div>

        <div className="grid grid-cols-2 gap-4 mb-4">
          <div>
            <div className="text-xs text-gray-500 mb-1">Paciente:</div>
            <div className="font-medium text-gray-900">{emergencyData.patient.name}</div>
          </div>
          <div>
            <div className="text-xs text-gray-500 mb-1">Hora:</div>
            <div className="font-medium text-gray-900">3:05:57 p. m.</div>
          </div>
          <div>
            <div className="text-xs text-gray-500 mb-1">Ubicación:</div>
            <div className="font-medium text-gray-900">{emergencyData.location.address}</div>
          </div>
          <div>
            <div className="text-xs text-gray-500 mb-1">Contacto:</div>
            <div className="font-medium text-gray-900">{emergencyData.patient.phone}</div>
          </div>
          <div>
            <div className="text-xs text-gray-500 mb-1">Prioridad:</div>
            <div className="font-medium text-red-600">Alta</div>
          </div>
          <div>
            <div className="text-xs text-gray-500 mb-1">Distancia:</div>
            <div className="font-medium text-gray-900">~{emergencyData.location.distance}</div>
          </div>
        </div>

        <div className="grid grid-cols-2 gap-3 mb-3">
          <button
            onClick={handleGoogleMaps}
            className="bg-blue-600 hover:bg-blue-700 text-white py-3 px-4 rounded-lg font-medium transition-colors flex items-center justify-center space-x-2"
          >
            <i className="fab fa-google"></i>
            <span>Google Maps</span>
          </button>
          <button
            onClick={handleWaze}
            className="bg-purple-600 hover:bg-purple-700 text-white py-3 px-4 rounded-lg font-medium transition-colors flex items-center justify-center space-x-2"
          >
            <i className="fas fa-location-arrow"></i>
            <span>Waze</span>
          </button>
        </div>

        {!hasArrived ? (
          <button
            onClick={() => setShowConfirmModal(true)}
            className="w-full bg-blue-600 hover:bg-blue-700 text-white py-3 px-4 rounded-lg font-semibold transition-colors flex items-center justify-center space-x-2"
          >
            <i className="fas fa-map-pin"></i>
            <span>Confirmar Llegada</span>
          </button>
        ) : (
          <button
            onClick={() => setShowCompletionModal(true)}
            className="w-full bg-blue-600 hover:bg-blue-700 text-white py-3 px-4 rounded-lg font-semibold transition-colors flex items-center justify-center space-x-2"
          >
            <i className="fas fa-check-circle"></i>
            <span>Completar Emergencia</span>
          </button>
        )}
      </div>

      {/* Modal de Historial del Paciente */}
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
                <i className="fas fa-file-medical-alt text-6xl mb-4 text-blue-200"></i>
                <p className="text-lg font-medium mb-2 text-gray-700">Historial Médico</p>
                <p className="text-sm text-gray-600">{emergencyData.patient.name}</p>
                <p className="text-xs text-gray-400 mt-3">
                  No hay registros previos disponibles (SIMULACIÓN)
                </p>
              </div>
            </div>
            
            <div className="p-4 border-t">
              <button
                onClick={() => setShowHistory(false)}
                className="w-full bg-gray-100 text-gray-700 py-2 px-4 rounded-lg text-sm hover:bg-gray-200"
              >
                Cerrar
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Modal de Confirmación de Llegada */}
      <ArrivalConfirmationModal
        isOpen={showConfirmModal}
        onConfirm={() => {
          setShowConfirmModal(false)
          setHasArrived(true)
          setShowConfirmedModal(true)
          if (onConfirmArrival) {
            onConfirmArrival(emergencyData)
          }
        }}
        onCancel={() => setShowConfirmModal(false)}
      />

      {/* Modal de Llegada Confirmada */}
      <ArrivalConfirmedModal
        isOpen={showConfirmedModal}
        onClose={() => setShowConfirmedModal(false)}
      />

      {/* Modal de Completar y Clasificar Servicio */}
      <ServiceCompletionModal
        isOpen={showCompletionModal}
        onClose={() => setShowCompletionModal(false)}
        onComplete={(classificationData) => {
          console.log('Servicio completado:', classificationData)
          setShowCompletionModal(false)
          // Resetear el estado de emergencia
          setHasArrived(false)
        }}
        patientInfo={{
          name: emergencyData.patient.name,
          age: emergencyData.patient.age,
          symptoms: emergencyData.symptoms,
          service: 'medical'
        }}
        emergencyCode={emergencyData.code}
      />
    </>
  )
}

export default ActiveEmergencyCard