import React from 'react'
import { LABELS } from '../../../config/labels'

/**
 * Componente de Métricas Clave del Dashboard
 * Muestra métricas importantes del sistema en tiempo real
 * Extraído del AdminDashboard monolítico durante refactorización
 */
const QuickMetrics = () => {
  const labels = LABELS.admin.dashboard.quickMetrics
  
  // TODO: Conectar con datos reales del backend/store
  const metrics = labels.metrics

  return (
    <div className="bg-white rounded-xl shadow-medium p-4 sm:p-6">
      <h3 className="text-base sm:text-lg font-bold text-gray-800 mb-3 sm:mb-4">
        {labels.title}
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