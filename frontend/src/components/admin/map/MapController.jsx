import { useMapEvents } from 'react-leaflet'

/**
 * Controlador para eventos del mapa
 * ENFOQUE BALANCEADO: Solo manejo de eventos simples
 *
 * @param {Function} onMapClick - Callback para clicks en el mapa
 */
const MapController = ({ onMapClick }) => {
  // ============================================
  // VALIDACIÓN DE PROPS (Regla #4)
  // ============================================
  if (typeof onMapClick !== 'function') {
    console.error('MapController: onMapClick debe ser una función')
    return null
  }

  useMapEvents({
    click: onMapClick
  })

  return null
}

export default MapController
