import React from 'react'

/**
 * Resumen de uso de servicios
 * Siguiendo Regla #3: Componente específico <200 líneas
 * Siguiendo Regla #2: Solo presentación
 *
 * @param {Object} props - Props del componente
 * @param {Object} props.serviceBreakdown - Desglose de servicios utilizados
 * @returns {JSX.Element} Resumen de uso de servicios
 */
const ServiceUsageOverview = ({ serviceBreakdown }) => {
  if (!serviceBreakdown || Object.keys(serviceBreakdown).length === 0) {
    return (
      <div className="bg-white rounded-xl shadow-medium p-4 sm:p-6">
        <h2 className="text-lg sm:text-xl font-bold text-gray-800 mb-3 sm:mb-4 font-exo">
          Uso de Servicios
        </h2>
        <div className="text-center py-8">
          <i className="fas fa-chart-bar text-4xl text-gray-300 mb-4"></i>
          <p className="text-gray-500 font-roboto">No has utilizado servicios aún</p>
        </div>
      </div>
    )
  }

  return (
    <div className="bg-white rounded-xl shadow-medium p-4 sm:p-6">
      <h2 className="text-lg sm:text-xl font-bold text-gray-800 mb-3 sm:mb-4 font-exo">
        Uso de Servicios
      </h2>

      <div className="grid grid-cols-2 gap-2 sm:gap-4">
        {Object.entries(serviceBreakdown).map(([serviceType, count]) => (
          <div key={serviceType} className="bg-gray-50 rounded-lg p-3 sm:p-4 text-center">
            <div className="text-xl sm:text-2xl font-bold text-teal-600 font-exo">{count}</div>
            <div className="text-xs sm:text-sm text-gray-600 capitalize font-roboto">
              {serviceType.toLowerCase().replace('_', ' ')}
            </div>
          </div>
        ))}
      </div>
    </div>
  )
}

export default ServiceUsageOverview
