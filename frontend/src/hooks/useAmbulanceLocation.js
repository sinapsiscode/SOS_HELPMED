import { useState, useCallback } from 'react'
import ambulanceService from '../services/ambulanceService'

/**
 * Hook especializado para gestión de ubicación y tracking de ambulancia
 * ✅ Cumple reglas de tamaño: <100 líneas
 * ✅ Responsabilidad única: Location management
 * ✅ Manejo de errores incluido
 */
const useAmbulanceLocation = (userId) => {
  const [ambulanceLocation, setAmbulanceLocation] = useState({ lat: -12.0464, lng: -77.0428 })
  const [isLocationTracking, setIsLocationTracking] = useState(false)
  const [watchId, setWatchId] = useState(null)

  // Obtener ubicación actual
  const getCurrentLocation = useCallback(() => {
    if (navigator.geolocation) {
      navigator.geolocation.getCurrentPosition(
        (position) => {
          setAmbulanceLocation({
            lat: position.coords.latitude,
            lng: position.coords.longitude
          })
        },
        (err) => {
          console.error('Error getting location:', err)
          ambulanceService.showLocationError()
        },
        { enableHighAccuracy: true, timeout: 10000, maximumAge: 60000 }
      )
    }
  }, [])

  // Iniciar seguimiento de ubicación
  const startLocationTracking = useCallback(() => {
    if (navigator.geolocation) {
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
          ambulanceService.showLocationError()
          setIsLocationTracking(false)
        },
        { enableHighAccuracy: true, timeout: 10000, maximumAge: 5000 }
      )
      setWatchId(id)
      setIsLocationTracking(true)
      ambulanceService.showTrackingStarted()
    }
  }, [userId])

  // Detener seguimiento de ubicación
  const stopLocationTracking = useCallback(() => {
    if (watchId) {
      navigator.geolocation.clearWatch(watchId)
      setWatchId(null)
      setIsLocationTracking(false)
      ambulanceService.showTrackingStopped()
    }
  }, [watchId])

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
      navigator.geolocation.clearWatch(watchId)
    }
  }, [watchId])

  return {
    ambulanceLocation,
    isLocationTracking,
    getCurrentLocation,
    startLocationTracking,
    stopLocationTracking,
    toggleLocationTracking,
    cleanup
  }
}

export default useAmbulanceLocation