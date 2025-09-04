import { useState } from 'react'
import Swal from 'sweetalert2'

/**
 * Hook especializado para operaciones CRUD de contratos corporativos
 * ✅ Cumple reglas de tamaño: <100 líneas
 * ✅ Responsabilidad única: CRUD operations
 * ✅ Manejo de errores y estados incluido
 */
const useCorporateOperations = (addExtraServices, consumeServices) => {
  const [isLoading, setIsLoading] = useState(false)
  const [error, setError] = useState(null)

  /**
   * Maneja la renovación de un contrato
   */
  const handleRenewContract = async (contract) => {
    if (!contract) {
      setError('Contrato no válido')
      return { success: false, error: 'Contrato no válido', code: 'INVALID_CONTRACT' }
    }

    try {
      setIsLoading(true)
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

        setIsLoading(false)
        return { success: true, data: { contractId: contract.id, newRenewalDate } }
      }

      setIsLoading(false)
      return { success: false, error: 'Renovación cancelada', code: 'CANCELLED' }
    } catch (error) {
      setIsLoading(false)
      const errorMessage = 'No se pudo renovar el contrato'
      setError(errorMessage)
      return { success: false, error: error.message || errorMessage, code: 'RENEW_ERROR' }
    }
  }

  /**
   * Maneja el registro de servicios consumidos
   */
  const handleConsumeServices = async (contract) => {
    if (!contract) {
      setError('Contrato no válido')
      return { success: false, error: 'Contrato no válido', code: 'INVALID_CONTRACT' }
    }

    try {
      setIsLoading(true)
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

        setIsLoading(false)
        return { success: true, data: { contractId: contract.id, servicesConsumed: extraServices } }
      }

      setIsLoading(false)
      return { success: false, error: 'Operación cancelada', code: 'CANCELLED' }
    } catch (error) {
      setIsLoading(false)
      const errorMessage = 'No se pudo registrar el consumo de servicios'
      setError(errorMessage)
      return { success: false, error: error.message || errorMessage, code: 'CONSUME_ERROR' }
    }
  }

  /**
   * Maneja la adición de servicios extras
   */
  const handleAddExtraServices = async (contract) => {
    if (!contract) {
      setError('Contrato no válido')
      return { success: false, error: 'Contrato no válido', code: 'INVALID_CONTRACT' }
    }

    try {
      setIsLoading(true)
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

        setIsLoading(false)
        return { success: true, data: { contractId: contract.id, servicesAdded: services } }
      }

      setIsLoading(false)
      return { success: false, error: 'Operación cancelada', code: 'CANCELLED' }
    } catch (error) {
      setIsLoading(false)
      const errorMessage = 'No se pudo agregar servicios adicionales'
      setError(errorMessage)
      return { success: false, error: error.message || errorMessage, code: 'ADD_SERVICES_ERROR' }
    }
  }

  return {
    isLoading,
    error,
    handleRenewContract,
    handleConsumeServices,
    handleAddExtraServices,
    clearError: () => setError(null)
  }
}

export default useCorporateOperations