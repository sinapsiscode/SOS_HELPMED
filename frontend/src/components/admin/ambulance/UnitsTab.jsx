import React from 'react'
import AmbulanceRow from './AmbulanceRow'
import { LABELS } from '../../../config/labels'

/**
 * Pestaña de unidades de ambulancia
 * ENFOQUE BALANCEADO: Componente de presentación con estructura clara
 *
 * @param {Array} ambulances - Lista completa de ambulancias
 * @param {Array} filteredAmbulances - Ambulancias filtradas
 * @param {Function} onEdit - Callback para editar ambulancia
 * @param {Function} onDelete - Callback para eliminar ambulancia
 * @param {Function} getStatusColor - Función para obtener color de estado
 * @param {Function} getCurrentStatusColor - Función para obtener color de estado actual
 * @param {Function} getStatusText - Función para obtener texto de estado
 * @param {Function} getCurrentStatusText - Función para obtener texto de estado actual
 */
const UnitsTab = ({
  ambulances,
  filteredAmbulances,
  onEdit,
  onDelete,
  getStatusColor,
  getCurrentStatusColor,
  getStatusText,
  getCurrentStatusText
}) => {
  const labels = LABELS.admin.units
  
  // ============================================
  // VALIDACIÓN DE PROPS (Regla #4)
  // ============================================
  if (!Array.isArray(ambulances)) {
    console.error(labels.errors.ambulancesRequired)
    return null
  }

  if (!Array.isArray(filteredAmbulances)) {
    console.error(labels.errors.filteredRequired)
    return null
  }

  if (typeof onEdit !== 'function') {
    console.error(labels.errors.onEditRequired)
    return null
  }

  if (typeof onDelete !== 'function') {
    console.error(labels.errors.onDeleteRequired)
    return null
  }
  // Estadísticas simples calculadas localmente (no es lógica de negocio compleja)
  const stats = {
    active: ambulances.filter((a) => a.status === 'active').length,
    available: ambulances.filter((a) => a.currentStatus === 'available').length,
    inService: ambulances.filter(
      (a) => a.currentStatus === 'en_route' || a.currentStatus === 'on_scene'
    ).length,
    total: ambulances.length
  }

  return (
    <>
      {/* Estadísticas */}
      <div className="bg-white rounded-xl shadow-medium p-6">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
          <div className="bg-green-50 border border-green-200 rounded-lg p-4 text-center">
            <div className="text-2xl font-bold text-green-600 font-exo">{stats.active}</div>
            <div className="text-sm text-green-700 font-roboto">{labels.stats.active}</div>
          </div>
          <div className="bg-yellow-50 border border-yellow-200 rounded-lg p-4 text-center">
            <div className="text-2xl font-bold text-yellow-600 font-exo">{stats.available}</div>
            <div className="text-sm text-yellow-700 font-roboto">{labels.stats.available}</div>
          </div>
          <div className="bg-blue-50 border border-blue-200 rounded-lg p-4 text-center">
            <div className="text-2xl font-bold text-blue-600 font-exo">{stats.inService}</div>
            <div className="text-sm text-blue-700 font-roboto">{labels.stats.inService}</div>
          </div>
          <div className="bg-purple-50 border border-purple-200 rounded-lg p-4 text-center">
            <div className="text-2xl font-bold text-purple-600 font-exo">{stats.total}</div>
            <div className="text-sm text-purple-700 font-roboto">{labels.stats.total}</div>
          </div>
        </div>
      </div>

      {/* Lista de Ambulancias */}
      <div className="bg-white rounded-xl shadow-medium overflow-hidden mt-6">
        <div className="px-6 py-4 border-b border-gray-200">
          <h3 className="text-lg font-exo font-semibold text-gray-800">
            {labels.titleWithCount.replace('{count}', filteredAmbulances.length)}
          </h3>
        </div>

        {filteredAmbulances.length === 0 ? (
          <div className="p-8 text-center">
            <i className="fas fa-ambulance text-4xl text-gray-400 mb-4"></i>
            <h3 className="text-lg font-exo font-semibold text-gray-800 mb-2">{labels.empty.title}</h3>
            <p className="text-gray-600 font-roboto">
              {labels.empty.description}
            </p>
          </div>
        ) : (
          <div className="divide-y divide-gray-200">
            {filteredAmbulances.map((ambulance) => (
              <AmbulanceRow
                key={ambulance.id}
                ambulance={ambulance}
                onEdit={() => onEdit(ambulance)}
                onDelete={() => onDelete(ambulance.id)}
                getStatusColor={getStatusColor}
                getCurrentStatusColor={getCurrentStatusColor}
                getStatusText={getStatusText}
                getCurrentStatusText={getCurrentStatusText}
              />
            ))}
          </div>
        )}
      </div>
    </>
  )
}

export default UnitsTab
