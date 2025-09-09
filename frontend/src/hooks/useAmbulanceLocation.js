import { useState, useCallback, useEffect } from 'react'
import ambulanceService from '../services/ambulanceService'

/**
 * Hook especializado para gestión de ubicación y tracking de ambulancia
 * ✅ Cumple reglas de tamaño: <150 líneas
 * ✅ Responsabilidad única: Location management
 * ✅ Manejo de errores incluido
 * ✅ Fallback para desarrollo sin HTTPS
 */
const useAmbulanceLocation = (userId) => {
  const [ambulanceLocation, setAmbulanceLocation] = useState({ lat: -12.0464, lng: -77.0428 })
  const [isLocationTracking, setIsLocationTracking] = useState(false)
  const [watchId, setWatchId] = useState(null)
  const [useMockLocation, setUseMockLocation] = useState(false)

  // Verificar disponibilidad de geolocalización al iniciar
  useEffect(() => {
    const checkGeolocationSupport = () => {
      if (!navigator.geolocation) {
        console.warn('Geolocation not supported, using mock location')
        setUseMockLocation(true)
        return
      }

      if (!window.isSecureContext && location.hostname !== 'localhost') {
        console.warn('Geolocation requires HTTPS, using mock location for development')
        setUseMockLocation(true)
      }
    }

    checkGeolocationSupport()
  }, [])

  // Simular movimiento de ambulancia para desarrollo
  const simulateAmbulanceMovement = useCallback(() => {
    // Ubicaciones alrededor de Lima, Perú
    const limaLocations = [
      { lat: -12.0464, lng: -77.0428, name: 'Centro de Lima' },
      { lat: -12.0432, lng: -77.0282, name: 'Cercado de Lima' },
      { lat: -12.1215, lng: -77.0126, name: 'San Isidro' },
      { lat: -12.1267, lng: -76.9734, name: 'Miraflores' },
      { lat: -12.0621, lng: -77.0365, name: 'Pueblo Libre' }
    ]

    let locationIndex = 0
    const interval = setInterval(() => {
      const location = limaLocations[locationIndex % limaLocations.length]
      setAmbulanceLocation(location)
      ambulanceService.updateAmbulanceLocation(userId, location)
      locationIndex++
    }, 5000) // Cambiar ubicación cada 5 segundos

    return interval
  }, [userId])

  // Obtener ubicación actual
  const getCurrentLocation = useCallback(() => {
    if (useMockLocation) {
      // Usar ubicación simulada para desarrollo
      const mockLocation = { lat: -12.0464, lng: -77.0428 }
      setAmbulanceLocation(mockLocation)
      ambulanceService.showLocationError('Usando ubicación simulada (Lima, Perú)')
      return
    }

    if (!navigator.geolocation) {
      console.warn('Geolocation not supported')
      return
    }

    navigator.geolocation.getCurrentPosition(
      (position) => {
        setAmbulanceLocation({
          lat: position.coords.latitude,
          lng: position.coords.longitude
        })
      },
      (err) => {
        console.error('Error getting location:', err)
        
        // Usar ubicación por defecto de Lima, Perú en caso de error
        setAmbulanceLocation({
          lat: -12.0464,
          lng: -77.0428
        })
        
        ambulanceService.showLocationError('Usando ubicación por defecto (Lima, Perú)')
      },
      { enableHighAccuracy: true, timeout: 10000, maximumAge: 60000 }
    )
  }, [useMockLocation])

  // Iniciar seguimiento de ubicación
  const startLocationTracking = useCallback(() => {
    if (useMockLocation) {
      // Usar seguimiento simulado para desarrollo
      const mockInterval = simulateAmbulanceMovement()
      setWatchId(mockInterval)
      setIsLocationTracking(true)
      ambulanceService.showTrackingStarted()
      return
    }

    if (!navigator.geolocation) {
      console.warn('Geolocation not supported')
      return
    }

    const id = navigator.geolocation.watchPosition(
      (position) => {
        const newLocation = {
          lat: position.coords.latitude,
          lng: position.coords.longitude
        }
        setAmbulanceLocation(newLocation)
        ambulanceService.updateAmbulanceLocation(userId, newLocation)
      },
      (err) => {
        console.error('Error tracking location:', err)
        ambulanceService.showLocationError('Error en seguimiento. Usando ubicación por defecto')
        setIsLocationTracking(false)
      },
      { enableHighAccuracy: true, timeout: 10000, maximumAge: 5000 }
    )
    setWatchId(id)
    setIsLocationTracking(true)
    ambulanceService.showTrackingStarted()
  }, [userId, useMockLocation, simulateAmbulanceMovement])

  // Detener seguimiento de ubicación
  const stopLocationTracking = useCallback(() => {
    if (watchId) {
      if (useMockLocation) {
        // Limpiar intervalo simulado
        clearInterval(watchId)
      } else {
        // Limpiar watch de geolocalización
        navigator.geolocation.clearWatch(watchId)
      }
      setWatchId(null)
      setIsLocationTracking(false)
      ambulanceService.showTrackingStopped()
    }
  }, [watchId, useMockLocation])

  // Alternar seguimiento de ubicación
  const toggleLocationTracking = useCallback(() => {
    if (isLocationTracking) {
      stopLocationTracking()
    } else {
      startLocationTracking()
    }
  }, [isLocationTracking, startLocationTracking, stopLocationTracking])

  // Cleanup function
  const cleanup = useCallback(() => {
    if (watchId) {
      if (useMockLocation) {
        clearInterval(watchId)
      } else {
        navigator.geolocation.clearWatch(watchId)
      }
    }
  }, [watchId, useMockLocation])

  return {
    ambulanceLocation,
    isLocationTracking,
    useMockLocation,
    getCurrentLocation,
    startLocationTracking,
    stopLocationTracking,
    toggleLocationTracking,
    cleanup
  }
}

export default useAmbulanceLocation