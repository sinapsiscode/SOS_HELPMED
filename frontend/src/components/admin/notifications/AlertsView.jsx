import React from 'react'
import { MUTE_BUTTONS, NOTIFICATION_MODES } from '../../../mocks/notificationData'
import { LABELS } from '../../../config/labels'

/**
 * ${LABELS.admin.notifications.alertsView.comments.title}
 * ${LABELS.admin.notifications.alertsView.comments.approach}
 *
 * @param {Array} filteredNotifications - Lista filtrada de notificaciones
 * @param {Object} mutedAlerts - Estado de silenciado de alertas
 * @param {Object} notificationConfig - Configuración de notificaciones
 * @param {Function} onToggleMute - Función para silenciar/activar alertas
 * @param {Function} onAlertClick - Función para manejar clic en alerta
 * @param {Function} onRemoveNotification - Función para remover notificación
 * @returns {JSX.Element} Vista de alertas con controles de silencio
 */
const AlertsView = ({
  filteredNotifications,
  mutedAlerts,
  notificationConfig,
  onToggleMute,
  onAlertClick,
  onRemoveNotification
}) => {
  const labels = LABELS.admin.notifications.alertsView

  // ============================================
  // VALIDACIÓN DE PROPS (Regla #4)
  // ============================================
  if (!Array.isArray(filteredNotifications)) {
    console.error(labels.errors.filteredNotificationsArray)
    return null
  }

  if (!mutedAlerts || typeof mutedAlerts !== 'object') {
    console.error(labels.errors.mutedAlertsObject)
    return null
  }

  if (!notificationConfig || typeof notificationConfig !== 'object') {
    console.error(labels.errors.notificationConfigObject)
    return null
  }

  if (typeof onToggleMute !== 'function') {
    console.error(labels.errors.onToggleMuteFunction)
    return null
  }

  if (typeof onAlertClick !== 'function') {
    console.error(labels.errors.onAlertClickFunction)
    return null
  }

  if (typeof onRemoveNotification !== 'function') {
    console.error(labels.errors.onRemoveNotificationFunction)
    return null
  }

  // ============================================
  // FUNCIONES UTILITARIAS
  // ============================================
  const getNotificationStyles = (type) => {
    switch (type) {
      case 'critical':
        return 'border-red-300 bg-red-50'
      case 'warning':
        return 'border-orange-300 bg-orange-50'
      case 'info':
        return 'border-blue-300 bg-blue-50'
      case 'success':
        return 'border-green-300 bg-green-50'
      default:
        return 'border-gray-200 bg-white'
    }
  }

  const getIconColor = (type) => {
    switch (type) {
      case 'critical':
        return 'text-red-600'
      case 'warning':
        return 'text-orange-600'
      case 'info':
        return 'text-blue-600'
      default:
        return 'text-gray-600'
    }
  }

  const getCurrentModeConfig = () => {
    return NOTIFICATION_MODES.find((mode) => mode.value === notificationConfig.notificationMode)
  }

  return (
    <>
      {/* Controles de silencio rápido - Responsive */}
      <div className="bg-white rounded-xl shadow-medium p-3 sm:p-4">
        <div className="grid grid-cols-2 sm:flex sm:flex-wrap gap-1 sm:gap-2">
          {MUTE_BUTTONS.map((button) => (
            <button
              key={button.id}
              onClick={() => onToggleMute(button.id)}
              className={`px-2 sm:px-3 py-1 rounded-lg text-xs transition-colors ${
                mutedAlerts[button.id] ? button.colors.muted : button.colors.active
              }`}
            >
              <i className={`${button.icon} mr-1`}></i>
              <span className="hidden sm:inline">
                {button.label} {mutedAlerts[button.id] ? labels.muteButtons.muted : ''}
              </span>
              <span className="sm:hidden">{button.labelShort}</span>
            </button>
          ))}

          <div className="col-span-2 sm:col-span-1 sm:ml-auto">
            <span
              className={`px-2 sm:px-3 py-1 rounded-lg text-xs font-medium ${getCurrentModeConfig()?.color}`}
            >
              <span className="hidden sm:inline">{labels.muteButtons.mode}</span>
              {getCurrentModeConfig()?.title}
            </span>
          </div>
        </div>
      </div>

      {/* Lista de alertas y notificaciones - Responsive */}
      <div className="bg-white rounded-xl shadow-medium p-4 sm:p-6">
        <h2 className="text-base sm:text-lg font-semibold text-gray-800 mb-4">
          {labels.title}
        </h2>

        {filteredNotifications.length > 0 ? (
          <div className="space-y-3 max-h-96 overflow-y-auto">
            {filteredNotifications.map((item, index) => (
              <div
                key={item.id || index}
                onClick={() => item.isAlert && onAlertClick(item)}
                className={`border rounded-lg p-3 sm:p-4 transition-all max-w-full ${
                  item.isAlert ? 'cursor-pointer hover:shadow-md' : ''
                } ${getNotificationStyles(item.type)}`}
              >
                <div className="flex items-start justify-between">
                  <div className="flex items-start space-x-2 sm:space-x-3 flex-1 min-w-0">
                    {item.icon && (
                      <i
                        className={`${item.icon} mt-1 flex-shrink-0 ${getIconColor(item.type)}`}
                      ></i>
                    )}
                    <div className="flex-1 min-w-0">
                      <p className="font-medium text-gray-800 text-sm sm:text-base truncate">
                        {item.title}
                      </p>
                      {item.subtitle && (
                        <p className="text-xs sm:text-sm text-gray-600 mt-1">{item.subtitle}</p>
                      )}
                      {item.message && (
                        <p className="text-xs sm:text-sm text-gray-600 mt-1">{item.message}</p>
                      )}
                      {item.timestamp && (
                        <p className="text-xs text-gray-500 mt-1 sm:mt-2">
                          {new Date(item.timestamp).toLocaleTimeString()}
                        </p>
                      )}
                    </div>
                  </div>
                  {!item.isAlert && item.id && (
                    <button
                      onClick={(e) => {
                        e.stopPropagation()
                        onRemoveNotification(item.id)
                      }}
                      className="text-gray-400 hover:text-red-600 ml-2 flex-shrink-0 p-1"
                    >
                      <i className="fas fa-times text-sm"></i>
                    </button>
                  )}
                </div>
              </div>
            ))}
          </div>
        ) : (
          <div className="text-center py-12 text-gray-500">
            <i className="fas fa-check-circle text-5xl text-green-400 mb-4"></i>
            <p className="text-lg">{labels.emptyState.title}</p>
            <p className="text-sm mt-2">{labels.emptyState.subtitle}</p>
          </div>
        )}
      </div>
    </>
  )
}

export default AlertsView
