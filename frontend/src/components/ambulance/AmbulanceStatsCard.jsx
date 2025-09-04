import React from 'react'

/**
 * Componente para mostrar estadísticas de ambulancia
 * Siguiendo Regla #3: Componente específico <100 líneas
 * Siguiendo Regla #2: Solo presentación
 *
 * @param {Object} props - Props del componente
 * @param {Object} props.stats - Estadísticas de la ambulancia
 * @param {boolean} props.isTracking - Estado de seguimiento
 * @returns {JSX.Element} Tarjeta de estadísticas
 */
const AmbulanceStatsCard = ({ stats, isTracking }) => {
  const statsData = [
    {
      title: 'Servicios Totales',
      value: stats.totalServices || 0,
      icon: 'fas fa-ambulance',
      color: 'text-blue-600',
      bgColor: 'bg-blue-50'
    },
    {
      title: 'Emergencias Activas',
      value: stats.activeEmergencies || 0,
      icon: 'fas fa-exclamation-triangle',
      color: 'text-red-600',
      bgColor: 'bg-red-50'
    },
    {
      title: 'Completados Hoy',
      value: stats.completedToday || 0,
      icon: 'fas fa-check-circle',
      color: 'text-green-600',
      bgColor: 'bg-green-50'
    },
    {
      title: 'Tiempo Promedio',
      value: stats.averageResponseTime || '--',
      icon: 'fas fa-stopwatch',
      color: 'text-purple-600',
      bgColor: 'bg-purple-50'
    }
  ]

  return (
    <div className="bg-white rounded-xl shadow-medium p-6">
      {/* Header */}
      <div className="flex items-center justify-between mb-6">
        <div>
          <h2 className="text-xl font-bold text-gray-800 font-exo">
            <i className="fas fa-chart-line text-helpmed-blue mr-3"></i>
            Dashboard Ambulancia
          </h2>
          <p className="text-gray-600 font-roboto mt-1">Estadísticas en tiempo real</p>
        </div>

        {/* Indicador de seguimiento */}
        <div
          className={`flex items-center px-3 py-1 rounded-full text-sm font-medium ${
            isTracking ? 'bg-green-100 text-green-700' : 'bg-gray-100 text-gray-700'
          }`}
        >
          <div
            className={`w-2 h-2 rounded-full mr-2 ${isTracking ? 'bg-green-500' : 'bg-gray-400'}`}
          ></div>
          {isTracking ? 'Rastreando' : 'Sin rastreo'}
        </div>
      </div>

      {/* Grid de estadísticas */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
        {statsData.map((stat, index) => (
          <div key={index} className={`${stat.bgColor} rounded-lg p-4 border border-opacity-20`}>
            <div className="flex items-center justify-between">
              <div>
                <p className="text-2xl font-bold text-gray-800 font-exo">{stat.value}</p>
                <p className="text-xs text-gray-600 font-roboto mt-1">{stat.title}</p>
              </div>
              <div className={`p-2 rounded-lg bg-white bg-opacity-50`}>
                <i className={`${stat.icon} ${stat.color} text-lg`}></i>
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  )
}

export default AmbulanceStatsCard
