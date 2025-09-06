import React from 'react'
import { Marker, Popup } from 'react-leaflet'
import { LABELS } from '../../../config/labels'

/**
 * ${LABELS.admin.map.unitMarkers.comments.title}
 * ${LABELS.admin.map.unitMarkers.comments.approach}
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
  const labels = LABELS.admin.map.unitMarkers

  // ============================================
  // VALIDACIÓN DE PROPS (Regla #4)
  // ============================================
  if (!Array.isArray(availableUnits)) {
    console.error(labels.errors.availableUnitsArray)
    return null
  }

  if (!Array.isArray(busyUnits)) {
    console.error(labels.errors.busyUnitsArray)
    return null
  }

  if (typeof getUnitIcon !== 'function') {
    console.error(labels.errors.getUnitIconFunction)
    return null
  }

  if (typeof getUnitStatusClass !== 'function') {
    console.error(labels.errors.getUnitStatusClassFunction)
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
                  {labels.popup.status.available}
                </span>
              </div>
              <div className="space-y-1 text-sm">
                <p>
                  <strong>{labels.popup.labels.driver}</strong> {unit.profile?.name}
                </p>
                <p>
                  <strong>{labels.popup.labels.type}</strong> {unit.ambulance?.type}
                </p>
                <p>
                  <strong>{labels.popup.labels.plate}</strong> {unit.ambulance?.plate}
                </p>
                <p>
                  <strong>{labels.popup.labels.services}</strong> {unit.stats?.completedServices || 0}{labels.popup.labels.completed}
                </p>
              </div>
              <button
                onClick={() => handleUnitClick && handleUnitClick(unit)}
                className="w-full mt-2 bg-green-600 hover:bg-green-700 text-white px-3 py-1 rounded text-sm font-medium transition-colors"
              >
                {labels.popup.button.selectForAssignment}
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
                  {unit.currentStatus === 'en_route' ? labels.popup.status.enRoute : labels.popup.status.onSite}
                </span>
              </div>
              <div className="space-y-1 text-sm">
                <p>
                  <strong>{labels.popup.labels.driver}</strong> {unit.profile?.name}
                </p>
                <p>
                  <strong>{labels.popup.labels.status}</strong>{' '}
                  {unit.currentStatus === 'en_route' ? labels.popup.status.enRouteText : labels.popup.status.onSiteText}
                </p>
                <p>
                  <strong>{labels.popup.labels.services}</strong> {unit.stats?.completedServices || 0}{labels.popup.labels.completed}
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
