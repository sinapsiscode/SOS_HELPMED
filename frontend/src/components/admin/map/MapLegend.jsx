import React from 'react'

/**
 * Componente de leyenda del mapa
 * ENFOQUE BALANCEADO: Solo presentación y clases estáticas
 */
const MapLegend = () => {
  return (
    <div className="bg-white rounded-lg shadow-medium p-4">
      <h3 className="font-exo font-semibold text-gray-800 mb-4 flex items-center">
        <i className="fas fa-map-marker-alt mr-2"></i>
        Leyenda del Mapa
      </h3>

      <div className="space-y-3">
        <div>
          <h4 className="font-exo font-medium text-gray-700 mb-2">Emergencias Pendientes</h4>
          <div className="space-y-2">
            <div className="flex items-center space-x-2">
              <div className="w-4 h-4 bg-red-600 rounded-full flex items-center justify-center">
                <i className="fas fa-exclamation-triangle text-white text-xs"></i>
              </div>
              <span className="text-sm">Alta Prioridad</span>
            </div>
            <div className="flex items-center space-x-2">
              <div className="w-4 h-4 bg-amber-500 rounded-full flex items-center justify-center">
                <i className="fas fa-exclamation-circle text-white text-xs"></i>
              </div>
              <span className="text-sm">Media Prioridad</span>
            </div>
            <div className="flex items-center space-x-2">
              <div className="w-4 h-4 bg-emerald-600 rounded-full flex items-center justify-center">
                <i className="fas fa-user-md text-white text-xs"></i>
              </div>
              <span className="text-sm">Baja Prioridad</span>
            </div>
          </div>
        </div>

        <div>
          <h4 className="font-exo font-medium text-gray-700 mb-2">Unidades Médicas</h4>
          <div className="space-y-2">
            <div className="flex items-center space-x-2">
              <div className="w-4 h-4 bg-emerald-500 rounded-full flex items-center justify-center">
                <i className="fas fa-ambulance text-white text-xs"></i>
              </div>
              <span className="text-sm">Disponible</span>
            </div>
            <div className="flex items-center space-x-2">
              <div className="w-4 h-4 bg-blue-500 rounded-full flex items-center justify-center">
                <i className="fas fa-ambulance text-white text-xs"></i>
              </div>
              <span className="text-sm">En Camino</span>
            </div>
            <div className="flex items-center space-x-2">
              <div className="w-4 h-4 bg-violet-500 rounded-full flex items-center justify-center">
                <i className="fas fa-ambulance text-white text-xs"></i>
              </div>
              <span className="text-sm">En Sitio</span>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}

export default MapLegend
