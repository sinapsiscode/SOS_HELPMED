import React from 'react'
import { useAdminStats } from '../../../hooks/useAdminStats'
import StatsGrid from '../shared/StatsGrid'
import LoadingSkeleton from '../../shared/LoadingSkeleton'
import ErrorMessage from '../../shared/ErrorMessage'
import QuickMetrics from './QuickMetrics'
import SystemAlerts from './SystemAlerts'
import QuickActions from './QuickActions'

/**
 * Tab de vista general con estadísticas principales del sistema
 * Muestra métricas de usuarios, emergencias, contratos y unidades
 * @param {Function} onTabChange - Función para cambiar de tab (opcional)
 */
const OverviewTab = ({ onTabChange }) => {
  const { stats, loading, error, refreshStats } = useAdminStats()

  if (loading) return <LoadingSkeleton />
  if (error) return <ErrorMessage message={error} onRetry={refreshStats} />

  const statsConfig = [
    {
      title: 'Usuarios Totales',
      value: stats.totalUsers,
      subtitle: `${stats.activeUsers} activos`,
      icon: '👥',
      color: 'blue'
    },
    {
      title: 'Emergencias',
      value: stats.totalEmergencies,
      subtitle: `${stats.pendingEmergencies} pendientes`,
      icon: '⚠️',
      color: 'red'
    },
    {
      title: 'Contratos',
      value: stats.totalContracts,
      subtitle: `${stats.activeContracts} activos`,
      icon: '🏢',
      color: 'green'
    },
    {
      title: 'Unidades',
      value: stats.totalUnits,
      subtitle: `${stats.availableUnits} disponibles`,
      icon: '🚛',
      color: 'purple'
    }
  ]

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <h2 className="text-2xl font-bold text-gray-900">Vista General</h2>
        <button
          onClick={refreshStats}
          className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
        >
          Actualizar
        </button>
      </div>

      <StatsGrid stats={statsConfig} />

      {/* Métricas y Actividad Reciente */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <div className="bg-white p-6 rounded-lg shadow">
          <h3 className="text-lg font-semibold mb-4">Actividad Reciente</h3>
          <div className="space-y-3">
            <div className="flex items-center p-3 bg-gray-50 rounded">
              <span className="mr-3">🚨</span>
              <div>
                <p className="text-sm font-medium">Nueva emergencia registrada</p>
                <p className="text-xs text-gray-500">Hace 5 minutos</p>
              </div>
            </div>
            <div className="flex items-center p-3 bg-gray-50 rounded">
              <span className="mr-3">👤</span>
              <div>
                <p className="text-sm font-medium">Usuario registrado</p>
                <p className="text-xs text-gray-500">Hace 12 minutos</p>
              </div>
            </div>
            <div className="flex items-center p-3 bg-gray-50 rounded">
              <span className="mr-3">📝</span>
              <div>
                <p className="text-sm font-medium">Contrato actualizado</p>
                <p className="text-xs text-gray-500">Hace 1 hora</p>
              </div>
            </div>
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
