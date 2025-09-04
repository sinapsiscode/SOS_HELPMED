import React from 'react'

/**
 * Componente para mostrar el estado actual de la ambulancia
 * Siguiendo el diseño específico de la imagen
 *
 * @param {Object} props - Props del componente
 * @param {string} props.status - Estado de la ambulancia
 * @param {boolean} props.gpsActive - Estado del GPS
 * @param {string} props.ambulanceId - ID de la ambulancia
 * @param {Function} props.onSimulateAlert - Función para simular alerta
 * @returns {JSX.Element} Tarjeta de estado actual
 */
const AmbulanceStatusCard = ({ 
  status = 'DISPONIBLE', 
  gpsActive = true, 
  ambulanceId = 'AMB-001',
  onSimulateAlert 
}) => {
  return (
    <div className="bg-white rounded-lg shadow p-6">
      <h2 className="text-lg font-semibold text-gray-900 mb-4">Estado Actual</h2>
      
      <div className="space-y-4">
        <div className="flex justify-between items-center">
          <span className="text-gray-600">Estado:</span>
          <span className={`px-3 py-1 text-sm font-medium rounded-full ${
            status === 'DISPONIBLE' 
              ? 'bg-green-100 text-green-800' 
              : status === 'OCUPADO'
              ? 'bg-yellow-100 text-yellow-800'
              : 'bg-red-100 text-red-800'
          }`}>
            {status}
          </span>
        </div>

        <div className="flex justify-between items-center">
          <span className="text-gray-600">GPS:</span>
          <span className={`px-3 py-1 text-sm font-medium rounded-full ${
            gpsActive 
              ? 'bg-green-100 text-green-800' 
              : 'bg-red-100 text-red-800'
          }`}>
            {gpsActive ? 'ACTIVO' : 'INACTIVO'}
          </span>
        </div>

        <div className="flex justify-between items-center">
          <span className="text-gray-600">Ambulancia:</span>
          <span className="text-gray-900 font-medium">{ambulanceId}</span>
        </div>

        <button
          onClick={onSimulateAlert}
          className="w-full mt-4 bg-orange-600 hover:bg-orange-700 text-white py-3 px-4 rounded-lg font-medium transition-colors flex items-center justify-center"
        >
          <i className="fas fa-exclamation-triangle mr-2"></i>
          Simular Alerta de Emergencia
        </button>
      </div>
    </div>
  )
}

export default AmbulanceStatusCard