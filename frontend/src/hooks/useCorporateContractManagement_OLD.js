import { useState } from 'react'
import useAppStore from '../stores/useAppStore'
import Swal from 'sweetalert2'

/**
 * Hook para gestión de contratos corporativos
 * Centraliza toda la lógica compleja de contratos (Regla #2)
 *
 * Funcionalidades:
 * - Gestión de estado de filtros y búsqueda
 * - Validación de duplicados (RUC, email, nombre empresa)
 * - Manejo de renovación de contratos
 * - Gestión de servicios adicionales y consumidos
 * - Cálculo de estadísticas y estado de contratos
 *
 * @returns {Object} Estado y funciones para gestión de contratos
 */
export const useCorporateContractManagement = () => {
  const { allUsers, addCorporateContract, addExtraServices, consumeServices } = useAppStore()
  const [showAddForm, setShowAddForm] = useState(false)
  const [filter, setFilter] = useState('all')
  const [searchTerm, setSearchTerm] = useState('')
  const [isLoading, setIsLoading] = useState(false)
  const [error, setError] = useState(null)

  const corporateUsers = allUsers.corporativo || []

  // ============================================
  // VALIDACIONES DE NEGOCIO (Regla #2)
  // ============================================

  /**
   * Valida si un RUC ya existe en el sistema
   * Función crítica que debe estar en hook
   */
  const checkDuplicateRUT = (rut) => {
    if (!rut) return false
    return corporateUsers.some((user) => user.company.rut === rut)
  }

  /**
   * Valida si un email ya existe en el sistema
   * Función crítica que debe estar en hook
   */
  const checkDuplicateEmail = (email) => {
    if (!email) return false
    return corporateUsers.some((user) => user.profile.email.toLowerCase() === email.toLowerCase())
  }

  /**
   * Valida si un nombre de empresa ya existe
   * Función crítica que debe estar en hook
   */
  const checkDuplicateCompanyName = (name) => {
    if (!name) return false
    return corporateUsers.some(
      (user) => user.company.name.toLowerCase().trim() === name.toLowerCase().trim()
    )
  }

  // ============================================
  // FILTROS Y BÚSQUEDA (Regla #2)
  // ============================================

  /**
   * Filtra contratos basado en criterios de búsqueda y filtros
   * Lógica compleja que debe estar en hook
   */
  const getFilteredContracts = () => {
    return corporateUsers.filter((user) => {
      const matchesSearch =
        user.company.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
        user.profile.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
        user.company.rut.includes(searchTerm)

      const matchesFilter =
        filter === 'all' ||
        (filter === 'active' && new Date(user.plan.renewal_date) > new Date()) ||
        (filter === 'expiring' &&
          new Date(user.plan.renewal_date) <= new Date(Date.now() + 30 * 24 * 60 * 60 * 1000))

      return matchesSearch && matchesFilter
    })
  }

  // ============================================
  // CÁLCULOS DE ESTADO (Regla #2)
  // ============================================

  /**
   * Calcula el estado de un contrato basado en fecha de renovación
   * Lógica de negocio compleja
   */
  const getContractStatus = (contract) => {
    if (!contract?.plan?.renewal_date) {
      return { status: 'unknown', color: 'gray', text: 'Desconocido' }
    }

    const renewalDate = new Date(contract.plan.renewal_date)
    const now = new Date()
    const daysUntilRenewal = Math.ceil((renewalDate - now) / (1000 * 60 * 60 * 24))

    if (daysUntilRenewal < 0) {
      return { status: 'expired', color: 'red', text: 'Vencido' }
    } else if (daysUntilRenewal <= 30) {
      return { status: 'expiring', color: 'orange', text: `${daysUntilRenewal} días` }
    } else {
      return { status: 'active', color: 'green', text: 'Activo' }
    }
  }

  /**
   * Obtiene estadísticas de contratos
   * Cálculos complejos que deben estar en hook
   */
  const getContractStats = () => {
    const totalContracts = corporateUsers.length
    const activeContracts = corporateUsers.filter(
      (u) => new Date(u.plan.renewal_date) > new Date()
    ).length
    const expiringContracts = corporateUsers.filter((u) => {
      const days = Math.ceil((new Date(u.plan.renewal_date) - new Date()) / (1000 * 60 * 60 * 24))
      return days <= 30 && days >= 0
    }).length
    const monthlyRevenue = corporateUsers.reduce(
      (sum, u) => sum + (u.billing?.monthly_cost || 0),
      0
    )

    return {
      totalContracts,
      activeContracts,
      expiringContracts,
      monthlyRevenue
    }
  }

  // ============================================
  // CLASES CSS DINÁMICAS (Regla #5)
  // ============================================

  /**
   * Obtiene clase CSS para porcentaje de uso
   * Lógica de clases dinámicas debe estar en hook
   */
  const getUsageColor = (percentage) => {
    if (percentage >= 90) return 'text-red-600'
    if (percentage >= 70) return 'text-orange-600'
    return 'text-green-600'
  }

  /**
   * Obtiene clase CSS para estado de contrato
   * Lógica de clases dinámicas debe estar en hook
   */
  const getContractStatusClass = (status) => {
    const classes = {
      expired: 'bg-red-100 text-red-800 border-red-200',
      expiring: 'bg-orange-100 text-orange-800 border-orange-200',
      active: 'bg-green-100 text-green-800 border-green-200'
    }
    return classes[status] || 'bg-gray-100 text-gray-800 border-gray-200'
  }

  // ============================================
  // MANEJO DE CONTRATOS (Regla #2)
  // ============================================

  /**
   * Maneja la renovación de un contrato
   * Lógica de negocio compleja con SweetAlert
   */
  const handleRenewContract = async (contract) => {
    if (!contract) {
      setError('Contrato no válido')
      return { success: false, error: 'Contrato no válido', code: 'INVALID_CONTRACT' }
    }

    try {
      setLoading(true)
      setError(null)

      const result = await Swal.fire({
        title: '¿Renovar Contrato?',
        text: `¿Está seguro que desea renovar el contrato de ${contract.company.name} por un año más?`,
        icon: 'question',
        showCancelButton: true,
        confirmButtonText: 'Sí, Renovar',
        cancelButtonText: 'Cancelar',
        confirmButtonColor: '#10B981'
      })

      if (result.isConfirmed) {
        const newRenewalDate = new Date(contract.plan.renewal_date)
        newRenewalDate.setFullYear(newRenewalDate.getFullYear() + 1)

        // Aquí iría la llamada a la API para renovar el contrato
        // await contractService.renewContract(contract.id, newRenewalDate)

        Swal.fire({
          title: '¡Contrato Renovado!',
          text: `El contrato se ha renovado hasta ${newRenewalDate.toLocaleDateString('es-CL')}`,
          icon: 'success',
          timer: 2000,
          showConfirmButton: false
        })

        setLoading(false)
        return { success: true, data: { contractId: contract.id, newRenewalDate } }
      }

      setLoading(false)
      return { success: false, error: 'Renovación cancelada', code: 'CANCELLED' }
    } catch (error) {
      setLoading(false)
      const errorMessage = 'No se pudo renovar el contrato'
      setError(errorMessage)

      return { success: false, error: error.message || errorMessage, code: 'RENEW_ERROR' }
    }
  }

  /**
   * Maneja el registro de servicios consumidos
   * Lógica compleja de gestión de servicios
   */
  const handleConsumeServices = async (contract) => {
    if (!contract) {
      setError('Contrato no válido')
      return { success: false, error: 'Contrato no válido', code: 'INVALID_CONTRACT' }
    }

    try {
      setLoading(true)
      setError(null)

      const serviceUsage = contract.service_usage?.current_period
      const currentUsed = serviceUsage?.used_services || 0
      const currentRemaining = serviceUsage?.remaining_services || 0
      const totalLimit = currentUsed + currentRemaining

      const result = await Swal.fire({
        title: 'Registrar Servicios Consumidos',
        html: `
          <div class="text-left space-y-4">
            <div class="bg-blue-50 border border-blue-200 rounded-lg p-3">
              <p class="font-semibold text-blue-800 mb-2">Empresa: ${contract.company?.name}</p>
              <p class="text-sm text-blue-600">Plan: ${contract.plan?.name}</p>
              <p class="text-sm text-blue-600">Servicios actuales: ${currentUsed}/${totalLimit} utilizados</p>
            </div>
            
            <div class="space-y-3">
              <div class="bg-red-50 border border-red-200 rounded-lg p-3">
                <label class="block text-sm font-medium text-red-700 mb-2">
                  <i class="fas fa-plus-circle mr-2 text-red-600"></i>
                  Servicios Consumidos a Registrar
                </label>
                <input type="number" id="extra-emergency-services" 
                  class="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-red-500"
                  placeholder="Cantidad de servicios consumidos" min="1" value="1">
                <p class="text-xs text-red-600 mt-2">
                  <i class="fas fa-info-circle mr-1"></i>
                  Esto incrementará el contador de servicios utilizados
                </p>
              </div>
            </div>
          </div>
        `,
        showCancelButton: true,
        confirmButtonText: 'Registrar Consumo',
        cancelButtonText: 'Cancelar',
        confirmButtonColor: '#DC2626',
        preConfirm: () => {
          const extraServices =
            parseInt(document.getElementById('extra-emergency-services').value) || 0

          if (extraServices <= 0) {
            Swal.showValidationMessage('Debe registrar al menos 1 servicio consumido')
            return false
          }

          return { extraServices }
        }
      })

      if (result.isConfirmed) {
        const { extraServices } = result.value

        Swal.fire({
          title: '¡Servicios Registrados!',
          html: `
            <div class="text-center">
              <i class="fas fa-check-circle text-5xl text-green-500 mb-3"></i>
              <p class="text-lg">Se han registrado exitosamente:</p>
              <p class="font-bold text-2xl text-blue-600 mt-2">${extraServices} servicio${extraServices > 1 ? 's' : ''} consumido${extraServices > 1 ? 's' : ''}</p>
            </div>
          `,
          icon: 'success',
          timer: 4000,
          showConfirmButton: false
        })

        // Actualizar el store con los servicios consumidos
        consumeServices(contract.id, 'corporativo', extraServices)

        setLoading(false)
        return { success: true, data: { contractId: contract.id, servicesConsumed: extraServices } }
      }

      setLoading(false)
      return { success: false, error: 'Operación cancelada', code: 'CANCELLED' }
    } catch (error) {
      setLoading(false)
      const errorMessage = 'No se pudo registrar el consumo de servicios'
      setError(errorMessage)

      return { success: false, error: error.message || errorMessage, code: 'CONSUME_ERROR' }
    }
  }

  /**
   * Maneja la adición de servicios extras
   * Lógica compleja de gestión de servicios adicionales
   */
  const handleAddExtraServices = async (contract) => {
    if (!contract) {
      setError('Contrato no válido')
      return { success: false, error: 'Contrato no válido', code: 'INVALID_CONTRACT' }
    }

    try {
      setLoading(true)
      setError(null)

      const result = await Swal.fire({
        title: 'Gestionar Servicios Adicionales',
        html: `
          <div class="text-left space-y-4">
            <div class="bg-blue-50 border border-blue-200 rounded-lg p-3">
              <p class="font-semibold text-blue-800 mb-2">Usuario: ${contract.company?.name}</p>
              <p class="text-sm text-blue-600">Plan: ${contract.plan?.name || 'Área Protegida'}</p>
            </div>
            
            <div class="space-y-4">
              <div class="bg-white border border-gray-200 rounded-lg p-3">
                <div class="flex items-center space-x-3 mb-2">
                  <i class="fas fa-ambulance text-red-600 text-lg"></i>
                  <label class="font-medium text-gray-700">Emergencias adicionales</label>
                </div>
                <input type="number" id="emergency-additional" 
                  class="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500"
                  placeholder="0" min="0" value="0">
              </div>
            </div>
          </div>
        `,
        showCancelButton: true,
        confirmButtonText: 'Asignar Servicios',
        cancelButtonText: 'Cancelar',
        confirmButtonColor: '#10B981',
        width: '600px',
        preConfirm: () => {
          const emergencyServices =
            parseInt(document.getElementById('emergency-additional')?.value) || 0

          if (emergencyServices <= 0) {
            Swal.showValidationMessage('Debe asignar al menos 1 servicio de emergencia adicional')
            return false
          }

          return {
            emergency: emergencyServices,
            total: emergencyServices
          }
        }
      })

      if (result.isConfirmed) {
        const services = result.value

        Swal.fire({
          title: '¡Servicios Asignados!',
          html: `
            <div class="text-center">
              <i class="fas fa-check-circle text-5xl text-green-500 mb-3"></i>
              <p class="text-lg">Se han asignado exitosamente:</p>
              <div class="bg-gray-50 border border-gray-200 rounded-lg p-4 mt-4">
                <p class="font-semibold text-gray-800 mb-2">Para: ${contract.company?.name}</p>
                <p class="text-sm text-gray-700">• Emergencias adicionales: +${services.emergency}</p>
                <p class="text-sm font-medium text-green-600 mt-3">Total de servicios agregados: ${services.total}</p>
              </div>
            </div>
          `,
          icon: 'success',
          timer: 4000,
          showConfirmButton: false
        })

        // Actualizar el store con los nuevos servicios adicionales
        addExtraServices(contract.id, 'corporativo', services)

        setLoading(false)
        return { success: true, data: { contractId: contract.id, servicesAdded: services } }
      }

      setLoading(false)
      return { success: false, error: 'Operación cancelada', code: 'CANCELLED' }
    } catch (error) {
      setLoading(false)
      const errorMessage = 'No se pudo agregar servicios adicionales'
      setError(errorMessage)

      return { success: false, error: error.message || errorMessage, code: 'ADD_SERVICES_ERROR' }
    }
  }

  const clearError = () => setError(null)

  return {
    // Estado
    showAddForm,
    filter,
    searchTerm,
    isLoading,
    error,
    corporateUsers,

    // Datos calculados
    filteredContracts: getFilteredContracts(),
    contractStats: getContractStats(),

    // Funciones de validación
    checkDuplicateRUT,
    checkDuplicateEmail,
    checkDuplicateCompanyName,

    // Funciones de estado
    getContractStatus,
    getUsageColor,
    getContractStatusClass,

    // Handlers
    setShowAddForm,
    setFilter,
    setSearchTerm,
    handleRenewContract,
    handleConsumeServices,
    handleAddExtraServices,
    clearError
  }
}
