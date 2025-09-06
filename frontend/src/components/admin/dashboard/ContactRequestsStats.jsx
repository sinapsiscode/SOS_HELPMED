import React from 'react'
import { LABELS } from '../../../config/labels'

/**
 * Componente de estadísticas de solicitudes de contacto
 * Muestra cards con contadores por tipo de urgencia
 * Extraído del ContactRequestsTab monolítico
 */
const ContactRequestsStats = ({ requests }) => {
  const labels = LABELS.admin.dashboard.contactRequestsStats
  
  const stats = {
    critical: requests.filter(r => r.urgency === labels.urgencyValues.critical).length,
    high: requests.filter(r => r.urgency === labels.urgencyValues.high).length,
    medium: requests.filter(r => r.urgency === labels.urgencyValues.medium).length,
    total: requests.length
  }

  return (
    <div className="grid grid-cols-2 sm:grid-cols-2 md:grid-cols-4 gap-3 sm:gap-4">
      <div className="bg-red-50 border border-red-200 rounded-lg p-3 sm:p-4 text-center">
        <div className="text-xl sm:text-2xl font-bold text-red-600">
          {stats.critical}
        </div>
        <div className="text-xs sm:text-sm text-red-700">{labels.cards.critical}</div>
      </div>
      
      <div className="bg-orange-50 border border-orange-200 rounded-lg p-3 sm:p-4 text-center">
        <div className="text-xl sm:text-2xl font-bold text-orange-600">
          {stats.high}
        </div>
        <div className="text-xs sm:text-sm text-orange-700">{labels.cards.highPriority}</div>
      </div>
      
      <div className="bg-yellow-50 border border-yellow-200 rounded-lg p-3 sm:p-4 text-center">
        <div className="text-xl sm:text-2xl font-bold text-yellow-600">
          {stats.medium}
        </div>
        <div className="text-xs sm:text-sm text-yellow-700">{labels.cards.mediumPriority}</div>
      </div>
      
      <div className="bg-blue-50 border border-blue-200 rounded-lg p-3 sm:p-4 text-center">
        <div className="text-xl sm:text-2xl font-bold text-blue-600">
          {stats.total}
        </div>
        <div className="text-xs sm:text-sm text-blue-700">
          {labels.cards.total}<span className="hidden sm:inline"> {labels.cards.requests}</span>
        </div>
      </div>
    </div>
  )
}

export default ContactRequestsStats