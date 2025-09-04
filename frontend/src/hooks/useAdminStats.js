import { useState, useEffect } from 'react'
import logger from '../utils/logger'

/**
 * Hook para obtener y manejar estadísticas del dashboard de administrador
 * Maneja métricas de usuarios, emergencias, contratos y unidades
 */
export const useAdminStats = () => {
  const [stats, setStats] = useState({
    totalUsers: 0,
    activeUsers: 0,
    totalEmergencies: 0,
    pendingEmergencies: 0,
    totalContracts: 0,
    activeContracts: 0,
    totalUnits: 0,
    availableUnits: 0
  })

  const [loading, setLoading] = useState(true)
  const [error, setError] = useState(null)

  const fetchStats = async () => {
    try {
      setLoading(true)
      setError(null)

      // Simular llamada a API para estadísticas
      // En implementación real, esto vendría de un servicio
      await new Promise((resolve) => setTimeout(resolve, 1000))

      const mockStats = {
        totalUsers: 1247,
        activeUsers: 892,
        totalEmergencies: 156,
        pendingEmergencies: 23,
        totalContracts: 45,
        activeContracts: 38,
        totalUnits: 24,
        availableUnits: 18
      }

      setStats(mockStats)
      logger.info('Admin stats loaded successfully', mockStats)
    } catch (err) {
      const errorMessage = 'Error al cargar estadísticas del dashboard'
      setError(errorMessage)
      logger.error('Failed to load admin stats', err, { context: 'useAdminStats' })
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => {
    fetchStats()
  }, [])

  const refreshStats = () => {
    fetchStats()
  }

  return {
    stats,
    loading,
    error,
    refreshStats
  }
}
