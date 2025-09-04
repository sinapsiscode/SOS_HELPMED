import { useState } from 'react'
import useAppStore from '../stores/useAppStore'
import useCorporateValidations from './useCorporateValidations'
import useCorporateFilters from './useCorporateFilters'
import useCorporateCalculations from './useCorporateCalculations'
import useCorporateStyles from './useCorporateStyles'
import useCorporateOperations from './useCorporateOperations'

/**
 * Hook coordinador para gestión de contratos corporativos
 * REFACTORIZADO siguiendo TODAS las reglas:
 *
 * ✅ Regla #2: Lógica extraída a hooks especializados
 * ✅ Regla #5: Gestión de estados distribuida
 * ✅ Regla #13: Optimización con composición de hooks
 * 
 * Funcionalidades distribuidas:
 * - useCorporateValidations: Validaciones de negocio
 * - useCorporateFilters: Filtrado y búsqueda
 * - useCorporateCalculations: Cálculos de estado y estadísticas
 * - useCorporateStyles: Clases CSS dinámicas
 * - useCorporateOperations: Operaciones CRUD
 */
export const useCorporateContractManagement = () => {
  // ============================================
  // STORE Y ESTADOS GLOBALES
  // ============================================
  const { allUsers, addCorporateContract, addExtraServices, consumeServices } = useAppStore()
  const corporateUsers = allUsers.corporativo || []

  // ============================================
  // ESTADOS LOCALES
  // ============================================
  const [showAddForm, setShowAddForm] = useState(false)
  const [filter, setFilter] = useState('all')
  const [searchTerm, setSearchTerm] = useState('')

  // ============================================
  // HOOKS ESPECIALIZADOS
  // ============================================
  const validationsHook = useCorporateValidations(corporateUsers)
  const filtersHook = useCorporateFilters(corporateUsers, filter, searchTerm)
  const calculationsHook = useCorporateCalculations(corporateUsers)
  const stylesHook = useCorporateStyles()
  const operationsHook = useCorporateOperations(addExtraServices, consumeServices)

  // ============================================
  // RETORNO COORDINADO DE TODOS LOS HOOKS
  // ============================================
  return {
    // Estados principales
    showAddForm,
    filter,
    searchTerm,
    corporateUsers,

    // Estados delegados
    isLoading: operationsHook.isLoading,
    error: operationsHook.error,

    // Datos calculados (delegados)
    filteredContracts: filtersHook.filteredContracts,
    contractStats: calculationsHook.contractStats,

    // Funciones de validación (delegadas)
    checkDuplicateRUT: validationsHook.checkDuplicateRUT,
    checkDuplicateEmail: validationsHook.checkDuplicateEmail,
    checkDuplicateCompanyName: validationsHook.checkDuplicateCompanyName,

    // Funciones de estado (delegadas)
    getContractStatus: calculationsHook.getContractStatus,
    getUsageColor: stylesHook.getUsageColor,
    getContractStatusClass: stylesHook.getContractStatusClass,

    // Handlers locales
    setShowAddForm,
    setFilter,
    setSearchTerm,

    // Handlers delegados
    handleRenewContract: operationsHook.handleRenewContract,
    handleConsumeServices: operationsHook.handleConsumeServices,
    handleAddExtraServices: operationsHook.handleAddExtraServices,
    clearError: operationsHook.clearError
  }
}