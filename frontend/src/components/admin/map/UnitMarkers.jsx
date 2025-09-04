import React from 'react'
import { Marker, Popup } from 'react-leaflet'

/**
 * Componente de marcadores de unidades médicas
 * ENFOQUE BALANCEADO: Solo presentación con validación de props
 *
 * @param {Array} availableUnits - Unidades disponibles
 * @param {Array} busyUnits - Unidades ocupadas
 * @param {Function} getUnitIcon - Función para obtener icono
 * @param {Function} handleUnitClick - Función para click en unidad
 * @param {Function} getUnitStatusClass - Función para obtener clase de estado
 */
const UnitMarkers = ({
  availableUnits,
  busyUnits,
  getUnitIcon,
  handleUnitClick,
  getUnitStatusClass
}) => {
  // ============================================
  // VALIDACIÓN DE PROPS (Regla #4)
  // ============================================
  if (!Array.isArray(availableUnits)) {
    console.error('UnitMarkers: availableUnits debe ser un array')
    return null
  }

  if (!Array.isArray(busyUnits)) {
    console.error('UnitMarkers: busyUnits debe ser un array')
    return null
  }

  if (typeof getUnitIcon !== 'function') {
    console.error('UnitMarkers: getUnitIcon debe ser una función')
    return null
  }

  if (typeof getUnitStatusClass !== 'function') {
    console.error('UnitMarkers: getUnitStatusClass debe ser una función')
    return null
  }

  return (
    <>
      {/* Available Unit Markers */}
      {availableUnits.map((unit) => (
        <Marker
          key={unit.id}
          position={[unit.location.latitude, unit.location.longitude]}
          icon={getUnitIcon(unit)}
          eventHandlers={{
            click: () => handleUnitClick && handleUnitClick(unit)
          }}
        >
          <Popup>
            <div className="w-64">
              <div className="flex items-center space-x-2 mb-2">
                <i className="fas fa-ambulance text-green-600"></i>
                <h4 className="font-exo font-semibold">{unit.ambulance?.unit_id}</h4>
                <span className="px-2 py-1 bg-green-100 text-green-800 rounded text-xs font-medium">
                  DISPONIBLE
                </span>
              </div>
              <div className="space-y-1 text-sm">
                <p>
                  <strong>Conductor:</strong> {unit.profile?.name}
                </p>
                <p>
                  <strong>Tipo:</strong> {unit.ambulance?.type}
                </p>
                <p>
                  <strong>Placa:</strong> {unit.ambulance?.plate}
                </p>
                <p>
                  <strong>Servicios:</strong> {unit.stats?.completedServices || 0} completados
                </p>
              </div>
              <button
                onClick={() => handleUnitClick && handleUnitClick(unit)}
                className="w-full mt-2 bg-green-600 hover:bg-green-700 text-white px-3 py-1 rounded text-sm font-medium transition-colors"
              >
                Seleccionar para Asignación
              </button>
            </div>
          </Popup>
        </Marker>
      ))}

      {/* Busy Unit Markers */}
      {busyUnits.map((unit) => (
        <Marker
          key={unit.id}
          position={[unit.location.latitude, unit.location.longitude]}
          icon={getUnitIcon(unit)}
        >
          <Popup>
            <div className="w-64">
              <div className="flex items-center space-x-2 mb-2">
                <i className="fas fa-ambulance text-blue-600"></i>
                <h4 className="font-exo font-semibold">{unit.ambulance?.unit_id}</h4>
                <span className={getUnitStatusClass(unit.currentStatus)}>
                  {unit.currentStatus === 'en_route' ? 'EN CAMINO' : 'EN SITIO'}
                </span>
              </div>
              <div className="space-y-1 text-sm">
                <p>
                  <strong>Conductor:</strong> {unit.profile?.name}
                </p>
                <p>
                  <strong>Estado:</strong>{' '}
                  {unit.currentStatus === 'en_route' ? 'En camino' : 'En sitio'}
                </p>
                <p>
                  <strong>Servicios:</strong> {unit.stats?.completedServices || 0} completados
                </p>
              </div>
            </div>
          </Popup>
        </Marker>
      ))}
    </>
  )
}

export default UnitMarkers
