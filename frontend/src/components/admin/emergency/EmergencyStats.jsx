import React from 'react'
import { LABELS } from '../../../config/labels'

/**
 * ${LABELS.admin.emergency.emergencyStats.comments.title}
 * ${LABELS.admin.emergency.emergencyStats.comments.approach}
 *
 * @param {Object} stats - Estadísticas de emergencias
 */
const EmergencyStats = ({ stats }) => {
  const labels = LABELS.admin.emergency.emergencyStats

  // ============================================
  // VALIDACIÓN DE PROPS (Regla #4)
  // ============================================
  if (!stats) {
    console.error(labels.errors.statsRequired)
    return null
  }

  return (
    <div className="grid grid-cols-2 md:grid-cols-6 gap-4 mb-6">
      <EmergencyStatCard title={labels.cards.total.title} count={stats.total} color={labels.cards.total.color} icon={labels.cards.total.icon} />
      <EmergencyStatCard
        title={labels.cards.active.title}
        count={stats.active}
        color={labels.cards.active.color}
        icon={labels.cards.active.icon}
      />
      <EmergencyStatCard
        title={labels.cards.pending.title}
        count={stats.pending}
        color={labels.cards.pending.color}
        icon={labels.cards.pending.icon}
      />
      <EmergencyStatCard
        title={labels.cards.completed.title}
        count={stats.completed}
        color={labels.cards.completed.color}
        icon={labels.cards.completed.icon}
      />
      <EmergencyStatCard
        title={labels.cards.critical.title}
        count={stats.criticalCount}
        color={labels.cards.critical.color}
        icon={labels.cards.critical.icon}
      />
      <EmergencyStatCard
        title={labels.cards.avgTime.title}
        count={labels.cards.avgTime.format.replace('{time}', stats.avgResponseTime)}
        color={labels.cards.avgTime.color}
        icon={labels.cards.avgTime.icon}
      />
    </div>
  )
}

/**
 * ${LABELS.admin.emergency.emergencyStats.comments.cardTitle}
 */
const EmergencyStatCard = ({ title, count, color, icon }) => {
  const labels = LABELS.admin.emergency.emergencyStats

  // ============================================
  // VALIDACIÓN DE PROPS (Regla #4)
  // ============================================
  if (!title || count === undefined) {
    console.error(labels.errors.cardFieldsRequired)
    return null
  }

  const colorClasses = labels.colorClasses

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
