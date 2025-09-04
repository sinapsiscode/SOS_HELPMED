import React from 'react'
import { MapContainer, TileLayer, Marker, Popup } from 'react-leaflet'
import L from 'leaflet'
import ambulanceTrackingService from '../../services/ambulanceTrackingService'
import 'leaflet/dist/leaflet.css'

// Fix para los iconos de Leaflet
delete L.Icon.Default.prototype._getIconUrl
L.Icon.Default.mergeOptions({
  iconRetinaUrl: 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.7.1/images/marker-icon-2x.png',
  iconUrl: 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.7.1/images/marker-icon.png',
  shadowUrl: 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.7.1/images/marker-shadow.png'
})

// Configuración de iconos desde el servicio
const iconConfig = ambulanceTrackingService.getLeafletIconConfig()

const ambulanceIcon = new L.Icon(iconConfig.ambulanceIcon)
const userIcon = new L.Icon(iconConfig.userIcon)

/**
 * Componente de mapa para seguimiento de ambulancia
 * Siguiendo Regla #3: Componente específico <200 líneas
 * Siguiendo Regla #2: Solo presentación
 *
 * @param {Object} props - Props del componente
 * @param {Object} props.mapData - Datos del mapa
 * @param {Object} props.trackingMetrics - Métricas de seguimiento
 * @param {boolean} props.mapLoaded - Si el mapa está cargado
 * @param {Function} props.onLoadMap - Función para cargar el mapa
 * @returns {JSX.Element} Mapa de seguimiento
 */
const TrackingMap = ({ mapData, trackingMetrics, mapLoaded, onLoadMap }) => {
  const { center, ambulancePosition, userPosition, zoom } = mapData
  const { eta, distance, ambulanceId } = trackingMetrics

  if (!mapLoaded) {
    return (
      <div className="relative h-64 bg-gray-100">
        <div className="absolute inset-0 flex items-center justify-center">
          <div className="text-center">
            <div className="w-12 h-12 border-4 border-gray-300 border-t-red-600 rounded-full animate-spin mb-4"></div>
            <p className="text-gray-600 mb-4 font-roboto">Cargando mapa...</p>
            <button
              onClick={onLoadMap}
              className="bg-red-600 hover:bg-red-700 text-white px-4 py-2 rounded-lg transition-colors text-sm font-roboto"
            >
              Cargar mapa ahora
            </button>
          </div>
        </div>
      </div>
    )
  }

  return (
    <div className="relative h-64 bg-gray-100">
      <MapContainer
        center={center}
        zoom={zoom}
        style={{ height: '100%', width: '100%' }}
        zoomControl={false}
      >
        <TileLayer
          url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
          attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
        />

        {/* Marcador de ambulancia */}
        <Marker position={ambulancePosition} icon={ambulanceIcon}>
          <Popup>
            <div className="text-center">
              <div className="text-red-600 font-bold mb-1 font-exo">
                <i className="fas fa-ambulance mr-2"></i>
                Ambulancia {ambulanceId}
              </div>
              <div className="text-sm text-gray-600 font-roboto">Tiempo estimado: {eta}</div>
              <div className="text-sm text-gray-600 font-roboto">Distancia: {distance}</div>
            </div>
          </Popup>
        </Marker>

        {/* Marcador del usuario */}
        <Marker position={userPosition} icon={userIcon}>
          <Popup>
            <div className="text-center">
              <div className="text-blue-600 font-bold mb-1 font-exo">
                <i className="fas fa-map-marker-alt mr-2"></i>
                Tu ubicación
              </div>
              <div className="text-sm text-gray-600 font-roboto">Esperando ambulancia</div>
            </div>
          </Popup>
        </Marker>
      </MapContainer>

      {/* Overlay con información */}
      <div className="absolute top-2 left-2 bg-white bg-opacity-90 rounded-lg p-2 text-xs shadow-md">
        <div className="flex items-center space-x-2">
          <div className="w-3 h-3 bg-red-500 rounded-full"></div>
          <span className="font-roboto">Ambulancia {ambulanceId}</span>
        </div>
        <div className="flex items-center space-x-2 mt-1">
          <div className="w-3 h-3 bg-blue-500 rounded-full"></div>
          <span className="font-roboto">Tu ubicación</span>
        </div>
      </div>

      {/* Controles del mapa */}
      <div className="absolute bottom-2 right-2 bg-white bg-opacity-90 rounded-lg p-1 shadow-md">
        <button
          className="p-2 hover:bg-gray-100 rounded text-gray-600"
          title="Centrar mapa"
          onClick={() => window.location.reload()} // Simulación de centrar
        >
          <i className="fas fa-crosshairs"></i>
        </button>
      </div>
    </div>
  )
}

export default TrackingMap
