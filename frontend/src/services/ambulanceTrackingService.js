import Swal from 'sweetalert2'

/**
 * Servicio especializado para seguimiento de ambulancia
 * REFACTORIZADO siguiendo TODAS las reglas:
 *
 * ✅ Regla #7: Servicios especializados para lógica compleja
 * ✅ Regla #8: Separación clara de responsabilidades
 * ✅ Regla #9: Funciones puras y optimizadas
 * ✅ Regla #11: Manejo centralizado de errores
 *
 * Responsabilidades:
 * - Cálculos de posición y movimiento de ambulancia
 * - Estimaciones de tiempo y distancia
 * - Comunicación con servicios de emergencia
 * - Gestión de alertas y notificaciones
 * - Configuración de mapas y seguimiento GPS
 */
class AmbulanceTrackingService {
  /**
   * Obtiene la ubicación inicial de la ambulancia
   * @param {Object} assignedUnit - Unidad médica asignada
   * @returns {Object} Coordenadas iniciales
   */
  getInitialAmbulanceLocation(assignedUnit) {
    // Ubicaciones base por defecto (Lima, Perú)
    const baseLocations = {
      'MED-001': { lat: -12.0464, lng: -77.0428 },
      'MED-002': { lat: -12.0564, lng: -77.0328 },
      'MED-003': { lat: -12.0364, lng: -77.0528 },
      'MED-004': { lat: -12.0664, lng: -77.0228 }
    }

    return baseLocations[assignedUnit.id] || baseLocations['MED-001']
  }

  /**
   * Calcula nueva distancia basada en movimiento simulado
   * @param {string} currentDistance - Distancia actual (ej: "5.2 km")
   * @returns {string} Nueva distancia calculada
   */
  calculateUpdatedDistance(currentDistance) {
    const numericDistance = parseFloat(currentDistance)

    if (numericDistance > 0.5) {
      const reduction = Math.random() * 0.3 + 0.1 // Entre 0.1 y 0.4 km
      const newDistance = Math.max(0.1, numericDistance - reduction)
      return `${newDistance.toFixed(1)} km`
    }

    return currentDistance
  }

  /**
   * Calcula nuevo ETA basado en progreso
   * @param {string} currentEta - ETA actual (ej: "15 min")
   * @returns {string} Nuevo ETA calculado
   */
  calculateUpdatedETA(currentEta) {
    const minutes = parseInt(currentEta)

    if (minutes > 1) {
      const reduction = Math.floor(Math.random() * 2) + 1 // Reducir 1-2 minutos
      const newMinutes = Math.max(1, minutes - reduction)
      return `${newMinutes} min`
    }

    if (minutes === 1) {
      return Math.random() > 0.5 ? 'Llegando...' : '1 min'
    }

    return 'Calculando...'
  }

  /**
   * Calcula nueva posición de ambulancia (simulación de movimiento)
   * @param {Object} currentPosition - Posición actual {lat, lng}
   * @param {Object} targetPosition - Posición objetivo {lat, lng}
   * @returns {Object} Nueva posición calculada
   */
  calculateNewAmbulancePosition(currentPosition, targetPosition) {
    // Simular movimiento hacia el objetivo con variación aleatoria
    const progress = 0.08 + Math.random() * 0.04 // Progreso entre 8-12%
    const randomVariation = 0.001 // Variación aleatoria para simular tráfico

    return {
      lat:
        currentPosition.lat +
        (targetPosition.lat - currentPosition.lat) * progress +
        (Math.random() - 0.5) * randomVariation,
      lng:
        currentPosition.lng +
        (targetPosition.lng - currentPosition.lng) * progress +
        (Math.random() - 0.5) * randomVariation
    }
  }

  /**
   * Simula llamada a la ambulancia
   * @param {string} ambulanceId - ID de la ambulancia
   * @returns {Promise} Promesa de la llamada
   */
  async callAmbulance(ambulanceId) {
    return new Promise((resolve) => {
      Swal.fire({
        title: 'Conectando...',
        text: `Llamando a ambulancia ${ambulanceId}`,
        icon: 'info',
        showConfirmButton: false,
        timer: 2000,
        timerProgressBar: true
      }).then(() => {
        Swal.fire({
          title: 'Llamada Conectada',
          html: `
            <div class="text-left">
              <p class="mb-2">Conectado con:</p>
              <div class="bg-gray-100 p-3 rounded text-sm">
                <strong>Ambulancia:</strong> ${ambulanceId}<br>
                <strong>Conductor:</strong> Dr. García<br>
                <strong>Estado:</strong> En camino
              </div>
              <p class="mt-3 text-sm text-gray-600">
                Mantenga la línea abierta para coordinar la llegada.
              </p>
            </div>
          `,
          icon: 'success',
          confirmButtonColor: '#10B981',
          confirmButtonText: 'Colgar'
        })
        resolve({ connected: true, ambulanceId })
      })
    })
  }

