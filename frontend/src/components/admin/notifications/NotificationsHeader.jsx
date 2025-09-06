import React from 'react'
import { NOTIFICATION_TABS } from '../../../mocks/notificationData'
import { LABELS } from '../../../config/labels'

/**
 * ${LABELS.admin.notifications.notificationsHeader.comments.title}
 * ${LABELS.admin.notifications.notificationsHeader.comments.approach}
 *
 * @param {string} activeTab - Tab actualmente activa ('alerts' | 'config')
 * @param {Array} activeAlerts - Lista de alertas activas
 * @param {Function} onTabChange - Función para cambiar de tab
 * @returns {JSX.Element} Header con tabs y contador de alertas
 */
const NotificationsHeader = ({ activeTab, activeAlerts, onTabChange }) => {
  const labels = LABELS.admin.notifications.notificationsHeader

  // ============================================
  // VALIDACIÓN DE PROPS (Regla #4)
  // ============================================
  if (typeof activeTab !== 'string') {
    console.error(labels.errors.activeTabString)
    return null
  }

  if (!Array.isArray(activeAlerts)) {
    console.error(labels.errors.activeAlertsArray)
    return null
  }

  if (typeof onTabChange !== 'function') {
    console.error(labels.errors.onTabChangeFunction)
    return null
  }

  return (
    <div className="bg-white rounded-xl shadow-medium p-4 sm:p-6">
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between mb-4 space-y-2 sm:space-y-0">
        <h1 className="text-xl sm:text-2xl font-bold text-gray-800">{labels.title}</h1>
        <div className="flex items-center space-x-2 sm:space-x-4">
          {activeAlerts.length > 0 && (
            <span className="bg-red-100 text-red-700 px-2 sm:px-3 py-1 rounded-full text-xs sm:text-sm font-medium animate-pulse">
              {labels.activeAlerts.replace('{count}', activeAlerts.length)}
            </span>
          )}
        </div>
      </div>

      {/* Tabs de navegación - Responsive */}
      <div className="flex space-x-1 sm:space-x-2 border-b border-gray-200">
        {NOTIFICATION_TABS.map((tab) => (
          <button
            key={tab.id}
            onClick={() => onTabChange(tab.id)}
            className={`px-2 sm:px-4 py-2 font-medium text-xs sm:text-sm transition-colors border-b-2 ${
              activeTab === tab.id
                ? 'text-blue-600 border-blue-600'
                : 'text-gray-600 border-transparent hover:text-gray-800'
            }`}
          >
            <i className={`${tab.icon} mr-1 sm:mr-2`}></i>
            <span className="hidden sm:inline">{tab.label}</span>
            <span className="sm:hidden">{tab.labelShort}</span>
          </button>
        ))}
      </div>
    </div>
  )
}

export default NotificationsHeader
