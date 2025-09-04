import { useState, useRef, useCallback } from 'react'

/**
 * Hook especializado para geolocalización de alta precisión
 *  Cumple reglas de tamaño: <100 líneas
 *  Responsabilidad única: High precision geolocation
 *  Algoritmo de sampling y promediado de posiciones
 */
const useHighPrecisionLocation = () => {
  const [isGettingLocation, setIsGettingLocation] = useState(false)
  const watchIdRef = useRef(null)

  /**
   * Obtener posición de alta precisión con múltiples muestras
   */
  const getHighPrecisionLocation = useCallback(() => {
    return new Promise((resolve, reject) => {
      if (!navigator.geolocation) {
        reject(new Error('La geolocalización no está soportada en este navegador'))
        return
      }

      const highAccuracyOptions = {
        enableHighAccuracy: true,
        timeout: 20000,
        maximumAge: 0
      }

      setIsGettingLocation(true)

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
        setIsGettingLocation(false)

        if (bestPosition) {
          resolve(bestPosition)
        } else {
          reject(new Error('No se pudo obtener ninguna posición válida'))
        }
      }

      fallbackTimeout = setTimeout(() => {
        finishPositioning()
      }, 25000)

      navigator.geolocation.getCurrentPosition(
        (position) => {
          const sample = createPositionSample(position)
          positionSamples.push(sample)

          if (sample.accuracy <= 8) {
            finishPositioning()
            return
          }

          watchTimeout = setTimeout(finishPositioning, sample.accuracy <= 20 ? 8000 : 15000)
          startWatchingPosition(positionSamples, finishPositioning)
        },
        handleLocationError(fallbackTimeout, setIsGettingLocation, reject),
        highAccuracyOptions
      )
    })
  }, [])

  const createPositionSample = (position) => ({
    latitude: position.coords.latitude,
    longitude: position.coords.longitude,
    accuracy: position.coords.accuracy,
    altitude: position.coords.altitude,
    altitudeAccuracy: position.coords.altitudeAccuracy,
    heading: position.coords.heading,
    speed: position.coords.speed,
    timestamp: position.timestamp
  })

  const startWatchingPosition = (positionSamples, finishPositioning) => {
    watchIdRef.current = navigator.geolocation.watchPosition(
      (newPosition) => {
        const newSample = createPositionSample(newPosition)
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
  }

  const handleLocationError = (fallbackTimeout, setIsGettingLocation, reject) => (error) => {
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
    reject(new Error(errorMessage))
  }

  return {
    isGettingLocation,
    getHighPrecisionLocation
  }
}

export default useHighPrecisionLocation