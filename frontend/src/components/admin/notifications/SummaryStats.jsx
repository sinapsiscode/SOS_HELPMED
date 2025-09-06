import React from 'react'
import { LABELS } from '../../../config/labels'

/**
 * ${LABELS.admin.notifications.summaryStats.comments.title}
 * ${LABELS.admin.notifications.summaryStats.comments.approach}
 *
 * @param {Object} summaryStats - Estadísticas del sistema
 * @returns {JSX.Element} Grid de estadísticas
 */
const SummaryStats = ({ summaryStats }) => {
  const labels = LABELS.admin.notifications.summaryStats

  // ============================================
  // VALIDACIÓN DE PROPS (Regla #4)
  // ============================================
  if (!summaryStats || typeof summaryStats !== 'object') {
    console.error(labels.errors.summaryStatsObject)
    return null
  }

  const statsConfig = [
    {
      key: 'activeEmergenciesCount',
      label: labels.stats.activeEmergencies,
      icon: 'fas fa-ambulance',
      color: 'text-red-400'
    },
    {
      key: 'availableAmbulancesCount',
      label: labels.stats.availableAmbulances,
      icon: 'fas fa-truck-medical',
      color: 'text-green-400'
    },
    {
      key: 'activeClientsCount',
      label: labels.stats.activeClients,
      icon: 'fas fa-users',
      color: 'text-blue-400'
    },
    {
      key: 'todayServicesCount',
      label: labels.stats.todayServices,
      icon: 'fas fa-check-circle',
      color: 'text-purple-400'
    }
  ]

  return (
    <div className="grid grid-cols-2 lg:grid-cols-4 gap-2 sm:gap-4">
      {statsConfig.map((stat) => (
        <div key={stat.key} className="bg-white rounded-lg shadow p-3 sm:p-4">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-lg sm:text-2xl font-bold text-gray-800">
                {summaryStats[stat.key]}
              </p>
              <p className="text-xs text-gray-600">{stat.label}</p>
            </div>
            <i className={`${stat.icon} ${stat.color} text-lg sm:text-xl`}></i>
          </div>
        </div>
      ))}
    </div>
  )
}

export default SummaryStats
