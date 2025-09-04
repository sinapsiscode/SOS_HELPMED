import { useState, useCallback } from 'react'
import ambulanceService from '../services/ambulanceService'

/**
 * Hook especializado para cálculo de rutas de ambulancia
 * ✅ Cumple reglas de tamaño: <100 líneas
 * ✅ Responsabilidad única: Route calculations
 * ✅ Manejo de errores incluido
 */
const useAmbulanceRoutes = () => {
  const [routes, setRoutes] = useState([])
  const [eta, setEta] = useState('--')
  const [distance, setDistance] = useState('--')
  const [loading, setLoading] = useState(false)

  // Calcular ruta a emergencia
  const calculateRoute = useCallback(
    async (ambulanceLocation, emergencyLocation) => {
      try {
        if (!emergencyLocation) return

        setLoading(true)
        const routeData = await ambulanceService.calculateRoute(
          ambulanceLocation,
          emergencyLocation
        )

        setRoutes(routeData.routes || [])
        setEta(routeData.eta || '--')
        setDistance(routeData.distance || '--')
      } catch (err) {
        console.error('Error calculating route:', err)
        setEta('--')
        setDistance('--')
      } finally {
        setLoading(false)
      }
    },
    []
  )

  return {
    routes,
    eta,
    distance,
    loading,
    calculateRoute
  }
}

export default useAmbulanceRoutes