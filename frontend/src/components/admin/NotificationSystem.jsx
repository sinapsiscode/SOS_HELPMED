import React from 'react'
import useNotificationSystem from '../../hooks/useNotificationSystem'
import { NotificationsHeader, AlertsView, ConfigView, SummaryStats } from './notifications'
import LoadingSkeleton from '../shared/LoadingSkeleton'
import ErrorMessage from '../shared/ErrorMessage'
import { LABELS } from '../../config/labels'

/**
 * ${LABELS.admin.notificationSystem.comments.title}
 * ${LABELS.admin.notificationSystem.comments.approach}
 *
 * ${LABELS.admin.notificationSystem.comments.features.title}
 * ${LABELS.admin.notificationSystem.comments.features.autoAlerts}
 * ${LABELS.admin.notificationSystem.comments.features.silenceSystem}
 * ${LABELS.admin.notificationSystem.comments.features.configBehavior}
 * ${LABELS.admin.notificationSystem.comments.features.alertsView}
 * ${LABELS.admin.notificationSystem.comments.features.statsPanel}
 * ${LABELS.admin.notificationSystem.comments.features.autoSounds}
 *
 * ${LABELS.admin.notificationSystem.comments.architecture.title}
 * ${LABELS.admin.notificationSystem.comments.architecture.header}
 * ${LABELS.admin.notificationSystem.comments.architecture.alertsView}
 * ${LABELS.admin.notificationSystem.comments.architecture.configView}
 * ${LABELS.admin.notificationSystem.comments.architecture.summaryStats}
 *
 * ${LABELS.admin.notificationSystem.comments.specialFeatures.title}
 * ${LABELS.admin.notificationSystem.comments.specialFeatures.autoPopups}
 * ${LABELS.admin.notificationSystem.comments.specialFeatures.soundSystem}
 * ${LABELS.admin.notificationSystem.comments.specialFeatures.notificationModes}
 * ${LABELS.admin.notificationSystem.comments.specialFeatures.globalSync}
 *
 * @returns {JSX.Element} Componente de sistema de notificaciones
 *
 * ${LABELS.admin.notificationSystem.comments.example.title}
 * ${LABELS.admin.notificationSystem.comments.example.usage}
 * ${LABELS.admin.notificationSystem.comments.example.component}
 *
 * ${LABELS.admin.notificationSystem.comments.see.hook}
 * ${LABELS.admin.notificationSystem.comments.see.config}
 *
 * ${LABELS.admin.notificationSystem.comments.rules.title}
 * ${LABELS.admin.notificationSystem.comments.rules.rule3}
 * ${LABELS.admin.notificationSystem.comments.rules.rule4}
 * ${LABELS.admin.notificationSystem.comments.rules.rule5}
 * ${LABELS.admin.notificationSystem.comments.rules.rule6}
 * ${LABELS.admin.notificationSystem.comments.rules.rule8}
 * ${LABELS.admin.notificationSystem.comments.rules.rule12}
 */
const NotificationSystem = () => {
  const labels = LABELS.admin.notificationSystem
  
  // ============================================
  // ${LABELS.admin.notificationSystem.comments.businessLogic}
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
  // ${LABELS.admin.notificationSystem.comments.errorHandling}
  // ============================================
  if (error) {
    return (
      <div className="space-y-4">
        <ErrorMessage
          message={labels.errors.systemError.replace('{error}', error)}
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
