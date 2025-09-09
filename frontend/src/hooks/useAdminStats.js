import { useState, useEffect } from 'react'
import logger from '../utils/logger'
import apiService from '../services/api'

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

      // Obtener datos reales desde el backend
      const [users, emergencies, contracts, ambulances, dashboardStats] = await Promise.all([
        apiService.getUsers(),
        apiService.getEmergencies(),
        apiService.getContracts(),
        apiService.getAmbulances(),
        apiService.getDashboardStats()
      ])

      // Calcular estadísticas reales basadas en los datos
      const calculatedStats = {
        totalUsers: users.length,
        activeUsers: users.filter(u => u.status === 'active').length || users.length,
        totalEmergencies: emergencies.length,
        pendingEmergencies: emergencies.filter(e => e.status === 'pending').length,
        totalContracts: contracts.length,
        activeContracts: contracts.filter(c => c.status === 'active').length,
        totalUnits: ambulances.length,
        availableUnits: ambulances.filter(a => a.status === 'available').length
      }

      // Combinar con stats del dashboard si existen
      const finalStats = dashboardStats ? {
        ...calculatedStats,
        ...dashboardStats
      } : calculatedStats

      setStats(finalStats)
      logger.info('Admin stats loaded successfully', finalStats)
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
