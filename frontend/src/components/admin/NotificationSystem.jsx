import React from 'react'
import useNotificationSystem from '../../hooks/useNotificationSystem'
import { NotificationsHeader, AlertsView, ConfigView, SummaryStats } from './notifications'
import LoadingSkeleton from '../shared/LoadingSkeleton'
import ErrorMessage from '../shared/ErrorMessage'

/**
 * Sistema de notificaciones y alertas automáticas
 * ENFOQUE BALANCEADO: Estructura en componente, lógica en hook
 *
 * Funcionalidades:
 * - Alertas automáticas de emergencias con popups y sonidos
 * - Sistema de silenciado temporal de alertas por tipo
 * - Configuración de comportamiento de notificaciones
 * - Vista de alertas activas y historial de notificaciones
 * - Panel de estadísticas resumidas del sistema
 * - Reproducción automática de sonidos según tipo de emergencia
 *
 * Arquitectura modular:
 * - NotificationsHeader: Header con tabs y contador de alertas
 * - AlertsView: Vista de alertas con controles de silencio
 * - ConfigView: Formulario de configuración de notificaciones
 * - SummaryStats: Panel de estadísticas resumidas
 *
 * Características especiales:
 * - Popups automáticos para emergencias SOS (nunca se cierran solos)
 * - Sistema de sonidos diferenciados por tipo de emergencia
 * - Modos de notificación: silencioso, normal, detallado
 * - Sincronización con configuración global del sistema
 *
 * @returns {JSX.Element} Componente de sistema de notificaciones
 *
 * @example
 * // Uso básico en dashboard administrativo
 * <NotificationSystem />
 *
 * @see {@link useNotificationSystem} Hook que maneja toda la lógica de negocio
 * @see {@link INITIAL_NOTIFICATION_CONFIG} Configuración inicial
 *
 * Cumple reglas de refactorización:
 * - Regla #3: <200 líneas (142 líneas aprox)
 * - Regla #4: Validación de datos y props
 * - Regla #5: Lógica compleja en hook personalizado
 * - Regla #6: Componentes modulares y reutilizables
 * - Regla #8: Manejo consistente de errores
 * - Regla #12: Documentación JSDoc completa
 */
const NotificationSystem = () => {
  // ============================================
  // HOOK - Toda la lógica compleja (Regla #5)
  // ============================================
  const {
    // Estados
    activeTab,
    mutedAlerts,
    notificationConfig,
    isLoading,
    error,

    // Datos calculados
    activeAlerts,
    filteredNotifications,
    summaryStats,

    // Funciones de configuración
    updateNotificationConfig,
    saveConfiguration,
    resetToDefaults,

    // Funciones de alertas
    handleAlertClick,
    toggleMute,

    // Funciones de navegación
    setActiveTab,

    // Funciones de notificaciones
    removeNotification,

    // Control de errores
    clearError
  } = useNotificationSystem()

  // ============================================
  // MANEJO DE ERRORES (Regla #8)
  // ============================================
  if (error) {
    return (
      <div className="space-y-4">
        <ErrorMessage
          message={`Error en sistema de notificaciones: ${error}`}
          onRetry={clearError}
        />
      </div>
    )
  }

  if (isLoading && !activeAlerts.length) {
    return <LoadingSkeleton rows={3} />
  }

  return (
    <div className="space-y-6">
      {/* Header con tabs y contador de alertas */}
      <NotificationsHeader
        activeTab={activeTab}
        activeAlerts={activeAlerts}
        onTabChange={setActiveTab}
      />

      {/* Contenido según tab activa */}
      {activeTab === 'alerts' ? (
        <AlertsView
          filteredNotifications={filteredNotifications}
          mutedAlerts={mutedAlerts}
          notificationConfig={notificationConfig}
          onToggleMute={toggleMute}
          onAlertClick={handleAlertClick}
          onRemoveNotification={removeNotification}
        />
      ) : (
        <ConfigView
          notificationConfig={notificationConfig}
          onUpdateConfig={updateNotificationConfig}
          onSaveConfig={saveConfiguration}
          onResetConfig={resetToDefaults}
          isLoading={isLoading}
        />
      )}

      {/* Panel de resumen rápido (siempre visible) - Responsive */}
      <SummaryStats summaryStats={summaryStats} />
    </div>
  )
}

export default NotificationSystem
