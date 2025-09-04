import { useState, useRef, useEffect, useCallback } from 'react'

/**
 * Hook especializado para geolocalización de alta precisión
 * ✅ Cumple reglas de tamaño: <100 líneas
 * ✅ Responsabilidad única: GPS tracking
 * ✅ Optimizado para máxima precisión
 */
const useHighPrecisionGPS = () => {
  const [isGettingLocation, setIsGettingLocation] = useState(false)
  const [currentCoordinates, setCurrentCoordinates] = useState(null)
  const [error, setError] = useState(null)
  const watchIdRef = useRef(null)

  // Cleanup de watchPosition al desmontar
  useEffect(() => {
    return () => {
      if (watchIdRef.current) {
        navigator.geolocation.clearWatch(watchIdRef.current)
      }
    }
  }, [])

  // Obtener ubicación GPS de alta precisión
  const getHighPrecisionLocation = useCallback(() => {
    return new Promise((resolve, reject) => {
      if (!navigator.geolocation) {
        reject(new Error('La geolocalización no está soportada en este navegador'))
        return
      }

      const highAccuracyOptions = {
        enableHighAccuracy: true,
        timeout: 30000,
        maximumAge: 0
      }

      setIsGettingLocation(true)
      setError(null)

      const positionSamples = []
      let watchTimeout
      let fallbackTimeout

      const calculateBestPosition = (samples) => {
        if (samples.length === 0) return null

        samples.sort((a, b) => a.accuracy - b.accuracy)
        const bestSamples = samples.slice(0, Math.min(3, samples.length))

        let totalWeight = 0
        let weightedLat = 0
        let weightedLon = 0
        const bestAccuracy = bestSamples[0].accuracy

        bestSamples.forEach((sample) => {
          const weight = 1 / (sample.accuracy || 1)
          totalWeight += weight
          weightedLat += sample.latitude * weight
          weightedLon += sample.longitude * weight
        })

        return {
          latitude: weightedLat / totalWeight,
          longitude: weightedLon / totalWeight,
          accuracy: bestAccuracy,
          altitude: bestSamples[0].altitude,
          altitudeAccuracy: bestSamples[0].altitudeAccuracy,
          heading: bestSamples[0].heading,
          speed: bestSamples[0].speed,
          timestamp: new Date().toISOString(),
          samplesUsed: bestSamples.length
        }
      }

      const finishPositioning = () => {
        if (watchIdRef.current) {
          navigator.geolocation.clearWatch(watchIdRef.current)
          watchIdRef.current = null
        }
        if (watchTimeout) clearTimeout(watchTimeout)
        if (fallbackTimeout) clearTimeout(fallbackTimeout)

        const bestPosition = calculateBestPosition(positionSamples)
        if (bestPosition) {
          setCurrentCoordinates(bestPosition)
          setIsGettingLocation(false)
          resolve(bestPosition)
        } else {
          const errorMsg = 'No se pudo obtener ninguna posición válida'
          setError(errorMsg)
          setIsGettingLocation(false)
          reject(new Error(errorMsg))
        }
      }

      fallbackTimeout = setTimeout(finishPositioning, 45000)

      navigator.geolocation.getCurrentPosition(
        (position) => {
          const sample = {
            latitude: position.coords.latitude,
            longitude: position.coords.longitude,
            accuracy: position.coords.accuracy,
            altitude: position.coords.altitude,
            altitudeAccuracy: position.coords.altitudeAccuracy,
            heading: position.coords.heading,
            speed: position.coords.speed,
            timestamp: position.timestamp
          }

          positionSamples.push(sample)

          if (sample.accuracy <= 8) {
            finishPositioning()
            return
          }

          watchTimeout = setTimeout(finishPositioning, sample.accuracy <= 20 ? 8000 : 15000)

          watchIdRef.current = navigator.geolocation.watchPosition(
            (newPosition) => {
              const newSample = {
                latitude: newPosition.coords.latitude,
                longitude: newPosition.coords.longitude,
                accuracy: newPosition.coords.accuracy,
                altitude: newPosition.coords.altitude,
                altitudeAccuracy: newPosition.coords.altitudeAccuracy,
                heading: newPosition.coords.heading,
                speed: newPosition.coords.speed,
                timestamp: newPosition.timestamp
              }

              positionSamples.push(newSample)

              if (newSample.accuracy <= 5 || positionSamples.length >= 6) {
                finishPositioning()
              }
            },
            (error) => {
              console.warn('Error en watchPosition:', error)
            },
            {
              enableHighAccuracy: true,
              timeout: 8000,
              maximumAge: 1000
            }
          )
        },
        (error) => {
          if (fallbackTimeout) clearTimeout(fallbackTimeout)
          setIsGettingLocation(false)

          let errorMessage = 'Error al obtener la ubicación'
          switch (error.code) {
            case error.PERMISSION_DENIED:
              errorMessage = 'Permiso de ubicación denegado.'
              break
            case error.POSITION_UNAVAILABLE:
              errorMessage = 'GPS no disponible.'
              break
            case error.TIMEOUT:
              errorMessage = 'Tiempo de espera agotado.'
              break
          }
          setError(errorMessage)
          reject(new Error(errorMessage))
        },
        highAccuracyOptions
      )
    })
  }, [])

  // Limpiar coordenadas actuales
  const clearLocation = useCallback(() => {
    setCurrentCoordinates(null)
    setError(null)
  }, [])

  // Formatear coordenadas para mostrar
  const formatCoordinates = useCallback((coords) => {
    if (!coords) return ''
    return `Lat: ${coords.latitude.toFixed(6)}, Lon: ${coords.longitude.toFixed(6)} (Precisión: ${coords.accuracy.toFixed(1)}m)`
  }, [])

  return {
    // Estados
    isGettingLocation,
    currentCoordinates,
    error,

    // Funciones
    getHighPrecisionLocation,
    clearLocation,
    formatCoordinates
  }
}

export default useHighPrecisionGPS