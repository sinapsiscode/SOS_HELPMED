import React from 'react'
import { useAdminStats } from '../../../hooks/useAdminStats'
import StatsGrid from '../shared/StatsGrid'
import LoadingSkeleton from '../../shared/LoadingSkeleton'
import ErrorMessage from '../../shared/ErrorMessage'
import QuickMetrics from './QuickMetrics'
import SystemAlerts from './SystemAlerts'
import QuickActions from './QuickActions'
import { LABELS } from '../../../config/labels'

/**
 * Tab de vista general con estadísticas principales del sistema
 * Muestra métricas de usuarios, emergencias, contratos y unidades
 * @param {Function} onTabChange - Función para cambiar de tab (opcional)
 */
const OverviewTab = ({ onTabChange }) => {
  const labels = LABELS.admin.dashboard.overviewTab
  const { stats, loading, error, refreshStats } = useAdminStats()

  if (loading) return <LoadingSkeleton />
  if (error) return <ErrorMessage message={error} onRetry={refreshStats} />

  const statsConfig = [
    {
      title: labels.stats.totalUsers.title,
      value: stats.totalUsers,
      subtitle: labels.stats.totalUsers.subtitle.replace('{count}', stats.activeUsers),
      icon: labels.stats.totalUsers.icon,
      color: 'blue'
    },
    {
      title: labels.stats.emergencies.title,
      value: stats.totalEmergencies,
      subtitle: labels.stats.emergencies.subtitle.replace('{count}', stats.pendingEmergencies),
      icon: labels.stats.emergencies.icon,
      color: 'red'
    },
    {
      title: labels.stats.contracts.title,
      value: stats.totalContracts,
      subtitle: labels.stats.contracts.subtitle.replace('{count}', stats.activeContracts),
      icon: labels.stats.contracts.icon,
      color: 'green'
    },
    {
      title: labels.stats.units.title,
      value: stats.totalUnits,
      subtitle: labels.stats.units.subtitle.replace('{count}', stats.availableUnits),
      icon: labels.stats.units.icon,
      color: 'purple'
    }
  ]

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <h2 className="text-2xl font-bold text-gray-900">{labels.title}</h2>
        <button
          onClick={refreshStats}
          className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
        >
          {labels.buttons.refresh}
        </button>
      </div>

      <StatsGrid stats={statsConfig} />

      {/* Métricas y Actividad Reciente */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <div className="bg-white p-6 rounded-lg shadow">
          <h3 className="text-lg font-semibold mb-4">{labels.recentActivity.title}</h3>
          <div className="space-y-3">
            {labels.recentActivity.items.map((item, index) => (
              <div key={index} className="flex items-center p-3 bg-gray-50 rounded">
                <span className="mr-3">{item.icon}</span>
                <div>
                  <p className="text-sm font-medium">{item.title}</p>
                  <p className="text-xs text-gray-500">{item.time}</p>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Componente de Métricas Clave */}
        <QuickMetrics />
      </div>

      {/* Alertas del Sistema */}
      <SystemAlerts />

      {/* Componente de Acciones Rápidas */}
      <QuickActions onTabChange={onTabChange} />
    </div>
  )
}

export default OverviewTab
