import React from 'react'
import EmergencyStats from './EmergencyStats'
import { LABELS } from '../../../config/labels'

/**
 * ${LABELS.admin.emergency.emergencyHeader.comments.title}
 * ${LABELS.admin.emergency.emergencyHeader.comments.approach}
 *
 * @param {Object} stats - Estadísticas de emergencias
 * @param {string} filterPriority - Filtro de prioridad activo
 * @param {string} filterStatus - Filtro de estado activo
 * @param {string} filterTimeRange - Filtro de rango de tiempo
 * @param {string} viewMode - Modo de vista activo
 * @param {Function} setFilterPriority - Función para cambiar filtro prioridad
 * @param {Function} setFilterStatus - Función para cambiar filtro estado
 * @param {Function} setFilterTimeRange - Función para cambiar filtro tiempo
 * @param {Function} setViewMode - Función para cambiar modo de vista
 */
const EmergencyHeader = ({
  stats,
  filterPriority,
  filterStatus,
  filterTimeRange,
  viewMode,
  setFilterPriority,
  setFilterStatus,
  setFilterTimeRange,
  setViewMode
}) => {
  const labels = LABELS.admin.emergency.emergencyHeader

  // ============================================
  // VALIDACIÓN DE PROPS (Regla #4)
  // ============================================
  if (!stats) {
    console.error(labels.errors.statsRequired)
    return null
  }

  if (typeof setFilterPriority !== 'function') {
    console.error(labels.errors.setFilterPriorityRequired)
    return null
  }

  if (typeof setFilterStatus !== 'function') {
    console.error(labels.errors.setFilterStatusRequired)
    return null
  }

  if (typeof setFilterTimeRange !== 'function') {
    console.error(labels.errors.setFilterTimeRangeRequired)
    return null
  }

  if (typeof setViewMode !== 'function') {
    console.error(labels.errors.setViewModeRequired)
    return null
  }

  return (
    <div className="bg-white rounded-xl shadow-medium p-6">
      <div className="flex items-center justify-between mb-6">
        <h1 className="text-2xl font-bold text-gray-800">{labels.title}</h1>
        <div className="flex items-center space-x-2">
          <div className="w-3 h-3 bg-green-500 rounded-full animate-pulse"></div>
          <span className="text-sm text-gray-600">{labels.realTimeMonitoring}</span>
        </div>
      </div>

      {/* Estadísticas rápidas */}
      <EmergencyStats stats={stats} />

      {/* Controles */}
      <div className="flex flex-wrap items-center gap-4">
        {/* Filtros */}
        <div className="flex space-x-2">
          <select
            value={filterPriority}
            onChange={(e) => setFilterPriority(e.target.value)}
            className="border border-gray-300 rounded-lg px-3 py-2"
          >
            <option value="all">{labels.filters.priority.all}</option>
            <option value={labels.priorityValues.critical}>{labels.filters.priority.critical}</option>
            <option value={labels.priorityValues.high}>{labels.filters.priority.high}</option>
            <option value={labels.priorityValues.medium}>{labels.filters.priority.medium}</option>
            <option value={labels.priorityValues.low}>{labels.filters.priority.low}</option>
          </select>

          <select
            value={filterStatus}
            onChange={(e) => setFilterStatus(e.target.value)}
            className="border border-gray-300 rounded-lg px-3 py-2"
          >
            <option value="all">{labels.filters.status.all}</option>
            <option value={labels.statusValues.pending}>{labels.filters.status.pending}</option>
            <option value={labels.statusValues.inProgress}>{labels.filters.status.inProgress}</option>
            <option value={labels.statusValues.onRoute}>{labels.filters.status.onRoute}</option>
            <option value={labels.statusValues.completed}>{labels.filters.status.completed}</option>
          </select>

          <select
            value={filterTimeRange}
            onChange={(e) => setFilterTimeRange(e.target.value)}
            className="border border-gray-300 rounded-lg px-3 py-2"
          >
            <option value="today">{labels.filters.timeRange.today}</option>
            <option value="last24h">{labels.filters.timeRange.last24h}</option>
            <option value="last7days">{labels.filters.timeRange.last7days}</option>
            <option value="all">{labels.filters.timeRange.all}</option>
          </select>
        </div>

        {/* Vista */}
        <div className="flex space-x-1 bg-gray-100 rounded-lg p-1">
          <button
            onClick={() => setViewMode(labels.viewModes.timeline)}
            className={`px-3 py-1 rounded transition-colors ${
              viewMode === labels.viewModes.timeline ? 'bg-white shadow-sm' : ''
            }`}
          >
            <i className="fas fa-list-ul"></i>
          </button>
          <button
            onClick={() => setViewMode(labels.viewModes.grid)}
            className={`px-3 py-1 rounded transition-colors ${
              viewMode === labels.viewModes.grid ? 'bg-white shadow-sm' : ''
            }`}
          >
            <i className="fas fa-th"></i>
          </button>
          <button
            onClick={() => setViewMode(labels.viewModes.map)}
            className={`px-3 py-1 rounded transition-colors ${
              viewMode === labels.viewModes.map ? 'bg-white shadow-sm' : ''
            }`}
          >
            <i className="fas fa-map"></i>
          </button>
        </div>
      </div>
    </div>
  )
}

export default EmergencyHeader
