import React from 'react'
import EmergencyStats from './EmergencyStats'

/**
 * Header del seguimiento de emergencias con filtros y estadísticas
 * ENFOQUE BALANCEADO: Solo presentación con validación de props
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
  // ============================================
  // VALIDACIÓN DE PROPS (Regla #4)
  // ============================================
  if (!stats) {
    console.error('EmergencyHeader: stats es requerido')
    return null
  }

  if (typeof setFilterPriority !== 'function') {
    console.error('EmergencyHeader: setFilterPriority debe ser una función')
    return null
  }

  if (typeof setFilterStatus !== 'function') {
    console.error('EmergencyHeader: setFilterStatus debe ser una función')
    return null
  }

  if (typeof setFilterTimeRange !== 'function') {
    console.error('EmergencyHeader: setFilterTimeRange debe ser una función')
    return null
  }

  if (typeof setViewMode !== 'function') {
    console.error('EmergencyHeader: setViewMode debe ser una función')
    return null
  }

  return (
    <div className="bg-white rounded-xl shadow-medium p-6">
      <div className="flex items-center justify-between mb-6">
        <h1 className="text-2xl font-bold text-gray-800">Seguimiento de Emergencias</h1>
        <div className="flex items-center space-x-2">
          <div className="w-3 h-3 bg-green-500 rounded-full animate-pulse"></div>
          <span className="text-sm text-gray-600">Monitoreo en tiempo real</span>
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
            <option value="all">Todas las prioridades</option>
            <option value="CRITICA">Crítica</option>
            <option value="ALTA">Alta</option>
            <option value="MEDIA">Media</option>
            <option value="BAJA">Baja</option>
          </select>

          <select
            value={filterStatus}
            onChange={(e) => setFilterStatus(e.target.value)}
            className="border border-gray-300 rounded-lg px-3 py-2"
          >
            <option value="all">Todos los estados</option>
            <option value="PENDIENTE">Pendientes</option>
            <option value="EN_PROGRESO">En Progreso</option>
            <option value="EN_RUTA">En Ruta</option>
            <option value="COMPLETADA">Completadas</option>
          </select>

          <select
            value={filterTimeRange}
            onChange={(e) => setFilterTimeRange(e.target.value)}
            className="border border-gray-300 rounded-lg px-3 py-2"
          >
            <option value="today">Hoy</option>
            <option value="last24h">Últimas 24h</option>
            <option value="last7days">Últimos 7 días</option>
            <option value="all">Todas</option>
          </select>
        </div>

        {/* Vista */}
        <div className="flex space-x-1 bg-gray-100 rounded-lg p-1">
          <button
            onClick={() => setViewMode('timeline')}
            className={`px-3 py-1 rounded transition-colors ${
              viewMode === 'timeline' ? 'bg-white shadow-sm' : ''
            }`}
          >
            <i className="fas fa-list-ul"></i>
          </button>
          <button
            onClick={() => setViewMode('grid')}
            className={`px-3 py-1 rounded transition-colors ${
              viewMode === 'grid' ? 'bg-white shadow-sm' : ''
            }`}
          >
            <i className="fas fa-th"></i>
          </button>
          <button
            onClick={() => setViewMode('map')}
            className={`px-3 py-1 rounded transition-colors ${
              viewMode === 'map' ? 'bg-white shadow-sm' : ''
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
