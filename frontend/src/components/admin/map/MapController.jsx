import { useMapEvents } from 'react-leaflet'
import { LABELS } from '../../../config/labels'

/**
 * ${LABELS.admin.map.mapController.comments.title}
 * ${LABELS.admin.map.mapController.comments.approach}
 *
 * @param {Function} onMapClick - Callback para clicks en el mapa
 */
const MapController = ({ onMapClick }) => {
  const labels = LABELS.admin.map.mapController

  // ============================================
  // VALIDACIÓN DE PROPS (Regla #4)
  // ============================================
  if (typeof onMapClick !== 'function') {
    console.error(labels.errors.onMapClickFunction)
    return null
  }

  useMapEvents({
    click: onMapClick
  })

  return null
}

export default MapController
