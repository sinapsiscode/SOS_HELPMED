import { useState, useEffect } from 'react'
import useAppStore from '../../../stores/useAppStore'

// Componente KPI Card
const KPICard = ({ title, value, change, icon, color }) => {
  const colorClasses = {
    blue: 'text-blue-600 bg-blue-50',
    red: 'text-red-600 bg-red-50',
    purple: 'text-purple-600 bg-purple-50',
    yellow: 'text-yellow-600 bg-yellow-50'
  }

  return (
    <div className="bg-white rounded-lg shadow-md p-6">
      <div className="flex items-center justify-between">
        <div>
          <p className="text-sm text-gray-600">{title}</p>
          <p className="text-2xl font-bold text-gray-900 mt-1">{value}</p>
          {change && (
            <p className={`text-sm mt-1 ${change.includes('+') ? 'text-green-600' : 'text-red-600'}`}>
              {change}
            </p>
          )}
        </div>
        <div className={`p-3 rounded-full ${colorClasses[color]}`}>
          <i className={`${icon} text-xl`}></i>
        </div>
      </div>
    </div>
  )
}

const OverviewReportSimple = ({ dateRange, revenueSummary }) => {
  const { allUsers, transactions, activeEmergencies } = useAppStore()
  const [metrics, setMetrics] = useState({
    totalUsers: 0,
    revenue: 0,
    completedServices: 0,
    activeEmergencies: 0
  })
  
  useEffect(() => {
    const calculateMetrics = () => {
      // Total de usuarios real
      const totalUsers = Object.values(allUsers).reduce((sum, users) => sum + (users?.length || 0), 0)
      
      // Ingresos reales del store
      const revenue = revenueSummary?.totalRevenue || 0
      
      // Servicios completados (transacciones completadas)
      const completedServices = transactions?.filter(t => t.status === 'COMPLETED').length || 0
      
      // Emergencias activas reales
      const currentActiveEmergencies = activeEmergencies?.length || 0
      
      return {
        totalUsers,
        revenue,
        completedServices,
        activeEmergencies: currentActiveEmergencies
      }
    }
    
    setMetrics(calculateMetrics())
  }, [allUsers, transactions, activeEmergencies, revenueSummary])

  return (
    <div className="space-y-6">
      {/* KPIs Principales */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        <KPICard
          title="Total Usuarios"
          value={metrics.totalUsers.toLocaleString()}
          icon="fas fa-users"
          color="blue"
        />
        <KPICard
          title="Emergencias Activas"
          value={metrics.activeEmergencies.toString()}
          icon="fas fa-exclamation-triangle"
          color="red"
        />
        <KPICard
          title="Ingresos Totales"
          value={`S/ ${metrics.revenue.toLocaleString()}`}
          icon="fas fa-dollar-sign"
          color="purple"
        />
        <KPICard
          title="Servicios Completados"
          value={metrics.completedServices.toString()}
          icon="fas fa-check-circle"
          color="yellow"
        />
      </div>

      {/* Resumen de Estado */}
      <div className="bg-white rounded-xl shadow-md p-6">
        <h3 className="text-lg font-semibold text-gray-800 mb-4">Estado del Sistema</h3>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <div className="text-center p-4 bg-gray-50 rounded-lg">
            <div className="text-2xl font-bold text-blue-600">
              {Object.keys(allUsers).length}
            </div>
            <p className="text-sm text-gray-600 mt-1">Tipos de Usuario</p>
          </div>
          <div className="text-center p-4 bg-gray-50 rounded-lg">
            <div className="text-2xl font-bold text-green-600">
              {transactions?.length || 0}
            </div>
            <p className="text-sm text-gray-600 mt-1">Total Transacciones</p>
          </div>
          <div className="text-center p-4 bg-gray-50 rounded-lg">
            <div className="text-2xl font-bold text-purple-600">
              {activeEmergencies?.filter(e => e.status === 'completed').length || 0}
            </div>
            <p className="text-sm text-gray-600 mt-1">Emergencias Completadas</p>
          </div>
        </div>
      </div>
    </div>
  )
}

export default OverviewReportSimple