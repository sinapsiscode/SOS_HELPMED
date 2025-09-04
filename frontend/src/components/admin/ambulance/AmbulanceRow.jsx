import React from 'react'
import { useAmbulanceRowLogic } from '../../../hooks/useAmbulanceRowLogic'

/**
 * Componente de fila individual de ambulancia
 * ENFOQUE BALANCEADO: Estructura y clases en componente, lógica en hook
 *
 * @param {Object} ambulance - Datos de la ambulancia
 * @param {Function} onEdit - Callback para editar ambulancia
 * @param {Function} onDelete - Callback para eliminar ambulancia
 * @param {Function} getStatusColor - Función para obtener color de estado
 * @param {Function} getCurrentStatusColor - Función para obtener color de estado actual
 * @param {Function} getStatusText - Función para obtener texto de estado
 * @param {Function} getCurrentStatusText - Función para obtener texto de estado actual
 */
const AmbulanceRow = ({
  ambulance,
  onEdit,
  onDelete,
  getStatusColor,
  getCurrentStatusColor,
  getStatusText,
  getCurrentStatusText
}) => {
  // ============================================
  // VALIDACIÓN DE PROPS (Regla #4)
  // ============================================
  if (!ambulance || typeof ambulance !== 'object') {
    console.error('AmbulanceRow: ambulance es requerido y debe ser un objeto')
    return null
  }

  if (typeof onEdit !== 'function') {
    console.error('AmbulanceRow: onEdit debe ser una función')
    return null
  }

  if (typeof onDelete !== 'function') {
    console.error('AmbulanceRow: onDelete debe ser una función')
    return null
  }

  const { handleStatusChange, formatLocation, error } = useAmbulanceRowLogic(ambulance.id)

  // ============================================
  // MANEJO DE ERRORES (Regla #8)
  // ============================================
  if (error) {
    return (
      <div className="p-4 bg-red-50 border border-red-200 rounded">
        <p className="text-red-600 text-sm">Error en fila de ambulancia: {error}</p>
      </div>
    )
  }

  return (
    <div className="p-4 sm:p-6 hover:bg-gray-50 transition-colors">
      <div className="flex flex-col sm:flex-row sm:items-start sm:justify-between space-y-4 sm:space-y-0">
        <div className="flex-1 min-w-0">
          <div className="flex items-center space-x-3 mb-3">
            <i className="fas fa-ambulance text-helpmed-blue text-xl"></i>
            <div>
              <h4 className="text-lg font-exo font-semibold text-gray-800">
                {ambulance.ambulance?.unit_id || 'Unidad Sin ID'}
              </h4>
              <p className="text-sm text-gray-600 font-roboto">
                Conductor: {ambulance.profile?.name || 'Sin asignar'}
              </p>
            </div>
            <div className="flex space-x-2">
              <span
                className={`px-2 py-1 rounded-full text-xs font-medium border ${getStatusColor(ambulance.status)}`}
              >
                {getStatusText(ambulance.status)}
              </span>
              <span
                className={`px-2 py-1 rounded-full text-xs font-medium border ${getCurrentStatusColor(ambulance.currentStatus)}`}
              >
                {getCurrentStatusText(ambulance.currentStatus)}
              </span>
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-4">
            <div>
              <p className="text-sm text-gray-600 font-roboto">
                <strong>Email:</strong> {ambulance.profile?.email || 'No especificado'}
              </p>
              <p className="text-sm text-gray-600 font-roboto">
                <strong>Teléfono:</strong> {ambulance.profile?.phone || 'No especificado'}
              </p>
              <p className="text-sm text-gray-600 font-roboto">
                <strong>Licencia:</strong> {ambulance.profile?.license || 'No especificada'}
              </p>
            </div>
            <div>
              <p className="text-sm text-gray-600 font-roboto">
                <strong>Tipo:</strong> {ambulance.ambulance?.type || 'Ambulancia'}
              </p>
              <p className="text-sm text-gray-600 font-roboto">
                <strong>Placa:</strong> {ambulance.ambulance?.plate || 'No especificada'}
              </p>
              <p className="text-sm text-gray-600 font-roboto">
                <strong>Capacidad:</strong> {ambulance.ambulance?.capacity || 2} personas
              </p>
              <p className="text-sm text-gray-600 font-roboto">
                <strong>Equipo Médico:</strong> {
                  ambulance.ambulance?.medical_team === 'tecnico_enfermeria' 
                    ? 'Técnico en Enfermería' 
                    : ambulance.ambulance?.medical_team === 'licenciado_enfermeria'
                    ? 'Licenciado en Enfermería'
                    : ambulance.ambulance?.medical_team === 'ambos'
                    ? 'Técnico y Licenciado'
                    : 'No especificado'
                }
              </p>
            </div>
            <div>
              <p className="text-sm text-gray-600 font-roboto">
                <strong>Ubicación GPS:</strong> {formatLocation(ambulance.currentLocation)}
              </p>
              <p className="text-sm text-gray-600 font-roboto">
                <strong>Última actualización:</strong>{' '}
                {ambulance.currentLocation?.timestamp
                  ? new Date(ambulance.currentLocation.timestamp).toLocaleTimeString('es-CL')
                  : 'Nunca'}
              </p>
              <p className="text-sm text-gray-600 font-roboto">
                <strong>Servicios completados:</strong> {ambulance.stats?.completedServices || 0}
              </p>
            </div>
          </div>

          <div className="flex items-center justify-between">
            <div className="text-xs text-gray-500 font-roboto">
              ID: {ambulance.id.slice(-8)} • Creado:{' '}
              {new Date(ambulance.createdAt || Date.now()).toLocaleDateString('es-CL')}
            </div>

            <div className="flex space-x-2">
              {/* Status Quick Actions */}
              <div className="flex space-x-1">
                <button
                  onClick={() => handleStatusChange('available')}
                  className={`px-2 py-1 rounded text-xs font-medium transition-colors ${
                    ambulance.currentStatus === 'available'
                      ? 'bg-green-600 text-white'
                      : 'bg-gray-200 text-gray-700 hover:bg-green-100'
                  }`}
                  title="Marcar como Disponible"
                >
                  <i className="fas fa-check"></i>
                </button>
                <button
                  onClick={() => handleStatusChange('off_duty')}
                  className={`px-2 py-1 rounded text-xs font-medium transition-colors ${
                    ambulance.currentStatus === 'off_duty'
                      ? 'bg-gray-600 text-white'
                      : 'bg-gray-200 text-gray-700 hover:bg-gray-300'
                  }`}
                  title="Marcar fuera de Servicio"
                >
                  <i className="fas fa-pause"></i>
                </button>
              </div>

              <button
                onClick={onEdit}
                className="bg-blue-600 hover:bg-blue-700 text-white px-3 py-1 rounded text-sm font-exo font-medium transition-colors flex items-center space-x-1"
              >
                <i className="fas fa-edit"></i>
                <span>Editar</span>
              </button>
              <button
                onClick={onDelete}
                className="bg-red-600 hover:bg-red-700 text-white px-3 py-1 rounded text-sm font-exo font-medium transition-colors flex items-center space-x-1"
              >
                <i className="fas fa-trash"></i>
                <span>Eliminar</span>
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}

export default AmbulanceRow
