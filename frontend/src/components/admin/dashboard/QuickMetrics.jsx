import React, { useState, useEffect } from 'react'
import { LABELS } from '../../../config/labels'

/**
 * Componente de Métricas Clave del Dashboard
 * Muestra métricas importantes del sistema en tiempo real
 * Conectado con datos reales desde db.json
 */
const QuickMetrics = () => {
  const labels = LABELS.admin.dashboard.quickMetrics
  const [dashboardData, setDashboardData] = useState(null)
  
  useEffect(() => {
    // Fetch datos usando el proxy configurado (/api -> http://localhost:4001)
    fetch('/api/dashboard')
      .then(res => res.json())
      .then(data => setDashboardData(data))
      .catch(err => console.error('Error fetching dashboard data:', err))
  }, [])

  // Construir métricas con datos reales
  const metrics = dashboardData ? [
    {
      label: labels.labels?.responseTime || 'Tiempo respuesta promedio',
      value: dashboardData.averageResponseTime || 'N/A',
      color: 'green'
    },
    {
      label: labels.labels?.satisfaction || 'Satisfacción del cliente',
      value: dashboardData.satisfactionRate ? `${dashboardData.satisfactionRate}%` : 'N/A',
      color: 'blue'
    },
    {
      label: labels.labels?.utilization || 'Utilización de unidades',
      value: dashboardData.totalAmbulances ? 
        `${Math.round((dashboardData.totalAmbulances - dashboardData.availableAmbulances) / dashboardData.totalAmbulances * 100)}%` : 'N/A',
      color: 'purple'
    },
    {
      label: labels.labels?.completedToday || 'Emergencias activas',
      value: dashboardData.activeEmergencies?.toString() || '0',
      color: 'yellow'
    }
  ] : []

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