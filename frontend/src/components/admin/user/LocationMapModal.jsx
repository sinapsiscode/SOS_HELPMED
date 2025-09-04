import React, { useState, useEffect } from 'react'

/**
 * Modal con mapa interactivo para seleccionar ubicación
 * Usa OpenStreetMap sin necesidad de API keys
 */
const LocationMapModal = ({ isOpen, onClose, onSelectLocation, initialCoordinates }) => {
  const [selectedLat, setSelectedLat] = useState(initialCoordinates?.lat || -12.0464)
  const [selectedLng, setSelectedLng] = useState(initialCoordinates?.lng || -77.0428)
  const [address, setAddress] = useState('')
  const [isLoadingAddress, setIsLoadingAddress] = useState(false)

  // Coordenadas por defecto (Lima, Perú)
  const defaultLat = -12.0464
  const defaultLng = -77.0428

  useEffect(() => {
    if (!isOpen) return

    // Cargar scripts de Leaflet dinámicamente
    const loadLeaflet = async () => {
      // Verificar si ya está cargado
      if (window.L) {
        initializeMap()
        return
      }

      // Cargar CSS de Leaflet
      const link = document.createElement('link')
      link.rel = 'stylesheet'
      link.href = 'https://unpkg.com/leaflet@1.9.4/dist/leaflet.css'
      document.head.appendChild(link)

      // Cargar JS de Leaflet
      const script = document.createElement('script')
      script.src = 'https://unpkg.com/leaflet@1.9.4/dist/leaflet.js'
      script.async = true
      script.onload = () => {
        initializeMap()
      }
      document.body.appendChild(script)
    }

    const initializeMap = () => {
      // Limpiar mapa anterior si existe
      const container = document.getElementById('location-map')
      if (container && container._leaflet_id) {
        container._leaflet = null
        container._leaflet_id = null
        while (container.firstChild) {
          container.removeChild(container.firstChild)
        }
      }

      // Crear nuevo mapa
      const map = window.L.map('location-map').setView(
        [selectedLat || defaultLat, selectedLng || defaultLng], 
        15
      )

      // Agregar tiles de OpenStreetMap
      window.L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
        attribution: '© OpenStreetMap contributors'
      }).addTo(map)

      // Marcador inicial
      const marker = window.L.marker([selectedLat || defaultLat, selectedLng || defaultLng], {
        draggable: true
      }).addTo(map)

      // Evento de clic en el mapa
      map.on('click', (e) => {
        const { lat, lng } = e.latlng
        marker.setLatLng([lat, lng])
        setSelectedLat(lat)
        setSelectedLng(lng)
        reverseGeocode(lat, lng)
      })

      // Evento de arrastre del marcador
      marker.on('dragend', (e) => {
        const { lat, lng } = e.target.getLatLng()
        setSelectedLat(lat)
        setSelectedLng(lng)
        reverseGeocode(lat, lng)
      })

      // Obtener dirección inicial si hay coordenadas
      if (selectedLat && selectedLng) {
        reverseGeocode(selectedLat, selectedLng)
      }
    }

    loadLeaflet()
  }, [isOpen])

  // Obtener dirección desde coordenadas (Reverse Geocoding)
  const reverseGeocode = async (lat, lng) => {
    setIsLoadingAddress(true)
    try {
      const response = await fetch(
        `https://nominatim.openstreetmap.org/reverse?format=json&lat=${lat}&lon=${lng}&zoom=18&addressdetails=1`
      )
      const data = await response.json()
      
      if (data && data.display_name) {
        setAddress(data.display_name)
      } else {
        setAddress(`Lat: ${lat.toFixed(6)}, Lng: ${lng.toFixed(6)}`)
      }
    } catch (error) {
      console.error('Error obteniendo dirección:', error)
      setAddress(`Lat: ${lat.toFixed(6)}, Lng: ${lng.toFixed(6)}`)
    }
    setIsLoadingAddress(false)
  }

  // Buscar ubicación por dirección
  const searchAddress = async () => {
    if (!address.trim()) return

    setIsLoadingAddress(true)
    try {
      const response = await fetch(
        `https://nominatim.openstreetmap.org/search?format=json&q=${encodeURIComponent(address)}&limit=1`
      )
      const data = await response.json()
      
      if (data && data.length > 0) {
        const { lat, lon, display_name } = data[0]
        setSelectedLat(parseFloat(lat))
        setSelectedLng(parseFloat(lon))
        setAddress(display_name)
        
        // Mover el mapa y marcador
        if (window.L) {
          const map = document.getElementById('location-map')._leaflet
          if (map) {
            map.setView([lat, lon], 16)
          }
        }
      } else {
        alert('No se encontró la dirección. Intente ser más específico.')
      }
    } catch (error) {
      console.error('Error buscando dirección:', error)
      alert('Error al buscar la dirección')
    }
    setIsLoadingAddress(false)
  }

  const handleConfirm = () => {
    onSelectLocation({
      lat: selectedLat,
      lng: selectedLng,
      address: address
    })
    onClose()
  }

  const handleUseMyLocation = () => {
    if (navigator.geolocation) {
      navigator.geolocation.getCurrentPosition(
        (position) => {
          const { latitude, longitude } = position.coords
          setSelectedLat(latitude)
          setSelectedLng(longitude)
          reverseGeocode(latitude, longitude)
          
          // Mover el mapa
          if (window.L) {
            const mapElement = document.getElementById('location-map')
            if (mapElement && mapElement._leaflet) {
              mapElement._leaflet.setView([latitude, longitude], 16)
            }
          }
        },
        () => {
          alert('No se pudo obtener tu ubicación actual')
        }
      )
    }
  }

  if (!isOpen) return null

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
      <div className="bg-white rounded-xl shadow-xl max-w-4xl w-full max-h-[90vh] overflow-hidden">
        {/* Header */}
        <div className="flex items-center justify-between p-4 border-b">
          <h2 className="text-xl font-semibold text-gray-800">
            <i className="fas fa-map-marked-alt mr-2 text-red-500"></i>
            Seleccionar Ubicación en el Mapa
          </h2>
          <button
            onClick={onClose}
            className="text-gray-400 hover:text-gray-600 transition-colors"
          >
            <i className="fas fa-times text-xl"></i>
          </button>
        </div>

        <div className="p-4 space-y-4">
          {/* Barra de búsqueda */}
          <div className="flex gap-2">
            <input
              type="text"
              value={address}
              onChange={(e) => setAddress(e.target.value)}
              onKeyPress={(e) => e.key === 'Enter' && searchAddress()}
              placeholder="Buscar dirección... (Ej: Av. Arequipa 1234, Lima)"
              className="flex-1 px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500"
              disabled={isLoadingAddress}
            />
            <button
              onClick={searchAddress}
              disabled={isLoadingAddress}
              className="px-4 py-2 bg-blue-600 hover:bg-blue-700 text-white rounded-lg transition-colors disabled:opacity-50"
            >
              <i className="fas fa-search mr-2"></i>
              Buscar
            </button>
            <button
              onClick={handleUseMyLocation}
              className="px-4 py-2 bg-green-600 hover:bg-green-700 text-white rounded-lg transition-colors"
            >
              <i className="fas fa-location-arrow mr-2"></i>
              Mi Ubicación
            </button>
          </div>

          {/* Mapa */}
          <div className="relative">
            <div 
              id="location-map" 
              className="h-96 w-full rounded-lg border border-gray-300"
              style={{ minHeight: '400px' }}
            ></div>
            
            {/* Instrucciones */}
            <div className="absolute bottom-4 left-4 bg-white bg-opacity-95 rounded-lg p-3 shadow-lg max-w-xs">
              <p className="text-xs text-gray-700 font-medium mb-1">
                <i className="fas fa-info-circle mr-1 text-blue-500"></i>
                Instrucciones:
              </p>
              <ul className="text-xs text-gray-600 space-y-1">
                <li>• Haz clic en el mapa para seleccionar</li>
                <li>• Arrastra el marcador para ajustar</li>
                <li>• Usa la búsqueda para encontrar direcciones</li>
              </ul>
            </div>
          </div>

          {/* Coordenadas seleccionadas */}
          <div className="bg-gray-50 rounded-lg p-4">
            <div className="grid grid-cols-2 gap-4">
              <div>
                <label className="text-sm font-medium text-gray-700">Latitud</label>
                <p className="text-lg font-mono text-gray-900">{selectedLat.toFixed(6)}</p>
              </div>
              <div>
                <label className="text-sm font-medium text-gray-700">Longitud</label>
                <p className="text-lg font-mono text-gray-900">{selectedLng.toFixed(6)}</p>
              </div>
            </div>
            {address && (
              <div className="mt-3 pt-3 border-t border-gray-200">
                <label className="text-sm font-medium text-gray-700">Dirección detectada</label>
                <p className="text-sm text-gray-900 mt-1">{address}</p>
              </div>
            )}
          </div>
        </div>

        {/* Footer */}
        <div className="flex items-center justify-end space-x-3 p-4 border-t">
          <button
            onClick={onClose}
            className="px-6 py-2 bg-gray-500 hover:bg-gray-600 text-white rounded-lg transition-colors"
          >
            Cancelar
          </button>
          <button
            onClick={handleConfirm}
            className="px-6 py-2 bg-red-600 hover:bg-red-700 text-white rounded-lg transition-colors"
          >
            <i className="fas fa-check mr-2"></i>
            Confirmar Ubicación
          </button>
        </div>
      </div>
    </div>
  )
}

export default LocationMapModal