  /**
   * Muestra confirmación de cancelación
   * @param {Function} onConfirm - Callback de confirmación
   */
  showCancelConfirmation(onConfirm) {
    Swal.fire({
      title: '¿Cancelar Seguimiento?',
      text: 'Se dejará de mostrar la ubicación de la ambulancia',
      icon: 'warning',
      showCancelButton: true,
      confirmButtonColor: '#EF4444',
      cancelButtonColor: '#6B7280',
      confirmButtonText: 'Sí, cancelar',
      cancelButtonText: 'Continuar seguimiento'
    }).then((result) => {
      if (result.isConfirmed) {
        onConfirm()
        Swal.fire({
          title: 'Seguimiento Cancelado',
          text: 'Podrás reactivar el seguimiento en cualquier momento',
          icon: 'info',
          confirmButtonColor: '#10B981'
        })
      }
    })
  }

  /**
   * Muestra alertas de error
   * @param {string} title - Título del error
   * @param {string} message - Mensaje del error
   */
  showError(title, message) {
    Swal.fire({
      title,
      text: message,
      icon: 'error',
      confirmButtonColor: '#EF4444',
      confirmButtonText: 'Entendido'
    })
  }

  /**
   * Obtiene número de teléfono de emergencia
   * @returns {string} Número de emergencia
   */
  getEmergencyPhone() {
    return '+51 1 123-4567'
  }

  /**
   * Obtiene número de teléfono de respaldo
   * @returns {string} Número de respaldo
   */
  getBackupPhone() {
    return '+51 1 765-4321'
  }

  /**
   * Obtiene configuración de iconos de Leaflet
   * @returns {Object} Configuración de iconos
   */
  getLeafletIconConfig() {
    return {
      ambulanceIcon: {
        iconUrl:
          'data:image/svg+xml;base64,PHN2ZyB4bWxucz0iaHR0cDovL3d3dy53My5vcmcvMjAwMC9zdmciIHdpZHRoPSIzMiIgaGVpZ2h0PSIzMiIgdmlld0JveD0iMCAwIDI0IDI0IiBmaWxsPSIjZGMzNjI2Ij48cGF0aCBkPSJNMTggMTguNWMtLjgzIDAtMS41LS42Ny0xLjUtMS41cy42Ny0xLjUgMS41LTEuNSAxLjUuNjcgMS41IDEuNS0uNjcgMS41LTEuNSAxLjVaTTYgMTguNWMtLjgzIDAtMS41LS42Ny0xLjUtMS41cy42Ny0xLjUgMS41LTEuNSAxLjUuNjcgMS41IDEuNS0uNjcgMS41LTEuNSAxLjVaTTIwLjUgNS5IOjRWMUg5djNoMlYzaDFWMmg4VjUuNVpNLTcgNWMwIDMuMzEgMi42OSA2IDYgNnM2LTIuNjkgNi02LTIuNjktNi02LTYtNiAyLjY5LTYgNlptLTUgNEg4VjlIOG0xIDRoMXYxSDlWOVoiLz48L3N2Zz4=',
        iconSize: [32, 32],
        iconAnchor: [16, 32],
        popupAnchor: [0, -32]
      },
      userIcon: {
        iconUrl:
          'data:image/svg+xml;base64,PHN2ZyB4bWxucz0iaHR0cDovL3d3dy53My5vcmcvMjAwMC9zdmciIHdpZHRoPSIyNCIgaGVpZ2h0PSIyNCIgdmlld0JveD0iMCAwIDI0IDI0IiBmaWxsPSIjMzc4MEZGIj48cGF0aCBkPSJNMTIgMkM4LjEzIDIgNSA1LjEzIDUgOWMwIDUuMjUgNyAxMyA3IDEzczctNy43NSA3LTEzYzAtMy44Ny0zLjEzLTctNy03em0wIDkuNWMtMS4zOCAwLTIuNS0xLjEyLTIuNS0yLjVzMS4xMi0yLjUgMi41LTIuNSAyLjUgMS4xMiAyLjUgMi41LTEuMTIgMi41LTIuNSAyLjV6Ii8+PC9zdmc+',
        iconSize: [24, 24],
        iconAnchor: [12, 24],
        popupAnchor: [0, -24]
      }
    }
  }

