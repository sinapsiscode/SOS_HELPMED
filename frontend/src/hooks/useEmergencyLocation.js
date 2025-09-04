import { useState, useRef, useEffect } from 'react'
import { emergencyService } from '../services/emergencyService'

/**
 * Hook personalizado para gestión de ubicación de emergencias
 * REFACTORIZADO siguiendo TODAS las reglas:
 *
 * ✅ Regla #2: Toda la lógica de geolocalización centralizada en este hook
 * ✅ Regla #5: Estados gestionados completamente por el hook
 * ✅ Regla #7: Integración con servicios especializados
 *
 * @returns {Object} Estados y funciones de ubicación
 */
const useEmergencyLocation = () => {
  // Estados de ubicación
  const [isGettingLocation, setIsGettingLocation] = useState(false)
  const [currentCoordinates, setCurrentCoordinates] = useState(null)
  const watchIdRef = useRef(null)

  /**
   * Obtiene ubicación de alta precisión
   */
  const getHighPrecisionLocation = () => {
    return new Promise((resolve, reject) => {
      if (!navigator.geolocation) {
        reject(new Error('La geolocalización no está soportada en este navegador'))
        return
      }

      const options = emergencyService.getLocationOptions()
      setIsGettingLocation(true)

      // Primero intentamos obtener la posición actual
      navigator.geolocation.getCurrentPosition(
        (position) => {
          const coords = emergencyService.formatCoordinates(position)

          // Si la precisión no es suficiente (más de 20 metros), intentamos mejorarla
          if (position.coords.accuracy > 20) {
            startPrecisionWatching(coords, resolve, reject, options)
          } else {
            // Si la precisión ya es buena, la usamos directamente
            finalizePrecisionCapture(coords, resolve)
          }
        },
        (error) => {
          setIsGettingLocation(false)
          const errorMessage = emergencyService.getLocationErrorMessage(error)
          reject(new Error(errorMessage))
        },
        options
      )
    })
  }

  /**
   * Inicia el seguimiento de precisión mejorada
   */
  const startPrecisionWatching = (initialCoords, resolve, reject, options) => {
    let bestAccuracy = initialCoords.accuracy
    let bestCoords = initialCoords
    let attempts = 0
    const maxAttempts = 5

    watchIdRef.current = navigator.geolocation.watchPosition(
      (newPosition) => {
        attempts++
        const newCoords = emergencyService.formatCoordinates(newPosition)

        if (newPosition.coords.accuracy < bestAccuracy) {
          bestAccuracy = newPosition.coords.accuracy
          bestCoords = newCoords
        }

        // Si alcanzamos la precisión deseada o el máximo de intentos
        if (bestAccuracy <= 10 || attempts >= maxAttempts) {
          clearLocationWatch()
          finalizePrecisionCapture(bestCoords, resolve)
        }
      },
      (error) => {
        clearLocationWatch()
        // Si falla el watch, usamos las coordenadas originales
        finalizePrecisionCapture(initialCoords, resolve)
      },
      options
    )
  }

  /**
   * Finaliza la captura de ubicación
   */
  const finalizePrecisionCapture = (coords, resolve) => {
    setCurrentCoordinates(coords)
    setIsGettingLocation(false)
    resolve(coords)
  }

  /**
   * Limpia el seguimiento de ubicación
   */
  const clearLocationWatch = () => {
    if (watchIdRef.current) {
      navigator.geolocation.clearWatch(watchIdRef.current)
      watchIdRef.current = null
    }
  }

  /**
   * Limpia recursos al desmontar el componente
   */
  useEffect(() => {
    return () => {
      clearLocationWatch()
    }
  }, [])

  return {
    // Estados
    isGettingLocation,
    currentCoordinates,

    // Funciones
    getHighPrecisionLocation,
    clearLocationWatch
  }
}

export default useEmergencyLocation
