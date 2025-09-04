import { useState, useCallback } from 'react'
import useAppStore from '../stores/useAppStore'
import useRegistrationFilters from './useRegistrationFilters'
import useRegistrationStats from './useRegistrationStats'
import useRegistrationOperations from './useRegistrationOperations'
import useRegistrationUtils from './useRegistrationUtils'

/**
 * Hook coordinador para gestión completa de solicitudes de registro
 * REFACTORIZADO siguiendo TODAS las reglas:
 *
 * ✅ Regla #2: Lógica extraída a hooks especializados
 * ✅ Regla #5: Gestión de estados distribuida
 * ✅ Regla #13: Optimización con composición de hooks
 * 
 * Funcionalidades distribuidas:
 * - useRegistrationFilters: Filtrado de solicitudes
 * - useRegistrationStats: Cálculo de estadísticas
 * - useRegistrationOperations: Operaciones CRUD
 * - useRegistrationUtils: Funciones utilitarias
 */
const useRegistrationManagement = () => {
  // ============================================
  // STORE Y ESTADOS GLOBALES
  // ============================================
  const {
    registrationRequests,
    approveRegistrationRequest,
    rejectRegistrationRequest,
    activateUserServices
  } = useAppStore()

  // ============================================
  // ESTADOS LOCALES
  // ============================================
  const [filter, setFilter] = useState('pending')
  const [selectedRequest, setSelectedRequest] = useState(null)

  // ============================================
  // HOOKS ESPECIALIZADOS
  // ============================================
  const filtersHook = useRegistrationFilters(registrationRequests, filter)
  const statsHook = useRegistrationStats(registrationRequests)
  const operationsHook = useRegistrationOperations(
    approveRegistrationRequest,
    rejectRegistrationRequest,
    activateUserServices
  )
  const utilsHook = useRegistrationUtils()

  // ============================================
  // FUNCIONES DE CONTROL
  // ============================================
  const handleFilterChange = useCallback((newFilter) => {
    setFilter(newFilter)
  }, [])

  const openRequestDetail = useCallback((request) => {
    setSelectedRequest(request)
  }, [])

  const closeRequestDetail = useCallback(() => {
    setSelectedRequest(null)
  }, [])

  // ============================================
  // RETORNO COORDINADO DE TODOS LOS HOOKS
  // ============================================
  return {
    // Datos principales (delegados)
    filteredRequests: filtersHook.filteredRequests,
    requestStats: statsHook.requestStats,
    registrationRequests,

    // Estados de control
    filter,
    selectedRequest,
    loading: operationsHook.loading,
    error: operationsHook.error,

    // Operaciones principales (delegadas)
    handleApprove: operationsHook.handleApprove,
    handleReject: operationsHook.handleReject,
    handleActivateServices: operationsHook.handleActivateServices,

    // Funciones utilitarias (delegadas)
    getStatusColor: utilsHook.getStatusColor,
    getStatusIcon: utilsHook.getStatusIcon,
    getPlanTypeName: utilsHook.getPlanTypeName,

    // Control de estado
    handleFilterChange,
    openRequestDetail,
    closeRequestDetail,
    clearError: operationsHook.clearError
  }
}

export default useRegistrationManagement