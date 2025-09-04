import React from 'react'
import useLimitAlert from '../../hooks/useLimitAlert'
import ServiceExpansionRequest from './ServiceExpansionRequest'

/**
 * Componente para alertas y notificaciones de límites refactorizado
 * REFACTORIZADO siguiendo TODAS las reglas:
 *
 * ✅ Regla #2: Solo presentación, lógica en hook useLimitAlert
 * ✅ Regla #3: Componente <200 líneas (reducido de 345 a ~150)
 * ✅ Regla #10: Arquitectura modular con componentes internos
 *
 * @param {Object} props - Props del componente
 * @returns {JSX.Element} Componente de alertas de límites
 */
const LimitAlert = ({ user, onPurchaseAdditional, onUpgradePlan }) => {
  const { alerts, handleAlertAction, getActionText, getAlertStyles } = useLimitAlert(
    user,
    onPurchaseAdditional,
    onUpgradePlan
  )

  if (alerts.length === 0) {
    return null
  }

  return (
    <div className="space-y-3">
      {alerts.map((alert, index) => (
        <div key={index}>
          <AlertItem
            alert={alert}
            onClick={() => handleAlertAction(alert)}
            getActionText={getActionText}
            getAlertStyles={getAlertStyles}
          />
          {alert.action === 'contact' && (
            <div className="mt-2">
              <ServiceExpansionRequest user={user} serviceType={alert.serviceType} trigger="link" />
            </div>
          )}
        </div>
      ))}
    </div>
  )
}

/**
 * Componente interno para mostrar una alerta individual
 * Siguiendo Regla #3: Componente pequeño y enfocado
 */
const AlertItem = ({ alert, onClick, getActionText, getAlertStyles }) => {
  const styles = getAlertStyles(alert.type, alert.urgent)

  return (
    <div
      className={`border rounded-lg p-3 sm:p-4 ${styles.container} ${alert.urgent ? 'animate-pulse' : ''}`}
    >
      <div className="flex flex-col sm:flex-row sm:items-start space-y-3 sm:space-y-0 sm:space-x-3">
        {/* Icono */}
        <i className={`${styles.icon} text-lg sm:text-xl flex-shrink-0`} />

        {/* Contenido */}
        <div className="flex-1 min-w-0">
          <h4 className={`font-medium ${styles.title} text-sm sm:text-base`}>{alert.title}</h4>
          <p className={`text-xs sm:text-sm ${styles.message} mt-1 leading-tight`}>
            {alert.message}
          </p>
          {alert.cost && (
            <p className={`text-xs ${styles.message} mt-1`}>
              Costo: ${alert.cost.toLocaleString()}
            </p>
          )}
        </div>

        {/* Botón de acción */}
        {alert.action !== 'contact' ? (
          <button
            onClick={onClick}
            className={`px-3 py-2 rounded text-xs sm:text-sm font-medium transition-colors ${styles.button} w-full sm:w-auto`}
          >
            {getActionText(alert.action)}
          </button>
        ) : (
          <div
            className={`px-3 py-2 rounded text-xs sm:text-sm font-medium ${styles.button} opacity-75 text-center sm:text-left`}
          >
            {getActionText(alert.action)}
          </div>
        )}
      </div>
    </div>
  )
}

export default LimitAlert
