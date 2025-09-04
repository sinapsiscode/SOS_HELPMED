import React from 'react'

/**
 * Componente de Métricas Clave del Dashboard
 * Muestra métricas importantes del sistema en tiempo real
 * Extraído del AdminDashboard monolítico durante refactorización
 */
const QuickMetrics = () => {
  // TODO: Conectar con datos reales del backend/store
  const metrics = [
    { label: 'Tiempo respuesta promedio', value: '8.3 min', color: 'green' },
    { label: 'Satisfacción del cliente', value: '94%', color: 'blue' },
    { label: 'Utilización de unidades', value: '78%', color: 'purple' },
    { label: 'Servicios completados hoy', value: '127', color: 'orange' }
  ]

  return (
    <div className="bg-white rounded-xl shadow-medium p-4 sm:p-6">
      <h3 className="text-base sm:text-lg font-bold text-gray-800 mb-3 sm:mb-4">
        Métricas Clave
      </h3>
      
      <div className="space-y-3 sm:space-y-4">
        {metrics.map((metric, index) => (
          <div key={index} className="flex justify-between items-center py-2">
            <span className="text-gray-600 text-sm sm:text-base leading-tight">
              {metric.label}:
            </span>
            <span className={`font-bold text-${metric.color}-600 text-sm sm:text-base`}>
              {metric.value}
            </span>
          </div>
        ))}
      </div>
    </div>
  )
}

export default QuickMetrics