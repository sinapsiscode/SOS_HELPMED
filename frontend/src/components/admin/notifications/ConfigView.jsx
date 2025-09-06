import React from 'react'
import {
  NOTIFICATION_MODES,
  ALERT_SETTINGS,
  CONFIG_VALIDATION
} from '../../../mocks/notificationData'
import { LABELS } from '../../../config/labels'

/**
 * ${LABELS.admin.notifications.configView.comments.title}
 * ${LABELS.admin.notifications.configView.comments.approach}
 *
 * @param {Object} notificationConfig - Configuración actual de notificaciones
 * @param {Function} onUpdateConfig - Función para actualizar configuración
 * @param {Function} onSaveConfig - Función para guardar configuración
 * @param {Function} onResetConfig - Función para restablecer configuración
 * @param {boolean} isLoading - Estado de carga
 * @returns {JSX.Element} Formulario de configuración
 */
const ConfigView = ({
  notificationConfig,
  onUpdateConfig,
  onSaveConfig,
  onResetConfig,
  isLoading
}) => {
  const labels = LABELS.admin.notifications.configView

  // ============================================
  // VALIDACIÓN DE PROPS (Regla #4)
  // ============================================
  if (!notificationConfig || typeof notificationConfig !== 'object') {
    console.error(labels.errors.notificationConfigObject)
    return null
  }

  if (typeof onUpdateConfig !== 'function') {
    console.error(labels.errors.onUpdateConfigFunction)
    return null
  }

  if (typeof onSaveConfig !== 'function') {
    console.error(labels.errors.onSaveConfigFunction)
    return null
  }

  if (typeof onResetConfig !== 'function') {
    console.error(labels.errors.onResetConfigFunction)
    return null
  }

  if (typeof isLoading !== 'boolean') {
    console.error(labels.errors.isLoadingBoolean)
    return null
  }

  return (
    <div className="bg-white rounded-xl shadow-medium p-4 sm:p-6">
      <div className="space-y-4 sm:space-y-6">
        {/* Nota informativa */}
        <div className="bg-blue-50 border border-blue-200 rounded-lg p-4">
          <div className="flex items-start">
            <i className="fas fa-info-circle text-blue-600 mt-1 mr-3"></i>
            <div>
              <p className="text-sm text-blue-800 font-medium">{labels.info.title}</p>
              <p className="text-xs text-blue-700 mt-1">
                {labels.info.description}
                <span className="font-semibold">{labels.info.section}</span>
              </p>
            </div>
          </div>
        </div>

        {/* Comportamiento de Popups - Responsive */}
        <div>
          <h3 className="text-base sm:text-lg font-semibold text-gray-800 mb-3 sm:mb-4">
            {labels.popupBehavior.title}
          </h3>
          <div className="space-y-3">
            <label className="flex items-start sm:items-center justify-between gap-2">
              <span className="text-xs sm:text-sm text-gray-700 flex-1">
                {labels.popupBehavior.autoShow}
              </span>
              <input
                type="checkbox"
                checked={notificationConfig.autoShowEmergencies}
                onChange={(e) => onUpdateConfig('autoShowEmergencies', e.target.checked)}
                disabled={isLoading}
                className="h-4 w-4 text-blue-600 rounded flex-shrink-0 disabled:opacity-50"
              />
            </label>

            <div className="flex items-center justify-between gap-2">
              <span className="text-xs sm:text-sm text-gray-700 flex-1">
                {labels.popupBehavior.duration}
              </span>
              <input
                type="number"
                min={CONFIG_VALIDATION.emergencyPopupDuration.min}
                max={CONFIG_VALIDATION.emergencyPopupDuration.max}
                value={notificationConfig.emergencyPopupDuration}
                onChange={(e) => onUpdateConfig('emergencyPopupDuration', parseInt(e.target.value))}
                disabled={!notificationConfig.autoShowEmergencies || isLoading}
                className="w-16 sm:w-20 border border-gray-300 rounded-lg px-2 sm:px-3 py-2 text-sm disabled:opacity-50 disabled:bg-gray-100"
              />
            </div>

            <label className="flex items-center justify-between">
              <span className="text-sm text-gray-700">
                {labels.popupBehavior.sosNeverClose}
              </span>
              <input
                type="checkbox"
                checked={notificationConfig.sosNeverAutoClose}
                onChange={(e) => onUpdateConfig('sosNeverAutoClose', e.target.checked)}
                disabled={isLoading}
                className="h-4 w-4 text-blue-600 rounded disabled:opacity-50"
              />
            </label>

            <label className="flex items-center justify-between">
              <span className="text-sm text-gray-700">{labels.popupBehavior.playSound}</span>
              <input
                type="checkbox"
                checked={notificationConfig.playSound}
                onChange={(e) => onUpdateConfig('playSound', e.target.checked)}
                disabled={isLoading}
                className="h-4 w-4 text-blue-600 rounded disabled:opacity-50"
              />
            </label>
          </div>
        </div>

        {/* Tipos de Alertas */}
        <div>
          <h3 className="text-lg font-semibold text-gray-800 mb-4">{labels.alertTypes.title}</h3>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
            {ALERT_SETTINGS.map((setting) => (
              <label key={setting.key} className="flex items-center justify-between">
                <span className="text-sm text-gray-700">{setting.label}</span>
                <input
                  type="checkbox"
                  checked={notificationConfig[setting.key]}
                  onChange={(e) => onUpdateConfig(setting.key, e.target.checked)}
                  disabled={isLoading}
                  className="h-4 w-4 text-blue-600 rounded disabled:opacity-50"
                />
              </label>
            ))}
          </div>
        </div>

        {/* Modo de Notificación */}
        <div>
          <h3 className="text-lg font-semibold text-gray-800 mb-4">{labels.notificationMode.title}</h3>
          <div className="space-y-2">
            {NOTIFICATION_MODES.map((mode) => (
              <label
                key={mode.value}
                className="flex items-center space-x-3 p-3 border rounded-lg cursor-pointer hover:bg-gray-50 disabled:opacity-50"
              >
                <input
                  type="radio"
                  name="notificationMode"
                  value={mode.value}
                  checked={notificationConfig.notificationMode === mode.value}
                  onChange={(e) => onUpdateConfig('notificationMode', e.target.value)}
                  disabled={isLoading}
                  className="text-blue-600 disabled:opacity-50"
                />
                <div>
                  <p className="font-medium text-gray-700">{mode.title}</p>
                  <p className="text-xs text-gray-500">{mode.description}</p>
                </div>
              </label>
            ))}
          </div>
        </div>

        {/* Botones de acción */}
        <div className="flex justify-between pt-4 border-t">
          <button
            onClick={onResetConfig}
            disabled={isLoading}
            className="px-4 py-2 text-gray-600 hover:text-gray-800 transition-colors disabled:opacity-50"
          >
            <i className="fas fa-undo mr-2"></i>
            {labels.buttons.reset}
          </button>
          <button
            onClick={onSaveConfig}
            disabled={isLoading}
            className="px-6 py-2 bg-green-600 hover:bg-green-700 text-white rounded-lg transition-colors disabled:opacity-50 flex items-center space-x-2"
          >
            {isLoading ? (
              <>
                <i className="fas fa-spinner fa-spin"></i>
                <span>{labels.buttons.saving}</span>
              </>
            ) : (
              <>
                <i className="fas fa-save"></i>
                <span>{labels.buttons.save}</span>
              </>
            )}
          </button>
        </div>
      </div>
    </div>
  )
}

export default ConfigView
