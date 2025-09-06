import React from 'react'
import { LABELS } from '../../../config/labels'

/**
 * Tab de configuración del sistema
 * Placeholder para configuraciones avanzadas del administrador
 */
const SettingsTab = () => {
  const labels = LABELS.admin.dashboard.settingsTab
  
  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <h2 className="text-2xl font-bold text-gray-900">{labels.title}</h2>
      </div>

      <div className="bg-white rounded-lg shadow p-8 text-center">
        <div className="text-6xl mb-4">{labels.placeholder.icon}</div>
        <h3 className="text-lg font-medium text-gray-900 mb-2">{labels.placeholder.title}</h3>
        <p className="text-gray-600">
          {labels.placeholder.description}
        </p>
      </div>
    </div>
  )
}

export default SettingsTab
