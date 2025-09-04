import React from 'react'

/**
 * Componente de estadísticas del mapa
 * ENFOQUE BALANCEADO: Solo presentación con cálculos locales simples
 *
 * @param {Array} pendingEmergencies - Emergencias pendientes
 * @param {Array} availableUnits - Unidades disponibles
 * @param {Array} busyUnits - Unidades ocupadas
 * @param {number} totalUnits - Total de unidades
 */
const MapStats = ({ pendingEmergencies, availableUnits, busyUnits, totalUnits }) => {
  // ============================================
  // VALIDACIÓN DE PROPS (Regla #4)
  // ============================================
  if (!Array.isArray(pendingEmergencies)) {
    console.error('MapStats: pendingEmergencies debe ser un array')
    return null
  }

  if (!Array.isArray(availableUnits)) {
    console.error('MapStats: availableUnits debe ser un array')
    return null
  }

  if (!Array.isArray(busyUnits)) {
    console.error('MapStats: busyUnits debe ser un array')
    return null
  }

  if (typeof totalUnits !== 'number') {
    console.error('MapStats: totalUnits debe ser un número')
    return null
  }

  return (
    <div className="bg-white rounded-lg shadow-medium p-4">
      <h3 className="font-exo font-semibold text-gray-800 mb-4 flex items-center">
        <i className="fas fa-chart-bar mr-2"></i>
        Estadísticas Rápidas
      </h3>

      <div className="space-y-3">
        <div className="flex justify-between items-center">
          <span className="text-sm text-gray-600">Emergencias Pendientes:</span>
          <span className="font-semibold text-red-600">{pendingEmergencies.length}</span>
        </div>
        <div className="flex justify-between items-center">
          <span className="text-sm text-gray-600">Unidades Disponibles:</span>
          <span className="font-semibold text-green-600">{availableUnits.length}</span>
        </div>
        <div className="flex justify-between items-center">
          <span className="text-sm text-gray-600">Unidades Ocupadas:</span>
          <span className="font-semibold text-blue-600">{busyUnits.length}</span>
        </div>
        <div className="flex justify-between items-center">
          <span className="text-sm text-gray-600">Total Unidades:</span>
          <span className="font-semibold text-gray-800">{totalUnits}</span>
        </div>
      </div>
    </div>
  )
}

export default MapStats
