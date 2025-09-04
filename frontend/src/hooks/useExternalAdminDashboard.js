import { useState, useEffect, useCallback, useMemo } from 'react'
import useAppStore from '../stores/useAppStore'
import { getUsersByReferralSource } from '../mockdata/users/external-users'
import externalAdminService from '../services/externalAdminService'

/**
 * Hook para manejo del dashboard de administradores externos
 * REFACTORIZADO siguiendo TODAS las reglas:
 *
 * ✅ Regla #2: Extrae TODA la lógica del componente principal
 * ✅ Regla #5: Gestión completa de estados
 * ✅ Regla #7: Integración con servicios especializados
 * ✅ Regla #9: Uso de callbacks para optimización
 *
 * @returns {Object} Estados y funciones del dashboard de admin externo
 */
const useExternalAdminDashboard = () => {
  const { currentUser, getAllEmergencies } = useAppStore()

  // Estados básicos
  const [activeTab, setActiveTab] = useState('overview')
  const [metrics, setMetrics] = useState(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState(null)

  // Estado de filtros de fecha
  const [dateFilter, setDateFilter] = useState(() => ({
    start: new Date(new Date().setMonth(new Date().getMonth() - 1)).toISOString().split('T')[0],
    end: new Date().toISOString().split('T')[0]
  }))

  // Validación de usuario autorizado
  const isValidExternalAdmin = useMemo(() => {
    return currentUser && currentUser.role === 'EXTERNO_ADMIN'
  }, [currentUser])

  // Cargar métricas
  const loadMetrics = useCallback(async () => {
    if (!isValidExternalAdmin) return

    setLoading(true)
    setError(null)

    try {
      // Obtener todos los usuarios referidos por esta organización
      const referredUsers = getUsersByReferralSource(currentUser.organization.referral_code)

      // Generar datos de servicios utilizando el servicio
      const servicesData = externalAdminService.generateServicesData(referredUsers, dateFilter)

      // Construir métricas completas
      const metricsData = {
        totalEmployees: referredUsers.length,
        totalServices: servicesData.totalServices,
        servicesByType: servicesData.byType,
        servicesByEmployee: servicesData.byEmployee,
        recentServices: servicesData.recent,
        monthlySummary: servicesData.monthly
      }

      setMetrics(metricsData)
    } catch (error) {
      console.error('Error loading metrics:', error)
      setError('Error al cargar las métricas del dashboard')
      externalAdminService.showError('Error al cargar métricas', error.message)
    } finally {
      setLoading(false)
    }
  }, [currentUser, dateFilter, isValidExternalAdmin])

  // Efecto para cargar métricas cuando cambien los filtros
  useEffect(() => {
    loadMetrics()
  }, [loadMetrics])

  // Navegación entre tabs
  const handleTabChange = useCallback((tabId) => {
    setActiveTab(tabId)
  }, [])

  // Actualizar filtros de fecha
  const updateDateFilter = useCallback((newFilter) => {
    setDateFilter((prevFilter) => ({
      ...prevFilter,
      ...newFilter
    }))
  }, [])

  // Restablecer filtros a último mes
  const resetToLastMonth = useCallback(() => {
    setDateFilter({
      start: new Date(new Date().setMonth(new Date().getMonth() - 1)).toISOString().split('T')[0],
      end: new Date().toISOString().split('T')[0]
    })
  }, [])

  // Exportar reporte
  const handleExportReport = useCallback(
    async (format = 'csv') => {
      try {
        await externalAdminService.exportReport(format, metrics, currentUser.organization)
      } catch (error) {
        console.error('Error exporting report:', error)
        externalAdminService.showError('Error al exportar reporte', error.message)
      }
    },
    [metrics, currentUser]
  )

  // Limpiar errores
  const clearError = useCallback(() => {
    setError(null)
  }, [])

  // Datos calculados
  const organizationInfo = useMemo(() => {
    if (!currentUser?.organization) return null

    return {
      name: currentUser.organization.name,
      shortName: currentUser.organization.short_name,
      referralCode: currentUser.organization.referral_code
    }
  }, [currentUser])

  // Estadísticas resumidas
  const summaryStats = useMemo(() => {
    if (!metrics) return null

    return {
      totalEmployees: metrics.totalEmployees,
      totalServices: metrics.totalServices,
      emergencies: metrics.servicesByType?.emergencias || 0,
      homeDoctors: metrics.servicesByType?.medico_domicilio || 0,
      avgServicesPerEmployee:
        metrics.totalEmployees > 0
          ? Math.round((metrics.totalServices / metrics.totalEmployees) * 10) / 10
          : 0
    }
  }, [metrics])

  // Datos de empleados con estadísticas
  const employeesData = useMemo(() => {
    if (!metrics?.servicesByEmployee) return []

    return metrics.servicesByEmployee
      .sort((a, b) => b.totalServices - a.totalServices)
      .map((employee) => ({
        ...employee,
        lastServiceFormatted: employee.lastService
          ? new Date(employee.lastService).toLocaleDateString('es-CL')
          : 'Sin servicios',
        usageLevel:
          employee.totalServices >= 5 ? 'high' : employee.totalServices >= 2 ? 'medium' : 'low'
      }))
  }, [metrics])

  // Servicios recientes con formato
  const recentServicesFormatted = useMemo(() => {
    if (!metrics?.recentServices) return []

    return metrics.recentServices.map((service) => ({
      ...service,
      dateFormatted: new Date(service.date).toLocaleString('es-CL'),
      typeLabel: service.type === 'EMERGENCIA' ? 'Emergencia Médica' : 'Médico a Domicilio',
      typeShort: service.type === 'EMERGENCIA' ? 'Emergencia' : 'Domicilio'
    }))
  }, [metrics])

  return {
    // Estados básicos
    currentUser,
    activeTab,
    loading,
    error,
    metrics,
    isValidExternalAdmin,

    // Filtros y configuración
    dateFilter,
    organizationInfo,

    // Datos calculados
    summaryStats,
    employeesData,
    recentServicesFormatted,

    // Funciones de navegación
    handleTabChange,

    // Funciones de filtros
    updateDateFilter,
    resetToLastMonth,

    // Funciones de datos
    loadMetrics,
    handleExportReport,

    // Funciones de control
    clearError
  }
}

export default useExternalAdminDashboard
