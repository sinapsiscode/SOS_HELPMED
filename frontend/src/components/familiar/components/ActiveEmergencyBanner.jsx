import React from 'react'

/**
 * Componente Banner de emergencia activa
 *  Separado del componente principal
 *  Props claramente definidos
 *  Responsabilidad única: Emergency status display
 */
const ActiveEmergencyBanner = ({ emergency, status }) => {
  return (
    <div className="bg-red-500 text-white py-3 sm:py-4">
      <div className="px-3 sm:px-4">
        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between space-y-2 sm:space-y-0">
          <div className="flex items-center space-x-2 sm:space-x-3 flex-1 min-w-0">
            <div className="w-6 h-6 sm:w-8 sm:h-8 bg-white bg-opacity-20 rounded-full flex items-center justify-center animate-pulse flex-shrink-0">
              <i className="fas fa-ambulance text-sm sm:text-base"></i>
            </div>
            <div className="min-w-0 flex-1">
              <span className="font-medium text-sm sm:text-base block truncate">
                Emergencia Activa - {status}
              </span>
              <p className="text-red-100 text-xs sm:text-sm truncate">{emergency.description}</p>
            </div>
          </div>
          <button className="bg-white bg-opacity-20 hover:bg-opacity-30 px-3 py-2 rounded text-xs sm:text-sm transition-colors flex-shrink-0 w-full sm:w-auto text-center">
            <i className="fas fa-eye mr-1 sm:mr-2"></i>
            <span className="hidden sm:inline">Ver Detalles</span>
            <span className="sm:hidden">Detalles</span>
          </button>
        </div>
      </div>
    </div>
  )
}

export default ActiveEmergencyBanner