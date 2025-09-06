import React from 'react'
import { LABELS } from '../../../config/labels'

/**
 * ${LABELS.admin.map.mapStats.comments.title}
 * ${LABELS.admin.map.mapStats.comments.approach}
 *
 * @param {Array} pendingEmergencies - Emergencias pendientes
 * @param {Array} availableUnits - Unidades disponibles
 * @param {Array} busyUnits - Unidades ocupadas
 * @param {number} totalUnits - Total de unidades
 */
const MapStats = ({ pendingEmergencies, availableUnits, busyUnits, totalUnits }) => {
  const labels = LABELS.admin.map.mapStats

  // ============================================
  // VALIDACIÓN DE PROPS (Regla #4)
  // ============================================
  if (!Array.isArray(pendingEmergencies)) {
    console.error(labels.errors.pendingEmergenciesArray)
    return null
  }

  if (!Array.isArray(availableUnits)) {
    console.error(labels.errors.availableUnitsArray)
    return null
  }

  if (!Array.isArray(busyUnits)) {
    console.error(labels.errors.busyUnitsArray)
    return null
  }

  if (typeof totalUnits !== 'number') {
    console.error(labels.errors.totalUnitsNumber)
    return null
  }

  return (
    <div className="bg-white rounded-lg shadow-medium p-4">
      <h3 className="font-exo font-semibold text-gray-800 mb-4 flex items-center">
        <i className="fas fa-chart-bar mr-2"></i>
        {labels.title}
      </h3>

      <div className="space-y-3">
        <div className="flex justify-between items-center">
          <span className="text-sm text-gray-600">{labels.stats.pendingEmergencies}</span>
          <span className="font-semibold text-red-600">{pendingEmergencies.length}</span>
        </div>
        <div className="flex justify-between items-center">
          <span className="text-sm text-gray-600">{labels.stats.availableUnits}</span>
          <span className="font-semibold text-green-600">{availableUnits.length}</span>
        </div>
        <div className="flex justify-between items-center">
          <span className="text-sm text-gray-600">{labels.stats.busyUnits}</span>
          <span className="font-semibold text-blue-600">{busyUnits.length}</span>
        </div>
        <div className="flex justify-between items-center">
          <span className="text-sm text-gray-600">{labels.stats.totalUnits}</span>
          <span className="font-semibold text-gray-800">{totalUnits}</span>
        </div>
      </div>
    </div>
  )
}

export default MapStats
