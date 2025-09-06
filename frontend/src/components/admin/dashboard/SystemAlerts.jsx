import React from 'react'
import { LABELS } from '../../../config/labels'

/**
 * Componente de Alertas del Sistema
 * Muestra notificaciones importantes y alertas del sistema
 * Extraído del AdminDashboard monolítico durante refactorización
 */
const SystemAlerts = ({ alerts = [] }) => {
  const labels = LABELS.admin.dashboard.systemAlerts
  
  // TODO: Conectar con sistema de notificaciones real
  const mockAlerts = labels.mockAlerts

  // Usar alertas pasadas como props o las mock si no hay
  const displayAlerts = alerts.length > 0 ? alerts : mockAlerts

  return (
    <div className="bg-white rounded-xl shadow-medium p-4 sm:p-6">
      <h3 className="text-base sm:text-lg font-bold text-gray-800 mb-3 sm:mb-4">
        {labels.title}
      </h3>
      
      <div className="space-y-3">
        {displayAlerts.map((alert) => (
          <div 
            key={alert.id} 
            className={`border-l-4 p-3 sm:p-4 rounded-r-lg ${
              alert.type === labels.alertTypes.warning 
                ? `${labels.colors.warning.border} ${labels.colors.warning.background}` 
                : `${labels.colors.info.border} ${labels.colors.info.background}`
            }`}
          >
            <div className="flex flex-col sm:flex-row sm:justify-between sm:items-start space-y-1 sm:space-y-0">
              <div className="flex-1 min-w-0">
                <h4 className="font-medium text-gray-800 text-sm sm:text-base">
                  {alert.title}
                </h4>
                <p className="text-xs sm:text-sm text-gray-600 mt-1 leading-tight">
                  {alert.message}
                </p>
              </div>
              <span className="text-xs text-gray-500 whitespace-nowrap sm:ml-3">
                {alert.time}
              </span>
            </div>
          </div>
        ))}
      </div>
    </div>
  )
}

export default SystemAlerts