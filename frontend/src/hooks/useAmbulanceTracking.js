import { useState, useEffect, useCallback, useMemo } from 'react'
import ambulanceTrackingService from '../services/ambulanceTrackingService'

/**
 * Hook para manejo del seguimiento de ambulancia
 * REFACTORIZADO siguiendo TODAS las reglas:
 *
 * ✅ Regla #2: Extrae TODA la lógica del componente principal
 * ✅ Regla #5: Gestión completa de estados
 * ✅ Regla #7: Integración con servicios especializados
 * ✅ Regla #9: Uso de callbacks para optimización
 *
 * @param {Object} emergency - Datos de la emergencia
 * @returns {Object} Estados y funciones del seguimiento de ambulancia
 */
const useAmbulanceTracking = (emergency) => {
  // Estados de ubicación
  const [ambulanceLocation, setAmbulanceLocation] = useState({
    lat: -12.0464,
    lng: -77.0428
  })

  const [userLocation] = useState({
    lat: -12.0647,
    lng: -77.0316
  })

  // Estados de tiempo y distancia
  const [eta, setEta] = useState(() => emergency?.assignedUnit?.eta || '0 min')
  const [distance, setDistance] = useState(() => emergency?.assignedUnit?.distance || '0 km')

  // Estados de la interfaz
  const [mapLoaded, setMapLoaded] = useState(false)
  const [lastUpdate, setLastUpdate] = useState(() => new Date())
  const [isTracking, setIsTracking] = useState(false)

  // Validación de emergencia con ambulancia asignada
  const hasAssignedUnit = useMemo(() => {
    return emergency && emergency.assignedUnit && emergency.assignedUnit.id
  }, [emergency])

  // Información del equipo médico formateada
  const medicalTeamInfo = useMemo(() => {
    if (!hasAssignedUnit) return []

    return emergency.assignedUnit.crew.map((member, index) => ({
      name: member,
      role: index === 0 ? 'Médico' : index === 1 ? 'Paramédico' : 'Conductor',
      icon: index === 0 ? 'fas fa-user-md' : index === 1 ? 'fas fa-user-nurse' : 'fas fa-id-card'
    }))
  }, [emergency, hasAssignedUnit])

  // Estado actual formateado
  const currentStatus = useMemo(() => {
    if (!emergency) return null

    const statusMap = {
      EN_PROGRESO: {
        text: 'Ambulancia en camino',
        color: 'green',
        icon: 'fas fa-ambulance'
      },
      EN_ESCENA: {
        text: 'Ambulancia en el lugar',
        color: 'blue',
        icon: 'fas fa-map-marker-alt'
      },
      ASIGNADA: {
        text: 'Ambulancia asignada',
        color: 'yellow',
        icon: 'fas fa-clock'
      },
      COMPLETADA: {
        text: 'Atención completada',
        color: 'gray',
        icon: 'fas fa-check-circle'
      }
    }

    return (
      statusMap[emergency.status] || {
        text: 'Procesando emergencia',
        color: 'gray',
        icon: 'fas fa-cog'
      }
    )
  }, [emergency])

  // Cargar mapa después de 2 segundos (simulación de carga)
  useEffect(() => {
    const mapTimer = setTimeout(() => {
      setMapLoaded(true)
    }, 2000)

    return () => clearTimeout(mapTimer)
  }, [])

  // Inicializar seguimiento cuando hay ambulancia asignada
  useEffect(() => {
    if (hasAssignedUnit) {
      setIsTracking(true)
      setAmbulanceLocation(
        ambulanceTrackingService.getInitialAmbulanceLocation(emergency.assignedUnit)
      )
    }
  }, [hasAssignedUnit, emergency])

  // Simulación de actualización en tiempo real
  useEffect(() => {
    if (!isTracking || !hasAssignedUnit) return

    const interval = setInterval(() => {
      // Actualizar distancia
      setDistance((prev) => {
        const newDistance = ambulanceTrackingService.calculateUpdatedDistance(prev)
        return newDistance
      })

      // Actualizar ETA
      setEta((prev) => {
        const newEta = ambulanceTrackingService.calculateUpdatedETA(prev)
        return newEta
      })

      // Actualizar ubicación de la ambulancia
      setAmbulanceLocation((prev) => {
        const newLocation = ambulanceTrackingService.calculateNewAmbulancePosition(
          prev,
          userLocation
        )
        return newLocation
      })

      // Actualizar timestamp
      setLastUpdate(new Date())
    }, 5000) // Actualizar cada 5 segundos

    return () => clearInterval(interval)
  }, [isTracking, hasAssignedUnit, userLocation])

  // Forzar carga del mapa
  const handleLoadMap = useCallback(() => {
    setMapLoaded(true)
  }, [])

  // Llamar a la ambulancia
  const handleCallAmbulance = useCallback(async () => {
    try {
      await ambulanceTrackingService.callAmbulance(emergency?.assignedUnit?.id)
    } catch (error) {
      console.error('Error calling ambulance:', error)
      ambulanceTrackingService.showError('Error', 'No se pudo contactar con la ambulancia')
    }
  }, [emergency])

  // Cancelar seguimiento
  const handleCancelTracking = useCallback(() => {
    setIsTracking(false)
    ambulanceTrackingService.showCancelConfirmation(() => {
      // Lógica adicional de cancelación si es necesaria
    })
  }, [])

  // Actualizar posición de emergencia
  const handleUpdateEmergencyLocation = useCallback((newLocation) => {
    setUserLocation(newLocation)
  }, [])

  // Obtener información de contacto de emergencia
  const emergencyContactInfo = useMemo(() => {
    if (!hasAssignedUnit) return null

    return {
      ambulanceId: emergency.assignedUnit.id,
      phone: ambulanceTrackingService.getEmergencyPhone(),
      backup: ambulanceTrackingService.getBackupPhone()
    }
  }, [hasAssignedUnit, emergency])

  // Datos del mapa preparados
  const mapData = useMemo(
    () => ({
      center: [ambulanceLocation.lat, ambulanceLocation.lng],
      ambulancePosition: [ambulanceLocation.lat, ambulanceLocation.lng],
      userPosition: [userLocation.lat, userLocation.lng],
      zoom: 13
    }),
    [ambulanceLocation, userLocation]
  )

  // Métricas de seguimiento
  const trackingMetrics = useMemo(
    () => ({
      eta,
      distance,
      lastUpdate: lastUpdate.toLocaleTimeString('es-CL'),
      isActive: isTracking,
      ambulanceId: emergency?.assignedUnit?.id || 'N/A'
    }),
    [eta, distance, lastUpdate, isTracking, emergency]
  )

  return {
    // Estados básicos
    ambulanceLocation,
    userLocation,
    eta,
    distance,
    mapLoaded,
    isTracking,
    hasAssignedUnit,

    // Datos calculados
    medicalTeamInfo,
    currentStatus,
    emergencyContactInfo,
    mapData,
    trackingMetrics,

    // Estados de tiempo
    lastUpdate,

    // Funciones de interacción
    handleLoadMap,
    handleCallAmbulance,
    handleCancelTracking,
    handleUpdateEmergencyLocation,

    // Datos de la emergencia
    emergency
  }
}

export default useAmbulanceTracking
