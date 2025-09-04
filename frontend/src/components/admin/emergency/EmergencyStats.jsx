import React from 'react'

/**
 * Componente de estadísticas de emergencias
 * ENFOQUE BALANCEADO: Solo presentación con validación de props
 *
 * @param {Object} stats - Estadísticas de emergencias
 */
const EmergencyStats = ({ stats }) => {
  // ============================================
  // VALIDACIÓN DE PROPS (Regla #4)
  // ============================================
  if (!stats) {
    console.error('EmergencyStats: stats es requerido')
    return null
  }

  return (
    <div className="grid grid-cols-2 md:grid-cols-6 gap-4 mb-6">
      <EmergencyStatCard title="Total" count={stats.total} color="blue" icon="fas fa-list" />
      <EmergencyStatCard
        title="Activas"
        count={stats.active}
        color="yellow"
        icon="fas fa-exclamation-triangle"
      />
      <EmergencyStatCard
        title="Pendientes"
        count={stats.pending}
        color="orange"
        icon="fas fa-clock"
      />
      <EmergencyStatCard
        title="Completadas"
        count={stats.completed}
        color="green"
        icon="fas fa-check-circle"
      />
      <EmergencyStatCard
        title="Críticas"
        count={stats.criticalCount}
        color="red"
        icon="fas fa-heartbeat"
      />
      <EmergencyStatCard
        title="Tiempo Prom."
        count={`${stats.avgResponseTime}min`}
        color="purple"
        icon="fas fa-stopwatch"
      />
    </div>
  )
}

/**
 * Tarjeta individual de estadística
 */
const EmergencyStatCard = ({ title, count, color, icon }) => {
  // ============================================
  // VALIDACIÓN DE PROPS (Regla #4)
  // ============================================
  if (!title || count === undefined) {
    console.error('EmergencyStatCard: title y count son requeridos')
    return null
  }

  const colorClasses = {
    blue: 'bg-blue-50 border-blue-200 text-blue-600',
    yellow: 'bg-yellow-50 border-yellow-200 text-yellow-600',
    orange: 'bg-orange-50 border-orange-200 text-orange-600',
    green: 'bg-green-50 border-green-200 text-green-600',
    red: 'bg-red-50 border-red-200 text-red-600',
    purple: 'bg-purple-50 border-purple-200 text-purple-600'
  }

  return (
    <div className={`border rounded-lg p-4 ${colorClasses[color] || colorClasses.blue}`}>
      <div className="flex items-center justify-between">
        <div>
          <div className="text-xl font-bold">{count}</div>
          <div className="text-xs font-medium">{title}</div>
        </div>
        {icon && <i className={`${icon} text-lg opacity-75`}></i>}
      </div>
    </div>
  )
}

export default EmergencyStats
