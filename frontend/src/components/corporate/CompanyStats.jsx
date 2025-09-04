import React from 'react'

/**
 * Estadísticas de empresa corporativa
 * Siguiendo Regla #3: Componente específico <200 líneas
 * Siguiendo Regla #2: Solo presentación
 *
 * @param {Object} props - Props del componente
 * @param {Object} props.stats - Estadísticas de la empresa
 * @returns {JSX.Element} Estadísticas de empresa
 */
const CompanyStats = ({ stats }) => {
  if (!stats) return null

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-4 gap-4 mb-6">
      {/* Servicios Usados */}
      <div className="bg-white rounded-xl shadow-medium p-4">
        <div className="flex items-center">
          <div className="p-3 bg-blue-100 rounded-lg">
            <i className="fas fa-heartbeat text-blue-600 text-xl"></i>
          </div>
          <div className="ml-4">
            <p className="text-sm font-medium text-gray-500 font-roboto">Servicios Usados</p>
            <p className="text-2xl font-bold text-gray-900 font-exo">{stats.usedServices}</p>
          </div>
        </div>
      </div>

      {/* Servicios Restantes */}
      <div className="bg-white rounded-xl shadow-medium p-4">
        <div className="flex items-center">
          <div className="p-3 bg-green-100 rounded-lg">
            <i className="fas fa-check-circle text-green-600 text-xl"></i>
          </div>
          <div className="ml-4">
            <p className="text-sm font-medium text-gray-500 font-roboto">Disponibles</p>
            <p className="text-2xl font-bold text-gray-900 font-exo">{stats.remainingServices}</p>
          </div>
        </div>
      </div>

      {/* Ubicaciones */}
      <div className="bg-white rounded-xl shadow-medium p-4">
        <div className="flex items-center">
          <div className="p-3 bg-purple-100 rounded-lg">
            <i className="fas fa-map-marker-alt text-purple-600 text-xl"></i>
          </div>
          <div className="ml-4">
            <p className="text-sm font-medium text-gray-500 font-roboto">Ubicaciones</p>
            <p className="text-2xl font-bold text-gray-900 font-exo">{stats.locationsCount}</p>
          </div>
        </div>
      </div>

      {/* Porcentaje de Uso */}
      <div className="bg-white rounded-xl shadow-medium p-4">
        <div className="flex items-center">
          <div className="p-3 bg-orange-100 rounded-lg">
            <i className="fas fa-chart-pie text-orange-600 text-xl"></i>
          </div>
          <div className="ml-4">
            <p className="text-sm font-medium text-gray-500 font-roboto">% de Uso</p>
            <p className="text-2xl font-bold text-gray-900 font-exo">{stats.usagePercentage}%</p>
          </div>
        </div>
      </div>


    </div>
  )
}

export default CompanyStats