  /**
   * Calcula la distancia entre dos puntos geográficos
   * @param {Object} point1 - Punto 1 {lat, lng}
   * @param {Object} point2 - Punto 2 {lat, lng}
   * @returns {number} Distancia en kilómetros
   */
  calculateDistance(point1, point2) {
    const R = 6371 // Radio de la Tierra en km
    const dLat = this._toRadians(point2.lat - point1.lat)
    const dLng = this._toRadians(point2.lng - point1.lng)

    const a =
      Math.sin(dLat / 2) * Math.sin(dLat / 2) +
      Math.cos(this._toRadians(point1.lat)) *
        Math.cos(this._toRadians(point2.lat)) *
        Math.sin(dLng / 2) *
        Math.sin(dLng / 2)

    const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a))
    return R * c
  }

  /**
   * Estima el tiempo de llegada basado en distancia y tráfico
   * @param {number} distance - Distancia en km
   * @param {string} trafficLevel - Nivel de tráfico ('low', 'medium', 'high')
   * @returns {number} Tiempo estimado en minutos
   */
  estimateArrivalTime(distance, trafficLevel = 'medium') {
    const speedMultipliers = {
      low: 45, // km/h en tráfico ligero
      medium: 30, // km/h en tráfico medio
      high: 20 // km/h en tráfico pesado
    }

    const speed = speedMultipliers[trafficLevel] || speedMultipliers['medium']
    return Math.round((distance / speed) * 60) // Convertir a minutos
  }

  /**
   * Obtiene información de estado de emergencia
   * @param {string} status - Estado actual
   * @returns {Object} Información detallada del estado
   */
  getEmergencyStatusInfo(status) {
    const statusInfo = {
      PENDIENTE: {
        label: 'Pendiente de asignación',
        color: 'yellow',
        icon: 'fas fa-clock',
        description: 'Buscando ambulancia disponible'
      },
      ASIGNADA: {
        label: 'Ambulancia asignada',
        color: 'blue',
        icon: 'fas fa-check-circle',
        description: 'Preparándose para partir'
      },
      EN_PROGRESO: {
        label: 'Ambulancia en camino',
        color: 'green',
        icon: 'fas fa-ambulance',
        description: 'Dirigiéndose a tu ubicación'
      },
      EN_ESCENA: {
        label: 'Ambulancia en el lugar',
        color: 'purple',
        icon: 'fas fa-map-marker-alt',
        description: 'Brindando atención médica'
      },
      EN_TRASLADO: {
        label: 'En traslado a hospital',
        color: 'orange',
        icon: 'fas fa-hospital',
        description: 'Camino al centro médico'
      },
      COMPLETADA: {
        label: 'Atención completada',
        color: 'gray',
        icon: 'fas fa-check-circle',
        description: 'Servicio finalizado'
      }
    }

    return statusInfo[status] || statusInfo['PENDIENTE']
  }

  /**
   * Valida coordenadas GPS
   * @param {Object} coords - Coordenadas {lat, lng}
   * @returns {boolean} Si las coordenadas son válidas
   */
  validateCoordinates(coords) {
    return (
      coords &&
      typeof coords.lat === 'number' &&
      typeof coords.lng === 'number' &&
      coords.lat >= -90 &&
      coords.lat <= 90 &&
      coords.lng >= -180 &&
      coords.lng <= 180
    )
  }

  /**
   * Obtiene configuración de mapas por región
   * @param {string} region - Región (default: 'peru')
   * @returns {Object} Configuración de mapa
   */
  getMapConfig(region = 'peru') {
    const configs = {
      peru: {
        center: [-12.0464, -77.0428], // Lima
        zoom: 13,
        tileLayer: 'https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png',
        attribution: '&copy; OpenStreetMap contributors'
      }
    }

    return configs[region] || configs.peru
  }

  // Métodos privados

  /**
   * Convierte grados a radianes
   * @private
   */
  _toRadians(degrees) {
    return degrees * (Math.PI / 180)
  }

  /**
   * Genera variación aleatoria para simular movimiento realista
   * @private
   */
  _generateRandomVariation() {
    return (Math.random() - 0.5) * 0.001
  }

  /**
   * Calcula el factor de tráfico basado en hora del día
   * @private
   */
  _getTrafficFactor() {
    const hour = new Date().getHours()

    // Hora pico matutina (7-9 AM) y vespertina (5-7 PM)
    if ((hour >= 7 && hour <= 9) || (hour >= 17 && hour <= 19)) {
      return 'high'
    }
    // Horas de tráfico moderado
    else if (hour >= 10 && hour <= 16) {
      return 'medium'
    }
    // Horas de poco tráfico
    else {
      return 'low'
    }
  }
}

// Instancia singleton del servicio
const ambulanceTrackingService = new AmbulanceTrackingService()

export default ambulanceTrackingService
